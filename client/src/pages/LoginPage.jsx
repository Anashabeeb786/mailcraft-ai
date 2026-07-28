/**
 * pages/LoginPage.jsx — User Login Page
 *
 * Features:
 *  - Email + password form with inline validation
 *  - Shows API error messages (wrong password, etc.)
 *  - Redirects to /generate on success
 *  - Animated entrance via Framer Motion
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

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [errors,    setErrors]    = useState({})
  const [apiError,  setApiError]  = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPass,  setShowPass]  = useState(false)

  // Client-side validation before hitting the API
  function validate() {
    const errs = {}
    if (!email.trim()) errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email.'
    if (!password) errs.password = 'Password is required.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setApiError('')
    if (!validate()) return

    setIsLoading(true)
    try {
      const res = await api.post('/auth/login', { email: email.trim(), password })
      login(res.data.token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.name}!`)
      navigate('/generate')
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.'
      setApiError(msg)
    } finally {
      setIsLoading(false)
    }
  }

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
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>Welcome back</h1>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Log in to your MailCraft AI account
            </p>
          </div>

          {/* Card */}
          <div className="card p-8">
            {/* API-level error */}
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

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="form-label">Email</label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  className={`input-field ${errors.email ? 'error' : ''}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                  disabled={isLoading}
                />
                {errors.email && <p className="field-error">⚠ {errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="form-label">Password</label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="current-password"
                    className={`input-field pr-10 ${errors.password ? 'error' : ''}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })) }}
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
                {errors.password && <p className="field-error">⚠ {errors.password}</p>}
              </div>

              {/* Submit */}
              <motion.button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.99 }}
              >
                {isLoading ? <><div className="spinner" /> Logging in...</> : 'Log In'}
              </motion.button>
            </form>

            {/* Sign up link */}
            <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
