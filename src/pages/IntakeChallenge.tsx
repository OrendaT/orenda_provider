import { useRef } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import orendaLogo from "@/assets/orenda-logo-v2.png";

/* ───────── constants ───────── */
const ff = "'Montserrat', sans-serif";
const ffDisplay = "'Playfair Display', serif";
const purple = "#4B1F8C";
const purpleLight = "#6D3BBF";
const muted = "#6B5B8A";
const gold = "#D4A017";
const silver = "#8C8C8C";
const bronze = "#B87333";
const bg = "linear-gradient(180deg, #FFFFFF 0%, #F8F5FF 30%, #F3EEFF 60%, #EDE5FB 100%)";
const cardShadow = "0 4px 20px rgba(75,31,140,0.07)";

/* ───────── MAIN ───────── */
export default function IntakeChallenge() {
  const posterRef = useRef<HTMLDivElement>(null);

  const download = async () => {
    if (!posterRef.current) return;
    const dataUrl = await toPng(posterRef.current, { pixelRatio: 3, width: 1080 });
    const link = document.createElement("a");
    link.download = "intake-contest-results.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center py-10 px-4 gap-6">
      <Button onClick={download} className="gap-2">
        <Download className="w-4 h-4" /> Download Poster (PNG)
      </Button>

      <div
        ref={posterRef}
        style={{
          width: 1080,
          background: bg,
          fontFamily: ff,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative orbs */}
        <div style={{ position: "absolute", top: -80, right: -60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,31,140,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -80, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,31,140,0.05) 0%, transparent 70%)" }} />

        <div style={{ position: "relative", zIndex: 1, padding: "48px 56px 40px" }}>

          {/* ═══ HEADER ═══ */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <img src={orendaLogo} alt="Orenda Psychiatry" style={{ height: 56, margin: "0 auto 20px" }} />
            <h1 style={{ fontFamily: ffDisplay, fontSize: 46, fontWeight: 700, color: purple, lineHeight: 1.15, margin: 0 }}>
              🏆 Intake Team Contest Results
            </h1>
            <div style={{ fontSize: 16, color: muted, marginTop: 10, fontWeight: 500 }}>
              February 20 – February 28
            </div>
            <p style={{ fontSize: 15, color: muted, marginTop: 8, fontWeight: 400, lineHeight: 1.5, maxWidth: 700, margin: "8px auto 0" }}>
              Celebrating the incredible work our intake team did connecting patients to care.
            </p>
          </div>

          {/* ═══ ACTIVITY SNAPSHOT ═══ */}
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "22px 32px", boxShadow: cardShadow, marginBottom: 28, border: "1px solid #EDE5FB" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: purple, marginBottom: 16, fontFamily: ffDisplay }}>
              📊 Activity Snapshot
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              {[
                { icon: "📞", label: "Inbound Calls", value: "308" },
                { icon: "✅", label: "Calls Answered", value: "184", sub: "59.7%" },
                { icon: "📬", label: "Voicemails", value: "105" },
              ].map((s) => (
                <div key={s.label} style={{ flex: 1, textAlign: "center", background: "#F8F5FF", borderRadius: 12, padding: "18px 12px" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 30, fontWeight: 700, color: purple }}>{s.value}</div>
                  {s.sub && <div style={{ fontSize: 12, color: purpleLight, fontWeight: 600 }}>({s.sub})</div>}
                  <div style={{ fontSize: 11, color: muted, fontWeight: 500, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ PERFORMANCE SUMMARY ═══ */}
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "24px 32px", boxShadow: cardShadow, marginBottom: 28, border: "1px solid #EDE5FB" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: purple, marginBottom: 16, fontFamily: ffDisplay }}>
              📈 Performance Summary
            </div>
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <div style={{ fontSize: 14, color: muted, fontWeight: 500, marginBottom: 4 }}>Total Appointments Completed</div>
              <div style={{ fontSize: 52, fontWeight: 800, color: purple, lineHeight: 1 }}>527</div>
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1, background: "#F8F5FF", borderRadius: 12, padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>📋</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: purple }}>435</div>
                <div style={{ fontSize: 11, color: muted }}>Intakes</div>
                <div style={{ fontSize: 11, color: purpleLight, fontWeight: 600, marginTop: 2 }}>$1 each = $435</div>
              </div>
              <div style={{ flex: 1, background: "#F8F5FF", borderRadius: 12, padding: "16px", textAlign: "center" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>🔁</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: purple }}>92</div>
                <div style={{ fontSize: 11, color: muted }}>Follow-Ups</div>
                <div style={{ fontSize: 11, color: purpleLight, fontWeight: 600, marginTop: 2 }}>$0.25 each = $23</div>
              </div>
              <div style={{ flex: 1, background: "linear-gradient(135deg, #4B1F8C, #6D3BBF)", borderRadius: 12, padding: "16px", textAlign: "center", color: "#FFF" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>💰</div>
                <div style={{ fontSize: 28, fontWeight: 700 }}>$458</div>
                <div style={{ fontSize: 11, opacity: 0.85 }}>Total Bonus Fund</div>
              </div>
            </div>
          </div>

          {/* ═══ TEAM RESULTS — PODIUM ═══ */}
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "28px 32px", boxShadow: cardShadow, marginBottom: 28, border: "1px solid #EDE5FB" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: purple, marginBottom: 20, fontFamily: ffDisplay, textAlign: "center" }}>
              🏅 Team Results
            </div>

            {/* Podium visual */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-end", marginBottom: 8 }}>
              {/* 2nd Place */}
              <div style={{ flex: 1 }}>
                <div style={{ background: `linear-gradient(180deg, ${silver}15, ${silver}08)`, borderRadius: "16px 16px 0 0", padding: "20px 16px 24px", textAlign: "center", borderTop: `4px solid ${silver}`, minHeight: 180 }}>
                  <div style={{ fontSize: 36, marginBottom: 6 }}>🥈</div>
                  <div style={{ fontFamily: ffDisplay, fontSize: 22, fontWeight: 700, color: purple }}>Team A</div>
                  <div style={{ fontSize: 12, color: silver, fontWeight: 600, marginTop: 2 }}>2nd Place</div>
                  <div style={{ marginTop: 14, background: "#F8F5FF", borderRadius: 8, padding: "10px 8px" }}>
                    <div style={{ fontSize: 12, color: muted, fontWeight: 500 }}>Team Bonus</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: purple }}>$137.40</div>
                    <div style={{ fontSize: 11, color: purpleLight, fontWeight: 600 }}>$34.35 / person</div>
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div style={{ flex: 1.15 }}>
                <div style={{ background: `linear-gradient(180deg, ${gold}18, ${gold}08)`, borderRadius: "16px 16px 0 0", padding: "24px 16px 28px", textAlign: "center", borderTop: `5px solid ${gold}`, minHeight: 220, boxShadow: `0 0 30px ${gold}15` }}>
                  <div style={{ fontSize: 44, marginBottom: 6 }}>🥇</div>
                  <div style={{ fontFamily: ffDisplay, fontSize: 26, fontWeight: 700, color: purple }}>Team B</div>
                  <div style={{ fontSize: 13, color: gold, fontWeight: 700, marginTop: 2 }}>1st Place</div>
                  <div style={{ fontSize: 11, color: muted, fontWeight: 500, marginTop: 6, lineHeight: 1.4 }}>
                    Highest total completed intakes<br />& highest conversion
                  </div>
                  <div style={{ marginTop: 14, background: "#FFF", borderRadius: 8, padding: "10px 8px", border: `1px solid ${gold}30` }}>
                    <div style={{ fontSize: 12, color: muted, fontWeight: 500 }}>Team Bonus</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: purple }}>$274.80</div>
                    <div style={{ fontSize: 12, color: gold, fontWeight: 700 }}>$68.70 / person</div>
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div style={{ flex: 1 }}>
                <div style={{ background: `linear-gradient(180deg, ${bronze}12, ${bronze}06)`, borderRadius: "16px 16px 0 0", padding: "20px 16px 24px", textAlign: "center", borderTop: `4px solid ${bronze}`, minHeight: 160 }}>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>🥉</div>
                  <div style={{ fontFamily: ffDisplay, fontSize: 22, fontWeight: 700, color: purple }}>Team C</div>
                  <div style={{ fontSize: 12, color: bronze, fontWeight: 600, marginTop: 2 }}>3rd Place</div>
                  <div style={{ marginTop: 14, background: "#F8F5FF", borderRadius: 8, padding: "10px 8px" }}>
                    <div style={{ fontSize: 12, color: muted, fontWeight: 500 }}>Team Bonus</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: purple }}>$45.80</div>
                    <div style={{ fontSize: 11, color: purpleLight, fontWeight: 600 }}>$9.16 / person</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ SPECIAL RECOGNITION ═══ */}
          <div style={{ background: "linear-gradient(135deg, #4B1F8C 0%, #6D3BBF 100%)", borderRadius: 16, padding: "24px 28px", color: "#FFF", marginBottom: 28 }}>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: ffDisplay, marginBottom: 10 }}>
              ⭐ Team C Leadership Recognition
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.65, margin: 0, opacity: 0.92 }}>
              Special appreciation to <strong>Princewell</strong> and <strong>Lovely</strong> for helping carry production while newer team members ramped.
            </p>
            <p style={{ fontSize: 13.5, lineHeight: 1.65, marginTop: 8, opacity: 0.92 }}>
              They will receive additional recognition bonuses bringing their total to{" "}
              <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 6, padding: "2px 10px", fontWeight: 700, fontSize: 15 }}>$24 each</span>.
            </p>
          </div>

          {/* ═══ TEAM SPOTLIGHT ═══ */}
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "28px 32px", boxShadow: cardShadow, marginBottom: 28, border: "1px solid #EDE5FB" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: purple, marginBottom: 20, fontFamily: ffDisplay, textAlign: "center" }}>
              🌟 Team Spotlight
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              {/* Phoebe */}
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{
                  width: 100, height: 100, borderRadius: "50%", margin: "0 auto 12px",
                  background: "linear-gradient(135deg, #EDE5FB, #D4C4F0)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 36, border: `3px solid ${gold}40`,
                }}>
                  👤
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: purple }}>🌟 Phoebe</div>
                <div style={{ fontSize: 12, color: gold, fontWeight: 600, marginBottom: 8 }}>Team A — Top Outreach Leader</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1, background: "#F8F5FF", borderRadius: 8, padding: "8px" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: purple }}>191</div>
                    <div style={{ fontSize: 10, color: muted }}>Outbound Calls</div>
                  </div>
                  <div style={{ flex: 1, background: "#F8F5FF", borderRadius: 8, padding: "8px" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: purple }}>256</div>
                    <div style={{ fontSize: 10, color: muted }}>Outbound Messages</div>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: muted, lineHeight: 1.5, margin: 0 }}>
                  Phoebe drove exceptional outreach during the challenge.
                </p>
              </div>

              {/* Divider */}
              <div style={{ width: 1, background: "#EDE5FB" }} />

              {/* Gene */}
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{
                  width: 100, height: 100, borderRadius: "50%", margin: "0 auto 12px",
                  background: "linear-gradient(135deg, #EDE5FB, #D4C4F0)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 36, border: `3px solid ${purpleLight}40`,
                }}>
                  👤
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: purple }}>⭐ Gene</div>
                <div style={{ fontSize: 12, color: purpleLight, fontWeight: 600, marginBottom: 8 }}>Team B — Top Call Producer</div>
                <div style={{ background: "#F8F5FF", borderRadius: 8, padding: "8px", marginBottom: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: purple }}>176</div>
                  <div style={{ fontSize: 10, color: muted }}>Outbound Calls</div>
                </div>
                <p style={{ fontSize: 11, color: muted, lineHeight: 1.5, margin: 0 }}>
                  Gene helped drive the engagement that contributed to Team B's leading conversion rate.
                </p>
              </div>
            </div>
          </div>

          {/* ═══ FOOTER ═══ */}
          <div style={{ textAlign: "center", borderTop: "1px solid rgba(75,31,140,0.12)", paddingTop: 24 }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>🎉</div>
            <p style={{ fontSize: 14, fontWeight: 500, color: purple, lineHeight: 1.6, margin: 0, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
              Thank you to the entire Intake Team for an amazing week of teamwork and performance.
            </p>
            <p style={{ fontSize: 13, color: muted, lineHeight: 1.5, marginTop: 6 }}>
              Your efforts helped connect hundreds of patients to care.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
