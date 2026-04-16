---
tags: [vnsir, design-system, ui, spec]
date: 2026-04-16
status: active
---

# VNSIR Design System

> "Minimalism, Stoicism, Data-driven Decision Making."
> — VNSIR Founder Philosophy, spec §1.1

**Related:** [[VNSIR-Spec]] | [[Factory-Operations-Manual]]

---

## 1. Design Principles

| Principle | Application |
|-----------|-------------|
| **Minimalism** | No decorative elements. Every pixel earns its place. White space is intentional. |
| **Stoicism** | Restrained palette. No gradients for decoration. Shadows used sparingly. |
| **Data-driven** | Typography sized for scannability. Metrics displayed at maximum visual weight. |
| **Authority** | B2B-grade typography — Inter, not Playfair for body. ALL-CAPS eyebrows convey precision. |
| **Accessibility** | WCAG 2.1 AA minimum on all colour pairs. Keyboard navigation on all interactive elements. |

---

## 2. Colour Palette

All tokens defined in `src/index.css` under `@theme {}`.

### 2.1 Base Palette

| Token | Hex | RGB | WCAG vs White | WCAG vs Black | Usage |
|-------|-----|-----|---------------|---------------|-------|
| `--color-vnsir-black` | `#0A0A0A` | 10, 10, 10 | **19.6:1 AAA** | — | Primary bg, headings on light |
| `--color-vnsir-navy` | `#1B2A4A` | 27, 42, 74 | **11.8:1 AAA** | — | Accent, interactive, CTA |
| `--color-vnsir-charcoal` | `#36454F` | 54, 69, 79 | **7.5:1 AAA** | — | Body text on white bg |
| `--color-vnsir-white` | `#FFFFFF` | 255, 255, 255 | — | **19.6:1 AAA** | Page bg, text on dark |
| `--color-vnsir-gray-light` | `#F5F5F5` | 245, 245, 245 | 1.05:1 | 18.7:1 | Surface bg, skeleton |
| `--color-vnsir-gray-mid` | `#E2E8F0` | 226, 232, 240 | 1.2:1 | 16.4:1 | Borders, dividers |
| `--color-vnsir-gray-muted` | `#94A3B8` | 148, 163, 184 | 2.85:1 | 7.3:1 | Secondary text on dark bg only |

> ⚠️ `gray-muted` (#94A3B8) does NOT pass WCAG AA on white (2.85:1 < 4.5:1). Use only on dark surfaces or as decorative/non-essential text.

### 2.2 Semantic Colours

| Token | Hex | WCAG vs White | Usage |
|-------|-----|---------------|-------|
| `--color-vnsir-success` | `#15803D` | 5.1:1 AA | Success states, published badge |
| `--color-vnsir-warning` | `#B45309` | 4.6:1 AA | Warning states, draft badge |
| `--color-vnsir-danger` | `#B91C1C` | 4.5:1 AA | Errors, danger button, form errors |
| `--color-vnsir-info` | `#1D4ED8` | 5.9:1 AA | Info alerts, links |

### 2.3 Sector Accent Colours

Used as **left-border accents only** on BriefCards (not as text colour on white without a background chip).

| Sector | Token | Hex | Usage |
|--------|-------|-----|-------|
| E-Commerce | `--color-sector-ecommerce` | `#0369A1` | Left border, badge text on #EFF6FF bg |
| Gaming | `--color-sector-gaming` | `#7C3AED` | Left border, badge text on #F5F3FF bg |
| Entertainment | `--color-sector-entertainment` | `#B45309` | Left border, badge text on #FFFBEB bg |
| Macro Economy | `--color-sector-macro` | `#15803D` | Left border, badge text on #F0FDF4 bg |

---

## 3. Typography

### 3.1 Font Stack

| Role | Family | Fallback | Import |
|------|--------|----------|--------|
| **UI / Body** | Inter | Helvetica Neue, Arial | Google Fonts |
| **Serif accent** | Playfair Display | Georgia | Google Fonts (load on demand) |
| **Monospace** | JetBrains Mono | Fira Code, Courier New | Google Fonts (load on demand) |

> Only Inter is preloaded in `index.html`. Load Playfair/Mono only on pages that need them.

### 3.2 Type Scale (Modular, 1.25 ratio)

| Token | Size | Pixels | Usage |
|-------|------|--------|-------|
| `--text-xs` | 0.75rem | 12px | Eyebrow labels, form labels, dates, badges |
| `--text-sm` | 0.875rem | 14px | Body text, button labels, card summaries |
| `--text-base` | 1rem | 16px | Default body, large button |
| `--text-lg` | 1.25rem | 20px | Card titles, large body |
| `--text-xl` | 1.563rem | 25px | Section subheadings, price display |
| `--text-2xl` | 1.953rem | 31px | Section headings (H3) |
| `--text-3xl` | 2.441rem | 39px | Page headings (H2) |
| `--text-4xl` | 3.052rem | 49px | Brief card metrics (+22%, $1.5B) |
| `--text-5xl` | 3.815rem | 61px | Hero H1 |

### 3.3 Typography Classes

| Class | Properties | Usage |
|-------|-----------|-------|
| `.vnsir-eyebrow` | xs, 600, ALL-CAPS, 0.15em tracking, muted | Section labels, spec §2.1 |
| `.vnsir-hero-headline` | clamp(2.4–3.8rem), 800, -0.02em tracking | Hero H1, spec §2.1 |
| `.vnsir-hero-sub` | clamp(1–1.5rem), 400, charcoal | Hero subheadline |
| `.vnsir-section-heading` | 2xl, 700, -0.02em tracking | Section titles |
| `.vnsir-metric` | 4xl, 800, tight tracking, black | Analyst Brief key metrics |

### 3.4 Heading Defaults (base layer)

All headings reset via base layer with `font-weight: 700`, `letter-spacing: -0.02em`, `color: --color-vnsir-black`.

---

## 4. Spacing System

8px base grid. All spacing tokens are multiples of 4px.

| Token | Value | Pixels |
|-------|-------|--------|
| `--spacing-1` | 0.25rem | 4px |
| `--spacing-2` | 0.5rem | 8px |
| `--spacing-3` | 0.75rem | 12px |
| `--spacing-4` | 1rem | 16px |
| `--spacing-6` | 1.5rem | 24px |
| `--spacing-8` | 2rem | 32px |
| `--spacing-12` | 3rem | 48px |
| `--spacing-16` | 4rem | 64px |

---

## 5. Border Radius

Sharp-edge first (Stoic aesthetic). No `rounded-xl` or heavy rounding.

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0px | Default for all geometric blocks |
| `--radius-sm` | 2px | Inputs, buttons — subtle softening |
| `--radius-md` | 4px | Cards, modals, alerts |
| `--radius-full` | 9999px | Avatars, pill badges |

---

## 6. Shadows

Shadows are minimal — used to elevate interactive elements, not for decoration.

| Token | CSS | Usage |
|-------|-----|-------|
| `--shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.05)` | Buttons |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.07)` | Cards on hover |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.08)` | Modals, CTA button |

---

## 7. Components

### 7.1 Button

| Variant | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| `primary` | `#1B2A4A` (navy) | white | navy | black |
| `secondary` | `#0A0A0A` (black) | white | black | charcoal |
| `ghost` | transparent | navy | navy | navy bg, white text |
| `ghost-light` | transparent | white | white | white bg, black text |
| `danger` | `#B91C1C` | white | danger | `#991B1B` |
| `cta` | navy + `shadow-md` | white | navy | black + lift + `shadow-lg` |

**Sizes:** `sm` (12px, 8×16px pad) → `md` (14px, 12×24px) → `lg` (16px, 16×32px)

**States:** default → hover → focus-visible (3px navy ring) → disabled (45% opacity) → loading (spinner + aria-busy)

**Accessibility decision:** Native `<button>` element, not `<div>`. `aria-disabled` mirrors `disabled`. Polymorphic `href` prop renders `<a>` with `rel="noopener noreferrer"` on `target="_blank"`.

### 7.2 Form Inputs

| Element | Class | Notes |
|---------|-------|-------|
| Text/Email/Password | `.form-input` | 1px border, 2px radius, navy focus ring |
| Select | `.form-input.form-select` | Custom SVG chevron, no native arrow |
| Textarea | `.form-input.form-textarea` | min-height 7rem, resize vertical |
| Label | `.form-label` | xs, 600, ALL-CAPS, widest tracking |
| Error text | `.form-error-text` | xs, 500, danger red |

**Corporate email validation** (spec §3.3): `validateCorporateEmail()` exported from `Input.tsx` — blocks 11 freemail domains via Set lookup + regex check.

**FormGroup** injects `id`, `aria-describedby`, `aria-required` onto child via `React.cloneElement`.

### 7.3 Cards

#### ReportCard (spec §3.2–3.4)
- 16:9 cover with `DataArtPlaceholder` SVG (abstract bar chart on dark gradient)
- Sector badge + date in meta row
- Title: lg, 700, tight tracking
- Summary: 2-line clamp
- Footer: price in navy (xl, 800) + "View Insight →" ghost button

#### BriefCard (spec §2.2)
- Left 4px border in sector colour
- Metric: 4xl, 800, black
- Headline: lg, 700
- Bullets: custom em-dash (`—`) marker in navy
- "Read Full Brief →" link button

### 7.4 Badge

All badges: xs, 600, ALL-CAPS, 4px letter-spacing, 2px border-radius.

| Class | Bg | Text | Border | WCAG |
|-------|----|------|--------|------|
| `badge-sector-ecommerce` | `#EFF6FF` | `#0369A1` | `#BFDBFE` | 4.5:1 AA ✓ |
| `badge-sector-gaming` | `#F5F3FF` | `#7C3AED` | `#DDD6FE` | 5.1:1 AA ✓ |
| `badge-sector-entertainment` | `#FFFBEB` | `#B45309` | `#FDE68A` | 4.6:1 AA ✓ |
| `badge-sector-macro` | `#F0FDF4` | `#15803D` | `#BBF7D0` | 5.1:1 AA ✓ |

### 7.5 Navigation

- Header: 64px height, sticky, 1px bottom border
- Logo: "VN" black + "SIR" navy, 800 weight — no SVG file dependency
- Nav links: sm, 600, 2px underline on hover/active
- Utility: language badge + search icon + ghost Login button
- Mobile: hamburger reveals stacked nav (aria-expanded toggle)

### 7.6 Tabs (Sector Filter)

- `role="tablist"` / `role="tab"` / `aria-selected`
- Active: black text + 2px solid black bottom border
- Inactive: muted text, no border
- Overflow: horizontal scroll, hidden scrollbar

### 7.7 Modal

- Overlay: `rgb(0 0 0 / 0.6)` backdrop
- Panel: white, max-width 36rem, `radius-md`, `shadow-lg`
- Focus trap on open, focus restore on close
- Escape key closes
- Click outside overlay closes

### 7.8 Alert / Toast / TrustSignal

- **TrustSignal** (spec §4.2): lock icon + italic text — `"End-to-end encrypted. Protected by VNSIR NDA protocols."`
- **Toast**: black bg, left-border accent by variant, bottom-right fixed
- All alerts/toasts have appropriate `role="alert"` or `role="status"` + `aria-live`

---

## 8. Layout

### 8.1 Container

`.container-vnsir`: max-width 80rem (1280px), auto margins, 24px (desktop: 32px) padding.

### 8.2 Sections

`.section-vnsir`: 80px top/bottom padding.

### 8.3 Report Grid

`.report-grid`: responsive — 1 col → 2 col (640px) → 3 col (1024px), 24px gap.

### 8.4 Split Screen (Custom Advisory, spec §2.1)

`.split-screen`: stacked on mobile → `grid-template-columns: 1fr 1fr` at 1024px, 80px gap.

---

## 9. Z-Index Layers

| Token | Value | Layer |
|-------|-------|-------|
| `--z-base` | 0 | Normal flow |
| `--z-raised` | 10 | Dropdowns, tooltips |
| `--z-sticky` | 100 | Header, sticky bars |
| `--z-overlay` | 200 | Modal backdrop |
| `--z-modal` | 300 | Modal panel |
| `--z-toast` | 400 | Toast notifications |

---

## 10. Accessibility Checklist

- [x] All colour pairs verified WCAG 2.1 AA minimum
- [x] Focus-visible ring on all interactive elements (2px navy, 2px offset)
- [x] Mouse users: `:focus:not(:focus-visible)` removes ring
- [x] `::selection` styled: navy bg, white text
- [x] All buttons use native `<button>` element
- [x] Disabled states use `aria-disabled` + `pointer-events: none`
- [x] Loading states use `aria-busy="true"`
- [x] Form fields linked to labels via `htmlFor`/`id`
- [x] Errors linked via `aria-describedby`
- [x] Required fields marked `aria-required`
- [x] Modal uses `role="dialog"` + `aria-modal` + `aria-labelledby` + focus trap
- [x] Nav uses `<nav>` landmark + `aria-label`
- [x] Active nav link uses `aria-current="page"`
- [x] Tabs use `role="tablist"` / `role="tab"` / `aria-selected`
- [x] Cards are focusable with keyboard `Enter`/`Space` activation
- [x] Skeleton loaders have `aria-hidden="true"` + container `aria-busy="true"`
- [x] Trust strip images have `filter: grayscale(100%)` per spec §4.1
- [x] `<a target="_blank">` gets `rel="noopener noreferrer"` automatically

---

## 11. File Structure

```
src/
├── index.css                    ← Single source of design tokens + component CSS
├── main.tsx
├── App.tsx
├── lib/
│   └── cn.ts                    ← clsx + tailwind-merge utility
└── components/
    └── ui/
        ├── index.ts             ← Barrel export (public API)
        ├── Button.tsx
        ├── Input.tsx            ← Input, Select, Textarea, FormGroup, validators
        ├── Badge.tsx
        ├── Card.tsx             ← ReportCard, BriefCard, Card
        ├── Modal.tsx
        ├── Navigation.tsx       ← Header, SectorTabs, Breadcrumb
        ├── Alert.tsx            ← Alert, TrustSignal, Toast, ToastContainer
        └── Skeleton.tsx
```

---

## 12. Usage Examples

```tsx
// Button
import { Button } from '@/components/ui'
<Button variant="cta" size="lg">Request a Confidential Proposal</Button>
<Button variant="ghost" loading>Processing...</Button>

// Report Card
import { ReportCard } from '@/components/ui'
<ReportCard
  id="r1"
  title="Vietnam E-Commerce Shadow Market Report 2026"
  sector="ecommerce"
  publishedAt="2026-03-01"
  summary="Unveils the $4.2B informal commerce layer operating beneath Shopee and Lazada."
  priceCents={250000}
  onClick={() => navigate('/reports/vn-ecommerce-2026')}
/>

// Corporate email validation
import { validateCorporateEmail } from '@/components/ui'
const error = validateCorporateEmail(email) // returns string | undefined

// Form Group
import { FormGroup, Input } from '@/components/ui'
<FormGroup id="corp-email" label="Corporate Email" required error={emailError}>
  <Input type="email" placeholder="you@company.com" />
</FormGroup>

// Trust Signal
import { TrustSignal } from '@/components/ui'
<TrustSignal /> // renders spec §4.2 lock + NDA text
```
