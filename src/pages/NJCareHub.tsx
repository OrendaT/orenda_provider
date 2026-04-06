import { Link } from "react-router-dom";
import { Shield, ArrowRight, Clock, ShieldCheck, Coffee, Car, BookOpen, Stethoscope, FileCheck, CalendarCheck, HelpCircle, Menu, X, Users, MapPin, Phone, Mail, Sparkles, LogOut, Clipboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/orenda-logo-purple.png";
import hobokenImg from "@/assets/hoboken-riverfront.png";
import edisonImg from "@/assets/edison-building-glass.png";
import sunsetImg from "@/assets/hoboken-sunset.png";
import adminImg from "@/assets/nj-admin-phone.png";
import NJFooter from "@/components/NJFooter";

// Simplified, fast animations — no staggered delays that cause mobile jank
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const slideIn = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

const hobokenFeatures = [
  { icon: Clock, label: "24/7 Access", desc: "Round-the-clock building entry for providers with secure keycard access." },
  { icon: ShieldCheck, label: "Lobby Security", desc: "Professional front desk security staff to greet and direct all visitors." },
  { icon: Coffee, label: "Lounge & Kitchen", desc: "Fully equipped kitchen and comfortable lounge area for breaks between sessions." },
  { icon: Car, label: "Parking Available", desc: "Parking inside the building and street parking available." },
];

const edisonFeatures = [
  { icon: Clock, label: "24/7 Access", desc: "Round-the-clock building entry for providers with secure keycard access." },
  { icon: ShieldCheck, label: "Lobby Security", desc: "Professional front desk security staff to greet and direct all visitors." },
  { icon: Coffee, label: "Lounge & Kitchen", desc: "Fully equipped kitchen and comfortable lounge area for breaks between sessions." },
  { icon: Car, label: "Parking Available", desc: "Parking inside the building and street parking available for providers." },
];

const getNavItems = (isAdmin: boolean) => {
  const prefix = "/nj-office";
  const items = [
    {
      label: "Offices",
      to: "",
      children: [
        { to: `${prefix}/hoboken`, label: "Hoboken" },
        { to: `${prefix}/edison`, label: "Edison" },
      ],
    },
    { label: "Schedule Office Time", to: `${prefix}/book` },
    { label: "Provider Checklist", to: "/provider-checklist" },
    { label: "FAQ", to: `${prefix}/faq` },
  ];
  if (isAdmin) {
    items.push({ label: "Admin Console", to: "/admin-v2" });
  }
  return items;
};

export default function NJCareHub({ isAdmin = false, providerName, onSignOut }: { isAdmin?: boolean; providerName?: string; onSignOut?: () => void }) {
  const [navOpen, setNavOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [hasAdminAccess, setHasAdminAccess] = useState(isAdmin);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from("admin_permissions")
          .select("has_admin_access")
          .eq("user_id", session.user.id)
          .eq("has_admin_access", true)
          .maybeSingle();
        setHasAdminAccess(!!data || isAdmin);
      }
    };
    checkAdmin();
  }, [isAdmin]);

  const navItems = getNavItems(hasAdminAccess);
  const prefix = "/nj-office";

  useEffect(() => {
    const dismissed = sessionStorage.getItem("cta-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setCtaVisible(true), 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissCta = () => {
    setCtaVisible(false);
    sessionStorage.setItem("cta-dismissed", "true");
  };
  return (
    <div className="min-h-screen bg-white font-body">
      {/* 2E Frosted Violet CTA Popup */}
      <AnimatePresence>
        {ctaVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            onClick={dismissCta}
          >
            <div className="absolute inset-0 bg-foreground/50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 22, stiffness: 260, delay: 0.1 }}
              onClick={(e) => e.stopPropagation()}
              className="relative rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center overflow-hidden"
              style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 50%), hsl(270, 50%, 40%), hsl(270, 55%, 35%))' }}
            >
              <button
                onClick={dismissCta}
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/30 transition-all z-10 shadow-lg border border-white/30"
                aria-label="Close"
              >
                <X className="w-7 h-7" strokeWidth={3} />
              </button>
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.3 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="font-display text-2xl text-white font-semibold mb-2"
                >
                  Welcome Back, {providerName ? providerName.split(" ")[0] : "Provider"}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/90 text-sm mb-6 leading-relaxed"
                >
                  Planning to see patients in-person soon? Reserve your office day now to secure your time slot.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <Link
                    to={`${prefix}/book`}
                    onClick={dismissCta}
                    className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-opacity hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, hsl(270, 70%, 75%), hsl(0, 0%, 100%), hsl(270, 60%, 80%))' }}
                  >
                    <span className="bg-gradient-to-r from-primary to-[hsl(270,60%,50%)] bg-clip-text text-transparent font-bold flex items-center gap-2">
                      Schedule Office Time <ArrowRight className="w-4 h-4 text-primary" />
                    </span>
                  </Link>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="text-xs text-white/80 mt-5 tracking-wide"
                >
                  Takes less than 30 seconds
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Nav */}
      <nav
        className="relative sticky top-0 z-50 border-b border-primary/10 shadow-[0_10px_28px_-22px_hsl(270_55%_35%_/_0.45)]"
        style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), hsl(0, 0%, 100%))' }}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3">
          <div className="flex items-center justify-between rounded-2xl border border-primary/10 bg-white/90 px-3 sm:px-4 py-2.5">
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => { setNavOpen(!navOpen); setExpandedGroup(null); }}
                className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/15 flex items-center justify-center hover:bg-primary/10 transition-all duration-200"
              >
                {navOpen ? <X className="w-4 h-4 text-foreground" /> : <Menu className="w-4 h-4 text-foreground" />}
              </button>
              <img src={logo} alt="Orenda Psychiatry" className="h-6 md:h-7" />
            </div>
            <div className="flex items-center gap-3">
              {onSignOut && (
                <button onClick={onSignOut} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              )}
              <div className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-foreground/45">
                NJ In-Person Care Hub
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-screen flyout nav — lavender gradient */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60]"
            style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), hsl(0, 0%, 100%))' }}
          >
            <button
              onClick={() => { setNavOpen(false); setExpandedGroup(null); }}
              className="absolute top-6 right-6 md:right-8 w-10 h-10 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-full flex flex-col justify-between px-6 md:px-16 py-14 md:py-16">
              <div>
                <p className="font-display text-xl text-foreground mb-1">Orenda Psychiatry</p>
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 font-medium">NJ In-Person Care Hub</p>
              </div>

              <div className="space-y-1 mt-5">
                {navItems.map((item) => (
                  <div key={item.label} className="border-b border-foreground/[0.06]">
                    {"children" in item && item.children ? (
                      <div>
                        <button
                          onClick={() => setExpandedGroup(expandedGroup === item.label ? null : item.label)}
                          className="group flex items-center gap-4 w-full text-left py-3"
                        >
                          <ArrowRight className={`w-4 h-4 text-foreground/20 group-hover:text-primary transition-all duration-200 ${expandedGroup === item.label ? "rotate-90" : ""}`} />
                          <span className="font-display text-3xl md:text-4xl text-foreground group-hover:text-primary transition-colors duration-200">
                            {item.label}
                          </span>
                        </button>
                        {expandedGroup === item.label && (
                          <div className="ml-8 pl-4 border-l border-foreground/10">
                            {item.children.map((child) => (
                              <Link
                                key={child.to}
                                to={child.to}
                                onClick={() => { setNavOpen(false); setExpandedGroup(null); }}
                                className="group/sub flex items-center gap-3 py-2.5"
                              >
                                <ArrowRight className="w-3 h-3 text-foreground/15 group-hover/sub:text-primary transition-all duration-200" />
                                <span className="font-display text-xl md:text-2xl text-foreground/60 group-hover/sub:text-foreground transition-colors duration-200">
                                  {child.label}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.to}
                        onClick={() => { setNavOpen(false); setExpandedGroup(null); }}
                        className="group flex items-center gap-4 py-3"
                      >
                        <ArrowRight className="w-4 h-4 text-foreground/20 group-hover:text-primary transition-all duration-200" />
                        <span className="font-display text-3xl md:text-4xl text-foreground group-hover:text-primary transition-colors duration-200">
                          {item.label}
                        </span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-6 mt-2">
                <Link
                  to={`${prefix}/book`}
                  onClick={() => { setNavOpen(false); setExpandedGroup(null); }}
                  className="inline-flex items-center justify-center gap-2 border border-foreground/20 text-foreground text-[11px] tracking-[0.2em] uppercase font-medium px-8 py-4 rounded-lg hover:bg-foreground/5 transition-all duration-200"
                >
                  Schedule Office Time
                </Link>
                <div>
                  <p className="text-foreground/30 text-[10px] tracking-[0.3em] uppercase font-medium mb-2">Contact</p>
                  <p className="text-foreground/50 text-sm">Hoboken.Riverfront@regus.com</p>
                  <p className="text-foreground/50 text-sm">+1 (201) 721-8500</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero — full purple on mobile with image overlay, diagonal split on desktop */}
      <section className="relative overflow-hidden h-[45vh] sm:h-[50vh] md:h-[80vh] bg-primary">
        {/* Mobile: subtle image background */}
        <div className="absolute inset-0 md:hidden">
          <img src={sunsetImg} alt="" className="w-full h-full object-cover opacity-20" loading="eager" />
          <div className="absolute inset-0 bg-primary/80" />
        </div>
        {/* Desktop: diagonal clip */}
        <div className="absolute right-0 top-0 w-[55%] h-full hidden md:block" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}>
          <img src={sunsetImg} alt="Hoboken sunset" className="w-full h-full object-cover" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-primary/10 to-primary/40" />
        </div>

        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-14 w-full">
            <div className="max-w-xl">
              <motion.p variants={fadeUp} initial="hidden" animate="visible"
                className="text-white text-[10px] sm:text-xs md:text-base tracking-[0.3em] sm:tracking-[0.5em] uppercase mb-2 sm:mb-3 md:mb-6 font-body font-medium">
                New Jersey Offices
              </motion.p>
              <motion.h1 variants={fadeUp} initial="hidden" animate="visible"
                className="text-3xl sm:text-4xl md:text-8xl lg:text-9xl text-white leading-[0.95] mb-2 sm:mb-3 md:mb-6 font-display font-light">
                In-Person
                <br />
                <span className="font-semibold">Care Hub</span>
              </motion.h1>
              <div className="w-8 sm:w-10 md:w-16 h-[2px] bg-[hsl(270,70%,75%)] mb-2 sm:mb-3 md:mb-6" />
              <p className="text-white/80 text-xs sm:text-sm md:text-lg max-w-md leading-relaxed mb-4 sm:mb-5 md:mb-10 font-light">
                Everything you need for New Jersey in-person appointments.
              </p>
              <Link to={`${prefix}/book`}
                className="text-primary text-[10px] sm:text-[11px] tracking-[0.15em] uppercase font-semibold px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-md hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, hsl(270, 70%, 80%), hsl(0, 0%, 100%))' }}>
                Schedule Office Time <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section id="locations" className="py-0">
        {/* Hoboken */}
        <div className="grid md:grid-cols-2 md:min-h-[70vh] lg:min-h-[85vh]">
          <motion.div
            variants={scaleIn} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="overflow-hidden"
          >
            <Link to="/new-jersey-office-hoboken" className="group block h-full">
              <img src={hobokenImg} alt="Hoboken office" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out min-h-[200px] sm:min-h-[280px] md:min-h-[500px]" />
            </Link>
          </motion.div>
          <motion.div
            variants={slideIn} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col justify-center px-6 sm:px-8 md:px-20 py-8 sm:py-12 md:py-20 bg-[hsl(270,15%,97%)]"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-primary/60 font-semibold mb-3 sm:mb-4 md:mb-8">01 — Location</p>
            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-light text-foreground tracking-tight mb-3 sm:mb-4 md:mb-6">
              <em className="text-foreground" style={{ fontStyle: 'italic' }}>Hoboken</em>
            </h2>
            <p className="text-[hsl(270,10%,50%)] text-sm sm:text-base md:text-lg leading-relaxed mb-5 sm:mb-8 md:mb-10 max-w-md">
              Riverfront Center · Hudson County. Modern workspace for patient comfort and clinical excellence.
            </p>
            <Link to="/new-jersey-office-hoboken"
              className="group/btn inline-flex items-center gap-2 sm:gap-3 bg-primary text-primary-foreground text-[10px] sm:text-xs md:text-sm tracking-[0.2em] uppercase font-medium px-5 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-md hover:bg-primary/90 transition-colors duration-200 w-fit">
              Explore Hoboken <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Edison */}
        <div className="grid md:grid-cols-2 md:min-h-[70vh] lg:min-h-[85vh]">
          <motion.div
            variants={slideIn} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col justify-center px-6 sm:px-8 md:px-20 py-8 sm:py-12 md:py-20 bg-white order-2 md:order-1"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-primary/60 font-semibold mb-3 sm:mb-4 md:mb-8">02 — Location</p>
            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-light text-foreground tracking-tight mb-3 sm:mb-4 md:mb-6">
              <em className="text-foreground" style={{ fontStyle: 'italic' }}>Edison</em>
            </h2>
            <p className="text-[hsl(270,10%,50%)] text-sm sm:text-base md:text-lg leading-relaxed mb-5 sm:mb-8 md:mb-10 max-w-md">
              Raritan Plaza · Middlesex County. Welcoming clinical environment with modern amenities.
            </p>
            <Link to="/new-jersey-office-edison"
              className="group/btn inline-flex items-center gap-2 sm:gap-3 bg-primary text-primary-foreground text-[10px] sm:text-xs md:text-sm tracking-[0.2em] uppercase font-medium px-5 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-md hover:bg-primary/90 transition-colors duration-200 w-fit">
              Explore Edison <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          <motion.div
            variants={scaleIn} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="overflow-hidden order-1 md:order-2"
          >
            <Link to="/new-jersey-office-edison" className="group block h-full">
              <img src={edisonImg} alt="Edison office" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out min-h-[200px] sm:min-h-[280px] md:min-h-[500px]" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* NJ Admin Support Banner */}
      <Link to="/nj-admin-overview" className="group block">
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 12%) 0%, hsl(270, 80%, 28%) 50%, hsl(270, 60%, 42%) 100%)' }}>
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="admin-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#admin-dots)" />
          </svg>
          <div className="relative max-w-7xl mx-auto grid md:grid-cols-[1fr_auto] items-center">
            <div className="px-6 sm:px-10 py-10 sm:py-14 md:py-16">
              <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-white/50 font-semibold mb-2">Dedicated Support</p>
              <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-3">
                Your NJ Admin Team
              </h2>
              <p className="text-white/60 text-sm sm:text-base max-w-md mb-5">
                Office access, scheduling, patient coordination — handled for you.
              </p>
              <span className="inline-flex items-center gap-2 text-white text-xs sm:text-sm tracking-[0.15em] uppercase font-semibold group-hover:gap-3 transition-all">
                Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            <div className="hidden md:block h-full w-[340px] lg:w-[420px] overflow-hidden">
              <img src={adminImg} alt="NJ Admin support" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </section>
      </Link>

      {/* Provider Checklist Banner */}
      <Link to="/provider-checklist" className="group block">
        <section className="py-10 px-6" style={{ background: "hsl(270, 20%, 97%)" }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between rounded-2xl p-8 sm:p-10 group-hover:shadow-lg transition-shadow" style={{ background: "white", border: "1px solid hsl(270, 15%, 90%)" }}>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "hsl(270, 50%, 95%)" }}>
                <Clipboard className="w-7 h-7" style={{ color: "hsl(270, 60%, 50%)" }} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold" style={{ color: "hsl(270, 40%, 15%)" }}>Provider Checklist & SOP</h3>
                <p className="text-sm" style={{ color: "hsl(270, 10%, 50%)" }}>Onboarding steps + day-of office checklist — all in one place.</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(270, 40%, 50%)" }} />
          </div>
        </section>
      </Link>

      <NJFooter />
    </div>
  );
}
