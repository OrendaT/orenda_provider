import { Link } from "react-router-dom";
import NJFooter from "@/components/NJFooter";
import NJNavbar from "@/components/NJNavbar";
import { ArrowLeft, ArrowRight, MapPin, Clock, Shield, Coffee, Car, Phone, Building2, ChevronLeft, ChevronRight, ExternalLink, Train, Users, Camera, MonitorSmartphone, Accessibility, Navigation, Mail, CalendarCheck, DoorOpen, ClipboardList, ChevronDown, AlertTriangle, Bell, X, ArrowUpRight, CreditCard, KeyRound, BadgeCheck, RotateCcw, Armchair, Scale, HeartPulse, Wifi, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import logo from "@/assets/orenda-logo-purple.png";
import buildingImg from "@/assets/edison-building-glass.png";
import p1EntranceImg from "@/assets/edison-p1-entrance.png";
import mainEntranceImg from "@/assets/edison-main-entrance.png";
import qrCodeImg from "@/assets/checkin-qr-code.png";
import officeLoungeImg from "@/assets/edison-office-lounge-pro.png";
import officeDeskImg from "@/assets/edison-office-desk-pro.png";
import keurigImg from "@/assets/edison-keurig.png";
import receptionImg from "@/assets/edison-reception.png";
import quickRefImg from "@/assets/edison-quick-reference.png";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const galleryImages = [
  { src: buildingImg, label: "Building Exterior" },
];

const facilities = [
  { icon: Shield, label: "Lobby Security" },
  { icon: Clock, label: "24/7 Access" },
  { icon: Coffee, label: "Lounge & Kitchen" },
  { icon: Car, label: "Parking Available" },
  { icon: Train, label: "Major Transport Links" },
  { icon: Users, label: "Meeting Rooms" },
  { icon: Camera, label: "24/7 CCTV" },
  { icon: MonitorSmartphone, label: "Business Lounge" },
  { icon: Navigation, label: "Near Major Highways" },
  { icon: Accessibility, label: "Wheelchair Accessible" },
];


export default function NJEdison({ isAdmin = false }: { isAdmin?: boolean }) {
  const prefix = isAdmin ? "/admin" : "/nj-office";
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % galleryImages.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-white font-body">
      <NJNavbar isAdmin={isAdmin} />

      {/* Hero — split layout */}
      <section className="relative overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[40vh] sm:min-h-[55vh] md:min-h-[70vh]">
          <div className="flex items-end md:items-center px-5 sm:px-8 md:px-14 py-8 sm:py-14 md:py-20 order-2 md:order-1"
            style={{ background: 'linear-gradient(135deg, hsl(270, 60%, 92%), hsl(0, 0%, 100%))' }}>
            <div>
              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0}
                className="text-foreground/50 text-xs md:text-sm tracking-[0.5em] uppercase mb-5 font-body">02 — Edison, New Jersey</motion.p>
              <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={0.5}
                className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-[1] mb-3 sm:mb-5">
                Raritan
                <br />
                <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Plaza</em>
              </motion.h1>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
                className="w-14 h-[2px] bg-italic-accent/40 mb-5" />
              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={1.5}
                className="text-foreground/70 text-sm md:text-base tracking-wide font-light">
                110 Fieldcrest Avenue, 3rd Floor, Unit 328
                <br />
                Edison, NJ 08837
              </motion.p>
            </div>
          </div>
          <div className="overflow-hidden order-1 md:order-2">
            <img src={buildingImg} alt="Edison Raritan Plaza" className="w-full h-full object-cover min-h-[280px]" />
          </div>
        </div>
      </section>

      {/* About This Location */}
      <section className="py-10 sm:py-16 md:py-24" style={{ background: 'linear-gradient(180deg, white 0%, hsl(270, 20%, 97%) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} className="mb-8">
            <p className="text-[10px] tracking-[0.4em] uppercase text-italic-accent font-medium mb-4">About This Location</p>
            <h2 className="font-display text-4xl md:text-6xl font-light text-foreground leading-[1.1]">
              A Professional Space for{" "}
              <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Quality Care</em>
            </h2>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.5} className="mb-12">
            <p className="font-body text-muted-foreground text-sm md:text-base leading-relaxed">
              Located at Raritan Center in Edison, our office provides a convenient, professional setting for New Jersey in-person appointments. Easily accessible from major highways including the New Jersey Turnpike and Route 1, the space offers a modern, comfortable environment for both patients and providers.
            </p>
          </motion.div>

          {/* Map + Address + Finding the Building */}
          <div className="grid lg:grid-cols-[1fr_1fr] gap-0 mb-10 rounded-2xl overflow-hidden border border-border/30 bg-white">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.5} className="min-h-[280px] sm:min-h-[420px] lg:min-h-[480px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3033.5!2d-74.3490!3d40.5180!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s110+Fieldcrest+Ave%2C+Edison%2C+NJ+08837!5e0!3m2!1sen!2sus!4v1710000000000"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Edison Office Location"
                className="w-full h-full"
              />
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="flex flex-col">
              <div className="p-8 md:p-10 flex-1 flex flex-col justify-center border-b border-border/20">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground">Address</h3>
                </div>
                <div className="space-y-1 mb-6">
                  <p className="font-body text-foreground font-medium text-sm">Regus — Raritan Plaza</p>
                  <p className="font-body text-muted-foreground text-sm">110 Fieldcrest Avenue, 3rd Floor, Unit 328</p>
                  <p className="font-body text-muted-foreground text-sm">Edison, NJ 08837</p>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=110+Fieldcrest+Avenue+Edison+NJ+08837"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-body text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-md w-fit"
                >
                  <MapPin className="w-4 h-4" />
                  Open in Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground">Finding the Building</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-primary">1</span>
                    </span>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">
                      The building is located on <span className="text-foreground font-medium">Fieldcrest Avenue</span> within the Raritan Center business park
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-primary">2</span>
                    </span>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">
                      Parking is available in the <span className="text-foreground font-medium">building lot</span> — enter through the main entrance
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-primary">3</span>
                    </span>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">
                      Take the elevator to the <span className="text-foreground font-medium">3rd Floor</span> — Regus reception will greet you
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Entrance — Large Feature */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1.5} className="mt-10 mb-10">
            <div className="rounded-2xl overflow-hidden border border-border/30 bg-white shadow-xl">
              <div className="relative">
                <img src={mainEntranceImg} alt="Edison Main Entrance — 110 Fieldcrest Ave" className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover" />
                {/* Animated walk-in indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-primary/90 backdrop-blur-sm text-primary-foreground px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2"
                  >
                    <DoorOpen className="w-4 h-4" />
                    <span className="text-xs font-semibold tracking-wide">During Business Hours</span>
                  </motion.div>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-display text-lg md:text-xl text-foreground">Main Entrance</p>
                  <p className="text-muted-foreground text-sm">110 Fieldcrest Avenue, Edison, NJ 08837</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-primary text-xs font-semibold">
                  <Clock className="w-4 h-4" />
                  Mon–Fri, 8 AM – 6 PM
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1.5}>
            <div className="bg-foreground rounded-2xl p-6 sm:p-10 md:p-14 lg:p-16 text-white">
              <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-3">Key Information</p>
              <h3 className="font-display text-3xl md:text-5xl font-light mb-12 md:mb-16 leading-tight">
                At Your{" "}
                <em className="text-italic-accent" style={{ fontStyle: "italic" }}>Fingertips</em>
              </h3>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 md:gap-14">
                {/* Building Access */}
                <div>
                  <Shield className="w-5 h-5 text-italic-accent mb-6" />
                  <h4 className="font-display text-2xl text-white mb-6">Access</h4>
                  <div className="space-y-5">
                    <div>
                      <p className="font-display text-lg text-white">Standard Hours</p>
                      <p className="font-body text-white/50 text-sm mt-1">Building doors open Mon–Fri, 8:00 AM – 6:00 PM</p>
                      <p className="font-body text-white/50 text-sm mt-1">Patients and providers enter through the <span className="text-white/80 font-medium">main front entrance</span>.</p>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div>
                      <p className="font-display text-lg text-white">Regus Front Desk</p>
                      <p className="font-body text-white/50 text-sm mt-1">3rd Floor · Mon–Fri, 9 AM – 5 PM</p>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <Phone className="w-5 h-5 text-italic-accent mb-6" />
                  <h4 className="font-display text-2xl text-white mb-6">Contact</h4>
                  <div className="space-y-5">
                    <div>
                      <p className="font-body text-italic-accent text-xs font-semibold tracking-wide uppercase mb-2">NJ Office Admin</p>
                      <a href="tel:+12016854863" className="font-display text-lg text-white hover:text-italic-accent transition-colors block">
                        (201) 685-4863
                      </a>
                      <a href="mailto:offices@orendapsych.com" className="font-body text-white/60 text-sm hover:text-italic-accent transition-colors block mt-1">
                        offices@orendapsych.com
                      </a>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div>
                      <p className="font-body text-white/40 text-xs font-semibold tracking-wide uppercase mb-2">Regus Front Desk</p>
                      <a href="tel:+17327820328" className="font-display text-lg text-white hover:text-italic-accent transition-colors block">
                        (732) 782-0328
                      </a>
                      <a href="mailto:Edison.fieldcrestave@regus.com" className="font-body text-white/60 text-sm hover:text-italic-accent transition-colors block mt-1 break-all">
                        Edison.fieldcrestave@regus.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Wi-Fi */}
                <div>
                  <Wifi className="w-5 h-5 text-italic-accent mb-6" />
                  <h4 className="font-display text-2xl text-white mb-6">Wi-Fi</h4>
                  <div className="space-y-5">
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Network</p>
                      <p className="font-display text-lg text-white">REGUS</p>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Password</p>
                      <p className="font-display text-lg text-white tracking-wider italic">167785439</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* After Hours Access */}
      <section className="py-12 sm:py-16 md:py-24" style={{ background: 'linear-gradient(180deg, hsl(270, 20%, 97%) 0%, hsl(270, 30%, 93%) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} className="mb-8 md:mb-12">
            <p className="text-[10px] tracking-[0.4em] uppercase text-italic-accent font-medium mb-4">After Business Hours</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-light text-foreground leading-[1.1]">
              After-Hours <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Access</em>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.3}>
              <div className="rounded-2xl overflow-hidden border border-border/30 shadow-xl">
                <img src={p1EntranceImg} alt="P1 Parking Level Entrance" className="w-full h-auto object-cover" />
                <div className="bg-foreground px-5 py-3 flex items-center justify-between gap-3">
                  <p className="text-white/70 text-xs font-medium tracking-wide">P1 Parking Level Entrance — 110 Fieldcrest Ave</p>
                  <a href="https://maps.app.goo.gl/hH9GjbGZo98h3eUCA" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-italic-accent text-xs font-medium hover:text-white transition-colors flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                    View on Map
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Pinned Google Map of P1 entrance */}
              <div className="mt-4 rounded-2xl overflow-hidden border border-border/30 shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d377.9!2d-74.34737!3d40.51757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3b6f0a1b2c3d4%3A0x0!2zNDDCsDMxJzAzLjMiTiA3NMKwMjAnNTAuNSJX!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus&q=40.51757,-74.34737&z=19"
                  width="100%" height="200" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="P1 Parking Level Entrance Location"
                  className="w-full"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.5}>
              <div className="bg-white rounded-2xl border border-border/30 p-6 sm:p-8 md:p-10 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl text-foreground">Before 8:00 AM & After 6:00 PM</h3>
                    <p className="text-muted-foreground text-xs mt-0.5">Monday–Friday · All Day Weekends & Holidays</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 w-7 h-7 rounded-full bg-italic-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">1</span>
                    </span>
                    <div>
                      <p className="font-display text-base text-foreground font-medium">Enter through P1 Parking Level</p>
                      <p className="font-body text-muted-foreground text-sm mt-1 leading-relaxed">
                        Both providers and patients must use the <strong className="text-foreground">P1 Parking Level entrance</strong>. The entrance is around the back of the building.
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-border/30" />

                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 w-7 h-7 rounded-full bg-italic-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">2</span>
                    </span>
                    <div>
                      <p className="font-display text-base text-foreground font-medium">Use Access Code</p>
                      <p className="font-body text-muted-foreground text-sm mt-1 leading-relaxed">
                        Enter the building access code at the P1 entrance keypad:
                      </p>
                      <div className="mt-3 inline-flex items-center gap-2 bg-foreground rounded-lg px-5 py-3">
                        <KeyRound className="w-4 h-4 text-italic-accent" />
                        <span className="font-display text-2xl text-white tracking-[0.15em]">05296</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-border/30" />

                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 w-7 h-7 rounded-full bg-italic-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">3</span>
                    </span>
                    <div>
                      <p className="font-display text-base text-foreground font-medium">Proceed to 3rd Floor</p>
                      <p className="font-body text-muted-foreground text-sm mt-1 leading-relaxed">
                        Take the elevator from the parking level to the 3rd floor, then proceed to Unit 328.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>
          {/* Office Directions & Access Banner — links to dedicated video page */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} className="mt-10 mb-10">
            <Link to="/nj-office/edison/directions" className="group block">
              <div className="rounded-2xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 12%) 0%, hsl(270, 80%, 25%) 50%, hsl(270, 60%, 40%) 100%)' }}>
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                <div className="relative flex items-center justify-between p-8 sm:p-12 md:p-16">
                  <div>
                    <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-white/40 font-semibold mb-3">Watch</p>
                    <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-3">
                      Office Directions & Access
                    </h3>
                    <p className="text-white/60 text-sm sm:text-base max-w-md leading-relaxed">
                      Watch a quick video walkthrough to find the building, park, and get to our suite.
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center justify-center w-20 h-20 rounded-full group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, hsl(270, 80%, 55%), hsl(280, 90%, 40%))', boxShadow: '0 8px 30px rgba(128,0,255,0.4)' }}>
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>


      {/* Private Office — Full Bleed */}
      <section className="py-20 md:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(270, 60%, 10%) 0%, hsl(270, 40%, 20%) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            <h2 className="font-display text-6xl md:text-8xl lg:text-9xl font-light text-white leading-[0.9] tracking-tight mb-6">
              Our Private <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Office</em>
            </h2>
            <p className="text-white/40 text-sm mb-16 max-w-md mx-auto">Fully equipped. Reserved for you.</p>
          </motion.div>

          {/* Large icon circles */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {([
              { icon: Armchair, label: "Patient Seating" },
              { icon: Scale, label: "Weight Scale" },
              { icon: HeartPulse, label: "BP Cuff" },
              { icon: Wifi, label: "Wi-Fi" },
            ] as const).map((a, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.08}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <a.icon className="w-8 h-8 md:w-10 md:h-10 text-italic-accent" />
                </div>
                <span className="text-white/70 text-xs font-medium tracking-wide">{a.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Office photos */}
          {/* Private office images */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8 max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <img src={officeLoungeImg} alt="Edison private office" className="w-full h-64 md:h-80 object-cover" />
              <div className="bg-white/[0.04] px-4 py-2">
                <p className="text-white/50 text-xs">Private Office</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <img src={officeDeskImg} alt="Edison office provider workspace" className="w-full h-64 md:h-80 object-cover" />
              <div className="bg-white/[0.04] px-4 py-2">
                <p className="text-white/50 text-xs">Provider Workspace</p>
              </div>
            </div>
          </div>

          {/* Building amenities images */}
          <div className="grid sm:grid-cols-3 gap-4 mb-16 max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <img src={receptionImg} alt="Edison patient waiting area" className="w-full h-52 md:h-64 object-cover" />
              <div className="bg-white/[0.04] px-4 py-2">
                <p className="text-white/50 text-xs">Patient Waiting Area</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <img src={keurigImg} alt="Edison coffee station" className="w-full h-52 md:h-64 object-cover" />
              <div className="bg-white/[0.04] px-4 py-2">
                <p className="text-white/50 text-xs">Coffee & Beverage Station</p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <img src={quickRefImg} alt="Edison office quick reference guide" className="w-full h-52 md:h-64 object-cover" />
              <div className="bg-white/[0.04] px-4 py-2">
                <p className="text-white/50 text-xs">Quick Reference Guide</p>
              </div>
            </div>
          </div>

          {/* Policies — minimal horizontal bar */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.6}>
            <div className="inline-flex flex-wrap justify-center gap-3 mb-12">
              {([
                { icon: KeyRound, label: "Return key to lockbox after visit" },
                { icon: DoorOpen, label: "Leave office clean & reset" },
              ] as const).map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-5 py-2.5">
                  <p.icon className="w-3.5 h-3.5 text-italic-accent" />
                  <span className="text-white/70 text-xs">{p.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.8}>
            <Link to={`${prefix}/book`}
              className="inline-flex items-center gap-3 bg-italic-accent text-foreground font-body text-sm font-semibold px-8 py-4 rounded-full hover:bg-italic-accent/90 transition-all shadow-lg">
              <CalendarCheck className="w-5 h-5" />
              Schedule Office Time
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Workspace Environment — Single Image (gallery coming soon) */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, hsl(270,25%,94%) 0%, hsl(270,35%,88%) 40%, hsl(270,45%,82%) 70%, hsl(270,60%,70%) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
        <div className="relative max-w-7xl mx-auto px-8 py-20 md:py-28">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} className="mb-12">
            <p className="text-[10px] tracking-[0.4em] uppercase text-foreground/40 font-medium mb-4">The Space</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground tracking-tight">
              Workspace <em className="text-primary" style={{ fontStyle: 'italic' }}>Environment</em>
            </h2>
            <p className="text-foreground/50 text-sm leading-relaxed mt-4 max-w-lg">
              Our Edison office is situated within a premium shared workspace featuring modern amenities, professional common areas, and a welcoming atmosphere suited for healthcare professionals.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <div className="relative rounded-2xl overflow-hidden bg-white/20 border border-white/10 shadow-2xl">
              <div className="aspect-[16/9] relative overflow-hidden">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.img
                    key={current}
                    src={galleryImages[current].src}
                    alt={galleryImages[current].label}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <p className="text-white text-sm font-medium tracking-wide">{galleryImages[current].label}</p>
                  <p className="text-white/50 text-[10px] tracking-[0.3em] uppercase mt-1">
                    {current + 1} / {galleryImages.length}
                  </p>
                </div>
                {galleryImages.length > 1 && (
                  <>
                    <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 border border-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 border border-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Facilities */}
      <section id="facilities" className="py-14 md:py-20 bg-[hsl(270,15%,96%)] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="mb-8 md:mb-12">
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground font-medium mb-3 md:mb-4">Amenities</p>
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground tracking-tight">
              Building <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Facilities</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {facilities.map((f) => (
              <div
                key={f.label}
                className="bg-white border border-border/30 rounded-xl p-4 md:p-6 flex items-center md:items-start gap-3 md:gap-4 hover:shadow-md hover:border-accent/20 transition-all duration-300"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[hsl(270,30%,93%)] flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 md:w-5 md:h-5 text-accent/60" />
                </div>
                <p className="text-foreground text-sm font-medium leading-tight md:pt-2">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NJFooter />
    </div>
  );
}