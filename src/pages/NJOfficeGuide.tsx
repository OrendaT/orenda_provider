import { Link } from "react-router-dom";
import { MapPin, Shield, Clipboard, Users, ChevronRight, Building2, Clock, Car, Coffee } from "lucide-react";
import heroImg from "@/assets/nj-skyline.png";
import logo from "@/assets/orenda-logo-purple.png";

const sections = [
  {
    title: "Schedule II Regulations",
    desc: "Understand New Jersey's in-person prescribing requirements for Schedule II medications.",
    icon: Shield,
    link: "/nj-office/regulations",
    cta: "View Regulations",
    color: "from-primary/10 to-primary/5",
  },
  {
    title: "Provider Operations",
    desc: "Everything providers need to prepare for and complete a successful office day.",
    icon: Clipboard,
    link: "/nj-office/provider-ops",
    cta: "Open Provider Guide",
    color: "from-accent/10 to-accent/5",
  },
  {
    title: "Patient Check-In",
    desc: "Arrival instructions, check-in forms, and communication templates.",
    icon: Users,
    link: "/nj-office/check-in",
    cta: "View Check-In Details",
    color: "from-primary/10 to-secondary/30",
  },
];

const offices = [
  {
    name: "Hoboken",
    subtitle: "Riverfront Center",
    address: "221 River Street, 9th Floor, Unit 9076\nHoboken, NJ 07030",
    map: "https://www.google.com/maps/search/?api=1&query=221+River+Street+Hoboken+NJ+07030",
    link: "/nj-office/hoboken",
    features: ["24/7 Access", "Lobby Security", "Lounge & Kitchen", "Parking Nearby"],
  },
  {
    name: "Edison",
    subtitle: "Raritan Plaza",
    address: "110 Fieldcrest Avenue, 3rd Floor\nEdison, NJ 08837",
    map: "https://www.google.com/maps/search/?api=1&query=110+Fieldcrest+Avenue+Edison+NJ+08837",
    link: "/nj-office/edison",
    features: ["24/7 Access", "Lobby Security", "Lounge & Kitchen", "Parking Nearby"],
  },
];

const featureIcons: Record<string, React.ElementType> = {
  "24/7 Access": Clock,
  "Lobby Security": Shield,
  "Lounge & Kitchen": Coffee,
  "Parking Nearby": Car,
};

export default function NJOfficeGuide() {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <img src={logo} alt="Orenda Psychiatry" className="h-8" />
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/nj-office/regulations" className="hover:text-foreground transition-colors">Regulations</Link>
            <Link to="/nj-office/hoboken" className="hover:text-foreground transition-colors">Hoboken</Link>
            <Link to="/nj-office/edison" className="hover:text-foreground transition-colors">Edison</Link>
            <Link to="/nj-office/provider-ops" className="hover:text-foreground transition-colors">Provider Guide</Link>
            <Link to="/nj-office/check-in" className="hover:text-foreground transition-colors">Check-In</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="New Jersey skyline" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="text-primary-foreground/70 font-medium text-sm tracking-widest uppercase mb-4">Orenda Psychiatry</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              New Jersey In-Person Care Hub
            </h1>
            <p className="text-primary-foreground/85 text-lg md:text-xl leading-relaxed max-w-xl">
              Your one-stop resource for locations, regulations, and guidance for New Jersey in-person appointments.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Nav Sections */}
      <section className="max-w-6xl mx-auto px-6 -mt-12 relative z-10 mb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {sections.map((s) => (
            <Link
              key={s.title}
              to={s.link}
              className="group bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5`}>
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{s.desc}</p>
              <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                {s.cta} <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Regulations Preview */}
      <section className="bg-secondary/30 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-3">New Jersey Schedule II Regulations</h2>
              <p className="text-muted-foreground max-w-2xl">Understanding the requirements for in-person prescribing in New Jersey.</p>
            </div>
            <Link
              to="/nj-office/regulations"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              View Full Details <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="font-display text-lg font-semibold mb-4 text-foreground">In-Person Visit Requirement</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                New Jersey state regulations require an initial in-person visit for certain Schedule II prescribing workflows.
                Patients who are being prescribed Schedule II medications and reside in New Jersey must complete an in-person
                evaluation at one of our NJ office locations.
              </p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Follow-Up & Ongoing Care</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                These requirements apply on a 90-day basis. After completing the required in-person visit, patients may
                continue with follow-up telehealth appointments with their original provider, if clinically appropriate.
                This ensures continuity of care while meeting state compliance standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">Our New Jersey Offices</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Two modern, welcoming locations designed for patient comfort and clinical excellence.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {offices.map((o) => (
              <div key={o.name} className="bg-card rounded-2xl border border-border overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="bg-gradient-to-br from-primary to-accent p-8 text-primary-foreground">
                  <Building2 className="w-8 h-8 mb-4 opacity-80" />
                  <h3 className="font-display text-2xl font-bold mb-1">{o.name}</h3>
                  <p className="text-primary-foreground/70 text-sm">{o.subtitle}</p>
                </div>
                <div className="p-8">
                  <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">{o.address}</p>
                  <a
                    href={o.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline mb-6"
                  >
                    <MapPin className="w-4 h-4" /> View on Google Maps
                  </a>
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {o.features.map((f) => {
                      const Icon = featureIcons[f] || Clock;
                      return (
                        <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon className="w-4 h-4 text-primary/60" />
                          {f}
                        </div>
                      );
                    })}
                  </div>
                  <Link
                    to={o.link}
                    className="w-full inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-5 py-3 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors"
                  >
                    Explore {o.name} <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <img src={logo} alt="Orenda" className="h-6 opacity-60" />
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Orenda Psychiatry · Internal Resource</p>
        </div>
      </footer>
    </div>
  );
}
