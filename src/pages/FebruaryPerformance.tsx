import { useRef } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import orendaLogo from "@/assets/orenda-logo-v2.png";

const METRICS = [
  { label: "Completed", avg: 9, feb: 26, variance: "+17", positive: true },
  { label: "Canceled", avg: 47, feb: 35, variance: "-11", positive: true },
  { label: "No-Show", avg: 8, feb: 2, variance: "-7", positive: true },
  { label: "Rescheduled", avg: 36, feb: 37, variance: "+1", positive: true },
];

function ImpactChart({ compact }: { compact?: boolean }) {
  const chartH = compact ? 240 : 340;
  const barW = compact ? 36 : 48;
  const gap = compact ? 10 : 14;
  const groupGap = compact ? 44 : 56;
  const maxVal = 55;
  const barArea = chartH - 90;

  const groups = METRICS.map((m) => ({
    ...m,
    avgH: (m.avg / maxVal) * barArea,
    febH: (m.feb / maxVal) * barArea,
  }));

  const totalW = groups.length * (barW * 2 + gap) + (groups.length - 1) * groupGap + 80;

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={totalW} height={chartH} viewBox={`0 0 ${totalW} ${chartH}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="febGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#4B1F8C" />
            <stop offset="100%" stopColor="#6B3FA0" />
          </linearGradient>
          <linearGradient id="avgGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#E8E0F0" />
            <stop offset="100%" stopColor="#DDD2EC" />
          </linearGradient>
        </defs>

        {/* Baseline */}
        <line
          x1={30} x2={totalW - 10}
          y1={chartH - 50} y2={chartH - 50}
          stroke="rgba(75, 31, 140, 0.1)" strokeWidth={1}
        />

        {groups.map((g, i) => {
          const groupX = 40 + i * (barW * 2 + gap + groupGap);
          const baseY = chartH - 50;
          const isNeg = g.variance.startsWith("-");

          return (
            <g key={g.label}>
              {/* Avg bar */}
              <rect x={groupX} y={baseY - g.avgH} width={barW} height={g.avgH} fill="url(#avgGrad)" />
              {/* Avg value */}
              <text x={groupX + barW / 2} y={baseY - g.avgH - 10} textAnchor="middle"
                fontSize={compact ? 13 : 16} fontWeight={600} fill="#B49BD8" fontFamily="'Montserrat', sans-serif">
                {g.avg}%
              </text>

              {/* Feb bar */}
              <rect x={groupX + barW + gap} y={baseY - g.febH} width={barW} height={g.febH} fill="url(#febGrad)" />
              {/* Feb value */}
              <text x={groupX + barW + gap + barW / 2} y={baseY - g.febH - 10} textAnchor="middle"
                fontSize={compact ? 13 : 16} fontWeight={700} fill="#4B1F8C" fontFamily="'Montserrat', sans-serif">
                {g.feb}%
              </text>

              {/* VARIANCE — large and prominent */}
              <rect
                x={groupX + (barW * 2 + gap) / 2 - (compact ? 28 : 34)}
                y={baseY - Math.max(g.avgH, g.febH) - (compact ? 52 : 62)}
                width={compact ? 56 : 68}
                height={compact ? 26 : 30}
                rx={4}
                fill={isNeg ? "rgba(75, 31, 140, 0.07)" : "rgba(75, 31, 140, 0.07)"}
                stroke="rgba(75, 31, 140, 0.12)"
                strokeWidth={1}
              />
              <text
                x={groupX + (barW * 2 + gap) / 2}
                y={baseY - Math.max(g.avgH, g.febH) - (compact ? 33 : 41)}
                textAnchor="middle"
                fontSize={compact ? 16 : 20}
                fontWeight={800}
                fill="#4B1F8C"
                fontFamily="'Montserrat', sans-serif"
              >
                {g.variance}pp
              </text>

              {/* Label */}
              <text x={groupX + (barW * 2 + gap) / 2} y={baseY + 24} textAnchor="middle"
                fontSize={compact ? 13 : 15} fontWeight={600} fill="#666" fontFamily="'Montserrat', sans-serif">
                {g.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 16, height: 16, borderRadius: 2, background: "#DDD2EC" }} />
          <span style={{ fontSize: compact ? 12 : 14, color: "#999", fontWeight: 500, fontFamily: "'Montserrat', sans-serif" }}>12-Month Avg</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 16, height: 16, borderRadius: 2, background: "#4B1F8C" }} />
          <span style={{ fontSize: compact ? 12 : 14, color: "#999", fontWeight: 500, fontFamily: "'Montserrat', sans-serif" }}>Feb 2026</span>
        </div>
      </div>
    </div>
  );
}

/* Giant stat block for hero metrics */
function HeroStat({ value, label, sub, compact }: { value: string; label: string; sub: string; compact?: boolean }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontSize: compact ? 48 : 64,
        fontWeight: 800,
        color: "#4B1F8C",
        lineHeight: 1,
        fontFamily: "'Montserrat', sans-serif",
        letterSpacing: "-2px",
      }}>
        {value}
      </div>
      <div style={{
        fontSize: compact ? 11 : 13,
        fontWeight: 600,
        color: "#A678E2",
        textTransform: "uppercase",
        letterSpacing: 2,
        marginTop: 6,
      }}>
        {label}
      </div>
      <div style={{ fontSize: compact ? 11 : 13, color: "#888", marginTop: 4, fontFamily: "'Montserrat', sans-serif" }}>
        {sub}
      </div>
    </div>
  );
}

function PosterContent({ aspect }: { aspect: "1:1" | "16:9" }) {
  const is16x9 = aspect === "16:9";
  const compact = aspect === "1:1";
  const w = is16x9 ? 1200 : 1080;
  const h = is16x9 ? 675 : 1080;

  return (
    <div
      style={{
        width: w,
        height: h,
        background: "linear-gradient(180deg, #FFFFFF 0%, #FDFBFF 25%, #F6F0FC 50%, #EDE3F7 75%, #D4BEF0 92%, #4B1F8C 100%)",
        fontFamily: "'Montserrat', sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Header */}
      <div style={{
        padding: is16x9 ? "24px 48px 14px" : "40px 56px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <img src={orendaLogo} alt="Orenda Psychiatry" style={{ height: is16x9 ? 26 : 34, marginBottom: 6 }} />
          <div style={{
            fontSize: is16x9 ? 11 : 13,
            fontWeight: 600,
            color: "#A678E2",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}>
            Zocdoc Conversion Impact
          </div>
        </div>
        <div style={{
          background: "rgba(75, 31, 140, 0.05)",
          border: "1px solid rgba(75, 31, 140, 0.1)",
          borderRadius: 8,
          padding: "8px 20px",
          fontSize: is16x9 ? 12 : 14,
          fontWeight: 600,
          color: "#4B1F8C",
        }}>
          February 2026
        </div>
      </div>

      {/* Thin divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(75,31,140,0.15), transparent)", margin: "0 56px" }} />

      {is16x9 ? (
        /* ===== 16:9 LAYOUT ===== */
        <div style={{ display: "flex", flex: 1, padding: "16px 48px 12px", gap: 36 }}>
          {/* Left: hero stats */}
          <div style={{ flex: "0 0 340px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
            <HeroStat value="↑ 17pp" label="Retention Gain" sub="9% → 26% completed" compact />
            <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
              <HeroStat value="↓ 11pp" label="Cancellations" sub="47% → 35%" compact />
              <HeroStat value="↓ 7pp" label="No-Shows" sub="8% → 2%" compact />
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: "#999", marginTop: -8 }}>
              Retained (Completed + Rescheduled): 46% → 63%
            </div>
          </div>
          {/* Right: chart */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImpactChart compact />
          </div>
        </div>
      ) : (
        /* ===== 1:1 LAYOUT ===== */
        <div style={{ flex: 1, padding: "28px 56px 16px", display: "flex", flexDirection: "column" }}>
          {/* Hero stats row */}
          <div style={{ display: "flex", justifyContent: "center", gap: 48, marginBottom: 8 }}>
            <HeroStat value="↑ 17pp" label="Retention Gain" sub="9% → 26% completed" />
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 56, marginTop: 12, marginBottom: 4 }}>
            <HeroStat value="↓ 11pp" label="Cancellations" sub="47% → 35%" />
            <HeroStat value="↓ 7pp" label="No-Shows" sub="8% → 2%" />
          </div>
          <div style={{ textAlign: "center", fontSize: 12, color: "#999", marginTop: 8, marginBottom: 16 }}>
            Retained (Completed + Rescheduled): 46% → 63%
          </div>

          {/* Thin divider */}
          <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(75,31,140,0.1), transparent)", marginBottom: 20 }} />

          {/* Chart */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ImpactChart />
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ padding: is16x9 ? "8px 48px 18px" : "12px 56px 36px", textAlign: "center" }}>
        <div style={{ fontSize: is16x9 ? 11 : 12, color: "rgba(255,255,255,0.8)", fontStyle: "italic", fontWeight: 400 }}>
          Process improvements are driving measurable operational leverage.
        </div>
      </div>
    </div>
  );
}

export default function FebruaryPerformance() {
  const squareRef = useRef<HTMLDivElement>(null);
  const wideRef = useRef<HTMLDivElement>(null);

  const handleDownload = async (ref: React.RefObject<HTMLDivElement>, filename: string, w: number, h: number) => {
    if (!ref.current) return;
    const scale = 2;
    const dataUrl = await toPng(ref.current, {
      canvasWidth: w * scale,
      canvasHeight: h * scale,
      pixelRatio: scale,
      quality: 0.95,
    });
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex flex-col items-center gap-16">
      <h1 className="text-2xl font-bold text-foreground">Zocdoc Conversion — February 2026</h1>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold text-muted-foreground">1:1 Square (Instagram / Internal Share)</h2>
        <div className="border border-border rounded-lg overflow-hidden shadow-lg" style={{ width: 540, height: 540 }}>
          <div style={{ transform: "scale(0.5)", transformOrigin: "top left", width: 1080, height: 1080 }} ref={squareRef}>
            <PosterContent aspect="1:1" />
          </div>
        </div>
        <button
          onClick={() => handleDownload(squareRef, "orenda-zocdoc-feb-square.png", 1080, 1080)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition"
        >
          <Download size={18} /> Download 1:1 (2160×2160)
        </button>
      </section>

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-lg font-semibold text-muted-foreground">16:9 Wide (Board Slide / TV)</h2>
        <div className="border border-border rounded-lg overflow-hidden shadow-lg" style={{ width: 600, height: 337 }}>
          <div style={{ transform: "scale(0.5)", transformOrigin: "top left", width: 1200, height: 675 }} ref={wideRef}>
            <PosterContent aspect="16:9" />
          </div>
        </div>
        <button
          onClick={() => handleDownload(wideRef, "orenda-zocdoc-feb-wide.png", 1200, 675)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition"
        >
          <Download size={18} /> Download 16:9 (2400×1350)
        </button>
      </section>
    </div>
  );
}
