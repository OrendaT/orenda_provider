import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Wifi, Phone, Key, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProviderRemindersSign = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!ref.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(ref.current, { pixelRatio: 4, backgroundColor: "#7c3aed" });
      const link = document.createElement("a");
      link.download = "hoboken-provider-reminders.png";
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
          <h2 className="text-lg font-semibold text-foreground">Provider Reminders Sign</h2>
          <p className="text-sm text-muted-foreground">8.5" × 11" — post inside office</p>
        </div>
        <Button onClick={handleExport} disabled={exporting} size="sm" variant="outline">
          <Download className="w-4 h-4 mr-2" />
          {exporting ? "Exporting…" : "Download PNG"}
        </Button>
      </div>

      {/* The printable sign */}
      <div className="overflow-auto">
        <div
          ref={ref}
          style={{
            width: 816,
            minHeight: 1056,
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)",
            padding: 40,
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* Dot pattern overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              pointerEvents: "none",
            }}
          />

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 28, position: "relative" }}>
            <h1
              style={{
                color: "#fff",
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: "-0.5px",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              ORENDA PSYCHIATRY
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 14,
                marginTop: 4,
                fontWeight: 500,
              }}
            >
              Hoboken Office — Provider Reminders
            </p>
            <div
              style={{
                width: 60,
                height: 3,
                background: "rgba(255,255,255,0.5)",
                margin: "12px auto 0",
                borderRadius: 2,
              }}
            />
          </div>

          {/* Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative" }}>
            <Card
              icon={<Wifi size={22} color="#7c3aed" />}
              title="Wi-Fi"
              items={[
                "Network: Regus Net Wi-Fi",
                "Password: 167845630",
              ]}
            />
            <Card
              icon={<Clock size={22} color="#7c3aed" />}
              title="After-Hours Protocol"
              items={[
                "Building doors are open Mon–Fri, 7:00 AM – 6:00 PM.",
                "After 5:00 PM, place the Orenda sign at the 9th-floor glass door so patients can find you.",
                "Return the after-hours sign inside the office once you are done with patients for the day.",
              ]}
            />
            <Card
              icon={<span style={{ fontSize: 20 }}>🩺</span>}
              title="Blood Pressure Cuff"
              items={["Located in the office desk drawer."]}
            />
            <Card
              icon={<Trash2 size={22} color="#7c3aed" />}
              title="Clean-Up"
              items={[
                "Dispose of any trash before leaving.",
                "Push chairs back under the desk.",
              ]}
            />
            <Card
              icon={<Key size={22} color="#7c3aed" />}
              title="Lockbox"
              items={[
                "Remember to return the Swipe Card & Key to the Lockbox after use.",
              ]}
            />
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: 24,
              padding: "16px 20px",
              background: "rgba(255,255,255,0.12)",
              borderRadius: 14,
              position: "relative",
            }}
          >
            <p
              style={{
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                margin: "0 0 8px",
              }}
            >
              Contact
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: 0 }}>
                  NJ Admin
                </p>
                <p style={{ color: "#fff", fontSize: 13, margin: "2px 0 0", fontWeight: 600 }}>
                  offices@orendapsych.com
                </p>
              </div>
              <div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: 0 }}>
                  Regus Hoboken
                </p>
                <p style={{ color: "#fff", fontSize: 13, margin: "2px 0 0", fontWeight: 600 }}>
                  (201) 484-7855
                </p>
                <p style={{ color: "#fff", fontSize: 13, margin: "2px 0 0", fontWeight: 600 }}>
                  Hoboken.RiverSt@regus.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 14,
      padding: "16px 20px",
      display: "flex",
      gap: 14,
      alignItems: "flex-start",
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: "#f3f0ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1e1b4b" }}>{title}</p>
      {items.map((item, i) => (
        <p key={i} style={{ margin: "4px 0 0", fontSize: 13, color: "#4b5563", lineHeight: 1.45 }}>
          {item}
        </p>
      ))}
    </div>
  </div>
);

export default ProviderRemindersSign;
