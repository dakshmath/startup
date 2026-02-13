'use client'

import React from 'react'
import { User, Camera, Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ProfileFormProps {
  userName: string
  setUserName: (val: string) => void
  userEmail: string
  photoURL: string | null
  uploading: boolean
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSaveProfile: () => void
  saving: boolean
  isDarkMode: boolean
}

export function ProfileForm({ 
  userName, 
  setUserName, 
  userEmail, 
  photoURL, 
  uploading, 
  handlePhotoUpload, 
  handleSaveProfile, 
  saving, 
  isDarkMode 
}: ProfileFormProps) {
  return (
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
              <Input 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={isDarkMode ? 'bg-[#0A0A0A] border-white/5 focus:border-primary/50 text-white' : 'bg-white border-zinc-200 focus:border-primary/50 text-black shadow-sm'}
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
          <Button 
            onClick={handleSaveProfile}
            disabled={saving}
            className="px-6 py-3 bg-primary text-white text-xs font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            {saving ? 'Updating...' : 'Save Profile'}
          </Button>
        </div>
      </div>
    </section>
  )
}