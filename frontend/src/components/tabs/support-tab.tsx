'use client'

import React from 'react'
import { Mail, Send } from 'lucide-react'

export function SupportTab() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-4 space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-black tracking-tight text-foreground">Get in Touch</h2>
        <p className="text-sm text-muted-foreground font-medium max-w-md mx-auto">
          Feedback or question? Send us a message and we'll be in touch.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-card border border-border rounded-[32px] p-8 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          Support Request
        </h3>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Name</label>
              <input 
                type="text" 
                placeholder="Your Name"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Message</label>
            <textarea 
              rows={4}
              placeholder="How can we help?"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none placeholder:text-muted-foreground/30"
            />
          </div>

          <button className="w-full py-3.5 bg-primary text-primary-foreground font-black text-sm rounded-xl hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
            <Send className="w-4 h-4" />
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}