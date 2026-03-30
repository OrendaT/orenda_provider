import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, MapPin, Building2, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/orenda-logo-purple.png";
import skylineImg from "@/assets/hoboken-skyline.png";

/* ─── OPTION 1: Warm Sunset Cinematic ─── */
function Banner1() {
  return (
    <div className="relative h-[85vh] overflow-hidden">
      <img src={skylineImg} alt="NYC Skyline" className="w-full h-full object-cover scale-105" />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(220,60%,8%/0.95)] via-[hsl(250,50%,15%/0.75)] to-[hsl(200,60%,40%/0.2)]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[hsl(220,60%,8%)] to-transparent" />
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-7xl mx-auto px-10 pb-20 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <img src={logo} alt="Orenda" className="h-6 brightness-0 invert opacity-60" />
              <div className="w-px h-4 bg-white/20" />
              <span className="text-[hsl(200,70%,75%)] text-[10px] tracking-[0.4em] uppercase">New Jersey</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-light text-white leading-[0.95] mb-6">
              In-Person
              <br />
              <em className="text-[hsl(200,70%,78%)]" style={{ fontStyle: 'italic' }}>Care Hub</em>
            </h1>
            <p className="text-white/45 text-sm max-w-md leading-relaxed mb-8">
              Your one-stop resource for locations, regulations, and guidance for New Jersey in-person appointments.
            </p>
            <div className="flex gap-4">
              <button className="bg-[hsl(200,60%,72%)] text-[hsl(220,60%,8%)] text-[11px] tracking-[0.15em] uppercase font-semibold px-7 py-3.5 rounded-md hover:bg-[hsl(200,60%,82%)] transition-colors">
                Explore Offices
              </button>
              <button className="border border-white/20 text-white text-[11px] tracking-[0.15em] uppercase font-medium px-7 py-3.5 rounded-md hover:bg-white/10 transition-colors">
                Provider Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── OPTION 2: Navy & Gold Split ─── */
function Banner2() {
  return (
    <div className="relative h-[80vh] overflow-hidden bg-[hsl(220,50%,12%)]">
      <div className="absolute right-0 top-0 w-[60%] h-full" style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)' }}>
        <img src={skylineImg} alt="NYC Skyline" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[hsl(220,50%,12%/0.15)]" />
      </div>
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-10 w-full">
          <div className="max-w-lg">
            <img src={logo} alt="Orenda" className="h-7 brightness-0 invert opacity-50 mb-10" />
            <p className="text-[hsl(40,70%,65%)] text-[10px] tracking-[0.5em] uppercase mb-4">New Jersey Offices</p>
            <h1 className="text-5xl md:text-7xl font-display font-light text-white leading-[1.05] mb-6">
              In-Person
              <br />
              <span className="font-semibold text-[hsl(40,70%,70%)]">Care Hub</span>
            </h1>
            <div className="w-12 h-[2px] bg-[hsl(40,70%,65%)]" />
            <p className="text-white/50 text-sm max-w-sm leading-relaxed mb-8 mt-6">
              Everything you need for New Jersey in-person appointments — locations, regulations, and provider guidance.
            </p>
            <button className="bg-[hsl(40,70%,65%)] text-[hsl(220,50%,12%)] text-[11px] tracking-[0.15em] uppercase font-semibold px-8 py-4 rounded-md hover:bg-[hsl(40,70%,75%)] transition-colors inline-flex items-center gap-2">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── OPTION 3: Teal & Ivory Frosted Glass ─── */
function Banner3() {
  return (
    <div className="relative h-[80vh] overflow-hidden">
      <img src={skylineImg} alt="NYC Skyline" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(180,40%,15%/0.7)] to-[hsl(260,40%,20%/0.5)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-[hsl(45,30%,97%/0.12)] backdrop-blur-2xl border border-white/15 rounded-3xl p-12 md:p-16 max-w-2xl mx-6 text-center">
          <img src={logo} alt="Orenda" className="h-8 brightness-0 invert mx-auto mb-8 opacity-70" />
          <h1 className="text-4xl md:text-6xl font-display font-light text-white leading-[1.1] mb-4">
            New Jersey
            <br />
            <em className="text-[hsl(170,50%,72%)]" style={{ fontStyle: 'italic' }}>In-Person Care Hub</em>
          </h1>
          <p className="text-white/50 text-sm max-w-md mx-auto leading-relaxed mb-8">
            Your one-stop shop for locations, guidance, and everything needed for NJ appointments.
          </p>
          <div className="flex gap-3 justify-center">
            <button className="bg-[hsl(170,45%,65%)] text-[hsl(180,40%,10%)] text-[11px] tracking-[0.15em] uppercase font-semibold px-7 py-3.5 rounded-full hover:bg-[hsl(170,45%,75%)] transition-colors">
              Explore
            </button>
            <button className="border border-white/25 text-white text-[11px] tracking-[0.15em] uppercase font-medium px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors">
              Provider Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── OPTION 4: Clean White with Blue Accents ─── */
function Banner4() {
  return (
    <div className="relative h-[80vh] overflow-hidden bg-white">
      <div className="absolute top-0 right-0 w-[40%] h-full bg-[hsl(200,50%,96%)]" />
      <div className="absolute bottom-0 left-0 w-[60%] h-[40%] bg-[hsl(200,40%,94%)]" style={{ clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0% 100%)' }} />
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-[hsl(200,60%,88%/0.4)] blur-3xl" />
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-10 w-full">
          <img src={logo} alt="Orenda" className="h-7 mb-12 opacity-70" />
          <p className="text-[hsl(200,50%,50%)] text-[10px] tracking-[0.5em] uppercase mb-6">New Jersey · In-Person Appointments</p>
          <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-display font-light text-[hsl(220,40%,15%)] leading-[0.9] mb-8 tracking-tight">
            Care
            <br />
            <em className="text-[hsl(200,60%,50%)]" style={{ fontStyle: 'italic' }}>Hub</em>
          </h1>
          <div className="flex items-center gap-6">
            <button className="bg-[hsl(200,60%,50%)] text-white text-[11px] tracking-[0.15em] uppercase font-semibold px-8 py-4 rounded-md hover:bg-[hsl(200,60%,40%)] transition-colors inline-flex items-center gap-2">
              View Offices <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[hsl(220,10%,55%)] text-sm">Two locations · Hoboken & Edison</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── OPTION 5: Sage & Cream Magazine Grid ─── */
function Banner5() {
  return (
    <div className="relative min-h-[80vh] bg-[hsl(45,25%,96%)]">
      <div className="max-w-7xl mx-auto px-10 py-16 grid md:grid-cols-12 gap-6 h-full">
        <div className="md:col-span-5 flex flex-col justify-center py-10">
          <img src={logo} alt="Orenda" className="h-7 mb-10 opacity-60 w-fit" />
          <p className="text-[hsl(150,30%,40%)] text-[10px] tracking-[0.5em] uppercase mb-5">New Jersey</p>
          <h1 className="text-5xl md:text-6xl font-display font-light text-[hsl(220,30%,15%)] leading-[1.05] mb-5">
            In-Person
            <br />
            <em className="text-[hsl(150,35%,40%)]" style={{ fontStyle: 'italic' }}>Care Hub</em>
          </h1>
          <p className="text-[hsl(30,10%,45%)] text-sm leading-relaxed max-w-sm mb-8">
            Your one-stop resource center for New Jersey in-person appointments, office locations, and provider operations.
          </p>
          <button className="bg-[hsl(150,35%,38%)] text-white text-[11px] tracking-[0.15em] uppercase font-semibold px-8 py-4 rounded-md hover:bg-[hsl(150,35%,30%)] transition-colors inline-flex items-center gap-2 w-fit">
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="md:col-span-7 grid grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden row-span-2">
            <img src={skylineImg} alt="Skyline" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl overflow-hidden bg-[hsl(150,35%,38%)] flex items-center justify-center p-8">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-white/30 mx-auto mb-3" />
              <p className="text-white font-display text-2xl mb-1">2</p>
              <p className="text-white/50 text-[10px] tracking-[0.3em] uppercase">Locations</p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden bg-[hsl(45,30%,90%)] flex items-center justify-center p-8">
            <div className="text-center">
              <Heart className="w-8 h-8 text-[hsl(150,35%,38%/0.4)] mx-auto mb-3" />
              <p className="text-[hsl(220,30%,15%)] font-display text-2xl mb-1">24/7</p>
              <p className="text-[hsl(30,10%,45%)] text-[10px] tracking-[0.3em] uppercase">Access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── OPTION 6: Deep Indigo & Baby Blue ─── */
function Banner6() {
  return (
    <div className="relative h-[80vh] overflow-hidden bg-[hsl(250,50%,10%)]">
      <div className="absolute inset-0 opacity-20">
        <img src={skylineImg} alt="Skyline" className="w-full h-full object-cover blur-sm" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(250,50%,10%/0.6)] to-[hsl(250,50%,10%)]" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[hsl(200,60%,60%/0.08)] blur-3xl" />
      <div className="relative h-full flex flex-col justify-end pb-20">
        <div className="max-w-7xl mx-auto px-10 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-end">
            <div>
              <p className="text-[hsl(200,60%,72%)] text-[10px] tracking-[0.5em] uppercase mb-6">Orenda Psychiatry · New Jersey</p>
              <h1 className="text-5xl md:text-7xl font-display font-light text-white leading-[1] mb-6">
                Your In-Person
                <br />
                <em className="text-[hsl(200,60%,75%)]" style={{ fontStyle: 'italic' }}>Care Hub</em>
              </h1>
              <div className="w-16 h-[1px] bg-[hsl(200,60%,72%/0.3)]" />
              <p className="text-white/35 text-sm max-w-sm leading-relaxed mt-6">
                Locations, regulations, and everything you need.
              </p>
            </div>
            <div className="flex gap-4 md:justify-end">
              <div className="bg-[hsl(200,60%,72%/0.1)] backdrop-blur-sm border border-[hsl(200,60%,72%/0.2)] rounded-2xl p-6 w-40 text-center">
                <p className="text-[hsl(200,60%,75%)] font-display text-3xl mb-1">2</p>
                <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase">Offices</p>
              </div>
              <div className="bg-[hsl(200,60%,72%/0.1)] backdrop-blur-sm border border-[hsl(200,60%,72%/0.2)] rounded-2xl p-6 w-40 text-center">
                <p className="text-[hsl(200,60%,75%)] font-display text-3xl mb-1">24/7</p>
                <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase">Access</p>
              </div>
              <div className="bg-[hsl(200,60%,72%/0.1)] backdrop-blur-sm border border-[hsl(200,60%,72%/0.2)] rounded-2xl p-6 w-40 text-center">
                <Shield className="w-6 h-6 text-[hsl(200,60%,75%)] mx-auto mb-2" />
                <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase">Premium</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── OPTION 7: Warm Terracotta & Charcoal ─── */
function Banner7() {
  return (
    <div className="relative h-[85vh] overflow-hidden bg-[hsl(30,8%,97%)]">
      <div className="absolute top-10 right-10 bottom-10 w-[55%] rounded-3xl overflow-hidden shadow-2xl">
        <img src={skylineImg} alt="Skyline" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[hsl(15,50%,35%/0.08)]" />
      </div>
      <div className="relative h-full flex items-center z-10">
        <div className="max-w-7xl mx-auto px-10 w-full">
          <div className="max-w-xl bg-white/90 backdrop-blur-md rounded-3xl p-12 shadow-xl border border-[hsl(30,15%,88%)]">
            <img src={logo} alt="Orenda" className="h-7 mb-8 opacity-60" />
            <p className="text-[hsl(15,40%,50%)] text-[10px] tracking-[0.5em] uppercase mb-5">New Jersey In-Person</p>
            <h1 className="text-5xl md:text-6xl font-display font-light text-[hsl(220,20%,15%)] leading-[1.05] mb-5">
              Care{" "}
              <em className="text-[hsl(15,50%,45%)]" style={{ fontStyle: 'italic' }}>Hub</em>
            </h1>
            <p className="text-[hsl(30,10%,45%)] text-sm leading-relaxed mb-8 max-w-sm">
              Your one-stop shop for the information, locations, and guidance needed for NJ in-person appointments.
            </p>
            <div className="flex gap-3">
              <button className="bg-[hsl(15,50%,45%)] text-white text-[11px] tracking-[0.15em] uppercase font-semibold px-7 py-3.5 rounded-md hover:bg-[hsl(15,50%,38%)] transition-colors inline-flex items-center gap-2">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button className="border border-[hsl(30,15%,85%)] text-[hsl(220,20%,15%)] text-[11px] tracking-[0.15em] uppercase font-medium px-7 py-3.5 rounded-md hover:bg-[hsl(30,10%,95%)] transition-colors">
                Provider Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */

const banners = [
  { id: 1, label: "Midnight & Sky Blue", desc: "Cinematic dark overlay with cool blue accents", component: Banner1 },
  { id: 2, label: "Navy & Gold", desc: "Split diagonal with warm gold typography", component: Banner2 },
  { id: 3, label: "Teal Frosted Glass", desc: "Glassmorphism with teal-green highlights", component: Banner3 },
  { id: 4, label: "Clean Blue Minimal", desc: "White canvas with ocean-blue accents", component: Banner4 },
  { id: 5, label: "Sage & Cream", desc: "Earthy sage green with warm ivory tones", component: Banner5 },
  { id: 6, label: "Indigo & Baby Blue", desc: "Deep indigo with soft baby-blue accents", component: Banner6 },
  { id: 7, label: "Terracotta & Charcoal", desc: "Warm terracotta with modern gray tones", component: Banner7 },
];

export default function BannerShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="min-h-screen bg-white font-body">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[hsl(270,15%,92%)]">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/nj-office" className="text-[11px] tracking-[0.15em] uppercase text-[hsl(270,10%,50%)] hover:text-primary transition-colors flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Hub
            </Link>
            <div className="w-px h-5 bg-[hsl(270,15%,90%)]" />
            <h1 className="font-display text-xl text-foreground">
              Banner <em className="text-primary" style={{ fontStyle: 'italic' }}>Options</em>
            </h1>
          </div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[hsl(270,10%,55%)]">
            {activeIdx + 1} / {banners.length}
          </p>
        </div>
      </div>

      {/* Banner selector */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {banners.map((b, i) => (
            <button
              key={b.id}
              onClick={() => setActiveIdx(i)}
              className={`flex-shrink-0 text-left px-5 py-3 rounded-xl border transition-all duration-300 ${
                activeIdx === i
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-foreground border-[hsl(270,15%,90%)] hover:border-primary/30"
              }`}
            >
              <p className={`text-[10px] tracking-[0.2em] uppercase mb-0.5 ${activeIdx === i ? 'text-white/60' : 'text-primary/40'}`}>
                Option {b.id}
              </p>
              <p className={`text-sm font-medium ${activeIdx === i ? 'text-white' : 'text-foreground'}`}>{b.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Active banner preview */}
      <div className="border-t border-[hsl(270,15%,92%)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {(() => {
              const Banner = banners[activeIdx].component;
              return <Banner />;
            })()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Description */}
      <div className="max-w-7xl mx-auto px-8 py-10 border-t border-[hsl(270,15%,92%)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary/40 mb-1">Option {banners[activeIdx].id}</p>
            <h2 className="font-display text-2xl text-foreground mb-1">{banners[activeIdx].label}</h2>
            <p className="text-muted-foreground text-sm">{banners[activeIdx].desc}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
              disabled={activeIdx === 0}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveIdx(Math.min(banners.length - 1, activeIdx + 1))}
              disabled={activeIdx === banners.length - 1}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-30"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
