'use client'

import React, { useState } from 'react'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Lightbulb, 
  BarChart3,
  MessageSquare,
  Zap,
  Globe,
  Shield,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface MetricCard {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  trend: 'up' | 'down'
}

interface IdeaTemplate {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedValue: string
  icon: React.ReactNode
  tags: string[]
}

export function ProfessionalDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const handleAnalyzeIdea = (template: IdeaTemplate) => {
    // Navigate to chat with pre-filled idea
    const ideaText = `${template.title}: ${template.description}`
    // Store in localStorage for the chat component to pick up
    localStorage.setItem('prefill_idea', ideaText)
    // Navigate to chat tab (you'll need to implement this navigation)
    window.location.href = '/?tab=chat'
  }

  const metrics: MetricCard[] = [
    {
      title: 'Total Ideas',
      value: '12',
      change: '+3 this week',
      icon: <Lightbulb className="w-5 h-5" />,
      trend: 'up'
    },
    {
      title: 'Market Score',
      value: '8.7/10',
      change: '+0.5 this month',
      icon: <BarChart3 className="w-5 h-5" />,
      trend: 'up'
    },
    {
      title: 'Potential Value',
      value: '$2.4M',
      change: '+$500K this month',
      icon: <DollarSign className="w-5 h-5" />,
      trend: 'up'
    },
    {
      title: 'Success Rate',
      value: '78%',
      change: '+5% this month',
      icon: <Target className="w-5 h-5" />,
      trend: 'up'
    }
  ]

  const ideaTemplates: IdeaTemplate[] = [
    {
      id: '1',
      title: 'AI-Powered SaaS Platform',
      description: 'Enterprise software with machine learning automation for workflow optimization',
      category: 'SaaS',
      difficulty: 'Advanced',
      estimatedValue: '$5-10M',
      icon: <Zap className="w-6 h-6" />,
      tags: ['AI', 'Enterprise', 'SaaS']
    },
    {
      id: '2',
      title: 'Sustainable Fashion Marketplace',
      description: 'E-commerce platform connecting eco-conscious consumers with sustainable brands',
      category: 'E-commerce',
      difficulty: 'Intermediate',
      estimatedValue: '$2-5M',
      icon: <Globe className="w-6 h-6" />,
      tags: ['E-commerce', 'Sustainability', 'Marketplace']
    },
    {
      id: '3',
      title: 'HealthTech Telemedicine Platform',
      description: 'Virtual healthcare platform with AI diagnostics and remote monitoring',
      category: 'HealthTech',
      difficulty: 'Advanced',
      estimatedValue: '$8-15M',
      icon: <Shield className="w-6 h-6" />,
      tags: ['HealthTech', 'AI', 'Telemedicine']
    },
    {
      id: '4',
      title: 'FinTech Payment Solution',
      description: 'Cross-border payment platform with blockchain security and instant settlement',
      category: 'FinTech',
      difficulty: 'Advanced',
      estimatedValue: '$10-20M',
      icon: <DollarSign className="w-6 h-6" />,
      tags: ['FinTech', 'Blockchain', 'Payments']
    },
    {
      id: '5',
      title: 'EdTech Learning Platform',
      description: 'Personalized education platform with adaptive learning algorithms',
      category: 'EdTech',
      difficulty: 'Intermediate',
      estimatedValue: '$3-7M',
      icon: <Users className="w-6 h-6" />,
      tags: ['EdTech', 'AI', 'Personalization']
    },
    {
      id: '6',
      title: 'Real Estate PropTech',
      description: 'Property management platform with IoT integration and predictive analytics',
      category: 'PropTech',
      difficulty: 'Intermediate',
      estimatedValue: '$4-8M',
      icon: <Target className="w-6 h-6" />,
      tags: ['PropTech', 'IoT', 'Analytics']
    }
  ]

  const categories = ['all', 'SaaS', 'E-commerce', 'HealthTech', 'FinTech', 'EdTech', 'PropTech']

  const filteredTemplates = selectedCategory === 'all' 
    ? ideaTemplates 
    : ideaTemplates.filter(idea => idea.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Market Intelligence Dashboard</h1>
              <p className="text-gray-600 mt-1">AI-powered startup analysis and insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>New Analysis</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <BarChart3 className="w-4 h-4" />
                <span>Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`w-4 h-4 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm ml-1 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  {metric.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Idea Templates Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Startup Idea Templates</h2>
              <p className="text-gray-600 mt-1">Pre-vetted concepts with market analysis</p>
            </div>
            <div className="flex items-center space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      {template.icon}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(template.difficulty)}`}>
                      {template.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500">Estimated Value</p>
                      <p className="text-lg font-semibold text-gray-900">{template.estimatedValue}</p>
                    </div>
                    <button 
                      onClick={() => handleAnalyzeIdea(template)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span>Analyze</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready to analyze your idea?</h3>
              <p className="text-blue-100">Get instant AI-powered market intelligence and competitive analysis</p>
            </div>
            <button className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
              <Zap className="w-5 h-5" />
              <span>Start Analysis</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
