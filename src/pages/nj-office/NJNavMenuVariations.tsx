import { Link } from "react-router-dom";
import {
  Menu, X, ArrowRight, ChevronRight, MapPin, Calendar, FileText,
  HelpCircle, Home, Building2, Stethoscope, ClipboardList, Users,
  BookOpen, Clock, Phone
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "@/assets/orenda-logo-purple.png";

/* ──────────────────────────────────────────────
   Variation data
   ────────────────────────────────────────────── */
const offices = [
  { label: "Hoboken Office", desc: "221 River St, 9th Floor", to: "/nj-office/hoboken" },
  { label: "Edison Office", desc: "110 Fieldcrest Ave, 3rd Floor", to: "/nj-office/edison" },
];
const providerLinks = [
  { label: "Provider Scheduling Guide", icon: ClipboardList, to: "/nj-office/provider-ops" },
  { label: "Schedule Office Time", icon: Calendar, to: "/nj-office/book-hoboken" },
  { label: "FAQ", icon: HelpCircle, to: "/nj-office/faq" },
];
const patientLinks = [
  { label: "Patient Check-In & Info", icon: Users, to: "/nj-office/check-in" },
];

export default function NJNavMenuVariations() {
  return (
    <div className="min-h-screen bg-muted/20 font-body">
      {/* Page header */}
      <div className="bg-primary text-primary-foreground py-16 px-6 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Navigation Menu Variations</h1>
        <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
          Different ways to organize the full-screen overlay menu — click "Open" to preview each
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-0">
        <VariationBlock index={0} label="A" title="Column Grid — Two-column with category headers">
          <VariationA />
        </VariationBlock>

        <Divider />

        <VariationBlock index={1} label="B" title="Card Sections — Grouped in visual cards">
          <VariationB />
        </VariationBlock>

        <Divider />

        <VariationBlock index={2} label="C" title="Icon List — Every item has an icon, flat list">
          <VariationC />
        </VariationBlock>

        <Divider />

        <VariationBlock index={3} label="D" title="Side Panel — Slide-in from right with categories">
          <VariationD />
        </VariationBlock>

        <Divider />

        <VariationBlock index={4} label="E" title="Mega Menu — Desktop-style grid with descriptions">
          <VariationE />
        </VariationBlock>

        <Divider />

        <VariationBlock index={5} label="F" title="Tabbed Menu — Switch between Provider & Patient views">
          <VariationF />
        </VariationBlock>
      </div>

      <div className="h-20" />
    </div>
  );
}

/* ──────────────────────────────────────────────
   Layout helpers
   ────────────────────────────────────────────── */
function VariationBlock({ index, label, title, children }: { index: number; label: string; title: string; children: React.ReactNode }) {
  const bg = index % 2 === 0 ? "bg-white" : "bg-secondary/15";
  return (
    <div className={`${bg} rounded-3xl p-6 md:p-10`}>
      <div className="flex items-center gap-3 mb-6">
        <span className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold font-display shadow-md">
          {label}
        </span>
        <h2 className="font-display text-xl md:text-2xl text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="py-6">
      <div className="h-1 rounded-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

function PreviewShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, hsl(270 30% 96%), hsl(0 0% 100%))' }}
    >
      <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-primary/10 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <img src={logo} alt="Orenda" className="h-7 md:h-8" />
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-primary/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {children}
    </motion.div>
  );
}

function OpenButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg"
    >
      <Menu className="w-5 h-5" /> Open This Menu
    </button>
  );
}

function NavLinkItem({ to, label, onClick, active }: { to: string; label: string; onClick: () => void; active?: boolean }) {
  return (
    <Link to={to} onClick={onClick} className={`block py-2 text-lg font-display transition-colors ${active ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}>
      {label}
    </Link>
  );
}

/* ──────────────────────────────────────────────
   VARIATION A — Two-Column Grid
   ────────────────────────────────────────────── */
function VariationA() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <OpenButton onClick={() => setOpen(true)} />
      <AnimatePresence>
        {open && (
          <PreviewShell onClose={() => setOpen(false)}>
            <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left column — Offices */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-4">Our Offices</p>
                  <div className="space-y-4">
                    {offices.map(o => (
                      <Link key={o.to} to={o.to} onClick={() => setOpen(false)} className="group block p-4 rounded-2xl border border-primary/10 hover:border-primary/25 hover:bg-primary/5 transition-all">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <div>
                            <span className="font-display text-xl text-foreground group-hover:text-primary transition-colors">{o.label}</span>
                            <p className="text-sm text-muted-foreground mt-0.5">{o.desc}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-foreground/5 my-6" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-4">For Patients</p>
                  {patientLinks.map(l => (
                    <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="group flex items-center gap-3 py-3 text-foreground/70 hover:text-foreground transition-colors">
                      <l.icon className="w-5 h-5 text-primary/50 group-hover:text-primary" />
                      <span className="font-display text-xl">{l.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Right column — Provider tools */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-4">For Providers</p>
                  <div className="space-y-1">
                    {providerLinks.map(l => (
                      <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="group flex items-center gap-3 py-3 text-foreground/70 hover:text-foreground transition-colors">
                        <l.icon className="w-5 h-5 text-primary/50 group-hover:text-primary" />
                        <span className="font-display text-xl">{l.label}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-foreground/5 my-6" />
                  <Link to="/" onClick={() => setOpen(false)} className="group flex items-center gap-3 py-3 text-foreground/70 hover:text-foreground transition-colors">
                    <Home className="w-5 h-5 text-primary/50 group-hover:text-primary" />
                    <span className="font-display text-xl">Home</span>
                  </Link>
                </div>
              </div>
            </div>
          </PreviewShell>
        )}
      </AnimatePresence>
    </>
  );
}

/* ──────────────────────────────────────────────
   VARIATION B — Card Sections
   ────────────────────────────────────────────── */
function VariationB() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <OpenButton onClick={() => setOpen(true)} />
      <AnimatePresence>
        {open && (
          <PreviewShell onClose={() => setOpen(false)}>
            <div className="max-w-3xl mx-auto px-6 md:px-10 py-12 space-y-6">
              {/* Home card */}
              <Link to="/" onClick={() => setOpen(false)} className="group block p-5 rounded-2xl bg-white border border-primary/10 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Home className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <span className="font-display text-xl text-foreground">Home</span>
                    <p className="text-sm text-muted-foreground">NJ In-Person Care Hub</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary/30 ml-auto group-hover:text-primary transition-colors" />
                </div>
              </Link>

              {/* Offices card */}
              <div className="p-6 rounded-2xl bg-white border border-primary/10 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-4">Offices</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {offices.map(o => (
                    <Link key={o.to} to={o.to} onClick={() => setOpen(false)} className="group p-4 rounded-xl bg-secondary/20 hover:bg-primary/5 border border-transparent hover:border-primary/15 transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="font-display text-lg text-foreground">{o.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground pl-6">{o.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Provider card */}
              <div className="p-6 rounded-2xl bg-white border border-primary/10 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-4">Provider Resources</p>
                <div className="space-y-1">
                  {providerLinks.map(l => (
                    <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="group flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-primary/5 transition-colors">
                      <l.icon className="w-5 h-5 text-primary/50 group-hover:text-primary" />
                      <span className="text-foreground/80 group-hover:text-foreground font-medium">{l.label}</span>
                      <ChevronRight className="w-4 h-4 text-primary/20 ml-auto group-hover:text-primary/50" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Patient card */}
              <div className="p-6 rounded-2xl bg-white border border-primary/10 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary mb-4">For Patients</p>
                {patientLinks.map(l => (
                  <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="group flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-primary/5 transition-colors">
                    <l.icon className="w-5 h-5 text-primary/50 group-hover:text-primary" />
                    <span className="text-foreground/80 group-hover:text-foreground font-medium">{l.label}</span>
                    <ChevronRight className="w-4 h-4 text-primary/20 ml-auto group-hover:text-primary/50" />
                  </Link>
                ))}
              </div>
            </div>
          </PreviewShell>
        )}
      </AnimatePresence>
    </>
  );
}

/* ──────────────────────────────────────────────
   VARIATION C — Flat Icon List
   ────────────────────────────────────────────── */
function VariationC() {
  const [open, setOpen] = useState(false);
  const allLinks = [
    { label: "Home", icon: Home, to: "/", desc: "Back to the hub" },
    { label: "Hoboken Office", icon: Building2, to: "/nj-office/hoboken", desc: "221 River St, 9th Floor" },
    { label: "Edison Office", icon: Building2, to: "/nj-office/edison", desc: "110 Fieldcrest Ave, 3rd Floor" },
    { label: "Provider Scheduling Guide", icon: BookOpen, to: "/nj-office/provider-ops", desc: "How to book & use offices" },
    { label: "Schedule Office Time", icon: Calendar, to: "/nj-office/book-hoboken", desc: "Reserve your next session" },
    { label: "Patient Check-In", icon: Users, to: "/nj-office/check-in", desc: "Arrival & scheduling info" },
    { label: "FAQ", icon: HelpCircle, to: "/nj-office/faq", desc: "Common questions answered" },
  ];

  return (
    <>
      <OpenButton onClick={() => setOpen(true)} />
      <AnimatePresence>
        {open && (
          <PreviewShell onClose={() => setOpen(false)}>
            <div className="max-w-2xl mx-auto px-6 md:px-10 py-12">
              <div className="space-y-2">
                {allLinks.map((l, i) => (
                  <motion.div key={l.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link to={l.to} onClick={() => setOpen(false)} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-md border border-transparent hover:border-primary/10 transition-all">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                        <l.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-display text-lg text-foreground">{l.label}</span>
                        <p className="text-sm text-muted-foreground">{l.desc}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-primary/20 group-hover:text-primary/60 transition-colors shrink-0" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </PreviewShell>
        )}
      </AnimatePresence>
    </>
  );
}

/* ──────────────────────────────────────────────
   VARIATION D — Right Side Panel
   ────────────────────────────────────────────── */
function VariationD() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <OpenButton onClick={() => setOpen(true)} />
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-foreground/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[301] w-full max-w-md bg-white shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-primary/10">
                <img src={logo} alt="Orenda" className="h-7" />
                <button onClick={() => setOpen(false)} className="w-10 h-10 rounded-full border border-primary/10 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-8 space-y-8">
                {/* Quick links */}
                <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3 py-2 text-foreground/70 hover:text-foreground transition-colors">
                  <Home className="w-5 h-5 text-primary" />
                  <span className="font-display text-xl">Home</span>
                </Link>

                {/* Offices */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-3">Offices</p>
                  <div className="space-y-3">
                    {offices.map(o => (
                      <Link key={o.to} to={o.to} onClick={() => setOpen(false)} className="group block p-4 rounded-xl border border-primary/10 hover:border-primary/25 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-primary shrink-0" />
                          <div>
                            <span className="font-display text-lg">{o.label}</span>
                            <p className="text-xs text-muted-foreground">{o.desc}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Provider */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-3">For Providers</p>
                  {providerLinks.map(l => (
                    <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="group flex items-center gap-3 py-3 text-foreground/70 hover:text-foreground transition-colors">
                      <l.icon className="w-5 h-5 text-primary/50 group-hover:text-primary" />
                      <span className="text-base font-medium">{l.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Patient */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-3">For Patients</p>
                  {patientLinks.map(l => (
                    <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="group flex items-center gap-3 py-3 text-foreground/70 hover:text-foreground transition-colors">
                      <l.icon className="w-5 h-5 text-primary/50 group-hover:text-primary" />
                      <span className="text-base font-medium">{l.label}</span>
                    </Link>
                  ))}
                </div>

                {/* CTA */}
                <Link to="/nj-office/book-hoboken" onClick={() => setOpen(false)} className="block w-full text-center py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg">
                  Schedule Office Time
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ──────────────────────────────────────────────
   VARIATION E — Mega Menu Grid
   ────────────────────────────────────────────── */
function VariationE() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <OpenButton onClick={() => setOpen(true)} />
      <AnimatePresence>
        {open && (
          <PreviewShell onClose={() => setOpen(false)}>
            <div className="max-w-5xl mx-auto px-6 md:px-10 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Col 1 — Navigate */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <Home className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary">Navigate</p>
                  </div>
                  <Link to="/" onClick={() => setOpen(false)} className="block py-2 text-lg font-display text-foreground/70 hover:text-foreground transition-colors">Home</Link>
                  <Link to="/nj-office/hoboken" onClick={() => setOpen(false)} className="block py-2 text-lg font-display text-foreground/70 hover:text-foreground transition-colors">Hoboken Office</Link>
                  <Link to="/nj-office/edison" onClick={() => setOpen(false)} className="block py-2 text-lg font-display text-foreground/70 hover:text-foreground transition-colors">Edison Office</Link>
                </div>

                {/* Col 2 — Providers */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <Stethoscope className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary">Providers</p>
                  </div>
                  {providerLinks.map(l => (
                    <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block py-2 text-lg font-display text-foreground/70 hover:text-foreground transition-colors">{l.label}</Link>
                  ))}
                </div>

                {/* Col 3 — Patients */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary">Patients</p>
                  </div>
                  {patientLinks.map(l => (
                    <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block py-2 text-lg font-display text-foreground/70 hover:text-foreground transition-colors">{l.label}</Link>
                  ))}

                  <div className="border-t border-foreground/5 pt-4 mt-6">
                    <Link to="/nj-office/book-hoboken" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg">
                      <Calendar className="w-4 h-4" /> Book Office Time
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </PreviewShell>
        )}
      </AnimatePresence>
    </>
  );
}

/* ──────────────────────────────────────────────
   VARIATION F — Tabbed (Provider / Patient toggle)
   ────────────────────────────────────────────── */
function VariationF() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"provider" | "patient">("provider");

  return (
    <>
      <OpenButton onClick={() => setOpen(true)} />
      <AnimatePresence>
        {open && (
          <PreviewShell onClose={() => { setOpen(false); setTab("provider"); }}>
            <div className="max-w-2xl mx-auto px-6 md:px-10 py-8">
              {/* Home link */}
              <Link to="/" onClick={() => setOpen(false)} className="group inline-flex items-center gap-2 mb-8 text-foreground/60 hover:text-foreground transition-colors">
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Home</span>
              </Link>

              {/* Tab switcher */}
              <div className="flex rounded-2xl bg-secondary/30 p-1.5 mb-8">
                <button
                  onClick={() => setTab("provider")}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === "provider" ? "bg-primary text-primary-foreground shadow-md" : "text-foreground/60 hover:text-foreground"}`}
                >
                  For Providers
                </button>
                <button
                  onClick={() => setTab("patient")}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${tab === "patient" ? "bg-primary text-primary-foreground shadow-md" : "text-foreground/60 hover:text-foreground"}`}
                >
                  For Patients
                </button>
              </div>

              <AnimatePresence mode="wait">
                {tab === "provider" ? (
                  <motion.div key="provider" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60">Office Locations</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {offices.map(o => (
                        <Link key={o.to} to={o.to} onClick={() => setOpen(false)} className="group p-5 rounded-2xl border border-primary/10 hover:border-primary/25 hover:bg-primary/5 transition-all">
                          <MapPin className="w-5 h-5 text-primary mb-2" />
                          <span className="font-display text-lg block">{o.label}</span>
                          <p className="text-xs text-muted-foreground">{o.desc}</p>
                        </Link>
                      ))}
                    </div>

                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60 pt-4">Resources</p>
                    {providerLinks.map(l => (
                      <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="group flex items-center gap-3 py-3 text-foreground/70 hover:text-foreground transition-colors">
                        <l.icon className="w-5 h-5 text-primary/50 group-hover:text-primary" />
                        <span className="font-display text-xl">{l.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div key="patient" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60">Patient Resources</p>
                    {patientLinks.map(l => (
                      <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="group flex items-center gap-4 p-5 rounded-2xl border border-primary/10 hover:border-primary/25 hover:bg-primary/5 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <l.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <span className="font-display text-xl block">{l.label}</span>
                          <p className="text-sm text-muted-foreground">Check-in info, scheduling, and more</p>
                        </div>
                      </Link>
                    ))}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      {offices.map(o => (
                        <div key={o.to} className="p-4 rounded-xl bg-secondary/20">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold">{o.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground pl-6">{o.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </PreviewShell>
        )}
      </AnimatePresence>
    </>
  );
}
