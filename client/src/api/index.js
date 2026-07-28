/**
 * api/index.js — Axios HTTP Client Instance
 *
 * Creates a pre-configured Axios instance that:
 *  - Targets the backend API (proxied through Vite in dev, or a base URL in prod)
 *  - Automatically attaches the JWT Authorization header to every request
 *  - Provides consistent error handling via request/response interceptors
 *
 * Usage in components:
 *   import api from '../api'
 *   const res = await api.post('/auth/login', { email, password })
 */

import axios from 'axios'

// In development, Vite proxies /api → http://localhost:3001/api
// In production, set VITE_API_URL in the client .env file
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds — AI calls can take time
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor ───────────────────────────────────────────────────
// Reads the JWT from localStorage and attaches it to every request header.
// This runs before every API call so the token is always fresh.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mailcraft_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ──────────────────────────────────────────────────
// Normalizes error responses. If a 401 is received, the session has expired
// and we force a logout by clearing storage (the AuthContext will reflect this
// on next render).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired — clear stored credentials
      localStorage.removeItem('mailcraft_token')
      localStorage.removeItem('mailcraft_user')
      // Redirect to login (works without react-router since we use window)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
