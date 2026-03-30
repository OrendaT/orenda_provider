
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
  v_old_location_id uuid;
BEGIN
  -- On DELETE or cancel, remove the synced availability
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.provider_office_availability
    WHERE provider_name = OLD.provider_name
      AND office_date = OLD.booking_date;
    RETURN OLD;
  END IF;

  IF NEW.status != 'confirmed' THEN
    -- If status changed to cancelled, remove availability
    IF TG_OP = 'UPDATE' AND OLD.status = 'confirmed' THEN
      DELETE FROM public.provider_office_availability
      WHERE provider_name = OLD.provider_name
        AND office_date = OLD.booking_date;
    END IF;
    RETURN NEW;
  END IF;

  -- On UPDATE: if date, time_block, or location changed, update the existing availability
  IF TG_OP = 'UPDATE' AND OLD.status = 'confirmed' THEN
    -- Get new location_id
    SELECT id INTO v_location_id
    FROM public.locations
    WHERE lower(name) = NEW.office_location::text
    LIMIT 1;

    IF v_location_id IS NULL THEN
      RETURN NEW;
    END IF;

    CASE NEW.time_block::text
      WHEN 'morning' THEN
        v_start_time := '09:00'::time; v_end_time := '15:00'::time;
      WHEN 'afternoon' THEN
        v_start_time := '15:00'::time; v_end_time := '21:00'::time;
      WHEN 'full_day' THEN
        v_start_time := '09:00'::time; v_end_time := '17:00'::time;
      ELSE
        v_start_time := '09:00'::time; v_end_time := '17:00'::time;
    END CASE;

    -- Update existing entry for old provider+date, or insert if missing
    UPDATE public.provider_office_availability
    SET office_date = NEW.booking_date,
        location_id = v_location_id,
        start_time = v_start_time,
        end_time = v_end_time,
        provider_email = NEW.provider_email,
        updated_at = now()
    WHERE provider_name = OLD.provider_name
      AND office_date = OLD.booking_date;

    -- If no row was updated (entry was manually deleted), insert a new one
    IF NOT FOUND THEN
      INSERT INTO public.provider_office_availability (
        provider_name, provider_email, location_id,
        office_date, start_time, end_time,
        appointment_duration_minutes, slot_capacity, status
      ) VALUES (
        NEW.provider_name, NEW.provider_email, v_location_id,
        NEW.booking_date, v_start_time, v_end_time,
        30, 1, 'active'
      ) ON CONFLICT (provider_name, office_date) DO NOTHING;
    END IF;

    RETURN NEW;
  END IF;

  -- On INSERT: check if entry already exists
  SELECT COUNT(*) INTO v_existing_count
  FROM public.provider_office_availability
  WHERE provider_name = NEW.provider_name
    AND office_date = NEW.booking_date;

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
      v_start_time := '09:00'::time; v_end_time := '15:00'::time;
    WHEN 'afternoon' THEN
      v_start_time := '15:00'::time; v_end_time := '21:00'::time;
    WHEN 'full_day' THEN
      v_start_time := '09:00'::time; v_end_time := '17:00'::time;
    ELSE
      v_start_time := '09:00'::time; v_end_time := '17:00'::time;
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

-- Recreate trigger to also fire on UPDATE and DELETE
DROP TRIGGER IF EXISTS trg_sync_booking_to_availability ON public.office_bookings;
CREATE TRIGGER trg_sync_booking_to_availability
  AFTER INSERT OR UPDATE OR DELETE ON public.office_bookings
  FOR EACH ROW EXECUTE FUNCTION public.sync_booking_to_availability();
