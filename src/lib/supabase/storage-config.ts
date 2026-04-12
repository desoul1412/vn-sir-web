/**
 * storage-config.ts
 * Single source of truth for Supabase storage bucket specifications.
 * These constants are used both by the application and by the vitest suite.
 *
 * Task 1.1.5 — vnsir-prod bucket provisioning
 */

export interface BucketConfig {
  /** Bucket identifier (must match the name used in the SQL migration). */
  id: string;
  /** Whether the bucket is publicly accessible without authentication. */
  public: boolean;
  /** Maximum allowed file size in bytes. */
  fileSizeLimit: number;
  /** Allowlist of MIME types accepted by this bucket. */
  allowedMimeTypes: string[];
}

export const STORAGE_BUCKETS = {
  /**
   * reports — private bucket for generated PDF/CSV reports.
   * File size limit: 50 MB.
   */
  reports: {
    id: 'reports',
    public: false,
    fileSizeLimit: 50 * 1024 * 1024, // 52_428_800 bytes
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'text/plain',
    ],
  } satisfies BucketConfig,

  /**
   * slides — public bucket for presentation slides and images.
   * File size limit: 10 MB.
   */
  slides: {
    id: 'slides',
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10_485_760 bytes
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
    ],
  } satisfies BucketConfig,
} as const;

export type BucketName = keyof typeof STORAGE_BUCKETS;
