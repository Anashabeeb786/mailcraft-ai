/**
 * App.jsx — Root Application Component
 *
 * Sets up:
 *  - Context providers (Auth + Theme) wrapping the entire app
 *  - React Router with page transitions
 *  - Protected route handling
 *  - Toast notification system
 */

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'

import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/LoginPage'
import SignupPage     from './pages/SignupPage'
import GeneratorPage  from './pages/GeneratorPage'
import HistoryPage    from './pages/HistoryPage'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Global toast notifications — positioned top-right */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#12121a',
                color: '#f1f5f9',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#10b981', secondary: '#12121a' },
              },
              error: {
                iconTheme: { primary: '#f43f5e', secondary: '#12121a' },
              },
            }}
          />

          {/* AnimatePresence enables exit animations on route changes */}
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes */}
              <Route path="/"       element={<LandingPage />} />
              <Route path="/login"  element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected routes — redirect to /login if not authenticated */}
              <Route path="/generate" element={
                <ProtectedRoute>
                  <GeneratorPage />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              } />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
