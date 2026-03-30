import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import orendaLogo from "@/assets/orenda-logo-v2.png";

const POSTER_WIDTH = 2550; // 8.5" × 300dpi
const POSTER_HEIGHT = 3300; // 11" × 300dpi

const IntakeSprintPoster = () => {
  const posterRef = useRef<HTMLDivElement>(null);

  const downloadPoster = useCallback(async () => {
    if (!posterRef.current) return;
    try {
      const dataUrl = await toPng(posterRef.current, {
        width: POSTER_WIDTH,
        height: POSTER_HEIGHT,
        pixelRatio: 1,
        canvasWidth: POSTER_WIDTH,
        canvasHeight: POSTER_HEIGHT,
      });
      const link = document.createElement("a");
      link.download = "orenda-intake-sprint-poster-8.5x11.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4" style={{ background: "hsl(270 20% 96%)" }}>
      <h1 className="font-display text-3xl font-bold mb-2" style={{ color: "hsl(270 100% 20%)" }}>
        Intake Sprint Poster
      </h1>
      <button
        onClick={downloadPoster}
        className="mb-8 flex items-center gap-2 px-6 py-3 rounded-full font-body text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer"
        style={{
          background: "hsl(270 100% 25%)",
          color: "hsl(0 0% 100%)",
          boxShadow: "0 4px 15px hsl(270 80% 30% / 0.3)",
        }}
      >
        <Download size={16} />
        Download 8.5″ × 11″ Print-Ready
      </button>

      {/* Poster preview — scaled down for screen, exported at full 2550×3300 */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          width: 510,
          height: 660,
          boxShadow: "0 30px 70px -15px hsl(270 60% 40% / 0.25), 0 0 0 1px hsl(270 40% 80% / 0.3)",
        }}
      >
        <div
          ref={posterRef}
          style={{
            width: 510,
            height: 660,
            background: "#FFFFFF",
            fontFamily: "'Montserrat', sans-serif",
            position: "relative",
            overflow: "hidden",
            padding: "28px 24px 18px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Subtle dot grid background on lower portion */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "35%",
            backgroundImage: "radial-gradient(circle, hsl(270 40% 80% / 0.3) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }} />

          {/* Top: Logo + Header */}
          <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <img src={orendaLogo} alt="Orenda" style={{ height: 28, margin: "0 auto 8px", display: "block", objectFit: "contain" }} />
            <div style={{ width: "100%", height: 1, background: "hsl(270 30% 88%)", marginBottom: 14 }} />
            <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.15em", color: "hsl(270 50% 45%)", textTransform: "uppercase", marginBottom: 2 }}>
              FEB 20–28
            </p>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "hsl(270 100% 20%)", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 4, fontFamily: "'Playfair Display', serif" }}>
              INTAKE SPRINT
            </h2>
            <p style={{ fontSize: 8, fontWeight: 500, letterSpacing: "0.2em", color: "hsl(270 30% 55%)", textTransform: "uppercase" }}>
              8 DAYS &nbsp;•&nbsp; TEAM GOAL &nbsp;•&nbsp; TEAM BONUS
            </p>
          </div>

          {/* Goal: 465 */}
          <div style={{ textAlign: "center", margin: "14px 0 6px", position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.15em", color: "hsl(270 50% 50%)", textTransform: "uppercase", marginBottom: 2 }}>
              Goal
            </p>
            <p style={{ fontSize: 72, fontWeight: 800, color: "hsl(270 100% 22%)", lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>
              465
            </p>
            <div style={{ width: 60, height: 3, background: "linear-gradient(90deg, hsl(270 80% 60%), hsl(270 100% 30%))", borderRadius: 2, margin: "4px auto 0" }} />
          </div>

          {/* Bonus card */}
          <div style={{
            background: "hsl(270 40% 96%)",
            borderRadius: 10,
            padding: "8px 14px",
            margin: "6px 20px 10px",
            textAlign: "center",
            border: "1px solid hsl(270 30% 90%)",
            position: "relative",
            zIndex: 1,
          }}>
            <p style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", color: "hsl(270 50% 45%)", textTransform: "uppercase", marginBottom: 2 }}>
              Bonus
            </p>
            <p style={{ fontSize: 9.5, fontWeight: 500, color: "hsl(270 60% 20%)", lineHeight: 1.5 }}>
              <strong>$1</strong> per completed, billable intake → added to a <strong>TEAM BONUS FUND</strong>
            </p>
            <p style={{ fontSize: 7.5, color: "hsl(270 30% 50%)", marginTop: 1 }}>
              (bigger fund if we exceed goal)
            </p>
          </div>

          {/* Requirements grid */}
          <div style={{ position: "relative", zIndex: 1, margin: "0 8px" }}>
            <p style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.15em", color: "hsl(270 50% 45%)", textTransform: "uppercase", marginBottom: 6, textAlign: "center" }}>
              To hit 465, we need:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {[
                { num: "60", label: "held intakes", sub: "Weekdays" },
                { num: "35", label: "held intakes", sub: "Weekends" },
                { num: "70%+", label: "conversion", sub: "Keep it strong" },
                { num: "< 1%", label: "complaints", sub: "Protect the patient experience" },
                { num: "✓", label: "Billable only", sub: "Insurance verified" },
                { num: "✓", label: "New patients", sub: "Completed intakes count" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "hsl(0 0% 100%)",
                  borderRadius: 8,
                  padding: "7px 10px",
                  border: "1px solid hsl(270 25% 90%)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 7,
                }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "hsl(270 80% 55%)",
                    marginTop: 2,
                    flexShrink: 0,
                  }} />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "hsl(270 100% 22%)", lineHeight: 1.2 }}>
                      {item.num} <span style={{ fontSize: 8, fontWeight: 500, color: "hsl(270 40% 35%)" }}>{item.label}</span>
                    </p>
                    <p style={{ fontSize: 7, color: "hsl(270 20% 55%)", marginTop: 1 }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How we win / CTE */}
          <div style={{ textAlign: "center", margin: "12px 0 6px", position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.15em", color: "hsl(270 50% 45%)", textTransform: "uppercase", marginBottom: 4 }}>
              How we win
            </p>
            <p style={{ fontSize: 16, fontWeight: 700, color: "hsl(270 100% 22%)", letterSpacing: "0.06em", fontFamily: "'Playfair Display', serif" }}>
              CALL &nbsp;•&nbsp; TEXT &nbsp;•&nbsp; EMAIL (CTE)
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", marginTop: 8 }}>
              {[
                "Revisit January leads",
                "Reach out to completed forms",
                "Be persuasive — never pushy",
                "Support each other",
              ].map((text, i) => (
                <span key={i} style={{
                  background: "hsl(270 40% 96%)",
                  border: "1px solid hsl(270 30% 88%)",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 7.5,
                  fontWeight: 500,
                  color: "hsl(270 50% 30%)",
                }}>
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "auto", textAlign: "center", position: "relative", zIndex: 1, paddingTop: 8 }}>
            <div style={{ width: "80%", height: 1, background: "hsl(270 30% 88%)", margin: "0 auto 6px" }} />
            <p style={{ fontSize: 7.5, color: "hsl(270 30% 50%)", fontWeight: 400 }}>
              Everyone benefits if we hit the goal. Exceeding 465 grows the bonus.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 font-body text-xs tracking-wider" style={{ color: "hsl(270 40% 55%)" }}>
        {POSTER_WIDTH} × {POSTER_HEIGHT}px &nbsp;·&nbsp; 300 DPI &nbsp;·&nbsp; 8.5″ × 11″
      </p>
    </div>
  );
};

export default IntakeSprintPoster;
