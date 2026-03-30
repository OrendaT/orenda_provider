import { useRef, useState, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download, Copy, Check, Upload, FileDown, FileSpreadsheet } from "lucide-react";
import { downloadProviderWelcomeXlsx } from "@/utils/welcomeEmailExport";
import brandedMapImg from "@/assets/hoboken-map-branded.png";
import edisonMapImg from "@/assets/edison-map-branded.png";

const CALENDAR_INVITE_TEXT = `Hi [Provider Name]!

Looking forward to connecting and getting you all set up for success at our New Jersey offices. We'll go over:

• Building access & check-in logistics
• Your patient schedule & Simple Practice calendar
• Office amenities (Wi-Fi, kitchen, etc.)

It'll be quick — just want to make sure you feel fully prepared!

Talk soon,
Susie Levitt
(203) 313-3074 · susie@orendapsych.com`;

interface ProviderData {
  providerName: string;
  bookingDate: string;
  appointmentTime: string;
  patientCalendarLink: string;
  googleMeetLink: string;
}

const DEFAULT_DATA: ProviderData = {
  providerName: "[Provider Name]",
  bookingDate: "[Booking Date]",
  appointmentTime: "[Appointment Time]",
  patientCalendarLink: "[Patient Calendar Link]",
  googleMeetLink: "[Google Meet Link]",
};

const CSV_HEADERS = "Provider Name,Booking Date,Appointment Time,Patient Calendar Link,Google Meet Link";
const CSV_EXAMPLE = "Dr. Jane Smith,March 21 2026,10:00 AM – 2:00 PM,https://calendar.example.com/drsmith,https://meet.google.com/abc-defg-hij";

function parseCSV(text: string): ProviderData | null {
  const lines = text.trim().split("\n").filter(l => l.trim());
  if (lines.length < 2) return null;
  const values = lines[1].split(",").map(v => v.trim());
  if (values.length < 5) return null;
  return {
    providerName: values[0] || DEFAULT_DATA.providerName,
    bookingDate: values[1] || DEFAULT_DATA.bookingDate,
    appointmentTime: values[2] || DEFAULT_DATA.appointmentTime,
    patientCalendarLink: values[3] || DEFAULT_DATA.patientCalendarLink,
    googleMeetLink: values[4] || DEFAULT_DATA.googleMeetLink,
  };
}

export default function ProviderWelcomeEmail() {
  const emailRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [data, setData] = useState<ProviderData>(DEFAULT_DATA);
  const [uploaded, setUploaded] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);

  const calendarText = CALENDAR_INVITE_TEXT.replace(/\[Provider Name\]/g, data.providerName);

  const handleCopyInvite = useCallback(() => {
    navigator.clipboard.writeText(calendarText).then(() => {
      setInviteCopied(true);
      setTimeout(() => setInviteCopied(false), 2000);
    });
  }, [calendarText]);

  const handleDownloadPng = async () => {
    if (!emailRef.current || downloading) return;
    setDownloading(true);
    try {
      await toPng(emailRef.current, { quality: 0.1, cacheBust: true });
      await new Promise((r) => setTimeout(r, 300));
      const dataUrl = await toPng(emailRef.current, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
        width: emailRef.current.scrollWidth,
        height: emailRef.current.scrollHeight,
      });
      const link = document.createElement("a");
      link.download = "Provider-Welcome-Email.png";
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Download failed:", e);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyHtml = async () => {
    if (!emailRef.current) return;
    try {
      const range = document.createRange();
      range.selectNodeContents(emailRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      document.execCommand("copy");
      selection?.removeAllRanges();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const handleDownloadTemplate = useCallback(() => {
    const csvContent = `${CSV_HEADERS}\n${CSV_EXAMPLE}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "provider-welcome-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed) {
        setData(parsed);
        setUploaded(true);
        setTimeout(() => setUploaded(false), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(270,15%,96%)] font-body">
      {/* Toolbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Provider Welcome Email Preview</p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              CSV Template
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              {uploaded ? "✓ Loaded!" : "Upload CSV"}
            </button>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            <button
              onClick={() => downloadProviderWelcomeXlsx(data)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Excel
            </button>
            <button
              onClick={handleCopyHtml}
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy HTML"}
            </button>
            <button
              onClick={handleDownloadPng}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {downloading ? "Generating…" : "Download PNG"}
            </button>
          </div>
        </div>
      </header>

      {/* Google Calendar Invite Copy Section */}
      <div className="max-w-2xl mx-auto pt-10 px-4">
        <div className="bg-white rounded-xl border border-border/30 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/20 bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">📅 Google Calendar Invite Description</span>
              <span className="text-xs text-muted-foreground">— paste into your calendar event</span>
            </div>
            <button
              onClick={handleCopyInvite}
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              {inviteCopied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              {inviteCopied ? "Copied!" : "Copy Text"}
            </button>
          </div>
          <pre className="px-5 py-4 text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed font-sans">{calendarText}</pre>
        </div>
      </div>

      {/* Email Preview */}
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div ref={emailRef} style={{ fontFamily: "'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", maxWidth: 600, margin: "0 auto", backgroundColor: "#ffffff" }}>
          
          {/* Header band */}
          <div style={{ background: "linear-gradient(135deg, #3B0764 0%, #581C87 50%, #7C3AED 100%)", padding: "44px 40px 36px", textAlign: "center" as const }}>
            <h1 style={{ color: "#ffffff", fontSize: 28, fontWeight: 300, margin: 0, letterSpacing: "0.02em", lineHeight: 1.4, fontFamily: "'Playfair Display', Georgia, serif" }}>
              Welcome to Our{" "}
              <span style={{ fontWeight: 700, fontStyle: "italic" }}>New Jersey</span>{" "}
              Offices
            </h1>
          </div>

          {/* Body */}
          <div style={{ padding: "36px 40px 20px" }}>
            <p style={{ color: "#1a1a2e", fontSize: 15, lineHeight: 1.7, margin: "0 0 18px" }}>
              Hi <strong>{data.providerName}</strong>,
            </p>
            <p style={{ color: "#1a1a2e", fontSize: 15, lineHeight: 1.7, margin: "0 0 18px" }}>
              Thank you so much for scheduling your first in-person office day at our New Jersey office on <strong>{data.bookingDate}</strong> — we're thrilled to have you! 🎉
            </p>
            <p style={{ color: "#1a1a2e", fontSize: 15, lineHeight: 1.7, margin: "0 0 18px" }}>
              Time has been blocked on your Simple Practice calendar for <strong>{data.appointmentTime}</strong>. A calendar invite with the <a href={data.googleMeetLink} target="_blank" rel="noopener noreferrer" style={{ color: "#7C3AED", fontWeight: 600, textDecoration: "none", borderBottom: "1px solid #7C3AED" }}>Google Meet link</a> has also been sent to you.
            </p>
            <p style={{ color: "#1a1a2e", fontSize: 15, lineHeight: 1.7, margin: "0 0 18px" }}>
              Here are a few things to know:
            </p>

            {/* Key info cards */}
            <div style={{ margin: "24px 0" }}>
              {/* Simple Practice Calendar */}
              <div style={{ background: "#F5F3FF", borderRadius: 12, padding: "20px 24px", marginBottom: 12, borderLeft: "4px solid #7C3AED" }}>
                <p style={{ color: "#7C3AED", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 6px" }}>📅 Simple Practice Calendar</p>
                <p style={{ color: "#1a1a2e", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  <strong>{data.appointmentTime}</strong> on <strong>{data.bookingDate}</strong> has been blocked on your Simple Practice calendar. A calendar invite with the Google Meet link has also been sent to you.
                </p>
              </div>

              {/* Patient Calendar */}
              <div style={{ background: "#F5F3FF", borderRadius: 12, padding: "20px 24px", marginBottom: 12, borderLeft: "4px solid #7C3AED" }}>
                <p style={{ color: "#7C3AED", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 6px" }}>📋 Your Patient Calendar</p>
                <p style={{ color: "#1a1a2e", fontSize: 14, lineHeight: 1.6, margin: "0 0 10px" }}>
                  Your patient calendar with upcoming appointments is included below. As additional bookings are made, the latest version will be sent to you.
                </p>
                <a href={data.patientCalendarLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#7C3AED", color: "#ffffff", fontSize: 13, fontWeight: 600, padding: "10px 20px", borderRadius: 8, textDecoration: "none" }}>
                  View Patient Calendar →
                </a>
              </div>

              {/* Office Agreement */}
              <div style={{ background: "#FFF7ED", borderRadius: 12, padding: "20px 24px", marginBottom: 12, borderLeft: "4px solid #F59E0B" }}>
                <p style={{ color: "#D97706", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 6px" }}>📝 Office Agreement</p>
                <p style={{ color: "#1a1a2e", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  Before your first visit, please review and sign the office agreement. It should have been sent to your email. If you've already completed this, please disregard.
                </p>
              </div>

              {/* Security & Building Access */}
              <div style={{ background: "#F5F3FF", borderRadius: 12, padding: "20px 24px", marginBottom: 12, borderLeft: "4px solid #7C3AED" }}>
                <p style={{ color: "#7C3AED", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 6px" }}>🔒 Security & Building Access</p>
                <p style={{ color: "#1a1a2e", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  Your patient's information will be sent to the security desk to ensure smooth access on the day of their visit. No action is needed from you on this.
                </p>
              </div>

              {/* Patient Directions */}
              <div style={{ background: "#F5F3FF", borderRadius: 12, padding: "20px 24px", marginBottom: 12, borderLeft: "4px solid #7C3AED" }}>
                <p style={{ color: "#7C3AED", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 6px" }}>🗺️ Patient Directions</p>
                <p style={{ color: "#1a1a2e", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  Your patient will receive detailed directions and information about coming to the office, including building entry, floor access, and what to expect on arrival.
                </p>
              </div>
            </div>

            {/* Office Locations */}
            <div style={{ margin: "28px 0 24px" }}>
              <p style={{ color: "#7C3AED", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 16px" }}>Office Locations</p>
              
              {/* Hoboken */}
              <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E9E5F5", marginBottom: 16 }}>
                <img src={`${window.location.origin}${brandedMapImg}`} alt="Hoboken Office Map" style={{ width: "100%", display: "block" }} crossOrigin="anonymous" />
                <div style={{ padding: "16px 20px", background: "#FAFAFE" }}>
                  <p style={{ color: "#1a1a2e", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>Hoboken — Regus Riverfront Center</p>
                  <p style={{ color: "#64748B", fontSize: 13, margin: "0 0 2px" }}>221 River Street, 9th Floor, Unit 9076</p>
                  <p style={{ color: "#64748B", fontSize: 13, margin: "0 0 12px" }}>Hoboken, NJ 07030</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=221+River+Street+Hoboken+NJ+07030"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", color: "#7C3AED", fontSize: 13, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid #7C3AED" }}
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>

              {/* Edison */}
              <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E9E5F5" }}>
                <img src={`${window.location.origin}${edisonMapImg}`} alt="Edison Office Map" style={{ width: "100%", display: "block" }} crossOrigin="anonymous" />
                <div style={{ padding: "16px 20px", background: "#FAFAFE" }}>
                  <p style={{ color: "#1a1a2e", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>Edison — Regus Fieldcrest</p>
                  <p style={{ color: "#64748B", fontSize: 13, margin: "0 0 2px" }}>110 Fieldcrest Avenue, 3rd Floor, Unit 328</p>
                  <p style={{ color: "#64748B", fontSize: 13, margin: "0 0 12px" }}>Edison, NJ 08837</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=110+Fieldcrest+Avenue+Edison+NJ+08837"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", color: "#7C3AED", fontSize: 13, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid #7C3AED" }}
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Reference — Hoboken */}
            <div style={{ background: "#1a1a2e", borderRadius: 12, padding: "24px 28px", margin: "24px 0 12px" }}>
              <p style={{ color: "#A78BFA", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 16px" }}>Quick Reference — Hoboken</p>
              <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
                <tbody>
                  {[
                    ["Regus Front Desk", "9th Floor · Mon–Fri, 9 AM – 5 PM"],
                    ["Front Desk Email", "Hoboken.Riverfront@regus.com"],
                    ["Building Phone", "(201) 721-8500"],
                    ["Wi-Fi Network", "Regus Net Wi-Fi"],
                    ["Wi-Fi Password", "167845630"],
                    ["After-Hours Access", "Swipe card required (we'll set you up)"],
                  ].map(([label, value], i) => (
                    <tr key={i}>
                      <td style={{ color: "#A78BFA", fontSize: 12, fontWeight: 600, padding: "6px 0", verticalAlign: "top", whiteSpace: "nowrap" as const, paddingRight: 16 }}>{label}</td>
                      <td style={{ color: "#E2E8F0", fontSize: 13, padding: "6px 0" }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Reference — Edison */}
            <div style={{ background: "#1a1a2e", borderRadius: 12, padding: "24px 28px", margin: "12px 0 24px" }}>
              <p style={{ color: "#A78BFA", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 16px" }}>Quick Reference — Edison</p>
              <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
                <tbody>
                  {[
                    ["Regus Front Desk", "3rd Floor · Mon–Fri, 9 AM – 5 PM"],
                    ["Front Desk Email", "Edison.Fieldcrest@regus.com"],
                    ["Building Phone", "(732) 782-0328"],
                    ["Wi-Fi Username", "Orendapsych"],
                    ["Wi-Fi Password", "167785439"],
                    ["After-Hours Access", "Swipe card required (we'll set you up)"],
                  ].map(([label, value], i) => (
                    <tr key={i}>
                      <td style={{ color: "#A78BFA", fontSize: 12, fontWeight: 600, padding: "6px 0", verticalAlign: "top", whiteSpace: "nowrap" as const, paddingRight: 16 }}>{label}</td>
                      <td style={{ color: "#E2E8F0", fontSize: 13, padding: "6px 0" }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Closing */}
            <p style={{ color: "#1a1a2e", fontSize: 15, lineHeight: 1.7, margin: "24px 0 8px" }}>
              We're genuinely excited to have you join us at our New Jersey offices. Don't hesitate to reach out with any questions at all — we're here to help.
            </p>
            <p style={{ color: "#1a1a2e", fontSize: 15, lineHeight: 1.7, margin: "0 0 4px" }}>
              Warmly,
            </p>
            <p style={{ color: "#1a1a2e", fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>
              Susie Levitt
            </p>
            <p style={{ color: "#64748B", fontSize: 13, margin: "0 0 2px" }}>
              (203) 313-3074
            </p>
            <p style={{ color: "#64748B", fontSize: 13, margin: 0 }}>
              <a href="mailto:susie@orendapsych.com" style={{ color: "#7C3AED", textDecoration: "none" }}>susie@orendapsych.com</a>
            </p>
          </div>

          {/* Minimal footer */}
          <div style={{ background: "#F8F7FC", borderTop: "1px solid #E9E5F5", padding: "16px 40px", textAlign: "center" as const }}>
            <p style={{ color: "#A1A1AA", fontSize: 11, margin: 0, fontStyle: "italic" }}>
              Orenda Psychiatry · New Jersey Offices
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
