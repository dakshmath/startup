'use client'

import React, { useState } from 'react'
import { Menu, Plus, MessageSquare, Search, X } from 'lucide-react'

interface Conversation {
  id: string | number;
  title: string;
  preview: string;
  status: string;
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  pastChats: Conversation[];
  selectedConversation: string | number | null;
  setSelectedConversation: (id: string | number | null) => void;
  setActiveTab: (tab: 'chat' | 'intelligence' | 'pricing' | 'support') => void;
  onSearch?: (query: string) => void;
}

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  pastChats = [],
  selectedConversation,
  setSelectedConversation,
  setActiveTab,
  onSearch,
}: SidebarProps) {
  const [isSearching, setIsSearching] = useState(false)

  return (
    <aside className={`
      h-full bg-card border-r border-border
      transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
      flex-shrink-0 z-[100] flex flex-col
      ${sidebarOpen ? 'w-60' : 'w-[60px]'}
    `}>
      <div className="flex flex-col h-full">

        {/* Top Section - Aligned to Home Header */}
        <div className={`h-20 px-3 flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
          >
            <Menu size={17} />
          </button>

          {sidebarOpen && (
            <button
              onClick={() => setIsSearching(!isSearching)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
            >
              <Search size={15} />
            </button>
          )}
        </div>

        {/* Search */}
        {sidebarOpen && isSearching && (
          <div className="px-3 mb-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-2.5 py-1.5">
              <Search size={12} className="text-muted-foreground shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-full bg-transparent outline-none text-[12.5px] text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={() => { setIsSearching(false); onSearch?.('') }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        {/* New idea */}
        <div className={`px-3 mb-4 mt-2 ${!sidebarOpen ? 'flex justify-center' : ''}`}>
          <button
            onClick={() => {
              setSelectedConversation(null)
              setActiveTab('chat')
              setIsSearching(false)
            }}
            className={`
              flex items-center gap-2.5 transition-all duration-150 group
              ${sidebarOpen
                ? 'w-full px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-foreground'
                : 'w-8 h-8 rounded-lg border border-border bg-background hover:bg-muted flex items-center justify-center text-foreground'
              }
            `}
          >
            <Plus size={15} className="text-foreground/60 group-hover:text-foreground transition-colors shrink-0" />
            {sidebarOpen && (
              <span className="text-[13px] font-semibold tracking-tight text-foreground/75 group-hover:text-foreground transition-colors">
                New idea
              </span>
            )}
          </button>
        </div>

        {/* History / Past Startups */}
        <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
          {sidebarOpen && (
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.16em] mb-3 px-1">
              Past Startups
            </p>
          )}

          <div className="space-y-0.5">
            {pastChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedConversation(chat.id)}
                className={`
                  w-full group flex items-center gap-2.5 py-2 rounded-lg
                  transition-all duration-150
                  ${selectedConversation === chat.id
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }
                  ${sidebarOpen ? 'px-2.5' : 'justify-center px-0'}
                `}
              >
                <MessageSquare
                  size={13}
                  className={`shrink-0 transition-opacity ${
                    selectedConversation === chat.id ? 'opacity-70' : 'opacity-30 group-hover:opacity-50'
                  }`}
                />
                {sidebarOpen && (
                  <span className="text-[12.5px] truncate font-medium">{chat.title}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}