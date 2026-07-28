/**
 * context/ThemeContext.jsx — Dark/Light Mode Toggle
 *
 * Persists the user's theme preference in localStorage.
 * Toggles the 'dark' class on the <html> element, which Tailwind's
 * darkMode: 'class' configuration uses to switch between themes.
 *
 * Exposes: { theme, toggleTheme, isDark }
 */

import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const THEME_KEY = 'mailcraft_theme'

export function ThemeProvider({ children }) {
  // Default to 'dark' — our primary design aesthetic
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'dark'
  })

  // Sync the 'dark' class on <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
