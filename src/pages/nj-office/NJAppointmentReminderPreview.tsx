import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, Calendar, Clock, MapPin, User, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const sampleAppointment = {
  patientFirstName: "Sarah",
  patientLastName: "Johnson",
  providerName: "Dr. Emily Chen",
  appointmentDate: "Monday, March 16, 2026",
  slotStart: "10:00 AM",
  slotEnd: "10:30 AM",
  location: "Hoboken, NJ",
  address: "77 River St, Suite 302, Hoboken, NJ 07030",
  confirmationCode: "ORN-A3F8B2",
  patientEmail: "sarah.johnson@email.com",
  patientPhone: "(201) 555-0142",
};

export function EmailPreview() {
  return (
    <div className="w-full max-w-[600px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border/50">
      {/* Email Header */}
      <div
        className="px-8 py-10 text-center"
        style={{
          background: "linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 35%) 50%, hsl(270, 60%, 50%) 100%)",
        }}
      >
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
          <Calendar className="w-3.5 h-3.5 text-white/90" />
          <span className="text-[11px] font-medium tracking-widest uppercase text-white/90">Appointment Confirmed</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
          Orenda Psychiatry
        </h1>
        <p className="text-white/70 text-sm">Your upcoming visit details</p>
      </div>

      {/* Email Body */}
      <div className="bg-white px-8 py-8">
        <p className="text-[15px] text-gray-700 mb-6">
          Hi <span className="font-semibold text-gray-900">{sampleAppointment.patientFirstName}</span>,
        </p>
        <p className="text-[14px] text-gray-600 mb-6 leading-relaxed">
          Your appointment has been confirmed. Here are your visit details — please save this for your records.
        </p>

        {/* Appointment Card */}
        <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/80 to-white p-6 mb-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 mb-0.5">Date</p>
                <p className="text-[15px] font-semibold text-gray-900">{sampleAppointment.appointmentDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 mb-0.5">Time</p>
                <p className="text-[15px] font-semibold text-gray-900">{sampleAppointment.slotStart} — {sampleAppointment.slotEnd}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 mb-0.5">Provider</p>
                <p className="text-[15px] font-semibold text-gray-900">{sampleAppointment.providerName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-purple-700" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 mb-0.5">Location</p>
                <p className="text-[15px] font-semibold text-gray-900">{sampleAppointment.location}</p>
                <p className="text-[13px] text-gray-500">{sampleAppointment.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Code */}
        <div className="text-center py-4 px-6 rounded-xl bg-gray-50 border border-gray-100 mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Confirmation Code</p>
          <p className="text-2xl font-bold tracking-wider" style={{ color: "hsl(270, 100%, 25%)" }}>
            {sampleAppointment.confirmationCode}
          </p>
        </div>

        {/* Reminders */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-5 mb-6">
          <p className="text-[13px] font-semibold text-amber-800 mb-2">📋 Before Your Visit</p>
          <ul className="text-[13px] text-amber-700 space-y-1.5 list-disc pl-5">
            <li>Please arrive 10 minutes early</li>
            <li>Bring a valid photo ID and insurance card</li>
            <li>Complete any intake forms sent separately</li>
          </ul>
        </div>

        {/* Check-in CTA */}
        <div className="text-center mb-6">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold text-sm transition-all"
            style={{
              background: "linear-gradient(135deg, hsl(270, 100%, 25%) 0%, hsl(270, 80%, 40%) 100%)",
              boxShadow: "0 4px 20px -4px hsla(270, 100%, 25%, 0.4)",
            }}
          >
            Check In Online
          </a>
        </div>

        <hr className="border-gray-100 mb-5" />

        <p className="text-[12px] text-gray-400 text-center leading-relaxed">
          Need to reschedule? Call us at <span className="text-gray-600">(201) 484-4040</span><br />
          Orenda Psychiatry — New Jersey Offices
        </p>
      </div>

      {/* Email Footer */}
      <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
        <p className="text-[11px] text-gray-400 text-center">
          © 2026 Orenda Psychiatry. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export function SMSPreview() {
  const smsText = `✅ Orenda Psychiatry — Appointment Confirmed

📅 ${sampleAppointment.appointmentDate}
🕐 ${sampleAppointment.slotStart} — ${sampleAppointment.slotEnd}
👩‍⚕️ ${sampleAppointment.providerName}
📍 ${sampleAppointment.location}

🔑 Code: ${sampleAppointment.confirmationCode}

Please arrive 10 min early with ID & insurance card.

Check in online: orenda-njoffice-guide.lovable.app/nj-office/check-in

To reschedule, call (201) 484-4040`;

  return (
    <div className="w-full max-w-[380px] mx-auto">
      {/* Phone Frame */}
      <div className="rounded-[2.5rem] bg-gray-900 p-3 shadow-2xl">
        {/* Notch */}
        <div className="flex justify-center mb-2">
          <div className="w-28 h-6 bg-gray-900 rounded-full" />
        </div>
        {/* Screen */}
        <div className="rounded-[2rem] bg-gray-100 overflow-hidden">
          {/* Status Bar */}
          <div className="bg-gray-200 px-6 py-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-600">9:41</span>
            <span className="text-[11px] text-gray-500">📶 🔋</span>
          </div>
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "hsl(270, 100%, 25%)" }}>
              OP
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Orenda Psychiatry</p>
              <p className="text-[11px] text-gray-400">SMS</p>
            </div>
          </div>
          {/* Message Bubble */}
          <div className="p-4 min-h-[400px]">
            <div className="flex justify-start mb-2">
              <div className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 bg-gray-200">
                <p className="text-[13px] text-gray-900 whitespace-pre-line leading-relaxed">
                  {smsText}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 ml-2 mt-1">Just now</p>
          </div>
          {/* Input Bar */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
              <span className="text-[13px] text-gray-400">iMessage</span>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "hsl(270, 100%, 25%)" }}>
              <Send className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NJAppointmentReminderPreview() {
  const [activeTab, setActiveTab] = useState<"email" | "sms">("email");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin-dashboard")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                Appointment Reminder Preview
              </h1>
              <p className="text-xs text-muted-foreground">Preview what patients receive when booked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-border/50 w-fit mx-auto">
          <button
            onClick={() => setActiveTab("email")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "email"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={() => setActiveTab("sms")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "sms"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            SMS
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="py-6"
        >
          {activeTab === "email" ? <EmailPreview /> : <SMSPreview />}
        </motion.div>

        {/* Setup Notice */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-[600px] mx-auto mt-8"
        >
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold text-amber-800 mb-2">⚡ Setup Required</p>
            <p className="text-[13px] text-amber-700 leading-relaxed mb-3">
              To send these automatically when patients book appointments, two services need to be connected:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[13px]">
                <Mail className="w-4 h-4 text-amber-600" />
                <span className="text-amber-800"><strong>Email Domain</strong> — for branded confirmation emails</span>
              </div>
              <div className="flex items-center gap-2 text-[13px]">
                <Phone className="w-4 h-4 text-amber-600" />
                <span className="text-amber-800"><strong>Twilio</strong> — for SMS text message reminders</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
