'use client'

import React from 'react'
import { Settings, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  tabs: { id: string; label: string; icon: any }[]; 
  userName: string;
  userPhotoURL: string | null;
}

export function Navbar({ activeTab, setActiveTab, tabs, userName, userPhotoURL }: NavbarProps) {
  const router = useRouter()

  return (
    <div className="absolute top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <header className="flex items-center justify-between px-8 py-2 bg-background/60 backdrop-blur-xl border border-border rounded-full w-[55%] max-w-4xl pointer-events-auto shadow-2xl">
        
        <div className="w-10 hidden md:block" />

        <nav className="flex items-center space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-[#4ade80] scale-105'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          <button 
            onClick={() => router.push('/settings')} 
            className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full flex items-center justify-center"
          >
            <Settings className="h-4 w-4" />
          </button>
          
          <div className="h-4 w-[1px] bg-border/60" />
          
          <button 
            onClick={() => router.push('/profile')} 
            className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-all active:scale-95 bg-muted flex items-center justify-center"
          >
            {userPhotoURL ? (
              <img src={userPhotoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[11px] font-black text-foreground">
                {userName ? userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
            )}
          </button>
        </div>
      </header>
    </div>
  )
}