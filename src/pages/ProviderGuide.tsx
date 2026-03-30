import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import orendaLogo from "@/assets/orenda-logo-purple.png";
import {
  Download, MapPin, Phone, Clock, Train, Car, Shield, Bike, Users, Coffee,
  Accessibility, Building2, MonitorSpeaker, Wifi, KeyRound, ClipboardCheck,
  CalendarCheck, Bell, DoorOpen, Stethoscope, ArrowRight, UserCheck,
  CheckCircle2, HeartPulse, Mail, AlertTriangle, Sparkles, CoffeeIcon,
  Scale, Activity, Armchair, GlassWater
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

const ProviderGuide = () => {
  const posterRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async (format: "email" | "slack" | "poster") => {
    if (!posterRef.current) return;
    const configs = {
      email: { pixelRatio: 2, name: "hoboken-provider-guide-email" },
      slack: { pixelRatio: 2, name: "hoboken-provider-guide-slack" },
      poster: { pixelRatio: 3, name: "hoboken-provider-guide-poster" },
    };
    const c = configs[format];
    try {
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

  const ImgTile = ({ src, alt }: { src: string; alt: string }) => (
    <div style={{
      borderRadius: 10, overflow: "hidden", height: 130,
      border: "1px solid rgba(26,0,102,0.05)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );

  const CardSection = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <div style={{
      background: "white", borderRadius: 14, padding: "20px 22px",
      border: `1px solid ${babyBluePale}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: 16,
      ...style,
    }}>
      {children}
    </div>
  );

  const SectionHeader = ({ color1, color2, label, icon: Icon }: { color1: string; color2: string; label: string; icon?: any }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <SectionBar color1={color1} color2={color2} />
      {Icon && (
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: `linear-gradient(135deg, ${color1}, ${color2})`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={11} color="white" strokeWidth={2.5} />
        </div>
      )}
      <div style={{ fontSize: 11, fontWeight: 700, color: brand, textTransform: "uppercase", letterSpacing: 1.5 }}>{label}</div>
    </div>
  );

  // Visual timeline step
  const TimelineStep = ({ num, icon: Icon, title, desc, isLast }: { num: number; icon: any; title: string; desc: string; isLast?: boolean }) => (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%", background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 3px 10px rgba(26,0,102,0.25)", position: "relative",
        }}>
          <Icon size={14} color="white" strokeWidth={2.2} />
          <div style={{
            position: "absolute", top: -4, right: -4, width: 16, height: 16,
            borderRadius: "50%", background: babyBlue, border: "2px solid white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 8, fontWeight: 800, color: brand,
          }}>{num}</div>
        </div>
        {!isLast && <div style={{ width: 2, flex: 1, background: `linear-gradient(180deg, ${brandMid}40, ${babyBlue}40)`, minHeight: 16 }} />}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : 14, flex: 1 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: brand, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 10, color: "#444", lineHeight: 1.6 }}>{desc}</div>
      </div>
    </div>
  );

  // Icon feature tile (infographic style)
  const FeatureTile = ({ icon: Icon, label, sublabel, bg, iconBg: iBg }: { icon: any; label: string; sublabel?: string; bg: string; iconBg: string }) => (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      padding: "14px 8px 12px", borderRadius: 12, background: bg,
      border: `1px solid ${babyBluePale}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", background: iBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}>
        <Icon size={16} color="white" strokeWidth={2.2} />
      </div>
      <div style={{ fontSize: 9, fontWeight: 700, color: "#222", textAlign: "center", lineHeight: 1.3 }}>{label}</div>
      {sublabel && <div style={{ fontSize: 8, color: "#666", textAlign: "center", lineHeight: 1.3, marginTop: -2 }}>{sublabel}</div>}
    </div>
  );

  // Alert/highlight callout
  const Callout = ({ icon: Icon, title, children, variant = "info" }: { icon: any; title: string; children: React.ReactNode; variant?: "info" | "warning" | "key" }) => {
    const styles = {
      info: { bg: babyBluePale, border: `${babyBlue}60`, iconBg: iconBgBlue, iconColor: "white" },
      warning: { bg: "#FFF8ED", border: "#F5D89A60", iconBg: "linear-gradient(135deg, #E8A838, #F5C563)", iconColor: "white" },
      key: { bg: "#F3EEFF", border: `${brandLight}40`, iconBg: iconBg, iconColor: "white" },
    };
    const s = styles[variant];
    return (
      <div style={{
        background: s.bg, borderRadius: 10, padding: "12px 14px",
        border: `1px solid ${s.border}`, marginTop: 10,
        display: "flex", gap: 10, alignItems: "flex-start",
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7, background: s.iconBg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={13} color={s.iconColor} strokeWidth={2.2} />
        </div>
        <div>
          <div style={{ fontSize: 9.5, fontWeight: 700, color: brand, marginBottom: 2 }}>{title}</div>
          <div style={{ fontSize: 10, color: "#444", lineHeight: 1.65 }}>{children}</div>
        </div>
      </div>
    );
  };

  // Stat/metric badge
  const StatBadge = ({ value, label, icon: Icon }: { value: string; label: string; icon: any }) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 14px", borderRadius: 10,
      background: `linear-gradient(135deg, ${brand}08, ${babyBluePale})`,
      border: `1px solid ${babyBlue}40`,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={14} color="white" strokeWidth={2.2} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color: brand, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 8.5, color: "#666", fontWeight: 500, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );

  const Bullet = ({ children }: { children: React.ReactNode }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: brand, flexShrink: 0, marginTop: 6 }} />
      <div style={{ fontSize: 10.5, color: "#333", lineHeight: 1.7 }}>{children}</div>
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

        {/* Hero */}
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
          <CardSection>
            <SectionHeader color1={brand} color2={babyBlue} label="About the Space" icon={Building2} />
            <div style={{ fontSize: 10.5, color: "#333", lineHeight: 1.75 }}>
              Set on the 9th floor of a modern glass building overlooking the Hudson River, Hoboken Riverfront Center offers a professional and inspiring workspace. Located just <strong style={{ color: brand }}>15 minutes from Midtown Manhattan</strong>, this prime location combines easy access to NYC with the charm of Hoboken. The workspace features floor-to-ceiling windows, high-speed internet, modern meeting rooms, outdoor seating, and on-site support staff.
            </div>
          </CardSection>

          {/* Workspace Photos */}
          <CardSection>
            <SectionHeader color1={babyBlueMid} color2={babyBluePale} label="Workspace Environment" />
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
          </CardSection>

          {/* Private Office */}
          <CardSection>
            <SectionHeader color1={brand} color2={brandLight} label="Our Private Office" icon={Sparkles} />
            <div style={{ fontSize: 10.5, color: "#333", lineHeight: 1.75, marginBottom: 14 }}>
              Orenda Psychiatry occupies a <strong style={{ color: brand }}>dedicated private office</strong> within the Riverfront Center. Our space is designed with patient comfort and clinical professionalism in mind.
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
          </CardSection>

          {/* Facilities */}
          <CardSection>
            <SectionHeader color1={babyBlueMid} color2={brand} label="Facilities" />
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
          </CardSection>

          {/* Access & Contact */}
          <CardSection>
            <SectionHeader color1={brand} color2={babyBlueMid} label="Access & Contact" icon={Phone} />
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
          </CardSection>

          {/* ========================================== */}
          {/* PROVIDER OPERATIONS GUIDE — VISUAL REDESIGN */}
          {/* ========================================== */}

          {/* Section Divider — Banner style */}
          <div style={{
            background: `linear-gradient(135deg, ${brand}, ${brandMid})`,
            borderRadius: 14, padding: "18px 22px", marginBottom: 16,
            display: "flex", alignItems: "center", gap: 14,
            boxShadow: "0 4px 20px rgba(26,0,102,0.25)",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)",
            }}>
              <ClipboardCheck size={20} color="white" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "white", lineHeight: 1.2 }}>
                Provider Operations Guide
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.75)", marginTop: 3, fontWeight: 500, letterSpacing: 0.5 }}>
                In-person visit procedures · Hoboken Office
              </div>
            </div>
          </div>

          {/* Provider Guide Intro */}
          <CardSection>
            <div style={{ fontSize: 10.5, color: "#333", lineHeight: 1.75 }}>
              This guide provides <strong style={{ color: brand }}>operational guidance for providers conducting in-person visits</strong> at the Hoboken location, including visits required for <strong style={{ color: brand }}>Schedule II prescription regulations</strong>. Review these steps prior to scheduling patients.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14 }}>
              <StatBadge value="24hr" label="Advance Notice Required" icon={Bell} />
              <StatBadge value="9076" label="Office Number" icon={DoorOpen} />
              <StatBadge value="9th" label="Floor Level" icon={Building2} />
            </div>
          </CardSection>

          {/* Scheduling — Infographic tiles */}
          <CardSection>
            <SectionHeader color1={brand} color2={babyBlue} label="Scheduling In-Person Visits" icon={CalendarCheck} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              <FeatureTile icon={CalendarCheck} label="Sign Up for Date & Time" sublabel="Register your in-office day" bg={babyBluePale} iconBg={iconBg} />
              <FeatureTile icon={Users} label="Schedule Same-Day Patients" sublabel="Match patients to your office day" bg="#F3EEFF" iconBg={iconBgBlue} />
              <FeatureTile icon={Bell} label="Arrange Access in Advance" sublabel="Don't assume — confirm access" bg="#F3EEFF" iconBg={iconBg} />
              <FeatureTile icon={ArrowRight} label="Coordinate Coverage" sublabel="Cover patients as needed" bg={babyBluePale} iconBg={iconBgBlue} />
            </div>
            <Callout icon={AlertTriangle} title="Important" variant="warning">
              Do <strong>not assume</strong> building access is already arranged. If you are not permanently scheduled in Hoboken, access must be confirmed with the NJ admin <strong>before</strong> each visit.
            </Callout>
            <Callout icon={Users} title="Interim Staffing" variant="info">
              A full-time NJ provider may be added in the future. During this period, providers may need to see their own patients or coordinate with covering providers.
            </Callout>
          </CardSection>

          {/* Building Access — Visual flow */}
          <CardSection>
            <SectionHeader color1={babyBlueMid} color2={brand} label="Building Access Coordination" icon={Shield} />
            <div style={{
              background: `linear-gradient(135deg, ${brand}06, ${babyBluePale}80)`,
              borderRadius: 10, padding: 16, border: `1px solid ${babyBlue}30`, marginBottom: 12,
            }}>
              <TimelineStep num={1} icon={Mail} title="Email the NJ Admin" desc="Provide the date, time, and names of provider + patient(s) at least 24 hours before the visit." />
              <TimelineStep num={2} icon={Shield} title="Admin Notifies Building Security" desc="The admin team adds both provider and patient to the ground-floor security check-in list." />
              <TimelineStep num={3} icon={CheckCircle2} title="Access Confirmed" desc="Provider and patient can check in with lobby security on the day of the visit." isLast />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Callout icon={Mail} title="Hoboken Office Contact" variant="key">
                <a href="mailto:Hoboken.Riverfront@regus.com" style={{ color: brandMid, fontWeight: 600, textDecoration: "none", fontSize: 10 }}>
                  Hoboken.Riverfront@regus.com
                </a>
              </Callout>
              <Callout icon={UserCheck} title="NJ Admin Contact" variant="info">
                <span style={{ color: "#888", fontStyle: "italic", fontSize: 9.5 }}>[To be provided]</span>
              </Callout>
            </div>
          </CardSection>

          {/* Arrival — Visual timeline */}
          <CardSection>
            <SectionHeader color1={brand} color2={brandLight} label="Arrival & Office Entry" icon={DoorOpen} />
            <div style={{
              background: `linear-gradient(135deg, ${brand}06, ${babyBluePale}80)`,
              borderRadius: 10, padding: 16, border: `1px solid ${babyBlue}30`,
            }}>
              <TimelineStep num={1} icon={UserCheck} title="Bring Valid Photo ID" desc="Required for building security check-in." />
              <TimelineStep num={2} icon={Shield} title="Check In at Lobby Security" desc="Present your ID to the security desk." />
              <TimelineStep num={3} icon={CheckCircle2} title="Receive Building Pass" desc="Security will issue a pass for the office floor." />
              <TimelineStep num={4} icon={DoorOpen} title="Proceed to Office 9076" desc="Take the elevator to the 9th floor." />
              <TimelineStep num={5} icon={KeyRound} title="Retrieve Key from Lockbox" desc="Use the lockbox mounted outside the office door." isLast />
            </div>

            <div style={{
              marginTop: 12, background: `linear-gradient(135deg, ${brand}, ${brandMid})`,
              borderRadius: 10, padding: "14px 18px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>
                <KeyRound size={18} color="white" strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Lockbox Code</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "white", letterSpacing: 3, fontFamily: "'Montserrat', sans-serif" }}>7123</div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 9, color: "rgba(255,255,255,0.6)", fontStyle: "italic", maxWidth: 120, textAlign: "right", lineHeight: 1.4 }}>
                Return key to lockbox after your visit
              </div>
            </div>
          </CardSection>

          {/* Office Setup — Icon grid */}
          <CardSection>
            <SectionHeader color1={babyBlueMid} color2={babyBluePale} label="Office Setup for Patient Visits" icon={Stethoscope} />
            <div style={{ fontSize: 10.5, color: "#333", lineHeight: 1.75, marginBottom: 14 }}>
              The office is fully equipped to support in-person patient appointments:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <FeatureTile icon={Armchair} label="Patient Seating" sublabel="Consultation chairs" bg={babyBluePale} iconBg={iconBg} />
              <FeatureTile icon={GlassWater} label="Water & Coffee" sublabel="For providers & patients" bg="#F3EEFF" iconBg={iconBgBlue} />
              <FeatureTile icon={Scale} label="Scale" sublabel="Patient weighing" bg="#F3EEFF" iconBg={iconBg} />
              <FeatureTile icon={Activity} label="Blood Pressure Cuff" sublabel="Vitals monitoring" bg={babyBluePale} iconBg={iconBgBlue} />
            </div>
            <Callout icon={Coffee} title="Beverage Note" variant="info">
              Regus coffee/tea service is <strong>not</strong> included in the account. The office contains stocked beverages that can be offered to patients.
            </Callout>
          </CardSection>

          {/* Wi-Fi — Visual card */}
          <CardSection style={{
            background: `linear-gradient(135deg, ${brand}08, ${babyBluePale})`,
            border: `1px solid ${babyBlue}50`,
          }}>
            <SectionHeader color1={brand} color2={babyBlue} label="Wi-Fi Access" icon={Wifi} />
            <div style={{
              background: "white", borderRadius: 10, padding: "16px 18px",
              border: `1px solid ${babyBlue}40`,
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(26,0,102,0.2)",
              }}>
                <Wifi size={22} color="white" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: 9, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Network</div>
                  <div style={{ fontSize: 9, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Password</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 2 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: brand }}>Regus Net Wi-Fi</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: brand, letterSpacing: 2, fontFamily: "'Montserrat', monospace" }}>167845630</div>
                </div>
              </div>
            </div>
          </CardSection>

          {/* Patient Arrival — Visual process */}
          <CardSection>
            <SectionHeader color1={brand} color2={brandLight} label="Patient Arrival & Check-In" icon={UserCheck} />

            {/* Quick stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
              <FeatureTile icon={Clock} label="Arrive 10 Min Early" bg={babyBluePale} iconBg={iconBg} />
              <FeatureTile icon={UserCheck} label="Bring Valid ID" bg="#F3EEFF" iconBg={iconBgBlue} />
              <FeatureTile icon={Shield} label="Lobby Check-In" bg={babyBluePale} iconBg={iconBg} />
            </div>

            {/* Check-in form CTA */}
            <div style={{
              background: `linear-gradient(135deg, ${brand}, ${brandMid})`,
              borderRadius: 10, padding: "14px 18px", marginBottom: 12,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>
                <ClipboardCheck size={18} color="white" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "white" }}>Digital Check-In Form</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Patients complete this form upon arrival</div>
              </div>
              <a
                href="/nj-office/check-in"
                style={{
                  background: "white", color: brand, fontWeight: 700, fontSize: 9,
                  padding: "6px 12px", borderRadius: 6, textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 4,
                }}
              >
                Open Form <ArrowRight size={10} />
              </a>
            </div>

            {/* Form collects */}
            <div style={{ fontSize: 10, color: "#444", lineHeight: 1.65, marginBottom: 6 }}>
              <strong style={{ color: brand }}>The form collects:</strong>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px", marginBottom: 10 }}>
              {["Patient full name", "Appointment date", "Office location", "Appointment time", "Notes for provider"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "#444" }}>
                  <CheckCircle2 size={10} color={brandLight} strokeWidth={2.5} />
                  {item}
                </div>
              ))}
            </div>

            <Callout icon={AlertTriangle} title="Escort Required" variant="warning">
              After check-in, <strong>promptly escort the patient</strong> from the waiting area into the office. Patients should not move around the coworking space unaccompanied.
            </Callout>
          </CardSection>

          {/* Coverage & Coordination */}
          <CardSection>
            <SectionHeader color1={babyBlueMid} color2={brand} label="Coverage & Scheduling" icon={Users} />
            <div style={{ fontSize: 10.5, color: "#333", lineHeight: 1.75, marginBottom: 10 }}>
              During the interim period before full-time NJ staffing:
            </div>
            <div style={{
              background: `linear-gradient(135deg, ${brand}06, ${babyBluePale}80)`,
              borderRadius: 10, padding: 14, border: `1px solid ${babyBlue}30`,
            }}>
              <TimelineStep num={1} icon={Users} title="Approved Covering Providers" desc="If you cannot see a patient in person, patients may be seen by approved covering providers if scheduling allows." />
              <TimelineStep num={2} icon={HeartPulse} title="Provider Volunteers" desc="Several providers have volunteered to assist with in-person coverage on an as-needed basis." />
              <TimelineStep num={3} icon={Mail} title="Email the NJ Admin" desc="Add any patients who need to be scheduled in Hoboken so coverage can be coordinated properly." isLast />
            </div>
          </CardSection>

          {/* End-of-Visit — Checklist style */}
          <CardSection>
            <SectionHeader color1={brand} color2={babyBlue} label="End-of-Visit Checklist" icon={CheckCircle2} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { icon: KeyRound, label: "Return Key to Lockbox", bg: babyBluePale },
                { icon: Sparkles, label: "Leave Office Clean & Organized", bg: "#F3EEFF" },
                { icon: CheckCircle2, label: "Dispose of Any Trash", bg: "#F3EEFF" },
                { icon: ArrowRight, label: "Reset Space for Next Provider", bg: babyBluePale },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 14px", borderRadius: 10, background: item.bg,
                  border: `1px solid ${babyBluePale}`,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: i % 2 === 0 ? iconBg : iconBgBlue,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <item.icon size={13} color="white" strokeWidth={2.2} />
                  </div>
                  <div style={{ fontSize: 9.5, fontWeight: 600, color: "#333", lineHeight: 1.3 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </CardSection>

          {/* Follow-Up Care — Highlight card */}
          <CardSection style={{
            background: `linear-gradient(135deg, ${brand}08, ${babyBluePale})`,
            border: `1px solid ${babyBlue}50`,
          }}>
            <SectionHeader color1={brand} color2={brandLight} label="Follow-Up Care" icon={HeartPulse} />
            <div style={{
              background: "white", borderRadius: 10, padding: "16px 18px",
              border: `1px solid ${babyBlue}40`,
              display: "flex", gap: 14, alignItems: "flex-start",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10, background: iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(26,0,102,0.2)", flexShrink: 0,
              }}>
                <HeartPulse size={20} color="white" strokeWidth={2} />
              </div>
              <div style={{ fontSize: 10.5, color: "#333", lineHeight: 1.75 }}>
                After the visit, ensure the patient's <strong style={{ color: brand }}>follow-up appointment is scheduled with their original provider via telehealth</strong>, unless a clinical reason requires another in-person visit. This maintains <strong style={{ color: brand }}>continuity of care</strong> while meeting NJ in-person prescribing requirements.
              </div>
            </div>
          </CardSection>

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

export default ProviderGuide;
