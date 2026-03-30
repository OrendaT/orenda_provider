import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import NJNavbar from "@/components/NJNavbar";
import NJFooter from "@/components/NJFooter";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/orenda-logo-purple.png";
import hobokenStreetView from "@/assets/hoboken-street-view.png";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

type LocationKey = "hoboken" | "edison";

const LOCATION_DETAILS: Record<LocationKey, {
  name: string;
  address: string;
  floor: string;
  unit: string;
  regusPhone: string;
  regusEmail: string;
  wifi: { network: string; password: string };
  directions: string;
  mapsLink: string;
  buildingAccess: string[];
  buildingAccessHtml?: string;
  receptionHours: string;
  parking: string;
  landmark: string;
  afterFivePmNote: string;
  footerAddress: string;
}> = {
  hoboken: {
    name: "Hoboken",
    address: "221 River Street, 9th Floor, Unit 9076",
    floor: "9th Floor",
    unit: "Unit 9076",
    regusPhone: "(201) 484-7855",
    regusEmail: "Hoboken.RiverSt@regus.com",
    wifi: { network: "Regus Net Wi-Fi", password: "167845630" },
    directions: "Enter through the main lobby at 221 River Street (directly next to Wonder Cafe). Take the elevator to the 9th floor.",
    mapsLink: "https://maps.google.com/?q=221+River+Street+Hoboken+NJ",
    buildingAccess: [],
    buildingAccessHtml: `
                  <p style="color:#B06A2F;font-size:15px;font-weight:700;margin:0 0 12px 0;font-family:Georgia,serif;">⚠️ IMPORTANT — PLEASE READ</p>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0 0 4px 0;font-weight:600;font-family:Georgia,serif;">Ground Floor Entry:</p>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0 0 12px 0;padding-left:12px;font-family:Georgia,serif;">The building doors are open Monday–Friday from 7:00 AM to 6:00 PM.</p>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0 0 4px 0;font-weight:600;font-family:Georgia,serif;">After Hours &amp; Weekends:</p>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0 0 12px 0;padding-left:12px;font-family:Georgia,serif;">Outside of these hours, the doors are locked. Security is on-site 24/7&mdash;please ring the doorbell located on the right-hand side of the entrance to be let in.</p>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0 0 4px 0;font-weight:600;font-family:Georgia,serif;">Check-In Requirement:</p>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0 0 12px 0;padding-left:12px;font-family:Georgia,serif;">Before arrival, our team will register you with building security. Please bring a valid ID and check in at the ground floor to receive a day pass.</p>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0 0 4px 0;font-weight:600;font-family:Georgia,serif;">Regus Office / Floor Access:</p>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0 0 4px 0;padding-left:12px;font-family:Georgia,serif;"><em>During Regus reception hours (Mon–Fri, 9:00 AM – 5:00 PM):</em><br/>You do not need a permanent swipe card. Our team will get you set up with the building and with Regus so you can enter while their staff is there. During this time, you can access a key and swipe card from the lockbox outside the Orenda office door.</p>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:4px 0 4px 12px;padding-left:12px;font-family:Georgia,serif;">Lockbox code: <strong>7123</strong><br/>Please return both items to the lockbox when finished.</p>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:8px 0 0 0;padding-left:12px;font-family:Georgia,serif;"><em>Outside of Regus reception hours:</em><br/>A swipe card is required for floor access and must be coordinated in advance through Orenda NJ Admin Team at <a href="mailto:offices@orendapsych.com" style="color:#593D78;">offices@orendapsych.com</a></p>`,
    receptionHours: "",
    parking: "Street parking and nearby garages available. NJ Transit Hoboken Terminal is a short walk away.",
    landmark: "The building entrance is directly next to Wonder Cafe.",
    afterFivePmNote: "For visits after 5:00 PM: Please place the Orenda after-hours signage by the 9th-floor glass door. You can locate the signage inside the office. This displays the NJ admin phone number for patients to text that they've arrived. Once you receive a notification that your patient has arrived, please greet them at the 9th-floor entrance. Please make sure to return the sign back to the office at the end of the day.",
    footerAddress: "221 River Street, 9th Floor, Unit 9076, Hoboken, NJ 07030",
  },
  edison: {
    name: "Edison",
    address: "110 Fieldcrest Avenue, 3rd Floor, Unit 328",
    floor: "3rd Floor",
    unit: "Unit 328",
    regusPhone: "(732) 782-0328",
    regusEmail: "Edison.Fieldcrest@regus.com",
    wifi: { network: "Orendapsych", password: "167785439" },
    directions: "Enter through the main lobby at 110 Fieldcrest Avenue. Take the elevator to the 3rd floor and proceed to Unit 328.",
    mapsLink: "https://maps.google.com/?q=110+Fieldcrest+Avenue+Edison+NJ",
    buildingAccess: [
      "Building entrance: 24/7 access",
      "Lobby security on-site",
    ],
    receptionHours: "",
    parking: "Free parking available on-site.",
    landmark: "Located near major highways with easy access from Route 287 and the NJ Turnpike.",
    afterFivePmNote: "",
    footerAddress: "110 Fieldcrest Avenue, 3rd Floor, Unit 328, Edison, NJ 08837",
  },
};

const TIME_LABELS: Record<string, string> = {
  morning: "Morning (9:00 AM – 3:00 PM)",
  afternoon: "Afternoon (3:00 PM – 9:00 PM)",
  full_day: "Full Day (9:00 AM – 9:00 PM)",
};

// ─── VERSION 1: DETAILED EMAIL ───────────────────────────────────────────────

function generateEmailHtml(location: LocationKey, providerName: string, bookingDate: string, timeBlock: string, streetViewUrl: string) {
  const loc = LOCATION_DETAILS[location];
  const timeLabel = TIME_LABELS[timeBlock] || timeBlock;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation — Orenda Psychiatry</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f1f9;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(89,61,120,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#593D78 0%,#7B5EA7 100%);padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0 0 4px 0;font-family:Georgia,serif;">Office Booking Confirmed</h1>
              <p style="color:#d4c5e6;font-size:14px;margin:0;font-family:Georgia,serif;">Thank you for scheduling your in-person office day</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <p style="color:#2d2d2d;font-size:16px;line-height:1.6;margin:0 0 20px 0;font-family:Georgia,serif;">
                Dear <strong>${providerName || "[Provider Name]"}</strong>,
              </p>
              <p style="color:#2d2d2d;font-size:16px;line-height:1.6;margin:0 0 20px 0;font-family:Georgia,serif;">
                Thank you for booking your in-person office day at our <strong>${loc.name}</strong> location. We're looking forward to having you! Below you'll find everything you need for a smooth visit.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f7fc;border-radius:8px;margin-bottom:24px;border-left:4px solid #593D78;">
                <tr><td style="padding:20px;">
                  <h2 style="color:#593D78;font-size:16px;font-weight:700;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.5px;font-family:Georgia,serif;">Booking Details</h2>
                  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                    <tr><td style="color:#666;font-size:14px;padding:4px 0;width:120px;font-family:Georgia,serif;">Date:</td><td style="color:#2d2d2d;font-size:14px;padding:4px 0;font-weight:600;font-family:Georgia,serif;">${bookingDate || "[Booking Date]"}</td></tr>
                    <tr><td style="color:#666;font-size:14px;padding:4px 0;font-family:Georgia,serif;">Time Block:</td><td style="color:#2d2d2d;font-size:14px;padding:4px 0;font-weight:600;font-family:Georgia,serif;">${timeLabel}</td></tr>
                    <tr><td style="color:#666;font-size:14px;padding:4px 0;font-family:Georgia,serif;">Location:</td><td style="color:#2d2d2d;font-size:14px;padding:4px 0;font-weight:600;font-family:Georgia,serif;">${loc.name}</td></tr>
                    <tr><td style="color:#666;font-size:14px;padding:4px 0;font-family:Georgia,serif;">Address:</td><td style="color:#2d2d2d;font-size:14px;padding:4px 0;font-weight:600;font-family:Georgia,serif;">${loc.address}</td></tr>
                  </table>
                </td></tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf9f5;border-radius:8px;margin-bottom:24px;border-left:4px solid #C9A96E;">
                <tr><td style="padding:20px;">
                  <h2 style="color:#8B7335;font-size:16px;font-weight:700;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.5px;font-family:Georgia,serif;">Office Information</h2>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0 0 8px 0;font-family:Georgia,serif;"><strong>Directions:</strong> ${loc.directions}</p>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0 0 8px 0;font-family:Georgia,serif;"><strong>Landmark:</strong> ${loc.landmark}</p>
                  ${location === "hoboken" ? `<img src="${streetViewUrl}" alt="221 River Street entrance — next to Wonder Cafe" width="560" style="width:100%;max-width:560px;border-radius:8px;margin:8px 0 12px 0;display:block;" />` : ""}
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0 0 12px 0;font-family:Georgia,serif;"><a href="${loc.mapsLink}" style="color:#593D78;text-decoration:underline;">Open in Google Maps</a></p>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0 0 4px 0;font-weight:600;font-family:Georgia,serif;">Building Access:</p>
                  ${loc.buildingAccessHtml ? loc.buildingAccessHtml : loc.buildingAccess.map(a => `<p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0 0 4px 0;padding-left:12px;font-family:Georgia,serif;">&bull; ${a}</p>`).join("") + (loc.receptionHours ? `<p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:8px 0 0 0;padding-left:12px;font-family:Georgia,serif;">&bull; ${loc.receptionHours}</p>` : "")}
                </td></tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f7f4;border-radius:8px;margin-bottom:24px;border-left:4px solid #4A9D6E;">
                <tr><td style="padding:20px;">
                  <h2 style="color:#2E7D4F;font-size:16px;font-weight:700;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.5px;font-family:Georgia,serif;">Wi-Fi &amp; Amenities</h2>
                  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                    <tr><td style="color:#666;font-size:14px;padding:4px 0;width:120px;font-family:Georgia,serif;">Network:</td><td style="color:#2d2d2d;font-size:14px;padding:4px 0;font-weight:600;font-family:Georgia,serif;">${loc.wifi.network}</td></tr>
                    <tr><td style="color:#666;font-size:14px;padding:4px 0;font-family:Georgia,serif;">Password:</td><td style="color:#2d2d2d;font-size:14px;padding:4px 0;font-weight:600;font-family:Georgia,serif;">${loc.wifi.password}</td></tr>
                  </table>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:12px 0 0 0;font-family:Georgia,serif;"><strong>Amenities:</strong> Patient seating, weight scale, blood pressure cuff, Wi-Fi.</p>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:8px 0 0 0;font-family:Georgia,serif;"><strong>Parking:</strong> ${loc.parking}</p>
                </td></tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff8f0;border-radius:8px;margin-bottom:24px;border-left:4px solid #D4874D;">
                <tr><td style="padding:20px;">
                  <h2 style="color:#B06A2F;font-size:16px;font-weight:700;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.5px;font-family:Georgia,serif;">Patient Check-In</h2>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0 0 8px 0;font-family:Georgia,serif;">Patient arrivals are monitored by the NJ admin team. You'll receive a notification when your patient has checked in.</p>
                  <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0 0 8px 0;font-family:Georgia,serif;">The NJ admin will circulate patient schedules the night before your scheduled office day.</p>
                  ${loc.afterFivePmNote ? `<p style="color:#B06A2F;font-size:14px;line-height:1.6;margin:8px 0 0 0;font-weight:600;font-family:Georgia,serif;">&#9888; ${loc.afterFivePmNote}</p>` : ""}
                </td></tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1f9;border-radius:8px;margin-bottom:24px;">
                <tr><td style="padding:20px;">
                  <p style="color:#593D78;font-size:14px;font-weight:700;margin:0 0 12px 0;font-family:Georgia,serif;">Orenda Psychiatry — NJ Admin Team</p>
                  <p style="color:#2d2d2d;font-size:14px;margin:0 0 4px 0;font-family:Georgia,serif;">Phone: 201-685-4863</p>
                  <p style="color:#2d2d2d;font-size:14px;margin:0 0 16px 0;font-family:Georgia,serif;">Email: offices@orendapsych.com</p>
                  <p style="color:#593D78;font-size:14px;font-weight:700;margin:0 0 12px 0;font-family:Georgia,serif;">Regus ${loc.name} — Office Contacts</p>
                  <p style="color:#2d2d2d;font-size:14px;margin:0 0 4px 0;font-family:Georgia,serif;">Phone: ${loc.regusPhone}</p>
                  <p style="color:#2d2d2d;font-size:14px;margin:0;font-family:Georgia,serif;">Email: ${loc.regusEmail}</p>
                </td></tr>
              </table>

              <p style="color:#2d2d2d;font-size:16px;line-height:1.6;margin:0 0 8px 0;font-family:Georgia,serif;">We look forward to seeing you at the ${loc.name} office!</p>
              <p style="color:#2d2d2d;font-size:16px;line-height:1.6;margin:0;font-family:Georgia,serif;">Warm regards,<br/><strong>The New Jersey Admin Team</strong><br/><span style="color:#666;font-size:14px;">201-685-4863 &middot; offices@orendapsych.com</span></p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#593D78;padding:20px 40px;text-align:center;">
              <p style="color:#d4c5e6;font-size:12px;margin:0;font-family:Georgia,serif;">Orenda Psychiatry, PLLC &middot; ${loc.footerAddress}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── VERSION 2: VISUAL / CONCISE HOBOKEN EMAIL ──────────────────────────────

function generateVisualEmailHtml(providerName: string, bookingDate: string, timeBlock: string, streetViewUrl: string) {
  const loc = LOCATION_DETAILS.hoboken;
  const timeLabel = TIME_LABELS[timeBlock] || timeBlock;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f1f9;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f1f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(89,61,120,0.1);">
          
          <!-- Hero Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#593D78 0%,#7B5EA7 100%);padding:40px 40px 24px;text-align:center;">
              <p style="color:#d4c5e6;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px 0;font-family:Georgia,serif;">Booking Confirmed</p>
              <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:0 0 6px 0;font-family:Georgia,serif;">Hoboken Office</h1>
              <p style="color:#ffffff;font-size:16px;margin:0;font-family:Georgia,serif;">${bookingDate || "[Date]"} · ${timeLabel}</p>
            </td>
          </tr>

          <!-- Quick Greeting -->
          <tr>
            <td style="padding:28px 40px 16px;">
              <p style="color:#2d2d2d;font-size:16px;line-height:1.6;margin:0;font-family:Georgia,serif;">Hi <strong>${providerName || "[Provider]"}</strong>, thank you for booking! Here's what you need to know:</p>
            </td>
          </tr>

          <!-- Building Photo -->
          <tr>
            <td style="padding:0 40px 20px;">
              <img src="${streetViewUrl}" alt="221 River Street — look for Wonder Cafe" width="520" style="width:100%;max-width:520px;border-radius:10px;display:block;" />
              <p style="color:#8E9196;font-size:12px;text-align:center;margin:6px 0 0 0;font-family:Georgia,serif;">📍 221 River Street — look for Wonder Cafe, entrance is right next to it</p>
            </td>
          </tr>

          <!-- Key Info Cards — Side by Side -->
          <tr>
            <td style="padding:0 40px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <!-- Entry Card -->
                  <td width="48%" valign="top" style="background-color:#f9f7fc;border-radius:10px;padding:16px;">
                    <p style="color:#593D78;font-size:20px;margin:0 0 6px 0;">🚪</p>
                    <p style="color:#593D78;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px 0;font-family:Georgia,serif;">Getting In</p>
                    <p style="color:#2d2d2d;font-size:12px;line-height:1.5;margin:0 0 6px 0;font-family:Georgia,serif;"><strong>Ground floor:</strong> Open Mon–Fri, 7 AM – 6 PM</p>
                    <p style="color:#2d2d2d;font-size:12px;line-height:1.5;margin:0 0 6px 0;font-family:Georgia,serif;"><strong>After hours:</strong> Doors locked — ring doorbell (right side). Security 24/7.</p>
                    <p style="color:#2d2d2d;font-size:12px;line-height:1.5;margin:0 0 6px 0;font-family:Georgia,serif;"><strong>Check-in:</strong> Bring valid ID → ground floor day pass</p>
                    <p style="color:#2d2d2d;font-size:12px;line-height:1.5;margin:0 0 6px 0;font-family:Georgia,serif;"><strong>Regus hours:</strong> No swipe card needed. Team sets you up. Lockbox code: <strong>7123</strong>. Return items when done.</p>
                    <p style="color:#2d2d2d;font-size:12px;line-height:1.5;margin:0;font-family:Georgia,serif;"><strong>After Regus hours:</strong> Swipe card required (via Orenda NJ Admin)</p>
                  </td>
                  <td width="4%">&nbsp;</td>
                  <!-- Wi-Fi Card -->
                  <td width="48%" valign="top" style="background-color:#f0f7f4;border-radius:10px;padding:16px;">
                    <p style="color:#2E7D4F;font-size:20px;margin:0 0 6px 0;">📶</p>
                    <p style="color:#2E7D4F;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px 0;font-family:Georgia,serif;">Wi-Fi</p>
                    <p style="color:#2d2d2d;font-size:13px;line-height:1.5;margin:0 0 4px 0;font-family:Georgia,serif;"><strong>Network:</strong> ${loc.wifi.network}</p>
                    <p style="color:#2d2d2d;font-size:13px;line-height:1.5;margin:0 0 12px 0;font-family:Georgia,serif;"><strong>Password:</strong> ${loc.wifi.password}</p>
                    <p style="color:#2d2d2d;font-size:13px;line-height:1.5;margin:0;font-family:Georgia,serif;"><strong>Parking:</strong> Street &amp; garages nearby</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- After 5 PM Alert -->
          <tr>
            <td style="padding:0 40px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff3e6;border-radius:10px;border:1px solid #f0d4a8;">
                <tr><td style="padding:16px;">
                  <p style="color:#B06A2F;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px 0;font-family:Georgia,serif;">⚠️ After 5:00 PM</p>
                  <p style="color:#2d2d2d;font-size:13px;line-height:1.5;margin:0;font-family:Georgia,serif;">Place the <strong>Orenda after-hours signage</strong> by the 9th-floor glass door (located inside the office). It displays the NJ admin phone number for patients to text upon arrival. Once notified, greet them at the 9th-floor entrance. Please make sure to return the sign back to the office at the end of the day.</p>
                </td></tr>
              </table>
            </td>
          </tr>

          <!-- Patient Check-in -->
          <tr>
            <td style="padding:0 40px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf9f5;border-radius:10px;">
                <tr><td style="padding:16px;">
                  <p style="color:#8B7335;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px 0;font-family:Georgia,serif;">📋 Patient Check-In</p>
                  <p style="color:#2d2d2d;font-size:13px;line-height:1.5;margin:0 0 4px 0;font-family:Georgia,serif;">✓ You'll receive a notification when your patient has checked in</p>
                  <p style="color:#2d2d2d;font-size:13px;line-height:1.5;margin:0;font-family:Georgia,serif;">✓ NJ admin will send patient schedules the night before</p>
                </td></tr>
              </table>
            </td>
          </tr>

          <!-- Contacts -->
          <tr>
            <td style="padding:0 40px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48%" valign="top" style="background-color:#f4f1f9;border-radius:10px;padding:14px;">
                    <p style="color:#593D78;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 6px 0;font-family:Georgia,serif;">Orenda NJ Admin</p>
                    <p style="color:#2d2d2d;font-size:13px;margin:0 0 2px 0;font-family:Georgia,serif;">📞 201-685-4863</p>
                    <p style="color:#2d2d2d;font-size:13px;margin:0;font-family:Georgia,serif;">✉️ offices@orendapsych.com</p>
                  </td>
                  <td width="4%">&nbsp;</td>
                  <td width="48%" valign="top" style="background-color:#f9f8f5;border-radius:10px;padding:14px;">
                    <p style="color:#8B7335;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 6px 0;font-family:Georgia,serif;">Regus Hoboken</p>
                    <p style="color:#2d2d2d;font-size:13px;margin:0 0 2px 0;font-family:Georgia,serif;">📞 (201) 484-7855</p>
                    <p style="color:#2d2d2d;font-size:13px;margin:0;font-family:Georgia,serif;">✉️ Hoboken.RiverSt@regus.com</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding:0 40px 28px;">
              <p style="color:#2d2d2d;font-size:14px;line-height:1.6;margin:0;font-family:Georgia,serif;">Warm regards,<br/><strong>The New Jersey Admin Team</strong><br/><span style="color:#666;font-size:12px;">201-685-4863 &middot; offices@orendapsych.com</span></p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#593D78;padding:16px 40px;text-align:center;">
              <p style="color:#d4c5e6;font-size:11px;margin:0;font-family:Georgia,serif;">Orenda Psychiatry, PLLC &middot; ${loc.footerAddress}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── VERSION 3: SLACK MESSAGE ────────────────────────────────────────────────

function generateSlackMessage(providerName: string, bookingDate: string, timeBlock: string) {
  const loc = LOCATION_DETAILS.hoboken;
  const timeLabel = TIME_LABELS[timeBlock] || timeBlock;

  return `✅ *Office Booking Confirmed — Hoboken*

Hi ${providerName || "[Provider Name]"}, thanks for booking!

📅 *${bookingDate || "[Date]"}* · ${timeLabel}
📍 221 River Street, 9th Floor, Unit 9076

---

🚪 *Building Access*

*Ground Floor Entry:*
The building doors are open Monday–Friday from 7:00 AM to 6:00 PM.

*After Hours & Weekends:*
Outside of these hours, the doors are locked. Security is on-site 24/7—ring the doorbell on the right-hand side of the entrance to be let in.

*Check-In Requirement:*
Before arrival, our team will register you with building security. Please bring a valid ID and check in at the ground floor to receive a day pass.

*Regus Office / Floor Access:*
_During Regus reception hours (Mon–Fri, 9 AM – 5 PM):_
You do not need a permanent swipe card. Our team will get you set up with the building and with Regus so you can enter while their staff is there. During this time, you can access a key and swipe card from the lockbox outside the Orenda office door. Code: \`7123\`. Please return both items when finished.

_Outside of Regus reception hours:_
A swipe card is required and must be coordinated in advance through Orenda NJ Admin Team at offices@orendapsych.com

📶 *Wi-Fi*
• Network: \`${loc.wifi.network}\`
• Password: \`${loc.wifi.password}\`

---

⚠️ *After 5:00 PM*
Place the Orenda after-hours signage by the 9th-floor glass door (located inside the office). It displays the NJ admin number for patients to text when they arrive. Once notified, greet them at the 9th-floor entrance. Please make sure to return the sign back to the office at the end of the day.

📋 *Patient Check-In*
• You'll receive a notification when your patient has checked in
• NJ admin will send patient schedules the night before

---

*Orenda NJ Admin:* 201-685-4863 · offices@orendapsych.com
*Regus Hoboken:* (201) 484-7855 · Hoboken.RiverSt@regus.com

Warm regards,
*The New Jersey Admin Team*
201-685-4863 · offices@orendapsych.com`;
}

// ─── PLAIN TEXT VERSION ──────────────────────────────────────────────────────

function generatePlainText(location: LocationKey, providerName: string, bookingDate: string, timeBlock: string) {
  const loc = LOCATION_DETAILS[location];
  const timeLabel = TIME_LABELS[timeBlock] || timeBlock;

  return `OFFICE BOOKING CONFIRMED — ORENDA PSYCHIATRY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear ${providerName || "[Provider Name]"},

Thank you for booking your in-person office day at our ${loc.name} location. We're looking forward to having you! Below you'll find everything you need for a smooth visit.

BOOKING DETAILS
• Date: ${bookingDate || "[Booking Date]"}
• Time Block: ${timeLabel}
• Location: ${loc.name}
• Address: ${loc.address}

OFFICE INFORMATION
• Directions: ${loc.directions}
• Landmark: ${loc.landmark}
• Google Maps: ${loc.mapsLink}

Building Access:
${location === "hoboken" ? `  Ground Floor Entry:
  The building doors are open Monday–Friday from 7:00 AM to 6:00 PM.

  After Hours & Weekends:
  Outside of these hours, the doors are locked. Security is on-site 24/7—please ring the doorbell located on the right-hand side of the entrance to be let in.

  Check-In Requirement:
  Before arrival, our team will register you with building security. Please bring a valid ID and check in at the ground floor to receive a day pass.

  Regus Office / Floor Access:
  During Regus reception hours (Mon–Fri, 9:00 AM – 5:00 PM):
  You do not need a permanent swipe card. Our team will get you set up with the building and with Regus so you can enter while their staff is there. During this time, you can access a key and swipe card from the lockbox outside the Orenda office door. Lockbox code: 7123. Please return both items to the lockbox when finished.

  Outside of Regus reception hours:
  A swipe card is required for floor access and must be coordinated in advance through Orenda NJ Admin Team at offices@orendapsych.com` : loc.buildingAccess.map(a => `  • ${a}`).join("\n")}

WI-FI & AMENITIES
• Network: ${loc.wifi.network}
• Password: ${loc.wifi.password}
• Amenities: Patient seating, weight scale, blood pressure cuff, Wi-Fi
• Parking: ${loc.parking}

PATIENT CHECK-IN
Patient arrivals are monitored by the NJ admin team. You'll receive a notification when your patient has checked in.

The NJ admin will circulate patient schedules the night before your scheduled office day.
${loc.afterFivePmNote ? `\n⚠️ ${loc.afterFivePmNote}` : ""}

CONTACTS
Orenda Psychiatry — NJ Admin Team
  Phone: 201-685-4863
  Email: offices@orendapsych.com

Regus ${loc.name} — Office Contacts
  Phone: ${loc.regusPhone}
  Email: ${loc.regusEmail}

We look forward to seeing you at the ${loc.name} office!

Warm regards,
The New Jersey Admin Team
201-685-4863 · offices@orendapsych.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Orenda Psychiatry, PLLC · ${loc.footerAddress}`;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

type VersionTab = "detailed" | "visual" | "slack";

export default function ProviderBookingConfirmationEmail() {
  const { toast } = useToast();
  const [location, setLocation] = useState<LocationKey>("hoboken");
  const [providerName, setProviderName] = useState("Dr. Teddy Schimenti");
  const [bookingDate, setBookingDate] = useState("Tuesday, July 15, 2025");
  const [timeBlock, setTimeBlock] = useState("morning");
  const [activeVersion, setActiveVersion] = useState<VersionTab>("detailed");
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedSlack, setCopiedSlack] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const streetViewAbsoluteUrl = new URL(hobokenStreetView, window.location.origin).href;

  const handleCopyHtml = async () => {
    const isVisual = activeVersion === "visual";
    const html = isVisual
      ? generateVisualEmailHtml(providerName, bookingDate, timeBlock, streetViewAbsoluteUrl)
      : generateEmailHtml(location, providerName, bookingDate, timeBlock, streetViewAbsoluteUrl);
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([generatePlainText(location, providerName, bookingDate, timeBlock)], { type: "text/plain" }),
        }),
      ]);
      setCopiedHtml(true);
      toast({ title: "Email HTML copied!", description: "Paste directly into Gmail or Outlook." });
    } catch {
      await navigator.clipboard.writeText(html);
      setCopiedHtml(true);
      toast({ title: "Raw HTML copied!", description: "Paste into an HTML email editor." });
    }
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatePlainText(location, providerName, bookingDate, timeBlock));
    setCopiedText(true);
    toast({ title: "Plain text copied!" });
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopySlack = () => {
    navigator.clipboard.writeText(generateSlackMessage(providerName, bookingDate, timeBlock));
    setCopiedSlack(true);
    toast({ title: "Slack message copied!", description: "Paste into any Slack channel or DM." });
    setTimeout(() => setCopiedSlack(false), 2000);
  };

  const loc = LOCATION_DETAILS[location];

  const currentHtml = activeVersion === "visual"
    ? generateVisualEmailHtml(providerName, bookingDate, timeBlock, streetViewAbsoluteUrl)
    : generateEmailHtml(location, providerName, bookingDate, timeBlock, streetViewAbsoluteUrl);

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
          <img src={logo} alt="Orenda Psychiatry" className="h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#593D78] mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Provider Booking Confirmation
          </h1>
          <p className="text-[#8E9196]">Detailed · Visual · Slack — Choose a format and copy</p>
        </motion.div>

        {/* Version Tabs */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1.5} className="flex gap-2 mb-6">
          {([
            { key: "detailed" as VersionTab, label: "📧 Detailed Email", sub: "Full version" },
            { key: "visual" as VersionTab, label: "🎨 Visual (Hoboken)", sub: "Concise & visual" },
            { key: "slack" as VersionTab, label: "💬 Slack", sub: "Slack message" },
          ]).map((tab) => (
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
              <span className={`block text-xs mt-0.5 ${activeVersion === tab.key ? "text-[#d4c5e6]" : "text-[#8E9196]"}`}>{tab.sub}</span>
            </button>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="bg-white rounded-xl shadow-sm border border-[#E8E0F0] p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location Toggle — only for detailed */}
            {activeVersion === "detailed" && (
              <div>
                <label className="block text-sm font-semibold text-[#593D78] mb-2">Office Location</label>
                <div className="flex gap-2">
                  <button onClick={() => setLocation("hoboken")} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${location === "hoboken" ? "bg-[#593D78] text-white shadow-md" : "bg-[#f4f1f9] text-[#593D78] hover:bg-[#E8E0F0]"}`}>🟣 Hoboken</button>
                  <button onClick={() => setLocation("edison")} className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${location === "edison" ? "bg-[#C9A96E] text-white shadow-md" : "bg-[#faf9f5] text-[#8B7335] hover:bg-[#f0ead8]"}`}>🟡 Edison</button>
                </div>
              </div>
            )}

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
              <input type="text" value={providerName} onChange={(e) => setProviderName(e.target.value)} className="w-full border border-[#E8E0F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#593D78]/30" placeholder="Dr. Name" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#593D78] mb-2">Booking Date</label>
              <input type="text" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full border border-[#E8E0F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#593D78]/30" placeholder="Tuesday, July 15, 2025" />
            </div>
          </div>

          {/* Copy Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-[#E8E0F0]">
            {activeVersion === "slack" ? (
              <button onClick={handleCopySlack} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4A154B] text-white rounded-lg text-sm font-medium hover:bg-[#611f69] transition-colors shadow-sm">
                {copiedSlack ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedSlack ? "Copied!" : "Copy Slack Message"}
              </button>
            ) : (
              <>
                <button onClick={handleCopyHtml} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#593D78] text-white rounded-lg text-sm font-medium hover:bg-[#7B5EA7] transition-colors shadow-sm">
                  {copiedHtml ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedHtml ? "Copied!" : "Copy Email HTML"}
                </button>
                <button onClick={handleCopyText} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#593D78] border border-[#593D78] rounded-lg text-sm font-medium hover:bg-[#f4f1f9] transition-colors">
                  {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedText ? "Copied!" : "Copy Plain Text"}
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}>
          <h2 className="text-lg font-semibold text-[#593D78] mb-4" style={{ fontFamily: "Georgia, serif" }}>
            {activeVersion === "detailed" && `Email Preview — ${loc.name} Version`}
            {activeVersion === "visual" && "Email Preview — Visual Hoboken Version"}
            {activeVersion === "slack" && "Slack Message Preview"}
          </h2>

          {activeVersion === "slack" ? (
            <div className="bg-white rounded-xl border border-[#E8E0F0] shadow-sm overflow-hidden">
              {/* Slack-style header */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#E8E0F0] bg-[#faf9fb]">
                <div className="w-8 h-8 rounded-md bg-[#4A154B] flex items-center justify-center text-white text-xs font-bold">O</div>
                <div>
                  <p className="text-sm font-bold text-[#1d1c1d]">Orenda NJ Office</p>
                  <p className="text-xs text-[#616061]">APP</p>
                </div>
              </div>
              <pre className="p-5 text-sm text-[#1d1c1d] whitespace-pre-wrap font-[Lato,sans-serif] leading-relaxed">
                {generateSlackMessage(providerName, bookingDate, timeBlock)}
              </pre>
            </div>
          ) : (
            <div ref={previewRef} className="rounded-xl overflow-hidden shadow-lg border border-[#E8E0F0]">
              <div dangerouslySetInnerHTML={{ __html: currentHtml }} className="bg-[#f4f1f9]" />
            </div>
          )}
        </motion.div>

        {/* Plain Text (for email versions) */}
        {activeVersion !== "slack" && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="mt-8">
            <h2 className="text-lg font-semibold text-[#593D78] mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Plain Text Version
            </h2>
            <pre className="bg-white rounded-xl border border-[#E8E0F0] p-6 text-sm text-[#2d2d2d] whitespace-pre-wrap font-mono overflow-x-auto shadow-sm">
              {generatePlainText(location, providerName, bookingDate, timeBlock)}
            </pre>
          </motion.div>
        )}
      </main>

      <NJFooter />
    </div>
  );
}
