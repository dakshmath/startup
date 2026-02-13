'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, BarChart3, CreditCard, Menu, X, ArrowLeft } from 'lucide-react'
import { firebaseAuth } from '@/lib/firebase'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { GetStartedTabEnterprise } from '@/components/tabs/intelligence-tab'
import { IntelligenceTab } from '@/components/tabs/analysis-tab'
import { PricingCards } from '@/modules/billing/pricing-cards'

export default function Home() {
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState<'chat' | 'intelligence' | 'pricing'>('chat')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<string | number | null>(null) 
  const [userName, setUserName] = useState('')
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null)
  
  const [pastChats, setPastChats] = useState([])

  const tabs = [
    { id: 'chat', label: 'Intelligence', icon: MessageSquare },
    { id: 'intelligence', label: 'Market Analysis', icon: BarChart3 },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
  ]

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'pricing' || tabParam === 'intelligence' || tabParam === 'chat') {
      setActiveTab(tabParam as any);
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  if (isAuthenticated === null || isAuthenticated === false) return null 

  const showSidebar = activeTab !== 'pricing' && sidebarOpen;

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden relative">
      {activeTab !== 'pricing' && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-4 z-50 p-2 rounded-full border border-border bg-card shadow-md transition-all duration-300 ${
            sidebarOpen ? 'left-[240px]' : 'left-4'
          } hover:bg-accent`}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      )}

      {activeTab !== 'pricing' && (
        <Sidebar 
          sidebarOpen={sidebarOpen}
          pastChats={pastChats}
          selectedConversation={selectedConversation}
          setSelectedConversation={(id) => {
            setSelectedConversation(id);
            setActiveTab('chat');
          }}
          setActiveTab={setActiveTab}
        />
      )}

      <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
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
        </div>
      </main>
    </div>
  )
}