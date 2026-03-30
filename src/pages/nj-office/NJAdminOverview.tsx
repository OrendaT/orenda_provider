import NJNavbar from "@/components/NJNavbar";
import { motion } from "framer-motion";
import {
  KeyRound,
  CalendarCheck,
  Building2,
  BellRing,
  Clock,
  UserCheck,
  Wrench,
} from "lucide-react";
import njAdminHero from "@/assets/nj-admin-hero.png";

const supportItems = [
  {
    icon: KeyRound,
    title: "Office Access Setup",
    description: "Getting you set-up with office access so you can hit the ground running from day one.",
  },
  {
    icon: CalendarCheck,
    title: "Schedule Coordination",
    description: "Coordinating schedules and preparing patient lists ahead of your scheduled time.",
  },
  {
    icon: Building2,
    title: "Building Access",
    description: "Communicating with the Hoboken NJ Team for patient access to the building.",
  },
  {
    icon: BellRing,
    title: "Patient Reminders",
    description: "Ensuring patients receive appointment reminders, directions, and arrival instructions.",
  },
  {
    icon: Clock,
    title: "Day-of Coordination",
    description: "Assisting with day-of coordination, including patient arrival timing.",
  },
  {
    icon: UserCheck,
    title: "Patient Arrival Notification",
    description: "Notifying you when your patient has arrived and is ready to be seen.",
  },
  {
    icon: Wrench,
    title: "Logistics Support",
    description: "Helping manage any access or logistical issues that may come up.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function NJAdminOverview() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <NJNavbar />
      {/* ── Hero ── */}
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
        {/* purple → white gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#7c3aed] via-[#a78bfa] to-white" />

        {/* SVG dot pattern overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-white/10 blur-[120px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-white/80 tracking-[0.25em] uppercase text-xs font-semibold mb-4"
          >
            Orenda Psychiatry · New Jersey
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight"
          >
            Dedicated
            <br />
            <span className="text-white/90">New Jersey Admin</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light"
          >
            Our NJ Admin will support you every step of the way — from setup to patient day.
          </motion.p>
        </div>
      </section>

      {/* ── Photo Strip ── */}
      <section className="relative -mt-16 z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
        >
          <img
            src={njAdminHero}
            alt="Orenda Psychiatry NJ Admin at the front desk"
            className="w-full h-[340px] md:h-[420px] object-cover object-top"
          />
        </motion.div>
      </section>

      {/* ── Support Items ── */}
      <section className="relative py-24 px-6">
        {/* subtle lavender bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#f3f0ff] to-white" />

        {/* cross pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="crosses" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 16v8M16 20h8" stroke="#7c3aed" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#crosses)" />
        </svg>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-3xl md:text-4xl font-bold text-[#4c1d95] mb-4"
          >
            How We Support You
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] mb-16 origin-center"
          />

          <div className="grid md:grid-cols-2 gap-6">
            {supportItems.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="group relative flex gap-5 p-6 rounded-xl bg-white/80 backdrop-blur-sm border border-[#e9e5f5] shadow-sm hover:shadow-lg hover:border-[#a78bfa]/40 transition-all duration-300"
              >
                {/* icon circle */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1e1b4b] text-lg mb-1">{item.title}</h3>
                  <p className="text-[#6b7280] text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA strip ── */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] to-[#4c1d95]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots2)" />
        </svg>
        <div className="relative z-10 text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/80 tracking-widest uppercase text-xs mb-3"
          >
            Orenda Psychiatry
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white"
          >
            We're Here For You
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="mt-4 text-white/70 max-w-xl mx-auto"
          >
            Your dedicated NJ Admin ensures every office day runs smoothly — so you can focus on what matters most: your patients.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
