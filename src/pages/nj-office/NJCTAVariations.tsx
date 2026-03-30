import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarCheck, Clock, Sparkles, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/orenda-logo-purple.png";
import hobokenImg from "@/assets/hoboken-riverfront.png";
import NJFooter from "@/components/NJFooter";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function NJCTAVariations() {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* Nav */}
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Hub
          </Link>
          <img src={logo} alt="Orenda" className="h-5" />
        </div>
      </motion.nav>

      {/* Header */}
      <section className="py-12 md:py-20 px-6 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-medium mb-3">Homepage CTA Options</p>
            <h1 className="font-display text-3xl md:text-5xl font-light text-foreground mb-4">
              Call to <em className="text-primary" style={{ fontStyle: 'italic' }}>Action</em> Variations
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Different approaches to prompt providers to schedule their office time when landing on the homepage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Variation 1 — Floating Banner */}
      <section className="px-6 md:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-4">Variation 1 — Floating Top Banner</p>
            <div className="rounded-2xl overflow-hidden border border-border/30 bg-white">
              {/* Preview */}
              <div className="p-6 md:p-10 bg-secondary/20">
                <div className="rounded-xl bg-gradient-to-r from-primary to-[hsl(270,60%,55%)] text-primary-foreground px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Ready to see patients in-person?</p>
                      <p className="text-white/70 text-xs">Reserve your office day at least one week in advance</p>
                    </div>
                  </div>
                  <Link to="/nj-office/book-hoboken" className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-xs px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap">
                    Schedule Office Time <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              <div className="px-6 md:px-10 py-5 border-t border-border/20">
                <p className="text-xs text-muted-foreground"><strong>Best for:</strong> High visibility, non-intrusive. Sits at the top of the page and draws attention with color contrast.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Variation 2 — Center Stage Card — Multiple Color Options */}
      <section className="px-6 md:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-4">Variation 2 — Center Stage Card</p>
            <div className="space-y-8">

              {/* 2A — Deep Purple Gradient */}
              <div className="rounded-2xl overflow-hidden border border-border/30 bg-white">
                <div className="p-6 md:p-10 flex items-center justify-center min-h-[400px] relative overflow-hidden bg-white">
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px]" />
                  <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-[hsl(270,30%,90%)] opacity-30 blur-[80px]" />
                  <div className="relative rounded-2xl shadow-2xl p-8 md:p-12 max-w-md text-center overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, hsl(270, 45%, 25%), hsl(270, 60%, 40%), hsl(280, 50%, 55%))' }}>
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, hsl(270, 80%, 70%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(300, 60%, 60%) 0%, transparent 50%)' }} />
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-display text-2xl text-white font-semibold mb-2">Welcome Back, Provider</h3>
                      <p className="text-white/70 text-sm mb-6 leading-relaxed">
                        Planning to see patients in-person this week? Reserve your office day now to secure your time slot.
                      </p>
                      <Link to="/nj-office/book-hoboken" className="inline-flex items-center gap-2 bg-white text-primary font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors shadow-lg">
                        Schedule Office Time <ArrowRight className="w-4 h-4" />
                      </Link>
                      <p className="text-xs text-white/40 mt-5 tracking-wide">Takes less than 30 seconds</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 md:px-10 py-5 border-t border-border/20">
                  <p className="text-xs text-muted-foreground"><strong>2A — Deep Purple:</strong> Rich gradient card with radial glow effects. Dramatic, premium feel.</p>
                </div>
              </div>

              {/* 2B — Warm Lavender & Gold */}
              <div className="rounded-2xl overflow-hidden border border-border/30 bg-white">
                <div className="p-6 md:p-10 flex items-center justify-center min-h-[400px] relative overflow-hidden"
                  style={{ background: 'linear-gradient(160deg, hsl(270, 15%, 96%), hsl(40, 20%, 95%), hsl(270, 10%, 97%))' }}>
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[hsl(35,40%,88%)] opacity-30 blur-[100px]" />
                  <div className="relative rounded-2xl shadow-[0_20px_60px_-20px_hsl(270,40%,30%,0.3)] p-8 md:p-12 max-w-md text-center overflow-hidden"
                    style={{ background: 'linear-gradient(160deg, hsl(35, 60%, 55%), hsl(270, 50%, 50%), hsl(270, 60%, 45%))' }}>
                    <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, hsl(35, 80%, 75%) 0%, transparent 50%)' }} />
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-display text-2xl text-white font-semibold mb-2">Welcome Back, Provider</h3>
                      <p className="text-white/70 text-sm mb-6 leading-relaxed">
                        Planning to see patients in-person this week? Reserve your office day now to secure your time slot.
                      </p>
                      <Link to="/nj-office/book-hoboken" className="inline-flex items-center gap-2 bg-white text-[hsl(270,50%,40%)] font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors shadow-lg">
                        Schedule Office Time <ArrowRight className="w-4 h-4" />
                      </Link>
                      <p className="text-xs text-white/40 mt-5 tracking-wide">Takes less than 30 seconds</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 md:px-10 py-5 border-t border-border/20">
                  <p className="text-xs text-muted-foreground"><strong>2B — Warm Lavender & Gold:</strong> Gold-to-purple gradient card. Elegant and warm.</p>
                </div>
              </div>

              {/* 2C — Midnight with Glow */}
              <div className="rounded-2xl overflow-hidden border border-border/30 bg-white">
                <div className="p-6 md:p-10 flex items-center justify-center min-h-[400px] relative overflow-hidden bg-[hsl(270,10%,96%)]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px]" />
                  <div className="relative rounded-2xl shadow-2xl p-8 md:p-12 max-w-md text-center overflow-hidden bg-foreground">
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, hsl(270, 60%, 30%) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, hsl(270, 70%, 25%) 0%, transparent 50%)' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-primary/15 blur-[80px]" />
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-8 h-8 text-[hsl(270,70%,80%)]" />
                      </div>
                      <h3 className="font-display text-2xl text-white font-semibold mb-2">Welcome Back, Provider</h3>
                      <p className="text-white/50 text-sm mb-6 leading-relaxed">
                        Planning to see patients in-person this week? Reserve your office day now to secure your time slot.
                      </p>
                      <Link to="/nj-office/book-hoboken" className="inline-flex items-center gap-2 bg-white text-primary font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors shadow-lg">
                        Schedule Office Time <ArrowRight className="w-4 h-4" />
                      </Link>
                      <p className="text-xs text-white/30 mt-5 tracking-wide">Takes less than 30 seconds</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 md:px-10 py-5 border-t border-border/20">
                  <p className="text-xs text-muted-foreground"><strong>2C — Midnight Glow:</strong> Dark gradient card with purple glow on light background. High-contrast, luxurious.</p>
                </div>
              </div>

              {/* 2D — Vibrant Gradient Pop */}
              <div className="rounded-2xl overflow-hidden border border-border/30 bg-white">
                <div className="p-6 md:p-10 flex items-center justify-center min-h-[400px] relative overflow-hidden bg-white">
                  <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, hsl(260, 60%, 70%) 0%, transparent 40%)' }} />
                  <div className="relative rounded-3xl shadow-[0_30px_80px_-20px_hsl(270,60%,30%,0.4)] p-8 md:p-12 max-w-md text-center overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, hsl(260, 65%, 60%), hsl(300, 55%, 55%), hsl(340, 65%, 60%))' }}>
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, white 0%, transparent 40%), radial-gradient(circle at 70% 70%, hsl(260, 80%, 80%) 0%, transparent 50%)' }} />
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-white/20 border border-white/25 flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-display text-2xl text-white font-bold mb-2">Welcome Back, Provider</h3>
                      <p className="text-white/75 text-sm mb-6 leading-relaxed">
                        Planning to see patients in-person this week? Reserve your office day now to secure your time slot.
                      </p>
                      <Link to="/nj-office/book-hoboken" className="inline-flex items-center gap-2 bg-white text-[hsl(280,60%,45%)] font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors shadow-lg">
                        Schedule Office Time <ArrowRight className="w-4 h-4" />
                      </Link>
                      <p className="text-xs text-white/40 mt-5 tracking-wide">Takes less than 30 seconds</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 md:px-10 py-5 border-t border-border/20">
                  <p className="text-xs text-muted-foreground"><strong>2D — Vibrant Pop:</strong> Bold purple-to-pink gradient card on white. Eye-catching, dynamic.</p>
                </div>
              </div>

              {/* 2E — Soft Frosted Violet */}
              <div className="rounded-2xl overflow-hidden border border-border/30 bg-white">
                <div className="p-6 md:p-10 flex items-center justify-center min-h-[400px] relative overflow-hidden bg-white">
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, hsl(270, 40%, 60%) 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                  <div className="relative rounded-2xl shadow-xl p-8 md:p-12 max-w-md text-center overflow-hidden"
                    style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 50%), hsl(270, 50%, 40%), hsl(270, 55%, 35%))' }}>
                    <div className="absolute top-0 left-0 w-[200px] h-[200px] rounded-full bg-[hsl(270,60%,70%)] opacity-20 blur-[60px]" />
                    <div className="absolute bottom-0 right-0 w-[180px] h-[180px] rounded-full bg-[hsl(270,80%,75%)] opacity-15 blur-[50px]" />
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-display text-2xl text-white font-semibold mb-2">Welcome Back, Provider</h3>
                      <p className="text-white/90 text-sm mb-6 leading-relaxed">
                        Planning to see patients in-person this week? Reserve your office day now to secure your time slot.
                      </p>
                      <Link to="/nj-office/book-hoboken" className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-opacity hover:opacity-90 text-white"
                        style={{ background: 'linear-gradient(135deg, hsl(270, 70%, 75%), hsl(0, 0%, 100%), hsl(270, 60%, 80%))' }}>
                        <span className="bg-gradient-to-r from-primary to-[hsl(270,60%,50%)] bg-clip-text text-transparent font-bold flex items-center gap-2">
                          Schedule Office Time <ArrowRight className="w-4 h-4 text-primary" />
                        </span>
                      </Link>
                      <p className="text-xs text-white/80 mt-5 tracking-wide">Takes less than 30 seconds</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 md:px-10 py-5 border-t border-border/20">
                  <p className="text-xs text-muted-foreground"><strong>2E — Frosted Violet:</strong> Soft purple gradient card with brighter text and gradient button.</p>
                </div>
              </div>

              {/* 2F — Lavender Pattern Background */}
              <div className="rounded-2xl overflow-hidden border border-border/30 bg-white">
                <div className="p-6 md:p-10 flex items-center justify-center min-h-[400px] relative overflow-hidden bg-white">
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, hsl(270, 40%, 60%) 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                  <div className="relative rounded-2xl shadow-xl p-8 md:p-12 max-w-md text-center overflow-hidden bg-[hsl(270,30%,94%)]">
                    <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `repeating-linear-gradient(45deg, hsl(270, 50%, 60%) 0px, hsl(270, 50%, 60%) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(-45deg, hsl(270, 50%, 60%) 0px, hsl(270, 50%, 60%) 1px, transparent 1px, transparent 12px)` }} />
                    <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 30% 20%, hsl(270, 50%, 85%) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, hsl(270, 60%, 88%) 0%, transparent 50%)' }} />
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-display text-2xl text-foreground font-semibold mb-2">Welcome Back, Provider</h3>
                      <p className="text-foreground/75 text-sm mb-6 leading-relaxed">
                        Planning to see patients in-person this week? Reserve your office day now to secure your time slot.
                      </p>
                      <Link to="/nj-office/book-hoboken" className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-opacity hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, hsl(270, 50%, 45%), hsl(270, 60%, 55%), hsl(280, 50%, 50%))' }}>
                        <span className="text-white flex items-center gap-2">
                          Schedule Office Time <ArrowRight className="w-4 h-4" />
                        </span>
                      </Link>
                      <p className="text-xs text-foreground/50 mt-5 tracking-wide">Takes less than 30 seconds</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 md:px-10 py-5 border-t border-border/20">
                  <p className="text-xs text-muted-foreground"><strong>2F — Lavender Pattern:</strong> Light lavender card with crosshatch pattern texture. Clean, clinical feel with dark text.</p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Variation 3 — Sticky Bottom Bar */}
      <section className="px-6 md:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-4">Variation 3 — Sticky Bottom Bar</p>
            <div className="rounded-2xl overflow-hidden border border-border/30 bg-white">
              <div className="p-6 md:p-10 bg-secondary/20 relative min-h-[250px] flex flex-col justify-end">
                <div className="text-center mb-16 opacity-40">
                  <p className="text-sm text-foreground">[ Page content above ]</p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-border/30 px-6 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-sm text-foreground font-medium">Office slots available this week</p>
                  </div>
                  <Link to="/nj-office/book-hoboken" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-xs px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                    Schedule Now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              <div className="px-6 md:px-10 py-5 border-t border-border/20">
                <p className="text-xs text-muted-foreground"><strong>Best for:</strong> Persistent reminder as users browse. Low intrusion, always accessible.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Variation 4 — Hero Inline CTA */}
      <section className="px-6 md:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-4">Variation 4 — Hero Split CTA</p>
            <div className="rounded-2xl overflow-hidden border border-border/30 bg-white">
              <div className="grid md:grid-cols-2 min-h-[300px]">
                <div className="relative overflow-hidden">
                  <img src={hobokenImg} alt="Hoboken Office" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[hsl(270,40%,20%)/80] to-transparent" />
                  <div className="relative p-8 md:p-12 flex flex-col justify-center h-full">
                    <p className="text-[10px] tracking-[0.4em] uppercase text-white/60 font-medium mb-3">In-Person Appointments</p>
                    <h3 className="font-display text-2xl md:text-3xl text-white font-light leading-tight mb-4">
                      Your patients are<br />waiting <em style={{ fontStyle: 'italic' }}>in person</em>
                    </h3>
                    <Link to="/nj-office/book-hoboken" className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-xs px-6 py-3 rounded-lg hover:bg-white/90 transition-colors w-fit">
                      Schedule Office Time <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center bg-secondary/20">
                  <div className="space-y-5">
                    {[
                      { icon: MapPin, text: "Hoboken & Edison locations available" },
                      { icon: Clock, text: "Morning, afternoon, or full-day blocks" },
                      { icon: CalendarCheck, text: "Book at least one week in advance" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm text-foreground">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 md:px-10 py-5 border-t border-border/20">
                <p className="text-xs text-muted-foreground"><strong>Best for:</strong> Emotional impact with imagery. Combines visual appeal with clear scheduling info.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Variation 5 — Minimal Nudge */}
      <section className="px-6 md:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-4">Variation 5 — Minimal Nudge</p>
            <div className="rounded-2xl overflow-hidden border border-border/30 bg-white">
              <div className="p-6 md:p-10 bg-secondary/20">
                <div className="border border-primary/20 rounded-xl px-6 py-5 flex items-center justify-between bg-white/60 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <CalendarCheck className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Haven't scheduled your office day yet?</p>
                      <p className="text-xs text-muted-foreground">Slots fill up fast — reserve yours now</p>
                    </div>
                  </div>
                  <Link to="/nj-office/book-hoboken" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1.5">
                    Schedule <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
              <div className="px-6 md:px-10 py-5 border-t border-border/20">
                <p className="text-xs text-muted-foreground"><strong>Best for:</strong> Understated elegance. Works well inline between content sections without disrupting flow.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <NJFooter />
    </div>
  );
}
