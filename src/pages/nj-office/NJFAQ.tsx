import { Link } from "react-router-dom";
import NJFooter from "@/components/NJFooter";
import NJNavbar from "@/components/NJNavbar";
import { ChevronDown, Building2, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How do I schedule an in-person office day?",
    answer: "Use the 'Schedule Office Time' page in the navigation to select your date, time block (Morning, Afternoon, or Full Day), and office location. You'll need to sign the office addendum agreement to confirm.",
  },
  {
    question: "Where are the offices located?",
    answer: "Hoboken: 221 River St, 9th Floor, Unit 9076, Hoboken, NJ 07030 (next to Wonder Cafe). Edison: 110 Fieldcrest Ave, 3rd Floor, Unit 328, Edison, NJ 08837.",
  },
  {
    question: "What are the building hours?",
    answer: "Hoboken: The building doors are open Mon–Fri, 7:00 AM – 6:00 PM. After hours, ring the doorbell on the right side of the entrance — security is on-site 24/7. Edison: Main entrance is open Mon–Fri, 8:00 AM – 6:00 PM. After hours, both providers and patients must use the P1 Parking Level entrance around the back of the building. Access code: 05296.",
  },
  {
    question: "How do I access the Hoboken office after hours?",
    answer: "Regus office hours are Mon–Fri, 9:00 AM – 5:00 PM. If you're attending the office outside of these hours, make sure you're set up with a permanent swipe card and keys. Contact the NJ Admin Team at (201) 685-4863 or offices@orendapsych.com to coordinate.",
  },
  {
    question: "How do I access the Edison building after hours?",
    answer: "Both providers and patients must use the P1 Parking Level entrance, the entrance is around the back of the building. Access code: 05296.",
  },
  {
    question: "How do I get the office key and building access?",
    answer: "During Regus office hours (Mon–Fri, 9:00 AM – 5:00 PM), access a key and swipe card from the lockbox outside the Orenda office door. Lockbox code: 0000. Please return both items when finished. If attending outside of Regus hours, make sure you are set up with a permanent swipe card — contact the NJ Admin Team at (201) 685-4863 or offices@orendapsych.com to coordinate. Note: there is a $65 replacement fee for lost or damaged access cards.",
  },
  {
    question: "What should I do when working outside Regus hours?",
    answer: "Place the Orenda Patient Welcome & Check-In sign by the 9th-floor glass door (located inside the office). Patients should text (201) 685-4863 upon arrival — this will be communicated to them prior to their visit. Once notified, greet them at the 9th-floor entrance. Please return the sign to the office at the end of the day.",
  },
  {
    question: "What's the Wi-Fi info?",
    answer: "Hoboken: Network: 'Regus', Password: '167845630'. Edison: Network: 'Regus', Password: '167785439'.",
  },
  {
    question: "What equipment is available in the office?",
    answer: "Each office includes patient seating, a weight scale, blood pressure cuff, Wi-Fi, and access to the building's kitchen, lounge, and beverage stations (including a Keurig in Edison).",
  },
  {
    question: "How does patient check-in work?",
    answer: "Patients are asked to text (201) 685-4863 when they arrive — this is communicated to them ahead of their visit. Patient arrivals are monitored by the NJ Admin Team, and you'll receive a notification as soon as your patient checks in. Your patient schedule is circulated by the NJ Admin Team the evening before your office day.",
  },
  {
    question: "Who do I contact for help?",
    answer: "NJ Admin Team: (201) 685-4863 or offices@orendapsych.com — for scheduling, patient coordination, swipe card setup, and all office operations.",
  },
];

export default function NJFAQ({ isAdmin = false }: { isAdmin?: boolean }) {
  const prefix = isAdmin ? "/admin" : "/nj-office";
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white font-body">
      <NJNavbar isAdmin={isAdmin} />

      {/* Hero */}
      <section className="py-16 md:py-24 px-6 md:px-8" style={{ background: 'linear-gradient(135deg, hsl(270, 60%, 92%), hsl(0, 0%, 100%))' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <p className="text-primary/40 text-[10px] tracking-[0.5em] uppercase mb-4 font-medium">Quick Answers</p>
            <h1 className="font-display text-4xl md:text-6xl font-light text-foreground leading-[1]">
              Frequently <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Asked</em>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-8 md:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <div className="space-y-2">
            {faqData.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" animate="visible" custom={i * 0.05}>
                <div className="bg-white rounded-xl border border-border/30 overflow-hidden hover:border-primary/20 transition-colors">
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left"
                  >
                    <h3 className="font-display text-sm sm:text-base text-foreground leading-snug pr-4">{faq.question}</h3>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-0">
                          <div className="border-l-2 border-primary/15 pl-4">
                            <p className="font-body text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-10">
            <div className="bg-foreground rounded-2xl p-8 text-center">
              <h3 className="font-display text-2xl text-white font-light mb-2">
                Still Have <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Questions?</em>
              </h3>
              <p className="text-white/50 text-sm mb-5">Reach the NJ admin team directly.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a href="tel:+12016854863" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-body text-sm font-medium px-5 py-3 rounded-lg transition-colors">
                  <Phone className="w-4 h-4" /> (201) 685-4863
                </a>
                <a href="mailto:offices@orendapsych.com" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-body text-sm font-medium px-5 py-3 rounded-lg transition-colors">
                  <Mail className="w-4 h-4" /> offices@orendapsych.com
                </a>
                <Link to={`${prefix}/contact`} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body text-sm font-medium px-5 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  Contact Page
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <NJFooter />
    </div>
  );
}
