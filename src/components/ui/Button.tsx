/**
 * Button — VNSIR UI Component
 *
 * Design spec:
 *  - Primary: Navy fill (#1B2A4A) — WCAG ratio vs white 11.8:1 AAA
 *  - Secondary: Black fill (#0A0A0A) — WCAG ratio vs white 19.6:1 AAA
 *  - Ghost: Navy outline, transparent fill
 *  - CTA: Premium variant for "Request a Confidential Proposal" (spec §4.1)
 *  - All variants disabled-state at opacity 0.45 with pointer-events: none
 *
 * Accessibility:
 *  - Native <button> element (keyboard navigable)
 *  - aria-disabled support
 *  - aria-busy spinner state
 *  - Visible focus ring: 3px offset outline
 */

import React from 'react'
import { cn } from '@/lib/cn'

// ─── Types ───────────────────────────────────────────────────
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'ghost-light' | 'danger' | 'cta'
export type ButtonSize    = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Show spinner and set aria-busy */
  loading?: boolean
  /** Renders as icon-only button (square, equal padding) */
  iconOnly?: boolean
  /** Polymorphic — renders an <a> tag when href is provided */
  href?: string
  /** target for <a> tag */
  target?: string
  /** rel for <a> tag */
  rel?: string
}

// ─── Variant class map ────────────────────────────────────────
const variantClasses: Record<ButtonVariant, string> = {
  primary:      'btn btn-primary',
  secondary:    'btn btn-secondary',
  ghost:        'btn btn-ghost',
  'ghost-light':'btn btn-ghost-light',
  danger:       'btn btn-danger',
  cta:          'btn btn-cta',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

// ─── Spinner ──────────────────────────────────────────────────
function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

// ─── Component ───────────────────────────────────────────────
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size    = 'md',
      loading = false,
      iconOnly = false,
      href,
      target,
      rel,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading
    const classes = cn(
      variantClasses[variant],
      sizeClasses[size],
      iconOnly && 'btn-icon',
      className
    )

    const content = (
      <>
        {loading && <Spinner />}
        {children}
      </>
    )

    // Polymorphic: render <a> when href provided
    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
          className={classes}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : undefined}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        {...props}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'
