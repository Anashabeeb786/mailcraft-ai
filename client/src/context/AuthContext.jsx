/**
 * context/AuthContext.jsx — Authentication State Management
 *
 * Provides authentication state (user, token) globally via React Context.
 * The token is persisted in localStorage so users stay logged in on refresh.
 *
 * Exposes: { user, token, login, logout, isLoading }
 */

import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Storage keys
const TOKEN_KEY = 'mailcraft_token'
const USER_KEY  = 'mailcraft_user'

/**
 * AuthProvider
 * Wrap the app with this to make auth state available everywhere.
 */
export function AuthProvider({ children }) {
  const [user,      setUser]      = useState(null)
  const [token,     setToken]     = useState(null)
  const [isLoading, setIsLoading] = useState(true) // True while rehydrating from storage

  // On mount: rehydrate auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser  = localStorage.getItem(USER_KEY)

    if (storedToken && storedUser) {
      try {
        // Decode the JWT payload (base64) to check expiry without a library
        const payload = JSON.parse(atob(storedToken.split('.')[1]))
        const isExpired = payload.exp * 1000 < Date.now()

        if (isExpired) {
          // Token is expired — clear storage and log out silently
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
        } else {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
        }
      } catch {
        // Corrupted storage — clear it
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }

    setIsLoading(false)
  }, [])

  /**
   * login
   * Called after a successful /auth/login or /auth/signup API response.
   * Persists token + user to localStorage.
   */
  function login(token, userData) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setToken(token)
    setUser(userData)
  }

  /**
   * logout
   * Clears auth state and localStorage.
   */
  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }

  const value = { user, token, login, logout, isLoading, isAuthenticated: !!token }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth
 * Custom hook for consuming auth context.
 * Throws if used outside of <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
