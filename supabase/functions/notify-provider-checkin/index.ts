import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientName, appointmentDate, appointmentTime, location, providerName } = await req.json();

    console.log(`[CHECK-IN NOTIFICATION] Patient: ${patientName}, Provider: ${providerName}, Date: ${appointmentDate}, Time: ${appointmentTime}, Location: ${location}`);

    // Look up the Zapier webhook URL from app_settings
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: settings } = await supabase
      .from("app_settings")
      .select("zapier_webhook_url")
      .eq("id", "default")
      .single();

    const webhookUrl = settings?.zapier_webhook_url;

    if (webhookUrl) {
      console.log("[ZAPIER] Sending check-in notification to webhook...");
      try {
        const zapierResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "patient_checkin",
            patient_name: patientName,
            appointment_date: appointmentDate,
            appointment_time: appointmentTime,
            location: location,
            provider_name: providerName,
            checked_in_at: new Date().toISOString(),
            message: `${patientName} has checked in for their ${appointmentTime} appointment at ${location}.`,
          }),
        });
        console.log(`[ZAPIER] Response status: ${zapierResponse.status}`);
      } catch (zapierError) {
        console.error("[ZAPIER] Failed to call webhook:", zapierError);
      }
    } else {
      console.log("[ZAPIER] No webhook URL configured — skipping SMS notification");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Provider notified", webhookConfigured: !!webhookUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
