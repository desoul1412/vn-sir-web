/**
 * Navigation — VNSIR Header & Tabs
 *
 * Exported components:
 *  - Header      — Site-wide sticky header (spec §1.1–1.3)
 *  - Tabs        — Sector filter tabs (spec §3.1)
 *  - Breadcrumb  — Page hierarchy trail
 *
 * Spec:
 *  - Logo: top-left, minimal monochrome
 *  - Nav: 4 links only (Intelligence Hub, Custom Advisory, The Analyst Brief, About Us)
 *  - Utility: Language switcher (EN), Search icon, Login button (outline)
 *  - Tabs: All / E-Commerce / Gaming / Entertainment / Macro Economy
 *
 * Accessibility:
 *  - <nav> landmark with aria-label
 *  - aria-current="page" on active link
 *  - Tabs use role="tablist" / role="tab" / aria-selected
 *  - Mobile menu toggles aria-expanded
 */

import React, { useState } from 'react'
import { cn } from '@/lib/cn'
import { Button } from './Button'
import type { Sector } from './Badge'

// ─── VNSIR Logo ───────────────────────────────────────────────
function VNSIRLogo({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href="/"
      aria-label="VNSIR — Vietnam Strategic Insights Research — Home"
      style={{ textDecoration: 'none' }}
    >
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-lg)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: dark ? 'var(--color-vnsir-white)' : 'var(--color-vnsir-black)',
        }}
      >
        VN<span style={{ color: 'var(--color-vnsir-navy)' }}>SIR</span>
      </span>
    </a>
  )
}

// ─── Search Button ────────────────────────────────────────────
function SearchButton({ dark }: { dark?: boolean }) {
  return (
    <button
      className="btn-icon"
      aria-label="Open search"
      style={{ color: dark ? 'rgba(255,255,255,0.75)' : 'var(--color-vnsir-charcoal)' }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  )
}

// ─── Header ───────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Intelligence Hub',  href: '/intelligence-hub' },
  { label: 'Custom Advisory',   href: '/custom-advisory' },
  { label: 'The Analyst Brief', href: '/analyst-brief' },
  { label: 'About Us',          href: '/about' },
] as const

export interface HeaderProps {
  /** Dark variant for hero sections */
  dark?: boolean
  /** Currently active path for aria-current */
  activePath?: string
  /** Language override (default: EN) */
  language?: string
  onLoginClick?: () => void
  onSearchClick?: () => void
}

export function Header({
  dark = false,
  activePath,
  language = 'EN',
  onLoginClick,
  onSearchClick,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={cn('vnsir-header', dark && 'vnsir-header-dark')}
      role="banner"
    >
      <div
        className="container-vnsir"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          gap: '2rem',
        }}
      >
        {/* Logo */}
        <VNSIRLogo dark={dark} />

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            flex: 1,
            justifyContent: 'center',
          }}
          className="hidden-mobile"
        >
          {NAV_LINKS.map(link => {
            const isActive = activePath === link.href
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  dark ? 'vnsir-nav-link vnsir-nav-link-dark' : 'vnsir-nav-link',
                  isActive && 'vnsir-nav-link-active'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </a>
            )
          })}
        </nav>

        {/* Utility cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Language switcher */}
          <button
            className="btn btn-sm btn-ghost"
            aria-label={`Current language: ${language}. Switch language.`}
            style={{ minWidth: 0, padding: '0.375rem 0.625rem' }}
          >
            {language}
          </button>

          {/* Search */}
          <SearchButton dark={dark} onClick={onSearchClick} />

          {/* Login */}
          <Button
            variant={dark ? 'ghost-light' : 'ghost'}
            size="sm"
            onClick={onLoginClick}
            aria-label="Login or access client portal"
          >
            Login / Portal
          </Button>

          {/* Mobile hamburger */}
          <button
            className="btn-icon"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen(v => !v)}
            style={{
              display: 'none',
              color: dark ? 'var(--color-vnsir-white)' : 'var(--color-vnsir-charcoal)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          role="navigation"
          aria-label="Mobile navigation"
          style={{
            position: 'absolute',
            top: '4rem',
            left: 0,
            right: 0,
            background: dark ? 'var(--color-vnsir-black)' : 'var(--color-vnsir-white)',
            borderTop: '1px solid var(--color-vnsir-gray-mid)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            zIndex: 'var(--z-sticky)' as unknown as number,
          }}
        >
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                dark ? 'vnsir-nav-link vnsir-nav-link-dark' : 'vnsir-nav-link',
                activePath === link.href && 'vnsir-nav-link-active'
              )}
              aria-current={activePath === link.href ? 'page' : undefined}
              onClick={() => setMobileOpen(false)}
              style={{ padding: '0.75rem 0', display: 'block' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────
export type SectorFilter = 'all' | Sector

export interface TabsProps {
  activeTab: SectorFilter
  onChange: (tab: SectorFilter) => void
  className?: string
}

const TAB_OPTIONS: { value: SectorFilter; label: string }[] = [
  { value: 'all',           label: 'All' },
  { value: 'ecommerce',     label: 'E-Commerce' },
  { value: 'gaming',        label: 'Gaming' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'macro',         label: 'Macro Economy' },
]

export function SectorTabs({ activeTab, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter reports by sector"
      className={cn('tabs', className)}
    >
      {TAB_OPTIONS.map(opt => (
        <button
          key={opt.value}
          role="tab"
          aria-selected={activeTab === opt.value}
          aria-controls={`panel-${opt.value}`}
          className={cn('tab', activeTab === opt.value && 'tab-active')}
          onClick={() => onChange(opt.value)}
          tabIndex={activeTab === opt.value ? 0 : -1}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ─── Breadcrumb ───────────────────────────────────────────────
export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('breadcrumb', className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <React.Fragment key={item.label}>
            {i > 0 && (
              <span className="breadcrumb-separator" aria-hidden="true">›</span>
            )}
            {isLast || !item.href ? (
              <span className="breadcrumb-current" aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            ) : (
              <a href={item.href}>{item.label}</a>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
