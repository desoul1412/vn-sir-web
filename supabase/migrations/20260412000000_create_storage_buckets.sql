-- Migration: Create storage buckets for vnsir-prod
-- Task 1.1.5 — Provision Supabase project vnsir-prod
--
-- Buckets:
--   reports  — private,  50 MB per-file limit
--   slides   — public,   10 MB per-file limit

-- ─────────────────────────────────────────────
-- reports bucket  (private)
-- ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reports',
  'reports',
  false,                          -- private: no public URLs
  52428800,                       -- 50 MB in bytes (50 * 1024 * 1024)
  ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'text/plain'
  ]
)
ON CONFLICT (id) DO UPDATE
  SET
    public            = EXCLUDED.public,
    file_size_limit   = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS policies for reports bucket
-- Authenticated users can read/write their own objects (scoped by user UID prefix).
CREATE POLICY "reports: authenticated users can upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "reports: authenticated users can read own files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "reports: authenticated users can delete own files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'reports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ─────────────────────────────────────────────
-- slides bucket  (public)
-- ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'slides',
  'slides',
  true,                           -- public: objects accessible via CDN URL
  10485760,                       -- 10 MB in bytes (10 * 1024 * 1024)
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint'
  ]
)
ON CONFLICT (id) DO UPDATE
  SET
    public            = EXCLUDED.public,
    file_size_limit   = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS policies for slides bucket
-- Anyone can read public slide objects; only authenticated users can write.
CREATE POLICY "slides: public read"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'slides');

CREATE POLICY "slides: authenticated users can upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'slides'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "slides: authenticated users can delete own files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'slides'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
