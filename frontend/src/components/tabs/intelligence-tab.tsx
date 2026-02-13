'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Send, Brain, Loader2, TrendingUp, BarChart3, Target, AlertCircle, RotateCcw, Edit, Mic, ChevronRight } from 'lucide-react'
import { ideasApi, chatApi } from '@/lib/api'
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
  const [isRecording, setIsRecording] = useState(false)
  
  const { toast } = useToast()
  const recognitionRef = useRef<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const examplePrompts = [
    { title: "AI-Powered Tutoring", description: "K-12 personalized learning platform" },
    { title: "Sustainable Marketplace", description: "Eco-friendly e-commerce solution" },
    { title: "Smart Home Energy", description: "IoT energy optimization system" }
  ]

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isAnalyzing])

  // Reset/Load History logic
  useEffect(() => {
    if (selectedId) {
      // Logic to fetch past messages would go here
    } else {
      setMessages([])
    }
  }, [selectedId])

  // Initialize Mic (Speech Recognition)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.lang = "en-US"
        recognition.continuous = false
        recognition.interimResults = false

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInputValue(transcript)
          setIsRecording(false)
        }

        recognition.onerror = () => setIsRecording(false)
        recognition.onend = () => setIsRecording(false)

        recognitionRef.current = recognition
      }
    }
  }, [])

  useEffect(() => {
    const user = firebaseAuth.getCurrentUser()
    if (user) setUserName(user.displayName || user.email?.split('@')[0] || '')
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({ title: "Not Supported", description: "Speech recognition is not supported in this browser.", variant: "destructive" })
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      setIsRecording(true)
      recognitionRef.current.start()
    }
  }

  const handleSendMessage = async (textOverride?: string) => {
    const messageText = textOverride || inputValue
    if (!messageText.trim() || isLoading) return

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: messageText, 
      timestamp: new Date() 
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsLoading(true)
    setIsAnalyzing(true)

    try {
      setCurrentStage('Market Momentum'); await new Promise(r => setTimeout(r, 1000));
      setCurrentStage('Competitor Research'); await new Promise(r => setTimeout(r, 1000));
      setCurrentStage('Public Demand'); await new Promise(r => setTimeout(r, 1000));

      const response = await chatApi.sendMessage([...messages, userMsg])
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        status: 'completed'
      }])
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
      setIsAnalyzing(false)
      setCurrentStage('')
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Empty State with Example Prompts */}
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-2xl w-full">
              <div className="mb-8 pt-12">
                <h1 className="text-4xl font-bold text-foreground mb-6 tracking-tight">
                  Hey {userName || 'there'}!
                </h1>
                <p className="text-base text-muted-foreground mb-10 leading-relaxed">
                  Validate your startup idea with AI-powered market analysis
                </p>
                
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-[0.2em] mb-6">
                    Get Started With Examples
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {examplePrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(`${prompt.title}: ${prompt.description}`)}
                        className="p-5 bg-card border-2 border-border rounded-2xl hover:shadow-xl hover:-translate-y-1 text-left group transition-all duration-300 ease-out"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-foreground">{prompt.title}</span>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center border border-border group-hover:border-primary group-hover:bg-primary/10 transition-all">
                            <Send className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-snug">{prompt.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-4' : 'bg-card border border-border mr-4'}`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
              {msg.role === 'assistant' && msg.status === 'completed' && (
                <button 
                  onClick={onViewAnalysis}
                  className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-all group"
                >
                  <BarChart3 className="w-4 h-4" /> See Market Analysis <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="flex justify-start">
            <div className="bg-card border border-border p-5 rounded-2xl shadow-sm w-full max-w-sm space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <p className="text-sm font-bold">Researching {currentStage}...</p>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full animate-pulse-slow w-1/2" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3 bg-card border border-border rounded-full px-4 py-2 shadow-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <button 
            onClick={toggleRecording}
            className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-accent text-muted-foreground'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
          
          <input 
            className="flex-1 bg-transparent outline-none text-sm py-2" 
            placeholder={messages.length === 0 ? "Describe your startup idea..." : "Ask follow-up questions..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          
          <button 
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 bg-primary text-primary-foreground rounded-full shadow-md hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}