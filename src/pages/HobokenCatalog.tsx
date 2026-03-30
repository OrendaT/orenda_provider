import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import orendaLogo from "@/assets/orenda-logo-purple.png";
import checkinQR from "@/assets/checkin-qr-code.png";
import {
  Download, MapPin, Phone, Clock, Train, Car, Shield, Bike, Users, Coffee,
  Accessibility, Building2, MonitorSpeaker, Wifi, KeyRound, ClipboardCheck,
  CalendarCheck, DoorOpen, ArrowRight, UserCheck, CheckCircle2, HeartPulse,
  Mail, AlertTriangle, Sparkles, Scale, Activity, Armchair, GlassWater
} from "lucide-react";

import buildingExterior from "@/assets/hoboken/building-exterior.png";
import reception from "@/assets/hoboken/reception.png";
import coworking from "@/assets/hoboken/coworking.png";
import lounge from "@/assets/hoboken/lounge.png";
import kitchen from "@/assets/hoboken/kitchen.png";
import lounge2 from "@/assets/hoboken/lounge2.png";
import artPurpleGold from "@/assets/moodboard/art-purple-gold.png";
import plantTropical from "@/assets/moodboard/plant-tropical.png";
import sideTableGold from "@/assets/moodboard/side-table-gold.png";
import chairsBlueGold from "@/assets/moodboard/chairs-blue-gold.png";
import coffeeTableMarble from "@/assets/moodboard/coffee-table-marble.png";

const B = "#1A0066";
const BM = "#3D1A99";
const BL = "#7B5FBF";
const BB = "#B8D8EB";
const BBP = "#E8F2F8";
const BBM = "#9CC5DD";
const IG = `linear-gradient(135deg, ${B}, ${BM})`;
const IGB = `linear-gradient(135deg, ${BBM}, ${BB})`;
const formLink = "/nj-office/check-in";
const signupLink = "https://docs.google.com/spreadsheets/d/1AlQMKY2BVwiY90PyGps3KXAXrEo23-dR/edit?usp=sharing&ouid=108976942397339672197&rtpof=true&sd=true";

const facilities = [
  { icon: Train, label: "Transport Links" },
  { icon: MonitorSpeaker, label: "Meeting Rooms" },
  { icon: Car, label: "Parking" },
  { icon: Shield, label: "24/7 Security" },
  { icon: Bike, label: "Bicycle Storage" },
  { icon: Users, label: "Common Areas" },
  { icon: Coffee, label: "Business Lounge" },
  { icon: Building2, label: "City Center" },
  { icon: Accessibility, label: "Accessible" },
];
const igs = [IG, IGB, IG, IGB, IG, IGB, IG, IGB, IG];
const tbs = [BBP, "#F3EEFF", BBP, "#F3EEFF", BBP, "#F3EEFF", BBP, "#F3EEFF", BBP];

const HobokenCatalog = () => {
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);

  const capturePage = async (el: HTMLDivElement) => {
    // warm-up passes
    await toPng(el, { cacheBust: true });
    await toPng(el, { cacheBust: true });
    await new Promise(r => setTimeout(r, 300));
    return toPng(el, {
      pixelRatio: 3, cacheBust: true, backgroundColor: "#FFFFFF",
      width: el.scrollWidth, height: el.scrollHeight,
    });
  };

  const handleDownload = useCallback(async () => {
    const pages = [page1Ref.current, page2Ref.current, page3Ref.current].filter(Boolean) as HTMLDivElement[];
    if (pages.length === 0) return;
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [620, 877] });
      for (let i = 0; i < pages.length; i++) {
        const imgData = await capturePage(pages[i]);
        if (i > 0) pdf.addPage([620, 877]);
        pdf.addImage(imgData, "PNG", 0, 0, 620, 877);
      }
      pdf.save("hoboken-provider-catalog.pdf");
    } catch (e) { console.error(e); }
  }, []);

  // ── Primitives ──
  const Bar = ({ c1, c2 }: { c1: string; c2: string }) => (
    <div style={{ width: 3, height: 16, borderRadius: 2, background: `linear-gradient(180deg, ${c1}, ${c2})`, flexShrink: 0 }} />
  );
  const Hdr = ({ c1, c2, label, icon: Icon }: { c1: string; c2: string; label: string; icon?: any }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
      <Bar c1={c1} c2={c2} />
      {Icon && <div style={{ width: 20, height: 20, borderRadius: 5, background: `linear-gradient(135deg, ${c1}, ${c2})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={10} color="white" strokeWidth={2.5} /></div>}
      <div style={{ fontSize: 10, fontWeight: 700, color: B, textTransform: "uppercase", letterSpacing: 1.5 }}>{label}</div>
    </div>
  );
  const Crd = ({ children, s }: { children: React.ReactNode; s?: React.CSSProperties }) => (
    <div style={{ background: "white", borderRadius: 12, padding: "16px 18px", border: `1px solid ${BBP}`, boxShadow: "0 1px 8px rgba(0,0,0,0.03)", marginBottom: 12, ...s }}>{children}</div>
  );
  const IC = ({ icon: I, bg, sz = 24 }: { icon: any; bg: string; sz?: number }) => (
    <div style={{ width: sz, height: sz, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
      <I size={sz * 0.42} color="white" strokeWidth={2.2} />
    </div>
  );
  const ImgT = ({ src, alt, h = 110 }: { src: string; alt: string; h?: number }) => (
    <div style={{ borderRadius: 8, overflow: "hidden", height: h, border: `1px solid ${BBP}20`, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
      <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
  const Step = ({ n, icon: I, t }: { n: number; icon: any; t: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 0" }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: IG, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
        <I size={10} color="white" strokeWidth={2.2} />
        <div style={{ position: "absolute", top: -3, right: -5, width: 13, height: 13, borderRadius: "50%", background: BB, border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 800, color: B }}>{n}</div>
      </div>
      <div style={{ fontSize: 9, fontWeight: 600, color: "#333" }}>{t}</div>
    </div>
  );
  const Chip = ({ icon: I, label, bg, iBg }: { icon: any; label: string; bg: string; iBg: string }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 8px", borderRadius: 7, background: bg, border: `1px solid ${BBP}` }}>
      <IC icon={I} bg={iBg} sz={20} />
      <div style={{ fontSize: 8, fontWeight: 600, color: "#333", lineHeight: 1.2 }}>{label}</div>
    </div>
  );

  // ── Page divider ──
  const PageDivider = ({ pageNum, label }: { pageNum: number; label: string }) => (
    <div style={{ position: "relative", margin: "4px 0 14px" }}>
      <div style={{ height: 2, background: `linear-gradient(90deg, ${B}, ${BM}, ${BB}, ${BM}, ${B})` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0 0" }}>
        <div style={{ fontSize: 8, color: "#999", fontWeight: 500 }}>Orenda Psychiatry · Hoboken Provider Catalog</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ fontSize: 8, color: B, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: IG, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "white" }}>{pageNum}</div>
        </div>
      </div>
    </div>
  );

  const W = 620;

  return (
    <div style={{ minHeight: "100vh", background: "#F0F0F5", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap", justifyContent: "center" }}>
        <Button onClick={handleDownload} className="gap-2" size="lg" style={{ background: B }}>
          <Download className="w-4 h-4" /> Download Catalog
        </Button>
      </div>

      

      {/* ═══════════════════════════════════════ */}
      {/* PAGE 1: COVER */}
      {/* ═══════════════════════════════════════ */}
      <div ref={page1Ref} style={{ width: W, height: 877, fontFamily: "'Montserrat', sans-serif", background: "white", position: "relative", overflow: "hidden", marginBottom: 24, boxShadow: "0 2px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${B}, ${BM}, ${BB}, ${BM}, ${B})` }} />
        <div style={{ position: "relative", width: "100%", height: 340, overflow: "hidden" }}>
          <img src={buildingExterior} alt="221 River Street" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, rgba(26,0,102,0.85) 0%, rgba(61,26,153,0.7) 50%, rgba(184,216,235,0.3) 100%)` }} />
          <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
          <div style={{ position: "absolute", bottom: -30, left: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(184,216,235,0.06)" }} />
          <div style={{ position: "absolute", top: 28, left: 36, zIndex: 2 }}>
            <img src={orendaLogo} alt="Orenda" style={{ width: 140, filter: "brightness(0) invert(1)" }} />
          </div>
          <div style={{ position: "absolute", bottom: 32, left: 36, right: 36, zIndex: 2 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(6px)", borderRadius: 6, padding: "5px 12px", border: "1px solid rgba(255,255,255,0.12)", marginBottom: 10 }}>
              <ClipboardCheck size={12} color={BB} strokeWidth={2.2} />
              <span style={{ fontSize: 8, color: BB, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Provider Catalog</span>
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "white", lineHeight: 1.15 }}>
              Hoboken Office
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 400, color: "rgba(255,255,255,0.8)", lineHeight: 1.3, marginTop: 4 }}>
              Location Overview & Provider Operations Guide
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 8, fontWeight: 500 }}>
              Riverfront Center · 221 River Street, 9th Floor · Hoboken, NJ 07030
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div style={{ padding: "24px 36px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: B, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Contents</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
            {[
              { n: "01", t: "About the Space" },
              { n: "02", t: "Workspace & Private Office" },
              { n: "03", t: "Facilities & Access" },
              { n: "04", t: "Provider Scheduling" },
              { n: "05", t: "Building Access & Arrival" },
              { n: "06", t: "Office Setup & Wi-Fi" },
              { n: "07", t: "Patient Check-In" },
              { n: "08", t: "Coverage & Follow-Up" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${BBP}` }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: BB, width: 24 }}>{item.n}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#444" }}>{item.t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* About the Space */}
        <div style={{ padding: "0 28px" }}>
          <Crd>
            <Hdr c1={B} c2={BB} label="About the Space" icon={Building2} />
            <div style={{ fontSize: 10, color: "#333", lineHeight: 1.75 }}>
              Set on the 9th floor of a modern glass building overlooking the Hudson River, Hoboken Riverfront Center offers a professional workspace. Located just <strong style={{ color: B }}>15 minutes from Midtown Manhattan</strong>, this prime location combines easy access to NYC with the charm of Hoboken — featuring floor-to-ceiling windows, high-speed internet, meeting rooms, outdoor seating, and on-site staff.
            </div>
          </Crd>
        </div>

        {/* Footer */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <div style={{ padding: "0 28px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 7, color: "#aaa" }}>Orenda Psychiatry · Hoboken Provider Catalog</div>
            <div style={{ fontSize: 7, color: "#aaa" }}>Page 1</div>
          </div>
          <div style={{ height: 4, background: `linear-gradient(90deg, ${B}, ${BM}, ${BB}, ${BM}, ${B})` }} />
        </div>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* PAGE 2: LOCATION DETAILS */}
      {/* ═══════════════════════════════════════ */}
      <div ref={page2Ref} style={{ width: W, height: 877, fontFamily: "'Montserrat', sans-serif", background: "white", position: "relative", overflow: "hidden", marginBottom: 24, boxShadow: "0 2px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${B}, ${BM}, ${BB}, ${BM}, ${B})` }} />
        <div style={{ padding: "14px 28px 0" }}>
          {/* Header bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <img src={orendaLogo} alt="Orenda" style={{ width: 90, opacity: 0.5 }} />
            <div style={{ fontSize: 8, color: B, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Location Overview</div>
          </div>

          {/* Workspace Photos */}
          <Crd>
            <Hdr c1={BBM} c2={BBP} label="Workspace Environment" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              <ImgT src={reception} alt="Reception" />
              <ImgT src={lounge} alt="Lounge" />
              <ImgT src={lounge2} alt="Seating" />
              <ImgT src={coworking} alt="Coworking" />
              <ImgT src={kitchen} alt="Kitchen" />
            </div>
            <div style={{ fontSize: 9, color: "#444", lineHeight: 1.6, marginTop: 10 }}>
              Shared amenities include a <strong style={{ color: B }}>business lounge, kitchen, and dining area</strong> — ideal for breaks between sessions.
            </div>
          </Crd>

          {/* Private Office */}
          <Crd>
            <Hdr c1={B} c2={BL} label="Orenda Private Office" icon={Sparkles} />
            <div style={{ fontSize: 10, color: "#333", lineHeight: 1.7, marginBottom: 10 }}>
              A <strong style={{ color: B }}>dedicated private office</strong> designed for patient comfort — calming décor, elegant seating, curated greenery, and warm accents.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              {[
                { src: chairsBlueGold, alt: "Accent chairs" },
                { src: plantTropical, alt: "Greenery" },
                { src: sideTableGold, alt: "Side table" },
                { src: coffeeTableMarble, alt: "Coffee table" },
                { src: artPurpleGold, alt: "Wall art" },
              ].map((item, i) => <ImgT key={i} src={item.src} alt={item.alt} h={95} />)}
            </div>
          </Crd>

          {/* Facilities + Contact side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 10, marginBottom: 12 }}>
            <Crd s={{ marginBottom: 0 }}>
              <Hdr c1={BBM} c2={B} label="Facilities" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
                {facilities.map((f, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 3px 7px", borderRadius: 8, background: tbs[i], border: `1px solid ${BBP}` }}>
                    <IC icon={f.icon} bg={igs[i]} sz={24} />
                    <div style={{ fontSize: 7, fontWeight: 600, color: "#333", textAlign: "center", lineHeight: 1.2 }}>{f.label}</div>
                  </div>
                ))}
              </div>
            </Crd>
            <Crd s={{ marginBottom: 0 }}>
              <Hdr c1={B} c2={BBM} label="Contact" icon={Phone} />
              {[
                { Icon: MapPin, title: "Address", text: "221 River St, 9th Fl\nOffice 9076\nHoboken, NJ 07030", ic: B },
                { Icon: Phone, title: "Phone", text: "+1 201-721-8500", ic: BM },
                { Icon: Clock, title: "24/7 Access", text: "Private office &\ncoworking", ic: BBM },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: i % 2 === 0 ? BBP : "#F3EEFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <item.Icon size={11} color={item.ic} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontSize: 8, fontWeight: 700, color: B, marginBottom: 1 }}>{item.title}</div>
                    <div style={{ fontSize: 8, color: "#444", lineHeight: 1.4, whiteSpace: "pre-line" }}>{item.text}</div>
                  </div>
                </div>
              ))}
            </Crd>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <div style={{ padding: "0 28px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 7, color: "#aaa" }}>Orenda Psychiatry · Hoboken Provider Catalog</div>
            <div style={{ fontSize: 7, color: "#aaa" }}>Page 2</div>
          </div>
          <div style={{ height: 4, background: `linear-gradient(90deg, ${B}, ${BM}, ${BB}, ${BM}, ${B})` }} />
        </div>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* PAGE 3: PROVIDER OPERATIONS */}
      {/* ═══════════════════════════════════════ */}
      <div ref={page3Ref} style={{ width: W, height: 877, fontFamily: "'Montserrat', sans-serif", background: "white", position: "relative", overflow: "hidden", marginBottom: 24, boxShadow: "0 2px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${B}, ${BM}, ${BB}, ${BM}, ${B})` }} />
        <div style={{ padding: "14px 28px 0" }}>
          {/* Header bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <img src={orendaLogo} alt="Orenda" style={{ width: 90, opacity: 0.5 }} />
            <div style={{ fontSize: 8, color: B, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Provider Operations</div>
          </div>

          {/* Scheduling + Building Access */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <Crd s={{ marginBottom: 0 }}>
              <Hdr c1={B} c2={BB} label="Scheduling" icon={CalendarCheck} />
              <div style={{ fontSize: 9, color: "#444", lineHeight: 1.6, marginBottom: 8 }}>
                <strong style={{ color: B }}>Sign up in advance</strong> for your office day. Schedule patients for the <strong style={{ color: B }}>same day</strong>. Do not assume access is arranged.
              </div>
              <a href={signupLink} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 10px", borderRadius: 6, background: IG,
                color: "white", fontWeight: 700, fontSize: 8, textDecoration: "none",
              }}>
                <CalendarCheck size={9} /> Open Sign-Up Sheet <ArrowRight size={8} />
              </a>
              <div style={{ marginTop: 8, padding: "5px 8px", borderRadius: 5, background: "#FFF8ED", border: "1px solid #F5D89A40", fontSize: 8, color: "#8B6914", lineHeight: 1.4, display: "flex", alignItems: "center", gap: 5 }}>
                <AlertTriangle size={9} color="#E8A838" style={{ flexShrink: 0 }} />
                <span>Confirm access with NJ admin before each visit</span>
              </div>
            </Crd>

            <Crd s={{ marginBottom: 0 }}>
              <Hdr c1={BBM} c2={B} label="Building Access" icon={Shield} />
              <div style={{ fontSize: 9, color: "#444", lineHeight: 1.6, marginBottom: 8 }}>
                Email NJ admin <strong style={{ color: B }}>24hrs ahead</strong> with date, time & patient names. Admin adds you to the security check-in list.
              </div>
              <div style={{ padding: "5px 8px", borderRadius: 5, background: "#F3EEFF", border: `1px solid ${BL}25`, fontSize: 8, color: "#666", fontStyle: "italic" }}>
                NJ Admin Email: <span style={{ color: B, fontWeight: 600 }}>[Pending]</span>
              </div>
            </Crd>
          </div>

          {/* Arrival Steps */}
          <Crd>
            <Hdr c1={B} c2={BL} label="Arrival & Entry" icon={DoorOpen} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 10px" }}>
              <Step n={1} icon={UserCheck} t="Bring valid photo ID" />
              <Step n={2} icon={Shield} t="Check in at lobby security" />
              <Step n={3} icon={CheckCircle2} t="Receive building pass" />
              <Step n={4} icon={DoorOpen} t="Proceed to Office 9076" />
              <Step n={5} icon={KeyRound} t="Get key from lockbox" />
            </div>
            <div style={{ marginTop: 8, background: IG, borderRadius: 8, padding: "9px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <KeyRound size={14} color="white" strokeWidth={2} />
              <div>
                <span style={{ fontSize: 7, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Lockbox Code </span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "white", letterSpacing: 3, marginLeft: 4 }}>7123</span>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 7, color: "rgba(255,255,255,0.45)", fontStyle: "italic" }}>Return after visit</div>
            </div>
          </Crd>

          {/* Office Setup + Wi-Fi */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <Crd s={{ marginBottom: 0 }}>
              <Hdr c1={BBM} c2={BBP} label="Orenda Private Office Set-Up" icon={Armchair} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                <Chip icon={Armchair} label="Patient Seating" bg={BBP} iBg={IG} />
                <Chip icon={GlassWater} label="Water & Coffee" bg="#F3EEFF" iBg={IGB} />
                <Chip icon={Scale} label="Scale" bg="#F3EEFF" iBg={IG} />
                <Chip icon={Activity} label="BP Cuff" bg={BBP} iBg={IGB} />
              </div>
              <div style={{ fontSize: 7.5, color: "#888", marginTop: 6, lineHeight: 1.3 }}>
                Regus coffee not included — stocked beverages available.
              </div>
            </Crd>

            <Crd s={{ marginBottom: 0, background: `linear-gradient(135deg, ${B}05, ${BBP})`, border: `1px solid ${BB}40` }}>
              <Hdr c1={B} c2={BB} label="Wi-Fi" icon={Wifi} />
              <div style={{ background: "white", borderRadius: 8, padding: "10px 12px", border: `1px solid ${BB}30` }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 7, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Network</div>
                  <div style={{ fontSize: 7, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Password</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: B }}>Regus Net Wi-Fi</div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: B, letterSpacing: 1.5 }}>167845630</div>
                </div>
              </div>
            </Crd>
          </div>

          {/* Patient Check-In with QR */}
          <div style={{
            background: IG, borderRadius: 12, padding: "14px 16px", marginBottom: 10,
            display: "flex", alignItems: "center", gap: 14, position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
            <a href={formLink} target="_blank" rel="noopener noreferrer" style={{ background: "white", borderRadius: 8, padding: 5, display: "block", flexShrink: 0, boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}>
              <img src={checkinQR} alt="QR" style={{ width: 70, height: 70, display: "block" }} />
            </a>
            <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
              <div style={{ fontSize: 7, color: BB, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 2 }}>Patient Check-In</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "white", lineHeight: 1.3, marginBottom: 2 }}>Scan QR or tap to open check-in form</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.55)", marginBottom: 5 }}>15 min early · Valid ID · Lobby security first</div>
              <a href={formLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "white", color: B, fontWeight: 700, fontSize: 8, padding: "4px 10px", borderRadius: 5, textDecoration: "none" }}>
                Open Form <ArrowRight size={8} />
              </a>
            </div>
          </div>

          {/* Escort warning */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 7, background: "#FFF8ED", border: "1px solid #F5D89A40", marginBottom: 10 }}>
            <AlertTriangle size={10} color="#E8A838" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 8, color: "#8B6914", lineHeight: 1.4 }}><strong>Escort patients</strong> from waiting area — they should not move around the coworking space unaccompanied.</div>
          </div>

          {/* Coverage + End of Visit */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <Crd s={{ marginBottom: 0 }}>
              <Hdr c1={BBM} c2={B} label="Coverage" icon={Users} />
              <div style={{ fontSize: 9, color: "#444", lineHeight: 1.6 }}>
                Approved covering providers may see patients if needed. Email NJ admin to coordinate scheduling.
              </div>
            </Crd>
            <Crd s={{ marginBottom: 0 }}>
              <Hdr c1={B} c2={BB} label="End of Visit" icon={CheckCircle2} />
              {["Return key to lockbox", "Leave office clean", "Dispose of trash", "Reset for next provider"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 8, color: "#444", marginBottom: 2 }}>
                  <CheckCircle2 size={8} color={BL} strokeWidth={2.5} />{t}
                </div>
              ))}
            </Crd>
          </div>

          {/* Follow-up */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 10, background: `linear-gradient(135deg, ${B}05, ${BBP})`, border: `1px solid ${BB}35`, marginBottom: 8 }}>
            <IC icon={HeartPulse} bg={IG} sz={26} />
            <div style={{ fontSize: 9, color: "#333", lineHeight: 1.6 }}>
              Schedule patient follow-up with <strong style={{ color: B }}>original provider via telehealth</strong> unless another in-person visit is clinically required.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <div style={{ padding: "0 28px 6px" }}>
            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${BB}80, transparent)`, marginBottom: 8 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 9, color: B, fontWeight: 600, letterSpacing: 1 }}>orendapsych.com</div>
                <div style={{ fontSize: 7.5, color: "#888", marginTop: 2, fontStyle: "italic" }}>Compassionate care on the Hoboken waterfront</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src={orendaLogo} alt="Orenda" style={{ width: 70, opacity: 0.12 }} />
                <div style={{ fontSize: 7, color: "#aaa" }}>Page 3</div>
              </div>
            </div>
          </div>
          <div style={{ height: 4, background: `linear-gradient(90deg, ${B}, ${BM}, ${BB}, ${BM}, ${B})` }} />
        </div>
      </div>
    </div>
  );
};

export default HobokenCatalog;
