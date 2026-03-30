import { useState } from "react";
import { format, addDays, startOfDay, isBefore } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Search, MapPin, Shield, Clock, ChevronDown, ChevronLeft, ChevronRight,
  Star, CalendarDays, X, User, ArrowRight
} from "lucide-react";
import logo from "@/assets/orenda-logo-purple.png";

const today = startOfDay(new Date());

// Fake providers for preview
const mockProviders = [
  { name: "Kimberly Levitt, PMHNP", title: "Psychiatric Nurse Practitioner", location: "Hoboken", photo: null, slots: ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "2:00 PM", "2:30 PM"] },
  { name: "Tim Ichniowski, PMHNP", title: "Psychiatric Nurse Practitioner", location: "Edison", photo: null, slots: ["10:00 AM", "10:30 AM", "1:00 PM", "1:30 PM", "3:00 PM"] },
  { name: "Ted Schimenti, PMHNP", title: "Psychiatric Nurse Practitioner", location: "Hoboken", photo: null, slots: ["9:00 AM", "11:00 AM", "11:30 AM", "2:00 PM", "4:00 PM", "4:30 PM"] },
];

function ProviderCard({ provider }: { provider: typeof mockProviders[0] }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/20 transition-all">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
          <User className="w-7 h-7 text-primary/60" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-foreground font-bold text-base">{provider.name}</h4>
          <p className="text-muted-foreground text-xs">{provider.title}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin className="w-3 h-3 text-primary/50" />
            <span className="text-xs text-muted-foreground">{provider.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-foreground">5.0</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {provider.slots.slice(0, 5).map(s => (
          <button key={s} className="px-3 py-1.5 rounded-lg border border-primary/20 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all">
            {s}
          </button>
        ))}
        {provider.slots.length > 5 && (
          <span className="px-3 py-1.5 text-xs font-medium text-muted-foreground">+{provider.slots.length - 5} more</span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VARIATION A — Compact Inline Filter Bar (all in one row)
   ═══════════════════════════════════════════════════════ */
function VariationA() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [calOpen, setCalOpen] = useState(false);
  const [time, setTime] = useState("flexible");

  return (
    <div className="border-2 border-border rounded-3xl overflow-hidden bg-white">
      {/* Single compact filter bar */}
      <div className="bg-primary/[0.04] border-b border-primary/10 px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Date filter as popover pill */}
          <Popover open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger asChild>
              <button className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all",
                date ? "border-primary bg-primary text-white" : "border-border bg-white text-foreground hover:border-primary/40"
              )}>
                <CalendarDays className="w-4 h-4" />
                {date ? format(date, "MMM d") : "Any date"}
                {date && (
                  <span onClick={(e) => { e.stopPropagation(); setDate(undefined); setCalOpen(false); }}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"><X className="w-3 h-3" /></span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={(d) => { setDate(d); setCalOpen(false); }}
                disabled={(d) => isBefore(d, today)} className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>

          {/* Time pills */}
          {["flexible", "morning", "afternoon", "evening"].map(t => (
            <button key={t} onClick={() => setTime(t)}
              className={cn(
                "px-3.5 py-2.5 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all",
                time === t ? "bg-foreground text-white border-foreground" : "bg-white text-foreground border-border hover:border-foreground/30"
              )}>
              {t === "flexible" ? "Any time" : t}
            </button>
          ))}

          {/* Insurance + ZIP inline */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input placeholder="ZIP" className="w-20 pl-8 pr-2 py-2.5 border-2 border-border rounded-xl text-xs font-medium focus:border-primary/40 focus:outline-none" />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2.5 border-2 border-border rounded-xl text-xs font-medium text-muted-foreground hover:border-primary/30">
              <Shield className="w-3.5 h-3.5" /> Insurance <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Provider results */}
      <div className="p-5 space-y-4">
        <p className="text-xs text-muted-foreground font-medium">{mockProviders.length} providers available</p>
        {mockProviders.map(p => <ProviderCard key={p.name} provider={p} />)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VARIATION B — Horizontal date strip + filter row
   ═══════════════════════════════════════════════════════ */
function VariationB() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [time, setTime] = useState("flexible");
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  return (
    <div className="border-2 border-border rounded-3xl overflow-hidden bg-white">
      {/* Date strip */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 15%) 0%, hsl(270, 70%, 35%) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
        <div className="relative px-5 pt-5 pb-2">
          <p className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-bold mb-3">Select a date</p>
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
            <button onClick={() => setSelectedDay(null)}
              className={cn(
                "shrink-0 px-4 py-3 rounded-xl text-xs font-bold transition-all",
                selectedDay === null ? "bg-white text-primary shadow-lg" : "bg-white/10 text-white border border-white/15 hover:bg-white/20"
              )}>
              Any date
            </button>
            {days.map((d, i) => (
              <button key={i} onClick={() => setSelectedDay(i)}
                className={cn(
                  "shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-center transition-all min-w-[52px]",
                  selectedDay === i ? "bg-white text-primary shadow-lg" : "bg-white/10 text-white border border-white/15 hover:bg-white/20"
                )}>
                <span className="text-[10px] uppercase font-bold opacity-70">{format(d, "EEE")}</span>
                <span className="text-lg font-bold leading-tight">{format(d, "d")}</span>
                <span className="text-[9px] uppercase opacity-50">{format(d, "MMM")}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Time + filters row */}
      <div className="px-5 py-3 border-b border-border flex flex-wrap items-center gap-2">
        {["flexible", "morning", "afternoon", "evening"].map(t => (
          <button key={t} onClick={() => setTime(t)}
            className={cn(
              "px-3 py-2 rounded-full border text-xs font-semibold transition-all",
              time === t ? "bg-foreground text-white border-foreground" : "border-border hover:border-foreground/30"
            )}>
            {t === "flexible" ? "Any time" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input placeholder="ZIP" className="w-20 pl-8 pr-2 py-2 border border-border rounded-lg text-xs focus:border-primary/40 focus:outline-none" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs text-muted-foreground hover:border-primary/30">
            <Shield className="w-3.5 h-3.5" /> Insurance <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Provider results */}
      <div className="p-5 space-y-4">
        <p className="text-xs text-muted-foreground font-medium">{mockProviders.length} providers available</p>
        {mockProviders.map(p => <ProviderCard key={p.name} provider={p} />)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VARIATION C — Unified sticky toolbar (date popover + all filters in one bar)
   ═══════════════════════════════════════════════════════ */
function VariationC() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [calOpen, setCalOpen] = useState(false);
  const [time, setTime] = useState("flexible");

  return (
    <div className="border-2 border-border rounded-3xl overflow-hidden bg-white">
      {/* Single unified bar */}
      <div className="bg-white border-b border-border px-5 py-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date popover styled as filter chip */}
          <Popover open={calOpen} onOpenChange={setCalOpen}>
            <PopoverTrigger asChild>
              <button className={cn(
                "inline-flex items-center gap-2 h-10 px-4 rounded-full border-2 text-sm font-semibold transition-all",
                date ? "border-primary bg-primary/10 text-primary" : "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
              )}>
                <CalendarDays className="w-4 h-4" />
                {date ? format(date, "EEE, MMM d") : "Pick a date"}
                {date && (
                  <span onClick={(e) => { e.stopPropagation(); setDate(undefined); }}
                    className="ml-0.5 hover:bg-primary/20 rounded-full p-0.5"><X className="w-3 h-3" /></span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={(d) => { setDate(d); setCalOpen(false); }}
                disabled={(d) => isBefore(d, today)} className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>

          <div className="h-6 w-px bg-border" />

          {/* Time chips */}
          {["flexible", "morning", "afternoon", "evening"].map(t => (
            <button key={t} onClick={() => setTime(t)}
              className={cn(
                "h-10 px-4 rounded-full border text-xs font-bold uppercase tracking-wider transition-all",
                time === t ? "bg-foreground text-white border-foreground" : "bg-background border-border hover:border-foreground/30"
              )}>
              {t === "flexible" ? "Any time" : t}
            </button>
          ))}

          <div className="h-6 w-px bg-border" />

          {/* ZIP + Insurance */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input placeholder="ZIP code" className="h-10 w-24 pl-8 pr-2 border border-border rounded-full text-xs font-medium focus:border-primary/40 focus:outline-none" />
          </div>
          <button className="h-10 flex items-center gap-1.5 px-4 border border-border rounded-full text-xs font-medium text-muted-foreground hover:border-primary/30">
            <Shield className="w-3.5 h-3.5" /> Insurance <ChevronDown className="w-3 h-3" />
          </button>
          <button className="h-10 ml-auto bg-primary text-primary-foreground px-5 rounded-full text-xs font-bold tracking-wide hover:bg-primary/90 transition-colors">
            <Search className="w-4 h-4 inline mr-1.5" /> Search
          </button>
        </div>
      </div>

      {/* Provider results */}
      <div className="p-5 space-y-4">
        <p className="text-xs text-muted-foreground font-medium">{mockProviders.length} providers available</p>
        {mockProviders.map(p => <ProviderCard key={p.name} provider={p} />)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */
export default function NJBookingFilterVariations() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 12%) 0%, hsl(270, 80%, 25%) 50%, hsl(270, 60%, 40%) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-5xl mx-auto px-6 py-10 sm:py-14">
          <img src={logo} alt="Orenda" className="h-8 brightness-0 invert mb-6" />
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Booking Filter Variations
          </h1>
          <p className="text-white/60 mt-3 max-w-xl text-sm sm:text-base">
            Three layout options for the "Book Your Visit" filter bar — date as a filter, not a full section.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 sm:py-14 space-y-16">
        {/* Variation A */}
        <section>
          <div className="mb-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-bold">Variation A</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1">Compact Inline Filter Bar</h2>
            <p className="text-muted-foreground text-sm mt-1">All filters in a single row — date opens as a popover calendar. Providers visible immediately.</p>
          </div>
          <VariationA />
        </section>

        {/* Variation B */}
        <section>
          <div className="mb-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-bold">Variation B</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1">Horizontal Date Strip</h2>
            <p className="text-muted-foreground text-sm mt-1">Scrollable 2-week date strip on purple gradient — tap a day or "Any date". Time + filters below.</p>
          </div>
          <VariationB />
        </section>

        {/* Variation C */}
        <section>
          <div className="mb-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-bold">Variation C</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1">Unified Toolbar</h2>
            <p className="text-muted-foreground text-sm mt-1">Everything in one pill-shaped toolbar — date chip, time pills, ZIP, insurance, search. Most compact.</p>
          </div>
          <VariationC />
        </section>
      </div>
    </div>
  );
}