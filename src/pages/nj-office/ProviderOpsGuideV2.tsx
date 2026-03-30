import { Helmet } from "react-helmet-async";
import {
  CalendarDays,
  Key,
  Building2,
  MessageSquare,
  ClipboardCheck,
  AlertTriangle,
  MapPin,
  Clock,
  Mail,
  Phone,
  DoorOpen,
  ShieldCheck,
  Users,
  FileText,
} from "lucide-react";

const FONT_DISPLAY = "'Cormorant Garamond', serif";
const FONT_BODY = "'Montserrat', sans-serif";

/* ─── tiny reusable pieces ──────────────────────────────────── */

const StepBadge = ({ number }: { number: number }) => (
  <span
    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0"
    style={{
      background: "hsl(270, 100%, 25%)",
      color: "#fff",
      fontFamily: FONT_BODY,
    }}
  >
    {number}
  </span>
);

const SectionCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8 ${className}`}
  >
    {children}
  </div>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground">
    <span
      className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
      style={{ background: "hsl(270, 80%, 40%)" }}
    />
    <span>{children}</span>
  </li>
);

const Callout = ({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "warning";
}) => {
  const isWarning = variant === "warning";
  return (
    <div
      className={`rounded-xl px-5 py-4 text-sm leading-relaxed ${
        isWarning
          ? "bg-amber-50 border border-amber-200 text-amber-900"
          : "border text-foreground"
      }`}
      style={
        !isWarning
          ? {
              background: "hsl(270, 40%, 97%)",
              borderColor: "hsl(270, 30%, 90%)",
            }
          : undefined
      }
    >
      {children}
    </div>
  );
};

const SubHeading = ({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-2.5 mb-3">
    <Icon className="w-5 h-5 shrink-0" style={{ color: "hsl(270, 80%, 40%)" }} />
    <h4
      className="text-base font-semibold text-foreground"
      style={{ fontFamily: FONT_BODY }}
    >
      {children}
    </h4>
  </div>
);

/* ─── page ──────────────────────────────────────────────────── */

const ProviderOpsGuideV2 = () => {
  return (
    <>
      <Helmet>
        <title>Provider Operations Guide | Orenda Psychiatry NJ</title>
        <meta
          name="description"
          content="Step-by-step guide for Orenda Psychiatry providers: scheduling, office access, and patient visits at NJ locations."
        />
      </Helmet>

      {/* ── subtle background pattern ─────────────────────────── */}
      <div className="min-h-screen relative" style={{ background: "#fff" }}>
        {/* dot pattern overlay */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(hsl(270 80% 40%) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 py-12 md:py-20">
          {/* ── Hero ────────────────────────────────────────────── */}
          <header className="text-center mb-14">
            <p
              className="text-xs font-semibold tracking-[0.25em] uppercase mb-3"
              style={{ color: "hsl(270, 80%, 40%)", fontFamily: FONT_BODY }}
            >
              Orenda Psychiatry
            </p>
            <h1
              className="text-4xl md:text-5xl font-light tracking-tight mb-2"
              style={{
                fontFamily: FONT_DISPLAY,
                color: "hsl(270, 100%, 25%)",
              }}
            >
              Provider Operations Guide
            </h1>
            <p
              className="text-lg md:text-xl font-light"
              style={{
                fontFamily: FONT_DISPLAY,
                color: "hsl(270, 60%, 45%)",
              }}
            >
              New Jersey In-Person Care Hub
            </p>
            <div
              className="w-16 h-px mx-auto mt-6"
              style={{ background: "hsl(270, 80%, 40%)" }}
            />
            <p
              className="mt-5 text-sm text-muted-foreground max-w-md mx-auto"
              style={{ fontFamily: FONT_BODY }}
            >
              Your step-by-step guide to scheduling, office access, and patient
              visits.
            </p>
          </header>

          {/* ── STEP 1 ──────────────────────────────────────────── */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <StepBadge number={1} />
              <h2
                className="text-2xl font-light"
                style={{
                  fontFamily: FONT_DISPLAY,
                  color: "hsl(270, 100%, 25%)",
                }}
              >
                Schedule Your Office Day
              </h2>
            </div>

            <SectionCard>
              <div className="space-y-6">
                <div>
                  <SubHeading icon={CalendarDays}>
                    Reserve Your Office Time
                  </SubHeading>
                  <ul className="space-y-2 pl-1">
                    <Bullet>
                      Schedule your office day at least <strong>1 month in advance</strong> when possible
                    </Bullet>
                  </ul>
                </div>

                <div>
                  <SubHeading icon={FileText}>Block Your Calendar</SubHeading>
                  <ul className="space-y-2 pl-1">
                    <Bullet>
                      Block in-person sessions in SimplePractice to match your reserved time
                    </Bullet>
                  </ul>
                </div>

                <div>
                  <SubHeading icon={Users}>
                    Coordinate with NJ Admin
                  </SubHeading>
                  <ul className="space-y-2 pl-1">
                    <Bullet>
                      Finalize your schedule with the NJ admin team after booking
                    </Bullet>
                  </ul>
                </div>
              </div>
            </SectionCard>
          </section>

          {/* ── STEP 2 ──────────────────────────────────────────── */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <StepBadge number={2} />
              <h2
                className="text-2xl font-light"
                style={{
                  fontFamily: FONT_DISPLAY,
                  color: "hsl(270, 100%, 25%)",
                }}
              >
                Arrival & Office Access
              </h2>
            </div>

            {/* Key access overview */}
            <SectionCard className="mb-4">
              <SubHeading icon={Key}>Key Access Overview</SubHeading>

              <div className="space-y-4 mt-4">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Permanent Swipe Card
                  </p>
                  <ul className="space-y-2 pl-1">
                    <Bullet>
                      If you have a permanent swipe card → you may access the building and office at any time
                    </Bullet>
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    No Swipe Card?
                  </p>
                  <ul className="space-y-2 pl-1">
                    <Bullet>
                      During Regus hours (9 AM – 5 PM): no swipe card needed
                    </Bullet>
                    <Bullet>
                      You may retrieve a swipe card + key from the lockbox
                    </Bullet>
                  </ul>
                </div>

                <Callout>
                  <div className="flex items-start gap-2">
                    <Key className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "hsl(270, 80%, 40%)" }} />
                    <div>
                      <p className="font-semibold mb-0.5">Lockbox Details</p>
                      <p>
                        Located outside the Orenda office door&ensp;·&ensp;Code:{" "}
                        <strong>7123</strong>
                      </p>
                      <p className="mt-1 font-medium" style={{ color: "hsl(270, 80%, 40%)" }}>
                        You MUST return the key + swipe card after your visit.
                      </p>
                    </div>
                  </div>
                </Callout>
              </div>
            </SectionCard>

            {/* Hoboken */}
            <SectionCard className="mb-4">
              <div className="flex items-center gap-2.5 mb-4">
                <MapPin className="w-5 h-5" style={{ color: "hsl(270, 80%, 40%)" }} />
                <h3
                  className="text-lg font-semibold"
                  style={{ fontFamily: FONT_BODY, color: "hsl(270, 100%, 25%)" }}
                >
                  Hoboken Access
                </h3>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1.5 flex items-center gap-2">
                    <Building2 className="w-4 h-4" style={{ color: "hsl(270, 60%, 55%)" }} />
                    Building Access (Ground Floor)
                  </p>
                  <ul className="space-y-2 pl-1">
                    <Bullet>
                      Open Monday–Friday, 7:00 AM – 6:00 PM
                    </Bullet>
                    <Bullet>
                      Outside these hours: ring the doorbell on the <strong>right-hand side of the glass doors</strong> — security will buzz you in
                    </Bullet>
                    <Bullet>Bring photo ID for security check-in</Bullet>
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground mb-1.5 flex items-center gap-2">
                    <DoorOpen className="w-4 h-4" style={{ color: "hsl(270, 60%, 55%)" }} />
                    Regus Office Access (9th Floor)
                  </p>
                  <ul className="space-y-2 pl-1">
                    <Bullet>
                      Reception hours: 9:00 AM – 5:00 PM — no swipe card required
                    </Bullet>
                    <Bullet>
                      Outside Regus hours: swipe card required for floor access
                    </Bullet>
                  </ul>
                </div>
              </div>
            </SectionCard>

            {/* Edison */}
            <SectionCard>
              <div className="flex items-center gap-2.5 mb-3">
                <MapPin className="w-5 h-5" style={{ color: "hsl(270, 80%, 40%)" }} />
                <h3
                  className="text-lg font-semibold"
                  style={{ fontFamily: FONT_BODY, color: "hsl(270, 100%, 25%)" }}
                >
                  Edison Access
                </h3>
              </div>
              <Callout>
                <p>
                  <strong>Pending</strong> — detailed access instructions to be added. Use the current building + Regus check-in process.
                </p>
              </Callout>
            </SectionCard>
          </section>

          {/* ── Patient List & Schedule (interstitial) ──────────── */}
          <section className="mb-10">
            <SectionCard>
              <SubHeading icon={FileText}>Patient List & Schedule</SubHeading>
              <ul className="space-y-2 pl-1">
                <Bullet>
                  NJ Admin sends patient list to the Regus front desk before your visit
                </Bullet>
                <Bullet>
                  You will receive your <strong>full patient schedule the evening before</strong>
                </Bullet>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Questions?{" "}
                <a
                  href="mailto:offices@orendapsych.com"
                  className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                >
                  offices@orendapsych.com
                </a>
              </p>
            </SectionCard>
          </section>

          {/* ── STEP 3 ──────────────────────────────────────────── */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <StepBadge number={3} />
              <h2
                className="text-2xl font-light"
                style={{
                  fontFamily: FONT_DISPLAY,
                  color: "hsl(270, 100%, 25%)",
                }}
              >
                Patient Arrival
              </h2>
            </div>

            <SectionCard className="mb-4">
              <SubHeading icon={MessageSquare}>
                Patient Check-In Process
              </SubHeading>
              <ul className="space-y-2 pl-1">
                <Bullet>
                  Patients will text the Orenda number upon arrival
                </Bullet>
                <Bullet>
                  NJ Admin will notify you when your patient arrives
                </Bullet>
                <Bullet>
                  <strong>You must go out and greet your patient</strong>
                </Bullet>
              </ul>
            </SectionCard>

            <SectionCard>
              <SubHeading icon={Clock}>
                After Regus Hours (Hoboken Only)
              </SubHeading>
              <ul className="space-y-2 pl-1 mb-4">
                <Bullet>
                  Place the <strong>Orenda signage</strong> outside the 9th-floor glass door
                </Bullet>
                <Bullet>
                  Sign instructs patients to text upon arrival
                </Bullet>
              </ul>

              <Callout variant="warning">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-amber-800 mb-0.5">
                      Important
                    </p>
                    <p className="text-amber-800">
                      The sign is located inside the office. You must put it out
                      before patients arrive and bring it back inside when
                      finished.
                    </p>
                  </div>
                </div>
              </Callout>
            </SectionCard>
          </section>

          {/* ── STEP 4 ──────────────────────────────────────────── */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <StepBadge number={4} />
              <h2
                className="text-2xl font-light"
                style={{
                  fontFamily: FONT_DISPLAY,
                  color: "hsl(270, 100%, 25%)",
                }}
              >
                End of Visit Checklist
              </h2>
            </div>

            <SectionCard>
              <ul className="space-y-2 pl-1">
                <Bullet>Return key + swipe card to lockbox</Bullet>
                <Bullet>Reset and clean office</Bullet>
                <Bullet>Prepare for next provider</Bullet>
              </ul>
            </SectionCard>
          </section>

          {/* ── Important Notes ─────────────────────────────────── */}
          <section className="mb-16">
            <Callout variant="warning">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 mt-0.5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-semibold text-amber-800 mb-1">
                    Important Notes
                  </p>
                  <ul className="space-y-1.5 text-amber-800">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      Do NOT assume access is pre-arranged
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      If not regularly scheduled → confirm access in advance
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      Patients must always be escorted within Regus
                    </li>
                  </ul>
                </div>
              </div>
            </Callout>
          </section>

          {/* ── Footer ──────────────────────────────────────────── */}
          <footer className="text-center pb-8">
            <div
              className="w-12 h-px mx-auto mb-4"
              style={{ background: "hsl(270, 30%, 80%)" }}
            />
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: FONT_DISPLAY }}
            >
              Orenda Psychiatry · New Jersey Office Operations
            </p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-3">
              <a
                href="mailto:offices@orendapsych.com"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Mail className="w-3 h-3" /> offices@orendapsych.com
              </a>
              <span>·</span>
              <a
                href="tel:+12016854863"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Phone className="w-3 h-3" /> (201) 685-4863
              </a>
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default ProviderOpsGuideV2;
