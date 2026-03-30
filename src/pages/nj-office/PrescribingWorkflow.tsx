import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText, Stethoscope, Send, Pill, Clock, AlertTriangle,
  Download, ArrowRight, UserCheck, Timer, Users, Sparkles
} from "lucide-react";
import NJNavbar from "@/components/NJNavbar";
import NJFooter from "@/components/NJFooter";
import logo from "@/assets/orenda-logo-purple.png";
import welcomeHero from "@/assets/hoboken-riverfront.png";
import { toPng } from "html-to-image";

/* ─── Slide 1: Prescribing Workflow ─── */
function Slide1({ slideRef }: { slideRef: React.RefObject<HTMLDivElement> }) {
  const steps = [
    {
      num: "01",
      icon: FileText,
      title: "Chart Medication",
      desc: "Primary provider documents intended medication & dosage in SP template",
      color: "hsl(270, 60%, 55%)",
    },
    {
      num: "02",
      icon: Stethoscope,
      title: "Physical Exam",
      desc: "In-person provider completes exam and gives the greenlight",
      color: "hsl(280, 55%, 50%)",
    },
    {
      num: "03",
      icon: Send,
      title: "Admin Sends List",
      desc: "End-of-day patient list sent to primary provider; meds queued in advance",
      color: "hsl(260, 55%, 50%)",
    },
    {
      num: "04",
      icon: Pill,
      title: "Prescribe",
      desc: "Primary provider prescribes within required timeframe",
      color: "hsl(270, 65%, 48%)",
    },
  ];

  return (
    <div
      ref={slideRef}
      className="w-full relative overflow-hidden rounded-2xl"
      style={{
        aspectRatio: "16/9",
        background: "linear-gradient(150deg, hsl(270, 100%, 6%) 0%, hsl(270, 55%, 18%) 50%, hsl(270, 40%, 28%) 100%)",
      }}
    >
      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Glow */}
      <div
        className="absolute top-0 right-0 w-[50%] h-[60%]"
        style={{ background: "radial-gradient(ellipse at 80% 20%, hsl(270, 80%, 30%, 0.2) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 h-full flex flex-col p-[4%] sm:p-[5%]">
        {/* Header */}
        <div className="flex items-center justify-between mb-auto">
          <div>
            <p className="text-[0.6rem] sm:text-xs tracking-[0.4em] uppercase text-white/30 font-medium mb-1">
              Prescribing Process
            </p>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-light text-white tracking-tight leading-tight">
              Intake Medication{" "}
              <em className="italic font-extralight" style={{ color: "hsl(270, 80%, 75%)" }}>Workflow</em>
            </h2>
          </div>
          <img src={logo} alt="Orenda" className="h-6 sm:h-8 brightness-0 invert opacity-30" />
        </div>

        {/* Core principle badge */}
        <div className="flex items-center gap-2 mt-3 mb-4 sm:mb-6">
          <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "hsl(270, 70%, 70%)" }} />
          <p className="text-[0.6rem] sm:text-xs text-white/50">
            Patient stays on <strong className="text-white/70">primary provider's caseload</strong> — primary provider prescribes
          </p>
        </div>

        {/* 4 Steps — horizontal cards */}
        <div className="flex-1 grid grid-cols-4 gap-2 sm:gap-4">
          {steps.map((step, i) => (
            <div key={step.num} className="relative flex flex-col">
              {/* Arrow connector */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[55%] z-20 hidden sm:block">
                  <ArrowRight className="w-4 h-4 text-white/15" />
                </div>
              )}
              <div
                className="flex-1 rounded-xl sm:rounded-2xl p-3 sm:p-5 flex flex-col"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Icon circle */}
                <div
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                  style={{ background: `${step.color}18` }}
                >
                  <step.icon className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: step.color }} />
                </div>

                {/* Number */}
                <span
                  className="text-[0.55rem] sm:text-[0.65rem] font-bold tracking-[0.2em] mb-1"
                  style={{ color: step.color }}
                >
                  STEP {step.num}
                </span>

                {/* Title */}
                <h3 className="text-sm sm:text-lg font-semibold text-white leading-snug mb-1 sm:mb-2">
                  {step.title}
                </h3>

                {/* Desc */}
                <p className="text-[0.55rem] sm:text-xs text-white/45 leading-relaxed mt-auto">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Slide 2: Buffer Periods & SP Template ─── */
function Slide2({ slideRef }: { slideRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div
      ref={slideRef}
      className="w-full relative overflow-hidden rounded-2xl"
      style={{
        aspectRatio: "16/9",
        background: "linear-gradient(150deg, hsl(270, 100%, 7%) 0%, hsl(265, 50%, 20%) 50%, hsl(260, 40%, 30%) 100%)",
      }}
    >
      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 h-full flex flex-col p-[4%] sm:p-[5%]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <p className="text-[0.6rem] sm:text-xs tracking-[0.4em] uppercase text-white/30 font-medium mb-1">
              Scheduling & Documentation
            </p>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-light text-white tracking-tight leading-tight">
              Buffer Periods &{" "}
              <em className="italic font-extralight" style={{ color: "hsl(270, 80%, 75%)" }}>SP Template</em>
            </h2>
          </div>
          <img src={logo} alt="Orenda" className="h-6 sm:h-8 brightness-0 invert opacity-30" />
        </div>

        {/* Two-column layout */}
        <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-6">
          {/* Left: Buffer Periods */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2 mb-1">
              <Timer className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "hsl(270, 70%, 70%)" }} />
              <h3 className="text-sm sm:text-lg font-semibold text-white">Appointment Buffer Periods</h3>
            </div>
            <p className="text-[0.55rem] sm:text-xs text-white/40 leading-relaxed -mt-2">
              Schedule buffer time to accommodate late patients and keep the day on track.
            </p>

            {/* Buffer cards */}
            <div
              className="rounded-xl sm:rounded-2xl p-4 sm:p-6 flex items-center gap-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(270, 50%, 25%)" }}>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "hsl(270, 70%, 70%)" }} />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">10–15 min</p>
                <p className="text-[0.55rem] sm:text-xs text-white/40">Standard · Weekday hours</p>
              </div>
            </div>

            <div
              className="rounded-xl sm:rounded-2xl p-4 sm:p-6 flex items-center gap-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "hsl(40, 50%, 20%)" }}>
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "hsl(45, 80%, 60%)" }} />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-white">15+ min</p>
                <p className="text-[0.55rem] sm:text-xs text-white/40">Extended · Evenings & weekends</p>
              </div>
            </div>
          </div>

          {/* Right: SP Template */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "hsl(270, 70%, 70%)" }} />
              <h3 className="text-sm sm:text-lg font-semibold text-white">SP Session Note Template</h3>
            </div>
            <p className="text-[0.55rem] sm:text-xs text-white/40 leading-relaxed -mt-2">
              "Orenda Session Note 2025–2026" — review the Medication section.
            </p>

            {/* Mock template */}
            <div
              className="flex-1 rounded-xl sm:rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Template header */}
              <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "hsl(0, 60%, 55%)" }} />
                <div className="w-2 h-2 rounded-full" style={{ background: "hsl(45, 60%, 55%)" }} />
                <div className="w-2 h-2 rounded-full" style={{ background: "hsl(130, 40%, 50%)" }} />
                <span className="text-[0.5rem] sm:text-[0.6rem] text-white/30 ml-2">Orenda Session Note 2025–2026</span>
              </div>

              <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                {/* Gray placeholder fields */}
                <div className="flex items-center gap-2">
                  <div className="h-3 w-16 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <div className="h-3 flex-1 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-12 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <div className="h-3 w-32 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                </div>

                {/* Highlighted medication section */}
                <div
                  className="rounded-lg sm:rounded-xl p-3 sm:p-4 mt-2 relative"
                  style={{
                    background: "hsl(270, 50%, 20%)",
                    border: "2px solid hsl(270, 60%, 45%)",
                    boxShadow: "0 0 20px hsl(270, 60%, 30%, 0.3)",
                  }}
                >
                  <div className="absolute -top-2.5 left-3 px-2 py-0.5 rounded text-[0.45rem] sm:text-[0.55rem] font-bold uppercase tracking-wider" style={{ background: "hsl(270, 60%, 50%)", color: "white" }}>
                    Key Section
                  </div>
                  <div className="flex items-center gap-2 mb-2 mt-1">
                    <Pill className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "hsl(270, 70%, 70%)" }} />
                    <span className="text-[0.6rem] sm:text-xs font-semibold text-white">Medication & Dosage</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <div className="h-6 flex-1 rounded-md" style={{ background: "rgba(255,255,255,0.06)", border: "1px dashed rgba(255,255,255,0.15)" }}>
                        <p className="text-[0.45rem] sm:text-[0.55rem] text-white/25 px-2 py-1.5 italic">Medication name...</p>
                      </div>
                      <div className="h-6 w-20 rounded-md" style={{ background: "rgba(255,255,255,0.06)", border: "1px dashed rgba(255,255,255,0.15)" }}>
                        <p className="text-[0.45rem] sm:text-[0.55rem] text-white/25 px-2 py-1.5 italic">Dosage...</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* More gray fields */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-3 w-20 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <div className="h-3 flex-1 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Slide: Welcome ─── */
function SlideWelcome({ slideRef }: { slideRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div
      ref={slideRef}
      className="w-full relative overflow-hidden rounded-2xl"
      style={{ aspectRatio: "16/9" }}
    >
      {/* Background image */}
      <img src={welcomeHero} alt="" className="absolute inset-0 w-full h-full object-cover" />
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(270, 80%, 8%, 0.85) 0%, hsl(270, 50%, 15%, 0.7) 50%, hsl(270, 40%, 20%, 0.6) 100%)" }} />
      {/* Accent glow */}
      <div className="absolute bottom-0 left-0 w-[60%] h-[50%]" style={{ background: "radial-gradient(ellipse at 20% 90%, hsl(270, 80%, 40%, 0.25) 0%, transparent 70%)" }} />
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-[5%]">
        <img src={logo} alt="Orenda" className="h-10 sm:h-14 brightness-0 invert opacity-60 mb-6" />
        <div className="w-16 h-[1px] mb-6" style={{ background: "linear-gradient(90deg, transparent, hsl(270, 70%, 65%), transparent)" }} />
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extralight text-white tracking-tight leading-tight mb-3">
          Welcome to Our
        </h1>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-light text-white tracking-tight leading-tight">
          <em className="italic" style={{ color: "hsl(270, 80%, 78%)" }}>New Jersey</em> Offices
        </h1>
        <div className="w-16 h-[1px] mt-8" style={{ background: "linear-gradient(90deg, transparent, hsl(270, 70%, 65%), transparent)" }} />
        <p className="text-xs sm:text-sm text-white/30 mt-6 tracking-[0.3em] uppercase font-light">
          Provider Town Hall
        </p>
      </div>
    </div>
  );
}

/* ─── Slide: Agenda (filled) ─── */
function SlideAgenda({ slideRef }: { slideRef: React.RefObject<HTMLDivElement> }) {
  const items = [
    { num: "01", title: "Introduction" },
    {
      num: "02",
      title: "Provider Portal",
      sub: ["Office Locations", "Key Information", "Booking Platform", "Dedicated New Jersey Admin", "Office SOPs"],
    },
    { num: "03", title: "Prescribing Ownership & Intake Workflow" },
    { num: "04", title: "Pop Quiz", highlight: "Win a $50 Amex Gift Card" },
    { num: "05", title: "Q&A" },
  ];

  return (
    <div
      ref={slideRef}
      className="w-full relative overflow-hidden rounded-2xl"
      style={{
        aspectRatio: "16/9",
        background: "linear-gradient(150deg, hsl(270, 100%, 97%) 0%, hsl(270, 60%, 92%) 50%, hsl(270, 50%, 88%) 100%)",
      }}
    >
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(270, 40%, 60%) 1px, transparent 0)", backgroundSize: "28px 28px" }} />
      <div className="absolute top-0 right-0 w-[40%] h-[60%]" style={{ background: "radial-gradient(ellipse at 90% 10%, hsl(270, 60%, 80%, 0.3) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, hsl(270, 50%, 70%, 0.4), transparent)" }} />

      <div className="relative z-10 h-full flex p-[5%] gap-[5%]">
        {/* Left — Title */}
        <div className="flex flex-col justify-center w-[30%]">
          <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 mb-4" style={{ color: "hsl(270, 55%, 55%)" }} />
          <p className="text-[0.5rem] sm:text-xs tracking-[0.4em] uppercase font-medium mb-2" style={{ color: "hsl(270, 30%, 55%)" }}>
            Today's Discussion
          </p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extralight tracking-tight leading-none" style={{ color: "hsl(270, 40%, 20%)" }}>
            Agenda
          </h2>
          <div className="w-12 h-[2px] mt-4" style={{ background: "hsl(270, 50%, 60%)" }} />
        </div>

        {/* Right — Agenda items */}
        <div className="flex-1 flex flex-col justify-center gap-2 sm:gap-3">
          {items.map((item, i) => (
            <div key={i}>
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-[0.6rem] sm:text-xs font-bold shrink-0 mt-0.5"
                  style={{
                    background: `hsl(270, 50%, ${75 - i * 4}%)`,
                    color: "white",
                  }}
                >
                  {item.num}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm sm:text-lg font-medium tracking-tight" style={{ color: "hsl(270, 30%, 15%)" }}>{item.title}</span>
                    {item.highlight && (
                      <span
                        className="text-[0.45rem] sm:text-[0.6rem] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                        style={{ background: "hsl(45, 90%, 50%)", color: "hsl(270, 60%, 10%)" }}
                      >
                        🎁 {item.highlight}
                      </span>
                    )}
                  </div>
                  {item.sub && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                      {item.sub.map((s, j) => (
                        <span key={j} className="text-[0.5rem] sm:text-xs font-light" style={{ color: "hsl(270, 20%, 45%)" }}>
                          {j > 0 && <span className="mr-2" style={{ color: "hsl(270, 40%, 65%)" }}>·</span>}
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {i < items.length - 1 && (
                <div className="ml-10 sm:ml-[52px] mt-2 h-[1px]" style={{ background: "hsl(270, 30%, 82%)" }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function PrescribingWorkflow() {
  const welcomeRef = useRef<HTMLDivElement>(null);
  const agendaRef = useRef<HTMLDivElement>(null);
  const slide1Ref = useRef<HTMLDivElement>(null);
  const slide2Ref = useRef<HTMLDivElement>(null);

  const downloadSlide = useCallback(async (ref: React.RefObject<HTMLDivElement>, name: string) => {
    if (!ref.current) return;
    try {
      const dataUrl = await toPng(ref.current, {
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `${name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  }, []);

  const slides = [
    { ref: welcomeRef, label: "Welcome", component: <SlideWelcome slideRef={welcomeRef} /> },
    { ref: agendaRef, label: "Agenda", component: <SlideAgenda slideRef={agendaRef} /> },
    { ref: slide1Ref, label: "Prescribing Process", component: <Slide1 slideRef={slide1Ref} /> },
    { ref: slide2Ref, label: "Buffer Periods & SP Template", component: <Slide2 slideRef={slide2Ref} /> },
  ];

  return (
    <div className="min-h-screen bg-black">
      <NJNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
        {/* Page header */}
        <div className="text-center mb-6">
          <p className="text-[0.6rem] sm:text-xs tracking-[0.4em] uppercase text-white/25 font-medium mb-2">
            Presentation Slides
          </p>
          <h1 className="text-2xl sm:text-4xl font-light text-white tracking-tight">
            Provider Town Hall{" "}
            <em className="italic font-extralight" style={{ color: "hsl(270, 80%, 75%)" }}>Deck</em>
          </h1>
        </div>

        {slides.map((s, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs text-white/30 font-mono">Slide {i + 1} — {s.label}</span>
              <button
                onClick={() => downloadSlide(s.ref, `slide-${i + 1}-${s.label.toLowerCase().replace(/\s+/g, "-")}`)}
                className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg transition-all hover:bg-white/10"
                style={{ color: "hsl(270, 70%, 70%)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <Download className="w-3.5 h-3.5" />
                Download PNG
              </button>
            </div>
            {s.component}
          </div>
        ))}
      </div>

      <NJFooter />
    </div>
  );
}
