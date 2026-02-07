'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Lightbulb, TrendingUp, Users, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIdea } from '@/contexts/idea-context'
import { ideasApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

const ideaSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tags: z.array(z.string()).optional(),
})

type IdeaFormData = z.infer<typeof ideaSchema>

const placeholderIdeas = [
  {
    icon: Lightbulb,
    title: "AI-Powered Learning Platform",
    description: "An educational platform that uses AI to personalize learning paths for students based on their learning style and pace.",
    tags: ["EdTech", "AI", "Personalization"]
  },
  {
    icon: TrendingUp,
    title: "Sustainable Supply Chain Tracker",
    description: "A blockchain-based platform to track and verify sustainability claims in supply chains.",
    tags: ["Blockchain", "Sustainability", "Logistics"]
  },
  {
    icon: Users,
    title: "Mental Health Community App",
    description: "A mobile app connecting users with mental health professionals and peer support groups.",
    tags: ["HealthTech", "Community", "Mobile"]
  },
  {
    icon: DollarSign,
    title: "Micro-Investment Platform",
    description: "An app allowing users to invest small amounts in diversified portfolios with educational content.",
    tags: ["FinTech", "Investment", "Education"]
  }
]

export function GetStartedTab() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { dispatch } = useIdea()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IdeaFormData>({
    resolver: zodResolver(ideaSchema),
  })

  const onSubmit = async (data: IdeaFormData) => {
    setIsSubmitting(true)
    try {
      const ideaData = {
        ...data,
        status: 'pending' as const,
        tags: data.tags || []
      }
      const idea = await ideasApi.create(ideaData)
      dispatch({ type: 'ADD_IDEA', payload: idea })
      dispatch({ type: 'SET_CURRENT_IDEA', payload: idea })
      
      toast({
        title: "Idea submitted successfully!",
        description: "Your idea is now being analyzed. This may take a few minutes.",
      })
      
      reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit idea. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const usePlaceholderIdea = (idea: typeof placeholderIdeas[0]) => {
    reset({
      title: idea.title,
      description: idea.description,
      tags: idea.tags,
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Placeholder Ideas */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Need inspiration?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {placeholderIdeas.map((idea, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors"
              onClick={() => usePlaceholderIdea(idea)}
            >
              <div className="flex items-start space-x-3">
                <idea.icon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{idea.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {idea.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Idea Submission Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Submit Your Idea</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Idea Title
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your startup idea title..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your startup idea in detail. What problem does it solve? Who are the target users? What makes it unique?"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (optional)
            </label>
            <input
              {...register('tags')}
              type="text"
              id="tags"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter tags separated by commas (e.g., AI, SaaS, Mobile)"
            />
            <p className="mt-1 text-sm text-gray-500">
              Separate multiple tags with commas
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Run Deep Research
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
