import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "Provider" | "Admin" | null;

export function useUserRole() {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async (uid: string, email: string) => {
      const { data } = await supabase
        .from("admin_permissions")
        .select("role, has_admin_access")
        .eq("user_id", uid)
        .maybeSingle();

      if (data?.role) {
        setRole(data.role as UserRole);
      } else if (data?.has_admin_access) {
        setRole("Admin");
      } else {
        setRole("Provider");
      }
      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchRole(session.user.id, session.user.email || "");
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchRole(session.user.id, session.user.email || "");
      } else {
        setRole(null);
        setUserId(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasAdminAccess = role === "Admin";

  return { role, loading, userId, hasAdminAccess };
}

// Which admin console sections each role can see
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  Admin: ["book", "calendars", "reporting", "staffing", "provider-directory", "check-in", "communication", "executive"],
  Provider: [],
};
