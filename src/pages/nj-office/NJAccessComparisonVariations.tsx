import NJNavbar from "@/components/NJNavbar";
import NJFooter from "@/components/NJFooter";
import { CreditCard, DoorOpen, Clock, Building2, ShieldCheck, Bell, KeyRound, CheckCircle2, XCircle, ArrowRight, AlertTriangle } from "lucide-react";

const withCard = [
  { icon: Building2, label: "24/7 building entry" },
  { icon: ShieldCheck, label: "Swipe through turnstile" },
  { icon: DoorOpen, label: "Unlock 9th floor Regus door" },
  { icon: KeyRound, label: "Office key included" },
  { icon: Clock, label: "No time restrictions" },
];

const withoutCard = [
  { icon: Bell, label: "Ring doorbell after hours" },
  { icon: Clock, label: "Regus reception 9 AM–5 PM only" },
  { icon: ShieldCheck, label: "Check in with security" },
  { icon: DoorOpen, label: "Use lockbox key (code: 0000)" },
  { icon: AlertTriangle, label: "Limited after-hours independence" },
];

export default function NJAccessComparisonVariations() {
  return (
    <div className="min-h-screen bg-white font-body">
      <NJNavbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-20">
        <div className="text-center">
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-foreground tracking-tight">Access Comparison Variations</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Different ways to visually communicate swipe card vs. no swipe card access.</p>
        </div>

        {/* ── Variation A: Side-by-Side Cards ── */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-1">Variation A — Side-by-Side Cards</h2>
          <p className="text-sm text-muted-foreground mb-6">Clean two-column comparison with check/cross icons.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* With Card */}
            <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">With Swipe Card</h3>
                  <p className="text-xs text-primary font-medium">Recommended</p>
                </div>
              </div>
              <ul className="space-y-3">
                {withCard.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Without Card */}
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground">Without Swipe Card</h3>
                  <p className="text-xs text-muted-foreground font-medium">Day-of access</p>
                </div>
              </div>
              <ul className="space-y-3">
                {withoutCard.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <XCircle className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Variation B: Comparison Table ── */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-1">Variation B — Comparison Table</h2>
          <p className="text-sm text-muted-foreground mb-6">Structured table for quick scanning.</p>
          <div className="rounded-2xl border border-border/60 overflow-hidden">
            <div className="grid grid-cols-3 bg-foreground text-white">
              <div className="px-4 sm:px-6 py-3 font-display text-sm font-medium">Feature</div>
              <div className="px-4 sm:px-6 py-3 font-display text-sm font-medium text-center border-l border-white/10">With Card</div>
              <div className="px-4 sm:px-6 py-3 font-display text-sm font-medium text-center border-l border-white/10">Without Card</div>
            </div>
            {[
              { feature: "Building entry", withCard: "Swipe anytime", without: "Ring bell after hours" },
              { feature: "Security turnstile", withCard: "Swipe through", without: "Check in at desk" },
              { feature: "9th floor access", withCard: "Swipe card entry", without: "Regus hours only (9–5)" },
              { feature: "Office door", withCard: "Personal key", without: "Lockbox key (code: 0000)" },
              { feature: "Weekend/evening access", withCard: "Full independence", without: "Doorbell + security" },
              { feature: "Setup", withCard: "One-time (free)", without: "Email offices@ each visit" },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-white" : "bg-muted/20"} border-t border-border/30`}>
                <div className="px-4 sm:px-6 py-3 text-sm font-medium text-foreground">{row.feature}</div>
                <div className="px-4 sm:px-6 py-3 text-sm text-center text-primary font-medium border-l border-border/20">{row.withCard}</div>
                <div className="px-4 sm:px-6 py-3 text-sm text-center text-muted-foreground border-l border-border/20">{row.without}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Variation C: Timeline / Flow ── */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-1">Variation C — Step-by-Step Flow</h2>
          <p className="text-sm text-muted-foreground mb-6">Shows the journey from arrival to office for each scenario.</p>
          <div className="grid md:grid-cols-2 gap-8">
            {/* With card flow */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-primary" />
                <h3 className="font-display text-base font-bold text-primary">With Swipe Card</h3>
              </div>
              <div className="space-y-0">
                {[
                  { step: "1", text: "Arrive at 221 River St" },
                  { step: "2", text: "Swipe through turnstile" },
                  { step: "3", text: "Take elevator to 9th floor" },
                  { step: "4", text: "Swipe into Regus entrance" },
                  { step: "5", text: "Use key to open office" },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">{s.step}</div>
                      {i < 4 && <div className="w-0.5 h-6 bg-primary/20" />}
                    </div>
                    <p className="text-sm text-foreground pt-1">{s.text}</p>
                  </div>
                ))}
                <div className="ml-10 mt-2 text-xs text-primary font-medium bg-primary/10 rounded-lg px-3 py-2 inline-block">~2 minutes total</div>
              </div>
            </div>
            {/* Without card flow */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <KeyRound className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-display text-base font-bold text-muted-foreground">Without Swipe Card</h3>
              </div>
              <div className="space-y-0">
                {[
                  { step: "1", text: "Arrive at 221 River St" },
                  { step: "2", text: "During hours: check in at lobby; After hours: ring doorbell" },
                  { step: "3", text: "Get day pass / wait for security" },
                  { step: "4", text: "Check in at Regus reception (9–5 only)" },
                  { step: "5", text: "Use lockbox key at office door" },
                  { step: "6", text: "Return key to lockbox when done" },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold shrink-0">{s.step}</div>
                      {i < 5 && <div className="w-0.5 h-6 bg-muted" />}
                    </div>
                    <p className="text-sm text-muted-foreground pt-1">{s.text}</p>
                  </div>
                ))}
                <div className="ml-10 mt-2 text-xs text-muted-foreground font-medium bg-muted/50 rounded-lg px-3 py-2 inline-block">~5–10 minutes total</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Variation D: Icon Grid Quick Glance ── */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-1">Variation D — Quick Glance Icons</h2>
          <p className="text-sm text-muted-foreground mb-6">Minimal icons with yes/no indicators for fast scanning.</p>
          <div className="rounded-2xl border border-border/60 overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="bg-primary px-6 py-4 text-center">
                <CreditCard className="w-6 h-6 text-white mx-auto mb-1" />
                <p className="font-display text-sm font-bold text-white">Swipe Card</p>
              </div>
              <div className="bg-foreground px-6 py-4 text-center">
                <KeyRound className="w-6 h-6 text-white/70 mx-auto mb-1" />
                <p className="font-display text-sm font-bold text-white/80">No Card</p>
              </div>
            </div>
            {[
              { label: "24/7 entry", card: true, noCard: false },
              { label: "Skip security desk", card: true, noCard: false },
              { label: "After-hours independence", card: true, noCard: false },
              { label: "9th floor self-entry", card: true, noCard: false },
              { label: "Office key", card: true, noCard: true },
              { label: "Free initial setup", card: true, noCard: true },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-2 border-t border-border/30 ${i % 2 === 0 ? "bg-white" : "bg-muted/15"}`}>
                <div className="px-6 py-3 flex items-center justify-between">
                  <span className="text-sm text-foreground">{row.label}</span>
                  {row.card ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive/40" />
                  )}
                </div>
                <div className="px-6 py-3 flex items-center justify-end border-l border-border/20">
                  {row.noCard ? (
                    <CheckCircle2 className="w-5 h-5 text-primary/50" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive/40" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Variation E: CTA Highlight ── */}
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground mb-1">Variation E — CTA Banner</h2>
          <p className="text-sm text-muted-foreground mb-6">Action-oriented banner encouraging sign-up.</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))' }}>
            <div className="px-6 sm:px-10 py-8 sm:py-12 flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">Get Your Swipe Card</h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-lg">
                  Skip the lobby, bypass security, and access the office 24/7. First-time setup is <span className="font-bold text-white">completely free</span>.
                </p>
              </div>
              <div className="bg-white rounded-xl px-6 py-4 text-center shadow-lg shrink-0">
                <p className="text-xs text-muted-foreground mb-1">Email to get started</p>
                <a href="mailto:offices@orendapsych.com" className="font-display text-sm font-bold text-primary hover:underline">
                  offices@orendapsych.com
                </a>
              </div>
            </div>
            <div className="bg-foreground/20 px-6 sm:px-10 py-3 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-white/60" />
              <p className="text-xs text-white/70">Lost card replacement: $65 fee</p>
            </div>
          </div>
        </section>
      </div>
      <NJFooter />
    </div>
  );
}
