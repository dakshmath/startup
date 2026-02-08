'use client'

import React, { useState } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Camera,
  Award,
  TrendingUp,
  Target,
  Zap,
  ChevronRight,
  Shield,
  CreditCard,
  BarChart3,
  Settings as SettingsIcon,
  Globe
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  bio: string
  website: string
  joinedDate: string
  avatar: string
  stats: {
    analyses: number
    ideas: number
    successRate: number
    savedTime: string
  }
  subscription: {
    plan: string
    status: string
    nextBilling: string
  }
  achievements: {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    earned: boolean
    date?: string
  }[]
}

export default function ProfilePageEnhanced() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Startup founder and product enthusiast. Passionate about building innovative solutions that solve real-world problems.',
    website: 'https://alexjohnson.dev'
  })

  const userProfile: UserProfile = {
    id: '1',
    ...editForm,
    joinedDate: 'January 15, 2024',
    avatar: '/api/placeholder/150/150',
    stats: {
      analyses: 47,
      ideas: 23,
      successRate: 87,
      savedTime: '124 hours'
    },
    subscription: {
      plan: 'Growth',
      status: 'Active',
      nextBilling: 'March 15, 2024'
    },
    achievements: [
      {
        id: 'first-analysis',
        title: 'First Analysis',
        description: 'Completed your first market analysis',
        icon: <Target className="w-4 h-4" />,
        earned: true,
        date: 'January 20, 2024'
      },
      {
        id: 'power-user',
        title: 'Power User',
        description: 'Completed 25+ analyses',
        icon: <Zap className="w-4 h-4" />,
        earned: true,
        date: 'February 10, 2024'
      },
      {
        id: 'trendsetter',
        title: 'Trendsetter',
        description: 'Identified 10+ market trends',
        icon: <TrendingUp className="w-4 h-4" />,
        earned: false
      },
      {
        id: 'expert',
        title: 'Market Expert',
        description: 'Achieved 90%+ success rate',
        icon: <Award className="w-4 h-4" />,
        earned: false
      }
    ]
  }

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm({
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      bio: 'Startup founder and product enthusiast. Passionate about building innovative solutions that solve real-world problems.',
      website: 'https://alexjohnson.dev'
    })
  }

  const StatCard = ({ icon, label, value, trend }: { 
    icon: React.ReactNode; 
    label: string; 
    value: string | number; 
    trend?: string 
  }) => (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )

  const AchievementCard = ({ achievement }: { achievement: UserProfile['achievements'][0] }) => (
    <div className={`
      relative p-4 rounded-xl border transition-all duration-300
      ${achievement.earned 
        ? 'bg-primary/5 border-primary/20 hover:bg-primary/10' 
        : 'bg-muted/30 border-border opacity-50'
      }
    `}>
      <div className="flex items-start space-x-3">
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center
          ${achievement.earned 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
          }
        `}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{achievement.title}</h4>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
          {achievement.earned && achievement.date && (
            <p className="text-xs text-primary mt-1">Earned {achievement.date}</p>
          )}
        </div>
        {achievement.earned && (
          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-green-600" />
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/20">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                <p className="text-muted-foreground">Manage your account and view your progress</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </button>
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <User className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
                <h3 className="text-lg font-semibold text-foreground mt-4">{editForm.name}</h3>
                <p className="text-sm text-muted-foreground">Member since {userProfile.joinedDate}</p>
              </div>

              {/* Profile Fields */}
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:border-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:border-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:border-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Location</label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:border-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Bio</label>
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:border-ring resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Website</label>
                      <input
                        type="url"
                        value={editForm.website}
                        onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                        className="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:border-ring"
                      />
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{editForm.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{editForm.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{editForm.location}</span>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed">{editForm.bio}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a href={editForm.website} className="text-sm text-primary hover:underline">
                        {editForm.website}
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Subscription Info */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Subscription</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <span className="font-medium text-foreground">{userProfile.subscription.plan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="font-medium text-green-600">{userProfile.subscription.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next Billing</span>
                  <span className="font-medium text-foreground">{userProfile.subscription.nextBilling}</span>
                </div>
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Manage Plan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Overview */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Your Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={<BarChart3 className="w-6 h-6 text-primary" />}
                  label="Total Analyses"
                  value={userProfile.stats.analyses}
                  trend="+12%"
                />
                <StatCard
                  icon={<Target className="w-6 h-6 text-primary" />}
                  label="Ideas Generated"
                  value={userProfile.stats.ideas}
                  trend="+8%"
                />
                <StatCard
                  icon={<TrendingUp className="w-6 h-6 text-primary" />}
                  label="Success Rate"
                  value={`${userProfile.stats.successRate}%`}
                  trend="+5%"
                />
                <StatCard
                  icon={<Zap className="w-6 h-6 text-primary" />}
                  label="Time Saved"
                  value={userProfile.stats.savedTime}
                />
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userProfile.achievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => router.push('/settings')}
                  className="flex items-center space-x-3 p-4 bg-accent border border-border rounded-lg hover:bg-accent/80 transition-colors"
                >
                  <SettingsIcon className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
                <button
                  onClick={() => router.push('/billing')}
                  className="flex items-center space-x-3 p-4 bg-accent border border-border rounded-lg hover:bg-accent/80 transition-colors"
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">Billing</span>
                </button>
                <button
                  onClick={() => console.log('Export data')}
                  className="flex items-center space-x-3 p-4 bg-accent border border-border rounded-lg hover:bg-accent/80 transition-colors"
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Privacy</span>
                </button>
}
