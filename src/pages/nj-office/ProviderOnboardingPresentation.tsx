import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Key, Calendar, Clock, Users, Phone, Shield, Trash2,
  ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Maximize2, Minimize2,
  Building2, AlertTriangle, Bell, DoorOpen, Sparkles
} from "lucide-react";
import logo from "@/assets/orenda-logo-purple.png";

/* ─── slide data ─── */
interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  content: React.ReactNode;
  bg: string;
}

const bulletStyle = "flex items-start gap-4 text-left";
const bulletDot = (color = "hsl(270, 70%, 60%)") => (
  <span className="mt-2.5 w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
);
const bulletText = "text-[1.35rem] sm:text-[1.5rem] leading-relaxed text-white/80";
const headingStyle = "text-[2.2rem] sm:text-[2.8rem] font-semibold text-white leading-tight mb-8";
const subHeadStyle = "text-[1.1rem] sm:text-[1.2rem] text-white/40 uppercase tracking-[0.3em] font-medium mb-4";

const slides: Slide[] = [
  {
    id: "title",
    title: "",
    bg: "linear-gradient(160deg, hsl(270, 100%, 6%) 0%, hsl(270, 60%, 18%) 50%, hsl(270, 45%, 30%) 100%)",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <img src={logo} alt="Orenda" className="h-14 sm:h-16 brightness-0 invert opacity-40 mb-10" />
        <h1 className="text-[2.8rem] sm:text-[4rem] md:text-[4.5rem] font-light text-white leading-[1.05] tracking-tight mb-5">
          Provider <em className="italic font-extralight" style={{ color: "hsl(270, 80%, 75%)" }}>Onboarding</em>
        </h1>
        <p className="text-white/35 text-lg sm:text-xl max-w-2xl">
          Everything you need to know for your NJ office days
        </p>
      </div>
    ),
  },
  {
    id: "agreement",
    title: "Office Use Agreement",
    icon: FileText,
    bg: "linear-gradient(160deg, hsl(270, 100%, 8%) 0%, hsl(270, 55%, 20%) 100%)",
    content: (
      <div className="flex flex-col justify-center h-full px-10 sm:px-16 max-w-5xl mx-auto">
        <p className={subHeadStyle}>Step 1</p>
        <h2 className={headingStyle}>Review & Sign the Office Use Agreement</h2>
        <div className="space-y-5">
          <div className={bulletStyle}>
            {bulletDot()}
            <p className={bulletText}>
              Please note there is a <strong className="text-white">48-hour cancellation policy</strong> for all booked office time.
            </p>
          </div>
          <div className={bulletStyle}>
            {bulletDot()}
            <p className={bulletText}>
              We provide <strong className="text-white">swipe cards & keys</strong> for building access. If a swipe card is misplaced, there is a <strong className="text-white">$65 replacement fee</strong>.
            </p>
          </div>
          <div className={bulletStyle}>
            {bulletDot()}
            <p className={bulletText}>
              If you leave Orenda, the swipe card must be returned — otherwise the replacement cost will be deducted from your final payment.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "access",
    title: "Building Access",
    icon: Key,
    bg: "linear-gradient(160deg, hsl(275, 100%, 8%) 0%, hsl(270, 50%, 22%) 100%)",
    content: (
      <div className="flex flex-col justify-center h-full px-10 sm:px-16 max-w-5xl mx-auto">
        <p className={subHeadStyle}>Step 2</p>
        <h2 className={headingStyle}>Building Access & Swipe Cards</h2>
        <div className="space-y-5">
          <div className={bulletStyle}>
            {bulletDot()}
            <p className={bulletText}>
              We recommend getting a <strong className="text-white">permanent swipe card</strong> so you can be registered with the building for <strong className="text-white">24/7 access</strong>.
            </p>
          </div>
          <div className={bulletStyle}>
            {bulletDot()}
            <p className={bulletText}>
              Contact the <strong className="text-white">NJ Admin team</strong> to coordinate your card and building registration.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "booking",
    title: "How to Book",
    icon: Calendar,
    bg: "linear-gradient(160deg, hsl(265, 100%, 8%) 0%, hsl(265, 50%, 22%) 100%)",
    content: (
      <div className="flex flex-col justify-center h-full px-10 sm:px-16 max-w-5xl mx-auto">
        <p className={subHeadStyle}>Step 3</p>
        <h2 className={headingStyle}>How to Book Office Time</h2>
        <div className="space-y-5">
          <div className={bulletStyle}>
            {bulletDot("hsl(270, 70%, 60%)")}
            <p className={bulletText}>
              Book through the <strong className="text-white">Orenda booking portal</strong> — minimum <strong className="text-white">48 hours in advance</strong>.
            </p>
          </div>
          <div className={bulletStyle}>
            {bulletDot("hsl(270, 70%, 60%)")}
            <p className={bulletText}>
              <strong className="text-white">Block out SimplePractice</strong> to show you will be in-person that day.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "patientlist",
    title: "Patient Lists & Deadlines",
    icon: Users,
    bg: "linear-gradient(160deg, hsl(270, 100%, 7%) 0%, hsl(260, 55%, 20%) 100%)",
    content: (
      <div className="flex flex-col justify-center h-full px-10 sm:px-16 max-w-5xl mx-auto">
        <p className={subHeadStyle}>Important Deadlines</p>
        <h2 className={headingStyle}>Patient Lists & Scheduling Rules</h2>
        <div className="space-y-5">
          <div className={bulletStyle}>
            {bulletDot("hsl(200, 70%, 60%)")}
            <p className={bulletText}>
              Our team will provide your <strong className="text-white">patient list 24 hours before</strong> (or the night before) your scheduled office day.
            </p>
          </div>
          <div className={bulletStyle}>
            {bulletDot("hsl(200, 70%, 60%)")}
            <p className={bulletText}>
              Patient lists <strong className="text-white">cannot be changed</strong> less than 24 hours before the start of your scheduled day.
            </p>
          </div>
          <div className={bulletStyle}>
            {bulletDot("hsl(45, 70%, 60%)")}
            <p className={bulletText}>
              <strong className="text-white">Weekends:</strong> Patient lists must be locked and finalized by <strong className="text-white">Friday at 9:00 AM</strong>.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "afterhours",
    title: "After-Hours Protocol",
    icon: Clock,
    bg: "linear-gradient(160deg, hsl(270, 100%, 6%) 0%, hsl(275, 60%, 18%) 100%)",
    content: (
      <div className="flex flex-col justify-center h-full px-10 sm:px-16 max-w-5xl mx-auto">
        <p className={subHeadStyle}>After Hours</p>
        <h2 className={headingStyle}>After-Hours Office Protocol</h2>
        <div className="space-y-5">
          <div className={bulletStyle}>
            {bulletDot("hsl(45, 70%, 55%)")}
            <p className={bulletText}>
              If using the office after hours, place the <strong className="text-white">arrival sign by the entrance</strong> so patients can text <strong className="text-white">(201) 685-4863</strong> to notify the NJ Admin they've arrived.
            </p>
          </div>
          <div className={bulletStyle}>
            {bulletDot("hsl(45, 70%, 55%)")}
            <p className={bulletText}>
              Our NJ Admin will <strong className="text-white">immediately notify you</strong> when your patient arrives and is waiting, as well as any delays or cancellations.
            </p>
          </div>
          <div className={bulletStyle}>
            {bulletDot("hsl(45, 70%, 55%)")}
            <p className={bulletText}>
              Please <strong className="text-white">return the arrival sign</strong> at the end of your day.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "endofday",
    title: "End of Day",
    icon: DoorOpen,
    bg: "linear-gradient(160deg, hsl(270, 100%, 7%) 0%, hsl(270, 45%, 22%) 100%)",
    content: (
      <div className="flex flex-col justify-center h-full px-10 sm:px-16 max-w-5xl mx-auto">
        <p className={subHeadStyle}>Closing Up</p>
        <h2 className={headingStyle}>End of Day Responsibilities</h2>
        <div className="space-y-5">
          <div className={bulletStyle}>
            {bulletDot("hsl(150, 50%, 55%)")}
            <p className={bulletText}>
              <strong className="text-white">Return the key to the lockbox</strong> if you used it, and make sure the door is locked.
            </p>
          </div>
          <div className={bulletStyle}>
            {bulletDot("hsl(150, 50%, 55%)")}
            <p className={bulletText}>
              <strong className="text-white">Hoboken:</strong> A cleaning service handles the offices — leave the space tidy.
            </p>
          </div>
          <div className={bulletStyle}>
            {bulletDot("hsl(150, 50%, 55%)")}
            <p className={bulletText}>
              <strong className="text-white">Edison:</strong> Please place any trash <strong className="text-white">outside of the office</strong> at the end of the business day.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "closing",
    title: "",
    bg: "linear-gradient(160deg, hsl(270, 100%, 6%) 0%, hsl(270, 60%, 18%) 50%, hsl(270, 45%, 30%) 100%)",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <img src={logo} alt="Orenda" className="h-14 sm:h-16 brightness-0 invert opacity-40 mb-10" />
        <h2 className="text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] font-light text-white leading-[1.1] tracking-tight mb-5">
          Questions?
        </h2>
        <p className="text-white/40 text-base sm:text-lg max-w-xl">
          Reach out to the NJ Admin team — we're here to make your office days seamless.
        </p>
        <div className="mt-10 flex items-center gap-3 px-6 py-3 rounded-full" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <Phone className="w-5 h-5" style={{ color: "hsl(270, 70%, 70%)" }} />
          <span className="text-white/60 text-sm">(201) 685-4863</span>
        </div>
      </div>
    ),
  },
];

/* ─── component ─── */
export default function ProviderOnboardingPresentation() {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goNext = useCallback(() => setCurrent((p) => Math.min(p + 1, slides.length - 1)), []);
  const goPrev = useCallback(() => setCurrent((p) => Math.max(p - 1, 0)), []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      if (e.key === "Escape" && isFullscreen) document.exitFullscreen();
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, isFullscreen, toggleFullscreen]);

  const slide = slides[current];

  return (
    <div className="h-screen w-screen flex flex-col bg-black overflow-hidden select-none">
      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0"
            style={{ background: slide.bg }}
          >
            {/* Dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative z-10 h-full">
              {slide.content}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Click zones */}
        <div className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer" onClick={goPrev} />
        <div className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer" onClick={goNext} />
      </div>

      {/* Controls bar */}
      <div className="h-14 flex items-center justify-between px-4 sm:px-6 bg-black/80 border-t border-white/[0.06] z-30">
        {/* Left: slide counter */}
        <div className="flex items-center gap-3">
          <span className="text-white/30 text-xs font-mono">
            {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        {/* Center: progress dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? "hsl(270, 70%, 60%)" : i < current ? "hsl(270, 40%, 40%)" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>

        {/* Right: nav + fullscreen */}
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goNext}
            disabled={current === slides.length - 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all ml-1"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
