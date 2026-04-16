/**
 * App.tsx — VNSIR Root Component & Router
 *
 * Task 1.4 — Wires AuthProvider + BrowserRouter + route scaffold.
 *
 * ── Route structure ───────────────────────────────────────────
 *  /                  → Home (Intelligence Hub) — protected
 *  /login             → Login page — public
 *  /onboarding        → Onboarding modal — auth required, skip onboard check
 *  /auth/callback     → OAuth / Magic Link handler — public
 *  /admin/*           → Admin dashboard — protected + requireAdmin
 *  *                  → 404 fallback
 *
 * ── Provider hierarchy ────────────────────────────────────────
 *  <BrowserRouter>           — router context (must be outermost)
 *    <AuthProvider>          — global auth state (useAuth singleton)
 *      <Routes>              — page routing
 *
 * ── Lazy loading ─────────────────────────────────────────────
 *  Pages are lazily imported to keep initial bundle lean.
 *  Suspense fallback matches AuthLoadingScreen visual style.
 */

import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { RequireAuth, RequireAdmin, AuthCallback } from '@/components/auth'

// ─── Lazy page imports ────────────────────────────────────────
// Pages added as tasks complete. Placeholders prevent 404s.

const Onboarding = lazy(() =>
  import('@/pages/Onboarding').then(m => ({ default: m.default ?? m.Onboarding }))
)

// TODO Task 1.2  — Login.tsx
const Login = lazy(() =>
  import('@/pages/Login').catch(() => ({
    default: () => (
      <div style={placeholderStyle}>
        <p style={eyebrowStyle}>LOGIN</p>
        <h1 style={headlineStyle}>Auth gateway — Task 1.2</h1>
        <p style={subStyle}>Login.tsx not yet implemented.</p>
      </div>
    ),
  }))
)

// TODO Task 1.6/1.7 — Home.tsx (Intelligence Hub)
const Home = lazy(() =>
  import('@/pages/Home').catch(() => ({
    default: () => (
      <div style={placeholderStyle}>
        <p style={eyebrowStyle}>THE VIETNAM STRATEGIC INSIGHT RESEARCH</p>
        <h1 style={headlineStyle}>Decoding Vietnam's Shadow Market.</h1>
        <p style={subStyle}>
          Executive wisdom and surgical insights. <strong>No raw data.</strong>
        </p>
        <p style={{ ...subStyle, opacity: 0.5, marginTop: '2rem' }}>
          Home.tsx — Task 1.6/1.7
        </p>
      </div>
    ),
  }))
)

// TODO Task 3.9–3.13 — Admin pages
const AdminDashboard = lazy(() =>
  import('@/pages/admin/Dashboard').catch(() => ({
    default: () => (
      <div style={placeholderStyle}>
        <p style={eyebrowStyle}>ADMIN</p>
        <h1 style={headlineStyle}>Admin Dashboard</h1>
        <p style={subStyle}>Admin layout — Task 3.9</p>
      </div>
    ),
  }))
)

// ─── Suspense fallback ────────────────────────────────────────

function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page…"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        backgroundColor: '#FAFAFA',
      }}
    >
      <span style={{ ...eyebrowStyle, opacity: 0.4 }}>VNSIR</span>
    </div>
  )
}

// ─── App root ─────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Public routes ──────────────────────────── */}
            <Route path="/login"         element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* ── Onboarding — auth required, skip onboard check ── */}
            <Route
              path="/onboarding"
              element={
                <RequireAuth skipOnboardingCheck>
                  <Onboarding />
                </RequireAuth>
              }
            />

            {/* ── Protected routes ───────────────────────── */}
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />

            {/* ── Admin routes ───────────────────────────── */}
            <Route
              path="/admin/*"
              element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              }
            />

            {/* ── 404 fallback ───────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}

// ─── Placeholder styles (remove when real pages land) ────────

const placeholderStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',
  minHeight: '100dvh',
  padding: '4rem clamp(1.5rem, 5vw, 6rem)',
  backgroundColor: '#FFFFFF',
  maxWidth: '960px',
  margin: '0 auto',
}

const eyebrowStyle: React.CSSProperties = {
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  color: '#1B2A4A',
  margin: '0 0 1rem',
}

const headlineStyle: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
  fontWeight: 700,
  lineHeight: 1.1,
  color: '#0F172A',
  margin: '0 0 1rem',
}

const subStyle: React.CSSProperties = {
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: '1.0625rem',
  lineHeight: 1.6,
  color: '#36454F',
  margin: 0,
}
