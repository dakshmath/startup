'use client'

import React, { useState, useEffect } from 'react'
import { Send, Sparkles, Lightbulb, TrendingUp, Zap, Target } from 'lucide-react'
import { ideasApi, chatApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function GetStartedTab() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDeepResearch, setShowDeepResearch] = useState(false)
  const [currentIdeaId, setCurrentIdeaId] = useState<number | null>(null)
  const { toast } = useToast()

  // Check for pre-filled idea on mount
  useEffect(() => {
    const prefillIdea = localStorage.getItem('prefill_idea')
    if (prefillIdea) {
      setInputValue(prefillIdea)
      localStorage.removeItem('prefill_idea') // Clear after using
    }
  }, [])

  const inspirationExamples = [
    {
      icon: <Lightbulb className="h-5 w-5" />,
      title: "AI-Powered Tutoring Platform",
      description: "Personalized learning with adaptive AI tutors for K-12 students"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Sustainable E-Marketplace",
      description: "Eco-friendly products marketplace with carbon footprint tracking"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Smart Home Energy Manager",
      description: "IoT device integration for real-time energy optimization"
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Mental Health Companion App",
      description: "AI-driven mood tracking and personalized wellness recommendations"
    }
  ]

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setInputValue('')

    try {
      // Create idea in backend first
      const idea = await ideasApi.create({
        title: inputValue.split(':')[0] || 'New Idea',
        description: inputValue,
        tags: [],
        status: 'pending'
      })
      setCurrentIdeaId(idea.id)

      // Send to AI chat
      const response = await chatApi.sendMessage([
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: inputValue }
      ], idea.id)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Check if AI suggests deep research
      if (response.message.toLowerCase().includes('deep research') || 
          response.message.toLowerCase().includes('comprehensive analysis')) {
        setShowDeepResearch(true)
      }

    } catch (error) {
      console.error('Chat error:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeepResearch = async () => {
    if (!currentIdeaId) return
    
    try {
      // Import analysis API dynamically to avoid circular dependency
      const { analysisApi } = await import('@/lib/api')
      await analysisApi.start(currentIdeaId)
      
      toast({
        title: "Deep Research Started",
        description: "Analyzing your idea with advanced AI..."
      })
    } catch (error) {
      console.error('Deep research error:', error)
      toast({
        title: "Error", 
        description: "Failed to start deep research.",
        variant: "destructive"
      })
    }
  }

  const handleExampleClick = (example: typeof inspirationExamples[0]) => {
    setInputValue(`${example.title}: ${example.description}`)
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              What's your startup idea?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              I'm your AI market intelligence analyst. Share your concept and I'll help you analyze its potential, identify opportunities, and refine your strategy.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {/* Deep Research Button */}
        {showDeepResearch && (
          <div className="text-center py-4">
            <button
              onClick={handleDeepResearch}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>Run Deep Research</span>
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inspiration Examples */}
      {messages.length === 0 && (
        <div className="border-t border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Need inspiration?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inspirationExamples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <div className="text-gray-600 dark:text-gray-400">
                  {example.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {example.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {example.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Describe your startup idea..."
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
