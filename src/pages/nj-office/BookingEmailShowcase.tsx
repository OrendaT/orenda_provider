import { useState } from "react";
import { Link } from "react-router-dom";
import NJNavbar from "@/components/NJNavbar";
import NJFooter from "@/components/NJFooter";
import { ArrowLeft, Copy, Check, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

type LocationKey = "hoboken" | "edison";

const LOCATION_DETAILS: Record<LocationKey, {
  name: string; address: string; city: string; regusPhone: string; regusEmail: string;
  wifi: { network: string; password: string }; directions: string; landmark: string;
  parking: string; afterHours: string; lockboxCode: string; footerAddress: string;
}> = {
  hoboken: {
    name: "Hoboken",
    address: "221 River Street, 9th Floor, Unit 9076",
    city: "Hoboken, NJ 07030",
    regusPhone: "(201) 484-7855",
    regusEmail: "Hoboken.RiverSt@regus.com",
    wifi: { network: "Regus Net Wi-Fi", password: "167845630" },
    directions: "Enter the building lobby at 221 River Street (next to Wonder Cafe), take elevators to the 9th floor.",
    landmark: "Look for Wonder Cafe — the building entrance is directly next to it.",
    parking: "Street parking and nearby garages available. NJ Transit Hoboken Terminal is a short walk away.",
    afterHours: "Both providers and patients must ring the doorbell on the right-hand side of the entrance. Security is on-site 24/7.",
    lockboxCode: "0000",
    footerAddress: "221 River Street, 9th Floor, Unit 9076, Hoboken, NJ 07030",
  },
  edison: {
    name: "Edison",
    address: "110 Fieldcrest Avenue, 3rd Floor, Unit 328",
    city: "Edison, NJ 08837",
    regusPhone: "(732) 782-0328",
    regusEmail: "Edison.Fieldcrest@regus.com",
    wifi: { network: "Orendapsych", password: "167785439" },
    directions: "Enter through the main entrance during business hours (Mon–Fri, 8 AM – 6 PM). Take the elevator to the 3rd floor.",
    landmark: "Located near Route 287 and NJ Turnpike.",
    parking: "Free parking available on-site.",
    afterHours: "Both providers and patients must use the P1 Parking Level entrance, the entrance is around the back of the building. Access code: 05296.",
    lockboxCode: "0000",
    footerAddress: "110 Fieldcrest Avenue, 3rd Floor, Unit 328, Edison, NJ 08837",
  },
};

const TIME_LABELS: Record<string, string> = {
  morning: "Morning (9:00 AM – 3:00 PM)",
  afternoon: "Afternoon (3:00 PM – 9:00 PM)",
  full_day: "Full Day (9:00 AM – 9:00 PM)",
};

const swipeCardMailto = "mailto:offices@orendapsych.com?subject=Swipe%20Card%20Setup%20Request&body=Hi%20NJ%20Admin%20Team%2C%0A%0AI%20would%20like%20to%20be%20set%20up%20with%20a%20permanent%20swipe%20card%20for%20after-hours%20access.%0A%0AThank%20you!";

// ─── VERSION A: Executive ────────────────────────────────────────────────────
function generateExecutiveEmail(loc: typeof LOCATION_DETAILS.hoboken, locationKey: LocationKey, providerName: string, bookingDate: string, timeBlock: string) {
  const timeLabel = TIME_LABELS[timeBlock] || timeBlock;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f1f9;font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1f9;padding:32px 16px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(89,61,120,0.12);">
  <tr><td style="background:linear-gradient(135deg,#593D78 0%,#7B5EA7 50%,#9B7EC8 100%);padding:40px;text-align:center;">
    <p style="color:#d4c5e6;font-size:11px;text-transform:uppercase;letter-spacing:3px;margin:0 0 8px;">✓ Booking Confirmed</p>
    <h1 style="color:#fff;font-size:28px;font-weight:700;margin:0 0 8px;font-family:Georgia,serif;">${loc.name} Office</h1>
    <p style="color:#fff;font-size:16px;margin:0;opacity:0.95;">${bookingDate || "[Date]"} · ${timeLabel}</p>
  </td></tr>

  <tr><td style="padding:32px 40px 16px;">
    <p style="color:#2d2d2d;font-size:16px;line-height:1.7;margin:0;font-family:Georgia,serif;">Dear <strong>${providerName || "[Provider]"}</strong>,</p>
    <p style="color:#2d2d2d;font-size:16px;line-height:1.7;margin:12px 0 0;font-family:Georgia,serif;">Thank you for booking your in-person office day. Here's everything you need for a smooth visit.</p>
  </td></tr>

  <!-- Details -->
  <tr><td style="padding:0 40px 20px;">
    <table role="presentation" width="100%" style="background:#f9f7fc;border-radius:12px;border-left:4px solid #593D78;"><tr><td style="padding:20px 24px;">
      <p style="color:#593D78;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 14px;">📋 Booking Details</p>
      <table role="presentation" width="100%">
        <tr><td style="color:#8E9196;font-size:13px;padding:5px 0;width:110px;">Date</td><td style="color:#2d2d2d;font-size:14px;padding:5px 0;font-weight:600;">${bookingDate || "TBD"}</td></tr>
        <tr><td style="color:#8E9196;font-size:13px;padding:5px 0;">Time Block</td><td style="color:#2d2d2d;font-size:14px;padding:5px 0;font-weight:600;">${timeLabel}</td></tr>
        <tr><td style="color:#8E9196;font-size:13px;padding:5px 0;">Location</td><td style="color:#2d2d2d;font-size:14px;padding:5px 0;font-weight:600;">${loc.name}</td></tr>
        <tr><td style="color:#8E9196;font-size:13px;padding:5px 0;">Address</td><td style="color:#2d2d2d;font-size:14px;padding:5px 0;font-weight:600;">${loc.address}</td></tr>
      </table>
    </td></tr></table>
  </td></tr>

  <!-- Directions -->
  <tr><td style="padding:0 40px 12px;">
    <table role="presentation" width="100%" style="background:#f9f7fc;border:1px solid #e8e0f0;border-radius:12px;"><tr><td style="padding:18px 22px;">
      <p style="color:#593D78;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">🚶 Getting There</p>
      <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0 0 4px;">${loc.directions}</p>
      <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0 0 4px;"><strong>Landmark:</strong> ${loc.landmark}</p>
      <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0;"><strong>Parking:</strong> ${loc.parking}</p>
    </td></tr></table>
  </td></tr>

  <!-- Office Access -->
  <tr><td style="padding:0 40px 12px;">
    <table role="presentation" width="100%" style="background:#fff8f0;border:1px solid #f0d4a8;border-radius:12px;"><tr><td style="padding:18px 22px;">
      <p style="color:#B06A2F;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">🔑 Office Access</p>
      <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0 0 6px;"><strong>Regus Office Hours:</strong> Mon–Fri, 9:00 AM – 5:00 PM</p>
      <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0 0 6px;">During Regus hours, access the office key and swipe card from the lockbox outside the Orenda office door. <strong>Lockbox code: ${loc.lockboxCode}</strong>. Please return both items when finished.</p>
      <p style="color:#B06A2F;font-size:13px;line-height:1.6;margin:0 0 10px;font-weight:600;">⚠️ If attending the office outside of Regus hours, make sure you are set up with a permanent swipe card. You can coordinate this through the NJ Admin Team.</p>
      <table role="presentation"><tr><td>
        <a href="${swipeCardMailto}" style="background:#593D78;color:#fff;border-radius:8px;padding:10px 20px;font-size:13px;font-weight:600;text-decoration:none;display:inline-block;">📧 Email NJ Admin for Swipe Card Setup</a>
      </td></tr></table>
    </td></tr></table>
  </td></tr>

  <!-- Patient Check-In -->
  <tr><td style="padding:0 40px 12px;">
    <table role="presentation" width="100%" style="background:#f9f7fc;border:1px solid #e8e0f0;border-radius:12px;"><tr><td style="padding:18px 22px;">
      <p style="color:#593D78;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">📋 Patient Check-In</p>
      <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0 0 6px;"><strong>Outside of Regus office hours:</strong> Please place the <strong>Orenda Patient Welcome &amp; Check-In sign</strong> by the entrance so that patients can text the NJ team upon arrival.</p>
      <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0 0 4px;">✓ You'll receive a notification when your patient has checked in</p>
      <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0;">✓ Patient schedules will be circulated by the NJ admin team the night before</p>
    </td></tr></table>
  </td></tr>

  <!-- Wi-Fi -->
  <tr><td style="padding:0 40px 20px;">
    <table role="presentation" width="100%" style="background:#f0f7f4;border:1px solid #c8e6d5;border-radius:12px;"><tr><td style="padding:18px 22px;">
      <p style="color:#2E7D4F;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">📶 Wi-Fi & Amenities</p>
      <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0 0 3px;"><strong>Network:</strong> ${loc.wifi.network}</p>
      <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0 0 3px;"><strong>Password:</strong> ${loc.wifi.password}</p>
      <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0;"><strong>Amenities:</strong> Patient seating, weight scale, blood pressure cuff</p>
    </td></tr></table>
  </td></tr>

  <!-- Contacts -->
  <tr><td style="padding:0 40px 28px;">
    <table role="presentation" width="100%"><tr>
      <td width="48%" valign="top" style="background:#f4f1f9;border-radius:10px;padding:14px;">
        <p style="color:#593D78;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Orenda NJ Admin</p>
        <p style="color:#2d2d2d;font-size:13px;margin:0 0 2px;">📞 (201) 685-4863</p>
        <p style="color:#2d2d2d;font-size:13px;margin:0;">✉️ offices@orendapsych.com</p>
      </td>
      <td width="4%">&nbsp;</td>
      <td width="48%" valign="top" style="background:#faf9f5;border-radius:10px;padding:14px;">
        <p style="color:#8B7335;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">Regus ${loc.name}</p>
        <p style="color:#2d2d2d;font-size:13px;margin:0 0 2px;">📞 ${loc.regusPhone}</p>
        <p style="color:#2d2d2d;font-size:13px;margin:0;">✉️ ${loc.regusEmail}</p>
      </td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:0 40px 32px;">
    <p style="color:#2d2d2d;font-size:15px;line-height:1.7;margin:0 0 8px;">We look forward to seeing you!</p>
    <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0;">Warm regards,<br/><strong>The New Jersey Admin Team</strong><br/><span style="color:#8E9196;font-size:12px;">201-685-4863 · offices@orendapsych.com</span></p>
  </td></tr>

  <tr><td style="background:#593D78;padding:16px 40px;text-align:center;">
    <p style="color:#d4c5e6;font-size:11px;margin:0;">Orenda Psychiatry, PLLC · ${loc.footerAddress}</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

// ─── VERSION B: Minimal Clean ────────────────────────────────────────────────
function generateMinimalEmail(loc: typeof LOCATION_DETAILS.hoboken, locationKey: LocationKey, providerName: string, bookingDate: string, timeBlock: string) {
  const timeLabel = TIME_LABELS[timeBlock] || timeBlock;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff;padding:40px 16px;"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#fff;">
  <tr><td style="padding:0 0 32px;border-bottom:3px solid #593D78;">
    <p style="color:#593D78;font-size:11px;text-transform:uppercase;letter-spacing:3px;margin:0 0 6px;font-weight:700;">Orenda Psychiatry</p>
    <h1 style="color:#2d2d2d;font-size:26px;font-weight:700;margin:0 0 6px;">Booking Confirmed</h1>
    <p style="color:#8E9196;font-size:15px;margin:0;">${loc.name} · ${bookingDate || "[Date]"} · ${timeLabel}</p>
  </td></tr>

  <tr><td style="padding:28px 0;">
    <p style="color:#2d2d2d;font-size:15px;line-height:1.8;margin:0 0 24px;">Hi <strong>${providerName || "[Provider]"}</strong>, you're all set! Below are the details for your upcoming office day.</p>

    <table role="presentation" width="100%" style="margin:0 0 24px;border-collapse:collapse;">
      <tr><td style="color:#593D78;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:0 0 10px;border-bottom:1px solid #e8e0f0;" colspan="2">Details</td></tr>
      <tr><td style="color:#8E9196;font-size:13px;padding:10px 0 6px;width:100px;">Date</td><td style="color:#2d2d2d;font-size:14px;padding:10px 0 6px;font-weight:600;">${bookingDate || "TBD"}</td></tr>
      <tr><td style="color:#8E9196;font-size:13px;padding:6px 0;">Time</td><td style="color:#2d2d2d;font-size:14px;padding:6px 0;font-weight:600;">${timeLabel}</td></tr>
      <tr><td style="color:#8E9196;font-size:13px;padding:6px 0;">Address</td><td style="color:#2d2d2d;font-size:14px;padding:6px 0;font-weight:600;">${loc.address}<br/>${loc.city}</td></tr>
    </table>

    <table role="presentation" width="100%" style="margin:0 0 20px;border-collapse:collapse;">
      <tr><td style="color:#593D78;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:0 0 10px;border-bottom:1px solid #e8e0f0;">Directions & Parking</td></tr>
      <tr><td style="padding:10px 0;color:#2d2d2d;font-size:13px;line-height:1.7;">${loc.directions}<br/><strong>Landmark:</strong> ${loc.landmark}<br/><strong>Parking:</strong> ${loc.parking}</td></tr>
    </table>

    <table role="presentation" width="100%" style="margin:0 0 20px;border-collapse:collapse;">
      <tr><td style="color:#B06A2F;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:0 0 10px;border-bottom:1px solid #f0d4a8;">Office Access</td></tr>
      <tr><td style="padding:10px 0;color:#2d2d2d;font-size:13px;line-height:1.7;">
        <strong>Regus Office Hours:</strong> Mon–Fri, 9:00 AM – 5:00 PM<br/><br/>
        During these hours, access the office key and swipe card from the lockbox outside the Orenda office door. <strong>Lockbox code: ${loc.lockboxCode}</strong>. Return items when finished.<br/><br/>
        <span style="color:#B06A2F;font-weight:600;">⚠️ If attending outside of Regus hours, make sure you are set up with a permanent swipe card. Coordinate through the NJ Admin Team.</span>
      </td></tr>
      <tr><td style="padding:6px 0 0;">
        <a href="${swipeCardMailto}" style="background:#593D78;color:#fff;border-radius:8px;padding:10px 20px;font-size:13px;font-weight:600;text-decoration:none;display:inline-block;">📧 Email NJ Admin for Swipe Card Setup</a>
      </td></tr>
    </table>

    <table role="presentation" width="100%" style="margin:16px 0 20px;border-collapse:collapse;">
      <tr><td style="color:#593D78;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:0 0 10px;border-bottom:1px solid #e8e0f0;">Patient Check-In</td></tr>
      <tr><td style="padding:10px 0;color:#2d2d2d;font-size:13px;line-height:1.7;">
        <strong>Outside of Regus office hours:</strong> Please place the <strong>Orenda Patient Welcome & Check-In sign</strong> by the entrance so that patients can text the NJ team upon arrival.<br/>
        ✓ Notification on patient arrival · ✓ Schedule sent night before
      </td></tr>
    </table>

    <table role="presentation" width="100%" style="margin:0 0 20px;border-collapse:collapse;">
      <tr><td style="color:#2E7D4F;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:0 0 10px;border-bottom:1px solid #c8e6d5;">Wi-Fi</td></tr>
      <tr><td style="padding:10px 0;color:#2d2d2d;font-size:13px;line-height:1.7;">Network: <strong>${loc.wifi.network}</strong> · Password: <strong>${loc.wifi.password}</strong></td></tr>
    </table>

    <table role="presentation" width="100%" style="margin:0 0 24px;border-collapse:collapse;">
      <tr><td style="color:#593D78;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:0 0 10px;border-bottom:1px solid #e8e0f0;" colspan="2">Contacts</td></tr>
      <tr>
        <td style="padding:10px 10px 0 0;color:#2d2d2d;font-size:13px;line-height:1.6;vertical-align:top;"><strong>NJ Admin:</strong><br/>(201) 685-4863<br/>offices@orendapsych.com</td>
        <td style="padding:10px 0 0;color:#2d2d2d;font-size:13px;line-height:1.6;vertical-align:top;"><strong>Regus ${loc.name}:</strong><br/>${loc.regusPhone}<br/>${loc.regusEmail}</td>
      </tr>
    </table>

    <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0;">Warm regards,<br/><strong>The New Jersey Admin Team</strong></p>
  </td></tr>

  <tr><td style="border-top:3px solid #593D78;padding:20px 0 0;">
    <p style="color:#8E9196;font-size:11px;margin:0;">Orenda Psychiatry, PLLC · ${loc.footerAddress}</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

// ─── VERSION C: Card Style ───────────────────────────────────────────────────
function generateCardEmail(loc: typeof LOCATION_DETAILS.hoboken, locationKey: LocationKey, providerName: string, bookingDate: string, timeBlock: string) {
  const timeLabel = TIME_LABELS[timeBlock] || timeBlock;
  const card = (bg: string, border: string, titleColor: string, title: string, content: string) =>
    `<tr><td style="padding:0 32px 12px;"><table role="presentation" width="100%" style="background:${bg};border:1px solid ${border};border-radius:14px;"><tr><td style="padding:18px 22px;">
      <p style="color:${titleColor};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;margin:0 0 10px;font-family:Georgia,serif;">${title}</p>
      ${content}
    </td></tr></table></td></tr>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f1f9;font-family:Georgia,'Times New Roman',serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1f9;padding:32px 16px;"><tr><td align="center">
<table role="presentation" width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(89,61,120,0.1);">

  <tr><td style="background:#593D78;padding:36px 32px;text-align:center;">
    <table role="presentation" width="100%"><tr><td align="center">
      <table role="presentation" style="background:rgba(255,255,255,0.15);border-radius:50px;padding:6px 20px;"><tr><td>
        <p style="color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0;font-weight:600;">✓ Confirmed</p>
      </td></tr></table>
    </td></tr></table>
    <h1 style="color:#fff;font-size:26px;font-weight:700;margin:16px 0 6px;">${loc.name} Office</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:16px;margin:0;">${bookingDate || "[Date]"}</p>
    <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:4px 0 0;">${timeLabel}</p>
  </td></tr>

  <tr><td style="padding:28px 32px 16px;">
    <p style="color:#2d2d2d;font-size:16px;line-height:1.7;margin:0;">Hi <strong>${providerName || "[Provider]"}</strong>, you're all set for your office day! Here's your complete briefing:</p>
  </td></tr>

  ${card("#f9f7fc", "#e8e0f0", "#593D78", "📋 Your Booking", `
    <table role="presentation" width="100%">
      <tr><td style="color:#8E9196;font-size:12px;padding:4px 0;width:90px;">Date</td><td style="color:#2d2d2d;font-size:14px;padding:4px 0;font-weight:600;">${bookingDate || "TBD"}</td></tr>
      <tr><td style="color:#8E9196;font-size:12px;padding:4px 0;">Time</td><td style="color:#2d2d2d;font-size:14px;padding:4px 0;font-weight:600;">${timeLabel}</td></tr>
      <tr><td style="color:#8E9196;font-size:12px;padding:4px 0;">Address</td><td style="color:#2d2d2d;font-size:14px;padding:4px 0;font-weight:600;">${loc.address}<br/>${loc.city}</td></tr>
    </table>`)}

  ${card("#f9f7fc", "#e8e0f0", "#593D78", "🚶 Getting There", `
    <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0 0 4px;">${loc.directions}</p>
    <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0 0 4px;"><strong>Landmark:</strong> ${loc.landmark}</p>
    <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0;"><strong>Parking:</strong> ${loc.parking}</p>`)}

  ${card("#fff8f0", "#f0d4a8", "#B06A2F", "🔑 Office Access", `
    <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0 0 6px;"><strong>Regus Office Hours:</strong> Mon–Fri, 9:00 AM – 5:00 PM</p>
    <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0 0 6px;">During these hours, access the office key and swipe card from the lockbox outside the Orenda office door. <strong>Lockbox code: ${loc.lockboxCode}</strong>. Return items when finished.</p>
    <p style="color:#B06A2F;font-size:13px;line-height:1.6;margin:0 0 10px;font-weight:600;">⚠️ If attending outside of Regus hours, make sure you are set up with a permanent swipe card. Coordinate through the NJ Admin Team.</p>
    <table role="presentation"><tr><td>
      <a href="${swipeCardMailto}" style="background:#593D78;color:#fff;border-radius:8px;padding:10px 20px;font-size:13px;font-weight:600;text-decoration:none;display:inline-block;">📧 Email NJ Admin for Swipe Card Setup</a>
    </td></tr></table>`)}

  ${card("#f9f7fc", "#e8e0f0", "#593D78", "📋 Patient Check-In", `
    <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0 0 6px;"><strong>Outside of Regus office hours:</strong> Please place the <strong>Orenda Patient Welcome &amp; Check-In sign</strong> by the entrance so that patients can text the NJ team upon arrival.</p>
    <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0;">✓ Notification on patient arrival · ✓ Schedule sent night before</p>`)}

  ${card("#f0f7f4", "#c8e6d5", "#2E7D4F", "📶 Wi-Fi & Amenities", `
    <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:0;"><strong>Network:</strong> ${loc.wifi.network} · <strong>Password:</strong> ${loc.wifi.password}</p>
    <p style="color:#2d2d2d;font-size:13px;line-height:1.6;margin:4px 0 0;"><strong>Amenities:</strong> Patient seating, weight scale, blood pressure cuff</p>`)}

  <!-- Contacts -->
  <tr><td style="padding:8px 32px 24px;">
    <table role="presentation" width="100%"><tr>
      <td width="48%" valign="top" style="background:#f4f1f9;border-radius:12px;padding:16px;">
        <p style="color:#593D78;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">NJ Admin Team</p>
        <p style="color:#2d2d2d;font-size:13px;margin:0 0 2px;">📞 (201) 685-4863</p>
        <p style="color:#2d2d2d;font-size:13px;margin:0;">✉️ offices@orendapsych.com</p>
      </td>
      <td width="4%">&nbsp;</td>
      <td width="48%" valign="top" style="background:#faf9f5;border-radius:12px;padding:16px;">
        <p style="color:#8B7335;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Regus ${loc.name}</p>
        <p style="color:#2d2d2d;font-size:13px;margin:0 0 2px;">📞 ${loc.regusPhone}</p>
        <p style="color:#2d2d2d;font-size:13px;margin:0;">✉️ ${loc.regusEmail}</p>
      </td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:0 32px 32px;">
    <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0;">Warm regards,<br/><strong>The New Jersey Admin Team</strong></p>
  </td></tr>

  <tr><td style="background:#593D78;padding:16px 32px;text-align:center;border-radius:0 0 20px 20px;">
    <p style="color:#d4c5e6;font-size:11px;margin:0;">Orenda Psychiatry, PLLC · ${loc.footerAddress}</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

type VersionTab = "executive" | "minimal" | "card";

const VERSION_TABS: { key: VersionTab; label: string; desc: string }[] = [
  { key: "executive", label: "🟣 Executive", desc: "Gradient header, structured" },
  { key: "minimal", label: "⚪ Minimal Clean", desc: "White, thin accent lines" },
  { key: "card", label: "🎴 Card Style", desc: "Colored cards per section" },
];

export default function BookingEmailShowcase() {
  const { toast } = useToast();
  const [location, setLocation] = useState<LocationKey>("hoboken");
  const [providerName, setProviderName] = useState("Dr. Patricia McCabe");
  const [bookingDate, setBookingDate] = useState("Wednesday, April 2, 2026");
  const [timeBlock, setTimeBlock] = useState("afternoon");
  const [activeVersion, setActiveVersion] = useState<VersionTab>("executive");
  const [copiedHtml, setCopiedHtml] = useState(false);

  const loc = LOCATION_DETAILS[location];

  const getHtml = () => {
    switch (activeVersion) {
      case "executive": return generateExecutiveEmail(loc, location, providerName, bookingDate, timeBlock);
      case "minimal": return generateMinimalEmail(loc, location, providerName, bookingDate, timeBlock);
      case "card": return generateCardEmail(loc, location, providerName, bookingDate, timeBlock);
    }
  };

  const handleCopyHtml = async () => {
    const html = getHtml();
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([html], { type: "text/plain" }),
        }),
      ]);
      setCopiedHtml(true);
      toast({ title: "Email copied!", description: "Paste directly into Gmail or Outlook." });
    } catch {
      await navigator.clipboard.writeText(html);
      setCopiedHtml(true);
      toast({ title: "Raw HTML copied!" });
    }
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f1f9] to-white">
      <NJNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <Link to="/site-directory" className="inline-flex items-center gap-2 text-[#593D78] hover:text-[#7B5EA7] mb-6 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </Link>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#593D78] mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Booking Confirmation — Email Designs
          </h1>
          <p className="text-[#8E9196] text-sm sm:text-base">Choose a style, customize details, and copy to send</p>
        </motion.div>

        {/* Version Tabs */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1.5} className="flex flex-col sm:flex-row gap-2 mb-6">
          {VERSION_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveVersion(tab.key)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all border ${
                activeVersion === tab.key
                  ? "bg-[#593D78] text-white border-[#593D78] shadow-md"
                  : "bg-white text-[#593D78] border-[#E8E0F0] hover:bg-[#f4f1f9]"
              }`}
            >
              <span className="block">{tab.label}</span>
              <span className={`block text-xs mt-0.5 ${activeVersion === tab.key ? "text-[#d4c5e6]" : "text-[#8E9196]"}`}>{tab.desc}</span>
            </button>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="bg-white rounded-xl shadow-sm border border-[#E8E0F0] p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#593D78] mb-2">Office Location</label>
              <div className="flex gap-2">
                <button onClick={() => setLocation("hoboken")} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${location === "hoboken" ? "bg-[#593D78] text-white shadow-md" : "bg-[#f4f1f9] text-[#593D78] hover:bg-[#E8E0F0]"}`}>🟣 Hoboken</button>
                <button onClick={() => setLocation("edison")} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${location === "edison" ? "bg-[#C9A96E] text-white shadow-md" : "bg-[#faf9f5] text-[#8B7335] hover:bg-[#f0ead8]"}`}>🟡 Edison</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#593D78] mb-2">Time Block</label>
              <select value={timeBlock} onChange={(e) => setTimeBlock(e.target.value)} className="w-full border border-[#E8E0F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#593D78]/30">
                <option value="morning">Morning (9:00 AM – 3:00 PM)</option>
                <option value="afternoon">Afternoon (3:00 PM – 9:00 PM)</option>
                <option value="full_day">Full Day (9:00 AM – 9:00 PM)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#593D78] mb-2">Provider Name</label>
              <input type="text" value={providerName} onChange={(e) => setProviderName(e.target.value)} className="w-full border border-[#E8E0F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#593D78]/30" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#593D78] mb-2">Booking Date</label>
              <input type="text" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full border border-[#E8E0F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#593D78]/30" />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-[#E8E0F0]">
            <button onClick={handleCopyHtml} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#593D78] text-white rounded-lg text-sm font-medium hover:bg-[#7B5EA7] transition-colors shadow-sm">
              {copiedHtml ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedHtml ? "Copied!" : "Copy Email"}
            </button>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
          <h2 className="text-lg font-semibold text-[#593D78] mb-4 flex items-center gap-2" style={{ fontFamily: "Georgia, serif" }}>
            <Eye className="w-5 h-5" /> Preview — {VERSION_TABS.find(t => t.key === activeVersion)?.label}
          </h2>
          <div className="rounded-xl overflow-hidden shadow-lg border border-[#E8E0F0]">
            <div dangerouslySetInnerHTML={{ __html: getHtml() }} />
          </div>
        </motion.div>
      </main>

      <NJFooter />
    </div>
  );
}
