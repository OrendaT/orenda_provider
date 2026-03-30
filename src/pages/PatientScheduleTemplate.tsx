import { useState } from "react";
import { Download, Calendar, Clock, FileSpreadsheet, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import XLSX from "xlsx-js-style";
import logo from "@/assets/orenda-logo-purple.png";

const SAMPLE_ROWS = [
  { time: "9:00 AM", patient: "", type: "Initial Evaluation", duration: "60 min", status: "Confirmed", notes: "" },
  { time: "10:00 AM", patient: "", type: "Quarterly ADHD", duration: "30 min", status: "Confirmed", notes: "" },
  { time: "10:30 AM", patient: "", type: "Follow-Up", duration: "30 min", status: "Pending", notes: "" },
  { time: "11:00 AM", patient: "", type: "Initial Evaluation", duration: "60 min", status: "Confirmed", notes: "" },
  { time: "12:00 PM", patient: "", type: "— LUNCH BREAK —", duration: "", status: "", notes: "" },
  { time: "1:00 PM", patient: "", type: "Quarterly ADHD", duration: "30 min", status: "Confirmed", notes: "" },
  { time: "1:30 PM", patient: "", type: "Follow-Up", duration: "30 min", status: "Pending", notes: "" },
  { time: "2:00 PM", patient: "", type: "Initial Evaluation", duration: "60 min", status: "Confirmed", notes: "" },
  { time: "3:00 PM", patient: "", type: "Quarterly ADHD", duration: "30 min", status: "Confirmed", notes: "" },
  { time: "3:30 PM", patient: "", type: "Follow-Up", duration: "30 min", status: "Confirmed", notes: "" },
  { time: "4:00 PM", patient: "", type: "Initial Evaluation", duration: "60 min", status: "Pending", notes: "" },
  { time: "5:00 PM", patient: "", type: "", duration: "", status: "", notes: "" },
];

// ── Brand palette ──
const P = {
  DEEP:     "2D1B4E",
  DARK:     "462D6D",
  MED:      "6B4FA0",
  ACCENT:   "8B6FC0",
  SOFT:     "A78BDA",
  LAVEN:    "C4B5DC",
  WASH:     "E8E0F0",
  MIST:     "F0EBF5",
  SNOW:     "F8F6FB",
  WHITE:    "FFFFFF",
  TEXT:     "1A1A2E",
  MUTED:    "6B6B80",
  BORDER:   "D4CCE6",
  GREEN_BG: "E8F5E9",
  GREEN_TX: "2E7D32",
  AMBER_BG: "FFF8E1",
  AMBER_TX: "F57F17",
};

const GRADIENT_BAND = [P.DEEP, P.DARK, P.MED, P.ACCENT, P.SOFT];
const COL_COUNT = 7;

const bdr = (color = P.BORDER): any => ({
  top:    { style: "thin", color: { rgb: color } },
  bottom: { style: "thin", color: { rgb: color } },
  left:   { style: "thin", color: { rgb: color } },
  right:  { style: "thin", color: { rgb: color } },
});

const noBdr: any = {
  top:    { style: "thin", color: { rgb: P.WHITE } },
  bottom: { style: "thin", color: { rgb: P.WHITE } },
  left:   { style: "thin", color: { rgb: P.WHITE } },
  right:  { style: "thin", color: { rgb: P.WHITE } },
};

function fillRow(ws: any, row: number, style: any) {
  for (let c = 0; c < COL_COUNT; c++) {
    const ref = XLSX.utils.encode_cell({ r: row, c });
    if (!ws[ref]) ws[ref] = { t: "s", v: "" };
    ws[ref].s = { ...style };
  }
}

function downloadTemplate() {
  const wb = XLSX.utils.book_new();
  const wsData: any[][] = [];
  let row = 0;

  // ── GRADIENT HEADER (5 rows) ──
  wsData.push(Array(COL_COUNT).fill("")); row++;
  wsData.push(["", "", "ORENDA PSYCHIATRY", "", "", "", ""]); row++;
  wsData.push(["", "", "Patient Schedule Template", "", "", "", ""]); row++;
  wsData.push(["", "", "New Jersey  ·  In-Person Office Day", "", "", "", ""]); row++;
  wsData.push(Array(COL_COUNT).fill("")); row++;

  // Separator
  wsData.push(Array(COL_COUNT).fill("")); row++;

  // Info fields (rows 6–8)
  wsData.push(["", "Provider Name:", "", "", "Date:", "", ""]); row++;
  wsData.push(["", "Location:", "", "", "Time Block:", "", ""]); row++;
  wsData.push(["", "Contact Email:", "", "", "Phone:", "", ""]); row++;

  // Separator
  wsData.push(Array(COL_COUNT).fill("")); row++;

  // Accent bar
  wsData.push(["", "▬▬▬▬▬  DAILY SCHEDULE  ▬▬▬▬▬", "", "", "", "", ""]); row++;

  // Separator
  wsData.push(Array(COL_COUNT).fill("")); row++;

  // Column headers
  const headerRowIdx = row;
  wsData.push(["", "Time", "Patient Name", "Visit Type", "Duration", "Status", "Notes"]); row++;

  // Data rows
  const dataStartRow = row;
  SAMPLE_ROWS.forEach((r) => {
    wsData.push(["", r.time, r.patient, r.type, r.duration, r.status, r.notes]);
    row++;
  });

  // Separator
  wsData.push(Array(COL_COUNT).fill("")); row++;

  // Summary section
  const summaryStart = row;
  wsData.push(["", "DAILY SUMMARY", "", "", "", "", ""]); row++;
  wsData.push(["", "Total Appointments:", "", "", "Confirmed:", "", ""]); row++;
  wsData.push(["", "Pending:", "", "", "No-Shows:", "", ""]); row++;
  wsData.push(["", "Notes:", "", "", "", "", ""]); row++;

  // Separator
  wsData.push(Array(COL_COUNT).fill("")); row++;

  // Footer
  const footerRow = row;
  wsData.push(["", "Orenda Psychiatry  ·  NJ In-Person Care Hub  ·  Template v1.0", "", "", "", "", ""]); row++;
  wsData.push(["", "This template is for internal provider use only. Do not share patient information externally.", "", "", "", "", ""]); row++;

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths
  ws["!cols"] = [
    { wch: 2 },
    { wch: 14 },
    { wch: 26 },
    { wch: 22 },
    { wch: 12 },
    { wch: 14 },
    { wch: 30 },
  ];

  // Merges
  ws["!merges"] = [
    { s: { r: 1, c: 2 }, e: { r: 1, c: 6 } },
    { s: { r: 2, c: 2 }, e: { r: 2, c: 6 } },
    { s: { r: 3, c: 2 }, e: { r: 3, c: 6 } },
    { s: { r: 6, c: 2 }, e: { r: 6, c: 3 } },
    { s: { r: 6, c: 5 }, e: { r: 6, c: 6 } },
    { s: { r: 7, c: 2 }, e: { r: 7, c: 3 } },
    { s: { r: 7, c: 5 }, e: { r: 7, c: 6 } },
    { s: { r: 8, c: 2 }, e: { r: 8, c: 3 } },
    { s: { r: 8, c: 5 }, e: { r: 8, c: 6 } },
    { s: { r: 10, c: 1 }, e: { r: 10, c: 6 } },
    { s: { r: summaryStart, c: 1 }, e: { r: summaryStart, c: 6 } },
    { s: { r: summaryStart + 3, c: 2 }, e: { r: summaryStart + 3, c: 6 } },
    { s: { r: footerRow, c: 1 }, e: { r: footerRow, c: 6 } },
    { s: { r: footerRow + 1, c: 1 }, e: { r: footerRow + 1, c: 6 } },
  ];

  // ── GRADIENT BAND (rows 0–4) ──
  GRADIENT_BAND.forEach((color, i) => {
    fillRow(ws, i, {
      fill: { fgColor: { rgb: color } },
      border: { top: { style: "thin", color: { rgb: color } }, bottom: { style: "thin", color: { rgb: color } }, left: { style: "thin", color: { rgb: color } }, right: { style: "thin", color: { rgb: color } } },
    });
  });

  // Brand name (row 1)
  const brandRef = XLSX.utils.encode_cell({ r: 1, c: 2 });
  ws[brandRef].s = {
    font: { name: "Garamond", sz: 10, color: { rgb: P.LAVEN } },
    fill: { fgColor: { rgb: GRADIENT_BAND[1] } },
    alignment: { horizontal: "center", vertical: "center" },
    border: noBdr,
  };

  // Title (row 2)
  const titleRef = XLSX.utils.encode_cell({ r: 2, c: 2 });
  ws[titleRef].s = {
    font: { name: "Garamond", sz: 22, bold: true, color: { rgb: P.WHITE } },
    fill: { fgColor: { rgb: GRADIENT_BAND[2] } },
    alignment: { horizontal: "center", vertical: "center" },
    border: noBdr,
  };

  // Subtitle (row 3)
  const subRef = XLSX.utils.encode_cell({ r: 3, c: 2 });
  ws[subRef].s = {
    font: { name: "Garamond", sz: 11, italic: true, color: { rgb: P.WHITE } },
    fill: { fgColor: { rgb: GRADIENT_BAND[3] } },
    alignment: { horizontal: "center", vertical: "center" },
    border: noBdr,
  };

  // Separator (row 5)
  fillRow(ws, 5, { fill: { fgColor: { rgb: P.WHITE } }, border: { ...noBdr, bottom: { style: "medium", color: { rgb: P.WASH } } } });

  // ── Info fields (rows 6–8) ──
  for (let r = 6; r <= 8; r++) {
    fillRow(ws, r, {
      font: { name: "Calibri", sz: 10, color: { rgb: P.MUTED } },
      fill: { fgColor: { rgb: P.SNOW } },
      border: bdr(P.WASH),
      alignment: { vertical: "center" },
    });
    for (const c of [1, 4]) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (ws[ref]) {
        ws[ref].s = {
          font: { name: "Calibri", sz: 10, bold: true, color: { rgb: P.DARK } },
          fill: { fgColor: { rgb: P.MIST } },
          border: bdr(P.WASH),
          alignment: { horizontal: "right", vertical: "center" },
        };
      }
    }
    for (const c of [2, 5]) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };
      ws[ref].s = {
        font: { name: "Calibri", sz: 10, color: { rgb: P.TEXT } },
        fill: { fgColor: { rgb: P.WHITE } },
        border: { ...bdr(P.WASH), bottom: { style: "thin", color: { rgb: P.BORDER } } },
        alignment: { vertical: "center" },
      };
    }
  }

  // Separator (row 9)
  fillRow(ws, 9, { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr });

  // Accent bar (row 10)
  fillRow(ws, 10, {
    font: { name: "Calibri", sz: 11, bold: true, color: { rgb: P.WHITE } },
    fill: { fgColor: { rgb: P.MED } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.MED),
  });
  const accentRef = XLSX.utils.encode_cell({ r: 10, c: 1 });
  ws[accentRef].s = {
    font: { name: "Calibri", sz: 11, bold: true, color: { rgb: P.WHITE } },
    fill: { fgColor: { rgb: P.MED } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.MED),
  };

  // Separator (row 11)
  fillRow(ws, 11, { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr });

  // ── Column headers ──
  for (let c = 0; c < COL_COUNT; c++) {
    const ref = XLSX.utils.encode_cell({ r: headerRowIdx, c });
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

  // ── Data rows ──
  SAMPLE_ROWS.forEach((r, i) => {
    const rowIdx = dataStartRow + i;
    const isLunch = r.type.includes("LUNCH");
    const isEven = i % 2 === 0;
    const isEmpty = r.time === "5:00 PM" && !r.type;

    for (let c = 0; c < COL_COUNT; c++) {
      const ref = XLSX.utils.encode_cell({ r: rowIdx, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };

      if (c === 0) {
        ws[ref].s = { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr };
      } else if (isLunch) {
        ws[ref].s = {
          font: { name: "Calibri", sz: 10, bold: true, italic: true, color: { rgb: P.MED } },
          fill: { fgColor: { rgb: P.WASH } },
          alignment: { horizontal: "center", vertical: "center" },
          border: bdr(P.LAVEN),
        };
      } else if (isEmpty) {
        ws[ref].s = {
          font: { name: "Calibri", sz: 10, italic: true, color: { rgb: P.MUTED } },
          fill: { fgColor: { rgb: P.MIST } },
          alignment: { horizontal: c === 1 || c === 4 || c === 5 ? "center" : "left", vertical: "center" },
          border: bdr(P.WASH),
        };
      } else {
        const bgColor = isEven ? P.WHITE : P.SNOW;
        ws[ref].s = {
          font: { name: "Calibri", sz: 10, color: { rgb: c === 2 ? P.TEXT : P.MUTED } },
          fill: { fgColor: { rgb: bgColor } },
          alignment: { horizontal: c === 1 || c === 4 || c === 5 ? "center" : "left", vertical: "center" },
          border: bdr(P.WASH),
        };
        // Status color coding
        if (c === 5 && r.status) {
          const isConf = r.status === "Confirmed";
          ws[ref].s = {
            font: { name: "Calibri", sz: 9, bold: true, color: { rgb: isConf ? P.GREEN_TX : P.AMBER_TX } },
            fill: { fgColor: { rgb: isConf ? P.GREEN_BG : P.AMBER_BG } },
            alignment: { horizontal: "center", vertical: "center" },
            border: bdr(P.WASH),
          };
        }
      }
    }
  });

  // Separator before summary
  fillRow(ws, dataStartRow + SAMPLE_ROWS.length, { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr });

  // ── Summary section ──
  fillRow(ws, summaryStart, {
    font: { name: "Calibri", sz: 11, bold: true, color: { rgb: P.WHITE } },
    fill: { fgColor: { rgb: P.ACCENT } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.ACCENT),
  });
  const sumRef = XLSX.utils.encode_cell({ r: summaryStart, c: 1 });
  ws[sumRef].s = {
    font: { name: "Calibri", sz: 11, bold: true, color: { rgb: P.WHITE } },
    fill: { fgColor: { rgb: P.ACCENT } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.ACCENT),
  };

  for (let r = summaryStart + 1; r <= summaryStart + 3; r++) {
    fillRow(ws, r, {
      font: { name: "Calibri", sz: 10, color: { rgb: P.MUTED } },
      fill: { fgColor: { rgb: P.MIST } },
      border: bdr(P.WASH),
      alignment: { vertical: "center" },
    });
    for (const c of [1, 4]) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (ws[ref] && ws[ref].v) {
        ws[ref].s = {
          font: { name: "Calibri", sz: 10, bold: true, color: { rgb: P.DARK } },
          fill: { fgColor: { rgb: P.MIST } },
          border: bdr(P.WASH),
          alignment: { horizontal: "right", vertical: "center" },
        };
      }
    }
    for (const c of [2, 5]) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };
      ws[ref].s = {
        font: { name: "Calibri", sz: 10, color: { rgb: P.TEXT } },
        fill: { fgColor: { rgb: P.WHITE } },
        border: { ...bdr(P.WASH), bottom: { style: "thin", color: { rgb: P.BORDER } } },
        alignment: { vertical: "center" },
      };
    }
  }

  // Separator before footer
  fillRow(ws, footerRow - 1, { fill: { fgColor: { rgb: P.WHITE } }, border: noBdr });

  // ── Footer ──
  fillRow(ws, footerRow, {
    fill: { fgColor: { rgb: P.DARK } },
    border: bdr(P.DARK),
  });
  const ftRef = XLSX.utils.encode_cell({ r: footerRow, c: 1 });
  ws[ftRef].s = {
    font: { name: "Garamond", sz: 9, color: { rgb: P.LAVEN } },
    fill: { fgColor: { rgb: P.DARK } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.DARK),
  };

  fillRow(ws, footerRow + 1, {
    fill: { fgColor: { rgb: P.MIST } },
    border: bdr(P.WASH),
  });
  const ft2Ref = XLSX.utils.encode_cell({ r: footerRow + 1, c: 1 });
  ws[ft2Ref].s = {
    font: { name: "Calibri", sz: 8, italic: true, color: { rgb: P.MUTED } },
    fill: { fgColor: { rgb: P.MIST } },
    alignment: { horizontal: "center", vertical: "center" },
    border: bdr(P.WASH),
  };

  // ── Row heights ──
  ws["!rows"] = [
    { hpt: 14 },
    { hpt: 22 },
    { hpt: 38 },
    { hpt: 20 },
    { hpt: 14 },
    { hpt: 8 },
    { hpt: 26 },
    { hpt: 26 },
    { hpt: 26 },
    { hpt: 8 },
    { hpt: 28 },
    { hpt: 8 },
    { hpt: 26 },
    ...SAMPLE_ROWS.map((r) => ({ hpt: r.type.includes("LUNCH") ? 28 : 24 })),
    { hpt: 8 },
    { hpt: 28 },
    { hpt: 24 },
    { hpt: 24 },
    { hpt: 24 },
    { hpt: 8 },
    { hpt: 24 },
    { hpt: 20 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Patient Schedule");
  XLSX.writeFile(wb, "Orenda_Patient_Schedule_Template.xlsx");
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function PatientScheduleTemplate() {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    downloadTemplate();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="min-h-screen font-body" style={{ background: 'linear-gradient(180deg, hsl(270, 40%, 96%), hsl(0, 0%, 100%))' }}>
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <img src={logo} alt="Orenda Psychiatry" className="h-6 md:h-7" />
        </div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 font-medium">NJ In-Person Care Hub</p>
      </div>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-8 sm:pb-14">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <p className="text-xs tracking-[0.4em] uppercase text-primary/50 font-semibold mb-3 md:mb-5">Provider Tool</p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-light text-foreground tracking-tight mb-3 md:mb-5">
            Patient Schedule{" "}
            <em className="text-primary" style={{ fontStyle: 'italic' }}>Template</em>
          </h1>
          <p className="text-foreground/50 text-sm md:text-base max-w-lg leading-relaxed mb-6 md:mb-10">
            A pre-formatted, branded Excel template for organizing your in-office patient schedule. Fill in your details and print or share digitally.
          </p>
          <button
            onClick={handleDownload}
            className="group inline-flex items-center gap-3 bg-primary text-primary-foreground text-xs sm:text-sm tracking-[0.15em] uppercase font-semibold px-6 sm:px-10 py-3.5 sm:py-4 rounded-lg hover:bg-primary/90 transition-all duration-200"
          >
            {downloaded ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Downloaded
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Excel Template
              </>
            )}
          </button>
        </motion.div>
      </div>

      {/* Preview */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 md:pb-24">
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible"
          className="rounded-2xl border border-primary/10 bg-white shadow-xl overflow-hidden"
        >
          {/* Gradient Header Preview */}
          <div className="relative overflow-hidden">
            <div className="h-2" style={{ background: `linear-gradient(90deg, hsl(270,60%,15%), hsl(270,50%,30%), hsl(270,45%,40%), hsl(270,40%,55%), hsl(270,35%,68%))` }} />
            <div className="bg-primary px-6 py-6 text-center">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-medium mb-1">Orenda Psychiatry</p>
              <p className="text-white font-display text-xl tracking-wide">Patient Schedule Template</p>
              <p className="text-white/50 text-xs italic mt-1">New Jersey · In-Person Office Day</p>
            </div>
          </div>

          {/* Info strip */}
          <div className="bg-[hsl(270,30%,96%)] px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2 text-xs">
            <div>
              <span className="text-foreground/40 font-medium">Provider:</span>
              <span className="text-foreground/25 italic ml-1.5">fill in</span>
            </div>
            <div>
              <span className="text-foreground/40 font-medium">Date:</span>
              <span className="text-foreground/25 italic ml-1.5">fill in</span>
            </div>
            <div>
              <span className="text-foreground/40 font-medium">Location:</span>
              <span className="text-foreground/25 italic ml-1.5">fill in</span>
            </div>
            <div>
              <span className="text-foreground/40 font-medium">Time Block:</span>
              <span className="text-foreground/25 italic ml-1.5">fill in</span>
            </div>
          </div>

          {/* Accent bar */}
          <div className="bg-primary/70 text-white text-[10px] tracking-[0.3em] uppercase font-semibold text-center py-2">
            ▬▬▬▬▬  Daily Schedule  ▬▬▬▬▬
          </div>

          {/* Table Preview */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="px-3 sm:px-4 py-2.5 text-center font-medium tracking-wide">Time</th>
                  <th className="px-3 sm:px-4 py-2.5 text-left font-medium tracking-wide">Patient Name</th>
                  <th className="px-3 sm:px-4 py-2.5 text-left font-medium tracking-wide">Visit Type</th>
                  <th className="px-3 sm:px-4 py-2.5 text-center font-medium tracking-wide">Duration</th>
                  <th className="px-3 sm:px-4 py-2.5 text-center font-medium tracking-wide">Status</th>
                  <th className="px-3 sm:px-4 py-2.5 text-left font-medium tracking-wide">Notes</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_ROWS.map((row, i) => {
                  const isLunch = row.type.includes("LUNCH");
                  const isEmpty = row.time === "5:00 PM" && !row.type;
                  return (
                    <tr
                      key={i}
                      className={
                        isLunch
                          ? "bg-[hsl(270,30%,94%)]"
                          : isEmpty
                            ? "bg-[hsl(270,25%,96%)]"
                            : i % 2 === 0
                              ? "bg-white"
                              : "bg-[hsl(270,20%,98%)]"
                      }
                    >
                      <td className={`px-3 sm:px-4 py-2 text-center ${isLunch ? "font-semibold text-primary/70 italic" : isEmpty ? "text-foreground/30 italic" : "text-foreground/70"}`}>
                        {isLunch ? "" : row.time}
                      </td>
                      <td className={`px-3 sm:px-4 py-2 ${isLunch ? "text-center font-semibold text-primary/70 italic" : "text-foreground/30 italic"}`} colSpan={isLunch ? 5 : 1}>
                        {isLunch ? row.type : (isEmpty ? "" : row.patient || "—")}
                      </td>
                      {!isLunch && (
                        <>
                          <td className="px-3 sm:px-4 py-2 text-foreground/50">{row.type}</td>
                          <td className="px-3 sm:px-4 py-2 text-center text-foreground/50">{row.duration}</td>
                          <td className="px-3 sm:px-4 py-2 text-center">
                            {row.status && (
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                row.status === "Confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}>
                                {row.status}
                              </span>
                            )}
                          </td>
                          <td className="px-3 sm:px-4 py-2 text-foreground/30 italic">{row.notes || "—"}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary Preview */}
          <div className="bg-primary/60 text-white text-xs font-semibold text-center py-2 tracking-wide">
            Daily Summary
          </div>
          <div className="bg-[hsl(270,25%,96%)] px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div><span className="text-foreground/40 font-medium">Total:</span> <span className="text-foreground/25 italic">—</span></div>
            <div><span className="text-foreground/40 font-medium">Confirmed:</span> <span className="text-foreground/25 italic">—</span></div>
            <div><span className="text-foreground/40 font-medium">Pending:</span> <span className="text-foreground/25 italic">—</span></div>
            <div><span className="text-foreground/40 font-medium">No-Shows:</span> <span className="text-foreground/25 italic">—</span></div>
          </div>

          {/* Footer */}
          <div className="bg-primary px-6 py-2.5 text-[10px] text-white/40 text-center tracking-wide">
            Orenda Psychiatry  ·  NJ In-Person Care Hub  ·  Template v1.0
          </div>
          <div className="bg-[hsl(270,30%,96%)] px-6 py-2 text-[9px] text-foreground/25 italic text-center">
            This template is for internal provider use only.
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          {[
            { icon: FileSpreadsheet, title: "Pre-Formatted", desc: "Branded gradient header, color-coded status, and Garamond typography." },
            { icon: Calendar, title: "Full Day Layout", desc: "9 AM – 5 PM with lunch break, summary section, and notes area." },
            { icon: Download, title: "Editable .xlsx", desc: "Open in Excel or Google Sheets — fill in names and print." },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-primary/10 rounded-xl p-5 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                <f.icon className="w-4 h-4 text-primary/40" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-0.5">{f.title}</p>
                <p className="text-xs text-foreground/40">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
