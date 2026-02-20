'use client'

import React from 'react'
import { User, Camera, Mail } from 'lucide-react'

interface ProfileFormProps {
  userName: string
  setUserName: (val: string) => void
  userEmail: string
  photoURL: string | null
  uploading: boolean
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSaveProfile: () => void
  saving: boolean
  isDarkMode: boolean
}

export function ProfileForm({
  userName,
  setUserName,
  userEmail,
  photoURL,
  uploading,
  handlePhotoUpload,
  handleSaveProfile,
  saving,
}: ProfileFormProps) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* Header */}
      <div style={{ paddingBottom: '16px', borderBottom: '1px solid hsl(var(--border))' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'hsl(var(--foreground))', margin: '0 0 4px 0' }}>
          Profile Details
        </h3>
        <p style={{ fontSize: '13px', color: 'hsl(var(--muted-foreground))', margin: 0 }}>
          Manage how you appear to others.
        </p>
      </div>

      {/* Avatar + Fields */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1.5px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--card))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            {photoURL ? (
              <img src={photoURL} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={32} style={{ color: 'hsl(var(--muted-foreground))', opacity: 0.3 }} />
            )}
            {uploading && (
              <div style={{
                position: 'absolute', inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: '20px', height: '20px',
                  border: '2px solid hsl(var(--primary))',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
              </div>
            )}
          </div>
          <label style={{
            position: 'absolute',
            bottom: '-2px', right: '-2px',
            padding: '7px',
            backgroundColor: 'hsl(var(--primary))',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Camera size={13} style={{ color: 'white' }} />
            <input type="file" onChange={handlePhotoUpload} style={{ display: 'none' }} accept="image/*" />
          </label>
        </div>

        {/* Fields */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Display Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <label style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.13em', color: 'hsl(var(--muted-foreground))', marginLeft: '2px' }}>
              Display Name
            </label>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onFocus={e => e.currentTarget.style.borderColor = 'hsl(var(--foreground))'}
              onBlur={e => e.currentTarget.style.borderColor = 'hsl(var(--border))'}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'hsl(var(--card))',
                border: '1.5px solid hsl(var(--border))',
                borderRadius: '12px',
                fontSize: '14px',
                color: 'hsl(var(--foreground))',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', opacity: 0.6 }}>
            <label style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.13em', color: 'hsl(var(--muted-foreground))', marginLeft: '2px' }}>
              Email Address
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px',
              backgroundColor: 'hsl(var(--muted))',
              border: '1.5px solid hsl(var(--border))',
              borderRadius: '12px',
              fontSize: '14px',
              color: 'hsl(var(--foreground))',
              boxSizing: 'border-box',
            }}>
              <Mail size={15} style={{ color: 'hsl(var(--muted-foreground))', flexShrink: 0 }} />
              {userEmail}
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            style={{
              alignSelf: 'flex-start',
              padding: '11px 24px',
              backgroundColor: 'hsl(var(--foreground))',
              color: 'hsl(var(--background))',
              border: 'none',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.5 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </section>
  )
}