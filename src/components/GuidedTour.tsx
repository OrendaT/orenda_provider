import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ChevronRight, ChevronLeft, Sparkles, ArrowDown, CheckCircle2,
  MessageSquare, User, Send, Eye, Smartphone, Calendar, FileText,
  ClipboardList, Settings, SkipForward, RotateCcw, Minimize2, Maximize2,
  ExternalLink, ThumbsUp, ThumbsDown
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/* ── SESSION ── */
const SESSION_KEY = "wt_session_id";
function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(SESSION_KEY, id); }
  return id;
}

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf_placeholder/viewform";

/* ── STEP DEFINITIONS ── */
type Step = {
  id: string;
  title: string;
  bullets: string[];
  highlight?: string;
  icon: React.ReactNode;
  note?: string;
};

const STEPS: Step[] = [
  {
    id: "intro",
    title: "NJ Office Platform Overview",
    bullets: [
      "Built for Schedule II regulations now requiring in-person visits in New Jersey.",
      "A single link we send to patients with everything they need:",
      "• Office locations & directions",
      "• Arrival instructions & what to expect",
      "• Key contact info",
      "• Digital check-in",
      "• Scheduling tool (pending review)",
    ],
    icon: <Sparkles className="w-6 h-6 text-white" />,
  },
  {
    id: "patient-info",
    title: "NJ Office — Key Patient Info",
    highlight: "#find-office",
    bullets: [
      "This is a one-stop resource you can send directly to patients — everything they need at their fingertips.",
      "• How to find the office",
      "• Directions & building access",
      "• What to expect on arrival",
      "• Contact information",
      "It's also a great reference for your team — if anyone fields patient calls, all the answers are right here.",
    ],
    icon: <Eye className="w-6 h-6 text-white" />,
  },
  {
    id: "portal-checkin",
    title: "Digital Check-In",
    highlight: "#arrival",
    bullets: [
      "Patients can check in digitally when they arrive at the office.",
      "• Admins receive live notifications",
      "• Providers are alerted the patient has arrived",
      "• A separate admin dashboard tracks all check-ins — everything is saved in one place",
      "Real-time visibility instead of a manual process.",
    ],
    icon: <Smartphone className="w-6 h-6 text-white" />,
  },
  {
    id: "google-form",
    title: "Previous Check-In Method",
    bullets: [
      "Previously, check-in was handled via a Google Form.",
      "We're evaluating whether the portal check-in is a better workflow — it connects directly to our backend and updates in real time.",
    ],
    note: "google-form-preview",
    icon: <ClipboardList className="w-6 h-6 text-white" />,
  },
  {
    id: "scheduling-tool",
    title: "Scheduling Tool (Pending Review)",
    highlight: "#schedule",
    bullets: [
      "A self-booking option where patients could:",
      "• Search by provider",
      "• Filter by date & select available slots",
      "⚠ This is a sample mock-up — provider credentialing & insurance configs would need to be added before launch.",
    ],
    icon: <Calendar className="w-6 h-6 text-white" />,
  },
  {
    id: "current-scheduling",
    title: "Current Scheduling Workflow",
    bullets: [
      "Today, appointments come in through calls, emails, and providers reaching out to patients directly.",
      "If we implement a booking link, we could send it to patients so they can book online — quickly and without back-and-forth.",
    ],
    icon: <FileText className="w-6 h-6 text-white" />,
  },
  {
    id: "integration",
    title: "SimplePractice & Portal Sync",
    bullets: [
      "Regardless of scheduling approach, all appointments still need to be added to the SimplePractice calendar.",
      "This portal is for in-office coordination and letting patients book online vs. calling/emailing.",
      "If we move forward with the scheduling tool, data must stay in sync across platforms for accurate availability.",
      "We've built a bulk upload tool from a SimplePractice report — takes less than a minute end-to-end.",
      "The NJ admin would need to check this a few times a day to keep things accurate.",
      "There's no automatic sync between SimplePractice and any other portal, so we need to decide if the scheduling tool is worth it given this manual step.",
    ],
    icon: <Settings className="w-6 h-6 text-white" />,
  },
  {
    id: "feedback",
    title: "Your Feedback",
    bullets: [],
    icon: <MessageSquare className="w-6 h-6 text-white" />,
  },
];

/* ── COMPONENT ── */
interface GuidedTourProps {
  onOpenCheckIn: () => void;
  onOpenNav: () => void;
  onNavigateCommunication: () => void;
}

type Phase = "idle" | "name-entry" | "walkthrough" | "done";

export default function GuidedTour({ onOpenCheckIn }: GuidedTourProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [reviewerName, setReviewerName] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showGoogleForm, setShowGoogleForm] = useState(false);
  const [nudgeVisible, setNudgeVisible] = useState(false);

  // Feedback form
  const [overallThoughts, setOverallThoughts] = useState("");
  const [checkinPref, setCheckinPref] = useState("");
  const [schedulingFeedback, setSchedulingFeedback] = useState("");
  const [schedulingVote, setSchedulingVote] = useState("");
  const [schedulingWhyHelpful, setSchedulingWhyHelpful] = useState("");
  const [schedulingWhyNot, setSchedulingWhyNot] = useState("");
  const [issuesSpotted, setIssuesSpotted] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("wt_complete") === "true") setDismissed(true);
  }, []);

  // Nudge animation when collapsed — pulse every 8s
  useEffect(() => {
    if (!collapsed) return;
    const interval = setInterval(() => {
      setNudgeVisible(true);
      setTimeout(() => setNudgeVisible(false), 4000);
    }, 8000);
    // Show first nudge after 3s
    const first = setTimeout(() => {
      setNudgeVisible(true);
      setTimeout(() => setNudgeVisible(false), 4000);
    }, 3000);
    return () => { clearInterval(interval); clearTimeout(first); };
  }, [collapsed]);

  const step = STEPS[currentStep];
  const total = STEPS.length;
  const isFeedbackStep = step.id === "feedback";
  const gradientBg = "linear-gradient(135deg, hsl(270, 80%, 45%), hsl(280, 90%, 55%), hsl(300, 70%, 50%))";
  const cardBg = "linear-gradient(145deg, hsl(0, 0%, 100%) 0%, hsl(270, 30%, 97%) 100%)";

  const startTour = () => setPhase("name-entry");

  const beginWalkthrough = () => {
    if (!reviewerName.trim()) return;
    setPhase("walkthrough");
    setCurrentStep(0);
  };

  const goTo = (idx: number) => {
    setCurrentStep(idx);
    setCollapsed(false);
    const s = STEPS[idx];
    if (s.highlight) {
      setTimeout(() => {
        document.querySelector(s.highlight!)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
    if (s.id === "portal-checkin") {
      setTimeout(() => onOpenCheckIn(), 800);
    }
    if (s.id === "google-form") {
      setTimeout(() => setShowGoogleForm(true), 600);
    } else {
      setShowGoogleForm(false);
    }
  };

  const next = () => { if (currentStep < total - 1) goTo(currentStep + 1); };
  const prev = () => { if (currentStep > 0) goTo(currentStep - 1); };

  const skipTour = () => {
    setPhase("idle");
    setDismissed(true);
    sessionStorage.setItem("wt_complete", "true");
  };

  const restartTour = () => {
    sessionStorage.removeItem("wt_complete");
    setDismissed(false);
    setPhase("name-entry");
    setCurrentStep(0);
    setSubmitted(false);
    setCollapsed(false);
    setOverallThoughts("");
    setCheckinPref("");
    setSchedulingFeedback("");
    setSchedulingVote("");
    setSchedulingWhyHelpful("");
    setSchedulingWhyNot("");
    setIssuesSpotted("");
    setAdditionalComments("");
  };

  const submitFeedback = async () => {
    const combinedScheduling = [
      schedulingFeedback,
      schedulingVote ? `Vote: ${schedulingVote === "yes" ? "Add scheduling tool" : "Do not add scheduling tool"}` : "",
      schedulingWhyHelpful ? `Why helpful: ${schedulingWhyHelpful}` : "",
      schedulingWhyNot ? `Why not: ${schedulingWhyNot}` : "",
    ].filter(Boolean).join(" | ");

    try {
      await (supabase.from("walkthrough_feedback") as any).insert({
        reviewer_name: reviewerName.trim(),
        session_id: getSessionId(),
        overall_thoughts: overallThoughts.trim() || null,
        checkin_preference: checkinPref || null,
        scheduling_feedback: combinedScheduling.trim() || null,
        issues_spotted: issuesSpotted.trim() || null,
        additional_comments: additionalComments.trim() || null,
      });
    } catch (e) {
      console.error("Feedback submit error:", e);
    }
    setSubmitted(true);
    sessionStorage.setItem("wt_complete", "true");
    setTimeout(() => {
      setPhase("idle");
      setDismissed(true);
    }, 3000);
  };

  // Reminder popup if user skips without submitting feedback
  const handleSkipWithReminder = useCallback(() => {
    skipTour();
  }, []);

  if (dismissed) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={restartTour}
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-xs font-bold tracking-wide"
        style={{ background: "hsl(270, 60%, 40%)" }}
      >
        <RotateCcw className="w-3.5 h-3.5" /> Replay Walkthrough
      </motion.button>
    );
  }

  return (
    <>
      {/* ── Google Form Preview Modal ── */}
      <AnimatePresence>
        {showGoogleForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowGoogleForm(false)} />
            <motion.div
              initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-primary/10"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-primary/10 bg-muted/30">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  <p className="text-sm font-bold text-foreground">Previous Google Form Check-In</p>
                </div>
                <button onClick={() => setShowGoogleForm(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <X className="w-4 h-4 text-foreground/60" />
                </button>
              </div>
              <div className="p-6">
                <div className="rounded-xl border border-primary/10 bg-muted/20 p-8 text-center">
                  <ClipboardList className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                  <p className="text-sm text-foreground/70 mb-1">This was the previous check-in method — a Google Form patients would fill out on arrival.</p>
                  <p className="text-xs text-foreground/40">The portal-based check-in replaces this with real-time notifications and backend integration.</p>
                  <a
                    href={GOOGLE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" /> View Google Form
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING START BUTTON ── */}
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
            <span>Platform Walkthrough</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── ACTIVE WALKTHROUGH ── */}
      <AnimatePresence mode="wait">
        {phase === "name-entry" && (
          <motion.div
            key="name-entry"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={skipTour} />
            <motion.div
              initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-primary/20"
              style={{ background: cardBg }}
            >
              <div className="px-7 pt-8 pb-2 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: gradientBg }}>
                  <User className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">Welcome</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  Enter your name to begin. We'll walk through each section and collect your feedback at the end.
                </p>
              </div>
              <div className="px-7 py-5">
                <label className="text-[10px] tracking-[0.3em] uppercase font-bold text-primary/50 block mb-2">Your Name</label>
                <input
                  type="text" value={reviewerName} onChange={(e) => setReviewerName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && beginWalkthrough()}
                  placeholder="e.g. Dr. Smith" maxLength={100} autoFocus
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-primary/15 bg-white text-foreground text-sm font-medium placeholder:text-foreground/30 focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
              <div className="px-7 pb-7">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={beginWalkthrough} disabled={!reviewerName.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-bold tracking-wide shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: gradientBg }}
                >
                  Start Walkthrough <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {phase === "walkthrough" && (
          <motion.div key="walkthrough" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Vignette overlay */}
            {!collapsed && (
              <div className="fixed inset-0 z-[90] pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, transparent 30%, hsla(270, 50%, 10%, 0.12) 100%)" }} />
            )}

            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 z-[201] h-1" style={{ background: "hsl(270, 20%, 90%)" }}>
              <motion.div className="h-full" style={{ background: gradientBg }}
                animate={{ width: `${((currentStep + 1) / total) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }} />
            </div>

            {/* Step counter + skip */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[201] flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-primary/10">
                {STEPS.map((_, i) => (
                  <div key={i} className={`rounded-full transition-all duration-300 ${
                    i === currentStep ? "w-6 h-2 bg-primary" :
                    i < currentStep ? "w-2 h-2 bg-primary/50" : "w-2 h-2 bg-primary/15"
                  }`} />
                ))}
              </div>
              <button onClick={skipTour}
                className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-full px-3 py-2 shadow-lg border border-primary/10 text-foreground/50 hover:text-foreground text-xs font-semibold transition-colors">
                <SkipForward className="w-3 h-3" /> Skip
              </button>
            </div>

            {/* ── COLLAPSED STATE ── */}
            <AnimatePresence>
              {collapsed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="fixed bottom-6 right-6 z-[201]"
                >
                  <motion.button
                    onClick={() => setCollapsed(false)}
                    animate={nudgeVisible ? { scale: [1, 1.08, 1], boxShadow: ["0 4px 20px hsla(270,80%,50%,0.3)", "0 4px 30px hsla(270,80%,50%,0.6)", "0 4px 20px hsla(270,80%,50%,0.3)"] } : {}}
                    transition={{ duration: 1.5, repeat: nudgeVisible ? Infinity : 0 }}
                    className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-white text-xs font-bold tracking-wide shadow-2xl"
                    style={{ background: gradientBg }}
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Continue Walkthrough</span>
                    <span className="bg-white/20 rounded-full px-2 py-0.5 text-[10px]">{currentStep + 1}/{total}</span>
                  </motion.button>
                  <AnimatePresence>
                    {nudgeVisible && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -top-10 right-0 bg-foreground text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap"
                      >
                        👋 Don't forget to finish!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── EXPANDED STEP CARD ── */}
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`fixed z-[201] w-[94vw] max-w-lg ${
                    step.id === "portal-checkin"
                      ? "bottom-4 right-4"
                      : "bottom-4 left-1/2 -translate-x-1/2"
                  }`}
                >
                  {/* Bouncing arrow */}
                  {step.highlight && (
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      className="flex justify-center mb-2"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ background: gradientBg }}>
                        <ArrowDown className="w-4 h-4 text-white rotate-180" />
                      </div>
                    </motion.div>
                  )}

                  <div className="rounded-3xl overflow-hidden shadow-2xl border border-primary/15 max-h-[65vh] overflow-y-auto" style={{ background: cardBg }}>
                    {/* Header */}
                    <div className="px-5 sm:px-6 pt-5 pb-3">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: gradientBg }}>
                          {step.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] tracking-[0.3em] uppercase font-bold text-primary/40">
                            Step {currentStep + 1} of {total}
                          </p>
                          <h3 className="text-base font-bold text-foreground leading-tight truncate">{step.title}</h3>
                        </div>
                        <button
                          onClick={() => setCollapsed(true)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-primary/10 transition-colors shrink-0"
                          title="Minimize"
                        >
                          <Minimize2 className="w-4 h-4 text-foreground/40" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    {!isFeedbackStep ? (
                      <div className="px-5 sm:px-6 pb-4">
                        <div className="space-y-1">
                          {step.bullets.map((b, i) => (
                            <p key={i} className={`text-sm leading-relaxed ${
                              b.startsWith("•") ? "text-foreground/70 pl-1" :
                              b.startsWith("⚠") ? "text-amber-600 font-semibold" :
                              "text-foreground/80 font-medium"
                            }`}>
                              {b}
                            </p>
                          ))}
                        </div>
                        {step.note === "google-form-preview" && (
                          <button
                            onClick={() => setShowGoogleForm(true)}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors bg-primary/5 px-3 py-2 rounded-xl"
                          >
                            <ExternalLink className="w-3 h-3" /> View Previous Google Form
                          </button>
                        )}
                      </div>
                    ) : (
                      /* ── FEEDBACK FORM ── */
                      <div className="px-5 sm:px-6 pb-4">
                        {!submitted ? (
                          <div className="space-y-4">
                            <div className="bg-primary/5 rounded-xl p-3 border border-primary/10">
                              <p className="text-foreground/80 text-sm leading-relaxed font-medium">
                                🙏 Please help us shape this platform — your feedback is essential to this process.
                              </p>
                            </div>

                            <div>
                              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary/50 block mb-1.5">Overall Thoughts</label>
                              <textarea value={overallThoughts} onChange={(e) => setOverallThoughts(e.target.value)}
                                rows={2} placeholder="What are your initial impressions?"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-primary/15 bg-white text-foreground text-sm placeholder:text-foreground/25 focus:outline-none focus:border-primary/30 transition-colors resize-none" />
                            </div>

                            <div>
                              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary/50 block mb-1.5">Check-In Preference</label>
                              <div className="flex gap-2">
                                {[
                                  { label: "Digital Check-In", value: "portal" },
                                  { label: "Google Form", value: "google_form" },
                                  { label: "Unsure", value: "unsure" },
                                ].map((opt) => (
                                  <button key={opt.value} onClick={() => setCheckinPref(opt.value)}
                                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border ${
                                      checkinPref === opt.value
                                        ? "bg-primary text-white border-primary shadow-md"
                                        : "bg-white text-foreground/60 border-primary/15 hover:border-primary/30"
                                    }`}>
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary/50 block mb-1.5">Should we add the scheduling tool?</label>
                              <div className="flex gap-2 mb-2">
                                <button onClick={() => setSchedulingVote("yes")}
                                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border ${
                                    schedulingVote === "yes"
                                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                                      : "bg-white text-foreground/60 border-primary/15 hover:border-emerald-300"
                                  }`}>
                                  <ThumbsUp className="w-3.5 h-3.5" /> Yes, add it
                                </button>
                                <button onClick={() => setSchedulingVote("no")}
                                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border ${
                                    schedulingVote === "no"
                                      ? "bg-red-500 text-white border-red-500 shadow-md"
                                      : "bg-white text-foreground/60 border-primary/15 hover:border-red-300"
                                  }`}>
                                  <ThumbsDown className="w-3.5 h-3.5" /> Not now
                                </button>
                              </div>
                              {schedulingVote === "yes" && (
                                <textarea value={schedulingWhyHelpful} onChange={(e) => setSchedulingWhyHelpful(e.target.value)}
                                  rows={2} placeholder="Why would the scheduling tool be helpful?"
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-primary/15 bg-white text-foreground text-sm placeholder:text-foreground/25 focus:outline-none focus:border-primary/30 transition-colors resize-none" />
                              )}
                              {schedulingVote === "no" && (
                                <textarea value={schedulingWhyNot} onChange={(e) => setSchedulingWhyNot(e.target.value)}
                                  rows={2} placeholder="Why doesn't it make sense right now?"
                                  className="w-full px-3.5 py-2.5 rounded-xl border border-primary/15 bg-white text-foreground text-sm placeholder:text-foreground/25 focus:outline-none focus:border-primary/30 transition-colors resize-none" />
                              )}
                            </div>

                            <div>
                              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary/50 block mb-1.5">Additional Scheduling Thoughts</label>
                              <textarea value={schedulingFeedback} onChange={(e) => setSchedulingFeedback(e.target.value)}
                                rows={2} placeholder="Any other thoughts on the scheduling workflow?"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-primary/15 bg-white text-foreground text-sm placeholder:text-foreground/25 focus:outline-none focus:border-primary/30 transition-colors resize-none" />
                            </div>

                            <div>
                              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary/50 block mb-1.5">Issues Spotted</label>
                              <textarea value={issuesSpotted} onChange={(e) => setIssuesSpotted(e.target.value)}
                                rows={2} placeholder="Anything broken, confusing, or unclear?"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-primary/15 bg-white text-foreground text-sm placeholder:text-foreground/25 focus:outline-none focus:border-primary/30 transition-colors resize-none" />
                            </div>

                            <div>
                              <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary/50 block mb-1.5">Additional Comments</label>
                              <textarea value={additionalComments} onChange={(e) => setAdditionalComments(e.target.value)}
                                rows={2} placeholder="Anything else you'd like to share?"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-primary/15 bg-white text-foreground text-sm placeholder:text-foreground/25 focus:outline-none focus:border-primary/30 transition-colors resize-none" />
                            </div>
                          </div>
                        ) : (
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: gradientBg }}>
                              <CheckCircle2 className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="text-lg font-bold text-foreground mb-1">Thank you, {reviewerName}!</h4>
                            <p className="text-foreground/60 text-sm">Your feedback has been recorded.</p>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Navigation buttons */}
                    {!submitted && (
                      <div className="px-5 sm:px-6 pb-5 flex items-center gap-2">
                        {currentStep > 0 && (
                          <button onClick={prev}
                            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-primary/15 text-foreground/60 text-xs font-bold hover:bg-primary/5 transition-colors">
                            <ChevronLeft className="w-3.5 h-3.5" /> Back
                          </button>
                        )}
                        <div className="flex-1" />
                        {!isFeedbackStep ? (
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={next}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-xs font-bold tracking-wide shadow-lg"
                            style={{ background: gradientBg }}>
                            Next <ChevronRight className="w-3.5 h-3.5" />
                          </motion.button>
                        ) : (
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={submitFeedback}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-xs font-bold tracking-wide shadow-lg"
                            style={{ background: gradientBg }}>
                            <Send className="w-3.5 h-3.5" /> Send Feedback
                          </motion.button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
