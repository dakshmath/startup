'use client'

import { Eye, EyeOff, ArrowRight } from 'lucide-react'

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
  setFocusedField,
}: AuthScreenProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'hsl(var(--background))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Logo — pinned top-left */}
      <div
        style={{
          position: 'absolute',
          top: '28px',
          left: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: '30px',
            height: '30px',
            backgroundColor: 'hsl(var(--foreground))',
            borderRadius: '8px',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: '30px',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            color: 'hsl(var(--foreground))',
            textTransform: 'uppercase',
          }}
        >
          Evo
        </span>
      </div>

      {/* Centered form */}
      <div
        style={{
          width: '460px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <h2
            style={{
              fontSize: '34px',
              fontWeight: 900,
              color: 'hsl(var(--foreground))',
              margin: '0 0 10px 0',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: 'hsl(var(--muted-foreground))',
              fontWeight: 500,
              margin: 0,
            }}
          >
            {isSignUp
              ? 'Start your journey with AI-powered insights'
              : 'Log in to access your dashboard'}
          </p>
        </div>

        {/* All form elements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Google */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '15px 24px',
              backgroundColor: 'hsl(var(--card))',
              border: '1.5px solid hsl(var(--border))',
              borderRadius: '14px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 700,
              color: 'hsl(var(--foreground))',
              boxSizing: 'border-box',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'hsl(var(--foreground) / 0.3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'hsl(var(--border))'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '4px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'hsl(var(--border))' }} />
            <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'hsl(var(--muted-foreground))', opacity: 0.5, whiteSpace: 'nowrap' }}>
                Or email
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'hsl(var(--border))' }} />
            </div>

            <form
            onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleEmailAuth(formData.get('email') as string, formData.get('password') as string)
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <label style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.13em', color: 'hsl(var(--muted-foreground))', marginLeft: '2px' }}>
                Email
                </label>
                <input
                name="email"
                type="email"
                required
                autoComplete="off"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                onFocus={e => { e.currentTarget.style.borderColor = 'hsl(var(--foreground))'; setFocusedField('email'); }}
                onBlur={e => { e.currentTarget.style.borderColor = 'hsl(var(--border))'; setFocusedField(null); }}
                placeholder="name@company.com"
                style={{ width: '100%', padding: '14px 18px', backgroundColor: 'hsl(var(--card))', border: '1.5px solid hsl(var(--border))', borderRadius: '14px', fontSize: '14px', color: 'hsl(var(--foreground))', outline: 'none', boxSizing: 'border-box' }}
                />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2px' }}>
                <label style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.13em', color: 'hsl(var(--muted-foreground))' }}>
                    Password
                </label>
                {!isSignUp && (
                    <button type="button" onClick={handleForgotPassword} style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'hsl(var(--foreground))', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    Forgot?
                    </button>
                )}
                </div>
                <div style={{ position: 'relative' }}>
                <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    onFocus={e => { e.currentTarget.style.borderColor = 'hsl(var(--foreground))'; setFocusedField('password'); }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'hsl(var(--border))'; setFocusedField(null); }}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '14px 48px 14px 18px', backgroundColor: 'hsl(var(--card))', border: '1.5px solid hsl(var(--border))', borderRadius: '14px', fontSize: '14px', color: 'hsl(var(--foreground))', outline: 'none', boxSizing: 'border-box' }}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'hsl(var(--foreground))'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = 'hsl(var(--muted-foreground))'; }}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(var(--muted-foreground))', opacity: 0.5, display: 'flex', alignItems: 'center', padding: 0 }}
                >
                    {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading}
                style={{ width: '100%', padding: '15px', marginTop: '4px', backgroundColor: 'hsl(var(--foreground))', color: 'hsl(var(--background))', border: 'none', borderRadius: '14px', fontSize: '13px', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxSizing: 'border-box' }}            >
                <span>{isSignUp ? 'Create Account' : 'Log In'}</span>
                {!isLoading && <ArrowRight size={15} />}
            </button>
            </form>
          {/* Switch */}
          <p
            style={{
              textAlign: 'center',
              fontSize: '14px',
              color: 'hsl(var(--muted-foreground))',
              fontWeight: 500,
              margin: '4px 0 0 0',
            }}
          >
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '14px',
                fontWeight: 900,
                color: 'hsl(var(--foreground))',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: '14px',
              borderRadius: '14px',
              backgroundColor: 'hsl(var(--destructive) / 0.05)',
              border: '1px solid hsl(var(--destructive) / 0.2)',
              color: 'hsl(var(--destructive))',
              fontSize: '12px',
              textAlign: 'center',
              fontWeight: 700,
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  )
}