import { Link } from "react-router-dom";
import { Shield, ArrowRight, Clock, ShieldCheck, Coffee, Car, BookOpen, Stethoscope, FileCheck, CalendarCheck, HelpCircle, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import logo from "@/assets/orenda-logo-purple.png";
import hobokenImg from "@/assets/hoboken-riverfront.png";
import edisonImg from "@/assets/edison-building-glass.png";
import sunsetImg from "@/assets/hoboken-sunset.png";
import NJFooter from "@/components/NJFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" as const } },
};

const slideIn = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const PREFIX = "/public";

const navItems = [
  {
    label: "Offices",
    to: "",
    children: [
      { to: `${PREFIX}/hoboken`, label: "Hoboken" },
      { to: `${PREFIX}/edison`, label: "Edison" },
    ],
  },
  { label: "Schedule Office Time", to: `${PREFIX}/book` },
  { label: "Provider Scheduling Guide", to: `${PREFIX}/provider-ops` },
  { label: "FAQ", to: `${PREFIX}/faq` },
];

export default function PublicProviderHub() {
  const [navOpen, setNavOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white font-body">
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
            <div className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-foreground/45">
              NJ In-Person Care Hub
            </div>
          </div>
        </div>
      </nav>

      {/* Full-screen flyout nav */}
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

              <div className="space-y-1 -mt-8">
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

              <div className="space-y-6">
                <Link
                  to={`${PREFIX}/book`}
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

      {/* Hero */}
      <section className="relative overflow-hidden h-[45vh] sm:h-[50vh] md:h-[80vh] bg-primary">
        <div className="absolute inset-0 md:hidden">
          <img src={sunsetImg} alt="" className="w-full h-full object-cover opacity-20" loading="eager" />
          <div className="absolute inset-0 bg-primary/80" />
        </div>
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
              <Link to={`${PREFIX}/book`}
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
          <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="overflow-hidden">
            <Link to={`${PREFIX}/hoboken`} className="group block h-full">
              <img src={hobokenImg} alt="Hoboken office" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out min-h-[200px] sm:min-h-[280px] md:min-h-[500px]" />
            </Link>
          </motion.div>
          <motion.div variants={slideIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col justify-center px-6 sm:px-8 md:px-20 py-8 sm:py-12 md:py-20 bg-[hsl(270,15%,97%)]">
            <p className="text-xs tracking-[0.4em] uppercase text-primary/60 font-semibold mb-3 sm:mb-4 md:mb-8">01 — Location</p>
            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-light text-foreground tracking-tight mb-3 sm:mb-4 md:mb-6">
              <em className="text-foreground" style={{ fontStyle: 'italic' }}>Hoboken</em>
            </h2>
            <p className="text-[hsl(270,10%,50%)] text-sm sm:text-base md:text-lg leading-relaxed mb-5 sm:mb-8 md:mb-10 max-w-md">
              Riverfront Center · Hudson County. Modern workspace for patient comfort and clinical excellence.
            </p>
            <Link to={`${PREFIX}/hoboken`}
              className="group/btn inline-flex items-center gap-2 sm:gap-3 bg-primary text-primary-foreground text-[10px] sm:text-xs md:text-sm tracking-[0.2em] uppercase font-medium px-5 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-md hover:bg-primary/90 transition-colors duration-200 w-fit">
              Explore Hoboken <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Edison */}
        <div className="grid md:grid-cols-2 md:min-h-[70vh] lg:min-h-[85vh]">
          <motion.div variants={slideIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            className="flex flex-col justify-center px-6 sm:px-8 md:px-20 py-8 sm:py-12 md:py-20 bg-white order-2 md:order-1">
            <p className="text-xs tracking-[0.4em] uppercase text-primary/60 font-semibold mb-3 sm:mb-4 md:mb-8">02 — Location</p>
            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-light text-foreground tracking-tight mb-3 sm:mb-4 md:mb-6">
              <em className="text-foreground" style={{ fontStyle: 'italic' }}>Edison</em>
            </h2>
            <p className="text-[hsl(270,10%,50%)] text-sm sm:text-base md:text-lg leading-relaxed mb-5 sm:mb-8 md:mb-10 max-w-md">
              Raritan Plaza · Middlesex County. Welcoming clinical environment with modern amenities.
            </p>
            <Link to={`${PREFIX}/edison`}
              className="group/btn inline-flex items-center gap-2 sm:gap-3 bg-primary text-primary-foreground text-[10px] sm:text-xs md:text-sm tracking-[0.2em] uppercase font-medium px-5 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-md hover:bg-primary/90 transition-colors duration-200 w-fit">
              Explore Edison <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          <motion.div variants={scaleIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
            className="overflow-hidden order-1 md:order-2">
            <Link to={`${PREFIX}/edison`} className="group block h-full">
              <img src={edisonImg} alt="Edison office" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out min-h-[200px] sm:min-h-[280px] md:min-h-[500px]" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Provider Guide */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[60vh] md:min-h-[80vh] bg-primary">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-14 py-12 sm:py-16 md:py-32">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-24 items-center">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase mb-4 md:mb-6 font-medium">For Providers</p>
                <h2 className="font-display text-3xl sm:text-4xl md:text-7xl font-light text-white leading-[1.05] mb-3 sm:mb-4 md:mb-6">
                  Provider
                  <br />
                  <em className="text-[hsl(270,70%,75%)]" style={{ fontStyle: 'italic' }}>Guide</em>
                </h2>
                <div className="w-16 md:w-20 h-[2px] bg-gradient-to-r from-[hsl(270,70%,75%)] to-transparent mb-6 md:mb-8" />
                <p className="text-white/50 text-sm md:text-base max-w-md leading-relaxed font-light mb-8 md:mb-10">
                  Everything you need to prepare for and complete a successful office day in New Jersey — from scheduling to departure.
                </p>
                <Link
                  to={`${PREFIX}/provider-ops`}
                  className="group/btn inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase font-semibold px-8 md:px-10 py-4 md:py-5 rounded-lg transition-all duration-300 w-fit bg-white text-primary hover:bg-[hsl(270,70%,75%)] hover:text-white"
                >
                  Open Provider Guide <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {[
                  { icon: BookOpen, title: "Scheduling", desc: "Sign up for office days and schedule patients accordingly." },
                  { icon: Shield, title: "Building Access", desc: "Keycard entry, lockbox codes, and arrival instructions." },
                  { icon: Stethoscope, title: "Office Essentials", desc: "Scale, BP cuff, Wi-Fi, water, coffee — everything's ready." },
                  { icon: FileCheck, title: "End of Visit", desc: "Reset the space, lock up, and departure checklist." },
                ].map((item) => (
                  <div key={item.title}
                    className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 md:p-7 hover:bg-white/[0.12] transition-all duration-200">
                    <div className="w-9 md:w-11 h-9 md:h-11 rounded-xl bg-white/[0.08] flex items-center justify-center mb-3 md:mb-5">
                      <item.icon className="w-4 md:w-5 h-4 md:h-5 text-[hsl(270,70%,80%)]" />
                    </div>
                    <p className="text-white text-xs md:text-sm font-medium mb-1">{item.title}</p>
                    <p className="text-white/40 text-[10px] md:text-xs leading-relaxed hidden md:block">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access — no patient booking */}
      <section className="bg-[hsl(270,15%,97%)] border-t border-[hsl(270,15%,92%)]">
        <div className="max-w-7xl mx-auto">
          <div className="px-6 md:px-8 pt-16 md:pt-24 pb-10 md:pb-16">
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary/40 font-medium mb-3 md:mb-4">Resources</p>
            <h2 className="text-3xl md:text-6xl font-display font-light text-foreground tracking-tight">
              Quick{" "}
              <em className="text-primary" style={{ fontStyle: 'italic' }}>Access</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            {[
              { to: `${PREFIX}/book`, icon: CalendarCheck, label: "Schedule", italic: "Office Time", desc: "Book your in-office day and see provider availability." },
              { to: `${PREFIX}/faq`, icon: HelpCircle, label: "Frequently", italic: "Asked", desc: "Answers to common questions about NJ office operations." },
            ].map((item) => (
              <Link key={item.label} to={item.to}
                className="group block border-t border-r border-[hsl(270,15%,92%)] bg-white hover:bg-[hsl(270,15%,97%)] transition-all duration-300 p-5 md:p-10 min-h-[180px] md:min-h-[280px] flex flex-col justify-between">
                <div>
                  <item.icon className="w-5 md:w-7 h-5 md:h-7 text-primary/15 mb-4 md:mb-6 group-hover:text-primary/50 transition-colors duration-300" />
                  <h3 className="text-base md:text-2xl font-display font-light text-foreground tracking-tight mb-1 md:mb-2">
                    {item.label}{" "}
                    <em className="text-primary" style={{ fontStyle: 'italic' }}>{item.italic}</em>
                  </h3>
                  <p className="text-[hsl(270,10%,55%)] text-xs md:text-sm leading-relaxed max-w-xs hidden md:block">{item.desc}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-primary text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-medium mt-4 md:mt-6 group-hover:gap-4 transition-all duration-300">
                  Open <ArrowRight className="w-3 md:w-3.5 h-3 md:h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <NJFooter />
    </div>
  );
}
