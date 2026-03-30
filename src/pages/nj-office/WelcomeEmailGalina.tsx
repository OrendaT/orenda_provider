import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Copy, Check, FileSpreadsheet, Calendar } from "lucide-react";
import { downloadProviderWelcomeXlsx } from "@/utils/welcomeEmailExport";
import { downloadPatientScheduleXlsx, type BookedDate } from "@/utils/patientScheduleExport";
import brandedMapImg from "@/assets/hoboken-map-branded.png";
import edisonMapImg from "@/assets/edison-map-branded.png";

const PROVIDER = {
  providerName: "Galina",
  bookingDate: "Tuesday, April 8, 2026",
  bookingTime: "Full Day",
  appointmentTime: "1:00 PM",
  onboardingDate: "March 26, 2026",
  patientCalendarLink: "[Patient Calendar Link]",
  googleMeetLink: "",
};

const BOOKED_DATES: BookedDate[] = [
  { date: "Tuesday, April 8, 2026", location: "Edison", timeBlock: "Full Day (8 AM – 9 PM)" },
  { date: "Tuesday, April 22, 2026", location: "Edison", timeBlock: "Full Day (8 AM – 9 PM)" },
  { date: "Thursday, April 24, 2026", location: "Edison", timeBlock: "8 AM – 4 PM" },
  { date: "Thursday, May 1, 2026", location: "Edison", timeBlock: "8 AM – 4 PM" },
  { date: "Tuesday, May 6, 2026", location: "Edison", timeBlock: "Full Day (8 AM – 9 PM)" },
];

export default function WelcomeEmailGalina() {
  const emailRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
      link.download = "Welcome-Email-Galina.png";
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

  return (
    <div className="min-h-screen bg-[hsl(270,15%,96%)] font-body">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Welcome Email — Galina</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadPatientScheduleXlsx({ providerName: PROVIDER.providerName, bookedDates: BOOKED_DATES })}
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              Patient Schedule
            </button>
            <button
              onClick={() => downloadProviderWelcomeXlsx(PROVIDER)}
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
              Hi <strong>{PROVIDER.providerName}</strong>,
            </p>
            <p style={{ color: "#1a1a2e", fontSize: 15, lineHeight: 1.7, margin: "0 0 18px" }}>
              Thank you so much for scheduling your first in-person office day at our New Jersey office on <strong>{PROVIDER.bookingDate}</strong> ({PROVIDER.bookingTime}) — we're thrilled to have you! 🎉
            </p>
            <p style={{ color: "#1a1a2e", fontSize: 15, lineHeight: 1.7, margin: "0 0 18px" }}>
              We also have you booked for the below dates, and we'll be working to ensure you have an easy process:
            </p>
            <ul style={{ color: "#1a1a2e", fontSize: 14, lineHeight: 1.7, margin: "0 0 18px", paddingLeft: 20 }}>
              {BOOKED_DATES.map((bd, i) => (
                <li key={i}>{bd.date} — <span style={{ color: "#7C3AED", fontWeight: 600 }}>{bd.location}</span>{bd.timeBlock ? ` (${bd.timeBlock})` : ""}</li>
              ))}
            </ul>
            <p style={{ color: "#1a1a2e", fontSize: 15, lineHeight: 1.7, margin: "0 0 18px" }}>
              Here are a few things to know:
            </p>

            {/* Key info cards */}
            <div style={{ margin: "24px 0" }}>
              {/* Onboarding Meeting */}
              <div style={{ background: "#F5F3FF", borderRadius: 12, padding: "20px 24px", marginBottom: 12, borderLeft: "4px solid #7C3AED" }}>
                <p style={{ color: "#7C3AED", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 6px" }}>📅 Simple Practice Calendar</p>
                <p style={{ color: "#1a1a2e", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  <strong>{PROVIDER.appointmentTime}</strong> on <strong>{PROVIDER.onboardingDate}</strong> has been blocked on your Simple Practice calendar for our onboarding meeting. A calendar invite with the Google Meet link has also been sent to you.
                </p>
              </div>

              {/* Patient Calendar */}
              <div style={{ background: "#F5F3FF", borderRadius: 12, padding: "20px 24px", marginBottom: 12, borderLeft: "4px solid #7C3AED" }}>
                <p style={{ color: "#7C3AED", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 6px" }}>📋 Your Appointment Bookings</p>
                <p style={{ color: "#1a1a2e", fontSize: 14, lineHeight: 1.6, margin: "0 0 10px" }}>
                  Here is a link to your appointment bookings. However, please note that our team is still working on adding those appointments to the template. This will be circulated to you the night before your appointments.
                </p>
                <a href={PROVIDER.patientCalendarLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#7C3AED", color: "#ffffff", fontSize: 13, fontWeight: 600, padding: "10px 20px", borderRadius: 8, textDecoration: "none" }}>
                  View Appointment Bookings →
                </a>
              </div>

              {/* Office Agreement */}
              <div style={{ background: "#FFF7ED", borderRadius: 12, padding: "20px 24px", marginBottom: 12, borderLeft: "4px solid #F59E0B" }}>
                <p style={{ color: "#D97706", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 6px" }}>📝 Office Agreement</p>
                <p style={{ color: "#1a1a2e", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  Before your first visit, please review and sign the office agreement. It should have been sent to your email. If you have any questions, please don't hesitate to reach out.
                </p>
              </div>

              {/* FAQ */}
              <div style={{ background: "#F5F3FF", borderRadius: 12, padding: "20px 24px", marginBottom: 12, borderLeft: "4px solid #7C3AED" }}>
                <p style={{ color: "#7C3AED", fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", margin: "0 0 6px" }}>📚 FAQ & Key Information</p>
                <p style={{ color: "#1a1a2e", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  An FAQ section is being put together and will be rolled out at a later date, so you'll have access to all the key information you need in one place.
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
              
              <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E9E5F5", marginBottom: 16 }}>
                <img src={`${window.location.origin}${brandedMapImg}`} alt="Hoboken Office Map" style={{ width: "100%", display: "block" }} crossOrigin="anonymous" />
                <div style={{ padding: "16px 20px", background: "#FAFAFE" }}>
                  <p style={{ color: "#1a1a2e", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>Hoboken — Regus Riverfront Center</p>
                  <p style={{ color: "#64748B", fontSize: 13, margin: "0 0 2px" }}>221 River Street, 9th Floor, Unit 9076</p>
                  <p style={{ color: "#64748B", fontSize: 13, margin: "0 0 12px" }}>Hoboken, NJ 07030</p>
                  <a href="https://www.google.com/maps/search/?api=1&query=221+River+Street+Hoboken+NJ+07030" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", color: "#7C3AED", fontSize: 13, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid #7C3AED" }}>
                    View on Google Maps →
                  </a>
                </div>
              </div>

              <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E9E5F5" }}>
                <img src={`${window.location.origin}${edisonMapImg}`} alt="Edison Office Map" style={{ width: "100%", display: "block" }} crossOrigin="anonymous" />
                <div style={{ padding: "16px 20px", background: "#FAFAFE" }}>
                  <p style={{ color: "#1a1a2e", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>Edison — Regus Fieldcrest</p>
                  <p style={{ color: "#64748B", fontSize: 13, margin: "0 0 2px" }}>110 Fieldcrest Avenue, 3rd Floor, Unit 328</p>
                  <p style={{ color: "#64748B", fontSize: 13, margin: "0 0 12px" }}>Edison, NJ 08837</p>
                  <a href="https://www.google.com/maps/search/?api=1&query=110+Fieldcrest+Avenue+Edison+NJ+08837" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", color: "#7C3AED", fontSize: 13, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid #7C3AED" }}>
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
