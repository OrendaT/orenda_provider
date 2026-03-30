import { Link } from "react-router-dom";
import { Menu, MapPin, Calendar, ChevronDown, ArrowRight, Phone, Globe, Home, Layers } from "lucide-react";
import logo from "@/assets/orenda-logo-purple.png";

export default function NJNavbarVariations() {
  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 space-y-20 font-body">
      <div className="max-w-5xl mx-auto text-center mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">Navbar Variations</h1>
        <p className="text-muted-foreground text-lg">Collapsed state — how the top bar looks before opening the menu</p>
      </div>

      {/* ─── Variation A: Current (enhanced) ─── */}
      <Section label="A" title="Current — Pill with Menu Button">
        <nav style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), hsl(0, 0%, 100%))' }} className="border-b border-primary/10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3">
            <div className="flex items-center justify-between rounded-2xl border border-primary/10 bg-white/90 px-4 py-2.5">
              <button className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 border-primary/20 bg-primary/5 text-foreground hover:bg-primary/10 transition-all">
                <Menu className="w-5 h-5 text-primary" strokeWidth={2.5} />
                <span className="text-xs font-semibold tracking-[0.1em] uppercase text-primary">Menu</span>
              </button>
              <img src={logo} alt="Orenda" className="h-7" />
            </div>
          </div>
        </nav>
      </Section>

      {/* ─── Variation B: Full-width with visible nav links ─── */}
      <Section label="B" title="Exposed Links — Desktop shows top links, mobile collapses">
        <nav className="bg-white border-b border-primary/10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <img src={logo} alt="Orenda" className="h-7" />
                <div className="hidden md:flex items-center gap-1">
                  {["Home", "Hoboken", "Edison", "Schedule", "FAQ"].map((item) => (
                    <button key={item} className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Calendar className="w-4 h-4" />
                  Book Office Time
                </button>
                <button className="md:hidden w-10 h-10 rounded-xl border-2 border-primary/20 bg-primary/5 flex items-center justify-center">
                  <Menu className="w-5 h-5 text-primary" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </Section>

      {/* ─── Variation C: Centered logo with side nav ─── */}
      <Section label="C" title="Centered Logo — Balanced symmetry with CTA right">
        <nav style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), hsl(0, 0%, 100%))' }} className="border-b border-primary/10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
            <div className="flex items-center justify-between">
              <button className="w-12 h-12 rounded-2xl border-2 border-primary/20 bg-white flex items-center justify-center shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all">
                <Menu className="w-6 h-6 text-primary" strokeWidth={2.5} />
              </button>
              <div className="flex flex-col items-center">
                <img src={logo} alt="Orenda" className="h-8" />
                <span className="text-[9px] tracking-[0.25em] uppercase text-primary/60 font-semibold mt-1">NJ In-Person Care Hub</span>
              </div>
              <button className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold tracking-wide uppercase hover:bg-primary/90 transition-colors shadow-md">
                Book Now
              </button>
            </div>
          </div>
        </nav>
      </Section>

      {/* ─── Variation D: Glassmorphism with location pills ─── */}
      <Section label="D" title="Glass Bar with Location Chips — Quick access to offices">
        <nav className="bg-white/70 backdrop-blur-xl border-b border-primary/10 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <Menu className="w-5 h-5" strokeWidth={2.5} />
                </button>
                <img src={logo} alt="Orenda" className="h-7" />
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <LocationPill icon={<MapPin className="w-3.5 h-3.5" />} label="Hoboken" />
                <LocationPill icon={<MapPin className="w-3.5 h-3.5" />} label="Edison" />
                <div className="w-px h-6 bg-primary/10 mx-1" />
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule
                </button>
              </div>
              <button className="sm:hidden w-11 h-11 rounded-xl border-2 border-primary/20 bg-primary/5 flex items-center justify-center">
                <Menu className="w-5 h-5 text-primary" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </nav>
      </Section>

      {/* ─── Variation E: Two-row navbar ─── */}
      <Section label="E" title="Two-Row — Branding top, nav links bottom">
        <nav className="border-b border-primary/10 shadow-sm overflow-hidden">
          {/* Top row */}
          <div className="bg-primary px-4 sm:px-6 md:px-8 py-2.5">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <img src={logo} alt="Orenda" className="h-6 brightness-[10]" />
              <div className="flex items-center gap-4 text-primary-foreground/80 text-xs">
                <span className="hidden sm:flex items-center gap-1.5"><Phone className="w-3 h-3" /> (201) 555-0100</span>
                <span className="hidden sm:flex items-center gap-1.5"><Globe className="w-3 h-3" /> orendapsych.com</span>
              </div>
            </div>
          </div>
          {/* Bottom row */}
          <div className="bg-white px-4 sm:px-6 md:px-8 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="hidden md:flex items-center gap-1">
                {[
                  { icon: <Home className="w-3.5 h-3.5" />, label: "Home" },
                  { icon: <MapPin className="w-3.5 h-3.5" />, label: "Hoboken" },
                  { icon: <MapPin className="w-3.5 h-3.5" />, label: "Edison" },
                  { icon: <Layers className="w-3.5 h-3.5" />, label: "Provider Guide" },
                  { icon: <Calendar className="w-3.5 h-3.5" />, label: "Schedule" },
                ].map((item) => (
                  <button key={item.label} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-foreground/60 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
              <button className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
                <Menu className="w-4 h-4" strokeWidth={2.5} />
                Navigate
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">
                Book Office Day <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </nav>
      </Section>

      {/* ─── Variation F: Minimal with prominent hamburger ─── */}
      <Section label="F" title="Bold Hamburger — Oversized, impossible to miss">
        <nav className="bg-white border-b-2 border-primary/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
            <div className="flex items-center justify-between">
              <button className="group flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-xl group-hover:shadow-primary/30 transition-all">
                  <Menu className="w-7 h-7" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold tracking-[0.12em] uppercase text-primary">Menu</span>
                  <span className="text-[10px] text-muted-foreground">Tap to navigate</span>
                </div>
              </button>
              <img src={logo} alt="Orenda" className="h-7 md:h-8" />
              <button className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg">
                <Calendar className="w-4 h-4" />
                Schedule
              </button>
            </div>
          </div>
        </nav>
      </Section>

      {/* ─── Variation G: Floating pill bar ─── */}
      <Section label="G" title="Floating Pill — Detached from edges, modern feel">
        <div className="py-3 px-4 sm:px-6 md:px-8" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), hsl(270, 30%, 98%))' }}>
          <div className="max-w-5xl mx-auto bg-white rounded-full shadow-xl border border-primary/10 px-4 py-2 flex items-center justify-between">
            <button className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-primary/10 hover:bg-primary/15 transition-colors">
              <Menu className="w-5 h-5 text-primary" strokeWidth={2.5} />
              <span className="text-xs font-bold text-primary uppercase tracking-wide">Menu</span>
            </button>
            <img src={logo} alt="Orenda" className="h-6" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Hoboken</span>
              <span className="text-muted-foreground/30">•</span>
              <span className="text-xs text-muted-foreground">Edison</span>
              <button className="ml-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">
                Book
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Variation H: Side-accent bar ─── */}
      <Section label="H" title="Left Accent — Purple side strip draws the eye to menu">
        <nav className="bg-white border-b border-primary/10 shadow-sm flex">
          <div className="w-16 bg-primary flex items-center justify-center shrink-0">
            <button className="w-full h-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
              <div className="flex flex-col items-center gap-1">
                <Menu className="w-6 h-6" strokeWidth={2.5} />
                <span className="text-[8px] font-bold uppercase tracking-wider">Menu</span>
              </div>
            </button>
          </div>
          <div className="flex-1 px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between">
            <img src={logo} alt="Orenda" className="h-7" />
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-xs text-muted-foreground tracking-[0.1em] uppercase">NJ In-Person Care</span>
              <button className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">
                Schedule
              </button>
            </div>
          </div>
        </nav>
      </Section>

      <div className="h-20" />
    </div>
  );
}

function Section({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-4 px-2">
        <span className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold font-display">{label}</span>
        <h2 className="font-display text-xl md:text-2xl text-foreground">{title}</h2>
      </div>
      <div className="rounded-2xl border border-primary/10 overflow-hidden shadow-sm bg-white">
        {children}
      </div>
    </div>
  );
}

function LocationPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-primary/15 bg-primary/5 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors">
      {icon}
      {label}
    </button>
  );
}
