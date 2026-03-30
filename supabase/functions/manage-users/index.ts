import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { action, email, password, provider_name, user_id, phone } = await req.json();

    if (action === "create_user") {
      if (!email || !password || !provider_name) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { provider_name, phone: phone || null },
      });
      if (error) throw error;

      // Create profile
      await supabaseAdmin.from("profiles").insert({
        id: data.user.id,
        email,
        provider_name,
        phone: phone || null,
      });

      return new Response(JSON.stringify({ success: true, user_id: data.user.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "change_password") {
      if (!user_id || !password) {
        return new Response(JSON.stringify({ error: "Missing user_id or password" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabaseAdmin.auth.admin.updateUser(user_id, { password });
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "disable_user") {
      if (!user_id) {
        return new Response(JSON.stringify({ error: "Missing user_id" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabaseAdmin.auth.admin.updateUser(user_id, {
        ban_duration: "876600h", // ~100 years
      });
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "enable_user") {
      if (!user_id) {
        return new Response(JSON.stringify({ error: "Missing user_id" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabaseAdmin.auth.admin.updateUser(user_id, {
        ban_duration: "none",
      });
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list_users") {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 100 });
      if (error) throw error;

      // Fetch phone numbers from profiles
      const { data: profiles } = await supabaseAdmin.from("profiles").select("id, phone");
      const phoneMap = new Map((profiles || []).map((p: any) => [p.id, p.phone]));

      const users = data.users.map((u) => ({
        id: u.id,
        email: u.email,
        provider_name: u.user_metadata?.provider_name || "",
        phone: phoneMap.get(u.id) || u.user_metadata?.phone || null,
        created_at: u.created_at,
        banned: !!u.banned_until && new Date(u.banned_until) > new Date(),
        last_sign_in: u.last_sign_in_at,
      }));

      return new Response(JSON.stringify({ users }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update_phone") {
      if (!user_id) {
        return new Response(JSON.stringify({ error: "Missing user_id" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: profileError } = await supabaseAdmin.from("profiles").update({ phone: phone || null }).eq("id", user_id);
      if (profileError) throw profileError;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_user") {
      if (!user_id) {
        return new Response(JSON.stringify({ error: "Missing user_id" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch user email before deletion to clean up related records
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(user_id);
      const userEmail = userData?.user?.email;

      // Delete auth user (cascades to profiles via FK)
      const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id);
      if (error) throw error;

      // Clean up related tables by email
      if (userEmail) {
        await supabaseAdmin.from("office_bookings").delete().eq("provider_email", userEmail);
        await supabaseAdmin.from("provider_office_availability").delete().eq("provider_email", userEmail);
        await supabaseAdmin.from("admin_permissions").delete().eq("user_id", user_id);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
