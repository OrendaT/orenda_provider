import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfWeek, endOfWeek, addDays, addWeeks, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Search, Filter, MapPin, Clock, X, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";

interface SlotData {
  id: string;
  provider_name: string;
  provider_email: string;
  office_date: string;
  start_time: string;
  end_time: string;
  status: string;
  location_id: string;
  locations?: { name: string } | null;
}

const SAMPLE_DATA: SlotData[] = [
  { id: "1", provider_name: "Michael Sanya", provider_email: "msanya@orendapsych.com", office_date: format(new Date(), "yyyy-MM-dd"), start_time: "09:00", end_time: "15:00", status: "active", location_id: "1", locations: { name: "Hoboken" } },
  { id: "2", provider_name: "Galina Grapp", provider_email: "ggrapp@orendapsych.com", office_date: format(new Date(), "yyyy-MM-dd"), start_time: "10:00", end_time: "16:00", status: "active", location_id: "2", locations: { name: "Edison" } },
  { id: "3", provider_name: "Simran Kaur", provider_email: "skaur@orendapsych.com", office_date: format(addDays(new Date(), 1), "yyyy-MM-dd"), start_time: "09:00", end_time: "17:00", status: "active", location_id: "1", locations: { name: "Hoboken" } },
  { id: "4", provider_name: "Brian Doyle", provider_email: "bdoyle@orendapsych.com", office_date: format(addDays(new Date(), 1), "yyyy-MM-dd"), start_time: "12:00", end_time: "18:00", status: "active", location_id: "2", locations: { name: "Edison" } },
  { id: "5", provider_name: "Dawn Manza", provider_email: "dmanza@orendapsych.com", office_date: format(addDays(new Date(), 2), "yyyy-MM-dd"), start_time: "09:00", end_time: "15:00", status: "active", location_id: "1", locations: { name: "Hoboken" } },
  { id: "6", provider_name: "Erika Simon", provider_email: "esimon@orendapsych.com", office_date: format(addDays(new Date(), 3), "yyyy-MM-dd"), start_time: "10:00", end_time: "16:00", status: "active", location_id: "2", locations: { name: "Edison" } },
  { id: "7", provider_name: "Lenny Gets", provider_email: "lgets@orendapsych.com", office_date: format(addDays(new Date(), 4), "yyyy-MM-dd"), start_time: "09:00", end_time: "13:00", status: "active", location_id: "1", locations: { name: "Hoboken" } },
  { id: "8", provider_name: "Natasha Dillon", provider_email: "ndillon@orendapsych.com", office_date: format(addDays(new Date(), 5), "yyyy-MM-dd"), start_time: "11:00", end_time: "17:00", status: "active", location_id: "2", locations: { name: "Edison" } },
  { id: "9", provider_name: "Adam Jimoh", provider_email: "ajimoh@orendapsych.com", office_date: format(addDays(new Date(), 2), "yyyy-MM-dd"), start_time: "13:00", end_time: "19:00", status: "active", location_id: "2", locations: { name: "Edison" } },
  { id: "10", provider_name: "Carla Fontange-Sanya", provider_email: "csanya@orendapsych.com", office_date: format(addDays(new Date(), 4), "yyyy-MM-dd"), start_time: "09:00", end_time: "15:00", status: "active", location_id: "1", locations: { name: "Hoboken" } },
];

const formatTime = (t: string) => {
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour > 12 ? hour - 12 : hour || 12}:${m} ${ampm}`;
};

type RangePreset = "this_week" | "next_week" | "two_weeks" | "this_month" | "custom";

const AllProviderScheduleLayouts = () => {
  const navigate = useNavigate();
  const [allSlots, setAllSlots] = useState<SlotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [rangePreset, setRangePreset] = useState<RangePreset>("this_week");
  const [customStart, setCustomStart] = useState<Date | undefined>();
  const [customEnd, setCustomEnd] = useState<Date | undefined>();
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [providerFilterOpen, setProviderFilterOpen] = useState(false);

  // Compute date range
  const { dateFrom, dateTo } = useMemo(() => {
    const today = new Date();
    switch (rangePreset) {
      case "this_week":
        return { dateFrom: startOfWeek(today, { weekStartsOn: 1 }), dateTo: endOfWeek(today, { weekStartsOn: 1 }) };
      case "next_week": {
        const nw = addWeeks(today, 1);
        return { dateFrom: startOfWeek(nw, { weekStartsOn: 1 }), dateTo: endOfWeek(nw, { weekStartsOn: 1 }) };
      }
      case "two_weeks":
        return { dateFrom: startOfWeek(today, { weekStartsOn: 1 }), dateTo: endOfWeek(addWeeks(today, 1), { weekStartsOn: 1 }) };
      case "this_month":
        return { dateFrom: startOfMonth(today), dateTo: endOfMonth(today) };
      case "custom":
        return { dateFrom: customStart || startOfWeek(today, { weekStartsOn: 1 }), dateTo: customEnd || endOfWeek(today, { weekStartsOn: 1 }) };
      default:
        return { dateFrom: startOfWeek(today, { weekStartsOn: 1 }), dateTo: endOfWeek(today, { weekStartsOn: 1 }) };
    }
  }, [rangePreset, customStart, customEnd]);

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      const from = format(dateFrom, "yyyy-MM-dd");
      const to = format(dateTo, "yyyy-MM-dd");
      const { data } = await supabase
        .from("provider_office_availability")
        .select("*, locations(name)")
        .gte("office_date", from)
        .lte("office_date", to)
        .eq("status", "active")
        .order("office_date", { ascending: true });

      setAllSlots(data && data.length > 0 ? (data as any) : SAMPLE_DATA);
      setLoading(false);
    };
    fetchSlots();
  }, [dateFrom, dateTo]);

  // All unique providers from raw data
  const allProviders = useMemo(() => [...new Set(allSlots.map(s => s.provider_name))].sort(), [allSlots]);

  // Filtered slots
  const filteredSlots = useMemo(() => {
    let result = allSlots;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.provider_name.toLowerCase().includes(q) || s.provider_email.toLowerCase().includes(q));
    }
    if (locationFilter !== "all") {
      result = result.filter(s => s.locations?.name?.toLowerCase() === locationFilter);
    }
    if (selectedProviders.length > 0) {
      result = result.filter(s => selectedProviders.includes(s.provider_name));
    }
    return result;
  }, [allSlots, searchQuery, locationFilter, selectedProviders]);

  const filteredProviders = useMemo(() => [...new Set(filteredSlots.map(s => s.provider_name))].sort(), [filteredSlots]);

  // Generate days array
  const days = useMemo(() => {
    const result: Date[] = [];
    let current = dateFrom;
    while (current <= dateTo) {
      result.push(current);
      current = addDays(current, 1);
    }
    return result;
  }, [dateFrom, dateTo]);

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const totalSessions = filteredSlots.length;
  const hobokenCount = filteredSlots.filter(s => s.locations?.name?.toLowerCase() === "hoboken").length;
  const edisonCount = filteredSlots.filter(s => s.locations?.name?.toLowerCase() === "edison").length;

  const toggleProvider = (name: string) => {
    setSelectedProviders(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setLocationFilter("all");
    setSelectedProviders([]);
  };

  const hasActiveFilters = searchQuery || locationFilter !== "all" || selectedProviders.length > 0;

  const shiftRange = (dir: number) => {
    if (rangePreset === "this_week" || rangePreset === "next_week") {
      setRangePreset("custom");
      setCustomStart(addDays(dateFrom, dir * 7));
      setCustomEnd(addDays(dateTo, dir * 7));
    } else if (rangePreset === "two_weeks") {
      setRangePreset("custom");
      setCustomStart(addDays(dateFrom, dir * 14));
      setCustomEnd(addDays(dateTo, dir * 14));
    } else if (rangePreset === "this_month") {
      const newMonth = dir > 0 ? addDays(dateTo, 1) : addDays(dateFrom, -1);
      setCustomStart(startOfMonth(newMonth));
      setCustomEnd(endOfMonth(newMonth));
      setRangePreset("custom");
    } else {
      const span = Math.round((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      setCustomStart(addDays(dateFrom, dir * span));
      setCustomEnd(addDays(dateTo, dir * span));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="bg-card border-b border-border sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold font-[var(--font-display)] text-foreground">All Provider Schedule</h1>
                <p className="text-xs text-muted-foreground">Weekly grid view • {filteredProviders.length} providers</p>
              </div>
            </div>
            {/* Stats */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" /> 
                <span className="font-medium">{hobokenCount}</span>
                <span className="text-muted-foreground">Hoboken</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                <span className="font-medium">{edisonCount}</span>
                <span className="text-muted-foreground">Edison</span>
              </div>
              <Badge variant="secondary" className="text-xs">{totalSessions} total</Badge>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Range Preset */}
            <Select value={rangePreset} onValueChange={(v) => setRangePreset(v as RangePreset)}>
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="next_week">Next Week</SelectItem>
                <SelectItem value="two_weeks">2 Weeks</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            {/* Navigation */}
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => shiftRange(-1)}>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs font-medium min-w-[150px] text-center text-foreground">
                {format(dateFrom, "MMM d")} – {format(dateTo, "MMM d, yyyy")}
              </span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => shiftRange(1)}>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Custom date pickers */}
            {rangePreset === "custom" && (
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                      <Calendar className="w-3 h-3" />
                      {customStart ? format(customStart, "MMM d") : "Start"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker mode="single" selected={customStart} onSelect={setCustomStart} />
                  </PopoverContent>
                </Popover>
                <span className="text-xs text-muted-foreground">→</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                      <Calendar className="w-3 h-3" />
                      {customEnd ? format(customEnd, "MMM d") : "End"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker mode="single" selected={customEnd} onSelect={setCustomEnd} />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="h-6 w-px bg-border hidden md:block" />

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search providers..."
                className="pl-8 h-8 w-[180px] text-xs"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                  <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>

            {/* Location Filter */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="hoboken">Hoboken</SelectItem>
                <SelectItem value="edison">Edison</SelectItem>
              </SelectContent>
            </Select>

            {/* Provider Filter */}
            <Popover open={providerFilterOpen} onOpenChange={setProviderFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                  <Filter className="w-3 h-3" />
                  Providers
                  {selectedProviders.length > 0 && (
                    <Badge className="ml-1 h-4 px-1.5 text-[10px] bg-primary text-primary-foreground">{selectedProviders.length}</Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[260px] p-0" align="start">
                <div className="p-3 border-b border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold">Filter by Provider</span>
                    {selectedProviders.length > 0 && (
                      <button onClick={() => setSelectedProviders([])} className="text-[10px] text-primary hover:underline">Clear all</button>
                    )}
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                  {allProviders.map(name => (
                    <label key={name} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 cursor-pointer text-xs">
                      <Checkbox
                        checked={selectedProviders.includes(name)}
                        onCheckedChange={() => toggleProvider(name)}
                        className="h-3.5 w-3.5"
                      />
                      {name}
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive hover:text-destructive" onClick={clearAllFilters}>
                <X className="w-3 h-3 mr-1" /> Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-lg font-semibold text-foreground">No schedules found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or date range</p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" className="mt-4" onClick={clearAllFilters}>Clear all filters</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-primary text-primary-foreground p-3 text-left text-xs font-semibold w-[180px] border-r border-primary/50">
                    Provider
                  </th>
                  {days.map(day => {
                    const isToday = format(day, "yyyy-MM-dd") === todayStr;
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                    return (
                      <th
                        key={day.toISOString()}
                        className={`p-2.5 text-center border-r border-primary/30 last:border-r-0 text-xs font-semibold min-w-[120px]
                          ${isToday ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}
                          ${isWeekend ? "opacity-80" : ""}
                        `}
                      >
                        <div className="text-[10px] uppercase tracking-wider opacity-80">{format(day, "EEE")}</div>
                        <div className="text-sm mt-0.5">{format(day, "MMM d")}</div>
                        {isToday && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground mx-auto mt-1" />}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredProviders.map((provider, rowIdx) => (
                  <tr key={provider} className={rowIdx % 2 === 0 ? "bg-card" : "bg-secondary/20"}>
                    <td className={`sticky left-0 z-10 p-3 border-r border-border text-sm font-medium text-foreground ${rowIdx % 2 === 0 ? "bg-card" : "bg-secondary/20"}`}>
                      <div className="truncate max-w-[160px]">{provider}</div>
                    </td>
                    {days.map(day => {
                      const dayStr = format(day, "yyyy-MM-dd");
                      const isToday = dayStr === todayStr;
                      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                      const daySlots = filteredSlots.filter(s => s.provider_name === provider && s.office_date === dayStr);
                      return (
                        <td
                          key={dayStr}
                          className={`p-1.5 border-r border-border last:border-r-0 align-top min-h-[56px]
                            ${isToday ? "bg-accent/10" : ""}
                            ${isWeekend ? "bg-muted/30" : ""}
                          `}
                        >
                          {daySlots.map(slot => {
                            const isHoboken = slot.locations?.name?.toLowerCase() === "hoboken";
                            return (
                              <div
                                key={slot.id}
                                className={`rounded-lg p-2 mb-1 text-xs border transition-all hover:shadow-md hover:scale-[1.02] cursor-default
                                  ${isHoboken
                                    ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                                    : "bg-accent/10 border-accent/30 text-accent hover:bg-accent/20"
                                  }
                                `}
                              >
                                <div className="flex items-center gap-1 font-semibold">
                                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isHoboken ? "bg-primary" : "bg-accent"}`} />
                                  {slot.locations?.name}
                                </div>
                                <div className="flex items-center gap-1 mt-1 opacity-80">
                                  <Clock className="w-2.5 h-2.5" />
                                  {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                                </div>
                              </div>
                            );
                          })}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Legend */}
        {!loading && filteredProviders.length > 0 && (
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-4 h-3 rounded bg-primary/10 border border-primary/30" />
                <span className="text-muted-foreground">Hoboken</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-4 h-3 rounded bg-accent/10 border border-accent/30" />
                <span className="text-muted-foreground">Edison</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="w-4 h-3 rounded bg-accent/10" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground border border-foreground/20 -ml-3" />
                <span className="text-muted-foreground ml-1">Today</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Showing {filteredSlots.length} session{filteredSlots.length !== 1 ? "s" : ""} across {filteredProviders.length} provider{filteredProviders.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProviderScheduleLayouts;
