import { useState } from "react";
import { format, startOfDay, isBefore } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarDays, ChevronDown, MapPin, Shield } from "lucide-react";
import logo from "@/assets/orenda-logo-purple.png";

const today = startOfDay(new Date());

const timeFilters = ["Any Time", "Morning", "Afternoon", "Evening"] as const;

type VariationConfig = {
  id: string;
  name: string;
  bg: string;
  pattern?: string;
  titleColor: string;
  subtitleColor: string;
  pill: string;
  pillActive: string;
  input: string;
};

const variations: VariationConfig[] = [
  {
    id: "A",
    name: "Deep Violet Gradient",
    bg: "linear-gradient(135deg, hsl(270 95% 14%) 0%, hsl(270 60% 42%) 100%)",
    pattern: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
    titleColor: "text-white",
    subtitleColor: "text-white/60",
    pill: "bg-white/20 text-white border border-white/10",
    pillActive: "bg-white text-[hsl(270,80%,20%)] shadow-lg",
    input: "bg-white/20 text-white border border-white/10 placeholder:text-white/50",
  },
  {
    id: "B",
    name: "Frosted Glass",
    bg: "linear-gradient(135deg, hsl(275 85% 38%) 0%, hsl(290 75% 52%) 100%)",
    titleColor: "text-white",
    subtitleColor: "text-white/65",
    pill: "bg-white/85 text-[hsl(275,80%,25%)] backdrop-blur-sm",
    pillActive: "bg-white text-[hsl(275,80%,25%)] shadow-xl ring-2 ring-white/40",
    input: "bg-white/85 text-[hsl(275,80%,25%)] backdrop-blur-sm placeholder:text-[hsl(275,30%,50%)]",
  },
  {
    id: "C",
    name: "Dark Editorial",
    bg: "linear-gradient(160deg, hsl(270 50% 8%) 0%, hsl(270 40% 18%) 100%)",
    pattern: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
    titleColor: "text-white",
    subtitleColor: "text-white/50",
    pill: "bg-white/8 text-white/80 border border-white/12",
    pillActive: "bg-[hsl(270,80%,72%)] text-[hsl(270,90%,10%)] shadow-md",
    input: "bg-white/8 text-white/80 border border-white/12 placeholder:text-white/35",
  },
  {
    id: "D",
    name: "Lavender Cloud",
    bg: "linear-gradient(180deg, hsl(270 45% 92%) 0%, hsl(270 55% 85%) 100%)",
    titleColor: "text-[hsl(270,70%,18%)]",
    subtitleColor: "text-[hsl(270,25%,40%)]",
    pill: "bg-white text-[hsl(270,60%,25%)] border border-[hsl(270,30%,78%)]",
    pillActive: "bg-[hsl(270,70%,35%)] text-white shadow-md",
    input: "bg-white text-[hsl(270,60%,25%)] border border-[hsl(270,30%,78%)] placeholder:text-[hsl(270,20%,55%)]",
  },
  {
    id: "E",
    name: "Midnight Neon",
    bg: "linear-gradient(135deg, hsl(0 0% 5%) 0%, hsl(270 30% 10%) 100%)",
    titleColor: "text-white",
    subtitleColor: "text-white/50",
    pill: "bg-white/6 text-white/75 border border-white/10",
    pillActive: "bg-[hsl(270,100%,65%)] text-white shadow-[0_0_20px_hsl(270,100%,60%,0.4)]",
    input: "bg-white/6 text-white/75 border border-white/10 placeholder:text-white/35",
  },
  {
    id: "F",
    name: "Clean Minimal",
    bg: "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(270 20% 97%) 100%)",
    titleColor: "text-foreground",
    subtitleColor: "text-muted-foreground",
    pill: "bg-[hsl(270,30%,95%)] text-[hsl(270,50%,30%)] border border-[hsl(270,20%,88%)]",
    pillActive: "bg-[hsl(270,70%,35%)] text-white shadow-md",
    input: "bg-[hsl(270,30%,95%)] text-[hsl(270,50%,30%)] border border-[hsl(270,20%,88%)] placeholder:text-[hsl(270,15%,58%)]",
  },
  {
    id: "G",
    name: "Warm Plum",
    bg: "linear-gradient(135deg, hsl(280 60% 22%) 0%, hsl(320 40% 30%) 100%)",
    pattern: "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)",
    titleColor: "text-white",
    subtitleColor: "text-white/55",
    pill: "bg-white/15 text-white/90 border border-white/10",
    pillActive: "bg-[hsl(320,60%,80%)] text-[hsl(280,60%,15%)] shadow-lg",
    input: "bg-white/15 text-white/90 border border-white/10 placeholder:text-white/40",
  },
  {
    id: "H",
    name: "Outlined Rounded",
    bg: "linear-gradient(180deg, hsl(270 100% 15%) 0%, hsl(270 80% 28%) 100%)",
    titleColor: "text-white",
    subtitleColor: "text-white/60",
    pill: "bg-transparent text-white border-2 border-white/30",
    pillActive: "bg-white text-[hsl(270,90%,18%)] border-2 border-white shadow-lg",
    input: "bg-transparent text-white border-2 border-white/30 placeholder:text-white/40",
  },
];

function FilterBar({ v }: { v: VariationConfig }) {
  const [date, setDate] = useState<Date>();
  const [calOpen, setCalOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState("Any Time");

  // All controls share these exact classes for size + font + fixed width
  const base = "h-10 min-w-[110px] px-4 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-1.5";

  const pillClass = (active: boolean) => cn(base, active ? v.pillActive : v.pill);

  return (
    <section className="mb-14">
      {/* Label */}
      <div className="mb-3">
        <span className="text-xs font-bold tracking-widest uppercase text-primary">{v.id}</span>
        <h2 className="text-lg font-bold text-foreground">{v.name}</h2>
      </div>

      {/* Bar */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ background: v.bg }}
      >
        {v.pattern && (
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: v.pattern, backgroundSize: "20px 20px" }}
          />
        )}

        <div className="relative px-5 py-6 sm:px-8 sm:py-8">
          {/* Title */}
          <h3 className={cn("text-xl sm:text-2xl font-bold tracking-tight", v.titleColor)}>
            Book Your Visit
          </h3>
          <p className={cn("text-sm mt-1 mb-5", v.subtitleColor)}>
            Find a provider by date, time, location, or insurance
          </p>

          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Date picker */}
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger asChild>
                <button className={pillClass(!!date)}>
                  <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                  <span>{date ? format(date, "MMM d").toUpperCase() : "ANY DAY"}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => { setDate(d); setCalOpen(false); }}
                  disabled={(d) => isBefore(d, today)}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {/* Time filters */}
            {timeFilters.map((t) => (
              <button
                key={t}
                className={pillClass(timeFilter === t)}
                onClick={() => setTimeFilter(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}

            {/* ZIP input */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-60 pointer-events-none" />
              <input
                placeholder="ZIP CODE"
                maxLength={5}
                className={cn(base, "w-28 pl-8 pr-3 text-left focus:outline-none focus:ring-1 focus:ring-white/30", v.input)}
              />
            </div>

            {/* Insurance */}
            <button className={cn(base, v.pill)}>
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>INSURANCE</span>
              <ChevronDown className="w-3 h-3 shrink-0 opacity-60" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function NJBookingConsistencyVariations() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(270 100% 12%) 0%, hsl(270 70% 30%) 50%, hsl(270 55% 42%) 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative max-w-5xl mx-auto px-6 py-12">
          <img src={logo} alt="Orenda" className="h-8 brightness-0 invert mb-6" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Filter Bar — Redesigned
          </h1>
          <p className="text-white/60 mt-2 max-w-xl text-sm">
            8 variations with identical sizing, font, casing, and spacing on every control.
          </p>
        </div>
      </div>

      {/* Variations */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {variations.map((v) => (
          <FilterBar key={v.id} v={v} />
        ))}
      </div>
    </div>
  );
}
