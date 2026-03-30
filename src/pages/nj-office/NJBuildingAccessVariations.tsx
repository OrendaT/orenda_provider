import { Clock, Bell, Users, KeyRound, Mail, Phone, Building2, ShieldCheck, DoorOpen } from "lucide-react";

const providerAccessContent = (
  <>
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
  </>
);

/* ─── VARIATION A: Vertical Stack (cards top-to-bottom) ─── */
function VariationA() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/60 shadow-sm">
      {/* Header */}
      <div className="bg-foreground px-6 py-4 flex items-center gap-3">
        <Building2 className="w-5 h-5 text-white/70" />
        <h3 className="font-display text-white text-lg font-semibold tracking-tight">Building Access</h3>
      </div>

      <div className="divide-y divide-border/40">
        {/* Standard Hours */}
        <div className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-primary">Standard Hours</p>
          </div>
          <p className="font-display text-foreground text-lg font-medium mb-1">Mon – Fri, 7 AM – 6 PM</p>
          <p className="font-body text-muted-foreground text-sm">Floor doors are open. Building entrance accessible 24/7.</p>
        </div>

        {/* 9th Floor Reception */}
        <div className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-primary" />
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-primary">9th Floor Reception</p>
          </div>
          <p className="font-display text-foreground text-lg font-medium mb-1">Mon – Fri, 9 AM – 5 PM</p>
          <p className="font-body text-muted-foreground text-sm">After reception hours, the floor entrance is locked and requires a swipe card.</p>
        </div>

        {/* Provider Building Access */}
        <div className="p-6 bg-primary/[0.03]">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-3.5 h-3.5 text-primary" />
            </div>
            <p className="font-display text-foreground text-sm font-semibold">Provider Building Access</p>
          </div>
          {providerAccessContent}
        </div>

        {/* After Hours — last */}
        <div className="p-6 bg-accent/[0.04]">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-accent" />
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-accent">After Hours</p>
          </div>
          <p className="font-display text-foreground text-lg font-medium mb-3">Evenings & Weekends</p>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-accent text-[10px] font-bold">1</span>
              </div>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">
                Ring the <span className="text-foreground font-medium">doorbell on the right-hand side</span> of the building entrance
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-accent text-[10px] font-bold">2</span>
              </div>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">
                Building security will buzz you in, or call{" "}
                <a href="tel:2015330855" className="text-foreground font-semibold whitespace-nowrap hover:text-primary transition-colors">201-533-0855</a>{" "}
                to be let in on the ground floor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── VARIATION B: 2×2 Grid + Bottom Banner ─── */
function VariationB() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/60 shadow-sm">
      {/* Header */}
      <div className="bg-foreground px-6 py-4 flex items-center gap-3">
        <Building2 className="w-5 h-5 text-white/70" />
        <h3 className="font-display text-white text-lg font-semibold tracking-tight">Building Access</h3>
      </div>

      {/* 2×2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Standard Hours */}
        <div className="p-6 bg-white border-b md:border-b-0 md:border-r border-border/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-primary">Standard Hours</p>
            </div>
          </div>
          <p className="font-display text-foreground text-xl font-medium mb-1">7 AM – 6 PM</p>
          <p className="font-body text-muted-foreground text-xs uppercase tracking-wide mb-2">Monday – Friday</p>
          <p className="font-body text-muted-foreground text-sm">Floor doors are open. Building entrance accessible 24/7.</p>
        </div>

        {/* 9th Floor Reception */}
        <div className="p-6 bg-white border-b border-border/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-primary">9th Floor Reception</p>
            </div>
          </div>
          <p className="font-display text-foreground text-xl font-medium mb-1">9 AM – 5 PM</p>
          <p className="font-body text-muted-foreground text-xs uppercase tracking-wide mb-2">Monday – Friday</p>
          <p className="font-body text-muted-foreground text-sm">After reception hours, the floor entrance is locked and requires a swipe card.</p>
        </div>

        {/* Provider Access */}
        <div className="p-6 bg-primary/[0.03] border-b md:border-b-0 md:border-r border-border/30">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-primary">Provider Access</p>
          </div>
          {providerAccessContent}
        </div>

        {/* After Hours */}
        <div className="p-6 bg-accent/[0.04]">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-accent" />
            </div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-accent">After Hours</p>
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
      </div>
    </div>
  );
}

/* ─── VARIATION C: Timeline / Left-rail style ─── */
function VariationC() {
  return (
    <div className="rounded-2xl overflow-hidden border border-border/60 shadow-sm bg-white">
      {/* Header */}
      <div className="bg-foreground px-6 py-4 flex items-center gap-3">
        <Building2 className="w-5 h-5 text-white/70" />
        <h3 className="font-display text-white text-lg font-semibold tracking-tight">Building Access</h3>
      </div>

      <div className="p-6 sm:p-8">
        <div className="relative space-y-0">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border/60" />

          {/* Standard Hours */}
          <div className="relative flex gap-5 pb-8">
            <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center flex-shrink-0 z-10">
              <Clock className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="pt-0.5">
              <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">Standard Hours</p>
              <p className="font-display text-foreground text-lg font-medium">Mon – Fri, 7 AM – 6 PM</p>
              <p className="font-body text-muted-foreground text-sm mt-1">Floor doors are open. Building entrance accessible 24/7.</p>
            </div>
          </div>

          {/* 9th Floor Reception */}
          <div className="relative flex gap-5 pb-8">
            <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center flex-shrink-0 z-10">
              <Users className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="pt-0.5">
              <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">9th Floor Reception</p>
              <p className="font-display text-foreground text-lg font-medium">Mon – Fri, 9 AM – 5 PM</p>
              <p className="font-body text-muted-foreground text-sm mt-1">After reception hours, the floor entrance is locked and requires a swipe card.</p>
            </div>
          </div>

          {/* Provider Access */}
          <div className="relative flex gap-5 pb-8">
            <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center flex-shrink-0 z-10">
              <KeyRound className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="pt-0.5 max-w-lg">
              <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-primary mb-2">Provider Building Access</p>
              {providerAccessContent}
            </div>
          </div>

          {/* After Hours */}
          <div className="relative flex gap-5">
            <div className="w-8 h-8 rounded-full bg-accent/10 border-2 border-white flex items-center justify-center flex-shrink-0 z-10">
              <Bell className="w-3.5 h-3.5 text-accent" />
            </div>
            <div className="pt-0.5">
              <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-accent mb-1">After Hours</p>
              <p className="font-display text-foreground text-lg font-medium mb-3">Evenings & Weekends</p>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent text-[10px] font-bold mt-0.5">1</span>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    Ring the <span className="text-foreground font-medium">doorbell on the right-hand side</span> of the building entrance
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent text-[10px] font-bold mt-0.5">2</span>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    Building security will buzz you in, or call{" "}
                    <a href="tel:2015330855" className="text-foreground font-semibold hover:text-primary transition-colors">201-533-0855</a>{" "}
                    to be let in on the ground floor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NJBuildingAccessVariations() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold mb-2">Hoboken Office</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">Building Access — Layout Variations</h1>
          <p className="font-body text-muted-foreground text-lg">Three layout options with After Hours moved to the end.</p>
        </div>

        <div className="space-y-16">
          {/* Variation A */}
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Variation A — Vertical Stack</p>
            <VariationA />
          </div>

          {/* Variation B */}
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Variation B — 2×2 Grid</p>
            <VariationB />
          </div>

          {/* Variation C */}
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Variation C — Timeline</p>
            <VariationC />
          </div>
        </div>
      </div>
    </div>
  );
}
