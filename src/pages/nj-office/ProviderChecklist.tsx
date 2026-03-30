import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, Circle, FileText, Building2, Key, Calendar, Users,
  Phone, MapPin, Clock, Coffee, Shield, ArrowRight, ChevronDown,
  ChevronUp, Clipboard, AlertTriangle, Star, Sparkles
} from "lucide-react";
import NJNavbar from "@/components/NJNavbar";
import NJFooter from "@/components/NJFooter";
import logo from "@/assets/orenda-logo-purple.png";

interface CheckItem {
  id: string;
  label: string;
  detail?: string;
}

interface CheckSection {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  items: CheckItem[];
}

const onboardingSections: CheckSection[] = [
  {
    id: "agreement",
    title: "Office Agreement",
    icon: FileText,
    color: "hsl(270, 60%, 50%)",
    items: [
      { id: "o1", label: "Review & sign the Office Use Agreement", detail: "Sent via Google Docs by the NJ Admin team." },
      { id: "o2", label: "Acknowledge the 48-hour cancellation policy" },
      { id: "o3", label: "Confirm $65 swipe card replacement policy" },
    ],
  },
  {
    id: "access",
    title: "Building Access",
    icon: Key,
    color: "hsl(270, 70%, 45%)",
    items: [
      { id: "a1", label: "Request a permanent swipe card (or register with the building)", detail: "Contact the NJ Admin team to coordinate. Required for 24/7 access." },
      { id: "a2", label: "Receive lockbox code from NJ Admin", detail: "Lockbox code: 0000 — used for key access at both locations." },
      { id: "a3", label: "Test your building access before your first patient day" },
    ],
  },
  {
    id: "scheduling",
    title: "Scheduling & Onboarding",
    icon: Calendar,
    color: "hsl(280, 60%, 45%)",
    items: [
      { id: "s1", label: "Complete onboarding call with NJ Admin", detail: "Scheduled via Google Calendar." },
      { id: "s2", label: "Book your first office day via the booking portal" },
      { id: "s3", label: "Verify SimplePractice is set up for in-person visits" },
      { id: "s4", label: "Confirm patient schedule has been consolidated & shared" },
    ],
  },
  {
    id: "comms",
    title: "Communication Setup",
    icon: Phone,
    color: "hsl(260, 55%, 50%)",
    items: [
      { id: "c1", label: "Save the patient arrival text line: (201) 685-4863" },
      { id: "c2", label: "Review welcome email & onboarding materials" },
      { id: "c3", label: "Confirm you're receiving appointment reminders" },
    ],
  },
];

const dayOfSections: CheckSection[] = [
  {
    id: "before",
    title: "Before You Arrive",
    icon: MapPin,
    color: "hsl(270, 60%, 50%)",
    items: [
      { id: "d1", label: "Confirm your patient list for the day" },
      { id: "d2", label: "Ensure patients received reminders & directions" },
      { id: "d3", label: "Building Send List delivered to Regus by 9 AM (day before)", detail: "NJ Admin handles this — confirm it was sent." },
    ],
  },
  {
    id: "arrival",
    title: "Arriving at the Office",
    icon: Building2,
    color: "hsl(270, 70%, 45%)",
    items: [
      { id: "d4", label: "Use swipe card or lockbox (code: 0000) to access the building" },
      { id: "d5", label: "If after 5 PM: place QR check-in sign by the entrance", detail: "Required for after-hours visits so patients can text the arrival line." },
      { id: "d6", label: "Set up your workspace (BP cuff, scale, Wi-Fi connection)" },
    ],
  },
  {
    id: "patients",
    title: "Patient Flow",
    icon: Users,
    color: "hsl(280, 60%, 45%)",
    items: [
      { id: "d7", label: "NJ Admin notifies you when each patient arrives" },
      { id: "d8", label: "Greet patient and escort to private office", detail: "For after-hours visits, you must personally greet patients at the entrance." },
      { id: "d9", label: "Complete visit notes in SimplePractice same-day", detail: "Missing notes are tracked — keep them current!" },
    ],
  },
  {
    id: "closeout",
    title: "End of Day",
    icon: Shield,
    color: "hsl(260, 55%, 50%)",
    items: [
      { id: "d10", label: "Return key to lockbox after visit" },
      { id: "d11", label: "Leave office clean & reset for next provider" },
      { id: "d12", label: "Complete all notes — do not leave with missing notes" },
      { id: "d13", label: "Book your next office day if recurring" },
    ],
  },
];

function ChecklistSection({ section, checked, onToggle, defaultOpen = true }: {
  section: CheckSection;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const completedCount = section.items.filter(i => checked[i.id]).length;
  const allDone = completedCount === section.items.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border overflow-hidden transition-all"
      style={{
        borderColor: allDone ? "hsl(150, 50%, 80%)" : "hsl(270, 15%, 90%)",
        background: allDone ? "hsl(150, 40%, 97%)" : "white",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 sm:p-6 text-left hover:bg-black/[0.01] transition-colors"
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: allDone ? "hsl(150, 50%, 90%)" : `${section.color}15` }}
        >
          {allDone ? (
            <CheckCircle2 className="w-6 h-6" style={{ color: "hsl(150, 50%, 40%)" }} />
          ) : (
            <section.icon className="w-5 h-5" style={{ color: section.color }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base" style={{ color: "hsl(270, 40%, 15%)" }}>
            {section.title}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "hsl(270, 10%, 55%)" }}>
            {completedCount} of {section.items.length} complete
          </p>
        </div>
        {/* Progress ring */}
        <div className="flex items-center gap-3">
          <svg width="36" height="36" viewBox="0 0 36 36" className="flex-shrink-0">
            <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(270, 10%, 92%)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15" fill="none"
              stroke={allDone ? "hsl(150, 50%, 45%)" : section.color}
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray={`${(completedCount / section.items.length) * 94.25} 94.25`}
              transform="rotate(-90 18 18)"
              className="transition-all duration-500"
            />
          </svg>
          {open ? (
            <ChevronUp className="w-4 h-4" style={{ color: "hsl(270, 10%, 60%)" }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: "hsl(270, 10%, 60%)" }} />
          )}
        </div>
      </button>

      {/* Items */}
      {open && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-2">
          {section.items.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all hover:bg-black/[0.02] group"
            >
              <div className="mt-0.5 flex-shrink-0">
                {checked[item.id] ? (
                  <CheckCircle2 className="w-5 h-5" style={{ color: "hsl(150, 50%, 45%)" }} />
                ) : (
                  <Circle className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: "hsl(270, 20%, 78%)" }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium leading-snug transition-all ${checked[item.id] ? "line-through" : ""}`}
                  style={{ color: checked[item.id] ? "hsl(270, 10%, 60%)" : "hsl(270, 30%, 20%)" }}
                >
                  {item.label}
                </p>
                {item.detail && (
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: "hsl(270, 10%, 55%)" }}>
                    {item.detail}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

const STORAGE_KEY = "provider-checklist-state";

export default function ProviderChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [activeTab, setActiveTab] = useState<"onboarding" | "dayof">("onboarding");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAll = () => {
    const sectionItems = activeTab === "onboarding" ? onboardingSections : dayOfSections;
    const idsToReset = sectionItems.flatMap(s => s.items.map(i => i.id));
    setChecked(prev => {
      const next = { ...prev };
      idsToReset.forEach(id => delete next[id]);
      return next;
    });
  };

  const activeSections = activeTab === "onboarding" ? onboardingSections : dayOfSections;
  const totalItems = activeSections.flatMap(s => s.items).length;
  const totalChecked = activeSections.flatMap(s => s.items).filter(i => checked[i.id]).length;
  const pct = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-white">
      <NJNavbar />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(170deg, hsl(270, 100%, 8%) 0%, hsl(270, 55%, 22%) 50%, hsl(270, 40%, 35%) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-14 pb-16 md:pt-20 md:pb-24 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center justify-center gap-2 mb-5">
              <img src={logo} alt="Orenda" className="h-7 brightness-0 invert opacity-50" />
            </div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-light text-white leading-[1] tracking-tight mb-3"
            >
              Provider <em className="italic font-extralight" style={{ color: "hsl(270, 80%, 75%)" }}>Checklist</em>
            </h1>
            <p className="text-white/40 text-sm sm:text-base max-w-md mx-auto">
              Everything you need — from onboarding to every office day.
            </p>
          </motion.div>

          {/* Overall progress */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-8 inline-flex items-center gap-4 rounded-full px-6 py-3"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="relative w-10 h-10">
              <svg width="40" height="40" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                <circle
                  cx="20" cy="20" r="17" fill="none"
                  stroke="hsl(270, 80%, 70%)"
                  strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={`${(pct / 100) * 106.8} 106.8`}
                  transform="rotate(-90 20 20)"
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold">
                {pct}%
              </span>
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-medium">{totalChecked} of {totalItems} tasks</p>
              <p className="text-white/40 text-xs">
                {pct === 100 ? "All done! 🎉" : pct > 50 ? "Great progress!" : "Let's get started"}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tab Switcher */}
      <div className="sticky top-0 z-30 border-b" style={{ background: "white", borderColor: "hsl(270, 15%, 92%)" }}>
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <div className="flex gap-1">
            {([
              { key: "onboarding" as const, label: "Onboarding", icon: Sparkles },
              { key: "dayof" as const, label: "Day-of Checklist", icon: Clipboard },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-all"
                style={{
                  borderColor: activeTab === tab.key ? "hsl(270, 60%, 50%)" : "transparent",
                  color: activeTab === tab.key ? "hsl(270, 60%, 40%)" : "hsl(270, 10%, 55%)",
                }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
          <button
            onClick={resetAll}
            className="text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            style={{ color: "hsl(0, 50%, 50%)" }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Checklist Content */}
      <section className="py-8 sm:py-12" style={{ background: "linear-gradient(180deg, hsl(270, 20%, 98%) 0%, white 100%)" }}>
        <div className="max-w-3xl mx-auto px-6 space-y-4">
          {activeTab === "onboarding" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3 p-4 rounded-xl mb-2"
              style={{ background: "hsl(270, 40%, 96%)", border: "1px solid hsl(270, 30%, 92%)" }}
            >
              <Star className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "hsl(270, 60%, 50%)" }} />
              <div>
                <p className="text-sm font-medium" style={{ color: "hsl(270, 40%, 25%)" }}>
                  One-time setup
                </p>
                <p className="text-xs mt-0.5" style={{ color: "hsl(270, 10%, 50%)" }}>
                  Complete these steps before your first office day. Your NJ Admin team is here to help with each step.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "dayof" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3 p-4 rounded-xl mb-2"
              style={{ background: "hsl(200, 40%, 96%)", border: "1px solid hsl(200, 30%, 90%)" }}
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "hsl(200, 60%, 45%)" }} />
              <div>
                <p className="text-sm font-medium" style={{ color: "hsl(200, 40%, 25%)" }}>
                  Recurring — every office day
                </p>
                <p className="text-xs mt-0.5" style={{ color: "hsl(200, 10%, 50%)" }}>
                  Run through this checklist each time you visit the office. Resets are available above.
                </p>
              </div>
            </motion.div>
          )}

          {activeSections.map((section) => (
            <ChecklistSection
              key={section.id}
              section={section}
              checked={checked}
              onToggle={toggle}
            />
          ))}
        </div>
      </section>

      {/* Quick Reference Footer */}
      <section className="py-10" style={{ background: "hsl(270, 20%, 97%)", borderTop: "1px solid hsl(270, 15%, 92%)" }}>
        <div className="max-w-3xl mx-auto px-6">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "hsl(270, 30%, 30%)" }}>Quick Reference</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: "Lockbox Code", value: "0000", icon: Key },
              { label: "Patient Arrival Text", value: "(201) 685-4863", icon: Phone },
              { label: "Regus Hours", value: "Mon–Fri, 9 AM – 5 PM", icon: Clock },
            ].map((ref) => (
              <div
                key={ref.label}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{ background: "white", border: "1px solid hsl(270, 15%, 92%)" }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "hsl(270, 50%, 95%)" }}>
                  <ref.icon className="w-4 h-4" style={{ color: "hsl(270, 50%, 50%)" }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: "hsl(270, 10%, 55%)" }}>{ref.label}</p>
                  <p className="text-sm font-semibold" style={{ color: "hsl(270, 40%, 15%)" }}>{ref.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NJFooter />
    </div>
  );
}
