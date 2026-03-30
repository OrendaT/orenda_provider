import * as XLSX from "xlsx-js-style";

// ── Brand Palette ──
const P = {
  DEEP: "2D1B4E", DARK: "462D6D", MED: "6B4FA0", ACCENT: "8B6FC0",
  SOFT: "A78BDA", LAVEN: "C4B5DC", WASH: "E8E0F0", MIST: "F0EBF5",
  SNOW: "F8F6FB", WHITE: "FFFFFF", TEXT: "1A1A2E", MUTED: "6B6B80",
  BORDER: "D4CCE6", GREEN_BG: "E8F5E9", GREEN_TX: "2E7D32",
  AMBER_BG: "FFF8E1", AMBER_TX: "F57F17", RED_BG: "FFEBEE", RED_TX: "C62828",
  BLUE_BG: "E3F2FD", BLUE_TX: "1565C0",
};

const GRADIENT = [P.DEEP, P.DARK, P.MED, P.ACCENT, P.SOFT];

const bdr = (color = P.BORDER): any => ({
  top: { style: "thin", color: { rgb: color } },
  bottom: { style: "thin", color: { rgb: color } },
  left: { style: "thin", color: { rgb: color } },
  right: { style: "thin", color: { rgb: color } },
});

const noBdr: any = {
  top: { style: "thin", color: { rgb: P.WHITE } },
  bottom: { style: "thin", color: { rgb: P.WHITE } },
  left: { style: "thin", color: { rgb: P.WHITE } },
  right: { style: "thin", color: { rgb: P.WHITE } },
};

function fillRow(ws: any, row: number, colCount: number, style: any) {
  for (let c = 0; c < colCount; c++) {
    const ref = XLSX.utils.encode_cell({ r: row, c });
    if (!ws[ref]) ws[ref] = { t: "s", v: "" };
    ws[ref].s = { ...style };
  }
}

function setCell(ws: any, r: number, c: number, value: string, style: any) {
  const ref = XLSX.utils.encode_cell({ r, c });
  ws[ref] = { t: "s", v: value, s: style };
}

function addGradientHeader(ws: any, colCount: number, title: string, subtitle: string) {
  for (let i = 0; i < 5; i++) {
    fillRow(ws, i, colCount, {
      fill: { fgColor: { rgb: GRADIENT[i] } },
      border: { top: { style: "thin", color: { rgb: GRADIENT[i] } }, bottom: { style: "thin", color: { rgb: GRADIENT[i] } }, left: { style: "thin", color: { rgb: GRADIENT[i] } }, right: { style: "thin", color: { rgb: GRADIENT[i] } } },
    });
  }
  setCell(ws, 1, 1, "ORENDA PSYCHIATRY", {
    font: { name: "Garamond", sz: 10, color: { rgb: P.LAVEN } },
    fill: { fgColor: { rgb: GRADIENT[1] } }, alignment: { horizontal: "center", vertical: "center" }, border: noBdr,
  });
  setCell(ws, 2, 1, title, {
    font: { name: "Garamond", sz: 20, bold: true, color: { rgb: P.WHITE } },
    fill: { fgColor: { rgb: GRADIENT[2] } }, alignment: { horizontal: "center", vertical: "center" }, border: noBdr,
  });
  setCell(ws, 3, 1, subtitle, {
    font: { name: "Garamond", sz: 11, italic: true, color: { rgb: P.WHITE } },
    fill: { fgColor: { rgb: GRADIENT[3] } }, alignment: { horizontal: "center", vertical: "center" }, border: noBdr,
  });
}

// ── Data types ──
export interface ProviderBooking {
  providerName: string;
  providerEmail: string;
  date: string;
  timeSlot: string;
  location: string;
  notes: string;
}

export interface WorkflowConfig {
  officeAgreementLink: string;
  onboardingCalendarLink: string;
  checkInFormLink: string;
  patientDirectionsLink: string;
  simplePracticeLink: string;
}

interface ProviderInfo {
  name: string;
  email: string;
}

// ── Hoboken sign-up data from the uploaded sheet ──
const HOBOKEN_BOOKINGS: { date: string; morning: string; afternoon: string; afterHours: string; notes: string }[] = [
  { date: "2026-03-19", morning: "Patricia McCabe till 12", afternoon: "", afterHours: "", notes: "" },
  { date: "2026-03-21", morning: "MICHAEL SANYA", afternoon: "", afterHours: "", notes: "10AM-2PM" },
  { date: "2026-04-18", morning: "MICHAEL SANYA", afternoon: "", afterHours: "", notes: "10AM-2PM" },
  { date: "2026-05-16", morning: "MICHAEL SANYA", afternoon: "", afterHours: "", notes: "10AM-2PM" },
  { date: "2026-06-13", morning: "MICHAEL SANYA", afternoon: "", afterHours: "", notes: "10AM-2PM" },
  { date: "2026-07-26", morning: "MICHAEL SANYA", afternoon: "", afterHours: "", notes: "10AM-2PM" },
];

const EDISON_BOOKINGS: { date: string; morning: string; afternoon: string; afterHours: string; notes: string }[] = [
  { date: "2026-03-28", morning: "MICHAEL SANYA", afternoon: "", afterHours: "", notes: "10AM-2PM" },
  { date: "2026-04-08", morning: "Galina Grapp", afternoon: "Galina Grapp", afterHours: "Galina Grapp", notes: "will work 8 am - 9 pm" },
  { date: "2026-04-22", morning: "GALINA GRAPP", afternoon: "GALINA GRAPP", afterHours: "galina grapp", notes: "will work 8 am - 9 pm" },
  { date: "2026-04-24", morning: "GALINA GRAPP", afternoon: "GALINA GRAPP", afterHours: "", notes: "work until 4 pm" },
  { date: "2026-04-25", morning: "MICHAEL SANYA", afternoon: "", afterHours: "", notes: "10AM-2PM" },
  { date: "2026-05-01", morning: "GALINA GRAPP", afternoon: "GALINA GRAPP", afterHours: "", notes: "work until 4 pm" },
  { date: "2026-05-06", morning: "GALINA GRAPP", afternoon: "GALINA GRAPP", afterHours: "GALINA GRAPP", notes: "will work 8 am - 9 pm" },
  { date: "2026-05-23", morning: "MICHAEL SANYA", afternoon: "", afterHours: "", notes: "10AM-2PM" },
  { date: "2026-06-20", morning: "MICHAEL SANYA", afternoon: "", afterHours: "", notes: "10AM-2PM" },
  { date: "2026-07-18", morning: "MICHAEL SANYA", afternoon: "", afterHours: "", notes: "10AM-2PM" },
];

// Generate date range from March 2026 to July 2026
function generateDateRange(): string[] {
  const dates: string[] = [];
  const start = new Date(2026, 2, 11); // March 11
  const end = new Date(2026, 6, 31); // July 31
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

function isIntakeDay(dateStr: string): boolean {
  const intakeDates = ["2026-03-13", "2026-03-20", "2026-03-27", "2026-04-03"];
  return intakeDates.includes(dateStr);
}

// ═══════════════════════════════════════════════════════
// TAB 1 & 2: SIGN-UP SHEETS
// ═══════════════════════════════════════════════════════
function createSignUpSheet(
  wb: XLSX.WorkBook,
  sheetName: string,
  location: string,
  address: string,
  bookings: typeof HOBOKEN_BOOKINGS,
  morningLabel: string,
  afternoonLabel: string,
) {
  const COLS = 6;
  const dates = generateDateRange();
  const rows: any[][] = [];

  // Gradient header (5 rows)
  for (let i = 0; i < 5; i++) rows.push(Array(COLS).fill(""));

  // Spacer
  rows.push(Array(COLS).fill(""));

  // Info row
  rows.push(["", `${location} Office  ·  ${address}`, "", "", "", ""]);
  rows.push(["", "Providers may continue seeing patients after 8:00 PM if needed.", "", "", "", ""]);
  rows.push(Array(COLS).fill(""));

  // Column headers
  const headerRow = rows.length;
  rows.push(["", "Date", morningLabel, afternoonLabel, "After 8 PM (Optional)", "Notes"]);

  // Date rows
  const dataStart = rows.length;
  dates.forEach(dateStr => {
    const booking = bookings.find(b => b.date === dateStr);
    const intake = isIntakeDay(dateStr);
    rows.push([
      "",
      formatDate(dateStr),
      booking?.morning || "",
      booking?.afternoon || "",
      booking?.afterHours || "",
      booking?.notes || (intake ? "INTAKE / TEAMWORK DAY" : ""),
    ]);
  });

  // Footer
  rows.push(Array(COLS).fill(""));
  const footerRow = rows.length;
  rows.push(["", "Orenda Psychiatry  ·  NJ In-Person Care Hub", "", "", "", ""]);
  rows.push(["", "347 Fifth Ave, Suite 1402-235, New York, NY 10016", "", "", "", ""]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 2 }, { wch: 18 }, { wch: 28 }, { wch: 28 }, { wch: 22 }, { wch: 28 }];

  // Merges
  ws["!merges"] = [
    { s: { r: 1, c: 1 }, e: { r: 1, c: 5 } },
    { s: { r: 2, c: 1 }, e: { r: 2, c: 5 } },
    { s: { r: 3, c: 1 }, e: { r: 3, c: 5 } },
    { s: { r: 6, c: 1 }, e: { r: 6, c: 5 } },
    { s: { r: 7, c: 1 }, e: { r: 7, c: 5 } },
    { s: { r: footerRow, c: 1 }, e: { r: footerRow, c: 5 } },
    { s: { r: footerRow + 1, c: 1 }, e: { r: footerRow + 1, c: 5 } },
  ];

  // Row heights
  ws["!rows"] = rows.map((_, i) => {
    if (i < 5) return { hpt: i === 2 ? 36 : 18 };
    if (i === headerRow) return { hpt: 28 };
    return { hpt: 22 };
  });

  // Gradient header
  addGradientHeader(ws, COLS, `Provider Sign-Up — ${location}`, address);

  // Info rows
  for (const r of [6, 7]) {
    fillRow(ws, r, COLS, {
      font: { name: "Calibri", sz: 10, color: { rgb: P.MUTED } },
      fill: { fgColor: { rgb: P.MIST } },
      alignment: { horizontal: "center", vertical: "center" },
      border: bdr(P.WASH),
    });
  }

  // Column headers
  for (let c = 0; c < COLS; c++) {
    const ref = XLSX.utils.encode_cell({ r: headerRow, c });
    if (!ws[ref]) ws[ref] = { t: "s", v: "" };
    ws[ref].s = c === 0
      ? { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr }
      : {
          font: { name: "Calibri", sz: 10, bold: true, color: { rgb: P.WHITE } },
          fill: { fgColor: { rgb: P.DARK } },
          alignment: { horizontal: "center", vertical: "center" },
          border: bdr(P.DARK),
        };
  }

  // Data rows
  dates.forEach((dateStr, i) => {
    const rowIdx = dataStart + i;
    const booking = bookings.find(b => b.date === dateStr);
    const intake = isIntakeDay(dateStr);
    const isEven = i % 2 === 0;
    const d = new Date(dateStr + "T12:00:00");
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    for (let c = 0; c < COLS; c++) {
      const ref = XLSX.utils.encode_cell({ r: rowIdx, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };

      if (c === 0) {
        ws[ref].s = { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr };
      } else if (isWeekend) {
        ws[ref].s = {
          font: { name: "Calibri", sz: 10, color: { rgb: P.MUTED }, italic: true },
          fill: { fgColor: { rgb: P.WASH } },
          alignment: { horizontal: c === 1 ? "left" : "center", vertical: "center" },
          border: bdr(P.LAVEN),
        };
      } else if (intake && c === 5) {
        ws[ref].s = {
          font: { name: "Calibri", sz: 9, bold: true, color: { rgb: P.AMBER_TX } },
          fill: { fgColor: { rgb: P.AMBER_BG } },
          alignment: { horizontal: "center", vertical: "center" },
          border: bdr(P.WASH),
        };
      } else if (booking && (c === 2 || c === 3 || c === 4) && ws[ref].v) {
        ws[ref].s = {
          font: { name: "Calibri", sz: 10, bold: true, color: { rgb: P.GREEN_TX } },
          fill: { fgColor: { rgb: P.GREEN_BG } },
          alignment: { horizontal: "center", vertical: "center" },
          border: bdr(P.WASH),
        };
      } else {
        ws[ref].s = {
          font: { name: "Calibri", sz: 10, color: { rgb: c === 1 ? P.TEXT : P.MUTED } },
          fill: { fgColor: { rgb: isEven ? P.WHITE : P.SNOW } },
          alignment: { horizontal: c === 1 ? "left" : "center", vertical: "center" },
          border: bdr(P.WASH),
        };
      }
    }
  });

  // Footer
  for (const r of [footerRow, footerRow + 1]) {
    fillRow(ws, r, COLS, {
      font: { name: "Calibri", sz: 9, italic: true, color: { rgb: P.MUTED } },
      fill: { fgColor: { rgb: P.MIST } },
      alignment: { horizontal: "center", vertical: "center" },
      border: bdr(P.WASH),
    });
  }

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
}

// ═══════════════════════════════════════════════════════
// TAB 3: WORKFLOW TRACKER
// ═══════════════════════════════════════════════════════
function createWorkflowTracker(wb: XLSX.WorkBook, bookings: ProviderBooking[], config: WorkflowConfig) {
  const COLS = 14;
  const rows: any[][] = [];

  for (let i = 0; i < 5; i++) rows.push(Array(COLS).fill(""));
  rows.push(Array(COLS).fill(""));

  // Description
  rows.push(["", "Track every step of the provider onboarding and office visit workflow", ...Array(COLS - 2).fill("")]);
  rows.push(Array(COLS).fill(""));

  const headerRow = rows.length;
  rows.push([
    "", "Provider", "Email", "Location", "Office Date", "Time Slot",
    "① Agreement Sent", "② Agreement Signed", "③ SP Booked",
    "④ Onboarding Scheduled", "⑤ Welcome Email Sent", "⑥ Patients Added",
    "⑦ Building Notified", "⑧ 90-Day Follow-Up",
  ]);

  const dataStart = rows.length;
  // Get unique providers from bookings
  const uniqueProviders = getUniqueProviders(bookings);
  uniqueProviders.forEach(provider => {
    const providerBookings = bookings.filter(b => b.providerName.toLowerCase() === provider.name.toLowerCase());
    providerBookings.forEach(b => {
      rows.push([
        "", provider.name, provider.email, b.location,
        formatDate(b.date), b.timeSlot,
        "☐", "☐", "☐", "☐", "☐", "☐", "☐", "☐",
      ]);
    });
  });

  if (uniqueProviders.length === 0) {
    rows.push(["", "(No bookings yet — providers will appear here once they sign up)", ...Array(COLS - 2).fill("")]);
  }

  rows.push(Array(COLS).fill(""));
  // Legend
  const legendStart = rows.length;
  rows.push(["", "WORKFLOW LEGEND", ...Array(COLS - 2).fill("")]);
  rows.push(["", "① Send office use agreement via Google Docs for e-signature", ...Array(COLS - 2).fill("")]);
  rows.push(["", "② Provider signs and returns the agreement", ...Array(COLS - 2).fill("")]);
  rows.push(["", "③ Book provider's availability in Simple Practice", ...Array(COLS - 2).fill("")]);
  rows.push(["", "④ Schedule onboarding via Google Calendar + send calendar invite", ...Array(COLS - 2).fill("")]);
  rows.push(["", "⑤ Send welcome email with office details, calendar, and Google Meet", ...Array(COLS - 2).fill("")]);
  rows.push(["", "⑥ Add patient bookings and send patient schedule to provider", ...Array(COLS - 2).fill("")]);
  rows.push(["", "⑦ Send patient list to Regus front desk by morning of day before visit", ...Array(COLS - 2).fill("")]);
  rows.push(["", "⑧ Schedule 90-day in-person follow-up and log in tracker", ...Array(COLS - 2).fill("")]);

  rows.push(Array(COLS).fill(""));
  // Links section
  const linksStart = rows.length;
  rows.push(["", "KEY LINKS & RESOURCES", ...Array(COLS - 2).fill("")]);
  rows.push(["", "Office Agreement:", config.officeAgreementLink || "(paste Google Docs link here)", ...Array(COLS - 3).fill("")]);
  rows.push(["", "Onboarding Calendar:", config.onboardingCalendarLink || "(paste Google Calendar link here)", ...Array(COLS - 3).fill("")]);
  rows.push(["", "Patient Check-In Form:", config.checkInFormLink || "(paste Google Forms link here)", ...Array(COLS - 3).fill("")]);
  rows.push(["", "Patient Directions:", config.patientDirectionsLink || "(paste link here)", ...Array(COLS - 3).fill("")]);
  rows.push(["", "Simple Practice:", config.simplePracticeLink || "(paste Simple Practice link here)", ...Array(COLS - 3).fill("")]);

  rows.push(Array(COLS).fill(""));
  const footerR = rows.length;
  rows.push(["", "Orenda Psychiatry  ·  347 Fifth Ave, Suite 1402-235, New York, NY 10016", ...Array(COLS - 2).fill("")]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [
    { wch: 2 }, { wch: 22 }, { wch: 28 }, { wch: 12 }, { wch: 16 }, { wch: 18 },
    { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 18 }, { wch: 18 },
  ];

  ws["!merges"] = [
    { s: { r: 1, c: 1 }, e: { r: 1, c: COLS - 1 } },
    { s: { r: 2, c: 1 }, e: { r: 2, c: COLS - 1 } },
    { s: { r: 3, c: 1 }, e: { r: 3, c: COLS - 1 } },
    { s: { r: 6, c: 1 }, e: { r: 6, c: COLS - 1 } },
    { s: { r: legendStart, c: 1 }, e: { r: legendStart, c: COLS - 1 } },
    { s: { r: linksStart, c: 1 }, e: { r: linksStart, c: COLS - 1 } },
    { s: { r: footerR, c: 1 }, e: { r: footerR, c: COLS - 1 } },
  ];
  for (let i = legendStart + 1; i <= legendStart + 8; i++) {
    ws["!merges"]!.push({ s: { r: i, c: 1 }, e: { r: i, c: COLS - 1 } });
  }
  for (let i = linksStart + 1; i <= linksStart + 5; i++) {
    ws["!merges"]!.push({ s: { r: i, c: 2 }, e: { r: i, c: COLS - 1 } });
  }

  ws["!rows"] = rows.map((_, i) => {
    if (i < 5) return { hpt: i === 2 ? 36 : 18 };
    if (i === headerRow) return { hpt: 28 };
    return { hpt: 24 };
  });

  addGradientHeader(ws, COLS, "Provider Onboarding Workflow", "Track every step from sign-up to 90-day follow-up");

  // Description
  fillRow(ws, 6, COLS, {
    font: { name: "Calibri", sz: 10, color: { rgb: P.MUTED }, italic: true },
    fill: { fgColor: { rgb: P.MIST } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.WASH),
  });

  // Column headers
  for (let c = 0; c < COLS; c++) {
    const ref = XLSX.utils.encode_cell({ r: headerRow, c });
    if (!ws[ref]) ws[ref] = { t: "s", v: "" };
    ws[ref].s = c === 0
      ? { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr }
      : {
          font: { name: "Calibri", sz: 9, bold: true, color: { rgb: P.WHITE } },
          fill: { fgColor: { rgb: P.DARK } },
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          border: bdr(P.DARK),
        };
  }

  // Data rows
  const rowCount = Math.max(uniqueProviders.length > 0 ? bookings.length : 1, 1);
  for (let i = 0; i < rowCount; i++) {
    const rowIdx = dataStart + i;
    const isEven = i % 2 === 0;
    for (let c = 0; c < COLS; c++) {
      const ref = XLSX.utils.encode_cell({ r: rowIdx, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };
      if (c === 0) {
        ws[ref].s = { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr };
      } else if (c >= 6) {
        // Checkbox columns
        ws[ref].s = {
          font: { name: "Calibri", sz: 14, color: { rgb: P.MUTED } },
          fill: { fgColor: { rgb: isEven ? P.WHITE : P.SNOW } },
          alignment: { horizontal: "center", vertical: "center" },
          border: bdr(P.WASH),
        };
      } else {
        ws[ref].s = {
          font: { name: "Calibri", sz: 10, color: { rgb: P.TEXT } },
          fill: { fgColor: { rgb: isEven ? P.WHITE : P.SNOW } },
          alignment: { horizontal: c === 1 ? "left" : "center", vertical: "center" },
          border: bdr(P.WASH),
        };
      }
    }
  }

  // Legend header
  fillRow(ws, legendStart, COLS, {
    font: { name: "Calibri", sz: 11, bold: true, color: { rgb: P.WHITE } },
    fill: { fgColor: { rgb: P.ACCENT } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.ACCENT),
  });
  for (let i = legendStart + 1; i <= legendStart + 8; i++) {
    fillRow(ws, i, COLS, {
      font: { name: "Calibri", sz: 10, color: { rgb: P.TEXT } },
      fill: { fgColor: { rgb: i % 2 === 0 ? P.MIST : P.SNOW } },
      alignment: { vertical: "center" },
      border: bdr(P.WASH),
    });
  }

  // Links section
  fillRow(ws, linksStart, COLS, {
    font: { name: "Calibri", sz: 11, bold: true, color: { rgb: P.WHITE } },
    fill: { fgColor: { rgb: P.MED } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.MED),
  });
  for (let i = linksStart + 1; i <= linksStart + 5; i++) {
    for (let c = 0; c < COLS; c++) {
      const ref = XLSX.utils.encode_cell({ r: i, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };
      ws[ref].s = c === 1
        ? {
            font: { name: "Calibri", sz: 10, bold: true, color: { rgb: P.DARK } },
            fill: { fgColor: { rgb: P.MIST } },
            alignment: { horizontal: "right", vertical: "center" },
            border: bdr(P.WASH),
          }
        : {
            font: { name: "Calibri", sz: 10, color: { rgb: P.BLUE_TX } },
            fill: { fgColor: { rgb: P.MIST } },
            alignment: { vertical: "center" },
            border: bdr(P.WASH),
          };
    }
  }

  // Footer
  fillRow(ws, footerR, COLS, {
    font: { name: "Calibri", sz: 9, italic: true, color: { rgb: P.MUTED } },
    fill: { fgColor: { rgb: P.MIST } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.WASH),
  });

  XLSX.utils.book_append_sheet(wb, ws, "Workflow Tracker");
}

// ═══════════════════════════════════════════════════════
// TAB 4: PATIENT SCHEDULE (per provider/date)
// ═══════════════════════════════════════════════════════
function createPatientSchedule(wb: XLSX.WorkBook, bookings: ProviderBooking[]) {
  const COLS = 8;
  const timeSlots = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM",
  ];

  const rows: any[][] = [];
  for (let i = 0; i < 5; i++) rows.push(Array(COLS).fill(""));
  rows.push(Array(COLS).fill(""));

  // Instructions
  rows.push(["", "Fill in patient names for each provider's office day. One row per 30-minute slot.", ...Array(COLS - 2).fill("")]);
  rows.push(Array(COLS).fill(""));

  // Create a section per booked provider
  const providers = getUniqueProviders(bookings);
  let currentRow = rows.length;

  if (providers.length === 0) {
    // Empty template
    const headerRow = rows.length;
    rows.push(["", "Provider:", "(Enter Name)", "Date:", "(Enter Date)", "Location:", "(Enter Location)", ""]);
    rows.push(Array(COLS).fill(""));
    const thRow = rows.length;
    rows.push(["", "Time", "Patient Name", "Visit Type", "Duration", "Status", "Check-In", "Notes"]);
    timeSlots.forEach(t => {
      rows.push(["", t, "", "", "30 min", "", "☐", ""]);
    });
    rows.push(Array(COLS).fill(""));
  } else {
    providers.forEach(prov => {
      const provBookings = bookings.filter(b => b.providerName.toLowerCase() === prov.name.toLowerCase());
      provBookings.forEach(b => {
        rows.push(["", `Provider: ${prov.name}`, "", `Date: ${formatDate(b.date)}`, "", `Location: ${b.location}`, "", ""]);
        rows.push(Array(COLS).fill(""));
        rows.push(["", "Time", "Patient Name", "Visit Type", "Duration", "Status", "Check-In", "Notes"]);
        timeSlots.forEach(t => {
          rows.push(["", t, "", "", "30 min", "", "☐", ""]);
        });
        rows.push(Array(COLS).fill(""));
        rows.push(Array(COLS).fill(""));
      });
    });
  }

  // Footer
  const footerR = rows.length;
  rows.push(["", "Orenda Psychiatry  ·  347 Fifth Ave, Suite 1402-235, New York, NY 10016", ...Array(COLS - 2).fill("")]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 2 }, { wch: 12 }, { wch: 24 }, { wch: 20 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 28 }];

  ws["!merges"] = [
    { s: { r: 1, c: 1 }, e: { r: 1, c: COLS - 1 } },
    { s: { r: 2, c: 1 }, e: { r: 2, c: COLS - 1 } },
    { s: { r: 3, c: 1 }, e: { r: 3, c: COLS - 1 } },
    { s: { r: 6, c: 1 }, e: { r: 6, c: COLS - 1 } },
    { s: { r: footerR, c: 1 }, e: { r: footerR, c: COLS - 1 } },
  ];

  ws["!rows"] = rows.map((_, i) => {
    if (i < 5) return { hpt: i === 2 ? 36 : 18 };
    return { hpt: 22 };
  });

  addGradientHeader(ws, COLS, "Patient Schedule", "Fill in patients for each provider office day");

  // Style all rows
  for (let r = 6; r < rows.length; r++) {
    const rowData = rows[r];
    if (!rowData) continue;

    // Check if this is a provider info row
    const cellVal = String(rowData[1] || "");
    const isProviderRow = cellVal.startsWith("Provider:");
    const isHeaderRow = cellVal === "Time";
    const isTimeRow = /^\d{1,2}:\d{2}\s(AM|PM)$/.test(cellVal);
    const isEmpty = rowData.every((v: any) => !v);

    for (let c = 0; c < COLS; c++) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };

      if (c === 0) {
        ws[ref].s = { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr };
      } else if (isProviderRow) {
        ws[ref].s = {
          font: { name: "Calibri", sz: 11, bold: true, color: { rgb: P.WHITE } },
          fill: { fgColor: { rgb: P.MED } },
          alignment: { horizontal: "center", vertical: "center" },
          border: bdr(P.MED),
        };
      } else if (isHeaderRow) {
        ws[ref].s = {
          font: { name: "Calibri", sz: 10, bold: true, color: { rgb: P.WHITE } },
          fill: { fgColor: { rgb: P.DARK } },
          alignment: { horizontal: "center", vertical: "center" },
          border: bdr(P.DARK),
        };
      } else if (isTimeRow) {
        const isEven = (r % 2 === 0);
        ws[ref].s = {
          font: { name: "Calibri", sz: 10, color: { rgb: c === 1 ? P.TEXT : P.MUTED } },
          fill: { fgColor: { rgb: isEven ? P.WHITE : P.SNOW } },
          alignment: { horizontal: c === 1 || c === 5 || c === 6 ? "center" : "left", vertical: "center" },
          border: bdr(P.WASH),
        };
      } else if (isEmpty) {
        ws[ref].s = { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr };
      } else if (r === footerR) {
        ws[ref].s = {
          font: { name: "Calibri", sz: 9, italic: true, color: { rgb: P.MUTED } },
          fill: { fgColor: { rgb: P.MIST } },
          alignment: { horizontal: "center", vertical: "center" },
          border: bdr(P.WASH),
        };
      }
    }
  }

  // Description row
  fillRow(ws, 6, COLS, {
    font: { name: "Calibri", sz: 10, color: { rgb: P.MUTED }, italic: true },
    fill: { fgColor: { rgb: P.MIST } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.WASH),
  });

  XLSX.utils.book_append_sheet(wb, ws, "Patient Schedule");
}

// ═══════════════════════════════════════════════════════
// TAB 5: BUILDING SEND LIST
// ═══════════════════════════════════════════════════════
function createBuildingSendList(wb: XLSX.WorkBook, bookings: ProviderBooking[]) {
  const COLS = 9;
  const rows: any[][] = [];

  for (let i = 0; i < 5; i++) rows.push(Array(COLS).fill(""));
  rows.push(Array(COLS).fill(""));

  rows.push(["", "Send this list to the Regus front desk by 9:00 AM the day before the provider's visit.", ...Array(COLS - 2).fill("")]);
  rows.push(["", "Double-check by 7:00 PM the evening before. Notify building of any same-day changes.", ...Array(COLS - 2).fill("")]);
  rows.push(Array(COLS).fill(""));

  const headerRow = rows.length;
  rows.push(["", "Provider", "Office Date", "Location", "Patient Name", "Appointment Time", "Visit Type", "Sent to Building", "Notes"]);

  const dataStart = rows.length;
  // Create sample rows for each booked provider
  const providers = getUniqueProviders(bookings);
  if (providers.length === 0) {
    for (let i = 0; i < 5; i++) {
      rows.push(["", "", "", "", "", "", "", "☐", ""]);
    }
  } else {
    bookings.forEach(b => {
      // 3 patient placeholder rows per booking
      for (let p = 0; p < 3; p++) {
        rows.push(["", b.providerName, formatDate(b.date), b.location, "", "", "", "☐", ""]);
      }
    });
  }

  rows.push(Array(COLS).fill(""));
  // Quick ref
  const qrStart = rows.length;
  rows.push(["", "BUILDING CONTACTS", ...Array(COLS - 2).fill("")]);
  rows.push(["", "Hoboken — Regus Riverfront:", "Hoboken.Riverfront@regus.com", "(201) 721-8500", ...Array(COLS - 4).fill("")]);
  rows.push(["", "Edison — Regus:", "(contact info here)", "", ...Array(COLS - 4).fill("")]);

  rows.push(Array(COLS).fill(""));
  // Deadline banner
  const deadlineRow = rows.length;
  rows.push(["", "⚠️  DEADLINE: Send by 9:00 AM the day before  ·  Confirm by 7:00 PM evening before", ...Array(COLS - 2).fill("")]);

  rows.push(Array(COLS).fill(""));
  const footerR = rows.length;
  rows.push(["", "Orenda Psychiatry  ·  347 Fifth Ave, Suite 1402-235, New York, NY 10016", ...Array(COLS - 2).fill("")]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [
    { wch: 2 }, { wch: 22 }, { wch: 16 }, { wch: 12 }, { wch: 24 }, { wch: 16 }, { wch: 18 }, { wch: 14 }, { wch: 24 },
  ];

  ws["!merges"] = [
    { s: { r: 1, c: 1 }, e: { r: 1, c: COLS - 1 } },
    { s: { r: 2, c: 1 }, e: { r: 2, c: COLS - 1 } },
    { s: { r: 3, c: 1 }, e: { r: 3, c: COLS - 1 } },
    { s: { r: 6, c: 1 }, e: { r: 6, c: COLS - 1 } },
    { s: { r: 7, c: 1 }, e: { r: 7, c: COLS - 1 } },
    { s: { r: qrStart, c: 1 }, e: { r: qrStart, c: COLS - 1 } },
    { s: { r: deadlineRow, c: 1 }, e: { r: deadlineRow, c: COLS - 1 } },
    { s: { r: footerR, c: 1 }, e: { r: footerR, c: COLS - 1 } },
  ];

  ws["!rows"] = rows.map((_, i) => {
    if (i < 5) return { hpt: i === 2 ? 36 : 18 };
    if (i === headerRow) return { hpt: 28 };
    if (i === deadlineRow) return { hpt: 32 };
    return { hpt: 22 };
  });

  addGradientHeader(ws, COLS, "Building Send List", "Patient lists for Regus front desk notification");

  // Instructions
  for (const r of [6, 7]) {
    fillRow(ws, r, COLS, {
      font: { name: "Calibri", sz: 10, color: { rgb: P.MUTED }, italic: true },
      fill: { fgColor: { rgb: P.MIST } },
      alignment: { horizontal: "center", vertical: "center" },
      border: bdr(P.WASH),
    });
  }

  // Column headers
  for (let c = 0; c < COLS; c++) {
    const ref = XLSX.utils.encode_cell({ r: headerRow, c });
    if (!ws[ref]) ws[ref] = { t: "s", v: "" };
    ws[ref].s = c === 0
      ? { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr }
      : {
          font: { name: "Calibri", sz: 10, bold: true, color: { rgb: P.WHITE } },
          fill: { fgColor: { rgb: P.DARK } },
          alignment: { horizontal: "center", vertical: "center" },
          border: bdr(P.DARK),
        };
  }

  // Data rows
  const totalDataRows = rows.length - dataStart - 6; // rough count
  for (let i = 0; i < totalDataRows; i++) {
    const rowIdx = dataStart + i;
    if (rowIdx >= rows.length) break;
    const isEven = i % 2 === 0;
    for (let c = 0; c < COLS; c++) {
      const ref = XLSX.utils.encode_cell({ r: rowIdx, c });
      if (!ws[ref]) continue;
      if (c === 0) {
        ws[ref].s = { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr };
      } else if (c === 7) {
        ws[ref].s = {
          font: { name: "Calibri", sz: 14, color: { rgb: P.MUTED } },
          fill: { fgColor: { rgb: isEven ? P.WHITE : P.SNOW } },
          alignment: { horizontal: "center", vertical: "center" },
          border: bdr(P.WASH),
        };
      } else {
        ws[ref].s = {
          font: { name: "Calibri", sz: 10, color: { rgb: P.TEXT } },
          fill: { fgColor: { rgb: isEven ? P.WHITE : P.SNOW } },
          alignment: { horizontal: "center", vertical: "center" },
          border: bdr(P.WASH),
        };
      }
    }
  }

  // Quick ref header
  fillRow(ws, qrStart, COLS, {
    font: { name: "Calibri", sz: 11, bold: true, color: { rgb: P.WHITE } },
    fill: { fgColor: { rgb: P.ACCENT } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.ACCENT),
  });
  for (let i = qrStart + 1; i <= qrStart + 2; i++) {
    fillRow(ws, i, COLS, {
      font: { name: "Calibri", sz: 10, color: { rgb: P.TEXT } },
      fill: { fgColor: { rgb: P.MIST } },
      alignment: { vertical: "center" },
      border: bdr(P.WASH),
    });
  }

  // Deadline banner
  fillRow(ws, deadlineRow, COLS, {
    font: { name: "Calibri", sz: 12, bold: true, color: { rgb: P.AMBER_TX } },
    fill: { fgColor: { rgb: P.AMBER_BG } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.AMBER_TX),
  });

  // Footer
  fillRow(ws, footerR, COLS, {
    font: { name: "Calibri", sz: 9, italic: true, color: { rgb: P.MUTED } },
    fill: { fgColor: { rgb: P.MIST } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.WASH),
  });

  XLSX.utils.book_append_sheet(wb, ws, "Building Send List");
}

// ═══════════════════════════════════════════════════════
// TAB 6: EMAIL TEMPLATES
// ═══════════════════════════════════════════════════════
function createEmailTemplates(wb: XLSX.WorkBook, config: WorkflowConfig) {
  const COLS = 3;
  const rows: any[][] = [];

  for (let i = 0; i < 5; i++) rows.push(Array(COLS).fill(""));
  rows.push(Array(COLS).fill(""));

  const emails = [
    {
      name: "① WELCOME / ONBOARDING EMAIL",
      subject: "Welcome to Our Hoboken Office — Onboarding Details",
      from: "Susie Levitt <susie@orendapsych.com>",
      body: `Hi (Provider Name),

Thank you so much for booking your first stay at our New Jersey office — we're thrilled to have you! 🎉

Here's everything you need to know to get started:

📅 ONBOARDING TIME
I've booked your onboarding for (Date) at (Time). A Google Calendar invite with a Google Meet link has been sent to you.

📋 OFFICE AGREEMENT
Before your first visit, please review and sign the office use agreement:
${config.officeAgreementLink || "(paste Google Docs link here)"}

📝 SIMPLE PRACTICE
I've blocked off your availability in Simple Practice for (Date). Your patient calendar will be shared once patients are booked.

🔒 BUILDING ACCESS
I will add your patients to the security desk so they have smooth access. No action needed from you.

🗺️ PATIENT DIRECTIONS
Your patients will receive detailed directions to the office, including building entry, floor access, and what to expect.

OFFICE LOCATION
Regus — Riverfront Center
221 River Street, 9th Floor, Unit 9076
Hoboken, NJ 07030

QUICK REFERENCE
• Regus Front Desk: 9th Floor, Mon–Fri 9 AM – 5 PM
• Front Desk Email: Hoboken.Riverfront@regus.com
• Building Phone: (201) 721-8500
• Wi-Fi: Regus Net Wi-Fi / Password: 167845630

Warmly,
Susie Levitt
(203) 313-3074
susie@orendapsych.com`,
    },
    {
      name: "② OFFICE AGREEMENT EMAIL (Google Docs)",
      subject: "Office Use Agreement — Please Sign",
      from: "Susie Levitt <susie@arendapsych.com>",
      body: `Hi (Provider Name),

Thank you so much for booking the New Jersey offices! 

I've added some time on your Simple Practice calendar, and we'll be sending you a Google Meet invite very soon to help with your onboarding for the New Jersey offices and give you everything you need to set you up for success.

In the meantime, here is the office agreement. If you could please kindly sign that, that would be great:
${config.officeAgreementLink || "(paste Google Docs link here)"}

Thank you so much!

Warmly,
Susie Levitt
(203) 313-3074
susie@arendapsych.com`,
    },
    {
      name: "③ OFFICE AGREEMENT REMINDER",
      subject: "Reminder: Please Sign Your Office Use Agreement",
      from: "Susie Levitt <susie@orendapsych.com>",
      body: `Hi (Provider Name),

Just a friendly reminder to review and sign the Office Use Agreement before your first visit on (Date):
${config.officeAgreementLink || "(paste Google Docs link here)"}

This covers office policies, access guidelines, and expectations for using the space. Please let me know if you have any questions!

Warmly,
Susie Levitt
(203) 313-3074
susie@arendapsych.com`,
    },
    {
      name: "③ PATIENT NOTIFICATION EMAIL",
      subject: "Your Upcoming In-Person Appointment at Orenda Psychiatry",
      from: "Orenda Psychiatry <admin@orendapsych.com>",
      body: `Hi (Patient Name),

This is a confirmation that you have an upcoming in-person appointment:

📅 Date: (Appointment Date)
⏰ Time: (Appointment Time)
👨‍⚕️ Provider: (Provider Name)
📍 Location: (Office Address)

IMPORTANT — PLEASE ARRIVE 15 MINUTES EARLY

When you arrive:
1. Enter at the main entrance
2. Take the elevator to the 9th floor
3. Check in at the Regus front desk
4. Let them know you're here for Orenda Psychiatry

On the day of your visit, please check in using this link:
${config.checkInFormLink || "(check-in form link will go here)"}

For detailed directions: ${config.patientDirectionsLink || "(directions link will go here)"}

If you need to reschedule, please contact us at:
📞 (347) 707-7735
📧 admin@orendapsych.com

We look forward to seeing you!

Orenda Psychiatry
(347) 707-7735 · admin@orendapsych.com`,
    },
    {
      name: "④ PATIENT NOTIFICATION TEXT (SMS)",
      subject: "(Copy & paste into Spruce)",
      from: "Orenda Admin via Spruce",
      body: `Hi (Patient Name)! This is a reminder of your upcoming in-person visit at Orenda Psychiatry.

📅 (Date) at (Time)
👨‍⚕️ Provider: (Provider Name)
📍 (Office Address)

Please arrive 15 minutes early. Check in here when you arrive: ${config.checkInFormLink || "(link)"}

Directions: ${config.patientDirectionsLink || "(link)"}

Questions? Call (347) 707-7735 or email admin@orendapsych.com`,
    },
    {
      name: "⑤ 24-HOUR REMINDER EMAIL",
      subject: "Reminder: Your In-Person Visit Tomorrow",
      from: "Orenda Psychiatry <admin@orendapsych.com>",
      body: `Hi (Patient Name),

This is a friendly reminder that your in-person appointment is tomorrow:

📅 Date: (Appointment Date)
⏰ Time: (Appointment Time)
👨‍⚕️ Provider: (Provider Name)
📍 Location: (Office Address)

Remember to:
✅ Arrive 15 minutes early
✅ Bring a valid photo ID
✅ Check in when you arrive: ${config.checkInFormLink || "(link)"}

For directions: ${config.patientDirectionsLink || "(link)"}

Need to reschedule? Contact us ASAP:
📞 (347) 707-7735
📧 admin@orendapsych.com

See you tomorrow!
Orenda Psychiatry`,
    },
    {
      name: "⑥ 24-HOUR REMINDER TEXT (SMS)",
      subject: "(Copy & paste into Spruce)",
      from: "Orenda Admin via Spruce",
      body: `Hi (Patient Name)! Reminder: your in-person visit is TOMORROW.

📅 (Date) at (Time)
👨‍⚕️ (Provider Name) at (Location)

Arrive 15 min early. Check in: ${config.checkInFormLink || "(link)"}

Questions? (347) 707-7735`,
    },
    {
      name: "⑦ POST-VISIT FOLLOW-UP EMAIL",
      subject: "Thank You for Your Visit — Next Steps",
      from: "Orenda Psychiatry <admin@orendapsych.com>",
      body: `Hi (Patient Name),

Thank you for coming in for your visit with (Provider Name) today. We hope everything went well!

NEXT STEPS:
📞 Your follow-up telehealth appointment has been scheduled for (Follow-Up Date).
📅 Your next in-person visit is due within 90 days (by (90-Day Date)).

If you need to make any changes, please contact us:
📞 (347) 707-7735
📧 admin@orendapsych.com

Take care,
Orenda Psychiatry`,
    },
    {
      name: "⑧ 90-DAY IN-PERSON REMINDER",
      subject: "Time to Schedule Your Next In-Person Visit",
      from: "Orenda Psychiatry <admin@orendapsych.com>",
      body: `Hi (Patient Name),

It's been close to 90 days since your last in-person visit with (Provider Name) on (Last Visit Date).

Per New Jersey regulations, patients receiving Schedule II prescriptions must be seen in person at least once every 90 days.

Please book your next visit by (Deadline Date) to ensure continuity of care.

To schedule: Contact us at (347) 707-7735 or admin@orendapsych.com

Orenda Psychiatry
(347) 707-7735 · admin@orendapsych.com`,
    },
  ];

  emails.forEach((email, idx) => {
    const sectionStart = rows.length;
    rows.push(["", email.name, ""]);
    rows.push(["", "Subject:", email.subject]);
    rows.push(["", "From:", email.from]);
    rows.push(["", "", ""]);
    
    // Split body into lines
    const lines = email.body.split("\n");
    lines.forEach(line => {
      rows.push(["", "", line]);
    });
    rows.push(["", "", ""]);
    rows.push(["", "─────────────────────────────────────────", ""]);
    rows.push(["", "", ""]);
  });

  const footerR = rows.length;
  rows.push(["", "Orenda Psychiatry  ·  347 Fifth Ave, Suite 1402-235, New York, NY 10016", ""]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 2 }, { wch: 24 }, { wch: 80 }];

  ws["!merges"] = [
    { s: { r: 1, c: 1 }, e: { r: 1, c: 2 } },
    { s: { r: 2, c: 1 }, e: { r: 2, c: 2 } },
    { s: { r: 3, c: 1 }, e: { r: 3, c: 2 } },
    { s: { r: footerR, c: 1 }, e: { r: footerR, c: 2 } },
  ];

  ws["!rows"] = rows.map((_, i) => {
    if (i < 5) return { hpt: i === 2 ? 36 : 18 };
    return { hpt: 18 };
  });

  addGradientHeader(ws, COLS, "Email & SMS Templates", "All communication templates for the provider workflow");

  // Style email sections
  for (let r = 5; r < rows.length; r++) {
    const rowData = rows[r];
    if (!rowData) continue;
    const label = String(rowData[1] || "");
    
    for (let c = 0; c < COLS; c++) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };

      if (c === 0) {
        ws[ref].s = { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr };
      } else if (label.match(/^[①②③④⑤⑥⑦⑧]/)) {
        ws[ref].s = {
          font: { name: "Calibri", sz: 12, bold: true, color: { rgb: P.WHITE } },
          fill: { fgColor: { rgb: P.MED } },
          alignment: { vertical: "center" },
          border: bdr(P.MED),
        };
      } else if (label === "Subject:" || label === "From:") {
        ws[ref].s = c === 1
          ? {
              font: { name: "Calibri", sz: 10, bold: true, color: { rgb: P.DARK } },
              fill: { fgColor: { rgb: P.MIST } },
              alignment: { horizontal: "right", vertical: "center" },
              border: bdr(P.WASH),
            }
          : {
              font: { name: "Calibri", sz: 10, color: { rgb: P.TEXT } },
              fill: { fgColor: { rgb: P.MIST } },
              alignment: { vertical: "center" },
              border: bdr(P.WASH),
            };
      } else if (label.includes("─────")) {
        ws[ref].s = {
          font: { name: "Calibri", sz: 8, color: { rgb: P.LAVEN } },
          fill: { fgColor: { rgb: P.WHITE } },
          alignment: { horizontal: "center" },
          border: noBdr,
        };
      } else if (r === footerR) {
        ws[ref].s = {
          font: { name: "Calibri", sz: 9, italic: true, color: { rgb: P.MUTED } },
          fill: { fgColor: { rgb: P.MIST } },
          alignment: { horizontal: "center", vertical: "center" },
          border: bdr(P.WASH),
        };
      } else {
        ws[ref].s = {
          font: { name: "Calibri", sz: 10, color: { rgb: P.TEXT } },
          fill: { fgColor: { rgb: P.WHITE } },
          alignment: { vertical: "top", wrapText: true },
          border: noBdr,
        };
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, "Email Templates");
}

// ═══════════════════════════════════════════════════════
// TAB 7: PROVIDER DIRECTORY
// ═══════════════════════════════════════════════════════
function createProviderDirectory(wb: XLSX.WorkBook, providers: ProviderInfo[]) {
  const COLS = 5;
  const rows: any[][] = [];

  for (let i = 0; i < 5; i++) rows.push(Array(COLS).fill(""));
  rows.push(Array(COLS).fill(""));

  const headerRow = rows.length;
  rows.push(["", "Provider Name", "Email", "Status", "Notes"]);

  const dataStart = rows.length;
  if (providers.length > 0) {
    providers.forEach(p => {
      rows.push(["", p.name, p.email, "Active", ""]);
    });
  } else {
    rows.push(["", "(Add providers here)", "", "", ""]);
  }

  rows.push(Array(COLS).fill(""));
  const footerR = rows.length;
  rows.push(["", "Orenda Psychiatry  ·  347 Fifth Ave, Suite 1402-235, New York, NY 10016", "", "", ""]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 2 }, { wch: 28 }, { wch: 32 }, { wch: 14 }, { wch: 30 }];

  ws["!merges"] = [
    { s: { r: 1, c: 1 }, e: { r: 1, c: COLS - 1 } },
    { s: { r: 2, c: 1 }, e: { r: 2, c: COLS - 1 } },
    { s: { r: 3, c: 1 }, e: { r: 3, c: COLS - 1 } },
    { s: { r: footerR, c: 1 }, e: { r: footerR, c: COLS - 1 } },
  ];

  ws["!rows"] = rows.map((_, i) => {
    if (i < 5) return { hpt: i === 2 ? 36 : 18 };
    return { hpt: 24 };
  });

  addGradientHeader(ws, COLS, "Provider Directory", "Contact information for all providers");

  for (let c = 0; c < COLS; c++) {
    const ref = XLSX.utils.encode_cell({ r: headerRow, c });
    if (!ws[ref]) ws[ref] = { t: "s", v: "" };
    ws[ref].s = c === 0
      ? { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr }
      : {
          font: { name: "Calibri", sz: 10, bold: true, color: { rgb: P.WHITE } },
          fill: { fgColor: { rgb: P.DARK } },
          alignment: { horizontal: "center", vertical: "center" },
          border: bdr(P.DARK),
        };
  }

  for (let i = 0; i < Math.max(providers.length, 1); i++) {
    const rowIdx = dataStart + i;
    const isEven = i % 2 === 0;
    for (let c = 0; c < COLS; c++) {
      const ref = XLSX.utils.encode_cell({ r: rowIdx, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };
      ws[ref].s = c === 0
        ? { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr }
        : {
            font: { name: "Calibri", sz: 10, color: { rgb: c === 3 ? P.GREEN_TX : P.TEXT } },
            fill: { fgColor: { rgb: c === 3 ? P.GREEN_BG : (isEven ? P.WHITE : P.SNOW) } },
            alignment: { horizontal: "center", vertical: "center" },
            border: bdr(P.WASH),
          };
    }
  }

  fillRow(ws, footerR, COLS, {
    font: { name: "Calibri", sz: 9, italic: true, color: { rgb: P.MUTED } },
    fill: { fgColor: { rgb: P.MIST } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.WASH),
  });

  XLSX.utils.book_append_sheet(wb, ws, "Provider Directory");
}

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
function getUniqueProviders(bookings: ProviderBooking[]): ProviderInfo[] {
  const map = new Map<string, ProviderInfo>();
  bookings.forEach(b => {
    const key = b.providerName.toLowerCase().trim();
    if (key && !map.has(key)) {
      map.set(key, { name: b.providerName, email: b.providerEmail });
    }
  });
  return Array.from(map.values());
}

function extractBookingsFromSheetData(): ProviderBooking[] {
  const bookings: ProviderBooking[] = [];

  const processBookings = (source: typeof HOBOKEN_BOOKINGS, location: string) => {
    source.forEach(b => {
      const slots = [
        { name: b.morning, slot: location === "Hoboken" ? "8:00 AM – 3:00 PM" : "8:00 AM – 2:00 PM" },
        { name: b.afternoon, slot: location === "Hoboken" ? "3:00 PM – 8:00 PM" : "2:00 PM – 8:00 PM" },
        { name: b.afterHours, slot: "After 8:00 PM" },
      ];
      slots.forEach(s => {
        if (s.name && s.name.trim()) {
          bookings.push({
            providerName: s.name.trim(),
            providerEmail: "",
            date: b.date,
            timeSlot: s.slot,
            location,
            notes: b.notes,
          });
        }
      });
    });
  };

  processBookings(HOBOKEN_BOOKINGS, "Hoboken");
  processBookings(EDISON_BOOKINGS, "Edison");
  return bookings;
}

// ═══════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════
export function downloadProviderOpsWorkbook(
  config: WorkflowConfig,
  dbProviders: ProviderInfo[] = [],
) {
  const wb = XLSX.utils.book_new();
  const bookings = extractBookingsFromSheetData();

  // Match provider emails from database
  bookings.forEach(b => {
    const match = dbProviders.find(p => p.name.toLowerCase() === b.providerName.toLowerCase());
    if (match) b.providerEmail = match.email;
  });

  // Tab 1: Hoboken Sign-Up
  createSignUpSheet(wb, "Hoboken Sign-Up", "Hoboken", "221 River Street, 9th Floor, Office #9076", HOBOKEN_BOOKINGS, "8:00 AM – 3:00 PM Provider", "3:00 PM – 8:00 PM Provider");

  // Tab 2: Edison Sign-Up
  createSignUpSheet(wb, "Edison Sign-Up", "Edison", "11 Field Crest Ave, 3rd Floor, Office #328", EDISON_BOOKINGS, "8:00 AM – 2:00 PM Provider", "2:00 PM – 8:00 PM Provider");

  // Tab 3: Workflow Tracker
  createWorkflowTracker(wb, bookings, config);

  // Tab 4: Patient Schedule
  createPatientSchedule(wb, bookings);

  // Tab 5: Building Send List
  createBuildingSendList(wb, bookings);

  // Tab 6: Email Templates
  createEmailTemplates(wb, config);

  // Tab 7: Provider Directory
  createProviderDirectory(wb, dbProviders);

  XLSX.writeFile(wb, "Orenda_Provider_Ops_Workbook.xlsx");
}
