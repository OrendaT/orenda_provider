import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TWILIO_GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

function formatTime12(time24: string): string {
  const [h, m] = time24.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${m} ${ampm}`;
}

function buildEmailHtml(data: {
  firstName: string;
  providerName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  confirmationCode: string;
  checkinUrl: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f3f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3f8;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.08);">
  <tr><td style="background:linear-gradient(135deg,hsl(270,100%,20%),hsl(270,80%,35%),hsl(270,60%,50%));padding:40px 32px;text-align:center;">
    <div style="display:inline-block;background:rgba(255,255,255,0.1);border-radius:100px;padding:6px 16px;margin-bottom:12px;">
      <span style="color:rgba(255,255,255,0.9);font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">✓ Appointment Confirmed</span>
    </div>
    <h1 style="color:#fff;font-size:24px;margin:8px 0 4px;">Orenda Psychiatry</h1>
    <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;">Your upcoming visit details</p>
  </td></tr>
  <tr><td style="padding:32px;">
    <p style="font-size:15px;color:#374151;margin:0 0 16px;">Hi <strong style="color:#111">${data.firstName}</strong>,</p>
    <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:0 0 24px;">Your appointment has been confirmed. Here are your visit details — please save this for your records.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#faf5ff,#fff);border:1px solid #ede9fe;border-radius:12px;padding:20px;">
      <tr><td style="padding:8px 0;"><table><tr>
        <td style="width:36px;height:36px;background:#ede9fe;border-radius:8px;text-align:center;vertical-align:middle;">📅</td>
        <td style="padding-left:12px;"><span style="font-size:11px;color:#a78bfa;font-weight:600;letter-spacing:1px;text-transform:uppercase;">DATE</span><br><strong style="font-size:15px;color:#111;">${data.date}</strong></td>
      </tr></table></td></tr>
      <tr><td style="padding:8px 0;"><table><tr>
        <td style="width:36px;height:36px;background:#ede9fe;border-radius:8px;text-align:center;vertical-align:middle;">🕐</td>
        <td style="padding-left:12px;"><span style="font-size:11px;color:#a78bfa;font-weight:600;letter-spacing:1px;text-transform:uppercase;">TIME</span><br><strong style="font-size:15px;color:#111;">${data.startTime} — ${data.endTime}</strong></td>
      </tr></table></td></tr>
      <tr><td style="padding:8px 0;"><table><tr>
        <td style="width:36px;height:36px;background:#ede9fe;border-radius:8px;text-align:center;vertical-align:middle;">👩‍⚕️</td>
        <td style="padding-left:12px;"><span style="font-size:11px;color:#a78bfa;font-weight:600;letter-spacing:1px;text-transform:uppercase;">PROVIDER</span><br><strong style="font-size:15px;color:#111;">${data.providerName}</strong></td>
      </tr></table></td></tr>
      <tr><td style="padding:8px 0;"><table><tr>
        <td style="width:36px;height:36px;background:#ede9fe;border-radius:8px;text-align:center;vertical-align:middle;">📍</td>
        <td style="padding-left:12px;"><span style="font-size:11px;color:#a78bfa;font-weight:600;letter-spacing:1px;text-transform:uppercase;">LOCATION</span><br><strong style="font-size:15px;color:#111;">${data.location}</strong><br><span style="font-size:13px;color:#6b7280;">${data.address}</span></td>
      </tr></table></td></tr>
    </table>
    <div style="text-align:center;padding:20px 0;margin:20px 0;background:#f9fafb;border-radius:12px;border:1px solid #f3f4f6;">
      <span style="font-size:11px;color:#9ca3af;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Confirmation Code</span><br>
      <strong style="font-size:24px;letter-spacing:3px;color:hsl(270,100%,25%);">${data.confirmationCode}</strong>
    </div>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;margin:0 0 20px;">
      <p style="font-size:13px;font-weight:600;color:#92400e;margin:0 0 8px;">📋 Before Your Visit</p>
      <ul style="font-size:13px;color:#a16207;margin:0;padding-left:20px;line-height:1.8;">
        <li>Please arrive 10 minutes early</li>
        <li>Bring a valid photo ID and insurance card</li>
        <li>Complete any intake forms sent separately</li>
      </ul>
    </div>
    <div style="text-align:center;margin:24px 0;">
      <a href="${data.checkinUrl}" style="display:inline-block;background:linear-gradient(135deg,hsl(270,100%,25%),hsl(270,80%,40%));color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:100px;box-shadow:0 4px 20px rgba(88,28,135,0.3);">Check In Online</a>
    </div>
    <hr style="border:none;border-top:1px solid #f3f4f6;margin:20px 0;">
    <p style="font-size:12px;color:#9ca3af;text-align:center;line-height:1.6;">Need to reschedule? Call us at <span style="color:#6b7280;">(201) 484-4040</span><br>Orenda Psychiatry — New Jersey Offices</p>
  </td></tr>
  <tr><td style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:16px;text-align:center;">
    <p style="font-size:11px;color:#9ca3af;margin:0;">© 2026 Orenda Psychiatry. All rights reserved.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function buildSmsText(data: {
  firstName: string;
  providerName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  confirmationCode: string;
  checkinUrl: string;
}): string {
  return `✅ Orenda Psychiatry — Appointment Confirmed

📅 ${data.date}
🕐 ${data.startTime} — ${data.endTime}
👩‍⚕️ ${data.providerName}
📍 ${data.location}

🔑 Code: ${data.confirmationCode}

Please arrive 10 min early with ID & insurance card.

Check in: ${data.checkinUrl}

To reschedule, call (201) 484-4040`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      appointmentId,
      patientFirstName,
      patientEmail,
      patientPhone,
      providerName,
      appointmentDate,
      slotStart,
      slotEnd,
      locationName,
      locationAddress,
      confirmationCode,
    } = await req.json();

    const startFormatted = formatTime12(slotStart);
    const endFormatted = formatTime12(slotEnd);

    // Format date nicely
    const dateObj = new Date(appointmentDate + "T00:00:00");
    const dateFormatted = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const checkinUrl = "https://orenda-njoffice-guide.lovable.app/nj-office/check-in";

    const templateData = {
      firstName: patientFirstName,
      providerName,
      date: dateFormatted,
      startTime: startFormatted,
      endTime: endFormatted,
      location: locationName || "Orenda Psychiatry NJ",
      address: locationAddress || "",
      confirmationCode,
      checkinUrl,
    };

    const results: { email?: string; sms?: string } = {};

    // --- Send Email via Lovable API ---
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (patientEmail && LOVABLE_API_KEY) {
      try {
        // Use supabase functions to send email (placeholder - needs email domain setup)
        console.log(`[EMAIL] Would send appointment confirmation to ${patientEmail}`);
        console.log(`[EMAIL] Subject: Your Appointment with ${providerName} — ${dateFormatted}`);
        results.email = "logged";
      } catch (e) {
        console.error("[EMAIL ERROR]", e);
        results.email = `error: ${e.message}`;
      }
    }

    // --- Send SMS via Twilio Gateway ---
    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    if (patientPhone && LOVABLE_API_KEY && TWILIO_API_KEY) {
      try {
        const TWILIO_FROM_NUMBER = Deno.env.get("TWILIO_FROM_NUMBER") || "+12015551234";
        const smsBody = buildSmsText(templateData);

        const smsResponse = await fetch(`${TWILIO_GATEWAY_URL}/Messages.json`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": TWILIO_API_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: patientPhone,
            From: TWILIO_FROM_NUMBER,
            Body: smsBody,
          }),
        });

        const smsData = await smsResponse.json();
        if (!smsResponse.ok) {
          throw new Error(`Twilio error [${smsResponse.status}]: ${JSON.stringify(smsData)}`);
        }
        results.sms = "sent";
        console.log(`[SMS] Sent to ${patientPhone}, SID: ${smsData.sid}`);
      } catch (e) {
        console.error("[SMS ERROR]", e);
        results.sms = `error: ${e.message}`;
      }
    } else {
      console.log(`[SMS] Skipped — missing Twilio config or phone number`);
      results.sms = "skipped";
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[REMINDER ERROR]", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
