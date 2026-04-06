import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import logo from "@/assets/orenda-logo-purple.png";
import { useToast } from "@/hooks/use-toast";

export default function NJProviderLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // If already logged in, redirect to portal
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/provider-portal", { replace: true });
      }
      setChecking(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/provider-portal", { replace: true });
      }
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message === "Invalid login credentials"
          ? "Incorrect email or password. Please try again."
          : error.message,
        variant: "destructive",
      });
      return;
    }

    navigate("/provider-portal", { replace: true });
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ title: "Enter your email", description: "Please enter your email address first.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "A password reset link has been sent." });
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4" style={{ background: "linear-gradient(180deg, hsl(270, 40%, 96%) 0%, hsl(0, 0%, 100%) 100%)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logo} alt="Orenda Psychiatry" className="h-12 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-light text-foreground">
            Provider <em className="text-italic-accent" style={{ fontStyle: "italic" }}>Login</em>
          </h1>
          <p className="text-muted-foreground text-xs mt-2"> in to access your portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-semibold block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border/50 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                placeholder="you@orendapsych.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-semibold block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border/50 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-semibold text-sm py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Sign In"}
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot password?
          </button>
        </form>

        <p className="text-center text-[10px] text-muted-foreground/60 mt-6">
          ORENDA PSYCHIATRY, PLLC · Provider Portal
        </p>
      </motion.div>
    </div>
  );
}
