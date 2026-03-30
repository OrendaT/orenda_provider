import { useRef } from "react";
import { toPng } from "html-to-image";
import { Phone, Smartphone, QrCode, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import qrCode from "@/assets/checkin-qr-code.png";
import logo from "@/assets/orenda-logo-purple.png";
import floorMockup from "@/assets/signage/floor-sign-mockup.jpg";
import deskMockup from "@/assets/signage/desk-sign-mockup.jpg";

const exportHighRes = async (ref: React.RefObject<HTMLDivElement>, name: string) => {
  if (!ref.current) return;
  try {
    toast.info("Generating high-res image…");
    // Warm-up pass for stable asset loading
    await toPng(ref.current, { pixelRatio: 1, cacheBust: true, backgroundColor: "#ffffff" });
    await new Promise((r) => setTimeout(r, 300));
    // Full-res capture at 4x
    const dataUrl = await toPng(ref.current, {
      pixelRatio: 4,
      cacheBust: true,
      backgroundColor: "#ffffff",
      width: ref.current.scrollWidth,
      height: ref.current.scrollHeight,
    });
    const link = document.createElement("a");
    link.download = `${name}.png`;
    link.href = dataUrl;
    link.click();
    toast.success(`${name}.png downloaded!`);
  } catch {
    toast.error("Export failed — please try again.");
  }
};

const copyImageForEmail = async (imgSrc: string, name: string) => {
  try {
    toast.info("Copying image…");
    const response = await fetch(imgSrc);
    const blob = await response.blob();
    const pngBlob = blob.type === "image/png" ? blob : await new Promise<Blob>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((b) => resolve(b!), "image/png");
      };
      img.src = URL.createObjectURL(blob);
    });
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": pngBlob }),
    ]);
    toast.success(`${name} copied — paste into your email!`);
  } catch {
    toast.error("Copy failed — your browser may not support image clipboard.");
  }
};

const copyPageForEmail = async () => {
  try {
    toast.info("Building email content…");

    // Convert images to base64 data URLs for embedding
    const toBase64 = async (src: string): Promise<string> => {
      const res = await fetch(src);
      const blob = await res.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    };

    const [floorB64, deskB64, logoB64] = await Promise.all([
      toBase64(floorMockup),
      toBase64(deskMockup),
      toBase64(logo),
    ]);

    const html = `
<div style="font-family: Georgia, 'Times New Roman', serif; max-width: 680px; margin: 0 auto; background: #f8f5fc;">
  <div style="background: linear-gradient(170deg, #1a0033 0%, #2d1054 40%, #5c3d8f 100%); padding: 48px 24px; text-align: center;">
    <img src="${logoB64}" alt="Orenda Psychiatry" style="height: 40px; filter: brightness(0) invert(1); margin-bottom: 20px;" />
    <h1 style="color: #ffffff; font-size: 36px; font-weight: 600; margin: 0 0 12px 0;">Patient Check-In Signage</h1>
    <p style="color: rgba(255,255,255,0.7); font-size: 16px; margin: 0;">Print-ready signage for your office — branded to match the Orenda digital experience.</p>
  </div>

  <div style="padding: 48px 24px;">
    <div style="text-align: center; margin-bottom: 16px;">
      <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #9b8bb4; margin: 0 0 8px 0;">Design 1</p>
      <h2 style="font-size: 28px; font-weight: 600; color: #1a1a2e; margin: 0 0 4px 0;">Large Floor Sign</h2>
      <p style="font-size: 14px; color: #6b7280; margin: 0;">24 × 36 in — easel or standing lobby sign</p>
    </div>
    <img src="${floorB64}" alt="Floor Sign Mockup" style="width: 100%; max-width: 600px; display: block; margin: 0 auto; border-radius: 12px;" />
  </div>

  <div style="padding: 16px 24px 48px;">
    <div style="text-align: center; margin-bottom: 16px;">
      <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #9b8bb4; margin: 0 0 8px 0;">Design 2</p>
      <h2 style="font-size: 28px; font-weight: 600; color: #1a1a2e; margin: 0 0 4px 0;">Acrylic Desk Sign</h2>
      <p style="font-size: 14px; color: #6b7280; margin: 0;">5 × 7 in — tabletop sign for the reception desk</p>
    </div>
    <img src="${deskB64}" alt="Desk Sign Mockup" style="width: 100%; max-width: 600px; display: block; margin: 0 auto; border-radius: 12px;" />
  </div>

  <div style="background: linear-gradient(90deg, #1a0033, #3b1a6e); padding: 20px; text-align: center;">
    <img src="${logoB64}" alt="Orenda Psychiatry" style="height: 24px; filter: brightness(0) invert(1); opacity: 0.6;" />
  </div>
</div>`;

    const plainText = `Orenda Psychiatry — Patient Check-In Signage\n\nDesign 1: Large Floor Sign (24×36 in)\nDesign 2: Acrylic Desk Sign (5×7 in)\n\nSee attached images for mockups.`;

    const htmlBlob = new Blob([html], { type: "text/html" });
    const textBlob = new Blob([plainText], { type: "text/plain" });

    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": htmlBlob,
        "text/plain": textBlob,
      }),
    ]);
    toast.success("Full page copied — paste into your email!");
  } catch {
    toast.error("Copy failed — your browser may not support rich clipboard.");
  }
};

const NJCheckInSignage = () => {
  const floorRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen" style={{ background: "hsl(270 20% 97%)" }}>
      {/* ── Hero ── */}
      <div
        className="relative py-20 px-6 text-center"
        style={{
          background: "linear-gradient(170deg, hsl(270 100% 15%) 0%, hsl(270 80% 25%) 40%, hsl(270 60% 40%) 100%)",
        }}
      >
        <img src={logo} alt="Orenda Psychiatry" className="h-10 mx-auto mb-6 brightness-0 invert" />
        <h1 className="text-4xl md:text-5xl font-display font-semibold text-white leading-tight">
          Patient Check-In Signage
        </h1>
        <p className="text-lg text-white/70 mt-4 max-w-xl mx-auto font-body">
          Print-ready signage for your office — branded to match the Orenda digital experience.
        </p>
        <Button
          size="lg"
          className="mt-8 gap-2.5 text-base px-8 py-6 rounded-xl shadow-lg"
          style={{ background: "white", color: "hsl(270 100% 25%)" }}
          onClick={copyPageForEmail}
        >
          <Copy className="w-5 h-5" />
          Copy Entire Page for Email
        </Button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-32">

        {/* ═══════════════════════════════════════
           1 ▸ LARGE FLOOR SIGN
           ═══════════════════════════════════════ */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-body">Design 1</span>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">Large Floor Sign</h2>
            <p className="text-muted-foreground font-body">24 × 36 in — easel or standing lobby sign outside the office door</p>
          </div>

          {/* Mockup photo */}
          <div className="rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
            <img src={floorMockup} alt="Floor sign on easel in modern office hallway" className="w-full h-auto" />
          </div>

          {/* Copy for email */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="gap-2.5 text-base px-8 py-5 rounded-xl border-2"
              style={{ borderColor: "hsl(270 60% 70%)", color: "hsl(270 80% 35%)" }}
              onClick={() => copyImageForEmail(floorMockup, "Floor Sign")}
            >
              <Copy className="w-5 h-5" />
              Copy Floor Sign for Email
            </Button>
          </div>

          {/* Actual sign design */}
          <div className="flex justify-center">
            <div
              ref={floorRef}
              className="relative w-full max-w-[520px] shadow-2xl rounded-2xl overflow-hidden"
              style={{ aspectRatio: "2 / 3" }}
            >
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(270 30% 97%) 0%, hsl(270 20% 94%) 40%, hsl(270 25% 91%) 100%)" }} />
              <div className="absolute top-0 inset-x-0 h-3" style={{ background: "linear-gradient(90deg, hsl(270 100% 25%), hsl(270 80% 45%), hsl(270 100% 25%))" }} />

              <div className="relative z-10 flex flex-col items-center justify-between h-full px-10 py-10 text-center">
                <img src={logo} alt="Orenda Psychiatry" className="h-8 md:h-10" />

                <div className="space-y-3">
                  <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight" style={{ color: "hsl(270 100% 20%)" }}>
                    Welcome —<br />Please Check In
                  </h2>
                  <div className="mx-auto w-20 h-[2px] rounded-full" style={{ background: "hsl(270 80% 65%)" }} />
                </div>

                <div className="space-y-4 max-w-sm">
                  <p className="text-sm md:text-base tracking-wide uppercase font-semibold" style={{ color: "hsl(270 50% 40%)" }}>
                    To check in for your appointment:
                  </p>
                  <ol className="text-base md:text-lg space-y-3 text-left list-none" style={{ color: "hsl(270 30% 20%)" }}>
                    {["Scan the QR code below", "Complete the quick check-in", "Your provider will be notified when you arrive", "Your provider will be with you shortly"].map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5" style={{ background: "hsl(270 80% 45%)" }}>{i + 1}</span>
                        <span className="leading-snug">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="space-y-3">
                  <div className="w-44 h-44 md:w-52 md:h-52 mx-auto rounded-xl p-3 shadow-lg" style={{ background: "white", border: "2px solid hsl(270 40% 85%)" }}>
                    <img src={qrCode} alt="Check-in QR code" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Smartphone className="w-4 h-4" style={{ color: "hsl(270 60% 50%)" }} />
                    <p className="text-sm md:text-base font-semibold" style={{ color: "hsl(270 60% 40%)" }}>Scan Here to Check In</p>
                  </div>
                </div>

                <div className="space-y-2 pb-1">
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" style={{ color: "hsl(270 50% 45%)" }} />
                    <p className="text-sm md:text-base" style={{ color: "hsl(270 30% 30%)" }}>If you need assistance, please call the office.</p>
                  </div>
                  <p className="text-sm font-medium" style={{ color: "hsl(270 40% 35%)" }}>(347) 707-7735 &nbsp;·&nbsp; admin@orendapsych.com</p>
                  <div className="mx-auto w-28 h-[1px] mt-2" style={{ background: "hsl(270 30% 80%)" }} />
                  <p className="text-[9px] tracking-[0.25em] uppercase opacity-50" style={{ color: "hsl(270 30% 40%)" }}>orendapsych.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Download button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              className="gap-2.5 text-base px-8 py-6 rounded-xl shadow-lg"
              style={{ background: "hsl(270 100% 25%)", color: "white" }}
              onClick={() => exportHighRes(floorRef, "Orenda_Floor_Sign_HighRes")}
            >
              <Download className="w-5 h-5" />
              Download Floor Sign — High Res PNG
            </Button>
          </div>
        </section>

        {/* ═══════════════════════════════════════
           2 ▸ ACRYLIC DESK SIGN
           ═══════════════════════════════════════ */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-body">Design 2</span>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">Acrylic Desk Sign</h2>
            <p className="text-muted-foreground font-body">5 × 7 in — tabletop sign for the reception desk or waiting area</p>
          </div>

          {/* Mockup photo */}
          <div className="rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
            <img src={deskMockup} alt="Acrylic desk sign on modern reception desk" className="w-full h-auto" />
          </div>

          {/* Copy for email */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="gap-2.5 text-base px-8 py-5 rounded-xl border-2"
              style={{ borderColor: "hsl(270 60% 70%)", color: "hsl(270 80% 35%)" }}
              onClick={() => copyImageForEmail(deskMockup, "Desk Sign")}
            >
              <Copy className="w-5 h-5" />
              Copy Desk Sign for Email
            </Button>
          </div>

          {/* Actual sign design */}
          <div className="flex justify-center">
            <div
              ref={deskRef}
              className="relative w-full max-w-[400px] shadow-2xl rounded-xl overflow-hidden"
              style={{ aspectRatio: "5 / 7" }}
            >
              <div className="absolute inset-0" style={{ background: "linear-gradient(170deg, hsl(0 0% 100%) 0%, hsl(270 25% 96%) 60%, hsl(270 20% 93%) 100%)" }} />
              <div className="absolute top-0 inset-x-0 h-2" style={{ background: "linear-gradient(90deg, hsl(270 100% 25%), hsl(270 70% 50%))" }} />

              <div className="relative z-10 flex flex-col items-center justify-between h-full px-8 py-8 text-center">
                <img src={logo} alt="Orenda Psychiatry" className="h-7 md:h-8" />

                <div className="space-y-2">
                  <h2 className="font-display text-3xl md:text-4xl font-semibold" style={{ color: "hsl(270 100% 20%)" }}>Please Check In</h2>
                  <div className="mx-auto w-14 h-[2px] rounded-full" style={{ background: "hsl(270 80% 65%)" }} />
                </div>

                <div className="space-y-2">
                  <p className="text-base md:text-lg leading-relaxed max-w-[260px]" style={{ color: "hsl(270 25% 25%)" }}>
                    For your appointment today, please scan the QR&nbsp;code below to check&nbsp;in.
                  </p>
                  <p className="text-sm italic" style={{ color: "hsl(270 40% 50%)" }}>Your provider will be notified when you arrive.</p>
                </div>

                <div className="space-y-2.5">
                  <div className="w-36 h-36 md:w-40 md:h-40 mx-auto rounded-lg p-2.5 shadow-md" style={{ background: "white", border: "2px solid hsl(270 35% 87%)" }}>
                    <img src={qrCode} alt="Check-in QR code" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <QrCode className="w-3.5 h-3.5" style={{ color: "hsl(270 60% 50%)" }} />
                    <p className="text-sm font-semibold" style={{ color: "hsl(270 55% 40%)" }}>Scan to Check In</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs" style={{ color: "hsl(270 30% 40%)" }}>Need assistance? Call (347) 707-7735</p>
                  <p className="text-[8px] tracking-[0.2em] uppercase opacity-40" style={{ color: "hsl(270 30% 35%)" }}>orendapsych.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Download button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              className="gap-2.5 text-base px-8 py-6 rounded-xl shadow-lg"
              style={{ background: "hsl(270 100% 25%)", color: "white" }}
              onClick={() => exportHighRes(deskRef, "Orenda_Desk_Sign_HighRes")}
            >
              <Download className="w-5 h-5" />
              Download Desk Sign — High Res PNG
            </Button>
          </div>
        </section>
      </div>

      {/* Bottom brand bar */}
      <div className="py-6 text-center" style={{ background: "linear-gradient(90deg, hsl(270 100% 20%), hsl(270 80% 35%))" }}>
        <img src={logo} alt="Orenda Psychiatry" className="h-6 mx-auto brightness-0 invert opacity-60" />
      </div>
    </div>
  );
};

export default NJCheckInSignage;
