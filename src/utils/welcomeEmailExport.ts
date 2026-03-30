import * as XLSX from "xlsx-js-style";

const PURPLE = "3B0764";
const ACCENT = "7C3AED";
const LAVENDER_BG = "F5F3FF";
const AMBER = "D97706";
const AMBER_BG = "FFF7ED";
const DARK_BG = "1A1A2E";
const WHITE = "FFFFFF";
const BODY = "1A1A2E";
const MUTED = "64748B";
const LIGHT_BG = "F8F7FC";
const BORDER_COLOR = "E9E5F5";

interface ProviderData {
  providerName: string;
  bookingDate: string;
  appointmentTime: string;
  patientCalendarLink: string;
  googleMeetLink: string;
}

export function downloadProviderWelcomeXlsx(data: ProviderData) {
  const wb = XLSX.utils.book_new();
  const rows: any[][] = [];

  // Row 0: Header band
  rows.push(["Welcome to Our New Jersey Offices"]);
  // Row 1: Subtitle
  rows.push(["Orenda Psychiatry — Provider Welcome"]);
  // Row 2: spacer
  rows.push([""]);

  // Row 3: Greeting
  rows.push([`Hi ${data.providerName},`]);
  // Row 4: spacer
  rows.push([""]);
  // Row 5: Intro
  rows.push([`Thank you so much for scheduling your first in-person office day at our New Jersey office on ${data.bookingDate} — we're thrilled to have you! 🎉`]);
  // Row 6: spacer
  rows.push([""]);
  // Row 7
  rows.push([`Time has been blocked on your Simple Practice calendar for ${data.appointmentTime}. A calendar invite with the Google Meet link has also been sent to you.`]);
  // Row 8: spacer
  rows.push([""]);
  // Row 9
  rows.push(["Here are a few things to know:"]);
  // Row 10: spacer
  rows.push([""]);

  // Info cards as labeled rows
  // Row 11
  rows.push(["📅 SIMPLE PRACTICE CALENDAR", `${data.appointmentTime} on ${data.bookingDate} has been blocked on your Simple Practice calendar. A calendar invite with the Google Meet link has also been sent to you.`]);
  // Row 12
  rows.push(["📋 YOUR PATIENT CALENDAR", `Your patient calendar with upcoming appointments is included below. As additional bookings are made, the latest version will be sent to you.`]);
  // Row 13
  rows.push(["📝 OFFICE AGREEMENT", "Before your first visit, please review and sign the office agreement. It should have been sent to your email. If you've already completed this, please disregard."]);
  // Row 14
  rows.push(["🔒 SECURITY & BUILDING ACCESS", "Your patient's information will be sent to the security desk to ensure smooth access on the day of their visit. No action is needed from you on this."]);
  // Row 15
  rows.push(["🗺️ PATIENT DIRECTIONS", "Your patient will receive detailed directions and information about coming to the office, including building entry, floor access, and what to expect on arrival."]);
  // Row 16: spacer
  rows.push([""]);

  // Office Locations section
  // Row 17
  rows.push(["OFFICE LOCATIONS"]);
  // Row 18
  rows.push(["Hoboken — Regus Riverfront Center"]);
  // Row 19
  rows.push(["221 River Street, 9th Floor, Unit 9076"]);
  // Row 20
  rows.push(["Hoboken, NJ 07030"]);
  // Row 21: spacer
  rows.push([""]);
  // Row 22
  rows.push(["Edison — Regus Fieldcrest"]);
  // Row 23
  rows.push(["110 Fieldcrest Avenue, 3rd Floor, Unit 328"]);
  // Row 24
  rows.push(["Edison, NJ 08837"]);
  // Row 25: spacer
  rows.push([""]);

  // Quick Reference — Hoboken
  // Row 26
  rows.push(["QUICK REFERENCE — HOBOKEN", ""]);
  // Rows 27-32
  rows.push(["Regus Front Desk", "9th Floor · Mon–Fri, 9 AM – 5 PM"]);
  rows.push(["Front Desk Email", "Hoboken.Riverfront@regus.com"]);
  rows.push(["Building Phone", "(201) 721-8500"]);
  rows.push(["Wi-Fi Network", "Regus Net Wi-Fi"]);
  rows.push(["Wi-Fi Password", "167845630"]);
  rows.push(["After-Hours Access", "Swipe card required (we'll set you up)"]);
  // Row 33: spacer
  rows.push([""]);

  // Quick Reference — Edison
  // Row 34
  rows.push(["QUICK REFERENCE — EDISON", ""]);
  // Rows 35-40
  rows.push(["Regus Front Desk", "3rd Floor · Mon–Fri, 9 AM – 5 PM"]);
  rows.push(["Front Desk Email", "Edison.Fieldcrest@regus.com"]);
  rows.push(["Building Phone", "(732) 782-0328"]);
  rows.push(["Wi-Fi Username", "Orendapsych"]);
  rows.push(["Wi-Fi Password", "Orenda2026"]);
  rows.push(["After-Hours Access", "Swipe card required (we'll set you up)"]);
  // Row 41: spacer
  rows.push([""]);

  // Closing
  // Row 42
  rows.push(["We're genuinely excited to have you join us at our New Jersey offices. Don't hesitate to reach out with any questions at all — we're here to help."]);
  // Row 43: spacer
  rows.push([""]);
  // Row 44
  rows.push(["Warmly,"]);
  // Row 45
  rows.push(["Susie Levitt"]);
  // Row 46
  rows.push(["(203) 313-3074"]);
  // Row 47
  rows.push(["susie@orendapsych.com"]);
  // Row 48: spacer
  rows.push([""]);
  // Row 49
  rows.push(["Orenda Psychiatry · New Jersey Offices"]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  ws["!cols"] = [{ wch: 36 }, { wch: 72 }];

  // Merge cells for full-width rows
  const fullWidthRows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 33, 41, 42, 43, 44, 45, 46, 47, 48, 49];
  ws["!merges"] = fullWidthRows.map(r => ({ s: { r, c: 0 }, e: { r, c: 1 } }));

  // Row heights
  ws["!rows"] = rows.map((_, i) => {
    if (i === 0) return { hpt: 52 };
    if (i === 1) return { hpt: 28 };
    if ([5, 7, 42].includes(i)) return { hpt: 56 };
    if (i >= 11 && i <= 15) return { hpt: 64 };
    if ([26, 34].includes(i)) return { hpt: 32 };
    if ([2, 4, 6, 8, 10, 16, 21, 25, 33, 41, 43, 48].includes(i)) return { hpt: 10 };
    return { hpt: 24 };
  });

  // Styles
  const thinBorder = {
    top: { style: "thin" as const, color: { rgb: BORDER_COLOR } },
    bottom: { style: "thin" as const, color: { rgb: BORDER_COLOR } },
    left: { style: "thin" as const, color: { rgb: BORDER_COLOR } },
    right: { style: "thin" as const, color: { rgb: BORDER_COLOR } },
  };

  // Row 0: Purple header
  ["A1", "B1"].forEach(cell => {
    if (ws[cell]) ws[cell].s = {
      font: { bold: false, color: { rgb: WHITE }, sz: 22, name: "Georgia" },
      fill: { fgColor: { rgb: PURPLE } },
      alignment: { vertical: "center" as const, horizontal: "center" as const },
    };
  });

  // Row 1: Subtitle
  ["A2", "B2"].forEach(cell => {
    if (ws[cell]) ws[cell].s = {
      font: { color: { rgb: ACCENT }, sz: 11, italic: true },
      fill: { fgColor: { rgb: LAVENDER_BG } },
      alignment: { vertical: "center" as const, horizontal: "center" as const },
    };
  });

  // Greeting (row 3)
  if (ws["A4"]) ws["A4"].s = {
    font: { bold: false, color: { rgb: BODY }, sz: 13 },
    alignment: { vertical: "center" as const, wrapText: true },
  };

  // Body text rows
  [5, 7, 9, 42].forEach(r => {
    const cell = `A${r + 1}`;
    if (ws[cell]) ws[cell].s = {
      font: { color: { rgb: BODY }, sz: 12 },
      alignment: { vertical: "top" as const, wrapText: true },
    };
  });

  // Info card rows (11-15)
  for (let i = 11; i <= 15; i++) {
    const labelCell = `A${i + 1}`;
    const valueCell = `B${i + 1}`;
    const isAmber = i === 13;
    const bgColor = isAmber ? AMBER_BG : LAVENDER_BG;
    const accentColor = isAmber ? AMBER : ACCENT;

    if (ws[labelCell]) ws[labelCell].s = {
      font: { bold: true, color: { rgb: accentColor }, sz: 10, name: "Calibri" },
      fill: { fgColor: { rgb: bgColor } },
      alignment: { vertical: "top" as const, wrapText: true },
      border: {
        ...thinBorder,
        left: { style: "medium" as const, color: { rgb: accentColor } },
      },
    };
    if (ws[valueCell]) ws[valueCell].s = {
      font: { color: { rgb: BODY }, sz: 11 },
      fill: { fgColor: { rgb: bgColor } },
      alignment: { vertical: "top" as const, wrapText: true },
      border: thinBorder,
    };
  }

  // Office Location header (row 17)
  if (ws["A18"]) ws["A18"].s = {
    font: { bold: true, color: { rgb: ACCENT }, sz: 10, name: "Calibri" },
    alignment: { vertical: "center" as const },
  };

  // Hoboken details (rows 18-20)
  [18, 19, 20].forEach(r => {
    const cell = `A${r + 1}`;
    if (ws[cell]) ws[cell].s = {
      font: { color: { rgb: r === 18 ? BODY : MUTED }, sz: r === 18 ? 12 : 11, bold: r === 18 },
      alignment: { vertical: "center" as const },
    };
  });

  // Edison details (rows 22-24)
  [22, 23, 24].forEach(r => {
    const cell = `A${r + 1}`;
    if (ws[cell]) ws[cell].s = {
      font: { color: { rgb: r === 22 ? BODY : MUTED }, sz: r === 22 ? 12 : 11, bold: r === 22 },
      alignment: { vertical: "center" as const },
    };
  });

  // Quick Reference headers and data — Hoboken (rows 26-32)
  ["A27", "B27"].forEach(cell => {
    if (ws[cell]) ws[cell].s = {
      font: { bold: true, color: { rgb: "A78BFA" }, sz: 10, name: "Calibri" },
      fill: { fgColor: { rgb: DARK_BG } },
      alignment: { vertical: "center" as const },
    };
  });

  for (let i = 27; i <= 32; i++) {
    const labelCell = `A${i + 1}`;
    const valueCell = `B${i + 1}`;
    if (ws[labelCell]) ws[labelCell].s = {
      font: { bold: true, color: { rgb: "A78BFA" }, sz: 10 },
      fill: { fgColor: { rgb: DARK_BG } },
      alignment: { vertical: "center" as const },
      border: { bottom: { style: "thin" as const, color: { rgb: "2D2D4A" } } },
    };
    if (ws[valueCell]) ws[valueCell].s = {
      font: { color: { rgb: "E2E8F0" }, sz: 11 },
      fill: { fgColor: { rgb: DARK_BG } },
      alignment: { vertical: "center" as const },
      border: { bottom: { style: "thin" as const, color: { rgb: "2D2D4A" } } },
    };
  }

  // Quick Reference headers and data — Edison (rows 34-40)
  ["A35", "B35"].forEach(cell => {
    if (ws[cell]) ws[cell].s = {
      font: { bold: true, color: { rgb: "A78BFA" }, sz: 10, name: "Calibri" },
      fill: { fgColor: { rgb: DARK_BG } },
      alignment: { vertical: "center" as const },
    };
  });

  for (let i = 35; i <= 40; i++) {
    const labelCell = `A${i + 1}`;
    const valueCell = `B${i + 1}`;
    if (ws[labelCell]) ws[labelCell].s = {
      font: { bold: true, color: { rgb: "A78BFA" }, sz: 10 },
      fill: { fgColor: { rgb: DARK_BG } },
      alignment: { vertical: "center" as const },
      border: { bottom: { style: "thin" as const, color: { rgb: "2D2D4A" } } },
    };
    if (ws[valueCell]) ws[valueCell].s = {
      font: { color: { rgb: "E2E8F0" }, sz: 11 },
      fill: { fgColor: { rgb: DARK_BG } },
      alignment: { vertical: "center" as const },
      border: { bottom: { style: "thin" as const, color: { rgb: "2D2D4A" } } },
    };
  }

  // Closing and signature
  if (ws["A45"]) ws["A45"].s = { font: { color: { rgb: BODY }, sz: 12 } };
  if (ws["A46"]) ws["A46"].s = { font: { bold: true, color: { rgb: BODY }, sz: 13 } };
  if (ws["A47"]) ws["A47"].s = { font: { color: { rgb: MUTED }, sz: 11 } };
  if (ws["A48"]) ws["A48"].s = { font: { color: { rgb: ACCENT }, sz: 11 } };

  // Footer (row 49)
  if (ws["A50"]) ws["A50"].s = {
    font: { italic: true, color: { rgb: "A1A1AA" }, sz: 10 },
    fill: { fgColor: { rgb: LIGHT_BG } },
    alignment: { horizontal: "center" as const, vertical: "center" as const },
  };

  XLSX.utils.book_append_sheet(wb, ws, "Welcome Email");
  XLSX.writeFile(wb, `Provider_Welcome_Email_${data.providerName.replace(/\s+/g, "_")}.xlsx`);
}
