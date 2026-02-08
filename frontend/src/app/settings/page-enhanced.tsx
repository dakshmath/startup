'use client'

import React, { useState } from 'react'
import { 
  Bell, 
  Palette, 
  CreditCard, 
  Shield, 
  User, 
  HelpCircle, 
  Moon, 
  Sun, 
  Globe,
  Lock,
  Mail,
  Smartphone,
  Zap,
  ChevronRight,
  Check,
  X,
  Settings as SettingsIcon
} from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { useRouter } from 'next/navigation'

interface SettingSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  items: SettingItem[]
}

interface SettingItem {
  id: string
  label: string
  description: string
  type: 'toggle' | 'select' | 'button' | 'info'
  value?: any
  options?: { label: string; value: string }[]
  action?: () => void
  icon?: React.ReactNode
}

export default function SettingsPageEnhanced() {
  const router = useRouter()
  const { isDarkMode, toggleDarkMode } = useTheme()

  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    marketing: false
  })

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    autoSave: true,
    compactView: false
  })

  const [privacy, setPrivacy] = useState({
    twoFactor: false,
    dataSharing: false,
    analytics: true
  })

  const handleToggle = (category: string, item: string) => {
    switch (category) {
      case 'notifications':
        setNotifications(prev => ({ ...prev, [item]: !prev[item as keyof typeof prev] }))
        break
      case 'preferences':
        setPreferences(prev => ({ ...prev, [item]: !prev[item as keyof typeof prev] }))
        break
      case 'privacy':
        setPrivacy(prev => ({ ...prev, [item]: !prev[item as keyof typeof prev] }))
        break
    }
  }

  const settingSections: SettingSection[] = [
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage how you receive updates and alerts',
      icon: <Bell className="w-5 h-5" />,
      items: [
        {
          id: 'push',
          label: 'Push Notifications',
          description: 'Receive real-time notifications in your browser',
          type: 'toggle',
          value: notifications.push,
          icon: <Smartphone className="w-4 h-4" />
        },
        {
          id: 'email',
          label: 'Email Notifications',
          description: 'Get updates and analysis results via email',
          type: 'toggle',
          value: notifications.email,
          icon: <Mail className="w-4 h-4" />
        },
        {
          id: 'sms',
          label: 'SMS Notifications',
          description: 'Receive critical alerts via text message',
          type: 'toggle',
          value: notifications.sms,
          icon: <Smartphone className="w-4 h-4" />
        },
        {
          id: 'marketing',
          label: 'Marketing Communications',
          description: 'Receive product updates and promotional content',
          type: 'toggle',
          value: notifications.marketing,
          icon: <Zap className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Customize your visual experience',
      icon: <Palette className="w-5 h-5" />,
      items: [
        {
          id: 'theme',
          label: 'Theme',
          description: 'Choose between light and dark mode',
          type: 'toggle',
          value: isDarkMode,
          icon: isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />,
          action: toggleDarkMode
        },
        {
          id: 'language',
          label: 'Language',
          description: 'Select your preferred language',
          type: 'select',
          value: preferences.language,
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' }
          ],
          icon: <Globe className="w-4 h-4" />
        },
        {
          id: 'compact',
          label: 'Compact View',
          description: 'Use a more compact interface layout',
          type: 'toggle',
          value: preferences.compactView,
          icon: <SettingsIcon className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Control your data and account security',
      icon: <Shield className="w-5 h-5" />,
      items: [
        {
          id: 'twoFactor',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          type: 'toggle',
          value: privacy.twoFactor,
          icon: <Lock className="w-4 h-4" />
        },
        {
          id: 'dataSharing',
          label: 'Data Sharing',
          description: 'Allow sharing of anonymized usage data',
          type: 'toggle',
          value: privacy.dataSharing,
          icon: <Shield className="w-4 h-4" />
        },
        {
          id: 'analytics',
          label: 'Analytics Tracking',
          description: 'Help us improve with usage analytics',
          type: 'toggle',
          value: privacy.analytics,
          icon: <Zap className="w-4 h-4" />
        }
      ]
    },
    {
      id: 'account',
      title: 'Account Management',
      description: 'Manage your subscription and billing',
      icon: <User className="w-5 h-5" />,
      items: [
        {
          id: 'subscription',
          label: 'Subscription Plan',
          description: 'View and manage your current plan',
          type: 'button',
          action: () => router.push('/pricing'),
          icon: <CreditCard className="w-4 h-4" />
        },
        {
          id: 'billing',
          label: 'Billing History',
          description: 'View your payment history and invoices',
          type: 'button',
          action: () => router.push('/billing'),
          icon: <CreditCard className="w-4 h-4" />
        },
        {
          id: 'export',
          label: 'Export Data',
          description: 'Download all your data and analysis results',
          type: 'button',
          action: () => console.log('Export data'),
          icon: <HelpCircle className="w-4 h-4" />
        }
      ]
    }
  ]

  const ToggleSwitch = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
        ${checked ? 'bg-primary' : 'bg-muted'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  )

  const SettingToggle = ({ item, category }: { item: SettingItem; category: string }) => (
    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-accent/50 transition-colors group">
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          {item.icon}
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">{item.label}</p>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      </div>
      <ToggleSwitch
        checked={item.value}
        onChange={() => handleToggle(category, item.id)}
      />
    </div>
  )

  const SettingButton = ({ item }: { item: SettingItem }) => (
    <button
      onClick={item.action}
      className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-accent/50 transition-colors group"
    >
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          {item.icon}
        </div>
        <div className="text-left flex-1">
          <p className="font-medium text-foreground">{item.label}</p>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </button>
  )

  const SettingSelect = ({ item }: { item: SettingItem }) => (
    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
          {item.icon}
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">{item.label}</p>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      </div>
      <select
        value={item.value}
        onChange={(e) => setPreferences(prev => ({ ...prev, [item.id]: e.target.value }))}
        className="px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:border-ring"
      >
        {item.options?.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your preferences and account</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-32">
              <h2 className="text-lg font-semibold text-foreground mb-4">Categories</h2>
              <nav className="space-y-2">
                {settingSections.map((section) => (
                  <button
                    key={section.id}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                      {section.icon}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{section.title}</p>
                      <p className="text-xs text-muted-foreground">{section.description}</p>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {settingSections.map((section) => (
              <div key={section.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {section.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {section.items.map((item) => (
                    <div key={item.id}>
                      {item.type === 'toggle' && (
                        <SettingToggle item={item} category={section.id} />
                      )}
                      {item.type === 'button' && (
                        <SettingButton item={item} />
                      )}
                      {item.type === 'select' && (
                        <SettingSelect item={item} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center space-x-3 p-4 bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <User className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary">Edit Profile</span>
                </button>
                <button
                  onClick={() => console.log('Export data')}
                  className="flex items-center space-x-3 p-4 bg-accent border border-border rounded-lg hover:bg-accent/80 transition-colors"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="font-medium">Get Help</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
