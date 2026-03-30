import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import NJFooter from "@/components/NJFooter";
import { Lock, Check } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/orenda-logo-purple.png";

export default function NJResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error("Failed to update password. Please try again.");
    } else {
      toast.success("Password updated successfully!");
      navigate("/provider-portal");
    }
    setLoading(false);
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-white font-body flex items-center justify-center">
        <div className="text-center px-8">
          <img src={logo} alt="Orenda Psychiatry" className="h-10 mx-auto mb-6" />
          <p className="text-muted-foreground">Invalid or expired reset link.</p>
          <button onClick={() => navigate("/provider-login")} className="mt-4 text-primary text-sm underline">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-body flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <img src={logo} alt="Orenda Psychiatry" className="h-10 mx-auto mb-6" />
            <h1 className="font-display text-3xl font-light text-foreground">
              Reset <em className="text-italic-accent" style={{ fontStyle: "italic" }}>Password</em>
            </h1>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-foreground uppercase tracking-wider mb-2 block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-11 pr-4 py-3.5 border-2 border-border/30 rounded-xl text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  required
                  minLength={8}
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground uppercase tracking-wider mb-2 block">Confirm Password</label>
              <div className="relative">
                <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full pl-11 pr-4 py-3.5 border-2 border-border/30 rounded-xl text-sm focus:outline-none focus:border-primary/40 transition-colors"
                  required
                  minLength={8}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-white font-medium text-sm py-3.5 rounded-xl hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
      <NJFooter />
    </div>
  );
}
