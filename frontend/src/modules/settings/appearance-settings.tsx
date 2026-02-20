'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/contexts/theme-context'

export function AppearanceSettings() {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="pb-4 border-b border-border">
        <h3 className="text-xl font-bold text-foreground">Appearance</h3>
        <p className="text-sm text-muted-foreground mt-1">Customize your visual workspace.</p>
      </div>

      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl transition-all duration-300 ${
            isDarkMode
              ? 'bg-indigo-500/10 text-indigo-400'
              : 'bg-orange-500/10 text-orange-500'
          }`}>
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </p>
            <p className="text-xs text-muted-foreground">
              Switch between light and dark themes.
            </p>
          </div>
        </div>

        <Switch
          checked={isDarkMode}
          onCheckedChange={toggleDarkMode}
        />
      </div>
    </div>
  )
}