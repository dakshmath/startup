'use client'

import React from 'react'
import { Settings } from 'lucide-react'
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
    <header className="flex items-center bg-card/40 backdrop-blur-xl border border-border/40 rounded-full px-2 py-1.5">
      <nav className="flex items-center gap-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-full text-[10.25px] uppercase tracking-[0.12em] transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-foreground font-black' 
                : 'text-muted-foreground/40 font-bold hover:text-foreground/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-1 ml-4 pr-1">
        <button 
          onClick={() => router.push('/settings')}
          className="p-2 text-muted-foreground/60 hover:text-foreground transition-all rounded-full"
        >
          <Settings className="h-[16px] w-[16px]" />
        </button>
        
        <div className="h-4 w-[1px] bg-border/40 mx-1" />
        
        <button 
          onClick={() => router.push('/profile')}
          className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center overflow-hidden hover:scale-105 transition-all border border-border/50"
        >
          {userPhotoURL ? (
            <img src={userPhotoURL} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] font-black">{userName?.charAt(0).toUpperCase()}</span>
          )}
        </button>
      </div>
    </header>
  )
}