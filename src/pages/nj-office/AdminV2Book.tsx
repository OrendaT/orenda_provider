import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useRef } from "react";
import {
  ArrowLeft, CalendarPlus, Upload, ArrowRight,
  User, Clock, Loader2, Check, ChevronDown, Download, CheckCircle2, X,
  Trash2, MapPin, Calendar, FileText, Users, AlertTriangle,
  ChevronLeft, ChevronRight, Mail, Plus, Info
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, startOfDay, isToday, isBefore } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

function formatTime12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

const TIME_LABELS: Record<string, string> = {
  morning: "Morning (9 AM – 3 PM)",
  afternoon: "Afternoon (3 PM – 9 PM)",
  full_day: "Full Day (9 AM – 9 PM)",
};

const VISIT_LABELS: Record<string, string> = {
  quarterly_adhd: "In-Person Scheduled Appointment",
  initial_evaluation: "Initial Evaluation",
  other: "Other",
};

const SCHEDULE_TEMPLATE_COLUMNS = [
  "Provider Name", "Provider Email", "Office Date (YYYY-MM-DD)",
  "Start Time (HH:MM)", "End Time (HH:MM)", "Location (Hoboken/Edison)",
  "Appointment Duration (minutes)", "Slot Capacity",
];
const SCHEDULE_SAMPLE_ROWS = [
  ["Tim Ichniowski", "tim@orenda.com", "2026-04-01", "09:00", "15:00", "Hoboken", "30", "1"],
  ["Ted Schimenti", "ted@orenda.com", "2026-04-01", "10:00", "18:00", "Edison", "30", "1"],
];
function generateScheduleCSV(): string {
  const header = SCHEDULE_TEMPLATE_COLUMNS.join(",");
  const rows = SCHEDULE_SAMPLE_ROWS.map(r => r.map(cell => `"${cell}"`).join(","));
  return [header, ...rows].join("\n");
}
function downloadScheduleTemplate() {
  const csv = generateScheduleCSV();
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "schedule-import-template.csv"; a.click();
  URL.revokeObjectURL(url);
}
function parseScheduleCSV(text: string) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const parseLine = (line: string): string[] => {
    const values: string[] = []; let current = ""; let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { if (inQ && i + 1 < line.length && line[i + 1] === '"') { current += '"'; i++; } else inQ = !inQ; }
      else if (ch === ',' && !inQ) { values.push(current.trim()); current = ""; }
      else current += ch;
    }
    values.push(current.trim()); return values;
  };
  const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim());
  const findCol = (kw: string[]) => headers.findIndex(h => kw.some(k => h.includes(k)));
  const nameIdx = findCol(["provider name", "name"]);
  const emailIdx = findCol(["email"]);
  const dateIdx = findCol(["date"]);
  const startIdx = findCol(["start"]);
  const endIdx = findCol(["end"]);
  const locIdx = findCol(["location"]);
  const durIdx = findCol(["duration"]);
  const capIdx = findCol(["capacity"]);
  if (nameIdx === -1 || dateIdx === -1) return [];
  return lines.slice(1).map(line => {
    const cols = parseLine(line);
      const get = (idx: number) => (idx >= 0 && idx < cols.length ? cols[idx] : "");
    // Normalize location: handle common misspellings
    const rawLoc = get(locIdx).trim();
    let normalizedLoc = rawLoc || "Hoboken";
    const locLower = normalizedLoc.toLowerCase();
    if (locLower.includes("edis") || locLower.includes("ediso")) normalizedLoc = "Edison";
    else if (locLower.includes("hobo") || locLower.includes("hobk")) normalizedLoc = "Hoboken";
    return {
      provider_name: get(nameIdx), provider_email: get(emailIdx) || "unknown@orenda.com",
      office_date: get(dateIdx), start_time: get(startIdx) || "09:00",
      end_time: get(endIdx) || "17:00", location: normalizedLoc,
      duration: parseInt(get(durIdx)) || 30, capacity: parseInt(get(capIdx)) || 1,
    };
  }).filter(r => r.provider_name && r.office_date);
}

export default function AdminV2Book() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Add provider availability state
  const [showAddAvail, setShowAddAvail] = useState(false);
  const [availProviderName, setAvailProviderName] = useState("");
  const [availProviderEmail, setAvailProviderEmail] = useState("");
  const [availLocationId, setAvailLocationId] = useState("");
  const [availDate, setAvailDate] = useState<Date | null>(null);
  const [availStartTime, setAvailStartTime] = useState("09:00");
  const [availEndTime, setAvailEndTime] = useState("15:00");
  const [availDuration, setAvailDuration] = useState(30);
  const [availMonth, setAvailMonth] = useState(new Date());

  // Edit booking modal state
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [editMonth, setEditMonth] = useState(new Date());
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [editTimeBlock, setEditTimeBlock] = useState("");
  const [editLocation, setEditLocation] = useState("");

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);

  // Inline notes editing
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [editingNotesValue, setEditingNotesValue] = useState("");

  // Schedule CSV import
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  const [scheduleParsed, setScheduleParsed] = useState<any[]>([]);
  const [scheduleImporting, setScheduleImporting] = useState(false);
  const scheduleFileRef = useRef<HTMLInputElement>(null);
  const [scheduleConflicts, setScheduleConflicts] = useState<any[]>([]);
  const [showOverrideConfirm, setShowOverrideConfirm] = useState(false);


  const handleScheduleFile = (file: File) => {
    setScheduleFile(file);
    const reader = new FileReader();
    reader.onload = (e) => { setScheduleParsed(parseScheduleCSV(e.target?.result as string)); };
    reader.readAsText(file);
  };

  const checkConflictsAndImport = async () => {
    if (scheduleParsed.length === 0) return;
    setScheduleImporting(true);
    try {
      const { data: locs } = await supabase.from("locations").select("id, name");
      const locMap: Record<string, string> = {};
      (locs || []).forEach((l: any) => { locMap[l.name.toLowerCase()] = l.id; });

      const dates = [...new Set(scheduleParsed.map(r => r.office_date))];
      const { data: existing } = await supabase.from("provider_office_availability")
        .select("*").in("office_date", dates).eq("status", "active");

      const conflicts = (existing || []).filter(ex =>
        scheduleParsed.some(row =>
          row.office_date === ex.office_date &&
          row.provider_name.toLowerCase() === ex.provider_name.toLowerCase()
        )
      );

      if (conflicts.length > 0) {
        setScheduleConflicts(conflicts);
        setShowOverrideConfirm(true);
        setScheduleImporting(false);
        return;
      }

      await executeImport(locMap);
    } catch (err: any) {
      toast({ title: "Import failed", description: err.message, variant: "destructive" });
      setScheduleImporting(false);
    }
  };

  const executeImport = async (locMap?: Record<string, string>) => {
    setScheduleImporting(true);
    setShowOverrideConfirm(false);
    try {
      if (!locMap) {
        const { data: locs } = await supabase.from("locations").select("id, name");
        locMap = {};
        (locs || []).forEach((l: any) => { locMap![l.name.toLowerCase()] = l.id; });
      }

      // Delete conflicting entries first
      if (scheduleConflicts.length > 0) {
        const conflictIds = scheduleConflicts.map(c => c.id);
        await supabase.from("provider_office_availability").delete().in("id", conflictIds);
      }

      const rows = scheduleParsed.map(row => {
        const locKey = row.location.toLowerCase().trim();
        // Try exact match, then partial match (e.g. "edision" -> "edison")
        let locationId = locMap![locKey];
        if (!locationId) {
          const locKeys = Object.keys(locMap!);
          const fuzzyMatch = locKeys.find(k => k.includes(locKey) || locKey.includes(k));
          locationId = fuzzyMatch ? locMap![fuzzyMatch] : undefined;
        }
        if (!locationId) {
          // Log the mismatch for debugging, default to first available
          console.warn(`Location "${row.location}" not found in DB. Available: ${Object.keys(locMap!).join(", ")}`);
          locationId = Object.values(locMap!)[0];
        }
        return {
          provider_name: row.provider_name, provider_email: row.provider_email,
          office_date: row.office_date, start_time: row.start_time, end_time: row.end_time,
          location_id: locationId,
          appointment_duration_minutes: row.duration, slot_capacity: row.capacity, status: "active",
        };
      });
      const { error } = await supabase.from("provider_office_availability").insert(rows);
      if (error) throw error;
      toast({ title: "Schedule imported!", description: `${rows.length} availability entries added.${scheduleConflicts.length > 0 ? ` ${scheduleConflicts.length} conflicts overridden.` : ""}` });
      invalidateAllBookingQueries();
      setScheduleFile(null); setScheduleParsed([]); setScheduleConflicts([]);
    } catch (err: any) {
      toast({ title: "Import failed", description: err.message, variant: "destructive" });
    } finally { setScheduleImporting(false); }
  };

  // Queries
  const { data: bookings = [] } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("office_bookings").select("*").order("booking_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["admin-locations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("locations").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: providerAvailability = [] } = useQuery({
    queryKey: ["admin-provider-availability"],
    queryFn: async () => {
      const { data, error } = await supabase.from("provider_office_availability").select("*, locations(name)").order("office_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Cross-page invalidation helper — ensures all sections stay in sync
  const invalidateAllBookingQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    queryClient.invalidateQueries({ queryKey: ["office-bookings"] });
    queryClient.invalidateQueries({ queryKey: ["staffing-bookings"] });
    queryClient.invalidateQueries({ queryKey: ["admin-provider-availability"] });
    queryClient.invalidateQueries({ queryKey: ["provider-availability-all"] });
  };

  // Mutations
  const cancelBooking = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("office_bookings").update({ status: "cancelled" as any }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidateAllBookingQueries(); toast({ title: "Booking cancelled" }); },
  });

  const deleteBooking = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("office_bookings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidateAllBookingQueries(); toast({ title: "Booking deleted" }); setDeleteConfirm(null); },
  });

  const updateBooking = useMutation({
    mutationFn: async ({ id, date, timeBlock, location }: { id: string; date: string; timeBlock: string; location: string }) => {
      const { error } = await supabase.from("office_bookings").update({ booking_date: date, time_block: timeBlock as any, office_location: location as any }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidateAllBookingQueries(); setEditingBooking(null); toast({ title: "Booking updated" }); },
  });

  const toggleAgreement = useMutation({
    mutationFn: async ({ id, signed, sigName }: { id: string; signed: boolean; sigName: string | null }) => {
      const { error } = await supabase.from("office_bookings").update({
        addendum_signed: signed,
        addendum_signature_name: signed ? (sigName || "Admin") : null,
        addendum_signed_at: signed ? new Date().toISOString() : null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidateAllBookingQueries(); toast({ title: "Agreement status updated" }); },
  });

  const updateNotes = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase.from("office_bookings").update({ notes }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidateAllBookingQueries(); setEditingNotesId(null); toast({ title: "Notes saved" }); },
  });

  const addAvailability = useMutation({
    mutationFn: async () => {
      if (!availDate || !availLocationId || !availProviderName || !availProviderEmail) throw new Error("Missing fields");
      const dateStr = format(availDate, "yyyy-MM-dd");

      // Check for existing bookings at the same location + date with overlapping times
      const { data: existing } = await supabase
        .from("provider_office_availability")
        .select("id, provider_name, start_time, end_time")
        .eq("location_id", availLocationId)
        .eq("office_date", dateStr)
        .eq("status", "active");

      const hasConflict = (existing || []).some((ex: any) => {
        // Check time overlap: new start < existing end AND new end > existing start
        return availStartTime < ex.end_time && availEndTime > ex.start_time;
      });

      if (hasConflict) {
        const conflictNames = (existing || [])
          .filter((ex: any) => availStartTime < ex.end_time && availEndTime > ex.start_time)
          .map((ex: any) => ex.provider_name)
          .join(", ");
        const locationName = locations.find((l: any) => l.id === availLocationId)?.name || "this location";
        throw new Error(`Double booking prevented: ${conflictNames} already booked at ${locationName} on ${dateStr} during overlapping hours.`);
      }

      const { error } = await supabase.from("provider_office_availability").insert({
        provider_name: availProviderName, provider_email: availProviderEmail,
        location_id: availLocationId, office_date: dateStr,
        start_time: availStartTime, end_time: availEndTime, appointment_duration_minutes: availDuration,
      });
      if (error) throw error;

      const locationName = locations.find((l: any) => l.id === availLocationId)?.name || "Office";
      const formattedDate = format(availDate, "MMMM d, yyyy");
      const idempotencyKey = `agreement-${availProviderEmail}-${dateStr}-${availLocationId}`;
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "office-agreement-request",
          recipientEmail: availProviderEmail,
          idempotencyKey,
          templateData: {
            providerName: availProviderName,
            officeDate: formattedDate,
            location: locationName.toLowerCase(),
            startTime: formatTime12(availStartTime),
            endTime: formatTime12(availEndTime),
          },
        },
      });
    },
    onSuccess: () => {
      invalidateAllBookingQueries();
      toast({ title: "Availability added", description: "The office agreement email has been automatically sent to the provider for signature." });
      setShowAddAvail(false);
      setAvailProviderName(""); setAvailProviderEmail(""); setAvailLocationId(""); setAvailDate(null);
    },
  });

  const cancelAvailability = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("provider_office_availability").update({ status: "cancelled" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidateAllBookingQueries(); toast({ title: "Availability cancelled" }); },
  });

  const deleteAvailability = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("provider_office_availability").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidateAllBookingQueries(); toast({ title: "Availability deleted" }); setDeleteConfirm(null); },
  });

  const openEditModal = (booking: any) => {
    setEditingBooking(booking);
    setEditDate(new Date(booking.booking_date + "T12:00:00"));
    setEditMonth(new Date(booking.booking_date + "T12:00:00"));
    setEditTimeBlock(booking.time_block);
    setEditLocation(booking.office_location);
  };

  const handleSaveEdit = () => {
    if (!editingBooking || !editDate || !editTimeBlock || !editLocation) return;
    updateBooking.mutate({ id: editingBooking.id, date: format(editDate, "yyyy-MM-dd"), timeBlock: editTimeBlock, location: editLocation });
  };

  const editMonthStart = startOfMonth(editMonth);
  const editMonthEnd = endOfMonth(editMonth);
  const editDays = eachDayOfInterval({ start: editMonthStart, end: editMonthEnd });
  const editStartDay = getDay(editMonthStart);
  const today = startOfDay(new Date());

  const confirmed = bookings.filter((b: any) => b.status === "confirmed");
  const upcoming = confirmed.filter((b: any) => new Date(b.booking_date) >= new Date(new Date().toDateString()));

  const TIME_OPTIONS = [
    { value: "morning", label: "Morning", time: "9:00 AM – 3:00 PM" },
    { value: "afternoon", label: "Afternoon", time: "3:00 PM – 9:00 PM" },
  ];


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 12%) 0%, hsl(270, 80%, 25%) 50%, hsl(270, 60%, 40%) 100%)' }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-book" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-book)" />
        </svg>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <Link to="/admin-v2" className="inline-flex items-center gap-2 text-xs text-white/50 font-bold uppercase tracking-wider hover:text-white/80 transition-colors mb-4 sm:mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Console
          </Link>
          <h1 className="font-display text-2xl sm:text-5xl font-bold text-white tracking-tight">Book</h1>
          <p className="text-sm sm:text-base text-white/60 mt-1 sm:mt-2 font-medium">Manage provider scheduling and office calendar.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">

        {/* Add Provider to Calendar */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="rounded-2xl border-2 border-border bg-card p-4 sm:p-7">
          <div className="flex items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, hsl(270, 80%, 25%) 0%, hsl(270, 60%, 50%) 100%)' }}>
                <Plus className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h2 className="font-display text-lg sm:text-2xl font-bold text-foreground">Add Provider to Calendar</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Manually add a provider's office availability.</p>
              </div>
            </div>
            <button onClick={() => setShowAddAvail(!showAddAvail)}
              className="flex items-center gap-1.5 text-sm text-primary font-bold border-2 border-primary/20 rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 hover:bg-primary/5 transition-colors shrink-0">
              {showAddAvail ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span className="hidden sm:inline">{showAddAvail ? "Close" : "Add"}</span>
            </button>
          </div>

          {/* Agreement Notice */}
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Office Agreement — Auto-Sent</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                When you add a provider to the calendar, the office agreement will be <strong>automatically emailed</strong> to
                them for signature. The agreement cannot be signed on their behalf.
              </p>
            </div>
          </div>

          <AnimatePresence>
            {showAddAvail && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="border-2 border-primary/10 rounded-xl p-6 space-y-4 bg-background">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-2 block">Provider Name *</label>
                      <input type="text" value={availProviderName} onChange={e => setAvailProviderName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40" placeholder="Dr. Jane Smith" />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-2 block">Provider Email *</label>
                      <input type="email" value={availProviderEmail} onChange={e => setAvailProviderEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40" placeholder="provider@orenda.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-2 block">Office Location *</label>
                    <div className="flex gap-2">
                      {locations.map(loc => (
                        <button key={loc.id} onClick={() => setAvailLocationId(loc.id)}
                          className={`px-4 py-2.5 rounded-xl border-2 text-sm transition-all ${availLocationId === loc.id ? "border-primary bg-primary/10 text-foreground font-bold" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                          <MapPin className="w-3 h-3 inline mr-1.5" />{loc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-2 block">Date *</label>
                    <div className="bg-secondary/30 rounded-xl border border-border/20 p-4 max-w-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-display text-base text-foreground">{format(availMonth, "MMMM yyyy")}</h4>
                        <div className="flex gap-1">
                          <button onClick={() => setAvailMonth(subMonths(availMonth, 1))} className="w-7 h-7 rounded-lg bg-white hover:bg-secondary flex items-center justify-center border border-border/20"><ChevronLeft className="w-3 h-3" /></button>
                          <button onClick={() => setAvailMonth(addMonths(availMonth, 1))} className="w-7 h-7 rounded-lg bg-white hover:bg-secondary flex items-center justify-center border border-border/20"><ChevronRight className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 mb-1">
                        {["S","M","T","W","T","F","S"].map((d,i) => <div key={i} className="text-center text-[10px] text-muted-foreground font-medium py-1">{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: getDay(startOfMonth(availMonth)) }).map((_,i) => <div key={`ae-${i}`} />)}
                        {eachDayOfInterval({ start: startOfMonth(availMonth), end: endOfMonth(availMonth) }).map(day => {
                          const isPast = isBefore(day, today) && !isToday(day);
                          const isSelected = availDate && isSameDay(day, availDate);
                          return (
                            <button key={day.toISOString()} disabled={isPast} onClick={() => setAvailDate(day)}
                              className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs transition-all ${isPast ? "text-muted-foreground/30 cursor-not-allowed" : "hover:bg-primary/10 cursor-pointer"} ${isSelected ? "bg-primary text-primary-foreground font-semibold" : "text-foreground"}`}>
                              {format(day, "d")}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-2 block">Start Time</label>
                      <select value={availStartTime} onChange={e => setAvailStartTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                        {["09:00","10:00","11:00","12:00","13:00","14:00","15:00"].map(t => <option key={t} value={t}>{formatTime12(t)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-2 block">End Time</label>
                      <select value={availEndTime} onChange={e => setAvailEndTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                        {["12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"].map(t => <option key={t} value={t}>{formatTime12(t)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-2 block">Slot Duration</label>
                      <select value={availDuration} onChange={e => setAvailDuration(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                        {[15,20,30,45,60].map(d => <option key={d} value={d}>{d} min</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Agreement reminder inline */}
                  <div className="flex items-center gap-2 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-xs text-primary font-medium">
                      The office agreement will be automatically emailed to <strong>{availProviderEmail || "the provider"}</strong> for signature.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => addAvailability.mutate()} disabled={addAvailability.isPending || !availDate || !availLocationId || !availProviderName || !availProviderEmail}
                      className="flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl text-white transition-all disabled:opacity-40 hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 40%) 100%)' }}>
                      {addAvailability.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      {addAvailability.isPending ? "Adding..." : "Add to Calendar"}
                    </button>
                    <button onClick={() => setShowAddAvail(false)} className="text-sm font-semibold text-muted-foreground px-5 py-2.5 rounded-xl hover:text-foreground transition-colors">Cancel</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Schedule CSV Import */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
          className="rounded-2xl border-2 border-border bg-card p-4 sm:p-7">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, hsl(270, 80%, 25%) 0%, hsl(270, 60%, 50%) 100%)' }}>
              <CalendarPlus className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-lg sm:text-2xl font-bold text-foreground">Import Schedule (CSV)</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Upload provider availability from a CSV template.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <button onClick={downloadScheduleTemplate}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-bold py-2.5 px-5 rounded-xl hover:bg-primary/20 transition-colors">
              <Download className="w-4 h-4" /> Download CSV Template
            </button>
            <div className="flex flex-wrap gap-1.5 items-center">
              {SCHEDULE_TEMPLATE_COLUMNS.map(col => (
                <span key={col} className="text-[10px] bg-secondary border border-border rounded-lg px-2 py-0.5 text-muted-foreground font-medium">{col}</span>
              ))}
            </div>
          </div>
          {!scheduleFile ? (
            <div onClick={() => scheduleFileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 hover:bg-secondary/20 transition-all">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-foreground font-semibold text-sm">Drop your schedule CSV here or click to browse</p>
              <input ref={scheduleFileRef} type="file" accept=".csv" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleScheduleFile(e.target.files[0]); }} />
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 bg-secondary/30 rounded-xl px-4 py-3 mb-4">
                <CalendarPlus className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground flex-1 truncate">{scheduleFile.name}</span>
                <CheckCircle2 className="w-4 h-4 text-[hsl(160,60%,35%)]" />
                <button onClick={() => { setScheduleFile(null); setScheduleParsed([]); }} className="p-1 hover:bg-secondary rounded-lg"><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              {scheduleParsed.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-foreground mb-2">{scheduleParsed.length} schedule entries found</p>
                  <div className="max-h-48 overflow-y-auto border border-border rounded-xl mb-4">
                    <table className="w-full text-xs">
                      <thead><tr className="bg-secondary/50 border-b border-border">
                        <th className="text-left px-3 py-2 font-bold text-foreground">Provider</th>
                        <th className="text-left px-3 py-2 font-bold text-foreground">Date</th>
                        <th className="text-left px-3 py-2 font-bold text-foreground">Time</th>
                        <th className="text-left px-3 py-2 font-bold text-foreground">Location</th>
                      </tr></thead>
                      <tbody>
                        {scheduleParsed.map((row, i) => (
                          <tr key={i} className="border-b border-border last:border-0">
                            <td className="px-3 py-2 text-foreground font-medium">{row.provider_name}</td>
                            <td className="px-3 py-2 text-muted-foreground">{row.office_date}</td>
                            <td className="px-3 py-2 text-muted-foreground">{row.start_time}–{row.end_time}</td>
                            <td className="px-3 py-2 text-muted-foreground">{row.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button onClick={checkConflictsAndImport} disabled={scheduleImporting}
                    className="bg-primary text-primary-foreground text-sm font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
                    {scheduleImporting ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Importing...</> : <><CheckCircle2 className="w-4 h-4" /> Import Schedule</>}
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>

      </div>

      {/* Edit/Reschedule Modal */}
      <AnimatePresence>
        {editingBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setEditingBooking(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <button onClick={() => setEditingBooking(null)} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center"><X className="w-4 h-4 text-foreground" /></button>
              <div className="px-8 pt-8 pb-4 border-b border-border/20" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), white)' }}>
                <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-medium mb-2">Admin Action</p>
                <h3 className="font-display text-2xl text-foreground">Reschedule Booking</h3>
                <p className="text-sm text-muted-foreground mt-1">{editingBooking.provider_name}</p>
              </div>
              <div className="px-8 py-6 space-y-5">
                {/* Date picker */}
                <div>
                  <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-3 block">New Date</label>
                  <div className="bg-secondary/30 rounded-xl border border-border/20 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-display text-base text-foreground">{format(editMonth, "MMMM yyyy")}</h4>
                      <div className="flex gap-1">
                        <button onClick={() => setEditMonth(subMonths(editMonth, 1))} className="w-7 h-7 rounded-lg bg-white hover:bg-secondary flex items-center justify-center border border-border/20"><ChevronLeft className="w-3 h-3" /></button>
                        <button onClick={() => setEditMonth(addMonths(editMonth, 1))} className="w-7 h-7 rounded-lg bg-white hover:bg-secondary flex items-center justify-center border border-border/20"><ChevronRight className="w-3 h-3" /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {["S","M","T","W","T","F","S"].map((d,i) => <div key={i} className="text-center text-[10px] text-muted-foreground font-medium py-1">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: editStartDay }).map((_,i) => <div key={`ee-${i}`} />)}
                      {editDays.map(day => {
                        const isPast = isBefore(day, today) && !isToday(day);
                        const isSelected = editDate && isSameDay(day, editDate);
                        return (
                          <button key={day.toISOString()} disabled={isPast} onClick={() => setEditDate(day)}
                            className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs transition-all ${isPast ? "text-muted-foreground/30 cursor-not-allowed" : "hover:bg-primary/10 cursor-pointer"} ${isSelected ? "bg-primary text-primary-foreground font-semibold" : "text-foreground"}`}>
                            {format(day, "d")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* Time block */}
                <div>
                  <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-3 block">Time Block</label>
                  <div className="flex gap-2">
                    {TIME_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => setEditTimeBlock(opt.value)}
                        className={`flex-1 px-3 py-3 rounded-xl border-2 text-center text-sm transition-all ${editTimeBlock === opt.value ? "border-primary bg-primary/10 text-foreground font-bold" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                        <p className="font-semibold">{opt.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{opt.time}</p>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Location */}
                <div>
                  <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-3 block">Location</label>
                  <div className="flex gap-2">
                    {["hoboken", "edison"].map(loc => (
                      <button key={loc} onClick={() => setEditLocation(loc)}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm capitalize transition-all ${editLocation === loc ? "border-primary bg-primary/10 text-foreground font-bold" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                        <MapPin className="w-3 h-3 inline mr-1.5" />{loc}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSaveEdit} disabled={updateBooking.isPending || !editDate || !editTimeBlock || !editLocation}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl text-white transition-all disabled:opacity-40 hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 40%) 100%)' }}>
                    {updateBooking.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {updateBooking.isPending ? "Saving..." : "Save Changes"}
                  </button>
                  <button onClick={() => setEditingBooking(null)} className="text-sm font-semibold text-muted-foreground px-5 py-2.5 rounded-xl hover:text-foreground transition-colors">Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl text-center"
              onClick={e => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">Delete permanently?</h3>
              <p className="text-sm text-muted-foreground mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 text-sm font-semibold text-muted-foreground py-3 rounded-xl border-2 border-border hover:bg-secondary/50 transition-colors">Cancel</button>
                <button onClick={() => {
                  if (deleteConfirm.type === "booking") deleteBooking.mutate(deleteConfirm.id);
                  else if (deleteConfirm.type === "availability") deleteAvailability.mutate(deleteConfirm.id);
                }}
                  className="flex-1 text-sm font-bold text-white py-3 rounded-xl bg-destructive hover:bg-destructive/90 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Override Confirmation Modal */}
      <AnimatePresence>
        {showOverrideConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowOverrideConfirm(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-display text-xl text-foreground text-center mb-2">Schedule Conflicts Found</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {scheduleConflicts.length} existing availability record{scheduleConflicts.length !== 1 ? "s" : ""} will be overridden:
              </p>
              <div className="max-h-40 overflow-y-auto border border-border rounded-xl mb-5">
                {scheduleConflicts.map((c: any, i: number) => (
                  <div key={i} className={`px-4 py-2 text-xs flex justify-between ${i > 0 ? "border-t border-border" : ""}`}>
                    <span className="font-medium text-foreground">{c.provider_name}</span>
                    <span className="text-muted-foreground">{c.office_date}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowOverrideConfirm(false); setScheduleConflicts([]); }}
                  className="flex-1 text-sm font-semibold text-muted-foreground py-3 rounded-xl border-2 border-border hover:bg-secondary/50 transition-colors">Cancel</button>
                <button onClick={() => executeImport()} disabled={scheduleImporting}
                  className="flex-1 text-sm font-bold text-white py-3 rounded-xl bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  {scheduleImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Override & Import
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
