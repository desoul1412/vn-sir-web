---
tags: [changelog]
date: 2026-04-16
status: active
---

# VNSIR Project Changelog

## 2026-04-16

### Task 1.3 — Onboarding.tsx (Sprint 1, Phase 1) ✅
**Agent**: Visual Designer / UI
**Spec**: §2.5.3 §3.2 — [[Onboarding-Spec]]

**Created**:
- `src/lib/supabase.ts` — Supabase client singleton with `Profile` type and `SectorEnum`
- `src/hooks/useAuth.ts` — `useAuth()` hook wrapping `onAuthStateChange`, exposes `user`, `profile`, `isLoading`, `isAdmin`, `signInWithGoogle`, `signInWithMagicLink`, `signOut`, `refreshProfile`
- `src/pages/Onboarding.tsx` — Single-screen modal collecting Job Title + Industry Focus; saves via `supabase.from('profiles').update()`; redirects to Intelligence Hub on success
- `brain/vnsir/wiki/Onboarding-Spec.md` — Full spec, design decisions, WCAG audit, interaction states

**Design decisions**:
- Sharp-edged panel (radius-none), white on gray-light backdrop — per VNSIR Stoic aesthetic
- Playfair Display serif H1 at `--text-2xl` (31px) for premium authority
- Escape key disabled — onboarding is mandatory, cannot be dismissed
- 800ms redirect delay post-success for SR announcement window
- All WCAG AA/AAA targets met; gray-muted used only for decorative non-informational text

**TypeScript**: `npx tsc --noEmit` → 0 errors


### Task 0.6 — Foundational SQL Migration `001_foundation.sql` ✅
**Agent:** Analytics Engineer  
**Branch:** `agent/agent` (commit `b178b9d`)

**What was built:**

| Artifact | Path | Notes |
|---|---|---|
| Migration | `supabase/migrations/20260416000001_foundation.sql` | 570 lines, full schema |
| Config | `supabase/config.toml` | Local dev Supabase config |
| Seed | `supabase/seed.sql` | 4 sample reports (dev/staging only) |

**Schema summary:**

| Table | Primary Key | Notable Constraints |
|---|---|---|
| `profiles` | `uuid → auth.users` | `total_spent_cents ≥ 0`, `citext` corporate email |
| `reports` | `uuid` | `slug UNIQUE`, `sku UNIQUE`, `price_cents > 0` |
| `purchases` | `uuid` | `stripe_payment_intent_id UNIQUE`, partial unique idx on completed |
| `advisory_requests` | `uuid` | `user_id` nullable (anon submissions allowed) |
| `newsletter_subscribers` | `uuid` | `email citext UNIQUE` |

**Triggers:**
- `handle_new_user` — auto-creates `profiles` row on `auth.users` INSERT
- `touch_updated_at` — maintains `updated_at` on `profiles` and `advisory_requests`
- `sync_profile_total_spent` — keeps `profiles.total_spent_cents` in sync with purchase state changes
- `upgrade_access_tier_on_purchase` — auto-promotes `tier_0` → `tier_1` on first completed purchase

**RLS & Access:**
- All 5 tables have RLS enabled
- 8 policies implementing least-privilege access
- `anon` can: browse published reports, submit advisory requests, subscribe to newsletter
- `authenticated` can: manage own profile, view own purchases, submit advisory requests
- Service role bypasses all RLS (for Edge Functions / webhooks)

**Validation:** 15/15 structural checks passed ✅

---

### Task 0.5 — Supabase Project Initialisation ✅
*(completed by Strategist agent — see memory.md for details)*
