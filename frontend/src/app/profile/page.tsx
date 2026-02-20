'use client'

import React, { useState, useEffect } from 'react'
import { User, Shield, ArrowLeft } from 'lucide-react'
import { firebaseAuth, storage } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { updateProfile } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useTheme } from '@/contexts/theme-context'
import { ProfileForm } from '@/modules/profile/profile-form'
import { SecuritySection } from '@/modules/profile/security-section'

export default function ProfilePage() {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState('general')
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!firebaseUser) return
    try {
      setSaving(true)
      await updateProfile(firebaseUser, { displayName: userName })
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await firebaseAuth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <nav className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className={`flex items-center gap-2 text-sm transition-colors ${
              isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-64 space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold tracking-tight">Account</h1>
              <nav className="flex flex-col gap-1">
                {[
                  { id: 'general', label: 'General', icon: User },
                  { id: 'security', label: 'Security', icon: Shield },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-150 text-left relative
                      ${activeTab === item.id
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    {activeTab === item.id && (
  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-foreground rounded-full" />
)}
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'general' ? (
              <ProfileForm 
                userName={userName}
                setUserName={setUserName}
                userEmail={userEmail}
                photoURL={photoURL}
                uploading={uploading}
                handlePhotoUpload={handlePhotoUpload}
                handleSaveProfile={handleSaveProfile}
                saving={saving}
                isDarkMode={isDarkMode}
              />
            ) : (
              <SecuritySection 
                handleLogout={handleLogout} 
                isDarkMode={isDarkMode} 
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}