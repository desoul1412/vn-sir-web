/**
 * supabase-buckets.test.ts
 * Task 1.1.5 — Verify storage bucket configuration constants.
 *
 * These tests are intentionally dependency-free (no Supabase client required)
 * so they run in CI without credentials.  They validate that the bucket spec
 * objects exported by the config module match the agreed values from the task.
 */

import { describe, it, expect } from 'vitest';
import { STORAGE_BUCKETS } from '../lib/supabase/storage-config';

describe('Storage bucket configuration — vnsir-prod', () => {
  describe('reports bucket', () => {
    const bucket = STORAGE_BUCKETS.reports;

    it('has the correct id', () => {
      expect(bucket.id).toBe('reports');
    });

    it('is private (public = false)', () => {
      expect(bucket.public).toBe(false);
    });

    it('has a 50 MB file size limit (bytes)', () => {
      // 50 * 1024 * 1024
      expect(bucket.fileSizeLimit).toBe(52_428_800);
    });

    it('allows document MIME types', () => {
      expect(bucket.allowedMimeTypes).toContain('application/pdf');
      expect(bucket.allowedMimeTypes).toContain('text/csv');
    });
  });

  describe('slides bucket', () => {
    const bucket = STORAGE_BUCKETS.slides;

    it('has the correct id', () => {
      expect(bucket.id).toBe('slides');
    });

    it('is public (public = true)', () => {
      expect(bucket.public).toBe(true);
    });

    it('has a 10 MB file size limit (bytes)', () => {
      // 10 * 1024 * 1024
      expect(bucket.fileSizeLimit).toBe(10_485_760);
    });

    it('allows image and presentation MIME types', () => {
      expect(bucket.allowedMimeTypes).toContain('image/jpeg');
      expect(bucket.allowedMimeTypes).toContain('image/png');
      expect(bucket.allowedMimeTypes).toContain(
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      );
    });
  });
});
