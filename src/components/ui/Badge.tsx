/**
 * Badge — VNSIR Sector Tags & Status Indicators
 *
 * Design spec:
 *  - Sector tags: xs, 600-weight, ALL-CAPS, 4px letter-spacing
 *  - Left-border color accent = sector colour token
 *  - All badge/bg pairs verified WCAG AA (contrast ≥ 4.5:1)
 *
 * Usage:
 *  <Badge sector="ecommerce">E-Commerce</Badge>
 *  <Badge status="published" />
 *  <Badge tier={1} />
 */

import React from 'react'
import { cn } from '@/lib/cn'

// ─── Types ───────────────────────────────────────────────────
export type Sector = 'ecommerce' | 'gaming' | 'entertainment' | 'macro'
export type ReportStatus = 'published' | 'draft' | 'archived'

// ─── Badge component ─────────────────────────────────────────
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Sector variant */
  sector?: Sector
  /** Status variant */
  status?: ReportStatus
  /** Tier number (0, 1, 2) */
  tier?: 0 | 1 | 2
}

const SECTOR_CLASSES: Record<Sector, string> = {
  ecommerce:     'badge badge-sector-ecommerce',
  gaming:        'badge badge-sector-gaming',
  entertainment: 'badge badge-sector-entertainment',
  macro:         'badge badge-sector-macro',
}

const SECTOR_LABELS: Record<Sector, string> = {
  ecommerce:     'E-Commerce',
  gaming:        'Gaming',
  entertainment: 'Entertainment',
  macro:         'Macro Economy',
}

const STATUS_CLASSES: Record<ReportStatus, string> = {
  published: 'badge badge-status-published',
  draft:     'badge badge-status-draft',
  archived:  'badge badge-status-archived',
}

const STATUS_LABELS: Record<ReportStatus, string> = {
  published: 'Published',
  draft:     'Draft',
  archived:  'Archived',
}

export function Badge({ sector, status, tier, children, className, ...props }: BadgeProps) {
  // Sector badge
  if (sector !== undefined) {
    return (
      <span
        className={cn(SECTOR_CLASSES[sector], className)}
        {...props}
      >
        {children ?? SECTOR_LABELS[sector]}
      </span>
    )
  }

  // Status badge
  if (status !== undefined) {
    return (
      <span
        className={cn(STATUS_CLASSES[status], className)}
        {...props}
      >
        {children ?? STATUS_LABELS[status]}
      </span>
    )
  }

  // Tier badge
  if (tier !== undefined) {
    return (
      <span
        className={cn('badge badge-tier', className)}
        {...props}
      >
        {children ?? `Tier ${tier}`}
      </span>
    )
  }

  // Generic badge
  return (
    <span className={cn('badge', className)} {...props}>
      {children}
    </span>
  )
}
