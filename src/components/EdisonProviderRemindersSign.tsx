import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Wifi, Clock, Key, Trash2, AlertTriangle, Phone, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import edisonBuilding from "@/assets/edison-building.jpg";

const EdisonProviderRemindersSign = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!ref.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(ref.current, { pixelRatio: 4, backgroundColor: "#1e0a3c" });
      const link = document.createElement("a");
      link.download = "edison-provider-reminders.png";
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
          <h2 className="text-lg font-semibold text-foreground">Edison Provider Reminders</h2>
          <p className="text-sm text-muted-foreground">High-res infographic — download as PNG</p>
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
            minHeight: 1056,
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            background: "linear-gradient(160deg, #1e0a3c 0%, #2d1459 30%, #4c1d95 60%, #6d28d9 100%)",
            padding: 0,
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Geometric pattern overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(167,139,250,0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(139,92,246,0.1) 0%, transparent 40%),
                linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.02) 49%, rgba(255,255,255,0.02) 51%, transparent 52%),
                linear-gradient(-45deg, transparent 48%, rgba(255,255,255,0.02) 49%, rgba(255,255,255,0.02) 51%, transparent 52%)
              `,
              backgroundSize: "100% 100%, 100% 100%, 30px 30px, 30px 30px",
              pointerEvents: "none",
            }}
          />

          {/* Dot grid pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
              pointerEvents: "none",
            }}
          />

          {/* Hero section with building image */}
          <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
            <img
              src={edisonBuilding}
              alt="Edison Office Building"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 40%",
                filter: "brightness(0.4) saturate(0.8)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(30,10,60,0.6) 0%, rgba(30,10,60,0.9) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "20px 40px",
              }}
            >
              <p
                style={{
                  color: "rgba(196,181,253,0.9)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  margin: "0 0 6px",
                }}
              >
                Orenda Psychiatry
              </p>
              <h1
                style={{
                  color: "#fff",
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Edison Office
              </h1>
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 12,
                  marginTop: 6,
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                Regus — Raritan Plaza · 110 Fieldcrest Avenue, 3rd Floor, Unit 328
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 11,
                  marginTop: 2,
                }}
              >
                Edison, NJ 08837
              </p>
              <div
                style={{
                  marginTop: 10,
                  background: "rgba(251,191,36,0.15)",
                  border: "1px solid rgba(251,191,36,0.3)",
                  borderRadius: 20,
                  padding: "4px 16px",
                }}
              >
                <p style={{ color: "#fbbf24", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>
                  For Orenda Psychiatry Use Only
                </p>
              </div>
            </div>
          </div>

          {/* Cards container */}
          <div style={{ padding: "20px 32px 28px", position: "relative" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Wi-Fi */}
              <InfoCard
                icon={<Wifi size={20} color="#a78bfa" />}
                title="Wi-Fi"
                items={[
                  { label: "Network", value: "Regus" },
                  { label: "Password", value: "167785439" },
                ]}
              />

              {/* Lockbox */}
              <InfoCard
                icon={<Key size={20} color="#a78bfa" />}
                title="Lockbox"
                items={[
                  { value: "Return swipe card & key to the lockbox after use." },
                ]}
              />

              {/* After-Hours — full width */}
              <div style={{ gridColumn: "1 / -1" }}>
                <InfoCard
                  icon={<Clock size={20} color="#a78bfa" />}
                  title="After-Hours Protocol"
                  items={[
                    { value: "Building doors are open Monday – Friday, 7:30 AM – 7:00 PM." },
                    { label: "After hours, access via", value: "P1 (Parking Level 1)" },
                    { label: "Building Code", value: "05296" },
                    { value: "Escort patients at all times.", highlight: true },
                  ]}
                />
              </div>

              {/* Equipment */}
              <InfoCard
                icon={<Stethoscope size={20} color="#a78bfa" />}
                title="Equipment"
                items={[
                  { value: "Blood pressure cuffs are located inside the basket." },
                  { value: "Additional backup cuff available." },
                  { value: "Scale provided." },
                ]}
              />

              {/* Office Reset */}
              <InfoCard
                icon={<Trash2 size={20} color="#a78bfa" />}
                title="Office Reset"
                items={[
                  { value: "Push chairs back under the desk." },
                  { value: "Leave equipment and office in a neat and clean order as you found it." },
                ]}
              />
            </div>

            {/* Important callout */}
            <div
              style={{
                marginTop: 14,
                background: "linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(251,146,36,0.08) 100%)",
                border: "1px solid rgba(251,191,36,0.25)",
                borderRadius: 14,
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(251,191,36,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={18} color="#fbbf24" />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#fbbf24" }}>
                  Important
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 12, color: "rgba(251,191,36,0.85)", lineHeight: 1.45 }}>
                  Escort patients at all times within the building.
                </p>
              </div>
            </div>

            {/* Contact footer */}
            <div
              style={{
                marginTop: 14,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: "16px 20px",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                style={{
                  color: "rgba(196,181,253,0.9)",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  margin: "0 0 10px",
                }}
              >
                Contact
              </p>
              <div style={{ display: "flex", gap: 40 }}>
                <ContactBlock
                  label="Orenda Psychiatry Admin"
                  lines={["offices@orendapsych.com", "(201) 685-4863"]}
                />
                <ContactBlock
                  label="Regus Edison (Fieldcrest Ave)"
                  lines={["edison.fieldcrestave@regus.com", "(732) 782-0328"]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: Array<{ label?: string; value: string; highlight?: boolean }>;
}) => (
  <div
    style={{
      background: "rgba(255,255,255,0.07)",
      backdropFilter: "blur(8px)",
      borderRadius: 14,
      padding: "14px 16px",
      border: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 9,
          background: "rgba(167,139,250,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#fff" }}>{title}</p>
    </div>
    {items.map((item, i) => (
      <div key={i} style={{ marginTop: i === 0 ? 0 : 4 }}>
        {item.label ? (
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>
            {item.label}:{" "}
            <span style={{ color: item.highlight ? "#fbbf24" : "#e9e5f5", fontWeight: 600 }}>
              {item.value}
            </span>
          </p>
        ) : (
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: item.highlight ? "#fbbf24" : "rgba(255,255,255,0.75)",
              lineHeight: 1.45,
              fontWeight: item.highlight ? 600 : 400,
            }}
          >
            {item.value}
          </p>
        )}
      </div>
    ))}
  </div>
);

const ContactBlock = ({ label, lines }: { label: string; lines: string[] }) => (
  <div>
    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, margin: 0 }}>{label}</p>
    {lines.map((line, i) => (
      <p key={i} style={{ color: "#fff", fontSize: 12, margin: "2px 0 0", fontWeight: 600 }}>
        {line}
      </p>
    ))}
  </div>
);

export default EdisonProviderRemindersSign;
