'use client'

import React, { useState } from 'react'
import { Bell, Palette, CreditCard, Shield, User, HelpCircle, Sparkles, ArrowLeft, Settings } from 'lucide-react'
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Settings className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Settings</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Customize Your Experience
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Manage your application preferences and personalize your workspace
          </p>
        </div>

        {/* Back Button */}
        <div className="text-center mb-12">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-card border border-border rounded-xl hover:bg-accent transition-all duration-300 group shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-foreground group-hover:text-primary transition-colors font-medium">Back to Dashboard</span>
          </button>
        </div>

        {/* MAIN SETTINGS WRAPPER */}
        <div className="space-y-8">

          {/* Notifications */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
            </div>

            <div className="space-y-6">
              {/* Push Notifications */}
              <div className="flex items-center justify-between p-6 bg-background rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
                <div>
                  <p className="font-semibold text-foreground mb-2 text-lg">Push Notifications</p>
                  <p className="text-muted-foreground">Receive notifications about your ideas and analysis updates</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    notifications ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Email Updates */}
              <div className="flex items-center justify-between p-6 bg-background rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
                <div>
                  <p className="font-semibold text-foreground mb-2 text-lg">Email Updates</p>
                  <p className="text-muted-foreground">Get weekly insights and platform updates delivered to your inbox</p>
                </div>
                <button
                  onClick={() => setEmailUpdates(!emailUpdates)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    emailUpdates ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      emailUpdates ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Appearance</h2>
            </div>

            <div className="flex items-center justify-between p-6 bg-background rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
              <div>
                <p className="font-semibold text-foreground mb-2 text-lg">Dark Mode</p>
                <p className="text-muted-foreground">Toggle between light and dark theme for better viewing comfort</p>
              </div>

              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Privacy & Security</h2>
            </div>

            <div className="space-y-4">
              <button className="w-full text-left px-6 py-4 text-foreground hover:bg-accent rounded-xl transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
                <p className="font-semibold text-lg group-hover:text-primary transition-colors">Change Password</p>
                <p className="text-muted-foreground">Update your account password and security settings</p>
              </button>

              <button className="w-full text-left px-6 py-4 text-foreground hover:bg-accent rounded-xl transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
                <p className="font-semibold text-lg group-hover:text-primary transition-colors">Two-Factor Authentication</p>
                <p className="text-muted-foreground">Add an extra layer of security to protect your account</p>
              </button>

              <button className="w-full text-left px-6 py-4 text-foreground hover:bg-accent rounded-xl transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
                <p className="font-semibold text-lg group-hover:text-primary transition-colors">Privacy Settings</p>
                <p className="text-muted-foreground">Manage your data and privacy preferences</p>
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Support</h2>
            </div>

            <div className="space-y-4">
              <button className="w-full text-left px-6 py-4 text-foreground hover:bg-accent rounded-xl transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
                <p className="font-semibold text-lg group-hover:text-primary transition-colors">Help Center</p>
                <p className="text-muted-foreground">Get help with using the platform and find answers</p>
              </button>

              <button className="w-full text-left px-6 py-4 text-foreground hover:bg-accent rounded-xl transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
                <p className="font-semibold text-lg group-hover:text-primary transition-colors">Contact Support</p>
                <p className="text-muted-foreground">Reach out to our support team for assistance</p>
              </button>

              <button className="w-full text-left px-6 py-4 text-foreground hover:bg-accent rounded-xl transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
                <p className="font-semibold text-lg group-hover:text-primary transition-colors">FAQ</p>
                <p className="text-muted-foreground">Frequently asked questions and common issues</p>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-destructive/10 backdrop-blur-sm border border-destructive/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-destructive/20 rounded-xl">
                <Shield className="w-6 h-6 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold text-destructive">Danger Zone</h2>
            </div>

            <div className="space-y-4">
              <button className="w-full text-left px-6 py-4 text-destructive hover:bg-destructive/20 rounded-xl transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
                <p className="font-semibold text-lg group-hover:text-destructive/80 transition-colors">Delete Account</p>
                <p className="text-destructive/70">Permanently delete your account and all associated data</p>
              </button>
            </div>
          </div>

        </div> {/* END MAIN WRAPPER */}

      </div>
    </div>
  )
}