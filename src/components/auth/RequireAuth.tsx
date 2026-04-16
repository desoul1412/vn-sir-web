/**
 * RequireAuth.tsx — VNSIR Route Guard HOC
 *
 * Task 1.4 — Spec §2.5.3
 *
 * Wraps protected routes and enforces three auth states:
 *
 *   1. Loading   → Full-screen skeleton pulse (no flicker)
 *   2. No user   → Redirect to /login (preserves intended URL via `state.from`)
 *   3. Not onboarded → Redirect to /onboarding (profile incomplete)
 *   4. Authenticated + onboarded → render children ✓
 *
 * ── Admin guard variant ───────────────────────────────────────
 *  <RequireAuth requireAdmin>  — also checks isAdmin flag.
 *  Non-admins are redirected to / with a 403 error state.
 *
 * ── Usage ────────────────────────────────────────────────────
 *  // Standard protected route:
 *  <Route path="/reports/:slug" element={
 *    <RequireAuth><ReportDetail /></RequireAuth>
 *  } />
 *
 *  // Admin-only route:
 *  <Route path="/admin/*" element={
 *    <RequireAuth requireAdmin><AdminLayout /></RequireAuth>
 *  } />
 *
 * ── Security notes ───────────────────────────────────────────
 *  - Redirect is client-side only (SPA). API routes are protected
 *    separately via Supabase RLS and Edge Function auth checks.
 *  - `state.from` carries the original path so Login can redirect
 *    back after successful auth (deep-link recovery).
 */

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'

// ─── Types ────────────────────────────────────────────────────

interface RequireAuthProps {
  children: React.ReactNode
  /** When true, also verifies isAdmin. Non-admins redirect to /. */
  requireAdmin?: boolean
  /**
   * When true, skips the isOnboarded check.
   * Set this on the /onboarding route itself to prevent redirect loops.
   */
  skipOnboardingCheck?: boolean
}

// ─── Loading screen ───────────────────────────────────────────

/**
 * AuthLoadingScreen — shown while session is being resolved.
 * Matches VNSIR's minimalist monochrome design language.
 * Prevents FOUC (flash of unauthenticated content).
 */
function AuthLoadingScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Verifying session…"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        backgroundColor: '#FAFAFA',
        gap: '1.25rem',
      }}
    >
      {/* VNSIR logotype placeholder */}
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1.1rem',
          letterSpacing: '0.3em',
          color: '#1B2A4A',
          textTransform: 'uppercase',
          opacity: 0.6,
        }}
      >
        VNSIR
      </span>

      {/* Animated pulse bar */}
      <div
        style={{
          width: '120px',
          height: '2px',
          backgroundColor: '#E2E8F0',
          borderRadius: '1px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '40%',
            backgroundColor: '#1B2A4A',
            borderRadius: '1px',
            animation: 'vnsir-auth-sweep 1.4s ease-in-out infinite',
          }}
        />
      </div>

      {/* Inject keyframes once */}
      <style>{`
        @keyframes vnsir-auth-sweep {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(250%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  )
}

// ─── RequireAuth ──────────────────────────────────────────────

export function RequireAuth({
  children,
  requireAdmin = false,
  skipOnboardingCheck = false,
}: RequireAuthProps) {
  const { user, isLoading, isAdmin, isOnboarded } = useAuthContext()
  const location = useLocation()

  // ── 1. Session resolving ─────────────────────────────────
  if (isLoading) {
    return <AuthLoadingScreen />
  }

  // ── 2. No session → go to login, preserve intended destination ─
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    )
  }

  // ── 3. Authenticated but onboarding incomplete ────────────
  //    Skipped when: skipOnboardingCheck prop OR already on /onboarding.
  if (!skipOnboardingCheck && !isOnboarded && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  // ── 4. Admin gate ─────────────────────────────────────────
  if (requireAdmin && !isAdmin) {
    return (
      <Navigate
        to="/"
        state={{ error: 'forbidden', code: 403 }}
        replace
      />
    )
  }

  // ── 5. All checks passed → render protected content ──────
  return <>{children}</>
}

// ─── Convenience alias ────────────────────────────────────────

/** RequireAdmin — shorthand for <RequireAuth requireAdmin> */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  return <RequireAuth requireAdmin>{children}</RequireAuth>
}
