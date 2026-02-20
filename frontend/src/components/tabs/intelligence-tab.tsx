'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Mic, Sparkles, ArrowUp, Loader2 } from 'lucide-react'
import { chatApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { firebaseAuth } from '@/lib/firebase'

const EXAMPLE_PROMPTS = [
  { num: '01', title: 'AI-Powered Tutoring', description: 'K-12 personalized learning platform' },
  { num: '02', title: 'Sustainable Marketplace', description: 'Eco-friendly e-commerce solution' },
  { num: '03', title: 'Smart Home Energy', description: 'IoT energy optimization system' },
]

export function GetStartedTabEnterprise({
  selectedId,
  onViewAnalysis,
}: {
  selectedId: any
  onViewAnalysis: () => void
}) {
  const [messages, setMessages] = useState<any[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [currentStage, setCurrentStage] = useState('')
  const [userName, setUserName] = useState('')
  const [greeting, setGreeting] = useState('Hey')

  const { toast } = useToast()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const phrases = [
      'Drop the idea',
      'Pitch it to me',
      'Show me the idea',
      "Let's get to work",
    ]
    setGreeting(phrases[Math.floor(Math.random() * phrases.length)])
  
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) setUserName(user.displayName || user.email?.split('@')[0] || 'daksh')
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAnalyzing])

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition)
      return toast({ title: 'Unsupported', description: 'Voice typing is not available.' })

    const recognition = new SpeechRecognition()
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (e: any) => setInputValue(e.results[0][0].transcript)
    recognition.start()
  }

  const handleExampleClick = (text: string) => {
    setInputValue(text)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleSendMessage = async (textOverride?: string) => {
    const text = textOverride || inputValue
    if (!text.trim() || isLoading) return

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsLoading(true)
    setIsAnalyzing(true)

    try {
      setCurrentStage('Market Momentum')
      await new Promise((r) => setTimeout(r, 800))
      setCurrentStage('Competitor Research')
      await new Promise((r) => setTimeout(r, 800))
      const response = await chatApi.sendMessage([...messages, userMsg])
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date(),
        },
      ])
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    } finally {
      setIsLoading(false)
      setIsAnalyzing(false)
      setCurrentStage('')
    }
  }

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto relative">

      <div className="flex-1 overflow-y-auto px-2 pt-12 pb-36 custom-scrollbar">

      {messages.length === 0 && (
  <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-500">

    <div className="relative flex items-center justify-center mb-2 mt-4">
      <h1 className="tracking-tight leading-tight">
        <span className="text-4xl font-extralight text-muted-foreground">{greeting}, </span>
        <span className="text-4xl font-black text-foreground">{userName}</span>
      </h1>
    </div>
            <p className="text-muted-foreground text-[14px] mb-12 max-w-xs leading-relaxed">
              Validate your startup idea with AI-powered market analysis
            </p>

            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-4">
              Try an example
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 w-full">
              {EXAMPLE_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(`${prompt.title}: ${prompt.description}`)}
                  className="relative p-4 bg-card border border-border rounded-xl text-left hover:bg-muted transition-colors duration-150 active:scale-[0.99]"
                >
                  <span className="absolute top-3.5 right-3.5 text-[10px] font-black text-muted-foreground/20 tabular-nums">
                    {prompt.num}
                  </span>
                  <p className="font-semibold text-[13px] text-foreground mb-1 leading-snug pr-6">
                    {prompt.title}
                  </p>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    {prompt.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-[78%] bg-muted border border-border rounded-2xl rounded-tr-sm px-4 py-3">
                  <p className="text-[14px] leading-relaxed text-foreground font-medium">
                    {msg.content}
                  </p>
                </div>
              ) : (
                <div className="max-w-[88%] flex items-start gap-3">
                  <div className="w-6 h-6 bg-foreground text-background rounded-lg flex items-center justify-center mt-0.5 shrink-0">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <p className="text-[14px] leading-relaxed text-foreground pt-0.5">
                    {msg.content}
                  </p>
                </div>
              )}
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex items-center gap-3 animate-in fade-in duration-200">
              <div className="w-6 h-6 bg-foreground text-background rounded-lg flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3" />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-muted-foreground dot-1" />
                  <div className="w-1 h-1 rounded-full bg-muted-foreground dot-2" />
                  <div className="w-1 h-1 rounded-full bg-muted-foreground dot-3" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {currentStage}
                </span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="absolute bottom-6 inset-x-0 px-2">
        <div className="flex items-center bg-card border border-border rounded-full py-2 pl-4 pr-2.5 transition-colors duration-150 focus-within:border-muted-foreground/30">

          <button
            onClick={startListening}
            className={`p-1.5 rounded-full mr-1 transition-colors duration-150 ${
              isListening
                ? 'text-foreground'
                : 'text-muted-foreground/40 hover:text-foreground hover:bg-muted'
            }`}
          >
            <Mic size={17} />
          </button>

          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none text-[14px] font-medium placeholder:text-muted-foreground/40 text-foreground py-1.5 px-1"
            placeholder="Describe your startup idea..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />

          {(inputValue.trim() || isLoading) && (
            <button
              onClick={() => handleSendMessage()}
              className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center ml-2 shrink-0 hover:opacity-80 active:scale-95 transition-all duration-150 animate-in fade-in zoom-in-95 duration-150"
            >
              {isLoading
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <ArrowUp size={15} strokeWidth={2.5} />
              }
            </button>
          )}
        </div>

        {messages.length === 0 && (
          <p className="text-center text-[11px] text-muted-foreground/30 mt-2.5 tracking-wide">
            Press Enter to send
          </p>
        )}
      </div>

    </div>
  )
}