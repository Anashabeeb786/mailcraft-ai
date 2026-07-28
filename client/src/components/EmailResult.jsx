/**
 * components/EmailResult.jsx — Generated Email Display
 *
 * Shows the AI-generated email with:
 *  - Animated success entrance
 *  - Subject line display
 *  - Formatted body with copy button
 *  - PDF export button
 *  - "Generate Another" reset button
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { exportEmailAsPDF } from '../utils/pdfExport'

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const PDFIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
)

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.87"/>
  </svg>
)

export default function EmailResult({ email, onReset }) {
  const [copied, setCopied] = useState(false)

  // ── Copy full email to clipboard ───────────────────────────────────────
  async function handleCopy() {
    const fullText = `Subject: ${email.subject}\n\n${email.body}`
    try {
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      toast.success('Email copied to clipboard!')
      // Reset the checkmark after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy. Please select and copy manually.')
    }
  }

  // ── Export as PDF ───────────────────────────────────────────────────────
  function handlePDFExport() {
    try {
      exportEmailAsPDF(email)
      toast.success('PDF downloaded!')
    } catch {
      toast.error('PDF export failed. Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-4"
    >
      {/* ── Success Banner ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="flex items-center gap-3 p-4 rounded-xl border"
        style={{
          background: 'rgba(16,185,129,0.08)',
          borderColor: 'rgba(16,185,129,0.25)',
        }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
             style={{ background: 'rgba(16,185,129,0.2)' }}>
          <CheckIcon />
        </div>
        <div>
          <p className="font-semibold text-sm" style={{ color: '#10b981' }}>Email Generated!</p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Your AI-crafted email is ready to use.
          </p>
        </div>
      </motion.div>

      {/* ── Subject Line ───────────────────────────────────────────────── */}
      <div className="card">
        <p className="form-label mb-1">Subject Line</p>
        <p className="font-semibold text-base" style={{ color: 'var(--color-text)' }}>
          {email.subject}
        </p>
      </div>

      {/* ── Email Body ─────────────────────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <p className="form-label mb-0">Email Body</p>
          <div className="flex items-center gap-2">
            {/* PDF Export */}
            <motion.button
              id="pdf-export-btn"
              onClick={handlePDFExport}
              className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <PDFIcon /> Export PDF
            </motion.button>

            {/* Copy Button */}
            <motion.button
              id="copy-email-btn"
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg transition-all"
              style={{
                background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.12)',
                border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.25)'}`,
                color: copied ? '#10b981' : '#818cf8',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {copied ? <><CheckIcon /> Copied!</> : <><CopyIcon /> Copy</>}
            </motion.button>
          </div>
        </div>

        {/* Email body — white-space-pre-wrap to preserve line breaks */}
        <div
          id="email-body-content"
          className="p-4 rounded-xl text-sm leading-7"
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
      </div>

      {/* ── Generate Another ───────────────────────────────────────────── */}
      <motion.button
        id="generate-another-btn"
        onClick={onReset}
        className="btn-secondary w-full flex items-center justify-center gap-2 py-3"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <RefreshIcon /> Generate Another Email
      </motion.button>
    </motion.div>
  )
}
