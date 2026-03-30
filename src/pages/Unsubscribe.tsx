import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "valid" | "already" | "invalid" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    const validate = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
        );
        const data = await res.json();
        if (!res.ok) { setStatus("invalid"); return; }
        if (data.valid === false && data.reason === "already_unsubscribed") { setStatus("already"); return; }
        setStatus("valid");
      } catch { setStatus("error"); }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) { setStatus("error"); return; }
      if (data?.success) { setStatus("success"); }
      else if (data?.reason === "already_unsubscribed") { setStatus("already"); }
      else { setStatus("error"); }
    } catch { setStatus("error"); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <img src="/placeholder.svg" alt="" className="h-10 mx-auto opacity-50" />
        {status === "loading" && <p className="text-muted-foreground">Validating your request...</p>}
        {status === "valid" && (
          <>
            <h1 className="font-display text-2xl font-bold text-foreground">Unsubscribe</h1>
            <p className="text-muted-foreground text-sm">Are you sure you want to unsubscribe from email notifications?</p>
            <button
              onClick={handleUnsubscribe}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Confirm Unsubscribe
            </button>
          </>
        )}
        {status === "success" && (
          <>
            <h1 className="font-display text-2xl font-bold text-foreground">Unsubscribed</h1>
            <p className="text-muted-foreground text-sm">You've been successfully unsubscribed from email notifications.</p>
          </>
        )}
        {status === "already" && (
          <>
            <h1 className="font-display text-2xl font-bold text-foreground">Already Unsubscribed</h1>
            <p className="text-muted-foreground text-sm">This email address has already been unsubscribed.</p>
          </>
        )}
        {status === "invalid" && (
          <>
            <h1 className="font-display text-2xl font-bold text-foreground">Invalid Link</h1>
            <p className="text-muted-foreground text-sm">This unsubscribe link is invalid or has expired.</p>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="font-display text-2xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground text-sm">Please try again later or contact support.</p>
          </>
        )}
      </div>
    </div>
  );
}
