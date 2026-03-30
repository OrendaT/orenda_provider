import { useState, useRef, useCallback, createContext, useContext } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Calendar, Clock, MapPin, User, Send, Bell, CheckCircle2, Repeat, Navigation, Phone as PhoneIcon, Globe, AlertTriangle, FileText, Copy, Check, Download, Building2 } from "lucide-react";
import html2canvas from "html2canvas";
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

type OfficeLocation = "hoboken" | "edison";
const LocationContext = createContext<OfficeLocation>("hoboken");

const officeData = {
  hoboken: {
    label: "Hoboken",
    address: "221 River St, 9th Floor, Suite 9076, Hoboken, NJ 07030",
    shortAddress: "221 River St, 9th Fl, Suite 9076, Hoboken",
    googleMaps: "https://maps.google.com/?q=221+River+St+Hoboken+NJ+07030",
    directions: "Enter the building at 221 River Street. We're located right next to Wonder. Take the elevator to the 9th Floor, Suite 9076.",
    directionsShort: "221 River St → 9th Floor → Suite 9076 (next to Wonder)",
    mapsShort: "maps.google.com/?q=221+River+St+Hoboken+NJ",
  },
  edison: {
    label: "Edison",
    address: "110 Fieldcrest Ave, 3rd Floor, Unit 328, Edison, NJ 08837",
    shortAddress: "110 Fieldcrest Ave, 3rd Fl, Unit 328, Edison",
    googleMaps: "https://maps.google.com/?q=110+Fieldcrest+Ave+Edison+NJ+08837",
    directions: "Enter the building at 110 Fieldcrest Avenue. Take the elevator to the 3rd Floor, Unit 328.",
    directionsShort: "110 Fieldcrest Ave → 3rd Floor → Unit 328",
    mapsShort: "maps.google.com/?q=110+Fieldcrest+Ave+Edison+NJ",
  },
};

const baseInfo = {
  patientName: "(Patient Name)",
  providerName: "(Provider Name)",
  appointmentDate: "Monday, March 16, 2026",
  slotStart: "10:00 AM",
  slotEnd: "10:30 AM",
  followUpDate: "Sunday, June 14, 2026",
  inPersonDate: "Monday, June 15, 2026",
  phone: "(347) 707-7735",
  email: "admin@orendapsych.com",
  website: "https://www.orendapsych.com",
  checkInUrl: "/patient/arrival-guide?form=true",
  officeInfoUrl: "/patient/arrival-guide",
  hobokenAddress: "221 River St, 9th Floor, Suite 9076, Hoboken, NJ 07030",
  edisonAddress: "110 Fieldcrest Ave, 3rd Floor, Unit 328, Edison, NJ 08837",
  googleMapsHoboken: "https://maps.google.com/?q=221+River+St+Hoboken+NJ+07030",
  googleMapsEdison: "https://maps.google.com/?q=110+Fieldcrest+Ave+Edison+NJ+08837",
};

// Default info for backward compat — location-specific templates override address/directions
const info = {
  ...baseInfo,
  location: "Hoboken, NJ",
  address: baseInfo.hobokenAddress,
  edisonAddress: baseInfo.edisonAddress,
  googleMapsHoboken: baseInfo.googleMapsHoboken,
  googleMapsEdison: baseInfo.googleMapsEdison,
};

function getInfoForLocation(loc: OfficeLocation) {
  const od = officeData[loc];
  return {
    ...baseInfo,
    location: od.label + ", NJ",
    address: od.address,
    shortAddress: od.shortAddress,
    googleMaps: od.googleMaps,
    directions: od.directions,
    directionsShort: od.directionsShort,
    mapsShort: od.mapsShort,
    edisonAddress: baseInfo.edisonAddress,
    googleMapsHoboken: baseInfo.googleMapsHoboken,
    googleMapsEdison: baseInfo.googleMapsEdison,
  };
}


const purpleGradient = "linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 35%) 50%, hsl(270, 60%, 50%) 100%)";
const purpleColor = "hsl(270, 100%, 25%)";

/* ─── Copy HTML Button ─── */
function CopyHtmlButton({ htmlGenerator, label }: { htmlGenerator: () => string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    const html = htmlGenerator();
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([html], { type: "text/plain" }),
        }),
      ]);
    } catch {
      await navigator.clipboard.writeText(html);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
      style={{
        background: copied ? "hsl(150, 60%, 95%)" : "hsl(270, 40%, 96%)",
        borderColor: copied ? "hsl(150, 50%, 70%)" : "hsl(270, 30%, 85%)",
        color: copied ? "hsl(150, 60%, 30%)" : "hsl(270, 60%, 40%)",
      }}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

/* ─── Copy Text Button (for SMS) ─── */
function CopyTextButton({ textGenerator }: { textGenerator: () => string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(textGenerator());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
      style={{
        background: copied ? "hsl(150, 60%, 95%)" : "hsl(270, 40%, 96%)",
        borderColor: copied ? "hsl(150, 50%, 70%)" : "hsl(270, 30%, 85%)",
        color: copied ? "hsl(150, 60%, 30%)" : "hsl(270, 60%, 40%)",
      }}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy Text"}
    </button>
  );
}

/* ─── Email HTML Generators (inline styles for email clients) ─── */
const publishedBase = "https://orenda-njoffice-guide.lovable.app";
const checkInFullUrl = `${publishedBase}/patient/arrival-guide?form=true`;
const officeInfoFullUrl = `${publishedBase}/patient/arrival-guide`;

function emailWrap(headerLabel: string, headerSub: string, bodyContent: string) {
  return `<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, hsl(270,100%,20%) 0%, hsl(270,80%,35%) 50%, hsl(270,60%,50%) 100%); padding: 32px 24px; text-align: center;">
    <div style="display: inline-block; background: rgba(255,255,255,0.1); border-radius: 20px; padding: 4px 12px; margin-bottom: 12px; font-size: 10px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.9);">${headerLabel}</div>
    <h2 style="font-size: 20px; font-weight: 700; color: white; margin: 0;">Orenda Psychiatry</h2>
    <p style="font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 4px;">${headerSub}</p>
  </div>
  <div style="background: white; padding: 32px; font-size: 16px; color: #374151; line-height: 1.6;">
    ${bodyContent}
  </div>
  <div style="background: #f9fafb; padding: 20px 32px; border-top: 1px solid #f3f4f6; text-align: center;">
    <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Orenda Admin Team · ${info.phone} · ${info.email}</p>
    <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;"><a href="${info.website}" style="color: #7e22ce; text-decoration: underline;">www.orendapsych.com</a></p>
    <p style="font-size: 12px; color: #d1d5db; margin: 0;">© 2026 Orenda Psychiatry. All rights reserved.</p>
  </div>
</div>`;
}

function detailRowHtml(label: string, value: string, link?: string) {
  const val = link ? `<a href="${link}" style="color: #7e22ce; text-decoration: underline;">${value}</a>` : value;
  return `<div style="margin-bottom: 12px;"><p style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #a855f7; margin: 0 0 2px 0;">${label}</p><p style="font-size: 16px; font-weight: 600; color: #111827; margin: 0;">${val}</p></div>`;
}

function checkInHtml(prominent = false) {
  if (prominent) return `<div style="border: 2px solid #c4b5fd; background: linear-gradient(to bottom right, #ede9fe, #f5f3ff); border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;"><p style="font-size: 16px; font-weight: 700; color: #3b0764; margin: 0 0 12px 0;">Please check in here when you arrive for your appointment.</p><a href="${checkInFullUrl}" style="display: inline-block; background: linear-gradient(135deg, hsl(270,100%,20%), hsl(270,80%,40%)); color: white; font-size: 16px; font-weight: 700; padding: 12px 24px; border-radius: 8px; text-decoration: none;">✅ Check-In Form</a></div>`;
  return `<div style="border: 1px solid #c4b5fd; background: #faf5ff; border-radius: 8px; padding: 16px; margin-bottom: 20px;"><p style="font-size: 14px; color: #3b0764; margin: 0;">Please check in here when you arrive: <a href="${checkInFullUrl}" style="color: #7e22ce; text-decoration: underline; font-weight: 600;">Check-In Form →</a></p></div>`;
}

function afterHoursDoorbellHtml() {
  return `<div style="border: 2px solid #f97316; background: linear-gradient(135deg, #fff7ed, #fffbeb, #fff7ed); border-radius: 12px; padding: 20px; margin-bottom: 20px; position: relative; overflow: hidden;"><div style="height: 4px; background: linear-gradient(to right, #f97316, #fbbf24, #f97316); position: absolute; top: 0; left: 0; right: 0;"></div><p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #ea580c; margin: 4px 0 8px 0;">⚠️ Important — After-Hours Access</p><p style="font-size: 16px; font-weight: 700; color: #9a3412; margin: 0 0 8px 0;">🔔 Ring the Doorbell to Enter</p><p style="font-size: 14px; color: #9a3412; line-height: 1.6; margin: 0;">If you are arriving <strong>after 5:00 PM</strong>, the main entrance will be locked. To enter the building, <strong>ring the doorbell located on the right-hand side of the building entrance</strong>. This will alert the ground floor security team to let you in.</p></div>`;
}

function directionsHtml(loc: OfficeLocation = "hoboken") {
  const od = officeData[loc];
  return `<div style="border: 1px solid #e9d5ff; background: #faf5ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;"><p style="font-size: 14px; font-weight: 600; color: #3b0764; margin: 0 0 8px 0;">📍 Getting There</p><p style="font-size: 14px; color: #581c87; line-height: 1.6; margin: 0 0 8px 0;">${od.directions}</p><p style="margin: 4px 0;"><a href="${od.googleMaps}" style="color: #7e22ce; text-decoration: underline; font-size: 14px; font-weight: 600;">📍 Open in Google Maps</a></p><p style="margin: 4px 0;"><a href="${officeInfoFullUrl}" style="color: #7e22ce; text-decoration: underline; font-size: 14px; font-weight: 600;">ℹ️ Additional office arrival info →</a></p></div>`;
}

function contactHtml() {
  return `<hr style="border: none; border-top: 1px solid #f3f4f6; margin: 20px 0;" /><div style="text-align: center;"><p style="font-size: 14px; color: #6b7280; margin: 0 0 4px 0;">Have questions? We're here to help.</p><p style="font-size: 14px; color: #4b5563; font-weight: 500; margin: 0 0 4px 0;">📞 ${info.phone} · ✉️ ${info.email}</p><p style="font-size: 14px; margin: 0;"><a href="${info.website}" style="color: #7e22ce; text-decoration: underline;">www.orendapsych.com</a></p></div>`;
}

const scheduleIICopy = `patients receiving Schedule II prescriptions in the state of New Jersey are required to be seen at least every 90 days for in-person checkups`;

const generateConfirmationHtml = (loc: OfficeLocation = "hoboken") => { const li = getInfoForLocation(loc); return emailWrap("Appointment Confirmed", "Your upcoming visit details",
  `<p style="margin: 0 0 16px 0;">Hi <strong>${info.patientName}</strong>,</p>
  <p style="margin: 0 0 16px 0;">Your appointment has been confirmed! Here are your visit details — please save this for your records.</p>
  ${checkInHtml()}
  <div style="border: 1px solid #e9d5ff; background: linear-gradient(to bottom right, #faf5ff, white); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    ${detailRowHtml("Date", info.appointmentDate)}
    ${detailRowHtml("Time", `${info.slotStart} — ${info.slotEnd}`)}
    ${detailRowHtml("Provider", info.providerName)}
    ${detailRowHtml("Location", li.address, li.googleMaps)}
  </div>
  <div style="border: 1px solid #e9d5ff; background: #faf5ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;"><p style="font-size: 14px; font-weight: 600; color: #3b0764; margin: 0 0 8px 0;">📋 Before Your Visit</p><p style="font-size: 14px; color: #581c87; margin: 0;">• <strong>Please arrive 15 minutes before your appointment</strong></p></div>
  ${directionsHtml(loc)}${afterHoursDoorbellHtml()}${contactHtml()}`); };

const generateReminderHtml = (loc: OfficeLocation = "hoboken") => { const li = getInfoForLocation(loc); return emailWrap("Appointment Tomorrow", "Don't forget your upcoming visit",
  `<p style="margin: 0 0 16px 0;">Hi <strong>${info.patientName}</strong>,</p>
  <p style="margin: 0 0 16px 0;">This is a friendly reminder that your appointment is <strong>tomorrow</strong>. We look forward to seeing you!</p>
  ${checkInHtml(true)}
  <div style="border: 1px solid #e9d5ff; background: linear-gradient(to bottom right, #faf5ff, white); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    ${detailRowHtml("Date", info.appointmentDate)}
    ${detailRowHtml("Time", `${info.slotStart} — ${info.slotEnd}`)}
    ${detailRowHtml("Provider", info.providerName)}
    ${detailRowHtml("Location", li.address, li.googleMaps)}
  </div>
  ${directionsHtml(loc)}${afterHoursDoorbellHtml()}
  <div style="border: 1px solid #e9d5ff; background: #faf5ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;"><p style="font-size: 14px; font-weight: 600; color: #3b0764; margin: 0 0 8px 0;">📋 Don't Forget</p><p style="font-size: 14px; color: #581c87; margin: 0;">• <strong>Please arrive 15 minutes early</strong></p></div>
  ${contactHtml()}`); };

const generateDayOfHtml = (loc: OfficeLocation = "hoboken") => { const li = getInfoForLocation(loc); return emailWrap("Your Visit Is Today", "We're ready for you!",
  `<p style="margin: 0 0 16px 0;">Hi <strong>${info.patientName}</strong>,</p>
  <p style="margin: 0 0 16px 0;">Your appointment with <strong>${info.providerName}</strong> is <strong>today</strong>! We're looking forward to seeing you.</p>
  ${checkInHtml(true)}
  <div style="border: 1px solid #e9d5ff; background: linear-gradient(to bottom right, #faf5ff, white); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    ${detailRowHtml("Time", `${info.slotStart} — ${info.slotEnd}`)}
    ${detailRowHtml("Provider", info.providerName)}
    ${detailRowHtml("Location", li.address, li.googleMaps)}
  </div>
  ${directionsHtml(loc)}${afterHoursDoorbellHtml()}
  <div style="border: 1px solid #e9d5ff; background: #faf5ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;"><p style="font-size: 14px; font-weight: 600; color: #3b0764; margin: 0 0 8px 0;">📋 Reminders</p><p style="font-size: 14px; color: #581c87; margin: 0;">• <strong>Please arrive 15 minutes early</strong></p></div>
  ${contactHtml()}`); };

const generateFollowUpHtml = () => emailWrap("Schedule Your Follow-Up", "Continue your care journey",
  `<p style="margin: 0 0 16px 0;">Hi <strong>${info.patientName}</strong>,</p>
  <p style="margin: 0 0 20px 0;">Thank you for visiting us! Please schedule your next follow-up with <strong>${info.providerName}</strong>.</p>
  <div style="border: 1px solid #e9d5ff; background: linear-gradient(to bottom right, #faf5ff, white); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    <p style="font-size: 16px; font-weight: 700; color: #3b0764; margin: 0 0 8px 0;">📞 To Schedule Your Follow-Up:</p>
    <p style="font-size: 14px; color: #581c87; margin: 0 0 12px 0;">Please call our office or send us an email to book your next appointment.</p>
    <p style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 4px 0;">📞 ${info.phone}</p>
    <p style="font-size: 16px; font-weight: 600; color: #111827; margin: 0;">✉️ ${info.email}</p>
  </div>
  <div style="border: 2px solid #c4b5fd; background: linear-gradient(to bottom right, #f5f3ff, #ede9fe); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    <p style="font-size: 16px; font-weight: 700; color: #3b0764; margin: 0 0 4px 0;">⚠️ 90-Day In-Person Visit Requirement</p>
    <p style="font-size: 14px; color: #581c87; line-height: 1.6; margin: 0 0 8px 0;">Please note that 90 days after your visit on <strong>${info.appointmentDate}</strong>, we require that ${scheduleIICopy}. Please reach out to us to schedule your next in-person visit on or before:</p>
    <p style="font-size: 20px; font-weight: 700; color: #3b0764; margin: 0 0 4px 0;">${info.inPersonDate}</p>
    <p style="font-size: 14px; color: #6d28d9; margin: 0;">(90 days from your visit on ${info.appointmentDate})</p>
  </div>
  ${contactHtml()}`);

const generateInPersonReminderHtml = () => emailWrap("In-Person Visit Due", "Your 90-day in-person visit is approaching",
  `<p style="margin: 0 0 16px 0;">Hi <strong>${info.patientName}</strong>,</p>
  <p style="margin: 0 0 20px 0;">Please schedule your next follow-up with <strong>${info.providerName}</strong>. Please note that 90 days after your last visit on <strong>${info.appointmentDate}</strong>, we require that ${scheduleIICopy}.</p>
  <div style="border: 2px solid #c4b5fd; background: linear-gradient(to bottom right, #f5f3ff, #ede9fe); border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
    <p style="font-size: 18px; font-weight: 700; color: #3b0764; margin: 0 0 4px 0;">⚠️ In-Person Visit Required</p>
    <p style="font-size: 14px; color: #6d28d9; margin: 0 0 8px 0;">Please reach out to us to schedule your visit on or before:</p>
    <p style="font-size: 24px; font-weight: 700; color: #3b0764; margin: 0;">${info.inPersonDate}</p>
  </div>
  <div style="border: 1px solid #e9d5ff; background: #faf5ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    <p style="font-size: 14px; font-weight: 600; color: #3b0764; margin: 0 0 8px 0;">📞 Contact Us to Schedule:</p>
    <p style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 4px 0;">📞 ${info.phone}</p>
    <p style="font-size: 16px; font-weight: 600; color: #111827; margin: 0;">✉️ ${info.email}</p>
  </div>
  <div style="border: 1px solid #e9d5ff; background: #faf5ff; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
    <p style="font-size: 14px; font-weight: 600; color: #3b0764; margin: 0 0 8px 0;">📍 Office Locations</p>
    <p style="font-size: 14px; color: #581c87; margin: 0;"><strong>Hoboken:</strong> ${info.hobokenAddress}</p>
    <p style="margin: 4px 0;"><a href="${info.googleMapsHoboken}" style="color: #7e22ce; text-decoration: underline; font-size: 14px;">Get Directions →</a></p>
    <p style="font-size: 14px; color: #581c87; margin: 12px 0 0 0;"><strong>Edison:</strong> ${info.edisonAddress}</p>
    <p style="margin: 4px 0;"><a href="${info.googleMapsEdison}" style="color: #7e22ce; text-decoration: underline; font-size: 14px;">Get Directions →</a></p>
    <p style="margin: 8px 0 0 0;"><a href="${officeInfoFullUrl}" style="color: #7e22ce; text-decoration: underline; font-size: 14px; font-weight: 600;">ℹ️ Additional office arrival info →</a></p>
  </div>
  ${contactHtml()}`);

const arrivalGuideShortUrl = "orendapsych.com/arrival-guide";

const afterHoursDoorbellSms = `\n🔔 AFTER-HOURS ACCESS: If arriving after 5 PM, ring the doorbell on the RIGHT side of the building entrance. Security will let you in.`;

const generateConfirmationSmsText = (loc: OfficeLocation = "hoboken") => { const li = getInfoForLocation(loc); return `✅ Orenda Psychiatry — Appointment Confirmed\n\n📅 ${info.appointmentDate}\n🕐 ${info.slotStart} — ${info.slotEnd}\n👨‍⚕️ ${info.providerName}\n📍 ${li.address}\n\nPlease arrive 15 minutes early.${afterHoursDoorbellSms}\n\n📋 Check in here when you arrive: ${checkInFullUrl}\n\n📍 Directions: ${li.googleMaps}\n\nℹ️ Office arrival info: ${officeInfoFullUrl}\n\nQuestions? Contact Orenda Admin Team\n📞 ${info.phone}\n✉️ ${info.email}\n🌐 www.orendapsych.com`; };

const generateReminderSmsText = (loc: OfficeLocation = "hoboken") => { const li = getInfoForLocation(loc); return `⏰ Orenda Psychiatry — Reminder\n\nYour appointment is TOMORROW:\n\n📅 ${info.appointmentDate}\n🕐 ${info.slotStart} — ${info.slotEnd}\n👨‍⚕️ ${info.providerName}\n📍 ${li.shortAddress}\n\nPlease arrive 15 minutes early.${afterHoursDoorbellSms}\n\n📋 Check in here: ${checkInFullUrl}\n\n📍 Directions: ${li.googleMaps}\n\nℹ️ Office arrival info: ${officeInfoFullUrl}\n\nQuestions?\n📞 ${info.phone}\n✉️ ${info.email}`; };

const generateDayOfSmsText = (loc: OfficeLocation = "hoboken") => { const li = getInfoForLocation(loc); return `🏥 Orenda Psychiatry — Today's Visit\n\nHi ${info.patientName}! Your appointment is TODAY:\n\n🕐 ${info.slotStart} — ${info.slotEnd}\n👨‍⚕️ ${info.providerName}\n📍 ${li.shortAddress}\n\nPlease arrive 15 minutes early.${afterHoursDoorbellSms}\n\n📋 CHECK IN HERE: ${checkInFullUrl}\n\n📍 Directions: ${li.googleMaps}\n\nℹ️ Office info: ${officeInfoFullUrl}\n\nQuestions?\n📞 ${info.phone}\n✉️ ${info.email}`; };

const generateFollowUpSmsText = () => `💜 Orenda Psychiatry — Follow-Up Reminder\n\nHi ${info.patientName}, thank you for your visit with ${info.providerName}!\n\n📞 Please schedule your next follow-up with ${info.providerName}:\nCall: ${info.phone}\nEmail: ${info.email}\n\n⚠️ Please note: 90 days after your visit on ${info.appointmentDate}, ${scheduleIICopy}. Your next in-person visit is due by ${info.inPersonDate}.\n\nVisit: www.orendapsych.com`;

const generateInPersonSmsText = () => `💜 Orenda Psychiatry — In-Person Visit Required\n\nHi ${info.patientName}, please schedule your next follow-up with ${info.providerName}.\n\nPlease note that 90 days after your last visit on ${info.appointmentDate}, ${scheduleIICopy}.\n\nYour in-person visit is due by ${info.inPersonDate}.\n\n📞 ${info.phone}\n✉️ ${info.email}\n\n📍 Hoboken: 221 River St, 9th Fl\n📍 Edison: 110 Fieldcrest Ave, 3rd Fl\n\nℹ️ Office info: ${officeInfoFullUrl}\n\nVisit: www.orendapsych.com`;

/* ─── Google Maps Image ─── */
function GoogleMapsImage({ link }: { link: string }) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-purple-100 mb-4 hover:shadow-md transition-shadow">
      <div className="relative">
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.1!2d-74.0295!3d40.7425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259783dca4a95%3A0x89c259783dca4a95!2s221+River+St%2C+Hoboken%2C+NJ+07030!5e0!3m2!1sen!1sus!4v1`}
          width="100%" height="160" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          title="Office Location"
          className="pointer-events-none"
        />
        <div className="absolute inset-0 bg-transparent" />
      </div>
      <div className="bg-purple-50 px-4 py-2.5 flex items-center gap-2">
        <Navigation className="w-4 h-4 text-purple-700" />
        <span className="text-sm font-semibold text-purple-700">Open in Google Maps</span>
      </div>
    </a>
  );
}

/* ─── Check-In CTA Button ─── */
function CheckInButton({ prominent = false }: { prominent?: boolean }) {
  if (prominent) {
    return (
      <div className="rounded-xl border-2 border-purple-300 bg-gradient-to-br from-purple-100 to-purple-50 p-5 mb-6 text-center">
        <p className="text-base font-bold text-purple-900 mb-3">Please check in here when you arrive for your appointment.</p>
        <a
          href={info.checkInUrl}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white text-base font-bold shadow-md hover:shadow-lg transition-shadow"
          style={{ background: purpleGradient }}
        >
          <CheckCircle2 className="w-5 h-5" /> Check-In Form
        </a>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-purple-200 bg-purple-50/60 p-4 mb-5 flex items-center gap-3">
      <p className="text-sm text-purple-900 flex-1">Please check in here when you arrive for your appointment.</p>
      <a
        href={info.checkInUrl}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-white text-sm font-semibold whitespace-nowrap"
        style={{ background: purpleColor }}
      >
        <CheckCircle2 className="w-4 h-4" /> Check-In
      </a>
    </div>
  );
}

/* ─── Office Info Link ─── */
function OfficeInfoLink() {
  return (
    <a href={info.officeInfoUrl} className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 underline">
      <FileText className="w-4 h-4" /> Additional office arrival info →
    </a>
  );
}

/* ─── Phone Frame ─── */
function PhoneFrame({ children, innerRef }: { children: React.ReactNode; innerRef?: React.Ref<HTMLDivElement> }) {
  return (
    <div className="w-full max-w-[320px] mx-auto" ref={innerRef}>
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
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ background: purpleColor }}>OP</div>
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
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: purpleColor }}>
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
      <div className="bg-white border-x border-gray-200 px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <Mail className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-xs text-gray-500">From: <span className="text-gray-800 font-medium">Orenda Psychiatry &lt;noreply@orendapsych.com&gt;</span></p>
        </div>
        <p className="text-xs text-gray-500 pl-5">To: patient@email.com</p>
      </div>
      <div className="border-x border-b border-gray-200 rounded-b-xl overflow-hidden shadow-xl">
        {children}
      </div>
    </div>
  );
}

/* ─── Email Footer ─── */
function EmailFooter() {
  return (
    <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 space-y-1.5">
      <p className="text-sm text-gray-500 text-center font-medium">Orenda Admin Team · {info.phone} · {info.email}</p>
      <p className="text-sm text-gray-400 text-center">
        <a href={info.website} className="underline">www.orendapsych.com</a>
      </p>
      <p className="text-xs text-gray-300 text-center">© 2026 Orenda Psychiatry. All rights reserved.</p>
    </div>
  );
}

/* ─── Email Inner Content ─── */
function EmailContent({ headerLabel, headerSub, children }: { headerLabel: string; headerSub: string; children: React.ReactNode }) {
  return (
    <>
      <div className="px-6 py-8 text-center" style={{ background: purpleGradient }}>
        <img src={logo} alt="Orenda Psychiatry" className="h-6 mx-auto mb-3 brightness-0 invert opacity-80" />
        <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
          <Calendar className="w-3 h-3 text-white/90" />
          <span className="text-[10px] font-medium tracking-widest uppercase text-white/90">{headerLabel}</span>
        </div>
        <h2 className="text-xl font-bold text-white font-display">Orenda Psychiatry</h2>
        <p className="text-white/60 text-xs mt-1">{headerSub}</p>
      </div>
      <div className="bg-white px-8 py-8 text-base text-gray-700">{children}</div>
      <EmailFooter />
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
        <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-0.5">{label}</p>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-purple-700 underline">{value}</a>
        ) : (
          <p className="text-base font-semibold text-gray-900">{value}</p>
        )}
        {sub && <p className="text-sm text-gray-500">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Section Wrapper ─── */
function CommunicationSection({ title, subtitle, timing, icon: Icon, children }: {
  title: string; subtitle: string; timing: string; icon: any; children: React.ReactNode;
}) {
  return (
    <section className="py-12 sm:py-16 border-b border-purple-100/30 last:border-b-0">
      <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg" style={{ background: purpleGradient }}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-2">{title}</h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
        <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full" style={{ background: "hsla(270, 100%, 25%, 0.08)", color: purpleColor }}>{timing}</span>
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

function ConfirmationEmail({ loc = "hoboken" as OfficeLocation }) {
  const li = getInfoForLocation(loc);
  return (
    <LaptopEmailFrame>
      <EmailContent headerLabel="Appointment Confirmed" headerSub="Your upcoming visit details">
        <p className="mb-4 text-base">Hi <span className="font-semibold text-gray-900">{info.patientName}</span>,</p>
        <p className="text-base text-gray-600 mb-5 leading-relaxed">Your appointment has been confirmed! Here are your visit details — please save this for your records.</p>
        <CheckInButton />
        <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/80 to-white p-5 mb-5 grid gap-4">
          <DetailRow icon={Calendar} label="Date" value={info.appointmentDate} />
          <DetailRow icon={Clock} label="Time" value={`${info.slotStart} — ${info.slotEnd}`} />
          <DetailRow icon={User} label="Provider" value={info.providerName} />
          <DetailRow icon={MapPin} label="Location" value={li.address} link={li.googleMaps} />
        </div>
        <GoogleMapsImage link={li.googleMaps} />
        <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-5 mb-5">
          <p className="text-sm font-semibold text-purple-900 mb-2">📋 Before Your Visit</p>
          <ul className="text-sm text-purple-800 space-y-1.5 list-disc pl-4">
            <li><strong>Please arrive 15 minutes before your appointment</strong></li>
          </ul>
        </div>
        {/* After-Hours Doorbell Alert */}
        <div className="rounded-xl border-2 border-orange-400 p-5 mb-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff7ed, #fffbeb, #fff7ed)' }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-600 mb-1 mt-1">⚠️ Important — After-Hours Access</p>
          <p className="text-sm font-bold text-orange-900 mb-1">🔔 Ring the Doorbell to Enter</p>
          <p className="text-sm text-orange-800 leading-relaxed">If you are arriving <strong>after 5:00 PM</strong>, the main entrance will be locked. <strong>Ring the doorbell on the right-hand side of the building entrance</strong> — security will let you in.</p>
        </div>
        <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-5 mb-5">
          <p className="text-sm font-semibold text-purple-900 mb-2">📍 Getting There</p>
          <p className="text-sm text-purple-800 mb-3">{li.directions}</p>
          <a href={li.googleMaps} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 underline">
            <Navigation className="w-4 h-4" /> Open in Google Maps
          </a>
          <div className="mt-2"><OfficeInfoLink /></div>
        </div>
        <hr className="border-gray-100 my-5" />
        <div className="text-center space-y-1.5">
          <p className="text-sm text-gray-500">Have questions? We're here to help.</p>
          <p className="text-sm text-gray-600 font-medium">📞 {info.phone} · ✉️ {info.email}</p>
          <p className="text-sm"><a href={info.website} className="text-purple-600 underline">www.orendapsych.com</a></p>
        </div>
      </EmailContent>
    </LaptopEmailFrame>
  );
}

function ConfirmationSMS({ loc = "hoboken" as OfficeLocation }) {
  const li = getInfoForLocation(loc);
  return (
    <PhoneFrame>{`✅ Orenda Psychiatry — Appointment Confirmed

📅 ${info.appointmentDate}
🕐 ${info.slotStart} — ${info.slotEnd}
👨‍⚕️ ${info.providerName}
📍 ${li.address}

Please arrive 15 minutes early.

🔔 AFTER-HOURS ACCESS: If arriving after 5 PM, ring the doorbell on the RIGHT side of the building entrance. Security will let you in.

📋 Check in here when you arrive: ${arrivalGuideShortUrl}

📍 Directions: ${li.mapsShort}

Questions? Contact Orenda Admin Team
📞 ${info.phone}
✉️ ${info.email}
🌐 www.orendapsych.com`}</PhoneFrame>
  );
}

function ReminderEmail({ loc = "hoboken" as OfficeLocation }) {
  const li = getInfoForLocation(loc);
  return (
    <LaptopEmailFrame>
      <EmailContent headerLabel="Appointment Tomorrow" headerSub="Don't forget your upcoming visit">
        <p className="mb-4 text-base">Hi <span className="font-semibold text-gray-900">{info.patientName}</span>,</p>
        <p className="text-base text-gray-600 mb-4 leading-relaxed">This is a friendly reminder that your appointment is <strong>tomorrow</strong>. We look forward to seeing you!</p>
        <CheckInButton prominent />
        <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/80 to-white p-5 mb-5 grid gap-4">
          <DetailRow icon={Calendar} label="Date" value={info.appointmentDate} />
          <DetailRow icon={Clock} label="Time" value={`${info.slotStart} — ${info.slotEnd}`} />
          <DetailRow icon={User} label="Provider" value={info.providerName} />
          <DetailRow icon={MapPin} label="Location" value={li.address} link={li.googleMaps} />
        </div>
        <GoogleMapsImage link={li.googleMaps} />
        <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-5 mb-5">
          <p className="text-sm font-semibold text-purple-900 mb-2">🏢 Finding the Office</p>
          <p className="text-sm text-purple-800 mb-2">{li.directions}</p>
          <a href={li.googleMaps} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 underline mt-2">
            <Navigation className="w-4 h-4" /> Open in Google Maps
          </a>
          <div className="mt-2"><OfficeInfoLink /></div>
        </div>
        {/* After-Hours Doorbell Alert */}
        <div className="rounded-xl border-2 border-orange-400 p-5 mb-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff7ed, #fffbeb, #fff7ed)' }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-600 mb-1 mt-1">⚠️ Important — After-Hours Access</p>
          <p className="text-sm font-bold text-orange-900 mb-1">🔔 Ring the Doorbell to Enter</p>
          <p className="text-sm text-orange-800 leading-relaxed">If you are arriving <strong>after 5:00 PM</strong>, the main entrance will be locked. <strong>Ring the doorbell on the right-hand side of the building entrance</strong> — security will let you in.</p>
        </div>
        <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-5 mb-5">
          <p className="text-sm font-semibold text-purple-900 mb-2">📋 Don't Forget</p>
          <ul className="text-sm text-purple-800 space-y-1.5 list-disc pl-4">
            <li><strong>Please arrive 15 minutes early</strong></li>
          </ul>
        </div>
        <hr className="border-gray-100 my-5" />
        <div className="text-center space-y-1.5">
          <p className="text-sm text-gray-500">Have questions? We're here to help.</p>
          <p className="text-sm text-gray-600 font-medium">📞 {info.phone} · ✉️ {info.email}</p>
          <p className="text-sm"><a href={info.website} className="text-purple-600 underline">www.orendapsych.com</a></p>
        </div>
      </EmailContent>
    </LaptopEmailFrame>
  );
}

function ReminderSMS({ loc = "hoboken" as OfficeLocation }) {
  const li = getInfoForLocation(loc);
  return (
    <PhoneFrame>{`⏰ Orenda Psychiatry — Reminder

Your appointment is TOMORROW:

📅 ${info.appointmentDate}
🕐 ${info.slotStart} — ${info.slotEnd}
👨‍⚕️ ${info.providerName}
📍 ${li.shortAddress}

Please arrive 15 minutes early.

🔔 AFTER-HOURS ACCESS: If arriving after 5 PM, ring the doorbell on the RIGHT side of the building entrance. Security will let you in.

📋 Check in here when you arrive: ${arrivalGuideShortUrl}

📍 Directions: ${li.mapsShort}

Questions? Contact Orenda Admin Team
📞 ${info.phone}
✉️ ${info.email}`}</PhoneFrame>
  );
}

function DayOfEmail({ loc = "hoboken" as OfficeLocation }) {
  const li = getInfoForLocation(loc);
  return (
    <LaptopEmailFrame>
      <EmailContent headerLabel="Your Visit Is Today" headerSub="We're ready for you!">
        <p className="mb-4 text-base">Hi <span className="font-semibold text-gray-900">{info.patientName}</span>,</p>
        <p className="text-base text-gray-600 mb-4 leading-relaxed">Your appointment with <strong>{info.providerName}</strong> is <strong>today</strong>! We're looking forward to seeing you.</p>
        <CheckInButton prominent />
        <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/80 to-white p-5 mb-5 grid gap-4">
          <DetailRow icon={Clock} label="Time" value={`${info.slotStart} — ${info.slotEnd}`} />
          <DetailRow icon={User} label="Provider" value={info.providerName} />
          <DetailRow icon={MapPin} label="Location" value={li.address} link={li.googleMaps} />
        </div>
        <GoogleMapsImage link={li.googleMaps} />
        <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-5 mb-5">
          <p className="text-sm font-semibold text-purple-900 mb-2">📍 Office Directions</p>
          <p className="text-sm text-purple-800 mb-3">{li.directions}</p>
          <a href={li.googleMaps} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-700 underline">
            <Navigation className="w-4 h-4" /> Open in Google Maps
          </a>
          <div className="mt-2"><OfficeInfoLink /></div>
        </div>
        {/* After-Hours Doorbell Alert */}
        <div className="rounded-xl border-2 border-orange-400 p-5 mb-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff7ed, #fffbeb, #fff7ed)' }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-600 mb-1 mt-1">⚠️ Important — After-Hours Access</p>
          <p className="text-sm font-bold text-orange-900 mb-1">🔔 Ring the Doorbell to Enter</p>
          <p className="text-sm text-orange-800 leading-relaxed">If you are arriving <strong>after 5:00 PM</strong>, the main entrance will be locked. <strong>Ring the doorbell on the right-hand side of the building entrance</strong> — security will let you in.</p>
        </div>
        <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-5 mb-5">
          <p className="text-sm font-semibold text-purple-900 mb-2">📋 Reminders</p>
          <ul className="text-sm text-purple-800 space-y-1.5 list-disc pl-4">
            <li><strong>Please arrive 15 minutes early</strong></li>
          </ul>
        </div>
        <hr className="border-gray-100 my-5" />
        <div className="text-center space-y-1.5">
          <p className="text-sm text-gray-500">Have questions? We're here to help.</p>
          <p className="text-sm text-gray-600 font-medium">📞 {info.phone} · ✉️ {info.email}</p>
          <p className="text-sm"><a href={info.website} className="text-purple-600 underline">www.orendapsych.com</a></p>
        </div>
      </EmailContent>
    </LaptopEmailFrame>
  );
}

function DayOfSMS({ loc = "hoboken" as OfficeLocation }) {
  const li = getInfoForLocation(loc);
  return (
    <PhoneFrame>{`🏥 Orenda Psychiatry — Today's Visit

Hi ${info.patientName}! Your appointment is TODAY:

🕐 ${info.slotStart} — ${info.slotEnd}
👨‍⚕️ ${info.providerName}
📍 ${li.shortAddress}

Please arrive 15 minutes early.

🔔 AFTER-HOURS ACCESS: If arriving after 5 PM, ring the doorbell on the RIGHT side of the building entrance. Security will let you in.

📋 CHECK IN HERE when you arrive: ${arrivalGuideShortUrl}

📍 Directions: ${li.mapsShort}

Questions? Contact Orenda Admin Team
📞 ${info.phone}
✉️ ${info.email}`}</PhoneFrame>
  );
}
function FollowUpEmail() {
  return (
    <LaptopEmailFrame>
      <EmailContent headerLabel="Schedule Your Follow-Up" headerSub="Continue your care journey">
        <p className="mb-4 text-base">Hi <span className="font-semibold text-gray-900">{info.patientName}</span>,</p>
        <p className="text-base text-gray-600 mb-5 leading-relaxed">Thank you for visiting us! Please schedule your next follow-up with <strong>{info.providerName}</strong>.</p>
        <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/80 to-white p-5 mb-5">
          <p className="text-base font-bold text-purple-900 mb-2">📞 To Schedule Your Follow-Up:</p>
          <p className="text-sm text-purple-800 leading-relaxed mb-3">Please call our office or send us an email to book your next appointment with {info.providerName}.</p>
          <div className="grid gap-2.5 bg-white/60 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4 text-purple-600" />
              <span className="text-base font-semibold text-gray-900">{info.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-600" />
              <span className="text-base font-semibold text-gray-900">{info.email}</span>
            </div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/30 p-5 mb-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-bold text-purple-900 mb-1">90-Day In-Person Visit Requirement</p>
              <p className="text-sm text-purple-800 leading-relaxed mb-2">Please note that 90 days after your visit on <strong>{info.appointmentDate}</strong>, we require that {scheduleIICopy}. Please reach out to us to schedule your next in-person visit on or before:</p>
              <p className="text-xl font-bold text-purple-900">{info.inPersonDate}</p>
              <p className="text-sm text-purple-700 mt-1">(90 days from your visit on {info.appointmentDate})</p>
            </div>
          </div>
        </div>
        <hr className="border-gray-100 my-5" />
        <div className="text-center space-y-1.5">
          <p className="text-sm text-gray-500">Have questions? We're here to help.</p>
          <p className="text-sm text-gray-600 font-medium">📞 {info.phone} · ✉️ {info.email}</p>
          <p className="text-sm"><a href={info.website} className="text-purple-600 underline">www.orendapsych.com</a></p>
        </div>
      </EmailContent>
    </LaptopEmailFrame>
  );
}

function FollowUpSMS() {
  return (
    <PhoneFrame>{`💜 Orenda Psychiatry — Follow-Up Reminder

Hi ${info.patientName}, thank you for your visit with ${info.providerName}!

📞 Please schedule your next follow-up with ${info.providerName}:
Call: ${info.phone}
Email: ${info.email}

⚠️ Please note: 90 days after your visit on ${info.appointmentDate}, ${scheduleIICopy}. Your next in-person visit is due by ${info.inPersonDate}.

Questions? Visit www.orendapsych.com`}</PhoneFrame>
  );
}

function InPersonReminderEmail() {
  return (
    <LaptopEmailFrame>
      <EmailContent headerLabel="In-Person Visit Due" headerSub="Your 90-day in-person visit is approaching">
        <p className="mb-4 text-base">Hi <span className="font-semibold text-gray-900">{info.patientName}</span>,</p>
        <p className="text-base text-gray-600 mb-5 leading-relaxed">Please schedule your next follow-up with <strong>{info.providerName}</strong>. Please note that 90 days after your last visit on <strong>{info.appointmentDate}</strong>, we require that {scheduleIICopy}.</p>
        <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/30 p-5 mb-5 text-center">
          <AlertTriangle className="w-10 h-10 text-purple-600 mx-auto mb-3" />
          <p className="text-lg font-bold text-purple-900 mb-1">In-Person Visit Required</p>
          <p className="text-sm text-purple-700 mb-2">Please reach out to us to schedule your visit on or before:</p>
          <p className="text-2xl font-bold text-purple-900">{info.inPersonDate}</p>
        </div>
        <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-5 mb-5">
          <p className="text-base font-bold text-purple-900 mb-2">📞 Contact Us to Schedule:</p>
          <div className="grid gap-2.5">
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4 text-purple-600" />
              <span className="text-base font-semibold text-gray-900">{info.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-600" />
              <span className="text-base font-semibold text-gray-900">{info.email}</span>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-5 mb-5">
          <p className="text-sm font-semibold text-purple-900 mb-2">📍 Office Locations</p>
          <div className="space-y-2.5 text-sm text-purple-800">
            <div>
              <p className="font-semibold">Hoboken:</p>
              <p>{info.address}</p>
              <a href={info.googleMapsHoboken} target="_blank" rel="noopener noreferrer" className="text-purple-700 underline text-sm">Get Directions →</a>
            </div>
            <div>
              <p className="font-semibold">Edison:</p>
              <p>{info.edisonAddress}</p>
              <a href={info.googleMapsEdison} target="_blank" rel="noopener noreferrer" className="text-purple-700 underline text-sm">Get Directions →</a>
            </div>
          </div>
          <div className="mt-2">
            <OfficeInfoLink />
          </div>
        </div>
        <hr className="border-gray-100 my-5" />
        <div className="text-center space-y-1.5">
          <p className="text-sm text-gray-500">Have questions? We're here to help.</p>
          <p className="text-sm text-gray-600 font-medium">📞 {info.phone} · ✉️ {info.email}</p>
          <p className="text-sm"><a href={info.website} className="text-purple-600 underline">www.orendapsych.com</a></p>
        </div>
      </EmailContent>
    </LaptopEmailFrame>
  );
}

function InPersonReminderSMS() {
  return (
    <PhoneFrame>{`💜 Orenda Psychiatry — In-Person Visit Required

Hi ${info.patientName}, please schedule your next follow-up with ${info.providerName}.

Please note that 90 days after your last visit on ${info.appointmentDate}, ${scheduleIICopy}.

Your in-person visit is due by ${info.inPersonDate}.

📞 Call: ${info.phone}
✉️ Email: ${info.email}

📍 Hoboken: 221 River St, 9th Fl
📍 Edison: 110 Fieldcrest Ave, 3rd Fl

ℹ️ Office info: ${arrivalGuideShortUrl}

Visit: www.orendapsych.com`}</PhoneFrame>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function NJPatientCommunicationTemplates() {
  const smsContainerRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [officeLoc, setOfficeLoc] = useState<OfficeLocation>("hoboken");

  const handleDownloadAllSms = useCallback(async () => {
    if (!smsContainerRef.current || downloading) return;
    setDownloading(true);
    try {
      const phoneFrames = smsContainerRef.current.querySelectorAll('[data-sms-frame]');
      if (phoneFrames.length === 0) return;
      const tempContainer = document.createElement('div');
      tempContainer.style.cssText = 'position: fixed; left: -9999px; top: 0; background: white; padding: 40px; display: flex; flex-direction: column; gap: 40px; align-items: center;';
      document.body.appendChild(tempContainer);
      for (const frame of phoneFrames) {
        const clone = frame.cloneNode(true) as HTMLElement;
        clone.style.width = '320px';
        tempContainer.appendChild(clone);
      }
      const canvas = await html2canvas(tempContainer, { backgroundColor: '#ffffff', scale: 2, useCORS: true, logging: false });
      document.body.removeChild(tempContainer);
      const link = document.createElement('a');
      link.download = `orenda-sms-templates-${officeLoc}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to download SMS images:', err);
    } finally {
      setDownloading(false);
    }
  }, [downloading, officeLoc]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: purpleGradient }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="comm-dots-t" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#comm-dots-t)" />
        </svg>
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="Orenda" className="h-8 brightness-0 invert opacity-70" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
            Examples of Potential<br />Patient Communication
          </h1>
          <div className="mt-6 inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-300/40 backdrop-blur-sm rounded-lg px-5 py-3">
            <AlertTriangle className="w-5 h-5 text-yellow-300" />
            <span className="text-sm sm:text-base font-bold text-yellow-200 uppercase tracking-wide">Draft — Internal Use Only</span>
          </div>
          <p className="text-sm sm:text-base text-white/50 mt-4 max-w-2xl font-medium leading-relaxed">
            These templates are not finalized and are for internal review purposes only. Each communication is shown as both an email and text message.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Office Location Toggle */}
        <div className="flex flex-col items-center gap-3 pt-10 pb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Office Location for Templates</span>
          </div>
          <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm border border-border/50">
            {(["hoboken", "edison"] as OfficeLocation[]).map((loc) => (
              <button
                key={loc}
                onClick={() => setOfficeLoc(loc)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  officeLoc === loc
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {loc === "hoboken" ? "🏙️ Hoboken" : "🏢 Edison"}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Patient notifications (confirmation, reminder, day-of) are specific to the <strong>{officeLoc === "hoboken" ? "Hoboken" : "Edison"}</strong> office. Follow-up and 90-day reminders include both locations.
          </p>
        </div>

        {/* Copy All + Download All Buttons */}
        <div className="flex flex-wrap justify-center gap-3 py-4">
          <CopyHtmlButton
            htmlGenerator={() => {
              const separator = '<br/><hr style="border: none; border-top: 2px solid #e9d5ff; margin: 40px 0;" /><br/>';
              return [
                generateConfirmationHtml(officeLoc),
                generateReminderHtml(officeLoc),
                generateDayOfHtml(officeLoc),
                generateFollowUpHtml(),
                generateInPersonReminderHtml(),
              ].join(separator);
            }}
            label={`Copy All Email Templates (${officeLoc === "hoboken" ? "Hoboken" : "Edison"})`}
          />
          <button
            onClick={handleDownloadAllSms}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
            style={{
              background: downloading ? "hsl(270, 30%, 92%)" : "hsl(270, 40%, 96%)",
              borderColor: "hsl(270, 30%, 85%)",
              color: downloading ? "hsl(270, 40%, 60%)" : "hsl(270, 60%, 40%)",
            }}
          >
            <Download className="w-3.5 h-3.5" />
            {downloading ? "Generating..." : "Download All SMS as Images"}
          </button>
        </div>

        {/* Hidden container to collect SMS refs for download */}
        <div ref={smsContainerRef}>
          {/* 1 — Appointment Confirmation */}
          <CommunicationSection
            title="Appointment Confirmation"
            subtitle={`Sent immediately after a patient books their appointment at the ${officeLoc === "hoboken" ? "Hoboken" : "Edison"} office.`}
            timing="Sent Immediately After Booking"
            icon={CheckCircle2}
          >
            <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Version</p>
                <CopyHtmlButton htmlGenerator={() => generateConfirmationHtml(officeLoc)} label="Copy Email HTML" />
              </div>
              <ConfirmationEmail loc={officeLoc} />
            </motion.div>
            <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Text Message</p>
                <CopyTextButton textGenerator={() => generateConfirmationSmsText(officeLoc)} />
              </div>
              <div data-sms-frame>
                <ConfirmationSMS loc={officeLoc} />
              </div>
            </motion.div>
          </CommunicationSection>

          {/* 2 — Appointment Reminder */}
          <CommunicationSection
            title="Appointment Reminder"
            subtitle={`Sent 24 hours before the appointment at the ${officeLoc === "hoboken" ? "Hoboken" : "Edison"} office.`}
            timing="Sent 24 Hours Before Visit"
            icon={Bell}
          >
            <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Version</p>
                <CopyHtmlButton htmlGenerator={() => generateReminderHtml(officeLoc)} label="Copy Email HTML" />
              </div>
              <ReminderEmail loc={officeLoc} />
            </motion.div>
            <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Text Message</p>
                <CopyTextButton textGenerator={() => generateReminderSmsText(officeLoc)} />
              </div>
              <div data-sms-frame>
                <ReminderSMS loc={officeLoc} />
              </div>
            </motion.div>
          </CommunicationSection>

          {/* 3 — Day of Visit */}
          <CommunicationSection
            title="Day of Visit"
            subtitle={`Sent the morning of the appointment at the ${officeLoc === "hoboken" ? "Hoboken" : "Edison"} office.`}
            timing="Sent Morning of Appointment"
            icon={Navigation}
          >
            <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Version</p>
                <CopyHtmlButton htmlGenerator={() => generateDayOfHtml(officeLoc)} label="Copy Email HTML" />
              </div>
              <DayOfEmail loc={officeLoc} />
            </motion.div>
            <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Text Message</p>
                <CopyTextButton textGenerator={() => generateDayOfSmsText(officeLoc)} />
              </div>
              <div data-sms-frame>
                <DayOfSMS loc={officeLoc} />
              </div>
            </motion.div>
          </CommunicationSection>

          {/* 4 — Follow-Up Reminder */}
          <CommunicationSection
            title="Follow-Up Reminder"
            subtitle="Sent 24 hours after the appointment encouraging patients to schedule their next follow-up with their provider."
            timing="Sent 24 Hours After Visit"
            icon={Repeat}
          >
            <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Version</p>
                <CopyHtmlButton htmlGenerator={generateFollowUpHtml} label="Copy Email HTML" />
              </div>
              <FollowUpEmail />
            </motion.div>
            <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Text Message</p>
                <CopyTextButton textGenerator={generateFollowUpSmsText} />
              </div>
              <div data-sms-frame>
                <FollowUpSMS />
              </div>
            </motion.div>
          </CommunicationSection>

          {/* 5 — 90-Day In-Person Reminder */}
          <CommunicationSection
            title="90-Day In-Person Visit Reminder"
            subtitle="Sent as the 90-day in-person requirement approaches for patients receiving Schedule II prescriptions in New Jersey."
            timing="Sent 14 Days Before Due Date"
            icon={AlertTriangle}
          >
            <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Version</p>
                <CopyHtmlButton htmlGenerator={generateInPersonReminderHtml} label="Copy Email HTML" />
              </div>
              <InPersonReminderEmail />
            </motion.div>
            <motion.div variants={slideInRight} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"><MessageSquare className="w-3.5 h-3.5" /> Text Message</p>
                <CopyTextButton textGenerator={generateInPersonSmsText} />
              </div>
              <div data-sms-frame>
                <InPersonReminderSMS />
              </div>
            </motion.div>
          </CommunicationSection>
        </div>
      </div>
    </div>
  );
}
