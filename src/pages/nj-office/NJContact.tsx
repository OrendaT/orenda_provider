import NJNavbar from "@/components/NJNavbar";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/orenda-logo-purple.png";

interface NJContactProps {
  isAdmin?: boolean;
}

const NJContact = ({ isAdmin }: NJContactProps) => {
  const location = useLocation();
  const isPublic = location.pathname.startsWith("/public");
  const prefix = isPublic ? "/public" : "/nj-office";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NJNavbar isAdmin={isAdmin} />

      {/* Hero */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 bg-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 font-medium mb-4">NJ Office Admin</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-tight">
            Contact <em className="text-primary" style={{ fontStyle: 'italic' }}>Us</em>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed mt-4 max-w-lg mx-auto">
            Reach out for scheduling support, office access, or any questions about our New Jersey locations.
          </p>
        </div>
      </section>

      {/* Main Contact */}
      <section className="py-16 sm:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Primary Contact Card */}
          <div className="bg-foreground rounded-3xl p-8 sm:p-12 border border-white/10 mb-8">
            <p className="text-italic-accent text-[10px] tracking-[0.4em] uppercase font-semibold mb-8">NJ Office Admin Team</p>
            <div className="grid sm:grid-cols-2 gap-10">
              {/* Phone */}
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-italic-accent" />
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider font-medium mb-2">Phone</p>
                  <a href="tel:+12016854863" className="font-display text-2xl sm:text-3xl text-white hover:text-italic-accent transition-colors block">
                    (201) 685-4863
                  </a>
                  <p className="text-white/50 text-sm mt-2">Call or text for scheduling and office inquiries</p>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-italic-accent" />
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider font-medium mb-2">Email</p>
                  <a href="mailto:offices@orendapsych.com" className="font-display text-2xl sm:text-3xl text-white hover:text-italic-accent transition-colors block break-all">
                    offices@orendapsych.com
                  </a>
                  <p className="text-white/50 text-sm mt-2">For office access, scheduling, and general support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Hoboken */}
            <Link to={`${prefix}/hoboken`} className="group bg-foreground rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-italic-accent/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-italic-accent" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-italic-accent transition-colors" />
              </div>
              <h3 className="font-display text-xl text-white mb-3">Hoboken</h3>
              <div className="space-y-1">
                <p className="text-white/60 text-sm">221 River Street, 9th Floor</p>
                <p className="text-white/60 text-sm">Unit 9076</p>
                <p className="text-white/60 text-sm">Hoboken, NJ 07030</p>
              </div>
              <div className="mt-5 pt-5 border-t border-white/10">
                <p className="text-white/40 text-xs uppercase tracking-wider font-medium mb-2">Regus Contact</p>
                <p className="text-white/50 text-sm">(201) 484-7855</p>
                <p className="text-white/50 text-sm break-all">Hoboken.RiverSt@regus.com</p>
              </div>
            </Link>

            {/* Edison */}
            <Link to={`${prefix}/edison`} className="group bg-foreground rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-italic-accent/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-italic-accent" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-italic-accent transition-colors" />
              </div>
              <h3 className="font-display text-xl text-white mb-3">Edison</h3>
              <div className="space-y-1">
                <p className="text-white/60 text-sm">110 Fieldcrest Avenue, 3rd Floor</p>
                <p className="text-white/60 text-sm">Unit 328</p>
                <p className="text-white/60 text-sm">Edison, NJ 08837</p>
              </div>
              <div className="mt-5 pt-5 border-t border-white/10">
                <p className="text-white/40 text-xs uppercase tracking-wider font-medium mb-2">Regus Contact</p>
                <p className="text-white/50 text-sm">(732) 782-0328</p>
                <p className="text-white/50 text-sm break-all">edison.fieldcrestave@regus.com</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer — custom for contact page */}
      <footer className="mt-auto relative overflow-hidden">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="relative" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), hsl(270, 30%, 94%))' }}>
          <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.06) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="relative max-w-4xl mx-auto px-6 py-12 sm:py-16">
            <div className="flex flex-col items-center text-center">
              <img src={logo} alt="Orenda Psychiatry" className="h-8 sm:h-10 mb-6" />
              <p className="text-foreground/40 text-sm leading-relaxed max-w-md mb-8">
                New Jersey In-Person Care Hub — your complete resource for office scheduling, building access, and provider operations.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-8">
                <a href="tel:+12016854863" className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4 text-primary/50" />
                  (201) 685-4863
                </a>
                <a href="mailto:offices@orendapsych.com" className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors">
                  <Mail className="w-4 h-4 text-primary/50" />
                  offices@orendapsych.com
                </a>
              </div>

              <div className="w-16 h-px bg-foreground/10 mb-6" />
              <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/30">
                © {new Date().getFullYear()} Orenda Psychiatry, PLLC · Internal Resource
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NJContact;
