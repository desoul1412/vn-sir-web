/**
 * supabase.ts — Supabase client singleton
 *
 * Project: paperclip (qdhengvarelfdtmycnti)
 * Region:  ap-southeast-1
 *
 * Import this module everywhere supabase is needed.
 * Never instantiate a new client outside this file.
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '[VNSIR] Missing Supabase env vars. ' +
    'Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env'
  )
}

// ─── Database type helpers ────────────────────────────────────

export type SectorEnum =
  | 'e_commerce'
  | 'gaming'
  | 'entertainment'
  | 'macro_economy'
  | 'other'

export type AccessTier = 'tier_0' | 'tier_1' | 'tier_2'

export interface Profile {
  id: string
  full_name: string | null
  job_title: string | null
  corporate_email: string | null
  company: string | null
  industry_focus: SectorEnum | null
  access_tier: AccessTier
  total_spent_cents: number
  created_at: string
  updated_at: string
}

// ─── Client singleton ─────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
