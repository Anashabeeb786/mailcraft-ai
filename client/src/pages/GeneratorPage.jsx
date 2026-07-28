/**
 * pages/GeneratorPage.jsx — Main AI Email Generator Page
 *
 * Orchestrates the full generation flow:
 *  1. Shows EmailForm (idle state)
 *  2. Shows LoadingAnimation (generating state)
 *  3. Shows EmailResult (success state)
 *  4. Shows error state if AI call fails
 *
 * Uses AnimatePresence to smoothly transition between states.
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../api'
import Navbar from '../components/Navbar'
import EmailForm from '../components/EmailForm'
import EmailResult from '../components/EmailResult'
import LoadingAnimation from '../components/LoadingAnimation'

// Page-level state machine: 'idle' → 'loading' → 'success' | 'error'
const STATE = { IDLE: 'idle', LOADING: 'loading', SUCCESS: 'success', ERROR: 'error' }

const pageVariants = {
  initial:  { opacity: 0, y: 20 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit:     { opacity: 0, y: -20, transition: { duration: 0.2 } },
}

export default function GeneratorPage() {
  const [pageState,    setPageState]    = useState(STATE.IDLE)
  const [generatedEmail, setGeneratedEmail] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  /**
   * handleGenerate
   * Called when the EmailForm is submitted with valid data.
   * Makes the POST /api/email/generate request.
   */
  async function handleGenerate(formData) {
    setPageState(STATE.LOADING)
    setErrorMessage('')

    try {
      const res = await api.post('/email/generate', formData)
      setGeneratedEmail(res.data)
      setPageState(STATE.SUCCESS)
      toast.success('Email generated successfully!')
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to generate email. Please try again.'
      setErrorMessage(msg)
      setPageState(STATE.ERROR)
    }
  }

  // Reset back to the form
  function handleReset() {
    setPageState(STATE.IDLE)
    setGeneratedEmail(null)
    setErrorMessage('')
  }

  return (
    <div className="app-bg">
      <Navbar />

      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10"
      >
        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            ✉ Generate Email
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Fill in the details below and let AI craft your perfect email.
          </p>
        </div>

        {/* ── State Machine Content ────────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* Idle — show the form */}
          {pageState === STATE.IDLE && (
            <motion.div key="form"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="card">
                <EmailForm onSubmit={handleGenerate} isLoading={false} />
              </div>
            </motion.div>
          )}

          {/* Loading — show animated loader */}
          {pageState === STATE.LOADING && (
            <motion.div key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingAnimation />
            </motion.div>
          )}

          {/* Success — show the generated email */}
          {pageState === STATE.SUCCESS && generatedEmail && (
            <motion.div key="result"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmailResult email={generatedEmail} onReset={handleReset} />
            </motion.div>
          )}

          {/* Error — user-friendly error with retry option */}
          {pageState === STATE.ERROR && (
            <motion.div key="error"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="card text-center py-12"
            >
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                Generation Failed
              </h2>
              <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: 'var(--color-text-muted)' }}>
                {errorMessage}
              </p>
              <motion.button
                id="retry-btn"
                onClick={handleReset}
                className="btn-primary px-6 py-3"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Try Again
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.main>
    </div>
  )
}
