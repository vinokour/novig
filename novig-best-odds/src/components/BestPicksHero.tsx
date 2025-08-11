'use client'

import { ShareBestOdds } from '@/components/ShareBestOdds'
import { useOddsStore } from '@/store/odds-store'
import { TrendingUp, Target, Zap } from 'lucide-react'

export function BestPicksHero() {
  const { games } = useOddsStore()
  
  // Count games with Novig picks
  const NOVIG_LOGO_URL = 'https://d31zyv2gw1yfmz.cloudfront.net/brands/66ec6d77a735d9808f158314.png'
  const gamesWithNovigPicks = games.filter(game => {
    const hasNovigML = game.sportsbookLogos?.moneylineAway === NOVIG_LOGO_URL || 
                       game.sportsbookLogos?.moneylineHome === NOVIG_LOGO_URL
    const hasNovigSpread = game.sportsbookLogos?.spreadAway === NOVIG_LOGO_URL || 
                           game.sportsbookLogos?.spreadHome === NOVIG_LOGO_URL
    const hasNovigTotal = game.sportsbookLogos?.totalOver === NOVIG_LOGO_URL || 
                          game.sportsbookLogos?.totalUnder === NOVIG_LOGO_URL
    
    return hasNovigML || hasNovigSpread || hasNovigTotal
  }).length

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      <div className="container relative py-8 md:py-16 lg:py-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Content */}
          <div className="mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Zap className="h-3 w-3 md:h-4 md:w-4" />
              <span>Real-time Odds Analysis</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent">
                Find the Best
              </span>
              <br />
              <span className="text-gray-900">Betting Odds</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Compare odds across multiple sportsbooks instantly. Get the edge you need to maximize your betting value.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 md:gap-6 mb-8 md:mb-10 max-w-lg mx-auto px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200/50 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 mb-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-100 rounded-lg md:rounded-xl flex items-center justify-center">
                  <Target className="h-4 w-4 md:h-5 md:w-5 text-emerald-600" />
                </div>
                <span className="text-xl md:text-2xl font-bold text-gray-900">{gamesWithNovigPicks}</span>
              </div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Value Opportunities</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200/50 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 mb-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                </div>
                <span className="text-xl md:text-2xl font-bold text-gray-900">Live</span>
              </div>
              <p className="text-xs md:text-sm font-medium text-gray-600">Odds Updates</p>
            </div>
          </div>

          {/* Main CTA */}
          <div className="flex justify-center mb-6 md:mb-8 px-4">
            <ShareBestOdds 
              games={games} 
              className="transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
            />
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs md:text-sm text-gray-500 px-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time data</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Multiple sportsbooks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Best value guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
