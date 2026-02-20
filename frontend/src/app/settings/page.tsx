'use client'

import React, { useState } from 'react'
import { Palette, CreditCard, Bell, Shield, ArrowLeft } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { useRouter } from 'next/navigation'
import { AppearanceSettings } from '@/modules/settings/appearance-settings'
import { NotificationSettings } from '@/modules/settings/notification-settings'
import { BillingSettings } from '@/modules/settings/billing-settings'
import { SecuritySettings } from '@/modules/settings/security-settings'

export default function SettingsPage() {
  const router = useRouter()
  const { isDarkMode } = useTheme()

  const [activeTab, setActiveTab] = useState('appearance')
  const [notifications, setNotifications] = useState({
    analysis: true,
    security: true,
  })

  const tabItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

      <nav className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">

          <div className="w-full md:w-56 space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
            <nav className="flex flex-col gap-0.5">
              {tabItems.map((item) => {
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-150 text-left relative
                      ${isActive
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-foreground rounded-full" />
                    )}
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === 'appearance' && <AppearanceSettings />}
            {activeTab === 'billing' && <BillingSettings isDarkMode={isDarkMode} />}
            {activeTab === 'notifications' && (
              <NotificationSettings
                notifications={notifications}
                setNotifications={setNotifications}
                isDarkMode={isDarkMode}
              />
            )}
            {activeTab === 'security' && <SecuritySettings isDarkMode={isDarkMode} />}
          </div>

        </div>
      </main>
    </div>
  )
}