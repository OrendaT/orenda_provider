import { useState, useMemo, forwardRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Users, AlertTriangle, CheckCircle2, UserPlus,
  Download, Calendar, MapPin, Clock, Bell, Shield,
  Loader2, X, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import NJNavbar from "@/components/NJNavbar";
import logo from "@/assets/orenda-logo-purple.png";
import * as XLSX from "xlsx-js-style";
import { format, isAfter, startOfDay, addDays, isBefore } from "date-fns";

const EXCLUDED_NAMES = ["tim", "teddy", "kim", "susie", "anastasia", "ted", "progress"];

// Parse date-only strings (YYYY-MM-DD) as local time to avoid UTC timezone shift
const parseLocalDate = (dateStr: string) => new Date(dateStr + "T00:00:00");

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.04, ease: "easeOut" as const },
  }),
};

const P = {
  DEEP: "2D1B4E", DARK: "462D6D", MED: "6B4FA0",
  SNOW: "F8F6FB", WHITE: "FFFFFF", TEXT: "1A1A2E",
  BORDER: "D4CCE6", WASH: "E8E0F0", LAVEN: "F5F3FF",
  RED: "DC2626", RED_BG: "FEF2F2", GREEN: "16A34A", GREEN_BG: "F0FDF4",
  AMBER: "D97706", AMBER_BG: "FFFBEB",
};

const bdr = (color = P.BORDER): any => ({
  top: { style: "thin" as const, color: { rgb: color } },
  bottom: { style: "thin" as const, color: { rgb: color } },
  left: { style: "thin" as const, color: { rgb: color } },
  right: { style: "thin" as const, color: { rgb: color } },
});

type TimeRange = "upcoming" | "next7" | "next14" | "next30" | "all";

// Wrap motion.div in forwardRef to fix AnimatePresence ref warnings
const MotionDiv = forwardRef<HTMLDivElement, React.ComponentProps<typeof motion.div>>((props, ref) => (
  <motion.div ref={ref} {...props} />
));
MotionDiv.displayName = "MotionDiv";

export default function AdminV2Staffing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [timeRange, setTimeRange] = useState<TimeRange>("next14");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [showManageStaff, setShowManageStaff] = useState(false);

  // Fetch eligible admin staff from admin_permissions (only staffing_assignable ones)
  const { data: adminStaff = [] } = useQuery({
    queryKey: ["staffing-admin-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_permissions")
        .select("provider_name, staffing_assignable")
        .eq("has_admin_access", true);
      if (error) throw error;
      return (data || [])
        .filter((a: any) => a.staffing_assignable === true)
        .map((a: any) => a.provider_name)
        .filter((name: string) => !EXCLUDED_NAMES.some((ex) => name.toLowerCase().includes(ex)));
    },
  });

  // Fetch all admins for the manage panel
  const { data: allAdmins = [] } = useQuery({
    queryKey: ["staffing-all-admins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_permissions")
        .select("id, provider_name, staffing_assignable, email")
        .eq("has_admin_access", true);
      if (error) throw error;
      return (data || []).filter((a: any) => !EXCLUDED_NAMES.some((ex) => a.provider_name.toLowerCase().includes(ex)));
    },
  });

  // Toggle staffing_assignable
  const toggleAssignable = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase
        .from("admin_permissions")
        .update({ staffing_assignable: value } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffing-admin-list"] });
      queryClient.invalidateQueries({ queryKey: ["staffing-all-admins"] });
      toast({ title: "Staffing assignment updated" });
    },
    onError: (err: any) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  // Fetch bookings with staffing data
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["staffing-bookings"],
    queryFn: async () => {
      const { data: allBookings, error: bErr } = await supabase
        .from("office_bookings")
        .select("*")
        .eq("status", "confirmed")
        .order("booking_date", { ascending: true });
      if (bErr) throw bErr;

      const { data: staffing, error: sErr } = await supabase
        .from("admin_staffing")
        .select("*");
      if (sErr) throw sErr;

      const staffMap = new Map((staffing || []).map((s: any) => [s.booking_id, s]));

      return (allBookings || []).map((b: any) => ({
        ...b,
        staffing: staffMap.get(b.id) || null,
      }));
    },
  });

  // Assign admin mutation
  const assignAdmin = useMutation({
    mutationFn: async ({ bookingId, adminName }: { bookingId: string; adminName: string }) => {
      // Check if staffing record exists
      const { data: existing } = await supabase
        .from("admin_staffing")
        .select("id")
        .eq("booking_id", bookingId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("admin_staffing")
          .update({
            admin_name: adminName,
            is_staffed: true,
            staffed_at: new Date().toISOString(),
            staffed_by: adminName,
          })
          .eq("booking_id", bookingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("admin_staffing")
          .insert({
            booking_id: bookingId,
            admin_name: adminName,
            is_staffed: true,
            staffed_at: new Date().toISOString(),
            staffed_by: adminName,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffing-bookings"] });
      setAssigningId(null);
      setSelectedAdmin("");
      toast({ title: "Admin assigned successfully" });
    },
    onError: (err: any) => toast({ title: "Failed to assign", description: err.message, variant: "destructive" }),
  });

  // Unassign mutation
  const unassignAdmin = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from("admin_staffing")
        .update({ admin_name: null, is_staffed: false, staffed_at: null, staffed_by: null })
        .eq("booking_id", bookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffing-bookings"] });
      toast({ title: "Admin unassigned" });
    },
  });

  // Filter by time range
  const today = startOfDay(new Date());
  const filtered = useMemo(() => {
    return bookings.filter((b: any) => {
      const d = parseLocalDate(b.booking_date);
      if (isBefore(d, today) && timeRange !== "all") return false;
      switch (timeRange) {
        case "upcoming": return isAfter(d, today) || d.getTime() === today.getTime();
        case "next7": return isBefore(d, addDays(today, 7)) || d.getTime() === today.getTime();
        case "next14": return isBefore(d, addDays(today, 14)) || d.getTime() === today.getTime();
        case "next30": return isBefore(d, addDays(today, 30)) || d.getTime() === today.getTime();
        default: return true;
      }
    });
  }, [bookings, timeRange, today]);

  const unstaffedCount = filtered.filter((b: any) => !b.staffing?.is_staffed).length;
  const staffedCount = filtered.filter((b: any) => b.staffing?.is_staffed).length;

  // Time block label
  const timeLabel = (tb: string) => {
    switch (tb) {
      case "morning": return "Morning (9a–3p)";
      case "afternoon": return "Afternoon (3p–9p)";
      case "full_day": return "Full Day (9a–9p)";
      default: return tb;
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const rows: any[][] = [];

    rows.push(["ORENDA PSYCHIATRY"]);
    rows.push(["Admin Staffing Report"]);
    rows.push([`Generated: ${format(new Date(), "MMM d, yyyy h:mm a")}`]);
    rows.push([]);
    rows.push(["Date", "Provider", "Location", "Time Block", "Status", "Assigned Admin", "Assigned At"]);

    filtered.forEach((b: any) => {
      rows.push([
        format(parseLocalDate(b.booking_date), "MMM d, yyyy"),
        b.provider_name,
        b.office_location.charAt(0).toUpperCase() + b.office_location.slice(1),
        timeLabel(b.time_block),
        b.staffing?.is_staffed ? "Staffed" : "UNSTAFFED",
        b.staffing?.admin_name || "—",
        b.staffing?.staffed_at ? format(new Date(b.staffing.staffed_at), "MMM d, h:mm a") : "—",
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [
      { wch: 16 }, { wch: 22 }, { wch: 14 }, { wch: 22 }, { wch: 14 }, { wch: 18 }, { wch: 20 },
    ];
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } },
    ];

    const headerFont = { name: "Arial", bold: true, color: { rgb: P.WHITE } };
    const headerFill = { fgColor: { rgb: P.DEEP } };

    for (let c = 0; c <= 6; c++) {
      const r0 = XLSX.utils.encode_cell({ r: 0, c });
      const r1 = XLSX.utils.encode_cell({ r: 1, c });
      const r2 = XLSX.utils.encode_cell({ r: 2, c });
      if (ws[r0]) ws[r0].s = { font: { ...headerFont, sz: 16 }, fill: { type: "pattern", patternType: "solid", ...headerFill }, alignment: { horizontal: "center", vertical: "center" }, border: bdr(P.DEEP) };
      if (ws[r1]) ws[r1].s = { font: { ...headerFont, sz: 12 }, fill: { type: "pattern", patternType: "solid", ...headerFill }, alignment: { horizontal: "center" }, border: bdr(P.DEEP) };
      if (ws[r2]) ws[r2].s = { font: { name: "Arial", color: { rgb: P.WHITE }, sz: 9 }, fill: { type: "pattern", patternType: "solid", ...headerFill }, alignment: { horizontal: "center" }, border: bdr(P.DEEP) };
    }

    for (let c = 0; c <= 6; c++) {
      const cell = XLSX.utils.encode_cell({ r: 4, c });
      if (ws[cell]) {
        ws[cell].s = {
          font: { name: "Arial", bold: true, color: { rgb: P.WHITE }, sz: 10 },
          fill: { type: "pattern", patternType: "solid", fgColor: { rgb: P.DARK } },
          alignment: { horizontal: "center", vertical: "center" },
          border: bdr(P.DARK),
        };
      }
    }

    for (let r = 5; r < rows.length; r++) {
      const isUnstaffed = rows[r][4] === "UNSTAFFED";
      for (let c = 0; c <= 6; c++) {
        const cell = XLSX.utils.encode_cell({ r, c });
        if (ws[cell]) {
          ws[cell].s = {
            font: {
              name: "Arial", sz: 10,
              color: { rgb: isUnstaffed ? P.RED : P.TEXT },
              bold: isUnstaffed && c === 4,
            },
            fill: {
              type: "pattern", patternType: "solid",
              fgColor: { rgb: isUnstaffed ? P.RED_BG : (r % 2 === 0 ? P.LAVEN : P.WHITE) },
            },
            alignment: { horizontal: c === 1 ? "left" : "center", vertical: "center" },
            border: bdr(),
          };
        }
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Staffing Report");
    XLSX.writeFile(wb, `Orenda_Staffing_Report_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast({ title: "Excel report downloaded" });
  };

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: "next7", label: "Next 7 Days" },
    { value: "next14", label: "Next 14 Days" },
    { value: "next30", label: "Next 30 Days" },
    { value: "all", label: "All Bookings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Staffing Management — Orenda NJ Admin</title>
      </Helmet>
      <NJNavbar />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(270, 100%, 12%) 0%, hsl(280, 70%, 28%) 50%, hsl(320, 50%, 35%) 100%)" }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1" fill="white" /></pattern></defs>
          <rect fill="url(#dots)" width="100%" height="100%" />
        </svg>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Link to="/admin-v2" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-xs tracking-widest uppercase mb-4 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Admin Console
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <Shield className="w-7 h-7 text-white/70" />
                Staffing Management
              </h1>
              <p className="text-white/50 mt-1 text-sm">Ensure every provider booking has admin coverage</p>
            </div>
            <img src={logo} alt="Orenda" className="h-6 brightness-0 invert opacity-40 hidden sm:block" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="rounded-xl border-2 border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{filtered.length}</p>
          </div>
          <div className="rounded-xl border-2 border-[hsl(160,60%,80%)] bg-[hsl(160,60%,97%)] p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-[hsl(160,60%,35%)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[hsl(160,30%,40%)]">Staffed</span>
            </div>
            <p className="text-2xl font-bold text-[hsl(160,60%,25%)]">{staffedCount}</p>
          </div>
          <div className={`rounded-xl border-2 p-4 ${unstaffedCount > 0 ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"}`}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className={`w-4 h-4 ${unstaffedCount > 0 ? "text-destructive" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${unstaffedCount > 0 ? "text-destructive/70" : "text-muted-foreground"}`}>Unstaffed</span>
            </div>
            <p className={`text-2xl font-bold ${unstaffedCount > 0 ? "text-destructive" : "text-foreground"}`}>{unstaffedCount}</p>
          </div>
          <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Coverage</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {filtered.length > 0 ? Math.round((staffedCount / filtered.length) * 100) : 100}%
            </p>
          </div>
        </motion.div>

        {/* Alert Banner */}
        {unstaffedCount > 0 && (
          <div className="mb-6 rounded-xl border-2 border-destructive/30 bg-destructive/5 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-destructive animate-pulse" />
              <span className="font-bold text-destructive text-sm">
                {unstaffedCount} booking{unstaffedCount !== 1 ? "s" : ""} need{unstaffedCount === 1 ? "s" : ""} admin coverage
              </span>
            </div>
            <p className="text-xs text-destructive/70">Assign an admin staff member to ensure operational readiness.</p>
          </div>
        )}

        {/* Controls */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {timeRanges.map((tr) => (
              <button key={tr.value} onClick={() => setTimeRange(tr.value)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === tr.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}>
                {tr.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowManageStaff(!showManageStaff)}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border-2 transition-all ${showManageStaff ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
              <Users className="w-3.5 h-3.5" /> Manage Assignable Staff
            </button>
            <button onClick={exportToExcel}
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border-2 border-primary/20 text-primary hover:bg-primary/5 transition-all">
              <Download className="w-3.5 h-3.5" /> Export Excel
            </button>
          </div>
        </motion.div>

        {/* Manage Assignable Staff Panel */}
        <AnimatePresence>
          {showManageStaff && (
            <MotionDiv initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">Assignable Staff</span>
                  <span className="text-xs text-muted-foreground">— Toggle which admins can be assigned to bookings</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allAdmins.map((admin: any) => (
                    <div key={admin.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-card border border-border">
                      <span className="text-sm font-medium text-foreground">{admin.provider_name}</span>
                      <button
                        onClick={() => toggleAssignable.mutate({ id: admin.id, value: !admin.staffing_assignable })}
                        className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-all ${
                          admin.staffing_assignable
                            ? "bg-[hsl(160,60%,92%)] text-[hsl(160,60%,30%)] border border-[hsl(160,50%,80%)]"
                            : "bg-secondary text-muted-foreground border border-border"
                        }`}>
                        {admin.staffing_assignable ? "✓ Assignable" : "Not Assignable"}
                      </button>
                    </div>
                  ))}
                  {allAdmins.length === 0 && (
                    <p className="text-xs text-muted-foreground col-span-2">No admins found. Add admins from the Master Directory.</p>
                  )}
                </div>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>


        {/* Booking List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <CheckCircle2 className="w-10 h-10 text-[hsl(160,60%,45%)] mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No bookings in this time range</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b: any, idx: number) => {
              const isStaffed = b.staffing?.is_staffed;
              const isPast = isBefore(parseLocalDate(b.booking_date), today);
              const isAssigning = assigningId === b.id;

              return (
                <motion.div key={b.id} variants={fadeUp} initial="hidden" animate="visible" custom={idx * 0.5}
                  className={`rounded-xl border-2 transition-all ${
                    isStaffed
                      ? "border-[hsl(160,50%,80%)] bg-card"
                      : isPast
                        ? "border-muted bg-muted/30"
                        : "border-destructive/25 bg-destructive/[0.02]"
                  }`}>
                  <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    {/* Status indicator */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isStaffed
                        ? "bg-[hsl(160,60%,92%)] text-[hsl(160,60%,30%)]"
                        : "bg-destructive/10 text-destructive"
                    }`}>
                      {isStaffed ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>

                    {/* Booking info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-foreground text-sm">{b.provider_name}</span>
                        {isPast && (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-0.5 rounded">Past</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(parseLocalDate(b.booking_date), "EEE, MMM d")}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeLabel(b.time_block)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {b.office_location.charAt(0).toUpperCase() + b.office_location.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Assignment area */}
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      {isStaffed ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[hsl(160,60%,95%)] border border-[hsl(160,50%,85%)]">
                            <div className="w-6 h-6 rounded-full bg-[hsl(160,60%,35%)] text-white flex items-center justify-center text-[10px] font-bold">
                              {b.staffing.admin_name?.charAt(0)}
                            </div>
                            <span className="text-xs font-bold text-[hsl(160,60%,25%)]">{b.staffing.admin_name}</span>
                          </div>
                          <button onClick={() => unassignAdmin.mutate(b.id)}
                            className="p-1.5 rounded-lg border border-muted hover:border-destructive/30 hover:bg-destructive/5 text-muted-foreground hover:text-destructive transition-colors"
                            title="Remove assignment">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : isAssigning ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedAdmin}
                            onChange={(e) => setSelectedAdmin(e.target.value)}
                            className="text-xs font-medium px-3 py-2 rounded-lg border-2 border-primary/20 bg-card text-foreground focus:outline-none focus:border-primary/40"
                            autoFocus
                          >
                            <option value="">Select admin...</option>
                            {adminStaff.map((name) => (
                              <option key={name} value={name}>{name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => {
                              if (selectedAdmin) {
                                assignAdmin.mutate({ bookingId: b.id, adminName: selectedAdmin });
                              }
                            }}
                            disabled={!selectedAdmin || assignAdmin.isPending}
                            className="text-xs font-bold px-3 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-all"
                          >
                            {assignAdmin.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Assign"}
                          </button>
                          <button onClick={() => { setAssigningId(null); setSelectedAdmin(""); }}
                            className="p-1.5 rounded-lg border border-muted text-muted-foreground hover:text-foreground transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setAssigningId(b.id)}
                          className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border-2 border-destructive/20 text-destructive hover:bg-destructive/5 transition-all">
                          <UserPlus className="w-3.5 h-3.5" /> Assign Admin
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
