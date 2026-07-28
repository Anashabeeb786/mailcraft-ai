/**
 * components/Navbar.jsx — Top Navigation Bar
 *
 * Responsive navbar with:
 *  - Logo + brand name
 *  - Navigation links (authenticated vs. guest)
 *  - Dark/light mode toggle
 *  - User info + logout button
 *  - Mobile hamburger menu
 */

import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

// SVG icons as inline components to avoid dependencies
const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M22 7l-10 7L2 7"/>
  </svg>
)
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const HistoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.87"/>
  </svg>
)
const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const linkClass = (path) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'text-indigo-400'
        : 'text-slate-400 hover:text-white'
    }`

  return (
    <header className="sticky top-0 z-50 border-b"
      style={{ background: 'rgba(10,10,15,0.85)', borderColor: 'rgba(99,102,241,0.12)', backdropFilter: 'blur(20px)' }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <MailIcon />
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="gradient-text">MailCraft</span>
            <span className="text-white"> AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/generate" className={linkClass('/generate')}>Generate</Link>
              <Link to="/history"  className={linkClass('/history')}>
                <span className="flex items-center gap-1.5"><HistoryIcon /> History</span>
              </Link>
              <ThemeToggle />
              <div className="flex items-center gap-3 pl-3 border-l" style={{ borderColor: 'rgba(99,102,241,0.2)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                     style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-slate-300 font-medium">{user?.name}</span>
                <button onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors">
                  <LogoutIcon /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="btn-primary text-sm py-2 px-4 rounded-lg">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(o => !o)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t px-4 py-4 flex flex-col gap-3"
            style={{ background: 'rgba(18,18,26,0.98)', borderColor: 'rgba(99,102,241,0.12)' }}>
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: 'rgba(99,102,241,0.15)' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                       style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-300">{user?.name}</span>
                </div>
                <Link to="/generate" onClick={() => setMobileOpen(false)} className="text-slate-300 hover:text-white text-sm py-1">Generate Email</Link>
                <Link to="/history"  onClick={() => setMobileOpen(false)} className="text-slate-300 hover:text-white text-sm py-1">Email History</Link>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm text-left py-1">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login"  onClick={() => setMobileOpen(false)} className="text-slate-300 text-sm py-1">Log In</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-sm text-center py-2.5 rounded-xl">Get Started</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
