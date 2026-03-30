import { useState, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import NJNavbar from "@/components/NJNavbar";
import { Upload, ArrowUpDown, ArrowUp, ArrowDown, Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import * as XLSX from "xlsx-js-style";

interface ProviderRow {
  name: string;
  totalBillableAppointments: number;
  billableNoShows: number;
  nonBillableNoShows: number;
  overallTotalBillable: number;
  intakeCount: number;
  followUpCount: number;
  totalCompensation: number;
  missingNotes: number;
  missedCompensation: number;
  missingNotesPercent: number;
  rateSchedule: string;
  licensedStates: string;
  utilization: number;
  startDate: string;
  tenureDays: number;
  timecardUrl: string;
}

type SortKey = keyof ProviderRow;

function parseDate(v: any): string {
  if (!v) return "";
  if (v instanceof Date) return v.toISOString().split("T")[0];
  if (typeof v === "number") {
    const d = new Date(Math.round((v - 25569) * 86400 * 1000));
    return d.toISOString().split("T")[0];
  }
  const s = String(v);
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toISOString().split("T")[0];
}

function daysBetween(dateStr: string): number {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 0;
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function num(v: any): number {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, "").trim();
}

function matchProviderName(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}

function processFiles(
  missingNotesData: any[][],
  utilizationData: any[][],
  startDateData: any[][]
): ProviderRow[] {
  // --- Missing Notes (TimecardFact sheet, row 0 = header) ---
  const mnHeader = missingNotesData[0];
  const colIdx = (header: any[], name: string) =>
    header.findIndex((h) => String(h).toLowerCase().includes(name.toLowerCase()));

  const iName = colIdx(mnHeader, "Provider Name");
  const iMissing = colIdx(mnHeader, "Missing / Incomplete");
  const iBillable = colIdx(mnHeader, "Total Billable Appointments");
  const iBillableNS = colIdx(mnHeader, "Billable No-Show");
  const iNonBillNS = colIdx(mnHeader, "Non-Billable No-Show");
  const iOverall = colIdx(mnHeader, "Overall Total Billable");
  const iIntake = colIdx(mnHeader, "Intake Count");
  const iFollowUp = colIdx(mnHeader, "Follow-Up Count");
  const iComp = colIdx(mnHeader, "Compensation");
  const iUrl = colIdx(mnHeader, "File URL");

  const providers = new Map<string, ProviderRow>();

  for (let r = 1; r < missingNotesData.length; r++) {
    const row = missingNotesData[r];
    const name = String(row[iName] || "").trim();
    if (!name) continue;

    const missing = num(row[iMissing]);
    const billable = num(row[iBillable]);
    const totalVolume = billable + missing;

    providers.set(normalize(name), {
      name,
      totalBillableAppointments: billable,
      billableNoShows: num(row[iBillableNS]),
      nonBillableNoShows: num(row[iNonBillNS]),
      overallTotalBillable: num(row[iOverall]),
      intakeCount: num(row[iIntake]),
      followUpCount: num(row[iFollowUp]),
      totalCompensation: num(row[iComp]),
      missingNotes: missing,
      missedCompensation: missing * 85,
      missingNotesPercent: totalVolume > 0 ? (missing / totalVolume) * 100 : 0,
      rateSchedule: "",
      licensedStates: "",
      utilization: 0,
      startDate: "",
      tenureDays: 0,
      timecardUrl: String(row[iUrl] || ""),
    });
  }

  // --- Utilization (row 0 = header with "Provider Full Name", last 3 cols = Week Total) ---
  const uHeader = utilizationData[0];
  const uNameIdx = uHeader.findIndex((h: any) =>
    String(h).toLowerCase().includes("provider full name") || String(h).toLowerCase().includes("full name")
  );
  // Utilization % is the last column
  const uUtilIdx = uHeader.length - 1;

  for (let r = 1; r < utilizationData.length; r++) {
    const row = utilizationData[r];
    const name = String(row[uNameIdx >= 0 ? uNameIdx : 1] || "").trim();
    if (!name) continue;
    const key = normalize(name);
    const entry = providers.get(key);
    if (entry) {
      const rawUtil = num(row[uUtilIdx]);
      entry.utilization = rawUtil > 1 ? rawUtil : rawUtil * 100;
    }
  }

  // --- Start Date (row 2 = header) ---
  // Col 2=Clinician_Name, 3=Rate schedule, 4=First Appt, 6=Licensed states
  for (let r = 3; r < startDateData.length; r++) {
    const row = startDateData[r];
    const name = String(row[2] || "").trim();
    if (!name) continue;
    const key = normalize(name);
    const entry = providers.get(key);
    if (entry) {
      entry.rateSchedule = String(row[3] || "");
      entry.startDate = parseDate(row[4]);
      entry.tenureDays = daysBetween(entry.startDate);
      entry.licensedStates = String(row[6] || "");
    }
  }

  return Array.from(providers.values());
}

function readSheet(wb: XLSX.WorkBook, name: string): any[][] {
  const ws = wb.Sheets[name];
  if (!ws) return [];
  return XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
}

export default function ProviderMetricsTable() {
  const [data, setData] = useState<ProviderRow[]>([]);
  const [missingFile, setMissingFile] = useState<File | null>(null);
  const [utilFile, setUtilFile] = useState<File | null>(null);
  const [startFile, setStartFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("totalBillableAppointments");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [rateFilter, setRateFilter] = useState("all");

  const handleProcess = useCallback(async () => {
    if (!missingFile || !utilFile || !startFile) return;
    setLoading(true);
    try {
      const readFile = (f: File) =>
        new Promise<ArrayBuffer>((res) => {
          const reader = new FileReader();
          reader.onload = (e) => res(e.target!.result as ArrayBuffer);
          reader.readAsArrayBuffer(f);
        });

      const [mnBuf, uBuf, sBuf] = await Promise.all([
        readFile(missingFile),
        readFile(utilFile),
        readFile(startFile),
      ]);

      const mnWb = XLSX.read(mnBuf, { type: "array" });
      const uWb = XLSX.read(uBuf, { type: "array" });
      const sWb = XLSX.read(sBuf, { type: "array" });

      // TimecardFact sheet from missing notes
      const tcSheet = mnWb.SheetNames.find((n) => n.toLowerCase().includes("timecardfact")) || mnWb.SheetNames[0];
      const mnData = readSheet(mnWb, tcSheet);
      const uData = readSheet(uWb, uWb.SheetNames[0]);
      const sData = readSheet(sWb, sWb.SheetNames[0]);

      const rows = processFiles(mnData, uData, sData);
      setData(rows);
    } catch (err) {
      console.error("Error processing files:", err);
    } finally {
      setLoading(false);
    }
  }, [missingFile, utilFile, startFile]);

  const rateSchedules = useMemo(() => {
    const set = new Set(data.map((d) => d.rateSchedule).filter(Boolean));
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search) {
      const s = search.toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(s));
    }
    if (rateFilter !== "all") {
      rows = rows.filter((r) => r.rateSchedule === rateFilter);
    }
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return rows;
  }, [data, search, rateFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="w-3 h-3 ml-1 text-primary" /> : <ArrowDown className="w-3 h-3 ml-1 text-primary" />;
  };

  const exportCsv = () => {
    if (!filtered.length) return;
    const headers = [
      "Rank", "Provider", "Total Billable Appts", "Billable No-Shows", "Non-Billable No-Shows",
      "Overall Total Billable", "Intake Count", "Follow-Up Count", "Total Compensation",
      "Missing Notes", "Missed Compensation", "Missing Notes %", "Rate Schedule",
      "Licensed States", "Utilization %", "Start Date", "Tenure (Days)",
    ];
    const csvRows = [headers.join(",")];
    filtered.forEach((r, i) => {
      csvRows.push([
        i + 1, `"${r.name}"`, r.totalBillableAppointments, r.billableNoShows, r.nonBillableNoShows,
        r.overallTotalBillable, r.intakeCount, r.followUpCount, r.totalCompensation,
        r.missingNotes, r.missedCompensation, r.missingNotesPercent.toFixed(1),
        `"${r.rateSchedule}"`, `"${r.licensedStates}"`, r.utilization.toFixed(1),
        r.startDate, r.tenureDays,
      ].join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "provider_metrics.csv";
    a.click();
  };

  const fmt = (n: number) => n.toLocaleString();
  const fmtDollar = (n: number) => `$${n.toLocaleString()}`;
  const fmtPct = (n: number) => `${n.toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Provider Metrics — Orenda Psychiatry NJ</title>
      </Helmet>
      <NJNavbar />

      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(270,100%,12%) 0%, hsl(270,80%,25%) 50%, hsl(270,60%,40%) 100%)",
        }}
      >
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-metrics" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-metrics)" />
        </svg>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 py-6 sm:py-14">
          <h1 className="font-display text-2xl sm:text-5xl font-bold text-white tracking-tight">
            Provider Metrics
          </h1>
          <p className="text-xs sm:text-lg text-white/70 mt-1.5 sm:mt-3 max-w-xl font-medium leading-relaxed">
            Ranked provider performance data — sortable &amp; filterable.
          </p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* Upload section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border-2 border-dashed border-primary/20 bg-card p-5 sm:p-6"
        >
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" /> Upload Weekly Reports
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Missing Notes Report</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setMissingFile(e.target.files?.[0] || null)}
                className="block w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
              {missingFile && <p className="text-[10px] text-primary mt-1 truncate">✓ {missingFile.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Utilization Report</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setUtilFile(e.target.files?.[0] || null)}
                className="block w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
              {utilFile && <p className="text-[10px] text-primary mt-1 truncate">✓ {utilFile.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Provider Start Date Report</label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setStartFile(e.target.files?.[0] || null)}
                className="block w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
              />
              {startFile && <p className="text-[10px] text-primary mt-1 truncate">✓ {startFile.name}</p>}
            </div>
          </div>
          <Button
            onClick={handleProcess}
            disabled={!missingFile || !utilFile || !startFile || loading}
            className="mt-4"
          >
            {loading ? "Processing…" : "Process Reports"}
          </Button>
        </motion.div>

        {/* Filters & controls */}
        {data.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
          >
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search provider…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={rateFilter} onValueChange={setRateFilter}>
                <SelectTrigger className="w-[180px] h-9 text-xs">
                  <SelectValue placeholder="Rate Schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rate Schedules</SelectItem>
                  {rateSchedules.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </Button>
            <span className="text-xs text-muted-foreground ml-auto">
              {filtered.length} provider{filtered.length !== 1 ? "s" : ""}
            </span>
          </motion.div>
        )}

        {/* Table */}
        {data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-10 text-center text-[10px] font-bold">#</TableHead>
                    {([
                      ["name", "Provider"],
                      ["totalBillableAppointments", "Billable Appts"],
                      ["billableNoShows", "Billable No-Shows"],
                      ["nonBillableNoShows", "Non-Bill No-Shows"],
                      ["overallTotalBillable", "Overall Billable"],
                      ["intakeCount", "Intakes"],
                      ["followUpCount", "Follow-Ups"],
                      ["totalCompensation", "Compensation"],
                      ["missingNotes", "Missing Notes"],
                      ["missedCompensation", "Missed Comp"],
                      ["missingNotesPercent", "Missing %"],
                      ["rateSchedule", "Rate Schedule"],
                      ["licensedStates", "Licensed States"],
                      ["utilization", "Utilization %"],
                      ["startDate", "Start Date"],
                      ["tenureDays", "Tenure (Days)"],
                    ] as [SortKey, string][]).map(([key, label]) => (
                      <TableHead
                        key={key}
                        className="text-[10px] font-bold cursor-pointer select-none whitespace-nowrap hover:text-primary transition-colors"
                        onClick={() => toggleSort(key)}
                      >
                        <span className="inline-flex items-center">
                          {label}
                          <SortIcon col={key} />
                        </span>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((row, i) => (
                    <TableRow key={row.name} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="text-center text-xs font-bold text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-semibold text-xs whitespace-nowrap">
                        {row.timecardUrl ? (
                          <a href={row.timecardUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {row.name}
                          </a>
                        ) : row.name}
                      </TableCell>
                      <TableCell className="text-xs text-center font-medium">{fmt(row.totalBillableAppointments)}</TableCell>
                      <TableCell className="text-xs text-center">{fmt(row.billableNoShows)}</TableCell>
                      <TableCell className="text-xs text-center">{fmt(row.nonBillableNoShows)}</TableCell>
                      <TableCell className="text-xs text-center font-medium">{fmt(row.overallTotalBillable)}</TableCell>
                      <TableCell className="text-xs text-center">{fmt(row.intakeCount)}</TableCell>
                      <TableCell className="text-xs text-center">{fmt(row.followUpCount)}</TableCell>
                      <TableCell className="text-xs text-right font-medium">{fmtDollar(row.totalCompensation)}</TableCell>
                      <TableCell className={`text-xs text-center font-medium ${row.missingNotes > 10 ? "text-destructive" : ""}`}>
                        {fmt(row.missingNotes)}
                      </TableCell>
                      <TableCell className={`text-xs text-right ${row.missedCompensation > 0 ? "text-destructive font-medium" : ""}`}>
                        {fmtDollar(row.missedCompensation)}
                      </TableCell>
                      <TableCell className={`text-xs text-center ${row.missingNotesPercent > 50 ? "text-destructive font-bold" : ""}`}>
                        {fmtPct(row.missingNotesPercent)}
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap">{row.rateSchedule}</TableCell>
                      <TableCell className="text-xs whitespace-nowrap">{row.licensedStates}</TableCell>
                      <TableCell className="text-xs text-center font-medium">{fmtPct(row.utilization)}</TableCell>
                      <TableCell className="text-xs whitespace-nowrap">{row.startDate}</TableCell>
                      <TableCell className="text-xs text-center">{fmt(row.tenureDays)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {data.length === 0 && !loading && (
          <div className="text-center py-20 text-muted-foreground text-sm">
            Upload all three reports above to generate the provider metrics table.
          </div>
        )}
      </div>
    </div>
  );
}
