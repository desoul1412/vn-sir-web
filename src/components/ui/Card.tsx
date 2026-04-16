/**
 * Card — VNSIR Report & Brief Cards
 *
 * Exported components:
 *  - ReportCard   — Product grid card (spec §3.2–3.4)
 *  - BriefCard    — Analyst Brief data card (spec §2.2)
 *  - Card         — Generic surface card
 *
 * Design spec:
 *  - ReportCard: 16:9 cover art, sector tag + date, title, 2-line summary, price + CTA
 *  - BriefCard: Left navy border, super-large metric, headline, bullet list
 *  - Price accent: --color-vnsir-navy, font-weight 800
 *  - CTA arrow "View Insight ->" bolded in accent colour
 *
 * Accessibility:
 *  - Cards are focusable via keyboard (tabIndex=0, role=article)
 *  - cover img has alt text
 *  - Price announced as "USD X,XXX"
 */

import React from 'react'
import { cn } from '@/lib/cn'
import { Badge, type Sector } from './Badge'
import { Button } from './Button'

// ─── Data Art Placeholder ────────────────────────────────────
function DataArtPlaceholder({ sector }: { sector?: Sector }) {
  const accentMap: Record<string, string> = {
    ecommerce:     '#0369A1',
    gaming:        '#7C3AED',
    entertainment: '#B45309',
    macro:         '#15803D',
  }
  const accent = sector ? accentMap[sector] : '#1B2A4A'

  return (
    <div
      className="data-art-placeholder"
      aria-hidden="true"
      style={{
        background: `linear-gradient(135deg, #0A0A0A 0%, ${accent}33 60%, #0A0A0A 100%)`,
      }}
    >
      {/* Abstract grid lines */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 320 180"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, opacity: 0.18 }}
      >
        {/* Horizontal lines */}
        {[30, 60, 90, 120, 150].map(y => (
          <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="white" strokeWidth="0.5" />
        ))}
        {/* Vertical lines */}
        {[40, 80, 120, 160, 200, 240, 280].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="180" stroke="white" strokeWidth="0.5" />
        ))}
        {/* Accent bar chart abstraction */}
        <rect x="40"  y="110" width="18" height="70"  fill={accent ?? '#1B2A4A'} opacity="0.7" />
        <rect x="70"  y="80"  width="18" height="100" fill={accent ?? '#1B2A4A'} opacity="0.9" />
        <rect x="100" y="95"  width="18" height="85"  fill={accent ?? '#1B2A4A'} opacity="0.6" />
        <rect x="130" y="60"  width="18" height="120" fill={accent ?? '#1B2A4A'} opacity="1"   />
        <rect x="160" y="75"  width="18" height="105" fill={accent ?? '#1B2A4A'} opacity="0.8" />
        {/* Baseline */}
        <line x1="20" y1="180" x2="300" y2="180" stroke="white" strokeWidth="1" opacity="0.4" />
      </svg>
    </div>
  )
}

// ─── ReportCard ───────────────────────────────────────────────
export interface ReportCardProps {
  id: string
  title: string
  sector: Sector
  /** ISO date string */
  publishedAt: string
  /** 1–2 sentences */
  summary: string
  /** Price in USD cents */
  priceCents: number
  coverImageUrl?: string
  onClick?: () => void
  className?: string
}

export function ReportCard({
  title,
  sector,
  publishedAt,
  summary,
  priceCents,
  coverImageUrl,
  onClick,
  className,
}: ReportCardProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
  }).format(new Date(publishedAt))

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceCents / 100)

  return (
    <article
      className={cn('card-report', className)}
      tabIndex={0}
      role="article"
      aria-label={`${title} — ${formattedPrice}`}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick?.() }}
    >
      {/* Cover */}
      <div className="card-report-cover">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={`Cover for ${title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <DataArtPlaceholder sector={sector} />
        )}
      </div>

      {/* Content */}
      <div className="card-report-content">
        {/* Meta row */}
        <div className="card-report-meta">
          <Badge sector={sector} />
          <time
            dateTime={publishedAt}
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-vnsir-gray-muted)',
              fontWeight: 500,
            }}
          >
            {formattedDate}
          </time>
        </div>

        {/* Title */}
        <h3 className="card-report-title">{title}</h3>

        {/* Executive summary — 2 lines max */}
        <p className="card-report-summary">{summary}</p>

        {/* Footer: price + CTA */}
        <div className="card-report-footer">
          <span
            className="card-report-price"
            aria-label={`Price: ${formattedPrice}`}
          >
            {formattedPrice}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={e => { e.stopPropagation(); onClick?.() }}
            aria-label={`View insight: ${title}`}
          >
            View Insight →
          </Button>
        </div>
      </div>
    </article>
  )
}

// ─── BriefCard ────────────────────────────────────────────────
export interface BriefCardProps {
  metric: string
  headline: string
  bullets: string[]
  /** Related report link */
  reportLink?: string
  reportLinkLabel?: string
  sector?: Sector
  className?: string
  onClick?: () => void
}

export function BriefCard({
  metric,
  headline,
  bullets,
  reportLink,
  reportLinkLabel = 'Read Full Brief',
  sector,
  className,
  onClick,
}: BriefCardProps) {
  const borderColorMap: Record<string, string> = {
    ecommerce:     'var(--color-sector-ecommerce)',
    gaming:        'var(--color-sector-gaming)',
    entertainment: 'var(--color-sector-entertainment)',
    macro:         'var(--color-sector-macro)',
  }

  const borderColor = sector ? borderColorMap[sector] : 'var(--color-vnsir-navy)'

  return (
    <article
      className={cn('card-brief', className)}
      style={{ borderLeftColor: borderColor }}
      onClick={onClick}
      role="article"
    >
      {/* Key metric */}
      <div className="card-brief-metric" aria-label={`Key metric: ${metric}`}>
        {metric}
      </div>

      {/* Headline */}
      <h3 className="card-brief-headline">{headline}</h3>

      {/* Bullet points */}
      <ul className="card-brief-bullets" aria-label="Key insights">
        {bullets.map((bullet, i) => (
          <li key={i}>{bullet}</li>
        ))}
      </ul>

      {/* Action link */}
      {reportLink && (
        <Button
          variant="ghost"
          size="sm"
          href={reportLink}
          style={{ alignSelf: 'flex-start', marginTop: 'auto' }}
        >
          {reportLinkLabel} →
        </Button>
      )}
    </article>
  )
}

// ─── Generic Card ─────────────────────────────────────────────
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'surface' | 'dark'
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  const variantClass = {
    default: 'card',
    surface: 'card-surface',
    dark:    'card-dark',
  }[variant]

  return (
    <div className={cn(variantClass, className)} {...props}>
      {children}
    </div>
  )
}

export function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('card-body', className)} {...props}>
      {children}
    </div>
  )
}
