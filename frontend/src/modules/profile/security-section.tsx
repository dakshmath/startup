'use client'

import React from 'react'
import { FileJson, ChevronRight, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SecuritySectionProps {
  handleLogout: () => void
  isDarkMode: boolean
}

export function SecuritySection({ handleLogout, isDarkMode }: SecuritySectionProps) {
  return (
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
          <Button 
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>
    </section>
  )
}