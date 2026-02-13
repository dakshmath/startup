'use client'

import React, { useState } from 'react'
import { Check, ArrowRight, Sparkles, HelpCircle, ChevronDown } from 'lucide-react'

interface PricingPlan {
  id: string
  name: string
  description: string
  price: string
  period: string
  features: {
    included: string[]
  }
  popular?: boolean
  cta: string
  ctaVariant: 'primary' | 'outline'
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Current Plan',
    description: 'Basic ideation and market snapshots',
    price: '$0',
    period: '/month',
    features: {
      included: [
        '3 research credits per month',
        'Basic market analysis',
        'Standard competitor overview',
        'Email support'
      ]
    },
    cta: 'Current Plan',
    ctaVariant: 'outline'
  },
  {
    id: 'growth',
    name: 'Pro Plan',
    description: 'Full market intelligence and unlimited research',
    price: '$20',
    period: '/month',
    features: {
      included: [
        'Unlimited research credits',
        'Advanced deep-dive analysis',
        'Financial projections',
        'Risk assessment',
        'Priority support',
        'Custom AI models'
      ]
    },
    popular: true,
    cta: 'Upgrade to Pro',
    ctaVariant: 'primary'
  }
]

const faqs = [
  {
    question: "Can I switch plans later?",
    answer: "Yes, you can upgrade to Pro at any time. If you decide to downgrade back to the free plan, the change will take effect at the end of your current billing cycle."
  },
  {
    question: "What happens if I run out of credits?",
    answer: "On the free plan, credits reset on the 1st of every month. Upgrading to Pro removes these limits entirely so you never have to wait."
  },
  {
    question: "Are there any hidden fees?",
    answer: "No. The price you see is exactly what you pay. All market data retrieval and AI processing costs are included in your subscription."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel with one click in your account settings. No phone calls or emails required. You'll keep your Pro features until your month is up."
  }
]

const PricingCard: React.FC<{ plan: PricingPlan; isHovered: boolean; onHover: (h: boolean) => void }> = ({ plan, isHovered, onHover }) => {
  return (
    <div
      className="relative flex flex-col h-full"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-primary text-primary-foreground text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg tracking-widest uppercase animate-in fade-in zoom-in duration-500">
            Most Popular
          </div>
        </div>
      )}

      <div
        className={`
          relative flex flex-col h-full rounded-[32px] border-2 p-8 transition-all duration-500 ease-out
          ${plan.popular
            ? 'bg-card border-primary shadow-2xl shadow-primary/10'
            : 'bg-card border-border shadow-sm'
          }
          ${isHovered ? 'translate-y-[-8px] border-primary shadow-xl shadow-primary/5' : ''}
        `}
      >
        <div className="mb-8">
          <h3 className="text-2xl font-black text-foreground mb-2">{plan.name}</h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{plan.description}</p>
          <div className="flex items-baseline space-x-1">
            <span className={`text-5xl font-black transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-foreground'}`}>
              {plan.price}
            </span>
            <span className="text-lg text-muted-foreground font-bold">{plan.period}</span>
          </div>
        </div>

        <div className="flex-1 space-y-4 mb-10">
          {plan.features.included.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isHovered ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                <Check className="w-3 h-3" />
              </div>
              <span className="text-sm font-medium text-foreground/80">{feature}</span>
            </div>
          ))}
        </div>

        <button
          disabled={plan.id === 'starter'}
          className={`
            w-full py-4 px-6 rounded-2xl font-black transition-all duration-300 flex items-center justify-center gap-2
            ${plan.ctaVariant === 'primary'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20'
              : 'bg-muted text-muted-foreground cursor-default'
            }
            ${isHovered && plan.ctaVariant === 'primary' ? 'scale-[1.02]' : ''}
          `}
        >
          <span>{plan.cta}</span>
          {plan.ctaVariant === 'primary' && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

export function PricingCards() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Scale Your Vision</span>
        </div>
        <h2 className="text-4xl font-black text-foreground mb-4">Choose Your Plan</h2>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isHovered={hoveredPlan === plan.id}
            onHover={(hovered) => setHoveredPlan(hovered ? plan.id : null)}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="relative py-12">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-4 text-muted-foreground">
            <HelpCircle className="h-6 w-6" />
          </span>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-black text-center mb-10">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="p-6 bg-card border border-border rounded-3xl hover:border-primary/50 transition-colors duration-300"
            >
              <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {faq.question}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}