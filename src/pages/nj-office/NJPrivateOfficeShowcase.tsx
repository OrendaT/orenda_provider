import { Link } from "react-router-dom";
import NJNavbar from "@/components/NJNavbar";
import NJFooter from "@/components/NJFooter";
import { Armchair, Scale, HeartPulse, Coffee, Wifi, CalendarCheck, ArrowRight, Shield, Users, Clock, Stethoscope, KeyRound, DoorOpen } from "lucide-react";
import { motion } from "framer-motion";
import receptionImg from "@/assets/hoboken/reception.png";
import loungeImg from "@/assets/hoboken/lounge.png";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const amenities = [
  { icon: Armchair, label: "Patient Seating" },
  { icon: Scale, label: "Weight Scale" },
  { icon: HeartPulse, label: "BP Cuff" },
  { icon: Coffee, label: "Water & Coffee" },
  { icon: Wifi, label: "Wi-Fi" },
  { icon: Stethoscope, label: "Clinical Ready" },
];

const policies = [
  { icon: Shield, label: "Escort patients at all times" },
  { icon: Coffee, label: "Use in-office beverages only" },
  { icon: KeyRound, label: "Return key to lockbox after visit" },
  { icon: DoorOpen, label: "Leave office clean & reset" },
];

export default function NJPrivateOfficeShowcase() {
  return (
    <div className="min-h-screen bg-white font-body">
      <NJNavbar />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* VARIATION A — "Icon Grid" — Minimal icon-driven layout    */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 12%) 0%, hsl(270, 70%, 22%) 40%, hsl(270, 50%, 35%) 100%)' }}>
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, hsl(270, 80%, 60%) 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-4">
            <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-medium mb-4">Variation A — Icon Grid</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Typography */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="font-display text-6xl md:text-8xl font-light text-white leading-[0.92] tracking-tight mb-8">
                Your Private
                <br />
                <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Office</em>
              </h2>
              <p className="text-white/50 text-sm max-w-sm mb-10">
                A dedicated clinical space, fully equipped for in-person visits.
              </p>

              {/* Icon grid — 3x2 */}
              <div className="grid grid-cols-3 gap-4">
                {amenities.map((a, i) => (
                  <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
                    className="bg-white/[0.06] border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:bg-white/10 transition-colors"
                  >
                    <a.icon className="w-6 h-6 text-italic-accent" />
                    <span className="text-white/80 text-xs font-medium">{a.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Image */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.4}>
              <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img src={receptionImg} alt="Office" className="w-full aspect-[4/3] object-cover" />
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.6} className="mt-12">
            <Link to="/nj-office/book-hoboken"
              className="inline-flex items-center gap-3 bg-white text-foreground font-body text-sm font-semibold px-7 py-4 rounded-xl hover:bg-white/90 transition-all shadow-lg">
              <CalendarCheck className="w-5 h-5 text-primary" />
              Schedule Office Time
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="py-8 bg-white text-center">
        <div className="w-12 h-[1px] bg-border mx-auto" />
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* VARIATION B — "Split Card" — Photo left, stats right      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 bg-[hsl(270,20%,97%)]">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-4">
            <p className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground font-medium mb-4">Variation B — Split Card</p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="bg-white rounded-3xl border border-border/30 overflow-hidden shadow-xl">
              <div className="grid lg:grid-cols-2">
                {/* Photo */}
                <div className="relative">
                  <img src={loungeImg} alt="Office space" className="w-full h-full object-cover min-h-[400px]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/20 lg:block hidden" />
                </div>

                {/* Content */}
                <div className="p-10 md:p-14 flex flex-col justify-center">
                  <h2 className="font-display text-5xl md:text-6xl font-light text-foreground leading-[0.95] tracking-tight mb-6">
                    Our Private
                    <br />
                    <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Office</em>
                  </h2>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { num: "6", label: "Amenities" },
                      { num: "2", label: "Locations" },
                      { num: "9–9", label: "Hours" },
                    ].map((s, i) => (
                      <div key={i} className="text-center">
                        <p className="font-display text-3xl text-primary font-light">{s.num}</p>
                        <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Icon list — horizontal */}
                  <div className="flex flex-wrap gap-3 mb-10">
                    {amenities.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2">
                        <a.icon className="w-4 h-4 text-primary" />
                        <span className="text-foreground text-xs font-medium">{a.label}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/nj-office/book-hoboken"
                    className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-body text-sm font-semibold px-7 py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg w-fit">
                    <CalendarCheck className="w-5 h-5" />
                    Schedule Office Time
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="py-8 bg-white text-center">
        <div className="w-12 h-[1px] bg-border mx-auto" />
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* VARIATION C — "Full Bleed" — Immersive dark, icon circles */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(270, 60%, 10%) 0%, hsl(270, 40%, 20%) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[10px] tracking-[0.5em] uppercase text-white/30 font-medium mb-6">Variation C — Full Bleed</p>
            <h2 className="font-display text-6xl md:text-8xl lg:text-9xl font-light text-white leading-[0.9] tracking-tight mb-6">
              Your <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Space</em>
            </h2>
            <p className="text-white/40 text-sm mb-16 max-w-md mx-auto">Fully equipped. Clinically ready. Reserved for you.</p>
          </motion.div>

          {/* Large icon circles */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
            {amenities.map((a, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.08}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                  <a.icon className="w-8 h-8 md:w-10 md:h-10 text-italic-accent" />
                </div>
                <span className="text-white/70 text-xs font-medium tracking-wide">{a.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Policies — minimal horizontal bar */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.6}>
            <div className="inline-flex flex-wrap justify-center gap-3 mb-12">
              {policies.map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-5 py-2.5">
                  <p.icon className="w-3.5 h-3.5 text-italic-accent" />
                  <span className="text-white/70 text-xs">{p.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.8}>
            <Link to="/nj-office/book-hoboken"
              className="inline-flex items-center gap-3 bg-italic-accent text-foreground font-body text-sm font-semibold px-8 py-4 rounded-full hover:bg-italic-accent/90 transition-all shadow-lg">
              <CalendarCheck className="w-5 h-5" />
              Schedule Office Time
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="py-8 bg-white text-center">
        <div className="w-12 h-[1px] bg-border mx-auto" />
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* VARIATION D — "Bento Grid" — Modern bento-style tiles     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-4">
            <p className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground font-medium mb-4">Variation D — Bento Grid</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px] md:auto-rows-[220px]">
            {/* Title tile — spans 2 cols */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="col-span-2 row-span-1 rounded-3xl p-8 md:p-10 flex flex-col justify-end relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 15%) 0%, hsl(270, 60%, 30%) 100%)' }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-[0.95] tracking-tight">
                Our Private <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Office</em>
              </h2>
            </motion.div>

            {/* Photo tile */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.1}
              className="col-span-1 row-span-2 rounded-3xl overflow-hidden"
            >
              <img src={receptionImg} alt="Reception" className="w-full h-full object-cover" />
            </motion.div>

            {/* Stats tile */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.2}
              className="col-span-1 row-span-1 rounded-3xl bg-primary/5 border border-primary/10 p-6 flex flex-col items-center justify-center"
            >
              <p className="font-display text-5xl text-primary font-light">6</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-2">Amenities</p>
            </motion.div>

            {/* Amenity tiles — individual icons */}
            {amenities.slice(0, 3).map((a, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.3 + i * 0.08}
                className="col-span-1 row-span-1 rounded-3xl bg-[hsl(270,20%,97%)] border border-border/20 p-6 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <a.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="text-foreground text-sm font-medium">{a.label}</span>
              </motion.div>
            ))}

            {/* CTA tile — spans 2 cols */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.6}
              className="col-span-2 row-span-1 rounded-3xl p-8 flex items-center justify-between relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, hsl(270, 50%, 18%) 0%, hsl(270, 40%, 28%) 100%)' }}
            >
              <div>
                <p className="text-white/50 text-xs mb-1">Ready to book?</p>
                <p className="font-display text-2xl text-white">Schedule Your Day</p>
              </div>
              <Link to="/nj-office/book-hoboken"
                className="inline-flex items-center gap-2 bg-white text-foreground font-body text-sm font-semibold px-6 py-3.5 rounded-xl hover:bg-white/90 transition-all shadow-lg">
                <CalendarCheck className="w-4 h-4 text-primary" />
                Book Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Remaining amenity tiles */}
            {amenities.slice(3).map((a, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.7 + i * 0.08}
                className="col-span-1 row-span-1 rounded-3xl bg-[hsl(270,20%,97%)] border border-border/20 p-6 flex flex-col items-center justify-center gap-3 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <a.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="text-foreground text-sm font-medium">{a.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NJFooter />
    </div>
  );
}
