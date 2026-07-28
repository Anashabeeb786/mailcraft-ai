/**
 * pages/SignupPage.jsx — User Registration Page
 *
 * Features:
 *  - Name + email + password + confirm-password form
 *  - Password strength indicator
 *  - Inline field validation
 *  - Redirects to /generate on successful registration
 */

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const pageVariants = {
  initial:  { opacity: 0, y: 20 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit:     { opacity: 0, y: -20, transition: { duration: 0.2 } },
}

// Simple password strength calculator
function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: '' }
  let score = 0
  if (pwd.length >= 8)            score++
  if (/[A-Z]/.test(pwd))         score++
  if (/[0-9]/.test(pwd))         score++
  if (/[^A-Za-z0-9]/.test(pwd))  score++
  const map = [
    { label: '',         color: 'transparent' },
    { label: 'Weak',     color: '#f43f5e' },
    { label: 'Fair',     color: '#f59e0b' },
    { label: 'Good',     color: '#3b82f6' },
    { label: 'Strong',   color: '#10b981' },
  ]
  return { score, ...map[score] }
}

export default function SignupPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [errors,    setErrors]    = useState({})
  const [apiError,  setApiError]  = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPass,  setShowPass]  = useState(false)

  const strength = getPasswordStrength(password)

  function validate() {
    const errs = {}
    if (!name.trim() || name.trim().length < 2) errs.name = 'Name must be at least 2 characters.'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email)) errs.email = 'Enter a valid email address.'
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters.'
    if (password !== confirm) errs.confirm = 'Passwords do not match.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setApiError('')
    if (!validate()) return

    setIsLoading(true)
    try {
      const res = await api.post('/auth/signup', { name: name.trim(), email: email.trim(), password })
      login(res.data.token, res.data.user)
      toast.success(`Welcome to MailCraft AI, ${res.data.user.name}!`)
      navigate('/generate')
    } catch (err) {
      const errData = err.response?.data
      if (errData?.fields) {
        // Map server validation errors back to fields
        setErrors(errData.fields)
      } else {
        setApiError(errData?.error || 'Signup failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearErr = (field) => setErrors(p => { const n = { ...p }; delete n[field]; return n })

  return (
    <div className="app-bg">
      <Navbar />

      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12"
      >
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>Create your account</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Start generating professional emails for free
            </p>
          </div>

          {/* Card */}
          <div className="card p-8">
            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3 rounded-xl text-sm"
                style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', color: '#f43f5e' }}
              >
                {apiError}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name */}
              <div>
                <label htmlFor="signup-name" className="form-label">Full Name</label>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  className={`input-field ${errors.name ? 'error' : ''}`}
                  placeholder="Jane Smith"
                  value={name}
                  onChange={e => { setName(e.target.value); clearErr('name') }}
                  disabled={isLoading}
                  maxLength={100}
                />
                {errors.name && <p className="field-error">⚠ {errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signup-email" className="form-label">Email</label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  className={`input-field ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); clearErr('email') }}
                  disabled={isLoading}
                />
                {errors.email && <p className="field-error">⚠ {errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signup-password" className="form-label">Password</label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`input-field pr-10 ${errors.password ? 'error' : ''}`}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={e => { setPassword(e.target.value); clearErr('password') }}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
                {/* Strength bar */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{ background: i <= strength.score ? strength.color : 'var(--color-surface-2)' }} />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
                  </div>
                )}
                {errors.password && <p className="field-error">⚠ {errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="signup-confirm" className="form-label">Confirm Password</label>
                <input
                  id="signup-confirm"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input-field ${errors.confirm ? 'error' : ''}`}
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); clearErr('confirm') }}
                  disabled={isLoading}
                />
                {errors.confirm && <p className="field-error">⚠ {errors.confirm}</p>}
              </div>

              {/* Submit */}
              <motion.button
                id="signup-submit-btn"
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-2"
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.99 }}
              >
                {isLoading ? <><div className="spinner" /> Creating account...</> : 'Create Account'}
              </motion.button>
            </form>

            {/* Login link */}
            <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
