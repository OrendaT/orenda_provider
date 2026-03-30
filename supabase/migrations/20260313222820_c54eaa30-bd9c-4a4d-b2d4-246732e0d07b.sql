
CREATE TABLE public.unmatched_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time text,
  location text,
  notes text,
  checked_in_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.unmatched_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view unmatched checkins" ON public.unmatched_checkins FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert unmatched checkins" ON public.unmatched_checkins FOR INSERT TO public WITH CHECK (true);
