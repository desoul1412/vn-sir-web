/**
 * Skeleton — VNSIR Loading Placeholders
 * Shimmer animation matches brand palette (gray-light → gray-mid).
 */

import React from 'react'
import { cn } from '@/lib/cn'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
}

export function Skeleton({ width, height, className, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
      aria-hidden="true"
      style={{ width, height, ...style }}
      {...props}
    />
  )
}

/** Skeleton mimicking a ReportCard */
export function SkeletonReportCard() {
  return (
    <div className="card-report" aria-busy="true" aria-label="Loading report...">
      <Skeleton height="180px" style={{ borderRadius: 0 }} />
      <div className="card-report-content" style={{ gap: '0.875rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Skeleton width="80px" height="20px" />
          <Skeleton width="60px" height="20px" />
        </div>
        <Skeleton height="24px" />
        <Skeleton height="16px" />
        <Skeleton height="16px" width="75%" />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
          <Skeleton width="80px" height="24px" />
          <Skeleton width="100px" height="32px" />
        </div>
      </div>
    </div>
  )
}

/** Skeleton mimicking a BriefCard */
export function SkeletonBriefCard() {
  return (
    <div
      className="card-brief"
      aria-busy="true"
      aria-label="Loading brief..."
      style={{ borderLeftColor: 'var(--color-vnsir-gray-mid)' }}
    >
      <Skeleton width="100px" height="48px" />
      <Skeleton height="24px" />
      <Skeleton height="16px" />
      <Skeleton height="16px" width="80%" />
      <Skeleton height="16px" width="65%" />
    </div>
  )
}
