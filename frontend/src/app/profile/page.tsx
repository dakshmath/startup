'use client'

import React, { useState, useEffect } from 'react'
import { User, Shield, ArrowLeft, Camera, Mail, Zap, LogOut, FileJson, ChevronRight } from 'lucide-react'
import { firebaseAuth, storage } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { updateProfile } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useTheme } from '@/contexts/theme-context'

export default function ProfilePage() {
  const router = useRouter()
  const { isDarkMode } = useTheme()
  
  // --- STATE ---
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

  const navItems = [
    { id: 'general', label: 'General', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDarkMode ? 'bg-[#050505] text-white' : 'bg-zinc-50 text-zinc-900'
    }`}>
      {/* Top Navigation */}
      <nav className={`border-b sticky top-0 z-50 transition-colors duration-500 ${
        isDarkMode ? 'border-white/5 bg-black/50 backdrop-blur-xl' : 'border-zinc-200 bg-white/80 backdrop-blur-xl'
      }`}>
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
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 space-y-8">
            <div className="space-y-4">
              <h1 className="text-2xl font-bold tracking-tight">Account</h1>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                        isActive 
                          ? 'text-primary' 
                          : isDarkMode 
                            ? 'text-zinc-400 hover:text-white hover:bg-white/5' 
                            : 'text-zinc-500 hover:text-black hover:bg-zinc-100'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 w-1 h-4 bg-primary rounded-full" />
                      )}
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Plan Card */}
            <div className={`p-5 rounded-[2rem] border transition-all ${
              isDarkMode ? 'border-primary/20 bg-primary/5' : 'border-primary/10 bg-white shadow-sm'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Free Plan</span>
              </div>
              <p className="text-xs opacity-60 mb-4 font-medium">Unlock priority AI features.</p>
              <button className="w-full py-2.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                Upgrade
              </button>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="flex-1">
            
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`pb-4 border-b ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
                  <h3 className="text-xl font-bold">Profile Details</h3>
                  <p className="text-sm opacity-60 mt-1">Manage how you appear to others.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-8 items-start">
                  <div className="relative group">
                    <div className={`w-24 h-24 rounded-full border overflow-hidden relative ${
                      isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-zinc-200 shadow-sm'
                    }`}>
                      {photoURL ? (
                        <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                          <User className="w-10 h-10" />
                        </div>
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-1 -right-1 p-2 bg-primary text-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-xl">
                      <Camera className="w-4 h-4" />
                      <input type="file" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>

                  <div className="flex-1 w-full space-y-6">
                    <div className="grid grid-cols-1 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest opacity-50 px-1">Display Name</label>
                        <input 
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className={`w-full rounded-2xl px-4 py-3 text-sm outline-none transition-all border ${
                            isDarkMode 
                              ? 'bg-[#0A0A0A] border-white/5 focus:border-primary/50' 
                              : 'bg-white border-zinc-200 focus:border-primary/50 shadow-sm'
                          }`}
                        />
                      </div>
                      <div className="space-y-2 opacity-60">
                        <label className="text-[10px] font-black uppercase tracking-widest px-1">Email Address</label>
                        <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm border ${
                          isDarkMode ? 'bg-[#0A0A0A] border-white/5' : 'bg-zinc-100 border-zinc-200'
                        }`}>
                          <Mail className="w-4 h-4 opacity-30" />
                          {userEmail}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-3 bg-primary text-white text-xs font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                      {saving ? 'Updating...' : 'Save Profile'}
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <section className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`pb-4 border-b ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
                  <h3 className="text-xl font-bold">Account Security</h3>
                  <p className="text-sm opacity-60 mt-1">Manage your access and data privacy.</p>
                </div>

                <div className="space-y-4">
                  <button className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all group ${
                    isDarkMode ? 'bg-[#0A0A0A] border-white/5 hover:border-primary/40' : 'bg-white border-zinc-200 hover:border-primary/40 shadow-sm'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <FileJson className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold">Export Workspace</p>
                        <p className="text-xs opacity-50">Download all your data as JSON.</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-20 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                  </button>

                  <div className={`p-8 rounded-[2rem] border transition-all ${
                    isDarkMode ? 'border-red-500/10 bg-red-500/5' : 'border-red-200 bg-red-50'
                  }`}>
                    <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-4">Account Management</h4>
                    <p className="text-sm opacity-60 mb-6 font-medium">Signing out will end your current session. You will need to log back in to access your projects.</p>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-all"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </section>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}