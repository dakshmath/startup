'use client'

import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, DollarSign, MessageSquare, Eye, Lock, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIdea } from '@/contexts/idea-context'
import { analysisApi, ideasApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { AnalysisCard } from '@/components/analysis/analysis-card'
import { PaywallModal } from '@/modules/billing/paywall-modal'

interface IntelligenceTabProps {
  selectedId: string | number | null
}

export function IntelligenceTab({ selectedId }: IntelligenceTabProps) {
  const { state, dispatch } = useIdea()
  const { toast } = useToast()
  const [showPaywall, setShowPaywall] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // FIX: Force numeric conversion to stop the TypeScript error
  useEffect(() => {
    if (selectedId !== null) {
      const numericId = typeof selectedId === 'string' ? parseInt(selectedId, 10) : selectedId;
      if (!isNaN(numericId)) {
        loadAnalysisById(numericId);
      }
    } else if (state.currentIdea && !state.currentAnalysis) {
      loadAnalysis();
    }
  }, [selectedId, state.currentIdea]);

  const loadAnalysisById = async (id: number) => {
    try {
      // Now 'id' is guaranteed to be a number here
      const analysis = await analysisApi.getByIdeaId(id)
      dispatch({ type: 'SET_CURRENT_ANALYSIS', payload: analysis })
    } catch (error) {
      console.error("No analysis found for this ID")
    }
  }

  const loadAnalysis = async () => {
    if (!state.currentIdea) return
    try {
      const analysis = await analysisApi.getByIdeaId(state.currentIdea.id)
      dispatch({ type: 'SET_CURRENT_ANALYSIS', payload: analysis })
    } catch (error) {
      // Analysis might not exist yet
    }
  }

  const startAnalysis = async () => {
    if (!state.currentIdea) return

    setIsAnalyzing(true)
    try {
      const analysis = await analysisApi.start(state.currentIdea.id)
      dispatch({ type: 'SET_CURRENT_ANALYSIS', payload: analysis })
      
      const updatedIdea = await ideasApi.update(state.currentIdea.id, { status: 'analyzing' })
      dispatch({ type: 'UPDATE_IDEA', payload: updatedIdea })

      toast({
        title: "Analysis started",
        description: "Your idea is being analyzed. This may take a few minutes.",
      })

      pollForCompletion(analysis.id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start analysis. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const pollForCompletion = async (analysisId: number) => {
    const pollInterval = setInterval(async () => {
      try {
        const analysis = await analysisApi.getById(analysisId)
        dispatch({ type: 'SET_CURRENT_ANALYSIS', payload: analysis })

        if (analysis.status === 'completed') {
          clearInterval(pollInterval)
          toast({
            title: "Analysis complete!",
            description: "Your market analysis is ready to view.",
          })
        } else if (analysis.status === 'failed') {
          clearInterval(pollInterval)
          toast({
            title: "Analysis failed",
            description: "There was an error analyzing your idea. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        clearInterval(pollInterval)
      }
    }, 5000)

    setTimeout(() => clearInterval(pollInterval), 300000)
  }

  const handleUpgradeClick = () => {
    setShowPaywall(true)
  }

  if (!selectedId && !state.currentIdea) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center">
        <div className="p-4 rounded-full bg-muted mb-4">
          <BarChart3 className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No Idea Selected</h3>
        <p className="text-muted-foreground max-w-xs mx-auto mb-6">
          Select a past chat or start a new conversation to generate market data.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {state.currentIdea && (
        <div className="bg-card rounded-[32px] border border-border p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-foreground">
                {state.currentIdea.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                {state.currentIdea.description}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                  ${state.currentIdea.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                    state.currentIdea.status === 'analyzing' ? 'bg-yellow-500/10 text-yellow-500' : 
                    'bg-muted text-muted-foreground'}
                `}>
                  {state.currentIdea.status}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Created {new Date(state.currentIdea.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            {!state.currentAnalysis && (
              <Button
                onClick={startAnalysis}
                disabled={isAnalyzing}
                className="rounded-2xl px-6 font-bold"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Start Analysis
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {state.currentAnalysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          <AnalysisCard
            title="Market Momentum"
            icon={TrendingUp}
            data={state.currentAnalysis.market_momentum}
            color="blue"
          />
          <AnalysisCard
            title="Competition"
            icon={Users}
            data={state.currentAnalysis.competition}
            color="red"
          />
          <AnalysisCard
            title="Capital & Funding"
            icon={DollarSign}
            data={state.currentAnalysis.capital_funding}
            color="green"
          />
          <AnalysisCard
            title="Public Opinion"
            icon={MessageSquare}
            data={state.currentAnalysis.public_opinion}
            color="purple"
          />

          <div className="relative group">
            <AnalysisCard
              title="Future Trends"
              icon={Eye}
              data={state.currentAnalysis.future_trends}
              color="orange"
              locked={true}
            />
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] rounded-[32px] flex items-center justify-center opacity-100 transition-all">
              <div className="text-center p-6 bg-card border border-border rounded-3xl shadow-2xl scale-95 group-hover:scale-100 transition-transform">
                <Lock className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-sm font-black uppercase tracking-widest mb-3">Premium Feature</p>
                <Button size="sm" onClick={handleUpgradeClick} className="font-bold rounded-xl">
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </div>

          {state.currentAnalysis.confidence_score && (
            <div className="bg-card rounded-[32px] border border-border p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Confidence Score</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-5xl font-black text-foreground">
                    {Math.round(state.currentAnalysis.confidence_score)}%
                  </span>
                  <span className="text-sm font-bold text-muted-foreground pb-1">Data Reliability</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-1000"
                    style={{ width: `${state.currentAnalysis.confidence_score}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        state.currentIdea && !isAnalyzing && (
          <div className="text-center py-20 bg-muted/20 rounded-[32px] border-2 border-dashed border-border">
            <p className="text-muted-foreground font-medium">Click &quot;Start Analysis&quot; above to see data.</p>
          </div>
        )
      )}

      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onUpgrade={() => setShowPaywall(false)}
        />
      )}
    </div>
  )
}