import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Download, Pencil, Trash2, CalendarIcon, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx-js-style";

// ── Brand palette ──
const P = {
  DEEP: "2D1B4E", DARK: "462D6D", MED: "6B4FA0", ACCENT: "8B6FC0",
  SOFT: "A78BDA", LAVEN: "C4B5DC", WASH: "E8E0F0", MIST: "F0EBF5",
  SNOW: "F8F6FB", WHITE: "FFFFFF", TEXT: "1A1A2E", MUTED: "6B6B80",
  BORDER: "D4CCE6",
};

const bdr = (color = P.BORDER): any => ({
  top: { style: "thin", color: { rgb: color } },
  bottom: { style: "thin", color: { rgb: color } },
  left: { style: "thin", color: { rgb: color } },
  right: { style: "thin", color: { rgb: color } },
});

interface ProviderSlot {
  id: string;
  provider_name: string;
  provider_email: string;
  office_date: string;
  start_time: string;
  end_time: string;
  status: string;
  location_id: string;
  locations: { name: string } | null;
}

function fmtTime(t: string) {
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  const ampm = hr >= 12 ? "PM" : "AM";
  return `${hr > 12 ? hr - 12 : hr === 0 ? 12 : hr}:${m} ${ampm}`;
}

function fmtDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

// ── Quick range presets ──
type RangePreset = "this_week" | "next_week" | "this_month" | "next_month" | "next_30" | "custom";

function getPresetRange(preset: RangePreset): { from: Date; to: Date } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  switch (preset) {
    case "this_week":
      return { from: monday, to: addDays(monday, 6) };
    case "next_week": {
      const nextMon = addDays(monday, 7);
      return { from: nextMon, to: addDays(nextMon, 6) };
    }
    case "this_month":
      return { from: startOfMonth(today), to: endOfMonth(today) };
    case "next_month": {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      return { from: startOfMonth(nextMonth), to: endOfMonth(nextMonth) };
    }
    case "next_30":
      return { from: today, to: addDays(today, 30) };
    default:
      return { from: today, to: addDays(today, 6) };
  }
}

// ── Excel Export ──
function exportProviderScheduleXlsx(slots: ProviderSlot[], rangeLabel: string) {
  const wb = XLSX.utils.book_new();
  const COLS = 6;
  const headers = ["Date", "Provider", "Location", "Start", "End", "Status"];
  const rows: any[][] = [];

  for (let i = 0; i < 3; i++) rows.push(Array(COLS).fill(""));
  rows.push(["", "Provider Office Schedule", "", "", "", ""]);
  rows.push(["", rangeLabel, "", "", "", ""]);
  rows.push(Array(COLS).fill(""));
  rows.push(headers);

  slots.forEach((s) => {
    rows.push([fmtDate(s.office_date), s.provider_name, s.locations?.name || "—", fmtTime(s.start_time), fmtTime(s.end_time), s.status]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 24 }, { wch: 22 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 12 }];

  for (let r = 0; r < 3; r++) {
    const colors = [P.DEEP, P.DARK, P.MED];
    for (let c = 0; c < COLS; c++) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };
      ws[ref].s = { fill: { fgColor: { rgb: colors[r] } }, border: bdr(colors[r]) };
    }
  }

  for (let c = 0; c < COLS; c++) {
    const ref = XLSX.utils.encode_cell({ r: 3, c });
    if (!ws[ref]) ws[ref] = { t: "s", v: "" };
    ws[ref].s = { fill: { fgColor: { rgb: P.ACCENT } }, font: { bold: true, color: { rgb: P.WHITE }, sz: 16, name: "Calibri" }, alignment: { horizontal: "center", vertical: "center" }, border: bdr(P.ACCENT) };
  }
  ws["!merges"] = [{ s: { r: 3, c: 1 }, e: { r: 3, c: 4 } }, { s: { r: 4, c: 1 }, e: { r: 4, c: 4 } }];

  for (let c = 0; c < COLS; c++) {
    const ref = XLSX.utils.encode_cell({ r: 4, c });
    if (!ws[ref]) ws[ref] = { t: "s", v: "" };
    ws[ref].s = { fill: { fgColor: { rgb: P.SOFT } }, font: { color: { rgb: P.WHITE }, sz: 11, name: "Calibri" }, alignment: { horizontal: "center", vertical: "center" }, border: bdr(P.SOFT) };
  }
  for (let c = 0; c < COLS; c++) {
    const ref = XLSX.utils.encode_cell({ r: 5, c });
    if (!ws[ref]) ws[ref] = { t: "s", v: "" };
    ws[ref].s = { fill: { fgColor: { rgb: P.WHITE } } };
  }
  headers.forEach((_, c) => {
    const ref = XLSX.utils.encode_cell({ r: 6, c });
    if (!ws[ref]) ws[ref] = { t: "s", v: "" };
    ws[ref].s = { fill: { fgColor: { rgb: P.DEEP } }, font: { bold: true, color: { rgb: P.WHITE }, sz: 11, name: "Calibri" }, alignment: { horizontal: "center", vertical: "center" }, border: bdr(P.DARK) };
  });
  for (let r = 7; r < rows.length; r++) {
    const isEven = (r - 7) % 2 === 0;
    for (let c = 0; c < COLS; c++) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };
      ws[ref].s = { fill: { fgColor: { rgb: isEven ? P.SNOW : P.WHITE } }, font: { color: { rgb: P.TEXT }, sz: 10, name: "Calibri" }, alignment: { horizontal: "center", vertical: "center" }, border: bdr(P.WASH) };
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, "Provider Schedule");
  XLSX.writeFile(wb, `Provider_Schedule_${rangeLabel.replace(/\s/g, "_")}.xlsx`);
}

// ── Main Component ──
export default function AdminV2Calendars() {
  const { toast } = useToast();
  const [providerSlots, setProviderSlots] = useState<ProviderSlot[]>([]);
  const [rangePreset, setRangePreset] = useState<RangePreset>("this_week");
  const [dateFrom, setDateFrom] = useState<Date>(getPresetRange("this_week").from);
  const [dateTo, setDateTo] = useState<Date>(getPresetRange("this_week").to);
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [providerSearch, setProviderSearch] = useState("");

  // Edit/Delete state
  const [editingSlot, setEditingSlot] = useState<ProviderSlot | null>(null);
  const [editSlotForm, setEditSlotForm] = useState({ start_time: "", end_time: "", status: "", provider_name: "", office_date: "", location_id: "" });
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [deletingSlot, setDeletingSlot] = useState<ProviderSlot | null>(null);
  const [saving, setSaving] = useState(false);

  const dateFromStr = useMemo(() => format(dateFrom, "yyyy-MM-dd"), [dateFrom]);
  const dateToStr = useMemo(() => format(dateTo, "yyyy-MM-dd"), [dateTo]);

  const rangeLabel = useMemo(() => {
    return `${format(dateFrom, "MMM d")} – ${format(dateTo, "MMM d, yyyy")}`;
  }, [dateFrom, dateTo]);

  const applyPreset = (preset: RangePreset) => {
    setRangePreset(preset);
    if (preset !== "custom") {
      const { from, to } = getPresetRange(preset);
      setDateFrom(from);
      setDateTo(to);
    }
  };

  const fetchData = async () => {
    const { data } = await supabase
      .from("provider_office_availability")
      .select("*,locations(name)")
      .gte("office_date", dateFromStr)
      .lte("office_date", dateToStr)
      .order("office_date", { ascending: true });
    if (data) setProviderSlots(data as any);
  };

  useEffect(() => {
    fetchData();
    supabase.from("locations").select("id, name").eq("active", true).then(({ data }) => {
      if (data) setLocations(data);
    });
    const ch = supabase.channel("calendars-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "provider_office_availability" }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [dateFromStr, dateToStr]);

  const handleEditSlot = async () => {
    if (!editingSlot) return;
    setSaving(true);
    const { error } = await supabase.from("provider_office_availability").update({
      provider_name: editSlotForm.provider_name,
      office_date: editSlotForm.office_date,
      location_id: editSlotForm.location_id,
      start_time: editSlotForm.start_time,
      end_time: editSlotForm.end_time,
      status: editSlotForm.status,
    }).eq("id", editingSlot.id);
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Updated", description: `${editingSlot.provider_name}'s schedule updated.` });
    setEditingSlot(null);
    fetchData();
  };

  const handleDeleteSlot = async () => {
    if (!deletingSlot) return;
    setSaving(true);
    const { error } = await supabase.from("provider_office_availability").delete().eq("id", deletingSlot.id);
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Deleted", description: `${deletingSlot.provider_name}'s availability removed.` });
    setDeletingSlot(null);
    fetchData();
  };

  const filteredSlots = useMemo(() => {
    let result = providerSlots;
    if (locationFilter !== "all") {
      result = result.filter((s) => s.locations?.name?.toLowerCase() === locationFilter.toLowerCase());
    }
    if (providerSearch.trim()) {
      const q = providerSearch.trim().toLowerCase();
      result = result.filter((s) => s.provider_name.toLowerCase().includes(q));
    }
    return result;
  }, [providerSlots, locationFilter, providerSearch]);

  // Group by date
  const slotsByDate = filteredSlots.reduce<Record<string, ProviderSlot[]>>((acc, s) => {
    (acc[s.office_date] ||= []).push(s);
    return acc;
  }, {});

  const presetButtons: { value: RangePreset; label: string }[] = [
    { value: "this_week", label: "This Week" },
    { value: "next_week", label: "Next Week" },
    { value: "this_month", label: "This Month" },
    { value: "next_month", label: "Next Month" },
    { value: "next_30", label: "Next 30 Days" },
    { value: "custom", label: "Custom Range" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(160, 70%, 12%) 0%, hsl(160, 60%, 25%) 50%, hsl(160, 50%, 40%) 100%)" }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-cal" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-cal)" />
        </svg>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <Link to="/admin-v2" className="inline-flex items-center gap-2 text-xs text-white/50 font-bold uppercase tracking-wider hover:text-white/80 transition-colors mb-4 sm:mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Console
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-5xl font-bold text-white tracking-tight">Provider Calendars</h1>
              <p className="text-sm sm:text-base text-white/60 mt-1 sm:mt-2 font-medium">Live provider office availability schedules.</p>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white/80 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg self-start sm:self-auto">{rangeLabel}</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Range presets */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 overflow-x-auto pb-1">
          {presetButtons.map((p) => (
            <button key={p.value} onClick={() => applyPreset(p.value)}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold border transition-all whitespace-nowrap",
                rangePreset === p.value
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-primary/40"
              )}>
              {p.label}
            </button>
          ))}
          <div className="w-px h-6 bg-border mx-0.5 sm:mx-1 hidden sm:block" />
          {[{ value: "all", label: "All Locations" }, { value: "Hoboken", label: "Hoboken" }, { value: "Edison", label: "Edison" }].map((loc) => (
            <button key={loc.value} onClick={() => setLocationFilter(loc.value)}
              className={cn(
                "px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold border transition-all whitespace-nowrap",
                locationFilter === loc.value
                  ? "bg-accent text-accent-foreground border-accent shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-accent/40"
              )}>
              {loc.label}
            </button>
          ))}
          </div>

          {/* Provider search */}
          <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search provider..."
              value={providerSearch}
              onChange={(e) => setProviderSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>

        {/* Custom date pickers */}
        {rangePreset === "custom" && (
          <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 min-w-[150px] justify-start">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {format(dateFrom, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={(d) => d && setDateFrom(d)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs font-semibold text-muted-foreground">To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 min-w-[150px] justify-start">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {format(dateTo, "MMM d, yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={(d) => d && setDateTo(d)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* Export */}
        <div className="flex justify-end mb-6">
          <Button size="sm" variant="outline" className="gap-2" onClick={() => exportProviderScheduleXlsx(filteredSlots, rangeLabel)}>
            <Download className="w-4 h-4" /> Export Excel
          </Button>
        </div>

        {/* Provider Schedules */}
        {filteredSlots.length === 0 ? (
          <EmptyState icon={<CalendarDays className="w-10 h-10 text-white" />} title="No Provider Schedules" desc={locationFilter !== "all" ? `No availability found for ${locationFilter} in this date range.` : "No provider availability found for the selected dates."} />
        ) : (
          <div className="space-y-6">
            {Object.entries(slotsByDate).sort(([a], [b]) => a.localeCompare(b)).map(([date, slots]) => (
              <motion.div key={date} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-muted/40">
                  <h3 className="font-semibold text-foreground text-sm">{fmtDate(date)}</h3>
                  <p className="text-xs text-muted-foreground">{slots.length} provider{slots.length !== 1 ? "s" : ""} scheduled</p>
                </div>
                <div className="divide-y divide-border">
                  {slots.map((s) => (
                    <div key={s.id} className="px-3 sm:px-5 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                            {s.provider_name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{s.provider_name}</p>
                            <p className="text-xs text-muted-foreground">{s.locations?.name || "—"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                          <div className="hidden sm:flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">{fmtTime(s.start_time)} – {fmtTime(s.end_time)}</span>
                            <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", s.status === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700")}>
                              {s.status}
                            </Badge>
                          </div>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditingSlot(s); setEditSlotForm({ start_time: s.start_time, end_time: s.end_time, status: s.status, provider_name: s.provider_name, office_date: s.office_date, location_id: (s as any).location_id || "" }); }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeletingSlot(s)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 sm:hidden">
                        <span className="text-[11px] font-medium text-muted-foreground">{fmtTime(s.start_time)} – {fmtTime(s.end_time)}</span>
                        <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", s.status === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700")}>
                          {s.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Edit Provider Slot Dialog ── */}
      <Dialog open={!!editingSlot} onOpenChange={(o) => !o && setEditingSlot(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Provider Schedule</DialogTitle>
            <DialogDescription>{editingSlot?.provider_name} — {editingSlot && fmtDate(editingSlot.office_date)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Provider Name</Label>
              <Input value={editSlotForm.provider_name} onChange={(e) => setEditSlotForm((p) => ({ ...p, provider_name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date</Label>
              <Input type="date" value={editSlotForm.office_date} onChange={(e) => setEditSlotForm((p) => ({ ...p, office_date: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Location</Label>
              <Select value={editSlotForm.location_id} onValueChange={(v) => setEditSlotForm((p) => ({ ...p, location_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Start Time</Label>
                <Input type="time" value={editSlotForm.start_time} onChange={(e) => setEditSlotForm((p) => ({ ...p, start_time: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">End Time</Label>
                <Input type="time" value={editSlotForm.end_time} onChange={(e) => setEditSlotForm((p) => ({ ...p, end_time: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={editSlotForm.status} onValueChange={(v) => setEditSlotForm((p) => ({ ...p, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSlot(null)}>Cancel</Button>
            <Button onClick={handleEditSlot} disabled={saving}>{saving ? "Saving…" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Provider Slot Dialog ── */}
      <Dialog open={!!deletingSlot} onOpenChange={(o) => !o && setDeletingSlot(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Availability</DialogTitle>
            <DialogDescription>Remove {deletingSlot?.provider_name}'s schedule for {deletingSlot && fmtDate(deletingSlot.office_date)}? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingSlot(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSlot} disabled={saving}>{saving ? "Deleting…" : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmptyState({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "linear-gradient(135deg, hsl(160, 70%, 20%) 0%, hsl(160, 60%, 40%) 100%)" }}>
        {icon}
      </div>
      <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">{desc}</p>
    </motion.div>
  );
}
