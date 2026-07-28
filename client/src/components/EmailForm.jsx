/**
 * components/EmailForm.jsx — Email Generation Form
 *
 * Collects all inputs needed for AI email generation:
 *  - Purpose (dropdown + custom input)
 *  - Recipient name + context/role
 *  - Tone selection (visual button grid)
 *  - Optional extra context
 *
 * Validates all fields client-side before submitting.
 * Calls onSubmit(formData) when validation passes.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'

// Predefined email purposes for the dropdown
const EMAIL_PURPOSES = [
  'Job Application',
  'Follow-up',
  'Meeting Request',
  'Thank You',
  'Resignation',
  'Complaint',
  'Sales Pitch',
  'Apology',
  'Introduction',
  'Recommendation Request',
  'Custom...',
]

// Tone options with emoji for visual differentiation
const TONES = [
  { value: 'Formal',      label: 'Formal',      emoji: '👔', desc: 'Professional & structured' },
  { value: 'Friendly',    label: 'Friendly',    emoji: '😊', desc: 'Warm & approachable' },
  { value: 'Persuasive',  label: 'Persuasive',  emoji: '💡', desc: 'Compelling & convincing' },
  { value: 'Apologetic',  label: 'Apologetic',  emoji: '🙏', desc: 'Sincere & remorseful' },
  { value: 'Urgent',      label: 'Urgent',      emoji: '⚡', desc: 'Time-sensitive & direct' },
  { value: 'Casual',      label: 'Casual',      emoji: '✌️', desc: 'Relaxed & conversational' },
]

export default function EmailForm({ onSubmit, isLoading }) {
  const [purpose,          setPurpose]          = useState('')
  const [customPurpose,    setCustomPurpose]    = useState('')
  const [recipientName,    setRecipientName]    = useState('')
  const [recipientContext, setRecipientContext] = useState('')
  const [tone,             setTone]             = useState('')
  const [extraContext,     setExtraContext]     = useState('')
  const [errors,           setErrors]           = useState({})

  const isCustomPurpose = purpose === 'Custom...'
  const effectivePurpose = isCustomPurpose ? customPurpose : purpose

  // ── Client-side Validation ─────────────────────────────────────────────
  function validate() {
    const newErrors = {}

    if (!effectivePurpose.trim()) {
      newErrors.purpose = 'Please select or enter an email purpose.'
    } else if (effectivePurpose.trim().length > 200) {
      newErrors.purpose = 'Purpose must be under 200 characters.'
    }

    if (!recipientName.trim()) {
      newErrors.recipientName = 'Recipient name is required.'
    } else if (recipientName.trim().length > 100) {
      newErrors.recipientName = 'Must be under 100 characters.'
    }

    if (!recipientContext.trim()) {
      newErrors.recipientContext = 'Recipient role/context is required.'
    } else if (recipientContext.trim().length > 200) {
      newErrors.recipientContext = 'Must be under 200 characters.'
    }

    if (!tone) {
      newErrors.tone = 'Please select a tone.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    onSubmit({
      purpose: effectivePurpose.trim(),
      recipientName: recipientName.trim(),
      recipientContext: recipientContext.trim(),
      tone,
      extraContext: extraContext.trim(),
    })
  }

  // Clear a specific field error when user starts typing
  function clearError(field) {
    if (errors[field]) {
      setErrors(prev => { const next = { ...prev }; delete next[field]; return next })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>

      {/* ── Email Purpose ──────────────────────────────────────────── */}
      <div>
        <label htmlFor="purpose-select" className="form-label">
          Email Purpose <span className="text-red-400">*</span>
        </label>
        <select
          id="purpose-select"
          className={`select-field ${errors.purpose ? 'error' : ''}`}
          value={purpose}
          onChange={e => { setPurpose(e.target.value); clearError('purpose') }}
          disabled={isLoading}
        >
          <option value="">Select a purpose...</option>
          {EMAIL_PURPOSES.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Custom purpose input — shown when 'Custom...' is selected */}
        {isCustomPurpose && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2">
            <input
              id="custom-purpose"
              type="text"
              className={`input-field ${errors.purpose ? 'error' : ''}`}
              placeholder="Describe the email purpose..."
              value={customPurpose}
              onChange={e => { setCustomPurpose(e.target.value); clearError('purpose') }}
              disabled={isLoading}
              maxLength={200}
            />
          </motion.div>
        )}

        {errors.purpose && (
          <p className="field-error">⚠ {errors.purpose}</p>
        )}
      </div>

      {/* ── Recipient Details ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="recipient-name" className="form-label">
            Recipient Name <span className="text-red-400">*</span>
          </label>
          <input
            id="recipient-name"
            type="text"
            className={`input-field ${errors.recipientName ? 'error' : ''}`}
            placeholder="e.g., Sarah Johnson"
            value={recipientName}
            onChange={e => { setRecipientName(e.target.value); clearError('recipientName') }}
            disabled={isLoading}
            maxLength={100}
          />
          {errors.recipientName && (
            <p className="field-error">⚠ {errors.recipientName}</p>
          )}
        </div>

        <div>
          <label htmlFor="recipient-context" className="form-label">
            Role / Relationship <span className="text-red-400">*</span>
          </label>
          <input
            id="recipient-context"
            type="text"
            className={`input-field ${errors.recipientContext ? 'error' : ''}`}
            placeholder="e.g., Hiring Manager, Professor"
            value={recipientContext}
            onChange={e => { setRecipientContext(e.target.value); clearError('recipientContext') }}
            disabled={isLoading}
            maxLength={200}
          />
          {errors.recipientContext && (
            <p className="field-error">⚠ {errors.recipientContext}</p>
          )}
        </div>
      </div>

      {/* ── Tone Selection ────────────────────────────────────────── */}
      <div>
        <label className="form-label">
          Tone <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TONES.map(t => (
            <motion.button
              key={t.value}
              type="button"
              id={`tone-${t.value.toLowerCase()}`}
              onClick={() => { setTone(t.value); clearError('tone') }}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-xl text-left transition-all duration-200 border ${
                tone === t.value
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-transparent hover:border-indigo-500/30'
              }`}
              style={{ background: tone === t.value ? 'rgba(99,102,241,0.12)' : 'var(--color-surface-2)' }}
            >
              <div className="text-xl mb-1">{t.emoji}</div>
              <div className="text-sm font-semibold" style={{ color: tone === t.value ? '#818cf8' : 'var(--color-text)' }}>
                {t.label}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                {t.desc}
              </div>
            </motion.button>
          ))}
        </div>
        {errors.tone && (
          <p className="field-error mt-2">⚠ {errors.tone}</p>
        )}
      </div>

      {/* ── Extra Context (Optional) ──────────────────────────────── */}
      <div>
        <label htmlFor="extra-context" className="form-label">
          Additional Context <span className="text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id="extra-context"
          className="input-field resize-none"
          placeholder="Any specific points to include, background info, or special requests..."
          rows={3}
          value={extraContext}
          onChange={e => setExtraContext(e.target.value)}
          disabled={isLoading}
          maxLength={500}
        />
        <p className="text-xs mt-1 text-right" style={{ color: 'var(--color-text-muted)' }}>
          {extraContext.length}/500
        </p>
      </div>

      {/* ── Submit Button ─────────────────────────────────────────── */}
      <motion.button
        id="generate-btn"
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
        whileHover={{ scale: isLoading ? 1 : 1.01 }}
        whileTap={{ scale: isLoading ? 1 : 0.99 }}
      >
        {isLoading ? (
          <>
            <div className="spinner w-5 h-5" />
            Generating...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
            Generate Email
          </>
        )}
      </motion.button>
    </form>
  )
}
