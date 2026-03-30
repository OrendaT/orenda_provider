CREATE TABLE public.providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name text NOT NULL,
  credentials text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  insurers text[] NOT NULL DEFAULT '{}',
  specialties text[] NOT NULL DEFAULT '{}',
  accepts_new boolean NOT NULL DEFAULT true,
  rating numeric(3,2),
  photo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view providers" ON public.providers FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert providers" ON public.providers FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update providers" ON public.providers FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete providers" ON public.providers FOR DELETE TO public USING (true);