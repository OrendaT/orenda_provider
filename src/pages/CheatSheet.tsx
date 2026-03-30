import { Link } from "react-router-dom";
import { Download, FileSpreadsheet, Calendar, Mail, MapPin, FileText, ExternalLink, Copy, Check, Image } from "lucide-react";
import { useState } from "react";
import { downloadPatientScheduleXlsx, type BookedDate } from "@/utils/patientScheduleExport";
import { downloadProviderWelcomeXlsx } from "@/utils/welcomeEmailExport";
import logo from "@/assets/orenda-logo-purple.png";
import edisonMapImg from "@/assets/edison-map-branded.png";
import hobokenMapImg from "@/assets/hoboken-map-branded.png";

// Michael's booked dates
const MICHAEL_DATES: BookedDate[] = [
  { date: "Saturday, March 21, 2026", location: "Hoboken", timeBlock: "10 AM – 2 PM" },
  { date: "Saturday, March 28, 2026", location: "Edison", timeBlock: "10 AM – 2 PM" },
  { date: "Saturday, April 18, 2026", location: "Hoboken", timeBlock: "10 AM – 2 PM" },
  { date: "Saturday, April 25, 2026", location: "Edison", timeBlock: "10 AM – 2 PM" },
  { date: "Saturday, May 16, 2026", location: "Hoboken", timeBlock: "10 AM – 2 PM" },
  { date: "Saturday, May 23, 2026", location: "Edison", timeBlock: "10 AM – 2 PM" },
  { date: "Saturday, June 13, 2026", location: "Hoboken", timeBlock: "10 AM – 2 PM" },
  { date: "Saturday, June 20, 2026", location: "Edison", timeBlock: "10 AM – 2 PM" },
  { date: "Saturday, July 18, 2026", location: "Edison", timeBlock: "10 AM – 2 PM" },
  { date: "Saturday, July 26, 2026", location: "Hoboken", timeBlock: "10 AM – 2 PM" },
];

// Galina's booked dates
const GALINA_DATES: BookedDate[] = [
  { date: "Tuesday, April 8, 2026", location: "Edison", timeBlock: "Full Day (8 AM – 9 PM)" },
  { date: "Tuesday, April 22, 2026", location: "Edison", timeBlock: "Full Day (8 AM – 9 PM)" },
  { date: "Thursday, April 24, 2026", location: "Edison", timeBlock: "8 AM – 4 PM" },
  { date: "Thursday, May 1, 2026", location: "Edison", timeBlock: "8 AM – 4 PM" },
  { date: "Tuesday, May 6, 2026", location: "Edison", timeBlock: "Full Day (8 AM – 9 PM)" },
];

interface ResourceCard {
  title: string;
  description: string;
  icon: React.ElementType;
  action: "link" | "download" | "image";
  link?: string;
  onClick?: () => void;
  imageSrc?: string;
  color: string;
}

const sections: { title: string; items: ResourceCard[] }[] = [
  {
    title: "📋 Patient Schedule Downloads",
    items: [
      {
        title: "Michael Sanya — Patient Schedule",
        description: "Branded Excel template with all 10 booked dates (Hoboken & Edison), empty patient rows for each day",
        icon: Calendar,
        action: "download",
        onClick: () => downloadPatientScheduleXlsx({ providerName: "Michael Sanya", bookedDates: MICHAEL_DATES }),
        color: "hsl(270, 70%, 45%)",
      },
      {
        title: "Galina — Patient Schedule",
        description: "Branded Excel template with all 5 booked dates (Edison), empty patient rows for each day",
        icon: Calendar,
        action: "download",
        onClick: () => downloadPatientScheduleXlsx({ providerName: "Galina", bookedDates: GALINA_DATES }),
        color: "hsl(270, 70%, 45%)",
      },
    ],
  },
  {
    title: "✉️ Welcome Emails",
    items: [
      {
        title: "Michael Sanya — Welcome Email",
        description: "Personalized welcome email with booked dates, maps, Quick Reference, and Copy HTML / Download PNG",
        icon: Mail,
        action: "link",
        link: "/provider-welcome-email/michael-sanya",
        color: "hsl(200, 70%, 45%)",
      },
      {
        title: "Galina — Welcome Email",
        description: "Personalized welcome email with appointment bookings note and all office details",
        icon: Mail,
        action: "link",
        link: "/provider-welcome-email/galina",
        color: "hsl(200, 70%, 45%)",
      },
      {
        title: "Welcome Email Template (Generic)",
        description: "CSV-driven template with bulk upload, Copy HTML, Download PNG, and Excel export",
        icon: Mail,
        action: "link",
        link: "/provider-welcome-email",
        color: "hsl(200, 70%, 45%)",
      },
    ],
  },
  {
    title: "📊 Workbooks & Excel Exports",
    items: [
      {
        title: "Provider Ops Workbook",
        description: "Full multi-tab Excel: Sign-Up Sheets, Workflow Tracker, Patient Schedule, Building Send List",
        icon: FileSpreadsheet,
        action: "link",
        link: "/provider-ops-workbook",
        color: "hsl(160, 60%, 35%)",
      },
      {
        title: "Patient Schedule Template (Standalone)",
        description: "Standalone patient schedule page with branded Excel download",
        icon: FileSpreadsheet,
        action: "link",
        link: "/patient-schedule-template",
        color: "hsl(160, 60%, 35%)",
      },
    ],
  },
  {
    title: "🗺️ Branded Maps & Assets",
    items: [
      {
        title: "Edison Office — Branded Map",
        description: "Purple-branded map for 110 Fieldcrest Ave, Edison, NJ 08837. Located in the Office Locations section of every welcome email.",
        icon: MapPin,
        action: "image",
        imageSrc: edisonMapImg,
        color: "hsl(30, 80%, 50%)",
      },
      {
        title: "Hoboken Office — Branded Map",
        description: "Purple-branded map for 221 River Street, Hoboken, NJ 07030",
        icon: MapPin,
        action: "image",
        imageSrc: hobokenMapImg,
        color: "hsl(30, 80%, 50%)",
      },
    ],
  },
  {
    title: "📄 Key Pages",
    items: [
      {
        title: "Site Directory",
        description: "Full index of all 35+ pages in the portal with descriptions and live activity",
        icon: FileText,
        action: "link",
        link: "/site-directory",
        color: "hsl(0, 0%, 40%)",
      },
      {
        title: "NJ In-Person Care Hub",
        description: "Main homepage with location banners and CTA",
        icon: FileText,
        action: "link",
        link: "/",
        color: "hsl(0, 0%, 40%)",
      },
      {
        title: "Provider Operations Guide",
        description: "Comprehensive provider scheduling and operations guide",
        icon: FileText,
        action: "link",
        link: "/nj-office/provider-ops",
        color: "hsl(0, 0%, 40%)",
      },
      {
        title: "Admin Console V2",
        description: "Redesigned admin console with all management tools",
        icon: FileText,
        action: "link",
        link: "/admin-v2",
        color: "hsl(0, 0%, 40%)",
      },
    ],
  },
];

export default function CheatSheet() {
  const [downloadedItems, setDownloadedItems] = useState<Set<string>>(new Set());

  const handleDownload = (title: string, onClick?: () => void) => {
    onClick?.();
    setDownloadedItems((prev) => new Set(prev).add(title));
    setTimeout(() => {
      setDownloadedItems((prev) => {
        const next = new Set(prev);
        next.delete(title);
        return next;
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[hsl(270,15%,97%)] font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border/20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Orenda" className="h-6" />
            <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Resource Cheat Sheet</p>
          </div>
          <Link to="/site-directory" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            Site Directory <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Resource Cheat Sheet
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Every download, template, branded asset, and key page in one place. No more searching.
          </p>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.title} className="mb-10">
            <h2 className="text-lg font-bold text-foreground mb-4">{section.title}</h2>
            <div className="grid gap-3">
              {section.items.map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl border border-border/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4 p-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {item.action === "link" && item.link && (
                        <Link
                          to={item.link}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-foreground"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open
                        </Link>
                      )}
                      {item.action === "download" && (
                        <button
                          onClick={() => handleDownload(item.title, item.onClick)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          {downloadedItems.has(item.title) ? (
                            <><Check className="w-3.5 h-3.5" /> Downloaded</>
                          ) : (
                            <><Download className="w-3.5 h-3.5" /> Download</>
                          )}
                        </button>
                      )}
                      {item.action === "image" && (
                        <a
                          href={item.imageSrc}
                          download
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-foreground"
                        >
                          <Image className="w-3.5 h-3.5" />
                          Save Image
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Show image preview for map assets */}
                  {item.action === "image" && item.imageSrc && (
                    <div className="px-4 pb-4">
                      <img
                        src={item.imageSrc}
                        alt={item.title}
                        className="w-full rounded-lg border border-border/20"
                        style={{ maxHeight: 200, objectFit: "cover" }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Where to find things */}
        <div className="mt-12 mb-8 bg-white rounded-xl border border-border/30 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">📍 Where to Find Things</h2>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="font-semibold text-primary min-w-[200px]">Edison Map</span>
              <span className="text-muted-foreground">Scroll down on any welcome email → "Office Locations" section → second card below Hoboken</span>
            </div>
            <div className="border-t border-border/20" />
            <div className="flex gap-3">
              <span className="font-semibold text-primary min-w-[200px]">Patient Schedule Button</span>
              <span className="text-muted-foreground">Top toolbar of Michael's or Galina's welcome email page → "Patient Schedule" button (calendar icon)</span>
            </div>
            <div className="border-t border-border/20" />
            <div className="flex gap-3">
              <span className="font-semibold text-primary min-w-[200px]">Excel Workbook Button</span>
              <span className="text-muted-foreground">Top toolbar of any welcome email page → "Excel" button (spreadsheet icon)</span>
            </div>
            <div className="border-t border-border/20" />
            <div className="flex gap-3">
              <span className="font-semibold text-primary min-w-[200px]">Copy HTML for Gmail</span>
              <span className="text-muted-foreground">Top toolbar of any welcome email page → "Copy HTML" button → paste directly into Gmail</span>
            </div>
            <div className="border-t border-border/20" />
            <div className="flex gap-3">
              <span className="font-semibold text-primary min-w-[200px]">Download as PNG</span>
              <span className="text-muted-foreground">Top toolbar of any welcome email page → "Download PNG" button (far right, purple)</span>
            </div>
            <div className="border-t border-border/20" />
            <div className="flex gap-3">
              <span className="font-semibold text-primary min-w-[200px]">Provider Ops Workbook</span>
              <span className="text-muted-foreground">Navigate to /provider-ops-workbook → download buttons at the top</span>
            </div>
            <div className="border-t border-border/20" />
            <div className="flex gap-3">
              <span className="font-semibold text-primary min-w-[200px]">Google Calendar Invite</span>
              <span className="text-muted-foreground">Top of the generic welcome email page (/provider-welcome-email) → "Copy Text" button</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
