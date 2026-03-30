import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, User, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import logo from "@/assets/orenda-logo-purple.png";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

type BookingSlot = {
  timeBlock: string;
  providerName: string;
  officeLocation: string;
};

// Shared calendar grid generator
function useCalendarGrid(currentMonth: Date) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const today = startOfDay(new Date());
  return { days, startDay, today };
}

function CalendarHeader({
  currentMonth,
  onPrev,
  onNext,
}: {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display text-xl text-foreground">{format(currentMonth, "MMMM yyyy")}</h3>
      <div className="flex gap-1.5">
        <button onClick={onPrev} className="w-8 h-8 rounded-lg bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button onClick={onNext} className="w-8 h-8 rounded-lg bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function DayHeaders() {
  return (
    <div className="grid grid-cols-7 gap-1 mb-1">
      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
        <div key={i} className="text-center text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-medium py-1.5">{d}</div>
      ))}
    </div>
  );
}

const TIME_BLOCK_LABELS: Record<string, string> = {
  morning: "AM",
  afternoon: "PM",
  full_day: "All Day",
};

// ─── VARIATION A: Dot Indicators ───
function VariationA({ bookedSlots, currentMonth, setCurrentMonth }: { bookedSlots: Record<string, BookingSlot[]>; currentMonth: Date; setCurrentMonth: (d: Date) => void }) {
  const { days, startDay, today } = useCalendarGrid(currentMonth);
  return (
    <div className="bg-white rounded-2xl border border-border/30 p-5">
      <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-1">Variation A</p>
      <p className="text-muted-foreground text-xs mb-4">Colored dots per location — current style</p>
      <CalendarHeader currentMonth={currentMonth} onPrev={() => setCurrentMonth(subMonths(currentMonth, 1))} onNext={() => setCurrentMonth(addMonths(currentMonth, 1))} />
      <DayHeaders />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
        {days.map(day => {
          const isPast = isBefore(day, today) && !isToday(day);
          const key = format(day, "yyyy-MM-dd");
          const dayBookings = bookedSlots[key] || [];
          const hoboken = dayBookings.filter(b => b.officeLocation === "hoboken");
          const edison = dayBookings.filter(b => b.officeLocation === "edison");
          return (
            <div key={day.toISOString()} className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm
              ${isPast ? "text-muted-foreground/30" : "text-foreground"}
              ${isToday(day) ? "bg-primary/10 text-primary font-bold" : ""}
            `}>
              <span className="font-medium text-xs">{format(day, "d")}</span>
              {dayBookings.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {hoboken.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  {edison.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/20">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-[9px] text-muted-foreground">Hoboken</span></div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[9px] text-muted-foreground">Edison</span></div>
      </div>
    </div>
  );
}

// ─── VARIATION B: Split Cell ───
function VariationB({ bookedSlots, currentMonth, setCurrentMonth }: { bookedSlots: Record<string, BookingSlot[]>; currentMonth: Date; setCurrentMonth: (d: Date) => void }) {
  const { days, startDay, today } = useCalendarGrid(currentMonth);
  return (
    <div className="bg-white rounded-2xl border border-border/30 p-5">
      <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-1">Variation B</p>
      <p className="text-muted-foreground text-xs mb-4">Split-cell with left = Hoboken, right = Edison</p>
      <CalendarHeader currentMonth={currentMonth} onPrev={() => setCurrentMonth(subMonths(currentMonth, 1))} onNext={() => setCurrentMonth(addMonths(currentMonth, 1))} />
      <DayHeaders />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
        {days.map(day => {
          const isPast = isBefore(day, today) && !isToday(day);
          const key = format(day, "yyyy-MM-dd");
          const dayBookings = bookedSlots[key] || [];
          const hoboken = dayBookings.filter(b => b.officeLocation === "hoboken");
          const edison = dayBookings.filter(b => b.officeLocation === "edison");
          const hobokenFull = hoboken.some(b => b.timeBlock === "full_day") || (hoboken.some(b => b.timeBlock === "morning") && hoboken.some(b => b.timeBlock === "afternoon"));
          const edisonFull = edison.some(b => b.timeBlock === "full_day") || (edison.some(b => b.timeBlock === "morning") && edison.some(b => b.timeBlock === "afternoon"));

          return (
            <div key={day.toISOString()} className={`relative aspect-square rounded-xl overflow-hidden flex items-center justify-center text-sm border
              ${isPast ? "text-muted-foreground/30 border-transparent" : "border-border/20"}
              ${isToday(day) ? "ring-2 ring-primary/30" : ""}
            `}>
              {/* Left half — Hoboken */}
              <div className={`absolute inset-y-0 left-0 w-1/2 ${hoboken.length > 0 ? (hobokenFull ? "bg-primary/25" : "bg-primary/10") : ""}`} />
              {/* Right half — Edison */}
              <div className={`absolute inset-y-0 right-0 w-1/2 ${edison.length > 0 ? (edisonFull ? "bg-amber-500/25" : "bg-amber-500/10") : ""}`} />
              <span className="relative z-10 font-medium text-xs">{format(day, "d")}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/20">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-primary/15 border border-primary/30" /><span className="text-[9px] text-muted-foreground">Hoboken (left)</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-500/15 border border-amber-500/30" /><span className="text-[9px] text-muted-foreground">Edison (right)</span></div>
      </div>
    </div>
  );
}

// ─── VARIATION C: Stacked Bars ───
function VariationC({ bookedSlots, currentMonth, setCurrentMonth }: { bookedSlots: Record<string, BookingSlot[]>; currentMonth: Date; setCurrentMonth: (d: Date) => void }) {
  const { days, startDay, today } = useCalendarGrid(currentMonth);
  return (
    <div className="bg-white rounded-2xl border border-border/30 p-5">
      <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-1">Variation C</p>
      <p className="text-muted-foreground text-xs mb-4">Stacked mini-bars showing AM/PM booking per location</p>
      <CalendarHeader currentMonth={currentMonth} onPrev={() => setCurrentMonth(subMonths(currentMonth, 1))} onNext={() => setCurrentMonth(addMonths(currentMonth, 1))} />
      <DayHeaders />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
        {days.map(day => {
          const isPast = isBefore(day, today) && !isToday(day);
          const key = format(day, "yyyy-MM-dd");
          const dayBookings = bookedSlots[key] || [];
          const hoboken = dayBookings.filter(b => b.officeLocation === "hoboken");
          const edison = dayBookings.filter(b => b.officeLocation === "edison");

          const hMorning = hoboken.some(b => b.timeBlock === "morning" || b.timeBlock === "full_day");
          const hAfternoon = hoboken.some(b => b.timeBlock === "afternoon" || b.timeBlock === "full_day");
          const eMorning = edison.some(b => b.timeBlock === "morning" || b.timeBlock === "full_day");
          const eAfternoon = edison.some(b => b.timeBlock === "afternoon" || b.timeBlock === "full_day");
          const hasAny = dayBookings.length > 0;

          return (
            <div key={day.toISOString()} className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm gap-0.5
              ${isPast ? "text-muted-foreground/30" : "text-foreground"}
              ${isToday(day) ? "bg-primary/5 ring-1 ring-primary/20" : ""}
            `}>
              <span className="font-medium text-xs">{format(day, "d")}</span>
              {hasAny && (
                <div className="flex flex-col gap-[1px] w-[70%]">
                  {/* Hoboken bar */}
                  <div className="flex gap-[1px] h-[3px]">
                    <div className={`flex-1 rounded-sm ${hMorning ? "bg-primary" : "bg-primary/10"}`} />
                    <div className={`flex-1 rounded-sm ${hAfternoon ? "bg-primary" : "bg-primary/10"}`} />
                  </div>
                  {/* Edison bar */}
                  <div className="flex gap-[1px] h-[3px]">
                    <div className={`flex-1 rounded-sm ${eMorning ? "bg-amber-500" : "bg-amber-500/10"}`} />
                    <div className={`flex-1 rounded-sm ${eAfternoon ? "bg-amber-500" : "bg-amber-500/10"}`} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/20">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-[1px]"><div className="w-2 h-[3px] rounded-sm bg-primary" /><div className="w-2 h-[3px] rounded-sm bg-primary/20" /></div>
          <span className="text-[9px] text-muted-foreground">Hoboken (AM|PM)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-[1px]"><div className="w-2 h-[3px] rounded-sm bg-amber-500" /><div className="w-2 h-[3px] rounded-sm bg-amber-500/20" /></div>
          <span className="text-[9px] text-muted-foreground">Edison (AM|PM)</span>
        </div>
      </div>
    </div>
  );
}

// ─── VARIATION D: Badge Style ───
function VariationD({ bookedSlots, currentMonth, setCurrentMonth }: { bookedSlots: Record<string, BookingSlot[]>; currentMonth: Date; setCurrentMonth: (d: Date) => void }) {
  const { days, startDay, today } = useCalendarGrid(currentMonth);
  return (
    <div className="bg-white rounded-2xl border border-border/30 p-5">
      <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-1">Variation D</p>
      <p className="text-muted-foreground text-xs mb-4">Background fill intensity — darker = more booked</p>
      <CalendarHeader currentMonth={currentMonth} onPrev={() => setCurrentMonth(subMonths(currentMonth, 1))} onNext={() => setCurrentMonth(addMonths(currentMonth, 1))} />
      <DayHeaders />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
        {days.map(day => {
          const isPast = isBefore(day, today) && !isToday(day);
          const key = format(day, "yyyy-MM-dd");
          const dayBookings = bookedSlots[key] || [];
          const count = dayBookings.length;
          // Intensity based on booking count
          const bgClass = count === 0 ? "" : count === 1 ? "bg-primary/10" : count === 2 ? "bg-primary/20" : count >= 3 ? "bg-primary/35" : "";
          const allFull = count >= 4; // both locations fully booked

          return (
            <div key={day.toISOString()} className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm
              ${isPast ? "text-muted-foreground/30" : allFull ? "text-primary-foreground" : "text-foreground"}
              ${isToday(day) ? "ring-2 ring-primary/40" : ""}
              ${!isPast ? bgClass : ""}
              ${allFull && !isPast ? "bg-primary/50" : ""}
            `}>
              <span className="font-medium text-xs">{format(day, "d")}</span>
              {count > 0 && !isPast && (
                <span className={`text-[8px] font-bold ${allFull ? "text-white/80" : "text-primary/60"}`}>
                  {count} slot{count > 1 ? "s" : ""}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/20">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-primary/10" /><span className="text-[9px] text-muted-foreground">1 slot</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-primary/20" /><span className="text-[9px] text-muted-foreground">2 slots</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-primary/35" /><span className="text-[9px] text-muted-foreground">3 slots</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-primary/50" /><span className="text-[9px] text-muted-foreground">Full</span></div>
      </div>
    </div>
  );
}

// ─── VARIATION E: Provider Initials ───
function VariationE({ bookedSlots, currentMonth, setCurrentMonth }: { bookedSlots: Record<string, BookingSlot[]>; currentMonth: Date; setCurrentMonth: (d: Date) => void }) {
  const { days, startDay, today } = useCalendarGrid(currentMonth);
  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className="bg-white rounded-2xl border border-border/30 p-5">
      <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-1">Variation E</p>
      <p className="text-muted-foreground text-xs mb-4">Provider initials inside the cell with location color</p>
      <CalendarHeader currentMonth={currentMonth} onPrev={() => setCurrentMonth(subMonths(currentMonth, 1))} onNext={() => setCurrentMonth(addMonths(currentMonth, 1))} />
      <DayHeaders />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
        {days.map(day => {
          const isPast = isBefore(day, today) && !isToday(day);
          const key = format(day, "yyyy-MM-dd");
          const dayBookings = bookedSlots[key] || [];

          return (
            <div key={day.toISOString()} className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm
              ${isPast ? "text-muted-foreground/30" : "text-foreground"}
              ${isToday(day) ? "bg-primary/5 ring-1 ring-primary/20" : ""}
              ${dayBookings.length > 0 && !isPast ? "bg-secondary/30" : ""}
            `}>
              <span className="font-medium text-[10px] mb-0.5">{format(day, "d")}</span>
              {dayBookings.length > 0 && !isPast && (
                <div className="flex flex-wrap justify-center gap-[2px]">
                  {dayBookings.slice(0, 3).map((b, bi) => (
                    <span key={bi} className={`text-[7px] font-bold px-1 py-[1px] rounded ${b.officeLocation === "hoboken" ? "bg-primary/20 text-primary" : "bg-amber-100 text-amber-700"}`}>
                      {getInitials(b.providerName)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/20">
        <div className="flex items-center gap-1"><span className="text-[8px] font-bold bg-primary/20 text-primary px-1.5 py-0.5 rounded">MS</span><span className="text-[9px] text-muted-foreground">Hoboken</span></div>
        <div className="flex items-center gap-1"><span className="text-[8px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">GG</span><span className="text-[9px] text-muted-foreground">Edison</span></div>
      </div>
    </div>
  );
}

// ─── VARIATION F: Timeline Blocks ───
function VariationF({ bookedSlots, currentMonth, setCurrentMonth }: { bookedSlots: Record<string, BookingSlot[]>; currentMonth: Date; setCurrentMonth: (d: Date) => void }) {
  const { days, startDay, today } = useCalendarGrid(currentMonth);
  return (
    <div className="bg-white rounded-2xl border border-border/30 p-5">
      <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-1">Variation F</p>
      <p className="text-muted-foreground text-xs mb-4">Horizontal timeline bar showing time block coverage</p>
      <CalendarHeader currentMonth={currentMonth} onPrev={() => setCurrentMonth(subMonths(currentMonth, 1))} onNext={() => setCurrentMonth(addMonths(currentMonth, 1))} />
      <DayHeaders />
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => <div key={`e-${i}`} />)}
        {days.map(day => {
          const isPast = isBefore(day, today) && !isToday(day);
          const key = format(day, "yyyy-MM-dd");
          const dayBookings = bookedSlots[key] || [];
          const hasAny = dayBookings.length > 0;

          // Build a single horizontal bar: left half = morning, right half = afternoon
          const morningBookings = dayBookings.filter(b => b.timeBlock === "morning" || b.timeBlock === "full_day");
          const afternoonBookings = dayBookings.filter(b => b.timeBlock === "afternoon" || b.timeBlock === "full_day");

          const morningColor = morningBookings.length > 0 ? (morningBookings[0].officeLocation === "hoboken" ? "bg-primary" : "bg-amber-500") : "";
          const afternoonColor = afternoonBookings.length > 0 ? (afternoonBookings[0].officeLocation === "hoboken" ? "bg-primary" : "bg-amber-500") : "";

          return (
            <div key={day.toISOString()} className={`relative aspect-square rounded-xl flex flex-col items-center justify-center text-sm gap-1
              ${isPast ? "text-muted-foreground/30" : "text-foreground"}
              ${isToday(day) ? "ring-1 ring-primary/20" : ""}
            `}>
              <span className="font-medium text-xs">{format(day, "d")}</span>
              {hasAny && !isPast && (
                <div className="flex w-[75%] h-[4px] rounded-full overflow-hidden bg-muted/30">
                  <div className={`w-1/2 ${morningColor || "bg-transparent"}`} />
                  <div className={`w-1/2 ${afternoonColor || "bg-transparent"}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/20">
        <span className="text-[9px] text-muted-foreground">Bar: left half = AM, right half = PM</span>
        <div className="flex items-center gap-1"><div className="w-3 h-[3px] rounded bg-primary" /><span className="text-[9px] text-muted-foreground">Hoboken</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-[3px] rounded bg-amber-500" /><span className="text-[9px] text-muted-foreground">Edison</span></div>
      </div>
    </div>
  );
}

export default function NJBookingCalendarVariations() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const bookedSlots = useMemo(() => {
    const map: Record<string, BookingSlot[]> = {};
    bookings.forEach((b: any) => {
      const key = b.booking_date;
      if (!map[key]) map[key] = [];
      map[key].push({ timeBlock: b.time_block, providerName: b.provider_name, officeLocation: b.office_location });
    });
    return map;
  }, [bookings]);

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <div className="border-b border-border/20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/nj-office/book" className="w-9 h-9 rounded-lg bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">Design Review</p>
              <h1 className="font-display text-xl text-foreground">Booking Calendar — Visual Options</h1>
            </div>
          </div>
          <img src={logo} alt="Orenda" className="h-6 opacity-40" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <motion.p variants={fadeUp} initial="hidden" animate="visible" className="text-muted-foreground text-sm mb-8 max-w-2xl">
          Six visual approaches for displaying booked vs. available time slots on the provider scheduling calendar. All use <strong className="text-foreground">real booking data</strong> from the database.
        </motion.p>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <VariationA bookedSlots={bookedSlots} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
            <VariationB bookedSlots={bookedSlots} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
            <VariationC bookedSlots={bookedSlots} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <VariationD bookedSlots={bookedSlots} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
            <VariationE bookedSlots={bookedSlots} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
            <VariationF bookedSlots={bookedSlots} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
