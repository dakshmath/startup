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
  const [activeTab, setActiveTab] = useState<'chat' | 'intelligence' | 'pricing' | 'support'>('chat')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<string | number | null>(null)
  const [userName, setUserName] = useState('')
  const [userPhotoURL, setUserPhotoURL] = useState<string | null>(null)
  const [pastChats, setPastChats] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'chat', label: 'Intelligence', icon: MessageSquare },
    { id: 'intelligence', label: 'Analysis', icon: BarChart3 },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
    { id: 'support', label: 'Support', icon: LifeBuoy },
  ]

  const filteredChats = useMemo(() => {
    return pastChats.filter((chat: any) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [pastChats, searchQuery])

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true)
        setUserName(user.displayName || user.email?.split('@')[0] || 'daksh')
        setUserPhotoURL(user.photoURL || null)
      } else {
        setIsAuthenticated(false)
        router.push('/login')
      }
    })
    return () => unsubscribe()
  }, [router])

  if (isAuthenticated === null) return null

  return (
    <div className="h-screen w-full flex bg-background text-foreground overflow-hidden">

      {/* ── SIDEBAR (H-20 SYNC) ── */}
      {activeTab !== 'pricing' && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          pastChats={filteredChats}
          selectedConversation={selectedConversation}
          setSelectedConversation={(id: any) => {
            setSelectedConversation(id)
            setActiveTab('chat')
          }}
          setActiveTab={setActiveTab}
          onSearch={setSearchQuery}
        />
      )}

      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">

        {/* ── HEADER (NO BORDER, BIG EVO, H-20) ── */}
        <header className="h-20 flex items-center px-6 shrink-0 relative z-[60] bg-background">
          <div className="flex items-center h-full">
            <span className="text-[28px] font-[1000] tracking-[-0.06em] uppercase select-none text-foreground leading-none">
              EVO
            </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto">
              <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
                userName={userName}
                userPhotoURL={userPhotoURL}
              />
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'pricing' ? (
            <div className="absolute inset-0 overflow-y-auto">
              <PricingCards />
            </div>
          ) : (
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
              <div className="w-full max-w-5xl mx-auto px-6 pt-16">
                {activeTab === 'chat' && (
                  <GetStartedTabEnterprise
                    key={selectedConversation?.toString() || 'new-chat'}
                    selectedId={selectedConversation}
                    onViewAnalysis={() => setActiveTab('intelligence')}
                  />
                )}

                {activeTab === 'intelligence' && (
                  <div className="pb-10 pt-4">
                    <div className="bg-card border border-border rounded-[32px] p-8">
                      <IntelligenceTab selectedId={selectedConversation} />
                    </div>
                  </div>
                )}

                {activeTab === 'support' && (
                  <div className="h-full">
                    <SupportTab />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}