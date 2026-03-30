import { Link } from "react-router-dom";
import NJFooter from "@/components/NJFooter";
import NJNavbar from "@/components/NJNavbar";
import { ArrowLeft, CalendarCheck, Clock, User, Mail, Phone, MapPin, FileText, ChevronLeft, ChevronRight, Check, X, ArrowRight, Building2, AlertTriangle, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useCallback, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay, isBefore, startOfDay, isToday, addHours } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/orenda-logo-purple.png";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const TIME_BLOCKS = [
  { value: "morning", label: "Morning", time: "9 AM – 3 PM" },
  { value: "afternoon", label: "Afternoon", time: "3 PM – 9 PM" },
  { value: "full_day", label: "Full Day", time: "9 AM – 9 PM" },
] as const;

type TimeBlock = "morning" | "afternoon" | "full_day";
type VisitType = "quarterly_adhd";

interface BookingFormData {
  providerName: string;
  providerEmail: string;
  providerPhone: string;
  officeLocation: "hoboken" | "edison";
  visitType: VisitType;
  visitTypeOther: string;
  notes: string;
}

export default function NJBookHoboken({ isAdmin = false }: { isAdmin?: boolean }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<TimeBlock | null>(null);
  const [showAddendum, setShowAddendum] = useState(false);
  const [addendumAgreed, setAddendumAgreed] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showAfterHoursAlert, setShowAfterHoursAlert] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    providerName: "",
    providerEmail: "",
    providerPhone: "",
    officeLocation: "hoboken",
    visitType: "quarterly_adhd",
    visitTypeOther: "",
    notes: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("provider_name, email, phone")
          .eq("id", session.user.id)
          .single();
        if (profile) {
          setFormData(prev => ({
            ...prev,
            providerName: profile.provider_name || "",
            providerEmail: profile.email || "",
            providerPhone: profile.phone || "",
          }));
          setProfileLoaded(true);
        }
      }
    };
    loadProfile();
  }, []);

  const { data: bookings = [] } = useQuery({
    queryKey: ["office-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_bookings")
        .select("*")
        .eq("status", "confirmed");
      if (error) throw error;
      return data;
    },
  });

  const createBooking = useMutation({
    mutationFn: async () => {
      if (!selectedDate || !selectedTimeBlock) throw new Error("Missing date/time");
      const bookingId = crypto.randomUUID();
      const bookingDate = format(selectedDate, "yyyy-MM-dd");
      const { error } = await supabase.from("office_bookings").insert({
        id: bookingId,
        provider_name: formData.providerName,
        provider_email: formData.providerEmail,
        provider_phone: formData.providerPhone || null,
        office_location: formData.officeLocation,
        visit_type: formData.visitType,
        visit_type_other: null,
        booking_date: bookingDate,
        time_block: selectedTimeBlock,
        notes: formData.notes || null,
        addendum_signed: true,
        addendum_signature_name: signatureName,
        addendum_signed_at: new Date().toISOString(),
      });
      if (error) throw error;

      // Send booking confirmation email
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "booking-confirmation",
          recipientEmail: formData.providerEmail,
          idempotencyKey: `booking-confirm-${bookingId}`,
          templateData: {
            providerName: formData.providerName,
            bookingDate: format(selectedDate, "MMMM d, yyyy"),
            timeBlock: selectedTimeBlock,
            location: formData.officeLocation,
            visitType: formData.visitType === "quarterly_adhd" ? "In-Person Scheduled Appointment"
              : formData.visitType === "initial_evaluation" ? "Initial Evaluation"
              : formData.visitType,
          },
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["office-bookings"] });
      setShowAddendum(false);
      setBookingConfirmed(true);
      toast({ title: "Booking Confirmed", description: "Your office reservation has been saved and a confirmation email sent." });
    },
    onError: (err: any) => {
      const msg = err?.message?.includes("unique") ? "This time slot is already booked." : "Something went wrong. Please try again.";
      toast({ title: "Booking Failed", description: msg, variant: "destructive" });
    },
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const today = startOfDay(new Date());
  const minBookingDate = startOfDay(addHours(new Date(), 48));

  const bookedSlots = useMemo(() => {
    const map: Record<string, { timeBlock: string; providerName: string; officeLocation: string }[]> = {};
    bookings.forEach((b: any) => {
      const key = b.booking_date;
      if (!map[key]) map[key] = [];
      map[key].push({ timeBlock: b.time_block, providerName: b.provider_name, officeLocation: b.office_location });
    });
    return map;
  }, [bookings]);

  const getAvailableBlocksForLocation = useCallback((date: Date, location: "hoboken" | "edison"): TimeBlock[] => {
    const key = format(date, "yyyy-MM-dd");
    const booked = (bookedSlots[key] || []).filter(b => b.officeLocation === location);
    const bookedBlocks = booked.map(b => b.timeBlock);
    const available: TimeBlock[] = [];
    if (bookedBlocks.includes("full_day")) return [];
    if (!bookedBlocks.includes("morning")) available.push("morning");
    if (!bookedBlocks.includes("afternoon")) available.push("afternoon");
    if (!bookedBlocks.includes("morning") && !bookedBlocks.includes("afternoon")) available.push("full_day");
    return available;
  }, [bookedSlots]);

  const getBookingsForLocation = useCallback((date: Date, location: "hoboken" | "edison") => {
    const key = format(date, "yyyy-MM-dd");
    return (bookedSlots[key] || []).filter(b => b.officeLocation === location);
  }, [bookedSlots]);

  const isFormValid = formData.providerName && formData.providerEmail;

  const handleProceedToAddendum = () => {
    if (!isFormValid || !selectedDate || !selectedTimeBlock) return;
    setShowAddendum(true);
  };

  const handleConfirmBooking = () => {
    if (!addendumAgreed || !signatureName) return;
    createBooking.mutate();
  };

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedTimeBlock(null);
    setFormData(prev => ({ ...prev, officeLocation: "hoboken", visitType: "quarterly_adhd", visitTypeOther: "", notes: "" }));
    const reloadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase.from("profiles").select("provider_name, email, phone").eq("id", session.user.id).single();
        if (profile) {
          setFormData(prev => ({ ...prev, providerName: profile.provider_name || "", providerEmail: profile.email || "", providerPhone: profile.phone || "" }));
        }
      }
    };
    reloadProfile();
    setAddendumAgreed(false);
    setSignatureName("");
    setBookingConfirmed(false);
  };

  // Who's booked on selected date
  const selectedDateBookings = selectedDate ? bookedSlots[format(selectedDate, "yyyy-MM-dd")] || [] : [];

  return (
    <div className="min-h-screen bg-background font-body">
      <NJNavbar isAdmin={isAdmin} />

      {/* Header */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 12%) 0%, hsl(270, 80%, 25%) 50%, hsl(270, 60%, 40%) 100%)' }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-book" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-book)" />
        </svg>
        <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-14">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/50 font-bold mb-2">Provider Scheduling</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
              Book Your Office Time
            </h1>
            <p className="text-sm md:text-base text-white/60 mt-2 max-w-md">
              Select a date, choose your time block and location, then sign the agreement to confirm.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 md:py-10">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <AnimatePresence mode="wait">
            {bookingConfirmed ? (
              /* ── Confirmation ── */
              <motion.div key="confirmed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-lg mx-auto">
                <div className="bg-card rounded-2xl border-2 border-border p-10 md:p-14 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="font-display text-3xl text-foreground mb-3">Booking Confirmed</h2>
                  <p className="text-muted-foreground text-sm mb-2">{formData.providerName}</p>
                  <p className="text-foreground font-medium text-sm mb-1">
                    {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </p>
                  <p className="text-muted-foreground text-sm mb-6">
                    {TIME_BLOCKS.find(t => t.value === selectedTimeBlock)?.time} · {formData.officeLocation === "hoboken" ? "Hoboken" : "Edison"}
                  </p>
                  <p className="text-muted-foreground text-xs mb-8">Addendum signed by {signatureName} on {format(new Date(), "MMM d, yyyy 'at' h:mm a")}</p>
                  <button onClick={resetForm} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body text-sm font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                    Book Another Date
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ── Booking Flow ── */
              <motion.div key="booking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

                {/* Step 1: Calendar */}
                <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="bg-card rounded-2xl border-2 border-border overflow-hidden">
                  <div className="px-5 py-4 md:px-8 md:py-5 border-b border-border/30 flex items-center gap-3" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), white)' }}>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CalendarCheck className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg md:text-xl text-foreground font-semibold">1. Select a Date</h2>
                      <p className="text-xs text-muted-foreground hidden md:block">Click an available date to continue</p>
                    </div>
                  </div>

                  <div className="p-5 md:p-8">
                    {/* Month nav */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display text-xl md:text-2xl text-foreground">{format(currentMonth, "MMMM yyyy")}</h3>
                      <div className="flex gap-2">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-9 h-9 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors">
                          <ChevronLeft className="w-4 h-4 text-foreground" />
                        </button>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-9 h-9 rounded-lg bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors">
                          <ChevronRight className="w-4 h-4 text-foreground" />
                        </button>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mb-5 pb-4 border-b border-border/20">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-xs font-medium text-foreground">Hoboken</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-xs font-medium text-foreground">Edison</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded ring-2 ring-primary" />
                        <span className="text-xs font-medium text-foreground">Today</span>
                      </div>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                        <div key={d} className="text-center text-[11px] tracking-wider uppercase text-muted-foreground font-semibold py-2">{d}</div>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1.5">
                      {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
                      {days.map(day => {
                        const isPast = isBefore(day, today) && !isToday(day);
                        const isTooSoon = isBefore(day, minBookingDate);
                        const isSelected = selectedDate && isSameDay(day, selectedDate);
                        const hobokenAvail = getAvailableBlocksForLocation(day, "hoboken");
                        const edisonAvail = getAvailableBlocksForLocation(day, "edison");
                        const isFullyBooked = hobokenAvail.length === 0 && edisonAvail.length === 0 && !isPast;
                        const key = format(day, "yyyy-MM-dd");
                        const dayBookings = bookedSlots[key] || [];
                        const hasBookings = dayBookings.length > 0;
                        const hobokenBookings = dayBookings.filter(b => b.officeLocation === "hoboken");
                        const edisonBookings = dayBookings.filter(b => b.officeLocation === "edison");
                        const disabled = (isPast || isTooSoon) && !hasBookings;

                        return (
                          <button
                            key={day.toISOString()}
                            disabled={disabled}
                            onClick={() => {
                              if (!isPast && !isTooSoon && !isFullyBooked) {
                                setSelectedDate(day);
                                setSelectedTimeBlock(null);
                              }
                            }}
                            className={`relative w-full aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all
                              ${disabled ? "text-muted-foreground/25 cursor-not-allowed" : "cursor-pointer"}
                              ${isSelected ? "bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/30 scale-[1.02]" : ""}
                              ${!isSelected && isToday(day) ? "ring-2 ring-primary bg-primary/5 text-primary font-bold" : ""}
                              ${!isSelected && !isToday(day) && !disabled && isFullyBooked ? "bg-destructive/5 text-muted-foreground/50" : ""}
                              ${!isSelected && !isToday(day) && !disabled && !isFullyBooked ? "hover:bg-secondary text-foreground" : ""}
                            `}
                          >
                            <span>{format(day, "d")}</span>
                            {hasBookings && (
                              <div className="flex gap-0.5 mt-0.5">
                                {hobokenBookings.length > 0 && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/70" : "bg-primary"}`} />}
                                {edisonBookings.length > 0 && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/70" : "bg-amber-500"}`} />}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

                {/* Step 2: Time & Location (shown after date selection) */}
                <AnimatePresence>
                  {selectedDate && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      className="bg-card rounded-2xl border-2 border-border overflow-hidden"
                    >
                      <div className="px-5 py-4 md:px-8 md:py-5 border-b border-border/30 flex items-center justify-between" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), white)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h2 className="font-display text-lg md:text-xl text-foreground font-semibold">2. Choose Time & Location</h2>
                            <p className="text-xs text-muted-foreground">{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => { setSelectedDate(null); setSelectedTimeBlock(null); }}
                          className="text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors"
                        >
                          Change Date
                        </button>
                      </div>

                      <div className="p-5 md:p-8">
                        {/* Who's already booked */}
                        {selectedDateBookings.length > 0 && (
                          <div className="mb-5 bg-secondary/30 rounded-xl border border-border/20 p-4">
                            <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-bold mb-2">Already Booked</p>
                            <div className="space-y-1.5">
                              {selectedDateBookings.map((b, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                  <div className={`w-2 h-2 rounded-full ${b.officeLocation === "hoboken" ? "bg-primary" : "bg-amber-500"}`} />
                                  <span className="text-foreground font-medium">{b.providerName}</span>
                                  <span className="text-muted-foreground text-xs">
                                    {b.officeLocation === "hoboken" ? "Hoboken" : "Edison"} · {TIME_BLOCKS.find(t => t.value === b.timeBlock)?.label || b.timeBlock}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Location columns */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {(["hoboken", "edison"] as const).map(loc => {
                            const locAvail = getAvailableBlocksForLocation(selectedDate, loc);
                            const locBookings = getBookingsForLocation(selectedDate, loc);
                            const isHoboken = loc === "hoboken";

                            return (
                              <div key={loc} className={`rounded-xl border-2 p-4 transition-all ${isHoboken ? "border-primary/20 bg-primary/[0.02]" : "border-amber-300/30 bg-amber-50/30"}`}>
                                <div className="flex items-center gap-2 mb-3">
                                  <div className={`w-3 h-3 rounded-full ${isHoboken ? "bg-primary" : "bg-amber-500"}`} />
                                  <span className="font-display text-base font-semibold text-foreground">{isHoboken ? "Hoboken" : "Edison"}</span>
                                </div>

                                <div className="space-y-2">
                                  {TIME_BLOCKS.filter(b => {
                                    if (b.value === "full_day") return locBookings.length === 0;
                                    return true;
                                  }).map(block => {
                                    const isAvailable = locAvail.includes(block.value);
                                    const isSelectedBlock = selectedTimeBlock === block.value && formData.officeLocation === loc;

                                    return (
                                      <button
                                        key={block.value}
                                        disabled={!isAvailable}
                                        onClick={() => {
                                          setSelectedTimeBlock(block.value);
                                          setFormData(p => ({ ...p, officeLocation: loc }));
                                          if (block.value === "afternoon" || block.value === "full_day") setShowAfterHoursAlert(true);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all flex items-center justify-between
                                          ${!isAvailable ? "border-border/20 bg-muted/20 text-muted-foreground/40 cursor-not-allowed" : ""}
                                          ${isSelectedBlock ? "border-primary bg-primary text-primary-foreground shadow-md" : ""}
                                          ${isAvailable && !isSelectedBlock ? "border-border/30 bg-card hover:border-primary/40 text-foreground cursor-pointer" : ""}
                                        `}
                                      >
                                        <div>
                                          <span className="font-semibold">{block.label}</span>
                                          <span className={`text-xs ml-2 ${isSelectedBlock ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{block.time}</span>
                                        </div>
                                        {isAvailable && !isSelectedBlock && (
                                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Open</span>
                                        )}
                                        {!isAvailable && (
                                          <span className="text-[10px] font-semibold text-destructive/50">Booked</span>
                                        )}
                                        {isSelectedBlock && (
                                          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                            <Check className="w-3 h-3 text-primary" />
                                          </div>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 3: Provider Info (shown after time selection) */}
                <AnimatePresence>
                  {selectedDate && selectedTimeBlock && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      className="bg-card rounded-2xl border-2 border-border overflow-hidden"
                    >
                      <div className="px-5 py-4 md:px-8 md:py-5 border-b border-border/30 flex items-center gap-3" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), white)' }}>
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h2 className="font-display text-lg md:text-xl text-foreground font-semibold">3. Your Information</h2>
                          <p className="text-xs text-muted-foreground">
                            {formData.officeLocation === "hoboken" ? "Hoboken" : "Edison"} · {TIME_BLOCKS.find(t => t.value === selectedTimeBlock)?.label} · {selectedDate && format(selectedDate, "MMM d")}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 md:p-8 space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-1.5 block">Name *</label>
                            <input type="text" value={formData.providerName} onChange={e => setFormData(p => ({ ...p, providerName: e.target.value }))}
                              readOnly={profileLoaded}
                              className={`w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 ${profileLoaded ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : ""}`} placeholder="Dr. Jane Smith" />
                          </div>
                          <div>
                            <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-1.5 block">Email *</label>
                            <input type="email" value={formData.providerEmail} onChange={e => setFormData(p => ({ ...p, providerEmail: e.target.value }))}
                              readOnly={profileLoaded}
                              className={`w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 ${profileLoaded ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : ""}`} placeholder="jane@orendapsych.com" />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-1.5 block">Phone (optional)</label>
                            <input type="tel" value={formData.providerPhone} onChange={e => setFormData(p => ({ ...p, providerPhone: e.target.value }))}
                              readOnly={profileLoaded}
                              className={`w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 ${profileLoaded ? "bg-muted/50 text-muted-foreground cursor-not-allowed" : ""}`} placeholder="(201) 555-0100" />
                          </div>
                          <div>
                            <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-1.5 block">Notes (optional)</label>
                            <input type="text" value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40" placeholder="Any additional notes..." />
                          </div>
                        </div>

                        <button onClick={handleProceedToAddendum} disabled={!isFormValid}
                          className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold py-3.5 rounded-xl text-white transition-all disabled:opacity-40 hover:opacity-90 mt-2"
                          style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 40%) 100%)' }}>
                          <FileText className="w-4 h-4" />
                          Review & Sign Agreement
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Addendum Modal */}
      <AnimatePresence>
        {showAddendum && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8" onClick={() => setShowAddendum(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowAddendum(false)} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-foreground" />
              </button>

              <div className="px-6 md:px-8 pt-8 pb-4 border-b border-border/20" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), white)' }}>
                <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-medium mb-2">Required Agreement</p>
                <h3 className="font-display text-xl md:text-2xl text-foreground">Provider Office Use Agreement & Scheduling Policy</h3>
              </div>

              <div className="px-6 md:px-8 py-6">
                <div className="bg-secondary/20 rounded-xl border border-border/20 p-5 mb-6 max-h-[300px] overflow-y-auto">
                  <div className="prose prose-sm text-muted-foreground">
                    <p className="font-body text-xs text-muted-foreground mb-4 italic">By reserving and using an Orenda Psychiatry office location, the Provider acknowledges and agrees to the following terms:</p>
                    {[
                      ["1. Permitted Use.", "The office space at the designated Orenda Psychiatry location is provided solely for Orenda Psychiatry clinical appointments and related authorized activities. The space may not be used for personal business, private patients, or services performed on behalf of another practice, organization, or entity."],
                      ["2. Non-Solicitation.", "Provider shall not solicit, recruit, or redirect Orenda Psychiatry patients to any outside practice, service, or business during or after use of the office space."],
                      ["3. Building Access & Security.", "Provider agrees to follow all building access and security procedures, including advance scheduling requirements and patient registration with building security where applicable. Providers may not share keys, lockbox codes, access credentials, or building access information with unauthorized persons."],
                      ["4. Patient Supervision in Shared Space.", "Providers are responsible for ensuring patients are escorted appropriately within the building. Patients should not move through coworking or shared office areas unaccompanied."],
                      ["5. Office Care & Reset.", "Providers must leave the office clean, organized, and in the same condition in which it was found. This includes disposing of trash, resetting the space for the next provider, and returning the office key to the designated lockbox after use."],
                      ["6. Proper Use of Space.", "Providers may only use designated office areas for patient care and related administrative work. Hallways, reception areas, and other shared spaces may not be used for clinical visits or business activities unless specifically authorized."],
                      ["7. Professional Conduct.", "Providers are expected to maintain professional conduct and behavior while using the office space and interacting with building staff, patients, and other occupants."],
                      ["8. Safety & Prohibited Items.", "Providers may not bring prohibited or hazardous items into the office, including weapons, explosives, or unauthorized equipment, and must comply with all health, safety, and privacy requirements."],
                      ["9. Responsibility for Access Devices and Property.", "Any office keys, lockbox access codes, badges, or other access devices must be safeguarded and used only as authorized. Lost keys, access issues, or damage to the office must be reported promptly."],
                      ["10. Scheduling Commitment & Cancellation Policy.", "Office reservations are intended to support scheduled patient care and operational coordination. Providers should only reserve office time when they are confident they will be able to attend. Providers are expected to avoid last-minute cancellations and should provide at least 48 hours' notice if a change is unavoidable. Frequent late cancellations, failure to attend a reserved office time, or repeated schedule changes may result in restrictions or loss of future office scheduling privileges."],
                      ["11. Indemnification.", "Provider agrees to indemnify and hold harmless Orenda Psychiatry from any claims, damages, losses, or liabilities arising from the Provider's use of the office space, except to the extent caused by Orenda Psychiatry's own negligence or misconduct."],
                      ["12. Independent Provider & Regulatory Responsibility.", "Provider acknowledges that they are an independent medical professional and not an employee of Orenda Psychiatry. Provider is solely responsible for maintaining all required professional licenses, credentials, malpractice coverage, and for complying with all applicable federal, state, and local laws and regulations governing the practice of medicine, including New Jersey regulatory requirements. Orenda Psychiatry provides administrative and office support only and assumes no responsibility for the Provider's clinical services, medical decision-making, or regulatory compliance."],
                    ].map(([title, text], i) => (
                      <p key={i} className="font-body text-sm leading-relaxed mb-3">
                        <strong className="text-foreground">{title}</strong> {text}
                      </p>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer mb-5">
                  <input type="checkbox" checked={addendumAgreed} onChange={e => setAddendumAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-border accent-primary" />
                  <span className="text-sm text-foreground leading-relaxed">
                    I have reviewed, understand, and agree to the <strong>Provider Office Use Agreement & Scheduling Policy</strong>.
                  </span>
                </label>

                <div className="mb-6">
                  <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-1.5 block">Digital Signature (Type Your Full Name) *</label>
                  <input type="text" value={signatureName} onChange={e => setSignatureName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border text-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-display italic" placeholder="Your full name" />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                  <CalendarCheck className="w-4 h-4" />
                  Date: {format(new Date(), "MMMM d, yyyy")}
                </div>

                <button onClick={handleConfirmBooking} disabled={!addendumAgreed || !signatureName || createBooking.isPending}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-body text-sm font-semibold px-6 py-3.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {createBooking.isPending ? "Confirming..." : "Confirm Booking"}
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* After-Hours Building Access Alert */}
      <AnimatePresence>
        {showAfterHoursAlert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm px-4"
            onClick={() => setShowAfterHoursAlert(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
              <div className="bg-amber-50 border-b border-amber-200 px-6 py-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-foreground font-medium">After-Hours Building Access</h3>
                  <p className="text-amber-700 text-sm mt-1">Your booking extends beyond regular business hours</p>
                </div>
              </div>
              <div className="px-6 py-5 space-y-5">
                <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <KeyRound className="w-5 h-5 text-primary" />
                    <p className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">Most Important</p>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed">
                    <strong>Get set up with a permanent swipe card and key.</strong> This is the most reliable way to access the building
                    outside of regular hours. Contact the NJ Admin Team:
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs">
                    <a href="tel:+12016854863" className="flex items-center gap-1.5 text-primary font-semibold hover:underline">
                      <Phone className="w-3.5 h-3.5" /> (201) 685-4863
                    </a>
                    <a href="mailto:offices@orendapsych.com" className="flex items-center gap-1.5 text-primary font-semibold hover:underline">
                      <Mail className="w-3.5 h-3.5" /> offices@orendapsych.com
                    </a>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Without a swipe card, you'll need to call building security to be let in after 5 PM. The swipe card gives you 24/7 independent access.
                </p>
                <button onClick={() => setShowAfterHoursAlert(false)}
                  className="w-full bg-foreground text-white text-sm font-semibold py-3 rounded-xl hover:bg-foreground/90 transition-colors">
                  Got It
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <NJFooter />
    </div>
  );
}
