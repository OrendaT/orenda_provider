import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, MessageSquare, Send, Bell, Copy, Check, Edit3, Eye, ChevronDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

function linkifyText(text: string): string {
  const links: string[] = [];
  let processed = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_match, label, url) => {
    const idx = links.length;
    links.push(`<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary underline font-medium hover:text-primary/80">${label}</a>`);
    return `__LINK_PLACEHOLDER_${idx}__`;
  });

  processed = processed
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">$1</a>')
    .replace(/(?<!\/)(?<!")(www\.[^\s]+)/g, '<a href="https://$1" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">$1</a>')
    .replace(/([\w.-]+@[\w.-]+\.\w+)/g, '<a href="mailto:$1" class="text-primary underline hover:text-primary/80">$1</a>');

  links.forEach((html, idx) => {
    processed = processed.replace(`__LINK_PLACEHOLDER_${idx}__`, html);
  });

  return processed;
}

type OfficeLocation = "hoboken" | "edison";

const officeData = {
  hoboken: {
    label: "Hoboken",
    address: "221 River St, 9th Floor, Suite 9076, Hoboken, NJ 07030",
    shortAddress: "221 River St, 9th Fl, Suite 9076, Hoboken",
    googleMaps: "https://maps.google.com/?q=221+River+St+Hoboken+NJ+07030",
    directions: "Enter the building at 221 River Street. We're located right next to Wonder Cafe. Take the elevator to the 9th Floor, Suite 9076.",
    smsDirections: "📍 Directions: Enter 221 River St (next to Wonder Cafe). Take the elevator to the 9th floor, Suite 9076.",
    afterHours: "🔔 After 5 PM: Ring the doorbell on the RIGHT side of the building entrance for security access.",
  },
  edison: {
    label: "Edison",
    address: "110 Fieldcrest Ave, 3rd Floor, Unit 328, Edison, NJ 08837",
    shortAddress: "110 Fieldcrest Ave, 3rd Fl, Unit 328, Edison",
    googleMaps: "https://maps.google.com/?q=110+Fieldcrest+Ave+Edison+NJ+08837",
    directions: "Enter the building at 110 Fieldcrest Avenue. Take the elevator to the 3rd Floor, Unit 328.",
    smsDirections: "📍 Directions: Enter 110 Fieldcrest Ave. Take the elevator to the 3rd floor, Unit 328.",
    afterHours: "🔔 After hours: Ring the doorbell on the RIGHT side of the building entrance for security access.",
  },
};

const publishedBase = "https://orenda-njoffice-guide.lovable.app";
const checkInFullUrl = `${publishedBase}/patient/book-visit`;
const officeInfoFullUrl = `${publishedBase}/patient/book-visit`;

interface TemplateConfig {
  id: string;
  label: string;
  icon: typeof Mail;
  category: "email" | "sms";
  description: string;
  subjectDefault: string;
  bodyDefault: string;
  smsDefault?: string;
  gradient: string;
}

function getDefaultTemplates(loc: OfficeLocation): TemplateConfig[] {
  const od = officeData[loc];
  return [
    {
      id: "confirmation",
      label: "Appointment Confirmation",
      icon: Check,
      category: "email",
      description: "Sent immediately after booking",
      gradient: "linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 40%) 100%)",
      subjectDefault: "Your Appointment is Confirmed — Orenda Psychiatry",
      bodyDefault: `Hi Susie,

Your appointment has been confirmed! Here are your visit details:

📅 Date: Wednesday, April 2, 2025
🕐 Time: 10:00 AM — 10:30 AM
👨‍⚕️ Provider: Teddy Schimenti
📍 Location: ${od.address}

📋 Before Your Visit:
• Please arrive 15 minutes before your appointment

📍 Getting There:
${od.directions}

[Google Maps](${od.googleMaps})

[Check in when you arrive](${checkInFullUrl})

🔔 AFTER-HOURS ACCESS: If arriving after 5 PM, ring the doorbell on the RIGHT side of the building entrance.

Questions? Contact Orenda Admin Team
📞 (347) 707-7735 · ✉️ admin@orendapsych.com`,
      smsDefault: `✅ Orenda Psychiatry — Appointment Confirmed

📅 Wednesday, April 2, 2025
🕐 10:00 AM — 10:30 AM
👨‍⚕️ Teddy Schimenti
📍 ${od.shortAddress}

🪪 What to bring: Valid photo ID
⏰ Please arrive 15 minutes early

${od.smsDirections}
${od.afterHours}

[Check in when you arrive](${checkInFullUrl})
[Google Maps](${od.googleMaps})

Questions? 📞 (347) 707-7735`,
    },
    {
      id: "reminder",
      label: "Appointment Reminder",
      icon: Bell,
      category: "email",
      description: "Sent 24 hours before appointment",
      gradient: "linear-gradient(135deg, hsl(220, 90%, 20%) 0%, hsl(220, 70%, 45%) 100%)",
      subjectDefault: "Reminder: Your Appointment is Tomorrow — Orenda Psychiatry",
      bodyDefault: `Hi Susie,

This is a friendly reminder that your appointment is tomorrow. We look forward to seeing you!

📅 Date: Wednesday, April 2, 2025
🕐 Time: 10:00 AM — 10:30 AM
👨‍⚕️ Provider: Teddy Schimenti
📍 Location: ${od.address}

[Check in when you arrive](${checkInFullUrl})

📍 Getting There:
${od.directions}

[Google Maps](${od.googleMaps})

🔔 AFTER-HOURS ACCESS: If arriving after 5 PM, ring the doorbell on the RIGHT side of the building entrance.

📋 Don't Forget:
• Please arrive 15 minutes early

Questions? Contact Orenda Admin Team
📞 (347) 707-7735 · ✉️ admin@orendapsych.com`,
      smsDefault: `⏰ Orenda Psychiatry — Reminder

Your appointment is TOMORROW:

📅 Wednesday, April 2, 2025
🕐 10:00 AM — 10:30 AM
👨‍⚕️ Teddy Schimenti
📍 ${od.shortAddress}

🪪 What to bring: Valid photo ID
⏰ Please arrive 15 minutes early

${od.smsDirections}
${od.afterHours}

[Check in when you arrive](${checkInFullUrl})
[Google Maps](${od.googleMaps})

Questions? 📞 (347) 707-7735`,
    },
    {
      id: "dayof",
      label: "Day of Visit",
      icon: Send,
      category: "email",
      description: "Sent the morning of the appointment",
      gradient: "linear-gradient(135deg, hsl(160, 70%, 20%) 0%, hsl(160, 60%, 40%) 100%)",
      subjectDefault: "Your Visit Is Today — Orenda Psychiatry",
      bodyDefault: `Hi Susie,

Your appointment with Teddy Schimenti is today! We're looking forward to seeing you.

🕐 Time: 10:00 AM — 10:30 AM
👨‍⚕️ Provider: Teddy Schimenti
📍 Location: ${od.address}

[Check in when you arrive](${checkInFullUrl})

📍 Getting There:
${od.directions}

[Google Maps](${od.googleMaps})

🔔 AFTER-HOURS ACCESS: If arriving after 5 PM, ring the doorbell on the RIGHT side of the building entrance.

📋 Reminders:
• Please arrive 15 minutes early

Questions? Contact Orenda Admin Team
📞 (347) 707-7735 · ✉️ admin@orendapsych.com`,
      smsDefault: `🏥 Orenda Psychiatry — Today's Visit

Your appointment is TODAY:

🕐 10:00 AM — 10:30 AM
👨‍⚕️ Teddy Schimenti
📍 ${od.shortAddress}

🪪 What to bring: Valid photo ID
⏰ Please arrive 15 minutes early

${od.smsDirections}
${od.afterHours}

[Check in when you arrive](${checkInFullUrl})
[Google Maps](${od.googleMaps})

Questions? 📞 (347) 707-7735`,
    },
    {
      id: "followup",
      label: "Follow-Up Booking",
      icon: MessageSquare,
      category: "email",
      description: "Sent 24 hours after the appointment",
      gradient: "linear-gradient(135deg, hsl(30, 90%, 20%) 0%, hsl(30, 80%, 45%) 100%)",
      subjectDefault: "Schedule Your Follow-Up — Orenda Psychiatry",
      bodyDefault: `Hi Susie,

Thank you for visiting us! Please schedule your next follow-up with Teddy Schimenti.

📞 To Schedule Your Follow-Up:
Please call our office or send us an email to book your next appointment.

📞 (347) 707-7735
✉️ admin@orendapsych.com

⚠️ 90-Day In-Person Visit Requirement:
Please note that patients receiving Schedule II prescriptions in the state of New Jersey are required to be seen at least every 90 days for in-person checkups.

Your next in-person visit is due by July 1, 2025.

🌐 www.orendapsych.com`,
      smsDefault: `💜 Orenda Psychiatry — Follow-Up Reminder

Hi Susie, thank you for your visit with Teddy Schimenti!

📞 Please schedule your next follow-up:
Call: (347) 707-7735
Email: admin@orendapsych.com

⚠️ Your next in-person visit is due by July 1, 2025.

🌐 www.orendapsych.com`,
    },
    {
      id: "inperson90",
      label: "90-Day In-Person Reminder",
      icon: Bell,
      category: "email",
      description: "Sent when 90-day in-person visit is approaching",
      gradient: "linear-gradient(135deg, hsl(0, 70%, 25%) 0%, hsl(0, 60%, 45%) 100%)",
      subjectDefault: "In-Person Visit Due — Orenda Psychiatry",
      bodyDefault: `Hi Susie,

Please schedule your next follow-up with Teddy Schimenti. 

Please note that 90 days after your last visit on April 2, 2025, patients receiving Schedule II prescriptions in the state of New Jersey are required to be seen at least every 90 days for in-person checkups.

⚠️ In-Person Visit Required
Your in-person visit is due by July 1, 2025.

📞 Contact Us to Schedule:
📞 (347) 707-7735
✉️ admin@orendapsych.com

📍 Office Locations:
Hoboken: 221 River St, 9th Floor, Suite 9076, Hoboken, NJ 07030
Edison: 110 Fieldcrest Ave, 3rd Floor, Unit 328, Edison, NJ 08837

[ℹ️ View Office Arrival Info](${officeInfoFullUrl})

🌐 www.orendapsych.com`,
      smsDefault: `💜 Orenda Psychiatry — In-Person Visit Required

Hi Susie, please schedule your next follow-up with Teddy Schimenti.

Your in-person visit is due by July 1, 2025.

📞 (347) 707-7735
✉️ admin@orendapsych.com

📍 Hoboken: 221 River St, 9th Fl
📍 Edison: 110 Fieldcrest Ave, 3rd Fl

🌐 www.orendapsych.com`,
    },
  ];
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border bg-secondary border-border text-foreground hover:bg-primary/10 hover:border-primary/30">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

export default function AdminV2Communication() {
  const [location, setLocation] = useState<OfficeLocation>("hoboken");
  const [templates, setTemplates] = useState(() => getDefaultTemplates("hoboken"));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editSms, setEditSms] = useState("");
  const [viewTab, setViewTab] = useState<"email" | "sms">("email");

  const handleLocationChange = (loc: OfficeLocation) => {
    setLocation(loc);
    // Reset to defaults for new location, preserving any edits user hasn't saved
    setTemplates(getDefaultTemplates(loc));
    setEditingId(null);
  };

  const startEdit = (t: TemplateConfig) => {
    setEditingId(t.id);
    setEditSubject(t.subjectDefault);
    setEditBody(t.bodyDefault);
    setEditSms(t.smsDefault || "");
  };

  const saveEdit = () => {
    if (!editingId) return;
    setTemplates(prev => prev.map(t =>
      t.id === editingId ? { ...t, subjectDefault: editSubject, bodyDefault: editBody, smsDefault: editSms } : t
    ));
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(220, 90%, 12%) 0%, hsl(220, 80%, 25%) 50%, hsl(220, 60%, 40%) 100%)' }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-comm" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-comm)" />
        </svg>
        <div className="relative max-w-5xl mx-auto px-6 py-8 sm:py-12">
          <Link to="/admin-v2" className="inline-flex items-center gap-2 text-xs text-white/50 font-bold uppercase tracking-wider hover:text-white/80 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Console
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">Communication</h1>
              <p className="text-base text-white/60 mt-2 font-medium">Editable patient email & SMS templates. Click any template to customize.</p>
            </div>
            <div className="flex gap-2">
              {(["hoboken", "edison"] as OfficeLocation[]).map(loc => (
                <button key={loc} onClick={() => handleLocationChange(loc)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${location === loc ? "bg-white text-foreground shadow" : "bg-white/10 text-white/70 hover:bg-white/20"}`}>
                  {officeData[loc].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {templates.map((t, i) => {
          const isEditing = editingId === t.id;

          return (
            <motion.div key={t.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-2xl border-2 border-border bg-card overflow-hidden">
              {/* Header bar */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: t.gradient }}>
                    <t.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{t.label}</h3>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <>
                      <CopyButton text={viewTab === "sms" ? (t.smsDefault || "") : t.bodyDefault} label={viewTab === "sms" ? "Copy SMS" : "Copy Email"} />
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => startEdit(t)}>
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" className="text-xs" onClick={cancelEdit}>Cancel</Button>
                      <Button size="sm" className="text-xs gap-1.5" onClick={saveEdit}>
                        <Check className="w-3.5 h-3.5" /> Save
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Tabs: Email / SMS */}
              <div className="px-5 pt-3">
                <div className="flex gap-1 bg-muted/50 rounded-lg p-1 w-fit">
                  <button onClick={() => setViewTab("email")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewTab === "email" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                    <Mail className="w-3.5 h-3.5 inline mr-1.5" />Email
                  </button>
                  <button onClick={() => setViewTab("sms")}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewTab === "sms" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                    <MessageSquare className="w-3.5 h-3.5 inline mr-1.5" />SMS
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                {isEditing ? (
                  <div className="space-y-4">
                    {viewTab === "email" ? (
                      <>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Subject Line</label>
                          <input
                            value={editSubject}
                            onChange={(e) => setEditSubject(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1 block">Email Body</label>
                          <textarea
                            value={editBody}
                            onChange={(e) => setEditBody(e.target.value)}
                            rows={14}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1 block">SMS Text</label>
                        <textarea
                          value={editSms}
                          onChange={(e) => setEditSms(e.target.value)}
                          rows={10}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {viewTab === "email" ? (
                      <>
                        <div className="mb-3 px-4 py-2.5 bg-muted/30 rounded-xl border border-border">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mr-2">Subject:</span>
                          <span className="text-sm font-medium text-foreground">{t.subjectDefault}</span>
                        </div>
                        <div className="px-4 py-4 bg-muted/10 rounded-xl border border-border">
                          <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: linkifyText(t.bodyDefault) }} />
                        </div>
                      </>
                    ) : (
                      <div className="max-w-sm mx-auto">
                        <div className="rounded-2xl border-2 border-border bg-muted/20 p-1">
                          <div className="bg-muted/40 rounded-t-xl px-4 py-2 flex items-center gap-2 border-b border-border">
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-primary">O</span>
                            </div>
                            <span className="text-xs font-semibold text-foreground">Orenda Psychiatry</span>
                          </div>
                          <div className="p-4">
                            <div className="bg-primary/5 rounded-2xl rounded-tl-sm px-4 py-3 border border-primary/10">
                              <pre className="text-xs text-foreground whitespace-pre-wrap font-sans leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: linkifyText(t.smsDefault || "") }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
