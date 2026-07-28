/**
 * components/LoadingAnimation.jsx — AI Generation Loading State
 *
 * Shown while the AI is generating an email.
 * Features animated dots, a gradient spinner, and pulsing status text
 * to give the user visual feedback that work is happening.
 */

import React from 'react'
import { motion } from 'framer-motion'

// Animated dot component — each dot bounces with an offset delay
const BounceDot = ({ delay }) => (
  <motion.div
    className="w-2 h-2 rounded-full"
    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 0.6, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
)

export default function LoadingAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="card flex flex-col items-center justify-center py-16 text-center"
    >
      {/* Pulsing gradient ring */}
      <motion.div
        className="relative w-20 h-20 mb-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #6366f1, #8b5cf6, #22d3ee, transparent)',
            borderRadius: '50%',
          }}
        />
        <div className="absolute inset-1 rounded-full"
          style={{ background: 'var(--color-surface)' }}
        />
        {/* Mail icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M22 7l-10 7L2 7"/>
          </svg>
        </div>
      </motion.div>

      {/* Bouncing dots */}
      <div className="flex items-center gap-2 mb-4">
        <BounceDot delay={0} />
        <BounceDot delay={0.15} />
        <BounceDot delay={0.3} />
      </div>

      <p className="font-semibold text-lg mb-1" style={{ color: 'var(--color-text)' }}>
        Crafting your email...
      </p>
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        AI is writing a personalised email for you
      </p>
    </motion.div>
  )
}
