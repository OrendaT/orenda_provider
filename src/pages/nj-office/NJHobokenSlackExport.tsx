import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Shield, Coffee, Car, Phone, Train, Users, Camera, Bike, MonitorSmartphone, Accessibility, Navigation, ExternalLink, Mail, DoorOpen, KeyRound, Armchair, Scale, HeartPulse, Wifi, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/orenda-logo-purple.png";
import buildingImg from "@/assets/hoboken-riverfront.png";
import buildingEntranceImg from "@/assets/hoboken-building-entrance.png";
import receptionImg from "@/assets/hoboken/reception.png";
import loungeImg from "@/assets/hoboken/lounge.png";
import lounge2Img from "@/assets/hoboken/lounge2.png";
import kitchenImg from "@/assets/hoboken/kitchen.png";
import coworkingImg from "@/assets/hoboken/coworking.png";
import { toPng } from "html-to-image";

const galleryImages = [
  { src: buildingImg, label: "Building Exterior" },
  { src: receptionImg, label: "Reception" },
  { src: loungeImg, label: "Lounge" },
  { src: lounge2Img, label: "Business Lounge" },
  { src: kitchenImg, label: "Kitchen" },
  { src: coworkingImg, label: "Coworking Space" },
];

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

export default function NJHobokenSlackExport() {
  const captureRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!captureRef.current) return;
    setDownloading(true);
    try {
      // Wait for images to load
      const images = captureRef.current.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) return resolve();
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
        )
      );

      const dataUrl = await toPng(captureRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = "Orenda-Hoboken-Office-Guide.png";
      link.href = dataUrl;
      link.click();
      toast({ title: "Downloaded!", description: "PNG saved — upload to Slack." });
    } catch (err) {
      console.error(err);
      toast({ title: "Download failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-border/40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/site-directory" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </Link>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Generating…" : "Download as PNG"}
          </button>
        </div>
      </div>

      {/* Capturable Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div ref={captureRef} className="bg-white rounded-2xl overflow-hidden shadow-lg">

          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="grid md:grid-cols-2 min-h-[40vh]">
              <div className="flex items-end md:items-center px-8 md:px-14 py-10 md:py-20 order-2 md:order-1"
                style={{ background: 'linear-gradient(135deg, hsl(270, 60%, 92%), hsl(0, 0%, 100%))' }}>
                <div>
                  <img src={logo} alt="Orenda Psychiatry" className="h-10 mb-6" />
                  <p className="text-foreground/50 text-[10px] tracking-[0.5em] uppercase mb-3 font-body">01 — Hoboken, New Jersey</p>
                  <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-[1] mb-3">
                    Riverfront
                    <br />
                    <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Center</em>
                  </h1>
                  <div className="w-14 h-[2px] bg-italic-accent/40 mb-5" />
                  <p className="text-foreground/70 text-sm tracking-wide font-light">
                    221 River Street, 9th Floor, Unit 9076
                    <br />
                    Hoboken, NJ 07030
                  </p>
                </div>
              </div>
              <div className="overflow-hidden order-1 md:order-2">
                <img src={buildingImg} alt="Hoboken Riverfront Center" className="w-full h-full object-cover min-h-[280px]" />
              </div>
            </div>
          </section>

          {/* About */}
          <section className="py-10 md:py-16" style={{ background: 'linear-gradient(180deg, white 0%, hsl(270, 20%, 97%) 100%)' }}>
            <div className="max-w-full mx-auto px-8 md:px-14">
              <div className="mb-6">
                <p className="text-[10px] tracking-[0.4em] uppercase text-italic-accent font-medium mb-4">About This Location</p>
                <h2 className="font-display text-3xl md:text-5xl font-light text-foreground leading-[1.1]">
                  A Modern Space for{" "}
                  <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Exceptional Care</em>
                </h2>
              </div>
              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-8">
                Located on the Hudson River waterfront with stunning views of the Manhattan skyline, our Hoboken office offers a modern, professional setting just 15 minutes from Midtown Manhattan. The space is designed to provide a welcoming, comfortable experience for both patients and providers.
              </p>

              {/* Building Entrance */}
              <div className="mb-10 rounded-xl overflow-hidden border border-border/30">
                <img src={buildingEntranceImg} alt="221 River Street entrance — look for Wonder Cafe" className="w-full h-auto object-cover" />
                <p className="px-4 py-3 bg-white font-body text-xs text-muted-foreground">
                  Look for Wonder Cafe — the building entrance is right next to it
                </p>
              </div>

              {/* Map + Address — static image instead of iframe for capture */}
              <div className="grid lg:grid-cols-[1fr_1fr] gap-0 mb-10 rounded-2xl overflow-hidden border border-border/30 bg-white">
                <div className="min-h-[280px] lg:min-h-[420px] bg-muted flex items-center justify-center">
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=221+River+Street+Hoboken+NJ&zoom=16&size=600x420&markers=color:purple%7C40.7378,-74.0299&key=&style=feature:all`}
                    alt="Hoboken office map"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback: show a styled placeholder
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.parentElement!.innerHTML = `
                        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:2rem;text-align:center;background:hsl(270,20%,97%)">
                          <div style="font-size:48px;margin-bottom:12px;">📍</div>
                          <p style="font-size:16px;font-weight:600;color:#333;margin-bottom:4px;">221 River Street</p>
                          <p style="font-size:13px;color:#666;">Hoboken, NJ 07030</p>
                          <p style="font-size:11px;color:#999;margin-top:8px;">9th Floor · Unit 9076</p>
                        </div>
                      `;
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <div className="p-8 md:p-10 flex-1 flex flex-col justify-center border-b border-border/20">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-display text-2xl text-foreground">Address</h3>
                    </div>
                    <div className="space-y-1">
                      <p className="font-body text-foreground font-medium text-sm">Regus — Riverfront Center</p>
                      <p className="font-body text-muted-foreground text-sm">221 River Street, 9th Floor, Unit 9076</p>
                      <p className="font-body text-muted-foreground text-sm">Hoboken, NJ 07030</p>
                    </div>
                  </div>

                  <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Navigation className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="font-display text-2xl text-foreground">Finding the Building</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        { num: "1", text: <>Look for <span className="text-foreground font-medium">Wonder Cafe</span> — use it as your landmark</> },
                        { num: "2", text: <>The building entrance is on <span className="text-foreground font-medium">River Street</span> with the Riverfront Center signage</> },
                        { num: "3", text: <>Take the elevator to the <span className="text-foreground font-medium">9th floor</span></> },
                      ].map((step) => (
                        <div key={step.num} className="flex items-start gap-3">
                          <span className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-primary">{step.num}</span>
                          </span>
                          <p className="font-body text-muted-foreground text-sm leading-relaxed">{step.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Building Access */}
                    <div className="mt-6 space-y-4">
                      <h4 className="font-display text-lg text-foreground font-medium">Building Access</h4>
                      <ul className="space-y-1.5">
                        <li className="font-body text-muted-foreground text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          The building entrance is accessible <span className="text-foreground font-medium">24/7</span>
                        </li>
                        <li className="font-body text-muted-foreground text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          Floor doors open <span className="text-foreground font-medium">Monday–Friday, 7:00 AM – 6:00 PM</span>
                        </li>
                        <li className="font-body text-muted-foreground text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          Outside of these hours, the floor doors are locked
                        </li>
                      </ul>
                    </div>

                    {/* After Hours */}
                    <div className="mt-4 space-y-2">
                      <h4 className="font-display text-base text-foreground font-medium">Entering Outside Standard Hours</h4>
                      <ul className="space-y-1.5">
                        <li className="font-body text-muted-foreground text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          Ring the <span className="text-foreground font-medium">doorbell on the right-hand side</span> of the building entrance
                        </li>
                        <li className="font-body text-muted-foreground text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          Building security will buzz you in
                        </li>
                      </ul>
                    </div>

                    {/* Regus Reception */}
                    <div className="mt-4 space-y-2">
                      <h4 className="font-display text-base text-foreground font-medium">Regus Office Reception</h4>
                      <ul className="space-y-1.5">
                        <li className="font-body text-muted-foreground text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          Staffed <span className="text-foreground font-medium">9:00 AM – 5:00 PM, Monday–Friday</span>
                        </li>
                        <li className="font-body text-muted-foreground text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          After reception hours, floor entrance requires a swipe card
                        </li>
                      </ul>
                    </div>

                    {/* Provider Access */}
                    <div className="mt-4 space-y-2">
                      <h4 className="font-display text-base text-foreground font-medium">Provider Access After Hours</h4>
                      <p className="font-body text-muted-foreground text-sm">If attending outside reception hours, you must either:</p>
                      <ul className="space-y-1.5">
                        <li className="font-body text-muted-foreground text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          Coordinate with our team to have a swipe card sent to you, or
                        </li>
                        <li className="font-body text-muted-foreground text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          Be set up directly with the building for 24/7 access with your own designated swipe card and key
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Information */}
              <div>
                <div className="bg-foreground rounded-2xl p-6 sm:p-10 md:p-14 text-white">
                  <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-3">Key Information</p>
                  <h3 className="font-display text-3xl md:text-5xl font-light mb-12 leading-tight">
                    At Your{" "}
                    <em className="text-italic-accent" style={{ fontStyle: "italic" }}>Fingertips</em>
                  </h3>

                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10 md:gap-14">
                    {/* Access */}
                    <div>
                      <Shield className="w-5 h-5 text-italic-accent mb-6" />
                      <h4 className="font-display text-2xl text-white mb-6">Access</h4>
                      <div className="space-y-5">
                        <div>
                          <p className="font-display text-lg text-white">Building Access</p>
                          <p className="font-body text-white/50 text-sm mt-1">Open 24/7 — the building is always accessible</p>
                        </div>
                        <div className="w-8 h-px bg-white/15" />
                        <div className="bg-white/[0.06] rounded-lg px-4 py-3">
                          <p className="font-body text-white/70 text-xs leading-relaxed">
                            <span className="text-italic-accent font-medium">After Hours:</span> After 6 PM & on weekends, ring the <span className="text-white font-medium">doorbell on the right-hand side</span> of the entrance to be buzzed in by security.
                          </p>
                        </div>
                        <div className="w-8 h-px bg-white/15" />
                        <div>
                          <p className="font-display text-lg text-white">Regus Front Desk</p>
                          <p className="font-body text-white/50 text-sm mt-1">9th Floor · Mon–Fri, 9 AM – 5 PM</p>
                        </div>
                        <div className="w-8 h-px bg-white/15" />
                        <div className="bg-white/[0.06] rounded-lg px-4 py-3">
                          <p className="font-body text-white/70 text-xs leading-relaxed">
                            <span className="text-italic-accent font-medium">Note:</span> After Regus hours, the 9th floor entrance is locked. Ensure our team registers your access for after-hours entry.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contact */}
                    <div>
                      <Phone className="w-5 h-5 text-italic-accent mb-6" />
                      <h4 className="font-display text-2xl text-white mb-6">Contact</h4>

                      <p className="font-body text-italic-accent text-xs font-semibold uppercase tracking-wider mb-3">Orenda NJ Admin</p>
                      <div className="space-y-5 mb-8">
                        <div>
                          <p className="font-body text-white/50 text-sm mb-1">Phone</p>
                          <p className="font-display text-lg text-white">(347) 707-7735</p>
                        </div>
                        <div className="w-8 h-px bg-white/15" />
                        <div>
                          <p className="font-body text-white/50 text-sm mb-1">Email</p>
                          <p className="font-display text-lg text-white break-all">offices@orendapsych.com</p>
                        </div>
                      </div>

                      <p className="font-body text-italic-accent text-xs font-semibold uppercase tracking-wider mb-3">Regus — Hoboken Riverfront</p>
                      <div className="space-y-5">
                        <div>
                          <p className="font-body text-white/50 text-sm mb-1">Phone</p>
                          <p className="font-display text-lg text-white">(201) 484-7855</p>
                        </div>
                        <div className="w-8 h-px bg-white/15" />
                        <div>
                          <p className="font-body text-white/50 text-sm mb-1">Email</p>
                          <p className="font-display text-lg text-white break-all">Hoboken.RiverSt@regus.com</p>
                        </div>
                      </div>
                    </div>

                    {/* Wi-Fi */}
                    <div>
                      <svg className="w-5 h-5 text-italic-accent mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.75 20.25v-.075c0-.69-.56-1.25-1.25-1.25H8.75c-.69 0-1.25.56-1.25 1.25v.075" />
                      </svg>
                      <h4 className="font-display text-2xl text-white mb-6">Wi-Fi</h4>
                      <div className="space-y-5">
                        <div>
                          <p className="font-body text-white/50 text-sm mb-1">Network</p>
                          <p className="font-display text-lg text-white">Regus Net Wi-Fi</p>
                        </div>
                        <div className="w-8 h-px bg-white/15" />
                        <div>
                          <p className="font-body text-white/50 text-sm mb-1">Password</p>
                          <p className="font-display text-lg text-white tracking-wider">167845630</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Private Office — NO "Schedule Office Time" button */}
          <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(270, 60%, 10%) 0%, hsl(270, 40%, 20%) 100%)' }}>
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
            <div className="max-w-full mx-auto px-8 md:px-14 relative z-10 text-center">
              <h2 className="font-display text-5xl md:text-7xl font-light text-white leading-[0.9] tracking-tight mb-6">
                Our Private <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Office</em>
              </h2>
              <p className="text-white/40 text-sm mb-12 max-w-md mx-auto">Fully equipped. Reserved for you.</p>

              <div className="flex flex-wrap justify-center gap-6 mb-12">
                {([
                  { icon: Armchair, label: "Patient Seating" },
                  { icon: Scale, label: "Weight Scale" },
                  { icon: HeartPulse, label: "BP Cuff" },
                  { icon: Wifi, label: "Wi-Fi" },
                ] as const).map((a, i) => (
                  <div key={i} className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">
                      <a.icon className="w-8 h-8 md:w-10 md:h-10 text-italic-accent" />
                    </div>
                    <span className="text-white/70 text-xs font-medium tracking-wide">{a.label}</span>
                  </div>
                ))}
              </div>

              <div className="inline-flex flex-wrap justify-center gap-3">
                {([
                  { icon: Shield, label: "Escort patients at all times" },
                  { icon: Coffee, label: "Use in-office beverages only" },
                  { icon: KeyRound, label: "Return key to lockbox after visit" },
                  { icon: DoorOpen, label: "Leave office clean & reset" },
                ] as const).map((p, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-5 py-2.5">
                    <p.icon className="w-3.5 h-3.5 text-italic-accent" />
                    <span className="text-white/70 text-xs">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Workspace Environment — STATIC GRID */}
          <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, hsl(270,25%,94%) 0%, hsl(270,35%,88%) 40%, hsl(270,45%,82%) 70%, hsl(270,60%,70%) 100%)' }}>
            <div className="relative max-w-full mx-auto px-8 md:px-14 py-16 md:py-20">
              <div className="mb-10">
                <p className="text-[10px] tracking-[0.4em] uppercase text-foreground/40 font-medium mb-4">The Space</p>
                <h2 className="font-display text-3xl md:text-4xl font-light text-foreground tracking-tight">
                  Workspace <em className="text-primary" style={{ fontStyle: 'italic' }}>Environment</em>
                </h2>
                <p className="text-foreground/50 text-sm leading-relaxed mt-4 max-w-lg">
                  Our office is situated within a premium shared workspace featuring modern amenities, professional common areas, and a welcoming atmosphere suited for healthcare professionals.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {galleryImages.map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-white/20 shadow-lg">
                    <div className="aspect-[16/10] relative">
                      <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                        <p className="text-white text-xs font-medium">{img.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Facilities */}
          <section className="py-10 md:py-14 bg-[hsl(270,15%,96%)]">
            <div className="max-w-full mx-auto px-8 md:px-14">
              <div className="mb-8">
                <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground font-medium mb-3">Amenities</p>
                <h2 className="font-display text-3xl md:text-4xl font-light text-foreground tracking-tight">
                  Building <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Facilities</em>
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {facilities.map((f) => (
                  <div key={f.label} className="bg-white border border-border/30 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[hsl(270,30%,93%)] flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-4 h-4 text-accent/60" />
                    </div>
                    <p className="text-foreground text-xs font-medium leading-tight">{f.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer bar */}
          <div className="bg-foreground px-8 md:px-14 py-6 text-center">
            <p className="text-white/50 text-xs font-body">
              Orenda Psychiatry, PLLC · 221 River Street, 9th Floor, Unit 9076, Hoboken, NJ 07030
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
