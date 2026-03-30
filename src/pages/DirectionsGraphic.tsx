import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import orendaLogo from "@/assets/orenda-logo-purple.png";
import { Download, MapPin, Phone, Clock, Train, Car, Shield, Bike, Users, Coffee, Accessibility, Building2, MonitorSpeaker } from "lucide-react";

// Office building & environment photos
import buildingExterior from "@/assets/hoboken/building-exterior.png";
import reception from "@/assets/hoboken/reception.png";
import coworking from "@/assets/hoboken/coworking.png";
import lounge from "@/assets/hoboken/lounge.png";
import kitchen from "@/assets/hoboken/kitchen.png";
import lounge2 from "@/assets/hoboken/lounge2.png";

// Patient comfort setup images (all except lamp)
import artPurpleGold from "@/assets/moodboard/art-purple-gold.png";
import plantTropical from "@/assets/moodboard/plant-tropical.png";
import sideTableGold from "@/assets/moodboard/side-table-gold.png";
import chairsBlueGold from "@/assets/moodboard/chairs-blue-gold.png";
import coffeeTableMarble from "@/assets/moodboard/coffee-table-marble.png";

const facilities = [
  { icon: Train, label: "Major Transport Links" },
  { icon: MonitorSpeaker, label: "Meeting Rooms" },
  { icon: Car, label: "Parking" },
  { icon: Shield, label: "24/7 CCTV Security" },
  { icon: Bike, label: "Bicycle Storage" },
  { icon: Users, label: "Common Areas" },
  { icon: Coffee, label: "Business Lounge" },
  { icon: Building2, label: "City Center Location" },
  { icon: Accessibility, label: "Wheelchair Accessible" },
];

const brand = "#1A0066";
const brandMid = "#3D1A99";
const brandLight = "#7B5FBF";
const babyBlue = "#B8D8EB";
const babyBluePale = "#E8F2F8";
const babyBlueMid = "#9CC5DD";

const iconBg = `linear-gradient(135deg, ${brand}, ${brandMid})`;
const iconBgBlue = `linear-gradient(135deg, ${babyBlueMid}, ${babyBlue})`;

const iconBgs = [
  iconBg, iconBgBlue, iconBg, iconBgBlue, iconBg, iconBgBlue, iconBg, iconBgBlue, iconBg,
];

const tileBgs = [
  babyBluePale, "#F3EEFF", babyBluePale, "#F3EEFF", babyBluePale, "#F3EEFF", babyBluePale, "#F3EEFF", babyBluePale,
];

const DirectionsGraphic = () => {
  const posterRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async (format: "email" | "slack" | "poster") => {
    if (!posterRef.current) return;
    const configs = {
      email: { pixelRatio: 2, name: "hoboken-overview-email" },
      slack: { pixelRatio: 2, name: "hoboken-overview-slack" },
      poster: { pixelRatio: 3, name: "hoboken-overview-poster" },
    };
    const c = configs[format];
    try {
      // Multiple warm-up passes to ensure all images load
      await toPng(posterRef.current, { cacheBust: true });
      await toPng(posterRef.current, { cacheBust: true });
      await new Promise(r => setTimeout(r, 300));
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: c.pixelRatio,
        cacheBust: true,
        backgroundColor: "#FFFFFF",
        width: posterRef.current.scrollWidth,
        height: posterRef.current.scrollHeight,
      });
      const link = document.createElement("a");
      link.download = `${c.name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  }, []);

  const SectionBar = ({ color1, color2 }: { color1: string; color2: string }) => (
    <div style={{ width: 3, height: 18, borderRadius: 2, background: `linear-gradient(180deg, ${color1}, ${color2})`, flexShrink: 0 }} />
  );

  const ImgTile = ({ src, alt, span }: { src: string; alt: string; span?: boolean }) => (
    <div style={{
      borderRadius: 10,
      overflow: "hidden",
      gridColumn: span ? "span 2" : undefined,
      height: span ? 160 : 130,
      border: "1px solid rgba(26,0,102,0.05)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F0F0F5", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", justifyContent: "center" }}>
        <Button onClick={() => handleDownload("email")} className="gap-2" size="lg" style={{ background: brand }}>
          <Download className="w-4 h-4" /> Email
        </Button>
        <Button onClick={() => handleDownload("slack")} className="gap-2" size="lg" variant="outline" style={{ borderColor: brand, color: brand }}>
          <Download className="w-4 h-4" /> Slack
        </Button>
        <Button onClick={() => handleDownload("poster")} className="gap-2" size="lg" variant="outline" style={{ borderColor: brand, color: brand }}>
          <Download className="w-4 h-4" /> Poster
        </Button>
      </div>

      <div
        ref={posterRef}
        style={{
          width: 600,
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Montserrat', sans-serif",
          background: `linear-gradient(180deg, ${brand} 0%, ${brandMid} 8%, white 35%, white 100%)`,
        }}
      >
        {/* Top accent */}
        <div style={{ height: 3, background: babyBlue }} />

        {/* Hero: Building exterior */}
        <div style={{ position: "relative", width: "100%", height: 220, overflow: "hidden" }}>
          <img src={buildingExterior} alt="221 River Street" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(180deg, rgba(26,0,102,0.55) 0%, rgba(26,0,102,0.75) 100%)`,
          }} />
          <div style={{ position: "absolute", top: 20, left: 28, right: 28, zIndex: 2 }}>
            <img src={orendaLogo} alt="Orenda Psychiatry" style={{ width: 150, filter: "brightness(0) invert(1)" }} />
          </div>
          <div style={{ position: "absolute", bottom: 24, left: 28, right: 28, zIndex: 2 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "white", lineHeight: 1.15 }}>
              Hoboken Location Overview
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 6, fontWeight: 500 }}>
              Riverfront Center · 221 River Street, 9th Floor · Hoboken, NJ
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 28px 0" }}>

          {/* About */}
          <div style={{
            background: "white", borderRadius: 14, padding: "20px 22px",
            border: `1px solid ${babyBluePale}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <SectionBar color1={brand} color2={babyBlue} />
              <div style={{ fontSize: 11, fontWeight: 700, color: brand, textTransform: "uppercase", letterSpacing: 1.5 }}>About the Space</div>
            </div>
            <div style={{ fontSize: 10.5, color: "#333", lineHeight: 1.75 }}>
              Set on the 9th floor of a modern glass building overlooking the Hudson River, Hoboken Riverfront Center offers a professional and inspiring workspace. Located just <strong style={{ color: brand }}>15 minutes from Midtown Manhattan</strong>, this prime location combines easy access to NYC with the charm of Hoboken. The workspace features floor-to-ceiling windows, high-speed internet, modern meeting rooms, outdoor seating, and on-site support staff.
            </div>
          </div>

          {/* Office Environment Photos */}
          <div style={{
            background: "white", borderRadius: 14, padding: "20px 22px",
            border: `1px solid ${babyBluePale}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <SectionBar color1={babyBlueMid} color2={babyBluePale} />
              <div style={{ fontSize: 11, fontWeight: 700, color: brand, textTransform: "uppercase", letterSpacing: 1.5 }}>Workspace Environment</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <ImgTile src={reception} alt="Reception area" />
              <ImgTile src={lounge} alt="Lounge area" />
              <ImgTile src={lounge2} alt="Seating area" />
              <ImgTile src={coworking} alt="Coworking space" />
              <ImgTile src={kitchen} alt="Kitchen & dining" />
            </div>
            <div style={{ fontSize: 10, color: "#333", lineHeight: 1.65, marginTop: 12 }}>
              The shared workspace includes a <strong style={{ color: brand }}>business lounge, fully equipped kitchen, and communal dining area</strong> — perfect for breaks between sessions, informal meetings, or simply enjoying the waterfront views.
            </div>
          </div>

          {/* Private Office Setup */}
          <div style={{
            background: "white", borderRadius: 14, padding: "20px 22px",
            border: `1px solid ${babyBluePale}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <SectionBar color1={brand} color2={brandLight} />
              <div style={{ fontSize: 11, fontWeight: 700, color: brand, textTransform: "uppercase", letterSpacing: 1.5 }}>Our Private Office</div>
            </div>
            <div style={{ fontSize: 10.5, color: "#333", lineHeight: 1.75, marginBottom: 14 }}>
              Orenda Psychiatry occupies a <strong style={{ color: brand }}>dedicated private office</strong> within the Riverfront Center. Our space is designed with patient comfort and clinical professionalism in mind — featuring calming décor, elegant seating, curated greenery, and thoughtful accents that create a warm, welcoming environment for every visit. Everything is chosen to help patients feel at ease from the moment they arrive.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { src: chairsBlueGold, alt: "Velvet accent chairs" },
                { src: plantTropical, alt: "Bird of Paradise plant" },
                { src: sideTableGold, alt: "Gold side table" },
                { src: coffeeTableMarble, alt: "Marble coffee table" },
                { src: artPurpleGold, alt: "Abstract wall art" },
              ].map((item, i) => (
                <div key={i} style={{
                  borderRadius: 10, overflow: "hidden", height: 120,
                  border: `1px solid ${babyBluePale}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}>
                  <img src={item.src} alt={item.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10, color: "#333", lineHeight: 1.65, marginTop: 12 }}>
              Every detail is selected with <strong style={{ color: brand }}>patient comfort</strong> in mind — from velvet accent chairs and calming greenery to curated art and marble-topped tables that create a serene, welcoming atmosphere.
            </div>
          </div>

          {/* Facilities */}
          <div style={{
            background: "white", borderRadius: 14, padding: "20px 22px",
            border: `1px solid ${babyBluePale}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <SectionBar color1={babyBlueMid} color2={brand} />
              <div style={{ fontSize: 11, fontWeight: 700, color: brand, textTransform: "uppercase", letterSpacing: 1.5 }}>Facilities</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {facilities.map((f, i) => (
                <div key={i} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  padding: "12px 4px 10px", borderRadius: 10, background: tileBgs[i],
                  border: `1px solid ${babyBluePale}`,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", background: iconBgs[i],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}>
                    <f.icon size={14} color="white" strokeWidth={2.2} />
                  </div>
                  <div style={{ fontSize: 8.5, fontWeight: 600, color: "#222", textAlign: "center", lineHeight: 1.25 }}>
                    {f.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Access & Contact */}
          <div style={{
            background: "white", borderRadius: 14, padding: "20px 22px",
            border: `1px solid ${babyBluePale}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <SectionBar color1={brand} color2={babyBlueMid} />
              <div style={{ fontSize: 11, fontWeight: 700, color: brand, textTransform: "uppercase", letterSpacing: 1.5 }}>Access & Contact</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 18px" }}>
              {[
                { Icon: MapPin, title: "Address", text: "221 River Street, 9th Floor\nHoboken, NJ 07030", bg: babyBluePale, ic: brand },
                { Icon: Phone, title: "Phone", text: "+1 201-721-8500", bg: "#F3EEFF", ic: brandMid },
                { Icon: Clock, title: "24/7 Access", text: "Private office &\ndedicated coworking", bg: babyBluePale, ic: babyBlueMid },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, background: item.bg,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <item.Icon size={13} color={item.ic} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: brand, marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 9, color: "#333", lineHeight: 1.5, whiteSpace: "pre-line" }}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "8px 28px 20px" }}>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${babyBlue}80, transparent)`, marginBottom: 12 }} />
          <div style={{ fontSize: 9.5, color: brand, fontWeight: 600, letterSpacing: 1 }}>orendapsych.com</div>
          <div style={{ fontSize: 8.5, color: "#666", marginTop: 3, fontStyle: "italic" }}>Compassionate care, conveniently located on the Hoboken waterfront</div>
        </div>

        {/* Bottom accent */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${brand}, ${brandMid}, ${babyBlue}, ${brandMid}, ${brand})` }} />
      </div>
    </div>
  );
};

export default DirectionsGraphic;
