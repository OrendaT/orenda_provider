import * as XLSX from "xlsx-js-style";

// ── Brand Palette (matches workbook) ──
const P = {
  DEEP: "2D1B4E", DARK: "462D6D", MED: "6B4FA0", ACCENT: "8B6FC0",
  SOFT: "A78BDA", LAVEN: "C4B5DC", WASH: "E8E0F0", MIST: "F0EBF5",
  SNOW: "F8F6FB", WHITE: "FFFFFF", TEXT: "1A1A2E", MUTED: "6B6B80",
  BORDER: "D4CCE6",
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

export interface BookedDate {
  date: string;       // e.g. "Saturday, March 21, 2026"
  location: string;   // e.g. "Hoboken" or "Edison"
  timeBlock?: string;  // e.g. "10 AM – 2 PM" or "Full Day (8 AM – 9 PM)"
}

export interface PatientScheduleConfig {
  providerName: string;
  bookedDates: BookedDate[];
}

export function downloadPatientScheduleXlsx(config: PatientScheduleConfig) {
  const wb = XLSX.utils.book_new();
  const COLS = 7;

  // Columns: (gutter) | Patient Name | Appointment Time | Visit Type | Status | Check-In | Notes
  const COL_HEADERS = ["", "Patient Name", "Appointment Time", "Visit Type", "Status", "Check-In", "Notes"];

  const rows: any[][] = [];

  // ── Gradient header (5 rows) ──
  for (let i = 0; i < 5; i++) rows.push(Array(COLS).fill(""));

  // Spacer
  rows.push(Array(COLS).fill(""));

  // Instructions
  rows.push(["", "Fill in patient names for each office day. Leave blank rows for walk-ins or additions.", ...Array(COLS - 2).fill("")]);
  rows.push(Array(COLS).fill(""));

  // ── Per-date sections ──
  const sectionMeta: { providerRow: number; headerRow: number; dataStart: number; dataEnd: number }[] = [];

  config.bookedDates.forEach((bd) => {
    const providerRow = rows.length;
    rows.push(["", `${config.providerName}`, "", `${bd.date}`, "", `${bd.location}${bd.timeBlock ? "  ·  " + bd.timeBlock : ""}`, ""]);

    rows.push(Array(COLS).fill(""));

    const headerRow = rows.length;
    rows.push(COL_HEADERS);

    // 8 blank patient rows per date
    const dataStart = rows.length;
    for (let i = 0; i < 8; i++) {
      rows.push(["", "", "", "", "", "☐", ""]);
    }
    const dataEnd = rows.length - 1;

    sectionMeta.push({ providerRow, headerRow, dataStart, dataEnd });

    // Spacer between sections
    rows.push(Array(COLS).fill(""));
    rows.push(Array(COLS).fill(""));
  });

  // Footer
  const footerR = rows.length;
  rows.push(["", "Orenda Psychiatry  ·  New Jersey Offices", ...Array(COLS - 2).fill("")]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  ws["!cols"] = [
    { wch: 2 },   // gutter
    { wch: 26 },  // Patient Name
    { wch: 20 },  // Appointment Time
    { wch: 20 },  // Visit Type
    { wch: 14 },  // Status
    { wch: 12 },  // Check-In
    { wch: 30 },  // Notes
  ];

  // Merges for gradient header
  const merges: XLSX.Range[] = [
    { s: { r: 1, c: 1 }, e: { r: 1, c: COLS - 1 } },
    { s: { r: 2, c: 1 }, e: { r: 2, c: COLS - 1 } },
    { s: { r: 3, c: 1 }, e: { r: 3, c: COLS - 1 } },
    { s: { r: 6, c: 1 }, e: { r: 6, c: COLS - 1 } },
    { s: { r: footerR, c: 1 }, e: { r: footerR, c: COLS - 1 } },
  ];

  // Merges for each provider row (provider name cols 1-2, date cols 3-4, location cols 5-6)
  sectionMeta.forEach(({ providerRow }) => {
    merges.push({ s: { r: providerRow, c: 1 }, e: { r: providerRow, c: 2 } });
    merges.push({ s: { r: providerRow, c: 3 }, e: { r: providerRow, c: 4 } });
    merges.push({ s: { r: providerRow, c: 5 }, e: { r: providerRow, c: 6 } });
  });

  ws["!merges"] = merges;

  // Row heights
  ws["!rows"] = rows.map((_, i) => {
    if (i < 5) return { hpt: i === 2 ? 36 : 18 };
    return { hpt: 22 };
  });

  // ── Gradient header styling ──
  for (let i = 0; i < 5; i++) {
    fillRow(ws, i, COLS, {
      fill: { fgColor: { rgb: GRADIENT[i] } },
      border: { top: { style: "thin", color: { rgb: GRADIENT[i] } }, bottom: { style: "thin", color: { rgb: GRADIENT[i] } }, left: { style: "thin", color: { rgb: GRADIENT[i] } }, right: { style: "thin", color: { rgb: GRADIENT[i] } } },
    });
  }

  setCell(ws, 1, 1, "ORENDA PSYCHIATRY", {
    font: { name: "Garamond", sz: 10, color: { rgb: P.LAVEN } },
    fill: { fgColor: { rgb: GRADIENT[1] } },
    alignment: { horizontal: "center", vertical: "center" },
    border: noBdr,
  });

  setCell(ws, 2, 1, `Patient Schedule — ${config.providerName}`, {
    font: { name: "Garamond", sz: 20, bold: true, color: { rgb: P.WHITE } },
    fill: { fgColor: { rgb: GRADIENT[2] } },
    alignment: { horizontal: "center", vertical: "center" },
    border: noBdr,
  });

  setCell(ws, 3, 1, "New Jersey In-Person Office Days", {
    font: { name: "Garamond", sz: 11, italic: true, color: { rgb: P.WHITE } },
    fill: { fgColor: { rgb: GRADIENT[3] } },
    alignment: { horizontal: "center", vertical: "center" },
    border: noBdr,
  });

  // Instructions row
  fillRow(ws, 6, COLS, {
    font: { name: "Calibri", sz: 10, color: { rgb: P.MUTED }, italic: true },
    fill: { fgColor: { rgb: P.MIST } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.WASH),
  });

  // ── Style each section ──
  sectionMeta.forEach(({ providerRow, headerRow, dataStart, dataEnd }) => {
    // Provider banner row — purple
    for (let c = 0; c < COLS; c++) {
      const ref = XLSX.utils.encode_cell({ r: providerRow, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };
      ws[ref].s = c === 0
        ? { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr }
        : {
            font: { name: "Calibri", sz: 11, bold: true, color: { rgb: P.WHITE } },
            fill: { fgColor: { rgb: P.MED } },
            alignment: { horizontal: "center", vertical: "center" },
            border: bdr(P.MED),
          };
    }

    // Column headers — dark purple
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

    // Data rows — alternating white/snow
    for (let r = dataStart; r <= dataEnd; r++) {
      const isEven = (r - dataStart) % 2 === 0;
      for (let c = 0; c < COLS; c++) {
        const ref = XLSX.utils.encode_cell({ r, c });
        if (!ws[ref]) ws[ref] = { t: "s", v: "" };
        if (c === 0) {
          ws[ref].s = { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr };
        } else if (c === 5) {
          // Check-In column — centered checkbox
          ws[ref].s = {
            font: { name: "Calibri", sz: 14, color: { rgb: P.MUTED } },
            fill: { fgColor: { rgb: isEven ? P.WHITE : P.SNOW } },
            alignment: { horizontal: "center", vertical: "center" },
            border: bdr(P.WASH),
          };
        } else {
          ws[ref].s = {
            font: { name: "Calibri", sz: 10, color: { rgb: P.MUTED } },
            fill: { fgColor: { rgb: isEven ? P.WHITE : P.SNOW } },
            alignment: { horizontal: c === 1 ? "left" : "center", vertical: "center" },
            border: bdr(P.WASH),
          };
        }
      }
    }
  });

  // Spacer rows between sections — clean white
  for (let r = 0; r < rows.length; r++) {
    const rowData = rows[r];
    if (rowData && rowData.every((v: any) => !v)) {
      // Check if this row is already styled (gradient header rows)
      if (r >= 5) {
        for (let c = 0; c < COLS; c++) {
          const ref = XLSX.utils.encode_cell({ r, c });
          if (!ws[ref]) ws[ref] = { t: "s", v: "" };
          // Only override if not already styled by gradient
          if (!ws[ref].s || !ws[ref].s.fill || ws[ref].s.fill.fgColor?.rgb === P.WHITE) {
            ws[ref].s = { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr };
          }
        }
      }
    }
  }

  // Footer
  fillRow(ws, footerR, COLS, {
    font: { name: "Calibri", sz: 9, italic: true, color: { rgb: P.MUTED } },
    fill: { fgColor: { rgb: P.MIST } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.WASH),
  });

  XLSX.utils.book_append_sheet(wb, ws, "Patient Schedule");
  XLSX.writeFile(wb, `Patient_Schedule_${config.providerName.replace(/\s+/g, "_")}.xlsx`);
}
