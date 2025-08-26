'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { getTheme, setTheme } from '@/lib/theme'

export default function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false)
  const [themeState, setThemeState] = React.useState<'light'|'dark'>(() => 'light')

  React.useEffect(() => {
    setMounted(true)
    const t = getTheme()
    setThemeState(t)
  }, [])

  if (!mounted) return null

  const isDark = themeState === 'dark'
  const next = isDark ? 'light' : 'dark'

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => { setTheme(next); setThemeState(next) }}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {isDark ? 'Light' : 'Dark'}
    </button>
  )
}


