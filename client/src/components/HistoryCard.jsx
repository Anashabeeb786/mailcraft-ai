/**
 * components/HistoryCard.jsx — Email History Entry Card
 *
 * Displays a single past email with:
 *  - Tone badge + purpose label
 *  - Subject line
 *  - Recipient info
 *  - Timestamp
 *  - Expand/collapse to see full body
 *  - Delete button with confirmation
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TONE_COLORS = {
  Formal:     { bg: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.3)',  text: '#818cf8' },
  Friendly:   { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
  Persuasive: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24' },
  Apologetic: { bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.3)',  text: '#fb7185' },
  Urgent:     { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  text: '#f87171' },
  Casual:     { bg: 'rgba(34,211,238,0.12)', border: 'rgba(34,211,238,0.3)', text: '#22d3ee' },
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function HistoryCard({ email, onDelete }) {
  const [expanded,        setExpanded]        = useState(false)
  const [confirmDelete,   setConfirmDelete]   = useState(false)
  const [copied,          setCopied]          = useState(false)

  const toneStyle = TONE_COLORS[email.tone] || TONE_COLORS.Formal

  async function handleCopy() {
    const fullText = `Subject: ${email.subject}\n\n${email.body}`
    await navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card"
    >
      {/* ── Card Header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          {/* Tone badge + purpose */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: toneStyle.bg, border: `1px solid ${toneStyle.border}`, color: toneStyle.text }}
            >
              {email.tone}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {email.purpose}
            </span>
          </div>

          {/* Subject */}
          <h3 className="font-semibold text-sm leading-snug truncate" style={{ color: 'var(--color-text)' }}>
            {email.subject}
          </h3>

          {/* Recipient */}
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            To: <span className="font-medium">{email.recipient_name}</span>
            {email.recipient_context && ` · ${email.recipient_context}`}
          </p>
        </div>

        {/* Timestamp */}
        <p className="text-xs flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>
          {formatDate(email.created_at)}
        </p>
      </div>

      {/* ── Expandable Body ───────────────────────────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="p-3 rounded-xl text-sm leading-6 mb-3"
              style={{
                background: 'var(--color-surface-2)',
                color: 'var(--color-text)',
                whiteSpace: 'pre-wrap',
                fontFamily: 'Georgia, serif',
                border: '1px solid var(--color-border)',
              }}
            >
              {email.body}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Action Buttons ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
        {/* Expand/Collapse */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-xs font-medium transition-colors hover:text-indigo-400"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {expanded ? '▲ Collapse' : '▼ View Email'}
        </button>

        <span className="text-xs" style={{ color: 'var(--color-border)' }}>·</span>

        {/* Copy */}
        <button
          onClick={handleCopy}
          className="text-xs font-medium transition-colors hover:text-indigo-400"
          style={{ color: copied ? '#10b981' : 'var(--color-text-muted)' }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>

        <div className="flex-1" />

        {/* Delete with confirm */}
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Delete?</span>
            <button
              onClick={() => onDelete(email.id)}
              className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs font-medium hover:text-white transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-xs font-medium text-red-400/60 hover:text-red-400 transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </motion.div>
  )
}
