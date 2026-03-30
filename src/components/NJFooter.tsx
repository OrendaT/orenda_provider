import { Link, useLocation } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import logo from "@/assets/orenda-logo-purple.png";

export default function NJFooter() {
  const location = useLocation();
  const isPublic = location.pathname.startsWith("/public");
  const prefix = isPublic ? "/public" : "/nj-office";

  return (
    <footer className="relative overflow-hidden bg-foreground">
      {/* Gradient accent strip */}
      <div className="h-1" style={{ background: 'linear-gradient(90deg, hsl(270, 80%, 50%), hsl(270, 60%, 72%), hsl(270, 40%, 90%), hsl(270, 60%, 72%), hsl(270, 80%, 50%))' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-16">
        {/* Large typographic header */}
        <div className="mb-8 md:mb-14">
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-light text-white/90 leading-[1]">
            Get in <em className="text-italic-accent" style={{ fontStyle: 'italic' }}>Touch</em>
          </h2>
        </div>

        {/* 4-column contact strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-14">
          <div>
            <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase mb-3">Hoboken Office</p>
            <Link to={`${prefix}/hoboken`} className="text-white text-sm font-body hover:text-italic-accent transition-colors block mb-1">
              221 River St, 9th Floor
            </Link>
            <p className="text-white/40 text-xs">Unit 9076 · Hoboken, NJ 07030</p>
          </div>
          <div>
            <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase mb-3">Edison Office</p>
            <Link to={`${prefix}/edison`} className="text-white text-sm font-body hover:text-italic-accent transition-colors block mb-1">
              110 Fieldcrest Ave, 3rd Floor
            </Link>
            <p className="text-white/40 text-xs">Unit 328 · Edison, NJ 08837</p>
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
          <div>
            <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase mb-3">Quick Links</p>
            <div className="flex flex-col gap-1.5">
              <Link to={`${prefix}/book`} className="text-white/60 text-xs hover:text-italic-accent transition-colors">Schedule Office Time →</Link>
              <Link to={`${prefix}/contact`} className="text-white/60 text-xs hover:text-italic-accent transition-colors">Contact Us →</Link>
              <Link to={`${prefix}/faq`} className="text-white/60 text-xs hover:text-italic-accent transition-colors">FAQ →</Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-white/[0.06]">
          <img src={logo} alt="Orenda Psychiatry" className="h-6 brightness-0 invert opacity-50" />
          <p className="text-white/20 text-[10px] tracking-[0.15em] uppercase">
            © {new Date().getFullYear()} Orenda Psychiatry · NJ In-Person Care Hub
          </p>
        </div>
      </div>
    </footer>
  );
}
