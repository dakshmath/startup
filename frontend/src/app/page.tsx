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
  MoreHorizontal,
  Plus,
} from 'lucide-react'
import { firebaseAuth } from '@/lib/firebase'
import { authApi } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface Conversation {
  id: string | number;
  title: string;
  preview: string;
  timestamp: string;
  status: 'completed' | 'analyzing' | 'failed';
}

export default function Home() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'chat' | 'intelligence' | 'pricing'>('chat')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<string | number | null>(null) 
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [userName, setUserName] = useState('')
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)
  const [emailValue, setEmailValue] = useState('')
  const [pastChats, setPastChats] = useState<Conversation[]>([])

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
            // Set user profile data
            setUserName(user.displayName || user.email?.split('@')[0] || '')
            setUserPhotoURL(user.photoURL || null)
          }
        } catch (error) {
          console.error('Error getting token:', error)
          if (mounted) setIsAuthenticated(false)
        }
      } else {
        if (mounted) {
          localStorage.removeItem('firebase_token')
          setIsAuthenticated(false)
          setUserName('')
          setUserPhotoURL(null)
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
        {/* Logo/Brand Area - Top Left */}
        <div className="absolute top-8 left-8 flex items-center space-x-3">
          <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-background" />
          </div>
          <span className="text-lg font-bold tracking-tighter text-foreground uppercase">StartupName</span>
        </div>

        <div className="w-full max-w-[400px] z-10">
          <div className="text-center mb-10">
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
              className="w-full flex items-center justify-center space-x-3 p-4 bg-background/50 border border-border/60 rounded-2xl hover:bg-primary/10 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all duration-300 group disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-semibold text-sm tracking-tight text-foreground/90 group-hover:text-foreground">              
              Continue with Google</span>
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
                {/* Email Input */}
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Email</label>
    <div className="relative">
      <input
        name="email"
        type="email"
        required
        autoComplete="off"
        value={emailValue}
        onChange={(e) => setEmailValue(e.target.value)}
        onFocus={() => setFocusedField('email')}
        onBlur={() => setFocusedField(null)}
        className="w-full px-4 py-3.5 bg-background border border-border/60 rounded-2xl text-sm outline-none transition-all focus:border-white/60 placeholder:text-muted-foreground/40 
        autofill:shadow-[0_0_0_1000px_#0a0a0a_inset] 
        autofill:text-fill-white 
        [-webkit-text-fill-color:white]"
      />
    </div>
  </div>

                {/* Password Input */}
                <div className="space-y-1.5">
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

                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 pr-12 py-3.5 bg-background border border-border/60 rounded-2xl text-sm outline-none transition-all focus:border-white/60 placeholder:text-muted-foreground/40 autofill:shadow-[0_0_0_30px_#000000_inset] autofill:text-fill-white"
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
                  className="w-full py-4 mt-2 bg-primary text-primary-foreground font-bold text-sm rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
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
            <div className="mt-6 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs text-center font-medium">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden relative">
      
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`absolute top-4 z-50 p-2 rounded-full border border-border bg-card shadow-md transition-all duration-300 ${
          sidebarOpen ? 'left-[240px]' : 'left-4'
        } hover:bg-accent`}
      >
        {sidebarOpen ? (
          <X className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Menu className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* SIDEBAR */}
      <aside
        className={`h-full transition-all duration-300 bg-card border-r border-border overflow-hidden flex-shrink-0 ${
          sidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-64 h-full flex flex-col">
          {/* Logo/Brand Area */}
          <div className="p-6 flex items-center space-x-3">
             <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-background" />
             </div>
             <span className="text-sm font-bold tracking-tighter text-foreground uppercase italic">StartupName</span>
          </div>

          {/* NEW IDEA BUTTON */}
          <div className="px-4 mb-4">
            <button
              onClick={() => {
                setActiveTab('chat')
                setSelectedConversation(null)
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all font-bold shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="text-[12px]">New Idea</span>
            </button>
          </div>

          {/* Past History */}
          <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 px-3">
              Past History
            </h3>
            <div className="space-y-1">
              {pastChats.map((conversation: Conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation.id)
                    setActiveTab('chat')
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all group ${
                    selectedConversation === conversation.id
                      ? 'bg-accent border border-border'
                      : 'hover:bg-accent/50'
                  }`}
                >
                  <h4 className="text-[12px] font-bold text-foreground truncate">{conversation.title}</h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{conversation.preview}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
        
        <div className="absolute top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <header className="flex items-center justify-between px-6 py-2 bg-background/60 backdrop-blur-xl border border-border rounded-full w-[90%] max-w-4xl pointer-events-auto shadow-2xl">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-foreground rounded-lg flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-background" />
              </div>
              <span className="text-[13px] font-black tracking-tighter text-foreground uppercase italic">StartupName</span>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => router.push('/settings')} 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Settings className="h-4 w-4" />
              </button>
              <div className="h-3 w-[1px] bg-border" />
              <button 
                onClick={() => router.push('/profile')} 
                className="relative w-8 h-8 rounded-full overflow-hidden border border-border hover:border-primary transition-all hover:scale-105 bg-background border-[1px]"
              >
                {userPhotoURL ? (
                  <img src={userPhotoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : userName ? (
                  <div className="w-full h-full bg-background text-foreground flex items-center justify-center text-sm font-semibold border border-border border-[1px]">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="w-full h-full bg-muted text-muted-foreground flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </button>
            </div>
          </header>
        </div>

        {/* CONTENT WRAPPER */}
        <div className="flex-1 flex flex-col overflow-hidden pt-28">

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col items-center overflow-hidden">
              <div className="w-full max-w-4xl flex-1 flex flex-col px-4 min-h-0">
                <div className="flex-1 min-h-0 overflow-hidden">
                  <GetStartedTabEnterprise />
                </div>
              </div>
            </div>
          )}

          {/* INTELLIGENCE TAB */}
          {activeTab === 'intelligence' && (
            <div className="flex-1 overflow-hidden px-6 pb-6">
              <div className="max-w-6xl mx-auto h-full bg-card border border-border rounded-3xl p-6 overflow-y-auto custom-scrollbar shadow-sm">
                <IntelligenceTab />
              </div>
            </div>
          )}

          {/* PRICING TAB */}
          {activeTab === 'pricing' && (
            <div className="flex-1 overflow-hidden px-6 pb-6">
              <div className="max-w-7xl mx-auto h-full custom-scrollbar-wrapper">
                <PricingCards />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}