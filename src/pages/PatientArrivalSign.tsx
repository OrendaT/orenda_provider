import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { motion } from "framer-motion";
import { Download, Phone, Mail, MessageSquare, MapPin, Building2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import buildingImg from "@/assets/edison-building-glass.png";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

const PatientArrivalSign = () => {
  const exportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!exportRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, { pixelRatio: 4 });
      const link = document.createElement("a");
      link.download = "orenda-patient-arrival-sign-11x17.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Sticky download bar */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-foreground tracking-tight">Patient Arrival Sign</h1>
            <p className="text-xs text-muted-foreground">11″ × 17″ Ledger · Download as PNG</p>
          </div>
          <Button size="sm" onClick={handleExport} disabled={exporting} className="shadow-md">
            <Download className="w-4 h-4 mr-1.5" />
            {exporting ? "Exporting…" : "Download PNG"}
          </Button>
        </div>
      </div>

      {/* ─── Exportable sign ─── */}
      <div className="py-10 px-4 flex justify-center">
        <div className="overflow-auto">
          <div
            ref={exportRef}
            style={{
              width: 1056,
              height: 1632,
              background: "#ffffff",
              fontFamily: "'Segoe UI', system-ui, sans-serif",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* ── Hero: Building Image ── */}
            <div style={{ position: "relative", width: "100%", height: 480, flexShrink: 0, overflow: "hidden" }}>
              <img
                src={buildingImg}
                alt="Edison Raritan Plaza"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%", display: "block" }}
              />
              {/* Gradient overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%)",
              }} />
              {/* Location badge */}
              <div style={{
                position: "absolute", top: 32, left: 40,
                background: "rgba(255,255,255,0.95)", borderRadius: 12,
                padding: "10px 20px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#5b21b6", letterSpacing: "-0.3px" }}>
                  ORENDA PSYCHIATRY
                </p>
              </div>
              {/* Address overlay */}
              <div style={{ position: "absolute", bottom: 28, left: 40, right: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <MapPin size={16} color="rgba(255,255,255,0.8)" />
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500 }}>
                    110 Fieldcrest Avenue, 3rd Floor · Edison, NJ 08837
                  </p>
                </div>
              </div>
            </div>

            {/* ── Lavender transition section ── */}
            <div style={{
              background: "linear-gradient(180deg, hsl(270, 60%, 95%) 0%, #ffffff 100%)",
              padding: "48px 60px 40px",
              textAlign: "center",
            }}>
              <p style={{
                fontSize: 11, letterSpacing: "0.45em", textTransform: "uppercase",
                color: "#7c3aed", fontWeight: 600, marginBottom: 16, margin: "0 0 16px",
              }}>
                Patient Arrival
              </p>
              <h1 style={{
                fontSize: 56, fontWeight: 300, color: "#1a1a2e", lineHeight: 1.1,
                margin: "0 0 6px", letterSpacing: "-1.5px",
              }}>
                Here for <em style={{ fontStyle: "italic", color: "#7c3aed" }}>Orenda Psychiatry?</em>
              </h1>
              <div style={{ width: 56, height: 2, background: "rgba(124,58,237,0.3)", margin: "24px auto 0", borderRadius: 2 }} />
            </div>

            {/* ── Main CTA card ── */}
            <div style={{ padding: "0 60px", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{
                background: "#0f0f1a", borderRadius: 20, padding: "48px 48px 40px",
                color: "#fff", textAlign: "center",
              }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 16,
                  background: "rgba(124,58,237,0.25)", borderRadius: 16,
                  padding: "16px 36px", marginBottom: 24,
                }}>
                  <MessageSquare size={56} color="#a78bfa" />
                  <span style={{ fontSize: 60, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#a78bfa" }}>
                    Text Us
                  </span>
                </div>

                <p style={{ fontSize: 66, fontWeight: 500, color: "rgba(255,255,255,0.85)", margin: "0 0 28px", lineHeight: 1.2 }}>
                  Please text us to let us know<br />you've arrived
                </p>

                {/* Phone number */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.08))",
                  borderRadius: 20, padding: "32px 52px", display: "inline-block",
                  border: "1px solid rgba(124,58,237,0.25)", marginBottom: 24,
                }}>
                  <p style={{ margin: 0, fontSize: 72, fontWeight: 800, color: "#fff", letterSpacing: "3px", lineHeight: 1 }}>
                    (201) 685-4863
                  </p>
                </div>

                <p style={{
                  fontSize: 52, fontWeight: 400, color: "rgba(255,255,255,0.7)",
                  margin: 0, lineHeight: 1.3,
                }}>
                  Our team will be with you shortly.
                </p>
              </div>

              {/* Spacer */}
              <div style={{ flex: 1, minHeight: 16 }} />

              {/* ── Contact info footer — editorial style ── */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: 0,
                borderRadius: 16, overflow: "hidden", marginBottom: 32,
                border: "1px solid hsl(270, 20%, 90%)",
              }}>
                {/* Phone */}
                <div style={{ padding: "28px 32px", background: "hsl(270, 40%, 97%)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: "hsl(270, 60%, 92%)", display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      <Phone size={18} color="#7c3aed" />
                    </div>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "#7c3aed" }}>
                      Phone
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a1a2e" }}>
                    (201) 685-4863
                  </p>
                </div>

                {/* Divider */}
                <div style={{ background: "hsl(270, 20%, 88%)" }} />

                {/* Email */}
                <div style={{ padding: "28px 32px", background: "hsl(270, 40%, 97%)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: "hsl(270, 60%, 92%)", display: "flex",
                      alignItems: "center", justifyContent: "center",
                    }}>
                      <Mail size={18} color="#7c3aed" />
                    </div>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "#7c3aed" }}>
                      Email
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#1a1a2e" }}>
                    offices@orendapsych.com
                  </p>
                </div>
              </div>

              {/* Brand footer */}
              <div style={{ textAlign: "center", paddingBottom: 36 }}>
                <div style={{ width: 40, height: 1, background: "hsl(270, 20%, 85%)", margin: "0 auto 14px", borderRadius: 1 }} />
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, letterSpacing: "0.35em", color: "#a0a0b0", textTransform: "uppercase" }}>
                  Orenda Psychiatry &nbsp;·&nbsp; orendapsych.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientArrivalSign;
