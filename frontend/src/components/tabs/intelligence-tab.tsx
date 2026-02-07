'use client'

import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, DollarSign, MessageSquare, Eye, Lock, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIdea } from '@/contexts/idea-context'
import { analysisApi, ideasApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { AnalysisCard } from '@/components/analysis/analysis-card'
import { PaywallModal } from '@/components/subscription/paywall-modal'

export function IntelligenceTab() {
  const { state, dispatch } = useIdea()
  const { toast } = useToast()
  const [showPaywall, setShowPaywall] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (state.currentIdea && !state.currentAnalysis) {
      loadAnalysis()
    }
  }, [state.currentIdea])

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
      
      // Update idea status
      const updatedIdea = await ideasApi.update(state.currentIdea.id, { status: 'analyzing' })
      dispatch({ type: 'UPDATE_IDEA', payload: updatedIdea })

      toast({
        title: "Analysis started",
        description: "Your idea is being analyzed. This may take a few minutes.",
      })

      // Poll for completion
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
    }, 5000) // Poll every 5 seconds

    // Clear interval after 5 minutes max
    setTimeout(() => clearInterval(pollInterval), 300000)
  }

  const handleUpgradeClick = () => {
    setShowPaywall(true)
  }

  if (!state.currentIdea) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Idea Selected</h3>
        <p className="text-gray-500 mb-6">
          Select an idea from the sidebar or submit a new idea to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Idea Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {state.currentIdea.title}
            </h2>
            <p className="text-gray-600 mb-4">{state.currentIdea.description}</p>
            <div className="flex items-center space-x-4">
              <span className={`
                inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${state.currentIdea.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                ${state.currentIdea.status === 'analyzing' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${state.currentIdea.status === 'pending' ? 'bg-gray-100 text-gray-800' : ''}
                ${state.currentIdea.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
              `}>
                {state.currentIdea.status}
              </span>
              <span className="text-sm text-gray-500">
                Created {new Date(state.currentIdea.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          {!state.currentAnalysis && (
            <Button
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className="ml-4"
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

      {/* Analysis Results */}
      {state.currentAnalysis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Momentum */}
          <AnalysisCard
            title="Market Momentum"
            icon={TrendingUp}
            data={state.currentAnalysis.market_momentum}
            color="blue"
          />

          {/* Competition */}
          <AnalysisCard
            title="Competition"
            icon={Users}
            data={state.currentAnalysis.competition}
            color="red"
          />

          {/* Capital & Funding */}
          <AnalysisCard
            title="Capital & Funding"
            icon={DollarSign}
            data={state.currentAnalysis.capital_funding}
            color="green"
          />

          {/* Public Opinion */}
          <AnalysisCard
            title="Public Opinion"
            icon={MessageSquare}
            data={state.currentAnalysis.public_opinion}
            color="purple"
          />

          {/* Future Trends - Paywall */}
          <div className="relative">
            <AnalysisCard
              title="Future Trends"
              icon={Eye}
              data={state.currentAnalysis.future_trends}
              color="orange"
              locked={true}
            />
            <div className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Premium Feature
                </p>
                <Button size="sm" onClick={handleUpgradeClick}>
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </div>

          {/* Confidence Score */}
          {state.currentAnalysis.confidence_score && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confidence Score</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {Math.round(state.currentAnalysis.confidence_score)}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${state.currentAnalysis.confidence_score}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Analysis confidence based on data quality and completeness
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onUpgrade={() => {
            setShowPaywall(false)
            // Handle upgrade logic
          }}
        />
      )}
    </div>
  )
}
