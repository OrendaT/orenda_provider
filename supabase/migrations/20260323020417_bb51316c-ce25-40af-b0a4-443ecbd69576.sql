
-- Add unique constraint to prevent duplicate availability for same provider+date
ALTER TABLE public.provider_office_availability 
  ADD CONSTRAINT unique_provider_date UNIQUE (provider_name, office_date);

-- Replace trigger function to skip if entry already exists
CREATE OR REPLACE FUNCTION public.sync_booking_to_availability()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_location_id uuid;
  v_start_time time;
  v_end_time time;
  v_existing_count int;
BEGIN
  IF NEW.status != 'confirmed' THEN
    RETURN NEW;
  END IF;

  -- Check if an availability entry already exists for this provider+date
  SELECT COUNT(*) INTO v_existing_count
  FROM public.provider_office_availability
  WHERE provider_name = NEW.provider_name
    AND office_date = NEW.booking_date;

  -- If entry already exists, don't overwrite it (user may have edited it)
  IF v_existing_count > 0 THEN
    RETURN NEW;
  END IF;

  SELECT id INTO v_location_id
  FROM public.locations
  WHERE lower(name) = NEW.office_location::text
  LIMIT 1;

  IF v_location_id IS NULL THEN
    RETURN NEW;
  END IF;

  CASE NEW.time_block::text
    WHEN 'morning' THEN
      v_start_time := '09:00'::time;
      v_end_time := '15:00'::time;
    WHEN 'afternoon' THEN
      v_start_time := '15:00'::time;
      v_end_time := '21:00'::time;
    WHEN 'full_day' THEN
      v_start_time := '09:00'::time;
      v_end_time := '17:00'::time;
    ELSE
      v_start_time := '09:00'::time;
      v_end_time := '17:00'::time;
  END CASE;

  INSERT INTO public.provider_office_availability (
    provider_name, provider_email, location_id,
    office_date, start_time, end_time,
    appointment_duration_minutes, slot_capacity, status
  ) VALUES (
    NEW.provider_name, NEW.provider_email, v_location_id,
    NEW.booking_date, v_start_time, v_end_time,
    30, 1, 'active'
  );

  RETURN NEW;
END;
$function$;
