import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import orendaLogo from "@/assets/orenda-logo-v2.png";
import { Download } from "lucide-react";

const QuarterbackAward = () => {
  const posterRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!posterRef.current) return;
    try {
      // Pre-render warm-up pass
      await toPng(posterRef.current, { cacheBust: true });
      const dataUrl = await toPng(posterRef.current, {
        width: 1080,
        height: 1920,
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = "quarterback-recognition-award.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center py-8 px-4">
      <Button onClick={handleDownload} className="mb-6 gap-2">
        <Download className="w-4 h-4" /> Download Poster
      </Button>

      <div
        ref={posterRef}
        style={{
          width: 1080,
          minHeight: 1920,
          fontFamily: "'Montserrat', sans-serif",
          background: "linear-gradient(180deg, hsl(270 20% 96%) 0%, hsl(270 40% 92%) 30%, hsl(270 80% 40% / 0.15) 70%, hsl(270 100% 25% / 0.25) 100%)",
          padding: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative football field lines */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          opacity: 0.03,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 80px, hsl(270 100% 25%) 80px, hsl(270 100% 25%) 82px)",
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <img
          src={orendaLogo}
          alt="Orenda Psychiatry"
          style={{ width: 200, marginBottom: 40, position: "relative", zIndex: 1 }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />

        {/* Title */}
        <div style={{
          textAlign: "center",
          marginBottom: 50,
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>🏈</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 64,
            fontWeight: 700,
            color: "hsl(270 100% 25%)",
            lineHeight: 1.15,
            marginBottom: 16,
          }}>
            Quarterback
            <br />
            Recognition Award
          </h1>
          <p style={{
            fontSize: 26,
            color: "hsl(270 10% 50%)",
            fontWeight: 400,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}>
            Supporting the team behind the scenes
          </p>
        </div>

        {/* Main Message Card */}
        <div style={{
          background: "white",
          borderRadius: 24,
          padding: "50px 55px",
          marginBottom: 40,
          width: "100%",
          boxShadow: "0 8px 40px hsl(270 100% 25% / 0.08)",
          position: "relative",
          zIndex: 1,
        }}>
          <p style={{
            fontSize: 26,
            lineHeight: 1.7,
            color: "hsl(270 60% 15%)",
            textAlign: "center",
          }}>
            During our <strong>February 20 – February 28</strong> Intake Challenge, our Quarterbacks played a critical role in supporting call flow, assisting the intake team, and helping keep operations running smoothly.
          </p>
          <div style={{
            width: 60,
            height: 3,
            background: "hsl(270 80% 40%)",
            margin: "30px auto",
            borderRadius: 2,
          }} />
          <p style={{
            fontSize: 24,
            lineHeight: 1.7,
            color: "hsl(270 10% 50%)",
            textAlign: "center",
          }}>
            Their leadership and coordination helped the team stay organized and responsive during a high-volume period.
          </p>
        </div>

        {/* Award Card */}
        <div style={{
          background: "linear-gradient(135deg, hsl(270 100% 25%), hsl(270 80% 40%))",
          borderRadius: 24,
          padding: "50px 55px",
          marginBottom: 40,
          width: "100%",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
          <p style={{
            fontSize: 24,
            color: "hsl(0 0% 100% / 0.85)",
            marginBottom: 12,
            fontWeight: 500,
          }}>
            To recognize their contributions, each Quarterback will receive a
          </p>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            marginBottom: 8,
          }}>
            $35
          </div>
          <p style={{
            fontSize: 28,
            color: "hsl(0 0% 100% / 0.9)",
            fontWeight: 600,
            letterSpacing: 1,
          }}>
            Recognition Bonus
          </p>
        </div>

        {/* Appreciation Card */}
        <div style={{
          background: "white",
          borderRadius: 24,
          padding: "45px 55px",
          marginBottom: 40,
          width: "100%",
          boxShadow: "0 8px 40px hsl(270 100% 25% / 0.08)",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{ fontSize: 42, marginBottom: 16 }}>⭐</div>
          <p style={{
            fontSize: 26,
            lineHeight: 1.7,
            color: "hsl(270 60% 15%)",
            fontStyle: "italic",
          }}>
            Thank you for stepping in, supporting your teammates, and helping the entire intake team succeed.
          </p>
          <p style={{
            fontSize: 24,
            lineHeight: 1.7,
            color: "hsl(270 10% 50%)",
            marginTop: 16,
          }}>
            Your leadership and teamwork made a meaningful difference during the challenge.
          </p>
        </div>

        {/* Icons row */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 40,
          fontSize: 42,
          marginBottom: 50,
          position: "relative",
          zIndex: 1,
        }}>
          <span>🏈</span>
          <span>📞</span>
          <span>⭐</span>
          <span>🏈</span>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          marginTop: "auto",
          position: "relative",
          zIndex: 1,
        }}>
          <p style={{
            fontSize: 28,
            color: "hsl(270 100% 25%)",
            fontWeight: 600,
            marginBottom: 8,
          }}>
            👏 We appreciate everything you do to keep the team moving forward.
          </p>
          <p style={{
            fontSize: 20,
            color: "hsl(270 10% 50%)",
            letterSpacing: 1,
          }}>
            Orenda Psychiatry — Intake Team
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuarterbackAward;
