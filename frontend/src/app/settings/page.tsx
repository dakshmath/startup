'use client'

import React, { useState } from 'react'
import { Bell, Palette, CreditCard, Shield, User, HelpCircle } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()

  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your application preferences</p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Intelligence
          </button>
        </div>

        {/* MAIN SETTINGS WRAPPER */}
        <div className="space-y-6">

          {/* Notifications */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            </div>

            <div className="space-y-4">
              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications about your ideas</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-primary' : 'bg-secondary'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Email Updates */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Email Updates</p>
                  <p className="text-sm text-muted-foreground">Get weekly summaries and insights</p>
                </div>
                <button
                  onClick={() => setEmailUpdates(!emailUpdates)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailUpdates ? 'bg-primary' : 'bg-secondary'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Palette className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Toggle dark theme</p>
              </div>

              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-primary' : 'bg-secondary'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Privacy & Security</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors">
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </button>

              <button className="w-full text-left px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors">
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </button>

              <button className="w-full text-left px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors">
                <p className="font-medium">Privacy Settings</p>
                <p className="text-sm text-muted-foreground">Manage your data and privacy</p>
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center space-x-3 mb-4">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Support</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors">
                <p className="font-medium">Help Center</p>
                <p className="text-sm text-muted-foreground">Get help with using the platform</p>
              </button>

              <button className="w-full text-left px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors">
                <p className="font-medium">Contact Support</p>
                <p className="text-sm text-muted-foreground">Reach out to our support team</p>
              </button>

              <button className="w-full text-left px-4 py-3 text-foreground hover:bg-accent rounded-lg transition-colors">
                <p className="font-medium">FAQ</p>
                <p className="text-sm text-muted-foreground">Frequently asked questions</p>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-destructive/10 rounded-xl p-6 border border-destructive/20">
            <h2 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h2>

            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-destructive/80">Permanently delete your account and data</p>
              </button>
            </div>
          </div>

        </div> {/* END MAIN WRAPPER */}

      </div>
    </div>
  )
}