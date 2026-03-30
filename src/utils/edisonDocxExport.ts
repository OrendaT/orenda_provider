import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, WidthType, ShadingType, BorderStyle, Header, Footer,
  PageNumber, LevelFormat,
} from "docx";
import { saveAs } from "file-saver";

const purple = "2D1054";
const purpleMid = "5B2D8E";
const lavender = "E8DDF0";
const accent = "9B6BC2";
const darkBg = "1A0A2E";
const white = "FFFFFF";
const lightGray = "888888";

const noBorder = { style: BorderStyle.NONE, size: 0, color: white };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

const thinBorder = (color: string) => ({
  style: BorderStyle.SINGLE, size: 1, color,
});

function sectionTitle(text: string, isDark = false): Paragraph {
  return new Paragraph({
    spacing: { before: 300, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: isDark ? accent : lavender.replace("#", ""), space: 4 } },
    children: [
      new TextRun({
        text,
        font: "Georgia",
        size: 28,
        bold: true,
        color: isDark ? white : purple,
      }),
    ],
  });
}

function infoRow(label: string, value: string, isDark = false, isItalic = false): TableRow {
  const labelColor = isDark ? "888888" : "888888";
  const valueColor = isDark ? white : "1A1A1A";

  return new TableRow({
    children: [
      new TableCell({
        width: { size: 2800, type: WidthType.DXA },
        borders: noBorders,
        shading: { fill: isDark ? darkBg : white, type: ShadingType.CLEAR },
        margins: { top: 40, bottom: 40, left: 120, right: 80 },
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: label, font: "Calibri", size: 18, color: labelColor }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 6560, type: WidthType.DXA },
        borders: noBorders,
        shading: { fill: isDark ? darkBg : white, type: ShadingType.CLEAR },
        margins: { top: 40, bottom: 40, left: 80, right: 120 },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: value,
                font: "Georgia",
                size: 24,
                color: valueColor,
                bold: true,
                italics: isItalic,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function spacerRow(isDark = false): TableRow {
  const fill = isDark ? darkBg : white;
  const borderColor = isDark ? "2A1544" : "F0F0F0";
  return new TableRow({
    children: [
      new TableCell({
        columnSpan: 2,
        width: { size: 9360, type: WidthType.DXA },
        borders: {
          ...noBorders,
          bottom: thinBorder(borderColor),
        },
        shading: { fill, type: ShadingType.CLEAR },
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: [] })],
      }),
    ],
  });
}

function fullWidthCell(children: Paragraph[], isDark = false): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        columnSpan: 2,
        width: { size: 9360, type: WidthType.DXA },
        borders: noBorders,
        shading: { fill: isDark ? darkBg : white, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        children,
      }),
    ],
  });
}

export async function exportEdisonDocx() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22 },
        },
      },
    },
    numbering: {
      config: [
        {
          reference: "steps",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 720, hanging: 360 } },
                run: { font: "Calibri", color: accent, bold: true },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: "ORENDA PSYCHIATRY · PROVIDER REFERENCE",
                    font: "Calibri",
                    size: 14,
                    color: "AAAAAA",
                    characterSpacing: 60,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "Orenda Psychiatry · Edison Office Guide · For internal use only  |  Page ",
                    font: "Calibri",
                    size: 16,
                    color: "BBBBBB",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: "Calibri",
                    size: 16,
                    color: "BBBBBB",
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // ── Title ──
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: "Edison ",
                font: "Georgia",
                size: 56,
                color: purple,
              }),
              new TextRun({
                text: "Reminders",
                font: "Georgia",
                size: 56,
                color: accent,
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 40 },
            border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: lavender.replace("#", ""), space: 8 } },
            children: [
              new TextRun({
                text: "Regus — Raritan Plaza · 110 Fieldcrest Ave, 3rd Floor, Unit 328 · Edison, NJ 08837",
                font: "Calibri",
                size: 20,
                color: lightGray,
              }),
            ],
          }),

          // ── EDISON OFFICE GUIDE heading ──
          new Paragraph({
            spacing: { before: 400, after: 40 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "EDISON OFFICE GUIDE",
                font: "Calibri",
                size: 14,
                color: "AAAAAA",
                characterSpacing: 80,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "Edison Office ", font: "Georgia", size: 36, color: purple }),
              new TextRun({ text: "Guide", font: "Georgia", size: 36, color: accent, italics: true }),
            ],
          }),

          // ── Wi-Fi ──
          sectionTitle("📶  Wi-Fi", true),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [2800, 6560],
            rows: [
              infoRow("Network", "Regus", true),
              spacerRow(true),
              infoRow("Password", "167785439", true, true),
            ],
          }),

          // ── After-Hours ──
          sectionTitle("🕐  After-Hours", true),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [2800, 6560],
            rows: [
              infoRow("Building Hours", "Mon – Fri, 7:30 AM – 7:00 PM", true),
              spacerRow(true),
              infoRow("After-Hours Access", "P1 (Parking Level 1)", true),
              spacerRow(true),
              infoRow("Building Code", "05296", true, true),
            ],
          }),

          // ── Equipment ──
          sectionTitle("🩺  Equipment", true),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [2800, 6560],
            rows: [
              infoRow("BP Cuffs", "Located inside the basket, with a backup cuff available", true),
              spacerRow(true),
              infoRow("Scale", "Provided in the office", true),
            ],
          }),

          // ── Office Protocol ──
          new Paragraph({
            spacing: { before: 500, after: 40 },
            alignment: AlignmentType.LEFT,
            children: [
              new TextRun({
                text: "BEFORE YOU LEAVE",
                font: "Calibri",
                size: 14,
                color: "AAAAAA",
                characterSpacing: 60,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: "Office ", font: "Georgia", size: 36, color: purple }),
              new TextRun({ text: "Protocol", font: "Georgia", size: 36, color: accent, italics: true }),
            ],
          }),

          sectionTitle("🔑  Office Reset"),
          new Paragraph({
            numbering: { reference: "steps", level: 0 },
            spacing: { after: 60 },
            children: [
              new TextRun({ text: "Push chairs back under the desk", font: "Calibri", size: 22, color: "555555" }),
            ],
          }),
          new Paragraph({
            numbering: { reference: "steps", level: 0 },
            spacing: { after: 60 },
            children: [
              new TextRun({ text: "Leave equipment and office in a neat and clean order as you found it", font: "Calibri", size: 22, color: "555555" }),
            ],
          }),

          sectionTitle("🔐  Lockbox"),
          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({ text: "Remember to return the swipe card & key to the lockbox after use.", font: "Calibri", size: 22, color: "555555" }),
            ],
          }),

          // ── Key Reminders ──
          new Paragraph({
            spacing: { before: 300 },
            alignment: AlignmentType.CENTER,
            border: {
              top: { style: BorderStyle.SINGLE, size: 2, color: lavender.replace("#", ""), space: 8 },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: lavender.replace("#", ""), space: 8 },
            },
            children: [
              new TextRun({ text: "🛡️ Escort patients at all times   ·   🔑 Return key to lockbox   ·   🧹 Leave office clean", font: "Calibri", size: 20, color: purpleMid }),
            ],
          }),

          // ── Important ──
          new Paragraph({
            spacing: { before: 400, after: 100 },
            shading: { fill: "FFF8E1", type: ShadingType.CLEAR },
            border: {
              left: { style: BorderStyle.SINGLE, size: 8, color: "D4A017", space: 8 },
            },
            children: [
              new TextRun({ text: "⚠️  Important\n", font: "Georgia", size: 26, bold: true, color: purple }),
              new TextRun({ text: "Escort patients at all times within the building. Patients should never be unaccompanied in hallways, elevators, or common areas.", font: "Calibri", size: 22, color: "555555" }),
            ],
          }),

          // ── Contact ──
          new Paragraph({
            spacing: { before: 400, after: 80 },
            children: [
              new TextRun({
                text: "CONTACT",
                font: "Calibri",
                size: 14,
                color: "AAAAAA",
                characterSpacing: 80,
              }),
            ],
          }),

          // Contact table
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [4680, 4680],
            rows: [
              new TableRow({
                children: [
                  // Orenda Admin
                  new TableCell({
                    width: { size: 4680, type: WidthType.DXA },
                    borders: {
                      top: thinBorder(lavender.replace("#", "")),
                      bottom: thinBorder(lavender.replace("#", "")),
                      left: thinBorder(lavender.replace("#", "")),
                      right: thinBorder(lavender.replace("#", "")),
                    },
                    shading: { fill: "F8F4FC", type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        spacing: { after: 60 },
                        children: [
                          new TextRun({ text: "🏢  Orenda Psychiatry Admin", font: "Georgia", size: 22, bold: true, color: purple }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 20 },
                        children: [
                          new TextRun({ text: "Email: ", font: "Calibri", size: 18, color: lightGray }),
                          new TextRun({ text: "offices@orendapsych.com", font: "Georgia", size: 20, color: purple }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Phone: ", font: "Calibri", size: 18, color: lightGray }),
                          new TextRun({ text: "(201) 685-4863", font: "Georgia", size: 20, color: purple }),
                        ],
                      }),
                    ],
                  }),
                  // Regus
                  new TableCell({
                    width: { size: 4680, type: WidthType.DXA },
                    borders: {
                      top: thinBorder(lavender.replace("#", "")),
                      bottom: thinBorder(lavender.replace("#", "")),
                      left: thinBorder(lavender.replace("#", "")),
                      right: thinBorder(lavender.replace("#", "")),
                    },
                    shading: { fill: "F8F4FC", type: ShadingType.CLEAR },
                    margins: { top: 120, bottom: 120, left: 160, right: 160 },
                    children: [
                      new Paragraph({
                        spacing: { after: 60 },
                        children: [
                          new TextRun({ text: "📞  Regus Edison", font: "Georgia", size: 22, bold: true, color: purple }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { after: 20 },
                        children: [
                          new TextRun({ text: "Email: ", font: "Calibri", size: 18, color: lightGray }),
                          new TextRun({ text: "edison.fieldcrestave@regus.com", font: "Georgia", size: 20, color: purple }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Phone: ", font: "Calibri", size: 18, color: lightGray }),
                          new TextRun({ text: "(732) 782-0328", font: "Georgia", size: 20, color: purple }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  saveAs(buffer, "Edison-Office-Guide.docx");
}
