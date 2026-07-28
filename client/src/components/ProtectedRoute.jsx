/**
 * components/ProtectedRoute.jsx
 *
 * Higher-order component that guards routes requiring authentication.
 * If the user is not logged in, redirects to /login.
 * While auth state is loading from storage, renders nothing (avoids flash).
 */

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  // While checking stored token, render nothing to avoid redirect flash
  if (isLoading) {
    return (
      <div className="app-bg flex items-center justify-center min-h-screen">
        <div className="spinner" />
      </div>
    )
  }

  // Not authenticated — redirect to login, preserving the attempted URL
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
