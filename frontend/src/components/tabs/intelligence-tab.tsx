'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Send, Loader2, BarChart3, Mic, ChevronRight, Sparkles } from 'lucide-react'
import { chatApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { firebaseAuth } from '@/lib/firebase'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  status?: 'completed' | 'analyzing' | 'failed'
}

export function GetStartedTabEnterprise({ selectedId, onViewAnalysis }: { selectedId: any, onViewAnalysis: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStage, setCurrentStage] = useState('')
  const [userName, setUserName] = useState('')
  const [greeting, setGreeting] = useState('Good morning')
  
  const { toast } = useToast()
  const scrollRef = useRef<HTMLDivElement>(null)

  const examplePrompts = [
    { title: "AI-Powered Tutoring", description: "K-12 personalized learning platform" },
    { title: "Sustainable Marketplace", description: "Eco-friendly e-commerce solution" },
    { title: "Smart Home Energy", description: "IoT energy optimization system" }
  ]

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Morning');
    else if (hour < 18) setGreeting('Afternoon');
    else setGreeting('Evening');
  }, []);

  useEffect(() => {
    const user = firebaseAuth.getCurrentUser()
    if (user) setUserName(user.displayName || user.email?.split('@')[0] || 'daksh')
  }, [])

  const handleSendMessage = async (textOverride?: string) => {
    const messageText = textOverride || inputValue
    if (!messageText.trim() || isLoading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: messageText, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsLoading(true)
    setIsAnalyzing(true)

    try {
      setCurrentStage('Market Momentum'); await new Promise(r => setTimeout(r, 800));
      setCurrentStage('Competitor Research'); await new Promise(r => setTimeout(r, 800));
      const response = await chatApi.sendMessage([...messages, userMsg])
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: response.message, timestamp: new Date(), status: 'completed' }])
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setIsLoading(false); setIsAnalyzing(false); setCurrentStage('');
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-2xl w-full">
              <div className="mb-8 pt-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                    <Sparkles className="h-6 w-6 text-background" />
                  </div>
                  <h1 className="text-4xl font-bold text-foreground tracking-tight">
                    {greeting}, {userName}
                  </h1>
                </div>
                <p className="text-base text-muted-foreground mb-10 leading-relaxed">
                  Validate your startup idea with AI-powered market analysis
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {examplePrompts.map((prompt, index) => (
                    <button key={index} onClick={() => handleSendMessage(`${prompt.title}: ${prompt.description}`)} className="p-5 bg-card border-2 border-border rounded-2xl hover:shadow-xl hover:-translate-y-1 text-left group transition-all duration-300 ease-out">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-foreground">{prompt.title}</span>
                        <Send className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-snug">{prompt.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3 bg-card border border-border rounded-full px-4 py-2 shadow-xl">
          <Mic className="w-5 h-5 text-muted-foreground" />
          <input className="flex-1 bg-transparent outline-none text-sm py-2" placeholder="Describe your startup idea..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
          <button onClick={() => handleSendMessage()} className="p-2.5 bg-primary text-primary-foreground rounded-full"><Send className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  )
}