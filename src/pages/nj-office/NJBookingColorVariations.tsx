import { useState } from "react";
import { format, startOfDay, isBefore } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Search, MapPin, Shield, Clock, ChevronDown,
  CalendarDays, X, User, Star, ArrowRight
} from "lucide-react";
import logo from "@/assets/orenda-logo-purple.png";

const today = startOfDay(new Date());

const timeOptions = [
  { label: "Any time", value: "flexible" },
  { label: "Morning", value: "morning" },
  { label: "Afternoon", value: "afternoon" },
  { label: "Evening", value: "evening" },
];

const mockProviders = [
  { name: "Kimberly Levitt, PMHNP", title: "Psychiatric NP", location: "Hoboken", slots: ["9:00 AM", "9:30 AM", "10:00 AM", "2:00 PM", "2:30 PM"] },
  { name: "Tim Ichniowski, PMHNP", title: "Psychiatric NP", location: "Edison", slots: ["10:00 AM", "10:30 AM", "1:00 PM", "3:00 PM"] },
  { name: "Ted Schimenti, PMHNP", title: "Psychiatric NP", location: "Hoboken", slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM", "4:30 PM"] },
];

function ProviderCard({ provider }: { provider: typeof mockProviders[0] }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/20 transition-all">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <User className="w-6 h-6 text-primary/60" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-foreground font-bold text-sm">{provider.name}</h4>
          <p className="text-muted-foreground text-xs">{provider.title}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-primary/40" />
            <span className="text-xs text-muted-foreground">{provider.location}</span>
            <span className="mx-1 text-muted-foreground">·</span>
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-foreground">5.0</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {provider.slots.map(s => (
          <button key={s} className="px-2.5 py-1 rounded-lg border border-primary/20 text-[11px] font-semibold text-primary hover:bg-primary hover:text-white transition-all">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Shared filter bar component ─── */
interface FilterBarProps {
  bg: string;
  pattern?: string;
  patternOpacity?: string;
  pillDefault: string;
  pillActive: string;
  inputStyle: string;
  headingStyle?: string;
  subtitleStyle?: string;
  showHeading?: boolean;
}

function FilterBar({
  bg, pattern, patternOpacity = "0.05", pillDefault, pillActive, inputStyle,
  headingStyle = "text-white", subtitleStyle = "text-white/60", showHeading = true,
}: FilterBarProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [calOpen, setCalOpen] = useState(false);
  const [time, setTime] = useState("flexible");

  return (
    <div>
      <div className="relative overflow-hidden rounded-t-2xl" style={{ background: bg }}>
        {pattern && (
          <div className="absolute inset-0" style={{ opacity: parseFloat(patternOpacity), backgroundImage: pattern, backgroundSize: '22px 22px' }} />
        )}
        <div className="relative px-5 sm:px-6 py-5">
          {showHeading && (
            <div className="mb-4">
              <h3 className={cn("font-display text-xl sm:text-2xl font-bold", headingStyle)}>
                Book Your Visit <em className="italic font-light">Now</em>
              </h3>
              <p className={cn("text-xs sm:text-sm mt-1", subtitleStyle)}>
                Search by provider, location, or earliest availability
              </p>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {/* Date pill */}
            <Popover open={calOpen} onOpenChange={setCalOpen}>
              <PopoverTrigger asChild>
                <button className={cn(
                  "h-10 inline-flex items-center gap-2 px-4 rounded-xl text-xs font-bold tracking-wide transition-all",
                  date ? pillActive : pillDefault
                )}>
                  <CalendarDays className="w-4 h-4" />
                  {date ? format(date, "MMM d") : "Any date"}
                  {date && (
                    <span onClick={(e) => { e.stopPropagation(); setDate(undefined); setCalOpen(false); }}
                      className="ml-0.5 rounded-full p-0.5 hover:opacity-70"><X className="w-3 h-3" /></span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={(d) => { setDate(d); setCalOpen(false); }}
                  disabled={(d) => isBefore(d, today)} initialFocus className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>

            {/* Time pills */}
            {timeOptions.map(t => (
              <button key={t.value} onClick={() => setTime(t.value)}
                className={cn(
                  "h-10 px-4 rounded-xl text-xs font-bold tracking-wide transition-all",
                  time === t.value ? pillActive : pillDefault
                )}>
                {t.label}
              </button>
            ))}

            {/* ZIP + Insurance */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-60" />
                <input placeholder="ZIP" className={cn("h-10 w-20 pl-8 pr-2 rounded-xl text-xs font-bold border-0 focus:outline-none transition-all", inputStyle)} />
              </div>
              <button className={cn("h-10 flex items-center gap-1.5 px-4 rounded-xl text-xs font-bold transition-all", pillDefault)}>
                <Shield className="w-3.5 h-3.5" /> Insurance <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Provider results */}
      <div className="bg-white rounded-b-2xl border border-t-0 border-border p-5 space-y-3">
        <p className="text-xs text-muted-foreground font-medium">{mockProviders.length} providers available</p>
        {mockProviders.map(p => <ProviderCard key={p.name} provider={p} />)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VARIATIONS
   ═══════════════════════════════════════════════════════ */

const variations: { id: string; title: string; desc: string; props: FilterBarProps }[] = [
  {
    id: "A1",
    title: "Deep Purple + Lavender Pills",
    desc: "Dark purple gradient, light lavender default pills, white when active.",
    props: {
      bg: "linear-gradient(135deg, hsl(270, 100%, 15%) 0%, hsl(270, 80%, 28%) 50%, hsl(270, 60%, 45%) 100%)",
      pattern: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
      pillDefault: "bg-[hsl(270,50%,88%)] text-[hsl(270,70%,25%)]",
      pillActive: "bg-white text-primary shadow-lg",
      inputStyle: "bg-[hsl(270,50%,88%)] text-[hsl(270,70%,25%)] placeholder:text-[hsl(270,30%,55%)]",
    },
  },
  {
    id: "A2",
    title: "Vibrant Purple + White Pills",
    desc: "Brighter, more saturated purple. White glass-like pills with purple text.",
    props: {
      bg: "linear-gradient(135deg, hsl(270, 90%, 35%) 0%, hsl(280, 80%, 50%) 100%)",
      pattern: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
      patternOpacity: "0.08",
      pillDefault: "bg-white/90 text-[hsl(270,80%,30%)] backdrop-blur-sm",
      pillActive: "bg-white text-primary shadow-xl ring-2 ring-white/50",
      inputStyle: "bg-white/90 text-[hsl(270,80%,30%)] placeholder:text-[hsl(270,30%,55%)]",
    },
  },
  {
    id: "A3",
    title: "Near-Black Purple + Soft Glow Pills",
    desc: "Very dark, almost black purple. Soft frosted pills that glow when active.",
    props: {
      bg: "linear-gradient(135deg, hsl(270, 50%, 8%) 0%, hsl(270, 60%, 18%) 100%)",
      pattern: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 0.5px, transparent 0)",
      patternOpacity: "0.04",
      pillDefault: "bg-white/10 text-white/80 border border-white/10",
      pillActive: "bg-[hsl(270,70%,80%)] text-[hsl(270,90%,12%)] shadow-[0_0_20px_hsl(270,70%,60%,0.3)]",
      inputStyle: "bg-white/10 text-white/80 border border-white/10 placeholder:text-white/40",
      headingStyle: "text-white",
      subtitleStyle: "text-white/40",
    },
  },
  {
    id: "A4",
    title: "Purple-to-Indigo + Lavender Frosted",
    desc: "Purple blending to deep indigo. Frosted lavender pills with glassmorphism.",
    props: {
      bg: "linear-gradient(135deg, hsl(270, 80%, 22%) 0%, hsl(240, 60%, 25%) 100%)",
      pattern: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
      patternOpacity: "0.06",
      pillDefault: "bg-[hsl(270,40%,92%)]/90 text-[hsl(260,60%,30%)] backdrop-blur-sm",
      pillActive: "bg-white text-[hsl(260,80%,35%)] shadow-lg",
      inputStyle: "bg-[hsl(270,40%,92%)]/90 text-[hsl(260,60%,30%)] placeholder:text-[hsl(260,30%,55%)]",
    },
  },
  {
    id: "A5",
    title: "Royal Purple + Gold Accent",
    desc: "Rich royal purple with warm gold-tinted active pills for contrast.",
    props: {
      bg: "linear-gradient(135deg, hsl(275, 80%, 18%) 0%, hsl(270, 70%, 32%) 100%)",
      pattern: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)",
      patternOpacity: "0.05",
      pillDefault: "bg-[hsl(270,40%,85%)] text-[hsl(275,60%,25%)]",
      pillActive: "bg-[hsl(42,90%,90%)] text-[hsl(275,70%,22%)] shadow-lg ring-1 ring-[hsl(42,80%,70%)]",
      inputStyle: "bg-[hsl(270,40%,85%)] text-[hsl(275,60%,25%)] placeholder:text-[hsl(270,30%,55%)]",
    },
  },
  {
    id: "A6",
    title: "Soft Lavender + White",
    desc: "Light, airy lavender gradient. Calm and minimal. White active pills.",
    props: {
      bg: "linear-gradient(135deg, hsl(270, 40%, 88%) 0%, hsl(270, 50%, 80%) 100%)",
      pattern: "radial-gradient(circle at 1px 1px, hsl(270,60%,70%) 0.5px, transparent 0)",
      patternOpacity: "0.15",
      pillDefault: "bg-white/70 text-[hsl(270,50%,30%)] border border-[hsl(270,30%,75%)]",
      pillActive: "bg-white text-primary shadow-md border border-primary/20",
      inputStyle: "bg-white/70 text-[hsl(270,50%,30%)] border border-[hsl(270,30%,75%)] placeholder:text-[hsl(270,20%,55%)]",
      headingStyle: "text-[hsl(270,60%,20%)]",
      subtitleStyle: "text-[hsl(270,30%,40%)]",
    },
  },
  {
    id: "A7",
    title: "White Bar + Purple Pills",
    desc: "Clean white background. Purple-tinted pills, filled purple when active.",
    props: {
      bg: "linear-gradient(180deg, hsl(270, 30%, 97%) 0%, white 100%)",
      pillDefault: "bg-primary/10 text-primary border border-primary/15",
      pillActive: "bg-primary text-white shadow-md",
      inputStyle: "bg-primary/5 text-foreground border border-primary/15 placeholder:text-muted-foreground",
      headingStyle: "text-foreground",
      subtitleStyle: "text-muted-foreground",
    },
  },
  {
    id: "A8",
    title: "Black + Neon Purple",
    desc: "Sleek black bar with neon purple glow pills. Bold and modern.",
    props: {
      bg: "linear-gradient(135deg, hsl(0, 0%, 5%) 0%, hsl(270, 30%, 10%) 100%)",
      pattern: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 0.5px, transparent 0)",
      patternOpacity: "0.03",
      pillDefault: "bg-white/8 text-white/70 border border-white/10",
      pillActive: "bg-[hsl(270,90%,65%)] text-white shadow-[0_0_24px_hsl(270,90%,60%,0.4)]",
      inputStyle: "bg-white/8 text-white/70 border border-white/10 placeholder:text-white/30",
      headingStyle: "text-white",
      subtitleStyle: "text-white/40",
    },
  },
];

export default function NJBookingColorVariations() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 12%) 0%, hsl(270, 80%, 25%) 50%, hsl(270, 60%, 40%) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-5xl mx-auto px-6 py-10 sm:py-14">
          <img src={logo} alt="Orenda" className="h-8 brightness-0 invert mb-6" />
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Filter Bar — Color & Design Variations
          </h1>
          <p className="text-white/60 mt-3 max-w-xl text-sm sm:text-base">
            Same compact Variation A layout. Different color palettes, pill styles, and heading treatments. Each includes "Book Your Visit Now."
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 sm:py-14 space-y-20">
        {variations.map((v) => (
          <section key={v.id}>
            <div className="mb-5">
              <span className="text-[10px] tracking-[0.3em] uppercase text-primary font-bold">{v.id}</span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mt-1">{v.title}</h2>
              <p className="text-muted-foreground text-sm mt-1">{v.desc}</p>
            </div>
            <FilterBar {...v.props} />
          </section>
        ))}
      </div>
    </div>
  );
}