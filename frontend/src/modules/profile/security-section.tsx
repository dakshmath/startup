'use client'

import React from 'react'
import { FileJson, ChevronRight, LogOut } from 'lucide-react'

interface SecuritySectionProps {
  handleLogout: () => void
  isDarkMode: boolean
}

export function SecuritySection({ handleLogout }: SecuritySectionProps) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Header */}
      <div style={{ paddingBottom: '16px', borderBottom: '1px solid hsl(var(--border))' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'hsl(var(--foreground))', margin: '0 0 4px 0' }}>
          Account Security
        </h3>
        <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', margin: 0 }}>
          Manage your access and data privacy.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Export */}
        <button
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            backgroundColor: 'hsl(var(--card))',
            border: '1.5px solid hsl(var(--border))',
            borderRadius: '20px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'hsl(var(--foreground) / 0.3)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'hsl(var(--border))'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '10px', backgroundColor: 'hsl(var(--primary) / 0.1)', borderRadius: '12px' }}>
              <FileJson size={18} style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'hsl(var(--foreground))', margin: '0 0 2px 0' }}>
                Export Workspace
              </p>
              <p style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))', margin: 0 }}>
                Download all your data as JSON.
              </p>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: 'hsl(var(--muted-foreground))', opacity: 0.4 }} />
        </button>

        {/* Sign out */}
        <div style={{
          padding: '28px',
          borderRadius: '20px',
          border: '1.5px solid hsl(0 84% 60% / 0.15)',
          backgroundColor: 'hsl(0 84% 60% / 0.05)',
        }}>
          <h4 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.13em', color: 'hsl(0 84% 60%)', margin: '0 0 12px 0' }}>
            Account Management
          </h4>
          <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', margin: '0 0 20px 0', lineHeight: 1.6 }}>
            Signing out will end your current session. You will need to log back in to access your projects.
          </p>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: 'hsl(0 84% 60%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>
    </section>
  )
}