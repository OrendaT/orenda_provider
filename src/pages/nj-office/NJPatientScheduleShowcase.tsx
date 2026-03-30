import { useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, CheckCircle2, ArrowRight, ArrowLeft, User, Mail, Phone, Loader2, ChevronLeft, ChevronRight, Building2, X } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, startOfDay, isToday, isBefore, addDays } from "date-fns";
import NJNavbar from "@/components/NJNavbar";
import NJFooter from "@/components/NJFooter";
import logo from "@/assets/orenda-logo-purple.png";
import hobokenImg from "@/assets/hoboken-riverfront.png";
import edisonImg from "@/assets/edison-building.jpg";

/* ─── shared data hook ─── */
function useSchedulingData() {
  const { data: locations = [] } = useQuery({
    queryKey: ["scheduling-locations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("locations").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data;
    },
  });

  return { locations };
}

function useAvailability(locationId: string) {
  const { data: availability = [] } = useQuery({
    queryKey: ["provider-availability", locationId],
    queryFn: async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("provider_office_availability")
        .select("*")
        .eq("location_id", locationId)
        .eq("status", "active")
        .gte("office_date", today)
        .order("office_date");
      if (error) throw error;
      return data;
    },
    enabled: !!locationId,
  });

  const { data: existingAppointments = [], refetch } = useQuery({
    queryKey: ["existing-appointments", locationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_appointments")
        .select("id, provider_availability_id, slot_start, location_id, appointment_status")
        .eq("location_id", locationId)
        .neq("appointment_status", "cancelled");
      if (error) throw error;
      return data;
    },
    enabled: !!locationId,
  });

  const availableDates = useMemo(() => availability.map(a => a.office_date), [availability]);

  const getTimeSlots = (date: Date | null) => {
    if (!date) return [];
    const dateStr = format(date, "yyyy-MM-dd");
    const dayAvail = availability.filter(a => a.office_date === dateStr);
    const slots: any[] = [];
    for (const avail of dayAvail) {
      const [startH, startM] = avail.start_time.split(":").map(Number);
      const [endH, endM] = avail.end_time.split(":").map(Number);
      const startMin = startH * 60 + startM;
      const endMin = endH * 60 + endM;
      const dur = avail.appointment_duration_minutes;
      for (let m = startMin; m + dur <= endMin; m += dur) {
        const sH = Math.floor(m / 60), sM = m % 60;
        const eH = Math.floor((m + dur) / 60), eM = (m + dur) % 60;
        const slotStart = `${String(sH).padStart(2, "0")}:${String(sM).padStart(2, "0")}:00`;
        const slotEnd = `${String(eH).padStart(2, "0")}:${String(eM).padStart(2, "0")}:00`;
        const bookedCount = existingAppointments.filter(
          apt => apt.provider_availability_id === avail.id && apt.slot_start === slotStart
        ).length;
        if (bookedCount < avail.slot_capacity) {
          slots.push({ availabilityId: avail.id, providerName: avail.provider_name, startTime: slotStart, endTime: slotEnd, booked: bookedCount, capacity: avail.slot_capacity });
        }
      }
    }
    return slots;
  };

  return { availability, availableDates, existingAppointments, getTimeSlots, refetchAppointments: refetch };
}

const fmt12 = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

/* ═══════════════════════════════════════════════════════════
   VARIATION A — "Vertical Stepper" (Single Column, Elegant)
   ═══════════════════════════════════════════════════════════ */
function VariationA() {
  const { toast } = useToast();
  const { locations } = useSchedulingData();
  const [locId, setLocId] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<any>(null);
  const [step, setStep] = useState<"loc" | "date" | "time" | "info" | "done">("loc");
  const [calMonth, setCalMonth] = useState(new Date());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const { availableDates, getTimeSlots, refetchAppointments } = useAvailability(locId);
  const timeSlots = useMemo(() => getTimeSlots(date), [date, getTimeSlots]);
  const loc = locations.find(l => l.id === locId);

  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const today = startOfDay(new Date());

  const bookMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: slot.availabilityId,
        p_slot_start: slot.startTime,
        p_slot_end: slot.endTime,
        p_patient_first_name: firstName.trim(),
        p_patient_last_name: lastName.trim(),
        p_patient_email: email.trim(),
        p_patient_phone: phone.trim() || undefined,
      });
      if (error) throw error;
      const result = data as any;
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (r) => { setConfirmation(r); setStep("done"); refetchAppointments(); },
    onError: (e: any) => { toast({ title: "Booking failed", description: e.message, variant: "destructive" }); },
  });

  return (
    <div className="max-w-lg mx-auto">
      {/* Header pill */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-5">
          <Calendar className="w-3.5 h-3.5" /> Book a Visit
        </span>
        <h2 className="font-display text-4xl md:text-5xl text-foreground tracking-tight">
          Schedule Your <br /><em className="text-primary" style={{ fontStyle: "italic" }}>Appointment</em>
        </h2>
      </div>

      {/* Vertical step indicators */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {["Location", "Date", "Time", "Details"].map((label, i) => {
          const steps = ["loc", "date", "time", "info"] as const;
          const active = steps.indexOf(step as any) >= i || step === "done";
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{i + 1}</div>
              {i < 3 && <div className={`w-8 h-[1.5px] ${active ? "bg-primary/40" : "bg-border"}`} />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === "loc" && (
          <motion.div key="loc" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <div className="space-y-3">
              {locations.map(l => (
                <button key={l.id} onClick={() => { setLocId(l.id); setDate(null); setSlot(null); setStep("date"); }}
                  className="w-full text-left flex items-center gap-4 p-5 rounded-2xl border border-border/20 bg-white hover:border-primary/30 hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{l.name}</p>
                    <p className="text-muted-foreground text-sm">{l.address}, {l.city}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "date" && (
          <motion.div key="date" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <button onClick={() => { setStep("loc"); setLocId(""); }} className="flex items-center gap-2 text-sm text-primary mb-4 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <p className="text-muted-foreground text-sm mb-5">{loc?.name} Office</p>
            <div className="bg-white rounded-2xl border border-border/20 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display text-lg">{format(calMonth, "MMMM yyyy")}</h4>
                <div className="flex gap-1">
                  <button onClick={() => setCalMonth(subMonths(calMonth, 1))} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => setCalMonth(addMonths(calMonth, 1))} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} className="text-center text-[10px] text-muted-foreground font-medium py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
                {days.map(day => {
                  const ds = format(day, "yyyy-MM-dd");
                  const avail = availableDates.includes(ds) && !isBefore(day, today);
                  const sel = date && isSameDay(day, date);
                  return (
                    <button key={day.toISOString()} disabled={!avail}
                      onClick={() => { setDate(day); setSlot(null); setStep("time"); }}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm relative transition-all ${sel ? "bg-primary text-primary-foreground font-bold" : avail ? "bg-white hover:bg-primary/10 text-foreground font-medium border border-border/10" : "text-muted-foreground/30 cursor-not-allowed"}`}>
                      {format(day, "d")}
                      {avail && !sel && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {step === "time" && date && (
          <motion.div key="time" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <button onClick={() => setStep("date")} className="flex items-center gap-2 text-sm text-primary mb-4 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <p className="text-muted-foreground text-sm mb-5">{loc?.name} · {format(date, "EEE, MMM d")}</p>
            {timeSlots.length === 0 ? (
              <div className="text-center py-12 bg-secondary/20 rounded-2xl border border-border/20">
                <Clock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No slots available</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((s: any) => (
                  <button key={`${s.availabilityId}-${s.startTime}`}
                    onClick={() => { setSlot(s); setStep("info"); }}
                    className="text-left p-4 rounded-xl border border-border/20 bg-white hover:border-primary/30 hover:shadow-md transition-all group">
                    <p className="font-semibold text-sm text-foreground">{fmt12(s.startTime)}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">to {fmt12(s.endTime)}</p>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {step === "info" && slot && (
          <motion.div key="info" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <button onClick={() => setStep("time")} className="flex items-center gap-2 text-sm text-primary mb-4 hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="bg-primary/5 rounded-xl p-4 mb-6 text-sm">
              <p className="font-semibold text-foreground">{loc?.name} · {date && format(date, "EEE, MMM d")} · {fmt12(slot.startTime)}</p>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name *" className="w-full px-4 py-3 rounded-xl border border-border/20 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name *" className="w-full px-4 py-3 rounded-xl border border-border/20 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
              </div>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" type="email" className="w-full px-4 py-3 rounded-xl border border-border/20 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" type="tel" className="w-full px-4 py-3 rounded-xl border border-border/20 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
              <button onClick={() => { if (!firstName.trim() || !lastName.trim() || !email.trim()) { toast({ title: "Please fill required fields", variant: "destructive" }); return; } bookMutation.mutate(); }}
                disabled={bookMutation.isPending}
                className="w-full bg-primary text-primary-foreground font-semibold text-sm py-3.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {bookMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : "Confirm Appointment"}
              </button>
            </div>
          </motion.div>
        )}

        {step === "done" && confirmation && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-display text-2xl text-foreground mb-2">You're booked!</h3>
              <p className="text-muted-foreground text-sm mb-6">Confirmation: <span className="font-mono font-bold text-foreground">{confirmation.confirmation_code}</span></p>
              <div className="bg-secondary/30 rounded-xl p-4 text-sm text-left space-y-1 max-w-xs mx-auto">
                <p><span className="text-muted-foreground">Date:</span> <span className="font-medium">{confirmation.date}</span></p>
                <p><span className="text-muted-foreground">Time:</span> <span className="font-medium">{fmt12(confirmation.start_time)}</span></p>
                <p><span className="text-muted-foreground">Location:</span> <span className="font-medium">{loc?.name}</span></p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIATION B — "Split Panel" (Image Left, Booking Right)
   ═══════════════════════════════════════════════════════════ */
function VariationB() {
  const { toast } = useToast();
  const { locations } = useSchedulingData();
  const [locId, setLocId] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<any>(null);
  const [step, setStep] = useState<"loc" | "date" | "time" | "info" | "done">("loc");
  const [calMonth, setCalMonth] = useState(new Date());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const { availableDates, getTimeSlots, refetchAppointments } = useAvailability(locId);
  const timeSlots = useMemo(() => getTimeSlots(date), [date, getTimeSlots]);
  const loc = locations.find(l => l.id === locId);

  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const today = startOfDay(new Date());

  const locImg = loc?.name === "Hoboken" ? hobokenImg : edisonImg;

  const bookMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: slot.availabilityId, p_slot_start: slot.startTime, p_slot_end: slot.endTime,
        p_patient_first_name: firstName.trim(), p_patient_last_name: lastName.trim(),
        p_patient_email: email.trim(), p_patient_phone: phone.trim() || undefined,
      });
      if (error) throw error;
      const result = data as any;
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (r) => { setConfirmation(r); setStep("done"); refetchAppointments(); },
    onError: (e: any) => { toast({ title: "Booking failed", description: e.message, variant: "destructive" }); },
  });

  return (
    <div className="grid md:grid-cols-2 min-h-[600px] rounded-3xl overflow-hidden border border-border/20 shadow-xl">
      {/* Left — Image / context */}
      <div className="relative hidden md:block">
        <img src={locId ? locImg : hobokenImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-10">
          <img src={logo} alt="Orenda" className="h-6 mb-4 brightness-0 invert" />
          <h2 className="font-display text-3xl text-white mb-2">In-Person Visits</h2>
          <p className="text-white/70 text-sm">Book an appointment at our New Jersey offices in just a few steps.</p>
          {loc && step !== "loc" && (
            <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">Selected</p>
              <p className="text-white font-semibold">{loc.name}</p>
              <p className="text-white/60 text-sm">{loc.address}</p>
              {date && <p className="text-white/80 text-sm mt-1">{format(date, "EEEE, MMMM d, yyyy")}</p>}
              {slot && <p className="text-white/80 text-sm">{fmt12(slot.startTime)} – {fmt12(slot.endTime)}</p>}
            </div>
          )}
        </div>
      </div>

      {/* Right — Booking form */}
      <div className="bg-white p-8 md:p-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === "loc" && (
            <motion.div key="loc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h3 className="font-display text-2xl mb-1">Choose Location</h3>
              <p className="text-muted-foreground text-sm mb-6">Where would you like to be seen?</p>
              <div className="space-y-3">
                {locations.map(l => (
                  <button key={l.id} onClick={() => { setLocId(l.id); setStep("date"); }}
                    className="w-full flex items-center gap-4 p-5 rounded-xl border border-border/20 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group">
                    <Building2 className="w-5 h-5 text-primary/50 group-hover:text-primary" />
                    <div>
                      <p className="font-semibold">{l.name}</p>
                      <p className="text-muted-foreground text-xs">{l.address}, {l.city}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "date" && (
            <motion.div key="date" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button onClick={() => { setStep("loc"); setLocId(""); }} className="text-primary text-sm mb-3 flex items-center gap-1 hover:underline"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
              <h3 className="font-display text-2xl mb-6">Pick a Date</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-lg">{format(calMonth, "MMMM yyyy")}</span>
                <div className="flex gap-1">
                  <button onClick={() => setCalMonth(subMonths(calMonth, 1))} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => setCalMonth(addMonths(calMonth, 1))} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} className="text-center text-[10px] text-muted-foreground font-medium py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
                {days.map(day => {
                  const ds = format(day, "yyyy-MM-dd");
                  const avail = availableDates.includes(ds) && !isBefore(day, today);
                  const sel = date && isSameDay(day, date);
                  return (
                    <button key={day.toISOString()} disabled={!avail}
                      onClick={() => { setDate(day); setSlot(null); setStep("time"); }}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm relative transition-all ${sel ? "bg-primary text-primary-foreground font-bold" : avail ? "hover:bg-primary/10 text-foreground font-medium" : "text-muted-foreground/30 cursor-not-allowed"}`}>
                      {format(day, "d")}
                      {avail && !sel && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === "time" && date && (
            <motion.div key="time" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button onClick={() => setStep("date")} className="text-primary text-sm mb-3 flex items-center gap-1 hover:underline"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
              <h3 className="font-display text-2xl mb-1">Select a Time</h3>
              <p className="text-muted-foreground text-sm mb-6">{format(date, "EEEE, MMMM d")}</p>
              {timeSlots.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">No slots available for this day.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {timeSlots.map((s: any) => (
                    <button key={`${s.availabilityId}-${s.startTime}`}
                      onClick={() => { setSlot(s); setStep("info"); }}
                      className="p-3 rounded-xl border border-border/20 hover:border-primary/30 hover:bg-primary/5 transition-all text-left">
                      <p className="font-semibold text-sm">{fmt12(s.startTime)}</p>
                      <p className="text-[11px] text-muted-foreground">to {fmt12(s.endTime)}</p>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {step === "info" && slot && (
            <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button onClick={() => setStep("time")} className="text-primary text-sm mb-3 flex items-center gap-1 hover:underline"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
              <h3 className="font-display text-2xl mb-6">Your Information</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                </div>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className="w-full px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                <button onClick={() => { if (!firstName.trim() || !lastName.trim() || !email.trim()) { toast({ title: "Please fill required fields", variant: "destructive" }); return; } bookMutation.mutate(); }}
                  disabled={bookMutation.isPending}
                  className="w-full bg-primary text-primary-foreground font-semibold text-sm py-3.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {bookMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : "Confirm Appointment"}
                </button>
              </div>
            </motion.div>
          )}

          {step === "done" && confirmation && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-display text-2xl mb-2">Booked!</h3>
              <p className="text-muted-foreground text-sm mb-4">Code: <span className="font-mono font-bold text-foreground">{confirmation.confirmation_code}</span></p>
              <div className="bg-secondary/30 rounded-xl p-4 text-sm text-left space-y-1 max-w-xs mx-auto">
                <p><span className="text-muted-foreground">Date:</span> {confirmation.date}</p>
                <p><span className="text-muted-foreground">Time:</span> {fmt12(confirmation.start_time)}</p>
                <p><span className="text-muted-foreground">Location:</span> {loc?.name}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIATION C — "All-in-One Compact" (Calendar + Slots Side by Side)
   ═══════════════════════════════════════════════════════════ */
function VariationC() {
  const { toast } = useToast();
  const { locations } = useSchedulingData();
  const [locId, setLocId] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const { availableDates, getTimeSlots, refetchAppointments } = useAvailability(locId);
  const timeSlots = useMemo(() => getTimeSlots(date), [date, getTimeSlots]);
  const loc = locations.find(l => l.id === locId);

  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const today = startOfDay(new Date());

  const bookMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: slot.availabilityId, p_slot_start: slot.startTime, p_slot_end: slot.endTime,
        p_patient_first_name: firstName.trim(), p_patient_last_name: lastName.trim(),
        p_patient_email: email.trim(), p_patient_phone: phone.trim() || undefined,
      });
      if (error) throw error;
      const result = data as any;
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (r) => { setConfirmation(r); refetchAppointments(); },
    onError: (e: any) => { toast({ title: "Booking failed", description: e.message, variant: "destructive" }); },
  });

  if (confirmation) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="font-display text-3xl mb-2">Appointment Confirmed</h2>
        <p className="text-muted-foreground mb-6">Your confirmation code is <span className="font-mono font-bold text-foreground text-lg">{confirmation.confirmation_code}</span></p>
        <div className="inline-flex gap-6 bg-secondary/30 rounded-xl px-8 py-4 text-sm">
          <div><p className="text-muted-foreground text-xs">Date</p><p className="font-semibold">{confirmation.date}</p></div>
          <div><p className="text-muted-foreground text-xs">Time</p><p className="font-semibold">{fmt12(confirmation.start_time)}</p></div>
          <div><p className="text-muted-foreground text-xs">Location</p><p className="font-semibold">{loc?.name}</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Location tabs */}
      <div className="flex gap-2 mb-8">
        {locations.map(l => (
          <button key={l.id} onClick={() => { setLocId(l.id); setDate(null); setSlot(null); setShowForm(false); }}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${locId === l.id ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>
            {l.name}
          </button>
        ))}
      </div>

      {!locId ? (
        <div className="text-center py-16 text-muted-foreground">
          <MapPin className="w-8 h-8 mx-auto mb-3 text-muted-foreground/30" />
          Select a location above to see available dates
        </div>
      ) : (
        <div className="grid md:grid-cols-5 gap-6">
          {/* Calendar — 3 cols */}
          <div className="md:col-span-3 bg-white rounded-2xl border border-border/20 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-display text-xl">{format(calMonth, "MMMM yyyy")}</h4>
              <div className="flex gap-1">
                <button onClick={() => setCalMonth(subMonths(calMonth, 1))} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setCalMonth(addMonths(calMonth, 1))} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="text-center text-[10px] text-muted-foreground font-medium py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
              {days.map(day => {
                const ds = format(day, "yyyy-MM-dd");
                const avail = availableDates.includes(ds) && !isBefore(day, today);
                const sel = date && isSameDay(day, date);
                return (
                  <button key={day.toISOString()} disabled={!avail}
                    onClick={() => { setDate(day); setSlot(null); setShowForm(false); }}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative transition-all ${sel ? "bg-primary text-primary-foreground font-bold ring-2 ring-primary/30 ring-offset-1" : avail ? "hover:bg-primary/10 text-foreground font-medium" : "text-muted-foreground/25 cursor-not-allowed"}`}>
                    {format(day, "d")}
                    {avail && !sel && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/50" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots — 2 cols */}
          <div className="md:col-span-2">
            {!date ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm bg-secondary/20 rounded-2xl border border-border/10 p-6">
                <div className="text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-muted-foreground/30" />
                  Select a date to see times
                </div>
              </div>
            ) : showForm && slot ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-border/20 p-6 shadow-sm">
                <button onClick={() => setShowForm(false)} className="text-primary text-sm mb-3 flex items-center gap-1 hover:underline"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                <p className="text-xs text-muted-foreground mb-4">{loc?.name} · {format(date, "MMM d")} · {fmt12(slot.startTime)}</p>
                <div className="space-y-2.5">
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name *" className="w-full px-3 py-2.5 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name *" className="w-full px-3 py-2.5 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className="w-full px-3 py-2.5 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" className="w-full px-3 py-2.5 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  <button onClick={() => { if (!firstName.trim() || !lastName.trim() || !email.trim()) { toast({ title: "Fill required fields", variant: "destructive" }); return; } bookMutation.mutate(); }}
                    disabled={bookMutation.isPending}
                    className="w-full bg-primary text-primary-foreground font-semibold text-sm py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                    {bookMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : "Book Now"}
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-2xl border border-border/20 p-6 shadow-sm">
                <h4 className="font-display text-lg mb-1">{format(date, "EEEE, MMM d")}</h4>
                <p className="text-muted-foreground text-xs mb-4">{timeSlots.length} slot{timeSlots.length !== 1 ? "s" : ""} available</p>
                {timeSlots.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-6 text-center">No openings</p>
                ) : (
                  <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                    {timeSlots.map((s: any) => (
                      <button key={`${s.availabilityId}-${s.startTime}`}
                        onClick={() => { setSlot(s); setShowForm(true); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); }}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-border/15 hover:border-primary/30 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-primary/50" />
                          <span className="font-medium text-sm">{fmt12(s.startTime)}</span>
                        </div>
                        <span className="text-primary text-xs font-semibold">Book</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIATION D — "Dark Cinematic" (Full-width dark bg, dramatic)
   ═══════════════════════════════════════════════════════════ */
function VariationD() {
  const { toast } = useToast();
  const { locations } = useSchedulingData();
  const [locId, setLocId] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<any>(null);
  const [phase, setPhase] = useState<"pick" | "form" | "done">("pick");
  const [calMonth, setCalMonth] = useState(new Date());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const { availableDates, getTimeSlots, refetchAppointments } = useAvailability(locId);
  const timeSlots = useMemo(() => getTimeSlots(date), [date, getTimeSlots]);
  const loc = locations.find(l => l.id === locId);

  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const today = startOfDay(new Date());

  const bookMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: slot.availabilityId, p_slot_start: slot.startTime, p_slot_end: slot.endTime,
        p_patient_first_name: firstName.trim(), p_patient_last_name: lastName.trim(),
        p_patient_email: email.trim(), p_patient_phone: phone.trim() || undefined,
      });
      if (error) throw error;
      const result = data as any;
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (r) => { setConfirmation(r); setPhase("done"); refetchAppointments(); },
    onError: (e: any) => { toast({ title: "Booking failed", description: e.message, variant: "destructive" }); },
  });

  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(270, 60%, 8%) 0%, hsl(270, 40%, 15%) 100%)' }}>
      <div className="p-8 md:p-14">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[10px] tracking-[0.5em] uppercase text-primary/60 mb-3">Orenda Psychiatry</p>
          <h2 className="font-display text-4xl md:text-6xl text-white tracking-tight">
            Book Your <em style={{ fontStyle: "italic", color: 'hsl(270, 70%, 70%)' }}>Visit</em>
          </h2>
        </div>

        {phase === "done" && confirmation ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'hsl(150, 50%, 20%)' }}>
              <CheckCircle2 className="w-10 h-10" style={{ color: 'hsl(150, 60%, 60%)' }} />
            </div>
            <h3 className="font-display text-3xl text-white mb-2">You're All Set</h3>
            <p className="text-white/50 mb-6">Confirmation: <span className="font-mono font-bold text-white">{confirmation.confirmation_code}</span></p>
            <div className="inline-flex gap-8 rounded-xl px-8 py-5 text-sm" style={{ background: 'hsl(270, 40%, 12%)' }}>
              <div><p className="text-white/40 text-xs mb-1">Date</p><p className="text-white font-semibold">{confirmation.date}</p></div>
              <div><p className="text-white/40 text-xs mb-1">Time</p><p className="text-white font-semibold">{fmt12(confirmation.start_time)}</p></div>
              <div><p className="text-white/40 text-xs mb-1">Location</p><p className="text-white font-semibold">{loc?.name}</p></div>
            </div>
          </motion.div>
        ) : phase === "form" && slot ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto">
            <button onClick={() => { setPhase("pick"); setSlot(null); }} className="flex items-center gap-2 text-sm mb-6 hover:underline" style={{ color: 'hsl(270, 70%, 70%)' }}>
              <ArrowLeft className="w-3.5 h-3.5" /> Back to calendar
            </button>
            <div className="rounded-xl p-4 mb-6 text-sm" style={{ background: 'hsl(270, 40%, 12%)' }}>
              <p className="text-white font-semibold">{loc?.name} · {date && format(date, "EEE, MMM d")} · {fmt12(slot.startTime)}</p>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name *" className="px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary/40" />
                <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name *" className="px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary/40" />
              </div>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary/40" />
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-primary/40" />
              <button onClick={() => { if (!firstName.trim() || !lastName.trim() || !email.trim()) { toast({ title: "Fill required fields", variant: "destructive" }); return; } bookMutation.mutate(); }}
                disabled={bookMutation.isPending}
                className="w-full font-semibold text-sm py-3.5 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                {bookMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : "Confirm Appointment"}
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-12 gap-8">
            {/* Location + Calendar — left side */}
            <div className="md:col-span-7">
              {/* Location pills */}
              <div className="flex gap-2 mb-6">
                {locations.map(l => (
                  <button key={l.id} onClick={() => { setLocId(l.id); setDate(null); setSlot(null); }}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${locId === l.id ? "bg-primary text-primary-foreground" : "text-white/50 hover:text-white border border-white/10 hover:border-white/20"}`}>
                    {l.name}
                  </button>
                ))}
              </div>

              {locId && (
                <div className="rounded-2xl p-6" style={{ background: 'hsl(270, 40%, 12%)' }}>
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="font-display text-xl text-white">{format(calMonth, "MMMM yyyy")}</h4>
                    <div className="flex gap-1">
                      <button onClick={() => setCalMonth(subMonths(calMonth, 1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5"><ChevronLeft className="w-4 h-4" /></button>
                      <button onClick={() => setCalMonth(addMonths(calMonth, 1))} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} className="text-center text-[10px] text-white/30 font-medium py-1">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
                    {days.map(day => {
                      const ds = format(day, "yyyy-MM-dd");
                      const avail = availableDates.includes(ds) && !isBefore(day, today);
                      const sel = date && isSameDay(day, date);
                      return (
                        <button key={day.toISOString()} disabled={!avail}
                          onClick={() => { setDate(day); setSlot(null); }}
                          className={`aspect-square rounded-lg flex items-center justify-center text-sm relative transition-all ${sel ? "bg-primary text-primary-foreground font-bold" : avail ? "text-white hover:bg-white/10 font-medium" : "text-white/15 cursor-not-allowed"}`}>
                          {format(day, "d")}
                          {avail && !sel && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Time slots — right side */}
            <div className="md:col-span-5">
              {!locId ? (
                <div className="h-full flex items-center justify-center rounded-2xl p-8" style={{ background: 'hsl(270, 40%, 12%)' }}>
                  <p className="text-white/30 text-center text-sm">Select a location to begin</p>
                </div>
              ) : !date ? (
                <div className="h-full flex items-center justify-center rounded-2xl p-8" style={{ background: 'hsl(270, 40%, 12%)' }}>
                  <p className="text-white/30 text-center text-sm">Pick a date to see available times</p>
                </div>
              ) : (
                <div className="rounded-2xl p-6" style={{ background: 'hsl(270, 40%, 12%)' }}>
                  <h4 className="font-display text-lg text-white mb-1">{format(date, "EEEE, MMM d")}</h4>
                  <p className="text-white/40 text-xs mb-5">{timeSlots.length} available</p>
                  {timeSlots.length === 0 ? (
                    <p className="text-white/30 text-sm py-8 text-center">No openings this day</p>
                  ) : (
                    <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                      {timeSlots.map((s: any) => (
                        <button key={`${s.availabilityId}-${s.startTime}`}
                          onClick={() => { setSlot(s); setPhase("form"); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); }}
                          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" style={{ color: 'hsl(270, 70%, 70%)' }} />
                            <span className="text-white font-medium text-sm">{fmt12(s.startTime)}</span>
                            <span className="text-white/30 text-xs">– {fmt12(s.endTime)}</span>
                          </div>
                          <span className="text-xs font-semibold" style={{ color: 'hsl(270, 70%, 70%)' }}>Select →</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIATION E — "Card Stack" (Stacked cards, one per step)
   ═══════════════════════════════════════════════════════════ */
function VariationE() {
  const { toast } = useToast();
  const { locations } = useSchedulingData();
  const [locId, setLocId] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<any>(null);
  const [calMonth, setCalMonth] = useState(new Date());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const { availableDates, getTimeSlots, refetchAppointments } = useAvailability(locId);
  const timeSlots = useMemo(() => getTimeSlots(date), [date, getTimeSlots]);
  const loc = locations.find(l => l.id === locId);

  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const today = startOfDay(new Date());

  const bookMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: slot.availabilityId, p_slot_start: slot.startTime, p_slot_end: slot.endTime,
        p_patient_first_name: firstName.trim(), p_patient_last_name: lastName.trim(),
        p_patient_email: email.trim(), p_patient_phone: phone.trim() || undefined,
      });
      if (error) throw error;
      const result = data as any;
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (r) => { setConfirmation(r); refetchAppointments(); },
    onError: (e: any) => { toast({ title: "Booking failed", description: e.message, variant: "destructive" }); },
  });

  if (confirmation) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-border/10 overflow-hidden">
          <div className="p-8 text-center" style={{ background: 'linear-gradient(135deg, hsl(150, 40%, 92%), hsl(150, 30%, 96%))' }}>
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(150, 50%, 40%)' }} />
            <h3 className="font-display text-2xl text-foreground">Appointment Confirmed</h3>
          </div>
          <div className="p-8">
            <div className="text-center mb-6">
              <p className="text-muted-foreground text-sm">Your confirmation code</p>
              <p className="font-mono text-2xl font-bold text-foreground mt-1">{confirmation.confirmation_code}</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border/10"><span className="text-muted-foreground">Date</span><span className="font-medium">{confirmation.date}</span></div>
              <div className="flex justify-between py-2 border-b border-border/10"><span className="text-muted-foreground">Time</span><span className="font-medium">{fmt12(confirmation.start_time)}</span></div>
              <div className="flex justify-between py-2"><span className="text-muted-foreground">Location</span><span className="font-medium">{loc?.name}</span></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Card 1: Location */}
      <div className="bg-white rounded-2xl shadow-lg border border-border/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-border/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
            <span className="font-display text-lg text-foreground">Location</span>
          </div>
          {loc && <span className="text-xs text-primary font-semibold">{loc.name} ✓</span>}
        </div>
        <div className="p-4">
          <div className="flex gap-2">
            {locations.map(l => (
              <button key={l.id} onClick={() => { setLocId(l.id); setDate(null); setSlot(null); setConfirmation(null); }}
                className={`flex-1 p-4 rounded-xl text-center transition-all ${locId === l.id ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary/50 text-foreground hover:bg-secondary"}`}>
                <MapPin className={`w-4 h-4 mx-auto mb-1.5 ${locId === l.id ? "text-primary-foreground" : "text-primary/50"}`} />
                <p className="text-sm font-semibold">{l.name}</p>
                <p className={`text-[10px] mt-0.5 ${locId === l.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{l.city}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card 2: Calendar */}
      {locId && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-border/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
              <span className="font-display text-lg text-foreground">Date</span>
            </div>
            {date && <span className="text-xs text-primary font-semibold">{format(date, "MMM d")} ✓</span>}
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-base">{format(calMonth, "MMMM yyyy")}</span>
              <div className="flex gap-1">
                <button onClick={() => setCalMonth(subMonths(calMonth, 1))} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setCalMonth(addMonths(calMonth, 1))} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} className="text-center text-[10px] text-muted-foreground font-medium py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
              {days.map(day => {
                const ds = format(day, "yyyy-MM-dd");
                const avail = availableDates.includes(ds) && !isBefore(day, today);
                const sel = date && isSameDay(day, date);
                return (
                  <button key={day.toISOString()} disabled={!avail}
                    onClick={() => { setDate(day); setSlot(null); }}
                    className={`aspect-square rounded-md flex items-center justify-center text-xs relative transition-all ${sel ? "bg-primary text-primary-foreground font-bold" : avail ? "hover:bg-primary/10 text-foreground font-medium" : "text-muted-foreground/25 cursor-not-allowed"}`}>
                    {format(day, "d")}
                    {avail && !sel && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary/50" />}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Card 3: Time */}
      {date && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-border/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/10 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
            <span className="font-display text-lg text-foreground">Time</span>
            {slot && <span className="text-xs text-primary font-semibold ml-auto">{fmt12(slot.startTime)} ✓</span>}
          </div>
          <div className="p-4">
            {timeSlots.length === 0 ? (
              <p className="text-muted-foreground text-sm py-6 text-center">No openings on this date</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((s: any) => (
                  <button key={`${s.availabilityId}-${s.startTime}`}
                    onClick={() => setSlot(s)}
                    className={`py-2.5 rounded-lg text-center text-sm font-medium transition-all ${slot?.startTime === s.startTime && slot?.availabilityId === s.availabilityId ? "bg-primary text-primary-foreground" : "bg-secondary/50 hover:bg-primary/10"}`}>
                    {fmt12(s.startTime)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Card 4: Your Details + Book */}
      {slot && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-border/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/10 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</div>
            <span className="font-display text-lg text-foreground">Your Details</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name *" className="px-3 py-2.5 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
              <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name *" className="px-3 py-2.5 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
            </div>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className="w-full px-3 py-2.5 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full px-3 py-2.5 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
            <button onClick={() => { if (!firstName.trim() || !lastName.trim() || !email.trim()) { toast({ title: "Fill required fields", variant: "destructive" }); return; } bookMutation.mutate(); }}
              disabled={bookMutation.isPending}
              className="w-full bg-primary text-primary-foreground font-semibold text-sm py-3 rounded-xl hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
              {bookMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : "Book Appointment"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIATION F — "Horizontal Timeline" (Step by step, horizontal scroll feel)
   ═══════════════════════════════════════════════════════════ */
function VariationF() {
  const { toast } = useToast();
  const { locations } = useSchedulingData();
  const [locId, setLocId] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<any>(null);
  const [calMonth, setCalMonth] = useState(new Date());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const { availableDates, getTimeSlots, refetchAppointments } = useAvailability(locId);
  const timeSlots = useMemo(() => getTimeSlots(date), [date, getTimeSlots]);
  const loc = locations.find(l => l.id === locId);

  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const today = startOfDay(new Date());

  const bookMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: slot.availabilityId, p_slot_start: slot.startTime, p_slot_end: slot.endTime,
        p_patient_first_name: firstName.trim(), p_patient_last_name: lastName.trim(),
        p_patient_email: email.trim(), p_patient_phone: phone.trim() || undefined,
      });
      if (error) throw error;
      const result = data as any;
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (r) => { setConfirmation(r); refetchAppointments(); },
    onError: (e: any) => { toast({ title: "Booking failed", description: e.message, variant: "destructive" }); },
  });

  if (confirmation) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-5" />
        <h3 className="font-display text-3xl text-foreground mb-2">Appointment Booked</h3>
        <p className="text-muted-foreground mb-8">Reference: <span className="font-mono font-bold text-foreground">{confirmation.confirmation_code}</span></p>
        <div className="flex justify-center gap-12 text-sm">
          <div><p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Date</p><p className="font-display text-lg">{confirmation.date}</p></div>
          <div className="w-px bg-border/20" />
          <div><p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Time</p><p className="font-display text-lg">{fmt12(confirmation.start_time)}</p></div>
          <div className="w-px bg-border/20" />
          <div><p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Location</p><p className="font-display text-lg">{loc?.name}</p></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Horizontal progress */}
      <div className="flex items-center justify-center gap-0 mb-12">
        {[
          { label: "Location", done: !!locId, icon: MapPin },
          { label: "Date", done: !!date, icon: Calendar },
          { label: "Time", done: !!slot, icon: Clock },
          { label: "Book", done: false, icon: CheckCircle2 },
        ].map((s, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${s.done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                <s.icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] mt-1.5 font-medium ${s.done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
            </div>
            {i < 3 && <div className={`w-16 h-[2px] mx-2 mt-[-14px] ${s.done ? "bg-primary/40" : "bg-border/30"}`} />}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Column 1: Location */}
        <div>
          <h4 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-4">Office</h4>
          <div className="space-y-2">
            {locations.map(l => (
              <button key={l.id} onClick={() => { setLocId(l.id); setDate(null); setSlot(null); }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${locId === l.id ? "border-primary bg-primary/5 shadow-md" : "border-border/20 hover:border-primary/20 bg-white"}`}>
                <div className="flex items-center gap-3">
                  <MapPin className={`w-4 h-4 ${locId === l.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className={`font-semibold text-sm ${locId === l.id ? "text-primary" : "text-foreground"}`}>{l.name}</p>
                    <p className="text-muted-foreground text-xs">{l.address}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Column 2: Calendar + Time */}
        <div>
          <h4 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-4">
            {date ? format(date, "MMMM d") : "Calendar"}
          </h4>
          {locId ? (
            <div className="bg-white rounded-xl border border-border/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">{format(calMonth, "MMM yyyy")}</span>
                <div className="flex gap-1">
                  <button onClick={() => setCalMonth(subMonths(calMonth, 1))} className="w-6 h-6 rounded hover:bg-secondary flex items-center justify-center"><ChevronLeft className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setCalMonth(addMonths(calMonth, 1))} className="w-6 h-6 rounded hover:bg-secondary flex items-center justify-center"><ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} className="text-center text-[9px] text-muted-foreground py-0.5">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
                {days.map(day => {
                  const ds = format(day, "yyyy-MM-dd");
                  const avail = availableDates.includes(ds) && !isBefore(day, today);
                  const sel = date && isSameDay(day, date);
                  return (
                    <button key={day.toISOString()} disabled={!avail}
                      onClick={() => { setDate(day); setSlot(null); }}
                      className={`aspect-square rounded text-xs flex items-center justify-center transition-all relative ${sel ? "bg-primary text-primary-foreground font-bold" : avail ? "hover:bg-primary/10 font-medium" : "text-muted-foreground/20 cursor-not-allowed"}`}>
                      {format(day, "d")}
                      {avail && !sel && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-primary" />}
                    </button>
                  );
                })}
              </div>

              {/* Time slots inline below calendar */}
              {date && (
                <div className="mt-4 pt-4 border-t border-border/10">
                  <p className="text-xs text-muted-foreground mb-2">{timeSlots.length} time{timeSlots.length !== 1 ? "s" : ""} available</p>
                  {timeSlots.length === 0 ? (
                    <p className="text-muted-foreground text-xs text-center py-3">No openings</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5 max-h-[140px] overflow-y-auto">
                      {timeSlots.map((s: any) => (
                        <button key={`${s.availabilityId}-${s.startTime}`}
                          onClick={() => setSlot(s)}
                          className={`py-2 rounded-lg text-xs font-medium text-center transition-all ${slot?.startTime === s.startTime && slot?.availabilityId === s.availabilityId ? "bg-primary text-primary-foreground" : "bg-secondary/50 hover:bg-primary/10"}`}>
                          {fmt12(s.startTime)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-secondary/20 rounded-xl border border-border/10 p-8 text-center text-muted-foreground text-sm">
              Select a location first
            </div>
          )}
        </div>

        {/* Column 3: Form */}
        <div>
          <h4 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-4">Details</h4>
          {slot ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl border border-border/20 p-5">
              <div className="rounded-lg bg-primary/5 p-3 mb-4 text-xs">
                <p className="font-semibold text-foreground">{loc?.name}</p>
                <p className="text-muted-foreground">{date && format(date, "EEE, MMM d")} · {fmt12(slot.startTime)}</p>
              </div>
              <div className="space-y-2.5">
                <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name *" className="w-full px-3 py-2 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name *" className="w-full px-3 py-2 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className="w-full px-3 py-2 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" className="w-full px-3 py-2 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                <button onClick={() => { if (!firstName.trim() || !lastName.trim() || !email.trim()) { toast({ title: "Fill required fields", variant: "destructive" }); return; } bookMutation.mutate(); }}
                  disabled={bookMutation.isPending}
                  className="w-full bg-primary text-primary-foreground font-semibold text-sm py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                  {bookMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : "Book Now"}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-secondary/20 rounded-xl border border-border/10 p-8 text-center text-muted-foreground text-sm">
              {locId && date ? "Choose a time slot" : "Complete steps 1 & 2"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIATION G — "Location-First Hero Cards" 
   Giant location cards with photos, calendar reveals inline
   ═══════════════════════════════════════════════════════════ */
function VariationG() {
  const { toast } = useToast();
  const { locations } = useSchedulingData();
  const [locId, setLocId] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<any>(null);
  const [calMonth, setCalMonth] = useState(new Date());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const { availableDates, getTimeSlots, refetchAppointments } = useAvailability(locId);
  const timeSlots = useMemo(() => getTimeSlots(date), [date, getTimeSlots]);
  const loc = locations.find(l => l.id === locId);

  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const today = startOfDay(new Date());

  const locImages: Record<string, string> = { "Hoboken": hobokenImg, "Edison": edisonImg };

  const bookMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: slot.availabilityId, p_slot_start: slot.startTime, p_slot_end: slot.endTime,
        p_patient_first_name: firstName.trim(), p_patient_last_name: lastName.trim(),
        p_patient_email: email.trim(), p_patient_phone: phone.trim() || undefined,
      });
      if (error) throw error;
      const result = data as any;
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (r) => { setConfirmation(r); refetchAppointments(); },
    onError: (e: any) => { toast({ title: "Booking failed", description: e.message, variant: "destructive" }); },
  });

  if (confirmation) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-primary" /></div>
        <h3 className="font-display text-3xl text-foreground mb-2">You're Booked!</h3>
        <p className="text-muted-foreground mb-6">Confirmation: <span className="font-mono font-bold text-foreground text-lg">{confirmation.confirmation_code}</span></p>
        <div className="bg-secondary/30 rounded-2xl p-6 text-sm space-y-2 text-left">
          <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-semibold">{loc?.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-semibold">{confirmation.date}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-semibold">{fmt12(confirmation.start_time)}</span></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl md:text-5xl text-foreground tracking-tight mb-3">Schedule an In-Person Visit</h2>
        <p className="text-muted-foreground text-base md:text-lg">Pick your location to see availability</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {locations.map(l => {
          const isSelected = locId === l.id;
          return (
            <button key={l.id} onClick={() => { setLocId(l.id); setDate(null); setSlot(null); setCalMonth(new Date()); }}
              className={`group relative overflow-hidden rounded-3xl text-left transition-all duration-300 ${isSelected ? "ring-3 ring-primary shadow-2xl scale-[1.01]" : "hover:shadow-xl hover:scale-[1.005]"}`}>
              <div className="h-48 md:h-56 relative overflow-hidden">
                <img src={locImages[l.name] || hobokenImg} alt={l.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-3xl md:text-4xl text-white mb-1">{l.name}</h3>
                  <div className="flex items-center gap-2 text-white/70 text-sm"><MapPin className="w-3.5 h-3.5" />{l.address}, {l.city}</div>
                </div>
              </div>
              <div className={`px-6 py-4 transition-colors ${isSelected ? "bg-primary/5" : "bg-white"}`}>
                <p className={`text-sm font-medium ${isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                  {isSelected ? "Showing availability below ↓" : "Tap to see available dates"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {locId && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 bg-white rounded-2xl border border-border/20 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h4 className="font-display text-xl">{format(calMonth, "MMMM yyyy")}</h4>
                <div className="flex gap-1">
                  <button onClick={() => setCalMonth(subMonths(calMonth, 1))} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
                  <button onClick={() => setCalMonth(addMonths(calMonth, 1))} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="text-center text-[10px] text-muted-foreground font-medium py-2">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
                {days.map(day => {
                  const ds = format(day, "yyyy-MM-dd");
                  const avail = availableDates.includes(ds) && !isBefore(day, today);
                  const sel = date && isSameDay(day, date);
                  return (
                    <button key={day.toISOString()} disabled={!avail} onClick={() => { setDate(day); setSlot(null); }}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm relative transition-all ${sel ? "bg-primary text-primary-foreground font-bold ring-2 ring-primary/30 ring-offset-1" : avail ? "hover:bg-primary/10 text-foreground font-medium" : "text-muted-foreground/25 cursor-not-allowed"}`}>
                      {format(day, "d")}
                      {avail && !sel && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/50" />}
                    </button>
                  );
                })}
              </div>
              {availableDates.length === 0 && <p className="text-center text-muted-foreground text-sm mt-6">No availability at this location yet.</p>}
            </div>

            <div className="md:col-span-2">
              {!date ? (
                <div className="h-full flex items-center justify-center bg-secondary/10 rounded-2xl border border-border/10 p-8">
                  <div className="text-center"><Calendar className="w-8 h-8 mx-auto mb-3 text-muted-foreground/20" /><p className="text-muted-foreground text-sm">Select a date to see times</p></div>
                </div>
              ) : slot ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl border border-border/20 p-6 shadow-sm">
                  <button onClick={() => setSlot(null)} className="flex items-center gap-1.5 text-primary text-sm mb-4 hover:underline"><ArrowLeft className="w-3.5 h-3.5" /> Back to times</button>
                  <div className="rounded-xl bg-primary/5 p-4 mb-5 text-sm"><p className="font-semibold text-foreground">{loc?.name} · {format(date, "EEE, MMM d")} · {fmt12(slot.startTime)}</p></div>
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2.5">
                      <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name *" className="px-3 py-2.5 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                      <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name *" className="px-3 py-2.5 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    </div>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className="w-full px-3 py-2.5 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full px-3 py-2.5 rounded-lg border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    <button onClick={() => { if (!firstName.trim() || !lastName.trim() || !email.trim()) { toast({ title: "Fill required fields", variant: "destructive" }); return; } bookMutation.mutate(); }}
                      disabled={bookMutation.isPending}
                      className="w-full bg-primary text-primary-foreground font-semibold text-sm py-3 rounded-xl hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                      {bookMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : "Confirm Appointment"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-2xl border border-border/20 p-6 shadow-sm">
                  <h4 className="font-display text-lg mb-1">{format(date, "EEEE, MMMM d")}</h4>
                  <p className="text-muted-foreground text-xs mb-4">{timeSlots.length} slot{timeSlots.length !== 1 ? "s" : ""} available</p>
                  {timeSlots.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-8 text-center">No openings this day</p>
                  ) : (
                    <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                      {timeSlots.map((s: any) => (
                        <button key={`${s.availabilityId}-${s.startTime}`}
                          onClick={() => { setSlot(s); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); }}
                          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border/10 hover:border-primary/30 hover:bg-primary/5 transition-all">
                          <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-primary/50" /><span className="font-medium text-sm">{fmt12(s.startTime)}</span><span className="text-muted-foreground text-xs">– {fmt12(s.endTime)}</span></div>
                          <span className="text-primary text-xs font-semibold">Book →</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIATION H — "Dual Calendar" (Both locations visible at once)
   ═══════════════════════════════════════════════════════════ */
function VariationH() {
  const { toast } = useToast();
  const { locations } = useSchedulingData();
  const [activeLocId, setActiveLocId] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<any>(null);
  const [calMonth, setCalMonth] = useState(new Date());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const hobokenLoc = locations.find(l => l.name === "Hoboken");
  const edisonLoc = locations.find(l => l.name === "Edison");
  const hobokenAvail = useAvailability(hobokenLoc?.id || "");
  const edisonAvail = useAvailability(edisonLoc?.id || "");

  const activeAvail = activeLocId === hobokenLoc?.id ? hobokenAvail : edisonAvail;
  const activeLoc = locations.find(l => l.id === activeLocId);
  const timeSlots = useMemo(() => activeAvail.getTimeSlots(date), [date, activeAvail]);

  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const today = startOfDay(new Date());

  const locImages: Record<string, string> = { "Hoboken": hobokenImg, "Edison": edisonImg };

  const bookMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: slot.availabilityId, p_slot_start: slot.startTime, p_slot_end: slot.endTime,
        p_patient_first_name: firstName.trim(), p_patient_last_name: lastName.trim(),
        p_patient_email: email.trim(), p_patient_phone: phone.trim() || undefined,
      });
      if (error) throw error;
      const result = data as any;
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (r) => { setConfirmation(r); activeAvail.refetchAppointments(); },
    onError: (e: any) => { toast({ title: "Booking failed", description: e.message, variant: "destructive" }); },
  });

  if (confirmation) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-5" />
        <h3 className="font-display text-3xl text-foreground mb-2">Appointment Confirmed</h3>
        <p className="text-muted-foreground mb-6">Reference: <span className="font-mono font-bold text-foreground text-lg">{confirmation.confirmation_code}</span></p>
        <div className="bg-secondary/30 rounded-2xl p-6 text-sm space-y-2 text-left">
          <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-semibold">{activeLoc?.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-semibold">{confirmation.date}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-semibold">{fmt12(confirmation.start_time)}</span></div>
        </div>
      </div>
    );
  }

  const renderCalendar = (availDates: string[], onSelectDate: (d: Date) => void) => (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">{format(calMonth, "MMMM yyyy")}</span>
        <div className="flex gap-1">
          <button onClick={() => setCalMonth(subMonths(calMonth, 1))} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center"><ChevronLeft className="w-3.5 h-3.5" /></button>
          <button onClick={() => setCalMonth(addMonths(calMonth, 1))} className="w-7 h-7 rounded-lg hover:bg-secondary flex items-center justify-center"><ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} className="text-center text-[9px] text-muted-foreground py-0.5">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
        {days.map(day => {
          const ds = format(day, "yyyy-MM-dd");
          const avail = availDates.includes(ds) && !isBefore(day, today);
          const sel = date && isSameDay(day, date);
          return (
            <button key={day.toISOString()} disabled={!avail} onClick={() => onSelectDate(day)}
              className={`aspect-square rounded text-xs flex items-center justify-center transition-all relative ${sel ? "bg-primary text-primary-foreground font-bold" : avail ? "hover:bg-primary/10 font-medium" : "text-muted-foreground/20 cursor-not-allowed"}`}>
              {format(day, "d")}
              {avail && !sel && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl md:text-5xl text-foreground tracking-tight mb-3">Book an In-Person Visit</h2>
        <p className="text-muted-foreground text-base">Both office calendars shown side by side — pick a date at either location</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {[{ loc: hobokenLoc, avail: hobokenAvail }, { loc: edisonLoc, avail: edisonAvail }].map(({ loc: l, avail }) => {
          if (!l) return null;
          const isActive = activeLocId === l.id;
          const count = avail.availableDates.length;
          return (
            <div key={l.id} className={`rounded-3xl overflow-hidden border-2 transition-all ${isActive ? "border-primary shadow-xl" : "border-border/20 hover:border-primary/20"}`}>
              {/* Purple gradient header with SVG pattern */}
              <div className="relative overflow-hidden py-10 px-6" style={{ background: "linear-gradient(135deg, hsl(270, 60%, 25%) 0%, hsl(280, 50%, 40%) 50%, hsl(260, 55%, 30%) 100%)" }}>
                {/* Subtle dot pattern for texture */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id={`dots-${l.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.5" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#dots-${l.id})`} />
                </svg>
                {/* Radial glow */}
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(270, 80%, 70%), transparent)" }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-15" style={{ background: "radial-gradient(circle, hsl(280, 70%, 60%), transparent)" }} />

                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-white/60" />
                      <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">Office Location</span>
                    </div>
                    <h3 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight leading-none mb-2">{l.name}</h3>
                    <p className="text-white/80 text-base md:text-lg font-medium">{l.address}, {l.city}</p>
                  </div>
                  <span className="text-white/70 text-xs bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 font-semibold">{count} date{count !== 1 ? "s" : ""}</span>
                </div>
              </div>
              <div className="p-5 bg-white">
                {renderCalendar(avail.availableDates, (day) => { setActiveLocId(l.id); setDate(day); setSlot(null); })}
              </div>
            </div>
          );
        })}
      </div>

      {activeLocId && date && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border/20 shadow-sm p-6 md:p-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h4 className="font-display text-xl text-foreground">{activeLoc?.name} — {format(date, "EEEE, MMMM d")}</h4>
              <p className="text-muted-foreground text-xs">{timeSlots.length} time{timeSlots.length !== 1 ? "s" : ""} available</p>
            </div>
            <button onClick={() => { setDate(null); setSlot(null); }} className="text-primary text-xs font-semibold hover:underline">Change date</button>
          </div>

          {!slot ? (
            timeSlots.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No openings on this date</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {timeSlots.map((s: any) => (
                  <button key={`${s.availabilityId}-${s.startTime}`}
                    onClick={() => { setSlot(s); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); }}
                    className="py-3 rounded-xl bg-secondary/50 hover:bg-primary/10 hover:border-primary/20 border border-border/10 text-sm font-medium text-foreground transition-all text-center">
                    {fmt12(s.startTime)}
                  </button>
                ))}
              </div>
            )
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-2 mb-5">
                <button onClick={() => setSlot(null)} className="text-primary text-sm flex items-center gap-1 hover:underline"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                <span className="text-muted-foreground text-sm">|</span>
                <span className="text-sm font-semibold text-foreground">{fmt12(slot.startTime)} – {fmt12(slot.endTime)}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
              </div>
              <button onClick={() => { if (!firstName.trim() || !lastName.trim() || !email.trim()) { toast({ title: "Fill required fields", variant: "destructive" }); return; } bookMutation.mutate(); }}
                disabled={bookMutation.isPending}
                className="w-full mt-4 bg-primary text-primary-foreground font-semibold text-sm py-3.5 rounded-xl hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                {bookMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : "Confirm Appointment"}
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIATION I — "Location Tabs with Inline Calendar" 
   Large tabs at top, everything flows below
   ═══════════════════════════════════════════════════════════ */
function VariationI() {
  const { toast } = useToast();
  const { locations } = useSchedulingData();
  const [locId, setLocId] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<any>(null);
  const [calMonth, setCalMonth] = useState(new Date());
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const { availableDates, getTimeSlots, refetchAppointments } = useAvailability(locId);
  const timeSlots = useMemo(() => getTimeSlots(date), [date, getTimeSlots]);
  const loc = locations.find(l => l.id === locId);

  const monthStart = startOfMonth(calMonth);
  const monthEnd = endOfMonth(calMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const today = startOfDay(new Date());

  const locImages: Record<string, string> = { "Hoboken": hobokenImg, "Edison": edisonImg };

  const bookMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: slot.availabilityId, p_slot_start: slot.startTime, p_slot_end: slot.endTime,
        p_patient_first_name: firstName.trim(), p_patient_last_name: lastName.trim(),
        p_patient_email: email.trim(), p_patient_phone: phone.trim() || undefined,
      });
      if (error) throw error;
      const result = data as any;
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (r) => { setConfirmation(r); refetchAppointments(); },
    onError: (e: any) => { toast({ title: "Booking failed", description: e.message, variant: "destructive" }); },
  });

  if (confirmation) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-5" />
        <h3 className="font-display text-3xl text-foreground mb-2">You're All Set!</h3>
        <p className="text-muted-foreground mb-8">Code: <span className="font-mono font-bold text-foreground text-lg">{confirmation.confirmation_code}</span></p>
        <div className="inline-flex gap-8 bg-secondary/30 rounded-2xl px-8 py-5">
          <div><p className="text-muted-foreground text-xs mb-1">Location</p><p className="font-display text-lg">{loc?.name}</p></div>
          <div><p className="text-muted-foreground text-xs mb-1">Date</p><p className="font-display text-lg">{confirmation.date}</p></div>
          <div><p className="text-muted-foreground text-xs mb-1">Time</p><p className="font-display text-lg">{fmt12(confirmation.start_time)}</p></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl md:text-5xl text-foreground tracking-tight mb-2">Schedule Your Visit</h2>
        <p className="text-muted-foreground">Select your preferred office below</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {locations.map(l => {
          const isActive = locId === l.id;
          return (
            <button key={l.id} onClick={() => { setLocId(l.id); setDate(null); setSlot(null); setCalMonth(new Date()); }}
              className={`relative rounded-2xl overflow-hidden h-40 md:h-48 group transition-all duration-300 ${isActive ? "ring-3 ring-primary" : ""}`}>
              <img src={locImages[l.name] || hobokenImg} alt={l.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className={`absolute inset-0 transition-colors ${isActive ? "bg-primary/60" : "bg-foreground/50 group-hover:bg-foreground/40"}`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <MapPin className="w-6 h-6 mb-2 opacity-80" />
                <h3 className="font-display text-3xl md:text-4xl">{l.name}</h3>
                <p className="text-white/70 text-xs mt-1">{l.city}</p>
                {isActive && <span className="mt-2 text-[10px] uppercase tracking-widest font-semibold bg-white/20 rounded-full px-3 py-1">Viewing</span>}
              </div>
            </button>
          );
        })}
      </div>

      {locId && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-border/20 shadow-lg overflow-hidden">
            <div className="p-6 md:p-8 border-b border-border/10">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h4 className="font-display text-2xl text-foreground">{loc?.name} Availability</h4>
                  <p className="text-muted-foreground text-sm">Select a date with a purple dot</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setCalMonth(subMonths(calMonth, 1))} className="w-9 h-9 rounded-xl border border-border/20 hover:bg-secondary flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="font-display text-lg min-w-[140px] text-center">{format(calMonth, "MMMM yyyy")}</span>
                  <button onClick={() => setCalMonth(addMonths(calMonth, 1))} className="w-9 h-9 rounded-xl border border-border/20 hover:bg-secondary flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
                {days.map(day => {
                  const ds = format(day, "yyyy-MM-dd");
                  const avail = availableDates.includes(ds) && !isBefore(day, today);
                  const sel = date && isSameDay(day, date);
                  return (
                    <button key={day.toISOString()} disabled={!avail} onClick={() => { setDate(day); setSlot(null); }}
                      className={`aspect-square rounded-xl flex items-center justify-center text-sm relative transition-all ${sel ? "bg-primary text-primary-foreground font-bold shadow-md" : avail ? "hover:bg-primary/10 text-foreground font-medium bg-secondary/30" : "text-muted-foreground/20 cursor-not-allowed"}`}>
                      {format(day, "d")}
                      {avail && !sel && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/40" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {date && (
              <div className="p-6 md:p-8 border-b border-border/10">
                <h4 className="font-display text-lg text-foreground mb-1">{format(date, "EEEE, MMMM d")}</h4>
                <p className="text-muted-foreground text-xs mb-4">Pick a time</p>
                {timeSlots.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-6">No availability on this date</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map((s: any) => (
                      <button key={`${s.availabilityId}-${s.startTime}`}
                        onClick={() => { setSlot(s); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); }}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${slot?.startTime === s.startTime && slot?.availabilityId === s.availabilityId ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary/50 hover:bg-primary/10 border border-border/10"}`}>
                        {fmt12(s.startTime)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {slot && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-8">
                <h4 className="font-display text-lg text-foreground mb-4">Complete Your Booking</h4>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                </div>
                <button onClick={() => { if (!firstName.trim() || !lastName.trim() || !email.trim()) { toast({ title: "Fill required fields", variant: "destructive" }); return; } bookMutation.mutate(); }}
                  disabled={bookMutation.isPending}
                  className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold text-sm px-10 py-3.5 rounded-xl hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                  {bookMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : "Confirm Appointment"}
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   VARIATION J — "Weekly Grid" (Zocdoc-style)
   Both locations with weekly day-column availability
   ═══════════════════════════════════════════════════════════ */
function VariationJ() {
  const { toast } = useToast();
  const { locations } = useSchedulingData();
  const [weekStart, setWeekStart] = useState(() => {
    const t = startOfDay(new Date());
    // Start from today
    return t;
  });
  const [activeLocId, setActiveLocId] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [slot, setSlot] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const hobokenLoc = locations.find(l => l.name === "Hoboken");
  const edisonLoc = locations.find(l => l.name === "Edison");
  const hobokenAvail = useAvailability(hobokenLoc?.id || "");
  const edisonAvail = useAvailability(edisonLoc?.id || "");

  const activeAvail = activeLocId === hobokenLoc?.id ? hobokenAvail : edisonAvail;
  const activeLoc = locations.find(l => l.id === activeLocId);
  const timeSlots = useMemo(() => activeAvail.getTimeSlots(date), [date, activeAvail]);

  const today = startOfDay(new Date());

  // Generate 7 days for the visible week
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  // Count available slots per day per location
  const getSlotCountForDay = (avail: ReturnType<typeof useAvailability>, day: Date) => {
    const ds = format(day, "yyyy-MM-dd");
    if (!avail.availableDates.includes(ds) || isBefore(day, today)) return 0;
    return avail.getTimeSlots(day).length;
  };

  const bookMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: slot.availabilityId, p_slot_start: slot.startTime, p_slot_end: slot.endTime,
        p_patient_first_name: firstName.trim(), p_patient_last_name: lastName.trim(),
        p_patient_email: email.trim(), p_patient_phone: phone.trim() || undefined,
      });
      if (error) throw error;
      const result = data as any;
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (r) => { setConfirmation(r); activeAvail.refetchAppointments(); },
    onError: (e: any) => { toast({ title: "Booking failed", description: e.message, variant: "destructive" }); },
  });

  // Confirmation is now shown inside the dialog — no early return needed

  const renderWeekRow = (loc: typeof hobokenLoc, avail: ReturnType<typeof useAvailability>) => {
    if (!loc) return null;
    return (
      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map(day => {
          const count = getSlotCountForDay(avail, day);
          const hasSlots = count > 0;
          const isSelected = date && isSameDay(day, date) && activeLocId === loc.id;
          return (
            <button
              key={day.toISOString()}
              disabled={!hasSlots}
              onClick={() => { setActiveLocId(loc.id); setDate(day); setSlot(null); setDialogOpen(true); }}
              className={`py-3 px-1 rounded-lg text-center transition-all border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary font-bold"
                  : hasSlots
                    ? "bg-amber-100/80 border-amber-200/60 hover:bg-amber-200/80 text-foreground cursor-pointer"
                    : "bg-secondary/30 border-border/10 text-muted-foreground/40 cursor-not-allowed"
              }`}
            >
              <span className={`block text-lg font-bold ${isSelected ? "text-primary-foreground" : hasSlots ? "text-foreground" : "text-muted-foreground/30"}`}>
                {hasSlots ? count : "No"}
              </span>
              <span className={`block text-[10px] ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {hasSlots ? `appt${count !== 1 ? "s" : ""}` : "appts"}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl md:text-5xl text-foreground tracking-tight mb-3">Book an In-Person Visit</h2>
        <p className="text-muted-foreground text-base">See availability at a glance — click any day to book</p>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button
          onClick={() => setWeekStart(addDays(weekStart, -7))}
          disabled={isBefore(addDays(weekStart, -7), today)}
          className="w-9 h-9 rounded-full border border-border/20 flex items-center justify-center hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-muted-foreground">
          {format(weekDays[0], "MMM d")} — {format(weekDays[6], "MMM d, yyyy")}
        </span>
        <button
          onClick={() => setWeekStart(addDays(weekStart, 7))}
          className="w-9 h-9 rounded-full border border-border/20 flex items-center justify-center hover:bg-secondary"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1.5 mb-2 pl-0 md:pl-0">
          {weekDays.map(day => {
            const isToday2 = isSameDay(day, today);
            return (
              <div key={day.toISOString()} className={`text-center py-1.5 rounded-md ${isToday2 ? "bg-primary/10" : ""}`}>
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{format(day, "EEE")}</span>
                <span className={`block text-sm font-bold ${isToday2 ? "text-primary" : "text-foreground"}`}>{format(day, "MMM d")}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Location rows */}
      <div className="space-y-6">
        {[{ loc: hobokenLoc, avail: hobokenAvail }, { loc: edisonLoc, avail: edisonAvail }].map(({ loc: l, avail }) => {
          if (!l) return null;
          const isActive = activeLocId === l.id;
          return (
            <div key={l.id} className={`rounded-3xl overflow-hidden border-2 transition-all ${isActive && date ? "border-primary shadow-xl" : "border-border/20"}`}>
              {/* Purple gradient header */}
              <div className="relative overflow-hidden py-8 px-6" style={{ background: "linear-gradient(135deg, hsl(270, 60%, 25%) 0%, hsl(280, 50%, 40%) 50%, hsl(260, 55%, 30%) 100%)" }}>
                <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id={`dots-j-${l.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.5" fill="white" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#dots-j-${l.id})`} />
                </svg>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20" style={{ background: "radial-gradient(circle, hsl(270, 80%, 70%), transparent)" }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-15" style={{ background: "radial-gradient(circle, hsl(280, 70%, 60%), transparent)" }} />

                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-white/60" />
                      <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">Office Location</span>
                    </div>
                    <h3 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight leading-none mb-2">{l.name}</h3>
                    <p className="text-white/80 text-base md:text-lg font-medium">{l.address}, {l.city}</p>
                  </div>
                </div>
              </div>

              {/* Weekly grid */}
              <div className="p-5 bg-white">
                {renderWeekRow(l, avail)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Zocdoc-style popup dialog */}
      {dialogOpen && activeLocId && date && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => { setDialogOpen(false); setSlot(null); }} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto z-10"
          >
            {/* Close button */}
            <button onClick={() => { setDialogOpen(false); setSlot(null); }} className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center z-20">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="p-6 md:p-8">
              {/* Header */}
              <h3 className="font-display text-2xl text-foreground mb-1">Book an appointment</h3>

              {/* Location info */}
              <div className="flex items-start gap-3 mt-4 mb-6 pb-6 border-b border-border/20">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, hsl(270, 60%, 25%), hsl(280, 50%, 40%))" }}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-foreground">{activeLoc?.name} Office</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">{activeLoc?.address}, {activeLoc?.city}</p>
                </div>
              </div>

              {confirmation ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
                  <h4 className="font-display text-2xl text-foreground mb-2">You're booked!</h4>
                  <p className="text-muted-foreground text-sm mb-4">Reference: <span className="font-mono font-bold text-foreground text-lg">{confirmation.confirmation_code}</span></p>
                  <div className="bg-secondary/30 rounded-xl p-4 text-sm space-y-1.5 text-left">
                    <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-semibold">{confirmation.date}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-semibold">{fmt12(confirmation.start_time)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-semibold">{activeLoc?.name}</span></div>
                  </div>
                  <button onClick={() => { setDialogOpen(false); setConfirmation(null); setSlot(null); setDate(null); }}
                    className="mt-5 bg-primary text-primary-foreground font-semibold text-sm py-3 px-8 rounded-xl hover:bg-primary/90">
                    Done
                  </button>
                </div>
              ) : slot ? (
                /* Booking form after selecting a slot */
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center gap-2 mb-5">
                    <button onClick={() => setSlot(null)} className="text-primary text-sm flex items-center gap-1 hover:underline"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <span className="text-muted-foreground text-sm">|</span>
                    <span className="text-sm font-semibold text-foreground">{date && format(date, "EEE, MMM d")} · {fmt12(slot.startTime)}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                      <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    </div>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className="w-full px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    <button onClick={() => { if (!firstName.trim() || !lastName.trim() || !email.trim()) { toast({ title: "Fill required fields", variant: "destructive" }); return; } bookMutation.mutate(); }}
                      disabled={bookMutation.isPending}
                      className="w-full bg-primary text-primary-foreground font-semibold text-sm py-3.5 rounded-xl hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                      {bookMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : "Confirm Appointment"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Time slots view — Zocdoc style */
                <div>
                  {/* Available appointments for selected date */}
                  <h4 className="font-display text-lg font-bold text-foreground mb-1">Available appointments</h4>
                  <p className="text-foreground font-semibold text-sm mb-3">{format(date, "EEE, MMM d")}</p>
                  {timeSlots.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4">No openings on this date</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {timeSlots.map((s: any) => (
                        <button key={`${s.availabilityId}-${s.startTime}`}
                          onClick={() => { setSlot(s); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); }}
                          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-amber-300 hover:bg-amber-400 text-foreground">
                          {fmt12(s.startTime)}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* More availability — next available dates */}
                  {(() => {
                    const moreDays: { day: Date; slots: any[] }[] = [];
                    for (let i = 1; i <= 14 && moreDays.length < 3; i++) {
                      const nextDay = addDays(date, i);
                      const nextSlots = activeAvail.getTimeSlots(nextDay);
                      if (nextSlots.length > 0) moreDays.push({ day: nextDay, slots: nextSlots });
                    }
                    if (moreDays.length === 0) return null;
                    return (
                      <div className="border-t border-border/20 pt-5">
                        <h4 className="font-display text-lg font-bold text-foreground mb-4">More availability</h4>
                        <div className="space-y-5">
                          {moreDays.map(({ day: d, slots }) => (
                            <div key={d.toISOString()}>
                              <p className="text-foreground font-semibold text-sm mb-2">{format(d, "EEE, MMM d")}</p>
                              <div className="flex flex-wrap gap-2">
                                {slots.map((s: any) => (
                                  <button key={`${s.availabilityId}-${s.startTime}`}
                                    onClick={() => { setDate(d); setSlot(s); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); }}
                                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all bg-amber-300 hover:bg-amber-400 text-foreground">
                                    {fmt12(s.startTime)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIATION K — "Bold Weekly" — Giant date headers per location
   ═══════════════════════════════════════════════════════════ */
function VariationK() {
  const { toast } = useToast();
  const { locations } = useSchedulingData();
  const [weekStart, setWeekStart] = useState(() => startOfDay(new Date()));
  const [activeLocId, setActiveLocId] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [slot, setSlot] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const hobokenLoc = locations.find(l => l.name === "Hoboken");
  const edisonLoc = locations.find(l => l.name === "Edison");
  const hobokenAvail = useAvailability(hobokenLoc?.id || "");
  const edisonAvail = useAvailability(edisonLoc?.id || "");
  const activeAvail = activeLocId === hobokenLoc?.id ? hobokenAvail : edisonAvail;
  const activeLoc = locations.find(l => l.id === activeLocId);
  const timeSlots = useMemo(() => activeAvail.getTimeSlots(date), [date, activeAvail]);
  const today = startOfDay(new Date());
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const getSlotCountForDay = (avail: ReturnType<typeof useAvailability>, day: Date) => {
    const ds = format(day, "yyyy-MM-dd");
    if (!avail.availableDates.includes(ds) || isBefore(day, today)) return 0;
    return avail.getTimeSlots(day).length;
  };

  const bookMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: slot.availabilityId, p_slot_start: slot.startTime, p_slot_end: slot.endTime,
        p_patient_first_name: firstName.trim(), p_patient_last_name: lastName.trim(),
        p_patient_email: email.trim(), p_patient_phone: phone.trim() || undefined,
      });
      if (error) throw error;
      const result = data as any;
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (r) => { setConfirmation(r); activeAvail.refetchAppointments(); },
    onError: (e: any) => { toast({ title: "Booking failed", description: e.message, variant: "destructive" }); },
  });

  const renderLocationBlock = (loc: typeof hobokenLoc, avail: ReturnType<typeof useAvailability>) => {
    if (!loc) return null;
    return (
      <div className="rounded-3xl overflow-hidden border-2 border-border/20">
        {/* Purple header */}
        <div className="relative overflow-hidden py-8 px-8" style={{ background: "linear-gradient(135deg, hsl(270, 60%, 25%) 0%, hsl(280, 50%, 40%) 50%, hsl(260, 55%, 30%) 100%)" }}>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-white/60" />
              <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">Office Location</span>
            </div>
            <h3 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight">{loc.name}</h3>
            <p className="text-white/80 text-base mt-1">{loc.address}, {loc.city}</p>
          </div>
        </div>

        {/* BIG date headers + slots */}
        <div className="p-6 md:p-8 bg-white">
          {/* Week range — now LARGE */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setWeekStart(addDays(weekStart, -7))} disabled={isBefore(addDays(weekStart, -7), today)}
              className="w-11 h-11 rounded-full border-2 border-border/30 flex items-center justify-center hover:bg-secondary disabled:opacity-30">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <p className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {format(weekDays[0], "MMMM d")} — {format(weekDays[6], "MMMM d, yyyy")}
              </p>
              <p className="text-muted-foreground text-sm mt-1">Select a day to view available times</p>
            </div>
            <button onClick={() => setWeekStart(addDays(weekStart, 7))}
              className="w-11 h-11 rounded-full border-2 border-border/30 flex items-center justify-center hover:bg-secondary">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Giant date cards */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map(day => {
              const count = getSlotCountForDay(avail, day);
              const hasSlots = count > 0;
              const isToday2 = isSameDay(day, today);
              return (
                <button
                  key={day.toISOString()}
                  disabled={!hasSlots}
                  onClick={() => { setActiveLocId(loc.id); setDate(day); setSlot(null); setDialogOpen(true); }}
                  className={`rounded-2xl p-3 md:p-4 text-center transition-all border-2 ${
                    hasSlots
                      ? "bg-amber-50 border-amber-300 hover:bg-amber-100 hover:border-amber-400 hover:shadow-lg cursor-pointer"
                      : "bg-secondary/20 border-border/10 cursor-not-allowed opacity-50"
                  }`}
                >
                  <span className={`block text-xs uppercase tracking-wider font-bold mb-1 ${hasSlots ? "text-primary" : "text-muted-foreground/50"}`}>
                    {format(day, "EEE")}
                  </span>
                  <span className={`block font-display text-3xl md:text-4xl font-bold leading-none mb-1 ${
                    isToday2 && hasSlots ? "text-primary" : hasSlots ? "text-foreground" : "text-muted-foreground/30"
                  }`}>
                    {format(day, "d")}
                  </span>
                  <span className={`block text-sm font-semibold ${hasSlots ? "text-foreground/70" : "text-muted-foreground/30"}`}>
                    {format(day, "MMM")}
                  </span>
                  {hasSlots && (
                    <span className="block mt-2 text-xs font-bold text-primary bg-primary/10 rounded-full py-1 px-2">
                      {count} slot{count !== 1 ? "s" : ""}
                    </span>
                  )}
                  {!hasSlots && (
                    <span className="block mt-2 text-[10px] text-muted-foreground/30">—</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl md:text-5xl text-foreground tracking-tight mb-3">Book an In-Person Visit</h2>
        <p className="text-muted-foreground text-base">See every available date — click to book</p>
      </div>

      <div className="space-y-8">
        {renderLocationBlock(hobokenLoc, hobokenAvail)}
        {renderLocationBlock(edisonLoc, edisonAvail)}
      </div>

      {/* Reuse same dialog from J */}
      {dialogOpen && activeLocId && date && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => { setDialogOpen(false); setSlot(null); }} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto z-10">
            <button onClick={() => { setDialogOpen(false); setSlot(null); }} className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center z-20">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="p-6 md:p-8">
              <h3 className="font-display text-2xl text-foreground mb-1">Book an appointment</h3>
              <div className="flex items-start gap-3 mt-4 mb-6 pb-6 border-b border-border/20">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, hsl(270, 60%, 25%), hsl(280, 50%, 40%))" }}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-foreground">{activeLoc?.name} Office</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">{activeLoc?.address}, {activeLoc?.city}</p>
                </div>
              </div>
              {confirmation ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
                  <h4 className="font-display text-2xl text-foreground mb-2">You're booked!</h4>
                  <p className="text-muted-foreground text-sm mb-4">Reference: <span className="font-mono font-bold text-foreground text-lg">{confirmation.confirmation_code}</span></p>
                  <button onClick={() => { setDialogOpen(false); setConfirmation(null); setSlot(null); setDate(null); }}
                    className="mt-5 bg-primary text-primary-foreground font-semibold text-sm py-3 px-8 rounded-xl hover:bg-primary/90">Done</button>
                </div>
              ) : slot ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center gap-2 mb-5">
                    <button onClick={() => setSlot(null)} className="text-primary text-sm flex items-center gap-1 hover:underline"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <span className="text-muted-foreground text-sm">|</span>
                    <span className="text-sm font-semibold text-foreground">{date && format(date, "EEE, MMM d")} · {fmt12(slot.startTime)}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                      <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    </div>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className="w-full px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    <button onClick={() => { if (!firstName.trim() || !lastName.trim() || !email.trim()) { toast({ title: "Fill required fields", variant: "destructive" }); return; } bookMutation.mutate(); }}
                      disabled={bookMutation.isPending}
                      className="w-full bg-primary text-primary-foreground font-semibold text-sm py-3.5 rounded-xl hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                      {bookMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : "Confirm Appointment"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-1">Available appointments</h4>
                  <p className="text-foreground font-semibold text-sm mb-3">{format(date, "EEEE, MMMM d")}</p>
                  {timeSlots.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4">No openings on this date</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {timeSlots.map((s: any) => (
                        <button key={`${s.availabilityId}-${s.startTime}`}
                          onClick={() => { setSlot(s); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); }}
                          className="px-4 py-2 rounded-lg text-sm font-semibold bg-amber-300 hover:bg-amber-400 text-foreground">{fmt12(s.startTime)}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIATION L — "Monthly Calendar View" — Full month grid
   with expand/collapse per location
   ═══════════════════════════════════════════════════════════ */
function VariationL() {
  const { toast } = useToast();
  const { locations } = useSchedulingData();
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [expandedLoc, setExpandedLoc] = useState<string | null>(null);
  const [activeLocId, setActiveLocId] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [slot, setSlot] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const hobokenLoc = locations.find(l => l.name === "Hoboken");
  const edisonLoc = locations.find(l => l.name === "Edison");
  const hobokenAvail = useAvailability(hobokenLoc?.id || "");
  const edisonAvail = useAvailability(edisonLoc?.id || "");
  const activeAvail = activeLocId === hobokenLoc?.id ? hobokenAvail : edisonAvail;
  const activeLoc = locations.find(l => l.id === activeLocId);
  const timeSlots = useMemo(() => activeAvail.getTimeSlots(date), [date, activeAvail]);
  const today = startOfDay(new Date());

  const bookMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: slot.availabilityId, p_slot_start: slot.startTime, p_slot_end: slot.endTime,
        p_patient_first_name: firstName.trim(), p_patient_last_name: lastName.trim(),
        p_patient_email: email.trim(), p_patient_phone: phone.trim() || undefined,
      });
      if (error) throw error;
      const result = data as any;
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (r) => { setConfirmation(r); activeAvail.refetchAppointments(); },
    onError: (e: any) => { toast({ title: "Booking failed", description: e.message, variant: "destructive" }); },
  });

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const firstDayOffset = getDay(monthDays[0]); // 0=Sun

  const getSlotCountForDay = (avail: ReturnType<typeof useAvailability>, day: Date) => {
    const ds = format(day, "yyyy-MM-dd");
    if (!avail.availableDates.includes(ds) || isBefore(day, today)) return 0;
    return avail.getTimeSlots(day).length;
  };

  const renderMonthGrid = (loc: typeof hobokenLoc, avail: ReturnType<typeof useAvailability>) => {
    if (!loc) return null;
    const isExpanded = expandedLoc === loc.id || expandedLoc === null;

    return (
      <div className="rounded-3xl overflow-hidden border-2 border-border/20">
        {/* Header — always visible */}
        <button
          onClick={() => setExpandedLoc(expandedLoc === loc.id ? null : loc.id)}
          className="w-full relative overflow-hidden py-8 px-8 text-left"
          style={{ background: "linear-gradient(135deg, hsl(270, 60%, 25%) 0%, hsl(280, 50%, 40%) 50%, hsl(260, 55%, 30%) 100%)" }}
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-white/60" />
                <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">Office Location</span>
              </div>
              <h3 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight">{loc.name}</h3>
              <p className="text-white/80 text-base mt-1">{loc.address}, {loc.city}</p>
            </div>
            <ChevronRight className={`w-8 h-8 text-white/50 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
          </div>
        </button>

        {/* Collapsible month grid */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 md:p-8 bg-white">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-8">
                  <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="w-11 h-11 rounded-full border-2 border-border/30 flex items-center justify-center hover:bg-secondary">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h4 className="font-display text-3xl md:text-4xl font-bold text-foreground">{format(currentMonth, "MMMM yyyy")}</h4>
                  <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="w-11 h-11 rounded-full border-2 border-border/30 flex items-center justify-center hover:bg-secondary">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Day of week headers */}
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                    <div key={d} className="text-center text-sm font-bold text-muted-foreground uppercase tracking-wider py-2">{d}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for offset */}
                  {Array.from({ length: firstDayOffset }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {monthDays.map(day => {
                    const count = getSlotCountForDay(avail, day);
                    const hasSlots = count > 0;
                    const isPast = isBefore(day, today);
                    const isToday2 = isSameDay(day, today);
                    return (
                      <button
                        key={day.toISOString()}
                        disabled={!hasSlots}
                        onClick={() => { setActiveLocId(loc.id); setDate(day); setSlot(null); setDialogOpen(true); }}
                        className={`rounded-xl p-2 md:p-3 text-center transition-all border-2 aspect-square flex flex-col items-center justify-center ${
                          hasSlots
                            ? "bg-amber-50 border-amber-300 hover:bg-amber-100 hover:border-amber-400 hover:shadow-md cursor-pointer"
                            : isPast
                              ? "border-transparent opacity-30"
                              : "border-border/10 opacity-50"
                        }`}
                      >
                        <span className={`block font-display text-xl md:text-2xl font-bold leading-none ${
                          isToday2 ? "text-primary" : hasSlots ? "text-foreground" : "text-muted-foreground/40"
                        }`}>
                          {format(day, "d")}
                        </span>
                        {hasSlots && (
                          <span className="block mt-1 text-[10px] font-bold text-primary">
                            {count} slot{count !== 1 ? "s" : ""}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl md:text-5xl text-foreground tracking-tight mb-3">Book an In-Person Visit</h2>
        <p className="text-muted-foreground text-base">See the full month — click any highlighted date to book</p>
      </div>

      <div className="space-y-6">
        {renderMonthGrid(hobokenLoc, hobokenAvail)}
        {renderMonthGrid(edisonLoc, edisonAvail)}
      </div>

      {/* Dialog */}
      {dialogOpen && activeLocId && date && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => { setDialogOpen(false); setSlot(null); }} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto z-10">
            <button onClick={() => { setDialogOpen(false); setSlot(null); }} className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center z-20">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="p-6 md:p-8">
              <h3 className="font-display text-2xl text-foreground mb-1">Book an appointment</h3>
              <div className="flex items-start gap-3 mt-4 mb-6 pb-6 border-b border-border/20">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, hsl(270, 60%, 25%), hsl(280, 50%, 40%))" }}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-foreground">{activeLoc?.name} Office</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">{activeLoc?.address}, {activeLoc?.city}</p>
                </div>
              </div>
              {confirmation ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
                  <h4 className="font-display text-2xl text-foreground mb-2">You're booked!</h4>
                  <p className="text-muted-foreground text-sm mb-4">Reference: <span className="font-mono font-bold text-foreground text-lg">{confirmation.confirmation_code}</span></p>
                  <button onClick={() => { setDialogOpen(false); setConfirmation(null); setSlot(null); setDate(null); }}
                    className="mt-5 bg-primary text-primary-foreground font-semibold text-sm py-3 px-8 rounded-xl hover:bg-primary/90">Done</button>
                </div>
              ) : slot ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center gap-2 mb-5">
                    <button onClick={() => setSlot(null)} className="text-primary text-sm flex items-center gap-1 hover:underline"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <span className="text-muted-foreground text-sm">|</span>
                    <span className="text-sm font-semibold text-foreground">{date && format(date, "EEE, MMM d")} · {fmt12(slot.startTime)}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                      <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    </div>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className="w-full px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    <button onClick={() => { if (!firstName.trim() || !lastName.trim() || !email.trim()) { toast({ title: "Fill required fields", variant: "destructive" }); return; } bookMutation.mutate(); }}
                      disabled={bookMutation.isPending}
                      className="w-full bg-primary text-primary-foreground font-semibold text-sm py-3.5 rounded-xl hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                      {bookMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : "Confirm Appointment"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-1">Available appointments</h4>
                  <p className="text-foreground font-semibold text-sm mb-3">{format(date, "EEEE, MMMM d")}</p>
                  {timeSlots.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4">No openings on this date</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {timeSlots.map((s: any) => (
                        <button key={`${s.availabilityId}-${s.startTime}`}
                          onClick={() => { setSlot(s); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); }}
                          className="px-4 py-2 rounded-lg text-sm font-semibold bg-amber-300 hover:bg-amber-400 text-foreground">{fmt12(s.startTime)}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   VARIATION M — "Hybrid Toggle" — Week/Month toggle with
   oversized dates and both locations always visible
   ═══════════════════════════════════════════════════════════ */
function VariationM() {
  const { toast } = useToast();
  const { locations } = useSchedulingData();
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [weekStart, setWeekStart] = useState(() => startOfDay(new Date()));
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [activeLocId, setActiveLocId] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [slot, setSlot] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const hobokenLoc = locations.find(l => l.name === "Hoboken");
  const edisonLoc = locations.find(l => l.name === "Edison");
  const hobokenAvail = useAvailability(hobokenLoc?.id || "");
  const edisonAvail = useAvailability(edisonLoc?.id || "");
  const activeAvail = activeLocId === hobokenLoc?.id ? hobokenAvail : edisonAvail;
  const activeLoc = locations.find(l => l.id === activeLocId);
  const timeSlots = useMemo(() => activeAvail.getTimeSlots(date), [date, activeAvail]);
  const today = startOfDay(new Date());
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);
  const firstDayOffset = getDay(monthDays[0]);

  const getSlotCountForDay = (avail: ReturnType<typeof useAvailability>, day: Date) => {
    const ds = format(day, "yyyy-MM-dd");
    if (!avail.availableDates.includes(ds) || isBefore(day, today)) return 0;
    return avail.getTimeSlots(day).length;
  };

  const bookMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: slot.availabilityId, p_slot_start: slot.startTime, p_slot_end: slot.endTime,
        p_patient_first_name: firstName.trim(), p_patient_last_name: lastName.trim(),
        p_patient_email: email.trim(), p_patient_phone: phone.trim() || undefined,
      });
      if (error) throw error;
      const result = data as any;
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (r) => { setConfirmation(r); activeAvail.refetchAppointments(); },
    onError: (e: any) => { toast({ title: "Booking failed", description: e.message, variant: "destructive" }); },
  });

  const renderDayCell = (day: Date, avail: ReturnType<typeof useAvailability>, loc: typeof hobokenLoc, large: boolean) => {
    if (!loc) return null;
    const count = getSlotCountForDay(avail, day);
    const hasSlots = count > 0;
    const isToday2 = isSameDay(day, today);
    return (
      <button
        key={day.toISOString()}
        disabled={!hasSlots}
        onClick={() => { setActiveLocId(loc.id); setDate(day); setSlot(null); setDialogOpen(true); }}
        className={`rounded-xl ${large ? "p-3 md:p-4" : "p-2"} text-center transition-all border-2 flex flex-col items-center justify-center ${
          hasSlots
            ? "bg-amber-50 border-amber-300 hover:bg-amber-100 hover:border-amber-400 hover:shadow-md cursor-pointer"
            : "border-border/10 opacity-40 cursor-not-allowed"
        }`}
      >
        {large && (
          <span className={`block text-xs uppercase tracking-wider font-bold mb-0.5 ${hasSlots ? "text-primary" : "text-muted-foreground/40"}`}>
            {format(day, "EEE")}
          </span>
        )}
        <span className={`block font-display ${large ? "text-3xl md:text-4xl" : "text-lg md:text-xl"} font-bold leading-none ${
          isToday2 ? "text-primary" : hasSlots ? "text-foreground" : "text-muted-foreground/30"
        }`}>
          {format(day, "d")}
        </span>
        {large && (
          <span className={`block text-sm font-semibold ${hasSlots ? "text-foreground/70" : "text-muted-foreground/30"}`}>
            {format(day, "MMM")}
          </span>
        )}
        {hasSlots && (
          <span className={`block ${large ? "mt-2 text-xs" : "mt-1 text-[9px]"} font-bold text-primary`}>
            {count} slot{count !== 1 ? "s" : ""}
          </span>
        )}
      </button>
    );
  };

  const renderLocationSection = (loc: typeof hobokenLoc, avail: ReturnType<typeof useAvailability>) => {
    if (!loc) return null;
    return (
      <div className="rounded-3xl overflow-hidden border-2 border-border/20">
        {/* Header */}
        <div className="relative overflow-hidden py-8 px-8" style={{ background: "linear-gradient(135deg, hsl(270, 60%, 25%) 0%, hsl(280, 50%, 40%) 50%, hsl(260, 55%, 30%) 100%)" }}>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-white/60" />
              <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">Office Location</span>
            </div>
            <h3 className="font-display text-4xl md:text-5xl text-white font-bold tracking-tight">{loc.name}</h3>
            <p className="text-white/80 text-base mt-1">{loc.address}, {loc.city}</p>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-white">
          {viewMode === "week" ? (
            <>
              {/* Week nav — BIG */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setWeekStart(addDays(weekStart, -7))} disabled={isBefore(addDays(weekStart, -7), today)}
                  className="w-11 h-11 rounded-full border-2 border-border/30 flex items-center justify-center hover:bg-secondary disabled:opacity-30">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <p className="font-display text-xl md:text-2xl font-bold text-foreground text-center">
                  {format(weekDays[0], "MMMM d")} — {format(weekDays[6], "MMMM d, yyyy")}
                </p>
                <button onClick={() => setWeekStart(addDays(weekStart, 7))}
                  className="w-11 h-11 rounded-full border-2 border-border/30 flex items-center justify-center hover:bg-secondary">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map(day => renderDayCell(day, avail, loc, true))}
              </div>
            </>
          ) : (
            <>
              {/* Month nav */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="w-11 h-11 rounded-full border-2 border-border/30 flex items-center justify-center hover:bg-secondary">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h4 className="font-display text-3xl md:text-4xl font-bold text-foreground">{format(currentMonth, "MMMM yyyy")}</h4>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="w-11 h-11 rounded-full border-2 border-border/30 flex items-center justify-center hover:bg-secondary">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                  <div key={d} className="text-center text-xs font-bold text-muted-foreground uppercase tracking-wider py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`e-${i}`} />)}
                {monthDays.map(day => renderDayCell(day, avail, loc, false))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="font-display text-3xl md:text-5xl text-foreground tracking-tight mb-3">Book an In-Person Visit</h2>
        <p className="text-muted-foreground text-base mb-6">Choose your view — click any highlighted date to book</p>

        {/* Toggle */}
        <div className="inline-flex rounded-xl border-2 border-border/20 overflow-hidden">
          <button onClick={() => setViewMode("week")}
            className={`px-6 py-3 text-sm font-bold transition-all ${viewMode === "week" ? "bg-primary text-primary-foreground" : "bg-white text-foreground hover:bg-secondary"}`}>
            <Calendar className="w-4 h-4 inline-block mr-2" />Weekly View
          </button>
          <button onClick={() => setViewMode("month")}
            className={`px-6 py-3 text-sm font-bold transition-all ${viewMode === "month" ? "bg-primary text-primary-foreground" : "bg-white text-foreground hover:bg-secondary"}`}>
            <Calendar className="w-4 h-4 inline-block mr-2" />Monthly View
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {renderLocationSection(hobokenLoc, hobokenAvail)}
        {renderLocationSection(edisonLoc, edisonAvail)}
      </div>

      {/* Dialog */}
      {dialogOpen && activeLocId && date && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => { setDialogOpen(false); setSlot(null); }} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto z-10">
            <button onClick={() => { setDialogOpen(false); setSlot(null); }} className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center z-20">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="p-6 md:p-8">
              <h3 className="font-display text-2xl text-foreground mb-1">Book an appointment</h3>
              <div className="flex items-start gap-3 mt-4 mb-6 pb-6 border-b border-border/20">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, hsl(270, 60%, 25%), hsl(280, 50%, 40%))" }}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-foreground">{activeLoc?.name} Office</h4>
                  <p className="text-muted-foreground text-sm mt-0.5">{activeLoc?.address}, {activeLoc?.city}</p>
                </div>
              </div>
              {confirmation ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
                  <h4 className="font-display text-2xl text-foreground mb-2">You're booked!</h4>
                  <p className="text-muted-foreground text-sm mb-4">Reference: <span className="font-mono font-bold text-foreground text-lg">{confirmation.confirmation_code}</span></p>
                  <button onClick={() => { setDialogOpen(false); setConfirmation(null); setSlot(null); setDate(null); }}
                    className="mt-5 bg-primary text-primary-foreground font-semibold text-sm py-3 px-8 rounded-xl hover:bg-primary/90">Done</button>
                </div>
              ) : slot ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center gap-2 mb-5">
                    <button onClick={() => setSlot(null)} className="text-primary text-sm flex items-center gap-1 hover:underline"><ArrowLeft className="w-3.5 h-3.5" /> Back</button>
                    <span className="text-muted-foreground text-sm">|</span>
                    <span className="text-sm font-semibold text-foreground">{date && format(date, "EEE, MMM d")} · {fmt12(slot.startTime)}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                      <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name *" className="px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    </div>
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className="w-full px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full px-4 py-3 rounded-xl border border-border/20 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30" />
                    <button onClick={() => { if (!firstName.trim() || !lastName.trim() || !email.trim()) { toast({ title: "Fill required fields", variant: "destructive" }); return; } bookMutation.mutate(); }}
                      disabled={bookMutation.isPending}
                      className="w-full bg-primary text-primary-foreground font-semibold text-sm py-3.5 rounded-xl hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2">
                      {bookMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : "Confirm Appointment"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-1">Available appointments</h4>
                  <p className="text-foreground font-semibold text-sm mb-3">{format(date, "EEEE, MMMM d")}</p>
                  {timeSlots.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4">No openings on this date</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {timeSlots.map((s: any) => (
                        <button key={`${s.availabilityId}-${s.startTime}`}
                          onClick={() => { setSlot(s); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); }}
                          className="px-4 py-2 rounded-lg text-sm font-semibold bg-amber-300 hover:bg-amber-400 text-foreground">{fmt12(s.startTime)}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHOWCASE PAGE
   ═══════════════════════════════════════════════════════════ */
export default function NJPatientScheduleShowcase() {
  return (
    <div className="min-h-screen bg-background font-body">
      <NJNavbar />

      <section className="py-16 md:py-24" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), hsl(0, 0%, 100%))' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/50 font-medium mb-4">Layout Showcase</p>
          <h1 className="font-display text-5xl md:text-7xl text-foreground tracking-tight mb-4">
            Patient Scheduling <em className="text-primary" style={{ fontStyle: "italic" }}>Variations</em>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Thirteen layouts — newest bold-date designs at the top.</p>
        </div>
      </section>

      {/* G */}
      <section className="py-20 md:py-28 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">★ Variation G — Recommended</span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">Location-First Hero Cards</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-md">Giant photo cards with clear "Pick your location" messaging. Calendar reveals below once selected.</p>
          </div>
          <div className="bg-secondary/10 rounded-3xl border border-border/10 p-8 md:p-14"><VariationG /></div>
        </div>
      </section>

      {/* H */}
      <section className="py-20 md:py-28 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">★ Variation H</span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">Dual Calendar (Both Locations)</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-md">Both calendars visible side by side. Compare availability across offices at a glance.</p>
          </div>
          <div className="bg-secondary/10 rounded-3xl border border-border/10 p-8 md:p-14"><VariationH /></div>
        </div>
      </section>

      {/* I */}
      <section className="py-20 md:py-28 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">★ Variation I</span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">Full-Width Tabs + Inline Flow</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-md">Large photo-overlay tabs. Calendar, times, and form flow vertically in one card.</p>
          </div>
          <div className="bg-secondary/10 rounded-3xl border border-border/10 p-8 md:p-14"><VariationI /></div>
        </div>
      </section>

      {/* K */}
      <section className="py-20 md:py-28 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">★ Variation K — Bold Weekly</span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">Giant Date Cards (Weekly)</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-md">Oversized date numbers with week navigation repeated per location. Impossible to miss.</p>
          </div>
          <div className="bg-secondary/10 rounded-3xl border border-border/10 p-8 md:p-14"><VariationK /></div>
        </div>
      </section>

      {/* L */}
      <section className="py-20 md:py-28 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">★ Variation L — Monthly Calendar</span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">Full Month Grid (Expand/Collapse)</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-md">See the entire month at once. Click location headers to expand/collapse and focus on one office.</p>
          </div>
          <div className="bg-secondary/10 rounded-3xl border border-border/10 p-8 md:p-14"><VariationL /></div>
        </div>
      </section>

      {/* M */}
      <section className="py-20 md:py-28 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">★ Variation M — Hybrid Toggle</span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">Week / Month Toggle</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-md">Switch between weekly and monthly views. Both locations always visible with bold date displays.</p>
          </div>
          <div className="bg-secondary/10 rounded-3xl border border-border/10 p-8 md:p-14"><VariationM /></div>
        </div>
      </section>

      {/* J */}
      <section className="py-20 md:py-28 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">Variation J</span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">Weekly Grid (Zocdoc-Style)</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-md">Original compact weekly grid.</p>
          </div>
          <div className="bg-secondary/10 rounded-3xl border border-border/10 p-8 md:p-14"><VariationJ /></div>
        </div>
      </section>

      <div className="border-b border-border/20" />
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 text-center">
        <p className="text-muted-foreground text-sm">Previous variations (A–I) below</p>
      </div>

      <section className="py-20 md:py-28 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12"><span className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">Variation A</span><h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">Vertical Stepper</h2></div>
          <div className="bg-secondary/10 rounded-3xl border border-border/10 p-8 md:p-14"><VariationA /></div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12"><span className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">Variation B</span><h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">Split Panel</h2></div>
          <VariationB />
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12"><span className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">Variation C</span><h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">All-in-One Compact</h2></div>
          <div className="bg-secondary/10 rounded-3xl border border-border/10 p-8 md:p-14"><VariationC /></div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12"><span className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">Variation D</span><h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">Dark Cinematic</h2></div>
          <VariationD />
        </div>
      </section>

      <section className="py-20 md:py-28 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12"><span className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">Variation E</span><h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">Card Stack</h2></div>
          <div className="bg-secondary/10 rounded-3xl border border-border/10 p-8 md:p-14"><VariationE /></div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-12"><span className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">Variation F</span><h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">Three-Column Dashboard</h2></div>
          <div className="bg-secondary/10 rounded-3xl border border-border/10 p-8 md:p-14"><VariationF /></div>
        </div>
      </section>

      <NJFooter />
    </div>
  );
}
