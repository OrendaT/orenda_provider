import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, User, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
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

// Sample bookings for demo
const sampleBookings = [
  { date: new Date(), provider: "Dr. Sarah Chen", location: "hoboken" as const, time: "morning" as const },
  { date: new Date(), provider: "Dr. James Park", location: "edison" as const, time: "afternoon" as const },
  { date: new Date(new Date().setDate(new Date().getDate() + 1)), provider: "Dr. Emily Rose", location: "hoboken" as const, time: "full_day" as const },
  { date: new Date(new Date().setDate(new Date().getDate() + 3)), provider: "Dr. Michael Torres", location: "edison" as const, time: "morning" as const },
  { date: new Date(new Date().setDate(new Date().getDate() + 3)), provider: "Dr. Sarah Chen", location: "hoboken" as const, time: "afternoon" as const },
  { date: new Date(new Date().setDate(new Date().getDate() + 5)), provider: "Dr. Lisa Wang", location: "hoboken" as const, time: "full_day" as const },
  { date: new Date(new Date().setDate(new Date().getDate() + 7)), provider: "Dr. James Park", location: "edison" as const, time: "morning" as const },
  { date: new Date(new Date().setDate(new Date().getDate() + 10)), provider: "Dr. Emily Rose", location: "hoboken" as const, time: "afternoon" as const },
  { date: new Date(new Date().setDate(new Date().getDate() + 10)), provider: "Dr. Michael Torres", location: "edison" as const, time: "full_day" as const },
  { date: new Date(new Date().setDate(new Date().getDate() + 14)), provider: "Dr. Sarah Chen", location: "hoboken" as const, time: "morning" as const },
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeLabels: Record<string, string> = { morning: "AM", afternoon: "PM", full_day: "Full" };

function useCalendar() {
  const [month, setMonth] = useState(new Date());
  const days = useMemo(() => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    return eachDayOfInterval({ start, end });
  }, [month]);
  const blanks = getDay(startOfMonth(month));
  return { month, setMonth, days, blanks, next: () => setMonth(addMonths(month, 1)), prev: () => setMonth(subMonths(month, 1)) };
}

function getBookingsForDay(date: Date) {
  return sampleBookings.filter(b => isSameDay(b.date, date));
}

// ─── Variation 1: Dot Indicator Calendar ───
function CalendarDots() {
  const { month, days, blanks, next, prev } = useCalendar();
  const today = startOfDay(new Date());

  return (
    <div className="bg-white border border-[hsl(270,15%,92%)] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={prev} className="w-8 h-8 rounded-lg bg-[hsl(270,15%,97%)] flex items-center justify-center hover:bg-primary/10 transition-colors">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <h3 className="font-display text-lg font-semibold text-foreground">{format(month, "MMMM yyyy")}</h3>
        <button onClick={next} className="w-8 h-8 rounded-lg bg-[hsl(270,15%,97%)] flex items-center justify-center hover:bg-primary/10 transition-colors">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(d => <div key={d} className="text-center text-[10px] font-medium text-muted-foreground uppercase tracking-wider py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: blanks }).map((_, i) => <div key={`b${i}`} />)}
        {days.map(day => {
          const bookings = getBookingsForDay(day);
          const past = isBefore(day, today);
          return (
            <div key={day.toISOString()} className={`relative flex flex-col items-center py-2 rounded-lg transition-colors ${isToday(day) ? "bg-primary text-primary-foreground" : past ? "text-muted-foreground/40" : "hover:bg-[hsl(270,15%,97%)]"}`}>
              <span className="text-sm">{format(day, "d")}</span>
              {bookings.length > 0 && (
                <div className="flex gap-0.5 mt-1">
                  {bookings.map((b, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${b.location === "hoboken" ? "bg-primary" : "bg-accent"} ${isToday(day) ? "bg-white" : ""}`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[hsl(270,15%,92%)]">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><div className="w-2 h-2 rounded-full bg-primary" /> Hoboken</div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><div className="w-2 h-2 rounded-full bg-accent" /> Edison</div>
      </div>
    </div>
  );
}

// ─── Variation 2: Badge Calendar with Counts ───
function CalendarBadges() {
  const { month, days, blanks, next, prev } = useCalendar();
  const today = startOfDay(new Date());

  return (
    <div className="bg-white border border-[hsl(270,15%,92%)] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={prev} className="w-8 h-8 rounded-lg bg-[hsl(270,15%,97%)] flex items-center justify-center hover:bg-primary/10 transition-colors">
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <h3 className="font-display text-lg font-semibold text-foreground">{format(month, "MMMM yyyy")}</h3>
        <button onClick={next} className="w-8 h-8 rounded-lg bg-[hsl(270,15%,97%)] flex items-center justify-center hover:bg-primary/10 transition-colors">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(d => <div key={d} className="text-center text-[10px] font-medium text-muted-foreground uppercase tracking-wider py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: blanks }).map((_, i) => <div key={`b${i}`} />)}
        {days.map(day => {
          const bookings = getBookingsForDay(day);
          const past = isBefore(day, today);
          return (
            <div key={day.toISOString()} className={`relative flex flex-col items-center py-2 px-1 rounded-xl min-h-[52px] transition-all ${isToday(day) ? "bg-primary text-primary-foreground shadow-md" : bookings.length > 0 && !past ? "bg-primary/5 border border-primary/15" : past ? "text-muted-foreground/30" : "hover:bg-[hsl(270,15%,97%)]"}`}>
              <span className="text-sm font-medium">{format(day, "d")}</span>
              {bookings.length > 0 && !past && (
                <span className={`text-[9px] font-bold mt-0.5 px-1.5 py-0.5 rounded-full ${isToday(day) ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                  {bookings.length} {bookings.length === 1 ? "slot" : "slots"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Variation 3: Heat Map Style ───
function CalendarHeatmap() {
  const { month, days, blanks, next, prev } = useCalendar();
  const today = startOfDay(new Date());

  return (
    <div className="bg-foreground rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <button onClick={prev} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
          <ChevronLeft className="w-4 h-4 text-white/60" />
        </button>
        <h3 className="font-display text-lg font-semibold">{format(month, "MMMM yyyy")}</h3>
        <button onClick={next} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
          <ChevronRight className="w-4 h-4 text-white/60" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(d => <div key={d} className="text-center text-[10px] font-medium text-white/30 uppercase tracking-wider py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: blanks }).map((_, i) => <div key={`b${i}`} />)}
        {days.map(day => {
          const bookings = getBookingsForDay(day);
          const past = isBefore(day, today);
          const intensity = bookings.length === 0 ? "bg-white/5" : bookings.length === 1 ? "bg-[hsl(270,70%,60%,0.3)]" : "bg-[hsl(270,70%,60%,0.6)]";
          return (
            <div key={day.toISOString()} className={`relative flex flex-col items-center py-2.5 rounded-lg transition-all ${isToday(day) ? "ring-2 ring-[hsl(270,70%,75%)] bg-[hsl(270,70%,60%,0.4)]" : past ? "opacity-30" : intensity} hover:ring-1 hover:ring-white/20`}>
              <span className="text-sm">{format(day, "d")}</span>
              {bookings.length > 0 && (
                <div className="flex gap-0.5 mt-1">
                  {bookings.map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-[hsl(270,70%,80%)]" />)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
        <span className="text-[10px] text-white/30 uppercase tracking-wider">Density:</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded bg-white/5" />
          <div className="w-4 h-4 rounded bg-[hsl(270,70%,60%,0.3)]" />
          <div className="w-4 h-4 rounded bg-[hsl(270,70%,60%,0.6)]" />
        </div>
        <span className="text-[10px] text-white/30">Low → High</span>
      </div>
    </div>
  );
}

// ─── Variation 4: List/Agenda View ───
function CalendarAgenda() {
  const upcoming = sampleBookings
    .filter(b => !isBefore(b.date, startOfDay(new Date())))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const grouped = upcoming.reduce<Record<string, typeof sampleBookings>>((acc, b) => {
    const key = format(b.date, "yyyy-MM-dd");
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  return (
    <div className="bg-white border border-[hsl(270,15%,92%)] rounded-2xl p-6">
      <h3 className="font-display text-lg font-semibold text-foreground mb-6">Upcoming Bookings</h3>
      <div className="space-y-4">
        {Object.entries(grouped).map(([dateKey, bookings]) => (
          <div key={dateKey}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center ${isToday(new Date(dateKey + "T12:00:00")) ? "bg-primary text-primary-foreground" : "bg-[hsl(270,15%,97%)] text-foreground"}`}>
                <span className="text-[9px] font-bold uppercase leading-none">{format(new Date(dateKey + "T12:00:00"), "MMM")}</span>
                <span className="text-sm font-bold leading-none">{format(new Date(dateKey + "T12:00:00"), "d")}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{format(new Date(dateKey + "T12:00:00"), "EEEE")}</p>
                <p className="text-[10px] text-muted-foreground">{bookings.length} booking{bookings.length > 1 ? "s" : ""}</p>
              </div>
            </div>
            <div className="ml-[52px] space-y-2">
              {bookings.map((b, i) => (
                <div key={i} className="flex items-center gap-3 bg-[hsl(270,15%,97%)] rounded-lg px-4 py-2.5 border border-[hsl(270,15%,92%)]">
                  <User className="w-3.5 h-3.5 text-primary/40" />
                  <span className="text-sm text-foreground flex-1">{b.provider}</span>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${b.location === "hoboken" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                    {b.location === "hoboken" ? "HOB" : "EDI"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{timeLabels[b.time]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Variation 5: Inline Detail Calendar ───
function CalendarInlineDetail() {
  const { month, days, blanks, next, prev } = useCalendar();
  const today = startOfDay(new Date());
  const [selected, setSelected] = useState<Date | null>(null);
  const selectedBookings = selected ? getBookingsForDay(selected) : [];

  return (
    <div className="bg-white border border-[hsl(270,15%,92%)] rounded-2xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prev} className="w-8 h-8 rounded-lg bg-[hsl(270,15%,97%)] flex items-center justify-center hover:bg-primary/10 transition-colors">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <h3 className="font-display text-lg font-semibold text-foreground">{format(month, "MMMM yyyy")}</h3>
          <button onClick={next} className="w-8 h-8 rounded-lg bg-[hsl(270,15%,97%)] flex items-center justify-center hover:bg-primary/10 transition-colors">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(d => <div key={d} className="text-center text-[10px] font-medium text-muted-foreground uppercase tracking-wider py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: blanks }).map((_, i) => <div key={`b${i}`} />)}
          {days.map(day => {
            const bookings = getBookingsForDay(day);
            const past = isBefore(day, today);
            const isSelected = selected && isSameDay(day, selected);
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelected(isSelected ? null : day)}
                className={`relative flex flex-col items-center py-2 rounded-xl min-h-[48px] transition-all ${
                  isSelected ? "bg-primary text-primary-foreground shadow-lg scale-105" :
                  isToday(day) ? "bg-primary/10 text-primary font-bold" :
                  bookings.length > 0 && !past ? "bg-[hsl(270,15%,97%)]" :
                  past ? "text-muted-foreground/30" : "hover:bg-[hsl(270,15%,97%)]"
                }`}
              >
                <span className="text-sm">{format(day, "d")}</span>
                {bookings.length > 0 && !past && (
                  <div className="flex gap-0.5 mt-0.5">
                    {bookings.map((b, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/60" : b.location === "hoboken" ? "bg-primary" : "bg-accent"}`} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {/* Detail panel */}
      {selected && (
        <div className="border-t border-[hsl(270,15%,92%)] bg-[hsl(270,15%,97%)] p-6">
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">{format(selected, "EEEE, MMMM d")}</p>
          {selectedBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings — this day is available.</p>
          ) : (
            <div className="space-y-2">
              {selectedBookings.map((b, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-[hsl(270,15%,90%)]">
                  <User className="w-4 h-4 text-primary/40" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{b.provider}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> {b.location === "hoboken" ? "Hoboken" : "Edison"} · {b.time === "morning" ? "Morning" : b.time === "afternoon" ? "Afternoon" : "Full Day"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Variation 6: Compact Week Strip ───
function CalendarWeekStrip() {
  const today = startOfDay(new Date());
  const weekDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="bg-white border border-[hsl(270,15%,92%)] rounded-2xl p-6">
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">Next 2 Weeks</h3>
      <p className="text-xs text-muted-foreground mb-5">Scroll to see availability</p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {weekDays.map((day, i) => {
          const bookings = getBookingsForDay(day);
          return (
            <div key={i} className={`flex-shrink-0 w-16 rounded-xl text-center py-3 px-2 border transition-all ${
              isToday(day) ? "bg-primary text-primary-foreground border-primary shadow-md" :
              bookings.length > 0 ? "bg-primary/5 border-primary/20" : "bg-[hsl(270,15%,97%)] border-[hsl(270,15%,92%)]"
            }`}>
              <p className={`text-[9px] font-bold uppercase ${isToday(day) ? "text-white/60" : "text-muted-foreground"}`}>{format(day, "EEE")}</p>
              <p className={`text-lg font-semibold ${isToday(day) ? "" : "text-foreground"}`}>{format(day, "d")}</p>
              {bookings.length > 0 && (
                <div className="flex justify-center gap-0.5 mt-1">
                  {bookings.map((b, j) => (
                    <div key={j} className={`w-1.5 h-1.5 rounded-full ${isToday(day) ? "bg-white/60" : b.location === "hoboken" ? "bg-primary" : "bg-accent"}`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[hsl(270,15%,92%)]">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><div className="w-2 h-2 rounded-full bg-primary" /> Hoboken</div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><div className="w-2 h-2 rounded-full bg-accent" /> Edison</div>
      </div>
    </div>
  );
}

export default function CalendarShowcase() {
  return (
    <div className="min-h-screen bg-white font-body">
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[hsl(270,20%,90%)]">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </Link>
          <img src={logo} alt="Orenda" className="h-8" />
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="py-16 md:py-24" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), white)' }}>
        <div className="max-w-5xl mx-auto px-8">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary/50 font-medium mb-4">Design Exploration</p>
            <h1 className="font-display text-4xl md:text-6xl font-light text-foreground leading-[1.05] mb-4">
              Calendar <em className="text-primary" style={{ fontStyle: 'italic' }}>Variations</em>
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
              Six different ways to display office bookings and availability. Each variation shows the same data in a different visual format.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 pb-24 space-y-16">
        {/* 1 - Dots */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/40 font-medium mb-2">Variation 01</p>
          <h2 className="font-display text-2xl text-foreground mb-1">Dot Indicators</h2>
          <p className="text-sm text-muted-foreground mb-6">Color-coded dots beneath each date show which locations are booked.</p>
          <div className="max-w-md"><CalendarDots /></div>
        </motion.div>

        {/* 2 - Badges */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/40 font-medium mb-2">Variation 02</p>
          <h2 className="font-display text-2xl text-foreground mb-1">Badge Counts</h2>
          <p className="text-sm text-muted-foreground mb-6">Each booked day shows a slot count badge with a subtle highlight background.</p>
          <div className="max-w-md"><CalendarBadges /></div>
        </motion.div>

        {/* 3 - Heatmap */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/40 font-medium mb-2">Variation 03</p>
          <h2 className="font-display text-2xl text-foreground mb-1">Dark Heatmap</h2>
          <p className="text-sm text-muted-foreground mb-6">A dark-theme calendar where booking density is shown through color intensity.</p>
          <div className="max-w-md"><CalendarHeatmap /></div>
        </motion.div>

        {/* 4 - Agenda */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/40 font-medium mb-2">Variation 04</p>
          <h2 className="font-display text-2xl text-foreground mb-1">Agenda / List View</h2>
          <p className="text-sm text-muted-foreground mb-6">A chronological list of upcoming bookings grouped by date — ideal for quick scanning.</p>
          <div className="max-w-md"><CalendarAgenda /></div>
        </motion.div>

        {/* 5 - Inline Detail */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/40 font-medium mb-2">Variation 05</p>
          <h2 className="font-display text-2xl text-foreground mb-1">Click-to-Expand Detail</h2>
          <p className="text-sm text-muted-foreground mb-6">Click any day to reveal a detail panel showing who's booked and where.</p>
          <div className="max-w-md"><CalendarInlineDetail /></div>
        </motion.div>

        {/* 6 - Week Strip */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/40 font-medium mb-2">Variation 06</p>
          <h2 className="font-display text-2xl text-foreground mb-1">Horizontal Week Strip</h2>
          <p className="text-sm text-muted-foreground mb-6">A scrollable 2-week strip — compact, mobile-friendly, and great for quick availability checks.</p>
          <div className="max-w-xl"><CalendarWeekStrip /></div>
        </motion.div>
      </section>

      <motion.footer variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="border-t border-[hsl(270,15%,92%)] py-14 bg-white">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={logo} alt="Orenda" className="h-6 opacity-30" />
          <p className="text-[10px] tracking-[0.2em] uppercase text-[hsl(270,10%,60%)]">
            © {new Date().getFullYear()} Orenda Psychiatry · Design Exploration
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
