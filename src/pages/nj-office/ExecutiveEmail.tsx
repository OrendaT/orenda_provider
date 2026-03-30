import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Check, Mail, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import logo from "@/assets/orenda-logo-purple.png";

interface BookingRow {
  provider_name: string;
  office_location: string;
  booking_date: string;
  status: string;
  time_block: string;
}

export default function ExecutiveEmail() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("office_bookings")
        .select("provider_name, office_location, booking_date, status, time_block")
        .eq("status", "confirmed")
        .order("booking_date", { ascending: true });
      if (data) setBookings(data);
    };
    load();
  }, []);

  const stats = useMemo(() => {
    const total = bookings.length;
    const hoboken = bookings.filter(b => b.office_location === "hoboken").length;
    const edison = bookings.filter(b => b.office_location === "edison").length;
    const providers = new Set(bookings.map(b => b.provider_name));
    const providerList = Array.from(providers);

    // Provider rankings
    const providerCounts: Record<string, number> = {};
    bookings.forEach(b => { providerCounts[b.provider_name] = (providerCounts[b.provider_name] || 0) + 1; });
    const ranked = Object.entries(providerCounts).sort((a, b) => b[1] - a[1]);

    // Weekday vs weekend
    let weekday = 0, weekend = 0;
    bookings.forEach(b => {
      const day = new Date(b.booking_date + "T12:00:00").getDay();
      (day === 0 || day === 6) ? weekend++ : weekday++;
    });

    // Monthly trend
    const monthly: Record<string, number> = {};
    bookings.forEach(b => {
      const m = new Date(b.booking_date + "T12:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" });
      monthly[m] = (monthly[m] || 0) + 1;
    });

    // Upcoming
    const today = new Date().toISOString().split("T")[0];
    const upcoming = bookings.filter(b => b.booking_date >= today).slice(0, 5);

    return { total, hoboken, edison, providerList, ranked, weekday, weekend, monthly, upcoming };
  }, [bookings]);

  const emailHtml = useMemo(() => {
    const hobokenPct = stats.total > 0 ? Math.round((stats.hoboken / stats.total) * 100) : 0;
    const edisonPct = stats.total > 0 ? Math.round((stats.edison / stats.total) * 100) : 0;
    const weekdayPct = stats.total > 0 ? Math.round((stats.weekday / stats.total) * 100) : 0;

    return `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 680px; margin: 0 auto; background: #ffffff;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #2D1B4E 0%, #6B4FA0 100%); padding: 40px 32px; border-radius: 12px 12px 0 0;">
    <p style="color: rgba(255,255,255,0.6); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 12px;">Orenda Psychiatry</p>
    <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 6px;">NJ Office Operations Update</h1>
    <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 0;">Executive Summary · ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
  </div>

  <!-- Body -->
  <div style="padding: 32px;">
    <p style="font-size: 15px; color: #333; line-height: 1.7; margin: 0 0 20px;">
      Team,
    </p>
    <p style="font-size: 15px; color: #333; line-height: 1.7; margin: 0 0 20px;">
      I'm pleased to share an update on our New Jersey office operations. Our in-person office program continues to grow, 
      reflecting strong provider engagement and increasing demand for physical office space across both locations.
    </p>

    <!-- Key Metrics -->
    <div style="background: #F8F6FB; border-radius: 12px; padding: 24px; margin: 24px 0;">
      <p style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #6B4FA0; font-weight: 700; margin: 0 0 16px;">Key Metrics</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 16px; background: white; border-radius: 8px; text-align: center; width: 33%;">
            <p style="font-size: 28px; font-weight: 800; color: #2D1B4E; margin: 0;">${stats.total}</p>
            <p style="font-size: 12px; color: #666; margin: 4px 0 0;">Total Bookings</p>
          </td>
          <td style="width: 8px;"></td>
          <td style="padding: 12px 16px; background: white; border-radius: 8px; text-align: center; width: 33%;">
            <p style="font-size: 28px; font-weight: 800; color: #2D1B4E; margin: 0;">${stats.providerList.length}</p>
            <p style="font-size: 12px; color: #666; margin: 4px 0 0;">Active Providers</p>
          </td>
          <td style="width: 8px;"></td>
          <td style="padding: 12px 16px; background: white; border-radius: 8px; text-align: center; width: 33%;">
            <p style="font-size: 28px; font-weight: 800; color: #2D1B4E; margin: 0;">2</p>
            <p style="font-size: 12px; color: #666; margin: 4px 0 0;">Office Locations</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- Location Distribution -->
    <h3 style="font-size: 16px; color: #2D1B4E; margin: 28px 0 12px; font-weight: 700;">📍 Location Distribution</h3>
    <p style="font-size: 15px; color: #333; line-height: 1.7; margin: 0 0 8px;">
      Our <strong>Hoboken office</strong> accounts for <strong>${hobokenPct}%</strong> of all bookings (${stats.hoboken} sessions), 
      while <strong>Edison</strong> represents <strong>${edisonPct}%</strong> (${stats.edison} sessions). 
      ${hobokenPct > edisonPct 
        ? "Hoboken continues to be the primary hub, driven by its accessible location and higher provider preference." 
        : "Edison is emerging as a strong complement to our Hoboken presence."}
    </p>

    <!-- Provider Activity -->
    <h3 style="font-size: 16px; color: #2D1B4E; margin: 28px 0 12px; font-weight: 700;">👥 Provider Engagement</h3>
    <p style="font-size: 15px; color: #333; line-height: 1.7; margin: 0 0 12px;">
      We currently have <strong>${stats.providerList.length} active providers</strong> utilizing our office spaces. 
      Here's the provider activity breakdown:
    </p>
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 16px;">
      ${stats.ranked.map(([name, count], i) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px 12px; font-size: 14px; color: #333;"><strong>${i + 1}.</strong> ${name}</td>
        <td style="padding: 10px 12px; font-size: 14px; color: #6B4FA0; font-weight: 700; text-align: right;">${count} bookings</td>
      </tr>`).join("")}
    </table>

    <!-- Weekday vs Weekend -->
    <h3 style="font-size: 16px; color: #2D1B4E; margin: 28px 0 12px; font-weight: 700;">📊 Scheduling Patterns</h3>
    <p style="font-size: 15px; color: #333; line-height: 1.7; margin: 0 0 8px;">
      <strong>${weekdayPct}% of bookings</strong> occur on weekdays (${stats.weekday} sessions), with 
      <strong>${100 - weekdayPct}%</strong> on weekends (${stats.weekend} sessions). 
      ${weekdayPct > 65 
        ? "The strong weekday preference suggests providers are integrating office visits into their regular practice schedule." 
        : weekdayPct < 45 
          ? "Weekend utilization is notably strong, indicating providers value flexible scheduling options." 
          : "The balanced mix of weekday and weekend bookings demonstrates the flexibility our program offers."}
    </p>

    <!-- Monthly Trends -->
    <h3 style="font-size: 16px; color: #2D1B4E; margin: 28px 0 12px; font-weight: 700;">📈 Monthly Trends</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 16px;">
      ${Object.entries(stats.monthly).map(([month, count]) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 8px 12px; font-size: 14px; color: #333;">${month}</td>
        <td style="padding: 8px 12px; font-size: 14px; color: #6B4FA0; font-weight: 700; text-align: right;">${count} bookings</td>
      </tr>`).join("")}
    </table>

    ${stats.upcoming.length > 0 ? `
    <!-- Upcoming -->
    <h3 style="font-size: 16px; color: #2D1B4E; margin: 28px 0 12px; font-weight: 700;">🗓️ Upcoming Bookings</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 0 0 16px;">
      ${stats.upcoming.map(b => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 8px 12px; font-size: 14px; color: #333;">${new Date(b.booking_date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</td>
        <td style="padding: 8px 12px; font-size: 14px; color: #333;">${b.provider_name}</td>
        <td style="padding: 8px 12px; font-size: 13px; color: #6B4FA0; text-transform: capitalize; text-align: right;">${b.office_location}</td>
      </tr>`).join("")}
    </table>
    ` : ""}

    <!-- Outlook -->
    <h3 style="font-size: 16px; color: #2D1B4E; margin: 28px 0 12px; font-weight: 700;">🔮 Looking Ahead</h3>
    <p style="font-size: 15px; color: #333; line-height: 1.7; margin: 0 0 8px;">
      Our NJ office program is building strong momentum. With ${stats.providerList.length} active providers and 
      consistent bookings across both locations, we're establishing a reliable in-person presence that complements 
      our telehealth services. Key priorities going forward include:
    </p>
    <ul style="font-size: 15px; color: #333; line-height: 1.9; padding-left: 20px; margin: 8px 0 20px;">
      <li>Expanding provider participation through streamlined booking tools</li>
      <li>Optimizing scheduling across both locations to maximize space utilization</li>
      <li>Enhancing the patient experience for in-person visits</li>
    </ul>

    <p style="font-size: 15px; color: #333; line-height: 1.7; margin: 24px 0 8px;">
      Please don't hesitate to reach out with any questions or feedback.
    </p>
    <p style="font-size: 15px; color: #333; line-height: 1.7; margin: 0;">
      Best,<br/>
      <strong>Orenda Psychiatry · NJ Operations</strong>
    </p>
  </div>

  <!-- Footer -->
  <div style="background: #F8F6FB; padding: 20px 32px; border-radius: 0 0 12px 12px; text-align: center;">
    <p style="font-size: 11px; color: #999; letter-spacing: 2px; text-transform: uppercase; margin: 0;">Orenda Psychiatry · Confidential</p>
  </div>
</div>`.trim();
  }, [stats]);

  const copyHtml = () => {
    navigator.clipboard.writeText(emailHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const copyPlainText = () => {
    const div = document.createElement("div");
    div.innerHTML = emailHtml;
    navigator.clipboard.writeText(div.innerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, hsl(270, 100%, 12%) 0%, hsl(270, 60%, 30%) 100%)" }}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Link to="/admin-v2" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Admin
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl text-white font-bold tracking-tight">Executive Email Draft</h1>
              <p className="text-base text-white/60 mt-1 font-medium">Ready-to-send business update for the executive team</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Action buttons */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-3">
          <Button onClick={copyHtml} className="gap-2" style={{ background: "linear-gradient(135deg, hsl(270, 100%, 20%) 0%, hsl(270, 80%, 40%) 100%)" }}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Email HTML"}
          </Button>
          <Button onClick={copyPlainText} variant="outline" className="gap-2">
            <Copy className="w-4 h-4" /> Copy Plain Text
          </Button>
        </motion.div>

        {/* Subject line */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4">
          <p className="text-[10px] tracking-[0.15em] uppercase text-primary font-bold mb-1">Suggested Subject Line</p>
          <p className="text-sm font-semibold text-foreground">
            NJ Office Operations Update — {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} | {stats.total} Total Bookings, {stats.providerList.length} Active Providers
          </p>
        </motion.div>

        {/* Email preview */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border-2 border-border bg-white shadow-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-secondary/20 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/40" />
              <div className="w-3 h-3 rounded-full bg-amber-400/60" />
              <div className="w-3 h-3 rounded-full bg-[hsl(160,60%,50%)]/60" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Email Preview</p>
          </div>
          <div className="p-6" dangerouslySetInnerHTML={{ __html: emailHtml }} />
        </motion.div>
      </div>
    </div>
  );
}
