import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Shield, Clock, ChevronDown, ChevronLeft, ChevronRight, Star, CheckCircle2, Calendar as CalendarIcon, Filter, X, User, Loader2, ArrowLeft, CalendarDays } from "lucide-react";
import { format, addDays, startOfDay, isBefore, addMinutes, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

import aetnaLogo from "@/assets/insurance/aetna.png";
import anthemLogo from "@/assets/insurance/anthem.png";
import cignaLogo from "@/assets/insurance/cigna.png";
import oscarLogo from "@/assets/insurance/oscar.png";
import oxfordLogo from "@/assets/insurance/oxford.png";
import tricLogo from "@/assets/insurance/tricare.png";
import uhcLogo from "@/assets/insurance/unitedhealthcare.png";
import compsychLogo from "@/assets/insurance/compsych.png";

// ─── Insurance options ───
const insuranceOptions = [
  { name: "Aetna", logo: aetnaLogo, inNetwork: true },
  { name: "Anthem BCBS", logo: anthemLogo, inNetwork: true },
  { name: "Cigna / Evernorth", logo: cignaLogo, inNetwork: true },
  { name: "Oscar Health", logo: oscarLogo, inNetwork: true },
  { name: "Oxford / UnitedHealthcare", logo: oxfordLogo, inNetwork: true },
  { name: "UnitedHealthcare", logo: uhcLogo, inNetwork: true },
  { name: "TRICARE", logo: tricLogo, inNetwork: true },
  { name: "ComPsych", logo: compsychLogo, inNetwork: true },
  { name: "Medicare", logo: null, inNetwork: false },
  { name: "Medicaid", logo: null, inNetwork: false },
  { name: "Blue Cross Blue Shield", logo: null, inNetwork: false },
  { name: "Other / Out of Network", logo: null, inNetwork: false },
];

const locationMap: Record<string, { label: string; address: string; coords: [number, number] }> = {
  "hoboken": { label: "Hoboken – Riverfront Center", address: "221 River St, 9th Floor, Hoboken, NJ 07030", coords: [40.7370, -74.0300] },
  "edison": { label: "Edison Office", address: "110 Fieldcrest Ave, 3rd Floor, Edison, NJ 08837", coords: [40.5187, -74.4121] },
};

// Rough distance calc (Haversine, miles)
function calcDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Estimate drive time (~30 mph avg in NJ)
function estimateDriveTime(miles: number): string {
  const mins = Math.round(miles / 30 * 60);
  if (mins < 60) return `~${mins} min drive`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `~${h}h ${m}m drive` : `~${h}h drive`;
}

const timeFilters = [
  { label: "I'm flexible", value: "flexible", icon: Calendar },
  { label: "Morning", value: "morning", icon: Clock, desc: "Before 12 PM" },
  { label: "Afternoon", value: "afternoon", icon: Clock, desc: "12 – 5 PM" },
  { label: "Evening", value: "evening", icon: Clock, desc: "After 5 PM" },
];

interface ProviderRow {
  id: string;
  provider_name: string;
  title: string;
  credentials: string;
  photo_url: string | null;
  rating: number | null;
  location: string;
  insurers: string[];
  specialties: string[];
  accepts_new: boolean;
}

interface AvailabilityRecord {
  id: string;
  office_date: string;
  start_time: string;
  end_time: string;
  provider_name: string;
  provider_email: string;
  location_id: string;
  appointment_duration_minutes: number;
  slot_capacity: number;
}

interface TimeSlot {
  time: string; // "09:00"
  endTime: string; // "09:30"
  label: string; // "9:00 AM"
  availabilityId: string;
}

// Generate 30-min time slots from an availability record
function generateTimeSlots(avail: AvailabilityRecord): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startH = parseInt(avail.start_time.split(':')[0]);
  const startM = parseInt(avail.start_time.split(':')[1] || '0');
  const endH = parseInt(avail.end_time.split(':')[0]);
  const endM = parseInt(avail.end_time.split(':')[1] || '0');
  const duration = avail.appointment_duration_minutes || 30;

  let currentMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (currentMinutes + duration <= endMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    const endSlotMin = currentMinutes + duration;
    const eh = Math.floor(endSlotMin / 60);
    const em = endSlotMin % 60;
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    const endTime = `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const label = `${displayH}:${String(m).padStart(2, '0')} ${ampm}`;
    slots.push({ time, endTime, label, availabilityId: avail.id });
    currentMinutes += duration;
  }
  return slots;
}

// Filter slots by time preference
function filterSlotsByTime(slots: TimeSlot[], timeFilter: string): TimeSlot[] {
  if (timeFilter === "flexible") return slots;
  return slots.filter(s => {
    const h = parseInt(s.time.split(':')[0]);
    if (timeFilter === "morning") return h < 12;
    if (timeFilter === "afternoon") return h >= 12 && h < 17;
    if (timeFilter === "evening") return h >= 17;
    return true;
  });
}

export default function ProviderSearch() {
  const [zipCode, setZipCode] = useState("");
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [insuranceOpen, setInsuranceOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState("flexible");
  const [timePopoverOpen, setTimePopoverOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [providerPopoverOpen, setProviderPopoverOpen] = useState(false);
  const [weekOffset, setWeekOffset] = useState<Record<string, number>>({});
  const [providers, setProviders] = useState<ProviderRow[]>([]);
  const [availability, setAvailability] = useState<AvailabilityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferredDate, setPreferredDate] = useState<Date | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

  // Try to get user location for distance calc
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords([pos.coords.latitude, pos.coords.longitude]),
        () => {} // silently fail
      );
    }
  }, []);

  const loadData = useCallback(async () => {
    const [provRes, availRes] = await Promise.all([
      supabase.from("providers").select("id, provider_name, title, credentials, photo_url, rating, location, insurers, specialties, accepts_new").order("created_at", { ascending: false }),
      supabase.from("provider_office_availability").select("id, office_date, start_time, end_time, provider_name, provider_email, location_id, appointment_duration_minutes, slot_capacity").eq("status", "active").gte("office_date", format(new Date(), "yyyy-MM-dd")),
    ]);
    if (provRes.data) setProviders(provRes.data);
    if (availRes.data) setAvailability(availRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Fetch locations to map location_id -> location key
  const [locations, setLocations] = useState<Record<string, string>>({});
  useEffect(() => {
    supabase.from("locations").select("id, name").then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach(l => { map[l.id] = l.name.toLowerCase(); });
        setLocations(map);
      }
    });
  }, []);

  const getDistanceForLocation = useCallback((locKey: string): string => {
    const loc = locationMap[locKey];
    if (!loc || !userCoords) return "";
    const miles = calcDistanceMiles(userCoords[0], userCoords[1], loc.coords[0], loc.coords[1]);
    return `${miles.toFixed(1)} mi · ${estimateDriveTime(miles)}`;
  }, [userCoords]);

  const selectedInsuranceObj = insuranceOptions.find(i => i.name === selectedInsurance);

  const filteredProviders = useMemo(() => {
    return providers
      .filter(p => !selectedProvider || p.provider_name === selectedProvider)
      .map(provider => {
        const isInNetwork = selectedInsurance
          ? provider.insurers.some(ins => ins.toLowerCase().includes(selectedInsurance.toLowerCase()) || selectedInsurance.toLowerCase().includes(ins.toLowerCase()))
          : null;
        const locKey = provider.location.toLowerCase();
        const loc = locationMap[locKey] || { label: provider.location, address: "", coords: [0, 0] as [number, number] };
        const distance = getDistanceForLocation(locKey);
        return { ...provider, isInNetwork, locationInfo: { label: loc.label, address: loc.address, distance } };
      });
  }, [providers, selectedInsurance, selectedProvider, getDistanceForLocation]);

  const today = startOfDay(new Date());

  if (loading) {
    return (
      <div className="w-full py-16 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">Loading providers…</p>
      </div>
    );
  }

  const pillBase = "h-10 min-w-[110px] px-4 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200 inline-flex items-center justify-center gap-1.5";
  const mobilePill = "h-12 min-w-0 flex-1 px-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 inline-flex items-center justify-center gap-2";

  return (
    <div className="w-full">
      {/* ── Filter Bar ── */}
      <div className="relative overflow-hidden sticky top-14 md:top-16 z-40" style={{ background: 'linear-gradient(180deg, hsl(270, 100%, 15%) 0%, hsl(270, 80%, 28%) 100%)' }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-3 md:py-5">

          {/* ── MOBILE FILTER LAYOUT ── */}
          <div className="md:hidden space-y-2.5">
            {/* Row 1: Date + Time + Provider */}
            <div className="flex gap-2">
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <button className={cn(
                    mobilePill,
                    preferredDate
                      ? "bg-white text-[hsl(270,90%,18%)] border-2 border-white shadow-lg"
                      : "bg-white/10 text-white border-2 border-white/20"
                  )}>
                    <CalendarDays className="w-4 h-4 shrink-0" />
                    {preferredDate ? format(preferredDate, "MMM d") : "Day"}
                    {preferredDate && (
                      <span onClick={(e) => { e.stopPropagation(); setPreferredDate(undefined); setDatePickerOpen(false); }}
                        className="ml-0.5 rounded-full p-0.5"><X className="w-3.5 h-3.5" /></span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={preferredDate}
                    onSelect={(d) => { setPreferredDate(d); setDatePickerOpen(false); }}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>

              <Popover open={timePopoverOpen} onOpenChange={setTimePopoverOpen}>
                <PopoverTrigger asChild>
                  <button className={cn(
                    mobilePill,
                    timeFilter !== "flexible"
                      ? "bg-white text-[hsl(270,90%,18%)] border-2 border-white shadow-lg"
                      : "bg-white/10 text-white border-2 border-white/20"
                  )}>
                    <Clock className="w-4 h-4 shrink-0" />
                    {timeFilter === "flexible" ? "Time" : timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}
                    {timeFilter !== "flexible" && (
                      <span onClick={(e) => { e.stopPropagation(); setTimeFilter("flexible"); setTimePopoverOpen(false); }}
                        className="ml-0.5 rounded-full p-0.5"><X className="w-3.5 h-3.5" /></span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-1.5" align="center">
                  {[{ label: "Morning", value: "morning", desc: "Before 12 PM" }, { label: "Afternoon", value: "afternoon", desc: "12 – 5 PM" }, { label: "Evening", value: "evening", desc: "After 5 PM" }].map((t) => (
                    <button key={t.value} onClick={() => { setTimeFilter(t.value); setTimePopoverOpen(false); }}
                      className={cn("w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between",
                        timeFilter === t.value ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary/50"
                      )}>
                      <span>{t.label}</span>
                      <span className="text-xs text-muted-foreground">{t.desc}</span>
                    </button>
                  ))}
                </PopoverContent>
              </Popover>

              <Popover open={providerPopoverOpen} onOpenChange={setProviderPopoverOpen}>
                <PopoverTrigger asChild>
                  <button className={cn(
                    mobilePill,
                    selectedProvider
                      ? "bg-white text-[hsl(270,90%,18%)] border-2 border-white shadow-lg"
                      : "bg-white/10 text-white border-2 border-white/20"
                  )}>
                    <User className="w-4 h-4 shrink-0" />
                    {selectedProvider ? selectedProvider.split(",")[0].split(" ").pop() : "Provider"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-32px)] max-w-sm p-1.5 max-h-80 overflow-y-auto" align="center">
                  {selectedProvider && (
                    <button onClick={() => { setSelectedProvider(""); setProviderPopoverOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-muted-foreground hover:bg-secondary/50 border-b border-border rounded-xl mb-1">All providers</button>
                  )}
                  {providers.map((p) => (
                    <button key={p.id} onClick={() => { setSelectedProvider(p.provider_name); setProviderPopoverOpen(false); }}
                      className={cn("w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-3",
                        selectedProvider === p.provider_name ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary/50"
                      )}>
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-primary/60" />
                      </div>
                      <div>
                        <p className="font-semibold">{p.provider_name}</p>
                        <p className="text-xs text-muted-foreground">{p.credentials} · {p.location}</p>
                      </div>
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>

            {/* Row 2: ZIP + Insurance */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  placeholder="ZIP Code"
                  className="h-12 w-full pl-10 pr-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider bg-white/10 text-white border-2 border-white/20 placeholder:text-white/40 focus:border-white focus:outline-none transition-all" />
              </div>
              <div className="relative flex-1">
                <button onClick={() => setInsuranceOpen(!insuranceOpen)}
                  className={cn(mobilePill, "w-full bg-white/10 text-white border-2 border-white/20")}>
                  {selectedInsuranceObj?.logo ? (
                    <img src={selectedInsuranceObj.logo} alt="" className="w-5 h-5 object-contain shrink-0 brightness-0 invert" />
                  ) : (
                    <Shield className="w-4 h-4 shrink-0" />
                  )}
                  <span className="truncate">{selectedInsurance || "Insurance"}</span>
                  <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-60" />
                </button>
                <AnimatePresence>
                  {insuranceOpen && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-2xl shadow-2xl z-50 max-h-72 overflow-y-auto">
                      {selectedInsurance && (
                        <button onClick={() => { setSelectedInsurance(""); setInsuranceOpen(false); }}
                          className="w-full text-left px-4 py-3.5 text-sm text-muted-foreground hover:bg-secondary/50 border-b border-border">Clear selection</button>
                      )}
                      {insuranceOptions.map((ins) => (
                        <button key={ins.name} onClick={() => { setSelectedInsurance(ins.name); setInsuranceOpen(false); }}
                          className={`w-full text-left px-4 py-3.5 flex items-center gap-3 hover:bg-primary/5 transition-colors ${selectedInsurance === ins.name ? 'bg-primary/5' : ''}`}>
                          {ins.logo ? (
                            <img src={ins.logo} alt="" className="w-6 h-6 object-contain shrink-0" />
                          ) : (
                            <div className="w-6 h-6 rounded bg-muted flex items-center justify-center shrink-0"><Shield className="w-3.5 h-3.5 text-muted-foreground" /></div>
                          )}
                          <span className="text-sm font-medium text-foreground">{ins.name}</span>
                          {ins.inNetwork && (
                            <span className="ml-auto text-[10px] uppercase tracking-wider font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">In-Network</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── DESKTOP FILTER LAYOUT (unchanged) ── */}
          <div className="hidden md:flex flex-wrap items-center gap-2">
            {/* Date filter */}
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <button className={cn(
                  pillBase,
                  preferredDate
                    ? "bg-white text-[hsl(270,90%,18%)] border-2 border-white shadow-lg"
                    : "bg-transparent text-white border-2 border-white/30 hover:border-white/50"
                )}>
                  <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                  {preferredDate ? format(preferredDate, "MMM d").toUpperCase() : "ANY DAY"}
                  {preferredDate && (
                    <span onClick={(e) => { e.stopPropagation(); setPreferredDate(undefined); setDatePickerOpen(false); }}
                      className="ml-1 hover:bg-primary/10 rounded-full p-0.5"><X className="w-3 h-3" /></span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={preferredDate}
                  onSelect={(d) => { setPreferredDate(d); setDatePickerOpen(false); }}
                  disabled={(date) => isBefore(date, startOfDay(new Date()))}
                  initialFocus className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>

            {/* Time popover */}
            <Popover open={timePopoverOpen} onOpenChange={setTimePopoverOpen}>
              <PopoverTrigger asChild>
                <button className={cn(
                  pillBase,
                  timeFilter !== "flexible"
                    ? "bg-white text-[hsl(270,90%,18%)] border-2 border-white shadow-lg"
                    : "bg-transparent text-white border-2 border-white/30 hover:border-white/50"
                )}>
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  {timeFilter === "flexible" ? "TIME" : timeFilter === "morning" ? "MORNING" : timeFilter === "afternoon" ? "AFTERNOON" : "EVENING"}
                  {timeFilter !== "flexible" && (
                    <span onClick={(e) => { e.stopPropagation(); setTimeFilter("flexible"); setTimePopoverOpen(false); }}
                      className="ml-1 hover:bg-primary/10 rounded-full p-0.5"><X className="w-3 h-3" /></span>
                  )}
                  <ChevronDown className="w-3 h-3 shrink-0 opacity-60" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-1" align="start">
                {[{ label: "Morning", value: "morning", desc: "Before 12 PM" }, { label: "Afternoon", value: "afternoon", desc: "12 – 5 PM" }, { label: "Evening", value: "evening", desc: "After 5 PM" }].map((t) => (
                  <button key={t.value} onClick={() => { setTimeFilter(t.value); setTimePopoverOpen(false); }}
                    className={cn("w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between",
                      timeFilter === t.value ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary/50"
                    )}>
                    <span>{t.label}</span>
                    <span className="text-xs text-muted-foreground">{t.desc}</span>
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            {/* Provider popover */}
            <Popover open={providerPopoverOpen} onOpenChange={setProviderPopoverOpen}>
              <PopoverTrigger asChild>
                <button className={cn(
                  pillBase,
                  selectedProvider
                    ? "bg-white text-[hsl(270,90%,18%)] border-2 border-white shadow-lg"
                    : "bg-transparent text-white border-2 border-white/30 hover:border-white/50"
                )}>
                  <User className="w-3.5 h-3.5 shrink-0" />
                  {selectedProvider ? selectedProvider.split(",")[0].toUpperCase() : "PROVIDER"}
                  {selectedProvider && (
                    <span onClick={(e) => { e.stopPropagation(); setSelectedProvider(""); setProviderPopoverOpen(false); }}
                      className="ml-1 hover:bg-primary/10 rounded-full p-0.5"><X className="w-3 h-3" /></span>
                  )}
                  <ChevronDown className="w-3 h-3 shrink-0 opacity-60" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-1 max-h-72 overflow-y-auto" align="start">
                {selectedProvider && (
                  <button onClick={() => { setSelectedProvider(""); setProviderPopoverOpen(false); }}
                    className="w-full text-left px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/50 border-b border-border rounded-lg mb-1">All providers</button>
                )}
                {providers.map((p) => (
                  <button key={p.id} onClick={() => { setSelectedProvider(p.provider_name); setProviderPopoverOpen(false); }}
                    className={cn("w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                      selectedProvider === p.provider_name ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary/50"
                    )}>
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-primary/60" />
                    </div>
                    <div>
                      <p className="font-medium">{p.provider_name}</p>
                      <p className="text-xs text-muted-foreground">{p.credentials} · {p.location}</p>
                    </div>
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            {/* ZIP + Insurance */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/60 pointer-events-none" />
                <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  placeholder="ZIP CODE"
                  className="h-10 w-28 pl-8 pr-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-transparent text-white border-2 border-white/30 placeholder:text-white/40 focus:border-white focus:outline-none transition-all" />
              </div>
              <div className="relative">
                <button onClick={() => setInsuranceOpen(!insuranceOpen)}
                  className={cn(pillBase, "bg-transparent text-white border-2 border-white/30 hover:border-white/50")}>
                  {selectedInsuranceObj?.logo ? (
                    <img src={selectedInsuranceObj.logo} alt="" className="w-4 h-4 object-contain shrink-0 brightness-0 invert" />
                  ) : (
                    <Shield className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span className="hidden sm:inline">{selectedInsurance ? selectedInsurance.toUpperCase() : "INSURANCE"}</span>
                  <ChevronDown className="w-3 h-3 shrink-0 opacity-60" />
                </button>
                <AnimatePresence>
                  {insuranceOpen && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="absolute top-full right-0 mt-1 w-72 bg-white border border-border rounded-xl shadow-xl z-50 max-h-72 overflow-y-auto">
                      {selectedInsurance && (
                        <button onClick={() => { setSelectedInsurance(""); setInsuranceOpen(false); }}
                          className="w-full text-left px-4 py-3 text-sm text-muted-foreground hover:bg-secondary/50 border-b border-border">Clear selection</button>
                      )}
                      {insuranceOptions.map((ins) => (
                        <button key={ins.name} onClick={() => { setSelectedInsurance(ins.name); setInsuranceOpen(false); }}
                          className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-primary/5 transition-colors ${selectedInsurance === ins.name ? 'bg-primary/5' : ''}`}>
                          {ins.logo ? (
                            <img src={ins.logo} alt="" className="w-6 h-6 object-contain shrink-0" />
                          ) : (
                            <div className="w-6 h-6 rounded bg-muted flex items-center justify-center shrink-0"><Shield className="w-3.5 h-3.5 text-muted-foreground" /></div>
                          )}
                          <span className="text-sm font-medium text-foreground">{ins.name}</span>
                          {ins.inNetwork && (
                            <span className="ml-auto text-[10px] uppercase tracking-wider font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">In-Network</span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Results ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8">
        {preferredDate && (
          <div className="mb-4 flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-xl px-4 py-3">
            <CalendarIcon className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm text-foreground">
              Showing availability around <span className="font-bold text-primary">{format(preferredDate, "EEEE, MMMM d, yyyy")}</span>
            </p>
          </div>
        )}
        <p className="text-foreground font-bold text-lg sm:text-xl mb-6">
          {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''}
          {zipCode && <span className="text-muted-foreground font-normal text-sm ml-2">near {zipCode}</span>}
        </p>
        <div className="space-y-4 sm:space-y-6">
          {filteredProviders.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              selectedInsurance={selectedInsurance}
              weekOffset={weekOffset[provider.id] || 0}
              onWeekChange={(offset) => setWeekOffset(prev => ({ ...prev, [provider.id]: offset }))}
              today={today}
              availability={availability}
              timeFilter={timeFilter}
              onBooked={loadData}
              preferredDate={preferredDate}
              locationIdMap={locations}
              userCoords={userCoords}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Booking Form ───
function BookingForm({
  slot,
  date,
  providerName,
  locationLabel,
  onCancel,
  onSuccess,
}: {
  slot: TimeSlot;
  date: string;
  providerName: string;
  locationLabel: string;
  onCancel: () => void;
  onSuccess: (confirmation: string) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = firstName.trim() && lastName.trim() && email.trim() && email.includes("@");

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc("book_patient_appointment", {
        p_availability_id: slot.availabilityId,
        p_slot_start: slot.time,
        p_slot_end: slot.endTime,
        p_patient_first_name: firstName.trim(),
        p_patient_last_name: lastName.trim(),
        p_patient_email: email.trim(),
        p_patient_phone: phone.trim() || null,
        p_notes: notes.trim() || null,
      });

      if (error) throw error;
      const result = data as any;
      if (!result?.success) {
        toast({ title: "Booking failed", description: result?.error || "This slot may no longer be available.", variant: "destructive" });
        setSubmitting(false);
        return;
      }
      onSuccess(result.confirmation_code);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong.", variant: "destructive" });
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <div>
          <p className="text-foreground font-bold text-sm">Complete Your Booking</p>
          <p className="text-muted-foreground text-xs">
            {providerName} · {format(new Date(date + "T00:00:00"), "EEEE, MMMM d")} at {slot.label}
          </p>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center gap-3">
        <Calendar className="w-5 h-5 text-primary shrink-0" />
        <div>
          <p className="text-foreground text-sm font-semibold">{slot.label} · {locationLabel}</p>
          <p className="text-muted-foreground text-xs">{format(new Date(date + "T00:00:00"), "EEEE, MMMM d, yyyy")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">First Name *</label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name"
            className="w-full px-3 py-2.5 border-2 border-border rounded-xl text-sm focus:border-primary/40 focus:outline-none bg-background" />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground mb-1 block">Last Name *</label>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name"
            className="w-full px-3 py-2.5 border-2 border-border rounded-xl text-sm focus:border-primary/40 focus:outline-none bg-background" />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-foreground mb-1 block">Email *</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
          className="w-full px-3 py-2.5 border-2 border-border rounded-xl text-sm focus:border-primary/40 focus:outline-none bg-background" />
      </div>
      <div>
        <label className="text-xs font-semibold text-foreground mb-1 block">Phone <span className="text-muted-foreground font-normal">(optional)</span></label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 123-4567"
          className="w-full px-3 py-2.5 border-2 border-border rounded-xl text-sm focus:border-primary/40 focus:outline-none bg-background" />
      </div>
      <div>
        <label className="text-xs font-semibold text-foreground mb-1 block">Notes <span className="text-muted-foreground font-normal">(optional)</span></label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Anything you'd like us to know…" rows={2}
          className="w-full px-3 py-2.5 border-2 border-border rounded-xl text-sm focus:border-primary/40 focus:outline-none bg-background resize-none" />
      </div>

      <button onClick={handleSubmit} disabled={!canSubmit || submitting}
        className="w-full bg-primary text-primary-foreground font-bold text-sm py-3.5 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking…</> : <><CheckCircle2 className="w-4 h-4" /> Confirm Appointment</>}
      </button>

      <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
        By booking, you agree to receive appointment confirmations via email. Your information is securely handled and never shared.
      </p>
    </motion.div>
  );
}

// ─── Confirmation View ───
function BookingConfirmation({
  code,
  date,
  slot,
  providerName,
  locationLabel,
  onDone,
}: {
  code: string;
  date: string;
  slot: TimeSlot;
  providerName: string;
  locationLabel: string;
  onDone: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
      <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-foreground font-bold text-lg mb-1">You're All Set!</h3>
      <p className="text-muted-foreground text-sm mb-5">Your appointment has been confirmed.</p>

      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-5 text-left space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Provider</span>
          <span className="text-sm font-semibold text-foreground">{providerName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Date</span>
          <span className="text-sm font-semibold text-foreground">{format(new Date(date + "T00:00:00"), "EEEE, MMM d, yyyy")}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Time</span>
          <span className="text-sm font-semibold text-foreground">{slot.label}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Location</span>
          <span className="text-sm font-semibold text-foreground">{locationLabel}</span>
        </div>
        <div className="border-t border-primary/10 pt-2 mt-2 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Confirmation Code</span>
          <span className="text-base font-bold text-primary tracking-wide">{code}</span>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-left mb-5">
        <p className="text-amber-800 text-xs font-semibold mb-1">📋 Remember</p>
        <ul className="text-amber-700 text-xs space-y-1">
          <li>• Arrive 15 minutes early</li>
          <li>• Bring your photo ID and insurance card</li>
          <li>• Check in digitally when you arrive</li>
        </ul>
      </div>

      <button onClick={onDone}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors">
        Done
      </button>
    </motion.div>
  );
}

// ─── Provider Card ───
function ProviderCard({
  provider,
  selectedInsurance,
  weekOffset,
  onWeekChange,
  today,
  availability,
  timeFilter,
  onBooked,
  preferredDate,
  locationIdMap,
  userCoords,
}: {
  provider: ProviderRow & { isInNetwork: boolean | null; locationInfo: { label: string; address: string; distance: string } };
  selectedInsurance: string;
  weekOffset: number;
  onWeekChange: (offset: number) => void;
  today: Date;
  availability: AvailabilityRecord[];
  timeFilter: string;
  onBooked: () => void;
  preferredDate?: Date;
  locationIdMap: Record<string, string>;
  userCoords: [number, number] | null;
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  // Auto-jump to preferred date's week
  useEffect(() => {
    if (preferredDate) {
      const diffDays = Math.floor((preferredDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const targetWeek = Math.max(0, Math.floor(diffDays / 7));
      onWeekChange(targetWeek);
    }
  }, [preferredDate]);

  // Build availability records for this provider
  const providerRecords = useMemo(() =>
    availability.filter(a => a.provider_name === provider.provider_name),
    [availability, provider.provider_name]
  );

  // Build date -> slot count map
  const providerAvail = useMemo(() => {
    const slots: Record<string, number> = {};
    providerRecords.forEach(a => {
      const dateKey = a.office_date;
      const timeSlots = filterSlotsByTime(generateTimeSlots(a), timeFilter);
      slots[dateKey] = (slots[dateKey] || 0) + timeSlots.length;
    });
    return slots;
  }, [providerRecords, timeFilter]);

  // Get time slots for a selected date
  const slotsForDate = useMemo(() => {
    if (!selectedDate) return [];
    const dateRecords = providerRecords.filter(a => a.office_date === selectedDate);
    const allSlots = dateRecords.flatMap(a => generateTimeSlots(a));
    return filterSlotsByTime(allSlots, timeFilter);
  }, [selectedDate, providerRecords, timeFilter]);

  // Dynamic location for selected date
  const dateLocationInfo = useMemo(() => {
    if (!selectedDate) return null;
    const dateRecords = providerRecords.filter(a => a.office_date === selectedDate);
    if (dateRecords.length === 0) return null;
    const locId = dateRecords[0].location_id;
    const locKey = locationIdMap[locId] || "";
    const loc = locationMap[locKey];
    if (!loc) return null;
    let distance = "";
    if (userCoords) {
      const miles = calcDistanceMiles(userCoords[0], userCoords[1], loc.coords[0], loc.coords[1]);
      distance = `${miles.toFixed(1)} mi · ${estimateDriveTime(miles)}`;
    }
    return { label: loc.label, address: loc.address, distance };
  }, [selectedDate, providerRecords, locationIdMap, userCoords]);

  const startDate = addDays(today, weekOffset * 7);
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const initials = provider.provider_name
    .replace(/^Dr\.\s*/, "")
    .split(",")[0]
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2);

  const displayName = `${provider.provider_name}, ${provider.credentials}`;

  const handleDateClick = (dateKey: string) => {
    if (selectedDate === dateKey) {
      setSelectedDate(null);
    } else {
      setSelectedDate(dateKey);
      setSelectedSlot(null);
      setConfirmationCode(null);
    }
  };

  const handleBookingSuccess = (code: string) => {
    setConfirmationCode(code);
    toast({ title: "Appointment Booked!", description: `Confirmation code: ${code}` });
    onBooked();
  };

  const resetBooking = () => {
    setSelectedDate(null);
    setSelectedSlot(null);
    setConfirmationCode(null);
  };

  // Get location key for a specific day's availability
  const getLocationForDate = (dateKey: string) => {
    const rec = providerRecords.find(a => a.office_date === dateKey);
    if (!rec) return null;
    const locKey = locationIdMap[rec.location_id] || "";
    return locationMap[locKey] || null;
  };

  const renderDayButton = (day: Date) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const appts = providerAvail[dateKey] || 0;
    const isPast = isBefore(day, today);
    const hasAvail = appts > 0 && !isPast;
    const isSelected = selectedDate === dateKey;
    const isPreferred = preferredDate && format(preferredDate, "yyyy-MM-dd") === dateKey;
    const dayLoc = getLocationForDate(dateKey);

    return (
      <button key={dateKey} disabled={!hasAvail} onClick={() => hasAvail && handleDateClick(dateKey)}
        className={`flex flex-col items-center p-2 sm:p-2.5 rounded-xl sm:rounded-xl border transition-all min-h-[68px] sm:min-h-0 ${
          isSelected ? "border-primary bg-primary/10 ring-2 ring-primary/20"
            : isPreferred && hasAvail ? "border-primary/40 bg-primary/[0.08] ring-1 ring-primary/15"
            : hasAvail ? "border-primary/20 bg-primary/[0.03] hover:bg-primary/10 hover:border-primary/40 cursor-pointer active:scale-95 transition-transform"
            : "border-transparent bg-secondary/20 cursor-default"
        }`}>
        <span className={`text-xs sm:text-xs font-medium ${isSelected ? 'text-primary' : hasAvail ? 'text-foreground' : 'text-muted-foreground/50'}`}>{format(day, "EEE")}</span>
        <span className={`text-sm sm:text-sm font-bold ${isSelected ? 'text-primary' : hasAvail ? 'text-foreground' : 'text-muted-foreground/40'}`}>{format(day, "MMM d")}</span>
        {hasAvail ? (
          <>
            <span className={`text-[10px] sm:text-xs font-bold mt-0.5 ${isSelected ? 'text-primary' : 'text-primary'}`}>{appts} slot{appts !== 1 ? 's' : ''}</span>
            {dayLoc && (
              <span className="text-[8px] sm:text-[9px] text-muted-foreground mt-0.5 truncate max-w-full">{dayLoc.label.split('–')[0].trim()}</span>
            )}
          </>
        ) : (
          <span className="text-[10px] sm:text-xs text-muted-foreground/40 mt-0.5">{isPast ? '—' : 'None'}</span>
        )}
      </button>
    );
  };

  // Current display location: use date-specific if selected, otherwise provider default
  const currentLocationInfo = dateLocationInfo || provider.locationInfo;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-border rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
        {/* Left: Provider info */}
        <div className="flex gap-4 lg:w-[340px] shrink-0">
          {provider.photo_url ? (
            <img src={provider.photo_url} alt={provider.provider_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-primary/10 shrink-0" />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
              <span className="text-primary font-display text-lg sm:text-xl font-bold">{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-foreground font-bold text-base sm:text-lg leading-tight">{displayName}</h3>
            <p className="text-muted-foreground text-sm mt-0.5">{provider.title}</p>

            {provider.rating && (
              <div className="flex items-center gap-1.5 mt-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-foreground text-sm font-bold">{provider.rating}</span>
              </div>
            )}

            <div className="flex items-start gap-1.5 mt-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-muted-foreground text-xs leading-tight">
                <span>{currentLocationInfo.label}</span>
                {currentLocationInfo.distance && (
                  <span className="block text-primary font-semibold mt-0.5">{currentLocationInfo.distance}</span>
                )}
                {selectedDate && dateLocationInfo && (
                  <span className="block text-[10px] text-muted-foreground/70 mt-0.5">📍 Location for {format(new Date(selectedDate + "T00:00:00"), "MMM d")}</span>
                )}
              </div>
            </div>

            {selectedInsurance && (
              <div className={`inline-flex items-center gap-1.5 mt-2.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                provider.isInNetwork
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-amber-50 text-amber-700 border border-amber-100"
              }`}>
                {provider.isInNetwork ? (
                  <><CheckCircle2 className="w-3 h-3" /> In-network</>
                ) : (
                  <><Shield className="w-3 h-3" /> Out of network</>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {provider.specialties.slice(0, 3).map(s => (
                <span key={s} className="text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-md">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Availability or booking flow */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {confirmationCode && selectedSlot && selectedDate ? (
              <BookingConfirmation
                key="confirm"
                code={confirmationCode}
                date={selectedDate}
                slot={selectedSlot}
                providerName={provider.provider_name}
                locationLabel={currentLocationInfo.label}
                onDone={resetBooking}
              />
            ) : selectedSlot && selectedDate ? (
              <BookingForm
                key="form"
                slot={selectedSlot}
                date={selectedDate}
                providerName={provider.provider_name}
                locationLabel={currentLocationInfo.label}
                onCancel={() => setSelectedSlot(null)}
                onSuccess={handleBookingSuccess}
              />
            ) : (
              <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Calendar header with nav */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground font-medium">
                    {format(days[0], "MMM d")} – {format(days[6], "MMM d")}
                  </p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onWeekChange(Math.max(0, weekOffset - 1))} disabled={weekOffset === 0}
                      className="p-1.5 rounded-lg hover:bg-secondary/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      <ChevronLeft className="w-4 h-4 text-foreground" />
                    </button>
                    <button onClick={() => onWeekChange(weekOffset + 1)}
                      className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
                      <ChevronRight className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Week 1 */}
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                  {days.map(renderDayButton)}
                </div>

                {/* Week 2 */}
                <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mt-1.5">
                  {Array.from({ length: 7 }, (_, i) => addDays(startDate, i + 7)).map(renderDayButton)}
                </div>

                {/* Time slots panel */}
                <AnimatePresence>
                  {selectedDate && slotsForDate.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-bold text-foreground">
                            {format(new Date(selectedDate + "T00:00:00"), "EEEE, MMMM d")}
                          </p>
                          <button onClick={() => setSelectedDate(null)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">Select a time to book your appointment</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2">
                          {slotsForDate.map((slot) => (
                            <button key={slot.time} onClick={() => setSelectedSlot(slot)}
                              className="px-3 py-3.5 sm:py-2.5 rounded-xl border-2 border-primary/15 bg-primary/[0.03] text-base sm:text-sm font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 transition-all duration-200">
                              {slot.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {selectedDate && slotsForDate.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="mt-4 pt-4 border-t border-border text-center py-4">
                      <p className="text-muted-foreground text-sm">No slots available for this time preference. Try a different filter.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-end mt-2">
                  <button onClick={() => onWeekChange(weekOffset + 2)} className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                    More availability →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {provider.accepts_new && !selectedSlot && !confirmationCode && (
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs text-muted-foreground">New patient appointments · Accepting new patients</span>
        </div>
      )}
    </motion.div>
  );
}
