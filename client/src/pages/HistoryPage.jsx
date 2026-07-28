/**
 * pages/HistoryPage.jsx — Email History Page
 *
 * Shows the user's past generated emails in a grid of cards.
 * Features:
 *  - Paginated API fetch
 *  - Skeleton loading state
 *  - Empty state illustration
 *  - Delete with optimistic UI update
 *  - Search/filter by tone (client-side)
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../api'
import Navbar from '../components/Navbar'
import HistoryCard from '../components/HistoryCard'

const TONES = ['All', 'Formal', 'Friendly', 'Persuasive', 'Apologetic', 'Urgent', 'Casual']

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="card">
      <div className="shimmer h-4 w-1/3 rounded mb-3" />
      <div className="shimmer h-5 w-3/4 rounded mb-2" />
      <div className="shimmer h-3 w-1/2 rounded mb-4" />
      <div className="flex gap-2">
        <div className="shimmer h-3 w-16 rounded" />
        <div className="shimmer h-3 w-12 rounded" />
      </div>
    </div>
  )
}

const pageVariants = {
  initial:  { opacity: 0, y: 20 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit:     { opacity: 0, y: -20, transition: { duration: 0.2 } },
}

export default function HistoryPage() {
  const [emails,     setEmails]     = useState([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [error,      setError]      = useState('')
  const [filterTone, setFilterTone] = useState('All')
  const [total,      setTotal]      = useState(0)

  // ── Fetch history ────────────────────────────────────────────────────
  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await api.get('/history?limit=50')
      setEmails(res.data.emails)
      setTotal(res.data.pagination.total)
    } catch (err) {
      setError('Failed to load email history. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  // ── Delete email ─────────────────────────────────────────────────────
  async function handleDelete(id) {
    // Optimistic update: remove from UI immediately
    setEmails(prev => prev.filter(e => e.id !== id))
    setTotal(t => t - 1)

    try {
      await api.delete(`/history/${id}`)
      toast.success('Email deleted.')
    } catch {
      // Roll back on failure
      toast.error('Failed to delete. Please try again.')
      fetchHistory()
    }
  }

  // ── Client-side filter by tone ────────────────────────────────────────
  const filteredEmails = filterTone === 'All'
    ? emails
    : emails.filter(e => e.tone === filterTone)

  return (
    <div className="app-bg">
      <Navbar />

      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10"
      >
        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
              📚 Email History
            </h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {total > 0 ? `${total} email${total !== 1 ? 's' : ''} generated` : 'No emails yet'}
            </p>
          </div>

          <Link to="/generate">
            <motion.div
              className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              + New Email
            </motion.div>
          </Link>
        </div>

        {/* ── Tone Filter Pills ──────────────────────────────────────── */}
        {!isLoading && emails.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {TONES.map(tone => (
              <motion.button
                key={tone}
                id={`filter-${tone.toLowerCase()}`}
                onClick={() => setFilterTone(tone)}
                className="text-xs font-medium px-3 py-1.5 rounded-full transition-all"
                style={{
                  background: filterTone === tone ? 'rgba(99,102,241,0.2)' : 'var(--color-surface-2)',
                  border: `1px solid ${filterTone === tone ? 'rgba(99,102,241,0.4)' : 'var(--color-border)'}`,
                  color: filterTone === tone ? '#818cf8' : 'var(--color-text-muted)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tone}
              </motion.button>
            ))}
          </div>
        )}

        {/* ── Content ────────────────────────────────────────────────── */}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">😕</p>
            <p className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>{error}</p>
            <button onClick={fetchHistory} className="btn-secondary mt-4 text-sm">Retry</button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && emails.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-16"
          >
            <div className="text-6xl mb-4">✉️</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              No emails yet
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
              Generate your first email and it'll appear here.
            </p>
            <Link to="/generate">
              <motion.div
                className="btn-primary inline-flex px-6 py-3 text-sm"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Generate First Email
              </motion.div>
            </Link>
          </motion.div>
        )}

        {/* No results after filtering */}
        {!isLoading && !error && emails.length > 0 && filteredEmails.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-10"
          >
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              No <span className="font-semibold text-indigo-400">{filterTone}</span> emails found.
            </p>
            <button onClick={() => setFilterTone('All')}
              className="text-xs text-indigo-400 hover:text-indigo-300 mt-2 transition-colors">
              Clear filter
            </button>
          </motion.div>
        )}

        {/* Email cards grid */}
        {!isLoading && !error && filteredEmails.length > 0 && (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredEmails.map(email => (
                <HistoryCard
                  key={email.id}
                  email={email}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.main>
    </div>
  )
}
