import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ArrowLeft, MapPin, Navigation, Car } from "lucide-react";
import { Link } from "react-router-dom";
import NJNavbar from "@/components/NJNavbar";
import NJFooter from "@/components/NJFooter";
import logo from "@/assets/orenda-logo-purple.png";

function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="relative w-full cursor-pointer group" onClick={togglePlay}>
      <video
        ref={videoRef}
        src="/videos/edison-directions.mov"
        className="w-full rounded-3xl shadow-2xl"
        style={{ maxHeight: "75vh", boxShadow: "0 40px 80px -20px rgba(80,0,160,0.35)" }}
        playsInline
        onEnded={() => setPlaying(false)}
      />
      {/* Play/Pause overlay */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-3xl z-10"
          >
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{
                background: "linear-gradient(135deg, hsl(270, 80%, 55%), hsl(280, 90%, 40%))",
                boxShadow: "0 8px 40px rgba(128,0,255,0.5)",
              }}
            >
              <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white ml-1.5" fill="white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Subtle pause indicator */}
      {playing && (
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <Pause className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

const quickTips = [
  { icon: Car, title: "Parking", desc: "Free visitor parking in the P1 lot directly in front of the building." },
  { icon: Navigation, title: "Entrance", desc: "Enter through the main glass doors and take the elevator to the 3rd floor." },
  { icon: MapPin, title: "Address", desc: "2875 NJ-27, Suite 300, Edison, NJ 08817" },
];

export default function EdisonDirectionsVideo() {
  return (
    <div className="min-h-screen bg-white">
      <NJNavbar />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(170deg, hsl(270, 100%, 8%) 0%, hsl(270, 60%, 18%) 40%, hsl(270, 40%, 35%) 100%)",
        }}
      >
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(270, 80%, 40%, 0.15) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-28">
          {/* Back link */}
          <Link
            to="/nj-office/edison"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-10 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Edison Office
          </Link>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src={logo} alt="Orenda" className="h-8 brightness-0 invert opacity-60" />
            </div>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-[0.95] tracking-tight mb-4"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              Office Directions
              <br />
              <em className="italic font-extralight" style={{ color: "hsl(270, 80%, 75%)" }}>
                & Access
              </em>
            </h1>
            <p className="text-white/40 text-base sm:text-lg max-w-lg mx-auto mt-4">
              A walkthrough to help you find the building, park, and get to our 3rd floor suite.
            </p>
          </motion.div>

          {/* Video */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-4xl mx-auto"
          >
            <VideoPlayer />
          </motion.div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-16 md:py-24" style={{ background: "linear-gradient(180deg, hsl(270, 30%, 97%) 0%, white 100%)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-12" style={{ color: "hsl(270, 40%, 20%)" }}>
            Quick Reference
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickTips.map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-2xl p-8 text-center"
                style={{
                  background: "white",
                  border: "1px solid hsl(270, 20%, 92%)",
                  boxShadow: "0 4px 20px -4px rgba(100, 0, 200, 0.06)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "hsl(270, 60%, 95%)" }}
                >
                  <tip.icon className="w-7 h-7" style={{ color: "hsl(270, 60%, 45%)" }} />
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "hsl(270, 40%, 15%)" }}>
                  {tip.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(270, 10%, 45%)" }}>
                  {tip.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NJFooter />
    </div>
  );
}
