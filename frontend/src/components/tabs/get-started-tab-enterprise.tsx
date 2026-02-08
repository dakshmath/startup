'use client'

import React, { useState, useEffect } from 'react'
import { Send, Brain, Loader2, TrendingUp, BarChart3, Target, AlertCircle, RotateCcw, Edit } from 'lucide-react'
import { ideasApi, chatApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  status?: 'completed' | 'analyzing' | 'failed'
  progress?: string[]
}

interface AnalysisStage {
  id: string
  label: string
  icon: React.ReactNode
  description: string
  isActive: boolean
  isCompleted: boolean
}

// Enterprise-grade typing indicator
const TypingIndicator = ({ stage }: { stage?: string }) => {
  const [dots, setDots] = useState('.')
  const [pulseOpacity, setPulseOpacity] = useState(1)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.')
      setPulseOpacity(prev => prev === 1 ? 0.3 : 1)
    }, 600)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="flex items-center space-x-3 p-4 bg-card/50 backdrop-blur-sm border border-border rounded-xl animate-fade-in">
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">AI is analyzing</p>
          {stage && (
            <p className="text-xs text-muted-foreground transition-opacity duration-300" style={{ opacity: pulseOpacity }}>
              {stage}{dots}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Analysis progress component
const AnalysisProgress = ({ stages, currentStage }: { stages: AnalysisStage[], currentStage: string }) => {
  return (
    <div className="bg-card/30 backdrop-blur-sm border border-border rounded-xl p-6 animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Market Analysis in Progress</h3>
        </div>
        
        <div className="space-y-3">
          {stages.map((stage, index) => (
            <div
              key={stage.id}
              className={`
                flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300
                ${stage.isCompleted 
                  ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                  : stage.isActive 
                  ? 'bg-primary/10 border-primary/30 shadow-sm' 
                  : 'bg-muted/30 border-border'
                }
              `}
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                ${stage.isCompleted 
                  ? 'bg-green-600 text-white' 
                  : stage.isActive 
                  ? 'bg-primary text-primary-foreground animate-pulse' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {stage.isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : stage.icon}
              </div>
              <div className="flex-1">
                <p className={`
                  text-sm font-medium transition-colors duration-300
                  ${stage.isCompleted 
                    ? 'text-green-700 dark:text-green-300' 
                    : stage.isActive 
                    ? 'text-foreground' 
                    : 'text-muted-foreground'
                  }
                `}>
                  {stage.label}
                </p>
                {stage.isActive && (
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs text-muted-foreground animate-pulse">Processing...</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Error state component
const ErrorState = ({ error, onRetry, onEdit }: { error: string; onRetry: () => void; onEdit: () => void }) => {
  return (
    <div className="bg-destructive/5 backdrop-blur-sm border border-destructive/20 rounded-xl p-6 animate-fade-in">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Analysis Failed</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {error}
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={onRetry}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="text-sm font-medium">Retry Analysis</span>
            </button>
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span className="text-sm font-medium">Edit Input</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GetStartedTabEnterprise() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStage, setCurrentStage] = useState('')
  const [error, setError] = useState('')
  const { toast } = useToast()

  const analysisStages: AnalysisStage[] = [
    {
      id: 'market',
      label: 'Market Analysis',
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Analyzing market size and trends',
      isActive: false,
      isCompleted: false
    },
    {
      id: 'competitors',
      label: 'Competitor Research',
      icon: <Target className="h-4 w-4" />,
      description: 'Evaluating competitive landscape',
      isActive: false,
      isCompleted: false
    },
    {
      id: 'insights',
      label: 'Generating Insights',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Creating strategic recommendations',
      isActive: false,
      isCompleted: false
    }
  ]

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setIsAnalyzing(true)
    setError('')

    try {
      // Simulate staged analysis
      setCurrentStage('market')
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setCurrentStage('competitors')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setCurrentStage('insights')
      await new Promise(resolve => setTimeout(resolve, 1500))

      const response = await chatApi.sendMessage([
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        userMessage
      ])

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
        status: 'completed'
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Create idea in backend
      if (response.ideaId) {
        await ideasApi.create({
          title: inputValue.split(':')[0] || 'New Idea',
          description: inputValue,
          tags: [],
          status: 'completed'
        })
      }

      toast({
        title: "Analysis Complete",
        description: "Your market analysis is ready."
      })

    } catch (error: any) {
      console.error('Analysis error:', error)
      setError(error.message || 'Failed to complete analysis. Please try again.')
    } finally {
      setIsLoading(false)
      setIsAnalyzing(false)
      setCurrentStage('')
    }
  }

  const handleRetry = () => {
    setError('')
    handleSendMessage()
  }

  const handleEdit = () => {
    setError('')
    // Restore last user message to input for editing
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()
    if (lastUserMessage) {
      setInputValue(lastUserMessage.content)
    }
  }

  const examplePrompts = [
    { title: "AI-Powered Tutoring", description: "K-12 personalized learning platform" },
    { title: "Sustainable Marketplace", description: "Eco-friendly e-commerce solution" },
    { title: "Smart Home Energy", description: "IoT energy optimization system" }
  ]

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-background via-background to-card/20">
      
      {/* Empty State */}
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-2xl">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <Brain className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                AI Market Intelligence
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg mx-auto">
                Transform your startup idea into actionable insights with comprehensive market analysis, 
                competitive research, and strategic recommendations.
              </p>
              
              {/* Example Prompts */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                  Get Started With Examples
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {examplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(`${prompt.title}: ${prompt.description}`)}
                      className="p-4 bg-card border border-border rounded-xl hover:shadow-lg hover:bg-accent transition-all hover:-translate-y-1 text-left group animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-foreground">{prompt.title}</span>
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Send className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{prompt.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Progress */}
      {isAnalyzing && (
        <div className="flex-1 overflow-y-auto p-6">
          <AnalysisProgress 
            stages={analysisStages.map(stage => ({
              ...stage,
              isActive: stage.id === currentStage,
              isCompleted: analysisStages.indexOf(stage) < analysisStages.findIndex(s => s.id === currentStage)
            }))} 
            currentStage={currentStage}
          />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex-1 overflow-y-auto p-6">
          <ErrorState 
            error={error}
            onRetry={handleRetry}
            onEdit={handleEdit}
          />
        </div>
      )}

      {/* Chat Messages */}
      {!isAnalyzing && !error && messages.length > 0 && (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`
                flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} 
                animate-fade-in
              `}
            >
              <div
                className={`
                  max-w-[85%] rounded-2xl p-4 backdrop-blur-sm transition-all duration-300
                  ${message.role === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto shadow-lg' 
                    : message.role === 'system'
                    ? 'bg-muted/50 border border-border text-muted-foreground text-center italic text-sm'
                    : 'bg-card border border-border mr-auto shadow-sm hover:shadow-md'
                  }
                `}
              >
                {message.status && (
                  <div className={`
                    inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium mb-2
                    ${message.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : message.status === 'analyzing' 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-red-100 text-red-700'
                    }
                  `}>
                    <div className={`
                      w-2 h-2 rounded-full mr-1
                      ${message.status === 'completed' 
                        ? 'bg-green-600' 
                        : message.status === 'analyzing' 
                        ? 'bg-yellow-600' 
                        : 'bg-red-600'
                      }
                    `} />
                    {message.status}
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {message.role === 'assistant' && message.status === 'completed' && (
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 rounded-lg hover:bg-accent transition-colors">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-accent transition-colors">
                        <BarChart3 className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={messages.length === 0 ? "Describe your startup idea for comprehensive analysis..." : "Ask follow-up questions..."}
                className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-ring focus:bg-accent focus:ring-2 focus:ring-ring/20 transition-all resize-none"
                disabled={isLoading || isAnalyzing}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || isAnalyzing}
                  className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                >
                  {isLoading || isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{isAnalyzing ? 'Analyzing...' : 'Processing...'}</span>
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send message</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
