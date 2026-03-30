import { Link } from "react-router-dom";
import NJNavbar from "@/components/NJNavbar";
import { ArrowLeft, Shield, Calendar, User, Mail, Phone, MapPin, Clock, FileText, Check, Trash2, Pencil, X, ChevronLeft, ChevronRight, Plus, Users, Download, UserPlus, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, startOfDay, isToday, isBefore } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/orenda-logo-purple.png";

const ADMIN_PASSWORD = "orenda2025";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const TIME_LABELS: Record<string, string> = {
  morning: "Morning (9 AM – 3 PM)",
  afternoon: "Afternoon (3 PM – 9 PM)",
  full_day: "Full Day (9 AM – 9 PM)",
};

const TIME_OPTIONS = [
  { value: "morning", label: "Morning", time: "9:00 AM – 3:00 PM" },
  { value: "afternoon", label: "Afternoon", time: "3:00 PM – 9:00 PM" },
];

const VISIT_LABELS: Record<string, string> = {
  quarterly_adhd: "In-Person Scheduled Appointment",
  initial_evaluation: "Initial Evaluation",
  other: "Other",
};

export default function NJBookAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [authenticated, setAuthenticated] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [editMonth, setEditMonth] = useState(new Date());
  const [editDate, setEditDate] = useState<Date | null>(null);
  const [editTimeBlock, setEditTimeBlock] = useState<string>("");
  const [editLocation, setEditLocation] = useState<string>("");

  // Provider availability management state
  const [showAddAvail, setShowAddAvail] = useState(false);
  const [availProviderName, setAvailProviderName] = useState("");
  const [availProviderEmail, setAvailProviderEmail] = useState("");
  const [availLocationId, setAvailLocationId] = useState("");
  const [availDate, setAvailDate] = useState<Date | null>(null);
  const [availStartTime, setAvailStartTime] = useState("09:00");
  const [availEndTime, setAvailEndTime] = useState("15:00");
  const [availDuration, setAvailDuration] = useState(30);
  const [availMonth, setAvailMonth] = useState(new Date());

  // Admin book patient state
  const [showBookPatient, setShowBookPatient] = useState(false);
  const [bookPatientAvailId, setBookPatientAvailId] = useState("");
  const [bookPatientFirstName, setBookPatientFirstName] = useState("");
  const [bookPatientLastName, setBookPatientLastName] = useState("");
  const [bookPatientEmail, setBookPatientEmail] = useState("");
  const [bookPatientPhone, setBookPatientPhone] = useState("");
  const [bookPatientSlotStart, setBookPatientSlotStart] = useState("");
  const [bookPatientSlotEnd, setBookPatientSlotEnd] = useState("");
  const [bookPatientNotes, setBookPatientNotes] = useState("");

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_bookings")
        .select("*")
        .order("booking_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  // Fetch locations
  const { data: locations = [] } = useQuery({
    queryKey: ["admin-locations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("locations").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  // Fetch provider availability
  const { data: providerAvailability = [] } = useQuery({
    queryKey: ["admin-provider-availability"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_office_availability")
        .select("*, locations(name)")
        .order("office_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  // Fetch patient appointments
  const { data: patientAppointments = [] } = useQuery({
    queryKey: ["admin-patient-appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_appointments")
        .select("*, locations(name)")
        .order("appointment_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: true,
  });

  const cancelBooking = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("office_bookings")
        .update({ status: "cancelled" as any })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast({ title: "Booking cancelled" });
    },
  });

  const updateBooking = useMutation({
    mutationFn: async ({ id, date, timeBlock, location }: { id: string; date: string; timeBlock: string; location: string }) => {
      const { error } = await supabase
        .from("office_bookings")
        .update({
          booking_date: date,
          time_block: timeBlock as any,
          office_location: location as any,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      setEditingBooking(null);
      toast({ title: "Booking updated", description: "The reservation has been rescheduled." });
    },
    onError: () => {
      toast({ title: "Update failed", description: "Something went wrong.", variant: "destructive" });
    },
  });

  // Add provider availability
  const addAvailability = useMutation({
    mutationFn: async () => {
      if (!availDate || !availLocationId || !availProviderName || !availProviderEmail) throw new Error("Missing fields");
      const { error } = await supabase.from("provider_office_availability").insert({
        provider_name: availProviderName,
        provider_email: availProviderEmail,
        location_id: availLocationId,
        office_date: format(availDate, "yyyy-MM-dd"),
        start_time: availStartTime,
        end_time: availEndTime,
        appointment_duration_minutes: availDuration,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-provider-availability"] });
      toast({ title: "Availability added", description: "Provider office time has been scheduled." });
      setShowAddAvail(false);
      setAvailProviderName(""); setAvailProviderEmail(""); setAvailLocationId(""); setAvailDate(null);
    },
    onError: () => toast({ title: "Failed to add availability", variant: "destructive" }),
  });

  // Cancel provider availability
  const cancelAvailability = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("provider_office_availability").update({ status: "cancelled" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-provider-availability"] });
      toast({ title: "Availability cancelled" });
    },
  });

  // Admin book patient appointment
  const bookPatient = useMutation({
    mutationFn: async () => {
      if (!bookPatientAvailId || !bookPatientFirstName || !bookPatientLastName || !bookPatientEmail || !bookPatientSlotStart || !bookPatientSlotEnd) throw new Error("Missing fields");
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: bookPatientAvailId,
        p_slot_start: bookPatientSlotStart,
        p_slot_end: bookPatientSlotEnd,
        p_patient_first_name: bookPatientFirstName,
        p_patient_last_name: bookPatientLastName,
        p_patient_email: bookPatientEmail,
        p_patient_phone: bookPatientPhone || undefined,
        p_notes: bookPatientNotes || undefined,
      });
      if (error) throw error;
      const result = data as any;
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-patient-appointments"] });
      toast({ title: "Patient appointment booked", description: `Confirmation: ${data.confirmation_code}` });
      setShowBookPatient(false);
      setBookPatientFirstName(""); setBookPatientLastName(""); setBookPatientEmail(""); setBookPatientPhone(""); setBookPatientSlotStart(""); setBookPatientSlotEnd(""); setBookPatientNotes(""); setBookPatientAvailId("");
    },
    onError: (err: any) => toast({ title: "Booking failed", description: err.message, variant: "destructive" }),
  });

  // Cancel patient appointment
  const cancelPatientAppt = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("patient_appointments").update({ appointment_status: "cancelled" as any }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-patient-appointments"] });
      toast({ title: "Patient appointment cancelled" });
    },
  });

  const formatTime12 = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const openEditModal = (booking: any) => {
    setEditingBooking(booking);
    setEditDate(new Date(booking.booking_date + "T12:00:00"));
    setEditMonth(new Date(booking.booking_date + "T12:00:00"));
    setEditTimeBlock(booking.time_block);
    setEditLocation(booking.office_location);
  };

  const handleSaveEdit = () => {
    if (!editingBooking || !editDate || !editTimeBlock || !editLocation) return;
    updateBooking.mutate({
      id: editingBooking.id,
      date: format(editDate, "yyyy-MM-dd"),
      timeBlock: editTimeBlock,
      location: editLocation,
    });
  };

  // Mini calendar for edit modal
  const editMonthStart = startOfMonth(editMonth);
  const editMonthEnd = endOfMonth(editMonth);
  const editDays = eachDayOfInterval({ start: editMonthStart, end: editMonthEnd });
  const editStartDay = getDay(editMonthStart);
  const today = startOfDay(new Date());


  const confirmed = bookings.filter((b: any) => b.status === "confirmed");
  const cancelled = bookings.filter((b: any) => b.status === "cancelled");
  const upcoming = confirmed.filter((b: any) => new Date(b.booking_date) >= new Date(new Date().toDateString()));
  const past = confirmed.filter((b: any) => new Date(b.booking_date) < new Date(new Date().toDateString()));

  return (
    <div className="min-h-screen bg-background font-body">
      <NJNavbar />

      <section className="py-10 md:py-14" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), white)' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-medium mb-3">Admin Dashboard</p>
                <h1 className="font-display text-3xl md:text-5xl font-light text-foreground">
                  Office <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Reservations</em>
                </h1>
              </div>
              <Link to="/admin-dashboard"
                className="flex items-center gap-2 text-xs text-primary font-semibold tracking-wider uppercase border border-primary/20 rounded-lg px-4 py-2.5 hover:bg-primary/5 transition-colors">
                <LayoutDashboard className="w-3.5 h-3.5" /> Enhanced Dashboard
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: "Upcoming", count: upcoming.length, color: "text-primary" },
              { label: "Past", count: past.length, color: "text-muted-foreground" },
              { label: "Cancelled", count: cancelled.length, color: "text-destructive" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-border/30 p-5">
                <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium mb-1">{s.label}</p>
                <p className={`font-display text-3xl ${s.color}`}>{s.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6 md:px-8 mt-8">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading bookings...</div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No upcoming reservations.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="font-display text-xl text-foreground mb-4">Upcoming Reservations</h2>
              {upcoming.map((booking: any) => (
                <motion.div key={booking.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="bg-white rounded-xl border border-border/30 p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</p>
                        <p className="font-display text-lg text-foreground">{format(new Date(booking.booking_date + 'T12:00:00'), "MMM d, yyyy")}</p>
                        <p className="text-xs text-muted-foreground">{TIME_LABELS[booking.time_block] || booking.time_block}</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-1 flex items-center gap-1"><User className="w-3 h-3" /> Provider</p>
                        <p className="text-sm text-foreground font-medium">{booking.provider_name}</p>
                        <p className="text-xs text-muted-foreground">{booking.provider_email}</p>
                        {booking.provider_phone && <p className="text-xs text-muted-foreground">{booking.provider_phone}</p>}
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                        <p className="text-sm text-foreground capitalize">{booking.office_location}</p>
                        <p className="text-xs text-muted-foreground">{VISIT_LABELS[booking.visit_type] || booking.visit_type}{booking.visit_type_other ? `: ${booking.visit_type_other}` : ""}</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-1 flex items-center gap-1"><FileText className="w-3 h-3" /> Addendum</p>
                        {booking.addendum_signed ? (
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <p className="text-xs text-green-700">Signed by {booking.addendum_signature_name}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-destructive">Not signed</p>
                        )}
                        {booking.addendum_signed_at && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">{format(new Date(booking.addendum_signed_at), "MMM d, yyyy 'at' h:mm a")}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start">
                      <button onClick={() => openEditModal(booking)}
                        className="flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary transition-colors border border-primary/20 rounded-lg px-3 py-2 hover:bg-primary/5">
                        <Pencil className="w-3 h-3" /> Reschedule
                      </button>
                      <button onClick={() => cancelBooking.mutate(booking.id)}
                        className="flex items-center gap-1.5 text-xs text-destructive/70 hover:text-destructive transition-colors border border-destructive/20 rounded-lg px-3 py-2 hover:bg-destructive/5">
                        <Trash2 className="w-3 h-3" /> Cancel
                      </button>
                    </div>
                  </div>
                  {booking.notes && (
                    <div className="mt-3 pt-3 border-t border-border/20">
                      <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Notes:</span> {booking.notes}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {past.length > 0 && (
            <div className="mt-10">
              <h2 className="font-display text-xl text-foreground/50 mb-4">Past Reservations</h2>
              <div className="space-y-3 opacity-60">
                {past.map((booking: any) => (
                  <div key={booking.id} className="bg-white rounded-xl border border-border/20 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <p className="font-display text-sm text-foreground">{format(new Date(booking.booking_date + 'T12:00:00'), "MMM d, yyyy")}</p>
                      <p className="text-sm text-muted-foreground">{booking.provider_name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{booking.office_location}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{TIME_LABELS[booking.time_block] || booking.time_block}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Provider Availability Section */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-foreground">Provider Office Availability</h2>
            <button onClick={() => setShowAddAvail(!showAddAvail)}
              className="flex items-center gap-1.5 text-xs text-primary font-semibold tracking-wider uppercase border border-primary/20 rounded-lg px-4 py-2.5 hover:bg-primary/5 transition-colors">
              <Plus className="w-3 h-3" /> Add Availability
            </button>
          </div>

          {/* Add Availability Form */}
          <AnimatePresence>
            {showAddAvail && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6">
                <div className="bg-white rounded-xl border border-border/30 p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">Provider Name</label>
                      <input type="text" value={availProviderName} onChange={e => setAvailProviderName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border/30 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" placeholder="Dr. Jane Smith" />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">Provider Email</label>
                      <input type="email" value={availProviderEmail} onChange={e => setAvailProviderEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border/30 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" placeholder="provider@orenda.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">Office Location</label>
                    <div className="flex gap-2">
                      {locations.map(loc => (
                        <button key={loc.id} onClick={() => setAvailLocationId(loc.id)}
                          className={`px-4 py-2.5 rounded-lg border text-sm transition-all ${availLocationId === loc.id ? "border-primary bg-primary/5 text-foreground font-medium" : "border-border/30 text-muted-foreground hover:border-primary/30"}`}>
                          <MapPin className="w-3 h-3 inline mr-1.5" />{loc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">Date</label>
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
                          const isPast = isBefore(day, startOfDay(new Date())) && !isToday(day);
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
                      <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">Start Time</label>
                      <select value={availStartTime} onChange={e => setAvailStartTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border/30 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/30">
                        {["09:00","10:00","11:00","12:00","13:00","14:00","15:00"].map(t => <option key={t} value={t}>{formatTime12(t)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">End Time</label>
                      <select value={availEndTime} onChange={e => setAvailEndTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border/30 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/30">
                        {["12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"].map(t => <option key={t} value={t}>{formatTime12(t)}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">Slot Duration (min)</label>
                      <select value={availDuration} onChange={e => setAvailDuration(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border border-border/30 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/30">
                        {[15,20,30,45,60].map(d => <option key={d} value={d}>{d} minutes</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => addAvailability.mutate()} disabled={addAvailability.isPending || !availDate || !availLocationId || !availProviderName || !availProviderEmail}
                      className="bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40">
                      {addAvailability.isPending ? "Adding..." : "Add Availability"}
                    </button>
                    <button onClick={() => setShowAddAvail(false)} className="text-muted-foreground text-sm px-4 py-3 hover:text-foreground transition-colors">Cancel</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Availability List */}
          {providerAvailability.filter((a: any) => a.status === "active").length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border border-border/20">
              <Calendar className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No provider availability scheduled.</p>
              <p className="text-muted-foreground text-xs mt-1">Add availability above to enable patient scheduling.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {providerAvailability.filter((a: any) => a.status === "active").map((avail: any) => (
                <div key={avail.id} className="bg-white rounded-xl border border-border/30 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-wrap">
                    <div>
                      <p className="font-display text-sm text-foreground">{format(new Date(avail.office_date + "T12:00:00"), "MMM d, yyyy")}</p>
                      <p className="text-xs text-muted-foreground">{formatTime12(avail.start_time)} – {formatTime12(avail.end_time)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground font-medium">{avail.provider_name}</p>
                      <p className="text-xs text-muted-foreground">{avail.provider_email}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" /> {(avail.locations as any)?.name || "—"}
                    </div>
                    <span className="text-xs text-muted-foreground">{avail.appointment_duration_minutes}min slots</span>
                  </div>
                  <button onClick={() => cancelAvailability.mutate(avail.id)}
                    className="flex items-center gap-1.5 text-xs text-destructive/70 hover:text-destructive transition-colors border border-destructive/20 rounded-lg px-3 py-2 hover:bg-destructive/5">
                    <X className="w-3 h-3" /> Cancel
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Patient Appointments Section */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="font-display text-xl text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Patient Appointments
            </h2>
            <div className="flex gap-2">
              <button onClick={() => setShowBookPatient(!showBookPatient)}
                className="flex items-center gap-1.5 text-xs text-primary font-semibold tracking-wider uppercase border border-primary/20 rounded-lg px-4 py-2.5 hover:bg-primary/5 transition-colors">
                <UserPlus className="w-3 h-3" /> Book for Patient
              </button>
              {patientAppointments.length > 0 && (
                <button
                  onClick={() => {
                    const rows = patientAppointments.map((appt: any) => ({
                      Date: appt.appointment_date,
                      "Start Time": appt.slot_start,
                      "End Time": appt.slot_end,
                      "First Name": appt.patient_first_name,
                      "Last Name": appt.patient_last_name,
                      Email: appt.patient_email,
                      Phone: appt.patient_phone || "",
                      Provider: appt.provider_name,
                      Location: (appt.locations as any)?.name || "",
                      Status: appt.appointment_status,
                      "Confirmation Code": appt.confirmation_code,
                      Notes: appt.notes || "",
                    }));
                    const headers = Object.keys(rows[0]);
                    const csv = [
                      headers.join(","),
                      ...rows.map((r: any) =>
                        headers.map(h => `"${String(r[h]).replace(/"/g, '""')}"`).join(",")
                      ),
                    ].join("\n");
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `patient-appointments-${format(new Date(), "yyyy-MM-dd")}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-1.5 text-xs text-primary font-semibold tracking-wider uppercase border border-primary/20 rounded-lg px-4 py-2.5 hover:bg-primary/5 transition-colors"
                >
                  <Download className="w-3 h-3" /> Export CSV
                </button>
              )}
            </div>
          </div>

          {/* Admin Book Patient Form */}
          <AnimatePresence>
            {showBookPatient && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6">
                <div className="bg-white rounded-xl border border-border/30 p-6 space-y-4">
                  <h3 className="font-display text-lg text-foreground flex items-center gap-2"><UserPlus className="w-4 h-4 text-primary" /> Book Appointment for Patient</h3>
                  <div>
                    <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">Select Provider Availability</label>
                    <select value={bookPatientAvailId} onChange={e => {
                      setBookPatientAvailId(e.target.value);
                      setBookPatientSlotStart(""); setBookPatientSlotEnd("");
                    }}
                      className="w-full px-4 py-3 rounded-lg border border-border/30 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/30">
                      <option value="">Choose availability...</option>
                      {providerAvailability.filter((a: any) => a.status === "active" && new Date(a.office_date + "T23:59:59") >= new Date()).map((a: any) => (
                        <option key={a.id} value={a.id}>
                          {format(new Date(a.office_date + "T12:00:00"), "MMM d, yyyy")} · {a.provider_name} · {(a.locations as any)?.name || "—"} · {formatTime12(a.start_time)}–{formatTime12(a.end_time)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {bookPatientAvailId && (() => {
                    const avail = providerAvailability.find((a: any) => a.id === bookPatientAvailId) as any;
                    if (!avail) return null;
                    const slots: { start: string; end: string }[] = [];
                    const [sh, sm] = avail.start_time.split(":").map(Number);
                    const [eh] = avail.end_time.split(":").map(Number);
                    let cur = sh * 60 + sm;
                    const endMin = eh * 60;
                    while (cur + avail.appointment_duration_minutes <= endMin) {
                      const s = `${String(Math.floor(cur / 60)).padStart(2, "0")}:${String(cur % 60).padStart(2, "0")}`;
                      const e = `${String(Math.floor((cur + avail.appointment_duration_minutes) / 60)).padStart(2, "0")}:${String((cur + avail.appointment_duration_minutes) % 60).padStart(2, "0")}`;
                      slots.push({ start: s, end: e });
                      cur += avail.appointment_duration_minutes;
                    }
                    return (
                      <div>
                        <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">Time Slot</label>
                        <div className="flex flex-wrap gap-2">
                          {slots.map(sl => (
                            <button key={sl.start} onClick={() => { setBookPatientSlotStart(sl.start); setBookPatientSlotEnd(sl.end); }}
                              className={`px-3 py-2 rounded-lg border text-xs transition-all ${bookPatientSlotStart === sl.start ? "border-primary bg-primary/5 text-foreground font-medium" : "border-border/30 text-muted-foreground hover:border-primary/30"}`}>
                              {formatTime12(sl.start)} – {formatTime12(sl.end)}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">First Name</label>
                      <input type="text" value={bookPatientFirstName} onChange={e => setBookPatientFirstName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border/30 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" placeholder="Jane" />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">Last Name</label>
                      <input type="text" value={bookPatientLastName} onChange={e => setBookPatientLastName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border/30 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">Email</label>
                      <input type="email" value={bookPatientEmail} onChange={e => setBookPatientEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border/30 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" placeholder="patient@email.com" />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">Phone (Optional)</label>
                      <input type="tel" value={bookPatientPhone} onChange={e => setBookPatientPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-border/30 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" placeholder="(555) 123-4567" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">Notes (Optional)</label>
                    <textarea value={bookPatientNotes} onChange={e => setBookPatientNotes(e.target.value)} rows={2}
                      className="w-full px-4 py-3 rounded-lg border border-border/30 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none" placeholder="Any special notes..." />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => bookPatient.mutate()}
                      disabled={bookPatient.isPending || !bookPatientAvailId || !bookPatientSlotStart || !bookPatientFirstName || !bookPatientLastName || !bookPatientEmail}
                      className="bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40">
                      {bookPatient.isPending ? "Booking..." : "Book Appointment"}
                    </button>
                    <button onClick={() => setShowBookPatient(false)} className="text-muted-foreground text-sm px-4 py-3 hover:text-foreground transition-colors">Cancel</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {patientAppointments.filter((a: any) => a.appointment_status !== "cancelled").length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border border-border/20">
              <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No patient appointments yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {patientAppointments.filter((a: any) => a.appointment_status !== "cancelled").map((appt: any) => (
                <div key={appt.id} className="bg-white rounded-xl border border-border/30 p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Date & Time</p>
                        <p className="font-display text-base text-foreground">{format(new Date(appt.appointment_date + "T12:00:00"), "MMM d, yyyy")}</p>
                        <p className="text-xs text-muted-foreground">{formatTime12(appt.slot_start)} – {formatTime12(appt.slot_end)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-1 flex items-center gap-1"><User className="w-3 h-3" /> Patient</p>
                        <p className="text-sm text-foreground font-medium">{appt.patient_first_name} {appt.patient_last_name}</p>
                        <p className="text-xs text-muted-foreground">{appt.patient_email}</p>
                        {appt.patient_phone && <p className="text-xs text-muted-foreground">{appt.patient_phone}</p>}
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                        <p className="text-sm text-foreground">{(appt.locations as any)?.name || "—"}</p>
                        <p className="text-xs text-muted-foreground">Provider: {appt.provider_name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-1 flex items-center gap-1"><FileText className="w-3 h-3" /> Status</p>
                        <span className={`inline-block text-xs font-medium px-2 py-1 rounded ${appt.appointment_status === "booked" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                          {appt.appointment_status}
                        </span>
                        <p className="text-[10px] text-muted-foreground mt-1 font-mono">{appt.confirmation_code}</p>
                      </div>
                    </div>
                    <button onClick={() => cancelPatientAppt.mutate(appt.id)}
                      className="flex items-center gap-1.5 text-xs text-destructive/70 hover:text-destructive transition-colors border border-destructive/20 rounded-lg px-3 py-2 hover:bg-destructive/5 self-start">
                      <Trash2 className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Edit/Reschedule Modal */}
      <AnimatePresence>
        {editingBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={() => setEditingBooking(null)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setEditingBooking(null)} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-foreground" />
              </button>

              <div className="px-8 pt-8 pb-4 border-b border-border/20" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), white)' }}>
                <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-medium mb-2">Admin Action</p>
                <h3 className="font-display text-2xl text-foreground font-light">
                  Reschedule <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Booking</em>
                </h3>
                <p className="text-muted-foreground text-sm mt-2">
                  {editingBooking.provider_name} · Currently {format(new Date(editingBooking.booking_date + 'T12:00:00'), "MMM d, yyyy")}
                </p>
              </div>

              <div className="px-8 py-6 space-y-6">
                {/* Mini Calendar */}
                <div>
                  <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-3 block">New Date</label>
                  <div className="bg-secondary/30 rounded-xl border border-border/20 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-display text-lg text-foreground">{format(editMonth, "MMMM yyyy")}</h4>
                      <div className="flex gap-1.5">
                        <button onClick={() => setEditMonth(subMonths(editMonth, 1))} className="w-8 h-8 rounded-lg bg-white hover:bg-secondary flex items-center justify-center transition-colors border border-border/20">
                          <ChevronLeft className="w-4 h-4 text-foreground" />
                        </button>
                        <button onClick={() => setEditMonth(addMonths(editMonth, 1))} className="w-8 h-8 rounded-lg bg-white hover:bg-secondary flex items-center justify-center transition-colors border border-border/20">
                          <ChevronRight className="w-4 h-4 text-foreground" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <div key={i} className="text-center text-[10px] text-muted-foreground font-medium py-1">{d}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: editStartDay }).map((_, i) => <div key={`e-${i}`} />)}
                      {editDays.map(day => {
                        const isPast = isBefore(day, today) && !isToday(day);
                        const isSelected = editDate && isSameDay(day, editDate);
                        return (
                          <button
                            key={day.toISOString()}
                            disabled={isPast}
                            onClick={() => setEditDate(day)}
                            className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm transition-all
                              ${isPast ? "text-muted-foreground/30 cursor-not-allowed" : "hover:bg-primary/10 cursor-pointer"}
                              ${isSelected ? "bg-primary text-primary-foreground font-semibold" : "text-foreground"}
                              ${isToday(day) && !isSelected ? "bg-primary/10 text-primary font-bold" : ""}
                            `}
                          >
                            {format(day, "d")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Time Block */}
                <div>
                  <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">Time Block</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_OPTIONS.map(t => (
                      <button key={t.value} onClick={() => setEditTimeBlock(t.value)}
                        className={`px-4 py-3 rounded-lg border text-sm transition-all text-left ${editTimeBlock === t.value ? "border-primary bg-primary/5 text-foreground font-medium" : "border-border/30 text-muted-foreground hover:border-primary/30"}`}>
                        <span className="block font-medium">{t.label}</span>
                        <span className="text-xs text-muted-foreground">{t.time}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground font-medium mb-2 block">Office Location</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["hoboken", "edison"] as const).map(loc => (
                      <button key={loc} onClick={() => setEditLocation(loc)}
                        className={`px-4 py-3 rounded-lg border text-sm capitalize transition-all ${editLocation === loc ? "border-primary bg-primary/5 text-foreground font-medium" : "border-border/30 text-muted-foreground hover:border-primary/30"}`}>
                        <MapPin className="w-3 h-3 inline mr-1.5" />{loc}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSaveEdit}
                  disabled={!editDate || !editTimeBlock || !editLocation || updateBooking.isPending}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-body text-sm font-semibold px-6 py-3.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {updateBooking.isPending ? "Saving..." : "Save Changes"}
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.footer variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="border-t border-border/30 py-10" style={{ background: 'linear-gradient(180deg, hsl(270,15%,95%) 0%, white 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <Link to="/nj-office/hoboken" className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <img src={logo} alt="Orenda" className="h-5 opacity-30" />
        </div>
      </motion.footer>
    </div>
  );
}
