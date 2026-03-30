import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Webhook, Check, Loader2, ExternalLink, TestTube } from "lucide-react";

export default function ZapierWebhookSettings() {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [savedUrl, setSavedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("app_settings" as any)
        .select("zapier_webhook_url")
        .eq("id", "default")
        .single();
      const url = (data as any)?.zapier_webhook_url || "";
      setWebhookUrl(url);
      setSavedUrl(url);
      setFetching(false);
    })();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("app_settings" as any)
      .update({ zapier_webhook_url: webhookUrl.trim() || null, updated_at: new Date().toISOString() } as any)
      .eq("id", "default");

    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    } else {
      setSavedUrl(webhookUrl.trim());
      toast({ title: "Webhook URL saved", description: "Zapier SMS notifications are now active." });
    }
    setLoading(false);
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke("notify-provider-checkin", {
        body: {
          patientName: "Test Patient",
          appointmentDate: new Date().toISOString().split("T")[0],
          appointmentTime: "10:00 AM",
          location: "Hoboken",
          providerName: "Test Provider",
        },
      });
      if (error) throw error;
      toast({ title: "Test sent!", description: "Check your Zapier dashboard and phone for the SMS." });
    } catch (err: any) {
      toast({ title: "Test failed", description: err.message, variant: "destructive" });
    }
    setTesting(false);
  };

  if (fetching) return <div className="animate-pulse h-32 bg-muted/30 rounded-2xl" />;

  return (
    <div className="rounded-2xl border-2 border-border bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(25, 90%, 45%) 0%, hsl(35, 95%, 55%) 100%)" }}>
          <Webhook className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">Zapier SMS Notifications</h3>
          <p className="text-xs text-muted-foreground">Send SMS via Zapier when a patient checks in</p>
        </div>
        {savedUrl && (
          <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
            <Check className="w-3 h-3" /> Active
          </span>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="rounded-xl bg-muted/30 border border-border p-4 text-xs text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground text-sm">How to set up:</p>
          <ol className="list-decimal list-inside space-y-1.5">
            <li>Go to <a href="https://zapier.com/app/zaps" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">zapier.com <ExternalLink className="w-3 h-3 inline" /></a> and create a new Zap</li>
            <li>For the <strong>Trigger</strong>, choose <strong>"Webhooks by Zapier"</strong> → <strong>"Catch Hook"</strong></li>
            <li>Copy the webhook URL Zapier gives you and paste it below</li>
            <li>For the <strong>Action</strong>, choose <strong>"SMS by Zapier"</strong> or <strong>"Twilio"</strong></li>
            <li>Map the fields: <code className="bg-muted px-1 rounded">patient_name</code>, <code className="bg-muted px-1 rounded">message</code>, <code className="bg-muted px-1 rounded">location</code></li>
            <li>Turn on the Zap and click "Test" below</li>
          </ol>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Zapier Webhook URL</label>
          <Input
            placeholder="https://hooks.zapier.com/hooks/catch/..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={loading || webhookUrl === savedUrl} className="gap-1.5">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save
          </Button>
          {savedUrl && (
            <Button variant="outline" onClick={handleTest} disabled={testing} className="gap-1.5">
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
              Send Test
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
