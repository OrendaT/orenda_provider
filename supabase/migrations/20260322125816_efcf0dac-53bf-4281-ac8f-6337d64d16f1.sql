CREATE TABLE public.app_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  zapier_webhook_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read settings"
ON public.app_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to update settings"
ON public.app_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert settings"
ON public.app_settings FOR INSERT TO authenticated WITH CHECK (true);

INSERT INTO public.app_settings (id) VALUES ('default') ON CONFLICT DO NOTHING;