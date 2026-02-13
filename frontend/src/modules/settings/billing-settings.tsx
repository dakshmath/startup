'use client'

import React from 'react'
import { Zap, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BillingSettingsProps {
  isDarkMode: boolean
}

export function BillingSettings({ isDarkMode }: BillingSettingsProps) {
  const router = useRouter()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`pb-4 border-b ${isDarkMode ? 'border-white/10' : 'border-black/5'}`}>
        <h3 className="text-xl font-bold text-foreground">Billing & Plan</h3>
        <p className="text-sm text-muted-foreground mt-1">Manage your subscription.</p>
      </div>

      <div className={`relative group p-8 rounded-[45px] border transition-all overflow-hidden ${
        isDarkMode 
          ? 'border-primary/30 bg-gradient-to-br from-primary/10 to-transparent' 
          : 'border-zinc-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
      }`}>
        <Zap className="absolute -top-6 -right-6 w-32 h-32 text-primary opacity-10 group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">Active Plan</span>
          <h4 className="text-4xl font-black mt-4 mb-2">Free Tier</h4>
          <ul className="space-y-2 mb-8 text-sm opacity-70">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 3 AI Analyses per month</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Standard Generation Speed</li>
          </ul>
          <button 
            onClick={() => router.push('/?tab=pricing')}
            className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/25"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  )
}