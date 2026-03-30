-- Create enum for time blocks
CREATE TYPE public.time_block AS ENUM ('morning', 'afternoon', 'full_day');

-- Create enum for office locations
CREATE TYPE public.office_location AS ENUM ('hoboken', 'edison');

-- Create enum for visit types
CREATE TYPE public.visit_type AS ENUM ('quarterly_adhd', 'initial_evaluation', 'other');

-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('confirmed', 'cancelled');

-- Create the office bookings table
CREATE TABLE public.office_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_name TEXT NOT NULL,
  provider_email TEXT NOT NULL,
  provider_phone TEXT,
  office_location office_location NOT NULL DEFAULT 'hoboken',
  visit_type visit_type NOT NULL,
  visit_type_other TEXT,
  booking_date DATE NOT NULL,
  time_block time_block NOT NULL,
  notes TEXT,
  status booking_status NOT NULL DEFAULT 'confirmed',
  addendum_signed BOOLEAN NOT NULL DEFAULT false,
  addendum_signature_name TEXT,
  addendum_signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (booking_date, time_block, office_location)
);

-- Enable RLS
ALTER TABLE public.office_bookings ENABLE ROW LEVEL SECURITY;

-- Public can insert bookings (no auth required for providers)
CREATE POLICY "Anyone can create bookings"
  ON public.office_bookings FOR INSERT
  WITH CHECK (true);

-- Public can read bookings (needed for calendar availability)
CREATE POLICY "Anyone can view bookings"
  ON public.office_bookings FOR SELECT
  USING (true);

-- Public can update bookings
CREATE POLICY "Anyone can update bookings"
  ON public.office_bookings FOR UPDATE
  USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_office_bookings_updated_at
  BEFORE UPDATE ON public.office_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();