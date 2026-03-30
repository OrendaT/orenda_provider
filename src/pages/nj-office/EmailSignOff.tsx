import { Helmet } from "react-helmet-async";
import { useState, useMemo } from "react";
import { Copy, Check, Mail, Phone, MapPin } from "lucide-react";
import NJNavbar from "@/components/NJNavbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import orendaLogoPurple from "@/assets/orenda-logo-purple.png";

const CONTACT = {
  team: "The New Jersey Admin Team",
  entity: "Orenda Psychiatry",
  phone: "(201) 685-4863",
  email: "offices@orendapsych.com",
};

const HOBOKEN = {
  label: "Hoboken Office",
  address: "50 Harrison St, Suite 328, Hoboken, NJ 07030",
  regusPhone: "(201) 876-0800",
};

const EDISON = {
  label: "Edison Office",
  address: "110 Fieldcrest Ave, Unit 328, Edison, NJ 08837",
  regusPhone: "(732) 782-0328",
};

const LOCATIONS_DARK = `
  <tr><td style="padding:12px 0 0;font-size:12px;color:#777;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Office Locations</td></tr>
  <tr><td style="padding:6px 0 0">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:8px 12px;background:#F9F5FF;border-left:3px solid #3B0764;border-radius:0 6px 6px 0;vertical-align:top" width="50%">
          <span style="font-size:12px;font-weight:700;color:#3B0764;display:block;margin-bottom:2px">${HOBOKEN.label}</span>
          <span style="font-size:11px;color:#666;line-height:1.4">${HOBOKEN.address}</span>
        </td>
        <td style="width:8px"></td>
        <td style="padding:8px 12px;background:#F9F5FF;border-left:3px solid #6D28D9;border-radius:0 6px 6px 0;vertical-align:top" width="50%">
          <span style="font-size:12px;font-weight:700;color:#6D28D9;display:block;margin-bottom:2px">${EDISON.label}</span>
          <span style="font-size:11px;color:#666;line-height:1.4">${EDISON.address}</span>
        </td>
      </tr>
    </table>
  </td></tr>`;

const LOCATIONS_WHITE = `
  <tr><td style="padding:12px 0 0;font-size:12px;color:rgba(255,255,255,0.6);font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Office Locations</td></tr>
  <tr><td style="padding:6px 0 0">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:8px 12px;background:rgba(255,255,255,0.1);border-left:3px solid rgba(255,255,255,0.5);border-radius:0 6px 6px 0;vertical-align:top" width="50%">
          <span style="font-size:12px;font-weight:700;color:#fff;display:block;margin-bottom:2px">${HOBOKEN.label}</span>
          <span style="font-size:11px;color:rgba(255,255,255,0.6);line-height:1.4">${HOBOKEN.address}</span>
        </td>
        <td style="width:8px"></td>
        <td style="padding:8px 12px;background:rgba(255,255,255,0.1);border-left:3px solid rgba(255,255,255,0.5);border-radius:0 6px 6px 0;vertical-align:top" width="50%">
          <span style="font-size:12px;font-weight:700;color:#fff;display:block;margin-bottom:2px">${EDISON.label}</span>
          <span style="font-size:11px;color:rgba(255,255,255,0.6);line-height:1.4">${EDISON.address}</span>
        </td>
      </tr>
    </table>
  </td></tr>`;

/* ── sign-off variations ── */
const buildSignoffs = (logoUrl: string) => {
  const LOGO_DARK = `<tr><td style="padding:0 0 8px"><img src="${logoUrl}" alt="Orenda Psychiatry" width="120" height="auto" style="display:block;height:auto;max-width:120px" /></td></tr>`;
  const LOGO_WHITE = `<tr><td style="padding:0 0 8px"><img src="${logoUrl}" alt="Orenda Psychiatry" width="120" height="auto" style="display:block;height:auto;max-width:120px;filter:brightness(0) invert(1)" /></td></tr>`;

  return [
  {
    label: "Executive — Gradient Header",
    id: "executive",
    html: `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:'Montserrat',Arial,Helvetica,sans-serif;max-width:540px">
  <tr><td style="padding:16px 0 8px"><hr style="border:none;border-top:2px solid #3B0764;margin:0"/></td></tr>
  ${LOGO_DARK}
  <tr><td style="padding:0 0 4px;font-size:15px;font-weight:700;color:#3B0764">Best regards,</td></tr>
  <tr><td style="padding:0 0 2px;font-size:14px;font-weight:600;color:#1a1a1a">${CONTACT.team}</td></tr>
  <tr><td style="padding:0 0 2px;font-size:13px;color:#555">${CONTACT.entity}</td></tr>
  <tr>
    <td style="padding:8px 0 0">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding:0 12px 0 0;font-size:13px;color:#3B0764;font-weight:600">${CONTACT.phone}</td>
          <td style="font-size:13px;color:#3B0764;font-weight:600"><a href="mailto:${CONTACT.email}" style="color:#3B0764;text-decoration:none">${CONTACT.email}</a></td>
        </tr>
      </table>
    </td>
  </tr>
  ${LOCATIONS_DARK}
</table>`,
  },
  {
    label: "Minimal — Clean Lines",
    id: "minimal",
    html: `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;max-width:540px">
  <tr><td style="padding:20px 0 6px">${""}</td></tr>
  ${LOGO_DARK}
  <tr><td style="font-size:14px;color:#333;padding:0 0 6px">Best,</td></tr>
  <tr><td style="font-size:14px;font-weight:700;color:#111;padding:0 0 2px">${CONTACT.team}</td></tr>
  <tr><td style="font-size:12px;color:#666;padding:0 0 8px">${CONTACT.entity}</td></tr>
  <tr><td style="border-top:1px solid #e5e5e5;padding:8px 0 0;font-size:12px;color:#888">
    ${CONTACT.phone} &nbsp;|&nbsp; <a href="mailto:${CONTACT.email}" style="color:#666;text-decoration:none">${CONTACT.email}</a>
  </td></tr>
  ${LOCATIONS_DARK}
</table>`,
  },
  {
    label: "Card — Branded Block",
    id: "card",
    html: `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:'Montserrat',Arial,Helvetica,sans-serif;max-width:540px;margin-top:16px">
  <tr>
    <td style="background:linear-gradient(135deg,#3B0764 0%,#6D28D9 100%);border-radius:12px;padding:20px 24px">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${LOGO_WHITE}
        <tr><td style="font-size:14px;color:rgba(255,255,255,0.85);padding:0 0 4px">Warm regards,</td></tr>
        <tr><td style="font-size:16px;font-weight:700;color:#fff;padding:0 0 2px">${CONTACT.team}</td></tr>
        <tr><td style="font-size:13px;color:rgba(255,255,255,0.7);padding:0 0 12px">${CONTACT.entity}</td></tr>
        <tr><td style="border-top:1px solid rgba(255,255,255,0.2);padding:12px 0 0">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-size:13px;color:#fff;padding:0 16px 0 0">${CONTACT.phone}</td>
              <td style="font-size:13px"><a href="mailto:${CONTACT.email}" style="color:#fff;text-decoration:none">${CONTACT.email}</a></td>
            </tr>
          </table>
        </td></tr>
        ${LOCATIONS_WHITE}
      </table>
    </td>
  </tr>
</table>`,
  },
  {
    label: "Professional — Two-Tone",
    id: "twotone",
    html: `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:'Montserrat',Arial,Helvetica,sans-serif;max-width:540px;margin-top:16px">
  <tr><td style="background:#F5F3FF;border-left:4px solid #3B0764;border-radius:0 8px 8px 0;padding:16px 20px">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      ${LOGO_DARK}
      <tr><td style="font-size:14px;color:#3B0764;font-weight:600;padding:0 0 6px">Best regards,</td></tr>
      <tr><td style="font-size:15px;font-weight:700;color:#1a1a1a;padding:0 0 1px">${CONTACT.team}</td></tr>
      <tr><td style="font-size:12px;color:#6D28D9;font-weight:500;padding:0 0 10px">${CONTACT.entity}</td></tr>
      <tr><td style="font-size:13px;color:#444;padding:0 0 2px">${CONTACT.phone} · <a href="mailto:${CONTACT.email}" style="color:#3B0764;text-decoration:none">${CONTACT.email}</a></td></tr>
      ${LOCATIONS_DARK}
    </table>
  </td></tr>
</table>`,
  },
];
};

function CopyButton({ html, label }: { html: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const blob = new Blob([html], { type: "text/html" });
      const textBlob = new Blob([html], { type: "text/plain" });
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": blob,
          "text/plain": textBlob,
        }),
      ]);
      setCopied(true);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      toast.success("HTML copied as text");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      size="sm"
      variant={copied ? "default" : "outline"}
      onClick={handleCopy}
      className="gap-1.5 text-xs"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy HTML"}
    </Button>
  );
}

export default function EmailSignOff() {
  const signoffs = useMemo(() => {
    const logoUrl = new URL(orendaLogoPurple, window.location.origin).href;
    return buildSignoffs(logoUrl);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Email Sign-Off Templates — Orenda NJ</title>
      </Helmet>
      <NJNavbar />

      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, hsl(270,100%,12%) 0%, hsl(270,80%,25%) 50%, hsl(270,60%,40%) 100%)",
        }}
      >
        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 py-8 sm:py-14">
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Email Sign-Off Templates
          </h1>
          <p className="text-sm sm:text-base text-white/70 mt-2 max-w-xl leading-relaxed">
            Branded sign-offs ready to paste into Gmail, Outlook, or any email client. Copy the HTML and paste at the bottom of your emails.
          </p>

          <div className="flex flex-wrap gap-4 mt-5 text-white/80 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{CONTACT.phone}</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{CONTACT.email}</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />NJ Offices</span>
          </div>
        </div>
      </div>

      {/* Sign-off Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {signoffs.map((s) => (
          <div
            key={s.id}
            className="border-2 border-border rounded-xl overflow-hidden bg-card"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
              <h2 className="text-sm font-bold text-foreground">{s.label}</h2>
              <CopyButton html={s.html} label={s.label} />
            </div>
            <div className="p-6 sm:p-8 bg-white">
              <div dangerouslySetInnerHTML={{ __html: s.html }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
