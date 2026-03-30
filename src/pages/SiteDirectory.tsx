import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building, Users, Shield, Paintbrush, Stethoscope, ExternalLink, Layout, MessageSquare, Calendar, CheckCircle2, FileText, Settings, BarChart3, Phone, AlertTriangle, BellRing } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/orenda-logo-purple.png";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

interface RouteItem {
  path: string;
  label: string;
  description: string;
}

interface RouteGroup {
  title: string;
  icon: React.ElementType;
  color: string;
  routes: RouteItem[];
}

const groups: RouteGroup[] = [
  {
    title: "Patient-Facing Pages",
    icon: Stethoscope,
    color: "hsl(270, 80%, 45%)",
    routes: [
      { path: "/", label: "NJ In-Person Care Hub", description: "Main homepage with location banners and CTA popup" },
      { path: "/nj-office/check-in", label: "Patient Booking & Resource Platform", description: "Scheduling, directions, check-in form, and arrival guide" },
      { path: "/patient/book-visit", label: "Patient Portal — Book Visit", description: "Standalone one-stop-shop for patients: schedule, directions, and check-in" },
      { path: "/nj-office/hoboken", label: "Hoboken Office", description: "Hoboken location details, directions, and office info" },
      { path: "/nj-office/edison", label: "Edison Office", description: "Edison location details, directions, and office info" },
      { path: "/nj-office/faq", label: "FAQ", description: "Frequently asked questions about NJ office visits" },
    ],
  },
  {
    title: "Patient Communication",
    icon: MessageSquare,
    color: "hsl(200, 80%, 45%)",
    routes: [
      { path: "/patient/communication-examples", label: "Communication Examples", description: "End-to-end patient journey with animated email & SMS mockups" },
      { path: "/patient/communication-templates", label: "Communication Templates (Draft)", description: "Internal-only draft templates with placeholders — not for sending" },
      { path: "/nj-office/appointment-reminder-preview", label: "Appointment Reminder Preview", description: "Preview of appointment reminder emails" },
    ],
  },
  {
    title: "Provider Pages",
    icon: Users,
    color: "hsl(160, 70%, 35%)",
    routes: [
      
      { path: "/nj-office/book", label: "Book Office Time", description: "Provider office time booking form" },
      { path: "/nj-office/book-hoboken", label: "Book Hoboken", description: "Book office time specifically at Hoboken" },
      { path: "/nj-office/book-admin", label: "Book (Admin)", description: "Admin booking view" },
      { path: "/nj-office/office-addendum", label: "Office Addendum", description: "Office policy addendum and agreement" },
      { path: "/nj-office/provider-login", label: "Provider Login / Dashboard", description: "Provider authentication and dashboard" },
    ],
  },
  {
    title: "Admin Console",
    icon: Shield,
    color: "hsl(0, 70%, 45%)",
    routes: [
      { path: "/admin-login", label: "Admin Login", description: "Password-protected admin authentication" },
      { path: "/admin", label: "Admin Home", description: "Admin view of the Care Hub" },
      { path: "/admin-dashboard", label: "Admin Dashboard", description: "Full admin dashboard with data management" },
      { path: "/admin-v2", label: "Admin Console V2", description: "Redesigned admin console" },
      { path: "/admin-v2/book", label: "V2 — Bookings", description: "Admin V2 booking management" },
      { path: "/admin-v2/communication", label: "V2 — Communication", description: "Admin V2 communication tools" },
      { path: "/admin-v2/calendars", label: "V2 — Calendars", description: "Admin V2 calendar management" },
      { path: "/admin-v2/reporting", label: "V2 — Reporting", description: "Admin V2 reporting and analytics" },
      { path: "/admin-v2/check-in", label: "V2 — Check-In", description: "Admin V2 check-in management" },
      { path: "/admin-v2/providers", label: "V2 — Providers", description: "Admin V2 provider management" },
    ],
  },
  {
    title: "Design Variations & Showcases",
    icon: Paintbrush,
    color: "hsl(30, 90%, 50%)",
    routes: [
      { path: "/nj-office/banner-variations", label: "Banner Variations", description: "Different hero banner design options" },
      { path: "/nj-office/cta-variations", label: "CTA Variations", description: "Call-to-action button and popup designs" },
      { path: "/nj-office/calendar-designs", label: "Calendar Designs", description: "Calendar component style variations" },
      { path: "/nj-office/schedule-variations", label: "Schedule Variations", description: "Scheduling step style options" },
      { path: "/nj-office/schedule-layout-variations", label: "Schedule Layout Variations", description: "Schedule layouts with branded maps" },
      { path: "/nj-office/private-office-designs", label: "Private Office Infographics", description: "Private office information design options" },
      { path: "/nj-office/patient-schedule-designs", label: "Patient Schedule Designs", description: "Patient-facing scheduling layout options" },
      { path: "/nj-office/navbar-variations", label: "Navbar Variations", description: "Navigation bar style options" },
      { path: "/nj-office/nav-menu-variations", label: "Nav Menu Variations", description: "Navigation menu overlay designs" },
      { path: "/nj-office/check-in-demo", label: "Check-In Demo", description: "Interactive check-in form demonstration" },
    ],
  },
];

export default function SiteDirectory() {
  const { data: bookingActivity, isLoading: bookingActivityLoading } = useQuery({
    queryKey: ["site-directory-booking-activity"],
    refetchInterval: 30000,
    queryFn: async () => {
      const sinceIso = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString();

      const [providerBookingsRes, patientBookingsRes] = await Promise.all([
        supabase
          .from("office_bookings")
          .select("id, created_at, provider_name, provider_email, office_location, booking_date, time_block")
          .gte("created_at", sinceIso)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("patient_appointments")
          .select("id, created_at, patient_first_name, patient_last_name, patient_email, provider_name, appointment_date")
          .gte("created_at", sinceIso)
          .order("created_at", { ascending: false })
          .limit(20),
      ]);

      if (providerBookingsRes.error) throw providerBookingsRes.error;
      if (patientBookingsRes.error) throw patientBookingsRes.error;

      const providerBookings = providerBookingsRes.data ?? [];
      const patientBookings = patientBookingsRes.data ?? [];

      const allAttempts = [
        ...providerBookings.map((b) => ({
          type: "provider" as const,
          created_at: b.created_at,
          who: b.provider_name,
          email: b.provider_email,
          detail: `${b.office_location} · ${b.booking_date} · ${b.time_block}`,
        })),
        ...patientBookings.map((b) => ({
          type: "patient" as const,
          created_at: b.created_at,
          who: `${b.patient_first_name} ${b.patient_last_name}`,
          email: b.patient_email,
          detail: `Provider: ${b.provider_name} · ${b.appointment_date}`,
        })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return {
        providerCount: providerBookings.length,
        patientCount: patientBookings.length,
        totalCount: providerBookings.length + patientBookings.length,
        latestAttemptAt: allAttempts[0]?.created_at ?? null,
        attempts: allAttempts,
      };
    },
  });

  const hasBookingAttempts = (bookingActivity?.totalCount ?? 0) > 0;

  return (
    <div className="min-h-screen bg-[hsl(270,15%,97%)] font-body">
      {/* Header */}
      <header className="bg-white border-b border-[hsl(270,15%,90%)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <img src={logo} alt="Orenda" className="h-8" />
          <div className="h-6 w-px bg-[hsl(270,15%,85%)]" />
          <h1 className="font-display text-lg font-semibold text-foreground">Site Directory</h1>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-7xl mx-auto px-6 md:px-14">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <p className="text-[11px] tracking-[0.4em] uppercase text-white/40 font-medium mb-3">Internal Reference</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-light text-white tracking-tight mb-4">
              All Page <em className="text-[hsl(270,70%,80%)]" style={{ fontStyle: 'italic' }}>Variations</em>
            </h2>
            <p className="text-white/60 text-base md:text-lg max-w-2xl">
              A complete directory of every page and route created for the Orenda NJ Office project — {groups.reduce((sum, g) => sum + g.routes.length, 0)} pages across {groups.length} categories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Booking Attempt Alert */}
      <section className="bg-white border-b border-[hsl(270,15%,90%)]">
        <div className="max-w-7xl mx-auto px-6 md:px-14 py-6">
          <div className={`rounded-2xl border p-5 md:p-6 ${hasBookingAttempts ? "border-destructive/30 bg-destructive/5" : "border-[hsl(145,45%,70%)] bg-[hsl(145,55%,97%)]"}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasBookingAttempts ? "bg-destructive/10" : "bg-[hsl(145,55%,92%)]"}`}>
                  {hasBookingAttempts ? (
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-[hsl(145,60%,30%)]" />
                  )}
                </div>
                <div>
                  <h3 className="font-display text-xl text-foreground">
                    Booking Attempt Alerts
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monitors booking activity in the last 30 days and highlights any booking attempts.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase text-primary">
                <BellRing className="w-4 h-4" />
                Auto-refreshes every 30s
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-5">
              <div className="rounded-xl bg-white border border-border/40 p-4">
                <p className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1">Total Attempts</p>
                <p className="text-2xl font-display text-foreground">
                  {bookingActivityLoading ? "..." : bookingActivity?.totalCount ?? 0}
                </p>
              </div>
              <div className="rounded-xl bg-white border border-border/40 p-4">
                <p className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1">Provider Booking Attempts</p>
                <p className="text-2xl font-display text-foreground">
                  {bookingActivityLoading ? "..." : bookingActivity?.providerCount ?? 0}
                </p>
              </div>
              <div className="rounded-xl bg-white border border-border/40 p-4">
                <p className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground mb-1">Patient Booking Attempts</p>
                <p className={`text-2xl font-display ${((bookingActivity?.patientCount ?? 0) > 0) ? "text-destructive" : "text-foreground"}`}>
                  {bookingActivityLoading ? "..." : bookingActivity?.patientCount ?? 0}
                </p>
              </div>
            </div>

            <p className="text-xs mt-4 text-muted-foreground">
              {bookingActivity?.latestAttemptAt
                ? `Latest attempt: ${new Date(bookingActivity.latestAttemptAt).toLocaleString()}`
                : "No booking attempts detected in the last 30 days."}
            </p>

            {/* Detailed attempt log */}
            {(bookingActivity?.attempts?.length ?? 0) > 0 && (
              <div className="mt-5 space-y-2">
                <p className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground font-semibold mb-2">Attempt Log</p>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {bookingActivity!.attempts.map((a, i) => (
                    <div key={i} className={`rounded-lg border p-3 text-xs ${a.type === "patient" ? "border-destructive/20 bg-destructive/5" : "border-border/40 bg-white"}`}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-foreground">{a.who}</span>
                        <span className={`text-[10px] tracking-wide uppercase font-bold px-2 py-0.5 rounded-full ${a.type === "patient" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                          {a.type}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{a.email}</p>
                      <p className="text-muted-foreground mt-0.5">{a.detail}</p>
                      <p className="text-muted-foreground/60 mt-1">{new Date(a.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Jump */}
      <div className="bg-white border-b border-[hsl(270,15%,90%)] py-4 sticky top-[65px] z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-14 flex flex-wrap gap-3">
          {groups.map((group) => (
            <a
              key={group.title}
              href={`#${group.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full border border-[hsl(270,15%,88%)] hover:border-primary/30 hover:bg-primary/5 transition-colors text-muted-foreground hover:text-primary"
            >
              <group.icon className="w-3.5 h-3.5" />
              {group.title}
            </a>
          ))}
        </div>
      </div>

      {/* Route Groups */}
      <div className="max-w-7xl mx-auto px-6 md:px-14 py-12 space-y-16">
        {groups.map((group, gi) => (
          <motion.section
            key={group.title}
            id={group.title.toLowerCase().replace(/\s+/g, '-')}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={gi * 0.05}
            className="scroll-mt-36"
          >
            {/* Group header */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: group.color }}
              >
                <group.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground">{group.title}</h3>
                <p className="text-sm text-muted-foreground">{group.routes.length} pages</p>
              </div>
            </div>

            {/* Route cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.routes.map((route, ri) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className="group bg-white rounded-2xl border border-[hsl(270,15%,90%)] p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm leading-tight">
                      {route.label}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{route.description}</p>
                  <code className="text-[11px] font-mono text-primary/60 bg-primary/5 px-2.5 py-1 rounded-md">
                    {route.path}
                  </code>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-[hsl(270,15%,90%)] py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-14 text-center">
          <p className="text-xs text-muted-foreground">
            Orenda Psychiatry — Internal Site Directory · {groups.reduce((sum, g) => sum + g.routes.length, 0)} pages
          </p>
        </div>
      </footer>
    </div>
  );
}
