'use client'

import { useState, useEffect } from 'react'
import { GetStartedTabEnterprise } from '@/components/tabs/get-started-tab-enterprise'
import { IntelligenceTab } from '@/components/tabs/intelligence-tab'
import { PricingCards } from '@/components/pricing/pricing-cards'
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
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  Shield,
  CheckCircle,
  TrendingUp,
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
  const [isSignUp, setIsSignUp] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)
  const [emailValue, setEmailValue] = useState('')

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

  const handleForgotPassword = async () => {
    if (!emailValue) {
      setError('Please enter your email address first.')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await firebaseAuth.sendPasswordReset(emailValue)
      setResetSent(true)
      alert("Success! Check your inbox.");
      setTimeout(() => setResetSent(false), 6000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // AUTH LOADING SCREEN
  if (isAuthenticated === null) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    )
  }

  // AUTH SCREEN
  if (isAuthenticated === false) {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-6 overflow-hidden relative">
        {/* Ambient Glow Background */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-[400px] z-10">
          {/* Brand Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6 shadow-xl shadow-primary/20">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h2>
            <p className="text-muted-foreground font-medium">
              {isSignUp ? 'Start your journey with AI-powered insights' : 'Log in to access your dashboard'}
            </p>
          </div>

          <div className="space-y-6">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 p-4 bg-background/50 border border-border/60 rounded-2xl hover:bg-accent/5 hover:border-primary/30 hover:shadow-sm transition-all duration-300 group disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-semibold text-sm tracking-tight">Continue with Google</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex-grow h-[1px] bg-border/40"></div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">Or email</span>
              <div className="flex-grow h-[1px] bg-border/40"></div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleEmailAuth(formData.get('email') as string, formData.get('password') as string)
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Email</label>
                <div className={`relative transition-all duration-300`}>
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'email' ? 'text-primary' : 'text-muted-foreground/50'}`} />
                  <input
                    name="email"
                    type="email"
                    required
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    placeholder="name@company.com"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-11 pr-4 py-3.5 bg-background border border-border/60 rounded-2xl text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
  {/* --- REPLACEMENT START --- */}
  <div className="flex justify-between items-end px-1">
    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
      Password
    </label>
    {!isSignUp && (
      <button
        type="button"
        onClick={handleForgotPassword}
        className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
      >
        Forgot?
      </button>
    )}
  </div>
  {/* --- REPLACEMENT END --- */}

  <div className="relative transition-all duration-300">
    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focusedField === 'password' ? 'text-primary' : 'text-muted-foreground/50'}`} />
    <input
      name="password"
      type={showPassword ? 'text' : 'password'}
      required
      placeholder="••••••••"
      onFocus={() => setFocusedField('password')}
      onBlur={() => setFocusedField(null)}
      className="w-full pl-11 pr-12 py-3.5 bg-background border border-border/60 rounded-2xl text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 placeholder:text-muted-foreground/40"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors"
    >
      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  </div>
</div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-2 bg-primary text-primary-foreground font-bold text-sm rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-xl shadow-primary/20 disabled:opacity-50"
              >
                <span>{isSignUp ? 'Create Account' : 'Log In'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground text-center">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-foreground font-bold hover:text-primary transition-colors underline-offset-4 hover:underline"
                >
                  {isSignUp ? 'Log in' : 'Sign up'}
                </button>
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs text-center font-medium animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

// DASHBOARD
return (
  <div className="h-screen flex bg-background overflow-hidden">

    {/* SIDEBAR */}
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-0'
      } transition-all duration-300 bg-card/95 backdrop-blur-sm border-r border-border/50 overflow-hidden flex-shrink-0 hidden sm:block`}
    >
      <div className="h-full flex flex-col">
        {/* New Chat */}
        <div className="p-4">
          <button
            onClick={() => {
              setActiveTab('chat')
              setSelectedConversation(null)
            }}
            className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl hover:from-primary/95 hover:to-primary/85 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            <span className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-semibold">New Analysis</span>
            </span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-hidden p-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 px-3 flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary/60"></div>
            <span>Recent Analyses</span>
          </h3>
          <div className="space-y-2 overflow-hidden">
            {mockConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => {
                  setSelectedConversation(conversation.id)
                  setActiveTab('chat')
                }}
                className={`w-full text-left p-3 rounded-xl transition-all duration-300 group hover:shadow-lg hover:-translate-y-1 ${
                  selectedConversation === conversation.id
                    ? 'bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 shadow-md'
                    : 'bg-card/50 border border-border/30 hover:bg-card/80 hover:border-primary/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-xs font-semibold text-foreground truncate pr-2 group-hover:text-primary transition-colors">
                    {conversation.title}
                  </h4>
                  <div
                    className={`px-2 py-1 rounded-full text-[10px] font-medium transition-all duration-300 ${
                      conversation.status === 'completed'
                        ? 'bg-green-100/80 text-green-700 group-hover:bg-green-100'
                        : conversation.status === 'analyzing'
                        ? 'bg-yellow-100/80 text-yellow-700 group-hover:bg-yellow-100'
                        : 'bg-red-100/80 text-red-700 group-hover:bg-red-100'
                    }`}
                  >
                    {conversation.status}
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2 group-hover:text-foreground/80 transition-colors">
                  {conversation.preview}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                    {conversation.timestamp}
                  </p>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 rounded-lg hover:bg-accent/50 transition-colors">
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <button className="p-1 rounded-lg hover:bg-accent/50 transition-colors">
                      <BarChart3 className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>

    {/* MAIN */}
    <main className="flex-1 flex flex-col overflow-hidden">

      {/* HEADER */}
      <header className="border-b border-border bg-card flex-shrink-0">
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
              <div className="text-center mb-2 flex-shrink-0">
                <h2 className="text-lg font-semibold text-foreground">
                  Start Your Market Analysis
                </h2>
              </div>
              {/* Chat body */}
              <div className="flex-1 min-h-0 overflow-hidden">
                <GetStartedTabEnterprise />
              </div>

            </div>
          </div>
        )}

        {/* INTELLIGENCE TAB */}
        {activeTab === 'intelligence' && (
          <div className="flex-1 overflow-hidden px-4 py-4">
            <div className="max-w-6xl mx-auto h-full">
              <IntelligenceTab />
            </div>
          </div>
        )}

        {/* PRICING TAB */}
        {activeTab === 'pricing' && (
          <div className="flex-1 overflow-hidden px-4 py-4">
            <div className="max-w-7xl mx-auto h-full">
              <PricingCards />
            </div>
          </div>
        )}

      </div>
    </main>
  </div>
)
}