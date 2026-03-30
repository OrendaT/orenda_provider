
ALTER TABLE public.patient_appointments 
ADD COLUMN IF NOT EXISTS checked_in boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS checked_in_at timestamp with time zone;

ALTER PUBLICATION supabase_realtime ADD TABLE public.patient_appointments;
