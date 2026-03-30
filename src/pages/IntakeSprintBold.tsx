import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import orendaLogo from "@/assets/orenda-logo-v2.png";

const POSTER_WIDTH = 2550;
const POSTER_HEIGHT = 3300;

const IntakeSprintBold = () => {
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
      link.download = "orenda-intake-sprint-bold-8.5x11.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  }, []);

  const reqCards = [
    { num: "60", label: "held intakes", sub: "Weekdays" },
    { num: "35", label: "held intakes", sub: "Weekends" },
    { num: "70%+", label: "conversion", sub: "Keep it strong" },
    { num: "< 1%", label: "complaints", sub: "Protect the experience" },
    { num: "✓", label: "Billable only", sub: "Insurance verified" },
    { num: "✓", label: "New patients", sub: "Completed intakes count" },
  ];

  const pills = [
    "Revisit January leads",
    "Reach out to completed forms",
    "Be persuasive — never pushy",
    "Support each other",
  ];

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4" style={{ background: "hsl(270 20% 96%)" }}>
      <h1 className="font-display text-3xl font-bold mb-2" style={{ color: "hsl(270 100% 20%)" }}>
        Intake Sprint — Bold Edition
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

      {/* Poster preview */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          width: 510,
          height: 660,
          boxShadow: "0 30px 70px -15px hsl(270 60% 30% / 0.35), 0 0 0 1px hsl(270 40% 70% / 0.3)",
        }}
      >
        <div
          ref={posterRef}
          style={{
            width: 510,
            height: 660,
            fontFamily: "'Montserrat', sans-serif",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Full background gradient */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(165deg, hsl(270 100% 12%) 0%, hsl(270 80% 22%) 35%, hsl(270 70% 35%) 60%, hsl(270 50% 50%) 80%, hsl(270 60% 65%) 100%)",
          }} />

          {/* Glow circles */}
          <div style={{
            position: "absolute",
            top: -40,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle, hsl(270 80% 55% / 0.35) 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute",
            bottom: 60,
            left: -30,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle, hsl(280 70% 50% / 0.2) 0%, transparent 70%)",
          }} />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 1, padding: "24px 28px 16px", display: "flex", flexDirection: "column", height: "100%" }}>

            {/* Top bar: logo + date */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <img src={orendaLogo} alt="Orenda" style={{ height: 22, filter: "brightness(0) invert(1)", objectFit: "contain" }} />
              <span style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.2em", color: "hsl(270 60% 80%)", textTransform: "uppercase" }}>
                FEB 20–28, 2025
              </span>
            </div>

            <div style={{ width: "100%", height: 1, background: "hsl(270 60% 50% / 0.3)", marginBottom: 16 }} />

            {/* INTAKE SPRINT */}
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", color: "hsl(270 60% 75%)", textTransform: "uppercase", marginBottom: 4 }}>
                8 DAYS &nbsp;·&nbsp; TEAM GOAL &nbsp;·&nbsp; TEAM BONUS
              </p>
              <h2 style={{
                fontSize: 38,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "0.08em",
                lineHeight: 1,
                fontFamily: "'Playfair Display', serif",
                textShadow: "0 2px 20px hsl(270 80% 40% / 0.5)",
              }}>
                INTAKE SPRINT
              </h2>
            </div>

            {/* 465 — hero number */}
            <div style={{ textAlign: "center", margin: "10px 0 4px" }}>
              <p style={{
                fontSize: 110,
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 1,
                fontFamily: "'Playfair Display', serif",
                textShadow: "0 4px 30px hsl(270 100% 70% / 0.5), 0 0 80px hsl(270 80% 60% / 0.3)",
                letterSpacing: "-0.02em",
              }}>
                465
              </p>
              <div style={{
                width: 80,
                height: 3,
                background: "linear-gradient(90deg, transparent, hsl(270 80% 75%), transparent)",
                margin: "2px auto 0",
                borderRadius: 2,
              }} />
            </div>

            {/* Bonus strip */}
            <div style={{
              background: "hsl(270 60% 50% / 0.25)",
              backdropFilter: "blur(10px)",
              border: "1px solid hsl(270 60% 60% / 0.3)",
              borderRadius: 10,
              padding: "8px 16px",
              margin: "8px 10px 12px",
              textAlign: "center",
            }}>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.5 }}>
                <span style={{ color: "hsl(50 100% 75%)", fontWeight: 800, fontSize: 12 }}>$1</span> per completed, billable intake → <strong>TEAM BONUS FUND</strong>
              </p>
              <p style={{ fontSize: 7.5, color: "hsl(270 50% 80%)", marginTop: 1 }}>
                Bigger fund if we exceed goal
              </p>
            </div>

            {/* Requirements */}
            <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", color: "hsl(270 50% 75%)", textTransform: "uppercase", textAlign: "center", marginBottom: 6 }}>
              To hit 465, we need:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, margin: "0 4px 10px" }}>
              {reqCards.map((item, i) => (
                <div key={i} style={{
                  background: "hsl(270 40% 20% / 0.5)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 8,
                  padding: "6px 10px",
                  border: "1px solid hsl(270 50% 45% / 0.3)",
                }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF", lineHeight: 1.2 }}>
                    {item.num} <span style={{ fontSize: 8, fontWeight: 500, color: "hsl(270 40% 75%)" }}>{item.label}</span>
                  </p>
                  <p style={{ fontSize: 7, color: "hsl(270 30% 65%)", marginTop: 1 }}>{item.sub}</p>
                </div>
              ))}
            </div>

            {/* CTE Section */}
            <div style={{
              textAlign: "center",
              background: "hsl(270 50% 15% / 0.4)",
              borderRadius: 12,
              padding: "10px 16px 12px",
              margin: "0 4px",
              border: "1px solid hsl(270 50% 40% / 0.25)",
            }}>
              <p style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.25em", color: "hsl(270 50% 70%)", textTransform: "uppercase", marginBottom: 4 }}>
                How we win
              </p>
              <p style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "0.1em",
                fontFamily: "'Playfair Display', serif",
                textShadow: "0 1px 10px hsl(270 80% 50% / 0.4)",
                marginBottom: 8,
              }}>
                CALL &nbsp;•&nbsp; TEXT &nbsp;•&nbsp; EMAIL
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
                {pills.map((text, i) => (
                  <span key={i} style={{
                    background: "hsl(270 60% 55% / 0.3)",
                    border: "1px solid hsl(270 50% 65% / 0.35)",
                    borderRadius: 20,
                    padding: "3px 11px",
                    fontSize: 7,
                    fontWeight: 600,
                    color: "hsl(270 30% 90%)",
                  }}>
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: "auto", textAlign: "center", paddingTop: 8 }}>
              <p style={{ fontSize: 7.5, color: "hsl(270 40% 70%)", fontWeight: 400, fontStyle: "italic" }}>
                Everyone benefits if we hit the goal. Exceeding 465 grows the bonus.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 font-body text-xs tracking-wider" style={{ color: "hsl(270 40% 55%)" }}>
        {POSTER_WIDTH} × {POSTER_HEIGHT}px &nbsp;·&nbsp; 300 DPI &nbsp;·&nbsp; 8.5″ × 11″
      </p>
    </div>
  );
};

export default IntakeSprintBold;
