/**
 * AuthCallback.tsx — OAuth / Magic Link Redirect Handler
 *
 * Task 1.4 — Spec §2.5.3
 *
 * Mounted at /auth/callback. Supabase appends the session
 * tokens to the URL fragment after Google OAuth or Magic Link
 * verification. This component:
 *
 *   1. Exchanges the URL hash/code for a valid session via
 *      supabase.auth.exchangeCodeForSession (PKCE flow) or
 *      detects the implicit-flow fragment automatically.
 *   2. Waits for onAuthStateChange to fire and update the
 *      AuthContext session.
 *   3. Redirects to `state.from` (preserved deep-link) or
 *      falls back to `/` (home / Intelligence Hub).
 *
 * ── Security ─────────────────────────────────────────────────
 *  - Never reads raw tokens from the URL for anything other
 *    than passing to the Supabase SDK.
 *  - Hash is cleared by the SDK after consumption.
 *  - Any error (invalid/expired token) → redirect to /login
 *    with an error query param for the Login page to display.
 */

import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

type CallbackStatus = 'pending' | 'success' | 'error'

export function AuthCallback() {
  const navigate    = useNavigate()
  const location    = useLocation()
  const [status, setStatus] = useState<CallbackStatus>('pending')
  const [errMsg,  setErrMsg]  = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function handleCallback() {
      try {
        // ── PKCE flow: exchange code from query string ───────
        const params = new URLSearchParams(window.location.search)
        const code   = params.get('code')

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        }
        // Implicit flow tokens in hash are handled automatically
        // by the Supabase client on initialization via detectSessionInUrl.

        // ── Wait for session to hydrate ──────────────────────
        const { data: { session }, error: sessionErr } =
          await supabase.auth.getSession()

        if (sessionErr) throw sessionErr
        if (!session)   throw new Error('No session after callback exchange.')

        if (!cancelled) {
          setStatus('success')

          // ── Redirect: back to intended destination or home ─
          const from = (location.state as { from?: Location })?.from?.pathname
          navigate(from && from !== '/login' ? from : '/', { replace: true })
        }
      } catch (err: unknown) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Authentication failed.'
        console.error('[AuthCallback]', message)
        setStatus('error')
        setErrMsg(message)

        // Redirect to login with error context after short delay
        setTimeout(() => {
          navigate(`/login?error=${encodeURIComponent(message)}`, { replace: true })
        }, 2500)
      }
    }

    handleCallback()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Render ────────────────────────────────────────────────

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        backgroundColor: '#FAFAFA',
        fontFamily: "'Inter', system-ui, sans-serif",
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      {status === 'pending' && (
        <>
          <span style={{ fontSize: '1.1rem', letterSpacing: '0.3em', color: '#1B2A4A', textTransform: 'uppercase', opacity: 0.6 }}>
            VNSIR
          </span>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>
            Verifying your credentials…
          </p>
        </>
      )}

      {status === 'success' && (
        <p style={{ color: '#1B2A4A', fontSize: '0.875rem' }}>
          Authentication successful. Redirecting…
        </p>
      )}

      {status === 'error' && (
        <>
          <p style={{ color: '#B91C1C', fontWeight: 600, fontSize: '0.875rem' }}>
            Authentication failed
          </p>
          {errMsg && (
            <p style={{ color: '#64748B', fontSize: '0.8125rem', maxWidth: '28rem' }}>
              {errMsg}
            </p>
          )}
          <p style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
            Redirecting to login…
          </p>
        </>
      )}
    </div>
  )
}
