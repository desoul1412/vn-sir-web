/**
 * Input — VNSIR Form Elements
 *
 * Components exported:
 *  - Input       — text/email/password/number
 *  - Select      — dropdown with chevron icon
 *  - Textarea    — resizable text area
 *  - FormGroup   — label + input + helper/error wrapper
 *
 * Design spec:
 *  - Labels: xs, 600-weight, ALL-CAPS, wide letter-spacing
 *  - Border: 1px #E2E8F0 default → navy on focus
 *  - Focus ring: 3px navy/12% opacity
 *  - Error state: danger border + red helper text
 *  - Corporate email regex validation per spec §3.3
 *
 * Accessibility:
 *  - htmlFor / id linkage enforced via FormGroup
 *  - aria-invalid on error state
 *  - aria-describedby links to helper/error text
 *  - Required fields surface aria-required
 */

import React from 'react'
import { cn } from '@/lib/cn'

// ─── Input ───────────────────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => (
    <input
      ref={ref}
      className={cn('form-input', hasError && 'form-input-error', className)}
      aria-invalid={hasError}
      {...props}
    />
  )
)
Input.displayName = 'Input'

// ─── Select ──────────────────────────────────────────────────
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError, placeholder, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn('form-input form-select', hasError && 'form-input-error', className)}
      aria-invalid={hasError}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  )
)
Select.displayName = 'Select'

// ─── Textarea ─────────────────────────────────────────────────
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn('form-input form-textarea', hasError && 'form-input-error', className)}
      aria-invalid={hasError}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'

// ─── FormGroup ───────────────────────────────────────────────
export interface FormGroupProps {
  id: string
  label: string
  required?: boolean
  error?: string
  helper?: string
  className?: string
  children: React.ReactNode
}

export function FormGroup({
  id,
  label,
  required,
  error,
  helper,
  className,
  children,
}: FormGroupProps) {
  const helperId = `${id}-helper`
  const errorId  = `${id}-error`

  // Clone child to inject id + aria-describedby
  const child = React.Children.only(children) as React.ReactElement<{
    id?: string
    'aria-describedby'?: string
    'aria-required'?: boolean
    required?: boolean
  }>

  const describedBy = [
    error  ? errorId  : null,
    helper ? helperId : null,
  ].filter(Boolean).join(' ') || undefined

  const cloned = React.cloneElement(child, {
    id,
    'aria-describedby': describedBy,
    'aria-required':    required,
    required,
  })

  return (
    <div className={cn('form-group', className)}>
      <label
        htmlFor={id}
        className={cn('form-label', required && 'form-label-required')}
      >
        {label}
      </label>
      {cloned}
      {error && (
        <span id={errorId} className="form-error-text" role="alert">
          {error}
        </span>
      )}
      {!error && helper && (
        <span id={helperId} className="form-helper">
          {helper}
        </span>
      )}
    </div>
  )
}

// ─── Corporate email validator — spec §3.3 ──────────────────
const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'aol.com', 'icloud.com', 'protonmail.com', 'mail.com',
  'ymail.com', 'live.com', 'msn.com',
])

export function isCorporateEmail(email: string): boolean {
  const parts = email.toLowerCase().split('@')
  if (parts.length !== 2) return false
  const domain = parts[1]!
  return !FREE_EMAIL_DOMAINS.has(domain)
}

export function validateCorporateEmail(email: string): string | undefined {
  if (!email) return 'Corporate email is required'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Enter a valid email address'
  if (!isCorporateEmail(email)) return 'Personal email domains are not accepted. Please use your corporate email.'
  return undefined
}
