'use client'

import React from 'react'
import { Sparkles, Settings, User } from 'lucide-react'
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
      <header className="flex items-center justify-between px-6 py-2 bg-background/60 backdrop-blur-xl border border-border rounded-full w-[90%] max-w-4xl pointer-events-auto shadow-2xl">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-foreground rounded-lg flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-background" />
          </div>
          <span className="text-[13px] font-black tracking-tighter text-foreground uppercase italic">StartupName</span>
        </div>

        <nav className="flex items-center space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

        <div className="flex-center flex items-center space-x-3">
          <button onClick={() => router.push('/settings')} className="text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="h-4 w-4" />
          </button>
          <div className="h-3 w-[1px] bg-border" />
          <button 
            onClick={() => router.push('/profile')} 
            className="relative w-8 h-8 rounded-full overflow-hidden border border-border hover:border-primary transition-all hover:scale-105 bg-background"
          >
            {userPhotoURL ? (
              <img src={userPhotoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-semibold">
                {userName ? userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
            )}
          </button>
        </div>
      </header>
    </div>
  )
}