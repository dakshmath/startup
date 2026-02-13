'use client'

import React from 'react'
import { FileText, Lock, Trash2, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SecuritySettingsProps {
  isDarkMode: boolean
}

export function SecuritySettings({ isDarkMode }: SecuritySettingsProps) {
  const router = useRouter()

  const legalLinks = [
    { 
      icon: FileText, 
      label: 'Terms of Service', 
      sub: 'Legal Terms',
      path: '/terms' 
    },
    { 
      icon: Lock, 
      label: 'Privacy Policy', 
      sub: 'Data Usage',
      path: '/privacy' 
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`pb-4 border-b ${isDarkMode ? 'border-white/10' : 'border-black/5'}`}>
        <h3 className="text-xl font-bold text-foreground">Security & Privacy</h3>
        <p className="text-sm text-muted-foreground mt-1">Legal and data protection.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {legalLinks.map((doc, i) => (
          <button 
            key={i} 
            onClick={() => router.push(doc.path)}
            className={`flex items-center justify-between p-6 transition-all group ${
              isDarkMode 
                ? 'rounded-[32px] border border-white/5 bg-[#0A0A0A] hover:border-primary/30' 
                : 'rounded-[45px] border border-zinc-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/30'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl transition-all ${
                isDarkMode 
                  ? 'bg-white/5 text-primary group-hover:bg-primary group-hover:text-white' 
                  : 'bg-zinc-100 text-primary group-hover:bg-primary group-hover:text-white'
              }`}>
                <doc.icon className="w-5 h-5" />
              </div>
              
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">{doc.label}</p>
                <p className="text-[10px] uppercase tracking-wider opacity-40 font-bold">{doc.sub}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
          </button>
        ))}
      </div>

      <div className="pt-8">
         <div className={`p-8 rounded-[40px] border transition-all ${
           isDarkMode ? 'border-red-500/10 bg-red-500/5' : 'border-red-200 bg-red-50/50 shadow-sm'
         }`}>
          <p className="text-sm text-muted-foreground mb-6 font-medium">Once deleted, your startup ideas and analysis history are gone forever.</p>
          <button className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white text-xs font-bold rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}