import { useRef } from "react";
import { toPng } from "html-to-image";
import { Download, Check, QrCode, ClipboardList, Monitor, Scale, Heart, MapPin, DoorOpen, Clock, Stethoscope, Users, Building2, Sparkles } from "lucide-react";
import orendaLogo from "@/assets/orenda-logo-v2.png";
import artPurpleGold from "@/assets/moodboard/art-purple-gold.png";
import plantTropical from "@/assets/moodboard/plant-tropical.png";
import sideTableGold from "@/assets/moodboard/side-table-gold.png";
import chairsBlueGold from "@/assets/moodboard/chairs-blue-gold.png";
import lampMinimal from "@/assets/moodboard/lamp-minimal.png";
import coffeeTableMarble from "@/assets/moodboard/coffee-table-marble.png";
import checkInSign from "@/assets/check-in-sign.jpg";
import qrCode from "@/assets/qr-code.png";

const OfficeMoodBoard = () => {
  const boardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!boardRef.current) return;
    const dataUrl = await toPng(boardRef.current, {
      width: 1920,
      height: 2700,
      pixelRatio: 2,
      backgroundColor: "#FAF9F7",
    });
    const link = document.createElement("a");
    link.download = "orenda-office-moodboard.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col items-center py-8 px-4">
      <button
        onClick={handleDownload}
        className="mb-6 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4B1F8C] text-white text-sm font-medium hover:bg-[#3A1670] transition-colors shadow-lg"
      >
        <Download className="w-4 h-4" />
        Download Mood Board
      </button>

      <div
        ref={boardRef}
        className="w-full max-w-[1920px] bg-[#FAF9F7] overflow-hidden"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {/* Header */}
        <div className="text-center pt-16 pb-10 px-8">
          <img src={orendaLogo} alt="Orenda Psychiatry" className="h-16 mx-auto mb-6" />
          <h1
            className="text-4xl md:text-5xl font-semibold tracking-tight text-[#2D2A33] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Office Setup Mood Board
          </h1>
          <p className="text-[#7A7580] text-lg max-w-2xl mx-auto">
            A calm, professional, and operationally thoughtful environment for our New Jersey practice locations.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            {["Modern Healthcare", "Calm & Minimal", "Regus-Compatible", "Clinical Compliance"].map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase bg-[#F0EDE8] text-[#6B5F7B] border border-[#E5E0D8]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Color Palette Bar */}
        <div className="flex items-center justify-center gap-6 py-6 px-8">
          <span className="text-xs uppercase tracking-widest text-[#9A9198] font-medium">Palette</span>
          {[
            { color: "#FFFFFF", name: "White" },
            { color: "#F5F0EB", name: "Warm Cream" },
            { color: "#E8E3DD", name: "Soft Beige" },
            { color: "#C5BDB3", name: "Warm Gray" },
            { color: "#B8C5B2", name: "Sage" },
            { color: "#4B1F8C", name: "Orenda Purple" },
            { color: "#2D2A33", name: "Charcoal" },
          ].map((c) => (
            <div key={c.name} className="flex flex-col items-center gap-1.5">
              <div
                className="w-12 h-12 rounded-full border border-[#E5E0D8] shadow-sm"
                style={{ backgroundColor: c.color }}
              />
              <span className="text-[10px] text-[#9A9198] font-medium">{c.name}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-16 border-t border-[#E8E3DD]" />

        {/* Section 1: Reception & Entry */}
        <div className="px-12 py-12">
          <SectionHeader
            icon={<DoorOpen className="w-5 h-5" />}
            title="Reception & Entry Experience"
            subtitle="First impressions that feel welcoming, clear, and efficient"
            number="01"
          />
          <div className="grid grid-cols-12 gap-5 mt-8">
            {/* Check-in sign photo */}
            <div className="col-span-5 rounded-2xl overflow-hidden shadow-md border border-[#E8E3DD] bg-white">
              <img src={checkInSign} alt="QR Check-in Sign" className="w-full h-72 object-cover" />
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="w-4 h-4 text-[#4B1F8C]" />
                  <span className="text-sm font-semibold text-[#2D2A33]">QR Code Check-In Sign</span>
                </div>
                <p className="text-xs text-[#7A7580] leading-relaxed">
                  Wall-mounted or suction-cup sign on glass door. Patients scan to begin intake digitally — no paper forms needed.
                </p>
              </div>
            </div>

            {/* Checklist cards */}
            <div className="col-span-4 flex flex-col gap-4">
              <ChecklistCard
                icon={<ClipboardList className="w-4 h-4" />}
                title="Printed Instruction Card"
                items={["How to scan QR code", "Step-by-step intake guide", "Wi-Fi network & password"]}
              />
              <ChecklistCard
                icon={<Check className="w-4 h-4" />}
                title="Welcome Signage"
                items={["Orenda Psychiatry name plaque", "Suite/office number display", "Hours of operation"]}
              />
              <div className="rounded-2xl bg-[#F0EDE8] border border-[#E5E0D8] p-5 flex items-center gap-4">
                <img src={qrCode} alt="QR Code" className="w-20 h-20 rounded-lg bg-white p-1.5" />
                <div>
                  <p className="text-sm font-semibold text-[#2D2A33]">Patient Check-In QR</p>
                  <p className="text-xs text-[#7A7580] mt-1">Links to digital intake form — eliminates paper workflow</p>
                </div>
              </div>
            </div>

            {/* Art reference */}
            <div className="col-span-3 flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden shadow-sm border border-[#E8E3DD] bg-white flex-1">
                <img src={artPurpleGold} alt="Neutral wall art" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <p className="text-xs font-semibold text-[#2D2A33]">Reception Art</p>
                  <p className="text-[10px] text-[#9A9198] mt-1">Abstract purple & gold — on-brand, calming</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-[#E8E3DD] p-4 shadow-sm">
                <Clock className="w-4 h-4 text-[#4B1F8C] mb-2" />
                <p className="text-xs font-semibold text-[#2D2A33]">"Please Arrive 10 Min Early"</p>
                <p className="text-[10px] text-[#9A9198] mt-1">Small framed reminder sign at reception</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-16 border-t border-[#E8E3DD]" />

        {/* Section 2: Patient Experience / Seating */}
        <div className="px-12 py-12">
          <SectionHeader
            icon={<Heart className="w-5 h-5" />}
            title="Patient Experience & Comfort"
            subtitle="Minimal, warm furnishings that work within a shared office footprint"
            number="02"
          />
          <div className="grid grid-cols-12 gap-5 mt-8">
            <div className="col-span-6 rounded-2xl overflow-hidden shadow-md border border-[#E8E3DD] bg-white">
              <img src={chairsBlueGold} alt="Waiting chairs" className="w-full h-64 object-cover object-center" />
              <div className="p-5">
                <p className="text-sm font-semibold text-[#2D2A33]">Patient Seating</p>
                <p className="text-xs text-[#7A7580] mt-1 leading-relaxed">
                  Velvet channel-tufted chairs with gold-tone frame. Professional yet comfortable — compact enough for Regus suites.
                </p>
              </div>
            </div>
            <div className="col-span-3 flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden shadow-sm border border-[#E8E3DD] bg-white flex-1">
                <img src={plantTropical} alt="Office plant" className="w-full h-44 object-contain bg-[#F8F6F3] p-2" />
                <div className="p-4">
                  <p className="text-xs font-semibold text-[#2D2A33]">Greenery</p>
                  <p className="text-[10px] text-[#9A9198] mt-1">Bird of Paradise — low maintenance, calming presence</p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-sm border border-[#E8E3DD] bg-white">
                <img src={lampMinimal} alt="Floor lamp" className="w-full h-32 object-contain bg-[#F8F6F3] p-2" />
                <div className="p-4">
                  <p className="text-xs font-semibold text-[#2D2A33]">Soft Lighting</p>
                  <p className="text-[10px] text-[#9A9198] mt-1">Warm floor lamp for ambient glow</p>
                </div>
              </div>
            </div>
            <div className="col-span-3 flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden shadow-sm border border-[#E8E3DD] bg-white flex-1">
                <img src={sideTableGold} alt="Side table" className="w-full h-44 object-contain bg-[#F8F6F3] p-2" />
                <div className="p-4">
                  <p className="text-xs font-semibold text-[#2D2A33]">Side Table</p>
                  <p className="text-[10px] text-[#9A9198] mt-1">Gold & glass — holds forms, water</p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-sm border border-[#E8E3DD] bg-white">
                <img src={coffeeTableMarble} alt="Coffee table" className="w-full h-32 object-contain bg-[#F8F6F3] p-2" />
                <div className="p-4">
                  <p className="text-xs font-semibold text-[#2D2A33]">Coffee Table</p>
                  <p className="text-[10px] text-[#9A9198] mt-1">Marble & gold nesting set</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-16 border-t border-[#E8E3DD]" />

        {/* Section 3: Clinical Room */}
        <div className="px-12 py-12">
          <SectionHeader
            icon={<Stethoscope className="w-5 h-5" />}
            title="Clinical Room Essentials"
            subtitle="Minimal equipment for compliant, efficient patient visits"
            number="03"
          />
          <div className="grid grid-cols-4 gap-5 mt-8">
            <ClinicalCard
              icon={<Scale className="w-6 h-6" />}
              title="Digital Scale"
              description="Compact digital body scale for patient vitals intake"
              note="Required for medication management"
            />
            <ClinicalCard
              icon={<Heart className="w-6 h-6" />}
              title="Blood Pressure Cuff"
              description="Automatic digital BP monitor — wrist or arm style"
              note="Clinical compliance essential"
            />
            <ClinicalCard
              icon={<Monitor className="w-6 h-6" />}
              title="Provider Desk Setup"
              description="Clean desk with laptop, charger, and clinical notes access"
              note="Minimal surface, organized cables"
            />
            <ClinicalCard
              icon={<ClipboardList className="w-6 h-6" />}
              title="Clinical Supply Tray"
              description="Small tray for hand sanitizer, tissues, pens, and consent forms"
              note="Keep surface clean and stocked"
            />
          </div>
        </div>

        <div className="mx-16 border-t border-[#E8E3DD]" />

        {/* Section 4: Navigation & Access */}
        <div className="px-12 py-12">
          <SectionHeader
            icon={<MapPin className="w-5 h-5" />}
            title="Navigation & Office Access"
            subtitle="Clear wayfinding so patients arrive stress-free"
            number="04"
          />
          <div className="grid grid-cols-3 gap-5 mt-8">
            <div className="rounded-2xl bg-white border border-[#E8E3DD] p-6 shadow-sm">
              <MapPin className="w-6 h-6 text-[#4B1F8C] mb-3" />
              <p className="text-sm font-semibold text-[#2D2A33]">Google Maps Card</p>
              <p className="text-xs text-[#7A7580] mt-2 leading-relaxed">
                Printed card with QR code linking to Google Maps directions. Sent to patients before first visit via text or email.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#F0EDE8] text-[#6B5F7B]">Hoboken</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#F0EDE8] text-[#6B5F7B]">Edison</span>
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-[#E8E3DD] p-6 shadow-sm">
              <DoorOpen className="w-6 h-6 text-[#4B1F8C] mb-3" />
              <p className="text-sm font-semibold text-[#2D2A33]">Office Door Signage</p>
              <p className="text-xs text-[#7A7580] mt-2 leading-relaxed">
                Clean nameplate: "Orenda Psychiatry — Suite [#]". Mounted at eye level on or beside the office door. Professional vinyl or acrylic.
              </p>
              <div className="mt-4 px-3 py-2 rounded-lg bg-[#4B1F8C] text-white text-xs font-medium text-center">
                Orenda Psychiatry — Suite 328
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-[#E8E3DD] p-6 shadow-sm">
              <Building2 className="w-6 h-6 text-[#4B1F8C] mb-3" />
              <p className="text-sm font-semibold text-[#2D2A33]">Building Access Notes</p>
              <p className="text-xs text-[#7A7580] mt-2 leading-relaxed">
                Brief text/email instructions: lobby entry, elevator floor, suite number, and any keycard or buzzer details for the specific location.
              </p>
              <div className="mt-4 flex gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#E8F5E2] text-[#4A7C3F]">Pre-visit text</span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#E8F5E2] text-[#4A7C3F]">Automated</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-16 border-t border-[#E8E3DD]" />

        {/* Summary strip */}
        <div className="px-12 py-12">
          <SectionHeader
            icon={<Sparkles className="w-5 h-5" />}
            title="Operational Summary"
            subtitle="Everything needed for a compliant, welcoming office — at a glance"
            number="05"
          />
          <div className="grid grid-cols-4 gap-4 mt-8">
            {[
              { icon: <Check className="w-5 h-5" />, label: "Organized Workflow", desc: "Digital check-in eliminates paper bottlenecks" },
              { icon: <QrCode className="w-5 h-5" />, label: "Simple Patient Check-In", desc: "Scan → Fill → Done. No clipboard needed" },
              { icon: <Stethoscope className="w-5 h-5" />, label: "Clinical Compliance", desc: "Scale, BP cuff, and supply tray ready" },
              { icon: <Users className="w-5 h-5" />, label: "Minimal Equipment", desc: "Lean setup fits any Regus-style suite" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-[#4B1F8C] text-white p-6">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-white/70 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-10 px-8 bg-[#F0EDE8]">
          <img src={orendaLogo} alt="Orenda Psychiatry" className="h-10 mx-auto mb-3 opacity-60" />
          <p className="text-xs text-[#9A9198]">
            Orenda Psychiatry · New Jersey · Office Setup Reference · Internal Use Only
          </p>
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({
  icon,
  title,
  subtitle,
  number,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  number: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#4B1F8C] text-white shrink-0">
      {icon}
    </div>
    <div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8A9CB]">{number}</span>
        <h2 className="text-xl font-semibold text-[#2D2A33]" style={{ fontFamily: "'Playfair Display', serif" }}>
          {title}
        </h2>
      </div>
      <p className="text-sm text-[#7A7580] mt-1">{subtitle}</p>
    </div>
  </div>
);

const ChecklistCard = ({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) => (
  <div className="rounded-2xl bg-white border border-[#E8E3DD] p-5 shadow-sm">
    <div className="flex items-center gap-2 mb-3">
      <div className="text-[#4B1F8C]">{icon}</div>
      <span className="text-sm font-semibold text-[#2D2A33]">{title}</span>
    </div>
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-xs text-[#7A7580]">
          <Check className="w-3.5 h-3.5 text-[#B8C5B2] mt-0.5 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const ClinicalCard = ({
  icon,
  title,
  description,
  note,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  note: string;
}) => (
  <div className="rounded-2xl bg-white border border-[#E8E3DD] p-6 shadow-sm">
    <div className="w-12 h-12 rounded-xl bg-[#F5F0EB] flex items-center justify-center text-[#4B1F8C] mb-4">
      {icon}
    </div>
    <p className="text-sm font-semibold text-[#2D2A33]">{title}</p>
    <p className="text-xs text-[#7A7580] mt-2 leading-relaxed">{description}</p>
    <p className="text-[10px] text-[#B8C5B2] font-medium mt-3 uppercase tracking-wide">{note}</p>
  </div>
);

export default OfficeMoodBoard;
