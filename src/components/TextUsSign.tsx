import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const TextUsSign = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!ref.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(ref.current, { pixelRatio: 4, backgroundColor: "#1a0533" });
      const link = document.createElement("a");
      link.download = "orenda-text-us-sign.png";
      link.href = dataUrl;
      link.click();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Text Us Sign</h2>
          <p className="text-sm text-muted-foreground">8.5" × 11" — post at entrance / waiting area</p>
        </div>
        <Button onClick={handleExport} disabled={exporting} size="sm" variant="outline">
          <Download className="w-4 h-4 mr-2" />
          {exporting ? "Exporting…" : "Download PNG"}
        </Button>
      </div>

      <div className="overflow-auto">
        <div
          ref={ref}
          style={{
            width: 816,
            height: 1056,
            fontFamily: "'Montserrat', 'Segoe UI', system-ui, sans-serif",
            background: "linear-gradient(160deg, #1a0533 0%, #2d1155 40%, #3b1a6e 100%)",
            padding: 0,
            boxSizing: "border-box",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Subtle radial glow */}
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Dot pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              pointerEvents: "none",
            }}
          />

          {/* Content */}
          <div style={{ position: "relative", textAlign: "center", padding: "60px 60px" }}>
            {/* Logo text */}
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: 4,
                textTransform: "uppercase",
                marginBottom: 40,
              }}
            >
              Orenda Psychiatry
            </p>

            {/* Icon */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 40px",
              }}
            >
              <MessageCircle size={40} color="#c4b5fd" />
            </div>

            {/* Main heading */}
            <h1
              style={{
                color: "#ffffff",
                fontSize: 38,
                fontWeight: 700,
                lineHeight: 1.3,
                margin: "0 0 36px",
                maxWidth: 620,
              }}
            >
              For Orenda Psychiatry Appointments
            </h1>

            {/* Divider */}
            <div
              style={{
                width: 80,
                height: 3,
                background: "linear-gradient(90deg, #c4b5fd, #7c3aed)",
                margin: "0 auto 36px",
                borderRadius: 2,
              }}
            />

            {/* Instruction */}
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 24,
                fontWeight: 500,
                lineHeight: 1.5,
                margin: "0 0 44px",
                maxWidth: 560,
              }}
            >
              Please text
            </p>

            {/* Phone number card */}
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 16,
                padding: "20px 48px",
                display: "inline-block",
                marginBottom: 44,
              }}
            >
              <p
                style={{
                  color: "#ffffff",
                  fontSize: 48,
                  fontWeight: 700,
                  letterSpacing: 2,
                  margin: 0,
                }}
              >
                201-685-4863
              </p>
            </div>

            {/* Sub text */}
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: 22,
                fontWeight: 500,
                lineHeight: 1.5,
                margin: 0,
                maxWidth: 500,
              }}
            >
              and our team will be right with you
            </p>
          </div>

          {/* Bottom accent bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 6,
              background: "linear-gradient(90deg, #7c3aed, #c4b5fd, #7c3aed)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TextUsSign;
