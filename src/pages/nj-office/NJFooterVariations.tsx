import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight, Heart, ExternalLink, Clock, Building2 } from "lucide-react";
import logo from "@/assets/orenda-logo-purple.png";
import NJNavbar from "@/components/NJNavbar";

const prefix = "/nj-office";

/* ═══════════════════════════════════════════
   VARIATION A — "Midnight Monolith"
   Deep purple-black with frosted glass cards
   ═══════════════════════════════════════════ */
function FooterA() {
  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(270, 50%, 8%) 0%, hsl(270, 40%, 12%) 100%)' }}>
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-8 md:pb-12">
        {/* Top: Brand + tagline */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
          <div>
            <img src={logo} alt="Orenda Psychiatry" className="h-8 md:h-10 mb-4 brightness-0 invert opacity-80" />
            <p className="text-white/30 text-sm max-w-sm leading-relaxed font-body">
              New Jersey In-Person Care Hub — scheduling, access & provider resources.
            </p>
          </div>
          <Link
            to={`${prefix}/book`}
            className="inline-flex items-center gap-3 bg-white/[0.06] border border-white/10 text-white text-[10px] tracking-[0.2em] uppercase font-semibold px-6 py-3.5 rounded-full hover:bg-white/[0.12] transition-all duration-300 w-fit"
          >
            Schedule Office <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Location cards — frosted glass */}
        <div className="grid sm:grid-cols-3 gap-4 mb-14 md:mb-20">
          {[
            { title: "Hoboken", address: "221 River St, 9th Fl, Unit 9076", city: "Hoboken, NJ 07030", phone: "(201) 484-7855", email: "Hoboken.RiverSt@regus.com", to: `${prefix}/hoboken` },
            { title: "Edison", address: "110 Fieldcrest Ave, 3rd Fl, Unit 328", city: "Edison, NJ 08837", phone: "(732) 782-0328", email: "Edison.fieldcrestave@regus.com", to: `${prefix}/edison` },
            { title: "NJ Admin Team", address: "Orenda Psychiatry", city: "offices@orendapsych.com", phone: "(201) 685-4863", email: "offices@orendapsych.com", to: `${prefix}/contact`, isAdmin: true },
          ].map((loc) => (
            <Link key={loc.title} to={loc.to}
              className="group block bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 md:p-8 hover:bg-white/[0.08] hover:border-white/15 transition-all duration-300">
              <p className="text-italic-accent text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">{loc.title}</p>
              <p className="text-white/80 text-sm font-body mb-1">{loc.address}</p>
              <p className="text-white/40 text-xs font-body mb-4">{loc.city}</p>
              <div className="space-y-1.5">
                <p className="text-white/50 text-xs flex items-center gap-2">
                  <Phone className="w-3 h-3 text-italic-accent/50" /> {loc.phone}
                </p>
                {!loc.isAdmin && (
                  <p className="text-white/50 text-[11px] flex items-center gap-2">
                    <Mail className="w-3 h-3 text-italic-accent/50" />
                    <span className="truncate">{loc.email}</span>
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/20 text-[10px] tracking-[0.15em] uppercase">
            © {new Date().getFullYear()} Orenda Psychiatry · Internal Resource
          </p>
          <p className="text-white/15 text-[10px]">NJ In-Person Care Hub</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   VARIATION B — "Editorial Strip"
   Horizontal band with bold typography
   ═══════════════════════════════════════════ */
function FooterB() {
  return (
    <footer className="relative overflow-hidden bg-foreground">
      {/* Gradient accent strip */}
      <div className="h-1" style={{ background: 'linear-gradient(90deg, hsl(270, 80%, 50%), hsl(270, 60%, 72%), hsl(270, 40%, 90%), hsl(270, 60%, 72%), hsl(270, 80%, 50%))' }} />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
        {/* Large typographic header */}
        <div className="mb-10 md:mb-14">
          <h2 className="font-display text-4xl md:text-6xl font-light text-white/90 leading-[1]">
            Get in <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Touch</em>
          </h2>
        </div>

        {/* Inline contact strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-10 md:mb-14">
          <div>
            <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase mb-3">Hoboken Office</p>
            <Link to={`${prefix}/hoboken`} className="text-white text-sm font-body hover:text-italic-accent transition-colors block mb-1">
              221 River St, 9th Floor
            </Link>
            <p className="text-white/40 text-xs">Hoboken, NJ 07030</p>
            <a href="tel:+12014847855" className="text-white/50 text-xs hover:text-white transition-colors block mt-2">(201) 484-7855</a>
          </div>
          <div>
            <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase mb-3">Edison Office</p>
            <Link to={`${prefix}/edison`} className="text-white text-sm font-body hover:text-italic-accent transition-colors block mb-1">
              110 Fieldcrest Ave, 3rd Floor
            </Link>
            <p className="text-white/40 text-xs">Edison, NJ 08837</p>
            <a href="tel:+17327820328" className="text-white/50 text-xs hover:text-white transition-colors block mt-2">(732) 782-0328</a>
          </div>
          <div>
            <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase mb-3">NJ Admin</p>
            <a href="tel:+12016854863" className="text-white text-sm font-body hover:text-italic-accent transition-colors block mb-1">
              (201) 685-4863
            </a>
            <a href="mailto:offices@orendapsych.com" className="text-white/50 text-xs hover:text-white transition-colors block">
              offices@orendapsych.com
            </a>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase mb-3">Quick Links</p>
              <div className="flex flex-col gap-1.5">
                <Link to={`${prefix}/book`} className="text-white/60 text-xs hover:text-italic-accent transition-colors">Schedule Office Time →</Link>
                <Link to={`${prefix}/contact`} className="text-white/60 text-xs hover:text-italic-accent transition-colors">Contact Us →</Link>
                <Link to={`${prefix}/faq`} className="text-white/60 text-xs hover:text-italic-accent transition-colors">FAQ →</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/[0.06]">
          <img src={logo} alt="Orenda Psychiatry" className="h-6 brightness-0 invert opacity-50" />
          <p className="text-white/20 text-[10px] tracking-[0.15em] uppercase">
            © {new Date().getFullYear()} Orenda Psychiatry · NJ In-Person Care Hub
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   VARIATION C — "Lavender Fields"
   Light, airy, warm lavender with centered layout
   ═══════════════════════════════════════════ */
function FooterC() {
  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(270, 50%, 96%) 0%, hsl(270, 40%, 92%) 100%)' }}>
      {/* Dot texture */}
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(270, 60%, 72% / 0.08) 1px, transparent 0)', backgroundSize: '20px 20px' }} />

      <div className="relative max-w-5xl mx-auto px-6 md:px-8 pt-14 md:pt-20 pb-8 md:pb-10 text-center">
        {/* Centered brand */}
        <img src={logo} alt="Orenda Psychiatry" className="h-9 md:h-11 mx-auto mb-3" />
        <p className="text-foreground/40 text-sm font-body mb-10 md:mb-14 max-w-md mx-auto">
          Your complete resource for NJ in-person care scheduling and office operations.
        </p>

        {/* Locations side by side */}
        <div className="grid sm:grid-cols-3 gap-8 mb-10 md:mb-14 text-left sm:text-center">
          {[
            { title: "Hoboken", line1: "221 River St, 9th Fl", line2: "Unit 9076 · Hoboken, NJ 07030", phone: "(201) 484-7855" },
            { title: "Edison", line1: "110 Fieldcrest Ave, 3rd Fl", line2: "Unit 328 · Edison, NJ 08837", phone: "(732) 782-0328" },
            { title: "NJ Admin Team", line1: "offices@orendapsych.com", line2: "(201) 685-4863", phone: null },
          ].map((loc) => (
            <div key={loc.title}>
              <p className="font-display text-lg text-foreground mb-2">{loc.title}</p>
              <p className="text-foreground/50 text-xs font-body leading-relaxed">{loc.line1}</p>
              <p className="text-foreground/40 text-xs font-body">{loc.line2}</p>
              {loc.phone && <p className="text-foreground/40 text-xs font-body mt-1">{loc.phone}</p>}
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          to={`${prefix}/book`}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-semibold px-7 py-3.5 rounded-full hover:bg-primary/90 transition-all shadow-lg mb-10 md:mb-14"
        >
          Schedule Office Time <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {/* Bottom */}
        <div className="border-t border-foreground/[0.06] pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-foreground/25 text-[10px] tracking-[0.15em] uppercase">
            © {new Date().getFullYear()} Orenda Psychiatry · Internal Resource
          </p>
          <p className="text-foreground/20 text-[10px]">NJ In-Person Care Hub</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   VARIATION D — "Split Horizon"
   Two-tone split with map links
   ═══════════════════════════════════════════ */
function FooterD() {
  return (
    <footer className="relative overflow-hidden">
      <div className="grid md:grid-cols-2">
        {/* Left — dark */}
        <div className="bg-foreground p-8 md:p-14 lg:p-16">
          <img src={logo} alt="Orenda Psychiatry" className="h-8 mb-6 brightness-0 invert opacity-70" />
          <h3 className="font-display text-3xl md:text-4xl text-white font-light mb-4 leading-tight">
            New Jersey
            <br />
            <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Care Hub</em>
          </h3>
          <p className="text-white/35 text-sm font-body leading-relaxed max-w-sm mb-8">
            Two locations. One mission. Quality psychiatric care in a professional, welcoming setting.
          </p>
          <Link
            to={`${prefix}/book`}
            className="inline-flex items-center gap-2 bg-italic-accent text-foreground text-[10px] tracking-[0.2em] uppercase font-bold px-6 py-3.5 rounded-lg hover:bg-italic-accent/90 transition-all"
          >
            Schedule Office <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Right — light */}
        <div className="p-8 md:p-14 lg:p-16" style={{ background: 'linear-gradient(135deg, hsl(270, 40%, 95%), hsl(270, 30%, 92%))' }}>
          <div className="space-y-8">
            {[
              { icon: Building2, title: "Hoboken Office", address: "221 River St, 9th Fl, Unit 9076", city: "Hoboken, NJ 07030", phone: "(201) 484-7855", to: `${prefix}/hoboken` },
              { icon: Building2, title: "Edison Office", address: "110 Fieldcrest Ave, 3rd Fl, Unit 328", city: "Edison, NJ 08837", phone: "(732) 782-0328", to: `${prefix}/edison` },
              { icon: Phone, title: "NJ Admin Team", address: "offices@orendapsych.com", city: "(201) 685-4863", phone: null, to: `${prefix}/contact` },
            ].map((loc) => (
              <Link key={loc.title} to={loc.to} className="group flex items-start gap-4 hover:translate-x-1 transition-transform duration-200">
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/15 transition-colors">
                  <loc.icon className="w-4 h-4 text-primary/50 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="font-display text-base text-foreground mb-0.5">{loc.title}</p>
                  <p className="text-foreground/50 text-xs font-body">{loc.address}</p>
                  <p className="text-foreground/40 text-xs font-body">{loc.city}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-foreground border-t border-white/[0.05] px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-white/20 text-[10px] tracking-[0.15em] uppercase">
          © {new Date().getFullYear()} Orenda Psychiatry
        </p>
        <p className="text-white/15 text-[10px]">Internal Resource · NJ In-Person Care Hub</p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   VARIATION E — "Minimal Bar"
   Ultra-compact single-line footer
   ═══════════════════════════════════════════ */
function FooterE() {
  return (
    <footer className="border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Orenda Psychiatry" className="h-6" />
            <span className="w-px h-4 bg-border" />
            <span className="text-muted-foreground text-xs font-body">NJ In-Person Care Hub</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link to={`${prefix}/hoboken`} className="text-muted-foreground text-xs hover:text-primary transition-colors font-body">Hoboken</Link>
            <Link to={`${prefix}/edison`} className="text-muted-foreground text-xs hover:text-primary transition-colors font-body">Edison</Link>
            <a href="tel:+12016854863" className="text-muted-foreground text-xs hover:text-primary transition-colors font-body">(201) 685-4863</a>
            <a href="mailto:offices@orendapsych.com" className="text-muted-foreground text-xs hover:text-primary transition-colors font-body">offices@orendapsych.com</a>
            <Link to={`${prefix}/book`} className="text-primary text-xs font-semibold hover:text-primary/80 transition-colors font-body flex items-center gap-1">
              Book <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <p className="text-foreground/25 text-[10px]">© {new Date().getFullYear()} Orenda Psychiatry</p>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   VARIATION F — "Stacked Monumental"
   Large stacked blocks with dramatic scale
   ═══════════════════════════════════════════ */
function FooterF() {
  return (
    <footer className="relative overflow-hidden">
      {/* Top CTA band */}
      <div className="bg-primary py-10 md:py-14 px-6 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl md:text-4xl text-white font-light">
              Ready to schedule your <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>office day?</em>
            </h3>
          </div>
          <Link
            to={`${prefix}/book`}
            className="inline-flex items-center gap-3 bg-white text-primary text-[10px] tracking-[0.2em] uppercase font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-all shadow-lg"
          >
            Schedule Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-foreground px-6 md:px-8 pt-12 md:pt-16 pb-8 md:pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <img src={logo} alt="Orenda Psychiatry" className="h-8 mb-4 brightness-0 invert opacity-70" />
              <p className="text-white/30 text-xs font-body leading-relaxed">
                Professional psychiatric care across New Jersey. Two locations designed for your comfort.
              </p>
            </div>

            {/* Hoboken */}
            <div>
              <p className="text-italic-accent text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">Hoboken</p>
              <p className="text-white/60 text-sm font-body mb-1">221 River St, 9th Floor</p>
              <p className="text-white/35 text-xs font-body mb-3">Unit 9076 · Hoboken, NJ 07030</p>
              <a href="tel:+12014847855" className="text-white/40 text-xs hover:text-white transition-colors block">(201) 484-7855</a>
            </div>

            {/* Edison */}
            <div>
              <p className="text-italic-accent text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">Edison</p>
              <p className="text-white/60 text-sm font-body mb-1">110 Fieldcrest Ave, 3rd Floor</p>
              <p className="text-white/35 text-xs font-body mb-3">Unit 328 · Edison, NJ 08837</p>
              <a href="tel:+17327820328" className="text-white/40 text-xs hover:text-white transition-colors block">(732) 782-0328</a>
            </div>

            {/* Admin */}
            <div>
              <p className="text-italic-accent text-[10px] tracking-[0.3em] uppercase font-semibold mb-4">NJ Admin</p>
              <a href="tel:+12016854863" className="text-white/60 text-sm font-body hover:text-white transition-colors block mb-1">(201) 685-4863</a>
              <a href="mailto:offices@orendapsych.com" className="text-white/40 text-xs font-body hover:text-white transition-colors block">offices@orendapsych.com</a>
              <div className="flex gap-3 mt-4">
                <Link to={`${prefix}/contact`} className="text-white/30 text-[10px] uppercase tracking-wider hover:text-italic-accent transition-colors">Contact →</Link>
                <Link to={`${prefix}/faq`} className="text-white/30 text-[10px] uppercase tracking-wider hover:text-italic-accent transition-colors">FAQ →</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-white/15 text-[10px] tracking-[0.15em] uppercase">
              © {new Date().getFullYear()} Orenda Psychiatry · Internal Resource
            </p>
            <div className="flex items-center gap-1 text-white/15 text-[10px]">
              <span>Built with</span>
              <Heart className="w-2.5 h-2.5 text-italic-accent/40" />
              <span>for NJ providers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   SHOWCASE PAGE
   ═══════════════════════════════════════════════════ */
export default function NJFooterVariations() {
  return (
    <div className="min-h-screen bg-white font-body">
      <NJNavbar />

      {/* Header */}
      <section className="py-16 md:py-24 px-6 md:px-8" style={{ background: 'linear-gradient(135deg, hsl(270, 60%, 92%), hsl(0, 0%, 100%))' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.5em] uppercase text-primary/40 font-medium mb-4">Design Exploration</p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-foreground leading-[1]">
            Footer <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Variations</em>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mt-4 max-w-lg">
            Six distinct footer designs — from dark monolithic to minimal bar — ready for review.
          </p>
        </div>
      </section>

      {/* Variations */}
      {[
        { label: "A", title: "Midnight Monolith", desc: "Deep purple-black with frosted glass location cards", Component: FooterA },
        { label: "B", title: "Editorial Strip", desc: "Dark background with bold typography and 4-column layout", Component: FooterB },
        { label: "C", title: "Lavender Fields", desc: "Light, centered, airy layout with soft textures", Component: FooterC },
        { label: "D", title: "Split Horizon", desc: "Two-tone split — dark brand / light contacts", Component: FooterD },
        { label: "E", title: "Minimal Bar", desc: "Ultra-compact single-line footer for minimal pages", Component: FooterE },
        { label: "F", title: "Stacked Monumental", desc: "CTA banner + full dark footer with 4-column grid", Component: FooterF },
      ].map(({ label, title, desc, Component }) => (
        <div key={label} className="mb-20">
          {/* Label */}
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-5xl md:text-7xl font-light text-primary/15">{label}</span>
              <div>
                <h2 className="font-display text-2xl md:text-3xl text-foreground">{title}</h2>
                <p className="text-muted-foreground text-sm mt-1">{desc}</p>
              </div>
            </div>
          </div>
          {/* Render */}
          <Component />
        </div>
      ))}
    </div>
  );
}
