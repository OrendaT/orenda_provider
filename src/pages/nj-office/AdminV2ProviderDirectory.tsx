import { useState, useCallback, useMemo, useEffect, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Users, Search, Copy, Check, Key, Mail, X, Eye, EyeOff,
  Trash2, ShieldOff, ShieldCheck, Loader2, Download, Lock, UserPlus,
  ArrowUpDown, Filter, ChevronDown, Crown, Phone, Briefcase, Stethoscope,
  Building, HeadphonesIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/orenda-logo-purple.png";

const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits[0] === "1") return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  return phone;
};
import * as XLSX from "xlsx-js-style";
import ZapierWebhookSettings from "@/components/ZapierWebhookSettings";
import { useUserRole } from "@/hooks/useUserRole";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.04, ease: "easeOut" as const },
  }),
};

const DEFAULT_PASSWORD = "Orenda2025!";

// Brand palette for Excel
const P = {
  DEEP: "2D1B4E", DARK: "462D6D", MED: "6B4FA0",
  SNOW: "F8F6FB", WHITE: "FFFFFF", TEXT: "1A1A2E",
  BORDER: "D4CCE6", WASH: "E8E0F0", LAVEN: "F5F3FF",
};

const bdr = (color = P.BORDER): any => ({
  top: { style: "thin" as const, color: { rgb: color } },
  bottom: { style: "thin" as const, color: { rgb: color } },
  left: { style: "thin" as const, color: { rgb: color } },
  right: { style: "thin" as const, color: { rgb: color } },
});

type SortField = "name" | "email" | "status" | "last_sign_in" | "role";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "active" | "disabled";
type RoleFilter = "all" | "provider" | "admin";

const ALL_ROLES = ["Provider", "Admin"] as const;

const ROLE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  "Provider": { bg: "bg-primary/10", text: "text-primary", label: "Provider" },
  "Admin": { bg: "bg-amber-100", text: "text-amber-700", label: "Admin" },
};

export default function AdminV2ProviderDirectory() {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState(DEFAULT_PASSWORD);
  const [showNewPw, setShowNewPw] = useState(false);
  const [changePwUser, setChangePwUser] = useState<any>(null);
  const [changePwValue, setChangePwValue] = useState("");
  const [showChangePw, setShowChangePw] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: string; user: any } | null>(null);
  const [editPhoneUser, setEditPhoneUser] = useState<any>(null);
  const [editPhoneValue, setEditPhoneValue] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState<"Provider" | "Admin">("Provider");

  // Filter & Sort
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Admin permissions state
  // Admin permissions: email -> { has_admin_access, role }
  const [adminPerms, setAdminPerms] = useState<Map<string, { has_admin_access: boolean; role: string }>>(new Map());
  const [editingRoleUser, setEditingRoleUser] = useState<any>(null);
  const { role: currentUserRole } = useUserRole();
  const isReadOnly = false;

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("manage-users", {
        body: { action: "list_users" },
      });
      if (error) throw error;
      return data.users || [];
    },
  });

  // Load admin permissions with roles
  useEffect(() => {
    const loadAdminPerms = async () => {
      const { data } = await supabase.from("admin_permissions").select("email, has_admin_access, role");
      if (data) {
        const map = new Map<string, { has_admin_access: boolean; role: string }>();
        data.forEach((r: any) => map.set(r.email, { has_admin_access: r.has_admin_access, role: r.role || "Provider" }));
        setAdminPerms(map);
      }
    };
    loadAdminPerms();
  }, []);

  const changeUserRole = async (user: any, newRole: string) => {
    const email = user.email;
    const name = user.provider_name || "";
    const prev = adminPerms.get(email);
    const isAdmin = newRole === "Admin";

    // Optimistic update
    const newMap = new Map(adminPerms);
    newMap.set(email, { has_admin_access: prev?.has_admin_access || isAdmin, role: newRole });
    setAdminPerms(newMap);

    const { error } = await supabase.from("admin_permissions").upsert(
      { email, provider_name: name, user_id: user.id, has_admin_access: prev?.has_admin_access || isAdmin, role: newRole, updated_at: new Date().toISOString() },
      { onConflict: "email" }
    );
    if (error) {
      // Revert
      if (prev) newMap.set(email, prev); else newMap.delete(email);
      setAdminPerms(new Map(newMap));
      toast({ title: "Failed to update role", variant: "destructive" });
    } else {
      toast({ title: "Role updated", description: `${name || email} → ${newRole}` });
      setEditingRoleUser(null);
      queryClient.invalidateQueries({ queryKey: ["staffing-admin-list"] });
    }
  };

  const enrichedUsers = useMemo(() => {
    return users.map((u: any) => {
      const perm = adminPerms.get(u.email);
      const role = perm?.role || "Provider";
      return { ...u, role };
    });
  }, [users, adminPerms]);

  const filtered = useMemo(() => {
    let result = enrichedUsers.filter((u: any) => {
      const q = search.toLowerCase();
      const matchesSearch = !q ||
        (u.provider_name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !u.banned) ||
        (statusFilter === "disabled" && u.banned);
      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "provider" && u.role === "Provider") ||
        (roleFilter === "admin" && u.role === "Admin");
      return matchesSearch && matchesStatus && matchesRole;
    });

    result.sort((a: any, b: any) => {
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = (a.provider_name || "").localeCompare(b.provider_name || "");
          break;
        case "email":
          cmp = (a.email || "").localeCompare(b.email || "");
          break;
        case "status":
          cmp = (a.banned ? 1 : 0) - (b.banned ? 1 : 0);
          break;
        case "role":
          cmp = (a.role || "").localeCompare(b.role || "");
          break;
        case "last_sign_in":
          cmp = new Date(a.last_sign_in || 0).getTime() - new Date(b.last_sign_in || 0).getTime();
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [enrichedUsers, search, statusFilter, roleFilter, sortField, sortDir]);

  const activeCount = enrichedUsers.filter((u: any) => !u.banned).length;
  const disabledCount = enrichedUsers.filter((u: any) => u.banned).length;

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const createUser = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("manage-users", {
        body: { action: "create_user", email: newEmail, password: newPassword, provider_name: newName, phone: newPhone || null },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return data;
    },
    onSuccess: async (data) => {
      // If Admin role selected, create admin_permissions entry
      if (newRole === "Admin" && data?.user_id) {
        await supabase.from("admin_permissions").upsert(
          { email: newEmail, provider_name: newName, user_id: data.user_id, has_admin_access: true, role: "Admin", staffing_assignable: false, updated_at: new Date().toISOString() },
          { onConflict: "email" }
        );
        // Update local state
        setAdminPerms(prev => {
          const next = new Map(prev);
          next.set(newEmail, { has_admin_access: true, role: "Admin" });
          return next;
        });
      }
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["staffing-admin-list"] });
      toast({ title: "User created", description: `${newName} can now log in as ${newRole}.` });
      setShowAddUser(false); setNewName(""); setNewEmail(""); setNewPassword(DEFAULT_PASSWORD); setNewPhone(""); setNewRole("Provider");
    },
    onError: (err: any) => toast({ title: "Failed to create user", description: err.message, variant: "destructive" }),
  });

  const updatePhone = useMutation({
    mutationFn: async ({ user_id, phone }: { user_id: string; phone: string }) => {
      const { data, error } = await supabase.functions.invoke("manage-users", {
        body: { action: "update_phone", user_id, phone },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Phone number updated" });
      setEditPhoneUser(null); setEditPhoneValue("");
    },
    onError: (err: any) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  const changePassword = useMutation({
    mutationFn: async ({ user_id, password }: { user_id: string; password: string }) => {
      const { data, error } = await supabase.functions.invoke("manage-users", {
        body: { action: "change_password", user_id, password },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
    },
    onSuccess: () => { toast({ title: "Password updated" }); setChangePwUser(null); setChangePwValue(""); },
    onError: (err: any) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  const toggleAccess = useMutation({
    mutationFn: async ({ user_id, ban }: { user_id: string; ban: boolean }) => {
      const { data, error } = await supabase.functions.invoke("manage-users", {
        body: { action: ban ? "disable_user" : "enable_user", user_id },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setConfirmAction(null); toast({ title: "Access updated" });
    },
    onError: (err: any) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  const deleteUser = useMutation({
    mutationFn: async (user_id: string) => {
      const { data, error } = await supabase.functions.invoke("manage-users", {
        body: { action: "delete_user", user_id },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setConfirmAction(null); toast({ title: "User deleted" });
    },
    onError: (err: any) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportExcel = useCallback(() => {
    const wb = XLSX.utils.book_new();
    const cols = 7;

    const titleRows: any[][] = [
      ["", "", "", "", "", "", ""],
      ["Orenda Psychiatry", "", "", "", "", "", ""],
      ["Master Directory", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
    ];
    const headers = ["Name", "Email", "Role", "Phone", "Status", "Last Sign-In", "Default Password"];
    const dataRows = filtered.map((u: any) => [
      u.provider_name || "—",
      u.email || "—",
      u.role || "Provider",
      u.phone || "—",
      u.banned ? "Disabled" : "Active",
      u.last_sign_in ? new Date(u.last_sign_in).toLocaleDateString() : "Never",
      DEFAULT_PASSWORD,
    ]);

    const wsData = [...titleRows, headers, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws["!merges"] = [
      { s: { r: 1, c: 0 }, e: { r: 1, c: cols - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: cols - 1 } },
    ];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < cols; c++) {
        const ref = XLSX.utils.encode_cell({ r, c });
        if (!ws[ref]) ws[ref] = { t: "s", v: "" };
        ws[ref].s = { fill: { fgColor: { rgb: [P.DEEP, P.DEEP, P.DARK, P.MED][r] } }, border: bdr(P.DEEP) };
      }
    }
    for (let c = 0; c < cols; c++) {
      const r1 = XLSX.utils.encode_cell({ r: 1, c });
      if (!ws[r1]) ws[r1] = { t: "s", v: "" };
      ws[r1].s = { fill: { fgColor: { rgb: P.DEEP } }, font: { bold: true, color: { rgb: P.WHITE }, sz: 18, name: "Calibri" }, alignment: { horizontal: "center", vertical: "center" }, border: bdr(P.DEEP) };
      const r2 = XLSX.utils.encode_cell({ r: 2, c });
      if (!ws[r2]) ws[r2] = { t: "s", v: "" };
      ws[r2].s = { fill: { fgColor: { rgb: P.DARK } }, font: { color: { rgb: P.WHITE }, sz: 12, name: "Calibri" }, alignment: { horizontal: "center", vertical: "center" }, border: bdr(P.DARK) };
    }

    for (let c = 0; c < cols; c++) {
      const ref = XLSX.utils.encode_cell({ r: 4, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };
      ws[ref].s = { fill: { fgColor: { rgb: P.DEEP } }, font: { bold: true, color: { rgb: P.WHITE }, sz: 11, name: "Calibri" }, alignment: { horizontal: "center" }, border: bdr(P.DARK) };
    }

    dataRows.forEach((row, ri) => {
      row.forEach((val, ci) => {
        const ref = XLSX.utils.encode_cell({ r: ri + 5, c: ci });
        if (!ws[ref]) ws[ref] = { t: "s", v: "" };
        const isAlt = ri % 2 === 1;
        if (ci === 4) {
          ws[ref].s = {
            fill: { fgColor: { rgb: isAlt ? P.LAVEN : P.WHITE } },
            font: { sz: 10, name: "Calibri", color: { rgb: val === "Active" ? "047857" : "DC2626" }, bold: true },
            alignment: { horizontal: "center" }, border: bdr(P.WASH),
          };
        } else if (ci === 2) {
          const roleColors: Record<string, string> = { "Provider": "462D6D", "Admin": "D97706", "Operations": "047857", "Billing": "1D4ED8" };
          ws[ref].s = {
            fill: { fgColor: { rgb: isAlt ? P.LAVEN : P.WHITE } },
            font: { sz: 10, name: "Calibri", color: { rgb: roleColors[val as string] || P.TEXT }, bold: true },
            alignment: { horizontal: "center" }, border: bdr(P.WASH),
          };
        } else {
          ws[ref].s = {
            fill: { fgColor: { rgb: isAlt ? P.LAVEN : P.WHITE } },
            font: { sz: 10, name: "Calibri", color: { rgb: P.TEXT } },
            alignment: { horizontal: ci === 0 ? "left" : "center" }, border: bdr(P.WASH),
          };
        }
      });
    });

    ws["!cols"] = [{ wch: 25 }, { wch: 35 }, { wch: 14 }, { wch: 18 }, { wch: 12 }, { wch: 16 }, { wch: 18 }];
    ws["!rows"] = [{ hpx: 10 }, { hpx: 36 }, { hpx: 24 }, { hpx: 10 }];

    XLSX.utils.book_append_sheet(wb, ws, "Master Directory");
    XLSX.writeFile(wb, "Orenda_Psychiatry_Master_Directory.xlsx");
  }, [filtered]);

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button onClick={() => toggleSort(field)}
      className={`text-[10px] tracking-[0.15em] uppercase font-bold flex items-center gap-1 hover:text-foreground transition-colors ${sortField === field ? "text-primary" : "text-muted-foreground"}`}>
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? "text-primary" : "text-muted-foreground/50"}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-background font-body">
      <Helmet><title>Admin — Master Directory</title></Helmet>

      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(200, 80%, 15%) 0%, hsl(200, 70%, 30%) 50%, hsl(200, 60%, 45%) 100%)' }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-pd" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-pd)" />
        </svg>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          <Link to="/admin-v2" className="inline-flex items-center gap-2 text-xs text-white/50 font-bold uppercase tracking-wider hover:text-white/80 transition-colors mb-4 sm:mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Console
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Users className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-5xl font-bold text-white tracking-tight">Master Directory</h1>
              <p className="text-sm sm:text-base text-white/60 mt-0.5 sm:mt-1 font-medium">All staff — providers, admins, operations & billing.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-5">
        {/* Action bar */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 text-sm font-bold border-2 border-border text-foreground px-4 py-2.5 rounded-xl hover:bg-secondary/50 transition-colors">
              <Filter className="w-4 h-4" /> Filter
              {statusFilter !== "all" && <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">1</span>}
            </button>
            {!isReadOnly && (
              <button onClick={() => setShowAddUser(true)}
                className="inline-flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 40%) 100%)' }}>
                <UserPlus className="w-4 h-4" /> Add User
              </button>
            )}
            <button onClick={exportExcel}
              className="inline-flex items-center gap-2 text-sm font-bold border-2 border-primary/20 text-primary px-5 py-2.5 rounded-xl hover:bg-primary/5 transition-colors">
              <Download className="w-4 h-4" /> Export Excel
            </button>
          </div>
        </motion.div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
             <div className="rounded-xl border-2 border-border bg-card p-4 flex flex-wrap gap-3 items-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status:</span>
                {([["all", `All (${enrichedUsers.length})`], ["active", `Active (${activeCount})`], ["disabled", `Disabled (${disabledCount})`]] as [StatusFilter, string][]).map(([val, label]) => (
                  <button key={val} onClick={() => setStatusFilter(val)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${statusFilter === val ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                    {label}
                  </button>
                ))}
                {statusFilter !== "all" && (
                  <button onClick={() => setStatusFilter("all")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 ml-2">
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
                <span className="w-px h-6 bg-border mx-1" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Role:</span>
                {([["all", "All"], ["provider", "Providers"], ["admin", "Admin"]] as [RoleFilter, string][]).map(([val, label]) => (
                  <button key={val} onClick={() => setRoleFilter(val)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${roleFilter === val ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                    {label}
                  </button>
                ))}
                {roleFilter !== "all" && (
                  <button onClick={() => setRoleFilter("all")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 ml-1">
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Default password card */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
          className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Key className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Default Password</p>
              <p className="text-xs text-muted-foreground">Initial login for new providers</p>
            </div>
          </div>
          <button onClick={() => copyToClipboard(DEFAULT_PASSWORD, "password")}
            className="flex items-center gap-2 text-sm font-bold bg-card border-2 border-border rounded-xl px-4 py-2 hover:bg-secondary/50 transition-colors whitespace-nowrap">
            <code className="text-primary font-mono text-xs">{DEFAULT_PASSWORD}</code>
            {copiedId === "password" ? <Check className="w-3.5 h-3.5 text-[hsl(160,60%,35%)]" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
        </motion.div>

        {/* Provider list */}
        <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
          className="rounded-2xl border-2 border-border bg-card overflow-hidden">
          {/* Sortable table header */}
          <div className="hidden sm:grid grid-cols-[1fr_1.2fr_90px_140px_90px_50px_110px] items-center gap-2 px-5 py-3 border-b border-border bg-secondary/30">
            <SortButton field="name" label="Name" />
            <SortButton field="email" label="Email" />
            <SortButton field="role" label="Role" />
            <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-bold text-center">Phone</p>
            <SortButton field="status" label="Status" />
            <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-bold text-center">Copy</p>
            <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-bold text-right">Actions</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground text-sm">No users found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((user: any) => (
                <div key={user.id} className="px-5 py-3.5 hover:bg-secondary/10 transition-colors">
                  <div className="sm:grid sm:grid-cols-[1fr_1.2fr_90px_140px_90px_50px_110px] sm:items-center gap-2">
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${user.banned ? "bg-destructive/10 text-destructive" : (ROLE_COLORS[user.role]?.bg || "bg-primary/10") + " " + (ROLE_COLORS[user.role]?.text || "text-primary")}`}>
                        {(user.provider_name || user.email || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{user.provider_name || "—"}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">{user.email}</p>
                        {user.phone && <p className="text-xs text-muted-foreground sm:hidden">{formatPhone(user.phone)}</p>}
                        <span className={`sm:hidden inline-flex items-center text-[9px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 mt-0.5 ${ROLE_COLORS[user.role]?.bg || "bg-primary/10"} ${ROLE_COLORS[user.role]?.text || "text-primary"}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 min-w-0">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <p className="text-sm text-muted-foreground font-mono truncate">{user.email}</p>
                    </div>
                    <div className="hidden sm:flex justify-center relative">
                      {!isReadOnly && editingRoleUser?.id === user.id ? (
                        <div className="flex flex-col gap-0.5 bg-card border-2 border-border rounded-xl shadow-lg p-1.5 absolute z-20 top-0">
                          {ALL_ROLES.map(r => (
                            <button key={r} onClick={() => changeUserRole(user, r)}
                              className={`text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 text-left transition-colors ${user.role === r ? (ROLE_COLORS[r]?.bg + " " + ROLE_COLORS[r]?.text) : "hover:bg-secondary text-muted-foreground"}`}>
                              {r}
                            </button>
                          ))}
                          <button onClick={() => setEditingRoleUser(null)} className="text-[10px] text-muted-foreground hover:text-foreground text-center pt-1 border-t border-border mt-1">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => !isReadOnly && setEditingRoleUser(user)}
                          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 transition-all ${ROLE_COLORS[user.role]?.bg || "bg-primary/10"} ${ROLE_COLORS[user.role]?.text || "text-primary"} ${isReadOnly ? "cursor-default" : "cursor-pointer hover:ring-2 hover:ring-primary/20"}`}>
                          {user.role}
                          {!isReadOnly && <ChevronDown className="w-2.5 h-2.5" />}
                        </button>
                      )}
                    </div>
                    <div className="hidden sm:flex justify-center">
                      <button
                        onClick={() => { setEditPhoneUser(user); setEditPhoneValue(user.phone || ""); }}
                        className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors border border-border rounded-lg px-2 py-1 hover:bg-primary/5 flex items-center gap-1"
                        title={formatPhone(user.phone) || "Add phone"}
                      >
                        <Phone className="w-3 h-3 shrink-0" />
                        <span className="whitespace-nowrap">{formatPhone(user.phone) || "Add"}</span>
                      </button>
                    </div>
                    <div className="hidden sm:flex justify-center">
                      {user.banned ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-destructive bg-destructive/10 rounded-full px-2.5 py-1">
                          <ShieldOff className="w-3 h-3" /> Off
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[hsl(160,60%,30%)] bg-[hsl(160,60%,95%)] rounded-full px-2.5 py-1">
                          <ShieldCheck className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    <div className="hidden sm:flex justify-center">
                      <button onClick={() => copyToClipboard(user.email, user.id)}
                        className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors border border-border rounded-lg px-2.5 py-1 hover:bg-primary/5">
                        {copiedId === user.id ? <Check className="w-3 h-3 text-[hsl(160,60%,35%)]" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    {isReadOnly ? (
                      <div className="flex items-center justify-end mt-2 sm:mt-0">
                        <span className="text-[10px] text-muted-foreground italic">View only</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 justify-end mt-2 sm:mt-0">
                        <button onClick={() => { setChangePwUser(user); setChangePwValue(""); }}
                          title="Change password"
                          className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setConfirmAction({ type: user.banned ? "enable" : "disable", user })}
                          title={user.banned ? "Re-enable access" : "Disable access"}
                          className={`p-1.5 rounded-lg border transition-colors ${user.banned ? "border-[hsl(160,60%,80%)] text-[hsl(160,60%,35%)] hover:bg-[hsl(160,60%,95%)]" : "border-amber-200 text-amber-600 hover:bg-amber-50"}`}>
                          {user.banned ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldOff className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => setConfirmAction({ type: "delete", user })}
                          title="Delete user"
                          className="p-1.5 rounded-lg border border-destructive/20 text-destructive/60 hover:text-destructive hover:bg-destructive/5 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <p className="text-xs text-muted-foreground text-center">
          {filtered.length} of {enrichedUsers.length} staff shown
        </p>

        {/* Zapier SMS Settings */}
        <div className="mt-8">
          <ZapierWebhookSettings />
        </div>
      </div>

      {/* Add Provider Modal */}
      <AnimatePresence>
        {showAddUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowAddUser(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="px-7 pt-7 pb-4 border-b border-border/20" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), white)' }}>
                <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-medium mb-2">Admin Action</p>
                <h3 className="font-display text-2xl text-foreground">Add New User</h3>
              </div>
              <div className="px-7 py-6 space-y-4">
                <div>
                  <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-2 block">User Role *</label>
                  <div className="flex gap-2">
                    {(["Provider", "Admin"] as const).map(r => (
                      <button key={r} type="button" onClick={() => setNewRole(r)}
                        className={`flex-1 text-sm font-bold py-2.5 rounded-xl border-2 transition-all ${newRole === r ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-2 block">Full Name *</label>
                  <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                    placeholder={newRole === "Admin" ? "Jane Smith" : "Dr. Jane Smith"} />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-2 block">Email *</label>
                  <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                    placeholder="provider@orendapsych.com" />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-2 block">Password</label>
                  <div className="relative">
                    <input type={showNewPw ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 pr-10" />
                    <button onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.15em] uppercase text-foreground font-bold mb-2 block">Phone Number (for SMS)</label>
                  <input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                    placeholder="+1 (555) 123-4567" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => createUser.mutate()} disabled={createUser.isPending || !newName || !newEmail}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl text-white disabled:opacity-40 hover:opacity-90 transition-all"
                    style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 40%) 100%)' }}>
                    {createUser.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    {createUser.isPending ? "Creating..." : "Create User"}
                  </button>
                  <button onClick={() => setShowAddUser(false)} className="text-sm font-semibold text-muted-foreground px-5 py-2.5 rounded-xl hover:text-foreground transition-colors">Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {changePwUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setChangePwUser(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-7"
              onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl text-foreground text-center mb-1">Change Password</h3>
              <p className="text-sm text-muted-foreground text-center mb-5">{changePwUser.provider_name || changePwUser.email}</p>
              <div className="relative mb-5">
                <input type={showChangePw ? "text" : "password"} value={changePwValue} onChange={e => setChangePwValue(e.target.value)}
                  placeholder="New password"
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 pr-10" />
                <button onClick={() => setShowChangePw(!showChangePw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showChangePw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setChangePwUser(null)} className="flex-1 text-sm font-semibold text-muted-foreground py-3 rounded-xl border-2 border-border hover:bg-secondary/50 transition-colors">Cancel</button>
                <button onClick={() => changePassword.mutate({ user_id: changePwUser.id, password: changePwValue })}
                  disabled={changePassword.isPending || changePwValue.length < 6}
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-white py-3 rounded-xl disabled:opacity-40 hover:opacity-90 transition-all"
                  style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 40%) 100%)' }}>
                  {changePassword.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Update
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Action Modal */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setConfirmAction(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl text-center"
              onClick={e => e.stopPropagation()}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                confirmAction.type === "delete" ? "bg-destructive/10" : confirmAction.type === "disable" ? "bg-amber-100" : "bg-[hsl(160,60%,92%)]"
              }`}>
                {confirmAction.type === "delete" ? <Trash2 className="w-7 h-7 text-destructive" /> :
                 confirmAction.type === "disable" ? <ShieldOff className="w-7 h-7 text-amber-600" /> :
                 <ShieldCheck className="w-7 h-7 text-[hsl(160,60%,35%)]" />}
              </div>
              <h3 className="font-display text-xl text-foreground mb-2">
                {confirmAction.type === "delete" ? "Delete Provider?" : confirmAction.type === "disable" ? "Disable Access?" : "Re-enable Access?"}
              </h3>
              <p className="text-sm text-muted-foreground mb-1 font-medium">{confirmAction.user.provider_name || confirmAction.user.email}</p>
              <p className="text-xs text-muted-foreground mb-6">
                {confirmAction.type === "delete" ? "This permanently removes the provider account." :
                 confirmAction.type === "disable" ? "This provider will no longer be able to log in." :
                 "This provider will regain portal access."}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmAction(null)} className="flex-1 text-sm font-semibold text-muted-foreground py-3 rounded-xl border-2 border-border hover:bg-secondary/50 transition-colors">Cancel</button>
                <button onClick={() => {
                  if (confirmAction.type === "delete") deleteUser.mutate(confirmAction.user.id);
                  else toggleAccess.mutate({ user_id: confirmAction.user.id, ban: confirmAction.type === "disable" });
                }}
                  className={`flex-1 text-sm font-bold text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                    confirmAction.type === "delete" ? "bg-destructive hover:bg-destructive/90" : confirmAction.type === "disable" ? "bg-amber-600 hover:bg-amber-700" : "bg-[hsl(160,60%,35%)] hover:bg-[hsl(160,60%,30%)]"
                  }`}>
                  {(deleteUser.isPending || toggleAccess.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {confirmAction.type === "delete" ? "Delete" : confirmAction.type === "disable" ? "Disable" : "Enable"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Phone Modal */}
      <AnimatePresence>
        {editPhoneUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setEditPhoneUser(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-7"
              onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl text-foreground text-center mb-1">Update Phone Number</h3>
              <p className="text-sm text-muted-foreground text-center mb-5">{editPhoneUser.provider_name || editPhoneUser.email}</p>
              <input type="tel" value={editPhoneValue} onChange={e => setEditPhoneValue(e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 mb-5" />
              <div className="flex gap-3">
                <button onClick={() => setEditPhoneUser(null)} className="flex-1 text-sm font-semibold text-muted-foreground py-3 rounded-xl border-2 border-border hover:bg-secondary/50 transition-colors">Cancel</button>
                <button onClick={() => updatePhone.mutate({ user_id: editPhoneUser.id, phone: editPhoneValue })}
                  disabled={updatePhone.isPending}
                  className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-white py-3 rounded-xl disabled:opacity-40 hover:opacity-90 transition-all"
                  style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 40%) 100%)' }}>
                  {updatePhone.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
