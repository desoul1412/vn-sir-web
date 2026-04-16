/**
 * AuthContext.tsx — VNSIR Global Authentication Context
 *
 * Task 1.4 — Wraps useAuth in a React Context so auth state is
 * available app-wide without prop drilling. Single source of truth.
 *
 * ── Architecture ─────────────────────────────────────────────
 *  AuthProvider   : Mounts once at the app root (App.tsx / main.tsx)
 *  useAuthContext : Consuming hook — throws if used outside provider
 *
 * ── Usage ────────────────────────────────────────────────────
 *  // In component:
 *  import { useAuthContext } from '@/context/AuthContext'
 *  const { user, profile, isAdmin, signOut } = useAuthContext()
 *
 * ── What it exposes ──────────────────────────────────────────
 *  All fields from UseAuthReturn (see hooks/useAuth.ts):
 *  user, session, profile, isLoading, isAdmin, isOnboarded,
 *  signInWithGoogle, signInWithMagicLink, signOut, refreshProfile
 */

import React, { createContext, useContext } from 'react'
import { useAuth } from '@/hooks/useAuth'
import type { UseAuthReturn } from '@/hooks/useAuth'

// ─── Context definition ───────────────────────────────────────

const AuthContext = createContext<UseAuthReturn | null>(null)

// ─── Provider ─────────────────────────────────────────────────

/**
 * AuthProvider — wrap this around the router root in App.tsx.
 * It owns the single useAuth() call for the entire app.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

// ─── Consumer hook ────────────────────────────────────────────

/**
 * useAuthContext — typed hook for consuming auth state.
 * Throws a descriptive error if called outside <AuthProvider>.
 */
export function useAuthContext(): UseAuthReturn {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error(
      '[VNSIR] useAuthContext must be used inside <AuthProvider>. ' +
      'Ensure AuthProvider wraps your route tree in App.tsx.'
    )
  }
  return ctx
}
