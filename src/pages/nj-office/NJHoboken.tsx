import { Link } from "react-router-dom";
import NJFooter from "@/components/NJFooter";
import NJNavbar from "@/components/NJNavbar";
import { ArrowLeft, ArrowRight, MapPin, Clock, Shield, Coffee, Car, Phone, Building2, ChevronLeft, ChevronRight, ExternalLink, Train, Users, Camera, Bike, MonitorSmartphone, Accessibility, Navigation, Mail, CalendarCheck, DoorOpen, ClipboardList, ChevronDown, AlertTriangle, Bell, X, ArrowUpRight, CreditCard, KeyRound, BadgeCheck, RotateCcw, Armchair, Scale, HeartPulse, Wifi, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import logo from "@/assets/orenda-logo-purple.png";
import buildingImg from "@/assets/hoboken-riverfront.png";
import buildingExterior2Img from "@/assets/hoboken-building-exterior-2.png";
import buildingEntranceImg from "@/assets/hoboken-building-entrance.png";
import doorbellImg from "@/assets/hoboken-doorbell.png";
import lobbyTurnstileImg from "@/assets/hoboken-lobby-turnstile.png";
import ninthFloorImg from "@/assets/hoboken-9th-floor-entrance.png";
import lockboxImg from "@/assets/hoboken-lockbox.png";
import receptionImg from "@/assets/hoboken/reception.png";
import loungeImg from "@/assets/hoboken/lounge.png";
import lounge2Img from "@/assets/hoboken/lounge2.png";
import kitchenImg from "@/assets/hoboken/kitchen.png";
import coworkingImg from "@/assets/hoboken/coworking.png";
import officeSeatingImg from "@/assets/hoboken-office-seating.png";
import officeFullImg from "@/assets/hoboken-office-full.png";
import qrCodeImg from "@/assets/checkin-qr-code.png";

// Minimal, fast animation — no stagger delays
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const galleryImages = [
  { src: buildingImg, label: "Building Exterior" },
  { src: buildingExterior2Img, label: "Building Entrance — 221 River St" },
  { src: doorbellImg, label: "Doorbell — Ring for After-Hours Access" },
  { src: lobbyTurnstileImg, label: "Lobby Security — Use Swipe Pass or Day Pass" },
  { src: ninthFloorImg, label: "9th Floor Entrance" },
  { src: lockboxImg, label: "Lockbox — Access Keys During Regus Hours (Code: 0000)" },
  { src: receptionImg, label: "Reception" },
  { src: loungeImg, label: "Lounge" },
  { src: lounge2Img, label: "Business Lounge" },
  { src: kitchenImg, label: "Kitchen" },
  { src: coworkingImg, label: "Coworking Space" },
];

const facilities = [
  { icon: Shield, label: "24/7 Building Security" },
  { icon: Clock, label: "24/7 Access" },
  { icon: Coffee, label: "Lounge & Kitchen" },
  { icon: Car, label: "Parking Available" },
  { icon: Train, label: "Major Transport Links" },
  { icon: Users, label: "Meeting Rooms" },
  { icon: Camera, label: "24/7 CCTV" },
  { icon: Bike, label: "Bicycle Storage" },
  { icon: MonitorSmartphone, label: "Business Lounge" },
  { icon: Navigation, label: "City/Town Center" },
  { icon: Accessibility, label: "Wheelchair Accessible" },
];

export default function NJHoboken({ isAdmin = false }: { isAdmin?: boolean }) {
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

  // Auto-advance carousel
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

      {/* Hero — static, no motion wrappers */}
      <section className="relative overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[40vh] sm:min-h-[55vh] md:min-h-[70vh]">
          <div className="flex items-end md:items-center px-5 sm:px-8 md:px-14 py-8 sm:py-14 md:py-20 order-2 md:order-1"
            style={{ background: 'linear-gradient(135deg, hsl(270, 60%, 92%), hsl(0, 0%, 100%))' }}>
            <div>
              <p className="text-foreground/50 text-[10px] sm:text-xs md:text-sm tracking-[0.5em] uppercase mb-3 sm:mb-5 font-body">01 — Hoboken, New Jersey</p>
              <h1 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-[1] mb-3 sm:mb-5">
                Riverfront
                <br />
                <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Center</em>
              </h1>
              <div className="w-14 h-[2px] bg-italic-accent/40 mb-5" />
              <p className="text-foreground/70 text-sm md:text-base tracking-wide font-light">
                221 River Street, 9th Floor, Unit 9076
                <br />
                Hoboken, NJ 07030
              </p>
            </div>
          </div>
          <div className="overflow-hidden order-1 md:order-2">
            <img src={buildingImg} alt="Hoboken Riverfront Center" className="w-full h-full object-cover min-h-[280px]" loading="eager" />
          </div>
        </div>
      </section>

      {/* About This Location — reduced motion, no decorative blurs */}
      <section className="py-10 sm:py-16 md:py-24" style={{ background: 'linear-gradient(180deg, white 0%, hsl(270, 20%, 97%) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.4em] uppercase text-italic-accent font-medium mb-4">About This Location</p>
            <h2 className="font-display text-4xl md:text-6xl font-light text-foreground leading-[1.1]">
              A Modern Space for{" "}
              <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Exceptional Care</em>
            </h2>
          </div>

          <div className="mb-8">
            <p className="font-body text-muted-foreground text-sm md:text-base leading-relaxed">
              Located on the Hudson River waterfront with stunning views of the Manhattan skyline, our Hoboken office offers a modern, professional setting just 15 minutes from Midtown Manhattan. The space is designed to provide a welcoming, comfortable experience for both patients and providers.
            </p>
          </div>

          {/* Building Entrance Image */}
          <div className="mb-12 rounded-xl overflow-hidden border border-border/30">
            <img
              src={buildingEntranceImg}
              alt="Hoboken Riverfront Center entrance on 221 River Street - look for the Wonder Cafe as your landmark"
              className="w-full h-auto object-cover"
            />
            <p className="px-4 py-3 bg-white font-body text-xs text-muted-foreground">
              Look for Wonder Cafe — the building entrance is right next to it
            </p>
          </div>

          {/* Map + Address — NO motion wrappers */}
          <div className="grid lg:grid-cols-[1fr_1fr] gap-0 mb-10 rounded-2xl overflow-hidden border border-border/30 bg-white">
            <div className="min-h-[220px] sm:min-h-[320px] lg:min-h-[480px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9!2d-74.0299!3d40.7378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259e3b0e6e7c7%3A0x0!2s221+River+St%2C+Hoboken%2C+NJ+07030!5e0!3m2!1sen!2sus!4v1710000000000"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Hoboken Office Location"
                className="w-full h-full"
              />
            </div>

            <div className="flex flex-col">
              <div className="p-5 sm:p-8 md:p-10 flex-1 flex flex-col justify-center border-b border-border/20">
                <div className="flex items-center gap-3 mb-3 sm:mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground">Address</h3>
                </div>
                <div className="space-y-1 mb-6">
                  <p className="font-body text-foreground font-medium text-sm">Regus — Riverfront Center</p>
                  <p className="font-body text-muted-foreground text-sm">221 River Street, 9th Floor, Unit 9076</p>
                  <p className="font-body text-muted-foreground text-sm">Hoboken, NJ 07030</p>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=221+River+Street+Hoboken+NJ+07030"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-body text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-md w-fit"
                >
                  <MapPin className="w-4 h-4" />
                  Open in Google Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-5 sm:p-8 md:p-10 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3 sm:mb-5">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground">Finding the Building</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { num: "1", text: <>Look for <span className="text-foreground font-medium">Wonder Cafe</span> — use it as your landmark</> },
                    { num: "2", text: <>The building entrance is on <span className="text-foreground font-medium">River Street</span> with the Riverfront Center signage</> },
                    { num: "3", text: <>Take the elevator to the <span className="text-foreground font-medium">9th floor</span></> },
                  ].map((step) => (
                    <div key={step.num} className="flex items-start gap-3">
                      <span className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-primary">{step.num}</span>
                      </span>
                      <p className="font-body text-muted-foreground text-sm leading-relaxed">{step.text}</p>
                    </div>
                  ))}
                </div>

                {/* Swipe Card & Key Infographic */}
                <div className="mt-6 sm:mt-8 rounded-2xl border border-primary/20 overflow-hidden shadow-sm bg-gradient-to-br from-primary/5 via-white to-accent/5">
                  <div className="bg-primary px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h4 className="font-display text-base sm:text-lg text-white font-medium tracking-tight">Swipe Card & Key Access</h4>
                  </div>
                  <div className="px-4 sm:px-6 py-5 sm:py-6">
                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                      Ideal for providers using the office <span className="font-semibold text-foreground">outside Regus hours (before 9 AM or after 5 PM, and weekends)</span>. A swipe card gives you full independence.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      {[
                        { icon: Building2, title: "24/7 Building Entry", desc: "No doorbell or security calls needed" },
                        { icon: ShieldCheck, title: "Turnstile Access", desc: "Swipe directly through the turnstile" },
                        { icon: DoorOpen, title: "9th Floor Access", desc: "Unlock the Regus entrance yourself" },
                        { icon: KeyRound, title: "Office Key Included", desc: "Given with your first swipe card" },
                      ].map((item, i) => (
                        <div key={i} className="bg-white rounded-xl border border-border/40 p-3 sm:p-4 text-center shadow-sm">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          </div>
                          <p className="font-display text-xs sm:text-sm font-semibold text-foreground leading-tight">{item.title}</p>
                          <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-snug">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 bg-amber-50 border border-amber-200/60 rounded-lg px-4 py-3 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-800 leading-relaxed">
                        <span className="font-semibold">First-time setup is free</span> — Orenda provides your initial card & key. Lost card replacement: <span className="font-semibold">$65 fee</span>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Clarification note */}
                <div className="mt-4 flex items-start gap-2.5 px-1">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5 shrink-0">
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Don't have a swipe card yet?</span> The building access and Regus access sections below outline how to enter the building and 9th floor without one.
                  </p>
                </div>

                {/* Building Access — Redesigned */}
                <div className="mt-6 sm:mt-8 rounded-2xl border border-border/60 overflow-hidden shadow-sm">
                  {/* Header */}
                  <div className="bg-foreground px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
                    </div>
                    <h4 className="font-display text-base sm:text-lg text-white font-medium tracking-tight">Building Access</h4>
                  </div>

                  {/* 2×2 Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Standard Hours */}
                    <div className="p-4 sm:p-6 bg-white border-b md:border-r border-border/30">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-primary">Standard Hours</p>
                      </div>
                      <p className="font-display text-foreground text-xl font-medium mb-1">7 AM – 6 PM</p>
                      <p className="font-body text-muted-foreground text-xs uppercase tracking-wide mb-2">Monday – Friday</p>
                      <p className="font-body text-muted-foreground text-sm">Floor doors are open. Building entrance accessible 24/7.</p>
                    </div>

                    {/* Ground Floor Access Instructions */}
                    <div className="p-4 sm:p-6 bg-accent/[0.04] border-b border-border/30">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Bell className="w-4 h-4 text-accent" />
                        </div>
                        <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-accent">Ground Floor Access Instructions</p>
                      </div>
                      <p className="font-display text-foreground text-sm font-medium mb-3">Evenings & Weekends</p>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent text-[10px] font-bold mt-0.5">1</span>
                          <p className="font-body text-muted-foreground text-sm">
                            Ring the <span className="text-foreground font-medium">doorbell</span> on the right-hand side
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent text-[10px] font-bold mt-0.5">2</span>
                          <p className="font-body text-muted-foreground text-sm">
                            Security will buzz you in, or call{" "}
                            <a href="tel:2015330855" className="text-foreground font-semibold hover:text-primary transition-colors">201-533-0855</a>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Regus Access Banner */}
                    <div className="col-span-1 md:col-span-2 bg-foreground px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 border-b border-white/10">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" />
                      </div>
                      <h4 className="font-display text-base sm:text-lg text-white font-medium tracking-tight">Regus Access</h4>
                    </div>

                    {/* 9th Floor Reception */}
                    <div className="p-4 sm:p-6 bg-white border-b md:border-b-0 md:border-r border-border/30">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-primary">9th Floor Reception</p>
                      </div>
                      <p className="font-display text-foreground text-xl font-medium mb-1">9 AM – 5 PM</p>
                      <p className="font-body text-muted-foreground text-xs uppercase tracking-wide mb-2">Monday – Friday</p>
                      <p className="font-body text-muted-foreground text-sm">After reception hours, the floor entrance is locked and requires a swipe card.</p>
                    </div>

                    {/* Provider Access */}
                    <div className="p-4 sm:p-6 bg-primary/[0.03]">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                        </div>
                        <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-primary">Provider Access</p>
                      </div>
                      <p className="font-body text-muted-foreground text-sm leading-relaxed mb-3">
                        If you are attending the office during regular Regus business hours <span className="font-medium text-foreground">(9 AM – 5 PM)</span>, please email{" "}
                        <a href="mailto:offices@orendapsych.com" className="text-primary font-medium underline underline-offset-2 hover:text-primary/80 transition-colors">offices@orendapsych.com</a>{" "}
                        in advance to be set up with building access. You will receive a <span className="font-medium text-foreground">paper day pass</span> upon arrival.
                      </p>
                      <div className="bg-white/60 rounded-lg border border-border/30 px-4 py-3 flex items-start gap-3">
                        <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <KeyRound className="w-3 h-3 text-primary" />
                        </div>
                        <p className="font-body text-sm text-muted-foreground leading-relaxed">
                          Access the office using the <span className="font-medium text-foreground">lockbox</span> on the office door — a key is inside. Passcode:{" "}
                          <span className="font-mono font-semibold text-foreground tracking-wider">0000</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Information */}
          <div>
            <div className="bg-foreground rounded-2xl p-5 sm:p-10 md:p-14 lg:p-16 text-white">
              <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-2 sm:mb-3">Key Information</p>
              <h3 className="font-display text-2xl sm:text-3xl md:text-5xl font-light mb-8 sm:mb-12 md:mb-16 leading-tight">
                At Your{" "}
                <em className="text-italic-accent" style={{ fontStyle: "italic" }}>Fingertips</em>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-14">
                {/* Office Keys */}
                <div>
                  <KeyRound className="w-5 h-5 text-italic-accent mb-6" />
                  <h4 className="font-display text-2xl text-white mb-6">Office Keys</h4>
                  <div className="space-y-5">
                    <div>
                      <p className="font-display text-lg text-white">Lockbox Access</p>
                      <p className="font-body text-white/50 text-sm mt-1">During regular Regus business hours</p>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div className="bg-white/[0.06] rounded-lg px-4 py-3">
                      <p className="font-body text-white/70 text-xs leading-relaxed">
                        Access office keys through the <span className="text-white font-medium">lockbox</span> on the office door. Lockbox code: <span className="font-mono text-white font-semibold tracking-wider">0000</span>. Please return keys at the end of the day.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <Phone className="w-5 h-5 text-italic-accent mb-6" />
                  <h4 className="font-display text-2xl text-white mb-6">Contact</h4>

                  {/* Orenda NJ Admin */}
                  <p className="font-body text-italic-accent text-xs font-semibold uppercase tracking-wider mb-3">Orenda NJ Admin</p>
                  <div className="space-y-5 mb-8">
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Phone</p>
                      <a href="tel:+12016854863" className="font-display text-lg text-white hover:text-italic-accent transition-colors block">
                        (201) 685-4863
                      </a>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Email</p>
                      <a href="mailto:offices@orendapsych.com" className="font-display text-lg text-white hover:text-italic-accent transition-colors block break-all">
                        offices@orendapsych.com
                      </a>
                    </div>
                  </div>

                  {/* Regus Hoboken */}
                  <p className="font-body text-italic-accent text-xs font-semibold uppercase tracking-wider mb-3">Regus — Hoboken Riverfront</p>
                  <div className="space-y-5">
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Phone</p>
                      <a href="tel:+12014847855" className="font-display text-lg text-white hover:text-italic-accent transition-colors block">
                        (201) 484-7855
                      </a>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Email</p>
                      <a href="mailto:Hoboken.RiverSt@regus.com" className="font-display text-lg text-white hover:text-italic-accent transition-colors block break-all">
                        Hoboken.RiverSt@regus.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Wi-Fi */}
                <div>
                  <svg className="w-5 h-5 text-italic-accent mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.75 20.25v-.075c0-.69-.56-1.25-1.25-1.25H8.75c-.69 0-1.25.56-1.25 1.25v.075" />
                  </svg>
                  <h4 className="font-display text-2xl text-white mb-6">Wi-Fi</h4>
                  <div className="space-y-5">
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Network</p>
                      <p className="font-display text-lg text-white">Regus Net Wi-Fi</p>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Password</p>
                      <p className="font-display text-lg text-white tracking-wider">167845630</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* Private Office — Full Bleed */}
      <section className="py-14 sm:py-20 md:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(270, 60%, 10%) 0%, hsl(270, 40%, 20%) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-light text-white leading-[0.9] tracking-tight mb-4 sm:mb-6">
              Our Private <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Office</em>
            </h2>
            <p className="text-white/40 text-sm max-w-md mx-auto">Fully equipped. Reserved for you.</p>
          </motion.div>

          {/* Office Photos — Large, prominent */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.2}
            className="mb-10 sm:mb-14">
            {/* Featured large image */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-4">
              <img src={officeFullImg} alt="Private office — desk and seating area" className="w-full h-[280px] sm:h-[380px] md:h-[480px] object-cover" />
            </div>
            {/* Secondary image */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img src={officeSeatingImg} alt="Private office — patient seating" className="w-full h-[240px] sm:h-[320px] md:h-[400px] object-cover" />
            </div>
          </motion.div>

          {/* Amenity icons — horizontal scroll on mobile */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10 sm:mb-14">
             {([
              { icon: Armchair, label: "Patient Seating" },
              { icon: Scale, label: "Weight Scale" },
              { icon: HeartPulse, label: "BP Cuff" },
              { icon: Wifi, label: "Wi-Fi" },
            ] as const).map((a, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.08}
                className="flex flex-col items-center gap-2 sm:gap-4"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <a.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-italic-accent" />
                </div>
                <span className="text-white/70 text-[11px] sm:text-xs font-medium tracking-wide">{a.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Policies */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.6} className="text-center">
            <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
              {([
                { icon: KeyRound, label: "Return key to lockbox after visit" },
                { icon: DoorOpen, label: "Leave office clean & reset" },
              ] as const).map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-4 sm:px-5 py-2 sm:py-2.5">
                  <p.icon className="w-3.5 h-3.5 text-italic-accent" />
                  <span className="text-white/70 text-[11px] sm:text-xs">{p.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.8} className="text-center">
            <Link to={`${prefix}/book`}
              className="inline-flex items-center gap-3 bg-italic-accent text-foreground font-body text-sm font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-italic-accent/90 transition-all shadow-lg">
              <CalendarCheck className="w-5 h-5" />
              Schedule Office Time
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Workspace Environment — Carousel — NO decorative SVG pattern, NO backdrop-blur */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, hsl(270,25%,94%) 0%, hsl(270,35%,88%) 40%, hsl(270,45%,82%) 70%, hsl(270,60%,70%) 100%)' }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20 md:py-28">
          <div className="mb-8 sm:mb-12">
            <p className="text-[10px] tracking-[0.4em] uppercase text-foreground/40 font-medium mb-3 sm:mb-4">Regus Shared Workspace</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-foreground tracking-tight">
              Building <em className="text-primary" style={{ fontStyle: 'italic' }}>Facilities</em>
            </h2>
            <p className="text-foreground/50 text-sm leading-relaxed mt-3 sm:mt-4 max-w-lg">
              Please see below images of the building, where to ring the bell outside of business hours, the 9th floor entrance, and the office layout.
            </p>
          </div>

          {/* Carousel — NO backdrop-blur on buttons */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-white/20 border border-white/10 shadow-2xl">
              <div className="aspect-[4/3] sm:aspect-[16/9] relative overflow-hidden">
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
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className={`absolute inset-0 w-full h-full ${galleryImages[current].src === lockboxImg ? "object-contain bg-black/40" : "object-cover"}`}
                  />
                </AnimatePresence>
                {/* Animated lockbox code overlay */}
                <AnimatePresence>
                  {galleryImages[current].src === lockboxImg && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ delay: 0.3, duration: 0.5, type: "spring", damping: 20 }}
                      className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10"
                    >
                      <div className="bg-foreground/90 backdrop-blur-sm rounded-xl px-4 py-3 sm:px-5 sm:py-4 shadow-2xl border border-white/10">
                        <p className="text-[10px] sm:text-xs text-white/60 font-medium uppercase tracking-wider mb-1">Lockbox Code</p>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {["0", "0", "0", "0"].map((digit, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + i * 0.15, duration: 0.3, type: "spring" }}
                              className="w-8 h-10 sm:w-10 sm:h-12 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center font-mono text-xl sm:text-2xl font-bold text-white"
                            >
                              {digit}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Return key reminder overlay */}
                <AnimatePresence>
                  {galleryImages[current].src === lockboxImg && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ delay: 1.2, duration: 0.5, type: "spring", damping: 20 }}
                      className="absolute bottom-16 right-4 sm:bottom-20 sm:right-6 z-10"
                    >
                      <div className="bg-amber-500/90 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 shadow-2xl border border-amber-400/30 flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, -10, 10, -10, 0] }}
                          transition={{ delay: 1.8, duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <KeyRound className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </motion.div>
                        <p className="text-xs sm:text-sm font-semibold text-white tracking-wide">Return Key After Use</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 sm:p-6">
                  <p className="text-white text-xs sm:text-sm font-medium tracking-wide">{galleryImages[current].label}</p>
                  <p className="text-white/50 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase mt-1">
                    {current + 1} / {galleryImages.length}
                  </p>
                </div>
                <button onClick={prev} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 border border-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors active:scale-95">
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button onClick={next} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 border border-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors active:scale-95">
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-5 overflow-x-auto pb-2 -mx-1 px-1">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-300 active:scale-95 ${
                    i === current ? "border-white shadow-lg scale-105" : "border-transparent opacity-60 hover:opacity-90"
                  }`}
                >
                  <img src={img.src} alt={img.label} className="w-14 h-10 sm:w-20 sm:h-14 object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Facilities — static, no motion wrappers */}
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