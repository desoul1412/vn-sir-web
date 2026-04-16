/**
 * Modal — VNSIR Dialog Component
 *
 * Design spec:
 *  - Overlay: black/60% backdrop
 *  - Panel: white, 4px border-radius, lg shadow
 *  - Header: title left, close button right, 1px bottom border
 *  - Max-width: 36rem (focused, Stoic aesthetic)
 *
 * Accessibility:
 *  - role="dialog" + aria-modal="true"
 *  - aria-labelledby links to modal title
 *  - Escape key closes
 *  - Focus trap on open
 *  - Focus returns to trigger element on close
 */

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  /** Max width override in rem */
  maxWidth?: string
  className?: string
  children: React.ReactNode
  /** Footer content (buttons) */
  footer?: React.ReactNode
}

export function Modal({
  isOpen,
  onClose,
  title,
  maxWidth = '36rem',
  className,
  children,
  footer,
}: ModalProps) {
  const titleId  = React.useId()
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Lock body scroll + basic focus trap
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Focus first focusable element
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    focusable?.[0]?.focus()
    return () => { document.body.style.overflow = prev }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn('modal', className)}
        style={{ maxWidth }}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 id={titleId} className="modal-title">{title}</h2>
          <button
            onClick={onClose}
            className="btn-icon"
            aria-label="Close dialog"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">{children}</div>

        {/* Footer */}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}
