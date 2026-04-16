/**
 * Home.tsx — VNSIR Intelligence Hub (Homepage)
 *
 * Task 1.6 — Hero Section
 *   Spec §2.1 · brain/vnsir/wiki/Home-Hero-Spec.md
 *
 * Sections:
 *   1. <HeroSection />   ← Task 1.6 (this task)
 *   2. Product Grid      ← TODO Task 1.7
 *   3. Trust Strip       ← TODO Task 1.9
 *
 * Copy rationale:
 *   Eyebrow   — institutional identity, zero ambiguity
 *   H1        — "Shadow Market" signals insider access; period asserts confidence
 *   H2        — qualifies the buyer, kills the "data dump" objection upfront
 *   CTA       — action-forward; drives to product grid without friction
 *
 * Design tokens from src/index.css (@theme):
 *   --color-vnsir-navy, --color-vnsir-charcoal, --color-vnsir-black
 *   --font-sans, --font-serif
 *   --tracking-widest, --tracking-tight
 *
 * Accessibility:
 *   · Single <h1> per page
 *   · Eyebrow is aria-hidden (decorative; H1 is the primary label)
 *   · Animation respects prefers-reduced-motion
 *   · All color pairs ≥ 4.5:1 contrast (navy on white = 11.8:1 ✓ AAA)
 */

import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'

// ─── Hero Data Art — inline SVG placeholder ──────────────────────────────────
// Replaces public/assets/cards/hero-art.svg once UI agent delivers asset (Task 1.8).
// Abstract bar-chart geometry on dark panel. Stoic, zero decoration fluff.

function HeroDataArt() {
  return (
    <div className="hero-art-panel" aria-hidden="true">
      <svg
        viewBox="0 0 480 270"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block' }}
        role="presentation"
      >
        {/* Dark background */}
        <defs>
          <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#0A0A0A" />
            <stop offset="60%"  stopColor="#0F1929" />
            <stop offset="100%" stopColor="#0A0A0A" />
          </linearGradient>
          <linearGradient id="bar-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%"   stopColor="#1B2A4A" />
            <stop offset="100%" stopColor="#2E4A8A" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="glow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#1B2A4A" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1B2A4A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Base */}
        <rect width="480" height="270" fill="url(#bg-grad)" />

        {/* Fine grid lines — horizontal */}
        {[45, 90, 135, 180, 225].map((y) => (
          <line key={`h${y}`} x1="40" y1={y} x2="440" y2={y}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}

        {/* Fine grid lines — vertical */}
        {[80, 160, 240, 320, 400].map((x) => (
          <line key={`v${x}`} x1={x} y1="30" x2={x} y2="240"}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}

        {/* Bar chart — abstract data visualization */}
        <rect x="80"  y="160" width="38" height="70" rx="1" fill="url(#bar-grad)" opacity="0.55" />
        <rect x="136" y="120" width="38" height="110" rx="1" fill="url(#bar-grad)" opacity="0.70" />
        <rect x="192" y="90"  width="38" height="140" rx="1" fill="url(#bar-grad)" opacity="0.85" />
        <rect x="248" y="110" width="38" height="120" rx="1" fill="url(#bar-grad)" opacity="0.75" />
        <rect x="304" y="70"  width="38" height="160" rx="1" fill="url(#bar-grad)" opacity="0.90" />
        <rect x="360" y="50"  width="38" height="180" rx="1" fill="url(#bar-grad)" opacity="1.00" />

        {/* Trend line */}
        <polyline
          points="99,155 155,115 211,85 267,105 323,65 379,45"
          fill="none"
          stroke="rgba(100,160,255,0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Trend line dots */}
        {[[99,155],[155,115],[211,85],[267,105],[323,65],[379,45]].map(([cx,cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="2.5"
            fill="rgba(100,160,255,0.75)" />
        ))}

        {/* Bottom axis */}
        <line x1="60" y1="232" x2="420" y2="232"
          stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* Label: top-right corner watermark */}
        <text x="420" y="24"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="8"
          fill="rgba(255,255,255,0.2)"
          textAnchor="end"
          letterSpacing="2">
          VN-SIR INTEL
        </text>

        {/* Glow overlay — bottom portion */}
        <rect x="60" y="150" width="360" height="82" fill="url(#glow)" />

        {/* Left accent border */}
        <rect x="0" y="0" width="3" height="270" fill="#1B2A4A" opacity="0.8" />
      </svg>
    </div>
  )
}

// ─── Site Header ─────────────────────────────────────────────────────────────

function SiteHeader() {
  const { signOut, user } = useAuthContext()

  return (
    <header className="vnsir-header" role="banner">
      <div className="container-vnsir" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>

        {/* Wordmark */}
        <Link
          to="/"
          aria-label="VN-SIR — Vietnam Strategic Insight Research, home"
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 800,
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.08em',
            color: 'var(--color-vnsir-black)',
            textDecoration: 'none',
            marginRight: 'auto',
          }}
        >
          VN-SIR
        </Link>

        {/* Nav */}
        <nav aria-label="Primary navigation" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a href="#intelligence-hub" className="vnsir-nav-link">Intelligence Hub</a>
          <a href="/briefs"           className="vnsir-nav-link">Analyst Briefs</a>
          <a href="/about"            className="vnsir-nav-link">About</a>
          <a href="/advisory"         className="vnsir-nav-link">Custom Research</a>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <a href="/portal" className="btn btn-ghost btn-sm">My Portal</a>
              <button
                onClick={() => signOut()}
                className="btn btn-ghost btn-sm"
                type="button"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
// Task 1.6 core deliverable.
// Copy architecture — see brain/vnsir/wiki/Home-Hero-Spec.md §1

function HeroSection() {
  const gridRef = useRef<HTMLElement>(null)

  function scrollToGrid() {
    gridRef.current?.scrollIntoView({ behavior: 'smooth' })
    // Note: gridRef is forwarded via prop to the product grid section below.
    // For now, scroll to #intelligence-hub anchor.
    document.getElementById('intelligence-hub')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="hero-section"
      aria-labelledby="hero-headline"
      style={{
        minHeight: 'calc(100dvh - 4rem)',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--color-vnsir-white)',
        borderBottom: '1px solid var(--color-vnsir-gray-mid)',
      }}
    >
      <div className="container-vnsir" style={{ width: '100%', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="hero-layout">

          {/* ── Left Column: Copy ──────────────────────────────────────── */}
          <div className="hero-copy">

            {/* Eyebrow — decorative, aria-hidden so screenreaders go straight to H1 */}
            <p
              className="vnsir-eyebrow"
              aria-hidden="true"
              style={{
                color: 'var(--color-vnsir-navy)',
                marginBottom: '1.25rem',
              }}
            >
              The Vietnam Strategic Insight Research
            </p>

            {/* H1 — primary headline */}
            <h1
              id="hero-headline"
              className="vnsir-hero-headline text-balance"
              style={{
                color: 'var(--color-vnsir-navy)',
                marginBottom: '1.25rem',
              }}
            >
              Decoding Vietnam's<br />Shadow Market.
            </h1>

            {/* H2 — subheadline, qualifies the reader, kills data-dump objection */}
            <p
              className="vnsir-hero-sub"
              style={{ marginBottom: '2.5rem', maxWidth: '38ch' }}
            >
              <strong>Executive wisdom</strong> and{' '}
              <strong>surgical insights.</strong>{' '}
              <strong>No raw data.</strong>
            </p>

            {/* CTAs */}
            <div
              className="hero-cta-row"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}
            >
              <button
                type="button"
                className="btn btn-cta"
                onClick={scrollToGrid}
                aria-label="Explore Intelligence Hub — scroll to report library"
              >
                Explore Intelligence Hub
                <span aria-hidden="true" style={{ marginLeft: '0.25rem' }}>→</span>
              </button>

              <a
                href="/advisory"
                className="btn btn-ghost"
                aria-label="Request custom research — go to advisory page"
              >
                Request Custom Research
              </a>
            </div>

            {/* Trust micro-copy */}
            <p className="trust-signal">
              <svg
                width="12" height="12" viewBox="0 0 12 12"
                fill="none" aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <path
                  d="M6 1L7.5 4.5H11L8.5 6.5L9.5 10L6 8L2.5 10L3.5 6.5L1 4.5H4.5L6 1Z"
                  fill="currentColor" opacity="0.6"
                />
              </svg>
              Trusted by analysts and executives across Vietnam's digital economy.
            </p>
          </div>

          {/* ── Right Column: Data Art ─────────────────────────────────── */}
          <div className="hero-art-wrapper" aria-hidden="true">
            <HeroDataArt />
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="main-content" tabIndex={-1}>
        {/* ── Section 1: Hero ──────────────────────────────────────── */}
        <HeroSection />

        {/* ── Section 2: Intelligence Hub Product Grid ──────────────
            TODO Task 1.7 — Faceted tabs + report card grid
            Fetches from supabase.from('reports').select('*').eq('status','published')
        ──────────────────────────────────────────────────────────── */}
        <section
          id="intelligence-hub"
          aria-label="Intelligence Hub — Report Library"
          style={{
            padding: '5rem 0',
            backgroundColor: 'var(--color-vnsir-gray-light)',
          }}
        >
          <div className="container-vnsir">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '16rem',
                gap: '0.75rem',
                opacity: 0.4,
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-vnsir-charcoal)',
                }}
              >
                Task 1.7 — Product Grid / Intelligence Hub
              </p>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-vnsir-gray-muted)',
                }}
              >
                Report cards with faceted tabs will render here.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 3: Trust Strip ────────────────────────────────
            TODO Task 1.9 — Grayscale partner logos + legal footer
        ──────────────────────────────────────────────────────────── */}
      </main>

      {/* ── Inline styles for layout (CSS-in-JS here avoids new CSS file) ── */}
      <style>{`
        /* Hero two-column layout */
        .hero-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .hero-layout {
            grid-template-columns: 55fr 45fr;
            gap: 5rem;
          }
        }

        /* Hero art panel */
        .hero-art-panel {
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          position: relative;
        }

        /* Glow pulse on art panel — desktop only, motion safe */
        @media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
          .hero-art-wrapper .hero-art-panel::after {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(
              ellipse at 70% 80%,
              rgba(27, 42, 74, 0.25) 0%,
              transparent 65%
            );
            animation: hero-glow 4s ease-in-out infinite alternate;
          }

          @keyframes hero-glow {
            from { opacity: 0.4; }
            to   { opacity: 1;   }
          }
        }

        /* Hide art on very small screens — copy is the priority */
        .hero-art-wrapper {
          display: none;
        }

        @media (min-width: 640px) {
          .hero-art-wrapper {
            display: block;
          }
        }
      `}</style>
    </>
  )
}
