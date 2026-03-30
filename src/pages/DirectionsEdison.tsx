import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import orendaLogo from "@/assets/orenda-logo-v2.png";
import { Download } from "lucide-react";

const DirectionsEdison = () => {
  const posterRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!posterRef.current) return;
    try {
      await toPng(posterRef.current, { cacheBust: true });
      const dataUrl = await toPng(posterRef.current, {
        width: 1080,
        height: 1080,
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = "orenda-edison-directions.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center py-8 px-4">
      <Button onClick={handleDownload} className="mb-6 gap-2" size="lg">
        <Download className="w-5 h-5" /> Download Directions Graphic
      </Button>

      <div
        ref={posterRef}
        style={{
          width: 1080,
          height: 1080,
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Montserrat', sans-serif",
          background: "linear-gradient(170deg, #FAFAFA 0%, #F3EEF8 35%, #EBE4F3 70%, #E4DCF0 100%)",
        }}
      >
        {/* Subtle dot pattern */}
        <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.03 }}>
          <defs>
            <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1" fill="#4B1F8C" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Top section */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 36, position: "relative", zIndex: 2 }}>
          <img src={orendaLogo} alt="Orenda Psychiatry" style={{ width: 200, marginBottom: 14 }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: "#4B1F8C", letterSpacing: 0.5, marginBottom: 3 }}>
            How to Find Us
          </div>
          <div style={{ fontSize: 12, color: "#7C6A99", letterSpacing: 2, textTransform: "uppercase", fontWeight: 500 }}>
            Edison, New Jersey
          </div>
        </div>

        {/* Map Illustration */}
        <div style={{ position: "relative", width: "100%", height: 540, marginTop: 16 }}>
          <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>

            {/* Route 1 — major diagonal highway */}
            <rect x="60" y="0" width="36" height="560" fill="#D8D0E2" opacity="0.5" rx="3" transform="rotate(-12, 78, 280)" />
            <g transform="rotate(-12, 78, 280)">
              <rect x="68" y="200" width="56" height="18" fill="#4B1F8C" rx="4" opacity="0.65" />
              <text x="96" y="213" fontSize="9" fill="white" fontFamily="Montserrat" fontWeight="700" textAnchor="middle">US RT 1</text>
            </g>

            {/* Plainfield Ave — horizontal */}
            <rect x="100" y="340" width="700" height="20" fill="#DDD5E8" opacity="0.4" rx="2" />
            <text x="160" y="370" fontSize="9" fill="#7C6A99" opacity="0.55" fontFamily="Montserrat" fontWeight="500">PLAINFIELD AVE</text>

            {/* Fieldcrest Ave — horizontal, prominent */}
            <rect x="180" y="220" width="660" height="24" fill="#D4C8E2" opacity="0.55" rx="3" />
            <text x="750" y="250" fontSize="10" fill="#4B1F8C" opacity="0.6" fontFamily="Montserrat" fontWeight="600" textAnchor="end">FIELDCREST AVE</text>

            {/* Raritan Center Pkwy — curved path */}
            <path d="M 300 420 Q 400 350, 500 280 Q 560 245, 620 230" fill="none" stroke="#D4C8E2" strokeWidth="18" opacity="0.4" strokeLinecap="round" />
            <text x="350" y="400" fontSize="9" fill="#7C6A99" opacity="0.45" fontFamily="Montserrat" fontWeight="500" transform="rotate(-25, 350, 400)">RARITAN CENTER PKWY</text>

            {/* International Way — vertical */}
            <rect x="520" y="120" width="18" height="300" fill="#DDD5E8" opacity="0.35" rx="2" />
            <text x="529" y="440" fontSize="8" fill="#7C6A99" opacity="0.4" fontFamily="Montserrat" fontWeight="500" textAnchor="middle" transform="rotate(-90, 529, 440)">INTERNATIONAL WAY</text>

            {/* Office park blocks */}
            {[
              [260, 260, 70, 50],
              [380, 140, 60, 55],
              [620, 280, 65, 50],
              [750, 150, 55, 45],
              [200, 390, 60, 40],
            ].map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} fill="#E8E0F0" opacity="0.4" rx="4" stroke="#D4C8E2" strokeWidth="0.5" />
            ))}

            {/* Office park labels */}
            <text x="295" y="295" fontSize="7" fill="#B8A5D0" fontFamily="Montserrat" fontWeight="400" textAnchor="middle">Office Park</text>
            <text x="652" y="310" fontSize="7" fill="#B8A5D0" fontFamily="Montserrat" fontWeight="400" textAnchor="middle">Office Park</text>

            {/* Raritan Plaza - main building complex */}
            <g transform="translate(440, 155)">
              {/* Complex footprint */}
              <rect x="-5" y="-5" width="130" height="100" fill="#4B1F8C" opacity="0.06" rx="8" />
              
              {/* Main building shadow */}
              <rect x="8" y="8" width="80" height="75" fill="#4B1F8C" opacity="0.1" rx="5" />
              {/* Main building */}
              <rect x="0" y="0" width="80" height="75" fill="white" rx="5" stroke="#4B1F8C" strokeWidth="1.8" />
              
              {/* Window rows */}
              {[0, 1, 2, 3].map((row) =>
                [0, 1, 2, 3].map((col) => (
                  <rect
                    key={`w-${row}-${col}`}
                    x={8 + col * 18}
                    y={8 + row * 16}
                    width="12"
                    height="9"
                    fill="#E8E0F0"
                    rx="1"
                  />
                ))
              )}
              
              {/* Entrance */}
              <rect x="28" y="60" width="24" height="15" fill="#4B1F8C" rx="2" opacity="0.7" />
              <rect x="36" y="62" width="8" height="11" fill="white" rx="1" opacity="0.5" />

              {/* Secondary wing */}
              <rect x="90" y="15" width="30" height="50" fill="white" rx="4" stroke="#4B1F8C" strokeWidth="1" opacity="0.7" />
              {[0, 1, 2].map((row) => (
                <rect key={`sw-${row}`} x="96" y={22 + row * 15} width="18" height="7" fill="#E8E0F0" rx="1" opacity="0.7" />
              ))}
            </g>

            {/* Location pin */}
            <g transform="translate(480, 125)">
              <path d="M 0 0 C -14 -10, -20 -26, -20 -34 A 20 20 0 1 1 20 -34 C 20 -26, 14 -10, 0 0 Z" fill="#4B1F8C" />
              <circle cx="0" cy="-32" r="8" fill="white" />
              <text x="0" y="-28" fontSize="11" fill="#4B1F8C" fontFamily="Montserrat" fontWeight="800" textAnchor="middle">O</text>
            </g>

            {/* Building label card */}
            <g transform="translate(480, 268)">
              <rect x="-110" y="-16" width="220" height="38" fill="white" rx="8" filter="drop-shadow(0 2px 8px rgba(75,31,140,0.1))" />
              <rect x="-110" y="-16" width="220" height="38" fill="none" rx="8" stroke="#4B1F8C" strokeWidth="0.8" opacity="0.25" />
              <text x="0" y="-1" fontSize="11" fill="#4B1F8C" fontFamily="Montserrat" fontWeight="700" textAnchor="middle">Raritan Plaza · 110 Fieldcrest Ave</text>
              <text x="0" y="15" fontSize="9" fill="#7C6A99" fontFamily="Montserrat" fontWeight="500" textAnchor="middle">3rd Floor · Suite 328</text>
            </g>

            {/* Driving path from Route 1 */}
            <path
              d="M 140 300 Q 200 270, 280 245 Q 350 228, 440 225"
              fill="none"
              stroke="#4B1F8C"
              strokeWidth="2.5"
              strokeDasharray="8,6"
              opacity="0.45"
            />
            {/* Arrow heads */}
            <g transform="translate(280, 243) rotate(-10)">
              <polygon points="0,0 -4,8 4,8" fill="#4B1F8C" opacity="0.45" />
            </g>
            <g transform="translate(380, 228) rotate(-5)">
              <polygon points="0,0 -4,8 4,8" fill="#4B1F8C" opacity="0.45" />
            </g>

            {/* Car icon on route */}
            <g transform="translate(200, 262)" opacity="0.4">
              <rect x="-10" y="-5" width="20" height="10" fill="#4B1F8C" rx="3" />
              <rect x="-7" y="-8" width="14" height="6" fill="#4B1F8C" rx="2" />
              <circle cx="-5" cy="6" r="2.5" fill="#4B1F8C" />
              <circle cx="5" cy="6" r="2.5" fill="#4B1F8C" />
            </g>

            {/* Trees */}
            {[
              [330, 170], [600, 170], [700, 260], [250, 420], [150, 440],
              [680, 380], [800, 300], [380, 100], [550, 380],
            ].map(([cx, cy], i) => (
              <g key={`t-${i}`} transform={`translate(${cx}, ${cy})`} opacity="0.2">
                <circle cx="0" cy="-5" r="7" fill="#6B9B6B" />
                <rect x="-1" y="-1" width="2" height="8" fill="#8B7355" />
              </g>
            ))}

            {/* Parking indicator */}
            <g transform="translate(560, 200)" opacity="0.5">
              <rect x="-10" y="-10" width="20" height="20" fill="white" rx="3" stroke="#4B1F8C" strokeWidth="1" />
              <text x="0" y="4" fontSize="13" fill="#4B1F8C" fontFamily="Montserrat" fontWeight="800" textAnchor="middle">P</text>
            </g>
            <text x="560" y="222" fontSize="7" fill="#7C6A99" fontFamily="Montserrat" fontWeight="500" textAnchor="middle" opacity="0.5">Free Parking</text>

          </svg>
        </div>

        {/* Address Card */}
        <div style={{
          margin: "0 auto",
          width: 740,
          background: "white",
          borderRadius: 16,
          padding: "24px 32px",
          boxShadow: "0 4px 24px rgba(75, 31, 140, 0.08)",
          display: "flex",
          alignItems: "center",
          gap: 24,
          position: "relative",
          zIndex: 2,
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4B1F8C, #A678E2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white" />
            </svg>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#4B1F8C", marginBottom: 3, fontFamily: "'Playfair Display', serif" }}>
              Orenda Psychiatry — Edison Office
            </div>
            <div style={{ fontSize: 12, color: "#5A4A6E", lineHeight: 1.6 }}>
              Raritan Plaza · 110 Fieldcrest Avenue, 3rd Floor<br />
              Suite 328 · Edison, NJ 08837
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F0EBF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" fill="#4B1F8C" />
              </svg>
            </div>
            <div style={{ fontSize: 9, color: "#7C6A99", fontWeight: 500, textAlign: "center" }}>
              Free<br />Parking
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 20, position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 11, color: "#7C6A99", fontWeight: 400, letterSpacing: 0.8 }}>
            Compassionate care in the heart of Raritan Center, Edison
          </div>
          <div style={{ fontSize: 10, color: "#B8A5D0", marginTop: 6 }}>
            orendapsych.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectionsEdison;
