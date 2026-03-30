import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, Clock, Shield, Coffee, Car, Train } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/assets/orenda-logo-purple.png";
import hobokenImg from "@/assets/hoboken-riverfront.png";
import edisonImg from "@/assets/edison-building-glass.png";
import sunsetImg from "@/assets/hoboken-sunset.png";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export default function NJBannerVariations() {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* Nav */}
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        className="relative sticky top-0 z-50 border-b border-primary/10 shadow-[0_10px_28px_-22px_hsl(270_55%_35%_/_0.45)]"
        style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), hsl(0, 0%, 100%))' }}>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3">
          <div className="flex items-center justify-between rounded-2xl border border-primary/10 bg-white/70 backdrop-blur-xl px-3 sm:px-4 py-2.5">
            <Link to="/" className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Hub
            </Link>
            <img src={logo} alt="Orenda" className="h-6 md:h-7" />
          </div>
        </div>
      </motion.nav>

      {/* Header */}
      <section className="py-14 md:py-20 px-6 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-medium mb-3">Location Banner Options</p>
            <h1 className="font-display text-3xl md:text-5xl font-light text-foreground mb-4">
              Banner <em className="text-primary" style={{ fontStyle: 'italic' }}>Variations</em>
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Different layout approaches for Hoboken and Edison location banners on the homepage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* VARIATION 1 — Current Split (Image | Text) */}
      {/* ============================================ */}
      <section className="px-6 md:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-6">Variation 1 — Split Grid (Current)</p>
          <div className="rounded-2xl overflow-hidden border border-border/30">
            {/* Hoboken */}
            <div className="grid md:grid-cols-2 min-h-[400px]">
              <div className="overflow-hidden">
                <img src={hobokenImg} alt="Hoboken" className="w-full h-full object-cover min-h-[220px]" />
              </div>
              <div className="flex flex-col justify-center px-8 md:px-14 py-10 md:py-16 bg-[hsl(270,15%,97%)]">
                <p className="text-[10px] tracking-[0.4em] uppercase text-primary/50 font-medium mb-4">01 — Location</p>
                <h2 className="text-3xl md:text-5xl font-display font-light text-foreground tracking-tight mb-3">
                  <em style={{ fontStyle: 'italic' }}>Hoboken</em>
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                  Riverfront Center · Hudson County. A polished, modern workspace designed for patient comfort and clinical excellence.
                </p>
                <span className="group inline-flex items-center gap-3 bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase font-medium px-7 py-3.5 rounded-md w-fit cursor-pointer">
                  Explore Hoboken <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
            {/* Edison */}
            <div className="grid md:grid-cols-2 min-h-[400px] border-t border-border/20">
              <div className="flex flex-col justify-center px-8 md:px-14 py-10 md:py-16 bg-white order-2 md:order-1">
                <p className="text-[10px] tracking-[0.4em] uppercase text-primary/50 font-medium mb-4">02 — Location</p>
                <h2 className="text-3xl md:text-5xl font-display font-light text-foreground tracking-tight mb-3">
                  <em style={{ fontStyle: 'italic' }}>Edison</em>
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                  Raritan Plaza · Middlesex County. A welcoming clinical environment with modern amenities and easy access.
                </p>
                <span className="group inline-flex items-center gap-3 bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase font-medium px-7 py-3.5 rounded-md w-fit cursor-pointer">
                  Explore Edison <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <div className="overflow-hidden order-1 md:order-2">
                <img src={edisonImg} alt="Edison" className="w-full h-full object-cover min-h-[220px]" />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4"><strong>Style:</strong> Classic editorial split. Image left/right alternating. Clean, spacious, professional.</p>
        </div>
      </section>

      {/* ============================================ */}
      {/* VARIATION 2 — Full-Width Image with Overlay */}
      {/* ============================================ */}
      <section className="px-6 md:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-6">Variation 2 — Full-Width Cinematic Overlay</p>
          <div className="space-y-4">
            {/* Hoboken */}
            <div className="relative rounded-2xl overflow-hidden min-h-[380px] md:min-h-[480px]">
              <img src={hobokenImg} alt="Hoboken" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(270,40%,15%)/90] via-[hsl(270,40%,15%)/60] to-transparent" />
              <div className="relative h-full flex items-end p-8 md:p-14">
                <div className="max-w-lg">
                  <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-medium mb-3">01 — Hoboken, NJ</p>
                  <h2 className="font-display text-4xl md:text-6xl font-light text-white leading-[1.05] mb-3">
                    Riverfront <em className="text-[hsl(270,70%,80%)]" style={{ fontStyle: 'italic' }}>Center</em>
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
                    221 River Street, 9th Floor · Hudson County. Modern workspace with Manhattan skyline views.
                  </p>
                  <span className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-xs px-6 py-3 rounded-lg cursor-pointer">
                    Explore Hoboken <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
            {/* Edison */}
            <div className="relative rounded-2xl overflow-hidden min-h-[380px] md:min-h-[480px]">
              <img src={edisonImg} alt="Edison" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-l from-[hsl(270,40%,15%)/90] via-[hsl(270,40%,15%)/60] to-transparent" />
              <div className="relative h-full flex items-end justify-end p-8 md:p-14 text-right">
                <div className="max-w-lg">
                  <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 font-medium mb-3">02 — Edison, NJ</p>
                  <h2 className="font-display text-4xl md:text-6xl font-light text-white leading-[1.05] mb-3">
                    Raritan <em className="text-[hsl(270,70%,80%)]" style={{ fontStyle: 'italic' }}>Plaza</em>
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm ml-auto">
                    110 Fieldcrest Avenue, 3rd Floor · Middlesex County. Convenient highway access & on-site parking.
                  </p>
                  <span className="inline-flex items-center gap-2 bg-white text-primary font-semibold text-xs px-6 py-3 rounded-lg cursor-pointer">
                    Explore Edison <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4"><strong>Style:</strong> Immersive, cinematic. Full-bleed images with dark gradient overlays. High visual impact.</p>
        </div>
      </section>

      {/* ============================================ */}
      {/* VARIATION 3 — Stacked Cards with Tags */}
      {/* ============================================ */}
      <section className="px-6 md:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-6">Variation 3 — Magazine Cards</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Hoboken", subtitle: "Riverfront Center", address: "221 River Street, 9th Floor", county: "Hudson County", img: hobokenImg, features: ["24/7 Access", "Parking Available", "Manhattan Views"] },
              { name: "Edison", subtitle: "Raritan Plaza", address: "110 Fieldcrest Avenue, 3rd Floor", county: "Middlesex County", img: edisonImg, features: ["24/7 Access", "On-Site Parking", "Near Major Highways"] },
            ].map((loc, i) => (
              <div key={loc.name} className="group rounded-2xl overflow-hidden border border-border/30 bg-white hover:shadow-xl transition-all duration-300">
                <div className="relative h-[260px] md:h-[320px] overflow-hidden">
                  <img src={loc.img} alt={loc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">0{i + 1} — {loc.county}</p>
                  </div>
                </div>
                <div className="p-7 md:p-10">
                  <h3 className="font-display text-3xl md:text-4xl font-light text-foreground mb-1">
                    {loc.subtitle}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-5">{loc.address}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {loc.features.map(f => (
                      <span key={f} className="text-[10px] tracking-[0.15em] uppercase text-primary/70 bg-primary/5 border border-primary/10 rounded-full px-3.5 py-1.5 font-medium">{f}</span>
                    ))}
                  </div>
                  <span className="group/btn inline-flex items-center gap-3 bg-primary text-primary-foreground text-[11px] tracking-[0.2em] uppercase font-medium px-7 py-3.5 rounded-md cursor-pointer">
                    Explore {loc.name} <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4"><strong>Style:</strong> Magazine editorial cards. Hover effects, pill-style feature tags, and clean typography. Side-by-side comparison.</p>
        </div>
      </section>

      {/* ============================================ */}
      {/* VARIATION 4 — Minimal Text-Forward */}
      {/* ============================================ */}
      <section className="px-6 md:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-6">Variation 4 — Minimal Text-Forward</p>
          <div className="rounded-2xl overflow-hidden border border-border/30" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), white)' }}>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/20">
              {[
                { name: "Hoboken", sub: "Riverfront Center", addr: "221 River Street, 9th Floor", county: "Hudson County", img: hobokenImg },
                { name: "Edison", sub: "Raritan Plaza", addr: "110 Fieldcrest Avenue, 3rd Floor", county: "Middlesex County", img: edisonImg },
              ].map((loc, i) => (
                <div key={loc.name} className="group p-8 md:p-14 flex flex-col justify-between min-h-[420px]">
                  <div>
                    <p className="text-[10px] tracking-[0.5em] uppercase text-primary/40 font-medium mb-8">0{i + 1}</p>
                    <h2 className="font-display text-5xl md:text-7xl font-light text-foreground leading-[1] mb-2">
                      {loc.name}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-1">{loc.sub}</p>
                    <p className="text-muted-foreground/60 text-xs">{loc.addr}</p>
                  </div>
                  <div className="mt-10">
                    <div className="w-full h-[160px] md:h-[200px] rounded-xl overflow-hidden mb-6">
                      <img src={loc.img} alt={loc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <span className="group/btn inline-flex items-center gap-3 text-primary text-[11px] tracking-[0.2em] uppercase font-semibold cursor-pointer">
                      Explore {loc.name} <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4"><strong>Style:</strong> Ultra-minimal, typography-driven. Big numbers, oversized display font, small image thumbnails. Clean and airy.</p>
        </div>
      </section>

      {/* ============================================ */}
      {/* VARIATION 5 — Stacked Full-Width Bands */}
      {/* ============================================ */}
      <section className="px-6 md:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-6">Variation 5 — Horizontal Bands</p>
          <div className="space-y-3">
            {[
              { name: "Hoboken", sub: "Riverfront Center · Hudson County", addr: "221 River Street, 9th Floor", img: hobokenImg },
              { name: "Edison", sub: "Raritan Plaza · Middlesex County", addr: "110 Fieldcrest Avenue, 3rd Floor", img: edisonImg },
            ].map((loc) => (
              <div key={loc.name} className="group rounded-2xl overflow-hidden border border-border/30 bg-white hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row items-stretch">
                  <div className="w-full md:w-[240px] h-[200px] md:h-auto flex-shrink-0 overflow-hidden">
                    <img src={loc.img} alt={loc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex items-center justify-between px-7 md:px-12 py-8 md:py-0 gap-6">
                    <div>
                      <h3 className="font-display text-3xl md:text-4xl font-light text-foreground mb-1">{loc.name}</h3>
                      <p className="text-muted-foreground text-sm">{loc.sub}</p>
                      <p className="text-muted-foreground/50 text-xs mt-0.5">{loc.addr}</p>
                    </div>
                    <span className="flex-shrink-0 inline-flex items-center gap-2 bg-primary text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-semibold px-6 py-3 rounded-lg cursor-pointer">
                      Explore <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4"><strong>Style:</strong> Compact horizontal bands. Efficient use of space, image thumbnail on left, quick-scan text. Great for mobile.</p>
        </div>
      </section>

      {/* ============================================ */}
      {/* VARIATION 6 — Overlapping Cards */}
      {/* ============================================ */}
      <section className="px-6 md:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-6">Variation 6 — Overlapping Cards with Glass</p>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { name: "Hoboken", sub: "Riverfront Center", addr: "221 River St, 9th Fl", county: "Hudson County", img: hobokenImg },
              { name: "Edison", sub: "Raritan Plaza", addr: "110 Fieldcrest Ave, 3rd Fl", county: "Middlesex County", img: edisonImg },
            ].map((loc, i) => (
              <div key={loc.name} className="relative group">
                <div className="rounded-2xl overflow-hidden h-[350px] md:h-[420px]">
                  <img src={loc.img} alt={loc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="absolute -bottom-8 left-4 right-4 md:left-6 md:right-6 bg-white/90 backdrop-blur-lg border border-border/30 rounded-2xl p-6 md:p-8 shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-semibold mb-2">{loc.county}</p>
                      <h3 className="font-display text-2xl md:text-3xl font-light text-foreground mb-1">{loc.sub}</h3>
                      <p className="text-muted-foreground text-xs flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {loc.addr}
                      </p>
                    </div>
                    <span className="flex-shrink-0 w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-12" /> {/* spacing for overlap */}
          <p className="text-xs text-muted-foreground mt-4"><strong>Style:</strong> Elevated, layered. Glass-morphism card overlapping the image for depth. Modern, premium feel.</p>
        </div>
      </section>

      {/* ============================================ */}
      {/* VARIATION 7 — Dark Mode Luxe */}
      {/* ============================================ */}
      <section className="px-6 md:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold mb-6">Variation 7 — Dark Luxe</p>
          <div className="rounded-2xl overflow-hidden bg-foreground">
            <div className="grid md:grid-cols-2">
              {[
                { name: "Hoboken", sub: "Riverfront Center", addr: "221 River Street, 9th Floor", county: "Hudson County", img: hobokenImg },
                { name: "Edison", sub: "Raritan Plaza", addr: "110 Fieldcrest Avenue, 3rd Floor", county: "Middlesex County", img: edisonImg },
              ].map((loc, i) => (
                <div key={loc.name} className={`group p-8 md:p-14 ${i === 0 ? "md:border-r border-white/[0.06]" : ""} border-b md:border-b-0 border-white/[0.06]`}>
                  <div className="rounded-xl overflow-hidden h-[200px] md:h-[260px] mb-8">
                    <img src={loc.img} alt={loc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <p className="text-[10px] tracking-[0.5em] uppercase text-[hsl(270,70%,75%)] font-medium mb-4">{loc.county}</p>
                  <h3 className="font-display text-3xl md:text-5xl font-light text-white leading-[1.05] mb-2">
                    {loc.name}
                  </h3>
                  <p className="text-white/40 text-sm mb-1">{loc.sub}</p>
                  <p className="text-white/25 text-xs mb-8">{loc.addr}</p>
                  <span className="group/btn inline-flex items-center gap-3 bg-white/10 border border-white/10 text-white text-[11px] tracking-[0.2em] uppercase font-medium px-7 py-3.5 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
                    Explore {loc.name} <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4"><strong>Style:</strong> Dark, sophisticated. Inverted theme with purple accents. Dramatic, high-end healthcare aesthetic.</p>
        </div>
      </section>

    </div>
  );
}
