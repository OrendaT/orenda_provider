import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, CalendarDays, MapPin, TrendingUp, Users, FileText } from "lucide-react";
import { toPng } from "html-to-image";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, Area, AreaChart,
} from "recharts";
import * as XLSX from "xlsx-js-style";
import { downloadExecutiveHtmlReport } from "@/utils/executiveHtmlExport";

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

const PURPLE = "hsl(270, 80%, 35%)";
const PURPLE_LIGHT = "hsl(270, 60%, 55%)";
const AMBER = "hsl(30, 80%, 45%)";
const EMERALD = "hsl(160, 60%, 35%)";
const BLUE = "hsl(220, 70%, 45%)";
const RED = "hsl(0, 60%, 50%)";
const PIE_COLORS = [PURPLE, AMBER, EMERALD, BLUE, "hsl(330, 60%, 50%)", "hsl(190, 70%, 40%)", "hsl(50, 80%, 45%)", RED];

function fmtDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const P = {
  DEEP: "2D1B4E", DARK: "462D6D", MED: "6B4FA0",
  SNOW: "F8F6FB", WHITE: "FFFFFF", TEXT: "1A1A2E", BORDER: "D4CCE6", WASH: "E8E0F0",
};
const bdr = (color = P.BORDER): any => ({
  top: { style: "thin", color: { rgb: color } },
  bottom: { style: "thin", color: { rgb: color } },
  left: { style: "thin", color: { rgb: color } },
  right: { style: "thin", color: { rgb: color } },
});

export default function AdminV2Executive() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    supabase.from("office_bookings").select("*").order("booking_date", { ascending: true })
      .then(({ data }) => { if (data) setBookings(data as any); });
  }, []);

  const confirmed = useMemo(() => bookings.filter(b => b.status === "confirmed"), [bookings]);

  // KPIs
  const totalBookings = confirmed.length;
  const hobokenCount = confirmed.filter(b => b.office_location === "hoboken").length;
  const edisonCount = confirmed.filter(b => b.office_location === "edison").length;
  const uniqueProviders = new Set(confirmed.map(b => b.provider_name)).size;

  // Monthly trend
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
      ...d,
      label: new Date(d.month + "-01T12:00:00").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    }));
  }, [confirmed]);

  // Provider ranking
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

  // Location pie
  const locationPie = [
    { name: "Hoboken", value: hobokenCount },
    { name: "Edison", value: edisonCount },
  ];

  // Time block distribution
  const timeBlockData = useMemo(() => {
    const m = { morning: 0, afternoon: 0, full_day: 0 };
    confirmed.forEach(b => { m[b.time_block as keyof typeof m]++; });
    return [
      { name: "Morning", value: m.morning },
      { name: "Afternoon", value: m.afternoon },
      { name: "Full Day", value: m.full_day },
    ];
  }, [confirmed]);

  // Day of week
  const dayOfWeekData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const counts = Array(7).fill(0);
    confirmed.forEach(b => {
      const d = new Date(b.booking_date + "T12:00:00").getDay();
      counts[d]++;
    });
    return days.map((name, i) => ({ name, bookings: counts[i] }));
  }, [confirmed]);

  // Weekday vs Weekend analysis
  const weekdayWeekendData = useMemo(() => {
    let weekday = 0, weekend = 0;
    const weekdayProviders: Record<string, number> = {};
    const weekendProviders: Record<string, number> = {};
    confirmed.forEach(b => {
      const day = new Date(b.booking_date + "T12:00:00").getDay();
      if (day === 0 || day === 6) {
        weekend++;
        weekendProviders[b.provider_name] = (weekendProviders[b.provider_name] || 0) + 1;
      } else {
        weekday++;
        weekdayProviders[b.provider_name] = (weekdayProviders[b.provider_name] || 0) + 1;
      }
    });
    const total = weekday + weekend;
    const topWeekdayProvider = Object.entries(weekdayProviders).sort((a, b) => b[1] - a[1])[0];
    const topWeekendProvider = Object.entries(weekendProviders).sort((a, b) => b[1] - a[1])[0];
    return {
      pieData: [
        { name: "Weekday", value: weekday },
        { name: "Weekend", value: weekend },
      ],
      weekday, weekend, total,
      weekdayPct: total > 0 ? Math.round(weekday / total * 100) : 0,
      weekendPct: total > 0 ? Math.round(weekend / total * 100) : 0,
      topWeekdayProvider: topWeekdayProvider ? { name: topWeekdayProvider[0], count: topWeekdayProvider[1] } : null,
      topWeekendProvider: topWeekendProvider ? { name: topWeekendProvider[0], count: topWeekendProvider[1] } : null,
      weekdayProviders: Object.entries(weekdayProviders).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
      weekendProviders: Object.entries(weekendProviders).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count })),
    };
  }, [confirmed]);

  // Business insights narrative
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

  // Weekly volume (last 12 weeks)
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
      for (const w of weeks) {
        if (d >= w.start && d <= w.end) { w.count++; break; }
      }
    });
    return weeks.map(w => ({ week: w.label, bookings: w.count }));
  }, [confirmed]);

  // Top 5 providers for bar chart
  const top5 = providerRanking.slice(0, 8);

  // Export
  const exportExecutive = () => {
    const wb = XLSX.utils.book_new();
    const hdrStyle = (rgb: string, sz = 10, bold = false): any => ({
      fill: { fgColor: { rgb } }, font: { bold, color: { rgb: P.WHITE }, sz }, alignment: { horizontal: "center" }, border: bdr(rgb),
    });
    const cellStyle = (even: boolean, align = "center"): any => ({
      fill: { fgColor: { rgb: even ? P.SNOW : P.WHITE } }, font: { color: { rgb: P.TEXT }, sz: 10 }, alignment: { horizontal: align }, border: bdr(P.WASH),
    });
    const addBrandHeader = (ws: any, title: string, cols: number) => {
      for (let r = 0; r < 3; r++) for (let c = 0; c < cols; c++) {
        const ref = XLSX.utils.encode_cell({ r, c });
        if (!ws[ref]) ws[ref] = { t: "s", v: "" };
        ws[ref].s = hdrStyle([P.DEEP, P.DEEP, P.DARK][r], r === 1 ? 16 : 10, r === 1);
      }
      if (!ws["!merges"]) ws["!merges"] = [];
      ws["!merges"].push({ s: { r: 1, c: 0 }, e: { r: 1, c: cols - 1 } });
    };
    const styleTable = (ws: any, headerRow: number, cols: number, dataRows: number) => {
      for (let c = 0; c < cols; c++) {
        const ref = XLSX.utils.encode_cell({ r: headerRow, c });
        if (!ws[ref]) ws[ref] = { t: "s", v: "" };
        ws[ref].s = hdrStyle(P.DEEP, 10, true);
      }
      for (let r = 0; r < dataRows; r++) for (let c = 0; c < cols; c++) {
        const ref = XLSX.utils.encode_cell({ r: headerRow + 1 + r, c });
        if (!ws[ref]) ws[ref] = { t: "s", v: "" };
        ws[ref].s = cellStyle(r % 2 === 0, c === 0 ? "left" : "center");
      }
    };

    // 1. Executive Summary
    const s1 = XLSX.utils.aoa_to_sheet([
      [""], ["Orenda Psychiatry — Executive Summary"], [""],
      ["KPI", "Value"],
      ["Total Provider Bookings", totalBookings],
      ["Hoboken Bookings", hobokenCount],
      ["Edison Bookings", edisonCount],
      ["Unique Providers", uniqueProviders],
    ]);
    s1["!cols"] = [{ wch: 28 }, { wch: 16 }];
    addBrandHeader(s1, "", 2);
    styleTable(s1, 3, 2, 4);
    XLSX.utils.book_append_sheet(wb, s1, "Executive Summary");

    // 2. Monthly Trend
    const s2 = XLSX.utils.aoa_to_sheet([
      ["", "", "", ""], ["Orenda Psychiatry — Monthly Booking Trend"], [""],
      ["Month", "Hoboken", "Edison", "Total"],
      ...monthlyTrend.map(m => [m.label, m.hoboken, m.edison, m.total]),
    ]);
    s2["!cols"] = [{ wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
    addBrandHeader(s2, "", 4);
    styleTable(s2, 3, 4, monthlyTrend.length);
    XLSX.utils.book_append_sheet(wb, s2, "Monthly Trend");

    // 3. Location Split
    const totalConf = hobokenCount + edisonCount;
    const s3 = XLSX.utils.aoa_to_sheet([
      ["", "", ""], ["Orenda Psychiatry — Location Distribution"], [""],
      ["Location", "Bookings", "Percentage"],
      ["Hoboken", hobokenCount, totalConf > 0 ? Math.round(hobokenCount / totalConf * 100) + "%" : "0%"],
      ["Edison", edisonCount, totalConf > 0 ? Math.round(edisonCount / totalConf * 100) + "%" : "0%"],
    ]);
    s3["!cols"] = [{ wch: 16 }, { wch: 12 }, { wch: 14 }];
    addBrandHeader(s3, "", 3);
    styleTable(s3, 3, 3, 2);
    XLSX.utils.book_append_sheet(wb, s3, "Location Split");

    // 4. Top Providers
    const provRows = providerRanking.map(p => [p.name, p.total, p.hoboken, p.edison, p.morning, p.afternoon, p.fullDay]);
    const s4 = XLSX.utils.aoa_to_sheet([
      ["", "", "", "", "", "", ""], ["Orenda Psychiatry — Provider Rankings"], [""],
      ["Provider", "Total", "Hoboken", "Edison", "Morning", "Afternoon", "Full Day"],
      ...provRows,
    ]);
    s4["!cols"] = [{ wch: 24 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 10 }];
    addBrandHeader(s4, "", 7);
    styleTable(s4, 3, 7, provRows.length);
    XLSX.utils.book_append_sheet(wb, s4, "Provider Rankings");

    // 5. Time Block Distribution
    const tbTotal = timeBlockData.reduce((s, d) => s + d.value, 0);
    const s5 = XLSX.utils.aoa_to_sheet([
      ["", "", ""], ["Orenda Psychiatry — Time Block Distribution"], [""],
      ["Time Block", "Bookings", "Percentage"],
      ...timeBlockData.map(d => [d.name, d.value, tbTotal > 0 ? Math.round(d.value / tbTotal * 100) + "%" : "0%"]),
    ]);
    s5["!cols"] = [{ wch: 16 }, { wch: 12 }, { wch: 14 }];
    addBrandHeader(s5, "", 3);
    styleTable(s5, 3, 3, timeBlockData.length);
    XLSX.utils.book_append_sheet(wb, s5, "Time Block");

    // 6. Day of Week
    const s6 = XLSX.utils.aoa_to_sheet([
      ["", ""], ["Orenda Psychiatry — Day of Week Preference"], [""],
      ["Day", "Bookings"],
      ...dayOfWeekData.map(d => [d.name, d.bookings]),
    ]);
    s6["!cols"] = [{ wch: 12 }, { wch: 12 }];
    addBrandHeader(s6, "", 2);
    styleTable(s6, 3, 2, 7);
    XLSX.utils.book_append_sheet(wb, s6, "Day of Week");

    // 7. Weekday vs Weekend
    const wwRows = [
      ["Weekday (Mon–Fri)", weekdayWeekendData.weekday, weekdayWeekendData.weekdayPct + "%"],
      ["Weekend (Sat–Sun)", weekdayWeekendData.weekend, weekdayWeekendData.weekendPct + "%"],
    ];
    const s7 = XLSX.utils.aoa_to_sheet([
      ["", "", ""], ["Orenda Psychiatry — Weekday vs Weekend"], [""],
      ["Category", "Bookings", "Percentage"],
      ...wwRows,
      [], ["Top Weekday Provider", weekdayWeekendData.topWeekdayProvider?.name || "N/A", weekdayWeekendData.topWeekdayProvider?.count || 0],
      ["Top Weekend Provider", weekdayWeekendData.topWeekendProvider?.name || "N/A", weekdayWeekendData.topWeekendProvider?.count || 0],
      [], ["Provider", "Weekday", "Weekend"],
      ...(() => {
        const allNames = new Set([...weekdayWeekendData.weekdayProviders.map(p => p.name), ...weekdayWeekendData.weekendProviders.map(p => p.name)]);
        return Array.from(allNames).map(name => [
          name,
          weekdayWeekendData.weekdayProviders.find(p => p.name === name)?.count || 0,
          weekdayWeekendData.weekendProviders.find(p => p.name === name)?.count || 0,
        ]);
      })(),
    ]);
    s7["!cols"] = [{ wch: 24 }, { wch: 12 }, { wch: 14 }];
    addBrandHeader(s7, "", 3);
    styleTable(s7, 3, 3, 2);
    XLSX.utils.book_append_sheet(wb, s7, "Weekday vs Weekend");

    // 8. Weekly Volume
    const s8 = XLSX.utils.aoa_to_sheet([
      ["", ""], ["Orenda Psychiatry — Weekly Booking Volume"], [""],
      ["Week Starting", "Bookings"],
      ...weeklyVolume.map(w => [w.week, w.bookings]),
    ]);
    s8["!cols"] = [{ wch: 16 }, { wch: 12 }];
    addBrandHeader(s8, "", 2);
    styleTable(s8, 3, 2, weeklyVolume.length);
    XLSX.utils.book_append_sheet(wb, s8, "Weekly Volume");

    XLSX.writeFile(wb, "Orenda_Psychiatry_Executive_Report.xlsx");
  };

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
      ] as const;

      const capturedSections = await Promise.all(exportSections.map(async ({ key, title, subtitle }) => {
        const section = dashboardRef.current?.querySelector<HTMLElement>(`[data-export-card="${key}"]`);
        if (!section) return null;

        const dataUrl = await toPng(section, {
          backgroundColor: "#F8F6FB",
          pixelRatio: 2,
          cacheBust: true,
        });

        return { title, subtitle, dataUrl };
      }));

      const peakMonth = monthlyTrend.reduce<{ label: string; total: number } | null>((best, month) => {
        if (!best || month.total > best.total) return { label: month.label, total: month.total };
        return best;
      }, null);
      const topProvider = providerRanking[0];
      const topTimeBlock = [...timeBlockData].sort((a, b) => b.value - a.value)[0];
      const dominantLocation = hobokenCount >= edisonCount ? "Hoboken" : "Edison";
      const locationLead = Math.abs(hobokenCount - edisonCount);

      downloadExecutiveHtmlReport({
        generatedAt: new Date().toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        kpis: [
          { label: "Total Bookings", value: totalBookings },
          { label: "Hoboken Bookings", value: hobokenCount },
          { label: "Edison Bookings", value: edisonCount },
          { label: "Providers", value: uniqueProviders },
          
        ],
        highlights: [
          {
            label: "Top Provider",
            value: topProvider ? topProvider.name : "No provider data",
            detail: topProvider ? `${topProvider.total} total bookings across Hoboken and Edison.` : "No confirmed provider bookings are available yet.",
          },
          {
            label: "Busiest Month",
            value: peakMonth ? peakMonth.label : "No monthly trend yet",
            detail: peakMonth ? `${peakMonth.total} confirmed provider bookings were scheduled in the highest-volume month.` : "Monthly trend data will appear once bookings are added.",
          },
          {
            label: "Location Lead",
            value: totalBookings ? dominantLocation : "No location split yet",
            detail: totalBookings ? `${dominantLocation} leads by ${locationLead} booking${locationLead === 1 ? "" : "s"}. ${topTimeBlock ? `${topTimeBlock.name} is the most common time block.` : ""}` : "Location distribution will appear once bookings are available.",
          },
        ],
        sections: capturedSections.filter((section): section is NonNullable<typeof section> => Boolean(section)),
        providerRanking,
      });
    } catch (e) {
      console.error("Executive report export failed", e);
    } finally {
      setDownloadingReport(false);
    }
  };

  const kpis = [
    { label: "Total Bookings", value: totalBookings, icon: CalendarDays, color: PURPLE },
    { label: "Hoboken", value: hobokenCount, icon: MapPin, color: PURPLE_LIGHT },
    { label: "Edison", value: edisonCount, icon: MapPin, color: AMBER },
    { label: "Providers", value: uniqueProviders, icon: Users, color: BLUE },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(270, 100%, 12%) 0%, hsl(270, 80%, 25%) 50%, hsl(270, 60%, 40%) 100%)" }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="exec-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#exec-dots)" />
        </svg>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <Link to="/admin-v2/reporting" className="inline-flex items-center gap-2 text-xs text-white/50 font-bold uppercase tracking-wider hover:text-white/80 transition-colors mb-4 sm:mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Reporting
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-5xl font-bold text-white tracking-tight">Executive Analytics</h1>
              <p className="text-sm sm:text-base text-white/60 mt-1 sm:mt-2 font-medium">Provider booking performance across all locations.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs" onClick={downloadExecutiveReport} disabled={downloadingReport}>
                <FileText className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{downloadingReport ? "Building..." : "Report"}</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs" onClick={exportExecutive}>
                <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Excel</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div ref={dashboardRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
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

        {/* Row 1: Monthly Trend + Location Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            data-export-card="monthly-trend"
            className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground text-sm mb-1">Monthly Booking Trend</h3>
            <p className="text-xs text-muted-foreground mb-4">Hoboken vs Edison bookings over time</p>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PURPLE} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={PURPLE} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={AMBER} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={AMBER} stopOpacity={0} />
                  </linearGradient>
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

        {/* Row 2: Top Providers Bar + Time Block Pie */}
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

        {/* Row 3: Day of Week + Weekday vs Weekend */}
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
                    <Cell fill={PURPLE} />
                    <Cell fill={AMBER} />
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
                  <p className="text-muted-foreground">
                    {weekdayWeekendData.topWeekdayProvider
                      ? `${weekdayWeekendData.topWeekdayProvider.name} (${weekdayWeekendData.topWeekdayProvider.count} bookings)`
                      : "No weekday bookings"}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/30 p-3 border border-border">
                  <p className="font-bold text-foreground mb-1">🌅 Top Weekend Provider</p>
                  <p className="text-muted-foreground">
                    {weekdayWeekendData.topWeekendProvider
                      ? `${weekdayWeekendData.topWeekendProvider.name} (${weekdayWeekendData.topWeekendProvider.count} bookings)`
                      : "No weekend bookings"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>


        {/* Row 4: Weekly Volume */}
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

        {/* Provider Rankings Table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-foreground text-sm">Provider Rankings</h3>
            <p className="text-xs text-muted-foreground">Complete breakdown by provider, location, and time block</p>
          </div>
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
                </tr>
              </thead>
              <tbody>
                {providerRanking.map((p, i) => (
                  <tr key={p.name} className="border-b border-border last:border-0 hover:bg-muted/10">
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
                    <td className="px-4 py-3 text-center">
                      <Badge variant="outline" className="text-[10px] font-bold border-purple-200 bg-purple-50 text-purple-700">{p.hoboken}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="outline" className="text-[10px] font-bold border-amber-200 bg-amber-50 text-amber-700">{p.edison}</Badge>
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{p.morning}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{p.afternoon}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{p.fullDay}</td>
                  </tr>
                ))}
                {providerRanking.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No booking data available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
