import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { toast } from "sonner";

const sections = [
  { num: "1", title: "Permitted Use", content: "The office space at the designated Orenda Psychiatry location is provided solely for Orenda Psychiatry clinical appointments and related authorized activities. The space may not be used for personal business, private patients, or services performed on behalf of another practice, organization, or entity." },
  { num: "2", title: "Non-Solicitation", content: "Provider shall not solicit, recruit, or redirect Orenda Psychiatry patients to any outside practice, service, or business during or after use of the office space." },
  { num: "3", title: "Building Access & Security", content: "Provider agrees to follow all building access and security procedures, including advance scheduling requirements and patient registration with building security where applicable. Providers may not share keys, lockbox codes, access credentials, or building access information with unauthorized persons." },
  { num: "4", title: "Patient Supervision in Shared Space", content: "Providers are responsible for ensuring patients are escorted appropriately within the building. Patients should not move through coworking or shared office areas unaccompanied." },
  { num: "5", title: "Office Care & Reset", content: "Providers must leave the office clean, organized, and in the same condition in which it was found. This includes disposing of trash, resetting the space for the next provider, and returning the office key to the designated lockbox after use." },
  { num: "6", title: "Proper Use of Space", content: "Providers may only use designated office areas for patient care and related administrative work. Hallways, reception areas, and other shared spaces may not be used for clinical visits or business activities unless specifically authorized." },
  { num: "7", title: "Professional Conduct", content: "Providers are expected to maintain professional conduct and behavior while using the office space and interacting with building staff, patients, and other occupants." },
  { num: "8", title: "Safety & Prohibited Items", content: "Providers may not bring prohibited or hazardous items into the office, including weapons, explosives, or unauthorized equipment, and must comply with all health, safety, and privacy requirements." },
  { num: "9", title: "Responsibility for Access Devices and Property", content: "Any office keys, lockbox access codes, badges, or other access devices must be safeguarded and used only as authorized. Lost keys, access issues, or damage to the office must be reported promptly." },
  { num: "10", title: "Scheduling Commitment & Cancellation Policy", content: "Office reservations are intended to support scheduled patient care and operational coordination. Providers should only reserve office time when they are confident they will be able to attend. Providers are expected to avoid last-minute cancellations and should provide at least 48 hours' notice if a change is unavoidable. Frequent late cancellations, failure to attend a reserved office time, or repeated schedule changes may result in restrictions or loss of future office scheduling privileges." },
  { num: "11", title: "Indemnification", content: "Provider agrees to indemnify and hold harmless Orenda Psychiatry from any claims, damages, losses, or liabilities arising from the Provider's use of the office space, except to the extent caused by Orenda Psychiatry's own negligence or misconduct." },
  { num: "12", title: "Independent Provider & Regulatory Responsibility", content: "Provider acknowledges that they are an independent medical professional and not an employee of Orenda Psychiatry. Provider is solely responsible for maintaining all required professional licenses, credentials, malpractice coverage, and for complying with all applicable federal, state, and local laws and regulations governing the practice of medicine, including New Jersey regulatory requirements. Orenda Psychiatry provides administrative and office support only and assumes no responsibility for the Provider's clinical services, medical decision-making, or regulatory compliance." },
];

export default function AgreementPdfRenderer() {
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = useCallback(async () => {
    if (!page1Ref.current || !page2Ref.current) return;
    toast.info("Generating PDF...");

    try {
      // Warm-up render
      await toPng(page1Ref.current, { pixelRatio: 1, skipAutoScale: true });
      await new Promise(r => setTimeout(r, 200));

      const pixelRatio = 3;
      const [img1, img2] = await Promise.all([
        toPng(page1Ref.current, { pixelRatio, cacheBust: true }),
        toPng(page2Ref.current, { pixelRatio, cacheBust: true }),
      ]);

      const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });
      const w = 8.5;
      const h = 11;

      pdf.addImage(img1, "PNG", 0, 0, w, h);
      pdf.addPage();
      pdf.addImage(img2, "PNG", 0, 0, w, h);

      pdf.save("Orenda_Provider_Office_Use_Agreement.pdf");
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF. Please try again.");
    }
  }, []);

  // Page dimensions: 8.5 x 11 inches at 96 DPI = 816 x 1056 px
  const pageStyle = "w-[816px] h-[1056px] bg-white relative overflow-hidden";

  // Split sections: 1-7 on page 1, 8-12 + signature on page 2
  const firstPageSections = sections.slice(0, 7);
  const secondPageSections = sections.slice(7);

  return (
    <>
      {/* Hidden render target */}
      <div className="fixed -left-[9999px] top-0 z-[-1]" aria-hidden="true">
        {/* PAGE 1 */}
        <div ref={page1Ref} className={pageStyle} style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {/* Header with gradient - matches modal style */}
          <div
            className="px-12 pt-10 pb-8 border-b"
            style={{
              background: "linear-gradient(180deg, hsl(270, 40%, 96%), white)",
              borderColor: "hsl(270, 20%, 88%)",
            }}
          >
            <p
              className="text-[9px] tracking-[0.4em] uppercase font-medium mb-2"
              style={{ color: "hsl(270, 100%, 25%)" }}
            >
              Required Agreement
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 300, color: "hsl(270, 60%, 15%)", lineHeight: 1.15, marginBottom: "4px" }}>
              Provider Office Use{" "}
              <em style={{ color: "hsl(270, 60%, 72%)", fontStyle: "italic" }}>
                Agreement & Scheduling Policy
              </em>
            </h1>
            <p style={{ fontSize: "10px", color: "hsl(270, 10%, 50%)", marginTop: "8px" }}>
              Orenda Psychiatry, PLLC · Required for all providers using NJ office space
            </p>
          </div>

          {/* Agreement body - styled like the modal's scrollable box */}
          <div className="px-12 pt-6">
            <div
              className="rounded-xl border p-6"
              style={{
                background: "hsl(270, 40%, 97%)",
                borderColor: "hsl(270, 20%, 90%)",
              }}
            >
              <p style={{ fontSize: "10px", color: "hsl(270, 10%, 50%)", fontStyle: "italic", marginBottom: "12px" }}>
                By reserving and using an Orenda Psychiatry office location, the Provider acknowledges and agrees to the following terms:
              </p>
              {firstPageSections.map((s) => (
                <p key={s.num} style={{ fontSize: "10.5px", lineHeight: 1.65, color: "hsl(270, 10%, 40%)", marginBottom: "10px" }}>
                  <strong style={{ color: "hsl(270, 60%, 15%)" }}>{s.num}. {s.title}.</strong>{" "}
                  {s.content}
                </p>
              ))}
            </div>
          </div>

          {/* Page footer */}
          <div className="absolute bottom-6 left-12 right-12 flex justify-between items-center">
            <p style={{ fontSize: "8px", color: "hsl(270, 10%, 70%)" }}>Orenda Psychiatry, PLLC — Provider Office Use Agreement</p>
            <p style={{ fontSize: "8px", color: "hsl(270, 10%, 70%)" }}>Page 1 of 2</p>
          </div>
        </div>

        {/* PAGE 2 */}
        <div ref={page2Ref} className={pageStyle} style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {/* Continuation header */}
          <div
            className="px-12 pt-8 pb-5 border-b"
            style={{
              background: "linear-gradient(180deg, hsl(270, 40%, 96%), white)",
              borderColor: "hsl(270, 20%, 88%)",
            }}
          >
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 300, color: "hsl(270, 60%, 15%)" }}>
              Agreement & Scheduling Policy <em style={{ color: "hsl(270, 60%, 72%)", fontStyle: "italic" }}>— continued</em>
            </p>
          </div>

          <div className="px-12 pt-6">
            {/* Remaining sections */}
            <div
              className="rounded-xl border p-6 mb-8"
              style={{
                background: "hsl(270, 40%, 97%)",
                borderColor: "hsl(270, 20%, 90%)",
              }}
            >
              {secondPageSections.map((s) => (
                <p key={s.num} style={{ fontSize: "10.5px", lineHeight: 1.65, color: "hsl(270, 10%, 40%)", marginBottom: "10px" }}>
                  <strong style={{ color: "hsl(270, 60%, 15%)" }}>{s.num}. {s.title}.</strong>{" "}
                  {s.content}
                </p>
              ))}
            </div>

            {/* Signature area - matches modal style */}
            <div className="border-t pt-6" style={{ borderColor: "hsl(270, 20%, 88%)" }}>
              <div className="flex items-start gap-3 mb-6">
                <div
                  className="w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5"
                  style={{ borderColor: "hsl(270, 20%, 80%)" }}
                />
                <p style={{ fontSize: "11px", lineHeight: 1.6, color: "hsl(270, 60%, 15%)" }}>
                  I have reviewed, understand, and agree to the <strong>Provider Office Use Agreement & Scheduling Policy</strong>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="mb-2" style={{ fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: "hsl(270, 10%, 50%)" }}>
                    Digital Signature (Full Legal Name)
                  </p>
                  <div className="border-b-2 h-10" style={{ borderColor: "hsl(270, 20%, 85%)" }} />
                </div>
                <div>
                  <p className="mb-2" style={{ fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: "hsl(270, 10%, 50%)" }}>
                    Email Address
                  </p>
                  <div className="border-b-2 h-10" style={{ borderColor: "hsl(270, 20%, 85%)" }} />
                </div>
              </div>

              <div className="w-1/3">
                <p className="mb-2" style={{ fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: "hsl(270, 10%, 50%)" }}>
                  Date
                </p>
                <div className="border-b-2 h-10" style={{ borderColor: "hsl(270, 20%, 85%)" }} />
              </div>
            </div>

            {/* Corporate Information */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: "hsl(270, 20%, 88%)" }}>
              <p style={{ fontSize: "10px", fontWeight: 600, color: "hsl(270, 60%, 15%)", marginBottom: "4px" }}>
                ORENDA PSYCHIATRY, PLLC
              </p>
              <p style={{ fontSize: "9px", color: "hsl(270, 10%, 50%)" }}>
                347 Fifth Ave, Suite 1402-235<br />
                New York, NY 10016
              </p>
            </div>
          </div>

          {/* Page footer */}
          <div className="absolute bottom-6 left-12 right-12 flex justify-between items-center">
            <p style={{ fontSize: "8px", color: "hsl(270, 10%, 70%)" }}>Orenda Psychiatry, PLLC — Provider Office Use Agreement</p>
            <p style={{ fontSize: "8px", color: "hsl(270, 10%, 70%)" }}>Page 2 of 2</p>
          </div>
        </div>
      </div>

      {/* Export the download handler */}
      <button
        id="agreement-pdf-trigger"
        onClick={handleDownloadPdf}
        className="hidden"
        aria-hidden="true"
      />
    </>
  );
}

export function triggerPdfDownload() {
  const btn = document.getElementById("agreement-pdf-trigger");
  if (btn) btn.click();
}
