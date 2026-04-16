/**
 * Alert & Toast — VNSIR Feedback Components
 *
 * Exported:
 *  - Alert         — inline feedback (info/success/warning/danger)
 *  - TrustSignal   — security micro-copy (spec §4.2: NDA + lock icon)
 *  - Toast         — floating notification
 *  - ToastContainer
 *
 * Accessibility:
 *  - Alert: role="alert" for error, role="status" for info/success
 *  - Toast: aria-live="polite" region
 *  - Icons are aria-hidden, text is screen-reader visible
 */

import React from 'react'
import { cn } from '@/lib/cn'

// ─── Icon helpers ─────────────────────────────────────────────
function Icon({ d, ...props }: { d: string } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16" height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0, marginTop: '1px' }}
      {...props}
    >
      <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ICONS = {
  info:    'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z',
  danger:  'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M12 3a9 9 0 100 18 9 9 0 000-18z',
  lock:    'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
}

// ─── Alert ────────────────────────────────────────────────────
export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: React.ReactNode
  className?: string
  onDismiss?: () => void
}

const ALERT_CLASS: Record<AlertVariant, string> = {
  info:    'alert alert-info',
  success: 'alert alert-success',
  warning: 'alert alert-warning',
  danger:  'alert alert-danger',
}

export function Alert({ variant = 'info', title, children, className, onDismiss }: AlertProps) {
  const isError = variant === 'danger' || variant === 'warning'
  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      className={cn(ALERT_CLASS[variant], className)}
    >
      <Icon d={ICONS[variant]} />
      <div style={{ flex: 1 }}>
        {title && (
          <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{title}</p>
        )}
        <div>{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="btn-icon"
          aria-label="Dismiss"
          style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  )
}

// ─── TrustSignal — spec §4.2 ─────────────────────────────────
export interface TrustSignalProps {
  message?: string
  className?: string
}

export function TrustSignal({
  message = 'End-to-end encrypted. Protected by VNSIR NDA protocols.',
  className,
}: TrustSignalProps) {
  return (
    <p className={cn('trust-signal', className)}>
      <Icon d={ICONS.lock} />
      <span>{message}</span>
    </p>
  )
}

// ─── Toast ────────────────────────────────────────────────────
export interface ToastItem {
  id: string
  message: string
  variant?: AlertVariant
}

export interface ToastProps {
  toast: ToastItem
  onDismiss: (id: string) => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const borderColors: Record<AlertVariant, string> = {
    info:    'var(--color-vnsir-navy)',
    success: 'var(--color-vnsir-success)',
    warning: 'var(--color-vnsir-warning)',
    danger:  'var(--color-vnsir-danger)',
  }

  const variant = toast.variant ?? 'info'

  return (
    <div
      className="toast"
      role="alert"
      aria-live="polite"
      style={{ borderLeftColor: borderColors[variant] }}
    >
      <Icon d={ICONS[variant]} style={{ color: borderColors[variant] } as React.CSSProperties} />
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="btn-icon"
        aria-label="Dismiss notification"
        style={{ color: 'rgba(255,255,255,0.6)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}) {
  return (
    <div
      className="toast-container"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
