
-- Create table to store anonymous tour votes
CREATE TABLE public.tour_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_key TEXT NOT NULL,
  vote_value TEXT NOT NULL,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tour_votes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public voting, no auth required)
CREATE POLICY "Anyone can submit a vote" ON public.tour_votes
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow reading aggregate results (optional, for admin)
CREATE POLICY "Anyone can read votes" ON public.tour_votes
  FOR SELECT TO anon, authenticated USING (true);
