import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Clock, CreditCard, Building, Phone, CheckCircle2, MapPin, Navigation, Car, Train, AlertCircle, ExternalLink, Mail, Users, Smartphone, Globe, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import sunsetImg from "@/assets/hoboken-sunset.png";
import hobokenImg from "@/assets/hoboken-riverfront.png";
import edisonImg from "@/assets/edison-building-glass.png";
import logo from "@/assets/orenda-logo-purple.png";
import PatientCheckInForm from "@/components/PatientCheckInForm";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (i: number = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.35, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const officeCards = [
  {
    name: "Hoboken – Riverfront Center",
    address: ["221 River Street", "9th Floor, Unit 9076", "Hoboken, NJ 07030"],
    description: "Located on the Hudson River waterfront with views of the Manhattan skyline, just minutes from New York City.",
    image: hobokenImg,
    mapLink: "https://www.google.com/maps/search/?api=1&query=221+River+Street+Hoboken+NJ+07030",
    floor: "9th Floor",
    landmark: "Look for Wonder Cafe as your landmark.",
    buildingEntry: "The building entrance is on River Street with Riverfront Center signage.",
    parking: ["Street parking available on River Street", "Parking garage inside the building"],
    transit: ["PATH Train – Hoboken Terminal (10 min walk)", "NJ Transit Bus – River Street stop"],
  },
  {
    name: "Edison Office",
    address: ["110 Fieldcrest Avenue", "3rd Floor, Unit 328", "Edison, NJ 08837"],
    description: "Convenient access for patients throughout Central New Jersey in a professional and welcoming environment.",
    image: edisonImg,
    mapLink: "https://www.google.com/maps/search/?api=1&query=110+Fieldcrest+Avenue+Edison+NJ+08837",
    floor: "3rd Floor",
    landmark: "Located within Raritan Plaza.",
    buildingEntry: "Enter the main building entrance on Fieldcrest Avenue.",
    parking: ["Free parking in the building lot", "Additional street parking nearby"],
    transit: ["NJ Transit: Edison station (short drive)", "Route 287 & NJ Turnpike nearby"],
  },
];

const arrivalSteps = [
  {
    step: "01",
    title: "Arrive 15 Min Early",
    desc: "Allow time for building access and to get settled before your appointment.",
    icon: Clock,
  },
  {
    step: "02",
    title: "Bring Photo ID",
    desc: "A valid government-issued photo ID is required.",
    icon: CreditCard,
  },
  {
    step: "03",
    title: "Go to the Correct Floor",
    desc: "Hoboken: 9th Floor. Edison: 3rd Floor.",
    icon: Building,
  },
  {
    step: "04",
    title: "Complete Digital Check-In",
    desc: "Use the check-in form to notify your provider you've arrived.",
    icon: Smartphone,
    hasCheckIn: true,
  },
];

const navLinks = [
  { label: "Find the Office", href: "#find-office" },
  { label: "Upon Arrival", href: "#arrival" },
  { label: "Need Help?", href: "#help" },
];

export default function NJPatientArrivalGuide() {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-open check-in form if ?form=true is in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("form") === "true") {
      setCheckInOpen(true);
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete("form");
      window.history.replaceState({}, "", url.pathname);
    }
  }, []);

  const scrollTo = (link: { href: string }) => {
    document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-body">
      <Helmet>
        <title>Orenda Psychiatry — Patient Arrival Guide | NJ Offices</title>
        <meta name="description" content="Everything you need for your in-person visit at Orenda Psychiatry's New Jersey offices. Find directions, check in digitally, and know what to expect." />
      </Helmet>

      {/* Check-In Dialog */}
      <PatientCheckInForm open={checkInOpen} onOpenChange={setCheckInOpen} />

      {/* ── PATIENT NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-primary/5" : "bg-white/80 backdrop-blur-sm"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Orenda Psychiatry" className="h-6 md:h-7" />
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button key={link.href} onClick={() => scrollTo(link)}
                className="text-[11px] tracking-[0.12em] uppercase font-semibold text-foreground/60 hover:text-primary px-4 py-2 rounded-lg hover:bg-primary/5 transition-all">
                {link.label}
              </button>
            ))}
            <button onClick={() => setCheckInOpen(true)}
              className="ml-3 inline-flex items-center gap-2 bg-primary text-primary-foreground text-[11px] tracking-[0.15em] uppercase font-bold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5" /> Check In
            </button>
          </div>
          {/* Mobile nav toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => setCheckInOpen(true)}
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] tracking-[0.12em] uppercase font-bold px-3.5 py-2 rounded-lg">
              <CheckCircle2 className="w-3 h-3" /> Check In
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-foreground/60 hover:text-foreground">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-primary/5 overflow-hidden">
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <button key={link.href} onClick={() => scrollTo(link)}
                    className="w-full text-left text-sm font-semibold text-foreground/70 hover:text-primary px-3 py-2.5 rounded-lg hover:bg-primary/5 transition-all">
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-14 md:pt-16">
        <div className="relative bg-primary py-12 sm:py-16 md:py-24">
          {/* Desktop image slice */}
          <div className="absolute right-0 top-0 w-[45%] h-full hidden md:block"
            style={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)' }}>
            <img src={sunsetImg} alt="" className="w-full h-full object-cover opacity-50" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-primary/40 to-primary/80" />
          </div>
          <div className="absolute inset-0 md:hidden bg-gradient-to-br from-primary via-primary to-[hsl(270,80%,30%)]" />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-8 md:px-14">
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <p className="text-white/50 text-[10px] md:text-xs tracking-[0.35em] uppercase font-medium mb-3">
                Orenda Psychiatry — New Jersey
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] font-display font-light mb-4 md:mb-6 max-w-2xl">
                Your <em className="font-semibold italic text-[hsl(270,70%,82%)]">In-Person Visit</em> Starts Here
              </h1>
              <p className="text-white/70 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mb-8">
                Find our office, check in digitally, and know what to expect — everything you need in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button onClick={() => setCheckInOpen(true)}
                  className="inline-flex items-center justify-center gap-3 bg-white text-primary text-[11px] sm:text-xs tracking-[0.18em] uppercase font-bold px-8 py-4 rounded-xl hover:bg-[hsl(270,70%,90%)] transition-all duration-300 shadow-lg">
                  <CheckCircle2 className="w-4 h-4" /> Digital Check-In
                </button>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="h-[2px] bg-gradient-to-r from-[hsl(270,70%,75%)] via-[hsl(270,50%,60%)] to-transparent" />
      </section>

      {/* ── FIND THE OFFICE ── White bg with purple dot pattern */}
      <section id="find-office" className="scroll-mt-20 relative py-16 sm:py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(270, 100%, 25%) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-[hsl(270,40%,95%)] to-transparent opacity-60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 md:px-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 md:mb-14">
            <p className="text-[11px] tracking-[0.4em] uppercase text-primary/40 font-medium mb-4">Directions & Parking</p>
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-light text-foreground tracking-tight">
              Find the <em style={{ fontStyle: 'italic' }} className="text-primary">Office</em>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {officeCards.map((office, i) => (
              <motion.div key={office.name} variants={scaleIn} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i * 0.15}
                className="bg-primary/[0.04] border border-primary/10 rounded-2xl sm:rounded-3xl overflow-hidden hover:bg-primary/[0.07] hover:border-primary/20 transition-all duration-500 shadow-sm"
              >
                {/* Office image */}
                <div className="relative h-44 sm:h-52 overflow-hidden">
                  <img src={office.image} alt={office.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(270,50%,15%)]/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5 sm:p-6">
                    <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-white font-semibold">{office.name}</h3>
                    <p className="text-white/60 text-sm mt-1">{office.description}</p>
                  </div>
                </div>

                <div className="p-5 sm:p-8">
                  {/* Address + Floor */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center shrink-0">
                      <Building className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <p className="text-foreground text-base font-semibold">{office.floor}</p>
                      <p className="text-muted-foreground text-sm">{office.address.join(", ")}</p>
                    </div>
                  </div>

                  {/* Landmark & Entry */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-foreground/75 text-sm">{office.landmark}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Navigation className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-foreground/75 text-sm">{office.buildingEntry}</p>
                    </div>
                  </div>

                  {/* Parking & Transit */}
                  <div className="grid grid-cols-2 gap-4 mb-6 border-t border-primary/10 pt-5">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Car className="w-4 h-4 text-primary" />
                        <p className="text-foreground/90 text-xs font-bold uppercase tracking-wider">Parking</p>
                      </div>
                      <ul className="space-y-2">
                        {office.parking.map((p, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground text-xs leading-relaxed">{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Train className="w-4 h-4 text-primary" />
                        <p className="text-foreground/90 text-xs font-bold uppercase tracking-wider">Transit</p>
                      </div>
                      <ul className="space-y-2">
                        {office.transit.map((t, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground text-xs leading-relaxed">{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a href={office.mapLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase font-bold px-7 py-3.5 rounded-xl hover:bg-primary/90 transition-all duration-500 shadow-lg">
                    <Navigation className="w-4 h-4" /> Get Directions <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* After-Hours Doorbell — HIGH VISIBILITY in Find the Office section */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mt-8 md:mt-12 relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[hsl(25,100%,55%)] shadow-lg shadow-[hsl(25,100%,55%)]/20">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(25, 100%, 97%), hsl(35, 100%, 95%), hsl(25, 100%, 97%))' }} />
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[hsl(25,100%,55%)] via-[hsl(35,100%,60%)] to-[hsl(25,100%,55%)]" />
            <div className="relative p-5 sm:p-8">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[hsl(25,100%,55%)] flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-2xl sm:text-3xl">🔔</span>
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-[hsl(25,100%,55%)] text-white text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-bold px-3 py-1 rounded-full mb-2">
                    ⚠️ Important — After-Hours Access
                  </div>
                  <h4 className="text-foreground font-bold text-lg sm:text-xl mb-2">Ring the Doorbell to Enter</h4>
                  <p className="text-foreground/80 text-sm sm:text-base leading-relaxed font-medium">
                    The ground floor doors are open <strong className="text-[hsl(25,100%,40%)]">7:00 AM – 6:00 PM, Monday–Friday</strong>. Outside of these hours (evenings, early mornings, and weekends), <strong className="text-[hsl(25,100%,40%)]">ring the doorbell located on the right-hand side of the building entrance</strong>. This will alert security to buzz you in.
                  </p>
                  <p className="text-foreground/60 text-sm leading-relaxed mt-3">
                    During Regus office hours (9 AM – 5 PM), a receptionist is available on the 9th floor to assist you.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHAT TO EXPECT UPON ARRIVAL ── */}
      <section id="arrival" className="scroll-mt-20 py-12 sm:py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-14">
          {/* Digital Check-In CTA at top — Purple bg with pattern */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mb-10 md:mb-14">
            <motion.button
              onClick={() => setCheckInOpen(true)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 overflow-hidden text-left group cursor-pointer"
              style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 35%) 50%, hsl(270, 60%, 50%) 100%)' }}
            >
              <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/15 transition-colors">
                  <Smartphone className="w-7 h-7 sm:w-8 sm:h-8 text-[hsl(270,70%,80%)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-display text-xl sm:text-2xl md:text-3xl font-semibold mb-1">Digital Check-In</h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    At the office? Tap here to check in and notify your provider you've arrived.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 bg-white text-primary text-[11px] tracking-[0.15em] uppercase font-bold px-6 py-3.5 rounded-xl shrink-0 group-hover:bg-[hsl(270,70%,80%)] group-hover:text-white transition-all duration-300 shadow-lg">
                  <CheckCircle2 className="w-4 h-4" /> Check In Now
                </div>
              </div>
            </motion.button>
          </motion.div>

          {/* Section heading */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10 md:mb-14">
            <p className="text-[11px] tracking-[0.4em] uppercase text-primary/40 font-medium mb-4">Arrival Guide</p>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-light text-foreground tracking-tight mb-3">
              What to Expect <em className="text-primary" style={{ fontStyle: 'italic' }}>Upon Arrival</em>
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto">
              Four simple steps when you get to the office
            </p>
          </motion.div>

          {/* 4-step grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-10 sm:mb-14">
            {arrivalSteps.map((s, i) => (
              <motion.div key={s.step} variants={scaleIn} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i * 0.1}
                className="group relative bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/10 rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-center hover:border-primary/25 hover:shadow-xl transition-all duration-500"
              >
                <span className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-primary/10 group-hover:text-primary/20 transition-colors duration-500 leading-none">{s.step}</span>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mx-auto my-3 sm:my-4 group-hover:bg-primary/15 transition-colors">
                  <s.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="text-foreground text-xs sm:text-base font-bold mb-1 sm:mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-[11px] sm:text-sm leading-relaxed hidden sm:block">{s.desc}</p>
                {s.hasCheckIn && (
                  <button
                    onClick={() => setCheckInOpen(true)}
                    className="mt-3 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] tracking-[0.12em] uppercase font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Check In Now
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* What to Bring — inline cards (no insurance card) */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-semibold text-foreground mb-6 text-center">
              What to <em className="text-primary" style={{ fontStyle: 'italic' }}>Bring</em>
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: CreditCard, title: "Valid Photo ID", desc: "Driver's license, passport, or state-issued ID" },
                { icon: Smartphone, title: "Your Phone", desc: "Needed to complete the digital check-in form" },
              ].map((item, i) => (
                <motion.div key={item.title} variants={scaleIn} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} custom={i * 0.08}
                  className="flex items-start gap-4 bg-primary/[0.03] border border-primary/8 rounded-2xl p-5 sm:p-6"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-foreground font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* After-Hours Doorbell — HIGH VISIBILITY */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[hsl(25,100%,55%)] shadow-lg shadow-[hsl(25,100%,55%)]/20">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(25, 100%, 97%), hsl(35, 100%, 95%), hsl(25, 100%, 97%))' }} />
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[hsl(25,100%,55%)] via-[hsl(35,100%,60%)] to-[hsl(25,100%,55%)]" />
            <div className="relative p-5 sm:p-8">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[hsl(25,100%,55%)] flex items-center justify-center shrink-0 shadow-md">
                  <span className="text-2xl sm:text-3xl">🔔</span>
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-[hsl(25,100%,55%)] text-white text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-bold px-3 py-1 rounded-full mb-2">
                    ⚠️ Important — After-Hours Access
                  </div>
                  <h4 className="text-foreground font-bold text-lg sm:text-xl mb-2">Ring the Doorbell to Enter</h4>
                  <p className="text-foreground/80 text-sm sm:text-base leading-relaxed font-medium">
                    If you are arriving <strong className="text-[hsl(25,100%,40%)]">after 5:00 PM</strong>, the main entrance will be locked. To enter the building, <strong className="text-[hsl(25,100%,40%)]">ring the doorbell located on the right-hand side of the building entrance</strong>. This will alert the ground floor security team to let you in.
                  </p>
                  <p className="text-foreground/60 text-sm leading-relaxed mt-3">
                    During business hours (9 AM – 5 PM), a concierge is available at the front desk to assist you. After entering, complete your digital check-in so your provider knows you've arrived.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── NEED HELP? ── */}
      <section id="help" className="scroll-mt-20 relative py-14 sm:py-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(270, 35%, 95%), hsl(270, 30%, 97%))' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 md:px-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-white rounded-3xl border border-primary/10 p-8 sm:p-10 md:p-14 shadow-sm">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground font-semibold">Need Help?</h3>
              <p className="text-muted-foreground text-sm mt-2">Our team is here to assist you with any questions.</p>
            </div>
            <div className="max-w-md mx-auto bg-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/10 text-center">
              <p className="text-xs text-primary uppercase tracking-[0.2em] font-bold mb-4">Orenda Admin Team</p>
              <a href="tel:+12016854863" className="flex items-center justify-center gap-2 text-foreground text-lg font-semibold mb-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4 text-primary" />
                (201) 685-4863
              </a>
              <a href="mailto:info@orendapsych.com" className="flex items-center justify-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors mb-2">
                <Mail className="w-4 h-4 text-primary" />
                info@orendapsych.com
              </a>
              <a href="https://www.orendapsych.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors">
                <Globe className="w-4 h-4 text-primary" />
                www.orendapsych.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative overflow-hidden">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="relative" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), hsl(270, 30%, 94%))' }}>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-10 sm:pt-14 pb-6 sm:pb-8">
            <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-12 md:gap-6 mb-10">
              <div className="md:col-span-5">
                <img src={logo} alt="Orenda Psychiatry" className="h-7 sm:h-8 mb-3" />
                <div className="space-y-2 mt-4">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-2">Orenda Admin Team</p>
                  <a href="tel:+12016854863" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                    <Phone className="w-3 h-3 text-primary/30 flex-shrink-0" />
                    (201) 685-4863
                  </a>
                  <a href="mailto:info@orendapsych.com" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                    <Mail className="w-3 h-3 text-primary/30 flex-shrink-0" />
                    info@orendapsych.com
                  </a>
                  <a href="https://www.orendapsych.com" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
                    <Globe className="w-3 h-3 text-primary/30 flex-shrink-0" />
                    www.orendapsych.com
                  </a>
                </div>
              </div>
              <div className="md:col-span-3 md:col-start-7">
                <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-3">Hoboken</p>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-foreground/70">
                  <MapPin className="w-3 h-3 text-primary/30 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">221 River St, 9th Fl, Unit 9076<br />Hoboken, NJ 07030</span>
                </div>
              </div>
              <div className="md:col-span-3">
                <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-3">Edison</p>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-foreground/70">
                  <MapPin className="w-3 h-3 text-primary/30 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">110 Fieldcrest Ave, 3rd Fl, Unit 328<br />Edison, NJ 08837</span>
                </div>
              </div>
            </div>
            <div className="border-t border-foreground/[0.08] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-foreground/30">
                © {new Date().getFullYear()} Orenda Psychiatry
              </p>
              <a href="https://www.orendapsych.com" target="_blank" rel="noopener noreferrer"
                className="text-[9px] sm:text-[10px] text-foreground/20 hover:text-foreground/40 transition-colors">
                www.orendapsych.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
