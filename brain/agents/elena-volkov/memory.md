---
agent: elena-volkov
role: Backend Developer
date: 2026-04-12
task: "1.1.6 — GitHub Actions CI setup"
---

# Task 1.1.6 — GitHub Actions CI

## What was done

Created `.github/workflows/ci.yml` with four sequential jobs that gate the Vercel deploy:

1. **Lint** — `npm run lint` (runs `next lint`)
2. **Type-check** — `npx tsc --noEmit`
3. **Test** — `npx vitest run`
4. **Build** — `npm run build` (runs `next build`)

## Files created / modified

| File | Action | Reason |
|------|--------|--------|
| `.github/workflows/ci.yml` | Created | Main CI pipeline |
| `package.json` | Updated | Added `vitest`, `@vitejs/plugin-react`, `@testing-library/*`, `jsdom` dev-deps; added `test` and `typecheck` scripts |
| `vitest.config.ts` | Created | Vitest config with jsdom environment and `@/` alias |
| `vitest.setup.ts` | Created | Imports `@testing-library/jest-dom` matchers |
| `src/__tests__/smoke.test.ts` | Created | Minimal smoke test so `vitest run` exits 0 |
| `vercel.json` | Created | Next.js-correct framework config (corrects rin-tanaka's Vite config) |

## Gating Vercel on CI

The Vercel GitHub integration respects "Required Checks" configured in the GitHub repo's branch protection rules. To complete the gate:

1. In **GitHub → Settings → Branches → main → Require status checks**:
   - Add `Lint, Type-check, Test & Build` (the job name in `ci.yml`)
2. In **Vercel → Project → Git → Pull Request Preview**:
   - The deployment will still trigger but Vercel itself won't be marked as "required" — the GitHub branch protection prevents the PR from merging until CI is green.

This follows the standard pattern: CI runs first; Vercel deployment is triggered in parallel but merging is blocked until the `CI` check passes.

## Conflict notes

- `vercel.json`: rin-tanaka created this file on their branch. Our version is compatible (same security headers) but corrects `framework: "nextjs"` and removes the Vite-specific `outputDirectory: "dist"` and `rewrites`. This will need to be reconciled at merge time.
- `package.json`: zara-osei owns the base Next.js project setup. We added dev-only dependencies; no dependency conflicts.
