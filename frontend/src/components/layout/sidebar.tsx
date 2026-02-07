'use client'

import React from 'react'
import { Clock, TrendingUp, BarChart3, Users, DollarSign, MessageSquare } from 'lucide-react'
import { useIdea } from '@/contexts/idea-context'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { state, dispatch } = useIdea()

  const handleIdeaSelect = (idea: any) => {
    dispatch({ type: 'SET_CURRENT_IDEA', payload: idea })
    onClose()
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Idea History</h2>
            <p className="text-sm text-gray-500 mt-1">Your analyzed startup ideas</p>
          </div>

          {/* Ideas List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {state.ideas.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No ideas yet</p>
                <p className="text-sm text-gray-400 mt-1">Submit your first idea to get started</p>
              </div>
            ) : (
              state.ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors"
                  onClick={() => handleIdeaSelect(idea)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {idea.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {idea.description}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`
                          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                          ${idea.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          ${idea.status === 'analyzing' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${idea.status === 'pending' ? 'bg-gray-100 text-gray-800' : ''}
                          ${idea.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {idea.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(idea.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-gray-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-900">Active</p>
                <p className="text-lg font-bold text-gray-900">
                  {state.ideas.filter(i => i.status === 'completed').length}
                </p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-900">Total</p>
                <p className="text-lg font-bold text-gray-900">
                  {state.ideas.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
