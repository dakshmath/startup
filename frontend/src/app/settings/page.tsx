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
  const { isDarkMode, toggleDarkMode } = useTheme()
  
  const [activeTab, setActiveTab] = useState('appearance')
  const [notifications, setNotifications] = useState({
    analysis: true,
    security: true
  })

  const tabItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out ${
      isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#FAFAFA] text-zinc-900'
    }`}>
      
      {/* Top Navigation */}
      <nav className={`border-b sticky top-0 z-50 transition-colors duration-500 ${
        isDarkMode ? 'border-white/5 bg-black/60 backdrop-blur-xl' : 'border-black/5 bg-white/60 backdrop-blur-xl'
      }`}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className={`flex items-center gap-2 text-sm transition-all group ${
              isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black'
            }`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <nav className="flex flex-col gap-1">
              {tabItems.map((item) => {
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                      isActive 
                        ? 'text-primary' 
                        : isDarkMode 
                          ? 'text-zinc-400 hover:text-white hover:bg-white/5' 
                          : 'text-zinc-500 hover:text-black hover:bg-zinc-100'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 w-1 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                    )}
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            {activeTab === 'appearance' && (
              <AppearanceSettings isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            )}
            
            {activeTab === 'billing' && (
              <BillingSettings isDarkMode={isDarkMode} />
            )}

            {activeTab === 'notifications' && (
              <NotificationSettings 
                notifications={notifications} 
                setNotifications={setNotifications} 
                isDarkMode={isDarkMode} 
              />
            )}

            {activeTab === 'security' && (
              <SecuritySettings isDarkMode={isDarkMode} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}