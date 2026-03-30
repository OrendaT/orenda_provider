import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProviderData {
  name: string;
  email: string;
  phone: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { providers, default_password } = await req.json() as {
      providers: ProviderData[];
      default_password: string;
    };

    if (!providers || !default_password || default_password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Providers array and a password (8+ chars) required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: { email: string; status: string; error?: string }[] = [];

    for (const p of providers) {
      try {
        // Create auth user
        const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: p.email,
          password: default_password,
          email_confirm: true,
          user_metadata: { provider_name: p.name },
        });

        if (createError) {
          // If user already exists, try to find them and ensure profile exists
          if (createError.message?.includes("already been registered")) {
            const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
            const existingUser = users?.find((u) => u.email === p.email);
            if (existingUser) {
              // Upsert profile
              await supabaseAdmin.from("profiles").upsert({
                id: existingUser.id,
                provider_name: p.name,
                email: p.email,
                phone: p.phone || null,
              }, { onConflict: "id" });
              results.push({ email: p.email, status: "exists_profile_synced" });
            } else {
              results.push({ email: p.email, status: "error", error: "User exists but not found" });
            }
            continue;
          }
          results.push({ email: p.email, status: "error", error: createError.message });
          continue;
        }

        if (userData?.user) {
          // Create profile
          const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
            id: userData.user.id,
            provider_name: p.name,
            email: p.email,
            phone: p.phone || null,
          }, { onConflict: "id" });

          if (profileError) {
            results.push({ email: p.email, status: "user_created_profile_failed", error: profileError.message });
          } else {
            results.push({ email: p.email, status: "created" });
          }
        }
      } catch (err) {
        results.push({ email: p.email, status: "error", error: String(err) });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
