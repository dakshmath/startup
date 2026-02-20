'use client'

import React, { useState } from 'react'
import { Check, ArrowRight } from 'lucide-react'

interface PricingPlan {
  id: string
  name: string
  description: string
  price: string
  period: string
  features: { included: string[] }
  popular?: boolean
  cta: string
  ctaVariant: 'primary' | 'outline'
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Current Plan',
    description: 'Basic ideation',
    price: '$0',
    period: '/month',
    features: {
      included: ['50 research credits per month'],
    },
    cta: 'Current Plan',
    ctaVariant: 'outline',
  },
  {
    id: 'growth',
    name: 'Pro Plan',
    description: 'For founders in full execution mode.',
    price: '$20',
    period: '/month',
    features: {
      included: [
        '500 research credits per month',
        'Access to *Trends*',
        'Full data exports',
      ],
    },
    popular: true,
    cta: 'Upgrade to Pro',
    ctaVariant: 'primary',
  },
]

const faqs = [
  {
    question: 'What are Trends?',
    answer:
      'A Pro-only feed surfacing high-growth markets and emerging niches before they hit the mainstream.',
  },
  {
    question: 'How do research credits work?',
    answer:
      'Every Deep Research project costs 10 credits. Follow-up questions cost 1 credit each. Credits reset at the start of every month.',
  },
  {
    question: 'What happens if I run out of credits?',
    answer:
      "On the Free plan, you'll need to wait for the monthly reset. Pro users get 500 credits, which is enough to handle roughly 50 full deep-dives per month.",
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      "Yes, you can cancel with one click in your settings. You'll keep your Pro access until the end of your current billing period.",
  },
]

const PricingCard: React.FC<{
  plan: PricingPlan
  isHovered: boolean
  onHover: (h: boolean) => void
}> = ({ plan, isHovered, onHover }) => {
  const proGlowRest  = '0 0 0 1px hsl(142 70% 45% / 0.6), 0 0 20px 2px hsl(142 70% 45% / 0.25), 0 0 40px 4px hsl(142 70% 45% / 0.12)'
  const proGlowHover = '0 0 0 1px hsl(142 70% 45% / 0.9), 0 0 28px 6px hsl(142 70% 45% / 0.40), 0 0 60px 10px hsl(142 70% 45% / 0.18)'
  const freeGlowHover = '0 4px 20px 0px hsl(0 0% 0% / 0.07)'

  const cardBoxShadow = plan.popular
    ? isHovered ? proGlowHover : proGlowRest
    : isHovered ? freeGlowHover : '0 1px 4px 0 hsl(0 0% 0% / 0.04)'

  return (
    <div
      className="relative flex flex-col pt-5"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {plan.popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-primary text-primary-foreground text-[10px] font-black px-6 py-2 rounded-full tracking-widest uppercase whitespace-nowrap shadow-lg shadow-primary/40">
            Most Popular
          </div>
        </div>
      )}

      <div
        className={`
          relative flex flex-col h-full rounded-[32px] border-2 p-8
          transition-all duration-500 ease-out
          ${plan.popular
            ? 'border-primary bg-card'
            : isHovered ? 'border-primary bg-card' : 'border-border bg-card'
          }
          ${isHovered ? '-translate-y-2' : 'translate-y-0'}
        `}
        style={{ boxShadow: cardBoxShadow }}
      >
        {/* Header */}
        <div className="mb-6">
          <h3 className={`text-2xl font-black mb-2 transition-colors duration-300 ${
            plan.popular ? 'text-foreground' : isHovered ? 'text-foreground' : 'text-muted-foreground/80'
          }`}>
            {plan.name}
          </h3>
          <p className={`text-sm leading-relaxed transition-colors duration-300 ${
            plan.popular ? 'text-muted-foreground' : isHovered ? 'text-muted-foreground' : 'text-muted-foreground/60'
          }`}>
            {plan.description}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-8">
          <span className={`text-5xl font-black tracking-tight transition-colors duration-300 ${
            plan.popular
              ? isHovered ? 'text-primary' : 'text-foreground'
              : isHovered ? 'text-primary' : 'text-muted-foreground/70'
          }`}>
            {plan.price}
          </span>
          <span className={`text-lg font-bold transition-colors duration-300 ${
            plan.popular ? 'text-muted-foreground' : 'text-muted-foreground/50'
          }`}>
            {plan.period}
          </span>
        </div>

        {/* Internal divider */}
        <div className={`h-px mb-6 transition-colors duration-300 ${
          plan.popular ? 'bg-primary/20' : isHovered ? 'bg-primary/15' : 'bg-border'
        }`} />

        {/* Features */}
        <div className="flex-1 space-y-4 mb-12">
          {plan.features.included.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                plan.popular
                  ? isHovered ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                  : isHovered ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground/50'
              }`}>
                <Check className="w-3 h-3" strokeWidth={3} />
              </div>
              <span className={`text-sm font-bold transition-colors duration-300 ${
                plan.popular ? 'text-foreground/80' : isHovered ? 'text-foreground/70' : 'text-muted-foreground/60'
              }`}>
                {feature.split('*').map((part, i) =>
                  i % 2 === 1
                    ? <i key={i} className="text-primary not-italic font-black px-0.5">{part}</i>
                    : part
                )}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          disabled={plan.id === 'starter'}
          className={`
            w-full py-4 px-6 rounded-2xl font-black text-sm tracking-wide
            transition-all duration-500 flex items-center justify-center gap-2
            ${plan.ctaVariant === 'primary'
              ? `bg-primary text-primary-foreground shadow-lg shadow-primary/25
                 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/35
                 ${isHovered ? 'scale-[1.02]' : 'scale-100'}`
              : 'bg-muted text-muted-foreground cursor-default'
            }
          `}
        >
          <span>{plan.cta}</span>
          {plan.ctaVariant === 'primary' && (
            <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
              isHovered ? 'translate-x-1' : 'translate-x-0'
            }`} />
          )}
        </button>
      </div>
    </div>
  )
}

export function PricingCards() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">

      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-5xl md:text-6xl font-black text-foreground mb-4 tracking-tighter leading-none">
          Choose Your Plan
        </h2>
        <p className="text-muted-foreground text-lg font-medium max-w-lg mx-auto leading-relaxed">
          Dominate your market with access to AI Deep Research
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
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
    <hr style={{ border: 'none', borderTop: '2px solid hsl(var(--border))', width: '70%', margin: '64px auto 0 auto' }} />

<div className="max-w-4xl mx-auto pb-20" style={{ paddingTop: '60px' }}>
  <h3 className="text-3xl font-black mb-12 tracking-tight text-foreground text-center">
    Frequently Asked Questions
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {faqs.map((faq, index) => (
      <div
        key={index}
        className="p-8 bg-card border border-border rounded-[32px] hover:border-primary/40 hover:shadow-md transition-all duration-300"
      >
          <h4 className="font-bold text-foreground mb-3 text-center leading-snug">
          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
          <span>
            {faq.question.split('*').map((part, i) =>
              i % 2 === 1
                ? <i key={i} className="text-primary not-italic font-black">{part}</i>
                : part
            )}
          </span>
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed font-medium pl-3.5">
          {faq.answer}
        </p>
      </div>
    ))}
  </div>
</div>

        </div>
      )
    }