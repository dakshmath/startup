'use client'

import React from 'react'
import { X, Crown, Check, Star, Zap, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaywallModalProps {
  onClose: () => void
  onUpgrade: () => void
}

export function PaywallModal({ onClose, onUpgrade }: PaywallModalProps) {
  const plans = [
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'Perfect for startups and small businesses',
      features: [
        'Unlimited idea analysis',
        'Advanced market insights',
        'Competitor analysis',
        'Funding landscape data',
        'Public sentiment analysis',
        'Priority support',
      ],
      icon: Star,
      color: 'blue',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      description: 'For established companies and investors',
      features: [
        'Everything in Pro',
        'Future trends predictions',
        'Custom market reports',
        'API access',
        'Dedicated support',
        'Team collaboration',
        'White-label options',
      ],
      icon: Crown,
      color: 'purple',
      popular: false,
    },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Plan</h2>
              <p className="text-gray-600 mt-1">
                Unlock advanced market intelligence features
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`
                  relative rounded-lg border-2 p-6
                  ${plan.popular 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white'
                  }
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-4">
                    <plan.icon className={`h-6 w-6 ${
                      plan.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  onClick={() => onUpgrade()}
                >
                  Upgrade to {plan.name}
                </Button>
              </div>
            ))}
          </div>

          {/* Free Plan Comparison */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What's included in Free?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Zap className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">3 Ideas/month</p>
                  <p className="text-sm text-gray-600">Basic analysis</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Market Overview</p>
                  <p className="text-sm text-gray-600">Basic insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Star className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Community Support</p>
                  <p className="text-sm text-gray-600">Forum access</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              All plans include 14-day free trial • Cancel anytime • No setup fees
            </p>
            <div className="mt-4 flex items-center justify-center space-x-4">
              <Button variant="outline" onClick={onClose}>
                Maybe Later
              </Button>
              <Button onClick={onUpgrade}>
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
