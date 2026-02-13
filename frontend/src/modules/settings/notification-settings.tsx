'use client'

import React from 'react'
import { Switch } from '@/components/ui/switch'

interface NotificationSettingsProps {
  notifications: { analysis: boolean; security: boolean }
  setNotifications: React.Dispatch<React.SetStateAction<{ analysis: boolean; security: boolean }>>
  isDarkMode: boolean
}

export function NotificationSettings({ notifications, setNotifications, isDarkMode }: NotificationSettingsProps) {
  const settings = [
    { id: 'analysis', title: 'Analysis Completions', desc: 'Alerts when your AI reports are ready.' },
    { id: 'security', title: 'Security Alerts', desc: 'Critical account and login notifications.' },
  ]

  const handleToggle = (id: 'analysis' | 'security') => {
    setNotifications(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`pb-4 border-b ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
        <h3 className="text-xl font-bold">Notifications</h3>
        <p className="text-sm opacity-60 mt-1">Configure your alerts.</p>
      </div>

      <div className="space-y-3">
        {settings.map((notif) => (
          <div key={notif.id} className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${
            isDarkMode ? 'border-white/5 bg-[#0A0A0A]' : 'border-zinc-200 bg-white shadow-sm'
          }`}>
            <div>
              <p className="text-sm font-bold">{notif.title}</p>
              <p className="text-xs opacity-50">{notif.desc}</p>
            </div>
            <Switch 
              checked={notifications[notif.id as keyof typeof notifications]} 
              onCheckedChange={() => handleToggle(notif.id as 'analysis' | 'security')} 
            />
          </div>
        ))}
      </div>
    </div>
  )
}