'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ThemeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null)

  // Load theme BEFORE first paint
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme !== null) {
      setIsDarkMode(savedTheme === 'true')
    } else {
      setIsDarkMode(systemDark)
    }
  }, [])

  // Apply theme + persist
  useEffect(() => {
    if (isDarkMode === null) return

    const root = document.documentElement

    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    localStorage.setItem('darkMode', String(isDarkMode))
  }, [isDarkMode])

  const toggleDarkMode = () => {
    if (isDarkMode !== null) {
      setIsDarkMode(!isDarkMode)
    }
  }

  // Prevent rendering until theme is known
  if (isDarkMode === null) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}