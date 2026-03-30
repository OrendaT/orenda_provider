import { Document, Packer, Paragraph, TextRun, BorderStyle, AlignmentType } from "docx";
import { saveAs } from "file-saver";

const PURPLE_HEX = "3B0764";
const ACCENT_HEX = "9D6BE0";
const MUTED_HEX = "6B6B7B";

const facilities = [
  "24/7 Building Security",
  "24/7 Access",
  "Lounge & Kitchen",
  "Parking Available",
  "Major Transport Links",
  "Meeting Rooms",
  "24/7 CCTV",
  "Bicycle Storage",
  "Business Lounge",
  "City/Town Center",
  "Wheelchair Accessible",
];

const officeAmenities = [
  "Patient Seating",
  "Weight Scale",
  "BP Cuff",
  "Water & Coffee",
  "Wi-Fi",
];

const officeProtocols = [
  "Escort patients at all times",
  "Use in-office beverages only",
  "Return key to lockbox after visit",
  "Leave office clean & reset",
];

export async function downloadHobokenDocx() {
  const children: Paragraph[] = [];

  // Company name
  children.push(
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "ORENDA PSYCHIATRY, PLLC", font: "Calibri", size: 20, color: MUTED_HEX, allCaps: true }),
      ],
    })
  );

  // Title
  children.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: "Hoboken", font: "Georgia", size: 56, color: PURPLE_HEX }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "Riverfront Center", font: "Georgia", size: 56, color: ACCENT_HEX, italics: true }),
      ],
    })
  );

  // Subtitle
  children.push(
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({ text: "01 — Hoboken, New Jersey", font: "Calibri", size: 20, color: MUTED_HEX }),
      ],
    })
  );

  // Divider
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" } },
      children: [],
    })
  );

  // --- ADDRESS ---
  children.push(
    new Paragraph({
      spacing: { before: 240, after: 100 },
      children: [
        new TextRun({ text: "Address", font: "Georgia", size: 28, color: PURPLE_HEX, bold: true }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 40 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: "Regus — Riverfront Center", font: "Calibri", size: 24, color: "333333", bold: true }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 40 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: "221 River Street, 9th Floor, Unit 9076", font: "Calibri", size: 24, color: "333333" }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: "Hoboken, NJ 07030", font: "Calibri", size: 24, color: "333333" }),
      ],
    })
  );

  // Divider
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "F0E8F8" } },
      children: [],
    })
  );

  // --- ABOUT ---
  children.push(
    new Paragraph({
      spacing: { before: 240, after: 100 },
      children: [
        new TextRun({ text: "About This Location", font: "Georgia", size: 28, color: PURPLE_HEX, bold: true }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      indent: { left: 360 },
      children: [
        new TextRun({
          text: "Located on the Hudson River waterfront with stunning views of the Manhattan skyline, our Hoboken office offers a modern, professional setting just 15 minutes from Midtown Manhattan. The space is designed to provide a welcoming, comfortable experience for both patients and providers.",
          font: "Calibri", size: 24, color: "333333",
        }),
      ],
    })
  );

  // Divider
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "F0E8F8" } },
      children: [],
    })
  );

  // --- FINDING THE BUILDING ---
  children.push(
    new Paragraph({
      spacing: { before: 240, after: 100 },
      children: [
        new TextRun({ text: "Finding the Building", font: "Georgia", size: 28, color: PURPLE_HEX, bold: true }),
      ],
    })
  );
  const directions = [
    "Look for Wonder Cafe — use it as your landmark.",
    "The building entrance is on River Street with the Riverfront Center signage.",
    "Take the elevator to the 9th floor. Reception is staffed 9 AM – 5 PM. After hours, the floor entrance is locked and a swipe card is required.",
  ];
  for (let i = 0; i < directions.length; i++) {
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        indent: { left: 360 },
        children: [
          new TextRun({ text: `${i + 1}. `, font: "Georgia", size: 24, color: ACCENT_HEX }),
          new TextRun({ text: directions[i], font: "Calibri", size: 24, color: "333333" }),
        ],
      })
    );
  }

  // Divider
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "F0E8F8" } },
      children: [],
    })
  );

  // --- KEY INFORMATION: ACCESS ---
  children.push(
    new Paragraph({
      spacing: { before: 300, after: 100 },
      children: [
        new TextRun({ text: "Key Information", font: "Georgia", size: 32, color: PURPLE_HEX, bold: true }),
      ],
    })
  );

  // Access
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({ text: "Access", font: "Georgia", size: 28, color: ACCENT_HEX, bold: true }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 40 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: "24/7 Security & Access", font: "Calibri", size: 24, color: "333333", bold: true }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 80 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: "Building access available around the clock.", font: "Calibri", size: 22, color: MUTED_HEX }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 40 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: "Regus Front Desk", font: "Calibri", size: 24, color: "333333", bold: true }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 80 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: "9th Floor · Mon–Fri, 9 AM – 5 PM", font: "Calibri", size: 22, color: MUTED_HEX }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: "Note: ", font: "Calibri", size: 22, color: ACCENT_HEX, bold: true }),
        new TextRun({ text: "After hours, the Regus front desk & entrance are closed. Ensure our team registers your access for after-hours entry.", font: "Calibri", size: 22, color: MUTED_HEX }),
      ],
    })
  );

  // Contact
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({ text: "Contact", font: "Georgia", size: 28, color: ACCENT_HEX, bold: true }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 40 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: "Phone: ", font: "Calibri", size: 22, color: MUTED_HEX }),
        new TextRun({ text: "(201) 721-8500", font: "Calibri", size: 24, color: "333333", bold: true }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: "Email: ", font: "Calibri", size: 22, color: MUTED_HEX }),
        new TextRun({ text: "Hoboken.Riverfront@regus.com", font: "Calibri", size: 24, color: "333333", bold: true }),
      ],
    })
  );

  // Wi-Fi
  children.push(
    new Paragraph({
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({ text: "Wi-Fi", font: "Georgia", size: 28, color: ACCENT_HEX, bold: true }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 40 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: "Network: ", font: "Calibri", size: 22, color: MUTED_HEX }),
        new TextRun({ text: "Regus Net Wi-Fi", font: "Calibri", size: 24, color: "333333", bold: true }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: "Password: ", font: "Calibri", size: 22, color: MUTED_HEX }),
        new TextRun({ text: "167845630", font: "Calibri", size: 24, color: "333333", bold: true }),
      ],
    })
  );

  // Divider
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "F0E8F8" } },
      children: [],
    })
  );

  // --- PRIVATE OFFICE ---
  children.push(
    new Paragraph({
      spacing: { before: 300, after: 100 },
      children: [
        new TextRun({ text: "Our Private Office", font: "Georgia", size: 28, color: PURPLE_HEX, bold: true }),
      ],
    })
  );
  children.push(
    new Paragraph({
      spacing: { after: 120 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: "Fully equipped. Reserved for you.", font: "Calibri", size: 22, color: MUTED_HEX, italics: true }),
      ],
    })
  );

  // Office amenities
  children.push(
    new Paragraph({
      spacing: { before: 120, after: 80 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: "Office Amenities:", font: "Calibri", size: 24, color: "333333", bold: true }),
      ],
    })
  );
  for (const amenity of officeAmenities) {
    children.push(
      new Paragraph({
        spacing: { after: 40 },
        indent: { left: 720 },
        bullet: { level: 0 },
        children: [
          new TextRun({ text: amenity, font: "Calibri", size: 24, color: "333333" }),
        ],
      })
    );
  }

  // Office protocols
  children.push(
    new Paragraph({
      spacing: { before: 160, after: 80 },
      indent: { left: 360 },
      children: [
        new TextRun({ text: "Office Protocols:", font: "Calibri", size: 24, color: "333333", bold: true }),
      ],
    })
  );
  for (const protocol of officeProtocols) {
    children.push(
      new Paragraph({
        spacing: { after: 40 },
        indent: { left: 720 },
        bullet: { level: 0 },
        children: [
          new TextRun({ text: protocol, font: "Calibri", size: 24, color: "333333" }),
        ],
      })
    );
  }

  // Divider
  children.push(
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "F0E8F8" } },
      children: [],
    })
  );

  // --- BUILDING FACILITIES ---
  children.push(
    new Paragraph({
      spacing: { before: 300, after: 100 },
      children: [
        new TextRun({ text: "Building Facilities", font: "Georgia", size: 28, color: PURPLE_HEX, bold: true }),
      ],
    })
  );
  for (const facility of facilities) {
    children.push(
      new Paragraph({
        spacing: { after: 40 },
        indent: { left: 720 },
        bullet: { level: 0 },
        children: [
          new TextRun({ text: facility, font: "Calibri", size: 24, color: "333333" }),
        ],
      })
    );
  }

  // Spacer
  children.push(new Paragraph({ spacing: { before: 400, after: 80 }, children: [] }));

  // Corporate footer
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
  saveAs(blob, "Orenda_Hoboken_Riverfront_Center.docx");
}
