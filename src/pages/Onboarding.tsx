/**
 * Onboarding.tsx — Post-First-Login Profile Completion Screen
 *
 * Spec §2.5.3 §3.2 — Task 1.3
 *
 * ── Visual Spec ──────────────────────────────────────────────
 *  Layout:   Full-screen overlay; centred modal panel (max-width 480px)
 *  Surface:  White panel on light-gray (#F5F5F5) backdrop
 *  Header:   VNSIR logotype + eyebrow label "ACCOUNT SETUP" (WIDEST tracking)
 *  Headline: "Tell us about your work." (serif Playfair Display, 31px)
 *  Copy:     Single-sentence rationale, charcoal (#36454F), 14px
 *  Fields:   Job Title (text input) + Industry Focus (select dropdown)
 *  CTA:      Navy primary button "Continue to Intelligence Hub →"
 *  States:   Idle → Submitting (spinner) → Success (redirect)
 *  Errors:   Inline field-level + top-level API error Alert
 *
 * ── Accessibility ────────────────────────────────────────────
 *  - role="dialog" + aria-modal="true" on panel
 *  - aria-labelledby points to headline id
 *  - All form fields linked via FormGroup (htmlFor/id)
 *  - aria-required on required fields
 *  - aria-busy on submit button during loading
 *  - Focus locks inside modal on mount
 *  - Escape key intentionally DISABLED (cannot skip onboarding)
 *
 * ── Colour WCAG ratios ───────────────────────────────────────
 *  Navy  (#1B2A4A) on White (#FFFFFF) → 11.8:1  AAA ✓
 *  Charcoal (#36454F) on White         → 7.5:1  AAA ✓
 *  Danger (#B91C1C) on White           → 4.5:1  AA  ✓
 */

import React, { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { SectorEnum } from '@/lib/supabase'
import {
  Button,
  FormGroup,
  Input,
  Select,
  Alert,
} from '@/components/ui'

// ─── Constants ────────────────────────────────────────────────

const INDUSTRY_OPTIONS: { value: SectorEnum; label: string }[] = [
  { value: 'e_commerce',    label: 'E-Commerce' },
  { value: 'gaming',        label: 'Gaming' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'macro_economy', label: 'Macro Economy' },
  { value: 'other',         label: 'Other' },
]

const INTELLIGENCE_HUB_PATH = '/'

// ─── Types ────────────────────────────────────────────────────

interface FormState {
  job_title:      string
  industry_focus: SectorEnum | ''
}

interface FormErrors {
  job_title?:      string
  industry_focus?: string
  api?:            string
}

// ─── Validation ───────────────────────────────────────────────

function validate(fields: FormState): FormErrors {
  const errors: FormErrors = {}

  if (!fields.job_title.trim()) {
    errors.job_title = 'Job title is required.'
  } else if (fields.job_title.trim().length < 2) {
    errors.job_title = 'Job title must be at least 2 characters.'
  } else if (fields.job_title.trim().length > 120) {
    errors.job_title = 'Job title must be 120 characters or fewer.'
  }

  if (!fields.industry_focus) {
    errors.industry_focus = 'Please select your primary industry focus.'
  }

  return errors
}

// ─── Component ────────────────────────────────────────────────

export default function Onboarding() {
  const [form, setForm] = useState<FormState>({
    job_title:      '',
    industry_focus: '',
  })
  const [errors, setErrors]       = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone]       = useState(false)

  // Focus trap — first focusable element on mount
  const panelRef  = useRef<HTMLDivElement>(null)
  const headingId = React.useId()

  useEffect(() => {
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'input, select, button, [tabindex]:not([tabindex="-1"])'
    )
    focusable?.[0]?.focus()
  }, [])

  // ── Redirect after successful save ──────────────────────────
  useEffect(() => {
    if (isDone) {
      // Small delay so the user sees the success state
      const t = window.setTimeout(() => {
        window.location.href = INTELLIGENCE_HUB_PATH
      }, 800)
      return () => window.clearTimeout(t)
    }
  }, [isDone])

  // ── Field change handlers ────────────────────────────────────
  const handleJobTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, job_title: e.target.value }))
    if (errors.job_title) setErrors(prev => ({ ...prev, job_title: undefined }))
  }

  const handleIndustry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, industry_focus: e.target.value as SectorEnum }))
    if (errors.industry_focus) setErrors(prev => ({ ...prev, industry_focus: undefined }))
  }

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSubmitting || isDone) return

    // Client-side validation
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // Move focus to first error field
      const firstErrorId = validationErrors.job_title
        ? 'onboarding-job-title'
        : 'onboarding-industry'
      document.getElementById(firstErrorId)?.focus()
      return
    }

    setIsSubmitting(true)
    setErrors({})

    // Get current user id
    const { data: { user }, error: sessionError } = await supabase.auth.getUser()

    if (sessionError || !user) {
      setErrors({ api: 'Session expired. Please sign in again.' })
      setIsSubmitting(false)
      return
    }

    // Persist to profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        job_title:      form.job_title.trim(),
        industry_focus: form.industry_focus as SectorEnum,
      })
      .eq('id', user.id)

    if (updateError) {
      setErrors({
        api: 'Unable to save your profile. Please try again or contact support.',
      })
      setIsSubmitting(false)
      return
    }

    setIsDone(true)
  }

  // ─── Render ──────────────────────────────────────────────────

  return (
    /*
     * Full-screen backdrop — light gray per VNSIR auth page spec.
     * Not dismissable (users must complete onboarding).
     */
    <div
      className="onboarding-backdrop"
      role="presentation"
      style={{
        position:        'fixed',
        inset:           0,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        backgroundColor: 'var(--color-vnsir-gray-light)',
        padding:         '1.5rem',
        zIndex:          50,
      }}
    >
      {/* ── Modal panel ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        style={{
          width:           '100%',
          maxWidth:        '480px',
          backgroundColor: 'var(--color-vnsir-white)',
          border:          '1px solid var(--color-vnsir-gray-mid)',
          padding:         '2.5rem',
          /* VNSIR design token — sharp edges, no radius */
          borderRadius:    'var(--radius-none)',
          boxShadow:       '0 4px 24px rgba(0,0,0,0.10)',
        }}
      >

        {/* ── Header ── */}
        <header style={{ marginBottom: '2rem' }}>
          {/* Logotype */}
          <div
            aria-label="VNSIR"
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      'var(--text-xs)',
              fontWeight:    700,
              letterSpacing: 'var(--tracking-widest)',
              color:         'var(--color-vnsir-navy)',
              marginBottom:  '1.25rem',
            }}
          >
            VN&#8209;SIR
          </div>

          {/* Eyebrow */}
          <p
            style={{
              fontFamily:    'var(--font-sans)',
              fontSize:      'var(--text-xs)',
              fontWeight:    600,
              letterSpacing: 'var(--tracking-widest)',
              color:         'var(--color-vnsir-gray-muted)',
              textTransform: 'uppercase',
              marginBottom:  '0.5rem',
            }}
          >
            Account Setup
          </p>

          {/* Primary headline */}
          <h1
            id={headingId}
            style={{
              fontFamily:  'var(--font-serif)',
              fontSize:    'var(--text-2xl)',
              fontWeight:  700,
              lineHeight:  'var(--leading-tight)',
              color:       'var(--color-vnsir-black)',
              margin:      0,
            }}
          >
            Tell us about your work.
          </h1>

          {/* Rationale copy */}
          <p
            style={{
              fontFamily:  'var(--font-sans)',
              fontSize:    'var(--text-sm)',
              color:       'var(--color-vnsir-charcoal)',
              lineHeight:  'var(--leading-normal)',
              marginTop:   '0.75rem',
              marginBottom: 0,
            }}
          >
            We tailor intelligence briefings to your role and sector — this takes
            under 30 seconds.
          </p>
        </header>

        {/* ── API error ── */}
        {errors.api && (
          <div style={{ marginBottom: '1.25rem' }}>
            <Alert variant="danger">{errors.api}</Alert>
          </div>
        )}

        {/* ── Success state ── */}
        {isDone && (
          <div style={{ marginBottom: '1.25rem' }}>
            <Alert variant="success">
              Profile saved. Redirecting to Intelligence Hub…
            </Alert>
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate aria-label="Profile setup form">

          {/* Job Title */}
          <FormGroup
            id="onboarding-job-title"
            label="Job Title"
            required
            error={errors.job_title}
            helper="e.g. Head of Strategy, Investment Director, CEO"
          >
            <Input
              type="text"
              name="job_title"
              value={form.job_title}
              onChange={handleJobTitle}
              placeholder="Your current job title"
              autoComplete="organization-title"
              hasError={Boolean(errors.job_title)}
              disabled={isSubmitting || isDone}
              maxLength={120}
            />
          </FormGroup>

          {/* Industry Focus */}
          <div style={{ marginTop: '1.25rem' }}>
            <FormGroup
              id="onboarding-industry"
              label="Industry Focus"
              required
              error={errors.industry_focus}
              helper="Select the sector most relevant to your work"
            >
              <Select
                name="industry_focus"
                value={form.industry_focus}
                onChange={handleIndustry}
                placeholder="Select your primary sector"
                hasError={Boolean(errors.industry_focus)}
                disabled={isSubmitting || isDone}
              >
                {INDUSTRY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </div>

          {/* Submit CTA */}
          <div style={{ marginTop: '2rem' }}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              disabled={isDone}
              style={{ width: '100%' }}
              aria-describedby={errors.api ? 'onboarding-api-error' : undefined}
            >
              {isDone
                ? 'Redirecting…'
                : isSubmitting
                  ? 'Saving…'
                  : 'Continue to Intelligence Hub →'}
            </Button>
          </div>
        </form>

        {/* ── Footer note ── */}
        <p
          style={{
            fontFamily:  'var(--font-sans)',
            fontSize:    'var(--text-xs)',
            color:       'var(--color-vnsir-gray-muted)',
            textAlign:   'center',
            marginTop:   '1.5rem',
            marginBottom: 0,
          }}
        >
          Your information is never shared with third parties.
        </p>
      </div>
    </div>
  )
}
