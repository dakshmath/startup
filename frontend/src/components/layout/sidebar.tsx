'use client'

import React from 'react'
import { Sparkles, Plus } from 'lucide-react'

interface Conversation {
  id: string | number;
  title: string;
  preview: string;
  status: string;
}

interface SidebarProps {
  sidebarOpen: boolean;
  pastChats: Conversation[];
  selectedConversation: string | number | null;
  setSelectedConversation: (id: string | number | null) => void;
  setActiveTab: (tab: 'chat' | 'intelligence' | 'pricing') => void;
}

export function Sidebar({ 
  sidebarOpen, 
  pastChats, 
  selectedConversation, 
  setSelectedConversation,
  setActiveTab 
}: SidebarProps) {
  return (
    <aside className={`h-full transition-all duration-300 bg-card border-r border-border overflow-hidden flex-shrink-0 ${
      sidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 pointer-events-none'
    }`}>
      <div className="w-64 h-full flex flex-col">
        <div className="p-6 flex items-center space-x-3">
          <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-background" />
          </div>
          <span className="text-sm font-bold tracking-tighter uppercase italic">StartupName</span>
        </div>

        <div className="px-4 mb-4">
          <button
            onClick={() => {
              setSelectedConversation(null);
              setActiveTab('chat');
            }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all font-bold"
          >
            <Plus className="h-4 w-4" />
            <span className="text-[12px]">New Idea</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 px-3">History</h3>
          <div className="space-y-1">
            {pastChats.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selectedConversation === conversation.id ? 'bg-accent border border-border' : 'hover:bg-accent/50'
                }`}
              >
                <h4 className="text-[12px] font-bold text-foreground truncate">{conversation.title}</h4>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{conversation.preview}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}