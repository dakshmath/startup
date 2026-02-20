'use client'

import React from 'react'
import { Mail } from 'lucide-react'

export function SupportTab() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-4 space-y-6">
      {/* Tightened spacing between header and subtext */}
      <div className="text-center space-y-0.5">
        <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight">
          Get in Touch
        </h2>
        <p className="text-[13px] text-muted-foreground font-medium max-w-md mx-auto">
          Feedback or question? Send us a message and we'll be in touch.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-card border border-border rounded-[32px] p-8 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
          <div className="p-1.5 bg-muted rounded-lg">
            <Mail className="w-4 h-4 text-foreground" />
          </div>
          Support Request
        </h3>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Name</label>
              <input 
                type="text" 
                placeholder="Your Name"
                // Focus state: Added green border and ring back here
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 outline-none transition-all placeholder:text-muted-foreground/30"
              />
            </div>
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Email</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 outline-none transition-all placeholder:text-muted-foreground/30"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Message</label>
            <textarea 
              rows={4}
              placeholder="How can we help?"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 outline-none transition-all resize-none placeholder:text-muted-foreground/30"
            />
          </div>

          <button className="w-full py-4 bg-foreground text-background font-black text-[11px] uppercase tracking-[0.2em] rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-foreground/5">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}