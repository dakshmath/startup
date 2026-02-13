'use client'
import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface AppearanceSettingsProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export function AppearanceSettings({ isDarkMode, toggleDarkMode }: AppearanceSettingsProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`pb-4 border-b ${isDarkMode ? 'border-white/10' : 'border-black/5'}`}>
        <h3 className="text-xl font-bold text-foreground">Appearance</h3>
        <p className="text-sm text-muted-foreground mt-1">Customize your visual workspace.</p>
      </div>

      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl transition-colors ${
            isDarkMode ? 'bg-white/5 text-primary' : 'bg-zinc-50 text-orange-500'
          }`}>
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Dark Mode</p>
            <p className="text-xs text-muted-foreground">Switch between light and dark themes.</p>
          </div>
        </div>
        {/* Wrapper forces a visible grey track in light mode */}
        <div className={!isDarkMode ? '[&>button]:bg-zinc-300 [&>button]:border [&>button]:border-zinc-400' : ''}>
          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleDarkMode}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>
    </div>
  )
}