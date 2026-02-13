'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { firebaseAuth } from '@/lib/firebase'
import { authApi } from '@/lib/api'
import { AuthScreen } from '@/modules/auth/auth-screen'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [emailValue, setEmailValue] = useState('')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [resetSent, setResetSent] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

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
            router.push('/')
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
  }, [router])

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
      router.push('/')
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
      router.push('/')
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

  if (isAuthenticated === null) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <AuthScreen
      isSignUp={isSignUp}
      setIsSignUp={setIsSignUp}
      isLoading={isLoading}
      error={error}
      handleGoogleSignIn={handleGoogleSignIn}
      handleEmailAuth={handleEmailAuth}
      handleForgotPassword={handleForgotPassword}
      emailValue={emailValue}
      setEmailValue={setEmailValue}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      setFocusedField={setFocusedField}
    />
  )
}