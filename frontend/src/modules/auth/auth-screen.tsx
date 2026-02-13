'use client'

import { Sparkles, Eye, EyeOff, ArrowRight } from 'lucide-react'

interface AuthScreenProps {
  isSignUp: boolean
  setIsSignUp: (val: boolean) => void
  isLoading: boolean
  error: string
  handleGoogleSignIn: () => Promise<void>
  handleEmailAuth: (email: string, password: string) => Promise<void>
  handleForgotPassword: () => Promise<void>
  emailValue: string
  setEmailValue: (val: string) => void
  showPassword: boolean
  setShowPassword: (val: boolean) => void
  setFocusedField: (val: string | null) => void
}

export function AuthScreen({
  isSignUp,
  setIsSignUp,
  isLoading,
  error,
  handleGoogleSignIn,
  handleEmailAuth,
  handleForgotPassword,
  emailValue,
  setEmailValue,
  showPassword,
  setShowPassword,
  setFocusedField
}: AuthScreenProps) {
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
            <span className="font-semibold text-sm tracking-tight text-foreground/90 group-hover:text-foreground"> Continue with Google</span>
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
                  className="w-full px-4 py-3.5 bg-background border border-border/60 rounded-2xl text-sm outline-none transition-all focus:border-white/60 placeholder:text-muted-foreground/40 autofill:shadow-[0_0_0_1000px_#0a0a0a_inset] autofill:text-fill-white [-webkit-text-fill-color:white]"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-end px-1">
                <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">Password</label>
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