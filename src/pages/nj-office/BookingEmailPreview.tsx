import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LOGO_URL = "https://dcankgdsjpuptevchncx.supabase.co/storage/v1/object/public/email-assets/orenda-logo-purple.png";

const loc = {
  address: "110 Fieldcrest Ave, 3rd Floor, Unit 328",
  city: "Edison, NJ 08837",
  phone: "(732) 782-0328",
  regusEmail: "Edison.Fieldcrest@regus.com",
  afterHours: "Both providers and patients must use the P1 Parking Level entrance, the entrance is around the back of the building. Access code: 05296.",
  wifiNetwork: "Regus",
  wifiPassword: "167785439",
  directions: "Enter through the main entrance during business hours (Mon–Fri, 8 AM – 6 PM). Take the elevator to the 3rd floor.",
  landmark: "Located near major highways with easy access from Route 287 and the NJ Turnpike.",
  parking: "Free parking available on-site.",
  lockboxCode: "0000",
};

export default function BookingEmailPreview() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const el = document.getElementById("email-preview-content");
    if (!el) return;
    try {
      const html = el.innerHTML;
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([el.innerText], { type: "text/plain" }),
        }),
      ]);
      setCopied(true);
      toast.success("Email HTML copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <Link to="/admin-v2/communication" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy Email HTML"}
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border overflow-hidden" id="email-preview-content">
          <div style={{ padding: "30px 25px", maxWidth: 600, margin: "0 auto", fontFamily: "Georgia, 'Times New Roman', serif" }}>
            <img src={LOGO_URL} alt="Orenda Psychiatry" width={140} style={{ marginBottom: 24 }} />

            {/* Header Banner */}
            <div style={{ backgroundColor: "#593D78", borderRadius: 12, padding: "28px 24px", textAlign: "center", marginBottom: 24 }}>
              <p style={{ fontSize: 11, color: "#d4c5e6", textTransform: "uppercase", letterSpacing: 2, margin: "0 0 6px", fontWeight: 600 }}>BOOKING CONFIRMED</p>
              <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#ffffff", margin: "0 0 6px" }}>Edison Office</h1>
              <p style={{ fontSize: 15, color: "#ffffff", margin: 0 }}>March 26, 2026 · Full Day (9 AM – 9 PM)</p>
            </div>

            {/* Greeting */}
            <p style={{ fontSize: 15, color: "#2d2d2d", lineHeight: 1.7, marginBottom: 24 }}>
              Dear Santria Chineme, thank you for booking your in-person office day. Here's everything you need for a smooth visit.
            </p>

            {/* Booking Details */}
            <div style={{ backgroundColor: "#f9f7fc", borderRadius: 12, padding: 20, marginBottom: 16, borderLeft: "4px solid #593D78" }}>
              <p style={{ fontSize: 14, fontWeight: "bold", color: "#593D78", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Booking Details</p>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr><td style={labelTd}>Date</td><td style={valueTd}>March 26, 2026</td></tr>
                  <tr><td style={labelTd}>Time Block</td><td style={valueTd}>Full Day (9 AM – 9 PM)</td></tr>
                  <tr><td style={labelTd}>Location</td><td style={valueTd}>Edison Office</td></tr>
                  <tr><td style={labelTd}>Address</td><td style={valueTd}>{loc.address}, {loc.city}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Getting There */}
            <div style={infoCard}>
              <p style={infoTitle}>Getting There</p>
              <p style={infoText}>{loc.directions}</p>
              <p style={infoText}><strong>Landmark:</strong> {loc.landmark}</p>
              <p style={infoText}><strong>Parking:</strong> {loc.parking}</p>
            </div>

            {/* Office Access */}
            <div style={{ backgroundColor: "#fff8f0", border: "1px solid #f0d4a8", borderRadius: 10, padding: "16px 18px", marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: "bold", color: "#B06A2F", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Office Access</p>
              <p style={infoText}><strong>Regus Office Hours:</strong> Mon–Fri, 9:00 AM – 5:00 PM</p>
              <p style={infoText}>During Regus hours, access the office key and swipe card from the lockbox outside the Orenda office door. <strong>Lockbox code: {loc.lockboxCode}</strong>. Please return both items when finished.</p>
              <p style={infoText}><strong>Tip:</strong> An additional swipe card is available inside the office — check the desk drawers if you need a backup during your visit.</p>
              <p style={{ fontSize: 13, color: "#B06A2F", lineHeight: 1.6, margin: "6px 0 10px", fontWeight: 600 }}>If attending the office outside of Regus hours, make sure you are set up with a permanent swipe card. You can coordinate this through the NJ Admin Team.</p>
            </div>

            {/* Patient Check-In */}
            <div style={infoCard}>
              <p style={infoTitle}>Patient Check-In</p>
              <p style={infoText}><strong>Outside of Regus office hours:</strong> Please place the <strong>Orenda Patient Welcome & Check-In sign</strong> by the entrance so that patients can text the NJ team upon arrival.</p>
              <p style={infoText}>You'll receive a notification when your patient has checked in.</p>
              <p style={infoText}>Patient schedules will be circulated by the NJ admin team the night before.</p>
            </div>

            {/* Wi-Fi */}
            <div style={{ backgroundColor: "#f0f7f4", border: "1px solid #c8e6d5", borderRadius: 10, padding: "16px 18px", marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: "bold", color: "#2E7D4F", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Wi-Fi & Amenities</p>
              <p style={infoText}><strong>Network:</strong> {loc.wifiNetwork}</p>
              <p style={infoText}><strong>Password:</strong> {loc.wifiPassword}</p>
              <p style={infoText}><strong>Amenities:</strong> Patient seating, weight scale, blood pressure cuff</p>
            </div>

            <hr style={{ borderColor: "#e8e0f0", margin: "24px 0" }} />

            {/* Contacts */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
              <tbody>
                <tr>
                  <td style={{ backgroundColor: "#f4f1f9", borderRadius: 10, padding: 14, verticalAlign: "top" }}>
                    <p style={{ fontSize: 11, fontWeight: "bold", color: "#593D78", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Orenda NJ Admin</p>
                    <p style={{ fontSize: 13, color: "#2d2d2d", margin: "0 0 2px" }}>(201) 685-4863</p>
                    <p style={{ fontSize: 13, color: "#2d2d2d", margin: 0 }}>offices@orendapsych.com</p>
                  </td>
                  <td style={{ width: 16 }} />
                  <td style={{ backgroundColor: "#faf9f5", borderRadius: 10, padding: 14, verticalAlign: "top" }}>
                    <p style={{ fontSize: 11, fontWeight: "bold", color: "#8B7335", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Regus Edison</p>
                    <p style={{ fontSize: 13, color: "#2d2d2d", margin: "0 0 2px" }}>{loc.phone}</p>
                    <p style={{ fontSize: 13, color: "#2d2d2d", margin: 0 }}>{loc.regusEmail}</p>
                  </td>
                </tr>
              </tbody>
            </table>

            <p style={{ fontSize: 15, color: "#2d2d2d", lineHeight: 1.6, marginBottom: 16 }}>
              We look forward to seeing you at the Edison office!
            </p>

            <p style={{ fontSize: 13, color: "#8E9196", marginTop: 20, lineHeight: 1.6 }}>
              Warm regards,<br />
              <strong>The New Jersey Admin Team</strong><br />
              201-685-4863 · offices@orendapsych.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelTd: React.CSSProperties = { fontSize: 13, color: "#8E9196", padding: "4px 12px 4px 0", verticalAlign: "top", width: 100 };
const valueTd: React.CSSProperties = { fontSize: 14, color: "#2d2d2d", padding: "4px 0", fontWeight: 600 };
const infoCard: React.CSSProperties = { backgroundColor: "#f9f7fc", border: "1px solid #e8e0f0", borderRadius: 10, padding: "16px 18px", marginBottom: 12 };
const infoTitle: React.CSSProperties = { fontSize: 13, fontWeight: "bold", color: "#593D78", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 };
const infoText: React.CSSProperties = { fontSize: 13, color: "#2d2d2d", lineHeight: 1.6, margin: "0 0 6px" };
