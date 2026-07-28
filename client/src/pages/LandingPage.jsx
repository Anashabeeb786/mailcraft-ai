/**
 * pages/LandingPage.jsx — Public Landing / Hero Page
 *
 * First impression page with:
 *  - Hero section with animated headline + CTA
 *  - Features grid
 *  - Social proof / how-it-works section
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden:   { opacity: 0, y: 30 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const FEATURES = [
  {
    emoji: '🎯',
    title: 'Purpose-Driven',
    desc: 'Choose from job applications, follow-ups, complaints, meeting requests, and more — or describe any custom need.',
  },
  {
    emoji: '🎨',
    title: '6 Tone Modes',
    desc: 'Formal, Friendly, Persuasive, Apologetic, Urgent, or Casual — the AI adapts vocabulary and structure to your tone.',
  },
  {
    emoji: '⚡',
    title: 'Instant Generation',
    desc: 'Powered by NVIDIA\'s LLaMA 3.1 — enterprise-grade AI that produces ready-to-send emails in seconds.',
  },
  {
    emoji: '📋',
    title: 'One-Click Copy',
    desc: 'Copy the full email to your clipboard instantly or export as a branded PDF document.',
  },
  {
    emoji: '🔒',
    title: 'Secure & Private',
    desc: 'JWT-based authentication, bcrypt passwords, and server-side AI calls — your data never leaves our server.',
  },
  {
    emoji: '📚',
    title: 'Email History',
    desc: 'Every email you generate is saved to your account. Revisit, copy, and manage your past emails anytime.',
  },
]

const STEPS = [
  { step: '01', title: 'Create Account',    desc: 'Sign up in seconds — just your name, email, and password.' },
  { step: '02', title: 'Describe Your Need',desc: 'Pick a purpose, set the recipient, and choose a tone.' },
  { step: '03', title: 'AI Generates',      desc: 'Our LLM crafts a complete, professional email in under 5 seconds.' },
  { step: '04', title: 'Copy & Send',       desc: 'Copy to clipboard or export as PDF — ready to send immediately.' },
]

export default function LandingPage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="app-bg">
      <Navbar />

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.3)',
                color: '#818cf8',
              }}>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Powered by NVIDIA NIM · LLaMA 3.1 8B
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
            <span style={{ color: 'var(--color-text)' }}>Write Professional</span>
            <br />
            <span className="gradient-text">Emails with AI</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p variants={itemVariants} className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-muted)' }}>
            MailCraft AI generates perfectly-crafted, context-aware emails in seconds.
            Job applications, follow-ups, complaints — any purpose, any tone.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to={isAuthenticated ? '/generate' : '/signup'}
              id="hero-cta-primary"
            >
              <motion.div
                className="btn-primary px-8 py-4 text-base animate-glow-pulse"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {isAuthenticated ? '✉ Generate an Email' : 'Start for Free →'}
              </motion.div>
            </Link>
            {!isAuthenticated && (
              <Link to="/login" id="hero-cta-login">
                <motion.div
                  className="btn-secondary px-8 py-4 text-base"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Log In
                </motion.div>
              </Link>
            )}
          </motion.div>

          {/* Social proof stat row */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-8 pt-4 text-sm"
            style={{ color: 'var(--color-text-muted)' }}>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold gradient-text">6</span> Tone Modes
            </div>
            <div className="w-px h-4" style={{ background: 'var(--color-border)' }} />
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold gradient-text">∞</span> Email Types
            </div>
            <div className="w-px h-4" style={{ background: 'var(--color-border)' }} />
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold gradient-text">&lt;5s</span> Generation
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features Grid ──────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
            Everything you need to communicate better
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Built for professionals, students, and anyone who wants to write great emails.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--color-text)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>How it works</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.step}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {s.step}
              </div>
              <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--color-text)' }}>{s.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Footer ─────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-2xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="card-glass p-10"
        >
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
            Ready to write better emails?
          </h2>
          <p className="mb-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Create a free account and generate your first email in under a minute.
          </p>
          <Link to={isAuthenticated ? '/generate' : '/signup'} id="footer-cta">
            <motion.div
              className="btn-primary inline-flex px-8 py-3.5 text-base"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              {isAuthenticated ? 'Go to Generator' : 'Get Started — Free'}
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t text-center py-6 text-xs"
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
        MailCraft AI · Built for the Internship Innovation Challenge · Powered by NVIDIA NIM
      </footer>
    </div>
  )
}
