import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell, PieChart, Pie, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend, LineChart, Line, Area, AreaChart,
} from "recharts";
import {
  Upload, Star, TrendingUp, AlertTriangle, Users, FileSpreadsheet,
  ArrowLeft, BarChart3, Activity, Target, Award, Zap, DollarSign,
  Percent, ClipboardList, Brain, Download, Send, ChevronDown, ChevronUp,
  ExternalLink, Filter, ChevronRight, Eye, Info, X, Camera,
} from "lucide-react";
import * as XLSX from "xlsx-js-style";
import { toPng } from "html-to-image";

// ─── Types ──────────────────────────────────────────────────────────────
interface ProviderData {
  name: string;
  missingNotes: number;
  totalBillable: number;
  billableNoShow: number;
  nonBillableNoShow: number;
  overallBillable: number;
  intakeCount: number;
  followUpCount: number;
  intakePercent: number;
  followUpPercent: number;
  compensation: number;
  avgRate: number;
  missedCompensation: number;
  timecardUrl: string;
  utilization: number;
  scheduledHours: number;
  patientHours: number;
  startDate: Date | null;
  tenureMonths: number;
  tenureDays: number;
  cleanRate: number;
  followUpRatio: number;
  totalVolume: number;
  missingNotesRate: number;
  rateSchedule: string;
  licensedStates: string;
  providerStatus: string;
  tier: string;
  tierLabel: string;
  score: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────
const ASSUMED_RATE = 85;

function calcTenureMonths(startDate: Date | null): number {
  if (!startDate) return 0;
  const now = new Date();
  return Math.max(0, (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth()));
}

function formatTenure(days: number): string {
  if (days <= 0) return "—";
  if (days < 90) return `${days}d`;
  const months = Math.floor(days / 30.44);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${years}y ${rem}mo` : `${years}y`;
}

const tierColors: Record<string, { color: string; bg: string }> = {
  "all-star": { color: "#7c3aed", bg: "bg-purple-100 text-purple-800" },
  "rising-star": { color: "#10b981", bg: "bg-emerald-100 text-emerald-800" },
  "raise-candidate": { color: "#2563eb", bg: "bg-blue-100 text-blue-800" },
  "inactive-check": { color: "#ef4444", bg: "bg-red-100 text-red-700" },
  "standard": { color: "#6b7280", bg: "bg-gray-100 text-gray-700" },
  // Specific attention labels
  "low-volume": { color: "#f59e0b", bg: "bg-amber-100 text-amber-800" },
  "high-missing-notes": { color: "#ef4444", bg: "bg-red-100 text-red-700" },
  "low-utilization": { color: "#f97316", bg: "bg-orange-100 text-orange-800" },
};

const getTierBg = (tier: string) => tierColors[tier]?.bg || "bg-gray-100 text-gray-700";
const getTierColor = (tier: string) => tierColors[tier]?.color || "#6b7280";

const CHART_COLORS = ["#7c3aed", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe", "#8b5cf6", "#6d28d9", "#5b21b6"];

const STORAGE_KEY = "provider_performance_data";
const STORAGE_PP_KEY = "provider_performance_pay_period";
const STORAGE_TS_KEY = "provider_performance_uploaded_at";

function serializeProviders(providers: ProviderData[]): string {
  return JSON.stringify(providers.map(p => ({ ...p, startDate: p.startDate ? p.startDate.toISOString() : null })));
}

function deserializeProviders(json: string): ProviderData[] {
  const arr = JSON.parse(json);
  return arr.map((p: any) => ({ ...p, startDate: p.startDate ? new Date(p.startDate) : null }));
}

function loadSavedData(): { providers: ProviderData[]; payPeriod: string; uploadedAt: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const pp = localStorage.getItem(STORAGE_PP_KEY);
    const ts = localStorage.getItem(STORAGE_TS_KEY);
    if (!raw) return null;
    return { providers: deserializeProviders(raw), payPeriod: pp || "Current Period", uploadedAt: ts || "" };
  } catch { return null; }
}

function saveData(providers: ProviderData[], payPeriod: string) {
  localStorage.setItem(STORAGE_KEY, serializeProviders(providers));
  localStorage.setItem(STORAGE_PP_KEY, payPeriod);
  localStorage.setItem(STORAGE_TS_KEY, new Date().toLocaleString());
}

const segmentDescriptions: Record<string, string> = {
  "all-star": "Top performers: 75th percentile volume, <1% missing notes, missed compensation below practice median.",
  "rising-star": "New providers (<120 days) showing strong ramp: 60th percentile among cohort, <3% missing notes.",
  "raise-candidate": "All-Stars with base/mid rate, >85% utilization, >6 months tenure — strong candidates for rate increase.",
  "standard": "Meets baseline performance thresholds but hasn't reached All-Star or Rising Star criteria yet.",
  "inactive-check": "Zero billable appointments, utilization, and compensation this period — verify if still active.",
  "low-volume": "Total volume is low relative to tenure (< 10 total with 6+ months). May need workload review.",
  "high-missing-notes": "Missing/incomplete notes exceed 15 or missing notes rate exceeds 40%. Needs documentation improvement.",
  "low-utilization": "Utilization is below 25%. May need scheduling or caseload optimization.",
};

// ─── File parsers ───────────────────────────────────────────────────────
function parseMissingNotes(wb: XLSX.WorkBook): { data: Map<string, any>; payPeriod: string } {
  let payPeriod = "";
  const configSheet = wb.Sheets["PayPeriodConfig"] || wb.Sheets[wb.SheetNames[0]];
  if (configSheet) {
    const configRows: any[] = XLSX.utils.sheet_to_json(configSheet);
    for (const r of configRows) {
      if (r["Selected Period"]) payPeriod = `${r["Selected Period"]}`;
      if (r["Selected Year"]) payPeriod = `${payPeriod} ${r["Selected Year"]}`.trim();
    }
  }
  const sheet = wb.Sheets["TimecardFact"];
  if (!sheet) return { data: new Map(), payPeriod };
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);
  const map = new Map<string, any>();
  for (const r of rows) {
    const name = (r["Provider Name"] || "").toString().trim();
    if (!name) continue;
    if (!payPeriod && r["Pay Period"]) {
      const yr = r["Timecard Year"] || new Date().getFullYear();
      payPeriod = `${r["Pay Period"]} ${yr}`;
    }
    map.set(name.toLowerCase(), {
      name,
      missingNotes: Number(r["Missing / Incomplete Notes"]) || 0,
      totalBillable: Number(r["Total Billable Appointments"]) || 0,
      billableNoShow: Number(r["Billable No-Show/ Late Cancel"]) || 0,
      nonBillableNoShow: Number(r["Non-Billable No-Show/ Late Cancel"]) || 0,
      overallBillable: Number(r["Overall Total Billable"]) || 0,
      intakeCount: Number(r["Intake Count"]) || 0,
      followUpCount: Number(r["Follow-Up Count"]) || 0,
      compensation: Number(r["Compensation"]) || 0,
      avgRate: Number(r["Avg Rate"]) || 0,
      missedCompensation: (Number(r["Missing / Incomplete Notes"]) || 0) * ASSUMED_RATE,
      timecardUrl: (r["File URL"] || "").toString(),
    });
  }
  return { data: map, payPeriod };
}

function parseUtilization(wb: XLSX.WorkBook): Map<string, { utilization: number; scheduledHours: number; patientHours: number }> {
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  if (!sheet) return new Map();
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const map = new Map();
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[1]) continue;
    const name = row[1].toString().trim();
    const scheduled = Number(row[23]) || 0;
    const patient = Number(row[24]) || 0;
    const util = Number(row[25]) || 0;
    map.set(name.toLowerCase(), { utilization: util, scheduledHours: scheduled, patientHours: patient });
  }
  return map;
}

function parseStartDate(wb: XLSX.WorkBook): Map<string, { date: Date; rateSchedule: string; licensedStates: string; providerStatus: string }> {
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  if (!sheet) return new Map();
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const map = new Map();
  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[2]) continue;
    const name = row[2].toString().trim();
    const dateVal = row[4];
    const rateSchedule = String(row[3] || "").trim();
    const licensedStates = String(row[6] || "").trim();
    const providerStatus = String(row[9] || "").trim().toLowerCase();
    if (!dateVal) continue;
    let d: Date;
    if (typeof dateVal === "number") d = new Date((dateVal - 25569) * 86400000);
    else d = new Date(dateVal);
    if (!isNaN(d.getTime())) map.set(name.toLowerCase(), { date: d, rateSchedule, licensedStates, providerStatus });
  }
  return map;
}

function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)] || 0;
}

function mergeData(
  missing: Map<string, any>,
  util: Map<string, any>,
  starts: Map<string, { date: Date; rateSchedule: string; licensedStates: string; providerStatus: string }>
): ProviderData[] {
  const raw: Omit<ProviderData, "tier" | "tierLabel" | "score">[] = [];
  let practiceIntakes = 0, practiceFollowUps = 0;
  for (const [, m] of missing) { practiceIntakes += m.intakeCount; practiceFollowUps += m.followUpCount; }

  for (const [key, m] of missing) {
    const u = util.get(key) || { utilization: 0, scheduledHours: 0, patientHours: 0 };
    const startInfo = starts.get(key);
    const sd = startInfo?.date || null;
    const rateSchedule = startInfo?.rateSchedule || "";
    const licensedStates = startInfo?.licensedStates || "";
    const providerStatus = startInfo?.providerStatus || "";
    const tenure = calcTenureMonths(sd);
    const tenureDays = sd ? Math.floor((Date.now() - sd.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const totalVolume = m.totalBillable + m.intakeCount + m.followUpCount;
    const cleanRate = totalVolume > 0 ? Math.max(0, 1 - m.missingNotes / Math.max(totalVolume, m.missingNotes)) : 0;
    const followUpRatio = m.intakeCount > 0 ? m.followUpCount / m.intakeCount : 0;
    const missingNotesRate = totalVolume > 0 ? (m.missingNotes / (totalVolume + m.missingNotes)) * 100 : 0;
    const providerApptTotal = m.intakeCount + m.followUpCount;
    const intakePercent = providerApptTotal > 0 ? (m.intakeCount / providerApptTotal) * 100 : 0;
    const followUpPercent = providerApptTotal > 0 ? (m.followUpCount / providerApptTotal) * 100 : 0;

    raw.push({
      ...m, utilization: u.utilization, scheduledHours: u.scheduledHours, patientHours: u.patientHours,
      startDate: sd, tenureMonths: tenure, tenureDays, cleanRate, followUpRatio, totalVolume,
      missingNotesRate, rateSchedule, licensedStates, providerStatus, intakePercent, followUpPercent,
    });
  }

  const allVolumes = raw.map(p => p.totalVolume);
  const allMissedComp = raw.map(p => p.missedCompensation);
  const vol75 = percentile(allVolumes, 75);
  const medianMissedComp = percentile(allMissedComp, 50);
  const newProviders = raw.filter(p => p.tenureDays < 120);
  const newVolumes = newProviders.map(p => p.totalVolume);
  const newVol60 = percentile(newVolumes, 60);

  const providers: ProviderData[] = raw.map(p => {
    const score = (Math.min(p.utilization * 100, 100) * 0.3) +
      (Math.min(p.cleanRate * 100, 100) * 0.25) +
      (Math.min(p.totalVolume / 50 * 100, 100) * 0.2) +
      (Math.min((p.followUpRatio / (p.tenureMonths >= 6 ? 0.7 : 0.4)) * 100, 100) * 0.25);

    const looksInactive = p.totalBillable === 0 && p.utilization === 0 && p.totalVolume === 0 && p.compensation === 0;
    const isAllStar = !looksInactive && p.totalVolume >= vol75 && p.missingNotesRate < 1 && p.missedCompensation <= medianMissedComp;
    const isRisingStar = !looksInactive && p.tenureDays < 120 && p.totalVolume >= newVol60 && p.missingNotesRate < 3;
    const rateLower = p.rateSchedule.toLowerCase();
    const isBaseMid = rateLower.includes("base") || rateLower.includes("mid");
    const isRaiseCandidate = isAllStar && isBaseMid && p.utilization >= 0.85 && p.tenureMonths > 6 && p.missingNotesRate < 1;

    let tier = "standard";
    let tierLabel = "Standard";

    if (looksInactive) {
      tier = "inactive-check";
      tierLabel = "🔍 Verify Active";
    } else if (isRaiseCandidate) {
      tier = "raise-candidate";
      tierLabel = "💰 Raise Candidate";
    } else if (isAllStar) {
      tier = "all-star";
      tierLabel = "⭐ All-Star";
    } else if (isRisingStar) {
      tier = "rising-star";
      tierLabel = "🌱 Rising Star";
    } else if (p.missingNotes > 15 || p.missingNotesRate > 40) {
      tier = "high-missing-notes";
      tierLabel = "📝 High Missing Notes";
    } else if (p.utilization < 0.25 && p.utilization > 0) {
      tier = "low-utilization";
      tierLabel = "📉 Low Utilization";
    } else if (p.tenureMonths >= 6 && p.totalVolume < 10) {
      tier = "low-volume";
      tierLabel = "📊 Low Volume for Tenure";
    }

    return { ...p, tier, tierLabel, score };
  });

  return providers.sort((a, b) => b.totalBillable - a.totalBillable);
}

// ─── Component ──────────────────────────────────────────────────────────
export default function ProviderPerformanceDashboard() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState(false);
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [authChecked, setAuthChecked] = useState(false);
  const [sortCol, setSortCol] = useState<string>("totalBillable");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [payPeriod, setPayPeriod] = useState<string>("");
  const [tableExpanded, setTableExpanded] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ProviderData | null>(null);
  const [segmentInfo, setSegmentInfo] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const [uploadedAt, setUploadedAt] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    const hydrateSavedData = () => {
      try {
        const saved = loadSavedData();
        if (saved && saved.providers.length > 0) {
          setProviders(saved.providers);
          setPayPeriod(saved.payPeriod);
          setUploadedAt(saved.uploadedAt);
          setFilesUploaded(true);
        }
      } catch (loadErr) {
        console.error("Failed to load saved data:", loadErr);
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    const checkAccess = async (session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]) => {
      try {
        if (!session?.user) {
          if (!cancelled) {
            setAuthChecked(true);
            navigate("/", { replace: true });
          }
          return;
        }

        const { data, error } = await supabase
          .from("admin_permissions")
          .select("has_admin_access")
          .eq("user_id", session.user.id)
          .limit(1)
          .maybeSingle();

        if (cancelled) return;
        if (error) console.error("Auth check error:", error);

        if (!data?.has_admin_access) {
          setAuthChecked(true);
          navigate("/provider-portal", { replace: true });
          return;
        }

        setAuthChecked(true);
        hydrateSavedData();
      } catch (err) {
        console.error("Auth check failed:", err);
        if (!cancelled) setAuthChecked(true);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void checkAccess(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      void checkAccess(session);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Auto-hide scroll hint after user scrolls
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => { if (el.scrollLeft > 20) setShowScrollHint(false); };
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, [filesUploaded]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length < 3) { toast.error("Please select all 3 files."); return; }
    setLoading(true);
    try {
      const readFile = (f: File): Promise<XLSX.WorkBook> =>
        new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = (ev) => res(XLSX.read(new Uint8Array(ev.target!.result as ArrayBuffer), { type: "array", cellDates: true }));
          reader.onerror = rej;
          reader.readAsArrayBuffer(f);
        });
      const wbs = await Promise.all(Array.from(files).map(readFile));
      let missingWb: XLSX.WorkBook | null = null, utilWb: XLSX.WorkBook | null = null, startWb: XLSX.WorkBook | null = null;
      for (const wb of wbs) {
        if (wb.SheetNames.includes("TimecardFact")) missingWb = wb;
        else if (wb.SheetNames.some(s => s.includes("NP Roster") || s.includes("Roster"))) startWb = wb;
        else utilWb = wb;
      }
      if (!missingWb || !utilWb || !startWb) { toast.error("Couldn't identify files."); setLoading(false); return; }
      const { data: missing, payPeriod: pp } = parseMissingNotes(missingWb);
      const util = parseUtilization(utilWb);
      const starts = parseStartDate(startWb);
      const merged = mergeData(missing, util, starts).filter(p => !p.name.toLowerCase().includes("leah m"));
      setProviders(merged);
      const payPeriodVal = pp || "Current Period";
      setPayPeriod(payPeriodVal);
      setFilesUploaded(true);
      saveData(merged, payPeriodVal);
      setUploadedAt(new Date().toLocaleString());
      const inactiveCount = merged.filter(p => p.tier === "inactive-check").length;
      toast.success(`Processed ${merged.length} providers!${inactiveCount > 0 ? ` ⚠️ ${inactiveCount} flagged for review.` : ""}`);
    } catch (err: any) { toast.error("Error: " + err.message); }
    setLoading(false);
    if (e.target) e.target.value = "";
  }, []);

  const stats = useMemo(() => {
    if (!providers.length) return null;
    const allStars = providers.filter(p => p.tier === "all-star" || p.tier === "raise-candidate").sort((a, b) => b.totalVolume - a.totalVolume).slice(0, 10);
    const risingStars = providers.filter(p => p.tier === "rising-star");
    const raiseCandidates = providers.filter(p => p.tier === "raise-candidate");
    const avgUtil = providers.reduce((s, p) => s + p.utilization, 0) / providers.length;
    const avgClean = providers.reduce((s, p) => s + p.cleanRate, 0) / providers.length;
    const totalMissedRev = providers.reduce((s, p) => s + p.missedCompensation, 0);
    const totalMissing = providers.reduce((s, p) => s + p.missingNotes, 0);
    const totalVolume = providers.reduce((s, p) => s + p.totalVolume, 0);
    const totalBillable = providers.reduce((s, p) => s + p.totalBillable, 0);
    const totalComp = providers.reduce((s, p) => s + p.compensation, 0);
    const totalIntakes = providers.reduce((s, p) => s + p.intakeCount, 0);
    const totalFollowUps = providers.reduce((s, p) => s + p.followUpCount, 0);
    const practiceIntakePercent = (totalIntakes + totalFollowUps) > 0 ? (totalIntakes / (totalIntakes + totalFollowUps)) * 100 : 0;
    const practiceFollowUpPercent = (totalIntakes + totalFollowUps) > 0 ? (totalFollowUps / (totalIntakes + totalFollowUps)) * 100 : 0;
    return { allStars, risingStars, raiseCandidates, avgUtil, avgClean, totalMissedRev, totalMissing, totalVolume, totalBillable, totalComp, practiceIntakePercent, practiceFollowUpPercent };
  }, [providers]);

  const filtered = useMemo(() => {
    let list = tierFilter === "all" ? [...providers] : providers.filter(p => p.tier === tierFilter);
    const key = sortCol as keyof ProviderData;
    list.sort((a, b) => {
      const av = a[key] ?? 0;
      const bv = b[key] ?? 0;
      if (typeof av === "number" && typeof bv === "number") return sortDir === "desc" ? bv - av : av - bv;
      return sortDir === "desc" ? String(bv).localeCompare(String(av)) : String(av).localeCompare(String(bv));
    });
    return list;
  }, [providers, tierFilter, sortCol, sortDir]);

  const displayedProviders = tableExpanded ? filtered : filtered.slice(0, 10);

  const toggleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const SortHeader = ({ col, label, align = "right" }: { col: string; label: string; align?: string }) => (
    <th
      className={`p-3 font-semibold text-foreground cursor-pointer select-none hover:bg-purple-100/50 transition-colors whitespace-nowrap text-${align}`}
      onClick={() => toggleSort(col)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortCol === col ? (sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />) : <ChevronDown className="w-3 h-3 opacity-20" />}
      </span>
    </th>
  );

  const exportToExcel = () => {
    const BRAND_HEADER = { font: { bold: true, color: { rgb: "FFFFFF" }, name: "Arial", sz: 11 }, fill: { fgColor: { rgb: "2D1B4E" } }, alignment: { horizontal: "center", vertical: "center" } };
    const BRAND_TITLE = { font: { bold: true, color: { rgb: "FFFFFF" }, name: "Arial", sz: 14 }, fill: { fgColor: { rgb: "3B0764" } }, alignment: { horizontal: "center", vertical: "center" } };
    const BRAND_SUBTITLE = { font: { bold: false, color: { rgb: "CCCCCC" }, name: "Arial", sz: 10 }, fill: { fgColor: { rgb: "3B0764" } }, alignment: { horizontal: "center", vertical: "center" } };
    const ROW_EVEN = { fill: { fgColor: { rgb: "F3E8FF" } } };
    const ROW_ODD = { fill: { fgColor: { rgb: "FFFFFF" } } };
    const NUM_FMT_PCT = { numFmt: "0.0%" };
    const NUM_FMT_DOLLAR = { numFmt: "$#,##0" };

    const wb = XLSX.utils.book_new();

    const makeSheet = (title: string, subtitle: string, data: ProviderData[], cols: { h: string; w: number; key: (p: ProviderData, i: number) => any; fmt?: any }[]) => {
      const aoa: any[][] = [];
      // Row 0: Brand title merged
      aoa.push([`Orenda Psychiatry — ${title}`, ...Array(cols.length - 1).fill("")]);
      // Row 1: Subtitle
      aoa.push([subtitle, ...Array(cols.length - 1).fill("")]);
      // Row 2: Empty spacer
      aoa.push(Array(cols.length).fill(""));
      // Row 3: Headers
      aoa.push(cols.map(c => c.h));
      // Data rows
      data.forEach((p, i) => aoa.push(cols.map(c => c.key(p, i))));

      const ws = XLSX.utils.aoa_to_sheet(aoa);
      // Merges for title and subtitle
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: cols.length - 1 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: cols.length - 1 } },
      ];
      // Style title rows
      for (let c = 0; c < cols.length; c++) {
        const t0 = ws[XLSX.utils.encode_cell({ r: 0, c })]; if (t0) t0.s = BRAND_TITLE;
        const t1 = ws[XLSX.utils.encode_cell({ r: 1, c })]; if (t1) t1.s = BRAND_SUBTITLE;
      }
      // Style headers (row 3)
      for (let c = 0; c < cols.length; c++) {
        const cell = ws[XLSX.utils.encode_cell({ r: 3, c })]; if (cell) cell.s = BRAND_HEADER;
      }
      // Style data rows
      for (let r = 0; r < data.length; r++) {
        const rowStyle = r % 2 === 0 ? ROW_EVEN : ROW_ODD;
        for (let c = 0; c < cols.length; c++) {
          const cell = ws[XLSX.utils.encode_cell({ r: r + 4, c })];
          if (cell) cell.s = { ...rowStyle, ...(cols[c].fmt || {}) };
        }
      }
      ws["!cols"] = cols.map(c => ({ wch: c.w }));
      ws["!rows"] = [{ hpt: 30 }, { hpt: 20 }, { hpt: 8 }];
      return ws;
    };

    const metricsCols = [
      { h: "#", w: 5, key: (_: ProviderData, i: number) => i + 1 },
      { h: "Provider", w: 28, key: (p: ProviderData) => p.name },
      { h: "Tier", w: 22, key: (p: ProviderData) => p.tierLabel },
      { h: "Billable Appts", w: 14, key: (p: ProviderData) => p.totalBillable },
      { h: "Billable No-Shows", w: 16, key: (p: ProviderData) => p.billableNoShow },
      { h: "Non-Bill No-Shows", w: 17, key: (p: ProviderData) => p.nonBillableNoShow },
      { h: "Overall Billable", w: 15, key: (p: ProviderData) => p.overallBillable },
      { h: "Intakes", w: 10, key: (p: ProviderData) => p.intakeCount },
      { h: "Intake %", w: 10, key: (p: ProviderData) => +(p.intakePercent.toFixed(1)) },
      { h: "Follow-Ups", w: 12, key: (p: ProviderData) => p.followUpCount },
      { h: "Follow-Up %", w: 12, key: (p: ProviderData) => +(p.followUpPercent.toFixed(1)) },
      { h: "Missing Notes", w: 14, key: (p: ProviderData) => p.missingNotes },
      { h: "Missing %", w: 11, key: (p: ProviderData) => +(p.missingNotesRate.toFixed(1)) },
      { h: "Utilization %", w: 13, key: (p: ProviderData) => +((p.utilization * 100).toFixed(1)) },
      { h: "Compensation", w: 14, key: (p: ProviderData) => p.compensation, fmt: NUM_FMT_DOLLAR },
      { h: "Missed Comp", w: 13, key: (p: ProviderData) => p.missedCompensation, fmt: NUM_FMT_DOLLAR },
      { h: "Rate Schedule", w: 14, key: (p: ProviderData) => p.rateSchedule || "" },
      { h: "Licensed States", w: 20, key: (p: ProviderData) => p.licensedStates || "" },
      { h: "Start Date", w: 12, key: (p: ProviderData) => p.startDate ? p.startDate.toLocaleDateString() : "" },
      { h: "Tenure", w: 10, key: (p: ProviderData) => formatTenure(p.tenureDays) },
    ];

    const segCols = [
      { h: "#", w: 5, key: (_: ProviderData, i: number) => i + 1 },
      { h: "Provider", w: 28, key: (p: ProviderData) => p.name },
      { h: "Volume", w: 10, key: (p: ProviderData) => p.totalVolume },
      { h: "Missing Notes", w: 14, key: (p: ProviderData) => p.missingNotes },
      { h: "Missing %", w: 11, key: (p: ProviderData) => +(p.missingNotesRate.toFixed(1)) },
      { h: "Utilization %", w: 13, key: (p: ProviderData) => +((p.utilization * 100).toFixed(1)) },
      { h: "Missed Comp", w: 13, key: (p: ProviderData) => p.missedCompensation, fmt: NUM_FMT_DOLLAR },
      { h: "Rate Schedule", w: 14, key: (p: ProviderData) => p.rateSchedule || "" },
      { h: "Tenure", w: 10, key: (p: ProviderData) => formatTenure(p.tenureDays) },
      { h: "Intakes", w: 10, key: (p: ProviderData) => p.intakeCount },
      { h: "Follow-Ups", w: 12, key: (p: ProviderData) => p.followUpCount },
    ];

    // Tab 1: All Providers
    XLSX.utils.book_append_sheet(wb, makeSheet("Provider Metrics", `${payPeriod} · ${providers.length} Providers`, filtered, metricsCols), "All Providers");
    // Tab 2: All-Stars Top 10
    XLSX.utils.book_append_sheet(wb, makeSheet("All-Stars — Top 10", "75th percentile volume · <1% missing notes · Low leakage", stats?.allStars || [], segCols), "All-Stars Top 10");
    // Tab 3: Rising Stars
    XLSX.utils.book_append_sheet(wb, makeSheet("Rising Stars", "<120 days tenure · 60th percentile cohort · <3% missing", stats?.risingStars || [], segCols), "Rising Stars");
    // Tab 4: Raise Candidates
    XLSX.utils.book_append_sheet(wb, makeSheet("Raise Candidates", "All-Star + Base/Mid rate + >85% util + >6mo tenure", stats?.raiseCandidates || [], segCols), "Raise Candidates");
    // Tab 5: Utilization data
    const utilCols = [
      { h: "#", w: 5, key: (_: ProviderData, i: number) => i + 1 },
      { h: "Provider", w: 28, key: (p: ProviderData) => p.name },
      { h: "Utilization %", w: 14, key: (p: ProviderData) => +((p.utilization * 100).toFixed(1)) },
    ];
    const utilSorted = [...providers].filter(p => p.utilization > 0).sort((a, b) => b.utilization - a.utilization);
    XLSX.utils.book_append_sheet(wb, makeSheet("Utilization by Provider", "Sorted highest to lowest", utilSorted, utilCols), "Utilization");
    // Tab 6: Missing Notes (quantity)
    const mnCols = [
      { h: "#", w: 5, key: (_: ProviderData, i: number) => i + 1 },
      { h: "Provider", w: 28, key: (p: ProviderData) => p.name },
      { h: "Missing Notes", w: 14, key: (p: ProviderData) => p.missingNotes },
      { h: "Missing %", w: 11, key: (p: ProviderData) => +(p.missingNotesRate.toFixed(1)) },
      { h: "Missed Comp", w: 13, key: (p: ProviderData) => p.missedCompensation, fmt: NUM_FMT_DOLLAR },
    ];
    const mnSorted = [...providers].filter(p => p.missingNotes > 0).sort((a, b) => b.missingNotes - a.missingNotes);
    XLSX.utils.book_append_sheet(wb, makeSheet("Missing Notes by Provider", "Total missing notes quantity · Ranked highest to lowest", mnSorted, mnCols), "Missing Notes");

    XLSX.writeFile(wb, `Orenda_Provider_Performance_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Branded Excel exported with 6 tabs!");
  };

  // ─── Chart data ───────────────────────────────────────────────────────
  const utilizationData = useMemo(() =>
    [...providers].filter(p => p.utilization > 0)
      .sort((a, b) => b.utilization - a.utilization)
      .slice(0, 30)
      .map(p => ({
        name: p.name.length > 18 ? p.name.slice(0, 16) + "…" : p.name,
        fullName: p.name,
        utilization: +(p.utilization * 100).toFixed(1),
        tier: p.tier,
      })), [providers]);

  // Clean rate: worst to best (ascending)
  const cleanRateData = useMemo(() =>
    [...providers].filter(p => p.totalVolume > 0)
      .sort((a, b) => a.cleanRate - b.cleanRate)
      .slice(0, 30)
      .map(p => ({
        name: p.name.length > 18 ? p.name.slice(0, 16) + "…" : p.name,
        fullName: p.name,
        cleanRate: +(p.cleanRate * 100).toFixed(1),
        missingRate: +p.missingNotesRate.toFixed(1),
        tier: p.tier,
      })), [providers]);

  const missedCompData = useMemo(() =>
    [...providers].filter(p => p.missedCompensation > 0)
      .sort((a, b) => b.missedCompensation - a.missedCompensation)
      .slice(0, 20)
      .map(p => ({
        name: p.name.length > 18 ? p.name.slice(0, 16) + "…" : p.name,
        fullName: p.name,
        value: p.missedCompensation,
        notes: p.missingNotes,
      })), [providers]);

  const intakeFollowUpData = useMemo(() =>
    [...providers].filter(p => p.totalVolume > 0)
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .slice(0, 20)
      .map(p => ({
        name: p.name.length > 18 ? p.name.slice(0, 16) + "…" : p.name,
        fullName: p.name,
        intakes: p.intakeCount,
        followUps: p.followUpCount,
      })), [providers]);

  // Missing notes QUANTITY (not rate) — ranked highest to lowest
  const missingNotesQtyData = useMemo(() =>
    [...providers].filter(p => p.missingNotes > 0)
      .sort((a, b) => b.missingNotes - a.missingNotes)
      .slice(0, 25)
      .map(p => ({
        name: p.name.length > 18 ? p.name.slice(0, 16) + "…" : p.name,
        fullName: p.name,
        notes: p.missingNotes,
        rate: +p.missingNotesRate.toFixed(1),
        missedComp: p.missedCompensation,
      })), [providers]);

  // Follow-up ratio by provider (follow-ups / intakes) — for retention view
  const followUpRatioData = useMemo(() =>
    [...providers].filter(p => p.intakeCount > 0)
      .sort((a, b) => b.followUpRatio - a.followUpRatio)
      .slice(0, 25)
      .map(p => ({
        name: p.name.length > 18 ? p.name.slice(0, 16) + "…" : p.name,
        fullName: p.name,
        ratio: +(p.followUpRatio).toFixed(2),
        intakes: p.intakeCount,
        followUps: p.followUpCount,
        tenure: formatTenure(p.tenureDays),
      })), [providers]);

  // Chart refs for PNG download
  const chartRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const downloadChartPng = async (chartKey: string, filename: string) => {
    const el = chartRefs.current[chartKey];
    if (!el) { toast.error("Chart not found"); return; }
    try {
      const dataUrl = await toPng(el, { backgroundColor: "#ffffff", pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
      toast.success(`${filename}.png downloaded!`);
    } catch { toast.error("Failed to capture chart"); }
  };

  const scatterData = useMemo(() =>
    providers.filter(p => p.totalVolume > 0 && p.utilization > 0).map(p => ({
      x: p.totalVolume, y: +(p.cleanRate * 100).toFixed(1), z: p.utilization * 200, name: p.name, tier: p.tier,
    })), [providers]);

  const tierDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    providers.forEach(p => counts[p.tier] = (counts[p.tier] || 0) + 1);
    return Object.entries(counts).map(([key, value]) => ({
      name: key === "all-star" ? "⭐ All-Star" : key === "rising-star" ? "🌱 Rising Star" : key === "raise-candidate" ? "💰 Raise Candidate" :
        key === "high-missing-notes" ? "📝 High Missing Notes" : key === "low-utilization" ? "📉 Low Utilization" :
        key === "low-volume" ? "📊 Low Volume" : key === "inactive-check" ? "🔍 Verify Active" : "Standard",
      value, color: getTierColor(key), tier: key,
    })).filter(d => d.value > 0);
  }, [providers]);

  const tenurePerformance = useMemo(() => {
    const bins = [
      { label: "0-3mo", min: 0, max: 3 }, { label: "3-6mo", min: 3, max: 6 },
      { label: "6-12mo", min: 6, max: 12 }, { label: "12-24mo", min: 12, max: 24 }, { label: "24mo+", min: 24, max: 999 },
    ];
    return bins.map(b => {
      const group = providers.filter(p => p.tenureMonths >= b.min && p.tenureMonths < b.max);
      if (!group.length) return { label: b.label, util: 0, clean: 0, volume: 0, count: 0 };
      return {
        label: b.label,
        util: +(group.reduce((s, p) => s + p.utilization * 100, 0) / group.length).toFixed(1),
        clean: +(group.reduce((s, p) => s + p.cleanRate * 100, 0) / group.length).toFixed(1),
        volume: +(group.reduce((s, p) => s + p.totalVolume, 0) / group.length).toFixed(0),
        count: group.length,
      };
    });
  }, [providers]);

  const uniqueTiers = useMemo(() => {
    const tiers = new Set(providers.map(p => p.tier));
    return Array.from(tiers);
  }, [providers]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // ─── Upload screen ────────────────────────────────────────────────────
  if (!filesUploaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/50">
        <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
          <button onClick={() => navigate("/admin-v2")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Admin Console
          </button>
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium font-[Montserrat]">
              <BarChart3 className="w-4 h-4" /> Provider Performance Analytics
            </div>
            <h1 className="text-4xl font-bold font-[Cormorant_Garamond] text-foreground">Performance Dashboard</h1>
            <p className="text-muted-foreground font-[Montserrat] max-w-lg mx-auto">
              Upload your weekly reports to generate comprehensive performance analysis.
            </p>
          </div>
          <Card className="border-2 border-dashed border-purple-300 bg-white/80 backdrop-blur-sm">
            <CardContent className="py-12">
              <label className="cursor-pointer block text-center space-y-4">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shadow-lg shadow-purple-200">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold font-[Montserrat] text-foreground">Upload 3 Weekly Reports</p>
                  <p className="text-sm text-muted-foreground mt-1">Select all 3 files at once:</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs text-center max-w-md mx-auto">
                  {[
                    { icon: ClipboardList, label: "Missing Notes Report", sub: "(.xlsx)" },
                    { icon: Percent, label: "Utilization Report", sub: "(.xlsx / .csv)" },
                    { icon: Users, label: "Provider Start Date", sub: "(.xlsx)" },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                      <Icon className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="font-medium text-foreground">{label}</p>
                      <p className="text-muted-foreground">{sub}</p>
                    </div>
                  ))}
                </div>
                <input type="file" multiple accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
                <Button size="lg" className="bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 shadow-lg shadow-purple-200/50 mt-4">
                  {loading ? (
                    <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</span>
                  ) : (
                    <span className="flex items-center gap-2"><FileSpreadsheet className="w-4 h-4" /> Select Files</span>
                  )}
                </Button>
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // ─── Provider Detail Dialog ───────────────────────────────────────────
  const ProviderDetailDialog = () => {
    if (!selectedProvider) return null;
    const p = selectedProvider;
    return (
      <Dialog open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-[Cormorant_Garamond] flex items-center gap-2">
              {p.name}
              <Badge className={getTierBg(p.tier) + " text-[10px] border-0 ml-2"}>{p.tierLabel}</Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs font-[Montserrat]">
              {[
                { label: "Total Billable Appts", value: p.totalBillable },
                { label: "Overall Billable", value: p.overallBillable },
                { label: "Billable No-Shows", value: p.billableNoShow },
                { label: "Non-Billable No-Shows", value: p.nonBillableNoShow },
                { label: "Intakes", value: `${p.intakeCount} (${p.intakePercent.toFixed(1)}%)` },
                { label: "Follow-Ups", value: `${p.followUpCount} (${p.followUpPercent.toFixed(1)}%)` },
                { label: "Missing Notes", value: p.missingNotes },
                { label: "Missing Notes Rate", value: `${p.missingNotesRate.toFixed(1)}%` },
                { label: "Utilization", value: `${(p.utilization * 100).toFixed(1)}%` },
                { label: "Clean Rate", value: `${(p.cleanRate * 100).toFixed(1)}%` },
                { label: "Compensation", value: `$${p.compensation.toLocaleString()}` },
                { label: "Missed Compensation", value: `$${p.missedCompensation.toLocaleString()}` },
                { label: "Rate Schedule", value: p.rateSchedule || "—" },
                { label: "Licensed States", value: p.licensedStates || "—" },
                { label: "Start Date", value: p.startDate ? p.startDate.toLocaleDateString() : "—" },
                { label: "Tenure", value: formatTenure(p.tenureDays) },
              ].map(({ label, value }) => (
                <div key={label} className="p-2.5 rounded-lg bg-purple-50/60 border border-purple-100">
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                  <p className="font-semibold text-foreground text-sm">{value}</p>
                </div>
              ))}
            </div>
            {/* Mini radar chart for this provider */}
            <div className="flex justify-center">
              <ResponsiveContainer width={220} height={180}>
                <RadarChart data={[
                  { metric: "Utilization", value: Math.min(p.utilization * 100, 100) },
                  { metric: "Clean Rate", value: p.cleanRate * 100 },
                  { metric: "Volume", value: Math.min(p.totalVolume / 50 * 100, 100) },
                  { metric: "Follow-Up", value: Math.min(p.followUpRatio / 0.7 * 100, 100) },
                  { metric: "Tenure", value: Math.min(p.tenureMonths / 24 * 100, 100) },
                ]}>
                  <PolarGrid stroke="#e9e5f5" />
                  <PolarAngleAxis dataKey="metric" fontSize={9} />
                  <Radar dataKey="value" fill="#7c3aed" fillOpacity={0.3} stroke="#7c3aed" strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            {segmentDescriptions[p.tier] && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 font-[Montserrat]">
                <strong>Tier note:</strong> {segmentDescriptions[p.tier]}
              </div>
            )}
            {p.timecardUrl && (
              <a href={p.timecardUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-[Montserrat]">
                <ExternalLink className="w-3.5 h-3.5" /> View Timecard
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // ─── Segment Info Dialog ──────────────────────────────────────────────
  const SegmentInfoDialog = () => (
    <Dialog open={!!segmentInfo} onOpenChange={() => setSegmentInfo(null)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-[Cormorant_Garamond]">Segment Details</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground font-[Montserrat] leading-relaxed">
          {segmentInfo ? segmentDescriptions[segmentInfo] || "Standard performance tier." : ""}
        </p>
      </DialogContent>
    </Dialog>
  );

  // ─── Segment card helper ───────────────────────────────────────────────
  const SegmentCard = ({ title, icon: Icon, providers: segProviders, gradient, bgColor, textColor, criteria }: {
    title: string; icon: any; providers: ProviderData[]; gradient: string; bgColor: string; textColor: string; criteria: string[];
  }) => (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className={`h-1.5 ${gradient}`} />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-[Cormorant_Garamond] flex items-center gap-2">
          <Icon className={`w-5 h-5 ${textColor}`} /> {title}
          <Badge className={`${bgColor} ${textColor} border-0 text-xs ml-auto`}>{segProviders.length}</Badge>
        </CardTitle>
        <div className="flex flex-wrap gap-1 mt-1">
          {criteria.map(c => (
            <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-[Montserrat]">{c}</span>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {segProviders.length === 0 ? (
          <p className="text-xs text-muted-foreground p-6 text-center font-[Montserrat]">No providers qualify this period</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-[Montserrat]">
              <thead>
                <tr className={`${bgColor} border-b`}>
                  <th className="text-left p-3 font-semibold">#</th>
                  <th className="text-left p-3 font-semibold">Provider</th>
                  <th className="text-right p-3 font-semibold">Volume</th>
                  <th className="text-right p-3 font-semibold">Missing %</th>
                  <th className="text-right p-3 font-semibold">Utilization</th>
                  <th className="text-right p-3 font-semibold">Missed Comp</th>
                  <th className="text-right p-3 font-semibold">Rate</th>
                  <th className="text-right p-3 font-semibold">Tenure</th>
                </tr>
              </thead>
              <tbody>
                {segProviders.map((p, i) => (
                  <tr key={p.name} className="border-b border-muted/30 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedProvider(p)}>
                    <td className="p-3 text-muted-foreground">{i + 1}</td>
                    <td className="p-3 font-medium text-foreground flex items-center gap-1">{p.name} <Eye className="w-3 h-3 text-purple-400" /></td>
                    <td className="p-3 text-right font-semibold">{p.totalVolume}</td>
                    <td className={`p-3 text-right font-medium ${p.missingNotesRate < 1 ? "text-emerald-600" : p.missingNotesRate < 3 ? "text-amber-600" : "text-red-600"}`}>{p.missingNotesRate.toFixed(1)}%</td>
                    <td className="p-3 text-right">{(p.utilization * 100).toFixed(1)}%</td>
                    <td className="p-3 text-right text-red-600">${p.missedCompensation.toLocaleString()}</td>
                    <td className="p-3 text-right">{p.rateSchedule || "—"}</td>
                    <td className="p-3 text-right">{formatTenure(p.tenureDays)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // ─── Dashboard ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100/30">
      <ProviderDetailDialog />
      <SegmentInfoDialog />

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-purple-200/50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/admin-v2")} className="p-2 hover:bg-purple-50 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-bold font-[Cormorant_Garamond] text-foreground">Provider Performance</h1>
              <p className="text-xs text-muted-foreground font-[Montserrat]">
                {providers.length} providers · {payPeriod}
                {uploadedAt && <> · <span className="opacity-60">Last uploaded: {uploadedAt}</span></>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input ref={fileInputRef} type="file" multiple accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
            <Button variant="outline" size="sm" onClick={exportToExcel} className="text-purple-700 border-purple-200 hover:bg-purple-50">
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-3.5 h-3.5 mr-1.5" /> Update Reports
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-8">

        {/* ══════════════ TOTAL PROVIDER METRICS ══════════════ */}
        <section>
          <h2 className="text-2xl font-bold font-[Cormorant_Garamond] text-foreground mb-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" /> Total Provider Metrics
          </h2>
          <p className="text-sm text-muted-foreground font-[Montserrat] mb-4">
            Pay Period: <span className="font-semibold text-foreground">{payPeriod}</span>
            {stats ? <> &nbsp;·&nbsp; Intakes: <span className="font-medium">{stats.practiceIntakePercent.toFixed(1)}%</span> &nbsp;·&nbsp; Follow-Ups: <span className="font-medium">{stats.practiceFollowUpPercent.toFixed(1)}%</span></> : null}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { icon: Users, label: "Providers", value: providers.length, color: "from-purple-600 to-purple-400" },
              { icon: Star, label: "All-Stars", value: stats?.allStars.length || 0, color: "from-purple-700 to-purple-500" },
              { icon: TrendingUp, label: "Rising Stars", value: stats?.risingStars.length || 0, color: "from-emerald-600 to-emerald-400" },
              { icon: DollarSign, label: "Raise Candidates", value: stats?.raiseCandidates.length || 0, color: "from-blue-600 to-blue-400" },
              { icon: Activity, label: "Avg Utilization", value: `${((stats?.avgUtil || 0) * 100).toFixed(0)}%`, color: "from-indigo-600 to-indigo-400" },
              { icon: AlertTriangle, label: "Total Missing", value: stats?.totalMissing || 0, color: "from-amber-600 to-amber-400" },
              { icon: DollarSign, label: "Missed Revenue", value: `$${((stats?.totalMissedRev || 0) / 1000).toFixed(0)}K`, color: "from-red-500 to-red-400" },
            ].map(({ icon: Icon, label, value, color }) => (
              <Card key={label} className="relative overflow-hidden border-0 shadow-md">
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5`} />
                <CardContent className="p-4 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${color} shadow-sm`}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-[Montserrat]">{label}</span>
                  </div>
                  <p className="text-2xl font-bold font-[Montserrat] text-foreground">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Full ranked table */}
          <Card className="border-0 shadow-md overflow-hidden mt-4">
            <div className="h-1 bg-gradient-to-r from-purple-600 to-purple-300" />
            <CardHeader className="pb-2">
              <div className="text-center space-y-1">
                <CardTitle className="text-xl font-[Cormorant_Garamond] font-bold text-foreground">
                  All Providers — Ranked by Total Billable
                </CardTitle>
                <p className="text-xs text-muted-foreground font-[Montserrat]">{payPeriod} · Click any provider row for details</p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Animated scroll hint */}
              {showScrollHint && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100/80 via-purple-50 to-purple-100/80 border-b border-purple-100 text-[10px] text-purple-700 font-[Montserrat] animate-fade-in">
                  <span className="animate-[pulse_1.5s_ease-in-out_infinite]">👉</span>
                  <span>Scroll right to see all columns — provider name stays visible</span>
                  <span className="animate-[pulse_1.5s_ease-in-out_infinite]">👈</span>
                  <span className="ml-auto text-muted-foreground">Click headers to sort</span>
                </div>
              )}
              <div ref={scrollRef} className="overflow-x-auto">
                <table className="w-full text-xs font-[Montserrat]" style={{ minWidth: 1800 }}>
                  <thead>
                    <tr className="bg-purple-50/80 border-b border-purple-100">
                      <th className="text-left p-3 font-semibold text-foreground w-10 sticky left-0 bg-purple-50/95 z-10">#</th>
                      <th
                        className="text-left p-3 font-semibold text-foreground sticky left-10 bg-purple-50/95 z-10 cursor-pointer select-none hover:bg-purple-100/50 transition-colors whitespace-nowrap min-w-[180px] shadow-[2px_0_8px_-2px_rgba(124,58,237,0.15)]"
                        onClick={() => toggleSort("name")}
                      >
                        <span className="inline-flex items-center gap-1">
                          Provider
                          {sortCol === "name" ? (sortDir === "desc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />) : <ChevronDown className="w-3 h-3 opacity-20" />}
                        </span>
                      </th>
                      
                      <SortHeader col="totalBillable" label="Billable Appts" />
                      <SortHeader col="billableNoShow" label="Billable No-Shows" />
                      <SortHeader col="nonBillableNoShow" label="Non-Bill No-Shows" />
                      <SortHeader col="overallBillable" label="Overall Billable" />
                      <SortHeader col="intakeCount" label="Intakes" />
                      <SortHeader col="intakePercent" label="Intake %" />
                      <SortHeader col="followUpCount" label="Follow-Ups" />
                      <SortHeader col="followUpPercent" label="Follow-Up %" />
                      <SortHeader col="missingNotes" label="Missing Notes" />
                      <SortHeader col="missingNotesRate" label="Missing %" />
                      <SortHeader col="utilization" label="Utilization" />
                      <SortHeader col="compensation" label="Compensation" />
                      <SortHeader col="missedCompensation" label="Missed Comp" />
                      <SortHeader col="rateSchedule" label="Rate" />
                      <SortHeader col="licensedStates" label="Licensed States" />
                      <SortHeader col="startDate" label="Start Date" />
                      <SortHeader col="tenureDays" label="Tenure" />
                      <th className="text-center p-3 font-semibold text-foreground">Timecard</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedProviders.map((p, i) => (
                      <tr
                        key={p.name}
                        className={`border-b border-purple-50 hover:bg-purple-50/50 transition-colors cursor-pointer ${p.tier === "inactive-check" ? "opacity-60 bg-red-50/30" : ""}`}
                        onClick={() => setSelectedProvider(p)}
                      >
                        <td className="p-3 text-muted-foreground sticky left-0 bg-white/95 z-10">{i + 1}</td>
                        <td className="p-3 font-medium text-foreground whitespace-nowrap sticky left-10 bg-white/95 z-10 shadow-[2px_0_8px_-2px_rgba(124,58,237,0.08)] min-w-[180px]">
                          <span className="flex items-center gap-1.5">
                            {p.name}
                            <Eye className="w-3 h-3 text-purple-300 flex-shrink-0" />
                          </span>
                        </td>
                        
                        <td className="p-3 text-right font-semibold">{p.totalBillable}</td>
                        <td className="p-3 text-right">{p.billableNoShow}</td>
                        <td className="p-3 text-right">{p.nonBillableNoShow}</td>
                        <td className="p-3 text-right font-semibold">{p.overallBillable}</td>
                        <td className="p-3 text-right">{p.intakeCount}</td>
                        <td className="p-3 text-right">
                          <span className={p.intakePercent > (stats?.practiceIntakePercent || 0) ? "text-emerald-600 font-medium" : ""}>{p.intakePercent.toFixed(1)}%</span>
                        </td>
                        <td className="p-3 text-right">{p.followUpCount}</td>
                        <td className="p-3 text-right">
                          <span className={p.followUpPercent > (stats?.practiceFollowUpPercent || 0) ? "text-emerald-600 font-medium" : ""}>{p.followUpPercent.toFixed(1)}%</span>
                        </td>
                        <td className={`p-3 text-right font-medium ${p.missingNotes > 20 ? "text-red-600" : p.missingNotes > 10 ? "text-amber-600" : "text-emerald-600"}`}>{p.missingNotes}</td>
                        <td className={`p-3 text-right font-medium ${p.missingNotesRate < 1 ? "text-emerald-600" : p.missingNotesRate < 3 ? "text-amber-600" : "text-red-600"}`}>{p.missingNotesRate.toFixed(1)}%</td>
                        <td className="p-3 text-right">{(p.utilization * 100).toFixed(1)}%</td>
                        <td className="p-3 text-right">${p.compensation.toLocaleString()}</td>
                        <td className="p-3 text-right text-red-600 font-medium">${p.missedCompensation.toLocaleString()}</td>
                        <td className="p-3 text-right whitespace-nowrap">{p.rateSchedule || "—"}</td>
                        <td className="p-3 text-right whitespace-nowrap text-[10px]">{p.licensedStates || "—"}</td>
                        <td className="p-3 text-right whitespace-nowrap">{p.startDate ? p.startDate.toLocaleDateString() : "—"}</td>
                        <td className="p-3 text-right whitespace-nowrap">{formatTenure(p.tenureDays)}</td>
                        <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                          {p.timecardUrl ? (
                            <a href={p.timecardUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
                              <ExternalLink className="w-3.5 h-3.5 inline" />
                            </a>
                          ) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Expand/Collapse */}
              {filtered.length > 10 && (
                <div className="flex justify-center py-3 border-t border-purple-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTableExpanded(!tableExpanded)}
                    className="text-xs text-purple-700 hover:bg-purple-50 gap-1.5 font-[Montserrat]"
                  >
                    {tableExpanded ? (
                      <><ChevronUp className="w-3.5 h-3.5" /> Show Top 10</>
                    ) : (
                      <><ChevronDown className="w-3.5 h-3.5" /> Show All {filtered.length} Providers</>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ══════════════ ALL-STARS (Top 10) ══════════════ */}
        <SegmentCard
          title="⭐ All-Stars (Top 10)"
          icon={Star}
          providers={stats?.allStars || []}
          gradient="bg-gradient-to-r from-purple-700 via-purple-500 to-purple-300"
          bgColor="bg-purple-50"
          textColor="text-purple-700"
          criteria={["75th percentile volume", "< 1% missing notes rate", "Missed comp ≤ median", "Top 10 shown"]}
        />

        {/* ══════════════ RISING STARS ══════════════ */}
        <SegmentCard
          title="🌱 Rising Stars"
          icon={TrendingUp}
          providers={stats?.risingStars || []}
          gradient="bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-200"
          bgColor="bg-emerald-50"
          textColor="text-emerald-700"
          criteria={["< 120 days tenure", "60th percentile among new providers", "< 3% missing notes rate"]}
        />

        {/* ══════════════ RAISE CANDIDATES ══════════════ */}
        <SegmentCard
          title="💰 Raise Candidates"
          icon={Award}
          providers={stats?.raiseCandidates || []}
          gradient="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-200"
          bgColor="bg-blue-50"
          textColor="text-blue-700"
          criteria={["All-Star criteria met", "Base or Mid rate", "> 85% utilization", "> 6 months tenure"]}
        />

        {/* ══════════════ CHARTS ══════════════ */}
        <section>
          <h2 className="text-2xl font-bold font-[Cormorant_Garamond] text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" /> Visual Analytics
            <span className="text-[10px] text-muted-foreground ml-auto font-normal font-[Montserrat] flex items-center gap-1"><Camera className="w-3.5 h-3.5" /> Click camera icon to download chart as PNG</span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Utilization Chart */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-600 to-purple-400" />
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-[Montserrat] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600" /> Utilization by Provider
                  <span className="text-[10px] text-muted-foreground ml-auto font-normal">Highest → Lowest</span>
                  <button onClick={() => downloadChartPng("utilization", "Utilization_by_Provider")} className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors" title="Download as PNG"><Camera className="w-3.5 h-3.5 text-purple-500" /></button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={el => { chartRefs.current["utilization"] = el; }}>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={utilizationData} margin={{ bottom: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9e5f5" />
                      <XAxis dataKey="name" fontSize={8} angle={-55} textAnchor="end" interval={0} height={100} />
                      <YAxis fontSize={10} tickFormatter={v => `${v}%`} />
                      <ReTooltip content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (<div className="bg-white p-3 rounded-lg shadow-lg border text-xs font-[Montserrat]"><p className="font-semibold">{d.fullName}</p><p>Utilization: <strong>{d.utilization}%</strong></p></div>);
                      }} />
                      <Bar dataKey="utilization" radius={[4, 4, 0, 0]}>
                        {utilizationData.map((d, i) => (<Cell key={i} fill={getTierColor(d.tier)} fillOpacity={0.85} />))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Missing Notes Rate */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-red-500 to-amber-400" />
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-[Montserrat] flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-500" /> Missing Notes Rate
                  <span className="text-[10px] text-muted-foreground ml-auto font-normal">Worst → Best</span>
                  <button onClick={() => downloadChartPng("missingRate", "Missing_Notes_Rate")} className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors" title="Download as PNG"><Camera className="w-3.5 h-3.5 text-purple-500" /></button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={el => { chartRefs.current["missingRate"] = el; }}>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={cleanRateData} margin={{ bottom: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9e5f5" />
                      <XAxis dataKey="name" fontSize={8} angle={-55} textAnchor="end" interval={0} height={100} />
                      <YAxis fontSize={10} tickFormatter={v => `${v}%`} />
                      <ReTooltip content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (<div className="bg-white p-3 rounded-lg shadow-lg border text-xs font-[Montserrat]"><p className="font-semibold">{d.fullName}</p><p>Missing Notes Rate: <strong className={d.missingRate > 5 ? "text-red-600" : "text-emerald-600"}>{d.missingRate}%</strong></p><p>Clean Rate: {d.cleanRate}%</p></div>);
                      }} />
                      <Bar dataKey="missingRate" radius={[4, 4, 0, 0]}>
                        {cleanRateData.map((d, i) => (<Cell key={i} fill={d.missingRate > 10 ? "#ef4444" : d.missingRate > 3 ? "#f59e0b" : "#10b981"} fillOpacity={0.85} />))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* 🆕 Missing Notes QUANTITY */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-400" />
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-[Montserrat] flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-orange-600" /> Missing Notes — Total Count
                  <span className="text-[10px] text-muted-foreground ml-auto font-normal">Highest → Lowest</span>
                  <button onClick={() => downloadChartPng("missingQty", "Missing_Notes_Quantity")} className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors" title="Download as PNG"><Camera className="w-3.5 h-3.5 text-purple-500" /></button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={el => { chartRefs.current["missingQty"] = el; }}>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={missingNotesQtyData} margin={{ bottom: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9e5f5" />
                      <XAxis dataKey="name" fontSize={8} angle={-55} textAnchor="end" interval={0} height={100} />
                      <YAxis fontSize={10} />
                      <ReTooltip content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (<div className="bg-white p-3 rounded-lg shadow-lg border text-xs font-[Montserrat]"><p className="font-semibold">{d.fullName}</p><p>Missing Notes: <strong className="text-orange-600">{d.notes}</strong></p><p>Missing Rate: {d.rate}%</p><p>Missed Comp: <span className="text-red-600">${d.missedComp.toLocaleString()}</span></p></div>);
                      }} />
                      <Bar dataKey="notes" radius={[4, 4, 0, 0]}>
                        {missingNotesQtyData.map((d, i) => (<Cell key={i} fill={d.notes > 15 ? "#ef4444" : d.notes > 5 ? "#f59e0b" : "#10b981"} fillOpacity={0.85} />))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Missed Compensation */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-red-600 to-red-300" />
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-[Montserrat] flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-red-500" /> Missed Compensation by Provider
                  <span className="text-[10px] text-muted-foreground ml-auto font-normal">$85 × Missing Notes</span>
                  <button onClick={() => downloadChartPng("missedComp", "Missed_Compensation")} className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors" title="Download as PNG"><Camera className="w-3.5 h-3.5 text-purple-500" /></button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={el => { chartRefs.current["missedComp"] = el; }}>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={missedCompData} margin={{ bottom: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9e5f5" />
                      <XAxis dataKey="name" fontSize={8} angle={-55} textAnchor="end" interval={0} height={100} />
                      <YAxis fontSize={10} tickFormatter={v => `$${v}`} />
                      <ReTooltip content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (<div className="bg-white p-3 rounded-lg shadow-lg border text-xs font-[Montserrat]"><p className="font-semibold">{d.fullName}</p><p>Missed: <strong className="text-red-600">${d.value.toLocaleString()}</strong></p><p>Missing Notes: {d.notes}</p></div>);
                      }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#ef4444" fillOpacity={0.8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Intake vs Follow-Up */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-indigo-600 to-purple-400" />
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-[Montserrat] flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-600" /> Intake vs Follow-Up Volume
                  <button onClick={() => downloadChartPng("intakeFollowUp", "Intake_vs_FollowUp")} className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors ml-auto" title="Download as PNG"><Camera className="w-3.5 h-3.5 text-purple-500" /></button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={el => { chartRefs.current["intakeFollowUp"] = el; }}>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={intakeFollowUpData} margin={{ bottom: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9e5f5" />
                      <XAxis dataKey="name" fontSize={8} angle={-55} textAnchor="end" interval={0} height={100} />
                      <YAxis fontSize={10} />
                      <ReTooltip content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (<div className="bg-white p-3 rounded-lg shadow-lg border text-xs font-[Montserrat]"><p className="font-semibold">{d.fullName}</p><p>Intakes: {d.intakes}</p><p>Follow-Ups: {d.followUps}</p></div>);
                      }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontFamily: "Montserrat" }} />
                      <Bar dataKey="intakes" name="Intakes" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="followUps" name="Follow-Ups" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* 🆕 Follow-Up Ratio (Retention) */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-emerald-600 to-teal-400" />
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-[Montserrat] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" /> Follow-Up Ratio (Patient Retention)
                  <span className="text-[10px] text-muted-foreground ml-auto font-normal">Follow-Ups ÷ Intakes</span>
                  <button onClick={() => downloadChartPng("followUpRatio", "FollowUp_Ratio")} className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors" title="Download as PNG"><Camera className="w-3.5 h-3.5 text-purple-500" /></button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={el => { chartRefs.current["followUpRatio"] = el; }}>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={followUpRatioData} margin={{ bottom: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9e5f5" />
                      <XAxis dataKey="name" fontSize={8} angle={-55} textAnchor="end" interval={0} height={100} />
                      <YAxis fontSize={10} tickFormatter={v => `${v}x`} />
                      <ReTooltip content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (<div className="bg-white p-3 rounded-lg shadow-lg border text-xs font-[Montserrat]"><p className="font-semibold">{d.fullName}</p><p>Ratio: <strong className="text-emerald-600">{d.ratio}x</strong></p><p>Intakes: {d.intakes} · Follow-Ups: {d.followUps}</p><p>Tenure: {d.tenure}</p></div>);
                      }} />
                      <Bar dataKey="ratio" radius={[4, 4, 0, 0]}>
                        {followUpRatioData.map((d, i) => (<Cell key={i} fill={d.ratio >= 3 ? "#10b981" : d.ratio >= 1.5 ? "#6366f1" : "#f59e0b"} fillOpacity={0.85} />))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            {/* Volume vs Clean Rate Scatter */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-[Montserrat] flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-600" /> Volume vs Clean Rate
                  <button onClick={() => downloadChartPng("scatter", "Volume_vs_CleanRate")} className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors ml-auto" title="Download as PNG"><Camera className="w-3.5 h-3.5 text-purple-500" /></button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={el => { chartRefs.current["scatter"] = el; }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <ScatterChart margin={{ bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9e5f5" />
                      <XAxis type="number" dataKey="x" name="Volume" fontSize={10} label={{ value: "Volume", position: "bottom", fontSize: 10 }} />
                      <YAxis type="number" dataKey="y" name="Clean %" fontSize={10} label={{ value: "Clean %", angle: -90, position: "insideLeft", fontSize: 10 }} />
                      <ReTooltip content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (<div className="bg-white p-3 rounded-lg shadow-lg border text-xs font-[Montserrat]"><p className="font-semibold">{d.name}</p><p>Volume: {d.x} | Clean: {d.y}%</p></div>);
                      }} />
                      <Scatter data={scatterData}>
                        {scatterData.map((d, i) => (<Cell key={i} fill={getTierColor(d.tier)} fillOpacity={0.7} />))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tier Distribution */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-[Montserrat] flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" /> Provider Segmentation
                  <span className="text-[10px] text-muted-foreground ml-auto font-normal flex items-center gap-0.5"><Info className="w-3 h-3" /> Click labels</span>
                  <button onClick={() => downloadChartPng("segmentation", "Provider_Segmentation")} className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors" title="Download as PNG"><Camera className="w-3.5 h-3.5 text-purple-500" /></button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={el => { chartRefs.current["segmentation"] = el; }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={tierDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={45} paddingAngle={4} strokeWidth={2} stroke="#fff">
                        {tierDistribution.map((d, i) => (<Cell key={i} fill={d.color} cursor="pointer" onClick={() => setSegmentInfo(d.tier)} />))}
                      </Pie>
                      <ReTooltip formatter={(v: number) => [v, "Providers"]} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontFamily: "Montserrat", cursor: "pointer" }} onClick={(e: any) => { const entry = tierDistribution.find(d => d.name === e.value); if (entry) setSegmentInfo(entry.tier); }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tenure Performance */}
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-[Montserrat] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" /> Tenure vs Performance
                  <button onClick={() => downloadChartPng("tenure", "Tenure_vs_Performance")} className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors ml-auto" title="Download as PNG"><Camera className="w-3.5 h-3.5 text-purple-500" /></button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div ref={el => { chartRefs.current["tenure"] = el; }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={tenurePerformance} margin={{ bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9e5f5" />
                      <XAxis dataKey="label" fontSize={10} />
                      <YAxis fontSize={10} />
                      <ReTooltip content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        return (<div className="bg-white p-3 rounded-lg shadow-lg border text-xs font-[Montserrat]"><p className="font-semibold">{label} ({payload[0]?.payload?.count} providers)</p>{payload.map((p: any) => (<p key={p.name}>{p.name}: {p.value}{p.name !== "Avg Volume" ? "%" : ""}</p>))}</div>);
                      }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontFamily: "Montserrat" }} />
                      <Bar dataKey="util" name="Avg Util %" fill="#7c3aed" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="clean" name="Avg Clean %" fill="#10b981" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Executive Summary */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-purple-700 via-purple-500 to-purple-300" />
          <CardHeader>
            <CardTitle className="text-lg font-[Cormorant_Garamond] flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" /> Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-white border border-purple-100 space-y-2">
              <ul className="text-xs text-muted-foreground space-y-1.5 font-[Montserrat]">
                <li>• <strong className="text-foreground">{stats?.allStars.length || 0}</strong> All-Stars (Top 10 — 75th percentile volume, &lt;1% missing notes, low leakage)</li>
                <li>• <strong className="text-foreground">{stats?.risingStars.length || 0}</strong> Rising Stars (new providers &lt;120 days, strong ramp, &lt;3% missing)</li>
                <li>• <strong className="text-foreground">{stats?.raiseCandidates.length || 0}</strong> Raise Candidates (All-Stars w/ base/mid rate, &gt;85% util, &gt;6mo)</li>
                <li>• Average utilization: <strong className="text-foreground">{((stats?.avgUtil || 0) * 100).toFixed(1)}%</strong></li>
                <li>• Total missing notes: <strong className="text-foreground">{stats?.totalMissing || 0}</strong> — Estimated missed revenue: <strong className="text-red-600">${(stats?.totalMissedRev || 0).toLocaleString()}</strong></li>
                <li>• Providers with high missing notes (&gt;15 or &gt;40%): <strong className="text-amber-600">{providers.filter(p => p.tier === "high-missing-notes").length}</strong></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
