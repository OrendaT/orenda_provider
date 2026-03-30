import { Link } from "react-router-dom";
import NJNavbar from "@/components/NJNavbar";
import { ArrowLeft, Check, ChevronDown, FileText, FileSpreadsheet, FileImage, Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import logo from "@/assets/orenda-logo-purple.png";
import { downloadAgreementDocx, downloadAgreementXlsx } from "@/utils/agreementExports";
import AgreementPdfRenderer, { triggerPdfDownload } from "@/components/AgreementPdfRenderer";
import { supabase } from "@/integrations/supabase/client";

const sections = [
  {
    num: "1",
    title: "Building Access & Security",
    content: "Provider agrees to follow all building access and security procedures. Providers may not share keys, lockbox codes, access credentials, or building access information with unauthorized persons.",
  },
  {
    num: "2",
    title: "Office Care & Reset",
    content: "Providers must leave the office clean, organized, and in the same condition in which it was found. This includes disposing of trash, resetting the space for the next provider, and returning the office key to the designated lockbox after use.",
  },
  {
    num: "3",
    title: "Proper Use of Space",
    content: "Providers may only use designated office areas for patient care and related administrative work. Hallways, reception areas, and other shared spaces may not be used for clinical visits or business activities unless specifically authorized.",
  },
  {
    num: "4",
    title: "Professional Conduct",
    content: "Providers are expected to maintain professional conduct and behavior while using the office space and interacting with building staff, patients, and other occupants.",
  },
  {
    num: "5",
    title: "Safety & Prohibited Items",
    content: "Providers may not bring prohibited or hazardous items into the office, including weapons, explosives, or unauthorized equipment, and must comply with all health, safety, and privacy requirements.",
  },
  {
    num: "6",
    title: "Responsibility for Access Devices and Property",
    content: "Any office keys, lockbox access codes, swipe cards, badges, or other access devices must be safeguarded and used only as authorized. Lost keys, access issues, or damage to the office must be reported promptly.",
    bullets: [
      "It is strongly recommended that all providers obtain a permanent swipe card and key for seamless building access. Contact the NJ Admin Team at (201) 685-4863 or offices@orendapsych.com to get set up.",
      "If a swipe card or key is lost or damaged, the provider is responsible for a $65 replacement fee.",
      "All swipe cards and keys must be returned to Orenda Psychiatry upon departure from the practice. Failure to return access devices may result in a replacement charge.",
    ],
  },
  {
    num: "7",
    title: "Scheduling Commitment & Cancellation Policy",
    content: "Office reservations are intended to support scheduled patient care and operational coordination.",
    bullets: [
      "Providers should only reserve office time when they are confident they will be able to attend and see their scheduled patients.",
      "Because office access, patient coordination, and building security arrangements require advance preparation, providers are expected to avoid last-minute cancellations.",
      "Providers should provide at least 48 hours' notice if a change is unavoidable.",
      "Frequent late cancellations, failure to attend a reserved office time, or repeated schedule changes may result in restrictions or loss of future office scheduling privileges.",
    ],
  },
  {
    num: "8",
    title: "Indemnification",
    content: "Provider agrees to indemnify and hold harmless Orenda Psychiatry from any claims, damages, losses, or liabilities arising from the Provider's use of the office space, except to the extent caused by Orenda Psychiatry's own negligence or misconduct.",
  },
  {
    num: "9",
    title: "Independent Provider & Regulatory Responsibility",
    content: "Provider acknowledges that they are an independent medical professional and not an employee of Orenda Psychiatry. Provider is solely responsible for maintaining all required professional licenses, credentials, malpractice coverage, and for complying with all applicable federal, state, and local laws and regulations governing the practice of medicine, including New Jersey regulatory requirements. Orenda Psychiatry provides administrative and office support only and assumes no responsibility for the Provider's clinical services, medical decision-making, or regulatory compliance.",
  },
  {
    num: "10",
    title: "Permitted Use",
    content: "The office space at the designated Orenda Psychiatry location is provided solely for Orenda Psychiatry clinical appointments and related authorized activities. The space may not be used for personal business, private patients, or services performed on behalf of another practice, organization, or entity.",
  },
  {
    num: "11",
    title: "Non-Solicitation",
    content: "Provider shall not solicit, recruit, or redirect Orenda Psychiatry patients to any outside practice, service, or business during or after use of the office space.",
  },
];

export default function NJOfficeAddendum({ isAdmin = false }: { isAdmin?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date] = useState(new Date().toISOString().split("T")[0]);
  const [agreed, setAgreed] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isValid = name.trim().length > 0 && email.trim().length > 0 && agreed;

  const handleSubmit = async () => {
    if (!isValid) return;
    if (name.trim().length > 200 || email.trim().length > 255) {
      toast.error("Please check your input fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitted(true);
    toast.success("Provider Office Use Agreement signed successfully.");

    const signedDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const templateData = {
      providerName: name.trim(),
      providerEmail: email.trim(),
      signedDate,
    };
    const idempotencyBase = `agreement-signed-${email.trim()}-${date}`;

    // Send confirmation to the provider
    supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "agreement-signed-confirmation",
        recipientEmail: email.trim(),
        idempotencyKey: `${idempotencyBase}-provider`,
        templateData,
      },
    });

    // Send copy to admin
    supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "agreement-signed-confirmation",
        recipientEmail: "susie@orendapsych.com",
        idempotencyKey: `${idempotencyBase}-admin`,
        templateData,
      },
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white font-body flex items-center justify-center">
        <div className="text-center px-8 max-w-lg">
          <div className="w-20 h-20 rounded-full bg-italic-accent/10 flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-italic-accent" />
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-light text-foreground mb-4">
            Agreement <em className="text-italic-accent" style={{ fontStyle: "italic" }}>Signed</em>
          </h1>
          <p className="font-body text-muted-foreground text-sm leading-relaxed mb-2">
            Thank you, <span className="text-foreground font-medium">{name}</span>.
          </p>
          <p className="font-body text-muted-foreground text-sm leading-relaxed mb-8">
            Your Provider Office Use Agreement & Scheduling Policy has been submitted successfully. A copy will be sent to <span className="text-foreground font-medium">{email}</span> for your records.
          </p>
          <Link
            to="/new-jersey-office-hoboken"
            className="inline-flex items-center gap-2 bg-foreground text-white font-body text-sm font-medium px-8 py-3.5 rounded-lg hover:bg-foreground/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hoboken Office
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-body">
      <NJNavbar isAdmin={isAdmin} />

      {/* Hero Header */}
      <div className="bg-foreground text-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-8">
          <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-4">ORENDA PSYCHIATRY, PLLC</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light leading-[0.95] mb-4">
            Provider Office Use
            <br />
            <em className="text-italic-accent" style={{ fontStyle: "italic" }}>Agreement & Scheduling Policy</em>
          </h1>
          <p className="font-body text-white/50 text-sm mt-6">Required for all providers using NJ office space</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <button
              onClick={() => triggerPdfDownload()}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-body text-sm font-medium px-5 py-2.5 rounded-lg border border-white/15 transition-all"
            >
              <FileImage className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={() => { downloadAgreementDocx(); toast.success("Word document downloading..."); }}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-body text-sm font-medium px-5 py-2.5 rounded-lg border border-white/10 transition-all"
            >
              <FileText className="w-4 h-4" />
              Download Word (.docx)
            </button>
            <button
              onClick={() => { downloadAgreementXlsx(); toast.success("Excel spreadsheet downloading..."); }}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-body text-sm font-medium px-5 py-2.5 rounded-lg border border-white/10 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Download Excel (.xlsx)
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-body text-sm font-medium px-5 py-2.5 rounded-lg border border-white/10 transition-all"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8">
        {/* Two-column: Contract terms + Sticky form */}
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 py-12 md:py-16">
          
          {/* Left: Contract Sections — 3 cols */}
          <div className="lg:col-span-3">
            <p className="font-body text-muted-foreground text-sm leading-relaxed mb-10">
              By reserving and using an Orenda Psychiatry office location, the Provider acknowledges and agrees to the following terms:
            </p>

            <div className="space-y-1">
              {sections.map((s) => (
                <div key={s.num} className="border-b border-border/20">
                  <button
                    onClick={() => setExpandedSection(expandedSection === s.num ? null : s.num)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-italic-accent text-lg">{s.num}.</span>
                      <h2 className="font-display text-lg text-foreground group-hover:text-italic-accent transition-colors">{s.title}</h2>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${expandedSection === s.num ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === s.num ? "max-h-[600px] pb-6" : "max-h-0"}`}>
                    {s.content && (
                      <p className="font-body text-muted-foreground text-sm leading-relaxed ml-7 mb-3">{s.content}</p>
                    )}
                    {s.bullets && (
                      <ul className="space-y-2 ml-7">
                        {s.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-italic-accent mt-2 flex-shrink-0" />
                            <p className="font-body text-muted-foreground text-sm leading-relaxed">{b}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Signing Form — 2 cols, sticky */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <div className="bg-[hsl(270,20%,97%)] rounded-2xl p-8 border border-border/20">
                <h3 className="font-display text-2xl text-foreground mb-2">Sign Agreement</h3>
                <p className="font-body text-muted-foreground text-xs mb-8">Review the agreement, then complete the fields below.</p>

                {/* Form Fields */}
                <div className="space-y-5 mb-8">
                  <div>
                    <label className="font-body text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Full Legal Name (Digital Signature)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={200}
                      placeholder="Enter your full name"
                      className="w-full bg-white border border-border/30 rounded-lg px-4 py-3 font-display text-lg text-foreground italic placeholder:text-muted-foreground/50 placeholder:not-italic focus:outline-none focus:ring-2 focus:ring-italic-accent/30 focus:border-italic-accent/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-body text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      maxLength={255}
                      placeholder="your@email.com"
                      className="w-full bg-white border border-border/30 rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-italic-accent/30 focus:border-italic-accent/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-body text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Date</label>
                    <p className="w-full bg-white border border-border/30 rounded-lg px-4 py-3 font-body text-sm text-foreground">
                      {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>

                {/* Single Acknowledgment Checkbox */}
                <div className="mb-8">
                  <button
                    onClick={() => setAgreed(!agreed)}
                    className="w-full flex items-start gap-3 text-left group"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                      agreed
                        ? "bg-italic-accent border-italic-accent"
                        : "border-border/50 bg-white group-hover:border-italic-accent/40"
                    }`}>
                      {agreed && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <p className="font-body text-foreground text-sm leading-relaxed">
                      I have reviewed, understand, and agree to the <strong>Provider Office Use Agreement & Scheduling Policy</strong>.
                    </p>
                  </button>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!isValid}
                  className={`w-full py-4 rounded-xl font-body text-sm font-medium tracking-wide transition-all duration-300 ${
                    isValid
                      ? "bg-foreground text-white hover:bg-foreground/90 cursor-pointer"
                      : "bg-border/50 text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  Sign & Submit Agreement
                </button>

                {!agreed && name && email && (
                  <p className="font-body text-muted-foreground text-xs mt-3 text-center">
                    Please review and acknowledge the agreement above to continue.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AgreementPdfRenderer />
    </div>
  );
}
