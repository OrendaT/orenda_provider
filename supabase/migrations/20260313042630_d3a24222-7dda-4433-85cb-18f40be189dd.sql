
-- Locations table
CREATE TABLE public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  address text NOT NULL,
  city text NOT NULL,
  instructions text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view locations" ON public.locations FOR SELECT TO public USING (true);

-- Seed locations
INSERT INTO public.locations (name, address, city, instructions) VALUES
  ('Hoboken', '221 River Street, 9th Floor, Unit 9076', 'Hoboken, NJ 07030', 'Check in with lobby security at the building entrance.'),
  ('Edison', '110 Fieldcrest Avenue, 3rd Floor', 'Edison, NJ 08837', 'Enter the building and proceed to the 3rd floor.');

-- Provider office availability (source of truth)
CREATE TABLE public.provider_office_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name text NOT NULL,
  provider_email text NOT NULL,
  location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  office_date date NOT NULL,
  start_time time NOT NULL DEFAULT '09:00',
  end_time time NOT NULL DEFAULT '15:00',
  appointment_duration_minutes int NOT NULL DEFAULT 30,
  slot_capacity int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.provider_office_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active availability" ON public.provider_office_availability FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert availability" ON public.provider_office_availability FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update availability" ON public.provider_office_availability FOR UPDATE TO public USING (true);

-- Patient appointments
CREATE TYPE public.appointment_status AS ENUM ('booked', 'confirmed', 'cancelled', 'completed', 'no_show');

CREATE TABLE public.patient_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_availability_id uuid NOT NULL REFERENCES public.provider_office_availability(id) ON DELETE RESTRICT,
  location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE RESTRICT,
  provider_name text NOT NULL,
  slot_start time NOT NULL,
  slot_end time NOT NULL,
  appointment_date date NOT NULL,
  patient_first_name text NOT NULL,
  patient_last_name text NOT NULL,
  patient_email text NOT NULL,
  patient_phone text,
  appointment_status public.appointment_status NOT NULL DEFAULT 'booked',
  confirmation_code text NOT NULL,
  booking_source text NOT NULL DEFAULT 'patient_portal',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.patient_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view appointments" ON public.patient_appointments FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can create appointments" ON public.patient_appointments FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update appointments" ON public.patient_appointments FOR UPDATE TO public USING (true);

-- Trigger for updated_at on new tables
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_provider_availability_updated_at BEFORE UPDATE ON public.provider_office_availability FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_patient_appointments_updated_at BEFORE UPDATE ON public.patient_appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Atomic booking function to prevent double-booking
CREATE OR REPLACE FUNCTION public.book_patient_appointment(
  p_availability_id uuid,
  p_slot_start time,
  p_slot_end time,
  p_patient_first_name text,
  p_patient_last_name text,
  p_patient_email text,
  p_patient_phone text DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_avail record;
  v_existing_count int;
  v_confirmation_code text;
  v_appointment_id uuid;
BEGIN
  -- Lock and fetch availability
  SELECT * INTO v_avail
  FROM public.provider_office_availability
  WHERE id = p_availability_id AND status = 'active'
  FOR UPDATE;

  IF v_avail IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Availability not found or cancelled.');
  END IF;

  -- Count existing bookings for this slot
  SELECT COUNT(*) INTO v_existing_count
  FROM public.patient_appointments
  WHERE provider_availability_id = p_availability_id
    AND slot_start = p_slot_start
    AND appointment_status NOT IN ('cancelled');

  IF v_existing_count >= v_avail.slot_capacity THEN
    RETURN json_build_object('success', false, 'error', 'This time slot is no longer available.');
  END IF;

  -- Generate confirmation code
  v_confirmation_code := 'ORN-' || upper(substr(md5(random()::text), 1, 6));

  -- Insert appointment
  INSERT INTO public.patient_appointments (
    provider_availability_id, location_id, provider_name,
    slot_start, slot_end, appointment_date,
    patient_first_name, patient_last_name, patient_email, patient_phone,
    confirmation_code, notes
  ) VALUES (
    p_availability_id, v_avail.location_id, v_avail.provider_name,
    p_slot_start, p_slot_end, v_avail.office_date,
    p_patient_first_name, p_patient_last_name, p_patient_email, p_patient_phone,
    v_confirmation_code, p_notes
  )
  RETURNING id INTO v_appointment_id;

  RETURN json_build_object(
    'success', true,
    'appointment_id', v_appointment_id,
    'confirmation_code', v_confirmation_code,
    'date', v_avail.office_date,
    'start_time', p_slot_start,
    'end_time', p_slot_end,
    'location', v_avail.location_id,
    'provider', v_avail.provider_name
  );
END;
$$;
