import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, User, Smartphone, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import orendaLogo from "@/assets/orenda-logo-purple.png";

type Feedback = {
  id: string;
  reviewer_name: string;
  overall_thoughts: string | null;
  checkin_preference: string | null;
  scheduling_feedback: string | null;
  issues_spotted: string | null;
  additional_comments: string | null;
  created_at: string;
};

export default function NJTourResults() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await (supabase.from("walkthrough_feedback") as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setFeedback(data);
      setLoading(false);
    })();
  }, []);

  const prefCounts = feedback.reduce((acc, f) => {
    if (f.checkin_preference) acc[f.checkin_preference] = (acc[f.checkin_preference] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const prefLabels: Record<string, string> = { portal: "Digital Check-In", google_form: "Google Form", unsure: "Unsure" };
  const total = feedback.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 12%) 0%, hsl(270, 80%, 25%) 50%, hsl(270, 60%, 40%) 100%)' }}>
        <div className="relative max-w-5xl mx-auto px-6 py-10 sm:py-14">
          <div className="flex items-center gap-4 mb-6">
            <img src={orendaLogo} alt="Orenda" className="h-9 brightness-0 invert" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">Walkthrough Feedback</h1>
          <p className="text-base text-white/60 mt-2 max-w-xl">Responses from the platform walkthrough.</p>
          <Link to="/admin-dashboard" className="inline-flex items-center gap-2 mt-4 text-xs text-white/40 font-bold uppercase tracking-wider hover:text-white/70 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-muted-foreground text-center py-20">Loading…</p>
        ) : feedback.length === 0 ? (
          <p className="text-muted-foreground text-center py-20">No feedback submitted yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              <div className="rounded-2xl border border-primary/10 bg-card p-5 text-center">
                <p className="text-3xl font-bold text-primary">{total}</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-semibold mt-1">Responses</p>
              </div>
              {Object.entries(prefCounts).map(([key, count]) => (
                <div key={key} className="rounded-2xl border border-primary/10 bg-card p-5 text-center">
                  <p className="text-3xl font-bold text-foreground">{count}</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-semibold mt-1">{prefLabels[key] || key}</p>
                </div>
              ))}
            </div>

            {total > 0 && Object.keys(prefCounts).length > 0 && (
              <div className="mb-10">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-primary" /> Check-In Preference
                </h3>
                <div className="flex rounded-full overflow-hidden h-4">
                  {Object.entries(prefCounts).map(([key, count], i) => {
                    const colors = ["hsl(270,70%,50%)", "hsl(220,60%,50%)", "hsl(0,0%,70%)"];
                    return (
                      <div key={key} style={{ width: `${(count / total) * 100}%`, background: colors[i % colors.length] }}
                        className="transition-all duration-500" title={`${prefLabels[key] || key}: ${count}`} />
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-2">
                  {Object.entries(prefCounts).map(([key, count], i) => {
                    const colors = ["hsl(270,70%,50%)", "hsl(220,60%,50%)", "hsl(0,0%,70%)"];
                    return (
                      <div key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-3 h-3 rounded-full" style={{ background: colors[i % colors.length] }} />
                        {prefLabels[key] || key} ({count})
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Individual Responses
            </h3>
            <div className="space-y-4">
              {feedback.map((f) => (
                <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{f.reviewer_name}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(f.created_at).toLocaleString()}</p>
                    </div>
                    {f.checkin_preference && (
                      <span className="ml-auto text-[10px] tracking-[0.15em] uppercase font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {prefLabels[f.checkin_preference] || f.checkin_preference}
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    {f.overall_thoughts && (
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary/40 mb-0.5">Overall Thoughts</p>
                        <p className="text-sm text-foreground/80">{f.overall_thoughts}</p>
                      </div>
                    )}
                    {f.scheduling_feedback && (
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary/40 mb-0.5">Scheduling Feedback</p>
                        <p className="text-sm text-foreground/80">{f.scheduling_feedback}</p>
                      </div>
                    )}
                    {f.issues_spotted && (
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary/40 mb-0.5 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Issues Spotted
                        </p>
                        <p className="text-sm text-foreground/80">{f.issues_spotted}</p>
                      </div>
                    )}
                    {f.additional_comments && (
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-primary/40 mb-0.5">Additional Comments</p>
                        <p className="text-sm text-foreground/80">{f.additional_comments}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
