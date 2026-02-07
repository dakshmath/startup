'use client'

import React from 'react'
import { Menu, X, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useIdea } from '@/contexts/idea-context'

interface HeaderProps {
  sidebarOpen: boolean
  onSidebarToggle: () => void
}

export function Header({ sidebarOpen, onSidebarToggle }: HeaderProps) {
  const { state } = useIdea()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Market Intelligence</h1>
            <p className="text-sm text-gray-500">AI-powered startup analysis</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Welcome back</p>
            <p className="text-xs text-gray-500">user@example.com</p>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">U</span>
          </div>

          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
