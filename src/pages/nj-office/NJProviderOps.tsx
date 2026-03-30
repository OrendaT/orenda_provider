import { Link } from "react-router-dom";
import NJFooter from "@/components/NJFooter";
import NJNavbar from "@/components/NJNavbar";
import { ArrowRight, MapPin, Clock, Shield, Coffee, Phone, Building2, ExternalLink, Users, CalendarCheck, DoorOpen, ClipboardList, AlertTriangle, Bell, CreditCard, KeyRound, BadgeCheck, RotateCcw, Mail, UserCheck, CheckCircle2, Stethoscope, Scale, Armchair, Wifi, HeartPulse, FileSpreadsheet, Info } from "lucide-react";
import { motion } from "framer-motion";
import buildingImg from "@/assets/hoboken-riverfront.png";
import edisonImg from "@/assets/edison-building-glass.png";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function NJProviderOps({ isAdmin = false }: { isAdmin?: boolean }) {
  const prefix = isAdmin ? "/admin" : "/nj-office";
  return (
    <div className="min-h-screen bg-card font-body">
      <NJNavbar isAdmin={isAdmin} />

      {/* Hero — compact visual block */}
      <section className="relative overflow-hidden py-10 sm:py-16 md:py-20" style={{ background: 'linear-gradient(135deg, hsl(270, 50%, 18%) 0%, hsl(270, 40%, 28%) 50%, hsl(270, 35%, 35%) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-medium mb-4">Provider Resource</p>
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.05] tracking-tight">
              Provider <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Operations Guide</em>
            </h1>
            <div className="w-12 h-[2px] bg-italic-accent/50 mx-auto mt-5 mb-4" />
            <p className="text-white/50 text-sm max-w-md mx-auto leading-relaxed">
              Your guide to scheduling, office access, and patient visits at our NJ locations.
            </p>
          </motion.div>
        </div>
      </section>




      {/* ─── Step 2: Scheduling Your Office Day ─── */}
      <section className="py-10 sm:py-14 md:py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} className="mb-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] tracking-[0.15em] uppercase font-medium mb-4">Step 02</span>
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground leading-[1.1]">
              Scheduling Your{" "}
              <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Office Day</em>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mb-8">
            {[
              {
                icon: CalendarCheck,
                num: "1",
                title: "Reserve Your Office Time",
                desc: "Sign up in advance, ideally at least one month ahead of time.",
                cta: { label: "Schedule Office Time", to: "/nj-office/book-hoboken" },
              },
              {
                icon: Users,
                num: "2",
                title: "Block Slots in SimplePractice",
                desc: "Block your in-person appointment times in SimplePractice to match the date you reserved.",
              },
              {
                icon: Mail,
                num: "3",
                title: "Admin Coordination",
                desc: "After you reserve office time, coordinate your finalized office-day plan directly with the NJ admin team.",
              },
            ].map((step, si) => (
              <motion.div key={si} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={si * 0.15}>
                <div className="bg-card rounded-2xl border border-border/30 p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-display text-2xl text-foreground/10 font-semibold">{step.num}</span>
                  </div>
                  <h3 className="font-display text-lg text-foreground mb-2">{step.title}</h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed flex-1">{step.desc}</p>
                  {step.cta && (
                    <Link
                      to={step.cta.to}
                      className="inline-flex items-center gap-2 mt-4 bg-primary text-primary-foreground font-body text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors w-fit"
                    >
                      {step.cta.label} <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Building Access Coordination */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <div className="rounded-2xl border border-accent/20 p-6" style={{ background: 'linear-gradient(135deg, hsl(270, 60%, 96%), hsl(270, 40%, 98%))' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <h4 className="font-display text-lg text-foreground">Building Access Coordination</h4>
              </div>
              <div className="grid md:grid-cols-3 gap-5 mb-4">
                <div className="bg-card rounded-xl border border-border/20 p-5">
                  <p className="font-body text-primary text-[10px] tracking-[0.15em] uppercase font-semibold mb-2">Hoboken — Building Access</p>
                  <ul className="font-body text-muted-foreground text-sm leading-relaxed space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Building entrance accessible 24/7</li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Floor doors open 7:00 AM – 6:00 PM, Mon–Fri</li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Outside these hours, security buzzer access required</li>
                  </ul>
                </div>
                <div className="bg-card rounded-xl border border-border/20 p-5">
                  <p className="font-body text-primary text-[10px] tracking-[0.15em] uppercase font-semibold mb-2">Hoboken — Regus Office Access</p>
                  <ul className="font-body text-muted-foreground text-sm leading-relaxed space-y-1.5">
                    <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Regus reception staffed 9:00 AM – 5:00 PM</li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>After hours, swipe card required for floor entry</li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Providers may either:
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>– Request a swipe card from our team, or</li>
                        <li>– Be registered with the building for 24/7 access</li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div className="bg-card rounded-xl border border-border/20 p-5">
                  <p className="font-body text-primary text-[10px] tracking-[0.15em] uppercase font-semibold mb-2">Edison — Building Access</p>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed italic">Pending — details to be added</p>
                </div>
                <div className="bg-card rounded-xl border border-border/20 p-5">
                  <p className="font-body text-primary text-[10px] tracking-[0.15em] uppercase font-semibold mb-2">Provider Sign-Up</p>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    Providers, please sign up <span className="text-foreground font-medium">ideally one month in advance</span> unless you attend regularly.
                  </p>
                </div>
                <div className="bg-card rounded-xl border border-border/20 p-5">
                  <p className="font-body text-primary text-[10px] tracking-[0.15em] uppercase font-semibold mb-2">Patient List Submission</p>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    The New Jersey admin sends the patient list to the Regus front desk <span className="text-foreground font-medium">24 hours before</span> the visit.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-card rounded-lg border border-border/20 px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-accent flex-shrink-0" />
                <p className="font-body text-muted-foreground text-xs leading-relaxed">
                  Do <span className="font-medium text-foreground">not</span> assume building access is already arranged. If you are not permanently scheduled, access must be confirmed before each visit.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Step 3: Arrival & Office Entry ─── */}
      <section className="py-10 sm:py-14 md:py-20 bg-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} className="mb-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/70 text-[10px] tracking-[0.15em] uppercase font-medium mb-4">Step 02</span>
            <h2 className="font-display text-3xl md:text-5xl font-light text-white leading-[1.1]">
              Arrival &{" "}
              <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Office Entry</em>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Hoboken */}
            <motion.div variants={slideIn} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.2}>
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <div className="relative h-44 overflow-hidden">
                  <img src={buildingImg} alt="Hoboken" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <p className="text-white/60 text-[10px] tracking-[0.3em] uppercase">Location 01</p>
                    <h3 className="font-display text-2xl text-white">Hoboken</h3>
                    <p className="text-white/50 text-xs mt-0.5">(201) 721-8500</p>
                  </div>
                </div>
                <div className="bg-foreground/80 p-5 space-y-3">
                  {[
                    { icon: CreditCard, title: "Bring photo ID", desc: "Required for lobby security check-in" },
                    { icon: Shield, title: "Enter the building", desc: "Ground floor open 7 AM – 6 PM, Mon–Fri. After hours: ring the doorbell on the right side — security will buzz you in." },
                    { icon: BadgeCheck, title: "Receive building pass", desc: "Security issues access to the 9th floor" },
                    { icon: DoorOpen, title: "Go to Office 9076", desc: "Take the elevator to the 9th floor" },
                    { icon: KeyRound, title: "Retrieve key from lockbox", desc: "Lockbox code: 7123" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-3.5 h-3.5 text-italic-accent" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{item.title}</p>
                        <p className="text-white/50 text-xs">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="bg-white/[0.06] rounded-lg px-4 py-2.5">
                    <p className="text-white/70 text-xs"><span className="text-italic-accent font-medium">Remember:</span> Return the key to the lockbox after your visit.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Edison — same structure as Hoboken */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.4}>
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <div className="relative h-44 overflow-hidden">
                  <img src={edisonImg} alt="Edison" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <p className="text-white/60 text-[10px] tracking-[0.3em] uppercase">Location 02</p>
                    <h3 className="font-display text-2xl text-white">Edison</h3>
                    <p className="text-white/50 text-xs mt-0.5">(732) 782-0328</p>
                  </div>
                </div>
                <div className="bg-foreground/80 p-5 space-y-3">
                  {[
                    { icon: CreditCard, title: "Bring photo ID", desc: "Required for building entry" },
                    { icon: Shield, title: "Check in at front desk", desc: "3rd floor Regus reception" },
                    { icon: BadgeCheck, title: "Confirm your reservation", desc: "Front desk verifies your booking" },
                    { icon: DoorOpen, title: "Go to your assigned office", desc: "Proceed to your private office on the 3rd floor" },
                    { icon: KeyRound, title: "Retrieve key from lockbox", desc: "Lockbox code: 7123" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-3.5 h-3.5 text-italic-accent" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{item.title}</p>
                        <p className="text-white/50 text-xs">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="bg-white/[0.06] rounded-lg px-4 py-2.5">
                    <p className="text-white/70 text-xs"><span className="text-italic-accent font-medium">Remember:</span> Return the key to the front desk or lockbox after your visit.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Step 03: Patient Arrival & Check-In ─── */}
      <section className="py-10 sm:py-14 md:py-20" style={{ background: 'linear-gradient(180deg, white 0%, hsl(270, 20%, 97%) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} className="mb-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] tracking-[0.15em] uppercase font-medium mb-4">Step 03</span>
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground leading-[1.1]">
              Patient Arrival &{" "}
              <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Check-In</em>
            </h2>
          </motion.div>

          {/* Patient Check-In */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.15} className="mb-8">
            <div className="bg-card rounded-2xl border border-border/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-display text-lg text-foreground">Patient Check-In</h3>
              </div>
              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-4">
                Patients will complete a digital check-in form upon arrival.
              </p>
              <Link
                to="/patient/book-visit"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                Open Patient Arrival Page
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {/* Reception Hours */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.3}>
              <div className="bg-card rounded-2xl border border-border/30 p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-display text-lg text-foreground">Reception Hours</h3>
                </div>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  9:00 AM – 5:00 PM: Regus reception is present. Patients may wait in the reception area until escorted by the provider.
                </p>
              </div>
            </motion.div>

            {/* After Regus Hours */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.45}>
              <div className="bg-card rounded-2xl border border-accent/20 p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-accent" />
                  </div>
                  <h3 className="font-display text-lg text-foreground">After Regus Hours</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="font-body text-foreground text-sm font-semibold mb-1.5 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-amber-600" />
                      Patient Arrival Notification
                    </p>
                    <p className="font-body text-muted-foreground text-sm leading-relaxed">
                      The NJ admin team monitors patient check-ins and will notify the provider when a patient has arrived. Providers will also receive a real-time notification once the patient completes check-in.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Escort warning */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.6}>
            <div className="rounded-xl border border-accent/20 p-4 flex items-start gap-3" style={{ background: 'linear-gradient(135deg, hsl(270, 60%, 96%), hsl(270, 40%, 98%))' }}>
              <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="font-body text-muted-foreground text-sm leading-relaxed">
                <span className="font-medium text-foreground">Escort Required:</span> Patients must be escorted by providers within the coworking space at all times.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Office Equipment — Purple Block ─── */}
      <section className="py-10 sm:py-14 md:py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 15%) 0%, hsl(270, 80%, 25%) 30%, hsl(270, 60%, 35%) 60%, hsl(270, 50%, 45%) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-15 hidden md:block" style={{ background: 'radial-gradient(circle, hsl(270, 80%, 60%) 0%, transparent 70%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} className="mb-10">
            <h2 className="font-display text-3xl md:text-5xl font-light text-white leading-[1.1]">
              Office <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Equipment</em>
            </h2>
            <p className="text-white/40 text-sm mt-2">Available at both locations</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              { icon: Armchair, label: "Patient Seating" },
              { icon: Scale, label: "Scale" },
              { icon: Stethoscope, label: "BP Cuff" },
              { icon: Wifi, label: "Wi-Fi" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}>
                <div className="bg-card rounded-2xl border border-white/20 p-5 text-center shadow-lg">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-foreground text-xs font-medium">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="mt-6">
            <div className="bg-white/10 border border-white/15 rounded-xl p-5">
              <p className="text-white/70 text-sm">
                <span className="text-italic-accent font-medium">Note:</span> Shared Regus coffee/tea stations are for workspace members only. Both offices are stocked with beverages to offer patients — use only items provided in the private office.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Step 5: End-of-Visit Checklist — Lavender ─── */}
      <section className="py-10 sm:py-14 md:py-20" style={{ background: 'linear-gradient(180deg, hsl(270, 20%, 97%) 0%, white 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} className="mb-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] tracking-[0.15em] uppercase font-medium mb-4">Step 04</span>
            <h2 className="font-display text-3xl md:text-5xl font-light text-foreground leading-[1.1]">
              End-of-Visit{" "}
              <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Checklist</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {[
              { icon: KeyRound, label: "Return Key", desc: "To lockbox or front desk" },
              { icon: CheckCircle2, label: "Clean & Reset", desc: "Leave office organized" },
              { icon: HeartPulse, label: "Schedule Follow-Up", desc: "Telehealth as needed" },
              { icon: RotateCcw, label: "Reset for Next", desc: "Prepare for next provider" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}>
                <div className="bg-card rounded-2xl border border-border/30 p-5 h-full">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-display text-base text-foreground mb-1">{item.label}</h4>
                  <p className="text-muted-foreground text-xs">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Quick Links — Black ─── */}
      <section className="py-10 sm:py-14 md:py-16 bg-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: "Schedule Office Time", to: "/nj-office/book-hoboken", icon: CalendarCheck },
              { label: "Hoboken Office", to: "/nj-office/hoboken", icon: Building2 },
              { label: "Edison Office", to: "/nj-office/edison", icon: Building2 },
            ].map((link, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}>
                <Link to={link.to} className="block bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-5 text-center transition-all group">
                  <link.icon className="w-5 h-5 text-italic-accent mx-auto mb-2" />
                  <p className="text-white text-sm font-medium group-hover:text-italic-accent transition-colors">{link.label}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NJFooter />
    </div>
  );
}
