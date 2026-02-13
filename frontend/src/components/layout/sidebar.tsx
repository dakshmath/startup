'use client'

import React, { useState } from 'react'
import { Menu, SquarePen, Search, X } from 'lucide-react'

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
  pastChats, 
  selectedConversation, 
  setSelectedConversation,
  setActiveTab,
  onSearch
}: SidebarProps) {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <aside className={`h-full transition-all duration-300 bg-card border-r border-border overflow-hidden flex-shrink-0 ${
      sidebarOpen ? 'w-64' : 'w-[68px]'
    }`}>
      <div className="w-64 h-full flex flex-col">
        
        {/* Header Area */}
        <div className="h-16 flex items-center relative px-5">
          {!isSearching ? (
            <>
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>

              <button 
                onClick={() => {
                  if (!sidebarOpen) setSidebarOpen(true);
                  setIsSearching(true);
                }}
                className={`absolute right-5 p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-300 ${
                  sidebarOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
                }`}
              >
                <Search size={20} strokeWidth={1.5} /> 
              </button>
            </>
          ) : (
            <div className="flex items-center w-full animate-in fade-in duration-200">
              <input 
                autoFocus
                type="text"
                placeholder="Search..."
                onChange={(e) => onSearch?.(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm pr-8"
              />
              <button 
                onClick={() => {
                  setIsSearching(false);
                  onSearch?.('');
                }}
                className="absolute right-0 p-2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* New Chat Button */}
        <div className="px-5 mt-2">
          <button
            onClick={() => {
              setSelectedConversation(null);
              setActiveTab('chat');
              setIsSearching(false);
              onSearch?.('');
            }}
            className="group flex items-center w-full py-2 text-muted-foreground hover:text-foreground transition-all duration-200"
          >
            <div className="p-2 group-hover:bg-accent rounded-lg transition-colors flex-shrink-0">
              <SquarePen size={22} strokeWidth={1.5} />
            </div>
            
            <span className={`ml-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
            }`}>
              New idea
            </span>
          </button>
        </div>

        {/* History Area */}
        <div className="flex-1 overflow-y-auto mt-6 custom-scrollbar px-5">
          <div className={`px-2 mb-4 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
            <h3 className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-widest">
              Past startups
            </h3>
          </div>
          
          <div className="space-y-1">
            {pastChats.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full group flex items-center py-2 rounded-xl transition-all duration-200 ${
                  selectedConversation === conversation.id ? 'bg-accent/40' : 'hover:bg-accent/20'
                }`}
              >
                <div className="w-10 flex-shrink-0 flex items-center justify-center">
                  <div className={`w-1.5 h-1.5 rounded-full transition-all ${
                    selectedConversation === conversation.id ? 'bg-primary scale-125' : 'bg-muted-foreground/20'
                  }`} />
                </div>

                {sidebarOpen && (
                  <div className="ml-1 overflow-hidden pr-2 text-left animate-in fade-in duration-500">
                    <h4 className="text-[13px] font-medium text-foreground truncate">{conversation.title}</h4>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}