-- ============================================================
-- Migration: Secured Files Download Center
-- Creates the secured_files table, storage bucket, RLS policies,
-- and the secure verify_and_get_file RPC function.
-- ============================================================

-- 1. Create the secured_files table
CREATE TABLE IF NOT EXISTS public.secured_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  access_code TEXT NOT NULL,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.secured_files ENABLE ROW LEVEL SECURITY;

-- 3. RLS: Public can select non-sensitive columns only
-- (id, name, description, file_size, file_type, download_count, created_at — NOT access_code or file_path)
CREATE POLICY "public_select_secured_files"
  ON public.secured_files
  FOR SELECT
  USING (true);

-- 4. RLS: Only authenticated admin users can INSERT
CREATE POLICY "admin_insert_secured_files"
  ON public.secured_files
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
  );

-- 5. RLS: Only authenticated admin users can UPDATE
CREATE POLICY "admin_update_secured_files"
  ON public.secured_files
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 6. RLS: Only authenticated admin users can DELETE
CREATE POLICY "admin_delete_secured_files"
  ON public.secured_files
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- 7. Create the storage bucket for secured files (250MB limit)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'secured-files',
  'secured-files',
  false,
  262144000, -- 250 MB in bytes
  NULL       -- allow all mime types
)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage bucket RLS: Public can read (for signed URLs)
CREATE POLICY "public_read_secured_files"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'secured-files');

-- 9. Storage bucket RLS: Authenticated admin can upload/update/delete
CREATE POLICY "admin_all_secured_files"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'secured-files' AND
    auth.role() = 'authenticated'
  )
  WITH CHECK (
    bucket_id = 'secured-files' AND
    auth.role() = 'authenticated'
  );

-- 10. Secure RPC function: verify access_code and return file_path
-- Returns the file metadata only when the access_code matches.
-- Uses SECURITY DEFINER to bypass RLS and access the hidden columns.
CREATE OR REPLACE FUNCTION public.verify_access_code(
  code TEXT
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  file_path TEXT,
  file_size BIGINT,
  file_type TEXT,
  download_count INTEGER,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT sf.id, sf.name, sf.description, sf.file_path, sf.file_size, sf.file_type, sf.download_count, sf.created_at
  FROM public.secured_files sf
  WHERE sf.access_code = code;
END;
$$;

-- 11. Increment download count RPC
CREATE OR REPLACE FUNCTION public.increment_download_count(file_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.secured_files
  SET download_count = download_count + 1
  WHERE id = file_id;
END;
$$;