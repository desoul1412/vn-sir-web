---
tags: [vnsir, deployment, vercel, infra]
date: 2026-04-12
status: active
task: "1.1.4"
---

# VNSIR — Deployment & Vercel Configuration Spec

> **Project:** vn-sir-web  
> **Vercel Project Name:** `vnsir-com`  
> **Last Updated:** 2026-04-12  
> **Owner:** Project Manager (Rin Tanaka agent)

---

## Table of Contents

1. [Vercel Project Setup](#1-vercel-project-setup)
2. [GitHub Repository Linking](#2-github-repository-linking)
3. [Environment Variable Groups](#3-environment-variable-groups)
4. [vercel.json Configuration](#4-verceljson-configuration)
5. [Security Headers Rationale](#5-security-headers-rationale)
6. [Branch & Preview Strategy](#6-branch--preview-strategy)
7. [Deployment Checklist](#7-deployment-checklist)

---

## 1. Vercel Project Setup

### Project Details

| Field              | Value                                      |
|--------------------|--------------------------------------------|
| **Project Name**   | `vnsir-com`                                |
| **Team / Scope**   | Personal or org scope (configure at setup) |
| **Framework**      | Vite                                       |
| **Build Command**  | `npm run build`                            |
| **Output Dir**     | `dist`                                     |
| **Install Command**| `npm ci`                                   |
| **Node Version**   | 20.x (LTS)                                 |

### Manual Setup Steps (Vercel Dashboard)

1. Log in to [vercel.com](https://vercel.com) and click **Add New → Project**.
2. Under **Import Git Repository**, select the `vnsir-com` GitHub repository (see §2).
3. Set **Framework Preset** to **Vite**.
4. Confirm Build & Output settings match the table above.
5. Assign the project to the correct team/scope.
6. Click **Deploy** to trigger the first build.

### CLI Alternative

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# From project root — follow prompts to link/create the project
vercel link --project vnsir-com

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## 2. GitHub Repository Linking

### Repository

| Field              | Value                                 |
|--------------------|---------------------------------------|
| **Org / User**     | `<github-org>` (fill in at creation)  |
| **Repo Name**      | `vnsir-com`                           |
| **Default Branch** | `main`                                |

### Vercel ↔ GitHub Integration Behaviour

| Trigger                          | Vercel Action                                                  |
|----------------------------------|----------------------------------------------------------------|
| Push to `main`                   | Production deployment to `vnsir.com`                           |
| Pull Request opened / updated    | Preview deployment; unique URL posted as PR comment            |
| PR merged to `main`              | New production deployment promoted automatically               |
| Push to `agent/*` branches       | Preview deployment (environment group: **preview**)            |

### Settings in Vercel Dashboard

Navigate to **Project → Settings → Git**:

- **Connected Repository:** `<github-org>/vnsir-com`
- **Production Branch:** `main`
- **Preview Branches:** All branches (default)
- **Ignored Build Step:** *(leave blank — use `vercel.json` or `VERCEL_SKIP_DEPLOYMENT` for granular control)*
- **Auto-cancel Deployments:** Enabled (`autoJobCancelation: true` in `vercel.json`)

---

## 3. Environment Variable Groups

Vercel supports **Environment Variable Groups** (shared sets of variables applied to one or more projects). The following groups are defined for `vnsir-com`.

> **Note:** Since `vnsir-com` is an entirely client-side Vite application, all runtime variables must be prefixed with `VITE_` to be inlined at build time. No server-side secrets should be stored in `VITE_*` variables — they are visible in the compiled bundle.

---

### 3.1 Group: `preview`

Applied to: **Preview** deployments (all branches except `main`).

| Variable                  | Example Value                          | Description                                              |
|---------------------------|----------------------------------------|----------------------------------------------------------|
| `VITE_APP_ENV`            | `preview`                              | Runtime environment identifier                           |
| `VITE_APP_VERSION`        | `0.0.0-preview`                        | Displayed in Settings → About; auto-set in CI            |
| `VITE_SENTRY_DSN`         | `https://xxx@sentry.io/preview-proj`   | Sentry project DSN for preview error tracking            |
| `VITE_SENTRY_ENVIRONMENT` | `preview`                              | Sentry environment tag                                   |
| `VITE_ANALYTICS_ENABLED`  | `false`                                | Disable analytics in preview to avoid polluting data     |
| `VITE_FEATURE_FLAGS`      | `{"newGamePlus":true,"musicRoom":true}`| JSON feature-flag overrides active in preview only       |
| `VITE_DEBUG_AFFECTION`    | `true`                                 | Show affection scores in HUD (dev aid; hidden in prod)   |

**How to create in Vercel Dashboard:**

1. Go to **Team Settings → Environment Variable Groups → Create Group**.
2. Name the group `preview`.
3. Add each variable above.
4. Navigate to **Project `vnsir-com` → Settings → Environment Variables → Link Group → preview**.
5. Set scope to **Preview**.

---

### 3.2 Group: `production`

Applied to: **Production** deployments (branch: `main`).

| Variable                  | Example Value                          | Description                                              |
|---------------------------|----------------------------------------|----------------------------------------------------------|
| `VITE_APP_ENV`            | `production`                           | Runtime environment identifier                           |
| `VITE_APP_VERSION`        | `1.0.0`                                | Set via CI using `GITHUB_REF_NAME` or `package.json`     |
| `VITE_SENTRY_DSN`         | `https://yyy@sentry.io/prod-proj`      | Sentry project DSN for production error tracking         |
| `VITE_SENTRY_ENVIRONMENT` | `production`                           | Sentry environment tag                                   |
| `VITE_ANALYTICS_ENABLED`  | `true`                                 | Enable analytics tracking in production                  |
| `VITE_FEATURE_FLAGS`      | `{"newGamePlus":false,"musicRoom":true}` | Stable flags only; experimental flags disabled         |
| `VITE_DEBUG_AFFECTION`    | `false`                                | Affection HUD hidden in production                       |

**How to create in Vercel Dashboard:**

1. Go to **Team Settings → Environment Variable Groups → Create Group**.
2. Name the group `production`.
3. Add each variable above with production values.
4. Navigate to **Project `vnsir-com` → Settings → Environment Variables → Link Group → production**.
5. Set scope to **Production**.

---

### 3.3 Shared Variables (both environments)

These are set directly on the project (not via a group) and enabled for **all environments**:

| Variable         | Value                                      | Description                            |
|------------------|--------------------------------------------|----------------------------------------|
| `NODE_VERSION`   | `20`                                       | Pin Node.js LTS version for builds     |
| `NPM_VERSION`    | `10`                                       | Pin npm version                        |

---

## 4. `vercel.json` Configuration

The `vercel.json` file lives at the repository root. Its full contents are documented here for reference.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "name": "vnsir-com",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options",         "value": "DENY" },
        { "key": "X-Content-Type-Options",   "value": "nosniff" },
        { "key": "Referrer-Policy",          "value": "strict-origin-when-cross-origin" },
        { "key": "Content-Security-Policy",  "value": "default-src 'self'; img-src 'self' data:; media-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'" },
        { "key": "Permissions-Policy",       "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/((?!assets|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
      "destination": "/index.html"
    }
  ],
  "github": {
    "enabled": true,
    "silent": false,
    "autoJobCancelation": true
  },
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "framework": "vite"
}
```

### Key Sections Explained

| Section           | Purpose                                                                                  |
|-------------------|------------------------------------------------------------------------------------------|
| `name`            | Binds this config to the Vercel project `vnsir-com`                                      |
| `headers[0]`      | Applies security headers to **every route** (`/(.*)`), including HTML, JSON, and the SPA |
| `headers[1]`      | Sets aggressive long-term caching on Vite's content-hashed `/assets/*` files             |
| `rewrites`        | SPA catch-all — unknown paths served `index.html` so React Router handles them          |
| `github`          | Enables GitHub integration; auto-cancels stale in-flight builds on new pushes           |
| `buildCommand`    | Overrides Vercel's auto-detected command to ensure `npm run build` is always used        |
| `outputDirectory` | Points Vercel at Vite's default output folder `dist`                                     |
| `installCommand`  | Uses `npm ci` (clean install) for reproducible dependency resolution in CI               |

---

## 5. Security Headers Rationale

### `X-Frame-Options: DENY`

Prevents the application from being embedded in `<iframe>`, `<frame>`, or `<object>` on any origin.

- **Threat mitigated:** Clickjacking — an attacker embedding the game in an invisible overlay to harvest clicks/keystrokes.
- **Why DENY vs SAMEORIGIN:** The application has no legitimate need to be framed, even on the same origin. `DENY` is the most restrictive and correct choice.
- **Note:** Modern browsers also honour the `frame-ancestors` CSP directive; both are set for defence-in-depth.

### `X-Content-Type-Options: nosniff`

Instructs the browser to honour the declared `Content-Type` and not MIME-sniff the response.

- **Threat mitigated:** MIME confusion attacks where a browser interprets an uploaded file as executable script.
- **Relevance here:** If a player exports/imports save JSON, `nosniff` ensures the browser never misinterprets that data response as script.

### `Referrer-Policy: strict-origin-when-cross-origin`

Controls how much referrer information the browser sends with navigation and resource requests.

- **Behaviour:** Full URL sent to same-origin destinations; only the origin (no path/query) sent to cross-origin HTTPS; nothing sent to HTTP destinations.
- **Why not `no-referrer`:** Some third-party integrations (e.g., Sentry, analytics) rely on referrer data for attribution; `strict-origin-when-cross-origin` balances privacy and functionality.

### `Content-Security-Policy` (bonus — specified in NFR §9)

Restricts resource loading to the application's own origin only.

- `default-src 'self'` — catch-all; only same-origin resources allowed.
- `img-src 'self' data:` — allows inline base64 thumbnails (used by the save system).
- `media-src 'self'` — audio assets (BGM/SFX) served from the same origin.
- `style-src 'self' 'unsafe-inline'` — Tailwind CSS injects styles at runtime; `unsafe-inline` is temporarily required until a nonce-based approach is adopted.
- `font-src 'self'` — no external font CDNs; fonts are bundled.

> **TODO (future hardening):** Replace `'unsafe-inline'` in `style-src` with a build-time nonce or hash strategy.

### `Permissions-Policy`

Explicitly disables browser features the application does not use.

- `camera=()`, `microphone=()`, `geolocation=()` — none required for a visual novel.

---

## 6. Branch & Preview Strategy

```
main ──────────────────────────────────────────► Production (vnsir.com)
  │
  ├── agent/zara-osei  ──► Preview (https://vnsir-com-git-agent-zara-osei-<hash>.vercel.app)
  ├── agent/chris-ng   ──► Preview (https://vnsir-com-git-agent-chris-ng-<hash>.vercel.app)
  ├── agent/rin-tanaka ──► Preview (https://vnsir-com-git-agent-rin-tanaka-<hash>.vercel.app)
  └── feature/*        ──► Preview (unique URL per branch)
```

### Conflict Avoidance

- Agents `zara-osei` and `chris-ng` have open MRs. Their preview deployments are independent Vercel builds — no shared state.
- `vercel.json` is owned by the PM agent (this branch). If other agents need to modify it, coordinate via a PR comment on the `agent/rin-tanaka` branch before merging.
- Environment variables are set in the **Vercel Dashboard**, not in `vercel.json`, so there is no file-level conflict risk for env changes.

---

## 7. Deployment Checklist

Use this checklist before merging any branch to `main`:

### Pre-merge

- [ ] `npm run build` passes locally with zero errors/warnings
- [ ] `npm run test` (Vitest) passes
- [ ] Playwright E2E suite passes against preview deployment URL
- [ ] Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices, SEO) on preview URL
- [ ] Security headers verified on preview URL via [securityheaders.com](https://securityheaders.com)
- [ ] No `VITE_*` variable leaks sensitive data (audit bundle with `npx vite-bundle-visualizer`)
- [ ] `vercel.json` schema validates: `npx vercel --json --dry-run` (in project dir)

### Post-deploy (production)

- [ ] Production URL `https://vnsir.com` loads without errors (check browser console)
- [ ] All security headers present: `curl -I https://vnsir.com`
- [ ] SPA routing works: navigate directly to `/menu`, `/settings`, `/gallery` — all return 200
- [ ] Sentry production project receives a test event (trigger `window.Sentry.captureMessage('deploy-smoke-test')` in console)
- [ ] Analytics event fires on first page load (check analytics dashboard)

---

*This spec covers Task 1.1.4. For application-level specs (pages, acceptance criteria, data model), see [VNSIR-Implementation-Spec.md](./VNSIR-Implementation-Spec.md).*
