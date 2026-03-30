import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Download, FileSpreadsheet, Link2, CheckCircle, AlertCircle, ArrowLeft, Copy, Mail, Calendar, MessageSquare, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { downloadProviderOpsWorkbook, type WorkflowConfig } from "@/utils/providerOpsWorkbookExport";
import logo from "@/assets/orenda-logo-purple.png";

export default function ProviderOpsWorkbook() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const emailRef = useRef<HTMLDivElement>(null);
  const [providers, setProviders] = useState<{ name: string; email: string }[]>([]);
  const [config, setConfig] = useState<WorkflowConfig>({
    officeAgreementLink: "",
    onboardingCalendarLink: "",
    checkInFormLink: "",
    patientDirectionsLink: "https://orenda-njoffice-guide.lovable.app/patient/arrival-guide",
    simplePracticeLink: "",
  });
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("providers").select("provider_name, id").then(({ data }) => {
      if (data) {
        setProviders(data.map(p => ({ name: p.provider_name, email: "" })));
      }
    });
  }, []);

  const missingLinks = Object.entries(config).filter(([_, v]) => !v || v.includes("(paste"));
  const allFilled = missingLinks.length === 0;

  const agreementLink = config.officeAgreementLink || "(paste Google Docs link here)";

  const agreementEmailHtml = `
<div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
  <div style="background: linear-gradient(135deg, #2D1B4E, #6B4FA0); padding: 28px 32px; border-radius: 12px 12px 0 0;">
    <p style="color: #C4B5DC; font-size: 11px; letter-spacing: 2px; margin: 0 0 4px;">ORENDA PSYCHIATRY</p>
    <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-family: Georgia, serif;">Office Use Agreement</h1>
  </div>
  <div style="padding: 32px; border: 1px solid #E8E0F0; border-top: none; border-radius: 0 0 12px 12px;">
    <p style="font-size: 15px; color: #1A1A2E; line-height: 1.7; margin: 0 0 16px;">Hi <strong>(Provider Name)</strong>,</p>
    <p style="font-size: 15px; color: #1A1A2E; line-height: 1.7; margin: 0 0 16px;">Thank you so much for booking the New Jersey offices!</p>
    <p style="font-size: 15px; color: #1A1A2E; line-height: 1.7; margin: 0 0 16px;">I've added some time on your Simple Practice calendar, and we'll be sending you a Google Meet invite very soon to help with your onboarding for the New Jersey offices and give you everything you need to set you up for success.</p>
    <p style="font-size: 15px; color: #1A1A2E; line-height: 1.7; margin: 0 0 20px;">In the meantime, here is the office agreement. If you could please kindly sign that, that would be great:</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${agreementLink}" style="display: inline-block; background: linear-gradient(135deg, #2D1B4E, #6B4FA0); color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-size: 15px; font-weight: bold; letter-spacing: 0.5px;">📋 Sign Office Agreement</a>
    </div>
    <p style="font-size: 15px; color: #1A1A2E; line-height: 1.7; margin: 0 0 24px;">Thank you so much!</p>
    <hr style="border: none; border-top: 1px solid #E8E0F0; margin: 24px 0;" />
    <p style="font-size: 14px; color: #1A1A2E; margin: 0;">Warmly,</p>
    <p style="font-size: 14px; color: #1A1A2E; margin: 4px 0 0; font-weight: bold;">Susie Levitt</p>
    <p style="font-size: 13px; color: #6B6B80; margin: 4px 0 0;">(203) 313-3074 · susie@arendapsych.com</p>
  </div>
</div>`;

  const handleCopyEmailHtml = async () => {
    try {
      const blob = new Blob([agreementEmailHtml], { type: "text/html" });
      await navigator.clipboard.write([
        new ClipboardItem({ "text/html": blob, "text/plain": new Blob([agreementEmailHtml], { type: "text/plain" }) }),
      ]);
      setCopied(true);
      toast({ title: "Copied!", description: "Email HTML copied — paste into Gmail or your email client." });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = agreementEmailHtml;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      toast({ title: "Copied!", description: "HTML source copied to clipboard." });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownload = () => {
    downloadProviderOpsWorkbook(config, providers);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const linkFields: { key: keyof WorkflowConfig; label: string; placeholder: string; icon: string }[] = [
    { key: "officeAgreementLink", label: "Office Agreement (Google Docs)", placeholder: "https://docs.google.com/...", icon: "📋" },
    { key: "onboardingCalendarLink", label: "Onboarding Calendar (Google Calendar)", placeholder: "https://calendar.google.com/...", icon: "📅" },
    { key: "checkInFormLink", label: "Patient Check-In Form (Google Forms)", placeholder: "https://forms.gle/...", icon: "✅" },
    { key: "patientDirectionsLink", label: "Patient Directions Page", placeholder: "https://orenda-njoffice-guide.lovable.app/patient/arrival-guide", icon: "🗺️" },
    { key: "simplePracticeLink", label: "Simple Practice Link", placeholder: "https://app.simplepractice.com/...", icon: "💼" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--background))] to-[#F0EBF5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2D1B4E] via-[#462D6D] to-[#6B4FA0] text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-white/70 hover:text-white mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <img src={logo} alt="Orenda" className="h-8 brightness-0 invert" />
            <Badge className="bg-white/20 text-white border-white/30 text-xs">Operations Workbook</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: "Garamond, Georgia, serif" }}>
            Provider Ops Workbook
          </h1>
          <p className="text-white/70 mt-2 text-lg">
            Multi-tab Excel with sign-up sheets, workflow tracker, patient schedules, building lists & email templates
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* What's Included */}
        <Card className="border-[hsl(var(--border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileSpreadsheet className="w-5 h-5 text-[#6B4FA0]" />
              What's in the Workbook
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { tab: "Hoboken Sign-Up", desc: "Schedule with current bookings pre-populated" },
                { tab: "Edison Sign-Up", desc: "Schedule with current bookings pre-populated" },
                { tab: "Workflow Tracker", desc: "8-step checklist per provider (agreement → 90-day)" },
                { tab: "Patient Schedule", desc: "Fillable 30-min slot template per provider day" },
                { tab: "Building Send List", desc: "Patient lists for Regus front desk with deadlines" },
                { tab: "Email Templates", desc: "8 ready-to-use email & SMS templates" },
                { tab: "Provider Directory", desc: "Contact list pulled from your database" },
              ].map(item => (
                <div key={item.tab} className="flex items-start gap-2 p-3 rounded-lg bg-[#F8F6FB] border border-[#E8E0F0]">
                  <CheckCircle className="w-4 h-4 text-[#6B4FA0] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-[hsl(var(--foreground))]">{item.tab}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Links Configuration */}
        <Card className="border-[hsl(var(--border))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2 className="w-5 h-5 text-[#6B4FA0]" />
              Fill In Your Links
              {!allFilled && (
                <Badge variant="outline" className="ml-auto text-amber-600 border-amber-300 bg-amber-50">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {missingLinks.length} missing
                </Badge>
              )}
              {allFilled && (
                <Badge className="ml-auto bg-green-100 text-green-700 border-green-300">
                  <CheckCircle className="w-3 h-3 mr-1" /> All set
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              These links will be embedded in the email templates. You can download without them — placeholders will appear instead.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {linkFields.map(field => (
              <div key={field.key} className="space-y-1">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <span>{field.icon}</span> {field.label}
                </Label>
                <Input
                  value={config[field.key]}
                  onChange={e => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="border-[hsl(var(--border))]"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Download Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleDownload}
            size="lg"
            className="bg-gradient-to-r from-[#2D1B4E] to-[#6B4FA0] hover:from-[#462D6D] hover:to-[#8B6FC0] text-white text-lg px-10 py-6 rounded-xl shadow-lg"
          >
            {downloaded ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" /> Downloaded!
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" /> Download Ops Workbook (.xlsx)
              </>
            )}
          </Button>
        </motion.div>

        {/* Office Agreement Email — Copy for Email */}
        <Card className="border-[hsl(var(--border))] overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#2D1B4E] to-[#6B4FA0] text-white">
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Mail className="w-5 h-5" />
              Office Agreement Email
            </CardTitle>
            <p className="text-white/70 text-sm">Copy this styled email and paste directly into Gmail when sending the agreement.</p>
          </CardHeader>
          <CardContent className="p-0">
            <div ref={emailRef} className="p-6" dangerouslySetInnerHTML={{ __html: agreementEmailHtml }} />
            <div className="p-4 border-t border-[hsl(var(--border))] bg-[#F8F6FB] flex justify-end">
              <Button
                onClick={handleCopyEmailHtml}
                className="bg-gradient-to-r from-[#2D1B4E] to-[#6B4FA0] hover:from-[#462D6D] hover:to-[#8B6FC0] text-white"
              >
                {copied ? (
                  <><CheckCircle className="w-4 h-4 mr-2" /> Copied!</>
                ) : (
                  <><Copy className="w-4 h-4 mr-2" /> Copy Email HTML</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ─── Provider Communication Hub ─── */}
        <Card className="border-[hsl(var(--border))] overflow-hidden" id="communication-hub">
          <CardHeader className="bg-gradient-to-r from-[#2D1B4E] to-[#6B4FA0] text-white">
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <MessageSquare className="w-5 h-5" />
              Provider Communication Hub
            </CardTitle>
            <p className="text-white/70 text-sm">All copyable messages for the provider onboarding workflow — calendar invites, emails & texts.</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">

            {/* Google Calendar Invite */}
            {(() => {
              const calendarInviteText = `Hi [Provider Name]!\n\nLooking forward to connecting and getting you all set up for success at our New Jersey offices. We'll go over:\n\n• Building access & check-in logistics\n• Your patient schedule & Simple Practice calendar\n• Office amenities (Wi-Fi, kitchen, etc.)\n\nIt'll be quick — just want to make sure you feel fully prepared!\n\nTalk soon,\nSusie Levitt\n(203) 313-3074 · susie@orendapsych.com`;

              const welcomeEmailText = `Hi [Provider Name],\n\nThank you so much for booking your first stay at the Hoboken, New Jersey location on [Booking Date] — we're thrilled to have you! 🎉\n\nI've gone ahead and put time on your Simple Practice calendar for [Appointment Time]. I've also added this to a calendar invite with the Google Meet link so you're all set.\n\nHere are a few things I want you to know:\n\n📅 SIMPLE PRACTICE CALENDAR\nI've blocked off [Appointment Time] on [Booking Date] on your Simple Practice calendar. A calendar invite with the Google Meet link has also been sent to you.\n\n📋 YOUR PATIENT CALENDAR\nI've included your patient calendar with your upcoming appointments. As you have additional bookings, I'll make sure to keep this updated and send you the latest version.\n\n📝 HOBOKEN OFFICE PAPERWORK\nBefore your first visit, please review and sign the Hoboken office agreement. This covers office policies, access guidelines, and what to expect.\n\n🔒 SECURITY & BUILDING ACCESS\nI will ensure your patient is added to the security desk so they have smooth access on the day of their visit. No action needed from you on this.\n\n🗺️ PATIENT DIRECTIONS\nI'll be sending your patient detailed directions and information about coming to our Hoboken office, including building entry, floor access, and what to expect on arrival.\n\nOFFICE LOCATION\nRegus — Riverfront Center\n221 River Street, 9th Floor, Unit 9076\nHoboken, NJ 07030\n\nQUICK REFERENCE\nRegus Front Desk: 9th Floor · Mon–Fri, 9 AM – 5 PM\nFront Desk Email: Hoboken.Riverfront@regus.com\nBuilding Phone: (201) 721-8500\nWi-Fi Network: Regus Net Wi-Fi\nWi-Fi Password: 167845630\nAfter-Hours Access: Swipe card required (we'll set you up)\n\nWe're genuinely excited to have you join us at the Hoboken office. Don't hesitate to reach out with any questions at all — I'm here to help.\n\nWarmly,\nSusie Levitt\n(203) 313-3074\nsusie@orendapsych.com`;

              const agreementEmailText = `Hi [Provider Name],\n\nThank you so much for booking the New Jersey offices!\n\nI've added some time on your Simple Practice calendar, and we'll be sending you a Google Meet invite very soon to help with your onboarding for the New Jersey offices and give you everything you need to set you up for success.\n\nIn the meantime, here is the office agreement. If you could please kindly sign that, that would be great:\n\n[Office Agreement Link]\n\nThank you so much!\n\nWarmly,\nSusie Levitt\n(203) 313-3074 · susie@arendapsych.com`;

              const copyBlocks = [
                {
                  id: "calendar-invite",
                  icon: <Calendar className="w-4 h-4 text-[#6B4FA0]" />,
                  title: "📅 Google Calendar Invite Description",
                  subtitle: "Paste into the Google Calendar event description for the onboarding call",
                  text: calendarInviteText,
                  step: "Step ⑤",
                },
                {
                  id: "agreement-email",
                  icon: <FileText className="w-4 h-4 text-[#6B4FA0]" />,
                  title: "📋 Office Agreement Email (Plain Text)",
                  subtitle: "Plain-text version of the agreement email — or use the styled HTML card above",
                  text: agreementEmailText,
                  step: "Step ②",
                },
                {
                  id: "welcome-email",
                  icon: <Mail className="w-4 h-4 text-[#6B4FA0]" />,
                  title: "✉️ Welcome Email (Plain Text)",
                  subtitle: "Full welcome email with office details, Wi-Fi, directions & quick reference",
                  text: welcomeEmailText,
                  step: "Step ⑥",
                },
              ];

              const handleCopyBlock = async (id: string, text: string) => {
                await navigator.clipboard.writeText(text);
                setCopiedBlock(id);
                toast({ title: "Copied!", description: "Text copied to clipboard." });
                setTimeout(() => setCopiedBlock(null), 3000);
              };

              return copyBlocks.map(block => (
                <div key={block.id} className="rounded-xl border border-[#E8E0F0] overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 bg-[#F8F6FB] border-b border-[#E8E0F0]">
                    <div className="flex items-center gap-2">
                      {block.icon}
                      <span className="text-sm font-semibold text-[hsl(var(--foreground))]">{block.title}</span>
                      <Badge variant="outline" className="text-[10px] border-[#C4B5DC] text-[#6B4FA0]">{block.step}</Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyBlock(block.id, block.text)}
                      className="text-xs border-[#C4B5DC] hover:bg-[#F0EBF5]"
                    >
                      {copiedBlock === block.id ? (
                        <><CheckCircle className="w-3.5 h-3.5 mr-1 text-green-600" /> Copied!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5 mr-1" /> Copy Text</>
                      )}
                    </Button>
                  </div>
                  <p className="px-5 py-1 text-xs text-[hsl(var(--muted-foreground))]">{block.subtitle}</p>
                  <pre className="px-5 py-4 text-sm text-[hsl(var(--foreground))]/80 whitespace-pre-wrap leading-relaxed font-sans max-h-64 overflow-y-auto">{block.text}</pre>
                </div>
              ));
            })()}

          </CardContent>
        </Card>

        <Card className="border-[hsl(var(--border))]">
          <CardHeader>
            <CardTitle className="text-lg">Provider Onboarding Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                "① Provider books office day on the sign-up sheet",
                "② Send office use agreement via Google Docs for e-signature",
                "③ Provider signs and returns the agreement",
                "④ Book provider's availability in Simple Practice",
                "⑤ Schedule onboarding time via Google Calendar + send invite",
                "⑥ Send welcome email with office details & Google Meet link",
                "⑦ Add patient bookings to the patient schedule",
                "⑧ Send patient list to Regus front desk (by 9 AM day before)",
                "⑨ Send patients appointment confirmation email + SMS",
                "⑩ Send patients 24-hour reminder email + SMS",
                "⑪ Day of visit: patients check in via Google Form",
                "⑫ Post-visit: schedule telehealth follow-up",
                "⑬ Log 90-day in-person follow-up reminder",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-md hover:bg-[#F8F6FB] transition-colors">
                  <div className="w-2 h-2 rounded-full bg-[#6B4FA0] shrink-0" />
                  <span className="text-sm text-[hsl(var(--foreground))]">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-[hsl(var(--muted-foreground))] pb-8">
          Orenda Psychiatry, PLLC · 347 Fifth Ave, Suite 1402-235, New York, NY 10016
        </p>
      </div>
    </div>
  );
}
