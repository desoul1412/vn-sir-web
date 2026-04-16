/**
 * useAuth — VNSIR Authentication Hook
 *
 * Wraps supabase.auth.onAuthStateChange and exposes a clean
 * interface for the entire application.
 *
 * Returns:
 *  - user           : Supabase User | null
 *  - session        : Supabase Session | null
 *  - profile        : Profile row from public.profiles | null
 *  - isLoading      : true while session is being resolved
 *  - isAdmin        : true when profile.role === 'super_admin' (Phase 3)
 *  - isOnboarded    : true when profile has job_title AND industry_focus set
 *  - signInWithGoogle     : trigger Google OAuth flow
 *  - signInWithMagicLink  : trigger passwordless email OTP
 *  - signOut        : clears session + redirects to /login
 *  - refreshProfile : re-fetches profile row from DB (call after onboarding)
 *
 * Usage:
 *   const { user, profile, isLoading, isAdmin, signOut } = useAuth()
 *
 * ⚠ Prefer consuming via AuthContext (useAuthContext) for global state.
 *   This raw hook is used by AuthProvider only.
 */

import { useState, useEffect, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────

export interface UseAuthReturn {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  isAdmin: boolean
  /** True only when the user has completed onboarding (job_title + industry_focus set). */
  isOnboarded: boolean
  signInWithGoogle: () => Promise<void>
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

// ─── Hook ─────────────────────────────────────────────────────

export function useAuth(): UseAuthReturn {
  const [user, setUser]       = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ── Fetch profile row from public.profiles ──────────────────
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('[useAuth] Failed to fetch profile:', error.message)
      setProfile(null)
    } else {
      setProfile(data as Profile)
    }
  }, [])

  // ── Refresh profile (callable externally after onboarding) ──
  const refreshProfile = useCallback(async () => {
    if (user?.id) await fetchProfile(user.id)
  }, [user, fetchProfile])

  // ── Bootstrap: resolve current session on mount ─────────────
  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setIsLoading(false))
      } else {
        setIsLoading(false)
      }
    })

    // ── Subscribe to auth state changes ─────────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  // ── Sign in with Google OAuth ────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }, [])

  // ── Sign in with Magic Link ──────────────────────────────────
  const signInWithMagicLink = useCallback(
    async (email: string): Promise<{ error: string | null }> => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) return { error: error.message }
      return { error: null }
    },
    []
  )

  // ── Sign out ─────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
    window.location.href = '/login'
  }, [])

  // ── isAdmin — Phase 3 RBAC (profile.role column added in Task 3.8) ─
  // Will be updated when admin role system ships. Checking role field
  // defensively so this compiles before migration runs.
  const isAdmin = Boolean(
    (profile as (Profile & { role?: string }) | null)?.role === 'super_admin'
  )

  // ── isOnboarded — user has provided job_title + industry_focus ──
  const isOnboarded = Boolean(profile?.job_title && profile?.industry_focus)

  return {
    user,
    session,
    profile,
    isLoading,
    isAdmin,
    isOnboarded,
    signInWithGoogle,
    signInWithMagicLink,
    signOut,
    refreshProfile,
  }
}
