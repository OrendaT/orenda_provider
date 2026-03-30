import { MapPin, Clock, Shield, Coffee, Car, Phone, Train, Users, Camera, Bike, MonitorSmartphone, Navigation, Accessibility, ExternalLink, ChevronLeft, ChevronRight, Armchair, Scale, HeartPulse, Wifi, KeyRound, DoorOpen, Download, Copy, Check, FileText } from "lucide-react";
import { useRef } from "react";
import { toBlob, toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { downloadHobokenDocx } from "@/utils/hobokenDocxExport";
import { downloadHobokenHtml } from "@/utils/hobokenHtmlExport";
import logo from "@/assets/orenda-logo-purple.png";
import buildingImg from "@/assets/hoboken-riverfront.png";
import receptionImg from "@/assets/hoboken/reception.png";
import loungeImg from "@/assets/hoboken/lounge.png";
import lounge2Img from "@/assets/hoboken/lounge2.png";
import kitchenImg from "@/assets/hoboken/kitchen.png";
import coworkingImg from "@/assets/hoboken/coworking.png";
import brandedMapImg from "@/assets/hoboken-map-branded.png";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

const galleryImages = [
  { src: buildingImg, label: "Building Exterior" },
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

export default function NJHobokenStandalone() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [pdfMode, setPdfMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopyEmail = async () => {
    if (!contentRef.current) return;

    setPdfMode(true);
    await new Promise((r) => setTimeout(r, 600));

    try {
      const blob = await toBlob(contentRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
        width: contentRef.current.scrollWidth,
        height: contentRef.current.scrollHeight,
      });

      if (!blob) throw new Error("Could not generate image");

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed", error);
    } finally {
      setPdfMode(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!contentRef.current || downloading) return;
    setDownloading(true);
    setPdfMode(true);

    // Wait for React to re-render with pdfMode=true
    await new Promise((r) => setTimeout(r, 600));

    try {
      // Warm-up render
      await toPng(contentRef.current, { quality: 0.1, cacheBust: true });
      await new Promise((r) => setTimeout(r, 400));

      const dataUrl = await toPng(contentRef.current, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
        width: contentRef.current.scrollWidth,
        height: contentRef.current.scrollHeight,
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const pdfWidth = 210; // A4 mm
      const pdfHeight = (img.height / img.width) * pdfWidth;
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [pdfWidth, pdfHeight] });
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save("Orenda-Hoboken-Riverfront-Center.pdf");
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      setPdfMode(false);
      setDownloading(false);
    }
  };

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
      {/* Minimal top bar — non-clickable logo on the right + PDF download */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloading ? "Generating…" : "Download PDF"}
            </button>
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy for Email"}
            </button>
            <button
              onClick={() => downloadHobokenDocx()}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <FileText className="w-4 h-4" />
              Google Doc
            </button>
            <button
              onClick={() => downloadHobokenHtml({
                building: buildingImg,
                reception: receptionImg,
                lounge: loungeImg,
                lounge2: lounge2Img,
                kitchen: kitchenImg,
                coworking: coworkingImg,
                brandedMap: brandedMapImg,
                logo: logo,
              })}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <FileText className="w-4 h-4" />
              HTML for Drive
            </button>
          </div>
          <img src={logo} alt="Orenda Psychiatry" className="h-7 sm:h-8" />
        </div>
      </header>

      <div ref={contentRef} className={pdfMode ? "pdf-export-mode" : ""}>

      {/* Hero */}
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

      {/* About This Location */}
      <section className="py-10 sm:py-16 md:py-24" style={{ background: 'linear-gradient(180deg, white 0%, hsl(270, 20%, 97%) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.4em] uppercase text-italic-accent font-medium mb-4">About This Location</p>
            <h2 className="font-display text-4xl md:text-6xl font-light text-foreground leading-[1.1]">
              A Modern Space for{" "}
              <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Exceptional Care</em>
            </h2>
          </div>

          <div className="mb-12">
            <p className="font-body text-muted-foreground text-sm md:text-base leading-relaxed">
              Located on the Hudson River waterfront with stunning views of the Manhattan skyline, our Hoboken office offers a modern, professional setting just 15 minutes from Midtown Manhattan. The space is designed to provide a welcoming, comfortable experience for both patients and providers.
            </p>
          </div>

          {/* Map + Address */}
          <div className="grid lg:grid-cols-[1fr_1fr] gap-0 mb-10 rounded-2xl overflow-hidden border border-border/30 bg-white">
            <div className="min-h-[280px] sm:min-h-[420px] lg:min-h-[480px]">
              {pdfMode ? (
                <img
                  src={brandedMapImg}
                  alt="Hoboken Office Location — 221 River Street"
                  className="w-full h-full object-cover min-h-[280px] sm:min-h-[420px] lg:min-h-[480px]"
                />
              ) : (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9!2d-74.0299!3d40.7378!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259e3b0e6e7c7%3A0x0!2s221+River+St%2C+Hoboken%2C+NJ+07030!5e0!3m2!1sen!2sus!4v1710000000000"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="Hoboken Office Location"
                  className="w-full h-full"
                />
              )}
            </div>

            <div className="flex flex-col">
              <div className="p-8 md:p-10 flex-1 flex flex-col justify-center border-b border-border/20">
                <div className="flex items-center gap-3 mb-5">
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
                {!pdfMode && (
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=221+River+Street+Hoboken+NJ+07030"
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-body text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-md w-fit"
                  >
                    <MapPin className="w-4 h-4" />
                    Open in Google Maps
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-5">
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

                <div className="mt-6 space-y-4">
                  <h4 className="font-display text-lg text-foreground font-medium">Building Access</h4>
                  <ul className="space-y-1.5">
                    <li className="font-body text-muted-foreground text-sm flex items-start gap-2"><span className="text-primary mt-1">•</span>The building entrance is accessible <span className="text-foreground font-medium">24/7</span></li>
                    <li className="font-body text-muted-foreground text-sm flex items-start gap-2"><span className="text-primary mt-1">•</span>Floor doors open <span className="text-foreground font-medium">Monday–Friday, 7:00 AM – 6:00 PM</span></li>
                    <li className="font-body text-muted-foreground text-sm flex items-start gap-2"><span className="text-primary mt-1">•</span>Outside of these hours, the floor doors are locked</li>
                  </ul>
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="font-display text-base text-foreground font-medium">Entering Outside Standard Hours</h4>
                  <ul className="space-y-1.5">
                    <li className="font-body text-muted-foreground text-sm flex items-start gap-2"><span className="text-primary mt-1">•</span>Ring the <span className="text-foreground font-medium">doorbell on the right-hand side</span> of the building entrance</li>
                    <li className="font-body text-muted-foreground text-sm flex items-start gap-2"><span className="text-primary mt-1">•</span>Building security will buzz you in</li>
                  </ul>
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="font-display text-base text-foreground font-medium">Regus Office Reception</h4>
                  <ul className="space-y-1.5">
                    <li className="font-body text-muted-foreground text-sm flex items-start gap-2"><span className="text-primary mt-1">•</span>Staffed <span className="text-foreground font-medium">9:00 AM – 5:00 PM, Monday–Friday</span></li>
                    <li className="font-body text-muted-foreground text-sm flex items-start gap-2"><span className="text-primary mt-1">•</span>After reception hours, floor entrance requires a swipe card</li>
                  </ul>
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="font-display text-base text-foreground font-medium">Provider Access After Hours</h4>
                  <p className="font-body text-muted-foreground text-sm">If attending outside reception hours, you must either:</p>
                  <ul className="space-y-1.5">
                    <li className="font-body text-muted-foreground text-sm flex items-start gap-2"><span className="text-primary mt-1">•</span>Coordinate with our team to have a swipe card sent to you, or</li>
                    <li className="font-body text-muted-foreground text-sm flex items-start gap-2"><span className="text-primary mt-1">•</span>Be set up directly with the building for 24/7 access with your own designated swipe card and key</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Key Information */}
          <div>
            <div className="bg-foreground rounded-2xl p-6 sm:p-10 md:p-14 lg:p-16 text-white">
              <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-3">Key Information</p>
              <h3 className="font-display text-3xl md:text-5xl font-light mb-12 md:mb-16 leading-tight">
                At Your{" "}
                <em className="text-italic-accent" style={{ fontStyle: "italic" }}>Fingertips</em>
              </h3>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 md:gap-14">
                {/* Access */}
                <div>
                  <Shield className="w-5 h-5 text-italic-accent mb-6" />
                  <h4 className="font-display text-2xl text-white mb-6">Access</h4>
                  <div className="space-y-5">
                    <div>
                      <p className="font-display text-lg text-white">Building Access</p>
                      <p className="font-body text-white/50 text-sm mt-1">Open 24/7 — the building is always accessible</p>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div className="bg-white/[0.06] rounded-lg px-4 py-3">
                      <p className="font-body text-white/70 text-xs leading-relaxed">
                        <span className="text-italic-accent font-medium">After Hours:</span> After 6 PM & on weekends, ring the <span className="text-white font-medium">doorbell on the right-hand side</span> of the entrance to be buzzed in by security.
                      </p>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div>
                      <p className="font-display text-lg text-white">Regus Front Desk</p>
                      <p className="font-body text-white/50 text-sm mt-1">9th Floor · Mon–Fri, 9 AM – 5 PM</p>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div className="bg-white/[0.06] rounded-lg px-4 py-3">
                      <p className="font-body text-white/70 text-xs leading-relaxed">
                        <span className="text-italic-accent font-medium">Note:</span> After Regus hours, the 9th floor entrance is locked. Ensure our team registers your access for after-hours entry.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <Phone className="w-5 h-5 text-italic-accent mb-6" />
                  <h4 className="font-display text-2xl text-white mb-6">Contact</h4>
                  <div className="space-y-5">
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Phone</p>
                      <p className="font-display text-lg text-white">(201) 721-8500</p>
                    </div>
                    <div className="w-8 h-px bg-white/15" />
                    <div>
                      <p className="font-body text-white/50 text-sm mb-1">Email</p>
                      <p className="font-display text-lg text-white break-all">Hoboken.Riverfront@regus.com</p>
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

      {/* Private Office — NO "Schedule Office Time" button */}
      <section className="py-20 md:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(270, 60%, 10%) 0%, hsl(270, 40%, 20%) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          {pdfMode ? (
            <div>
              <h2 className="font-display text-6xl md:text-8xl lg:text-9xl font-light text-white leading-[0.9] tracking-tight mb-6">
                Our Private <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Office</em>
              </h2>
              <p className="text-white/40 text-sm mb-16 max-w-md mx-auto">Fully equipped. Reserved for you.</p>
            </div>
          ) : (
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="font-display text-6xl md:text-8xl lg:text-9xl font-light text-white leading-[0.9] tracking-tight mb-6">
                Our Private <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Office</em>
              </h2>
              <p className="text-white/40 text-sm mb-16 max-w-md mx-auto">Fully equipped. Reserved for you.</p>
            </motion.div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
            {([
              { icon: Armchair, label: "Patient Seating" },
              { icon: Scale, label: "Weight Scale" },
              { icon: HeartPulse, label: "BP Cuff" },
              { icon: Wifi, label: "Wi-Fi" },
            ] as const).map((a, i) => {
              const content = (
                <>
                  <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center ${!pdfMode ? 'hover:bg-white/10 transition-colors' : ''}`}>
                    <a.icon className="w-8 h-8 md:w-10 md:h-10 text-italic-accent" />
                  </div>
                  <span className="text-white/70 text-xs font-medium tracking-wide">{a.label}</span>
                </>
              );
              return pdfMode ? (
                <div key={i} className="flex flex-col items-center gap-4">{content}</div>
              ) : (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.08} className="flex flex-col items-center gap-4">{content}</motion.div>
              );
            })}
          </div>

          {pdfMode ? (
            <div className="inline-flex flex-wrap justify-center gap-3">
              {([
                { icon: Shield, label: "Escort patients at all times" },
                { icon: Coffee, label: "Use in-office beverages only" },
                { icon: KeyRound, label: "Return key to lockbox after visit" },
                { icon: DoorOpen, label: "Leave office clean & reset" },
              ] as const).map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-5 py-2.5">
                  <p.icon className="w-3.5 h-3.5 text-italic-accent" />
                  <span className="text-white/70 text-xs">{p.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.6}>
              <div className="inline-flex flex-wrap justify-center gap-3">
                {([
                  { icon: Shield, label: "Escort patients at all times" },
                  { icon: Coffee, label: "Use in-office beverages only" },
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
          )}
        </div>
      </section>

      {/* Workspace Environment — Carousel */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, hsl(270,25%,94%) 0%, hsl(270,35%,88%) 40%, hsl(270,45%,82%) 70%, hsl(270,60%,70%) 100%)' }}>
        <div className="relative max-w-7xl mx-auto px-8 py-20 md:py-28">
          <div className="mb-12">
            <p className="text-[10px] tracking-[0.4em] uppercase text-foreground/40 font-medium mb-4">The Space</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground tracking-tight">
              Workspace <em className="text-primary" style={{ fontStyle: 'italic' }}>Environment</em>
            </h2>
            <p className="text-foreground/50 text-sm leading-relaxed mt-4 max-w-lg">
              Our office is situated within a premium shared workspace featuring modern amenities, professional common areas, and a welcoming atmosphere suited for healthcare professionals.
            </p>
          </div>

          {pdfMode ? (
            /* PDF mode: show all images in a grid */
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <div className="aspect-[16/10] relative">
                    <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-white text-sm font-medium tracking-wide">{img.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
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
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <p className="text-white text-sm font-medium tracking-wide">{galleryImages[current].label}</p>
                    <p className="text-white/50 text-[10px] tracking-[0.3em] uppercase mt-1">
                      {current + 1} / {galleryImages.length}
                    </p>
                  </div>
                  <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 border border-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 border border-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-5 overflow-x-auto pb-2">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                    className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      i === current ? "border-white shadow-lg scale-105" : "border-transparent opacity-60 hover:opacity-90"
                    }`}
                  >
                    <img src={img.src} alt={img.label} className="w-20 h-14 object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          )}
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

      {/* Simple footer — no links */}
      <footer className="py-8 bg-white border-t border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <img src={logo} alt="Orenda Psychiatry" className="h-6 opacity-40" />
          <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/30">
            © {new Date().getFullYear()} Orenda Psychiatry
          </p>
        </div>
      </footer>
      </div>{/* end contentRef */}
    </div>
  );
}
