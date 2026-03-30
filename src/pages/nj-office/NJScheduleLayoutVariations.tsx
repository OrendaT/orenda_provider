import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, ChevronLeft, ChevronRight, Clock, ArrowRight } from "lucide-react";
import { format, startOfWeek, addDays, addWeeks, subWeeks, isToday, isBefore, startOfDay } from "date-fns";
import NJNavbar from "@/components/NJNavbar";
import NJFooter from "@/components/NJFooter";
import hobokenImg from "@/assets/hoboken-riverfront.png";
import edisonImg from "@/assets/edison-building-glass.png";
import njLocationsMap from "@/assets/nj-locations-map.png";
import njLocationsCard from "@/assets/nj-locations-card.png";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

// Shared data hook
function useSchedulingData() {
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
      const { data, error } = await supabase.from("provider_office_availability").select("*").eq("status", "active").gte("office_date", today).order("office_date");
      if (error) throw error;
      return data;
    },
  });

  const { data: allExistingAppointments = [] } = useQuery({
    queryKey: ["existing-appointments-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("patient_appointments").select("id, provider_availability_id, slot_start, location_id, appointment_status").neq("appointment_status", "cancelled");
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

  const getAvailableDatesForLocation = (locId: string) =>
    allAvailability.filter(a => a.location_id === locId).map(a => a.office_date);

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
        const bookedCount = locAppts.filter(apt => apt.provider_availability_id === avail.id && apt.slot_start === slotStart).length;
        if (bookedCount < avail.slot_capacity) count++;
      }
    }
    return count;
  };

  const getFirstAvailableWeekStart = (locId: string) => {
    const locAvail = allAvailability.filter(a => a.location_id === locId);
    if (locAvail.length > 0) {
      const firstDate = new Date(locAvail[0].office_date + "T00:00:00");
      return startOfWeek(firstDate, { weekStartsOn: 0 });
    }
    return startOfWeek(new Date(), { weekStartsOn: 0 });
  };

  return { sortedLocations, getAvailableDatesForLocation, getSlotCountForDay, getFirstAvailableWeekStart };
}

// ─── DATE CARD (reusable) ───
function DateCard({ day, isAvailable, isPast, slotCount, size = "large" }: {
  day: Date; isAvailable: boolean; isPast: boolean; slotCount: number; size?: "large" | "compact";
}) {
  const isTodayDate = isToday(day);
  const isLarge = size === "large";

  return (
    <button
      disabled={!isAvailable}
      className={`rounded-2xl transition-all duration-300 text-center flex flex-col items-center justify-center ${
        isLarge ? "p-4 md:p-5 min-h-[120px] md:min-h-[150px]" : "p-3 min-h-[90px] md:min-h-[110px]"
      } ${
        isAvailable
          ? "bg-primary/5 border-2 border-primary/30 hover:border-primary hover:shadow-xl hover:bg-primary/10 cursor-pointer"
          : isPast
            ? "bg-muted/20 border-2 border-transparent opacity-40 cursor-not-allowed"
            : "bg-muted/30 border-2 border-border/40 cursor-not-allowed"
      } ${isTodayDate ? "ring-3 ring-primary/40 ring-offset-2" : ""}`}
    >
      <span className={`block uppercase font-bold tracking-wider mb-0.5 ${
        isLarge ? "text-sm md:text-base" : "text-xs"
      } ${isAvailable ? "text-primary" : "text-muted-foreground"}`}>
        {format(day, "EEE")}
      </span>
      <span className={`block font-display font-bold mb-0.5 ${
        isAvailable
          ? isLarge ? "text-4xl md:text-5xl text-foreground" : "text-3xl md:text-4xl text-foreground"
          : isLarge ? "text-3xl md:text-4xl text-foreground/60" : "text-2xl md:text-3xl text-foreground/60"
      }`}>
        {format(day, "d")}
      </span>
      <span className={`block font-semibold ${isLarge ? "text-sm" : "text-xs"} ${
        isAvailable ? "text-foreground/70" : "text-muted-foreground/60"
      }`}>
        {format(day, "MMM")}
      </span>
      {isAvailable && slotCount > 0 && (
        <span className={`mt-2 inline-block font-bold text-primary bg-primary/10 rounded-full ${
          isLarge ? "text-xs px-3 py-1" : "text-[10px] px-2 py-0.5"
        }`}>
          {slotCount} slot{slotCount !== 1 ? "s" : ""}
        </span>
      )}
    </button>
  );
}

// ─── WEEK NAV BAR ───
function WeekNav({ weekStart, onPrev, onNext, weekRange, variant = "full" }: {
  weekStart: Date; onPrev: () => void; onNext: () => void; weekRange: string; variant?: "full" | "compact" | "minimal";
}) {
  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-between mb-4">
        <button onClick={onPrev} className="w-10 h-10 rounded-xl bg-secondary hover:bg-primary/10 flex items-center justify-center transition-colors">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <p className="text-foreground font-display text-lg md:text-xl font-semibold">{weekRange}</p>
        <button onClick={onNext} className="w-10 h-10 rounded-xl bg-secondary hover:bg-primary/10 flex items-center justify-center transition-colors">
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center justify-between mb-4 bg-primary rounded-xl px-4 py-3">
        <button onClick={onPrev} className="w-10 h-10 rounded-xl bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-all">
          <ChevronLeft className="w-6 h-6 text-primary-foreground" />
        </button>
        <p className="text-primary-foreground font-display text-lg font-bold">{weekRange}</p>
        <button onClick={onNext} className="w-10 h-10 rounded-xl bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-all">
          <ChevronRight className="w-6 h-6 text-primary-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-5 bg-primary rounded-2xl px-5 py-4">
      <button onClick={onPrev} className="w-14 h-14 rounded-2xl bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-all shadow-lg">
        <ChevronLeft className="w-8 h-8 text-primary-foreground" strokeWidth={3} />
      </button>
      <div className="text-center">
        <p className="text-primary-foreground/70 text-xs font-semibold uppercase tracking-[0.2em] mb-0.5">Week of</p>
        <p className="text-primary-foreground font-display text-xl md:text-2xl font-bold">{weekRange}</p>
      </div>
      <button onClick={onNext} className="w-14 h-14 rounded-2xl bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center justify-center transition-all shadow-lg">
        <ChevronRight className="w-8 h-8 text-primary-foreground" strokeWidth={3} />
      </button>
    </div>
  );
}

// ─── LOCATION HEADER ───
function LocationHeader({ name, address, variant = "full", image }: {
  name: string; address: string; variant?: "full" | "compact" | "with-image"; image?: string;
}) {
  if (variant === "with-image" && image) {
    return (
      <div className="flex items-center gap-4 mb-4">
        <img src={image} alt={name} className="w-16 h-16 rounded-2xl object-cover" />
        <div>
          <h3 className="font-display text-2xl md:text-3xl text-foreground font-semibold">{name}</h3>
          <p className="text-muted-foreground text-sm">{address}</p>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-xl md:text-2xl text-foreground font-semibold">{name}</h3>
          <p className="text-muted-foreground text-xs">{address}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 mb-5">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
        <MapPin className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="font-display text-2xl md:text-3xl text-foreground font-semibold">{name}</h3>
        <p className="text-muted-foreground text-sm">{address}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// VARIATION A: Side-by-Side (Current Giant Cards, 2 columns)
// ═══════════════════════════════════════════════════════
function VariationA() {
  const { sortedLocations, getAvailableDatesForLocation, getSlotCountForDay, getFirstAvailableWeekStart } = useSchedulingData();
  const [weekStarts, setWeekStarts] = useState<Record<string, Date>>({});
  const today = startOfDay(new Date());

  const getWeekStart = (locId: string) => weekStarts[locId] || getFirstAvailableWeekStart(locId);
  const setWS = (locId: string, d: Date) => setWeekStarts(prev => ({ ...prev, [locId]: d }));

  // 3 color-blocking options to cycle through
  const [colorOption, setColorOption] = useState(0);
  const colorOptions = [
    { label: "Deep Purple / Lavender", hoboken: "bg-primary", edison: "bg-[hsl(270,40%,75%)]", hobokenText: "text-primary-foreground", edisonText: "text-[hsl(270,60%,15%)]" },
    { label: "Royal Purple / Soft Plum", hoboken: "bg-[hsl(270,80%,20%)]", edison: "bg-[hsl(270,30%,88%)]", hobokenText: "text-white", edisonText: "text-[hsl(270,60%,15%)]" },
    { label: "Gradient Purple / Muted Violet", hoboken: "bg-[hsl(270,70%,30%)]", edison: "bg-[hsl(280,25%,92%)]", hobokenText: "text-white", edisonText: "text-[hsl(270,60%,15%)]" },
  ];
  const currentColors = colorOptions[colorOption];

  return (
    <div>
      {/* Color option selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {colorOptions.map((opt, i) => (
          <button
            key={i}
            onClick={() => setColorOption(i)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              colorOption === i
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden mb-6">
        <img src={njLocationsMap} alt="Hoboken & Edison office locations" className="w-full h-auto object-cover rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {sortedLocations.map((loc) => {
        const ws = getWeekStart(loc.id);
        const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i));
        const avail = getAvailableDatesForLocation(loc.id);
        const range = `${format(ws, "MMM d")} – ${format(addDays(ws, 6), "MMM d")}`;
        const isHoboken = loc.name.toLowerCase().includes("hoboken");
        const fullAddress = isHoboken
          ? "221 River Street, 9th Floor, Unit 9076, Hoboken, NJ 07030"
          : "110 Fieldcrest Avenue, 3rd Floor, Edison, NJ 08837";
        const cardBg = isHoboken ? currentColors.hoboken : currentColors.edison;
        const textColor = isHoboken ? currentColors.hobokenText : currentColors.edisonText;

        return (
          <div key={loc.id} className={`rounded-3xl p-6 ${cardBg} shadow-2xl`}>
            {/* Location name & address with bold, popping typography */}
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                isHoboken ? "bg-white/20" : "bg-primary/10"
              }`}>
                <MapPin className={`w-7 h-7 ${textColor}`} />
              </div>
              <div>
                <h3 className={`font-display text-3xl md:text-4xl font-bold tracking-tight ${textColor}`}>{loc.name}</h3>
                <p className={`text-sm font-medium ${isHoboken ? "text-white/80" : "text-[hsl(270,30%,40%)]"}`}>{fullAddress}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <WeekNav weekStart={ws} onPrev={() => setWS(loc.id, subWeeks(ws, 1))} onNext={() => setWS(loc.id, addWeeks(ws, 1))} weekRange={range} variant="compact" />
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {days.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const hasAvail = avail.includes(dateStr);
                  const isPast = isBefore(day, today) && !isToday(day);
                  const isAvail = hasAvail && !isPast;
                  const slots = isAvail ? getSlotCountForDay(day, loc.id) : 0;
                  return <DateCard key={day.toISOString()} day={day} isAvailable={isAvail} isPast={isPast} slotCount={slots} size="large" />;
                })}
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// VARIATION B: Tabbed — Toggle between Hoboken / Edison
// ═══════════════════════════════════════════════════════
function VariationB() {
  const { sortedLocations, getAvailableDatesForLocation, getSlotCountForDay, getFirstAvailableWeekStart } = useSchedulingData();
  const [activeTab, setActiveTab] = useState(0);
  const [weekStarts, setWeekStarts] = useState<Record<string, Date>>({});
  const today = startOfDay(new Date());

  const getWeekStart = (locId: string) => weekStarts[locId] || getFirstAvailableWeekStart(locId);
  const setWS = (locId: string, d: Date) => setWeekStarts(prev => ({ ...prev, [locId]: d }));

  const loc = sortedLocations[activeTab];
  if (!loc) return null;

  const ws = getWeekStart(loc.id);
  const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i));
  const avail = getAvailableDatesForLocation(loc.id);
  const range = `${format(ws, "MMM d")} – ${format(addDays(ws, 6), "MMM d, yyyy")}`;

  const locationImages = [hobokenImg, edisonImg];

  return (
    <div>
      <div className="rounded-2xl overflow-hidden mb-6">
        <img src={njLocationsCard} alt="Hoboken & Edison office locations" className="w-full h-auto object-cover rounded-2xl" />
      </div>
      {/* Tab buttons */}
      <div className="flex gap-3 mb-6">
        {sortedLocations.map((l, idx) => (
          <button
            key={l.id}
            onClick={() => setActiveTab(idx)}
            className={`flex-1 py-4 px-5 rounded-2xl font-display text-lg md:text-xl font-semibold transition-all duration-300 ${
              activeTab === idx
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-secondary/40 text-foreground hover:bg-secondary"
            }`}
          >
            <MapPin className={`w-5 h-5 inline mr-2 ${activeTab === idx ? "text-primary-foreground" : "text-primary"}`} />
            {l.name}
          </button>
        ))}
      </div>

      {/* Calendar for active tab */}
      <div className="bg-white border-2 border-border/20 rounded-3xl p-6">
        <div className="flex items-center gap-4 mb-5">
          <img src={locationImages[activeTab]} alt={loc.name} className="w-20 h-20 rounded-2xl object-cover" />
          <div>
            <h3 className="font-display text-3xl text-foreground font-semibold">{loc.name}</h3>
            <p className="text-muted-foreground">{loc.address}, {loc.city}</p>
          </div>
        </div>

        <WeekNav weekStart={ws} onPrev={() => setWS(loc.id, subWeeks(ws, 1))} onNext={() => setWS(loc.id, addWeeks(ws, 1))} weekRange={range} variant="full" />

        <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const hasAvail = avail.includes(dateStr);
            const isPast = isBefore(day, today) && !isToday(day);
            const isAvail = hasAvail && !isPast;
            const slots = isAvail ? getSlotCountForDay(day, loc.id) : 0;
            return <DateCard key={day.toISOString()} day={day} isAvailable={isAvail} isPast={isPast} slotCount={slots} size="large" />;
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// VARIATION C: Stacked Compact — Both visible, minimal height
// ═══════════════════════════════════════════════════════
function VariationC() {
  const { sortedLocations, getAvailableDatesForLocation, getSlotCountForDay, getFirstAvailableWeekStart } = useSchedulingData();
  const [weekStarts, setWeekStarts] = useState<Record<string, Date>>({});
  const today = startOfDay(new Date());

  const getWeekStart = (locId: string) => weekStarts[locId] || getFirstAvailableWeekStart(locId);
  const setWS = (locId: string, d: Date) => setWeekStarts(prev => ({ ...prev, [locId]: d }));

  return (
    <div>
      <div className="rounded-2xl overflow-hidden mb-4">
        <img src={njLocationsMap} alt="Hoboken & Edison office locations" className="w-full h-auto object-cover rounded-2xl" />
      </div>
      <div className="space-y-4">
      {sortedLocations.map((loc, idx) => {
        const ws = getWeekStart(loc.id);
        const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i));
        const avail = getAvailableDatesForLocation(loc.id);
        const range = `${format(ws, "MMM d")} – ${format(addDays(ws, 6), "MMM d")}`;

        return (
          <div key={loc.id} className={`rounded-2xl p-4 ${idx === 0 ? "bg-primary/5 border-2 border-primary/20" : "bg-secondary/20 border-2 border-border/20"}`}>
            <div className="flex items-center justify-between mb-3">
              <LocationHeader name={loc.name} address={`${loc.address}, ${loc.city}`} variant="compact" />
            </div>
            <WeekNav weekStart={ws} onPrev={() => setWS(loc.id, subWeeks(ws, 1))} onNext={() => setWS(loc.id, addWeeks(ws, 1))} weekRange={range} variant="minimal" />
            <div className="grid grid-cols-7 gap-2">
              {days.map((day) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const hasAvail = avail.includes(dateStr);
                const isPast = isBefore(day, today) && !isToday(day);
                const isAvail = hasAvail && !isPast;
                const slots = isAvail ? getSlotCountForDay(day, loc.id) : 0;
                return <DateCard key={day.toISOString()} day={day} isAvailable={isAvail} isPast={isPast} slotCount={slots} size="compact" />;
              })}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// VARIATION D: Cards with Image Header + Map Placeholder
// ═══════════════════════════════════════════════════════
function VariationD() {
  const { sortedLocations, getAvailableDatesForLocation, getSlotCountForDay, getFirstAvailableWeekStart } = useSchedulingData();
  const [weekStarts, setWeekStarts] = useState<Record<string, Date>>({});
  const today = startOfDay(new Date());
  const locationImages = [hobokenImg, edisonImg];

  const getWeekStart = (locId: string) => weekStarts[locId] || getFirstAvailableWeekStart(locId);
  const setWS = (locId: string, d: Date) => setWeekStarts(prev => ({ ...prev, [locId]: d }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {sortedLocations.map((loc, idx) => {
        const ws = getWeekStart(loc.id);
        const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i));
        const avail = getAvailableDatesForLocation(loc.id);
        const range = `${format(ws, "MMM d")} – ${format(addDays(ws, 6), "MMM d")}`;

        return (
          <div key={loc.id} className="rounded-3xl overflow-hidden border-2 border-border/20 bg-white">
            {/* Image header */}
            <div className="relative h-32 overflow-hidden">
              <img src={locationImages[idx]} alt={loc.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="font-display text-2xl text-white font-bold">{loc.name}</h3>
                <p className="text-white/80 text-sm">{loc.address}, {loc.city}</p>
              </div>
            </div>

            <div className="p-4">
              <WeekNav weekStart={ws} onPrev={() => setWS(loc.id, subWeeks(ws, 1))} onNext={() => setWS(loc.id, addWeeks(ws, 1))} weekRange={range} variant="minimal" />
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {days.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const hasAvail = avail.includes(dateStr);
                  const isPast = isBefore(day, today) && !isToday(day);
                  const isAvail = hasAvail && !isPast;
                  const slots = isAvail ? getSlotCountForDay(day, loc.id) : 0;
                  return <DateCard key={day.toISOString()} day={day} isAvailable={isAvail} isPast={isPast} slotCount={slots} size="compact" />;
                })}
              </div>

              {/* Branded map */}
              <div className="mt-4 rounded-xl overflow-hidden">
                <img src={njLocationsCard} alt="Hoboken & Edison office locations" className="w-full h-auto object-cover rounded-xl" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// VARIATION E: Full-width stacked with shared map
// ═══════════════════════════════════════════════════════
function VariationE() {
  const { sortedLocations, getAvailableDatesForLocation, getSlotCountForDay, getFirstAvailableWeekStart } = useSchedulingData();
  const [weekStarts, setWeekStarts] = useState<Record<string, Date>>({});
  const today = startOfDay(new Date());

  const getWeekStart = (locId: string) => weekStarts[locId] || getFirstAvailableWeekStart(locId);
  const setWS = (locId: string, d: Date) => setWeekStarts(prev => ({ ...prev, [locId]: d }));

  return (
    <div>
      {/* Shared map placeholder at top */}
      <div className="rounded-2xl overflow-hidden mb-8">
        <img src={njLocationsMap} alt="Hoboken & Edison office locations" className="w-full h-auto object-cover rounded-2xl" />
      </div>

      {/* Side-by-side calendars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {sortedLocations.map((loc) => {
          const ws = getWeekStart(loc.id);
          const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i));
          const avail = getAvailableDatesForLocation(loc.id);
          const range = `${format(ws, "MMM d")} – ${format(addDays(ws, 6), "MMM d")}`;

          return (
            <div key={loc.id}>
              <LocationHeader name={loc.name} address={`${loc.address}, ${loc.city}`} />
              <WeekNav weekStart={ws} onPrev={() => setWS(loc.id, subWeeks(ws, 1))} onNext={() => setWS(loc.id, addWeeks(ws, 1))} weekRange={range} variant="full" />
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
                {days.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const hasAvail = avail.includes(dateStr);
                  const isPast = isBefore(day, today) && !isToday(day);
                  const isAvail = hasAvail && !isPast;
                  const slots = isAvail ? getSlotCountForDay(day, loc.id) : 0;
                  return <DateCard key={day.toISOString()} day={day} isAvailable={isAvail} isPast={isPast} slotCount={slots} size="large" />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// VARIATION F: Calendar + Image Split (hero-style per location)
// ═══════════════════════════════════════════════════════
function VariationF() {
  const { sortedLocations, getAvailableDatesForLocation, getSlotCountForDay, getFirstAvailableWeekStart } = useSchedulingData();
  const [weekStarts, setWeekStarts] = useState<Record<string, Date>>({});
  const today = startOfDay(new Date());
  const locationImages = [hobokenImg, edisonImg];

  const getWeekStart = (locId: string) => weekStarts[locId] || getFirstAvailableWeekStart(locId);
  const setWS = (locId: string, d: Date) => setWeekStarts(prev => ({ ...prev, [locId]: d }));

  return (
    <div className="space-y-6">
      {sortedLocations.map((loc, idx) => {
        const ws = getWeekStart(loc.id);
        const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i));
        const avail = getAvailableDatesForLocation(loc.id);
        const range = `${format(ws, "MMM d")} – ${format(addDays(ws, 6), "MMM d")}`;

        return (
          <div key={loc.id} className="grid grid-cols-1 lg:grid-cols-3 gap-0 rounded-3xl overflow-hidden border-2 border-border/20">
            {/* Image side */}
            <div className="relative lg:col-span-1 h-48 lg:h-auto">
              <img src={locationImages[idx]} alt={loc.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent lg:bg-gradient-to-t" />
              <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6">
                <h3 className="font-display text-3xl text-white font-bold">{loc.name}</h3>
                <p className="text-white/80 text-sm mt-1">{loc.address}, {loc.city}</p>
                {/* Map placeholder */}
                <a href={GOOGLE_MAPS_LINK} target="_blank" rel="noopener noreferrer" className="mt-3 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm inline-flex items-center gap-2 hover:bg-white/30 transition-colors">
                  <MapPin className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-semibold">View on Map</span>
                </a>
              </div>
            </div>

            {/* Calendar side */}
            <div className="lg:col-span-2 p-5 bg-white">
              <WeekNav weekStart={ws} onPrev={() => setWS(loc.id, subWeeks(ws, 1))} onNext={() => setWS(loc.id, addWeeks(ws, 1))} weekRange={range} variant="compact" />
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {days.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const hasAvail = avail.includes(dateStr);
                  const isPast = isBefore(day, today) && !isToday(day);
                  const isAvail = hasAvail && !isPast;
                  const slots = isAvail ? getSlotCountForDay(day, loc.id) : 0;
                  return <DateCard key={day.toISOString()} day={day} isAvailable={isAvail} isPast={isPast} slotCount={slots} size="large" />;
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Google Maps link
const GOOGLE_MAPS_LINK = "https://www.google.com/maps/d/u/0/viewer?mid=1_QmbeiUR-9czAiqWTXUwV6u8yzsQp3A";

// Section wrapper with alternating backgrounds
function VariationSection({ label, title, description, children, index }: {
  label: string; title: string; description: string; children: React.ReactNode; index: number;
}) {
  const isOdd = index % 2 === 1;
  return (
    <div className={`${isOdd ? "bg-secondary/20" : "bg-white"}`}>
      {/* Bold divider */}
      {index > 0 && (
        <div className="h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      )}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="max-w-7xl mx-auto px-6 md:px-10 py-14"
      >
        <div className="mb-8">
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-primary-foreground bg-primary px-4 py-2 rounded-lg inline-block">{label}</span>
          <h2 className="font-display text-3xl md:text-4xl text-foreground font-bold mt-4">{title}</h2>
          <p className="text-muted-foreground text-lg mt-1">{description}</p>
        </div>
        {children}
      </motion.section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════
export default function NJScheduleLayoutVariations() {
  return (
    <div className="min-h-screen bg-white font-body">
      <NJNavbar />

      {/* Page header */}
      <div className="bg-primary py-10 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <h1 className="font-display text-4xl md:text-6xl text-primary-foreground font-bold mb-2">Schedule Layout Variations</h1>
            <p className="text-primary-foreground/70 text-lg">Exploring different ways to display both Hoboken & Edison scheduling above the fold.</p>
          </motion.div>
        </div>
      </div>

      <VariationSection index={0} label="Variation A" title="Side-by-Side Cards" description="Both locations in a 2-column grid with independent week navigation. Giant date cards preserved.">
        <VariationA />
      </VariationSection>

      <VariationSection index={1} label="Variation B" title="Tabbed Toggle" description="Full-width calendar with tab buttons to switch between locations. Maximum card size.">
        <VariationB />
      </VariationSection>

      <VariationSection index={2} label="Variation C" title="Stacked Compact" description="Both calendars stacked vertically with compact cards — both visible above the fold on most screens.">
        <VariationC />
      </VariationSection>

      <VariationSection index={3} label="Variation D" title="Image Header + Map Cards" description="Each location gets a photo header and a Google Maps embed below the calendar.">
        <VariationD />
      </VariationSection>

      <VariationSection index={4} label="Variation E" title="Shared Map + Side-by-Side" description="A single map showing both pins at the top, with side-by-side calendars below.">
        <VariationE />
      </VariationSection>

      <VariationSection index={5} label="Variation F" title="Hero Split — Image + Calendar" description="Each location as a wide card with office photo on the left and calendar on the right.">
        <VariationF />
      </VariationSection>

      <NJFooter />
    </div>
  );
}
