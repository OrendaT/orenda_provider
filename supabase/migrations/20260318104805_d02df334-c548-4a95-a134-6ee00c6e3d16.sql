
-- Allow delete on office_bookings
CREATE POLICY "Anyone can delete bookings"
ON public.office_bookings
FOR DELETE
TO public
USING (true);

-- Allow delete on provider_office_availability
CREATE POLICY "Anyone can delete availability"
ON public.provider_office_availability
FOR DELETE
TO public
USING (true);

-- Allow delete on patient_appointments
CREATE POLICY "Anyone can delete appointments"
ON public.patient_appointments
FOR DELETE
TO public
USING (true);
