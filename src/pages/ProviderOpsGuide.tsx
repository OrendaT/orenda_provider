import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import orendaLogo from "@/assets/orenda-logo-purple.png";
import checkinQR from "@/assets/checkin-qr-code.png";
import {
  Download, Shield, Users, Wifi, KeyRound, ClipboardCheck,
  CalendarCheck, Bell, DoorOpen, ArrowRight, UserCheck,
  CheckCircle2, HeartPulse, Mail, AlertTriangle,
  Sparkles, Scale, Activity, Armchair, GlassWater, Coffee, Building2, Clock
} from "lucide-react";

import buildingExterior from "@/assets/hoboken/building-exterior.png";
import reception from "@/assets/hoboken/reception.png";
import kitchen from "@/assets/hoboken/kitchen.png";

const brand = "#1A0066";
const brandMid = "#3D1A99";
const brandLight = "#7B5FBF";
const babyBlue = "#B8D8EB";
const babyBluePale = "#E8F2F8";
const babyBlueMid = "#9CC5DD";
const iconBg = `linear-gradient(135deg, ${brand}, ${brandMid})`;
const iconBgBlue = `linear-gradient(135deg, ${babyBlueMid}, ${babyBlue})`;
const formLink = "/nj-office/check-in";
const signupLink = "https://docs.google.com/spreadsheets/d/1AlQMKY2BVwiY90PyGps3KXAXrEo23-dR/edit?usp=sharing&ouid=108976942397339672197&rtpof=true&sd=true";

const ProviderOpsGuide = () => {
  const posterRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async (format: "email" | "slack" | "poster") => {
    if (!posterRef.current) return;
    const configs = {
      email: { pixelRatio: 2, name: "provider-ops-guide-email" },
      slack: { pixelRatio: 2, name: "provider-ops-guide-slack" },
      poster: { pixelRatio: 3, name: "provider-ops-guide-poster" },
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
  }, []);

  // ── Compact components ──

  const IconCircle = ({ icon: Icon, bg, size = 28 }: { icon: any; bg: string; size?: number }) => (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: bg,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    }}>
      <Icon size={size * 0.42} color="white" strokeWidth={2.2} />
    </div>
  );

  const MiniStep = ({ num, title, icon: Icon }: { num: number; title: string; icon: any }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
      <div style={{
        width: 24, height: 24, borderRadius: "50%", background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
        flexShrink: 0,
      }}>
        <Icon size={11} color="white" strokeWidth={2.2} />
        <div style={{
          position: "absolute", top: -3, right: -5, width: 14, height: 14,
          borderRadius: "50%", background: babyBlue, border: "2px solid white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 7, fontWeight: 800, color: brand,
        }}>{num}</div>
      </div>
      <div style={{ fontSize: 9.5, fontWeight: 600, color: "#333" }}>{title}</div>
    </div>
  );

  const Chip = ({ icon: Icon, label, bg, iBg }: { icon: any; label: string; bg: string; iBg: string }) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "8px 10px", borderRadius: 8, background: bg,
      border: `1px solid ${babyBluePale}`,
    }}>
      <IconCircle icon={Icon} bg={iBg} size={24} />
      <div style={{ fontSize: 8.5, fontWeight: 600, color: "#333", lineHeight: 1.25 }}>{label}</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F0F0F5", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px" }}>
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
          fontFamily: "'Montserrat', sans-serif", background: "white",
        }}
      >
        {/* Top accent */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${brand}, ${brandMid}, ${babyBlue}, ${brandMid}, ${brand})` }} />

        {/* COMPACT HERO — split layout with image */}
        <div style={{ display: "flex", height: 150 }}>
          <div style={{
            flex: 1, background: `linear-gradient(135deg, ${brand}, ${brandMid})`,
            padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
            <img src={orendaLogo} alt="Orenda" style={{ width: 110, filter: "brightness(0) invert(1)", marginBottom: 10 }} />
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, color: "white", lineHeight: 1.2 }}>
              Provider Operations Guide
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", marginTop: 4, fontWeight: 500, letterSpacing: 0.5 }}>
              Hoboken Office · In-Person Visits
            </div>
          </div>
          <div style={{ width: 220, overflow: "hidden" }}>
            <img src={buildingExterior} alt="221 River Street" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%" }} />
          </div>
        </div>

        <div style={{ padding: "16px 24px 0" }}>

          {/* Quick ref bar */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 14,
          }}>
            {[
              { icon: CalendarCheck, value: "Sign Up in Advance", color: iconBg },
              { icon: DoorOpen, value: "Office 9076", color: iconBgBlue },
              { icon: Building2, value: "9th Floor", color: iconBg },
            ].map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
                borderRadius: 8, background: i % 2 === 0 ? babyBluePale : "#F3EEFF",
                border: `1px solid ${babyBluePale}`,
              }}>
                <IconCircle icon={s.icon} bg={s.color} size={26} />
                <div style={{ fontSize: 9, fontWeight: 700, color: brand }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Two-column: Scheduling + Access side-by-side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>

            {/* Scheduling */}
            <div style={{
              background: "white", borderRadius: 12, padding: "14px 14px",
              border: `1px solid ${babyBluePale}`, boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <IconCircle icon={CalendarCheck} bg={iconBg} size={20} />
                <div style={{ fontSize: 9, fontWeight: 700, color: brand, textTransform: "uppercase", letterSpacing: 1 }}>Scheduling</div>
              </div>
              <div style={{ fontSize: 9, color: "#444", lineHeight: 1.6 }}>
                <strong style={{ color: brand }}>Sign up in advance</strong> for your office day. Schedule patients for the <strong style={{ color: brand }}>same day</strong>. Don't assume access is arranged.
              </div>
              <a href={signupLink} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "center", gap: 5, marginTop: 8,
                padding: "6px 10px", borderRadius: 6,
                background: `linear-gradient(135deg, ${brand}, ${brandMid})`,
                color: "white", fontWeight: 700, fontSize: 8.5, textDecoration: "none",
              }}>
                <CalendarCheck size={10} /> Open Sign-Up Sheet <ArrowRight size={8} />
              </a>
            </div>

            {/* Building Access */}
            <div style={{
              background: "white", borderRadius: 12, padding: "14px 14px",
              border: `1px solid ${babyBluePale}`, boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <IconCircle icon={Shield} bg={iconBgBlue} size={20} />
                <div style={{ fontSize: 9, fontWeight: 700, color: brand, textTransform: "uppercase", letterSpacing: 1 }}>Building Access</div>
              </div>
              <div style={{ fontSize: 9, color: "#444", lineHeight: 1.6 }}>
                Email NJ admin <strong style={{ color: brand }}>24hrs ahead</strong> with date, time & patient names so they can be added to the security list.
              </div>
              <div style={{
                marginTop: 8, padding: "6px 8px", borderRadius: 6,
                background: "#F3EEFF", border: `1px solid ${brandLight}30`,
                fontSize: 8.5, color: "#666", lineHeight: 1.5, fontStyle: "italic",
              }}>
                NJ Admin Email: <span style={{ color: brand, fontWeight: 600 }}>[Pending]</span>
              </div>
            </div>
          </div>

          {/* Arrival Steps — horizontal compact */}
          <div style={{
            background: "white", borderRadius: 12, padding: "14px 16px", marginBottom: 14,
            border: `1px solid ${babyBluePale}`, boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <IconCircle icon={DoorOpen} bg={iconBg} size={20} />
              <div style={{ fontSize: 9, fontWeight: 700, color: brand, textTransform: "uppercase", letterSpacing: 1 }}>Arrival & Entry</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
              <MiniStep num={1} icon={UserCheck} title="Bring valid photo ID" />
              <MiniStep num={2} icon={Shield} title="Check in at lobby security" />
              <MiniStep num={3} icon={CheckCircle2} title="Receive building pass" />
              <MiniStep num={4} icon={DoorOpen} title="Proceed to Office 9076" />
              <MiniStep num={5} icon={KeyRound} title="Get key from lockbox" />
            </div>

            {/* Lockbox code inline */}
            <div style={{
              marginTop: 8, background: `linear-gradient(135deg, ${brand}, ${brandMid})`,
              borderRadius: 8, padding: "10px 14px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <KeyRound size={16} color="white" strokeWidth={2} />
              <div>
                <span style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Lockbox Code </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "white", letterSpacing: 3, marginLeft: 6 }}>7123</span>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 8, color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>Return after visit</div>
            </div>
          </div>

          {/* Photo strip + Office Setup in one row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {/* Office photo */}
            <div style={{
              borderRadius: 12, overflow: "hidden", position: "relative",
              border: `1px solid ${babyBluePale}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}>
              <img src={reception} alt="Reception" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 140 }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                background: "linear-gradient(transparent, rgba(26,0,102,0.75))",
                padding: "20px 10px 8px", textAlign: "center",
              }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: 1 }}>Riverfront Center</div>
              </div>
            </div>

            {/* Office equipment */}
            <div style={{
              background: "white", borderRadius: 12, padding: "12px",
              border: `1px solid ${babyBluePale}`, boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <IconCircle icon={Armchair} bg={iconBg} size={18} />
                <div style={{ fontSize: 8, fontWeight: 700, color: brand, textTransform: "uppercase", letterSpacing: 1 }}>Orenda Private Office Set-Up</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                <Chip icon={Armchair} label="Patient Seating" bg={babyBluePale} iBg={iconBg} />
                <Chip icon={GlassWater} label="Water & Coffee" bg="#F3EEFF" iBg={iconBgBlue} />
                <Chip icon={Scale} label="Scale" bg="#F3EEFF" iBg={iconBg} />
                <Chip icon={Activity} label="BP Cuff" bg={babyBluePale} iBg={iconBgBlue} />
              </div>
              <div style={{ fontSize: 7.5, color: "#888", marginTop: 6, lineHeight: 1.4 }}>
                Regus coffee not included — stocked beverages available for patients.
              </div>
            </div>
          </div>

          {/* Wi-Fi — single line */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
            borderRadius: 10, background: `linear-gradient(135deg, ${brand}06, ${babyBluePale})`,
            border: `1px solid ${babyBlue}40`, marginBottom: 14,
          }}>
            <IconCircle icon={Wifi} bg={iconBg} size={30} />
            <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 8, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Network</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: brand }}>Regus Net Wi-Fi</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 8, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Password</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: brand, letterSpacing: 1.5 }}>167845630</div>
              </div>
            </div>
          </div>

          {/* Patient Check-In — compact with QR */}
          <div style={{
            background: `linear-gradient(135deg, ${brand}, ${brandMid})`,
            borderRadius: 12, padding: "16px 18px", marginBottom: 14,
            display: "flex", alignItems: "center", gap: 16,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
            <a href={formLink} target="_blank" rel="noopener noreferrer" style={{
              background: "white", borderRadius: 10, padding: 6, display: "block", flexShrink: 0,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            }}>
              <img src={checkinQR} alt="Check-in QR" style={{ width: 80, height: 80, display: "block" }} />
            </a>
            <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
              <div style={{ fontSize: 8, color: babyBlue, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 }}>Patient Check-In</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "white", lineHeight: 1.3, marginBottom: 3 }}>
                Patients scan QR or tap to check in on arrival
              </div>
              <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.6)", marginBottom: 8, lineHeight: 1.4 }}>
                10 min early · Valid ID · Lobby security first
              </div>
              <a href={formLink} target="_blank" rel="noopener noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: "white", color: brand, fontWeight: 700, fontSize: 8.5,
                padding: "5px 12px", borderRadius: 5, textDecoration: "none",
              }}>
                Open Form <ArrowRight size={9} />
              </a>
            </div>
          </div>

          {/* Escort warning */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
            borderRadius: 8, background: "#FFF8ED", border: "1px solid #F5D89A50", marginBottom: 14,
          }}>
            <AlertTriangle size={12} color="#E8A838" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 9, color: "#8B6914", lineHeight: 1.4 }}>
              <strong>Escort patients</strong> from waiting area — they should not move around the coworking space unaccompanied.
            </div>
          </div>

          {/* Bottom row: Coverage + End of Visit + Follow-up */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>

            {/* Coverage */}
            <div style={{
              background: "white", borderRadius: 12, padding: "12px 14px",
              border: `1px solid ${babyBluePale}`, boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <IconCircle icon={Users} bg={iconBgBlue} size={18} />
                <div style={{ fontSize: 8, fontWeight: 700, color: brand, textTransform: "uppercase", letterSpacing: 1 }}>Coverage</div>
              </div>
              <div style={{ fontSize: 9, color: "#444", lineHeight: 1.6 }}>
                Approved covering providers may see patients if needed. Email NJ admin to coordinate scheduling.
              </div>
            </div>

            {/* End of Visit */}
            <div style={{
              background: "white", borderRadius: 12, padding: "12px 14px",
              border: `1px solid ${babyBluePale}`, boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <IconCircle icon={CheckCircle2} bg={iconBg} size={18} />
                <div style={{ fontSize: 8, fontWeight: 700, color: brand, textTransform: "uppercase", letterSpacing: 1 }}>End of Visit</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 3 }}>
                {["Return key to lockbox", "Leave office clean", "Dispose of trash", "Reset for next provider"].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 8.5, color: "#444" }}>
                    <CheckCircle2 size={9} color={brandLight} strokeWidth={2.5} />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Follow-up — compact */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
            borderRadius: 10, background: `linear-gradient(135deg, ${brand}06, ${babyBluePale})`,
            border: `1px solid ${babyBlue}40`, marginBottom: 10,
          }}>
            <IconCircle icon={HeartPulse} bg={iconBg} size={28} />
            <div style={{ fontSize: 9.5, color: "#333", lineHeight: 1.6 }}>
              Schedule patient follow-up with <strong style={{ color: brand }}>original provider via telehealth</strong> unless another in-person visit is clinically required.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "6px 24px 14px" }}>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${babyBlue}80, transparent)`, marginBottom: 8 }} />
          <div style={{ fontSize: 9, color: brand, fontWeight: 600, letterSpacing: 1 }}>orendapsych.com</div>
        </div>

        {/* Bottom accent */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${brand}, ${brandMid}, ${babyBlue}, ${brandMid}, ${brand})` }} />
      </div>
    </div>
  );
};

export default ProviderOpsGuide;
