---
tags: [spec, hero, home, copy, ui]
date: 2026-04-16
status: active
---

# Home.tsx — Hero Section Spec

**Task reference:** Task 1.6 (Sprint 1, Phase 1)
**Related:** [[VNSIR-Design-System]], [[Onboarding-Spec]]
**Depends on:** Auth context (`useAuth`), design tokens in `src/index.css`

---

## 1. Copy Architecture

### 1.1 Eyebrow
```
THE VIETNAM STRATEGIC INSIGHT RESEARCH
```
- All-caps
- Font: `--font-sans` / Inter
- Weight: 600
- Letter-spacing: `--tracking-widest` (0.15em)
- Color: `--color-vnsir-navy` (#1B2A4A) — authority signal, not muted gray
- Size: `--text-xs` (12px)
- Class: `.vnsir-eyebrow` with navy color override

### 1.2 H1 — Primary Headline
```
Decoding Vietnam's Shadow Market.
```
- Copywriter rationale: "Shadow Market" creates intrigue + positions VNSIR as insider intelligence. The period asserts confidence. No question marks.
- Font: `--font-sans` / Inter (weight 800) — not serif for hard authority
- Size: `clamp(2.4rem, 5vw, --text-5xl)` — fluid, always dominant
- Color: `--color-vnsir-navy` (#1B2A4A) — navy accent per spec §2.1
- Letter-spacing: `--tracking-tight`
- Line-height: `--leading-tight` (1.2)
- Class: `.vnsir-hero-headline` with `color: var(--color-vnsir-navy)` override

### 1.3 H2 — Subheadline
```
Executive wisdom and surgical insights. No raw data.
```
- "Executive wisdom" — positions buyer as strategic decision-maker
- "surgical insights" — precision, no fluff, respect for buyer's time
- "No raw data." — boldest claim, addresses #1 objection (data overload)
- Font: Inter 400/500
- Size: `clamp(1rem, 2.5vw, --text-xl)` (25px)
- Color: `--color-vnsir-charcoal`
- Bold keywords: `<strong>Executive wisdom</strong>`, `<strong>surgical insights</strong>`, `<strong>No raw data.</strong>`

### 1.4 CTA — Primary Action
```
Explore Intelligence Hub →
```
- Class: `.btn .btn-cta`
- Drives scroll to product grid section
- Secondary ghost: "Request Custom Research"

---

## 2. Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Header: VNSIR logo · nav links · Login CTA]                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CONTAINER (max 1280px, centered)                                │
│                                                                  │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐  │
│  │ EYEBROW                      │  │  DATA ART (abstract SVG)  │  │
│  │ H1 (hero headline)           │  │  Dark panel 16:9          │  │
│  │ H2 (subheadline)             │  │  Grid pattern, navy glow  │  │
│  │                              │  │                           │  │
│  │ [CTA btn] [ghost btn]        │  │                           │  │
│  │                              │  │                           │  │
│  │ Trust signal (micro-copy)    │  │                           │  │
│  └──────────────────────────────┘  └──────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

- **Mobile:** Stack vertically — copy above, art below (hidden on xs)
- **Desktop (≥1024px):** Two-column, 55/45 split, content left, art right
- **Hero min-height:** `calc(100dvh - 4rem)` (full bleed below nav)
- **Background:** `--color-vnsir-white` (#FFFFFF) — clean, premium

---

## 3. Data Art — Right Panel

Abstract SVG placeholder (inline) until `public/assets/cards/hero-art.svg` is produced by UI agent.

Visual: dark navy/black gradient with:
- Fine grid lines (opacity 0.06)
- 3–4 white geometric rectangles (bar chart simulation)
- Subtle bottom-right glow pulse (CSS animation, `prefers-reduced-motion` safe)
- Thin left border accent line in navy

---

## 4. Trust Signal (below CTAs)

```
Trusted by analysts and executives across Vietnam's digital economy.
```
- Class: `.trust-signal`
- Italic, muted gray
- No logos at this stage (Task 1.9 handles the Trust Badge strip)

---

## 5. Accessibility

| Element | Target |
|---------|--------|
| H1 landmark | Single `<h1>` per page |
| Eyebrow aria | `aria-hidden="true"` (decorative, H1 is primary label) |
| CTA button | `aria-label` if icon-only |
| Animation | `@media (prefers-reduced-motion)` kills pulse |
| Color contrast | Navy (#1B2A4A) on white = 11.8:1 ✓ AAA |

---

## 6. Copy Variants (A/B test queue)

| Variant | H1 | Notes |
|---------|-----|-------|
| Control | "Decoding Vietnam's Shadow Market." | Navy, asserts insider access |
| Alt A | "Vietnam's Market. Decoded." | Shorter, punchy |
| Alt B | "Stop Guessing. Start Knowing." | Emotional, objection-first |

**Ship control variant.** A/B infra in Phase 4.

---

## 7. Implementation Notes

- `Home.tsx` exports a single default component
- Hero is section 1 of 3 (Hero → Product Grid [Task 1.7] → Trust Strip [Task 1.9])
- Product grid section is stubbed as `{/* TODO: Task 1.7 — Product Grid */}`
- No external state needed for hero; pure presentational component
