import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, CheckCircle2, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, User, Mail, Phone, Loader2 } from "lucide-react";
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, startOfDay, isToday, isBefore, endOfWeek } from "date-fns";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

interface SlotInfo {
  availabilityId: string;
  providerName: string;
  startTime: string;
  endTime: string;
  booked: number;
  capacity: number;
}

type BookingStep = "browse" | "time" | "info" | "confirming" | "confirmed";

export default function PatientScheduling() {
  const { toast } = useToast();
  const [step, setStep] = useState<BookingStep>("browse");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [weekStarts, setWeekStarts] = useState<Record<string, Date>>({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmationData, setConfirmationData] = useState<any>(null);

  const getFirstAvailableWeekStart = (locId: string) => {
    const locAvail = allAvailability.filter(a => a.location_id === locId);
    if (locAvail.length > 0) {
      const firstDate = new Date(locAvail[0].office_date + "T00:00:00");
      return startOfWeek(firstDate, { weekStartsOn: 0 });
    }
    return startOfWeek(new Date(), { weekStartsOn: 0 });
  };

  const getWeekStart = (locId: string) =>
    weekStarts[locId] || getFirstAvailableWeekStart(locId);

  const setLocationWeekStart = (locId: string, date: Date) =>
    setWeekStarts(prev => ({ ...prev, [locId]: date }));

  // Fetch locations
  const { data: locations = [] } = useQuery({
    queryKey: ["scheduling-locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch ALL provider availability (not filtered by location)
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

  // Fetch ALL existing appointments
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

  // Filter availability/appointments for selected location (used in time step)
  const availability = useMemo(() =>
    allAvailability.filter(a => a.location_id === selectedLocationId),
    [allAvailability, selectedLocationId]
  );
  const existingAppointments = useMemo(() =>
    allExistingAppointments.filter(a => a.location_id === selectedLocationId),
    [allExistingAppointments, selectedLocationId]
  );

  // Generate time slots for selected date
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const dayAvailability = availability.filter(a => a.office_date === dateStr);

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

        const bookedCount = existingAppointments.filter(
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
  }, [selectedDate, availability, existingAppointments]);

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
      toast({
        title: "Booking failed",
        description: err.message || "This slot may no longer be available. Please try again.",
        variant: "destructive",
      });
      refetchAppointments();
      setStep("time");
      setSelectedSlot(null);
    },
  });

  const handleBook = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setStep("confirming");
    bookMutation.mutate();
  };

  const resetBooking = () => {
    setStep("browse");
    setSelectedLocationId("");
    setSelectedDate(null);
    setSelectedSlot(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setConfirmationData(null);
  };

  const formatTime12 = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const selectedLocation = locations.find(l => l.id === selectedLocationId);
  const today = startOfDay(new Date());

  const getSlotCountForDay = (day: Date, locId: string) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const locAvail = allAvailability.filter(a => a.location_id === locId && a.office_date === dateStr);
    const locAppts = allExistingAppointments.filter(a => a.location_id === locId);
    let count = 0;
    for (const avail of locAvail) {
      const [startH, startM] = avail.start_time.split(":").map(Number);
      const [endH, endM] = avail.end_time.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      const duration = avail.appointment_duration_minutes;
      for (let m = startMinutes; m + duration <= endMinutes; m += duration) {
        const slotStart = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}:00`;
        const bookedCount = locAppts.filter(
          apt => apt.provider_availability_id === avail.id && apt.slot_start === slotStart
        ).length;
        if (bookedCount < avail.slot_capacity) count++;
      }
    }
    return count;
  };

  const getAvailableDatesForLocation = (locId: string) =>
    allAvailability.filter(a => a.location_id === locId).map(a => a.office_date);

  // Sort locations: Hoboken first, then Edison
  const sortedLocations = useMemo(() => {
    return [...locations].sort((a, b) => {
      const aIsHoboken = a.name.toLowerCase().includes("hoboken") || a.city.toLowerCase().includes("hoboken");
      const bIsHoboken = b.name.toLowerCase().includes("hoboken") || b.city.toLowerCase().includes("hoboken");
      if (aIsHoboken && !bIsHoboken) return -1;
      if (!aIsHoboken && bIsHoboken) return 1;
      return 0;
    });
  }, [locations]);

    return (
    <section className="py-4 md:py-6 bg-card border-b border-border/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        <AnimatePresence mode="wait">
          {/* STEP 1: Browse — Side-by-Side Cards (Variation A) */}
          {step === "browse" && (
            <motion.div key="browse" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sortedLocations.map((loc) => {
                  const locWeekStart = getWeekStart(loc.id);
                  const locWeekDays = Array.from({ length: 7 }, (_, i) => addDays(locWeekStart, i));
                  const locAvailDates = getAvailableDatesForLocation(loc.id);
                  const locWeekRange = `${format(locWeekStart, "MMM d")} – ${format(addDays(locWeekStart, 6), "MMM d")}`;
                  const isHoboken = loc.name.toLowerCase().includes("hoboken") || loc.city.toLowerCase().includes("hoboken");
                  const fullAddress = isHoboken
                    ? "221 River Street, 9th Floor, Unit 9076, Hoboken, NJ 07030"
                    : "110 Fieldcrest Avenue, 3rd Floor, Edison, NJ 08837";

                  return (
                    <div key={loc.id} className={`rounded-3xl p-5 md:p-6 shadow-2xl ${isHoboken ? "bg-primary" : "bg-secondary"}`}>
                      {/* Location header */}
                      <div className="flex items-center gap-4 mb-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isHoboken ? "bg-primary-foreground/20" : "bg-primary/10"}`}>
                          <MapPin className={`w-6 h-6 ${isHoboken ? "text-primary-foreground" : "text-primary"}`} />
                        </div>
                        <div>
                          <h3 className={`font-display text-2xl md:text-3xl font-bold tracking-tight ${isHoboken ? "text-primary-foreground" : "text-foreground"}`}>{loc.name}</h3>
                          <p className={`text-xs md:text-sm font-medium ${isHoboken ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{fullAddress}</p>
                        </div>
                      </div>

                      {/* White inner card with calendar */}
                      <div className="bg-card rounded-2xl p-4 md:p-5 shadow-lg">
                        {/* Compact week nav */}
                        <div className="flex items-center justify-between mb-4 bg-primary rounded-xl px-4 py-3">
                          <button onClick={() => setLocationWeekStart(loc.id, subWeeks(locWeekStart, 1))}
                            className="w-10 h-10 rounded-xl bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-all">
                            <ChevronLeft className="w-6 h-6 text-primary-foreground" />
                          </button>
                          <p className="text-primary-foreground font-display text-base md:text-lg font-bold">{locWeekRange}</p>
                          <button onClick={() => setLocationWeekStart(loc.id, addWeeks(locWeekStart, 1))}
                            className="w-10 h-10 rounded-xl bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-all">
                            <ChevronRight className="w-6 h-6 text-primary-foreground" />
                          </button>
                        </div>

                        {/* Giant date cards */}
                        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                          {locWeekDays.map((day) => {
                            const dateStr = format(day, "yyyy-MM-dd");
                            const hasAvailability = locAvailDates.includes(dateStr);
                            const isPast = isBefore(day, today) && !isToday(day);
                            const isAvailable = hasAvailability && !isPast;
                            const slotCount = isAvailable ? getSlotCountForDay(day, loc.id) : 0;
                            const isTodayDate = isToday(day);

                            return (
                              <button
                                key={day.toISOString()}
                                disabled={!isAvailable}
                                onClick={() => {
                                  setSelectedLocationId(loc.id);
                                  setSelectedDate(day);
                                  setSelectedSlot(null);
                                  setStep("time");
                                }}
                                className={`rounded-2xl p-3 md:p-4 transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[100px] md:min-h-[130px] ${
                                  isAvailable
                                    ? "bg-primary/5 border-2 border-primary/30 hover:border-primary hover:shadow-xl hover:bg-primary/10 cursor-pointer"
                                    : isPast
                                      ? "bg-muted/20 border-2 border-transparent opacity-40 cursor-not-allowed"
                                      : "bg-muted/30 border-2 border-border/40 cursor-not-allowed"
                                } ${isTodayDate ? "ring-3 ring-primary/40 ring-offset-2" : ""}`}
                              >
                                <span className={`block text-xs md:text-sm uppercase font-bold tracking-wider mb-0.5 ${
                                  isAvailable ? "text-primary" : "text-muted-foreground"
                                }`}>
                                  {format(day, "EEE")}
                                </span>
                                <span className={`block font-display font-bold mb-0.5 ${
                                  isAvailable
                                    ? "text-3xl md:text-4xl text-foreground"
                                    : "text-2xl md:text-3xl text-foreground/60"
                                }`}>
                                  {format(day, "d")}
                                </span>
                                <span className={`block text-xs md:text-sm font-semibold ${
                                  isAvailable ? "text-foreground/70" : "text-muted-foreground/60"
                                }`}>
                                  {format(day, "MMM")}
                                </span>
                                {isAvailable && slotCount > 0 && (
                                  <span className="mt-1.5 inline-block text-[10px] md:text-xs font-bold text-primary bg-primary/10 rounded-full px-2 md:px-3 py-0.5 md:py-1">
                                    {slotCount} slot{slotCount !== 1 ? "s" : ""}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {locAvailDates.length === 0 && (
                          <p className="text-center text-muted-foreground text-sm mt-6 font-medium">No available dates at this location yet.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Time */}
          {step === "time" && selectedDate && (
            <motion.div key="time" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setStep("browse")} className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <ArrowLeft className="w-6 h-6 text-foreground" />
                </button>
                <div>
                  <h3 className="font-display text-3xl md:text-4xl text-foreground">Choose a time</h3>
                  <p className="text-muted-foreground text-lg">{selectedLocation?.name} · {format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
                </div>
              </div>

              {timeSlots.length === 0 ? (
                <div className="text-center py-16 bg-secondary/20 rounded-2xl border border-border/20">
                  <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg font-medium">No available time slots for this date.</p>
                  <button onClick={() => setStep("browse")} className="mt-5 text-primary text-base font-semibold hover:underline">
                    Choose a different date
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {timeSlots.map((slot) => (
                    <button
                      key={`${slot.availabilityId}-${slot.startTime}`}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setStep("info");
                      }}
                      className="group text-left bg-secondary/20 border-2 border-border/20 rounded-2xl p-6 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-primary/50" />
                        <span className="text-foreground font-bold text-lg">{formatTime12(slot.startTime)}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">to {formatTime12(slot.endTime)}</p>
                      <p className="text-primary/60 text-sm font-medium mt-2">{slot.providerName}</p>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: Patient Info */}
          {step === "info" && selectedSlot && selectedDate && (
            <motion.div key="info" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setStep("time")} className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <ArrowLeft className="w-6 h-6 text-foreground" />
                </button>
                <div>
                  <h3 className="font-display text-3xl md:text-4xl text-foreground">Your information</h3>
                  <p className="text-muted-foreground text-lg">
                    {selectedLocation?.name} · {format(selectedDate, "MMM d")} · {formatTime12(selectedSlot.startTime)}
                  </p>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-primary/5 border-2 border-primary/10 rounded-2xl p-7 mb-8">
                <div className="grid sm:grid-cols-3 gap-5 text-base">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary/60" />
                    <span className="text-foreground font-semibold">{selectedLocation?.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary/60" />
                    <span className="text-foreground font-semibold">{format(selectedDate, "EEEE, MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary/60" />
                    <span className="text-foreground font-semibold">{formatTime12(selectedSlot.startTime)} – {formatTime12(selectedSlot.endTime)}</span>
                  </div>
                </div>
              </div>

              <div className="max-w-lg space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-semibold mb-2 block">First Name *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                      <input
                        type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border/30 bg-white text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="First name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-semibold mb-2 block">Last Name *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                      <input
                        type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border/30 bg-white text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-semibold mb-2 block">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border/30 bg-white text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs tracking-[0.1em] uppercase text-muted-foreground font-semibold mb-2 block">Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40" />
                    <input
                      type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border/30 bg-white text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="(555) 555-5555"
                    />
                  </div>
                </div>

                <button
                  onClick={handleBook}
                  disabled={bookMutation.isPending}
                  className="w-full bg-primary text-primary-foreground text-base font-bold tracking-wider uppercase px-8 py-5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {bookMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Confirming */}
          {step === "confirming" && (
            <motion.div key="confirming" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Loader2 className="w-14 h-14 text-primary animate-spin mx-auto mb-5" />
              <p className="text-foreground font-display text-2xl">Booking your appointment...</p>
            </motion.div>
          )}

          {/* STEP 6: Confirmed */}
          {step === "confirmed" && confirmationData && (
            <motion.div key="confirmed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              <div className="text-center max-w-lg mx-auto">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="font-display text-4xl text-foreground mb-3">You're Booked!</h3>
                <p className="text-muted-foreground text-lg mb-10">Your in-person appointment has been confirmed.</p>

                <div className="bg-secondary/30 border-2 border-border/20 rounded-2xl p-8 text-left space-y-5 mb-10">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Confirmation Code</span>
                    <span className="font-mono text-foreground font-bold text-2xl">{confirmationData.confirmation_code}</span>
                  </div>
                  <div className="border-t border-border/20" />
                  <div className="grid grid-cols-2 gap-5 text-base">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Date</p>
                      <p className="text-foreground font-semibold">{format(new Date(confirmationData.date + "T12:00:00"), "EEEE, MMM d, yyyy")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Time</p>
                      <p className="text-foreground font-semibold">{formatTime12(confirmationData.start_time)} – {formatTime12(confirmationData.end_time)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Location</p>
                      <p className="text-foreground font-semibold">{selectedLocation?.name}</p>
                      <p className="text-muted-foreground text-sm">{selectedLocation?.address}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">Provider</p>
                      <p className="text-foreground font-semibold">{confirmationData.provider}</p>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-8">Please save your confirmation code. Arrive 15 minutes early with a valid photo ID.</p>

                <button
                  onClick={resetBooking}
                  className="text-primary text-base font-semibold hover:underline"
                >
                  Book another appointment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
