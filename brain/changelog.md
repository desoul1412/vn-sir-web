---
tags: [changelog]
date: 2026-04-16
status: active
---

# VNSIR Project Changelog

## 2026-04-16

### Task 1.6 — Home.tsx Hero Section (Sprint 1, Phase 1) ✅
**Agent**: Senior Conversion Copywriter
**Spec**: §2.1 · [[Home-Hero-Spec]]

**Created**:
- `src/pages/Home.tsx` — Full home page shell with Hero Section (Task 1.6), stub for Product Grid (Task 1.7), stub for Trust Strip (Task 1.9)
- `brain/vnsir/wiki/Home-Hero-Spec.md` — Copy architecture, A/B test variants, layout spec, accessibility audit, design decisions

**Hero copy delivered**:
- Eyebrow: "THE VIETNAM STRATEGIC INSIGHT RESEARCH" — navy, `--tracking-widest`, `--font-sans` 600
- H1: "Decoding Vietnam's Shadow Market." — navy accent, `clamp(2.4rem, 5vw, --text-5xl)`, weight 800
- H2: "**Executive wisdom** and **surgical insights.** **No raw data.**" — objection-killer, `--text-xl`, charcoal
- Primary CTA: "Explore Intelligence Hub →" — `.btn-cta`, scrolls to `#intelligence-hub`
- Ghost CTA: "Request Custom Research" — `.btn-ghost`, links to `/advisory`
- Trust micro-copy: "Trusted by analysts and executives across Vietnam's digital economy."

**Design decisions**:
- H1 in `--color-vnsir-navy` (not black) per spec §2.1 "navy accent" — creates strongest visual hierarchy against white background (11.8:1 contrast ✓ AAA)
- Two-column layout (55/45) on ≥1024px, stacked on mobile
- Data art panel: inline SVG placeholder (abstract bar chart + trend line on dark gradient) — replaces `public/assets/cards/hero-art.svg` when UI agent delivers (Task 1.8)
- Art panel hidden on xs breakpoint — copy dominates mobile
- Glow pulse animation: `prefers-reduced-motion` safe, desktop-only
- Eyebrow is `aria-hidden="true"` — H1 is the sole primary label for SR
- `SiteHeader` included in Home.tsx scope (nav + login CTA wire-up)

**TypeScript**: `tsc --noEmit` → 0 errors ✅
**Conflicts**: No files edited that overlap with open MRs on agent/dev-sharma, agent/noor-ali, agent/fatima-hassan, agent/oscar-wu, agent/yuki-nakamura, agent/zara-osei.

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

---

### Task 1.4 — `useAuth` Hook + `AuthProvider` + `RequireAuth` HOC ✅
*(completed 2026-04-16 — Senior Technical SEO Engineer / FE Agent)*

**Deliverables:**

| File | Action | Description |
|------|--------|-------------|
| `src/hooks/useAuth.ts` | Updated | Added `isOnboarded` flag; improved JSDoc |
| `src/context/AuthContext.tsx` | Created | `AuthProvider` + `useAuthContext` consuming hook |
| `src/components/auth/RequireAuth.tsx` | Created | Route guard HOC with 5-state check logic |
| `src/components/auth/AuthCallback.tsx` | Created | OAuth/Magic Link redirect handler at `/auth/callback` |
| `src/components/auth/index.ts` | Created | Barrel exports |
| `src/App.tsx` | Refactored | Wired `BrowserRouter` + `AuthProvider` + full route scaffold |

**Auth flow logic (RequireAuth):**
1. `isLoading` → `AuthLoadingScreen` (pulse bar, no FOUC)
2. No `user` → `<Navigate to="/login" state={{ from: location }}>` (preserves deep-link)
3. `!isOnboarded` (unless `skipOnboardingCheck`) → `<Navigate to="/onboarding">`
4. `requireAdmin && !isAdmin` → `<Navigate to="/" state={{ error: 'forbidden', code: 403 }}>`
5. All checks pass → render children ✓

**Routing scaffold:**
- `/` — Home (Intelligence Hub) — protected
- `/login` — Login — public
- `/onboarding` — Onboarding — auth required, onboard check skipped
- `/auth/callback` — OAuth/Magic Link handler — public
- `/admin/*` — Admin — protected + requireAdmin
- `*` — 404 → redirect to `/`

**TypeScript:** `tsc --noEmit` → 0 errors ✅
**Conflicts:** No shared files edited from other agent branches.
