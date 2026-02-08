'use client'

import React, { useState, useEffect } from 'react'
import { User, Settings, CreditCard, LogOut, Camera } from 'lucide-react'
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
      console.error(err)
      alert('Failed to upload photo')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!firebaseUser) return

    try {
      setSaving(true)

      await updateProfile(firebaseUser, {
        displayName: userName,
        photoURL: photoURL || undefined,
      })

      if (firebaseUser.email !== userEmail) {
        await updateEmail(firebaseUser, userEmail)
      }

      alert('Profile updated!')
    } catch (err) {
      console.error(err)
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await firebaseAuth.signOut()
      localStorage.removeItem('firebase_token')
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const initials = userName
    ? userName.split(' ').map((n) => n[0]).join('').toUpperCase()
    : 'U'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Intelligence
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* User Info Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">User Information</h2>
              
              <div className="flex items-center space-x-4 mb-6 relative">

                {/* Profile Picture */}
                <div className="relative">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-700">
                      {initials}
                    </div>
                  )}

                  {/* Upload Button */}
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{userName}</h3>
                  <p className="text-gray-600">{userEmail}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving || uploading}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving || uploading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Current Plan */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h2>
              
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{currentPlan}</h3>
                <p className="text-gray-600 mb-4">5 ideas per month</p>
                
                <button className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Upgrade Plan
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/settings')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span>Account Settings</span>
                </button>
                
                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}