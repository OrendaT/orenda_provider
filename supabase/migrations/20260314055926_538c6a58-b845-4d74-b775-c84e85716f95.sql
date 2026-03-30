-- Create storage bucket for provider photos
INSERT INTO storage.buckets (id, name, public) VALUES ('provider-photos', 'provider-photos', true);

-- Allow anyone to upload provider photos
CREATE POLICY "Anyone can upload provider photos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'provider-photos');

-- Allow anyone to view provider photos
CREATE POLICY "Anyone can view provider photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'provider-photos');

-- Allow anyone to update provider photos
CREATE POLICY "Anyone can update provider photos"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'provider-photos');

-- Allow anyone to delete provider photos
CREATE POLICY "Anyone can delete provider photos"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'provider-photos');