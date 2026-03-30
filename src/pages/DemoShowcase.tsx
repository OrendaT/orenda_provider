import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Smartphone, AlertTriangle, ShieldCheck } from "lucide-react";
import logo from "@/assets/orenda-logo-purple.png";
import DemoCheckIn from "./DemoCheckIn";
import DemoAdminBoard from "./DemoAdminBoard";

type View = "check-in" | "admin-board";

const DemoShowcase = () => {
  const [activeView, setActiveView] = useState<View>("check-in");

  const tabs: { id: View; label: string; icon: typeof Smartphone; description: string }[] = [
    { id: "check-in", label: "Patient Check-In", icon: Smartphone, description: "What patients see" },
    { id: "admin-board", label: "Admin Arrival Board", icon: Monitor, description: "What staff see" },
  ];

  const dotPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='rgba(255,255,255,0.08)'/%3E%3C/svg%3E")`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ═══ COMPACT HEADER + TOGGLE ═══ */}
      <div
        className="w-full px-4 pt-6 pb-4"
        style={{
          background: `${dotPattern}, linear-gradient(135deg, hsl(270 100% 10%) 0%, hsl(270 60% 25%) 50%, hsl(270 50% 35%) 100%)`,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <img src={logo} alt="Orenda Psychiatry" className="h-7 brightness-0 invert" />
            <div className="h-5 w-px bg-white/20" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-white/50 font-bold">Demo Mockups</span>
          </div>

          {/* Disclaimer banner */}
          <div className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-400/20 max-w-fit">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            <p className="text-[10px] text-amber-200/90 font-semibold">
              DEMONSTRATION ONLY — Not for patient use · No data is stored
            </p>
          </div>

          {/* Toggle */}
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeView === tab.id
                    ? "bg-white/15 border border-white/20"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeView === tab.id ? "text-white" : "text-white/40"}`} />
                <div>
                  <p className={`text-sm font-bold ${activeView === tab.id ? "text-white" : "text-white/50"}`}>
                    {tab.label}
                  </p>
                  <p className={`text-[10px] ${activeView === tab.id ? "text-white/60" : "text-white/30"}`}>
                    {tab.description}
                  </p>
                </div>
                {activeView === tab.id && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute -bottom-[1px] left-4 right-4 h-[2px] bg-white rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {activeView === "check-in" ? (
            <motion.div
              key="check-in"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DemoCheckInEmbed />
            </motion.div>
          ) : (
            <motion.div
              key="admin-board"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DemoAdminBoardEmbed />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ FOOTER DISCLAIMER ═══ */}
      <div className="px-4 py-4 text-center" style={{ background: "hsl(270 20% 96%)", borderTop: "1px solid hsl(270 15% 90%)" }}>
        <p className="text-[10px] text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          <strong>Disclaimer:</strong> This is a demonstration mockup for internal review only. It is not a live service and must not be used for actual patient check-in. No information entered on this page is saved, stored, or transmitted. By using this page, you acknowledge that this is a non-functional prototype and agree not to enter real patient information. This demonstration has not been authorized for clinical use and carries no operational authority. © {new Date().getFullYear()} Orenda Psychiatry.
        </p>
      </div>
    </div>
  );
};

/* ── Embedded versions without their own headers ── */
const DemoCheckInEmbed = () => (
  <div className="[&>div>div:first-child]:hidden">
    <DemoCheckIn />
  </div>
);

const DemoAdminBoardEmbed = () => (
  <div className="[&>div>div:first-child]:hidden">
    <DemoAdminBoard />
  </div>
);

export default DemoShowcase;
