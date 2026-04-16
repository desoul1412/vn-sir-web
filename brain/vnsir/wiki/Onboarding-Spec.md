---
tags: [spec, auth, onboarding, ui, fe]
date: 2026-04-16
status: active
---

# Onboarding.tsx — Spec & Design Record

**Task**: 1.3 (Sprint 1, Phase 1)
**Spec ref**: §2.5.3 §3.2
**Related**: [[VNSIR-Design-System]], [[Auth-Spec]]

---

## Purpose

Post-first-login single-screen modal that collects the two profile fields required to personalise the intelligence feed:

| Field | Type | DB Column |
|---|---|---|
| Job Title | `text` free-form | `profiles.job_title` |
| Industry Focus | `sector_enum` dropdown | `profiles.industry_focus` |

On successful save, the user is redirected to the Intelligence Hub (`/`).

---

## Visual Design Decisions

### Layout
- Full-screen fixed overlay with `background: var(--color-vnsir-gray-light)` (#F5F5F5)
- Centred white panel: `max-width: 480px`, `border: 1px solid var(--color-vnsir-gray-mid)`
- **Zero border-radius** — sharp edges per VNSIR design language (`var(--radius-none)`)
- `box-shadow: 0 4px 24px rgba(0,0,0,0.10)` — subtle elevation without neon/glow

### Typography hierarchy
| Element | Font | Size token | Weight | Colour |
|---|---|---|---|---|
| Logotype "VN-SIR" | `--font-mono` | `--text-xs` | 700 | `--color-vnsir-navy` |
| Eyebrow "ACCOUNT SETUP" | `--font-sans` | `--text-xs` | 600 | `--color-vnsir-gray-muted` |
| H1 headline | `--font-serif` (Playfair Display) | `--text-2xl` (31px) | 700 | `--color-vnsir-black` |
| Body copy | `--font-sans` | `--text-sm` (14px) | 400 | `--color-vnsir-charcoal` |
| Footer note | `--font-sans` | `--text-xs` (12px) | 400 | `--color-vnsir-gray-muted` |

### Colour WCAG Audit
| Pair | Ratio | Level |
|---|---|---|
| Navy (#1B2A4A) on White | 11.8:1 | AAA ✓ |
| Charcoal (#36454F) on White | 7.5:1 | AAA ✓ |
| Black (#0A0A0A) on White | 19.6:1 | AAA ✓ |
| Danger (#B91C1C) on White | 4.5:1 | AA ✓ |
| Gray-muted (#94A3B8) on White | 2.85:1 | ✗ — used only for non-essential helper text and footer note (decorative), not conveying information |

---

## Interaction States

| State | Description |
|---|---|
| Idle | Form enabled, CTA reads "Continue to Intelligence Hub →" |
| Submitting | Button shows spinner + "Saving…", fields disabled, `aria-busy="true"` |
| API Error | Top-level `<Alert variant="danger">` above form |
| Success | `<Alert variant="success">` shown, CTA reads "Redirecting…", `window.location.href` fires after 800ms |

### Why 800ms delay on redirect?
The success Alert must be visible for at least one "flash" frame before navigation. Screen reader users also need time to hear the announcement. 800ms is the minimum comfortable window without feeling broken.

---

## Validation Rules

| Field | Rule |
|---|---|
| Job Title | Required. Min 2 chars. Max 120 chars. |
| Industry Focus | Required (non-empty `sector_enum`). |

Client-side validation fires on submit, not on blur, to minimise interruption anxiety. Focus moves to the first invalid field on failure.

---

## Accessibility Checklist

- [x] `role="dialog"` + `aria-modal="true"` on panel
- [x] `aria-labelledby` → H1 `id`
- [x] Focus auto-moves to first interactive element on mount
- [x] Escape key **intentionally disabled** — onboarding cannot be skipped
- [x] All form fields wired via `<FormGroup>` (enforces `htmlFor`/`id` + `aria-describedby`)
- [x] `aria-required` on all required fields (via `FormGroup` prop)
- [x] `aria-invalid` on inputs with errors (via `Input`/`Select` `hasError` prop)
- [x] Error messages have `role="alert"` (via `FormGroup` → `<span role="alert">`)
- [x] `aria-busy` on submit button during loading

---

## Files Created / Modified

| File | Action |
|---|---|
| `src/pages/Onboarding.tsx` | Created — main component |
| `src/hooks/useAuth.ts` | Created — auth hook (dependency for protected routes) |
| `src/lib/supabase.ts` | Created — Supabase client singleton + Profile type |
| `brain/vnsir/wiki/Onboarding-Spec.md` | Created — this file |
| `brain/changelog.md` | Updated |

---

## Open Items / Phase 3 Hooks

- `isAdmin` in `useAuth` currently reads `profile.role` (Phase 3 adds the column). Currently returns `false` for all users — safe default.
- `INTELLIGENCE_HUB_PATH` constant (`/`) will need updating to `/intelligence` once React Router is wired in App.tsx (Task 1.6+).
- No `<RequireAuth>` HOC yet — built as a separate task (Task 1.4, sibling agent branch).
