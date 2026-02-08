'use client'

import { useState, useEffect } from 'react'
import { GetStartedTab } from '@/components/tabs/get-started-tab'
import { IntelligenceTab } from '@/components/tabs/intelligence-tab'
import {
  MessageSquare, CreditCard, Settings, Menu, X,
  User, Lock, Mail, ChevronRight, Sparkles, BarChart3, Star
} from 'lucide-react'
import { firebaseAuth } from '@/lib/firebase'
import { authApi } from '@/lib/api'
import { useRouter } from 'next/navigation'

// Mock data for sidebar
const mockConversations = [
  { id: 1, title: "AI-Powered Food Delivery App", preview: "On-demand delivery service with AI route optimization...", timestamp: "2 hours ago", status: "completed" },
  { id: 2, title: "Sustainable Fashion Marketplace", preview: "E-commerce platform for eco-friendly brands...", timestamp: "5 hours ago", status: "analyzing" },
  { id: 3, title: "Smart Home Security System", preview: "IoT-based home monitoring with AI...", timestamp: "1 day ago", status: "completed" },
  { id: 4, title: "Mental Health Teletherapy Platform", preview: "Virtual counseling with AI matching...", timestamp: "2 days ago", status: "completed" },
  { id: 5, title: "Blockchain Supply Chain Solution", preview: "Transparent tracking for global logistics...", timestamp: "3 days ago", status: "failed" },
]

export default function Home() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<'chat' | 'intelligence' | 'pricing'>('chat')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const tabs = [
    { id: 'chat', label: 'Intelligence', icon: MessageSquare },
    { id: 'intelligence', label: 'Market Analysis', icon: BarChart3 },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
  ]

  // AUTH CHECK
  useEffect(() => {
    let mounted = true
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      if (!mounted) return

      if (user) {
        try {
          const token = await user.getIdToken()
          if (mounted) {
            localStorage.setItem('firebase_token', token)
            setIsAuthenticated(true)
          }
        } catch (error) {
          console.error('Error getting token:', error)
          if (mounted) setIsAuthenticated(false)
        }
      } else {
        if (mounted) {
          localStorage.removeItem('firebase_token')
          setIsAuthenticated(false)
        }
      }
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  // GOOGLE SIGN-IN
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError('')
    try {
      const user = await firebaseAuth.signInWithGoogle()
      const token = await user.getIdToken()
      localStorage.setItem('firebase_token', token)

      await authApi.login(token)
      setIsAuthenticated(true)
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google')
    } finally {
      setIsLoading(false)
    }
  }

  // EMAIL SIGN-IN / SIGN-UP
  const handleEmailAuth = async (email: string, password: string) => {
    setIsLoading(true)
    setError('')
    try {
      let user
      if (isSignUp) {
        user = await firebaseAuth.signUpWithEmail(email, password)
      } else {
        user = await firebaseAuth.signInWithEmail(email, password)
      }

      const token = await user.getIdToken()
      localStorage.setItem('firebase_token', token)

      await authApi.login(token)
      setIsAuthenticated(true)
    } catch (error: any) {
      setError(error.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}`)
    } finally {
      setIsLoading(false)
    }
  }

  // AUTH LOADING SCREEN
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // AUTH SCREEN
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-12 w-12 text-blue-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Market Intelligence</h1>
            <p className="text-gray-400">AI-powered startup analysis platform</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 p-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium">Continue with Google</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900/50 border border-red-800 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const email = formData.get('email') as string
              const password = formData.get('password') as string
              handleEmailAuth(email, password)
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:bg-gray-950 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:bg-gray-950 transition-all"
                  placeholder="••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-gray-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-gray-300 hover:text-white font-medium transition-colors"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ⭐⭐⭐ DASHBOARD UI (FULLY FIXED LAYOUT) ⭐⭐⭐
  return (
    <div className="min-h-screen flex bg-white dark:bg-black">

      {/* SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-hidden flex-shrink-0`}
      >
        <div className="h-full overflow-y-auto">

          {/* New Chat Button */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => {
                setActiveTab('chat')
                setSelectedConversation(null)
              }}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium">New Analysis</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Conversations List */}
          <div className="p-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
              Recent Analyses
            </h3>

            <div className="space-y-1">
              {mockConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation.id)
                    setActiveTab('chat')
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all group ${
                    selectedConversation === conversation.id
                      ? 'bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate pr-2">
                      {conversation.title}
                    </h4>

                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        conversation.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : conversation.status === 'analyzing'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}
                    >
                      {conversation.status}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {conversation.preview}
                  </p>

                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {conversation.timestamp}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
          <div className="flex items-center justify-between h-16 px-4">

            {/* Left */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Market Intelligence
              </h1>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/settings')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              <button
                onClick={() => router.push('/profile')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* TAB CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Start Your Market Analysis
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Describe your startup idea and get instant AI-powered market insights
                </p>
              </div>

              <GetStartedTab />
            </div>
          )}

          {/* INTELLIGENCE TAB */}
          {activeTab === 'intelligence' && (
            <div className="max-w-6xl mx-auto">
              <IntelligenceTab />
            </div>
          )}

                          {/* PRICING TAB */}
                          {activeTab === 'pricing' && (
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      Choose Your Plan
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      Unlock powerful market intelligence features
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-1">
                      <h3 className="text-xl font-bold mb-2">Starter</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">Perfect for early validation</p>
                      <div className="text-3xl font-bold mb-6">$0<span className="text-lg text-gray-500">/month</span></div>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-center text-green-600">✓ 3 ideas per month</li>
                        <li className="flex items-center text-green-600">✓ Basic analysis</li>
                        <li className="flex items-center text-green-600">✓ Email support</li>
                        <li className="flex items-center text-gray-400">✗ Advanced insights</li>
                        <li className="flex items-center text-gray-400">✗ API access</li>
                      </ul>
                      <button className="w-full py-3 px-6 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Get Started
                      </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-black text-white rounded-2xl p-8 transform scale-105 shadow-2xl relative">
                      <div className="absolute -top-4 -right-4 bg-white text-black text-sm font-bold px-3 py-1 rounded-full">
                        RECOMMENDED
                      </div>
                      <h3 className="text-xl font-bold mb-2">Growth</h3>
                      <p className="text-gray-300 mb-6">For scaling startups</p>
                      <div className="text-3xl font-bold mb-6">$49<span className="text-lg text-gray-400">/month</span></div>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-center">✓ Unlimited ideas</li>
                        <li className="flex items-center">✓ Advanced analysis</li>
                        <li className="flex items-center">✓ Priority support</li>
                        <li className="flex items-center">✓ Custom reports</li>
                        <li className="flex items-center">✓ API access</li>
                      </ul>
                      <button className="w-full py-3 px-6 rounded-lg bg-white text-black font-bold hover:bg-gray-100 transition-colors">
                        Start Free Trial
                      </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold">Enterprise</h3>
                        <Star className="h-5 w-5 text-yellow-400 ml-2" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">For high-growth companies</p>
                      <div className="text-3xl font-bold mb-6">$199<span className="text-lg text-gray-500">/month</span></div>
                      <ul className="space-y-3 mb-8">
                        <li className="flex items-center text-green-600">✓ Everything in Growth</li>
                        <li className="flex items-center text-green-600">✓ Team collaboration</li>
                        <li className="flex items-center text-green-600">✓ Custom integrations</li>
                        <li className="flex items-center text-green-600">✓ Dedicated support</li>
                        <li className="flex items-center text-green-600">✓ SLA guarantee</li>
                      </ul>
                      <button className="w-full py-3 px-6 rounded-lg bg-black text-white font-bold hover:bg-gray-800 transition-colors">
                        Contact Sales
                      </button>
                    </div>
                  </div>
                </div>
              )}
        </div>
      </main>
    </div>
  )
}