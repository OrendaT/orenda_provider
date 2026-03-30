import { useRef } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import orendaLogo from "@/assets/orenda-logo-v2.png";
import artPurpleGold from "@/assets/moodboard/art-purple-gold.png";
import plantTropical from "@/assets/moodboard/plant-tropical.png";
import sideTableGold from "@/assets/moodboard/side-table-gold.png";
import chairsBlueGold from "@/assets/moodboard/chairs-blue-gold.png";
import lampMinimal from "@/assets/moodboard/lamp-minimal.png";
import coffeeTableMarble from "@/assets/moodboard/coffee-table-marble.png";

const items = [
  { src: chairsBlueGold, alt: "Velvet chairs" },
  { src: plantTropical, alt: "Bird of Paradise plant" },
  { src: sideTableGold, alt: "Gold side table" },
  { src: lampMinimal, alt: "Minimal floor lamp" },
  { src: coffeeTableMarble, alt: "Marble nesting tables" },
  { src: artPurpleGold, alt: "Abstract wall art" },
];

const PatientComfortBoard = () => {
  const boardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!boardRef.current) return;
    const dataUrl = await toPng(boardRef.current, {
      width: 1080,
      height: 1920,
      pixelRatio: 3,
      backgroundColor: "#FAF9F7",
    });
    const link = document.createElement("a");
    link.download = "orenda-patient-comfort-setup.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#F3F1EE] flex flex-col items-center py-8 px-4">
      <button
        onClick={handleDownload}
        className="mb-6 flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4B1F8C] text-white text-sm font-medium hover:bg-[#3A1670] transition-colors shadow-lg"
      >
        <Download className="w-4 h-4" />
        Download Graphic
      </button>

      <div
        ref={boardRef}
        className="w-full max-w-[1080px] bg-[#FAF9F7] flex flex-col"
        style={{ fontFamily: "'Montserrat', sans-serif", aspectRatio: "9/16" }}
      >
        {/* Header */}
        <div className="px-10 pt-14 pb-8 text-center">
          <img src={orendaLogo} alt="Orenda Psychiatry" className="h-11 mx-auto mb-5" />
          <h1
            className="text-3xl font-semibold text-[#2D2A33] leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Patient Experience <span className="text-[#4B1F8C]">& Comfort</span>
          </h1>
        </div>

        {/* Grid of images */}
        <div className="px-8 flex-1 grid grid-cols-2 grid-rows-3 gap-4 pb-8">
          {items.map((item) => (
            <div
              key={item.alt}
              className="rounded-2xl overflow-hidden bg-white border border-[#E8E3DD] shadow-sm"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-6 px-8">
          <div className="border-t border-[#E8E3DD] pt-5">
            <img src={orendaLogo} alt="Orenda" className="h-7 mx-auto mb-2 opacity-40" />
            <p className="text-[10px] text-[#B5B0BA]">
              Orenda Psychiatry · NJ Office Setup · Internal Reference
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientComfortBoard;
