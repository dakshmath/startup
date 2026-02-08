'use client'

import React, { useState } from 'react'
import { Check, X, Star, Zap, ArrowRight, Sparkles } from 'lucide-react'

interface PricingPlan {
  id: string
  name: string
  description: string
  price: string
  period: string
  features: {
    included: string[]
    excluded?: string[]
  }
  popular?: boolean
  enterprise?: boolean
  cta: string
  ctaVariant: 'primary' | 'secondary' | 'outline'
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for early validation and MVP development',
    price: '$0',
    period: '/month',
    features: {
      included: [
        '3 ideas per month',
        'Basic market analysis',
        'Competitor overview',
        'Email support',
        'Basic reports'
      ],
      excluded: [
        'Advanced insights',
        'API access',
        'Custom integrations',
        'Priority support'
      ]
    },
    cta: 'Get Started',
    ctaVariant: 'outline'
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'For scaling startups and growing teams',
    price: '$49',
    period: '/month',
    features: {
      included: [
        'Unlimited ideas',
        'Advanced market analysis',
        'Deep competitor research',
        'Financial projections',
        'Risk assessment',
        'Priority support',
        'Custom reports',
        'API access',
        'Team collaboration'
      ]
    },
    popular: true,
    cta: 'Start Free Trial',
    ctaVariant: 'primary'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For high-growth companies and large teams',
    price: '$199',
    period: '/month',
    features: {
      included: [
        'Everything in Growth',
        'Unlimited team members',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'Advanced analytics',
        'White-label options',
        'Custom AI models',
        'On-premise deployment'
      ]
    },
    enterprise: true,
    cta: 'Contact Sales',
    ctaVariant: 'primary'
  }
]

interface PricingCardProps {
  plan: PricingPlan
  isHovered: boolean
  onHover: (hovered: boolean) => void
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, isHovered, onHover }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleMouseEnter = () => {
    setIsAnimating(true)
    onHover(true)
  }

  const handleMouseLeave = () => {
    setIsAnimating(false)
    onHover(false)
  }

  return (
    <div
      className={`
        relative group transition-all duration-500 ease-out
        ${plan.popular 
          ? 'transform scale-105 z-10' 
          : 'hover:transform hover:scale-105 hover:z-10'
        }
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="relative">
            <div className="bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
              MOST POPULAR
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-2 rounded-full blur-md opacity-50 animate-pulse" />
          </div>
        </div>
      )}

      {/* Card Container */}
      <div
        className={`
          relative h-full rounded-2xl border transition-all duration-500 ease-out overflow-hidden
          ${plan.popular
            ? 'bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 border-primary/30 shadow-2xl'
            : 'bg-card border-border hover:border-primary/30 hover:shadow-xl'
          }
          ${isHovered ? 'transform translate-y-[-4px]' : ''}
        `}
      >
        {/* Background Gradient */}
        <div
          className={`
            absolute inset-0 opacity-0 transition-opacity duration-500
            ${plan.popular 
              ? 'bg-gradient-to-br from-primary/10 via-transparent to-accent/10' 
              : 'bg-gradient-to-br from-primary/5 via-transparent to-accent/5'
            }
          `}
          style={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Card Content */}
        <div className="relative p-8 h-full flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
              {plan.enterprise && (
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
              )}
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">{plan.description}</p>
            
            {/* Price */}
            <div className="flex items-baseline space-x-2 mb-2">
              <span className={`
                text-5xl font-bold transition-colors duration-300
                ${plan.popular ? 'text-primary' : 'text-foreground'}
              `}>
                {plan.price}
              </span>
              <span className="text-xl text-muted-foreground">{plan.period}</span>
            </div>
            
            {/* Price Description */}
            <div className="text-sm text-muted-foreground">
              {plan.id === 'starter' && 'Perfect for getting started'}
              {plan.id === 'growth' && 'Billed monthly, cancel anytime'}
              {plan.id === 'enterprise' && 'Custom pricing available'}
            </div>
          </div>

          {/* Features */}
          <div className="flex-1 space-y-4 mb-8">
            {plan.features.included.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 transition-all duration-300"
                style={{
                  transform: isHovered ? `translateX(${Math.min(index * 2, 8)}px)` : 'translateX(0)',
                  opacity: isHovered ? 1 : 0.8
                }}
              >
                <div className={`
                  w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300
                  ${plan.popular ? 'bg-primary text-primary-foreground' : 'bg-green-100 text-green-600'}
                `}>
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
            
            {plan.features.excluded?.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 opacity-50"
              >
                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                  <X className="w-3 h-3 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="relative">
            <button
              className={`
                w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden
                ${plan.ctaVariant === 'primary'
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl'
                  : plan.ctaVariant === 'outline'
                  ? 'border-2 border-border hover:border-primary hover:bg-primary/5 text-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }
                ${isHovered ? 'transform scale-105' : ''}
              `}
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>{plan.cta}</span>
                <ArrowRight className={`
                  w-4 h-4 transition-transform duration-300
                  ${isHovered ? 'translate-x-1' : 'translate-x-0'}
                `} />
              </span>
              
              {/* Button Background Animation */}
              <div
                className={`
                  absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
                  transform -skew-x-12 -translate-x-full transition-transform duration-700
                  ${isHovered ? 'translate-x-full' : ''}
                `}
              />
            </button>
          </div>
        </div>

        {/* Hover Effects */}
        <div
          className={`
            absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none
            ${plan.popular
              ? 'shadow-2xl shadow-primary/20'
              : 'shadow-xl shadow-primary/10'
            }
          `}
          style={{ opacity: isHovered ? 1 : 0 }}
        />
      </div>
    </div>
  )
}

export function PricingCards() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Pricing Plans</span>
        </div>
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Choose Your Growth Path
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Simple, transparent pricing that scales with your business. 
          No hidden fees, no surprises.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {pricingPlans.map((plan) => (
          <div key={plan.id} className="h-full">
            <PricingCard
              plan={plan}
              isHovered={hoveredPlan === plan.id}
              onHover={(hovered) => setHoveredPlan(hovered ? plan.id : null)}
            />
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-600" />
            <span>30-day money-back guarantee</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-600" />
            <span>No setup fees</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-600" />
            <span>Cancel anytime</span>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Questions about pricing?
          </p>
          <button className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
            <span>Contact our sales team</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
