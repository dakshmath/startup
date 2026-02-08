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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your application preferences</p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Intelligence
          </button>
        </div>

        {/* MAIN SETTINGS WRAPPER */}
        <div className="space-y-6">

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
            </div>

            <div className="space-y-4">
              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications about your ideas</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-blue-600' : 'bg-gray-200'
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
                  <p className="font-medium text-gray-900 dark:text-white">Email Updates</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get weekly summaries and insights</p>
                </div>
                <button
                  onClick={() => setEmailUpdates(!emailUpdates)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailUpdates ? 'bg-blue-600' : 'bg-gray-200'
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark theme</p>
              </div>

              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy & Security</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update your account password</p>
              </button>

              <button className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
              </button>

              <button className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <p className="font-medium">Privacy Settings</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your data and privacy</p>
              </button>
            </div>
          </div>

          {/* Support */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Support</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <p className="font-medium">Help Center</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get help with using the platform</p>
              </button>

              <button className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <p className="font-medium">Contact Support</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reach out to our support team</p>
              </button>

              <button className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <p className="font-medium">FAQ</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Frequently asked questions</p>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
            <h2 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-4">Danger Zone</h2>

            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-red-600 dark:text-red-500">Permanently delete your account and data</p>
              </button>
            </div>
          </div>

        </div> {/* END MAIN WRAPPER */}

      </div>
    </div>
  )
}