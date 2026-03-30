import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Check, Download, MapPin, Shield, Phone, Navigation, Coffee, Car, Train, Users, Camera, Bike, MonitorSmartphone, Accessibility, Clock, DoorOpen, KeyRound, Armchair, Scale, HeartPulse, Wifi, Pencil, PencilOff, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Type, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toPng } from "html-to-image";
import logo from "@/assets/orenda-logo-purple.png";
import buildingImg from "@/assets/hoboken-riverfront.png";
import buildingEntranceImg from "@/assets/hoboken-building-entrance.png";
import hobokenMapImg from "@/assets/hoboken-map-branded.png";
import receptionImg from "@/assets/hoboken/reception.png";
import loungeImg from "@/assets/hoboken/lounge.png";
import lounge2Img from "@/assets/hoboken/lounge2.png";
import kitchenImg from "@/assets/hoboken/kitchen.png";
import coworkingImg from "@/assets/hoboken/coworking.png";

const SLIDE_W = 1920;
const SLIDE_H = 1080;

const facilities = [
  { icon: Shield, label: "24/7 Building Security" },
  { icon: Clock, label: "24/7 Access" },
  { icon: Coffee, label: "Lounge & Kitchen" },
  { icon: Car, label: "Parking Available" },
  { icon: Train, label: "Major Transport Links" },
  { icon: Users, label: "Meeting Rooms" },
  { icon: Camera, label: "24/7 CCTV" },
  { icon: Bike, label: "Bicycle Storage" },
  { icon: MonitorSmartphone, label: "Business Lounge" },
  { icon: Navigation, label: "City/Town Center" },
  { icon: Accessibility, label: "Wheelchair Accessible" },
];

const galleryImages = [
  { src: buildingImg, label: "Building Exterior" },
  { src: receptionImg, label: "Reception" },
  { src: loungeImg, label: "Lounge" },
  { src: lounge2Img, label: "Business Lounge" },
  { src: kitchenImg, label: "Kitchen" },
  { src: coworkingImg, label: "Coworking Space" },
];

// Shared constants matching site design tokens
const PURPLE_DARK = 'hsl(270, 60%, 15%)'; // --foreground
const PURPLE_PRIMARY = 'hsl(270, 100%, 25%)'; // --primary
const PURPLE_MID = 'hsl(270, 80%, 40%)'; // --accent
const PURPLE_LIGHT = 'hsl(270, 60%, 72%)'; // --italic-accent
const LAVENDER = 'hsl(270, 20%, 96%)'; // --background
const FONT_DISPLAY = "'Cormorant Garamond', Georgia, serif";
const FONT_BODY = "'Montserrat', system-ui, sans-serif";

// SVG cross pattern matching NJHoboken's pattern overlay
const crossPatternSvg = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

// Dot pattern
const dotPatternSvg = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23ffffff' fill-opacity='0.15'/%3E%3C/svg%3E")`;

/* ── Individual Slide Components (rendered at 1920×1080) ─────────────── */

function Slide1_Hero() {
  return (
    <div className="w-full h-full flex" style={{ background: `linear-gradient(135deg, hsl(270, 60%, 92%) 0%, hsl(270, 30%, 97%) 50%, #fff 100%)` }}>
      <div className="flex-1 flex items-center px-[120px] relative">
        {/* Subtle dot pattern on left panel */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: dotPatternSvg }} />
        <div className="relative z-10">
          <img src={logo} alt="Orenda Psychiatry" style={{ height: 64, marginBottom: 48 }} />
          <p style={{ fontSize: 16, letterSpacing: '0.5em', textTransform: 'uppercase' as const, color: PURPLE_MID, marginBottom: 24, fontFamily: FONT_BODY, fontWeight: 500 }}>
            01 — Hoboken, New Jersey
          </p>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 120, fontWeight: 300, lineHeight: 0.95, color: PURPLE_DARK, marginBottom: 24 }}>
            Riverfront<br />
            <em style={{ color: PURPLE_LIGHT, fontStyle: 'italic' }}>Center</em>
          </h1>
          <div style={{ width: 80, height: 3, background: `${PURPLE_LIGHT}66`, marginBottom: 32 }} />
          <p style={{ fontSize: 24, color: PURPLE_MID, fontFamily: FONT_DISPLAY, lineHeight: 1.6 }}>
            221 River Street, 9th Floor, Unit 9076<br />
            Hoboken, NJ 07030
          </p>
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <img src={buildingImg} alt="Hoboken Riverfront" className="absolute inset-0 w-full h-full object-cover" />
        {/* Purple gradient overlay */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, hsl(270, 60%, 92%) 0%, transparent 20%)` }} />
      </div>
    </div>
  );
}

function Slide2_About() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: `linear-gradient(180deg, #fff 0%, ${LAVENDER} 100%)` }}>
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: dotPatternSvg }} />
      <div className="flex-1 flex px-[120px] items-center relative z-10">
        <div className="flex gap-[60px] items-center w-full">
          <div className="flex-1">
            <p style={{ fontSize: 14, letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: PURPLE_LIGHT, marginBottom: 20, fontFamily: FONT_BODY, fontWeight: 600 }}>About This Location</p>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 64, fontWeight: 300, color: PURPLE_DARK, lineHeight: 1.1, marginBottom: 32 }}>
              A Modern Space for <em style={{ color: PURPLE_LIGHT, fontStyle: 'italic' }}>Exceptional Care</em>
            </h2>
            <p style={{ fontSize: 22, color: PURPLE_MID, fontFamily: FONT_DISPLAY, lineHeight: 1.7, maxWidth: 600 }}>
              Located on the Hudson River waterfront with stunning views of the Manhattan skyline, our Hoboken office offers a modern, professional setting just 15 minutes from Midtown Manhattan.
            </p>
          </div>
          <div className="flex-1 rounded-[20px] overflow-hidden" style={{ boxShadow: `0 20px 60px ${PURPLE_PRIMARY}20` }}>
            <img src={buildingEntranceImg} alt="Building entrance" className="w-full h-auto object-cover" />
            <div style={{ background: '#fff', padding: '14px 20px' }}>
              <p style={{ fontSize: 16, color: PURPLE_MID, fontFamily: FONT_BODY }}>📍 Look for Wonder Cafe — the entrance is right next to it</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide3_Directions() {
  const steps = [
    { num: "1", text: "Look for Wonder Cafe — use it as your landmark" },
    { num: "2", text: "The building entrance is on River Street with the Riverfront Center signage" },
    { num: "3", text: "Take the elevator to the 9th floor" },
  ];
  return (
    <div className="w-full h-full flex" style={{ background: '#fff' }}>
      <div className="flex-1 flex flex-col justify-center px-[120px]">
        <div className="flex items-center gap-4 mb-10">
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `${PURPLE_PRIMARY}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin style={{ width: 28, height: 28, color: PURPLE_PRIMARY }} />
          </div>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 56, fontWeight: 300, color: PURPLE_DARK }}>Address & Directions</h2>
        </div>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 26, color: PURPLE_DARK, fontWeight: 600, fontFamily: FONT_DISPLAY }}>Regus — Riverfront Center</p>
          <p style={{ fontSize: 24, color: PURPLE_MID, fontFamily: FONT_DISPLAY, marginTop: 4 }}>221 River Street, 9th Floor, Unit 9076</p>
          <p style={{ fontSize: 24, color: PURPLE_MID, fontFamily: FONT_DISPLAY }}>Hoboken, NJ 07030</p>
        </div>
        <div className="flex items-center gap-4 mb-10">
          <div style={{ width: 56, height: 56, borderRadius: 16, background: `${PURPLE_LIGHT}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Navigation style={{ width: 28, height: 28, color: PURPLE_LIGHT }} />
          </div>
          <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 400, color: PURPLE_DARK }}>Finding the Building</h3>
        </div>
        <div className="space-y-6">
          {steps.map((s) => (
            <div key={s.num} className="flex items-start gap-5">
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${PURPLE_PRIMARY}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: PURPLE_PRIMARY }}>{s.num}</span>
              </div>
              <p style={{ fontSize: 24, color: PURPLE_MID, fontFamily: FONT_DISPLAY, lineHeight: 1.5 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <img src={hobokenMapImg} alt="Hoboken Office Map" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>
  );
}

function Slide4_BuildingAccess1() {
  return (
    <div className="w-full h-full flex flex-col justify-center px-[120px] relative" style={{ background: `linear-gradient(135deg, ${PURPLE_DARK} 0%, ${PURPLE_PRIMARY} 100%)` }}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: crossPatternSvg }} />
      <div className="relative z-10">
        <Shield style={{ width: 48, height: 48, color: PURPLE_LIGHT, marginBottom: 40 }} />
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 72, fontWeight: 300, color: '#fff', marginBottom: 72, lineHeight: 1.1 }}>
          Building <em style={{ color: PURPLE_LIGHT, fontStyle: 'italic' }}>Access</em>
        </h2>
        <div className="grid grid-cols-2 gap-16">
          <div>
            <p style={{ fontSize: 36, fontWeight: 600, color: '#fff', fontFamily: FONT_DISPLAY, marginBottom: 20 }}>Ground Floor Entry</p>
            <p style={{ fontSize: 30, color: 'rgba(255,255,255,0.7)', fontFamily: FONT_DISPLAY, lineHeight: 1.6 }}>
              Building doors open Mon–Fri, 7:00 AM – 6:00 PM. The building entrance is accessible 24/7.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 36, fontWeight: 600, color: '#fff', fontFamily: FONT_DISPLAY, marginBottom: 20 }}>After Hours & Weekends</p>
            <p style={{ fontSize: 30, color: 'rgba(255,255,255,0.7)', fontFamily: FONT_DISPLAY, lineHeight: 1.6 }}>
              Doors locked after hours. Security on-site 24/7 — ring the doorbell on the right-hand side of the entrance to be let in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide4b_BuildingAccess2() {
  return (
    <div className="w-full h-full flex flex-col justify-center px-[120px] relative" style={{ background: `linear-gradient(135deg, ${PURPLE_PRIMARY} 0%, hsl(270, 50%, 22%) 100%)` }}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: crossPatternSvg }} />
      <div className="relative z-10">
        <Shield style={{ width: 48, height: 48, color: PURPLE_LIGHT, marginBottom: 40 }} />
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 72, fontWeight: 300, color: '#fff', marginBottom: 72, lineHeight: 1.1 }}>
          Building Access <em style={{ color: PURPLE_LIGHT, fontStyle: 'italic' }}>cont.</em>
        </h2>
        <div className="grid grid-cols-2 gap-16">
          <div>
            <p style={{ fontSize: 36, fontWeight: 600, color: '#fff', fontFamily: FONT_DISPLAY, marginBottom: 20 }}>Check-In Requirement</p>
            <p style={{ fontSize: 30, color: 'rgba(255,255,255,0.7)', fontFamily: FONT_DISPLAY, lineHeight: 1.6 }}>
              Our team will register you with building security. Bring a valid ID and check in at the ground floor to receive a day pass.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 36, fontWeight: 600, color: '#fff', fontFamily: FONT_DISPLAY, marginBottom: 20 }}>Regus Front Desk</p>
            <p style={{ fontSize: 30, color: 'rgba(255,255,255,0.7)', fontFamily: FONT_DISPLAY, lineHeight: 1.6 }}>
              9th Floor · Mon–Fri, 9 AM – 5 PM. After Regus hours, the 9th floor entrance is locked. Ensure our team registers your access for after-hours entry.
            </p>
          </div>
        </div>
        <div style={{ marginTop: 56, background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '24px 32px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontSize: 28, color: 'rgba(255,255,255,0.75)', fontFamily: FONT_DISPLAY, lineHeight: 1.5 }}>
            <span style={{ color: PURPLE_LIGHT, fontWeight: 600 }}>Provider Access After Hours:</span> Coordinate with our team for a swipe card, or be set up directly with the building for 24/7 access. A key and swipe card are available via the lockbox on the outside of the office door.
          </p>
          <p style={{ fontSize: 32, color: '#fff', fontFamily: FONT_DISPLAY, marginTop: 16 }}>
            Lockbox Code: <span style={{ letterSpacing: '0.15em', fontWeight: 600, color: PURPLE_LIGHT }}>7123</span>
          </p>
          <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', fontFamily: FONT_BODY, marginTop: 8 }}>
            Return the swipe card and key to the lockbox immediately after use.
          </p>
        </div>
      </div>
    </div>
  );
}

function Slide5_ContactWiFi() {
  return (
    <div className="w-full h-full flex flex-col justify-center px-[120px] relative" style={{ background: `linear-gradient(135deg, ${PURPLE_DARK} 0%, hsl(270, 50%, 22%) 100%)` }}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: crossPatternSvg }} />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <Phone style={{ width: 44, height: 44, color: PURPLE_LIGHT }} />
          <Wifi style={{ width: 44, height: 44, color: PURPLE_LIGHT }} />
        </div>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 68, fontWeight: 300, color: '#fff', marginBottom: 56, lineHeight: 1.1 }}>
          Contact & <em style={{ color: PURPLE_LIGHT, fontStyle: 'italic' }}>Wi-Fi</em>
        </h2>
        <div className="grid grid-cols-3 gap-12">
          {/* Orenda NJ Admin */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '40px 32px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontSize: 18, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: PURPLE_LIGHT, fontWeight: 600, marginBottom: 28, fontFamily: FONT_BODY }}>Orenda NJ Admin</p>
            <div className="space-y-6">
              <div>
                <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', fontFamily: FONT_BODY, marginBottom: 6 }}>Phone</p>
                <p style={{ fontSize: 36, color: '#fff', fontFamily: FONT_DISPLAY }}>(347) 707-7735</p>
              </div>
              <div style={{ width: 48, height: 1, background: 'rgba(255,255,255,0.12)' }} />
              <div>
                <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', fontFamily: FONT_BODY, marginBottom: 6 }}>Email</p>
                <p style={{ fontSize: 26, color: '#fff', fontFamily: FONT_DISPLAY }}>offices@orendapsych.com</p>
              </div>
            </div>
          </div>
          {/* Regus Hoboken */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '40px 32px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontSize: 18, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: PURPLE_LIGHT, fontWeight: 600, marginBottom: 28, fontFamily: FONT_BODY }}>Regus — Hoboken</p>
            <div className="space-y-6">
              <div>
                <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', fontFamily: FONT_BODY, marginBottom: 6 }}>Phone</p>
                <p style={{ fontSize: 36, color: '#fff', fontFamily: FONT_DISPLAY }}>(201) 484-7855</p>
              </div>
              <div style={{ width: 48, height: 1, background: 'rgba(255,255,255,0.12)' }} />
              <div>
                <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', fontFamily: FONT_BODY, marginBottom: 6 }}>Email</p>
                <p style={{ fontSize: 24, color: '#fff', fontFamily: FONT_DISPLAY }}>Hoboken.RiverSt@regus.com</p>
              </div>
            </div>
          </div>
          {/* Wi-Fi */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '40px 32px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontSize: 18, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: PURPLE_LIGHT, fontWeight: 600, marginBottom: 28, fontFamily: FONT_BODY }}>Wi-Fi Access</p>
            <div className="space-y-6">
              <div>
                <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', fontFamily: FONT_BODY, marginBottom: 6 }}>Network</p>
                <p style={{ fontSize: 36, color: '#fff', fontFamily: FONT_DISPLAY }}>Regus Net Wi-Fi</p>
              </div>
              <div style={{ width: 48, height: 1, background: 'rgba(255,255,255,0.12)' }} />
              <div>
                <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', fontFamily: FONT_BODY, marginBottom: 6 }}>Password</p>
                <p style={{ fontSize: 44, color: '#fff', fontFamily: FONT_DISPLAY, letterSpacing: '0.12em' }}>167845630</p>
              </div>
            </div>
          </div>
        </div>
        {/* Parking note */}
        <div style={{ marginTop: 40, background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px 32px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: 26, color: 'rgba(255,255,255,0.65)', fontFamily: FONT_DISPLAY, lineHeight: 1.5 }}>
            <span style={{ color: PURPLE_LIGHT, fontWeight: 600 }}>Parking & Transit:</span> Street parking and nearby garages available. NJ Transit Hoboken Terminal is a short walk away.
          </p>
        </div>
      </div>
    </div>
  );
}

function Slide7_PrivateOffice() {
  const amenities = [
    { icon: Armchair, label: "Patient Seating" },
    { icon: Scale, label: "Weight Scale" },
    { icon: HeartPulse, label: "BP Cuff" },
    { icon: Wifi, label: "Wi-Fi" },
  ];
  const policies = [
    { icon: Shield, label: "Escort patients at all times" },
    { icon: Coffee, label: "Use in-office beverages only" },
    { icon: KeyRound, label: "Return key to lockbox after visit" },
    { icon: DoorOpen, label: "Leave office clean & reset" },
  ];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center relative" style={{ background: `linear-gradient(180deg, hsl(270, 60%, 12%) 0%, hsl(270, 50%, 22%) 100%)` }}>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: crossPatternSvg }} />
      <div className="relative z-10 flex flex-col items-center">
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 96, fontWeight: 300, color: '#fff', lineHeight: 0.95, marginBottom: 12 }}>
          Our Private <em style={{ color: PURPLE_LIGHT, fontStyle: 'italic' }}>Office</em>
        </h2>
        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.35)', marginBottom: 64, fontFamily: FONT_BODY }}>Fully equipped. Reserved for you.</p>
        <div className="flex gap-12 mb-12">
          {amenities.map((a, i) => (
            <div key={i} className="flex flex-col items-center gap-5">
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <a.icon style={{ width: 44, height: 44, color: PURPLE_LIGHT }} />
              </div>
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontFamily: FONT_BODY }}>{a.label}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {policies.map((p, i) => (
            <div key={i} className="flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '12px 24px' }}>
              <p.icon style={{ width: 16, height: 16, color: PURPLE_LIGHT }} />
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', fontFamily: FONT_BODY }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slide8_Workspace() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: `linear-gradient(160deg, hsl(270,25%,94%) 0%, hsl(270,35%,88%) 40%, hsl(270,45%,82%) 70%, hsl(270,60%,70%) 100%)` }}>
      <div className="px-[100px] pt-[80px] pb-[40px] relative z-10">
        <p style={{ fontSize: 14, letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: 'rgba(0,0,0,0.3)', marginBottom: 16, fontFamily: FONT_BODY }}>The Space</p>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 56, fontWeight: 300, color: PURPLE_DARK }}>
          Workspace <em style={{ color: PURPLE_PRIMARY, fontStyle: 'italic' }}>Environment</em>
        </h2>
      </div>
      <div className="flex-1 px-[100px] pb-[80px] relative z-10">
        <div className="grid grid-cols-3 gap-5 h-full">
          {galleryImages.map((img, i) => (
            <div key={i} className="relative rounded-[16px] overflow-hidden" style={{ boxShadow: '0 8px 30px rgba(89,61,120,0.2)' }}>
              <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0" style={{ background: `linear-gradient(to top, ${PURPLE_DARK}cc, transparent)`, padding: 16 }}>
                <p style={{ fontSize: 18, color: '#fff', fontWeight: 500, fontFamily: FONT_BODY }}>{img.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Slide9_Facilities() {
  return (
    <div className="w-full h-full flex flex-col justify-center px-[120px] relative" style={{ background: LAVENDER }}>
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: dotPatternSvg }} />
      <div className="relative z-10">
        <div className="mb-12">
          <p style={{ fontSize: 14, letterSpacing: '0.4em', textTransform: 'uppercase' as const, color: PURPLE_MID, marginBottom: 16, fontFamily: FONT_BODY }}>Amenities</p>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 64, fontWeight: 300, color: PURPLE_DARK }}>
            Building <em style={{ color: PURPLE_LIGHT, fontStyle: 'italic' }}>Facilities</em>
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {facilities.map((f) => (
            <div key={f.label} className="flex items-center gap-4" style={{ background: '#fff', border: `1px solid ${PURPLE_PRIMARY}10`, borderRadius: 16, padding: '24px 20px', boxShadow: `0 2px 12px ${PURPLE_PRIMARY}08` }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'hsl(270,30%,93%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <f.icon style={{ width: 22, height: 22, color: PURPLE_MID }} />
              </div>
              <p style={{ fontSize: 20, fontWeight: 500, color: PURPLE_DARK, fontFamily: FONT_BODY }}>{f.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <p style={{ fontSize: 16, color: PURPLE_MID, fontFamily: FONT_DISPLAY }}>
            Orenda Psychiatry, PLLC · 221 River Street, 9th Floor, Unit 9076, Hoboken, NJ 07030
          </p>
        </div>
      </div>
    </div>
  );
}

function Slide10_ThankYou() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center relative" style={{ background: `linear-gradient(135deg, ${PURPLE_DARK} 0%, ${PURPLE_PRIMARY} 60%, hsl(270, 50%, 22%) 100%)` }}>
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: crossPatternSvg }} />
      <div className="relative z-10 flex flex-col items-center max-w-[1400px]">
        <img src={logo} alt="Orenda Psychiatry" style={{ height: 72, marginBottom: 56, filter: 'brightness(0) invert(1)' }} />
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 96, fontWeight: 300, color: '#fff', lineHeight: 0.95, marginBottom: 16 }}>
          Thank <em style={{ color: PURPLE_LIGHT, fontStyle: 'italic' }}>You</em>
        </h2>
        <p style={{ fontSize: 28, color: 'rgba(255,255,255,0.5)', fontFamily: FONT_BODY, marginBottom: 72, fontWeight: 300 }}>
          The Orenda New Jersey Admin Team
        </p>
        <div style={{ width: 120, height: 2, background: `${PURPLE_LIGHT}44`, marginBottom: 72 }} />
        <div className="grid grid-cols-3 gap-16" style={{ width: '100%' }}>
          <div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Phone style={{ width: 28, height: 28, color: PURPLE_LIGHT }} />
            </div>
            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.45)', fontFamily: FONT_BODY, marginBottom: 8 }}>Phone</p>
            <p style={{ fontSize: 32, color: '#fff', fontFamily: FONT_DISPLAY }}>(347) 707-7735</p>
          </div>
          <div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Mail style={{ width: 28, height: 28, color: PURPLE_LIGHT }} />
            </div>
            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.45)', fontFamily: FONT_BODY, marginBottom: 8 }}>Email</p>
            <p style={{ fontSize: 32, color: '#fff', fontFamily: FONT_DISPLAY }}>offices@orendapsych.com</p>
          </div>
          <div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <MapPin style={{ width: 28, height: 28, color: PURPLE_LIGHT }} />
            </div>
            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.45)', fontFamily: FONT_BODY, marginBottom: 8 }}>Office</p>
            <p style={{ fontSize: 28, color: '#fff', fontFamily: FONT_DISPLAY }}>221 River St, 9th Floor</p>
            <p style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)', fontFamily: FONT_DISPLAY, marginTop: 4 }}>Hoboken, NJ 07030</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Contact Info for Copy ──────────────────────────────────────────── */
const ADMIN_CONTACT_TEXT = `Orenda NJ Admin Team · (347) 707-7735 · offices@orendapsych.com · 221 River St, 9th Floor, Hoboken, NJ 07030`;

/* ── Formatting Toolbar ─────────────────────────────────────────────── */
function FormattingToolbar() {
  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
  };

  return (
    <div className="sticky top-[57px] z-40 bg-amber-50 border-b border-amber-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-1 flex-wrap">
        <span className="text-amber-700 text-xs font-semibold mr-3 flex items-center gap-1.5">
          <Pencil className="w-3.5 h-3.5" /> EDITING
        </span>
        <div className="h-5 w-px bg-amber-300 mx-1" />
        <button onClick={() => exec('bold')} className="p-1.5 rounded hover:bg-amber-200 text-amber-800 transition-colors" title="Bold">
          <Bold className="w-4 h-4" />
        </button>
        <button onClick={() => exec('italic')} className="p-1.5 rounded hover:bg-amber-200 text-amber-800 transition-colors" title="Italic">
          <Italic className="w-4 h-4" />
        </button>
        <div className="h-5 w-px bg-amber-300 mx-1" />
        <button onClick={() => exec('justifyLeft')} className="p-1.5 rounded hover:bg-amber-200 text-amber-800 transition-colors" title="Align Left">
          <AlignLeft className="w-4 h-4" />
        </button>
        <button onClick={() => exec('justifyCenter')} className="p-1.5 rounded hover:bg-amber-200 text-amber-800 transition-colors" title="Align Center">
          <AlignCenter className="w-4 h-4" />
        </button>
        <button onClick={() => exec('justifyRight')} className="p-1.5 rounded hover:bg-amber-200 text-amber-800 transition-colors" title="Align Right">
          <AlignRight className="w-4 h-4" />
        </button>
        <div className="h-5 w-px bg-amber-300 mx-1" />
        <select
          onChange={(e) => exec('fontSize', e.target.value)}
          defaultValue=""
          className="text-xs bg-white border border-amber-300 rounded px-2 py-1 text-amber-800 cursor-pointer"
        >
          <option value="" disabled>Size</option>
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">X-Large</option>
        </select>
        <select
          onChange={(e) => exec('fontName', e.target.value)}
          defaultValue=""
          className="text-xs bg-white border border-amber-300 rounded px-2 py-1 text-amber-800 cursor-pointer"
        >
          <option value="" disabled>Font</option>
          <option value="Cormorant Garamond">Cormorant Garamond</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Georgia">Georgia</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
        <div className="h-5 w-px bg-amber-300 mx-1" />
        <span className="text-amber-600 text-xs ml-2">Select text on any slide, then format it here</span>
      </div>
    </div>
  );
}

/* ── Slides Array ────────────────────────────────────────────────────── */

const SLIDES: { id: string; label: string; component: React.FC }[] = [
  { id: "hero", label: "1 — Title Slide", component: Slide1_Hero },
  { id: "about", label: "2 — About", component: Slide2_About },
  { id: "directions", label: "3 — Directions", component: Slide3_Directions },
  { id: "access1", label: "4 — Building Access", component: Slide4_BuildingAccess1 },
  { id: "access2", label: "5 — Building Access (cont.)", component: Slide4b_BuildingAccess2 },
  { id: "contact-wifi", label: "6 — Contact & Wi-Fi", component: Slide5_ContactWiFi },
  { id: "office", label: "7 — Private Office", component: Slide7_PrivateOffice },
  { id: "workspace", label: "8 — Workspace", component: Slide8_Workspace },
  { id: "facilities", label: "9 — Facilities", component: Slide9_Facilities },
  { id: "thankyou", label: "10 — Thank You", component: Slide10_ThankYou },
];

/* ── Slide Container with ResizeObserver scaling ─────────────────────── */

function SlideContainer({ children, onRef, editable }: { children: React.ReactNode; onRef: (el: HTMLDivElement | null) => void; editable?: boolean }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = innerRef.current?.parentElement;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setScale(w / SLIDE_W);
    };
    update();
    const observer = new ResizeObserver(() => update());
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const setRefs = useCallback((el: HTMLDivElement | null) => {
    (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    onRef(el);
  }, [onRef]);

  return (
    <div
      ref={setRefs}
      className={`absolute top-0 left-0 origin-top-left ${editable ? 'editable-slide' : ''}`}
      style={{ width: SLIDE_W, height: SLIDE_H, transform: `scale(${scale})` }}
      suppressContentEditableWarning
    >
      {children}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────────────── */


export default function NJHobokenCanvaSlides() {
  const { toast } = useToast();
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [downloadingIdx, setDownloadingIdx] = useState<number | null>(null);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const waitForImages = async (el: HTMLElement) => {
    const imgs = el.querySelectorAll("img");
    await Promise.all(Array.from(imgs).map((img) => new Promise<void>((r) => { if (img.complete) r(); else { img.onload = () => r(); img.onerror = () => r(); } })));
  };

  const captureSlide = async (idx: number): Promise<string> => {
    const el = slideRefs.current[idx];
    if (!el) throw new Error("Slide not found");
    await waitForImages(el);

    // Temporarily make the element full-size for capture
    const prevTransform = el.style.transform;
    const prevWidth = el.style.width;
    const prevHeight = el.style.height;
    el.style.transform = 'none';
    el.style.width = `${SLIDE_W}px`;
    el.style.height = `${SLIDE_H}px`;

    try {
      const dataUrl = await toPng(el, {
        quality: 1,
        pixelRatio: 2,
        width: SLIDE_W,
        height: SLIDE_H,
        backgroundColor: "#ffffff",
        includeQueryParams: true,
      });
      return dataUrl;
    } finally {
      // Restore scaled state
      el.style.transform = prevTransform;
      el.style.width = prevWidth;
      el.style.height = prevHeight;
    }
  };

  const handleCopy = async (idx: number) => {
    try {
      const dataUrl = await captureSlide(idx);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopiedIdx(idx);
      toast({ title: `Slide ${idx + 1} copied!`, description: "Paste into Canva." });
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      toast({ title: "Copy failed", description: "Try downloading instead.", variant: "destructive" });
    }
  };

  const handleDownload = async (idx: number) => {
    setDownloadingIdx(idx);
    try {
      const dataUrl = await captureSlide(idx);
      const link = document.createElement("a");
      link.download = `Hoboken-Slide-${idx + 1}-${SLIDES[idx].id}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: `Slide ${idx + 1} downloaded!` });
    } catch (err) {
      console.error("Download failed:", err);
      toast({ title: "Download failed", variant: "destructive" });
    } finally {
      setDownloadingIdx(null);
    }
  };

  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    try {
      for (let i = 0; i < SLIDES.length; i++) {
        const dataUrl = await captureSlide(i);
        const link = document.createElement("a");
        link.download = `Hoboken-Slide-${i + 1}-${SLIDES[i].id}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        await new Promise((r) => setTimeout(r, 500));
      }
      toast({ title: "All slides downloaded!", description: "Upload them into Canva." });
    } catch (err) {
      console.error("Download all failed:", err);
      toast({ title: "Download failed", variant: "destructive" });
    } finally {
      setDownloadingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-border/40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/site-directory" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`inline-flex items-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors shadow-sm border ${editMode ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-border/50 text-muted-foreground hover:text-foreground'}`}
            >
              {editMode ? <PencilOff className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
              {editMode ? "Editing ON" : "Edit Text"}
            </button>
            <span className="text-muted-foreground text-xs">{SLIDES.length} slides · 1920×1080</span>
            <button
              onClick={handleDownloadAll}
              disabled={downloadingAll}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloadingAll ? "Downloading…" : "Download All PNGs"}
            </button>
          </div>
        </div>
      </div>

      {/* Formatting toolbar when editing */}
      {editMode && <FormattingToolbar />}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <img src={logo} alt="Orenda Psychiatry" className="h-10 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Hoboken Office — Canva Slides</h1>
          <p className="text-muted-foreground text-sm">Copy individual slides to clipboard or download all as PNGs for Canva</p>
          <p className="text-muted-foreground text-xs mt-1">💡 Click <strong>"Edit Text"</strong> to modify text directly on slides. Use the formatting toolbar to bold, italicize, resize, and change fonts.</p>
        </div>


        <div className="space-y-8">
          {SLIDES.map((slide, idx) => {
            const SlideContent = slide.component;
            return (
              <div key={slide.id} className="group">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">{slide.label}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(idx)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-white border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedIdx === idx ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={() => handleDownload(idx)}
                      disabled={downloadingIdx === idx}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-white border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {downloadingIdx === idx ? "…" : "PNG"}
                    </button>
                  </div>
                </div>
                <div className={`rounded-xl overflow-hidden border shadow-lg bg-white relative ${editMode ? 'border-amber-300 ring-2 ring-amber-200' : 'border-border/30'}`} style={{ aspectRatio: `${SLIDE_W}/${SLIDE_H}` }}>
                  <SlideContainer onRef={(el) => { slideRefs.current[idx] = el; }} editable={editMode}>
                    {editMode ? (
                      <div contentEditable suppressContentEditableWarning className="w-full h-full">
                        <SlideContent />
                      </div>
                    ) : (
                      <SlideContent />
                    )}
                  </SlideContainer>
                </div>
              </div>
            );
          })}
        </div>

        {/* Thin footer with copyable contact */}
        <div className="mt-16 mb-8 text-center">
          <div className="inline-flex items-center gap-3">
            <p style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: 'hsl(270, 40%, 55%)', fontWeight: 300, letterSpacing: '0.02em' }}>
              {ADMIN_CONTACT_TEXT}
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(ADMIN_CONTACT_TEXT);
                toast({ title: "Copied!", description: "Admin contact info copied to clipboard." });
              }}
              className="text-muted-foreground hover:text-primary transition-colors"
              title="Copy contact info"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
