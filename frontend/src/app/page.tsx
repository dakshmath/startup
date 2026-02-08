'use client'

import { useState, useEffect } from 'react'
import { GetStartedTab } from '@/components/tabs/get-started-tab'
import { IntelligenceTab } from '@/components/tabs/intelligence-tab'
import {
  MessageSquare,
  CreditCard,
  Settings,
  Menu,
  X,
  User,
  ChevronRight,
  Sparkles,
  BarChart3,
  Star,
  Mail,
} from 'lucide-react'
import { firebaseAuth } from '@/lib/firebase'
import { authApi } from '@/lib/api'
import { useRouter } from 'next/navigation'

// Mock data for sidebar
const mockConversations = [
  { id: 1, title: 'AI-Powered Food Delivery App', preview: 'On-demand delivery service with AI route optimization...', timestamp: '2 hours ago', status: 'completed' },
  { id: 2, title: 'Sustainable Fashion Marketplace', preview: 'E-commerce platform for eco-friendly brands...', timestamp: '5 hours ago', status: 'analyzing' },
  { id: 3, title: 'Smart Home Security System', preview: 'IoT-based home monitoring with AI...', timestamp: '1 day ago', status: 'completed' },
  { id: 4, title: 'Mental Health Teletherapy Platform', preview: 'Virtual counseling with AI matching...', timestamp: '2 days ago', status: 'completed' },
  { id: 5, title: 'Blockchain Supply Chain Solution', preview: 'Transparent tracking for global logistics...', timestamp: '3 days ago', status: 'failed' },
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    )
  }

  // AUTH SCREEN
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Market Intelligence</h1>
            <p className="text-muted-foreground">AI-powered startup analysis platform</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
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
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:bg-accent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:bg-accent transition-all"
                  placeholder="••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-foreground hover:text-primary font-medium transition-colors"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // DASHBOARD
  return (
    <div className="min-h-screen flex bg-background">

      {/* SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-card border-r border-border overflow-hidden flex-shrink-0`}
      >
        <div className="h-full flex flex-col">
          {/* New Chat */}
          <div className="p-3 border-b border-border">
            <button
              onClick={() => {
                setActiveTab('chat')
                setSelectedConversation(null)
              }}
              className="w-full flex items-center justify-between px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">New Analysis</span>
              </span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto p-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
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
                  className={`w-full text-left p-2 rounded-lg transition-all group ${
                    selectedConversation === conversation.id
                      ? 'bg-secondary border border-border'
                      : 'hover:bg-accent border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-xs font-medium text-foreground truncate pr-2">
                      {conversation.title}
                    </h4>
                    <div
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        conversation.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : conversation.status === 'analyzing'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {conversation.status}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {conversation.preview}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {conversation.timestamp}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="border-b border-border bg-card">
          <div className="grid grid-cols-3 items-center h-14 px-4">

            {/* Left: Sidebar toggle */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                {sidebarOpen ? (
                  <X className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Menu className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>

            {/* Center: Tabs */}
            <nav className="flex items-center justify-center space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Right: Profile + Settings */}
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => router.push('/settings')}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="p-2 rounded-full hover:bg-accent transition-colors"
              >
                <User className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col items-center overflow-hidden">
              <div className="w-full max-w-3xl flex-1 flex flex-col px-4 py-2 min-h-0">

                {/* Compact hero */}
                <div className="text-center mb-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    Start Your Market Analysis
                  </h2>
                </div>
                {/* Chat body */}
                <div className="flex-1 min-h-0 overflow-hidden">
                  <GetStartedTab />
                </div>

              </div>
            </div>
          )}

          {/* INTELLIGENCE TAB */}
          {activeTab === 'intelligence' && (
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="max-w-6xl mx-auto">
                <IntelligenceTab />
              </div>
            </div>
          )}

          {/* PRICING TAB */}
          {activeTab === 'pricing' && (
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    Choose Your Plan
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Unlock powerful market intelligence features
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {/* Starter */}
                  <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all hover:-translate-y-1">
                    <h3 className="text-xl font-bold mb-1">Starter</h3>
                    <p className="text-muted-foreground mb-4 text-sm">Perfect for early validation</p>
                    <div className="text-3xl font-bold mb-4">
                      $0<span className="text-lg text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-2 mb-6 text-sm">
                      <li className="flex items-center text-green-600">✓ 3 ideas per month</li>
                      <li className="flex items-center text-green-600">✓ Basic analysis</li>
                      <li className="flex items-center text-green-600">✓ Email support</li>
                      <li className="flex items-center text-destructive">✗ Advanced insights</li>
                      <li className="flex items-center text-destructive">✗ API access</li>
                    </ul>
                    <button className="w-full py-2.5 px-4 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium">
                      Get Started
                    </button>
                  </div>

                  {/* Growth */}
                  <div className="bg-primary text-primary-foreground rounded-2xl p-6 transform scale-105 shadow-2xl relative">
                    <div className="absolute -top-3 -right-3 bg-card text-foreground text-xs font-bold px-3 py-1 rounded-full">
                      RECOMMENDED
                    </div>
                    <h3 className="text-xl font-bold mb-1">Growth</h3>
                    <p className="text-primary-foreground mb-4 text-sm">For scaling startups</p>
                    <div className="text-3xl font-bold mb-4">
                      $49<span className="text-lg text-primary-foreground/80">/month</span>
                    </div>
                    <ul className="space-y-2 mb-6 text-sm">
                      <li className="flex items-center">✓ Unlimited ideas</li>
                      <li className="flex items-center">✓ Advanced analysis</li>
                      <li className="flex items-center">✓ Priority support</li>
                      <li className="flex items-center">✓ Custom reports</li>
                      <li className="flex items-center">✓ API access</li>
                    </ul>
                    <button className="w-full py-2.5 px-4 rounded-lg bg-card text-foreground font-bold hover:bg-accent transition-colors text-sm">
                      Start Free Trial
                    </button>
                  </div>

                  {/* Enterprise */}
                  <div className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all hover:-translate-y-1">
                    <div className="flex items-center mb-1">
                      <h3 className="text-xl font-bold">Enterprise</h3>
                      <Star className="h-5 w-5 text-yellow-400 ml-2" />
                    </div>
                    <p className="text-muted-foreground mb-4 text-sm">For high-growth companies</p>
                    <div className="text-3xl font-bold mb-4">
                      $199<span className="text-lg text-muted-foreground">/month</span>
                    </div>
                    <ul className="space-y-2 mb-6 text-sm">
                      <li className="flex items-center text-green-600">✓ Everything in Growth</li>
                      <li className="flex items-center text-green-600">✓ Team collaboration</li>
                      <li className="flex items-center text-green-600">✓ Custom integrations</li>
                      <li className="flex items-center text-green-600">✓ Dedicated support</li>
                      <li className="flex items-center text-green-600">✓ SLA guarantee</li>
                    </ul>
                    <button className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors text-sm">
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}