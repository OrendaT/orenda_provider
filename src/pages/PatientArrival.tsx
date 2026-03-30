import { useRef, useCallback, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import orendaLogo from "@/assets/orenda-logo-purple.png";
import checkinQR from "@/assets/checkin-qr-code.png";
import { Download, MapPin, Clock, Phone, Mail, Building2, UserCheck, ArrowRight, Shield } from "lucide-react";

const brand = "#1A0066";
const brandMid = "#3D1A99";
const brandLight = "#7B5FBF";
const babyBlue = "#B8D8EB";
const babyBluePale = "#E8F2F8";
const babyBlueMid = "#9CC5DD";
const iconBg = `linear-gradient(135deg, ${brand}, ${brandMid})`;
const formLink = "/nj-office/check-in";
const hobokenMapLink = "https://www.google.com/maps/search/?api=1&query=221+River+Street+Hoboken+NJ+07030";

type Version = "spruce" | "email";

const PatientArrival = () => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [version, setVersion] = useState<Version>("spruce");

  const handleDownload = useCallback(async (format: "email" | "slack" | "poster") => {
    if (!posterRef.current) return;
    const configs = {
      email: { pixelRatio: 2, name: `patient-arrival-${version}-email` },
      slack: { pixelRatio: 2, name: `patient-arrival-${version}-slack` },
      poster: { pixelRatio: 3, name: `patient-arrival-${version}-poster` },
    };
    const c = configs[format];
    try {
      await toPng(posterRef.current, { cacheBust: true });
      await toPng(posterRef.current, { cacheBust: true });
      await new Promise(r => setTimeout(r, 300));
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: c.pixelRatio, cacheBust: true, backgroundColor: "#FFFFFF",
        width: posterRef.current.scrollWidth, height: posterRef.current.scrollHeight,
      });
      const link = document.createElement("a");
      link.download = `${c.name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) { console.error("Download failed:", err); }
  }, [version]);

  const isSpruce = version === "spruce";

  return (
    <div style={{ minHeight: "100vh", background: "#F0F0F5", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px" }}>
      {/* Version toggle */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "white", borderRadius: 10, padding: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        {(["spruce", "email"] as Version[]).map(v => (
          <button
            key={v}
            onClick={() => setVersion(v)}
            style={{
              padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, transition: "all 0.2s",
              background: version === v ? brand : "transparent",
              color: version === v ? "white" : "#666",
            }}
          >
            {v === "spruce" ? "Spruce Version" : "Email Version"}
          </button>
        ))}
      </div>

      {/* Download buttons */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", justifyContent: "center" }}>
        <Button onClick={() => handleDownload("email")} className="gap-2" size="lg" style={{ background: brand }}>
          <Download className="w-4 h-4" /> Email
        </Button>
        <Button onClick={() => handleDownload("slack")} className="gap-2" size="lg" variant="outline" style={{ borderColor: brand, color: brand }}>
          <Download className="w-4 h-4" /> Slack
        </Button>
        <Button onClick={() => handleDownload("poster")} className="gap-2" size="lg" variant="outline" style={{ borderColor: brand, color: brand }}>
          <Download className="w-4 h-4" /> Poster
        </Button>
      </div>

      <div
        ref={posterRef}
        style={{
          width: 600, position: "relative", overflow: "hidden",
          fontFamily: "'Montserrat', sans-serif",
          background: "white",
        }}
      >
        {/* Top accent */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${brand}, ${brandMid}, ${babyBlue}, ${brandMid}, ${brand})` }} />

        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${brand}, ${brandMid})`,
          padding: isSpruce ? "28px 36px 24px" : "32px 36px 28px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ position: "absolute", bottom: -20, right: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

          <img src={orendaLogo} alt="Orenda Psychiatry" style={{ width: 140, filter: "brightness(0) invert(1)", marginBottom: 14 }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: isSpruce ? 22 : 26, fontWeight: 700, color: "white", lineHeight: 1.2 }}>
            {isSpruce ? "In-Person Appointment" : "Your In-Person Appointment"}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 5, fontWeight: 500 }}>
            {isSpruce ? "Hoboken Office · Arrival Instructions" : "Hoboken Office · Patient Arrival Guide"}
          </div>
        </div>

        <div style={{ padding: isSpruce ? "20px 36px" : "24px 36px" }}>

          {/* Location Card */}
          <div style={{
            background: `linear-gradient(135deg, ${brand}06, ${babyBluePale})`,
            borderRadius: 14, padding: "16px 20px", marginBottom: 16,
            border: `1px solid ${babyBlue}50`,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 11, background: iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(26,0,102,0.2)", flexShrink: 0,
            }}>
              <MapPin size={20} color="white" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 9, color: brand, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 3 }}>Office Location</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#222", lineHeight: 1.4 }}>221 River Street, 9th Floor, Office 9076</div>
              <div style={{ fontSize: 11, color: "#555" }}>Hoboken, NJ 07030</div>
              <a href={hobokenMapLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: 9, color: brandMid, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3, marginTop: 4 }}>
                📍 View on Google Maps <ArrowRight size={9} />
              </a>
            </div>
          </div>

          {/* Arrival Steps */}
          <div style={{
            background: "white", borderRadius: 14, padding: "18px 20px", marginBottom: 16,
            border: `1px solid ${babyBluePale}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 3, height: 18, borderRadius: 2, background: `linear-gradient(180deg, ${brand}, ${babyBlue})` }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: brand, textTransform: "uppercase", letterSpacing: 1.5 }}>Arrival Instructions</div>
            </div>

            {[
              { icon: Clock, num: 1, title: "Arrive 15 Minutes Early", desc: "Please arrive before your scheduled appointment time." },
              { icon: UserCheck, num: 2, title: "Bring a Valid Photo ID", desc: "You'll need this to check in with building security." },
              { icon: Shield, num: 3, title: "Check In at the Lobby Security Desk", desc: "The security team will verify your name and provide access." },
              { icon: Building2, num: 4, title: "Take the Elevator to the 9th Floor", desc: "Our office is located on the 9th floor of the building." },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 4 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", background: iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 3px 10px rgba(26,0,102,0.2)", position: "relative",
                  }}>
                    <step.icon size={13} color="white" strokeWidth={2.2} />
                    <div style={{
                      position: "absolute", top: -4, right: -4, width: 15, height: 15,
                      borderRadius: "50%", background: babyBlue, border: "2px solid white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 8, fontWeight: 800, color: brand,
                    }}>{step.num}</div>
                  </div>
                  {i < 3 && <div style={{ width: 2, height: 18, background: `linear-gradient(180deg, ${brandMid}30, ${babyBlue}30)` }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: brand, marginBottom: 2 }}>{step.title}</div>
                  <div style={{ fontSize: 10, color: "#444", lineHeight: 1.55 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* QR Check-In Section */}
          <div style={{
            background: `linear-gradient(135deg, ${brand}, ${brandMid})`,
            borderRadius: 14, padding: isSpruce ? "20px" : "24px", marginBottom: 16,
            boxShadow: "0 6px 24px rgba(26,0,102,0.25)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 10, color: babyBlue, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
                Check In When You Arrive
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: isSpruce ? 17 : 20, fontWeight: 700, color: "white", lineHeight: 1.3, marginBottom: 4 }}>
                Scan to Complete Your<br />Digital Check-In
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginBottom: 16, lineHeight: 1.5 }}>
                Let your provider know you've arrived
              </div>

              <a href={formLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block" }}>
                <div style={{
                  background: "white", borderRadius: 14, padding: 12,
                  display: "inline-block",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                }}>
                  <img src={checkinQR} alt="Scan to check in" style={{ width: isSpruce ? 140 : 160, height: isSpruce ? 140 : 160, display: "block" }} />
                </div>
              </a>

              <div style={{ marginTop: 14 }}>
                <a href={formLink} target="_blank" rel="noopener noreferrer" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "white", color: brand, fontWeight: 700, fontSize: 10,
                  padding: "9px 22px", borderRadius: 8, textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                }}>
                  Open Check-In Form <ArrowRight size={11} />
                </a>
              </div>
            </div>
          </div>

          {/* Waiting area note */}
          <div style={{
            padding: "12px 16px", borderRadius: 10, marginBottom: 16,
            background: `linear-gradient(135deg, ${brand}06, ${babyBluePale}80)`,
            border: `1px solid ${babyBlue}40`,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: `linear-gradient(135deg, ${babyBlueMid}, ${babyBlue})`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <UserCheck size={13} color="white" strokeWidth={2.2} />
            </div>
            <div style={{ fontSize: 10.5, color: "#444", lineHeight: 1.6 }}>
              After checking in, please wait in the designated waiting area. Your provider will come out to greet you.
            </div>
          </div>

          {/* Need Help — blank contact fields */}
          <div style={{
            background: `linear-gradient(135deg, ${brand}06, ${babyBluePale})`,
            borderRadius: 14, padding: "16px 20px", marginBottom: 16,
            border: `1px solid ${babyBlue}50`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 3, height: 18, borderRadius: 2, background: `linear-gradient(180deg, ${brand}, ${brandLight})` }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: brand, textTransform: "uppercase", letterSpacing: 1.5 }}>Need Help?</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{
                background: "white", borderRadius: 10, padding: "14px 16px",
                border: `1px solid ${babyBlue}40`,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9, background: iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Mail size={15} color="white" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Email</div>
                  <div style={{ fontSize: 10, color: "#666", fontStyle: "italic", marginTop: 2 }}>Pending NJ admin email</div>
                </div>
              </div>
              <div style={{
                background: "white", borderRadius: 10, padding: "14px 16px",
                border: `1px solid ${babyBlue}40`,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: `linear-gradient(135deg, ${babyBlueMid}, ${babyBlue})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Phone size={15} color="white" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Phone</div>
                  <div style={{ fontSize: 10, color: "#666", fontStyle: "italic", marginTop: 2 }}>Pending Spruce Dedicated #</div>
                </div>
              </div>
            </div>
          </div>

          {/* Closing */}
          <div style={{ fontSize: 11, color: "#333", lineHeight: 1.8, marginBottom: 6 }}>
            We look forward to seeing you.
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: brand }}>
            Orenda Psychiatry
          </div>

        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "8px 36px 18px" }}>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${babyBlue}80, transparent)`, marginBottom: 10 }} />
          <div style={{ fontSize: 9.5, color: brand, fontWeight: 600, letterSpacing: 1 }}>orendapsych.com</div>
          <div style={{ fontSize: 8.5, color: "#666", marginTop: 3, fontStyle: "italic" }}>Compassionate care, conveniently located on the Hoboken waterfront</div>
        </div>

        {/* Bottom accent */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${brand}, ${brandMid}, ${babyBlue}, ${brandMid}, ${brand})` }} />
      </div>
    </div>
  );
};

export default PatientArrival;
