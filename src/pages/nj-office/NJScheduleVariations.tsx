import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CalendarCheck, Users, Shield, Clock, AlertTriangle, Building2, ArrowRight, Send } from "lucide-react";
import NJNavbar from "@/components/NJNavbar";
import NJFooter from "@/components/NJFooter";

const steps = [
  { id: "01", icon: CalendarCheck, title: "Reserve Office Time", desc: "Sign up for your date and time slot." },
  { id: "02", icon: Users, title: "Block Appointment Times", desc: "Block in-person slots in SimplePractice." },
  { id: "03", icon: Send, title: "Patient Self-Schedules", desc: "Patients book their in-person visit directly on our site." },
];

const access = [
  { icon: Clock, title: "Step 1 — Provide Notice", desc: "Reserve 1 week in advance; submit patient names 24 hours before." },
  { icon: Shield, title: "Step 2 — Security List Update", desc: "NJ admin team notifies Regus and updates the access list." },
  { icon: AlertTriangle, title: "Step 3 — Day of Visit", desc: "Without advance notice, patients may experience entry delays." },
];

const support = ["Schedule Coordination", "Day-Before Preparation", "Patient Communication", "Day-Of Visit Support"];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle: string }) {
  return (
    <div className="text-center mb-10">
      <p className="text-[10px] tracking-[0.35em] uppercase text-primary font-semibold mb-2">{label}</p>
      <h2 className="font-display text-4xl md:text-5xl text-foreground font-light mb-2">{title}</h2>
      <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
    </div>
  );
}

function CTA() {
  return (
    <Link
      to="/nj-office/book-hoboken"
      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
    >
      <CalendarCheck className="w-4 h-4" />
      Schedule Office Time
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}

function AccessAndSupport({ dark = false }: { dark?: boolean }) {
  const container = dark
    ? "rounded-2xl border border-primary/20 bg-primary/95 p-5 mt-6"
    : "rounded-2xl border border-border bg-secondary/30 p-5 mt-6";
  const textMain = dark ? "text-primary-foreground" : "text-foreground";
  const textMuted = dark ? "text-primary-foreground/70" : "text-muted-foreground";
  const chip = dark
    ? "text-xs px-3 py-1.5 rounded-full bg-primary-foreground/10 border border-primary-foreground/15 text-primary-foreground"
    : "text-xs px-3 py-1.5 rounded-full bg-background border border-border text-foreground";

  return (
    <>
      <div className={container}>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className={dark ? "w-4 h-4 text-primary-foreground" : "w-4 h-4 text-primary"} />
          <p className={`font-display text-lg ${textMain}`}>Building Access Coordination</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {access.map((item, i) => (
            <div key={i} className={dark ? "rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-4" : "rounded-xl border border-border bg-background p-4"}>
              <item.icon className={dark ? "w-4 h-4 text-primary-foreground mb-2" : "w-4 h-4 text-primary mb-2"} />
              <p className={`text-sm font-semibold mb-1 ${textMain}`}>{item.title}</p>
              <p className={`text-xs ${textMuted}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={container}>
        <div className="flex items-center gap-2 mb-3">
          <Users className={dark ? "w-4 h-4 text-primary-foreground" : "w-4 h-4 text-primary"} />
          <p className={`font-display text-lg ${textMain}`}>Dedicated NJ Admin Support</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {support.map((item) => (
            <span key={item} className={chip}>{item}</span>
          ))}
        </div>
      </div>
    </>
  );
}

function VariationA() {
  return (
    <section className="py-14">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          label="Variation A"
          title="Visual Timeline"
          subtitle="Your original preferred direction, kept as-is for baseline."
        />
        <div className="relative rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="hidden md:block absolute left-16 right-16 top-[60px] h-px bg-border" />
          <div className="grid md:grid-cols-3 gap-6 relative">
            {steps.map((step) => (
              <motion.div key={step.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center mb-3">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs text-primary font-semibold tracking-[0.12em]">{step.id}</p>
                <h3 className="font-display text-xl text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-7"><CTA /></div>
        </div>
        <AccessAndSupport />
      </div>
    </section>
  );
}

function VariationA2() {
  return (
    <section className="py-14">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          label="Variation A2"
          title="Night Timeline"
          subtitle="Same timeline structure with a richer, darker treatment."
        />
        <div className="relative rounded-2xl border border-primary/20 bg-primary/95 p-6 md:p-8">
          <div className="hidden md:block absolute left-16 right-16 top-[60px] h-px bg-primary-foreground/20" />
          <div className="grid md:grid-cols-3 gap-6 relative">
            {steps.map((step) => (
              <motion.div key={step.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mx-auto flex items-center justify-center mb-3">
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <p className="text-xs text-primary-foreground/80 font-semibold tracking-[0.12em]">{step.id}</p>
                <h3 className="font-display text-xl text-primary-foreground">{step.title}</h3>
                <p className="text-sm text-primary-foreground/70">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-7"><CTA /></div>
        </div>
        <AccessAndSupport dark />
      </div>
    </section>
  );
}

function VariationA3() {
  return (
    <section className="py-14">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          label="Variation A3"
          title="Split Contrast Timeline"
          subtitle="Visual timeline with darker step cards for stronger depth."
        />
        <div className="relative rounded-2xl border border-border overflow-hidden">
          <div className="p-6 md:p-8 bg-secondary/40">
            <div className="hidden md:block absolute left-16 right-16 top-[60px] h-px bg-border" />
            <div className="grid md:grid-cols-3 gap-6 relative">
              {steps.map((step) => (
                <motion.div key={step.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center rounded-xl border border-primary/20 bg-primary p-5">
                  <div className="w-14 h-14 rounded-full bg-primary-foreground/12 border border-primary-foreground/20 mx-auto flex items-center justify-center mb-3">
                    <step.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <p className="text-xs text-primary-foreground/70 font-semibold tracking-[0.12em]">{step.id}</p>
                  <h3 className="font-display text-lg text-primary-foreground">{step.title}</h3>
                  <p className="text-xs text-primary-foreground/70">{step.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-center mt-7"><CTA /></div>
          </div>
        </div>
        <AccessAndSupport />
      </div>
    </section>
  );
}

function VariationA4() {
  return (
    <section className="py-14">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader
          label="Variation A4"
          title="Soft Glass Timeline"
          subtitle="Keeps the A layout but swaps white surfaces for tinted glass layers."
        />
        <div className="relative rounded-2xl border border-border bg-gradient-to-br from-secondary/60 to-accent/20 p-6 md:p-8">
          <div className="hidden md:block absolute left-16 right-16 top-[60px] h-px bg-primary/25" />
          <div className="grid md:grid-cols-3 gap-6 relative">
            {steps.map((step) => (
              <motion.div key={step.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center rounded-xl border border-border/60 bg-background/60 backdrop-blur-sm p-5">
                <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/25 mx-auto flex items-center justify-center mb-3">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs text-primary font-semibold tracking-[0.12em]">{step.id}</p>
                <h3 className="font-display text-xl text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center mt-7"><CTA /></div>
        </div>
        <AccessAndSupport />
      </div>
    </section>
  );
}

const NJScheduleVariations = () => {
  return (
    <div className="min-h-screen bg-background">
      <NJNavbar />
      <main className="pt-20">
        <header className="py-16 px-6" style={{ background: "linear-gradient(180deg, hsl(var(--accent) / 0.16), hsl(var(--background)))" }}>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold mb-4">Design Exploration</p>
            <h1 className="font-display text-5xl md:text-7xl text-foreground font-light mb-3">Schedule Your Office Time</h1>
            <p className="font-body text-sm text-muted-foreground max-w-2xl mx-auto">
              Added three more Variation A-style directions with less white and stronger visual depth.
            </p>
          </div>
        </header>

        <VariationA />
        <div className="max-w-3xl mx-auto border-t border-border/20" />
        <VariationA2 />
        <div className="max-w-3xl mx-auto border-t border-border/20" />
        <VariationA3 />
        <div className="max-w-3xl mx-auto border-t border-border/20" />
        <VariationA4 />
      </main>
      <NJFooter />
    </div>
  );
};

export default NJScheduleVariations;
