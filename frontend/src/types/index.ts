export interface User {
    id: number
    firebase_uid: string
    email: string
    display_name?: string
    avatar_url?: string
    is_active: boolean
    created_at: string
    updated_at?: string
  }
  
  export interface Idea {
    id: number
    user_id: number
    title: string
    description: string
    tags: string[]
    status: 'pending' | 'analyzing' | 'completed' | 'failed'
    created_at: string
    updated_at?: string
  }
  
  export interface Analysis {
    id: number
    idea_id: number
    user_id: number
    market_momentum?: MarketMomentum
    competition?: Competition
    capital_funding?: CapitalFunding
    public_opinion?: PublicOpinion
    future_trends?: FutureTrends
    confidence_score?: number
    data_sources?: string[]
    processing_time?: number
    created_at: string
    updated_at?: string
    status: 'pending' | 'completed' | 'failed'
  }
  
  export interface MarketMomentum {
    market_size?: number
    growth_rate?: number
    current_trends?: string[]
    saturation_level?: number
    entry_barriers?: string[]
    momentum_score?: number
  }
  
  export interface Competition {
    competitors?: Competitor[]
    market_share?: MarketShare[]
    competitive_advantages?: string[]
    differentiation_opportunities?: string[]
    competition_intensity?: number
  }
  
  export interface Competitor {
    name: string
    market_share?: number
    description?: string
    strengths?: string[]
    weaknesses?: string[]
  }
  
  export interface MarketShare {
    company: string
    percentage: number
  }
  
  export interface CapitalFunding {
    recent_funding?: FundingRound[]
    active_investors?: string[]
    average_funding?: number
    funding_difficulty?: number
    recommended_strategy?: string[]
  }
  
  export interface FundingRound {
    company: string
    amount: number
    stage: string
    date: string
    investors?: string[]
  }
  
  export interface PublicOpinion {
    sentiment_score?: number
    key_concerns?: string[]
    social_media_trends?: string[]
    press_coverage?: PressCoverage[]
    adoption_potential?: number
  }
  
  export interface PressCoverage {
    source: string
    sentiment: 'positive' | 'negative' | 'neutral'
    headline: string
    date: string
  }
  
  export interface FutureTrends {
    market_projection?: MarketProjection
    technology_trends?: string[]
    regulatory_impact?: string[]
    consumer_shifts?: string[]
    risk_factors?: string[]
    opportunities?: string[]
  }
  
  export interface MarketProjection {
    year_1?: number
    year_3?: number
    year_5?: number
    currency?: string
  }
  
  export interface Subscription {
    id: number
    user_id: number
    stripe_customer_id?: string
    stripe_subscription_id?: string
    plan_type: 'free' | 'pro' | 'enterprise'
    status: 'active' | 'cancelled' | 'past_due' | 'trialing'
    current_period_start?: string
    current_period_end?: string
    cancel_at_period_end: boolean
    created_at: string
    updated_at?: string
  }
  
  export interface ApiResponse<T> {
    data?: T
    error?: string
    message?: string
  }
  
  export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    limit: number
    has_next: boolean
    has_prev: boolean
  }
  