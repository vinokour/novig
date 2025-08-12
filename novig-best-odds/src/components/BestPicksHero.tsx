'use client'

import { ShareBestOdds } from '@/components/ShareBestOdds'
import { useOddsStore } from '@/store/odds-store'
import { TrendingUp, Target, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

export function BestPicksHero() {
  const { games } = useOddsStore()
  
  // Count games with Novig picks and calculate stats
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

  // Calculate total possible lines and Novig lines
  const totalPossibleLines = games.length * 6 // Each game has 6 betting lines (ML away/home, spread away/home, total over/under)
  let novigLinesCount = 0
  
  games.forEach(game => {
    // Count moneyline
    if (game.sportsbookLogos?.moneylineAway === NOVIG_LOGO_URL) novigLinesCount++
    if (game.sportsbookLogos?.moneylineHome === NOVIG_LOGO_URL) novigLinesCount++
    // Count spread
    if (game.sportsbookLogos?.spreadAway === NOVIG_LOGO_URL) novigLinesCount++
    if (game.sportsbookLogos?.spreadHome === NOVIG_LOGO_URL) novigLinesCount++
    // Count totals
    if (game.sportsbookLogos?.totalOver === NOVIG_LOGO_URL) novigLinesCount++
    if (game.sportsbookLogos?.totalUnder === NOVIG_LOGO_URL) novigLinesCount++
  })
  
  const novigPercentage = totalPossibleLines > 0 ? Math.round((novigLinesCount / totalPossibleLines) * 100) : 0

  // Calculate detailed stats by bet type
  let novigMoneylineCount = 0
  let novigSpreadCount = 0
  let novigTotalCount = 0
  
  games.forEach(game => {
    // Count moneyline
    if (game.sportsbookLogos?.moneylineAway === NOVIG_LOGO_URL) novigMoneylineCount++
    if (game.sportsbookLogos?.moneylineHome === NOVIG_LOGO_URL) novigMoneylineCount++
    // Count spread
    if (game.sportsbookLogos?.spreadAway === NOVIG_LOGO_URL) novigSpreadCount++
    if (game.sportsbookLogos?.spreadHome === NOVIG_LOGO_URL) novigSpreadCount++
    // Count totals
    if (game.sportsbookLogos?.totalOver === NOVIG_LOGO_URL) novigTotalCount++
    if (game.sportsbookLogos?.totalUnder === NOVIG_LOGO_URL) novigTotalCount++
  })

  const totalMoneylineLines = games.length * 2 // 2 moneyline options per game
  const totalSpreadLines = games.length * 2   // 2 spread options per game  
  const totalTotalLines = games.length * 2    // 2 total options per game

  const moneylinePercentage = totalMoneylineLines > 0 ? Math.round((novigMoneylineCount / totalMoneylineLines) * 100) : 0
  const spreadPercentage = totalSpreadLines > 0 ? Math.round((novigSpreadCount / totalSpreadLines) * 100) : 0
  const totalPercentage = totalTotalLines > 0 ? Math.round((novigTotalCount / totalTotalLines) * 100) : 0

  // Animation states
  const [isVisible, setIsVisible] = useState(false)
  const [animatedCounts, setAnimatedCounts] = useState({
    overall: 0,
    bestLines: 0,
    totalGames: 0,
    totalLines: 0,
    moneyline: 0,
    spread: 0,
    total: 0
  })

  // Trigger animations when component mounts and has data
  useEffect(() => {
    if (games.length > 0) {
      setIsVisible(true)
      
      // Animate counters with staggered timing
      const animateCounter = (key: keyof typeof animatedCounts, targetValue: number, delay: number = 0) => {
        setTimeout(() => {
          const duration = 1500
          const steps = 60
          const increment = targetValue / steps
          let current = 0
          
          const timer = setInterval(() => {
            current += increment
            if (current >= targetValue) {
              current = targetValue
              clearInterval(timer)
            }
            setAnimatedCounts(prev => ({ ...prev, [key]: Math.round(current) }))
          }, duration / steps)
        }, delay)
      }

      // Start animations with delays
      animateCounter('overall', novigPercentage, 200)
      animateCounter('bestLines', novigLinesCount, 400)
      animateCounter('totalGames', games.length, 600)
      animateCounter('totalLines', totalPossibleLines, 800)
      animateCounter('moneyline', moneylinePercentage, 1000)
      animateCounter('spread', spreadPercentage, 1200)
      animateCounter('total', totalPercentage, 1400)
    }
  }, [games.length, novigPercentage, novigLinesCount, totalPossibleLines, moneylinePercentage, spreadPercentage, totalPercentage])

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

          {/* Detailed Novig Performance Stats */}
          {games.length > 0 && (
            <div 
              className={`bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6 md:p-8 mb-8 mx-4 max-w-4xl mx-auto transition-all duration-1000 cursor-pointer hover:shadow-xl hover:bg-white/70 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              onClick={() => window.open('https://www.novig.us/', '_blank')}
            >
              <div className={`text-center mb-6 transition-all duration-800 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">The Best MLB Odds Right Now are Offered by Novig</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors">Click anywhere to start betting with the best odds</p>
              </div>

              {/* Overall Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-200/50 transition-all duration-700 delay-300 transform group-hover:scale-105 group-hover:shadow-md ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                  <div className="text-2xl md:text-3xl font-bold text-green-700 mb-1 tabular-nums group-hover:text-green-800 transition-colors">
                    {animatedCounts.overall}%
                  </div>
                  <div className="text-xs md:text-sm font-medium text-green-600 group-hover:text-green-700 transition-colors">Overall Best Lines</div>
                </div>
                <div className={`bg-white rounded-xl p-4 text-center border border-gray-200 transition-all duration-700 delay-500 transform group-hover:scale-105 group-hover:shadow-md group-hover:bg-green-50 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                  <div className="text-2xl md:text-3xl font-bold text-gray-700 mb-1 tabular-nums group-hover:text-green-700 transition-colors">
                    {animatedCounts.bestLines}
                  </div>
                  <div className="text-xs md:text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors">Total Best Lines</div>
                </div>
                <div className={`bg-white rounded-xl p-4 text-center border border-gray-200 transition-all duration-700 delay-700 transform group-hover:scale-105 group-hover:shadow-md group-hover:bg-green-50 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                  <div className="text-2xl md:text-3xl font-bold text-gray-700 mb-1 tabular-nums group-hover:text-green-700 transition-colors">
                    {animatedCounts.totalGames}
                  </div>
                  <div className="text-xs md:text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors">MLB Games</div>
                </div>
                <div className={`bg-white rounded-xl p-4 text-center border border-gray-200 transition-all duration-700 delay-900 transform group-hover:scale-105 group-hover:shadow-md group-hover:bg-green-50 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                  <div className="text-2xl md:text-3xl font-bold text-gray-700 mb-1 tabular-nums group-hover:text-green-700 transition-colors">
                    {animatedCounts.totalLines}
                  </div>
                  <div className="text-xs md:text-sm font-medium text-gray-600 group-hover:text-green-600 transition-colors">Total Lines</div>
                </div>
              </div>

              {/* Bet Type Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Moneyline Stats */}
                <div className={`bg-white rounded-xl p-5 border border-gray-200 shadow-sm transition-all duration-800 delay-1000 transform group-hover:scale-105 group-hover:shadow-lg group-hover:bg-blue-50 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Moneyline</h4>
                    <div className={`w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center transition-all duration-500 delay-1200 ${isVisible ? 'rotate-0 scale-100' : 'rotate-45 scale-0'}`}>
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Best Lines</span>
                      <span className="font-semibold text-gray-900">{novigMoneylineCount}/{totalMoneylineLines}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="font-bold text-green-600 tabular-nums">{animatedCounts.moneyline}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1500 delay-1300" 
                        style={{ width: `${isVisible ? animatedCounts.moneyline : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Spread Stats */}
                <div className={`bg-white rounded-xl p-5 border border-gray-200 shadow-sm transition-all duration-800 delay-1100 transform group-hover:scale-105 group-hover:shadow-lg group-hover:bg-purple-50 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Spread</h4>
                    <div className={`w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center transition-all duration-500 delay-1300 ${isVisible ? 'rotate-0 scale-100' : 'rotate-45 scale-0'}`}>
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Best Lines</span>
                      <span className="font-semibold text-gray-900">{novigSpreadCount}/{totalSpreadLines}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="font-bold text-green-600 tabular-nums">{animatedCounts.spread}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-1500 delay-1400" 
                        style={{ width: `${isVisible ? animatedCounts.spread : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Total Stats */}
                <div className={`bg-white rounded-xl p-5 border border-gray-200 shadow-sm transition-all duration-800 delay-1200 transform group-hover:scale-105 group-hover:shadow-lg group-hover:bg-green-50 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Over/Under</h4>
                    <div className={`w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center transition-all duration-500 delay-1400 ${isVisible ? 'rotate-0 scale-100' : 'rotate-45 scale-0'}`}>
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Best Lines</span>
                      <span className="font-semibold text-gray-900">{novigTotalCount}/{totalTotalLines}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="font-bold text-green-600 tabular-nums">{animatedCounts.total}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1500 delay-1500" 
                        style={{ width: `${isVisible ? animatedCounts.total : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Summary */}
              <div className={`text-center mt-6 pt-6 border-t border-gray-200 transition-all duration-800 delay-1600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-sm text-gray-600">
                  Out of <span className="font-semibold text-gray-900 tabular-nums">{animatedCounts.totalLines} total betting lines</span> across {animatedCounts.totalGames} MLB games, 
                  Novig offers the <span className="font-semibold text-green-600 tabular-nums">best odds on {animatedCounts.bestLines} lines ({animatedCounts.overall}%)</span>
                </p>
              </div>
            </div>
          )}

          {/* Main CTA - Moved below stats */}
          {games.length > 0 && (
            <div className="flex justify-center mb-8 md:mb-12 px-4">
              <ShareBestOdds 
                games={games} 
                className="transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
              />
            </div>
          )}

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
