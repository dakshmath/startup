'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, BarChart3, CreditCard, LifeBuoy } from 'lucide-react'
import { firebaseAuth } from '@/lib/firebase'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { GetStartedTabEnterprise } from '@/components/tabs/intelligence-tab'
import { IntelligenceTab } from '@/components/tabs/analysis-tab'
import { PricingCards } from '@/modules/billing/pricing-cards'
import { SupportTab } from '@/components/tabs/support-tab'

export default function Home() {
  const router = useRouter()
  
  // State Management
  const [activeTab, setActiveTab] = useState<'chat' | 'intelligence' | 'pricing' | 'support'>('chat')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<string | number | null>(null) 
  const [userName, setUserName] = useState('')
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null)
  const [pastChats, setPastChats] = useState([]) 
  const [searchQuery, setSearchQuery] = useState('')

  // Tab Configuration for Navbar
  const tabs = [
    { id: 'chat', label: 'Intelligence', icon: MessageSquare },
    { id: 'intelligence', label: 'Market Analysis', icon: BarChart3 },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
    { id: 'support', label: 'Support', icon: LifeBuoy },
  ]

  // Filter chats based on search input from Sidebar
  const filteredChats = useMemo(() => {
    return pastChats.filter((chat: any) => 
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [pastChats, searchQuery])

  // Auth Observer
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true)
        setUserName(user.displayName || user.email?.split('@')[0] || '')
        setUserPhotoURL(user.photoURL || null)
      } else {
        setIsAuthenticated(false)
        router.push('/login')
      }
    })
    return () => unsubscribe()
  }, [router])

  // URL Sync for Direct Links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get('tab')
    if (['pricing', 'intelligence', 'chat', 'support'].includes(tabParam as string)) {
      setActiveTab(tabParam as any)
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  if (isAuthenticated === null || isAuthenticated === false) return null 

  const isSidebarHidden = activeTab === 'pricing'

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden relative">
      {!isSidebarHidden && (
        <Sidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          pastChats={filteredChats}
          selectedConversation={selectedConversation}
          setSelectedConversation={(id) => {
            setSelectedConversation(id)
            setActiveTab('chat')
          }}
          setActiveTab={setActiveTab}
          onSearch={setSearchQuery}
        />
      )}

      <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
        <div className="absolute top-8 left-10 z-[60] flex items-center pointer-events-none transition-all duration-300">
           <span className="text-[16px] font-black tracking-tighter text-foreground uppercase">
              StartupName
           </span>
        </div>

        <Navbar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
          userName={userName}
          userPhotoURL={userPhotoURL}
        />

        <div className="flex-1 flex flex-col overflow-hidden pt-28">
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col items-center overflow-hidden">
              <div className="w-full max-w-4xl flex-1 flex flex-col px-4 min-h-0">
                <GetStartedTabEnterprise 
                  key={selectedConversation?.toString() || 'new-chat'} 
                  selectedId={selectedConversation} 
                  onViewAnalysis={() => setActiveTab('intelligence')} 
                />
              </div>
            </div>
          )}

          {activeTab === 'intelligence' && (
            <div className="flex-1 overflow-hidden px-6 pb-6">
              <div className="max-w-6xl mx-auto h-full bg-card border border-border rounded-[32px] p-6 overflow-y-auto custom-scrollbar shadow-sm">
                <IntelligenceTab selectedId={selectedConversation} />
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="flex-1 overflow-hidden px-6 pb-6 animate-in fade-in duration-500">
              <div className="max-w-7xl mx-auto h-full overflow-y-auto custom-scrollbar">
                <PricingCards />
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="flex-1 overflow-hidden px-6 pb-6 animate-in fade-in duration-500">
              <div className="max-w-7xl mx-auto h-full overflow-y-auto custom-scrollbar">
                <SupportTab />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}