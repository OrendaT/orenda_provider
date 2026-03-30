import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Clock, CheckCircle2, ArrowLeft, User, Mail, Phone, Loader2, ChevronDown } from "lucide-react";
import { format, addDays, startOfDay, isBefore, isToday, addWeeks } from "date-fns";

interface SlotInfo {
  availabilityId: string;
  providerName: string;
  startTime: string;
  endTime: string;
  booked: number;
  capacity: number;
}

type MobileStep = "locations" | "schedule" | "info" | "confirming" | "confirmed";

const WEEKS_PER_LOAD = 2;

export default function MobileBookingFlow() {
  const { toast } = useToast();
  const [step, setStep] = useState<MobileStep>("locations");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [weeksLoaded, setWeeksLoaded] = useState(WEEKS_PER_LOAD);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmationData, setConfirmationData] = useState<any>(null);

  const { data: locations = [] } = useQuery({
    queryKey: ["scheduling-locations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("locations").select("*").eq("active", true).order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: allAvailability = [] } = useQuery({
    queryKey: ["provider-availability-all"],
    queryFn: async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("provider_office_availability")
        .select("*")
        .eq("status", "active")
        .gte("office_date", today)
        .order("office_date");
      if (error) throw error;
      return data;
    },
  });

  const { data: allExistingAppointments = [], refetch: refetchAppointments } = useQuery({
    queryKey: ["existing-appointments-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_appointments")
        .select("id, provider_availability_id, slot_start, location_id, appointment_status")
        .neq("appointment_status", "cancelled");
      if (error) throw error;
      return data;
    },
  });

  const sortedLocations = useMemo(() => {
    return [...locations].sort((a, b) => {
      const aH = a.name.toLowerCase().includes("hoboken") || a.city.toLowerCase().includes("hoboken");
      const bH = b.name.toLowerCase().includes("hoboken") || b.city.toLowerCase().includes("hoboken");
      if (aH && !bH) return -1;
      if (!aH && bH) return 1;
      return 0;
    });
  }, [locations]);

  const selectedLocation = locations.find(l => l.id === selectedLocationId);
  const today = startOfDay(new Date());

  const formatTime12 = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  // Get next available date for a location
  const getNextAvailable = (locId: string) => {
    const locAvail = allAvailability.filter(a => a.location_id === locId);
    const todayStr = format(new Date(), "yyyy-MM-dd");
    for (const a of locAvail) {
      if (a.office_date >= todayStr) {
        const slots = getSlotsForDate(a.office_date, locId);
        if (slots.length > 0) {
          return new Date(a.office_date + "T12:00:00");
        }
      }
    }
    return null;
  };

  // Get available slots for a specific date and location
  const getSlotsForDate = (dateStr: string, locId: string): SlotInfo[] => {
    const dayAvailability = allAvailability.filter(a => a.location_id === locId && a.office_date === dateStr);
    const locAppts = allExistingAppointments.filter(a => a.location_id === locId);
    const slots: SlotInfo[] = [];

    for (const avail of dayAvailability) {
      const [startH, startM] = avail.start_time.split(":").map(Number);
      const [endH, endM] = avail.end_time.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      const duration = avail.appointment_duration_minutes;

      for (let m = startMinutes; m + duration <= endMinutes; m += duration) {
        const slotStartH = Math.floor(m / 60);
        const slotStartM = m % 60;
        const slotEndH = Math.floor((m + duration) / 60);
        const slotEndM = (m + duration) % 60;
        const slotStart = `${String(slotStartH).padStart(2, "0")}:${String(slotStartM).padStart(2, "0")}:00`;
        const slotEnd = `${String(slotEndH).padStart(2, "0")}:${String(slotEndM).padStart(2, "0")}:00`;

        const bookedCount = locAppts.filter(
          apt => apt.provider_availability_id === avail.id && apt.slot_start === slotStart
        ).length;

        if (bookedCount < avail.slot_capacity) {
          slots.push({
            availabilityId: avail.id,
            providerName: avail.provider_name,
            startTime: slotStart,
            endTime: slotEnd,
            booked: bookedCount,
            capacity: avail.slot_capacity,
          });
        }
      }
    }
    return slots;
  };

  // Get grouped availability for the schedule view
  const groupedAvailability = useMemo(() => {
    if (!selectedLocationId) return [];
    const endDate = addWeeks(today, weeksLoaded);
    const days: { date: Date; dateStr: string; slots: SlotInfo[] }[] = [];

    for (let d = new Date(today); d <= endDate; d = addDays(d, 1)) {
      const dateStr = format(d, "yyyy-MM-dd");
      const slots = getSlotsForDate(dateStr, selectedLocationId);
      if (slots.length > 0) {
        days.push({ date: new Date(d), dateStr, slots });
      }
    }
    return days;
  }, [selectedLocationId, allAvailability, allExistingAppointments, weeksLoaded, today]);

  // Check if there's more availability beyond current window
  const hasMoreAvailability = useMemo(() => {
    if (!selectedLocationId) return false;
    const endDate = format(addWeeks(today, weeksLoaded), "yyyy-MM-dd");
    return allAvailability.some(a => a.location_id === selectedLocationId && a.office_date > endDate);
  }, [selectedLocationId, allAvailability, weeksLoaded, today]);

  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!selectedSlot) throw new Error("No slot selected");
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: selectedSlot.availabilityId,
        p_slot_start: selectedSlot.startTime,
        p_slot_end: selectedSlot.endTime,
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
    onSuccess: (result) => {
      setConfirmationData(result);
      setStep("confirmed");
      refetchAppointments();
    },
    onError: (err: any) => {
      toast({ title: "Booking failed", description: err.message || "Please try again.", variant: "destructive" });
      refetchAppointments();
      setStep("schedule");
      setSelectedSlot(null);
    },
  });

  const handleBook = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setStep("confirming");
    bookMutation.mutate();
  };

  const resetBooking = () => {
    setStep("locations");
    setSelectedLocationId("");
    setSelectedSlot(null);
    setWeeksLoaded(WEEKS_PER_LOAD);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setConfirmationData(null);
  };

  const openSchedule = (locId: string) => {
    setSelectedLocationId(locId);
    setWeeksLoaded(WEEKS_PER_LOAD);
    setStep("schedule");
  };

  // Address display helpers
  const getLocationAddress = (loc: typeof locations[0]) => {
    if (loc.name.toLowerCase().includes("hoboken") || loc.city.toLowerCase().includes("hoboken")) {
      return "221 River Street, 9th Floor, Hoboken, NJ 07030";
    }
    return "110 Fieldcrest Avenue, 3rd Floor, Edison, NJ 08837";
  };

  const getLocationShortName = (loc: typeof locations[0]) => {
    if (loc.name.toLowerCase().includes("hoboken") || loc.city.toLowerCase().includes("hoboken")) return "Hoboken";
    return "Edison";
  };

  return (
    <div className="md:hidden">
      <AnimatePresence mode="wait">
        {/* STEP 1: Location Cards */}
        {step === "locations" && (
          <motion.div key="locations" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 px-4">
            {sortedLocations.map((loc) => {
              const nextAvail = getNextAvailable(loc.id);
              return (
                <motion.button
                  key={loc.id}
                  onClick={() => openSchedule(loc.id)}
                  className="w-full text-left bg-white border-2 border-border/40 rounded-2xl p-5 active:scale-[0.98] transition-transform"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-foreground font-bold text-lg leading-tight">{getLocationShortName(loc)}</h3>
                      <p className="text-muted-foreground text-sm mt-0.5 leading-snug">{getLocationAddress(loc)}</p>
                    </div>
                  </div>
                  <div className="bg-primary text-primary-foreground rounded-xl py-3.5 text-center font-bold text-base">
                    {nextAvail
                      ? `Next available: ${format(nextAvail, "EEE, MMM d")}`
                      : "Book your appointment"
                    }
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* STEP 2: Schedule View — Slide up */}
        {step === "schedule" && (
          <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="bg-white min-h-[60vh] px-4 pb-8"
          >
            {/* Header */}
            <div className="flex items-center gap-3 py-4 border-b border-border/30 mb-5 sticky top-0 bg-white z-10">
              <button onClick={() => { setStep("locations"); setSelectedLocationId(""); }} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                <X className="w-6 h-6 text-foreground" />
              </button>
              <h2 className="text-foreground font-bold text-xl">Book an appointment</h2>
            </div>

            {/* Location info */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-foreground font-semibold text-base">{getLocationShortName(selectedLocation!)}</p>
                  <p className="text-muted-foreground text-sm">{getLocationAddress(selectedLocation!)}</p>
                </div>
              </div>
            </div>

            {/* Available appointments */}
            <h3 className="text-foreground font-bold text-lg mb-4">Available appointments</h3>

            {groupedAvailability.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No available appointments at this time.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {groupedAvailability.map(({ date, slots }) => (
                  <div key={date.toISOString()}>
                    <p className="text-foreground font-semibold text-base mb-3">
                      {isToday(date) ? "Today" : format(date, "EEEE, MMM d")}
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {slots.map((slot) => (
                        <button
                          key={`${slot.availabilityId}-${slot.startTime}`}
                          onClick={() => {
                            setSelectedSlot(slot);
                            setStep("info");
                          }}
                          className="bg-primary/10 text-primary font-semibold text-sm px-4 py-2.5 rounded-full active:bg-primary active:text-primary-foreground transition-colors"
                        >
                          {formatTime12(slot.startTime)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Show more button */}
                {hasMoreAvailability && (
                  <button
                    onClick={() => setWeeksLoaded(prev => prev + WEEKS_PER_LOAD)}
                    className="w-full flex items-center justify-center gap-2 py-4 text-primary font-semibold text-base border-2 border-primary/20 rounded-xl active:bg-primary/5 transition-colors"
                  >
                    <ChevronDown className="w-5 h-5" />
                    Show more availability
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 3: Patient Info */}
        {step === "info" && selectedSlot && (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white px-4 pb-8"
          >
            <div className="flex items-center gap-3 py-4 border-b border-border/30 mb-5">
              <button onClick={() => setStep("schedule")} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                <ArrowLeft className="w-6 h-6 text-foreground" />
              </button>
              <h2 className="text-foreground font-bold text-xl">Your information</h2>
            </div>

            {/* Summary */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary/60" />
                <span className="text-foreground font-medium">{getLocationShortName(selectedLocation!)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary/60" />
                <span className="text-foreground font-medium">{formatTime12(selectedSlot.startTime)} – {formatTime12(selectedSlot.endTime)}</span>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase text-muted-foreground font-semibold mb-1.5 block tracking-wide">First Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-3 py-3.5 rounded-xl border-2 border-border/30 bg-white text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="First name" />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase text-muted-foreground font-semibold mb-1.5 block tracking-wide">Last Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                      className="w-full pl-10 pr-3 py-3.5 rounded-xl border-2 border-border/30 bg-white text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Last name" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs uppercase text-muted-foreground font-semibold mb-1.5 block tracking-wide">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3.5 rounded-xl border-2 border-border/30 bg-white text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase text-muted-foreground font-semibold mb-1.5 block tracking-wide">Phone (optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-3.5 rounded-xl border-2 border-border/30 bg-white text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="(555) 555-5555" />
                </div>
              </div>
              <button onClick={handleBook} disabled={bookMutation.isPending}
                className="w-full bg-primary text-primary-foreground font-bold text-base py-4 rounded-xl flex items-center justify-center gap-2 active:bg-primary/90 transition-colors disabled:opacity-50">
                {bookMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                Confirm Booking
              </button>
            </div>
          </motion.div>
        )}

        {/* Confirming */}
        {step === "confirming" && (
          <motion.div key="confirming" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 px-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-foreground font-bold text-xl">Booking your appointment...</p>
          </motion.div>
        )}

        {/* Confirmed */}
        {step === "confirmed" && confirmationData && (
          <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="px-4 pb-8">
            <div className="text-center pt-6 mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-2xl text-foreground mb-1">You're Booked!</h3>
              <p className="text-muted-foreground text-sm">Your appointment has been confirmed.</p>
            </div>

            <div className="bg-secondary/30 border border-border/20 rounded-xl p-5 space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Confirmation</span>
                <span className="font-mono text-foreground font-bold text-lg">{confirmationData.confirmation_code}</span>
              </div>
              <div className="border-t border-border/20" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Date</p>
                  <p className="text-foreground font-semibold">{format(new Date(confirmationData.date + "T12:00:00"), "EEE, MMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Time</p>
                  <p className="text-foreground font-semibold">{formatTime12(confirmationData.start_time)} – {formatTime12(confirmationData.end_time)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Location</p>
                  <p className="text-foreground font-semibold">{getLocationShortName(selectedLocation!)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Provider</p>
                  <p className="text-foreground font-semibold">{confirmationData.provider}</p>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-xs text-center mb-5">Arrive 15 minutes early with a valid photo ID.</p>

            <button onClick={resetBooking} className="w-full text-primary font-semibold text-base py-3 text-center">
              Book another appointment
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
