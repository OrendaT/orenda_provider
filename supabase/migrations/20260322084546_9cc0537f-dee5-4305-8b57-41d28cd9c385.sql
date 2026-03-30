CREATE TABLE public.admin_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text NOT NULL,
  provider_name text NOT NULL,
  has_admin_access boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(email)
);

ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view admin permissions" ON public.admin_permissions FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert admin permissions" ON public.admin_permissions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update admin permissions" ON public.admin_permissions FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete admin permissions" ON public.admin_permissions FOR DELETE TO public USING (true);