-- Add original_filename column to secured_files table to preserve the original
-- file name with extension during uploads (e.g., "report.html" instead of "report")
ALTER TABLE public.secured_files
ADD COLUMN IF NOT EXISTS original_filename TEXT;