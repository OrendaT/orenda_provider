import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, BarChart3, Download, CalendarDays, Users, MapPin, TrendingUp,
  ChevronDown, ChevronUp, Pencil, Check, X, Trash2, FileText,
} from "lucide-react";
import { toPng } from "html-to-image";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, Area, AreaChart,
} from "recharts";
import * as XLSX from "xlsx-js-style";
import { downloadExecutiveHtmlReport } from "@/utils/executiveHtmlExport";

// Brand palette
const P = {
  DEEP: "2D1B4E", DARK: "462D6D", MED: "6B4FA0", ACCENT: "8B6FC0",
  SOFT: "A78BDA", LAVEN: "C4B5DC", WASH: "E8E0F0", MIST: "F0EBF5",
  SNOW: "F8F6FB", WHITE: "FFFFFF", TEXT: "1A1A2E", MUTED: "6B6B80",
  BORDER: "D4CCE6",
};

const PURPLE = "hsl(270, 80%, 35%)";
const PURPLE_LIGHT = "hsl(270, 60%, 55%)";
const AMBER = "hsl(30, 80%, 45%)";
const EMERALD = "hsl(160, 60%, 35%)";
const BLUE = "hsl(220, 70%, 45%)";

const bdr = (color = P.BORDER): any => ({
  top: { style: "thin", color: { rgb: color } },
  bottom: { style: "thin", color: { rgb: color } },
  left: { style: "thin", color: { rgb: color } },
  right: { style: "thin", color: { rgb: color } },
});

interface BookingRow {
  id: string;
  provider_name: string;
  provider_email: string;
  office_location: string;
  booking_date: string;
  time_block: string;
  status: string;
  visit_type: string;
  visit_type_other: string | null;
  addendum_signed: boolean;
  notes: string | null;
  created_at: string;
}

function fmtDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

type SectionId = "executive" | "providers" | "bookings";

const NAV_SECTIONS: { id: SectionId; label: string; icon: typeof BarChart3 }[] = [
  { id: "executive", label: "Executive Dashboard", icon: BarChart3 },
  { id: "providers", label: "Provider Breakdown", icon: Users },
  { id: "bookings", label: "All Bookings", icon: CalendarDays },
];

type RangePreset = "7d" | "30d" | "90d" | "all";

export default function AdminV2Reporting() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [range, setRange] = useState<RangePreset>("all");
  const [activeSection, setActiveSection] = useState<SectionId>("executive");
  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ booking_date: "", office_location: "", time_block: "", status: "", notes: "" });
  const [downloadingReport, setDownloadingReport] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const rangeStart = useMemo(() => {
    if (range === "all") return null;
    const d = new Date();
    d.setDate(d.getDate() - (range === "7d" ? 7 : range === "30d" ? 30 : 90));
    return d.toISOString().split("T")[0];
  }, [range]);

  const fetchData = async () => {
    let bQuery = supabase.from("office_bookings").select("*").order("booking_date", { ascending: true });
    if (rangeStart) bQuery = bQuery.gte("booking_date", rangeStart);
    const { data } = await bQuery;
    if (data) setBookings(data as any);
  };

  useEffect(() => { fetchData(); }, [rangeStart]);

  // Edit / delete
  const startEdit = (b: BookingRow) => {
    setEditingId(b.id);
    setEditData({ booking_date: b.booking_date, office_location: b.office_location, time_block: b.time_block, status: b.status, notes: b.notes || "" });
  };
  const saveEdit = async (id: string) => {
    const { error } = await supabase.from("office_bookings").update({
      booking_date: editData.booking_date, office_location: editData.office_location as any,
      time_block: editData.time_block as any, status: editData.status as any, notes: editData.notes || null,
    }).eq("id", id);
    if (error) { toast.error("Failed to update booking"); return; }
    toast.success("Booking updated"); setEditingId(null); fetchData();
  };
  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    const { error } = await supabase.from("office_bookings").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Booking deleted"); fetchData();
  };

  // ─── Computed analytics ───
  const confirmed = useMemo(() => bookings.filter(b => b.status === "confirmed"), [bookings]);
  const totalBookings = confirmed.length;
  const hobokenCount = confirmed.filter(b => b.office_location === "hoboken").length;
  const edisonCount = confirmed.filter(b => b.office_location === "edison").length;
  const uniqueProviders = new Set(confirmed.map(b => b.provider_name)).size;
  const cancelledBookings = bookings.filter(b => b.status === "cancelled").length;

  const monthlyTrend = useMemo(() => {
    const map: Record<string, { month: string; hoboken: number; edison: number; total: number }> = {};
    confirmed.forEach(b => {
      const m = b.booking_date.substring(0, 7);
      if (!map[m]) map[m] = { month: m, hoboken: 0, edison: 0, total: 0 };
      map[m].total++;
      if (b.office_location === "hoboken") map[m].hoboken++;
      else map[m].edison++;
    });
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).map(d => ({
      ...d, label: new Date(d.month + "-01T12:00:00").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    }));
  }, [confirmed]);

  const providerRanking = useMemo(() => {
    const map: Record<string, { name: string; total: number; hoboken: number; edison: number; morning: number; afternoon: number; fullDay: number }> = {};
    confirmed.forEach(b => {
      if (!map[b.provider_name]) map[b.provider_name] = { name: b.provider_name, total: 0, hoboken: 0, edison: 0, morning: 0, afternoon: 0, fullDay: 0 };
      map[b.provider_name].total++;
      if (b.office_location === "hoboken") map[b.provider_name].hoboken++;
      else map[b.provider_name].edison++;
      if (b.time_block === "morning") map[b.provider_name].morning++;
      else if (b.time_block === "afternoon") map[b.provider_name].afternoon++;
      else map[b.provider_name].fullDay++;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [confirmed]);

  const locationPie = [{ name: "Hoboken", value: hobokenCount }, { name: "Edison", value: edisonCount }];

  const timeBlockData = useMemo(() => {
    const m = { morning: 0, afternoon: 0, full_day: 0 };
    confirmed.forEach(b => { m[b.time_block as keyof typeof m]++; });
    return [{ name: "Morning", value: m.morning }, { name: "Afternoon", value: m.afternoon }, { name: "Full Day", value: m.full_day }];
  }, [confirmed]);

  const dayOfWeekData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = Array(7).fill(0);
    confirmed.forEach(b => { counts[new Date(b.booking_date + "T12:00:00").getDay()]++; });
    return days.map((name, i) => ({ name, bookings: counts[i] }));
  }, [confirmed]);

  const weekdayWeekendData = useMemo(() => {
    let weekday = 0, weekend = 0;
    const weekdayProviders: Record<string, number> = {};
    const weekendProviders: Record<string, number> = {};
    confirmed.forEach(b => {
      const day = new Date(b.booking_date + "T12:00:00").getDay();
      if (day === 0 || day === 6) { weekend++; weekendProviders[b.provider_name] = (weekendProviders[b.provider_name] || 0) + 1; }
      else { weekday++; weekdayProviders[b.provider_name] = (weekdayProviders[b.provider_name] || 0) + 1; }
    });
    const total = weekday + weekend;
    const topWd = Object.entries(weekdayProviders).sort((a, b) => b[1] - a[1])[0];
    const topWe = Object.entries(weekendProviders).sort((a, b) => b[1] - a[1])[0];
    return {
      pieData: [{ name: "Weekday", value: weekday }, { name: "Weekend", value: weekend }],
      weekday, weekend, total,
      weekdayPct: total > 0 ? Math.round(weekday / total * 100) : 0,
      weekendPct: total > 0 ? Math.round(weekend / total * 100) : 0,
      topWeekdayProvider: topWd ? { name: topWd[0], count: topWd[1] } : null,
      topWeekendProvider: topWe ? { name: topWe[0], count: topWe[1] } : null,
      weekdayProviders: Object.entries(weekdayProviders).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
      weekendProviders: Object.entries(weekendProviders).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
    };
  }, [confirmed]);

  const businessInsights = useMemo(() => {
    if (totalBookings === 0) return null;
    const topProvider = providerRanking[0];
    const topDay = [...dayOfWeekData].sort((a, b) => b.bookings - a.bookings)[0];
    const topTimeBlock = [...timeBlockData].sort((a, b) => b.value - a.value)[0];
    const hobPct = Math.round((hobokenCount / totalBookings) * 100);
    const ediPct = 100 - hobPct;
    const dominantLoc = hobokenCount >= edisonCount ? "Hoboken" : "Edison";
    const recentMonth = monthlyTrend[monthlyTrend.length - 1];
    const prevMonth = monthlyTrend.length > 1 ? monthlyTrend[monthlyTrend.length - 2] : null;
    const growthPct = prevMonth && prevMonth.total > 0 ? Math.round(((recentMonth?.total || 0) - prevMonth.total) / prevMonth.total * 100) : null;
    return {
      summary: `Orenda Psychiatry's provider booking platform currently supports ${uniqueProviders} active provider${uniqueProviders !== 1 ? "s" : ""} across ${hobokenCount > 0 && edisonCount > 0 ? "two" : "one"} office location${hobokenCount > 0 && edisonCount > 0 ? "s" : ""}, with ${totalBookings} total confirmed bookings on record.`,
      locationInsight: `${dominantLoc} is the primary driver of office utilization, accounting for ${dominantLoc === "Hoboken" ? hobPct : ediPct}% of all bookings. ${hobokenCount > 0 && edisonCount > 0 ? `Edison contributes ${dominantLoc === "Edison" ? hobPct : ediPct}% of total volume.` : ""}`,
      providerInsight: topProvider ? `${topProvider.name} leads provider engagement with ${topProvider.total} booking${topProvider.total !== 1 ? "s" : ""}, representing ${Math.round((topProvider.total / totalBookings) * 100)}% of total volume. ${providerRanking.length > 1 ? `The top ${Math.min(3, providerRanking.length)} providers account for ${Math.round(providerRanking.slice(0, 3).reduce((s, p) => s + p.total, 0) / totalBookings * 100)}% of all bookings.` : ""}` : "",
      timingInsight: `Providers overwhelmingly prefer ${topTimeBlock?.name.toLowerCase() || "afternoon"} sessions (${topTimeBlock ? Math.round(topTimeBlock.value / totalBookings * 100) : 0}% of bookings). ${topDay ? `${topDay.name}s are the most popular booking day with ${topDay.bookings} session${topDay.bookings !== 1 ? "s" : ""}.` : ""}`,
      trendInsight: growthPct !== null && recentMonth ? `The most recent month (${recentMonth.label}) saw ${recentMonth.total} booking${recentMonth.total !== 1 ? "s" : ""}, ${growthPct > 0 ? `a ${growthPct}% increase` : growthPct < 0 ? `a ${Math.abs(growthPct)}% decrease` : "flat growth"} compared to the prior month.` : (recentMonth ? `The most recent month (${recentMonth.label}) recorded ${recentMonth.total} booking${recentMonth.total !== 1 ? "s" : ""}.` : ""),
    };
  }, [totalBookings, uniqueProviders, hobokenCount, edisonCount, providerRanking, dayOfWeekData, timeBlockData, monthlyTrend]);

  const weeklyVolume = useMemo(() => {
    const now = new Date();
    const weeks: { label: string; start: Date; end: Date; count: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const start = new Date(now);
      start.setDate(start.getDate() - (i * 7 + start.getDay()));
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      weeks.push({ label: `${start.getMonth() + 1}/${start.getDate()}`, start, end, count: 0 });
    }
    confirmed.forEach(b => {
      const d = new Date(b.booking_date + "T12:00:00");
      for (const w of weeks) { if (d >= w.start && d <= w.end) { w.count++; break; } }
    });
    return weeks.map(w => ({ week: w.label, bookings: w.count }));
  }, [confirmed]);

  const top5 = providerRanking.slice(0, 8);

  // ─── Exports ───
  const downloadExecutiveReport = async () => {
    if (!dashboardRef.current || downloadingReport) return;
    setDownloadingReport(true);
    try {
      if (document.fonts?.ready) await document.fonts.ready;
      const exportSections = [
        { key: "business-insights", title: "What's Driving the Business", subtitle: "Key insights from provider booking data" },
        { key: "monthly-trend", title: "Monthly Booking Trend", subtitle: "Hoboken vs Edison bookings over time" },
        { key: "location-split", title: "Location Split", subtitle: "Distribution across offices" },
        { key: "top-providers", title: "Top Providers", subtitle: "Booking volume by provider" },
        { key: "time-block", title: "Time Block Distribution", subtitle: "Morning vs Afternoon vs Full Day" },
        { key: "day-of-week", title: "Day of Week Preference", subtitle: "Which days providers book most" },
        { key: "weekday-weekend", title: "Weekday vs Weekend", subtitle: "Booking split across work days and weekends" },
        { key: "weekly-volume", title: "Weekly Booking Volume", subtitle: "Last 12 weeks" },
      ];
      const capturedSections = await Promise.all(exportSections.map(async ({ key, title, subtitle }) => {
        const section = dashboardRef.current?.querySelector<HTMLElement>(`[data-export-card="${key}"]`);
        if (!section) return null;
        const dataUrl = await toPng(section, { backgroundColor: "#F8F6FB", pixelRatio: 2, cacheBust: true });
        return { title, subtitle, dataUrl };
      }));
      const peakMonth = monthlyTrend.reduce<{ label: string; total: number } | null>((best, month) => (!best || month.total > best.total) ? { label: month.label, total: month.total } : best, null);
      const topProvider = providerRanking[0];
      const topTimeBlock = [...timeBlockData].sort((a, b) => b.value - a.value)[0];
      const dominantLocation = hobokenCount >= edisonCount ? "Hoboken" : "Edison";
      const locationLead = Math.abs(hobokenCount - edisonCount);
      downloadExecutiveHtmlReport({
        generatedAt: new Date().toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }),
        kpis: [
          { label: "Total Bookings", value: totalBookings },
          { label: "Hoboken Bookings", value: hobokenCount },
          { label: "Edison Bookings", value: edisonCount },
          { label: "Providers", value: uniqueProviders },
        ],
        highlights: [
          { label: "Top Provider", value: topProvider ? topProvider.name : "No provider data", detail: topProvider ? `${topProvider.total} total bookings across Hoboken and Edison.` : "No confirmed provider bookings are available yet." },
          { label: "Busiest Month", value: peakMonth ? peakMonth.label : "No monthly trend yet", detail: peakMonth ? `${peakMonth.total} confirmed provider bookings were scheduled in the highest-volume month.` : "Monthly trend data will appear once bookings are added." },
          { label: "Location Lead", value: totalBookings ? dominantLocation : "No location split yet", detail: totalBookings ? `${dominantLocation} leads by ${locationLead} booking${locationLead === 1 ? "" : "s"}. ${topTimeBlock ? `${topTimeBlock.name} is the most common time block.` : ""}` : "Location distribution will appear once bookings are available." },
        ],
        sections: capturedSections.filter((s): s is NonNullable<typeof s> => Boolean(s)),
        providerRanking,
      });
    } catch (e) { console.error("Executive report export failed", e); }
    finally { setDownloadingReport(false); }
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const rangeLabel = range === "all" ? "All Time" : range === "7d" ? "Last 7 Days" : range === "30d" ? "Last 30 Days" : "Last 90 Days";
    const hdrStyle = (rgb: string, sz = 10, bold = false): any => ({ fill: { fgColor: { rgb } }, font: { bold, color: { rgb: P.WHITE }, sz }, alignment: { horizontal: "center" }, border: bdr(rgb) });
    const cellStyle = (even: boolean, align = "center"): any => ({ fill: { fgColor: { rgb: even ? P.SNOW : P.WHITE } }, font: { color: { rgb: P.TEXT }, sz: 10 }, alignment: { horizontal: align }, border: bdr(P.WASH) });
    const addBrandHeader = (ws: any, cols: number) => {
      for (let r = 0; r < 3; r++) for (let c = 0; c < cols; c++) {
        const ref = XLSX.utils.encode_cell({ r, c });
        if (!ws[ref]) ws[ref] = { t: "s", v: "" };
        ws[ref].s = hdrStyle([P.DEEP, P.DEEP, P.DARK][r], r === 1 ? 16 : 10, r === 1);
      }
      if (!ws["!merges"]) ws["!merges"] = [];
      ws["!merges"].push({ s: { r: 1, c: 0 }, e: { r: 1, c: cols - 1 } });
    };
    const styleTable = (ws: any, headerRow: number, cols: number, dataRows: number) => {
      for (let c = 0; c < cols; c++) { const ref = XLSX.utils.encode_cell({ r: headerRow, c }); if (!ws[ref]) ws[ref] = { t: "s", v: "" }; ws[ref].s = hdrStyle(P.DEEP, 10, true); }
      for (let r = 0; r < dataRows; r++) for (let c = 0; c < cols; c++) { const ref = XLSX.utils.encode_cell({ r: headerRow + 1 + r, c }); if (!ws[ref]) ws[ref] = { t: "s", v: "" }; ws[ref].s = cellStyle(r % 2 === 0, c === 0 ? "left" : "center"); }
    };

    // Summary
    const s1 = XLSX.utils.aoa_to_sheet([[""], [`Orenda Psychiatry — Executive Summary (${rangeLabel})`], [""], ["KPI", "Value"], ["Total Provider Bookings", totalBookings], ["Hoboken Bookings", hobokenCount], ["Edison Bookings", edisonCount], ["Unique Providers", uniqueProviders], ["Cancelled Bookings", cancelledBookings]]);
    s1["!cols"] = [{ wch: 28 }, { wch: 16 }]; addBrandHeader(s1, 2); styleTable(s1, 3, 2, 5); XLSX.utils.book_append_sheet(wb, s1, "Executive Summary");

    // Monthly Trend
    const s2 = XLSX.utils.aoa_to_sheet([["", "", "", ""], ["Orenda Psychiatry — Monthly Booking Trend"], [""], ["Month", "Hoboken", "Edison", "Total"], ...monthlyTrend.map(m => [m.label, m.hoboken, m.edison, m.total])]);
    s2["!cols"] = [{ wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 12 }]; addBrandHeader(s2, 4); styleTable(s2, 3, 4, monthlyTrend.length); XLSX.utils.book_append_sheet(wb, s2, "Monthly Trend");

    // Provider Rankings
    const provRows = providerRanking.map(p => [p.name, p.total, p.hoboken, p.edison, p.morning, p.afternoon, p.fullDay]);
    const s3 = XLSX.utils.aoa_to_sheet([["", "", "", "", "", "", ""], ["Orenda Psychiatry — Provider Rankings"], [""], ["Provider", "Total", "Hoboken", "Edison", "Morning", "Afternoon", "Full Day"], ...provRows]);
    s3["!cols"] = [{ wch: 24 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 10 }]; addBrandHeader(s3, 7); styleTable(s3, 3, 7, provRows.length); XLSX.utils.book_append_sheet(wb, s3, "Provider Rankings");

    // Time Block
    const tbTotal = timeBlockData.reduce((s, d) => s + d.value, 0);
    const s4 = XLSX.utils.aoa_to_sheet([["", "", ""], ["Orenda Psychiatry — Time Block Distribution"], [""], ["Time Block", "Bookings", "Percentage"], ...timeBlockData.map(d => [d.name, d.value, tbTotal > 0 ? Math.round(d.value / tbTotal * 100) + "%" : "0%"])]);
    s4["!cols"] = [{ wch: 16 }, { wch: 12 }, { wch: 14 }]; addBrandHeader(s4, 3); styleTable(s4, 3, 3, timeBlockData.length); XLSX.utils.book_append_sheet(wb, s4, "Time Block");

    // Day of Week
    const s5 = XLSX.utils.aoa_to_sheet([["", ""], ["Orenda Psychiatry — Day of Week Preference"], [""], ["Day", "Bookings"], ...dayOfWeekData.map(d => [d.name, d.bookings])]);
    s5["!cols"] = [{ wch: 12 }, { wch: 12 }]; addBrandHeader(s5, 2); styleTable(s5, 3, 2, 7); XLSX.utils.book_append_sheet(wb, s5, "Day of Week");

    // Weekday vs Weekend
    const s6 = XLSX.utils.aoa_to_sheet([["", "", ""], ["Orenda Psychiatry — Weekday vs Weekend"], [""], ["Category", "Bookings", "Percentage"], ["Weekday (Mon–Fri)", weekdayWeekendData.weekday, weekdayWeekendData.weekdayPct + "%"], ["Weekend (Sat–Sun)", weekdayWeekendData.weekend, weekdayWeekendData.weekendPct + "%"]]);
    s6["!cols"] = [{ wch: 24 }, { wch: 12 }, { wch: 14 }]; addBrandHeader(s6, 3); styleTable(s6, 3, 3, 2); XLSX.utils.book_append_sheet(wb, s6, "Weekday vs Weekend");

    // All Bookings
    const bookDataRows = bookings.map(b => [fmtDate(b.booking_date), b.provider_name, b.office_location, b.time_block, b.status, b.notes || ""]);
    const s7 = XLSX.utils.aoa_to_sheet([["", "", "", "", "", ""], ["Orenda Psychiatry — All Office Bookings"], [""], ["Date", "Provider", "Location", "Time Block", "Status", "Notes"], ...bookDataRows]);
    s7["!cols"] = [{ wch: 24 }, { wch: 22 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 20 }]; addBrandHeader(s7, 6); styleTable(s7, 3, 6, bookDataRows.length); XLSX.utils.book_append_sheet(wb, s7, "All Bookings");

    XLSX.writeFile(wb, `Orenda_Psychiatry_Report_${rangeLabel.replace(/\s/g, "_")}.xlsx`);
  };

  // ─── KPIs ───
  const kpis = [
    { label: "Total Bookings", value: totalBookings, icon: CalendarDays, color: PURPLE },
    { label: "Hoboken", value: hobokenCount, icon: MapPin, color: PURPLE_LIGHT },
    { label: "Edison", value: edisonCount, icon: MapPin, color: AMBER },
    { label: "Providers", value: uniqueProviders, icon: Users, color: BLUE },
  ];

  const scrollTo = (id: SectionId) => {
    setActiveSection(id);
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(270, 100%, 12%) 0%, hsl(270, 80%, 25%) 50%, hsl(270, 60%, 40%) 100%)" }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="rep-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#rep-dots)" />
        </svg>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <Link to="/admin-v2" className="inline-flex items-center gap-2 text-xs text-white/50 font-bold uppercase tracking-wider hover:text-white/80 transition-colors mb-4 sm:mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Console
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-5xl font-bold text-white tracking-tight">Reporting & Analytics</h1>
              <p className="text-sm sm:text-base text-white/60 mt-1 sm:mt-2 font-medium">Executive dashboard, provider insights, and exportable reports.</p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {([["7d", "7D"], ["30d", "30D"], ["90d", "90D"], ["all", "All"]] as [RangePreset, string][]).map(([key, label]) => (
                <button key={key} onClick={() => setRange(key)}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${range === key ? "bg-white text-foreground shadow" : "bg-white/10 text-white/70 hover:bg-white/20"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Section Nav */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {NAV_SECTIONS.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all ${activeSection === s.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              <s.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.id === "executive" ? "Dashboard" : s.id === "providers" ? "Providers" : "Bookings"}</span>
            </button>
          ))}
          <div className="flex-1" />
          <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 text-[11px] sm:text-xs shrink-0 px-2 sm:px-3" onClick={downloadExecutiveReport} disabled={downloadingReport}>
            <FileText className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{downloadingReport ? "Building..." : "Report"}</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 text-[11px] sm:text-xs shrink-0 px-2 sm:px-3" onClick={exportExcel}>
            <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Excel</span>
          </Button>
        </div>
      </div>

      <div ref={dashboardRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-10">
        {/* ═══ EXECUTIVE DASHBOARD ═══ */}
        <div id="section-executive" className="scroll-mt-20 space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {kpis.map((k, i) => (
              <motion.div key={k.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-5 text-center">
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: k.color }}>
                  <k.icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-display text-3xl font-bold text-foreground">{k.value}</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mt-1">{k.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Business Insights */}
          {businessInsights && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              data-export-card="business-insights"
              className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: PURPLE }}>
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">What's Driving the Business</h3>
                  <p className="text-xs text-muted-foreground">Key insights from provider booking data</p>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">{businessInsights.summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-muted/30 p-4 border border-border">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">📍 Location Dynamics</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{businessInsights.locationInsight}</p>
                </div>
                <div className="rounded-xl bg-muted/30 p-4 border border-border">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">👤 Provider Engagement</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{businessInsights.providerInsight}</p>
                </div>
                <div className="rounded-xl bg-muted/30 p-4 border border-border">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">🕐 Timing Preferences</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{businessInsights.timingInsight}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Charts Row 1: Monthly Trend + Location Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              data-export-card="monthly-trend"
              className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground text-sm mb-1">Monthly Booking Trend</h3>
              <p className="text-xs text-muted-foreground mb-4">Hoboken vs Edison bookings over time</p>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={PURPLE} stopOpacity={0.3} /><stop offset="95%" stopColor={PURPLE} stopOpacity={0} /></linearGradient>
                    <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={AMBER} stopOpacity={0.3} /><stop offset="95%" stopColor={AMBER} stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 10%, 90%)" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(270, 20%, 85%)", fontSize: 12 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="hoboken" name="Hoboken" stroke={PURPLE} fill="url(#purpleGrad)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="edison" name="Edison" stroke={AMBER} fill="url(#amberGrad)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              data-export-card="location-split"
              className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground text-sm mb-1">Location Split</h3>
              <p className="text-xs text-muted-foreground mb-4">Distribution across offices</p>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={locationPie} cx="50%" cy="42%" innerRadius={40} outerRadius={68} paddingAngle={4} dataKey="value">
                    {locationPie.map((_, i) => <Cell key={i} fill={[PURPLE, AMBER][i]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 8 }} formatter={(value: string) => {
                    const item = locationPie.find(d => d.name === value);
                    const total = hobokenCount + edisonCount;
                    const pct = total > 0 ? Math.round((item?.value || 0) / total * 100) : 0;
                    return `${value} (${item?.value || 0} · ${pct}%)`;
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Charts Row 2: Top Providers + Time Block */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              data-export-card="top-providers"
              className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground text-sm mb-1">Top Providers</h3>
              <p className="text-xs text-muted-foreground mb-4">Booking volume by provider</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={top5} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 10%, 90%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(270, 20%, 85%)", fontSize: 12 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="hoboken" name="Hoboken" fill={PURPLE} radius={[0, 4, 4, 0]} stackId="a" />
                  <Bar dataKey="edison" name="Edison" fill={AMBER} radius={[0, 4, 4, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              data-export-card="time-block"
              className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground text-sm mb-1">Time Block Distribution</h3>
              <p className="text-xs text-muted-foreground mb-4">Morning vs Afternoon vs Full Day</p>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={timeBlockData} cx="50%" cy="42%" innerRadius={40} outerRadius={68} paddingAngle={4} dataKey="value">
                    {timeBlockData.map((_, i) => <Cell key={i} fill={[PURPLE, AMBER, EMERALD][i]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 8 }} formatter={(value: string) => {
                    const item = timeBlockData.find(d => d.name === value);
                    const total = timeBlockData.reduce((s, d) => s + d.value, 0);
                    const pct = total > 0 ? Math.round((item?.value || 0) / total * 100) : 0;
                    return `${value} (${item?.value || 0} · ${pct}%)`;
                  }} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Charts Row 3: Day of Week + Weekday vs Weekend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              data-export-card="day-of-week"
              className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground text-sm mb-1">Day of Week Preference</h3>
              <p className="text-xs text-muted-foreground mb-4">Which days providers book most</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dayOfWeekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 10%, 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(270, 20%, 85%)", fontSize: 12 }} />
                  <Bar dataKey="bookings" fill={PURPLE} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              data-export-card="weekday-weekend"
              className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground text-sm mb-1">Weekday vs Weekend</h3>
              <p className="text-xs text-muted-foreground mb-4">Booking split across work days and weekends</p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <ResponsiveContainer width="100%" height={180} className="sm:!w-[50%]">
                  <PieChart>
                    <Pie data={weekdayWeekendData.pieData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={4} dataKey="value">
                      <Cell fill={PURPLE} /><Cell fill={AMBER} />
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} formatter={(value: string) => {
                      const item = weekdayWeekendData.pieData.find(d => d.name === value);
                      const pct = weekdayWeekendData.total > 0 ? Math.round((item?.value || 0) / weekdayWeekendData.total * 100) : 0;
                      return `${value} (${item?.value || 0} · ${pct}%)`;
                    }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 flex flex-col justify-center gap-2 sm:gap-3 text-xs">
                  <div className="rounded-lg bg-muted/30 p-3 border border-border">
                    <p className="font-bold text-foreground mb-1">🏢 Top Weekday Provider</p>
                    <p className="text-muted-foreground">{weekdayWeekendData.topWeekdayProvider ? `${weekdayWeekendData.topWeekdayProvider.name} (${weekdayWeekendData.topWeekdayProvider.count} bookings)` : "No weekday bookings"}</p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3 border border-border">
                    <p className="font-bold text-foreground mb-1">🌅 Top Weekend Provider</p>
                    <p className="text-muted-foreground">{weekdayWeekendData.topWeekendProvider ? `${weekdayWeekendData.topWeekendProvider.name} (${weekdayWeekendData.topWeekendProvider.count} bookings)` : "No weekend bookings"}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Weekly Volume */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            data-export-card="weekly-volume"
            className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground text-sm mb-1">Weekly Booking Volume</h3>
            <p className="text-xs text-muted-foreground mb-4">Last 12 weeks</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 10%, 90%)" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(270, 20%, 85%)", fontSize: 12 }} />
                <Line type="monotone" dataKey="bookings" stroke={PURPLE} strokeWidth={2.5} dot={{ fill: PURPLE, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* ═══ PROVIDER BREAKDOWN ═══ */}
        <div id="section-providers" className="scroll-mt-20">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-foreground text-sm">Provider Breakdown</h3>
              <p className="text-xs text-muted-foreground">Click a provider to see and edit their booking details</p>
            </div>

            {/* Provider Rankings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/20 border-b border-border">
                    <th className="text-left px-4 py-3 font-bold text-foreground">#</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Provider</th>
                    <th className="text-center px-4 py-3 font-bold text-foreground">Total</th>
                    <th className="text-center px-4 py-3 font-bold text-foreground">Hoboken</th>
                    <th className="text-center px-4 py-3 font-bold text-foreground">Edison</th>
                    <th className="text-center px-4 py-3 font-bold text-foreground">Morning</th>
                    <th className="text-center px-4 py-3 font-bold text-foreground">Afternoon</th>
                    <th className="text-center px-4 py-3 font-bold text-foreground">Full Day</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {providerRanking.map((p, i) => {
                    const isExpanded = expandedProvider === p.name;
                    const providerBookings = bookings.filter(b => b.provider_name === p.name && b.status === "confirmed");
                    return (
                      <React.Fragment key={p.name}>
                        <tr className="border-b border-border hover:bg-muted/10 cursor-pointer" onClick={() => setExpandedProvider(isExpanded ? null : p.name)}>
                          <td className="px-4 py-3 text-muted-foreground font-bold">{i + 1}</td>
                          <td className="px-4 py-3 text-foreground font-semibold">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                {p.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              {p.name}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-foreground">{p.total}</td>
                          <td className="px-4 py-3 text-center"><Badge variant="outline" className="text-[10px] font-bold border-purple-200 bg-purple-50 text-purple-700">{p.hoboken}</Badge></td>
                          <td className="px-4 py-3 text-center"><Badge variant="outline" className="text-[10px] font-bold border-amber-200 bg-amber-50 text-amber-700">{p.edison}</Badge></td>
                          <td className="px-4 py-3 text-center text-muted-foreground">{p.morning}</td>
                          <td className="px-4 py-3 text-center text-muted-foreground">{p.afternoon}</td>
                          <td className="px-4 py-3 text-center text-muted-foreground">{p.fullDay}</td>
                          <td className="px-4 py-3">{isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}</td>
                        </tr>
                        <AnimatePresence>
                          {isExpanded && (
                            <tr>
                              <td colSpan={9} className="p-0">
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                  <div className="px-5 pb-4 pt-2 bg-muted/10">
                                    {providerBookings.length === 0 ? (
                                      <p className="text-xs text-muted-foreground py-3 text-center">No confirmed bookings found.</p>
                                    ) : (
                                      <div className="rounded-xl border border-border overflow-hidden">
                                        <table className="w-full text-xs">
                                          <thead>
                                            <tr className="bg-muted/30 border-b border-border">
                                              <th className="text-left px-3 py-2 font-bold text-foreground">Date</th>
                                              <th className="text-left px-3 py-2 font-bold text-foreground">Location</th>
                                              <th className="text-left px-3 py-2 font-bold text-foreground">Time Block</th>
                                              <th className="text-left px-3 py-2 font-bold text-foreground">Status</th>
                                              <th className="text-left px-3 py-2 font-bold text-foreground">Notes</th>
                                              <th className="text-right px-3 py-2 font-bold text-foreground">Actions</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {providerBookings.map(b => {
                                              const isEditing = editingId === b.id;
                                              return (
                                                <tr key={b.id} className="border-b border-border last:border-0">
                                                  {isEditing ? (
                                                    <>
                                                      <td className="px-3 py-2"><Input type="date" value={editData.booking_date} onChange={e => setEditData(d => ({ ...d, booking_date: e.target.value }))} className="h-7 text-xs w-32" /></td>
                                                      <td className="px-3 py-2">
                                                        <Select value={editData.office_location} onValueChange={v => setEditData(d => ({ ...d, office_location: v }))}>
                                                          <SelectTrigger className="h-7 text-xs w-24"><SelectValue /></SelectTrigger>
                                                          <SelectContent><SelectItem value="hoboken">Hoboken</SelectItem><SelectItem value="edison">Edison</SelectItem></SelectContent>
                                                        </Select>
                                                      </td>
                                                      <td className="px-3 py-2">
                                                        <Select value={editData.time_block} onValueChange={v => setEditData(d => ({ ...d, time_block: v }))}>
                                                          <SelectTrigger className="h-7 text-xs w-24"><SelectValue /></SelectTrigger>
                                                          <SelectContent><SelectItem value="morning">Morning</SelectItem><SelectItem value="afternoon">Afternoon</SelectItem><SelectItem value="full_day">Full Day</SelectItem></SelectContent>
                                                        </Select>
                                                      </td>
                                                      <td className="px-3 py-2">
                                                        <Select value={editData.status} onValueChange={v => setEditData(d => ({ ...d, status: v }))}>
                                                          <SelectTrigger className="h-7 text-xs w-24"><SelectValue /></SelectTrigger>
                                                          <SelectContent><SelectItem value="confirmed">Confirmed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent>
                                                        </Select>
                                                      </td>
                                                      <td className="px-3 py-2"><Input value={editData.notes} onChange={e => setEditData(d => ({ ...d, notes: e.target.value }))} className="h-7 text-xs w-28" placeholder="Notes" /></td>
                                                      <td className="px-3 py-2 text-right">
                                                        <div className="flex gap-1 justify-end">
                                                          <button onClick={() => saveEdit(b.id)} className="p-1 rounded hover:bg-emerald-100 text-emerald-600"><Check className="w-3.5 h-3.5" /></button>
                                                          <button onClick={() => setEditingId(null)} className="p-1 rounded hover:bg-red-100 text-red-500"><X className="w-3.5 h-3.5" /></button>
                                                        </div>
                                                      </td>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <td className="px-3 py-2 text-foreground font-medium">{fmtDate(b.booking_date)}</td>
                                                      <td className="px-3 py-2"><Badge variant="outline" className={`text-[10px] font-bold uppercase ${b.office_location === "hoboken" ? "border-purple-200 bg-purple-50 text-purple-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>{b.office_location}</Badge></td>
                                                      <td className="px-3 py-2 text-muted-foreground capitalize">{b.time_block.replace("_", " ")}</td>
                                                      <td className="px-3 py-2"><Badge variant="outline" className={`text-[10px] font-bold uppercase ${b.status === "confirmed" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>{b.status}</Badge></td>
                                                      <td className="px-3 py-2 text-muted-foreground max-w-[120px] truncate">{b.notes || "—"}</td>
                                                      <td className="px-3 py-2 text-right">
                                                        <div className="flex gap-1 justify-end">
                                                          <button onClick={(e) => { e.stopPropagation(); startEdit(b); }} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                                                          <button onClick={(e) => { e.stopPropagation(); deleteBooking(b.id); }} className="p-1 rounded hover:bg-red-100 text-muted-foreground hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                                                        </div>
                                                      </td>
                                                    </>
                                                  )}
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })}
                  {providerRanking.length === 0 && (
                    <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">No booking data available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* ═══ ALL BOOKINGS ═══ */}
        <div id="section-bookings" className="scroll-mt-20">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-foreground text-sm">All Office Bookings</h3>
              <p className="text-xs text-muted-foreground">{bookings.length} entries in the selected range</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/20 border-b border-border">
                    <th className="text-left px-4 py-3 font-bold text-foreground">Date</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Provider</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Location</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Block</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-bold text-foreground">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice().reverse().map(b => (
                    <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/10">
                      <td className="px-4 py-3 text-foreground font-medium">{fmtDate(b.booking_date)}</td>
                      <td className="px-4 py-3 text-foreground">{b.provider_name}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className={`text-[10px] font-bold uppercase ${b.office_location === "hoboken" ? "border-purple-200 bg-purple-50 text-purple-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>{b.office_location}</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{b.time_block.replace("_", " ")}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className={`text-[10px] font-bold uppercase ${b.status === "confirmed" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>{b.status}</Badge></td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[150px] truncate">{b.notes || "—"}</td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No bookings in this range.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// React import needed for React.Fragment
import React from "react";
