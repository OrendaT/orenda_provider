import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, TabStopType, TabStopPosition, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx-js-style";

const PURPLE_HEX = "3B0764"; // deep purple
const ACCENT_HEX = "9D6BE0"; // italic-accent purple
const MUTED_HEX = "6B6B7B";
const WHITE_HEX = "FFFFFF";

const sections = [
  {
    num: "1",
    title: "Building Access & Security",
    content: "Provider agrees to follow all building access and security procedures, including advance scheduling requirements and patient registration with building security where applicable. Providers may not share keys, lockbox codes, access credentials, or building access information with unauthorized persons.",
  },
  {
    num: "2",
    title: "Patient Supervision in Shared Space",
    content: "Providers are responsible for ensuring patients are escorted appropriately within the building. Patients should not move through coworking or shared office areas unaccompanied.",
  },
  {
    num: "3",
    title: "Office Care & Reset",
    content: "Providers must leave the office clean, organized, and in the same condition in which it was found. This includes disposing of trash, resetting the space for the next provider, and returning the office key to the designated lockbox after use.",
  },
  {
    num: "4",
    title: "Proper Use of Space",
    content: "Providers may only use designated office areas for patient care and related administrative work. Hallways, reception areas, and other shared spaces may not be used for clinical visits or business activities unless specifically authorized.",
  },
  {
    num: "5",
    title: "Professional Conduct",
    content: "Providers are expected to maintain professional conduct and behavior while using the office space and interacting with building staff, patients, and other occupants.",
  },
  {
    num: "6",
    title: "Safety & Prohibited Items",
    content: "Providers may not bring prohibited or hazardous items into the office, including weapons, explosives, or unauthorized equipment, and must comply with all health, safety, and privacy requirements.",
  },
  {
    num: "7",
    title: "Responsibility for Access Devices and Property",
    content: "Any office keys, lockbox access codes, badges, or other access devices must be safeguarded and used only as authorized. Lost keys, access issues, or damage to the office must be reported promptly.",
  },
  {
    num: "8",
    title: "Scheduling Commitment & Cancellation Policy",
    content: "Office reservations are intended to support scheduled patient care and operational coordination.",
    bullets: [
      "Providers should only reserve office time when they are confident they will be able to attend and see their scheduled patients.",
      "Because office access, patient coordination, and building security arrangements require advance preparation, providers are expected to avoid last-minute cancellations.",
      "Providers should provide at least 48 hours' notice if a change is unavoidable.",
      "Frequent late cancellations, failure to attend a reserved office time, or repeated schedule changes may result in restrictions or loss of future office scheduling privileges.",
    ],
  },
  {
    num: "9",
    title: "Indemnification",
    content: "Provider agrees to indemnify and hold harmless Orenda Psychiatry from any claims, damages, losses, or liabilities arising from the Provider's use of the office space, except to the extent caused by Orenda Psychiatry's own negligence or misconduct.",
  },
  {
    num: "10",
    title: "Independent Provider & Regulatory Responsibility",
    content: "Provider acknowledges that they are an independent medical professional and not an employee of Orenda Psychiatry. Provider is solely responsible for maintaining all required professional licenses, credentials, malpractice coverage, and for complying with all applicable federal, state, and local laws and regulations governing the practice of medicine, including New Jersey regulatory requirements. Orenda Psychiatry provides administrative and office support only and assumes no responsibility for the Provider's clinical services, medical decision-making, or regulatory compliance.",
  },
  {
    num: "11",
    title: "Permitted Use",
    content: "The office space at the designated Orenda Psychiatry location is provided solely for Orenda Psychiatry clinical appointments and related authorized activities. The space may not be used for personal business, private patients, or services performed on behalf of another practice, organization, or entity.",
  },
  {
    num: "12",
    title: "Non-Solicitation",
    content: "Provider shall not solicit, recruit, or redirect Orenda Psychiatry patients to any outside practice, service, or business during or after use of the office space.",
  },
];

export async function downloadAgreementDocx() {
  const children: Paragraph[] = [];

  // Title
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "ORENDA PSYCHIATRY, PLLC", font: "Calibri", size: 20, color: MUTED_HEX, allCaps: true }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "Provider Office Use", font: "Georgia", size: 48, color: PURPLE_HEX }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Agreement & Scheduling Policy", font: "Georgia", size: 48, color: ACCENT_HEX, italics: true }),
      ],
    })
  );

  // Intro
  children.push(
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: "By reserving and using an Orenda Psychiatry office location, the Provider acknowledges and agrees to the following terms:",
          font: "Calibri",
          size: 21,
          color: MUTED_HEX,
        }),
      ],
    })
  );

  // Horizontal rule
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
      },
      children: [],
    })
  );

  // Sections
  for (const s of sections) {
    children.push(
      new Paragraph({
        spacing: { before: 240, after: 100 },
        children: [
          new TextRun({ text: `${s.num}. `, font: "Georgia", size: 28, color: ACCENT_HEX }),
          new TextRun({ text: s.title, font: "Georgia", size: 28, color: PURPLE_HEX, bold: true }),
        ],
      })
    );

    if (s.content) {
      children.push(
        new Paragraph({
          spacing: { after: 120 },
          indent: { left: 360 },
          children: [
            new TextRun({ text: s.content, font: "Calibri", size: 24, color: "333333" }),
          ],
        })
      );
    }

    if (s.bullets) {
      for (const b of s.bullets) {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            indent: { left: 720 },
            bullet: { level: 0 },
            children: [
              new TextRun({ text: b, font: "Calibri", size: 24, color: "333333" }),
            ],
          })
        );
      }
    }

    // Section divider
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "F0E8F8" },
        },
        children: [],
      })
    );
  }

  // Signature section
  children.push(new Paragraph({ spacing: { before: 400, after: 200 }, children: [] }));
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "ACKNOWLEDGMENT & DIGITAL SIGNATURE", font: "Calibri", size: 20, color: PURPLE_HEX, bold: true, allCaps: true }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "I have reviewed, understand, and agree to the Provider Office Use Agreement & Scheduling Policy.",
          font: "Calibri",
          size: 21,
          color: "333333",
        }),
      ],
    })
  );

  // Signature lines
  const signatureFields = ["Full Legal Name (Digital Signature)", "Email Address", "Date"];
  for (const label of signatureFields) {
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 40 },
        children: [
          new TextRun({ text: label.toUpperCase(), font: "Calibri", size: 16, color: MUTED_HEX, allCaps: true }),
        ],
      })
    );
    children.push(
      new Paragraph({
        spacing: { after: 100 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        },
        children: [
          new TextRun({ text: "                                                                                                ", font: "Calibri", size: 24 }),
        ],
      })
    );
  }

  // Corporate information
  children.push(new Paragraph({ spacing: { before: 400, after: 80 }, children: [] }));
  children.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: "ORENDA PSYCHIATRY, PLLC", font: "Calibri", size: 20, color: PURPLE_HEX, bold: true }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 0 },
      children: [
        new TextRun({ text: "347 Fifth Ave, Suite 1402-235", font: "Calibri", size: 20, color: "333333" }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 0 },
      children: [
        new TextRun({ text: "New York, NY 10016", font: "Calibri", size: 20, color: "333333" }),
      ],
    })
  );

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22 },
        },
      },
    },
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Orenda_Provider_Office_Use_Agreement.docx");
}

export function downloadAgreementXlsx() {
  const wb = XLSX.utils.book_new();

  const rows: any[][] = [];

  // Header rows
  rows.push(["ORENDA PSYCHIATRY, PLLC"]);
  rows.push(["Provider Office Use Agreement & Scheduling Policy"]);
  rows.push([""]);
  rows.push(["By reserving and using an Orenda Psychiatry office location, the Provider acknowledges and agrees to the following terms:"]);
  rows.push([""]);

  // Column headers
  rows.push(["#", "Section Title", "Terms & Conditions"]);

  // Section data
  for (const s of sections) {
    let fullContent = s.content || "";
    if (s.bullets) {
      fullContent += "\n" + s.bullets.map((b, i) => `  • ${b}`).join("\n");
    }
    rows.push([s.num, s.title, fullContent]);
  }

  // Blank rows before signature
  rows.push([""]);
  rows.push([""]);
  rows.push(["ACKNOWLEDGMENT & DIGITAL SIGNATURE"]);
  rows.push(["I have reviewed, understand, and agree to the Provider Office Use Agreement & Scheduling Policy."]);
  rows.push([""]);
  rows.push(["Full Legal Name:", "", ""]);
  rows.push(["Email Address:", "", ""]);
  rows.push(["Date:", "", ""]);
  rows.push([""]);
  rows.push([""]);
  rows.push(["ORENDA PSYCHIATRY, PLLC"]);
  rows.push(["347 Fifth Ave, Suite 1402-235"]);
  rows.push(["New York, NY 10016"]);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  ws["!cols"] = [{ wch: 5 }, { wch: 38 }, { wch: 90 }];

  // Row heights
  ws["!rows"] = rows.map((_, i) => {
    if (i === 0) return { hpt: 30 };
    if (i === 1) return { hpt: 36 };
    if (i === 5) return { hpt: 28 };
    if (i > 5 && i <= 5 + sections.length) return { hpt: 80 };
    return { hpt: 22 };
  });

  // Style header
  const headerStyle = {
    font: { bold: true, color: { rgb: WHITE_HEX }, sz: 14 },
    fill: { fgColor: { rgb: PURPLE_HEX } },
    alignment: { vertical: "center" as const, horizontal: "left" as const },
  };

  const titleStyle = {
    font: { bold: true, color: { rgb: PURPLE_HEX }, sz: 18 },
    alignment: { vertical: "center" as const },
  };

  const subtitleStyle = {
    font: { italic: true, color: { rgb: ACCENT_HEX }, sz: 11 },
    alignment: { vertical: "center" as const, wrapText: true },
  };

  const colHeaderStyle = {
    font: { bold: true, color: { rgb: WHITE_HEX }, sz: 11 },
    fill: { fgColor: { rgb: PURPLE_HEX } },
    alignment: { vertical: "center" as const, horizontal: "center" as const },
    border: {
      bottom: { style: "thin", color: { rgb: ACCENT_HEX } },
    },
  };

  // Apply styles
  // Row 0 - Company name
  if (ws["A1"]) ws["A1"].s = { font: { bold: true, color: { rgb: MUTED_HEX }, sz: 10 }, alignment: { vertical: "center" } };
  // Row 1 - Title
  if (ws["A2"]) ws["A2"].s = titleStyle;
  // Row 3 - Intro
  if (ws["A4"]) ws["A4"].s = subtitleStyle;

  // Row 5 - Column headers
  const headerRow = 5;
  ["A", "B", "C"].forEach((col) => {
    const cell = `${col}${headerRow + 1}`;
    if (ws[cell]) ws[cell].s = colHeaderStyle;
  });

  // Data rows with alternating colors
  const lavenderFill = { fgColor: { rgb: "F3EAFF" } };
  const whiteFill = { fgColor: { rgb: WHITE_HEX } };
  const thinBorder = {
    top: { style: "thin" as const, color: { rgb: "E8D5F5" } },
    bottom: { style: "thin" as const, color: { rgb: "E8D5F5" } },
    left: { style: "thin" as const, color: { rgb: "E8D5F5" } },
    right: { style: "thin" as const, color: { rgb: "E8D5F5" } },
  };

  for (let i = 0; i < sections.length; i++) {
    const rowIdx = 6 + i + 1; // 1-indexed
    const fill = i % 2 === 0 ? lavenderFill : whiteFill;
    ["A", "B", "C"].forEach((col) => {
      const cell = `${col}${rowIdx}`;
      if (ws[cell]) {
        const isNum = col === "A";
        const isTitle = col === "B";
        ws[cell].s = {
          font: {
            bold: isTitle,
            color: { rgb: isNum ? ACCENT_HEX : isTitle ? PURPLE_HEX : "333333" },
            sz: isNum ? 12 : isTitle ? 11 : 10,
          },
          fill,
          alignment: {
            vertical: "top" as const,
            horizontal: isNum ? ("center" as const) : ("left" as const),
            wrapText: true,
          },
          border: thinBorder,
        };
      }
    });
  }

  // Signature section styling
  const sigHeaderIdx = 6 + sections.length + 2 + 1; // row index (1-based)
  const sigCell = `A${sigHeaderIdx}`;
  if (ws[sigCell]) {
    ws[sigCell].s = {
      font: { bold: true, color: { rgb: PURPLE_HEX }, sz: 11 },
      alignment: { vertical: "center" },
    };
  }

  // Merge header cells
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // company name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } }, // title
    { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } }, // intro
    { s: { r: sigHeaderIdx - 1, c: 0 }, e: { r: sigHeaderIdx - 1, c: 2 } }, // sig header
    { s: { r: sigHeaderIdx, c: 0 }, e: { r: sigHeaderIdx, c: 2 } }, // sig text
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Agreement");
  XLSX.writeFile(wb, "Orenda_Provider_Office_Use_Agreement.xlsx");
}
