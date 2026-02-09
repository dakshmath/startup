'use client'

import React, { useState, useEffect } from 'react'
import { User, Settings, CreditCard, LogOut, Camera, Sparkles, ArrowLeft, Crown, Star, TrendingUp } from 'lucide-react'
import { firebaseAuth, storage } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { updateProfile, updateEmail } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function ProfilePage() {
  const router = useRouter()

  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const [currentPlan, setCurrentPlan] = useState('Free')
  const [firebaseUser, setFirebaseUser] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Load user info from Firebase
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user: any) => {
      if (user) {
        setFirebaseUser(user)
        setUserEmail(user.email || '')
        setUserName(user.displayName || '')
        setPhotoURL(user.photoURL || null)
      }
    })

    return () => unsubscribe()
  }, [])

  // Upload profile picture
  const handlePhotoUpload = async (e: any) => {
    const file = e.target.files?.[0]
    if (!file || !firebaseUser) return

    try {
      setUploading(true)

      const storageRef = ref(storage, `profilePictures/${firebaseUser.uid}`)
      await uploadBytes(storageRef, file)

      const downloadURL = await getDownloadURL(storageRef)
      setPhotoURL(downloadURL)

      await updateProfile(firebaseUser, { photoURL: downloadURL })
    } catch (err) {
      console.error('Error uploading photo:', err)
    } finally {
      setUploading(false)
    }
  }

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!firebaseUser) return

    try {
      setSaving(true)
      await updateProfile(firebaseUser, { displayName: userName })
    } catch (err) {
      console.error('Error updating profile:', err)
    } finally {
      setSaving(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await firebaseAuth.signOut()
      router.push('/')
    } catch (err) {
      console.error('Error logging out:', err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <User className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Profile</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Manage Your Account
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Update your profile information and manage your subscription
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

        {/* MAIN PROFILE WRAPPER */}
        <div className="space-y-8">

          {/* Profile Card */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <User className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent p-1">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                      {photoURL ? (
                        <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <label className="absolute inset-0 w-32 h-32 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="text-center mt-4">
                      <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl">
                        {uploading ? 'Uploading...' : 'Change Photo'}
                      </button>
                    </div>
                  </label>
                </div>
              </div>

              {/* Profile Form */}
              <div className="flex-1 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Display Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground"
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here</p>
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Subscription Status</h2>
            </div>

            <div className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-primary/20 rounded-xl">
                    <Crown className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-xl">{currentPlan} Plan</p>
                    <p className="text-muted-foreground">Active subscription</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">$0</p>
                  <p className="text-sm text-muted-foreground">/month</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">Basic Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">3 Ideas/month</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">Community Support</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/pricing')}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl hover:from-primary/95 hover:to-accent/95 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Account Actions</h2>
            </div>

            <div className="space-y-4">
              <button className="w-full text-left px-6 py-4 text-foreground hover:bg-accent rounded-xl transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
                <p className="font-semibold text-lg group-hover:text-primary transition-colors">Export Data</p>
                <p className="text-muted-foreground">Download all your data and analysis</p>
              </button>

              <button className="w-full text-left px-6 py-4 text-foreground hover:bg-accent rounded-xl transition-all duration-300 group hover:shadow-lg hover:-translate-y-1">
                <p className="font-semibold text-lg group-hover:text-primary transition-colors">Account Settings</p>
                <p className="text-muted-foreground">Manage privacy and security settings</p>
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-6 py-4 text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300 group hover:shadow-lg hover:-translate-y-1"
              >
                <p className="font-semibold text-lg group-hover:text-destructive/80 transition-colors">Sign Out</p>
                <p className="text-destructive/70">Sign out of your account</p>
              </button>
            </div>
          </div>

        </div> {/* END MAIN WRAPPER */}

      </div>
    </div>
  )
}