import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, FileSpreadsheet, MapPin, Check, X, AlertCircle, Calendar, User, Clock, Loader2, ChevronDown, RefreshCw, Plus, Minus, ArrowRight, Equal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parse } from "date-fns";
import * as XLSX from "xlsx-js-style";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ParsedAppointment {
  dateOfService: Date;
  dateStr: string;
  timeStr: string;
  clientFullName: string;
  clientFirstName: string;
  clientLastName: string;
  clinician: string;
  billingCode: string;
  durationMinutes: number;
  slotStart: string;
  slotEnd: string;
  location: "hoboken" | "edison" | "virtual";
}

interface ProviderDateGroup {
  provider: string;
  date: string;
  dateLabel: string;
  appointments: ParsedAppointment[];
  location: "hoboken" | "edison" | "virtual";
}

interface ExistingAppointment {
  id: string;
  provider_name: string;
  appointment_date: string;
  slot_start: string;
  slot_end: string;
  patient_first_name: string;
  patient_last_name: string;
  appointment_status: string;
  confirmation_code: string;
  notes: string | null;
  location_id: string;
}

type ChangeType = "new" | "unchanged" | "removed";

interface DiffItem {
  type: ChangeType;
  parsed?: ParsedAppointment;
  existing?: ExistingAppointment;
  selected: boolean;
}

const LOCATION_OPTIONS = [
  { value: "hoboken" as const, label: "Hoboken, NJ", icon: "🏢" },
  { value: "edison" as const, label: "Edison, NJ", icon: "🏢" },
  { value: "virtual" as const, label: "Virtual Appointment", icon: "💻" },
];

function getDurationFromBillingCode(code: string): number {
  if (!code) return 30;
  const lower = code.toLowerCase();
  if (lower.includes("intake")) return 60;
  const match = lower.match(/f\/u\s*(\d+)/i) || lower.match(/(\d+)/);
  if (match) {
    const num = parseInt(match[1]);
    if ([15, 20, 30, 40, 45, 60, 90].includes(num)) return num;
  }
  return 30;
}

function parseExcelDateTime(value: any): { date: Date; timeStr: string } | null {
  if (!value) return null;
  if (value instanceof Date) {
    return { date: value, timeStr: format(value, "HH:mm") };
  }
  if (typeof value === "string") {
    const str = value.trim();
    const formats = [
      "MM/dd/yyyy HH:mm",
      "M/d/yyyy HH:mm",
      "MM/dd/yyyy h:mm a",
      "M/d/yyyy h:mm a",
      "yyyy-MM-dd HH:mm",
    ];
    for (const fmt of formats) {
      try {
        const parsed = parse(str, fmt, new Date());
        if (!isNaN(parsed.getTime())) {
          return { date: parsed, timeStr: format(parsed, "HH:mm") };
        }
      } catch {}
    }
  }
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    if (date) {
      const jsDate = new Date(date.y, date.m - 1, date.d, date.H || 0, date.M || 0, date.S || 0);
      return { date: jsDate, timeStr: format(jsDate, "HH:mm") };
    }
  }
  return null;
}

function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function formatTime12(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

// Normalize for matching
function matchKey(provider: string, date: string, slotStart: string, firstName: string, lastName: string): string {
  return `${provider.toLowerCase().trim()}|${date}|${slotStart}|${firstName.toLowerCase().trim()}|${lastName.toLowerCase().trim()}`;
}

export default function BulkAppointmentUpload() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showReview, setShowReview] = useState(false);
  const [showDiffView, setShowDiffView] = useState(false);
  const [parsedAppointments, setParsedAppointments] = useState<ParsedAppointment[]>([]);
  const [diffItems, setDiffItems] = useState<DiffItem[]>([]);
  const [globalLocation, setGlobalLocation] = useState<"hoboken" | "edison" | "virtual">("hoboken");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [importMode, setImportMode] = useState<"fresh" | "sync">("fresh");

  const parseFile = useCallback((file: File): Promise<ParsedAppointment[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = new Uint8Array(ev.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array", cellDates: true });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, dateNF: "MM/dd/yyyy HH:mm" });

          let headerIdx = -1;
          for (let i = 0; i < Math.min(rows.length, 10); i++) {
            const row = rows[i];
            if (row && row.some((c: any) => typeof c === "string" && c.toLowerCase().includes("date of service"))) {
              headerIdx = i;
              break;
            }
          }

          if (headerIdx === -1) {
            reject(new Error("Could not find 'Date of Service' column header."));
            return;
          }

          const headers = (rows[headerIdx] as string[]).map((h: any) => (h || "").toString().toLowerCase().trim());
          const dateCol = headers.findIndex(h => h.includes("date of service"));
          const clientCol = headers.findIndex(h => h.includes("client"));
          const clinicianCol = headers.findIndex(h => h.includes("clinician"));
          const billingCol = headers.findIndex(h => h.includes("billing"));

          if (dateCol === -1 || clientCol === -1 || clinicianCol === -1) {
            reject(new Error("Missing required columns: Date of Service, Client, and Clinician."));
            return;
          }

          const appointments: ParsedAppointment[] = [];

          for (let i = headerIdx + 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || !row[dateCol]) continue;

            const parsed = parseExcelDateTime(row[dateCol]);
            if (!parsed) continue;

            const clientName = (row[clientCol] || "").toString().trim();
            const clinician = (row[clinicianCol] || "").toString().trim();
            const billingCode = billingCol >= 0 ? (row[billingCol] || "").toString().trim().split("\n")[0] : "";

            if (!clientName || !clinician) continue;

            const { first, last } = splitName(clientName);
            const duration = getDurationFromBillingCode(billingCode);
            const slotEnd = addMinutesToTime(parsed.timeStr, duration);

            appointments.push({
              dateOfService: parsed.date,
              dateStr: format(parsed.date, "yyyy-MM-dd"),
              timeStr: parsed.timeStr,
              clientFullName: clientName,
              clientFirstName: first,
              clientLastName: last,
              clinician,
              billingCode,
              durationMinutes: duration,
              slotStart: parsed.timeStr,
              slotEnd,
              location: globalLocation,
            });
          }

          resolve(appointments);
        } catch (err: any) {
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, [globalLocation]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setParseError(null);

    try {
      const appointments = await parseFile(file);
      if (appointments.length === 0) {
        setParseError("No valid appointments found in the file.");
        return;
      }
      setParsedAppointments(appointments);

      // Check if there are existing appointments for these dates to offer sync
      const dates = [...new Set(appointments.map(a => a.dateStr))];
      const providers = [...new Set(appointments.map(a => a.clinician))];

      const { data: existingCount } = await supabase
        .from("patient_appointments")
        .select("id", { count: "exact", head: true })
        .in("appointment_date", dates)
        .in("provider_name", providers)
        .neq("appointment_status", "cancelled");

      if (existingCount && (existingCount as any).length > 0) {
        // There might be existing records — we'll check more precisely later
      }

      // Check if any existing appointments match the date range
      const { count } = await supabase
        .from("patient_appointments")
        .select("*", { count: "exact", head: true })
        .in("appointment_date", dates)
        .neq("appointment_status", "cancelled");

      if (count && count > 0) {
        setImportMode("sync");
      } else {
        setImportMode("fresh");
      }

      setShowReview(true);
    } catch (err: any) {
      setParseError(`Error parsing file: ${err.message}`);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [parseFile]);

  // Compare parsed appointments with existing DB records
  const runComparison = async () => {
    setIsComparing(true);
    try {
      const dates = [...new Set(parsedAppointments.map(a => a.dateStr))];
      const providers = [...new Set(parsedAppointments.map(a => a.clinician))];

      // Fetch all existing appointments for these dates and providers
      const { data: existingAppts, error } = await supabase
        .from("patient_appointments")
        .select("id, provider_name, appointment_date, slot_start, slot_end, patient_first_name, patient_last_name, appointment_status, confirmation_code, notes, location_id")
        .in("appointment_date", dates)
        .in("provider_name", providers)
        .neq("appointment_status", "cancelled");

      if (error) throw error;

      const existing = (existingAppts || []) as ExistingAppointment[];

      // Build match maps
      const existingMap = new Map<string, ExistingAppointment>();
      existing.forEach(e => {
        // slot_start from DB is like "11:45:00", normalize to "11:45"
        const slotNorm = e.slot_start.substring(0, 5);
        const key = matchKey(e.provider_name, e.appointment_date, slotNorm, e.patient_first_name, e.patient_last_name);
        existingMap.set(key, e);
      });

      const parsedMap = new Map<string, ParsedAppointment>();
      parsedAppointments.forEach(p => {
        const key = matchKey(p.clinician, p.dateStr, p.slotStart, p.clientFirstName, p.clientLastName);
        parsedMap.set(key, p);
      });

      const diff: DiffItem[] = [];
      const matchedExistingKeys = new Set<string>();

      // Check each parsed appointment
      parsedAppointments.forEach(p => {
        const key = matchKey(p.clinician, p.dateStr, p.slotStart, p.clientFirstName, p.clientLastName);
        const existingMatch = existingMap.get(key);
        if (existingMatch) {
          matchedExistingKeys.add(key);
          diff.push({ type: "unchanged", parsed: p, existing: existingMatch, selected: false });
        } else {
          diff.push({ type: "new", parsed: p, selected: true });
        }
      });

      // Check for removed (in DB but not in new file)
      existing.forEach(e => {
        const slotNorm = e.slot_start.substring(0, 5);
        const key = matchKey(e.provider_name, e.appointment_date, slotNorm, e.patient_first_name, e.patient_last_name);
        if (!matchedExistingKeys.has(key)) {
          diff.push({ type: "removed", existing: e, selected: true });
        }
      });

      // Sort: new first, then removed, then unchanged
      diff.sort((a, b) => {
        const order = { new: 0, removed: 1, unchanged: 2 };
        return order[a.type] - order[b.type];
      });

      setDiffItems(diff);
      setShowReview(false);
      setShowDiffView(true);
    } catch (err: any) {
      toast({ title: "Comparison failed", description: err.message, variant: "destructive" });
    } finally {
      setIsComparing(false);
    }
  };

  const toggleDiffItem = (idx: number) => {
    setDiffItems(prev => prev.map((item, i) => i === idx ? { ...item, selected: !item.selected } : item));
  };

  const toggleAllByType = (type: ChangeType, selected: boolean) => {
    setDiffItems(prev => prev.map(item => item.type === type ? { ...item, selected } : item));
  };

  // Group appointments by provider + date
  const groupedAppointments: ProviderDateGroup[] = (() => {
    const map = new Map<string, ProviderDateGroup>();
    parsedAppointments.forEach(appt => {
      const key = `${appt.clinician}__${appt.dateStr}`;
      if (!map.has(key)) {
        map.set(key, {
          provider: appt.clinician,
          date: appt.dateStr,
          dateLabel: format(appt.dateOfService, "EEEE, MMMM d, yyyy"),
          appointments: [],
          location: appt.location,
        });
      }
      map.get(key)!.appointments.push(appt);
    });
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date)).map(g => ({
      ...g,
      appointments: g.appointments.sort((a, b) => a.slotStart.localeCompare(b.slotStart)),
    }));
  })();

  const updateAllLocations = (loc: "hoboken" | "edison" | "virtual") => {
    setGlobalLocation(loc);
    setParsedAppointments(prev => prev.map(a => ({ ...a, location: loc })));
  };

  const updateGroupLocation = (provider: string, date: string, loc: "hoboken" | "edison" | "virtual") => {
    setParsedAppointments(prev => prev.map(a =>
      a.clinician === provider && a.dateStr === date ? { ...a, location: loc } : a
    ));
  };

  const updateSingleLocation = (idx: number, loc: "hoboken" | "edison" | "virtual") => {
    setParsedAppointments(prev => prev.map((a, i) => i === idx ? { ...a, location: loc } : a));
  };

  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const removeAppointment = (idx: number) => {
    setParsedAppointments(prev => prev.filter((_, i) => i !== idx));
  };

  // Apply sync changes (add new, cancel removed)
  const handleSyncConfirm = async () => {
    setIsConfirming(true);
    try {
      const toAdd = diffItems.filter(d => d.type === "new" && d.selected && d.parsed);
      const toRemove = diffItems.filter(d => d.type === "removed" && d.selected && d.existing);

      const errors: string[] = [];
      let addedCount = 0;
      let removedCount = 0;

      // Fetch locations
      const { data: locs } = await supabase.from("locations").select("id, name").eq("active", true);
      const locationMap: Record<string, string> = {};
      locs?.forEach(l => { locationMap[l.name.toLowerCase()] = l.id; });

      // Cancel removed appointments
      for (const item of toRemove) {
        const { error } = await supabase
          .from("patient_appointments")
          .update({ appointment_status: "cancelled" as any })
          .eq("id", item.existing!.id);

        if (error) {
          errors.push(`Failed to cancel "${item.existing!.patient_first_name} ${item.existing!.patient_last_name}": ${error.message}`);
        } else {
          removedCount++;
        }
      }

      // Add new appointments
      if (toAdd.length > 0) {
        // Create availability records for new appointments
        const providerDates = new Map<string, { provider: string; date: string; minStart: string; maxEnd: string; location: string }>();

        toAdd.forEach(item => {
          const appt = item.parsed!;
          if (appt.location === "virtual") return;
          const key = `${appt.clinician}__${appt.dateStr}`;
          if (!providerDates.has(key)) {
            providerDates.set(key, {
              provider: appt.clinician,
              date: appt.dateStr,
              minStart: appt.slotStart,
              maxEnd: appt.slotEnd,
              location: appt.location,
            });
          } else {
            const existing = providerDates.get(key)!;
            if (appt.slotStart < existing.minStart) existing.minStart = appt.slotStart;
            if (appt.slotEnd > existing.maxEnd) existing.maxEnd = appt.slotEnd;
            existing.location = appt.location;
          }
        });

        const availabilityIds = new Map<string, string>();

        for (const [key, pd] of providerDates.entries()) {
          const locId = locationMap[pd.location];
          if (!locId) continue;

          const { data: existing } = await supabase
            .from("provider_office_availability")
            .select("id")
            .eq("provider_name", pd.provider)
            .eq("office_date", pd.date)
            .eq("location_id", locId)
            .eq("status", "active")
            .limit(1);

          if (existing && existing.length > 0) {
            availabilityIds.set(key, existing[0].id);
          } else {
            const { data: newAvail, error } = await supabase
              .from("provider_office_availability")
              .insert({
                provider_name: pd.provider,
                provider_email: `${pd.provider.toLowerCase().replace(/\s+/g, ".")}@orenda.com`,
                location_id: locId,
                office_date: pd.date,
                start_time: pd.minStart,
                end_time: pd.maxEnd,
                appointment_duration_minutes: 30,
                slot_capacity: 10,
                status: "active",
              })
              .select("id")
              .single();

            if (newAvail) availabilityIds.set(key, newAvail.id);
          }
        }

        for (const item of toAdd) {
          const appt = item.parsed!;
          const key = `${appt.clinician}__${appt.dateStr}`;
          let availId = availabilityIds.get(key);
          const locId = locationMap[appt.location] || locationMap["hoboken"];

          if (!availId && locId) {
            const { data: fallbackAvail } = await supabase
              .from("provider_office_availability")
              .insert({
                provider_name: appt.clinician,
                provider_email: `${appt.clinician.toLowerCase().replace(/\s+/g, ".")}@orenda.com`,
                location_id: locId,
                office_date: appt.dateStr,
                start_time: appt.slotStart,
                end_time: appt.slotEnd,
                appointment_duration_minutes: appt.durationMinutes,
                slot_capacity: 10,
                status: "active",
              })
              .select("id")
              .single();
            if (fallbackAvail) {
              availId = fallbackAvail.id;
              availabilityIds.set(key, availId);
            }
          }

          if (!availId || !locId) {
            errors.push(`"${appt.clientFullName}" on ${appt.dateStr} ${formatTime12(appt.slotStart)}: Missing availability or location`);
            continue;
          }

          const confirmCode = "ORN-" + Math.random().toString(36).substring(2, 8).toUpperCase();
          const { error } = await supabase.from("patient_appointments").insert({
            provider_availability_id: availId,
            location_id: locId,
            provider_name: appt.clinician,
            slot_start: appt.slotStart,
            slot_end: appt.slotEnd,
            appointment_date: appt.dateStr,
            patient_first_name: appt.clientFirstName,
            patient_last_name: appt.clientLastName,
            patient_email: "",
            confirmation_code: confirmCode,
            booking_source: "excel_import",
            appointment_status: "booked",
            notes: appt.billingCode ? `Billing: ${appt.billingCode}` : undefined,
          });

          if (error) {
            errors.push(`"${appt.clientFullName}" on ${appt.dateStr} ${formatTime12(appt.slotStart)}: ${error.message}`);
          } else {
            addedCount++;
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-provider-availability"] });
      queryClient.invalidateQueries({ queryKey: ["admin-patient-appointments"] });

      if (errors.length > 0) {
        setImportErrors(errors);
        setShowErrorAlert(true);
      }

      const parts = [];
      if (addedCount > 0) parts.push(`${addedCount} added`);
      if (removedCount > 0) parts.push(`${removedCount} cancelled`);
      const unchanged = diffItems.filter(d => d.type === "unchanged").length;
      if (unchanged > 0) parts.push(`${unchanged} unchanged`);

      toast({
        title: errors.length > 0 ? "Sync Completed with Errors" : "Sync Complete",
        description: parts.join(", ") + ".",
        variant: errors.length > 0 ? "destructive" : "default",
      });

      setShowDiffView(false);
      setDiffItems([]);
      setParsedAppointments([]);
    } catch (err: any) {
      toast({ title: "Sync failed", description: err.message, variant: "destructive" });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      const { data: locs } = await supabase.from("locations").select("id, name").eq("active", true);
      const locationMap: Record<string, string> = {};
      locs?.forEach(l => { locationMap[l.name.toLowerCase()] = l.id; });

      const providerDates = new Map<string, { provider: string; date: string; minStart: string; maxEnd: string; location: string }>();

      parsedAppointments.forEach(appt => {
        if (appt.location === "virtual") return;
        const key = `${appt.clinician}__${appt.dateStr}`;
        if (!providerDates.has(key)) {
          providerDates.set(key, {
            provider: appt.clinician,
            date: appt.dateStr,
            minStart: appt.slotStart,
            maxEnd: appt.slotEnd,
            location: appt.location,
          });
        } else {
          const existing = providerDates.get(key)!;
          if (appt.slotStart < existing.minStart) existing.minStart = appt.slotStart;
          if (appt.slotEnd > existing.maxEnd) existing.maxEnd = appt.slotEnd;
          existing.location = appt.location;
        }
      });

      const availabilityIds = new Map<string, string>();

      for (const [key, pd] of providerDates.entries()) {
        const locId = locationMap[pd.location];
        if (!locId) continue;

        const { data: existing } = await supabase
          .from("provider_office_availability")
          .select("id")
          .eq("provider_name", pd.provider)
          .eq("office_date", pd.date)
          .eq("location_id", locId)
          .eq("status", "active")
          .limit(1);

        if (existing && existing.length > 0) {
          availabilityIds.set(key, existing[0].id);
        } else {
          const { data: newAvail, error } = await supabase
            .from("provider_office_availability")
            .insert({
              provider_name: pd.provider,
              provider_email: `${pd.provider.toLowerCase().replace(/\s+/g, ".")}@orenda.com`,
              location_id: locId,
              office_date: pd.date,
              start_time: pd.minStart,
              end_time: pd.maxEnd,
              appointment_duration_minutes: 30,
              slot_capacity: 1,
              status: "active",
            })
            .select("id")
            .single();

          if (error) {
            console.error("Error creating availability:", error);
            continue;
          }
          if (newAvail) availabilityIds.set(key, newAvail.id);
        }
      }

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const appt of parsedAppointments) {
        const key = `${appt.clinician}__${appt.dateStr}`;
        const availId = availabilityIds.get(key);
        const locId = locationMap[appt.location] || locationMap["hoboken"];

        if (!availId || !locId) {
          if (!availId && locId) {
            const { data: fallbackAvail, error: fallbackErr } = await supabase
              .from("provider_office_availability")
              .insert({
                provider_name: appt.clinician,
                provider_email: `${appt.clinician.toLowerCase().replace(/\s+/g, ".")}@orenda.com`,
                location_id: locId,
                office_date: appt.dateStr,
                start_time: appt.slotStart,
                end_time: appt.slotEnd,
                appointment_duration_minutes: appt.durationMinutes,
                slot_capacity: 10,
                status: "active",
              })
              .select("id")
              .single();

            if (fallbackAvail) {
              availabilityIds.set(key, fallbackAvail.id);
            } else {
              errors.push(`Provider "${appt.clinician}" on ${appt.dateStr}: Failed to create availability – ${fallbackErr?.message || "Unknown error"}`);
              errorCount++;
              continue;
            }
          } else if (!locId) {
            errors.push(`"${appt.clientFullName}" on ${appt.dateStr} ${formatTime12(appt.slotStart)}: Location "${appt.location}" not found in database`);
            errorCount++;
            continue;
          }
        }

        const finalAvailId = availabilityIds.get(key)!;
        const confirmCode = "ORN-" + Math.random().toString(36).substring(2, 8).toUpperCase();

        const { error } = await supabase.from("patient_appointments").insert({
          provider_availability_id: finalAvailId,
          location_id: locId,
          provider_name: appt.clinician,
          slot_start: appt.slotStart,
          slot_end: appt.slotEnd,
          appointment_date: appt.dateStr,
          patient_first_name: appt.clientFirstName,
          patient_last_name: appt.clientLastName,
          patient_email: "",
          confirmation_code: confirmCode,
          booking_source: "excel_import",
          appointment_status: "booked",
          notes: appt.billingCode ? `Billing: ${appt.billingCode}` : undefined,
        });

        if (error) {
          errors.push(`"${appt.clientFullName}" on ${appt.dateStr} ${formatTime12(appt.slotStart)}: ${error.message}`);
          errorCount++;
        } else {
          successCount++;
        }
      }

      // Also create office_bookings for providers if in-person
      const bookedProviders = new Set<string>();
      for (const [key, pd] of providerDates.entries()) {
        const bookKey = `${pd.provider}__${pd.date}__${pd.location}`;
        if (bookedProviders.has(bookKey)) continue;
        bookedProviders.add(bookKey);

        const [sh] = pd.minStart.split(":").map(Number);
        const [eh] = pd.maxEnd.split(":").map(Number);
        let timeBlock: "morning" | "afternoon" | "full_day" = "morning";
        if (sh < 15 && eh > 15) timeBlock = "full_day";
        else if (sh >= 15) timeBlock = "afternoon";

        const { data: existingBooking } = await supabase
          .from("office_bookings")
          .select("id")
          .eq("provider_name", pd.provider)
          .eq("booking_date", pd.date)
          .eq("office_location", pd.location as any)
          .eq("status", "confirmed")
          .limit(1);

        if (!existingBooking || existingBooking.length === 0) {
          const { error: bookingErr } = await supabase.from("office_bookings").insert({
            provider_name: pd.provider,
            provider_email: `${pd.provider.toLowerCase().replace(/\s+/g, ".")}@orenda.com`,
            booking_date: pd.date,
            office_location: pd.location as any,
            time_block: timeBlock,
            visit_type: "other" as any,
            visit_type_other: "Excel Import",
            status: "confirmed",
          });
          if (bookingErr) {
            errors.push(`Provider booking for "${pd.provider}" on ${pd.date}: ${bookingErr.message}`);
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-provider-availability"] });
      queryClient.invalidateQueries({ queryKey: ["admin-patient-appointments"] });

      if (errors.length > 0) {
        setImportErrors(errors);
        setShowErrorAlert(true);
      }

      toast({
        title: errorCount > 0 ? "Import Completed with Errors" : "Import Complete",
        description: `${successCount} appointment${successCount !== 1 ? "s" : ""} created successfully.${errorCount > 0 ? ` ${errorCount} failed — see details.` : ""}`,
        variant: errorCount > 0 ? "destructive" : "default",
      });

      setShowReview(false);
      setParsedAppointments([]);
    } catch (err: any) {
      toast({ title: "Import failed", description: err.message, variant: "destructive" });
    } finally {
      setIsConfirming(false);
    }
  };

  const uniqueDates = [...new Set(parsedAppointments.map(a => a.dateStr))].sort();
  const uniqueProviders = [...new Set(parsedAppointments.map(a => a.clinician))].sort();

  // Diff stats
  const newCount = diffItems.filter(d => d.type === "new").length;
  const removedCount = diffItems.filter(d => d.type === "removed").length;
  const unchangedCount = diffItems.filter(d => d.type === "unchanged").length;
  const selectedNew = diffItems.filter(d => d.type === "new" && d.selected).length;
  const selectedRemoved = diffItems.filter(d => d.type === "removed" && d.selected).length;

  return (
    <>
      {/* Upload Button */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center gap-2 p-4 sm:p-5 rounded-xl border border-border/30 bg-card hover:border-primary/20 hover:bg-primary/[0.02] transition-all text-center group"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
          <Upload className="w-4.5 h-4.5 text-primary" />
        </div>
        <p className="text-[10px] tracking-[0.1em] uppercase font-bold text-foreground">Import Schedule</p>
      </button>

      {/* Parse Error Toast */}
      {parseError && (
        <Dialog open={!!parseError} onOpenChange={() => setParseError(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" /> Import Error
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">{parseError}</p>
            <button
              onClick={() => setParseError(null)}
              className="w-full mt-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              OK
            </button>
          </DialogContent>
        </Dialog>
      )}

      {/* Review Dialog */}
      <Dialog open={showReview} onOpenChange={(open) => { if (!open && !isConfirming) { setShowReview(false); } }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="shrink-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 40%) 100%)' }}>
                <FileSpreadsheet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-bold">Schedule Import</p>
                <DialogTitle className="font-display text-xl text-foreground font-bold">
                  Review Appointments
                </DialogTitle>
              </div>
            </div>
            {fileName && <p className="text-[10px] text-muted-foreground mt-1">File: {fileName}</p>}
          </DialogHeader>

          {/* Summary strip */}
          <div className="grid grid-cols-3 gap-3 my-3 shrink-0">
            <div className="text-center py-3 rounded-xl border border-border/30 bg-secondary/20">
              <p className="font-display text-2xl font-bold text-foreground">{parsedAppointments.length}</p>
              <p className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Appointments</p>
            </div>
            <div className="text-center py-3 rounded-xl border border-border/30 bg-secondary/20">
              <p className="font-display text-2xl font-bold text-foreground">{uniqueProviders.length}</p>
              <p className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Providers</p>
            </div>
            <div className="text-center py-3 rounded-xl border border-border/30 bg-secondary/20">
              <p className="font-display text-2xl font-bold text-foreground">{uniqueDates.length}</p>
              <p className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Days</p>
            </div>
          </div>

          {/* Sync Mode Banner */}
          {importMode === "sync" && (
            <div className="shrink-0 rounded-xl border-2 border-amber-400/30 bg-amber-50 p-4 mb-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-400/20 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4.5 h-4.5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-amber-900">Existing Appointments Detected</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    There are already appointments in the system for these dates. You can compare changes before importing, or add these as new entries.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={runComparison}
                      disabled={isComparing}
                      className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 40%) 100%)' }}
                    >
                      {isComparing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      {isComparing ? "Comparing..." : "Compare & Sync"}
                    </button>
                    <button
                      onClick={() => setImportMode("fresh")}
                      className="text-xs font-semibold px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-all"
                    >
                      Add as New
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scrollable Appointments List */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            {groupedAppointments.map((group, gi) => (
              <div key={`${group.provider}-${group.date}`} className="rounded-2xl border-2 border-border overflow-hidden bg-white shadow-sm">
                {/* Group Header */}
                <div className="px-5 py-4 border-b border-border flex items-center justify-between"
                  style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 35%) 100%)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-white">{group.provider}</p>
                      <p className="text-xs text-white/80">{group.dateLabel} · {group.appointments.length} appt{group.appointments.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      value={group.appointments[0]?.location || globalLocation}
                      onChange={(e) => updateGroupLocation(group.provider, group.date, e.target.value as any)}
                      className="text-xs font-bold pl-3 pr-8 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none appearance-none cursor-pointer"
                    >
                      {LOCATION_OPTIONS.map(o => (
                        <option key={o.value} value={o.value} className="text-foreground">{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none" />
                  </div>
                </div>

                {/* Appointment rows */}
                <div className="divide-y divide-border/30">
                  {group.appointments.map((appt, ai) => {
                    const globalIdx = parsedAppointments.findIndex(
                      a => a.clinician === appt.clinician && a.dateStr === appt.dateStr && a.slotStart === appt.slotStart && a.clientFullName === appt.clientFullName
                    );
                    return (
                      <div key={ai} className="px-5 py-4 flex items-center gap-4 hover:bg-secondary/10 transition-colors">
                        {/* Time */}
                        <div className="text-center min-w-[70px] py-2 px-2 rounded-xl bg-primary/5 border border-primary/10">
                          <p className="text-sm font-bold text-primary">{formatTime12(appt.slotStart)}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{formatTime12(appt.slotEnd)}</p>
                        </div>
                        <div className="w-px h-10 bg-primary/15" />
                        {/* Patient info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-foreground">{appt.clientFullName}</p>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" /> {appt.durationMinutes} min
                            </span>
                            {appt.billingCode && (
                              <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md font-semibold">
                                {appt.billingCode}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Location dropdown with icon */}
                        <div className="relative">
                          <select
                            value={appt.location}
                            onChange={(e) => updateSingleLocation(globalIdx, e.target.value as any)}
                            className="text-xs font-semibold pl-8 pr-8 py-2.5 rounded-xl border-2 border-border bg-secondary/20 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 cursor-pointer appearance-none min-w-[130px] transition-all hover:border-primary/30 hover:bg-secondary/30"
                          >
                            {LOCATION_OPTIONS.map(o => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                          <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary pointer-events-none" />
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                        <button
                          onClick={() => removeAppointment(globalIdx)}
                          className="shrink-0 w-8 h-8 rounded-xl border border-border/30 flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/30 transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Confirm Bar */}
          <div className="shrink-0 pt-4 border-t border-border/30 flex items-center justify-between gap-3 mt-3">
            <button
              onClick={() => { setShowReview(false); setParsedAppointments([]); }}
              disabled={isConfirming}
              className="text-sm text-muted-foreground font-semibold hover:text-foreground transition-colors px-4 py-2.5"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isConfirming || parsedAppointments.length === 0}
              className="flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl text-white transition-all disabled:opacity-40 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 40%) 100%)' }}
            >
              {isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating Appointments...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Confirm & Create {parsedAppointments.length} Appointment{parsedAppointments.length !== 1 ? "s" : ""}
                </>
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diff/Sync Review Dialog */}
      <Dialog open={showDiffView} onOpenChange={(open) => { if (!open && !isConfirming) { setShowDiffView(false); setDiffItems([]); } }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="shrink-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 40%) 100%)' }}>
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-bold">Schedule Sync</p>
                <DialogTitle className="font-display text-xl text-foreground font-bold">
                  Review Changes
                </DialogTitle>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Compare uploaded schedule against existing appointments. Select which changes to apply.
            </p>
          </DialogHeader>

          {/* Diff Summary Cards */}
          <div className="grid grid-cols-3 gap-3 my-3 shrink-0">
            <div className="text-center py-3 rounded-xl border-2 border-emerald-200 bg-emerald-50">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Plus className="w-4 h-4 text-emerald-600" />
                <p className="font-display text-2xl font-bold text-emerald-700">{newCount}</p>
              </div>
              <p className="text-[9px] uppercase tracking-wider font-bold text-emerald-600">New</p>
            </div>
            <div className="text-center py-3 rounded-xl border-2 border-red-200 bg-red-50">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Minus className="w-4 h-4 text-red-600" />
                <p className="font-display text-2xl font-bold text-red-700">{removedCount}</p>
              </div>
              <p className="text-[9px] uppercase tracking-wider font-bold text-red-600">Removed</p>
            </div>
            <div className="text-center py-3 rounded-xl border-2 border-border bg-secondary/20">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Equal className="w-4 h-4 text-muted-foreground" />
                <p className="font-display text-2xl font-bold text-foreground">{unchangedCount}</p>
              </div>
              <p className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Unchanged</p>
            </div>
          </div>

          {/* Diff List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {/* New Appointments Section */}
            {newCount > 0 && (
              <div className="rounded-xl border-2 border-emerald-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-emerald-600" />
                    <p className="text-sm font-bold text-emerald-800">New Appointments ({newCount})</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedNew === newCount}
                      onChange={(e) => toggleAllByType("new", e.target.checked)}
                      className="w-4 h-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Add All</span>
                  </label>
                </div>
                <div className="divide-y divide-emerald-100">
                  {diffItems.map((item, idx) => {
                    if (item.type !== "new" || !item.parsed) return null;
                    const appt = item.parsed;
                    return (
                      <div key={idx} className={`px-4 py-3 flex items-center gap-3 transition-colors ${item.selected ? 'bg-emerald-50/50' : 'bg-white opacity-50'}`}>
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleDiffItem(idx)}
                          className="w-4 h-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 shrink-0"
                        />
                        <div className="text-center min-w-[55px]">
                          <p className="text-xs font-bold text-foreground">{formatTime12(appt.slotStart)}</p>
                          <p className="text-[9px] text-muted-foreground">{formatTime12(appt.slotEnd)}</p>
                        </div>
                        <div className="w-px h-8 bg-emerald-200" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground">{appt.clientFullName}</p>
                          <p className="text-[10px] text-muted-foreground">{appt.clinician} · {format(appt.dateOfService, "MMM d, yyyy")}</p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full uppercase shrink-0">
                          New
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Removed Appointments Section */}
            {removedCount > 0 && (
              <div className="rounded-xl border-2 border-red-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-red-50 border-b border-red-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Minus className="w-4 h-4 text-red-600" />
                    <p className="text-sm font-bold text-red-800">Removed Appointments ({removedCount})</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRemoved === removedCount}
                      onChange={(e) => toggleAllByType("removed", e.target.checked)}
                      className="w-4 h-4 rounded border-red-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-[10px] font-bold text-red-600 uppercase">Cancel All</span>
                  </label>
                </div>
                <div className="divide-y divide-red-100">
                  {diffItems.map((item, idx) => {
                    if (item.type !== "removed" || !item.existing) return null;
                    const e = item.existing;
                    const slotNorm = e.slot_start.substring(0, 5);
                    return (
                      <div key={idx} className={`px-4 py-3 flex items-center gap-3 transition-colors ${item.selected ? 'bg-red-50/50' : 'bg-white opacity-50'}`}>
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => toggleDiffItem(idx)}
                          className="w-4 h-4 rounded border-red-300 text-red-600 focus:ring-red-500 shrink-0"
                        />
                        <div className="text-center min-w-[55px]">
                          <p className="text-xs font-bold text-foreground">{formatTime12(slotNorm)}</p>
                          <p className="text-[9px] text-muted-foreground">{e.appointment_date}</p>
                        </div>
                        <div className="w-px h-8 bg-red-200" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground">{e.patient_first_name} {e.patient_last_name}</p>
                          <p className="text-[10px] text-muted-foreground">{e.provider_name} · {e.confirmation_code}</p>
                        </div>
                        <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full uppercase shrink-0">
                          Will Cancel
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Unchanged Appointments Section */}
            {unchangedCount > 0 && (
              <div className="rounded-xl border-2 border-border overflow-hidden">
                <div className="px-4 py-2.5 bg-secondary/20 border-b border-border flex items-center gap-2">
                  <Equal className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm font-bold text-foreground">Unchanged ({unchangedCount})</p>
                  <span className="text-[10px] text-muted-foreground ml-auto">No action needed</span>
                </div>
                <div className="divide-y divide-border/50">
                  {diffItems.map((item, idx) => {
                    if (item.type !== "unchanged" || !item.parsed) return null;
                    const appt = item.parsed;
                    return (
                      <div key={idx} className="px-4 py-2.5 flex items-center gap-3 bg-white/50 opacity-60">
                        <div className="w-4 shrink-0" />
                        <div className="text-center min-w-[55px]">
                          <p className="text-xs font-bold text-foreground">{formatTime12(appt.slotStart)}</p>
                        </div>
                        <div className="w-px h-6 bg-border/30" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{appt.clientFullName}</p>
                          <p className="text-[10px] text-muted-foreground">{appt.clinician} · {format(appt.dateOfService, "MMM d")}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground bg-secondary/30 px-2 py-1 rounded-full shrink-0">
                          Unchanged
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No changes */}
            {newCount === 0 && removedCount === 0 && unchangedCount > 0 && (
              <div className="text-center py-8">
                <Check className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <p className="text-lg font-bold text-foreground">Everything is up to date!</p>
                <p className="text-sm text-muted-foreground mt-1">No changes detected between the uploaded file and the current schedule.</p>
              </div>
            )}
          </div>

          {/* Confirm Bar */}
          <div className="shrink-0 pt-4 border-t border-border/30 flex items-center justify-between gap-3 mt-3">
            <button
              onClick={() => { setShowDiffView(false); setDiffItems([]); setShowReview(true); }}
              disabled={isConfirming}
              className="text-sm text-muted-foreground font-semibold hover:text-foreground transition-colors px-4 py-2.5"
            >
              ← Back to Review
            </button>
            <div className="flex items-center gap-3">
              {(selectedNew > 0 || selectedRemoved > 0) && (
                <p className="text-xs text-muted-foreground">
                  {selectedNew > 0 && <span className="text-emerald-600 font-bold">+{selectedNew} add</span>}
                  {selectedNew > 0 && selectedRemoved > 0 && " · "}
                  {selectedRemoved > 0 && <span className="text-red-600 font-bold">-{selectedRemoved} cancel</span>}
                </p>
              )}
              <button
                onClick={handleSyncConfirm}
                disabled={isConfirming || (selectedNew === 0 && selectedRemoved === 0)}
                className="flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl text-white transition-all disabled:opacity-40 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 40%) 100%)' }}
              >
                {isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" /> Apply Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Alert Dialog */}
      <Dialog open={showErrorAlert} onOpenChange={setShowErrorAlert}>
        <DialogContent className="max-w-lg max-h-[70vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive font-display text-lg">
              <AlertCircle className="w-5 h-5" /> Import Errors
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-2">
            The following appointments or provider bookings failed to create:
          </p>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {importErrors.map((err, i) => (
              <div key={i} className="flex items-start gap-2 py-2 px-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <AlertCircle className="w-3.5 h-3.5 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-foreground font-medium">{err}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setShowErrorAlert(false); setImportErrors([]); }}
            className="w-full mt-3 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Dismiss
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
