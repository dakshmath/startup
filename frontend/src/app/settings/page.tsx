'use client'

import React, { useState } from 'react'
import { Bell, Palette, Shield, ArrowLeft, Moon, Sun, Lock, CreditCard, FileText, Zap, Trash2, ChevronRight, CheckCircle2 } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const { isDarkMode, toggleDarkMode } = useTheme()

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('appearance')
  const [notifications, setNotifications] = useState({
    analysis: true,
    security: true
  })

  // --- UI COMPONENTS ---
  const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: () => void }) => (
    <button
      onClick={(e) => { e.preventDefault(); onChange(); }}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ease-in-out ${
        enabled ? 'bg-primary' : 'bg-zinc-600'
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  )

  const tabItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
  ]

  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out ${
      isDarkMode ? 'bg-[#050505] text-white' : 'bg-zinc-50 text-zinc-900'
    }`}>
      
      {/* Top Navigation */}
      <nav className={`border-b sticky top-0 z-50 transition-colors duration-500 ${
        isDarkMode ? 'border-white/5 bg-black/60 backdrop-blur-xl' : 'border-zinc-200 bg-white/60 backdrop-blur-xl'
      }`}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className={`flex items-center gap-2 text-sm transition-all group ${
              isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black'
            }`}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <nav className="flex flex-col gap-1">
              {tabItems.map((item) => {
                const isActive = activeTab === item.id;
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
                    {/* Active State Vertical Bar */}
                    {isActive && (
                      <div className="absolute left-0 w-1 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                    )}
                    
                    <item.icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-primary' : 'group-hover:text-current'
                    }`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 space-y-10">
            
            {/* Appearance Section */}
            {activeTab === 'appearance' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`pb-4 border-b ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Appearance</h3>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Customize your visual workspace.</p>
                </div>
                
                <div className={`flex items-center justify-between p-6 rounded-3xl border transition-all duration-500 ${
                  isDarkMode ? 'border-white/5 bg-[#0A0A0A]' : 'border-zinc-200 bg-white shadow-sm'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-colors duration-500 ${
                      isDarkMode ? 'bg-white/5 text-primary' : 'bg-zinc-100 text-primary'
                    }`}>
                      {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-orange-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold">Dark Mode</p>
                      <p className="text-xs opacity-50">Switch between light and dark themes.</p>
                    </div>
                  </div>
                  <Toggle enabled={isDarkMode} onChange={toggleDarkMode} />
                </div>
              </div>
            )}

            {/* Billing Section */}
            {activeTab === 'billing' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`pb-4 border-b ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Billing & Plan</h3>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Manage your subscription.</p>
                </div>

                <div className={`relative group p-8 rounded-[2.5rem] border transition-all overflow-hidden ${
                  isDarkMode ? 'border-primary/30 bg-gradient-to-br from-primary/10 to-transparent' : 'border-primary/20 bg-primary/5'
                }`}>
                  <Zap className="absolute -top-6 -right-6 w-32 h-32 text-primary opacity-10 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative z-10">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">Active Plan</span>
                    <h4 className="text-4xl font-black mt-4 mb-2">Free Tier</h4>
                    <ul className="space-y-2 mb-8 text-sm opacity-70">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 3 AI Analyses per month</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Standard Generation Speed</li>
                    </ul>
                    <button className="px-8 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/25">
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`pb-4 border-b ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Notifications</h3>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Configure your alerts.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'analysis', title: 'Analysis Completions', desc: 'Alerts when your AI reports are ready.' },
                    { id: 'security', title: 'Security Alerts', desc: 'Critical account and login notifications.' },
                  ].map((notif) => (
                    <div key={notif.id} className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${
                      isDarkMode ? 'border-white/5 bg-[#0A0A0A]' : 'border-zinc-200 bg-white shadow-sm'
                    }`}>
                      <div>
                        <p className="text-sm font-bold">{notif.title}</p>
                        <p className="text-xs opacity-50">{notif.desc}</p>
                      </div>
                      <Toggle 
                        enabled={notifications[notif.id as keyof typeof notifications]} 
                        onChange={() => setNotifications({...notifications, [notif.id]: !notifications[notif.id as keyof typeof notifications]})} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`pb-4 border-b ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>Security & Privacy</h3>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Legal and data protection.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: FileText, label: 'Terms of Service', sub: 'Legal Terms' },
                    { icon: Lock, label: 'Privacy Policy', sub: 'Data Usage' }
                  ].map((doc, i) => (
                    <button key={i} className={`flex items-center justify-between p-6 rounded-3xl border group transition-all ${
                      isDarkMode ? 'border-white/5 bg-[#0A0A0A] hover:border-primary/30' : 'border-zinc-200 bg-white shadow-sm hover:border-primary/30'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                          <doc.icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold">{doc.label}</p>
                          <p className="text-[10px] uppercase tracking-wider opacity-40 font-bold">{doc.sub}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>

                <div className="pt-8">
                   <div className={`p-8 rounded-[2rem] border transition-all ${isDarkMode ? 'border-red-500/10 bg-red-500/5' : 'border-red-200 bg-red-50'}`}>
                    <p className="text-sm opacity-60 mb-6">Once deleted, your startup ideas and analysis history are gone forever.</p>
                    <button className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-all">
                      <Trash2 className="w-4 h-4" /> Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}