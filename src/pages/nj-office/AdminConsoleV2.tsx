import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import NJNavbar from "@/components/NJNavbar";
import {
  CalendarPlus, CalendarDays, BarChart3,
  ArrowRight, Users, Shield, Loader2
} from "lucide-react";
import orendaLogo from "@/assets/orenda-logo-purple.png";
import { useUserRole, ROLE_PERMISSIONS } from "@/hooks/useUserRole";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const cards = [
  {
    key: "book",
    title: "Book",
    subtitle: "Scheduling & Imports",
    description: "Add providers to the calendar, import schedules, and manage office bookings.",
    icon: CalendarPlus,
    gradient: "linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 45%) 100%)",
    link: "/admin-v2/book",
  },
  {
    key: "calendars",
    title: "Calendars",
    subtitle: "Provider & Office Views",
    description: "View provider availability, office calendars, and booked time blocks across all locations.",
    icon: CalendarDays,
    gradient: "linear-gradient(135deg, hsl(160, 70%, 20%) 0%, hsl(160, 60%, 40%) 100%)",
    link: "/admin-v2/calendars",
  },
  {
    key: "reporting",
    title: "Reporting",
    subtitle: "Data & Analytics",
    description: "Dashboard stats, appointment trends, export reports, and performance insights at a glance.",
    icon: BarChart3,
    gradient: "linear-gradient(135deg, hsl(30, 90%, 25%) 0%, hsl(30, 80%, 50%) 100%)",
    link: "/admin-v2/reporting",
  },
  {
    key: "staffing",
    title: "Staffing",
    subtitle: "Admin Coverage",
    description: "Assign admin staff to provider bookings, track coverage gaps, and get alerts for unstaffed slots.",
    icon: Shield,
    gradient: "linear-gradient(135deg, hsl(320, 70%, 22%) 0%, hsl(320, 50%, 42%) 100%)",
    link: "/admin-v2/staffing",
  },
  {
    key: "provider-directory",
    title: "Master Directory",
    subtitle: "Staff & Credentials",
    description: "View all staff — providers, admins, operations & billing — with login credentials and role details.",
    icon: Users,
    gradient: "linear-gradient(135deg, hsl(200, 80%, 22%) 0%, hsl(200, 70%, 45%) 100%)",
    link: "/admin-v2/provider-directory",
  },
];

export default function AdminConsoleV2() {
  const { role, loading } = useUserRole();
  const allowedKeys = ROLE_PERMISSIONS[role || "Provider"] || [];
  const visibleCards = role === "Admin"
    ? cards
    : cards.filter(c => allowedKeys.includes(c.key));

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin Console — Orenda Psychiatry NJ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <NJNavbar />
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 12%) 0%, hsl(270, 80%, 25%) 50%, hsl(270, 60%, 40%) 100%)' }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-v2" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-v2)" />
        </svg>
        <div className="relative max-w-6xl mx-auto px-5 sm:px-6 py-6 sm:py-14">
          <div className="flex items-center gap-3 mb-3 sm:mb-6">
            <img src={orendaLogo} alt="Orenda" className="h-7 sm:h-9 brightness-0 invert" />
          </div>
          <h1 className="font-display text-2xl sm:text-5xl font-bold text-white tracking-tight leading-tight">Admin Console</h1>
          <p className="text-xs sm:text-lg text-white/70 mt-1.5 sm:mt-3 max-w-xl font-medium leading-relaxed">
            Manage scheduling, communication, and operations for NJ offices.
          </p>
          {role && role !== "Admin" && (
            <span className="inline-flex items-center mt-3 text-[10px] tracking-[0.2em] uppercase font-bold text-white/50 bg-white/10 rounded-full px-3 py-1">
              {role} View
            </span>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-14">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            {visibleCards.map((card, i) => (
              <motion.div key={card.title} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                <Link to={card.link}
                  className="group block rounded-xl sm:rounded-2xl overflow-hidden border-2 border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card h-full active:scale-[0.98]">
                  <div className="h-1.5 sm:h-2 w-full" style={{ background: card.gradient }} />
                  <div className="p-4 sm:p-7">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: card.gradient }}>
                        <card.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-display text-base sm:text-2xl font-bold text-foreground tracking-tight leading-tight">{card.title}</h2>
                        <p className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-primary font-bold mt-0.5">{card.subtitle}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 leading-relaxed line-clamp-2">{card.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
