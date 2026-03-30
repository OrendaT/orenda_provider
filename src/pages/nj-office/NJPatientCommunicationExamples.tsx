import { motion } from "framer-motion";
import { Mail, MessageSquare, Calendar, Clock, MapPin, User, Send, ArrowLeft, Bell, CheckCircle2, Repeat, Navigation, Phone as PhoneIcon, Globe, AlertTriangle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import logo from "@/assets/orenda-logo-purple.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const slideInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const sample = {
  patientFirstName: "Sarah",
  patientLastName: "Johnson",
  providerName: "Teddy Schimenti",
  appointmentDate: "Monday, March 16, 2026",
  slotStart: "10:00 AM",
  slotEnd: "10:30 AM",
  location: "Hoboken, NJ",
  address: "221 River St, 9th Floor, Suite 9076, Hoboken, NJ 07030",
  edisonAddress: "110 Fieldcrest Ave, 3rd Floor, Unit 328, Edison, NJ 08837",
  confirmationCode: "ORN-A3F8B2",
  followUpDate: "Sunday, June 14, 2026",
  inPersonDate: "Monday, June 15, 2026",
  googleMapsHoboken: "https://maps.google.com/?q=221+River+St+Hoboken+NJ+07030",
  googleMapsEdison: "https://maps.google.com/?q=110+Fieldcrest+Ave+Edison+NJ+08837",
  orendaPhone: "(201) 484-4040",
  orendaEmail: "info@orendapsych.com",
  orendaWebsite: "https://www.orendapsych.com",
  checkInUrl: "/patient/book-visit",
  patientPortalUrl: "/patient/book-visit",
};

/* ─── Phone Frame ─── */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[320px] mx-auto">
      <div className="rounded-[2.5rem] bg-gray-900 p-2.5 shadow-2xl">
        <div className="flex justify-center mb-1">
          <div className="w-20 h-5 bg-black rounded-full" />
        </div>
        <div className="rounded-[2rem] bg-gray-100 overflow-hidden">
          <div className="bg-gray-200 px-5 py-1 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-gray-600">9:41</span>
            <span className="text-[10px] text-gray-500">📶 🔋</span>
          </div>
          <div className="bg-white border-b border-gray-200 px-3 py-2 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ background: "hsl(270, 100%, 25%)" }}>OP</div>
            <div>
              <p className="text-xs font-semibold text-gray-900">Orenda Psychiatry</p>
              <p className="text-[10px] text-gray-400">SMS</p>
            </div>
          </div>
          <div className="p-3 min-h-[280px]">
            <div className="flex justify-start mb-1.5">
              <div className="max-w-[90%] rounded-2xl rounded-bl-md px-3.5 py-2.5 bg-gray-200">
                <p className="text-[11.5px] text-gray-900 whitespace-pre-line leading-relaxed">{children}</p>
              </div>
            </div>
            <p className="text-[9px] text-gray-400 ml-1.5 mt-0.5">Just now</p>
          </div>
          <div className="bg-white border-t border-gray-200 px-3 py-2 flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full px-3 py-1.5">
              <span className="text-[11px] text-gray-400">iMessage</span>
            </div>
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "hsl(270, 100%, 25%)" }}>
              <Send className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Laptop Email Frame ─── */
function LaptopEmailFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div className="rounded-t-xl bg-gray-700 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-8">
          <div className="bg-gray-600 rounded-md px-3 py-1 flex items-center gap-2">
            <Globe className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-300">mail.google.com</span>
          </div>
        </div>
      </div>
      {/* Email header bar */}
      <div className="bg-white border-x border-gray-200 px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <Mail className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-xs text-gray-500">From: <span className="text-gray-800 font-medium">Orenda Psychiatry &lt;noreply@orendapsych.com&gt;</span></p>
        </div>
        <p className="text-xs text-gray-500 pl-5">To: {sample.patientFirstName.toLowerCase()}.{sample.patientLastName.toLowerCase()}@email.com</p>
      </div>
      <div className="border-x border-b border-gray-200 rounded-b-xl overflow-hidden shadow-xl">
        {children}
      </div>
    </div>
  );
}

/* ─── Email Inner Content ─── */
function EmailContent({ headerLabel, headerSub, gradient, children }: { headerLabel: string; headerSub: string; gradient: string; children: React.ReactNode }) {
  return (
    <>
      <div className="px-6 py-8 text-center" style={{ background: gradient }}>
        <img src={logo} alt="Orenda Psychiatry" className="h-6 mx-auto mb-3 brightness-0 invert opacity-80" />
        <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
          <Calendar className="w-3 h-3 text-white/90" />
          <span className="text-[10px] font-medium tracking-widest uppercase text-white/90">{headerLabel}</span>
        </div>
        <h2 className="text-xl font-bold text-white font-display">Orenda Psychiatry</h2>
        <p className="text-white/60 text-xs mt-1">{headerSub}</p>
      </div>
      <div className="bg-white px-6 py-6 text-sm text-gray-700">{children}</div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 space-y-1">
        <p className="text-[10px] text-gray-500 text-center font-medium">Orenda Psychiatry · {sample.orendaPhone} · {sample.orendaEmail}</p>
        <p className="text-[10px] text-gray-400 text-center">
          <a href={sample.orendaWebsite} className="underline">www.orendapsych.com</a>
        </p>
        <p className="text-[9px] text-gray-300 text-center">© 2026 Orenda Psychiatry. All rights reserved.</p>
      </div>
    </>
  );
}

function DetailRow({ icon: Icon, label, value, sub, link }: { icon: any; label: string; value: string; sub?: string; link?: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-purple-700" />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-400 mb-0.5">{label}</p>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-purple-700 underline">{value}</a>
        ) : (
          <p className="text-[13px] font-semibold text-gray-900">{value}</p>
        )}
        {sub && <p className="text-[11px] text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Section Wrapper ─── */
function CommunicationSection({ title, subtitle, timing, icon: Icon, gradient, color, children }: {
  title: string; subtitle: string; timing: string; icon: any; gradient: string; color: string; children: React.ReactNode;
}) {
  return (
    <section className="py-12 sm:py-16 border-b border-border/30 last:border-b-0">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg" style={{ background: gradient }}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-2">{title}</h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
        <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full" style={{ background: `${color}12`, color }}>{timing}</span>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
        {children}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   EMAIL + SMS CONTENT
   ═══════════════════════════════════════════ */

function ConfirmationEmail() {
  return (
    <LaptopEmailFrame>
      <EmailContent headerLabel="Appointment Confirmed" headerSub="Your upcoming visit details" gradient="linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 35%) 50%, hsl(270, 60%, 50%) 100%)">
        <p className="mb-4">Hi <span className="font-semibold text-gray-900">{sample.patientFirstName}</span>,</p>
        <p className="text-[13px] text-gray-600 mb-5 leading-relaxed">Your appointment has been confirmed! Here are your visit details — please save this for your records.</p>
        <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/80 to-white p-5 mb-5 grid gap-3.5">
          <DetailRow icon={Calendar} label="Date" value={sample.appointmentDate} />
          <DetailRow icon={Clock} label="Time" value={`${sample.slotStart} — ${sample.slotEnd}`} />
          <DetailRow icon={User} label="Provider" value={sample.providerName} />
          <DetailRow icon={MapPin} label="Location" value={sample.address} link={sample.googleMapsHoboken} />
        </div>
        <div className="text-center py-3 px-5 rounded-xl bg-gray-50 border border-gray-100 mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Confirmation Code</p>
          <p className="text-xl font-bold tracking-wider" style={{ color: "hsl(270, 100%, 25%)" }}>{sample.confirmationCode}</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 mb-5">
          <p className="text-[12px] font-semibold text-amber-800 mb-1.5">📋 Before Your Visit</p>
          <ul className="text-[12px] text-amber-700 space-y-1 list-disc pl-4">
            <li>Please arrive 10 minutes early</li>
            <li>Bring a valid photo ID and insurance card</li>
            <li>Complete any intake forms sent separately</li>
          </ul>
        </div>
        {/* After-Hours Doorbell Alert */}
        <div className="rounded-xl border-2 border-orange-400 p-4 mb-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff7ed, #fffbeb, #fff7ed)' }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-orange-600 mb-1 mt-1">⚠️ After-Hours Access</p>
          <p className="text-[12px] font-bold text-orange-900 mb-0.5">🔔 Ring the Doorbell to Enter</p>
          <p className="text-[12px] text-orange-800 leading-relaxed">Arriving <strong>after 5 PM</strong>? <strong>Ring the doorbell on the right side of the entrance</strong> — security will let you in.</p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-5">
          <p className="text-[12px] font-semibold text-blue-800 mb-1.5">📍 Getting There</p>
          <p className="text-[12px] text-blue-700 mb-2">Enter the building at 221 River Street — look for "Riverfront Center" signage. Take the elevator to the 9th Floor, Suite 9076.</p>
          <a href={sample.googleMapsHoboken} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 underline">
            <Navigation className="w-3 h-3" /> Open in Google Maps
          </a>
        </div>
        <div className="text-center mb-4">
          <Link to={sample.checkInUrl} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white font-semibold text-xs" style={{ background: "linear-gradient(135deg, hsl(270, 100%, 25%) 0%, hsl(270, 80%, 40%) 100%)", boxShadow: "0 4px 16px -4px hsla(270, 100%, 25%, 0.4)" }}>
            <CheckCircle2 className="w-3.5 h-3.5" /> Check In Online
          </Link>
        </div>
        <hr className="border-gray-100 my-4" />
        <div className="text-center space-y-1">
          <p className="text-[11px] text-gray-500">Have questions? We're here to help.</p>
          <p className="text-[11px] text-gray-600 font-medium">📞 {sample.orendaPhone} · ✉️ {sample.orendaEmail}</p>
          <p className="text-[11px]"><a href={sample.orendaWebsite} className="text-purple-600 underline">www.orendapsych.com</a></p>
        </div>
      </EmailContent>
    </LaptopEmailFrame>
  );
}

function ConfirmationSMS() {
  return (
    <PhoneFrame>{`✅ Orenda Psychiatry — Appointment Confirmed

📅 ${sample.appointmentDate}
🕐 ${sample.slotStart} — ${sample.slotEnd}
👨‍⚕️ ${sample.providerName}
📍 ${sample.address}

🔑 Code: ${sample.confirmationCode}

Please arrive 10 min early with ID & insurance card.

🔔 AFTER 5 PM: Ring doorbell on RIGHT side of entrance. Security will let you in.

📍 Directions: maps.google.com/?q=221+River+St+Hoboken+NJ

✅ Check in online: orendapsych.com/patient/book-visit

Questions? Call ${sample.orendaPhone} or visit www.orendapsych.com`}</PhoneFrame>
  );
}

function ReminderEmail() {
  return (
    <LaptopEmailFrame>
      <EmailContent headerLabel="Appointment Tomorrow" headerSub="Don't forget your upcoming visit" gradient="linear-gradient(135deg, hsl(220, 90%, 15%) 0%, hsl(220, 70%, 35%) 50%, hsl(220, 50%, 50%) 100%)">
        <p className="mb-4">Hi <span className="font-semibold text-gray-900">{sample.patientFirstName}</span>,</p>
        <p className="text-[13px] text-gray-600 mb-5 leading-relaxed">This is a friendly reminder that your appointment is <strong>tomorrow</strong>. We look forward to seeing you!</p>
        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-5 mb-5 grid gap-3.5">
          <DetailRow icon={Calendar} label="Date" value={sample.appointmentDate} />
          <DetailRow icon={Clock} label="Time" value={`${sample.slotStart} — ${sample.slotEnd}`} />
          <DetailRow icon={User} label="Provider" value={sample.providerName} />
          <DetailRow icon={MapPin} label="Location" value={sample.address} link={sample.googleMapsHoboken} />
        </div>
        <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/30 p-5 mb-5 text-center">
          <Bell className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="text-base font-bold text-purple-900 mb-1">Remember to Check In Online!</p>
          <p className="text-[12px] text-purple-700 mb-3">Save time at the office by checking in before you arrive.</p>
          <Link to={sample.checkInUrl} className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, hsl(270, 100%, 25%) 0%, hsl(270, 80%, 40%) 100%)", boxShadow: "0 6px 20px -4px hsla(270, 100%, 25%, 0.5)" }}>
            <CheckCircle2 className="w-4 h-4" /> Check In Now
          </Link>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-5">
          <p className="text-[12px] font-semibold text-blue-800 mb-1.5">🏢 Finding the Office</p>
          <ul className="text-[12px] text-blue-700 space-y-1 list-disc pl-4">
            <li>Enter at 221 River Street — look for "Riverfront Center" signage</li>
            <li>Take the elevator to the 9th Floor, Suite 9076</li>
            <li>Look for Wonder Cafe as your landmark</li>
          </ul>
          <a href={sample.googleMapsHoboken} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 underline mt-2">
            <Navigation className="w-3 h-3" /> Open in Google Maps
          </a>
        </div>
        {/* After-Hours Doorbell Alert */}
        <div className="rounded-xl border-2 border-orange-400 p-4 mb-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff7ed, #fffbeb, #fff7ed)' }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-orange-600 mb-1 mt-1">⚠️ After-Hours Access</p>
          <p className="text-[12px] font-bold text-orange-900 mb-0.5">🔔 Ring the Doorbell to Enter</p>
          <p className="text-[12px] text-orange-800 leading-relaxed">Arriving <strong>after 5 PM</strong>? <strong>Ring the doorbell on the right side of the entrance</strong> — security will let you in.</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 mb-5">
          <p className="text-[12px] font-semibold text-amber-800 mb-1.5">📋 Don't Forget</p>
          <ul className="text-[12px] text-amber-700 space-y-1 list-disc pl-4">
            <li>Arrive 10 minutes early</li>
            <li>Bring a valid photo ID and insurance card</li>
            <li>Your confirmation code: <strong>{sample.confirmationCode}</strong></li>
          </ul>
        </div>
        <hr className="border-gray-100 my-4" />
        <div className="text-center space-y-1">
          <p className="text-[11px] text-gray-500">Have questions? We're here to help.</p>
          <p className="text-[11px] text-gray-600 font-medium">📞 {sample.orendaPhone} · ✉️ {sample.orendaEmail}</p>
          <p className="text-[11px]"><a href={sample.orendaWebsite} className="text-purple-600 underline">www.orendapsych.com</a> · <Link to={sample.patientPortalUrl} className="text-purple-600 underline">Patient Portal</Link></p>
        </div>
      </EmailContent>
    </LaptopEmailFrame>
  );
}

function ReminderSMS() {
  return (
    <PhoneFrame>{`⏰ Orenda Psychiatry — Reminder

Your appointment is TOMORROW:

📅 ${sample.appointmentDate}
🕐 ${sample.slotStart} — ${sample.slotEnd}
👨‍⚕️ ${sample.providerName}
📍 221 River St, 9th Fl, Suite 9076, Hoboken

🔑 Code: ${sample.confirmationCode}

✅ CHECK IN ONLINE before you arrive:
orendapsych.com/patient/book-visit

📍 Directions: maps.google.com/?q=221+River+St+Hoboken+NJ

Arrive 10 min early with ID & insurance.

🔔 AFTER 5 PM: Ring doorbell on RIGHT side of entrance. Security will let you in.

Questions? Call ${sample.orendaPhone}
Visit: www.orendapsych.com`}</PhoneFrame>
  );
}

function DayOfEmail() {
  return (
    <LaptopEmailFrame>
      <EmailContent headerLabel="Your Visit Is Today" headerSub="We're ready for you!" gradient="linear-gradient(135deg, hsl(45, 100%, 30%) 0%, hsl(40, 90%, 40%) 50%, hsl(35, 85%, 50%) 100%)">
        <p className="mb-4">Hi <span className="font-semibold text-gray-900">{sample.patientFirstName}</span>,</p>
        <p className="text-[13px] text-gray-600 mb-5 leading-relaxed">Your appointment with <strong>{sample.providerName}</strong> is <strong>today</strong>! We're looking forward to seeing you.</p>
        <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50/50 p-5 mb-5 grid gap-3.5">
          <DetailRow icon={Clock} label="Time" value={`${sample.slotStart} — ${sample.slotEnd}`} />
          <DetailRow icon={User} label="Provider" value={sample.providerName} />
          <DetailRow icon={MapPin} label="Location" value={sample.address} link={sample.googleMapsHoboken} />
        </div>
        <div className="rounded-xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 mb-5 text-center">
          <CheckCircle2 className="w-10 h-10 text-purple-600 mx-auto mb-3" />
          <p className="text-lg font-bold text-purple-900 mb-1">Check In When You Arrive</p>
          <p className="text-[12px] text-purple-700 mb-4">Please check in as soon as you arrive at the office so your provider knows you're here.</p>
          <Link to={sample.checkInUrl} className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, hsl(270, 100%, 25%) 0%, hsl(270, 80%, 40%) 100%)", boxShadow: "0 6px 20px -4px hsla(270, 100%, 25%, 0.5)" }}>
            <CheckCircle2 className="w-4 h-4" /> Check In Now
          </Link>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-5">
          <p className="text-[12px] font-semibold text-blue-800 mb-1.5">📍 Office Directions</p>
          <p className="text-[12px] text-blue-700 mb-2">221 River Street, 9th Floor, Suite 9076, Hoboken, NJ. Look for "Riverfront Center" signage and Wonder Cafe as your landmark.</p>
          <a href={sample.googleMapsHoboken} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 underline">
            <Navigation className="w-3 h-3" /> Open in Google Maps
          </a>
        </div>
        {/* After-Hours Doorbell Alert */}
        <div className="rounded-xl border-2 border-orange-400 p-4 mb-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff7ed, #fffbeb, #fff7ed)' }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-orange-600 mb-1 mt-1">⚠️ After-Hours Access</p>
          <p className="text-[12px] font-bold text-orange-900 mb-0.5">🔔 Ring the Doorbell to Enter</p>
          <p className="text-[12px] text-orange-800 leading-relaxed">Arriving <strong>after 5 PM</strong>? <strong>Ring the doorbell on the right side of the entrance</strong> — security will let you in.</p>
        </div>
        <hr className="border-gray-100 my-4" />
        <div className="text-center space-y-1">
          <p className="text-[11px] text-gray-500">Have questions? Visit our Patient Portal or contact us.</p>
          <p className="text-[11px] text-gray-600 font-medium">📞 {sample.orendaPhone} · ✉️ {sample.orendaEmail}</p>
          <p className="text-[11px]"><Link to={sample.patientPortalUrl} className="text-purple-600 underline">Patient Portal</Link> · <a href={sample.orendaWebsite} className="text-purple-600 underline">www.orendapsych.com</a></p>
        </div>
      </EmailContent>
    </LaptopEmailFrame>
  );
}

function DayOfSMS() {
  return (
    <PhoneFrame>{`🏥 Orenda Psychiatry — Today's Visit

Hi ${sample.patientFirstName}! Your appointment is TODAY:

🕐 ${sample.slotStart} — ${sample.slotEnd}
👨‍⚕️ ${sample.providerName}
📍 221 River St, 9th Fl, Suite 9076, Hoboken

📍 Directions: maps.google.com/?q=221+River+St+Hoboken+NJ

🔔 AFTER 5 PM: Ring doorbell on RIGHT side of entrance. Security will let you in.

✅ PLEASE CHECK IN when you arrive at the office:
orendapsych.com/patient/book-visit

Questions? Call ${sample.orendaPhone}
Patient Portal: orendapsych.com/portal`}</PhoneFrame>
  );
}

function FollowUpEmail() {
  return (
    <LaptopEmailFrame>
      <EmailContent headerLabel="Schedule Your Follow-Up" headerSub="Continue your care journey" gradient="linear-gradient(135deg, hsl(160, 70%, 15%) 0%, hsl(160, 55%, 30%) 50%, hsl(160, 45%, 45%) 100%)">
        <p className="mb-4">Hi <span className="font-semibold text-gray-900">{sample.patientFirstName}</span>,</p>
        <p className="text-[13px] text-gray-600 mb-5 leading-relaxed">Thank you for visiting us! To keep your treatment plan on track, please schedule your next follow-up appointment with <strong>{sample.providerName}</strong>.</p>
        <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-5 mb-5">
          <p className="text-[13px] font-bold text-emerald-900 mb-2">📞 To Schedule Your Follow-Up:</p>
          <p className="text-[12px] text-emerald-700 leading-relaxed mb-3">Please call our office or send us an email to book your next appointment with {sample.providerName}.</p>
          <div className="grid gap-2 bg-white/60 rounded-lg p-3 border border-emerald-100">
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[13px] font-semibold text-gray-900">{sample.orendaPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[13px] font-semibold text-gray-900">{sample.orendaEmail}</span>
            </div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50/30 p-5 mb-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-900 mb-1">90-Day In-Person Visit Requirement</p>
              <p className="text-[12px] text-amber-800 leading-relaxed mb-2">Per Orenda Psychiatry policy, patients are required to be seen <strong>in person every 90 days</strong>. Your next in-person visit must be scheduled on or before:</p>
              <p className="text-xl font-bold text-amber-900">{sample.inPersonDate}</p>
              <p className="text-[11px] text-amber-700 mt-1">(90 days from your visit on {sample.appointmentDate})</p>
            </div>
          </div>
        </div>
        <hr className="border-gray-100 my-4" />
        <div className="text-center space-y-1">
          <p className="text-[11px] text-gray-500">Have questions? We're here to help.</p>
          <p className="text-[11px] text-gray-600 font-medium">📞 {sample.orendaPhone} · ✉️ {sample.orendaEmail}</p>
          <p className="text-[11px]"><a href={sample.orendaWebsite} className="text-purple-600 underline">www.orendapsych.com</a> · <Link to={sample.patientPortalUrl} className="text-purple-600 underline">Patient Portal</Link></p>
        </div>
      </EmailContent>
    </LaptopEmailFrame>
  );
}

function FollowUpSMS() {
  return (
    <PhoneFrame>{`💚 Orenda Psychiatry — Follow-Up Reminder

Hi ${sample.patientFirstName}, thank you for your visit with ${sample.providerName}!

📞 Please schedule your follow-up appointment:
Call: ${sample.orendaPhone}
Email: ${sample.orendaEmail}

⚠️ IMPORTANT: In-person visits are required every 90 days. Your next in-person visit is due by ${sample.inPersonDate}.

Questions? Visit www.orendapsych.com`}</PhoneFrame>
  );
}

function InPersonReminderEmail() {
  return (
    <LaptopEmailFrame>
      <EmailContent headerLabel="In-Person Visit Due" headerSub="Your 90-day in-person visit is approaching" gradient="linear-gradient(135deg, hsl(0, 70%, 25%) 0%, hsl(0, 60%, 38%) 50%, hsl(0, 50%, 48%) 100%)">
        <p className="mb-4">Hi <span className="font-semibold text-gray-900">{sample.patientFirstName}</span>,</p>
        <p className="text-[13px] text-gray-600 mb-5 leading-relaxed">This is a reminder that your <strong>90-day in-person visit</strong> is coming up. Per Orenda Psychiatry policy, all patients must be seen in person at least once every 90 days to continue care.</p>
        <div className="rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50/30 p-5 mb-5 text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-lg font-bold text-red-900 mb-1">In-Person Visit Required</p>
          <p className="text-[12px] text-red-700 mb-2">Please schedule your visit on or before:</p>
          <p className="text-2xl font-bold text-red-900">{sample.inPersonDate}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 mb-5">
          <p className="text-[13px] font-bold text-gray-900 mb-2">📞 Contact Us to Schedule:</p>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[13px] font-semibold text-gray-900">{sample.orendaPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[13px] font-semibold text-gray-900">{sample.orendaEmail}</span>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 mb-5">
          <p className="text-[12px] font-semibold text-blue-800 mb-1.5">📍 Office Locations</p>
          <div className="space-y-2 text-[12px] text-blue-700">
            <div>
              <p className="font-semibold">Hoboken:</p>
              <p>{sample.address}</p>
              <a href={sample.googleMapsHoboken} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-[11px]">Get Directions →</a>
            </div>
            <div>
              <p className="font-semibold">Edison:</p>
              <p>{sample.edisonAddress}</p>
              <a href={sample.googleMapsEdison} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-[11px]">Get Directions →</a>
            </div>
          </div>
        </div>
        <hr className="border-gray-100 my-4" />
        <div className="text-center space-y-1">
          <p className="text-[11px] text-gray-500">Have questions? We're here to help.</p>
          <p className="text-[11px] text-gray-600 font-medium">📞 {sample.orendaPhone} · ✉️ {sample.orendaEmail}</p>
          <p className="text-[11px]"><a href={sample.orendaWebsite} className="text-purple-600 underline">www.orendapsych.com</a> · <Link to={sample.patientPortalUrl} className="text-purple-600 underline">Patient Portal</Link></p>
        </div>
      </EmailContent>
    </LaptopEmailFrame>
  );
}

function InPersonReminderSMS() {
  return (
    <PhoneFrame>{`🔴 Orenda Psychiatry — In-Person Visit Required

Hi ${sample.patientFirstName}, your 90-day in-person visit is due by ${sample.inPersonDate}.

Per Orenda policy, all patients must be seen in person every 90 days to continue care.

📞 Call to schedule: ${sample.orendaPhone}
✉️ Email: ${sample.orendaEmail}

📍 Hoboken: 221 River St, 9th Fl
📍 Edison: 110 Fieldcrest Ave, 3rd Fl

Visit: www.orendapsych.com`}</PhoneFrame>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function NJPatientCommunicationExamples() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(270, 100%, 12%) 0%, hsl(270, 70%, 22%) 40%, hsl(270, 50%, 35%) 100%)" }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="comm-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#comm-dots)" />
        </svg>
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          <button onClick={() => navigate("/patient/book-visit")} className="inline-flex items-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-wider hover:text-white/70 transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Patient Portal
          </button>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Orenda" className="h-6 brightness-0 invert opacity-70" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Patient Communication Examples
          </h1>
          <p className="text-sm sm:text-base text-white/50 mt-3 max-w-2xl font-medium leading-relaxed">
            See exactly what patients receive at every step of their care journey — from booking confirmation to follow-up reminders. Each communication is shown as both an email and text message.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* 1 — Appointment Confirmation */}
        <CommunicationSection
          title="Appointment Confirmation"
          subtitle="Sent immediately after a patient books their appointment with all visit details and next steps."
          timing="Sent Immediately After Booking"
          icon={CheckCircle2}
          gradient="linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 35%) 50%, hsl(270, 60%, 50%) 100%)"
          color="hsl(270, 100%, 25%)"
        >
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Version</p>
            <ConfirmationEmail />
          </motion.div>
          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Text Message</p>
            <ConfirmationSMS />
          </motion.div>
        </CommunicationSection>

        {/* 2 — Appointment Reminder */}
        <CommunicationSection
          title="Appointment Reminder"
          subtitle="Sent 24 hours before the appointment with directions, check-in link, and a reminder to arrive prepared."
          timing="Sent 24 Hours Before Visit"
          icon={Bell}
          gradient="linear-gradient(135deg, hsl(220, 90%, 15%) 0%, hsl(220, 70%, 35%) 50%, hsl(220, 50%, 50%) 100%)"
          color="hsl(220, 90%, 30%)"
        >
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Version</p>
            <ReminderEmail />
          </motion.div>
          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Text Message</p>
            <ReminderSMS />
          </motion.div>
        </CommunicationSection>

        {/* 3 — Day of Visit */}
        <CommunicationSection
          title="Day of Visit"
          subtitle="Sent the morning of the appointment reminding patients to check in when they arrive at the office."
          timing="Sent Morning of Appointment"
          icon={Navigation}
          gradient="linear-gradient(135deg, hsl(45, 100%, 30%) 0%, hsl(40, 90%, 40%) 50%, hsl(35, 85%, 50%) 100%)"
          color="hsl(45, 100%, 35%)"
        >
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Version</p>
            <DayOfEmail />
          </motion.div>
          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Text Message</p>
            <DayOfSMS />
          </motion.div>
        </CommunicationSection>

        {/* 4 — Follow-Up Reminder */}
        <CommunicationSection
          title="Follow-Up Reminder"
          subtitle="Sent 24 hours after the appointment encouraging patients to schedule their next follow-up with their provider."
          timing="Sent 24 Hours After Visit"
          icon={Repeat}
          gradient="linear-gradient(135deg, hsl(160, 70%, 15%) 0%, hsl(160, 55%, 30%) 50%, hsl(160, 45%, 45%) 100%)"
          color="hsl(160, 70%, 25%)"
        >
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Version</p>
            <FollowUpEmail />
          </motion.div>
          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Text Message</p>
            <FollowUpSMS />
          </motion.div>
        </CommunicationSection>

        {/* 5 — 90-Day In-Person Reminder */}
        <CommunicationSection
          title="90-Day In-Person Visit Reminder"
          subtitle="Sent as the 90-day in-person requirement approaches, reminding patients to schedule their required office visit."
          timing="Sent 14 Days Before Due Date"
          icon={AlertTriangle}
          gradient="linear-gradient(135deg, hsl(0, 70%, 25%) 0%, hsl(0, 60%, 38%) 50%, hsl(0, 50%, 48%) 100%)"
          color="hsl(0, 70%, 40%)"
        >
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Version</p>
            <InPersonReminderEmail />
          </motion.div>
          <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Text Message</p>
            <InPersonReminderSMS />
          </motion.div>
        </CommunicationSection>
      </div>
    </div>
  );
}
