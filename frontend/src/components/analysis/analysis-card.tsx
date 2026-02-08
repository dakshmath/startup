'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { formatNumber, formatPercentage } from '@/lib/utils'

interface AnalysisCardProps {
  title: string
  icon: LucideIcon
  data: any
  color: 'blue' | 'red' | 'green' | 'purple' | 'orange'
  locked?: boolean
}

const colorClasses = {
  blue: 'bg-primary/10 text-primary',
  red: 'bg-destructive/10 text-destructive',
  green: 'bg-green-100 text-green-700',
  purple: 'bg-accent/10 text-accent',
  orange: 'bg-orange-100 text-orange-700',
}

export function AnalysisCard({ title, icon: Icon, data, color, locked = false }: AnalysisCardProps) {
  if (locked) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 opacity-60">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (title) {
      case 'Market Momentum':
        return (
          <div className="space-y-4">
            {data.market_size && (
              <div>
                <p className="text-sm text-muted-foreground">Market Size</p>
                <p className="text-xl font-semibold text-foreground">
                  ${formatNumber(data.market_size)}
                </p>
              </div>
            )}
            {data.growth_rate && (
              <div>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
                <p className="text-xl font-semibold text-green-600">
                  {formatPercentage(data.growth_rate)}
                </p>
              </div>
            )}
            {data.momentum_score && (
              <div>
                <p className="text-sm text-muted-foreground">Momentum Score</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${data.momentum_score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{data.momentum_score}/100</span>
                </div>
              </div>
            )}
            {data.current_trends && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Current Trends</p>
                <div className="flex flex-wrap gap-1">
                  {data.current_trends.slice(0, 3).map((trend: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                    >
                      {trend}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'Competition':
        return (
          <div className="space-y-4">
            {data.competition_intensity && (
              <div>
                <p className="text-sm text-muted-foreground">Competition Intensity</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-destructive h-2 rounded-full"
                      style={{ width: `${data.competition_intensity}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{data.competition_intensity}/100</span>
                </div>
              </div>
            )}
            {data.competitors && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Top Competitors</p>
                <div className="space-y-2">
                  {data.competitors.slice(0, 3).map((competitor: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{competitor.name}</span>
                      {competitor.market_share && (
                        <span className="text-sm text-muted-foreground">
                          {formatPercentage(competitor.market_share)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'Capital & Funding':
        return (
          <div className="space-y-4">
            {data.average_funding && (
              <div>
                <p className="text-sm text-muted-foreground">Average Funding</p>
                <p className="text-xl font-semibold text-foreground">
                  ${formatNumber(data.average_funding)}
                </p>
              </div>
            )}
            {data.funding_difficulty && (
              <div>
                <p className="text-sm text-muted-foreground">Funding Difficulty</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${data.funding_difficulty}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{data.funding_difficulty}/100</span>
                </div>
              </div>
            )}
            {data.active_investors && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Active Investors</p>
                <div className="flex flex-wrap gap-1">
                  {data.active_investors.slice(0, 3).map((investor: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
                    >
                      {investor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'Public Opinion':
        return (
          <div className="space-y-4">
            {data.sentiment_score && (
              <div>
                <p className="text-sm text-muted-foreground">Sentiment Score</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full"
                      style={{ width: `${data.sentiment_score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{data.sentiment_score}/100</span>
                </div>
              </div>
            )}
            {data.adoption_potential && (
              <div>
                <p className="text-sm text-muted-foreground">Adoption Potential</p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full"
                      style={{ width: `${data.adoption_potential}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{data.adoption_potential}/100</span>
                </div>
              </div>
            )}
            {data.key_concerns && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Key Concerns</p>
                <div className="space-y-1">
                  {data.key_concerns.slice(0, 2).map((concern: string, index: number) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      • {concern}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 'Future Trends':
        return (
          <div className="space-y-4">
            {data.market_projection && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Market Projection</p>
                <div className="space-y-1">
                  {data.market_projection.year_1 && (
                    <div className="flex justify-between text-sm">
                      <span>Year 1:</span>
                      <span className="font-medium text-foreground">${formatNumber(data.market_projection.year_1)}</span>
                    </div>
                  )}
                  {data.market_projection.year_3 && (
                    <div className="flex justify-between text-sm">
                      <span>Year 3:</span>
                      <span className="font-medium">${formatNumber(data.market_projection.year_3)}</span>
                    </div>
                  )}
                  {data.market_projection.year_5 && (
                    <div className="flex justify-between text-sm">
                      <span>Year 5:</span>
                      <span className="font-medium">${formatNumber(data.market_projection.year_5)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {data.technology_trends && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Technology Trends</p>
                <div className="flex flex-wrap gap-1">
                  {data.technology_trends.slice(0, 3).map((trend: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700"
                    >
                      {trend}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Analysis data available</p>
          </div>
        )
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      {renderContent()}
    </div>
  )
}
