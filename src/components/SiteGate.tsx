import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";
import logo from "@/assets/orenda-logo-purple.png";

const GATE_KEY = "orenda_site_access";
const PASSCODE = "Purple123!";

export default function SiteGate({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(GATE_KEY);
    if (stored === "true") setAuthorized(true);
    setChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSCODE) {
      sessionStorage.setItem(GATE_KEY, "true");
      setAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  };

  if (checking) return null;
  if (authorized) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(270, 40%, 96%), hsl(270, 30%, 92%), hsl(0, 0%, 100%))' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-primary/10 shadow-2xl p-8 sm:p-12">
          <div className="text-center mb-8">
            <img src={logo} alt="Orenda Psychiatry" className="h-8 mx-auto mb-6" />
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2">
              Authorized Access
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your access code to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(false); }}
                placeholder="Access code"
                autoFocus
                className="w-full px-5 py-4 rounded-xl border-2 border-primary/15 bg-white text-foreground text-center text-lg tracking-widest placeholder:text-muted-foreground/40 placeholder:tracking-normal focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all"
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-xs text-center mt-2 font-medium"
                >
                  Incorrect access code
                </motion.p>
              )}
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-sm tracking-wide hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20"
            >
              Enter <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-muted-foreground/40 text-[10px] tracking-widest uppercase mt-8">
            Orenda Psychiatry · Internal Resource
          </p>
        </div>
      </motion.div>
    </div>
  );
}
