import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, Sparkles, X, RotateCcw,
  Monitor, Columns3, AlertTriangle, Send, Clock
} from "lucide-react";

type TourStep = {
  id: string;
  title: string;
  bullets: string[];
  icon: React.ReactNode;
};

const STEPS: TourStep[] = [
  {
    id: "live",
    title: "Live Dashboard",
    icon: <Clock className="w-6 h-6 text-white" />,
    bullets: [
      "Always updating — no refresh needed.",
    ],
  },
  {
    id: "columns",
    title: "Status Grid",
    icon: <Columns3 className="w-6 h-6 text-white" />,
    bullets: [
      "Late • Due Soon • Checked In • Upcoming — moves automatically.",
    ],
  },
  {
    id: "tracking",
    title: "Real-Time Tracking",
    icon: <AlertTriangle className="w-6 h-6 text-white" />,
    bullets: [
      "Counters tick live — see exactly how late someone is.",
    ],
  },
  {
    id: "reminders",
    title: "Send Reminders",
    icon: <Send className="w-6 h-6 text-white" />,
    bullets: [
      "Email from here, or copy/paste SMS to Spruce.",
    ],
  },
];

interface AdminBoardTourProps {
  onTriggerReminder: () => void;
}

export default function AdminBoardTour({ onTriggerReminder }: AdminBoardTourProps) {
  const [phase, setPhase] = useState<"idle" | "active" | "done">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const gradientBg = "linear-gradient(135deg, hsl(270 80% 45%), hsl(280 90% 55%), hsl(300 70% 50%))";
  const cardBg = "linear-gradient(145deg, hsl(0 0% 100%) 0%, hsl(270 30% 97%) 100%)";
  const total = STEPS.length;
  const step = STEPS[currentStep];

  const startTour = () => {
    setPhase("active");
    setCurrentStep(0);
  };

  const endTour = () => {
    setPhase("done");
    setDismissed(true);
  };

  const restartTour = () => {
    setDismissed(false);
    setPhase("active");
    setCurrentStep(0);
  };

  const goTo = (idx: number) => {
    setCurrentStep(idx);
  };

  const next = () => {
    if (currentStep < total - 1) goTo(currentStep + 1);
    else endTour();
  };

  const prev = () => {
    if (currentStep > 0) goTo(currentStep - 1);
  };

  // Dismissed state — show replay button
  if (dismissed && phase === "done") {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={restartTour}
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-xs font-bold tracking-wide"
        style={{ background: "hsl(270 60% 40%)" }}
      >
        <RotateCcw className="w-3.5 h-3.5" /> Replay Tour
      </motion.button>
    );
  }

  return (
    <>
      {/* ── START BUTTON ── */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={startTour}
            className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm tracking-wide group"
            style={{ background: gradientBg }}
          >
            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
              <Sparkles className="w-5 h-5" />
            </motion.div>
            <span>Take a Tour</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── TOUR OVERLAY ── */}
      <AnimatePresence mode="wait">
        {phase === "active" && (
          <motion.div key="tour-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Vignette */}
            <div
              className="fixed inset-0 z-[90] pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, transparent 30%, hsla(270 50% 10% / 0.15) 100%)" }}
            />

            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 z-[201] h-1" style={{ background: "hsl(270 20% 90%)" }}>
              <motion.div
                className="h-full"
                style={{ background: gradientBg }}
                animate={{ width: `${((currentStep + 1) / total) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            {/* Step dots + skip */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[201] flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-primary/10">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentStep ? "w-6 h-2 bg-primary" :
                      i < currentStep ? "w-2 h-2 bg-primary/50" : "w-2 h-2 bg-primary/15"
                    }`}
                    onClick={() => goTo(i)}
                  />
                ))}
              </div>
              <button
                onClick={endTour}
                className="bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5 shadow-lg border border-primary/10 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip
              </button>
            </div>

            {/* ── STEP CARD ── */}
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] w-[95%] max-w-lg"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-primary/15" style={{ background: cardBg }}>
                {/* Card header */}
                <div className="relative px-6 py-5" style={{ background: gradientBg }}>
                  <button
                    onClick={endTour}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                      {step.icon}
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">
                        Step {currentStep + 1} of {total}
                      </p>
                      <h3 className="text-white text-lg font-bold leading-tight">{step.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Bullets */}
                <div className="px-6 py-5">
                  <div className="space-y-2.5">
                    {step.bullets.map((bullet, i) => {
                      const isSubBullet = bullet.startsWith("•");
                      return (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.06 }}
                          className={`text-sm leading-relaxed ${
                            isSubBullet
                              ? "text-foreground/70 pl-3"
                              : "text-foreground/80"
                          }`}
                        >
                          {bullet}
                        </motion.p>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation */}
                <div className="px-6 pb-5 flex items-center justify-between">
                  <button
                    onClick={prev}
                    disabled={currentStep === 0}
                    className="flex items-center gap-1.5 text-sm font-bold text-primary/60 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={next}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg"
                    style={{ background: gradientBg }}
                  >
                    {currentStep === total - 1 ? "Finish" : "Continue"}
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
