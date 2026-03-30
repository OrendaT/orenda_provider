import { Phone, MessageSquare, Mail, Download } from "lucide-react";
import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import orendaLogo from "@/assets/orenda-logo-v2.png";

const CTEGraphic = () => {
  const graphicRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!graphicRef.current) return;
    try {
      const dataUrl = await toPng(graphicRef.current, {
        pixelRatio: 3,
        backgroundColor: "#f5f0fa",
      });
      const link = document.createElement("a");
      link.download = "orenda-cte-graphic.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 gap-8">
      <div
        ref={graphicRef}
        className="w-[800px] h-[800px] relative overflow-hidden flex flex-col items-center justify-center"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          background:
            "radial-gradient(ellipse at 20% 0%, hsl(270 80% 85% / 0.6) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(260 70% 80% / 0.4) 0%, transparent 40%), radial-gradient(ellipse at 50% 80%, hsl(280 60% 88% / 0.5) 0%, transparent 50%), linear-gradient(180deg, hsl(270 30% 97%) 0%, hsl(270 20% 94%) 30%, hsl(270 25% 92%) 60%, hsl(270 35% 88%) 100%)",
        }}
      >
        {/* Floating orbs */}
        <div
          className="absolute top-8 left-6 w-48 h-48 rounded-full blur-3xl"
          style={{ background: "hsl(270 80% 75%)", opacity: 0.3 }}
        />
        <div
          className="absolute bottom-12 right-8 w-64 h-64 rounded-full blur-3xl"
          style={{ background: "hsl(260 70% 70%)", opacity: 0.2 }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{ background: "hsl(275 60% 65%)", opacity: 0.08 }}
        />

        {/* Subtle top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{
            background:
              "linear-gradient(90deg, hsl(270 80% 60%), hsl(270 100% 30%), hsl(270 80% 60%))",
          }}
        />

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5"
          style={{
            background:
              "linear-gradient(90deg, hsl(270 80% 60%), hsl(270 100% 30%), hsl(270 80% 60%))",
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-16">
          {/* Logo */}
          <img
            src={orendaLogo}
            alt="Orenda Psychiatry"
            className="h-12 mb-8 opacity-90"
          />

          {/* Thin divider */}
          <div
            className="w-16 h-[1px] mb-8"
            style={{
              background:
                "linear-gradient(90deg, transparent, hsl(270 60% 60%), transparent)",
            }}
          />

          {/* Main headline */}
          <h1
            className="font-display text-[100px] font-bold tracking-[0.25em] leading-none mb-3"
            style={{
              color: "hsl(270 100% 20%)",
              textShadow: "0 4px 20px hsl(270 80% 30% / 0.15)",
            }}
          >
            CTE
          </h1>

          {/* Subheadline */}
          <p
            className="text-[20px] tracking-[0.35em] uppercase font-medium mb-14"
            style={{ color: "hsl(270 60% 45%)" }}
          >
            Call &nbsp;·&nbsp; Text &nbsp;·&nbsp; Email
          </p>

          {/* Icons row — glass cards */}
          <div className="flex items-end gap-10 mb-14">
            {/* CALL — most prominent */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-[96px] h-[96px] rounded-3xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(270 100% 25%) 0%, hsl(270 80% 40%) 100%)",
                  boxShadow:
                    "0 12px 40px -8px hsl(270 100% 25% / 0.5), 0 0 0 1px hsl(270 80% 50% / 0.2)",
                }}
              >
                <Phone className="w-10 h-10 text-white" strokeWidth={1.5} />
              </div>
              <span
                className="text-[12px] font-bold tracking-[0.3em] uppercase"
                style={{ color: "hsl(270 100% 25%)" }}
              >
                Call
              </span>
            </div>

            {/* TEXT */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-[80px] h-[80px] rounded-2xl flex items-center justify-center"
                style={{
                  background: "hsl(0 0% 100% / 0.6)",
                  backdropFilter: "blur(12px)",
                  boxShadow:
                    "0 8px 32px -6px hsl(270 60% 40% / 0.15), 0 0 0 1px hsl(270 40% 80% / 0.4)",
                }}
              >
                <MessageSquare
                  className="w-8 h-8"
                  strokeWidth={1.5}
                  style={{ color: "hsl(270 80% 40%)" }}
                />
              </div>
              <span
                className="text-[12px] font-semibold tracking-[0.3em] uppercase"
                style={{ color: "hsl(270 50% 45%)" }}
              >
                Text
              </span>
            </div>

            {/* EMAIL */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-[80px] h-[80px] rounded-2xl flex items-center justify-center"
                style={{
                  background: "hsl(0 0% 100% / 0.6)",
                  backdropFilter: "blur(12px)",
                  boxShadow:
                    "0 8px 32px -6px hsl(270 60% 40% / 0.15), 0 0 0 1px hsl(270 40% 80% / 0.4)",
                }}
              >
                <Mail
                  className="w-8 h-8"
                  strokeWidth={1.5}
                  style={{ color: "hsl(270 80% 40%)" }}
                />
              </div>
              <span
                className="text-[12px] font-semibold tracking-[0.3em] uppercase"
                style={{ color: "hsl(270 50% 45%)" }}
              >
                Email
              </span>
            </div>
          </div>

          {/* Gradient divider */}
          <div
            className="w-56 h-[1px] mb-8"
            style={{
              background:
                "linear-gradient(90deg, transparent, hsl(270 60% 60%), transparent)",
            }}
          />

          {/* Supporting line */}
          <p
            className="font-display text-[22px] font-semibold tracking-[0.15em]"
            style={{ color: "hsl(270 100% 20%)" }}
          >
            Our Formula for Success
          </p>

          {/* Bottom tagline */}
          <p
            className="text-[11px] tracking-[0.35em] uppercase mt-5 font-medium"
            style={{ color: "hsl(270 30% 60%)" }}
          >
            Excellence in Every Interaction
          </p>
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold tracking-wide transition-all hover:opacity-90 cursor-pointer"
        style={{
          background:
            "linear-gradient(135deg, hsl(270 100% 25%), hsl(270 80% 40%))",
          color: "white",
          boxShadow: "0 4px 20px -4px hsl(270 100% 25% / 0.4)",
        }}
      >
        <Download className="w-4 h-4" />
        Download High-Res PNG
      </button>
    </div>
  );
};

export default CTEGraphic;
