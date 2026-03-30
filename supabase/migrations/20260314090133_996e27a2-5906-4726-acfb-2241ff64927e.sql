
CREATE TABLE public.walkthrough_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_name TEXT NOT NULL,
  session_id TEXT,
  overall_thoughts TEXT,
  checkin_preference TEXT,
  scheduling_feedback TEXT,
  issues_spotted TEXT,
  additional_comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.walkthrough_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback" ON public.walkthrough_feedback
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can read feedback" ON public.walkthrough_feedback
  FOR SELECT TO anon, authenticated USING (true);
