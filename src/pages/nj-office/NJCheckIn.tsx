import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import NJFooter from "@/components/NJFooter";
import NJNavbar from "@/components/NJNavbar";
import PatientScheduling from "@/components/PatientScheduling";
import MobileBookingFlow from "@/components/MobileBookingFlow";
import PatientCheckInForm from "@/components/PatientCheckInForm";
import { useEffect, useState } from "react";
import { Clock, CreditCard, Building, Phone, CheckCircle2, MapPin, Navigation, Car, Train, Shield, AlertCircle, ExternalLink, Mail, Users, ArrowRight, Smartphone, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import sunsetImg from "@/assets/hoboken-sunset.png";
import hobokenImg from "@/assets/hoboken-riverfront.png";
import edisonImg from "@/assets/edison-building-glass.png";

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

const checkInPath = "/nj-office/check-in";

const officeCards = [
  {
    name: "Hoboken – Riverfront Center",
    address: ["221 River Street", "9th Floor, Unit 9076", "Hoboken, NJ 07030"],
    description: "Located on the Hudson River waterfront with views of the Manhattan skyline, our Hoboken office offers a modern and professional setting just minutes from New York City.",
    image: hobokenImg,
    link: "/nj-office/hoboken",
    mapLink: "https://www.google.com/maps/search/?api=1&query=221+River+Street+Hoboken+NJ+07030",
    floor: "9th Floor",
    landmark: "Look for Wonder Cafe as your landmark.",
    buildingEntry: "The building entrance is located on River Street with Riverfront Center signage.",
    parking: ["Street parking available on River Street", "Parking garage inside the building"],
    transit: ["PATH Train – Hoboken Terminal (10 minute walk)", "NJ Transit Bus – River Street stop"],
    phone: "+1 (201) 721-8500",
    email: "Hoboken.Riverfront@regus.com",
  },
  {
    name: "Edison Office",
    address: ["110 Fieldcrest Avenue", "3rd Floor, Unit 328", "Edison, NJ 08837"],
    description: "Our Edison office provides convenient access for patients throughout Central New Jersey in a professional and welcoming environment.",
    image: edisonImg,
    link: "/nj-office/edison",
    mapLink: "https://www.google.com/maps/search/?api=1&query=110+Fieldcrest+Avenue+Edison+NJ+08837",
    floor: "3rd Floor",
    landmark: "Located within Raritan Plaza.",
    buildingEntry: "Enter the main building entrance on Fieldcrest Avenue.",
    parking: ["Free parking available in the building lot", "Additional street parking nearby"],
    transit: ["NJ Transit: Edison station (short drive)", "Route 287 & NJ Turnpike nearby"],
    phone: "+1 (732) 782-0328",
    email: "Edison.fieldcrestave@regus.com",
  },
];

const arrivalSteps = [
  {
    step: "01",
    title: "Arrive Early",
    desc: "Please arrive 15 minutes before your appointment for building access and check-in.",
    icon: Clock,
  },
  {
    step: "02",
    title: "Bring Photo ID",
    desc: "A valid government-issued photo ID is required: driver's license, passport, or state ID.",
    icon: CreditCard,
  },
  {
    step: "03",
    title: "Go to the Correct Floor",
    desc: "Hoboken Office: 9th Floor. Edison Office: 3rd Floor.",
    icon: Building,
  },
  {
    step: "04",
    title: "Complete Digital Check-In",
    desc: "Use the digital form sent to you to check in. This notifies your provider that you have arrived.",
    icon: Smartphone,
  },
];

export default function NJCheckIn({ isAdmin = false }: { isAdmin?: boolean }) {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("form") === "true") {
      setCheckInOpen(true);
    }
  }, [searchParams]);

  const handleCheckInOpenChange = (open: boolean) => {
    setCheckInOpen(open);

    if (!open && searchParams.get("form") === "true") {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("form");
      setSearchParams(nextParams, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-white font-body">
      <PatientCheckInForm open={checkInOpen} onOpenChange={handleCheckInOpenChange} />
      <Helmet>
        <title>Orenda Psychiatry — NJ In-Office Appointments</title>
        <meta name="description" content="Schedule your in-person visit at Orenda Psychiatry's New Jersey offices in Hoboken or Edison. Book online, get directions, and check in digitally." />
        <meta property="og:title" content="Orenda Psychiatry — New Jersey In-Office Appointments" />
        <meta property="og:description" content="Schedule your in-person visit at our Hoboken or Edison offices. Easy online booking, directions, and digital check-in." />
        <meta property="og:image" content="https://orenda-njoffice-guide.lovable.app/og-checkin.png" />
        <meta property="og:url" content="https://orenda-njoffice-guide.lovable.app/nj-office/check-in" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Orenda Psychiatry — New Jersey In-Office Appointments" />
        <meta name="twitter:image" content="https://orenda-njoffice-guide.lovable.app/og-checkin.png" />
      </Helmet>
      <NJNavbar isAdmin={isAdmin} />

      {/* ── 1. Hero Banner (compact, full-width) ── */}
      <section className="relative overflow-hidden h-[14vh] sm:h-[18vh] md:h-[22vh] bg-primary">
        {/* Mobile: subtle gradient background */}
        <div className="absolute inset-0 md:hidden bg-gradient-to-r from-primary via-primary to-[hsl(270,80%,35%)]" />
        
        {/* Desktop: diagonal image slice */}
        <div 
          className="absolute right-0 top-0 w-[45%] h-full hidden md:block" 
          style={{ clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)' }}
        >
          <img src={sunsetImg} alt="" className="w-full h-full object-cover opacity-60" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-primary/30 to-primary/70" />
        </div>
        
        {/* Content - full width, compact */}
        <div className="relative h-full flex items-center w-full">
          <div className="w-full px-4 sm:px-6 md:px-12 lg:px-16">
            <motion.div 
              variants={fadeUp} 
              initial="hidden" 
              animate="visible"
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-8"
            >
              {/* Left: Title */}
              <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden md:block w-1 h-12 bg-[hsl(270,70%,75%)] rounded-full" />
                <div>
                  <p className="text-white/60 text-[10px] md:text-xs tracking-[0.3em] uppercase font-body font-medium mb-1">
                    Book Your Visit
                  </p>
                  <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-white leading-tight font-display font-light">
                    New Jersey <span className="font-semibold italic">Appointments</span>
                  </h1>
                </div>
              </div>
              
              {/* Right: Subtitle (desktop only) */}
              <p className="hidden lg:block text-white/70 text-sm max-w-xs leading-relaxed font-light text-right">
                Schedule in-person visits at our Hoboken or Edison offices
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[hsl(270,70%,75%)] via-[hsl(270,50%,60%)] to-transparent" />
      </section>

      {/* ── 2. Schedule Your Visit ── */}
      <section className="pt-2 pb-6 sm:pt-4 sm:pb-8 md:pt-6 md:pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-light text-foreground tracking-tight">
              Schedule Your <em className="text-primary" style={{ fontStyle: 'italic' }}>Visit</em>
            </h2>
          </motion.div>
        </div>
        {/* Mobile: Zocdoc-style booking flow */}
        <MobileBookingFlow />
        {/* Desktop: existing calendar-based scheduling */}
        <div className="hidden md:block">
          <PatientScheduling />
        </div>
      </section>

      {/* ── 3. Our New Jersey Office Locations ── */}
      <section className="py-10 sm:py-16 md:py-24 bg-[hsl(270,15%,97%)] border-t border-[hsl(270,15%,92%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary/40 font-medium mb-4">Locations</p>
            <h2 className="text-4xl md:text-6xl font-display font-light text-foreground tracking-tight">
              Our New Jersey <em className="text-primary" style={{ fontStyle: 'italic' }}>Office Locations</em>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {officeCards.map((office, i) => (
              <motion.div key={office.name} variants={scaleIn} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i * 0.15}
                className="bg-white rounded-3xl overflow-hidden border border-[hsl(270,15%,90%)] hover:shadow-xl transition-all duration-500 group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={office.image} alt={office.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="font-display text-2xl text-white font-semibold">{office.name}</h3>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      {office.address.map((line, j) => (
                        <p key={j} className="text-foreground text-sm">{line}</p>
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">{office.description}</p>
                  <div className="flex gap-3">
                    <Link to={office.link}
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-[11px] tracking-[0.15em] uppercase font-semibold px-6 py-3.5 rounded-lg hover:bg-primary/90 transition-colors">
                      View Office Information <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <a href={office.mapLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-[hsl(270,15%,90%)] text-foreground text-[11px] tracking-[0.15em] uppercase font-semibold px-5 py-3.5 rounded-lg hover:border-primary/30 transition-colors">
                      <Navigation className="w-3.5 h-3.5" /> Directions
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Find the Office — Directions (PURPLE PATTERNED) ── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Deep purple patterned backdrop */}
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-[hsl(270,80%,25%)] to-transparent opacity-40" />
        
        <div className="relative max-w-7xl mx-auto px-8 md:px-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-14">
            <p className="text-[11px] tracking-[0.4em] uppercase text-white/40 font-medium mb-4">Directions</p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-light text-white tracking-tight">
              Find the <em style={{ fontStyle: 'italic' }} className="text-[hsl(270,70%,80%)]">Office</em>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {officeCards.map((office, i) => (
              <motion.div key={office.name} variants={scaleIn} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i * 0.15}
                className="bg-white/10 border border-white/15 rounded-3xl p-5 sm:p-8 md:p-10 hover:bg-white/15 transition-all duration-500"
              >
                {/* Office name large */}
                <h3 className="font-display text-3xl md:text-4xl text-white font-semibold mb-6">{office.name}</h3>
                
                {/* Address + Floor — big visual */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                    <Building className="w-8 h-8 text-[hsl(270,70%,80%)]" />
                  </div>
                  <div>
                    <p className="text-white text-lg font-semibold">{office.floor}</p>
                    <p className="text-white/60 text-sm">{office.address.join(", ")}</p>
                  </div>
                </div>

                {/* Landmark & Entry — icon rows */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[hsl(270,70%,80%)]/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[hsl(270,70%,80%)]" />
                    </div>
                    <p className="text-white/80 text-sm">{office.landmark}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[hsl(270,70%,80%)]/20 flex items-center justify-center shrink-0">
                      <Navigation className="w-5 h-5 text-[hsl(270,70%,80%)]" />
                    </div>
                    <p className="text-white/80 text-sm">{office.buildingEntry}</p>
                  </div>
                </div>

                {/* Contact row */}
                <div className="flex flex-wrap gap-4 mb-8 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[hsl(270,70%,80%)]" />
                    <span className="text-white/70 text-sm">{office.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[hsl(270,70%,80%)]" />
                    <span className="text-white/70 text-sm">{office.email}</span>
                  </div>
                </div>

                <a href={office.mapLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-primary text-[11px] tracking-[0.2em] uppercase font-bold px-8 py-4 rounded-xl hover:bg-[hsl(270,70%,80%)] hover:text-white transition-all duration-500 shadow-lg">
                  <Navigation className="w-4 h-4" /> Get Directions <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Patient Check-In (WHITE with infographic steps) ── */}
      <section className="py-12 sm:py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-8 md:px-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] tracking-[0.4em] uppercase text-primary/40 font-medium mb-4">Arrival Guide</p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-light text-foreground tracking-tight mb-4">
              Patient <em className="text-primary" style={{ fontStyle: 'italic' }}>Check-In</em>
            </h2>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">Four simple steps when you arrive</p>
          </motion.div>

          {/* Infographic steps — large numbered cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-16">
            {arrivalSteps.map((s, i) => (
              <motion.div key={s.step} variants={scaleIn} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i * 0.1}
                className="group relative bg-gradient-to-br from-primary/5 to-primary/[0.02] border border-primary/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center hover:border-primary/25 hover:shadow-xl transition-all duration-500"
              >
                {/* Large step number */}
                <span className="text-4xl sm:text-6xl md:text-7xl font-display font-bold text-primary/10 group-hover:text-primary/20 transition-colors duration-500 leading-none">{s.step}</span>
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mx-auto my-3 sm:my-5 group-hover:bg-primary/15 transition-colors">
                  <s.icon className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="text-foreground text-sm sm:text-lg font-bold mb-1 sm:mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed hidden sm:block">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Digital Check-In CTA — dark card */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="relative bg-foreground rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-14 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            <div className="relative flex flex-col md:flex-row md:items-center gap-5 sm:gap-8">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Smartphone className="w-7 h-7 sm:w-10 sm:h-10 text-[hsl(270,70%,80%)]" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-display text-2xl md:text-3xl font-semibold mb-2">Digital Check-In</h4>
                <p className="text-white/50 text-sm leading-relaxed max-w-lg">
                  Complete your check-in form to notify your provider you've arrived. Your provider will come greet you.
                </p>
              </div>
              <button
                onClick={() => setCheckInOpen(true)}
                className="inline-flex items-center gap-3 bg-white text-primary text-[11px] tracking-[0.2em] uppercase font-bold px-8 py-4 rounded-xl hover:bg-[hsl(270,70%,80%)] hover:text-white transition-all duration-500 shadow-lg shrink-0">
                <CheckCircle2 className="w-4 h-4" /> Click Here to Check In
              </button>
            </div>
          </motion.div>

          {/* After-Hours — inline callout */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mt-8 flex items-start gap-5 bg-primary/5 border border-primary/10 rounded-2xl p-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-foreground font-bold text-lg mb-2">After 5:00 PM</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Office doors are secured after hours. Complete your digital check-in upon arrival — your provider will greet you after check-in. During business hours (9 AM – 5 PM), a concierge is available at the front desk.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 6. Parking & Transit (LAVENDER GRADIENT) ── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), hsl(270, 25%, 94%), hsl(270, 40%, 96%))' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(270,50%,50%) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="relative max-w-7xl mx-auto px-8 md:px-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] tracking-[0.4em] uppercase text-primary/40 font-medium mb-4">Getting There</p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-light text-foreground tracking-tight">
              Parking & <em className="text-primary" style={{ fontStyle: 'italic' }}>Transit</em>
            </h2>
          </motion.div>

          <div className="space-y-12">
            {officeCards.map((office, i) => (
              <motion.div key={office.name} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i * 0.1}>
                <h3 className="font-display text-2xl md:text-3xl text-foreground font-semibold mb-6">{office.name}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Parking card */}
                  <div className="bg-white rounded-3xl p-8 border border-primary/8 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                      <Car className="w-7 h-7 text-primary" />
                    </div>
                    <h4 className="text-foreground font-bold text-lg mb-4">Parking</h4>
                    <ul className="space-y-4">
                      {office.parking.map((p, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="text-foreground/80 text-sm">{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Transit card */}
                  <div className="bg-white rounded-3xl p-8 border border-primary/8 shadow-sm">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                      <Train className="w-7 h-7 text-primary" />
                    </div>
                    <h4 className="text-foreground font-bold text-lg mb-4">Public Transit</h4>
                    <ul className="space-y-4">
                      {office.transit.map((t, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="text-foreground/80 text-sm">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. What to Bring (PURPLE PATTERNED) ── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-gradient-to-tr from-[hsl(270,80%,20%)] to-transparent opacity-50 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-8 md:px-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] tracking-[0.4em] uppercase text-white/40 font-medium mb-4">Be Prepared</p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-light text-white tracking-tight">
              What to <em style={{ fontStyle: 'italic' }} className="text-[hsl(270,70%,80%)]">Bring</em>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: CreditCard, title: "Valid Photo ID", desc: "Driver's license, passport, or state-issued ID" },
              { icon: Shield, title: "Insurance Card", desc: "Bring your card for verification at check-in" },
              { icon: Smartphone, title: "Your Phone", desc: "Needed to complete the digital check-in form" },
            ].map((item, i) => (
              <motion.div key={item.title} variants={scaleIn} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i * 0.1}
                className="bg-white/10 border border-white/15 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center hover:bg-white/15 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="w-8 h-8 text-[hsl(270,70%,80%)]" />
                </div>
                <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Good to Know (WHITE with large icons) ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-8 md:px-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[11px] tracking-[0.4em] uppercase text-primary/40 font-medium mb-4">Important</p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-light text-foreground tracking-tight">
              Good to <em className="text-primary" style={{ fontStyle: 'italic' }}>Know</em>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "15 Min Early", desc: "Allow time for building access and check-in", color: "bg-primary" },
              { icon: Users, title: "Provider Escort", desc: "Your provider will greet and escort you", color: "bg-[hsl(270,60%,45%)]" },
              { icon: Mail, title: "Check Messages", desc: "Look for your check-in link before arriving", color: "bg-[hsl(270,50%,35%)]" },
            ].map((item, i) => (
              <motion.div key={item.title} variants={scaleIn} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i * 0.1}
                className="group text-center"
              >
                <div className={`w-20 h-20 rounded-3xl ${item.color} flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-105 transition-transform duration-500`}>
                  <item.icon className="w-9 h-9 text-white" />
                </div>
                <h3 className="text-foreground text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Contact (LAVENDER) ── */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(270, 35%, 95%), hsl(270, 30%, 97%))' }} />
        <div className="relative max-w-7xl mx-auto px-8 md:px-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-white rounded-3xl border border-primary/10 p-10 md:p-14 shadow-sm">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-3xl md:text-4xl text-foreground font-semibold">Need Help?</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {officeCards.map((office) => (
                <div key={office.name} className="bg-primary/5 rounded-2xl p-6 border border-primary/10 text-center">
                  <p className="text-xs text-primary uppercase tracking-[0.2em] font-bold mb-3">{office.name}</p>
                  <p className="text-foreground text-base font-semibold">{office.phone}</p>
                  <p className="text-muted-foreground text-sm mt-1">{office.email}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <NJFooter />
    </div>
  );
}
