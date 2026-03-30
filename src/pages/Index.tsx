import { useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import orendaLogo from "@/assets/orenda-logo-v2.png";
import tentCardImage from "@/assets/tent-card.png";
import tentCardMockup from "@/assets/tent-card-mockup.png";
import businessCardFront from "@/assets/business-card-front.png";
import businessCardBack from "@/assets/business-card-back.png";

const PRINT_DPI = 300;
const TENT_CARD_WIDTH_IN = 5;
const TENT_CARD_HEIGHT_IN = 7;
const TENT_CARD_WIDTH_PX = TENT_CARD_WIDTH_IN * PRINT_DPI;
const TENT_CARD_HEIGHT_PX = TENT_CARD_HEIGHT_IN * PRINT_DPI;

const BIZ_CARD_DPI = 600;
const BIZ_CARD_WIDTH_IN = 3.5;
const BIZ_CARD_HEIGHT_IN = 2;
const BIZ_CARD_WIDTH_PX = BIZ_CARD_WIDTH_IN * BIZ_CARD_DPI; // 2100
const BIZ_CARD_HEIGHT_PX = BIZ_CARD_HEIGHT_IN * BIZ_CARD_DPI; // 1200

const Index = () => {
  const tentCardRef = useRef<HTMLDivElement>(null);
  const bizCardFrontRef = useRef<HTMLDivElement>(null);
  const bizCardBackRef = useRef<HTMLDivElement>(null);

  const downloadTentCard = useCallback(async () => {
    if (!tentCardRef.current) return;
    try {
      const dataUrl = await toPng(tentCardRef.current, {
        width: TENT_CARD_WIDTH_PX,
        height: TENT_CARD_HEIGHT_PX,
        pixelRatio: 1,
        canvasWidth: TENT_CARD_WIDTH_PX,
        canvasHeight: TENT_CARD_HEIGHT_PX,
      });
      const link = document.createElement("a");
      link.download = "orenda-tent-card-5x7.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  }, []);

  const downloadBizCard = useCallback(async (
    ref: React.RefObject<HTMLDivElement>,
    filename: string
  ) => {
    if (!ref.current) return;
    try {
      const dataUrl = await toPng(ref.current, {
        width: BIZ_CARD_WIDTH_PX,
        height: BIZ_CARD_HEIGHT_PX,
        pixelRatio: 1,
        canvasWidth: BIZ_CARD_WIDTH_PX,
        canvasHeight: BIZ_CARD_HEIGHT_PX,
      });
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gorgeous background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, hsl(270 80% 85% / 0.6) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, hsl(260 70% 80% / 0.4) 0%, transparent 40%), radial-gradient(ellipse at 50% 80%, hsl(280 60% 88% / 0.5) 0%, transparent 50%), linear-gradient(180deg, hsl(270 30% 97%) 0%, hsl(270 20% 94%) 30%, hsl(270 25% 92%) 60%, hsl(270 35% 88%) 100%)",
        }}
      />
      {/* Subtle floating orbs */}
      <div
        className="fixed top-20 left-10 w-72 h-72 rounded-full opacity-30 blur-3xl animate-pulse"
        style={{ background: "hsl(270 80% 75%)" }}
      />
      <div
        className="fixed bottom-32 right-16 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
        style={{ background: "hsl(260 70% 70%)", animationDelay: "2s" }}
      />
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
        style={{ background: "hsl(275 60% 65%)" }}
      />

      {/* Header */}
      <header className="relative pt-16 pb-12 text-center">
        <img
          src={orendaLogo}
          alt="Orenda Psychiatry"
          className="w-48 mx-auto mb-6"
        />
        <h1
          className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-3"
          style={{ color: "hsl(270 100% 20%)" }}
        >
          Marketing Materials
        </h1>
        <p
          className="font-body text-lg tracking-widest uppercase"
          style={{ color: "hsl(270 50% 45%)" }}
        >
          Orenda Psychiatry
        </p>
        <div
          className="mx-auto mt-6 w-24 h-1 rounded-full"
          style={{ background: "linear-gradient(90deg, hsl(270 80% 60%), hsl(270 100% 30%))" }}
        />
      </header>

      {/* Tent Card Section */}
      <main className="relative max-w-5xl mx-auto px-8 pb-24">
        <section className="flex flex-col items-center">
          <span
            className="font-body text-sm font-semibold tracking-[0.3em] uppercase mb-8"
            style={{ color: "hsl(270 60% 50%)" }}
          >
            Tent Card
          </span>

          {/* Glass container */}
          <div
            className="rounded-3xl p-8 md:p-12"
            style={{
              background: "hsl(0 0% 100% / 0.45)",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 25px 60px -15px hsl(270 60% 40% / 0.15), 0 0 0 1px hsl(270 40% 80% / 0.3)",
            }}
          >
            {/* The downloadable tent card — sized 5:7 aspect ratio on screen */}
            <div
              ref={tentCardRef}
              style={{
                width: 400,
                height: 560,
                filter: "drop-shadow(0 20px 40px hsl(270 60% 30% / 0.2))",
              }}
            >
              <img
                src={tentCardImage}
                alt="Orenda Psychiatry Tent Card — What We Treat"
                className="w-full h-full object-cover rounded-xl"
                style={{ display: "block" }}
              />
            </div>
          </div>

          {/* Download button */}
          <button
            onClick={downloadTentCard}
            className="mt-6 flex items-center gap-2 px-6 py-3 rounded-full font-body text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer"
            style={{
              background: "hsl(270 100% 25%)",
              color: "hsl(0 0% 100%)",
              boxShadow: "0 4px 15px hsl(270 80% 30% / 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "hsl(270 100% 32%)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "hsl(270 100% 25%)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Download size={16} />
            Download 5″ × 7″ Print-Ready
          </button>
          <p
            className="mt-2 font-body text-xs tracking-wider"
            style={{ color: "hsl(270 40% 55%)" }}
          >
            {TENT_CARD_WIDTH_PX} × {TENT_CARD_HEIGHT_PX}px &nbsp;·&nbsp; 300 DPI
          </p>
        </section>

        {/* Mockup Preview Section */}
        <section className="flex flex-col items-center mt-28">
          <span
            className="font-body text-sm font-semibold tracking-[0.3em] uppercase mb-3"
            style={{ color: "hsl(270 60% 50%)" }}
          >
            Preview
          </span>
          <h2
            className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center"
            style={{ color: "hsl(270 100% 20%)" }}
          >
            Tent Card in Action
          </h2>

          <div
            className="rounded-3xl overflow-hidden"
            style={{
              boxShadow:
                "0 30px 70px -15px hsl(270 60% 40% / 0.2), 0 0 0 1px hsl(270 40% 80% / 0.3)",
            }}
          >
            <img
              src={tentCardMockup}
              alt="Orenda Psychiatry tent card displayed on a reception desk"
              className="w-full max-w-2xl"
              style={{ display: "block" }}
            />
          </div>
        </section>

        {/* Business Card Section */}
        <section className="flex flex-col items-center mt-28">
          <span
            className="font-body text-sm font-semibold tracking-[0.3em] uppercase mb-8"
            style={{ color: "hsl(270 60% 50%)" }}
          >
            Business Card
          </span>

          <div className="flex flex-col md:flex-row gap-10 items-center">
            {/* Front */}
            <div className="flex flex-col items-center">
              <p className="font-body text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "hsl(270 40% 55%)" }}>Front</p>
              <div
                className="rounded-3xl p-6"
                style={{
                  background: "hsl(0 0% 100% / 0.45)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 25px 60px -15px hsl(270 60% 40% / 0.15), 0 0 0 1px hsl(270 40% 80% / 0.3)",
                }}
              >
                <div
                  ref={bizCardFrontRef}
                  style={{
                    width: 350,
                    height: 200,
                    filter: "drop-shadow(0 12px 30px hsl(270 60% 30% / 0.2))",
                  }}
                >
                  <img
                    src={businessCardFront}
                    alt="Orenda Psychiatry Business Card — Front"
                    className="w-full h-full object-cover rounded-lg"
                    style={{ display: "block" }}
                  />
                </div>
              </div>
              <button
                onClick={() => downloadBizCard(bizCardFrontRef, "orenda-business-card-front-3.5x2.png")}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer"
                style={{
                  background: "hsl(270 100% 25%)",
                  color: "hsl(0 0% 100%)",
                  boxShadow: "0 4px 15px hsl(270 80% 30% / 0.3)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(270 100% 32%)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "hsl(270 100% 25%)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <Download size={14} />
                Download Front
              </button>
            </div>

            {/* Back */}
            <div className="flex flex-col items-center">
              <p className="font-body text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "hsl(270 40% 55%)" }}>Back</p>
              <div
                className="rounded-3xl p-6"
                style={{
                  background: "hsl(0 0% 100% / 0.45)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 25px 60px -15px hsl(270 60% 40% / 0.15), 0 0 0 1px hsl(270 40% 80% / 0.3)",
                }}
              >
                <div
                  ref={bizCardBackRef}
                  style={{
                    width: 350,
                    height: 200,
                    filter: "drop-shadow(0 12px 30px hsl(270 60% 30% / 0.2))",
                  }}
                >
                  <img
                    src={businessCardBack}
                    alt="Orenda Psychiatry Business Card — Back"
                    className="w-full h-full object-cover rounded-lg"
                    style={{ display: "block" }}
                  />
                </div>
              </div>
              <button
                onClick={() => downloadBizCard(bizCardBackRef, "orenda-business-card-back-3.5x2.png")}
                className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer"
                style={{
                  background: "hsl(270 100% 25%)",
                  color: "hsl(0 0% 100%)",
                  boxShadow: "0 4px 15px hsl(270 80% 30% / 0.3)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "hsl(270 100% 32%)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "hsl(270 100% 25%)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <Download size={14} />
                Download Back
              </button>
            </div>
          </div>

          <p
            className="mt-4 font-body text-xs tracking-wider"
            style={{ color: "hsl(270 40% 55%)" }}
          >
            {BIZ_CARD_WIDTH_PX} × {BIZ_CARD_HEIGHT_PX}px &nbsp;·&nbsp; 600 DPI &nbsp;·&nbsp; 3.5″ × 2″
          </p>
        </section>
      </main>
    </div>
  );
};

export default Index;
