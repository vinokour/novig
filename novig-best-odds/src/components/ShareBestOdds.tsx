'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Share2, X, Copy, TrendingUp } from 'lucide-react'
import { type Game } from '@/data/mlb'
import { formatAmericanOdds } from '@/lib/utils'
import { format } from 'date-fns'

interface ShareBestOddsProps {
  games: Game[]
  className?: string
}

export function ShareBestOdds({ games, className = '' }: ShareBestOddsProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Novig logo URL to identify Novig picks
  const NOVIG_LOGO_URL = 'https://d31zyv2gw1yfmz.cloudfront.net/brands/66ec6d77a735d9808f158314.png'

  // Filter games to only include those with at least one Novig pick
  const gamesWithNovigPicks = games.filter(game => {
    const hasNovigML = game.sportsbookLogos?.moneylineAway === NOVIG_LOGO_URL || 
                       game.sportsbookLogos?.moneylineHome === NOVIG_LOGO_URL
    const hasNovigSpread = game.sportsbookLogos?.spreadAway === NOVIG_LOGO_URL || 
                           game.sportsbookLogos?.spreadHome === NOVIG_LOGO_URL
    const hasNovigTotal = game.sportsbookLogos?.totalOver === NOVIG_LOGO_URL || 
                          game.sportsbookLogos?.totalUnder === NOVIG_LOGO_URL
    
    return hasNovigML || hasNovigSpread || hasNovigTotal
  }).slice(0, 4)

  const generateShareableText = () => {
    const today = format(new Date(), 'MMMM d, yyyy')
    let shareText = `🎯 Today's Best Picks - ${today}\n\n`
    
    gamesWithNovigPicks.forEach((game, index) => {
      const gameTime = (() => {
        const d = new Date(game.startsAt)
        return isNaN(d.getTime()) ? 'TBD' : format(d, 'h:mm a')
      })()
      
      shareText += `⚾ ${game.awayTeam.name} @ ${game.homeTeam.name} (${gameTime})\n`
      
      // Collect all available Novig picks for this game
      const availablePicks = []
      
      // Moneyline picks
      if (game.sportsbookLogos?.moneylineAway === NOVIG_LOGO_URL) {
        availablePicks.push({
          type: 'ML',
          text: `💰 ${game.awayTeam.name} ML ${formatAmericanOdds(game.moneyline.away.novig)} (from Novig)`
        })
      }
      if (game.sportsbookLogos?.moneylineHome === NOVIG_LOGO_URL) {
        availablePicks.push({
          type: 'ML',
          text: `💰 ${game.homeTeam.name} ML ${formatAmericanOdds(game.moneyline.home.novig)} (from Novig)`
        })
      }
      
      // Spread picks
      if (game.sportsbookLogos?.spreadAway === NOVIG_LOGO_URL) {
        availablePicks.push({
          type: 'SPREAD',
          text: `📊 ${game.awayTeam.name} ${game.spread.away.line > 0 ? '+' : ''}${game.spread.away.line} ${formatAmericanOdds(game.spread.away.novig)} (from Novig)`
        })
      }
      if (game.sportsbookLogos?.spreadHome === NOVIG_LOGO_URL) {
        availablePicks.push({
          type: 'SPREAD',
          text: `📊 ${game.homeTeam.name} ${game.spread.home.line > 0 ? '+' : ''}${game.spread.home.line} ${formatAmericanOdds(game.spread.home.novig)} (from Novig)`
        })
      }
      
      // Total picks
      if (game.sportsbookLogos?.totalOver === NOVIG_LOGO_URL) {
        availablePicks.push({
          type: 'TOTAL',
          text: `🎯 Over ${game.total.line} ${formatAmericanOdds(game.total.over.novig)} (from Novig)`
        })
      }
      if (game.sportsbookLogos?.totalUnder === NOVIG_LOGO_URL) {
        availablePicks.push({
          type: 'TOTAL',
          text: `🎯 Under ${game.total.line} ${formatAmericanOdds(game.total.under.novig)} (from Novig)`
        })
      }
      
      // Mix up the pick selection - rotate based on game index to ensure variety
      let selectedPick = null
      if (availablePicks.length > 0) {
        // Create a rotation pattern: ML -> Spread -> Total -> ML -> etc.
        const preferredTypes = ['ML', 'SPREAD', 'TOTAL']
        const preferredType = preferredTypes[index % 3]
        
        // Try to find preferred type first
        selectedPick = availablePicks.find(pick => pick.type === preferredType)
        
        // If preferred type not available, take the first available
        if (!selectedPick) {
          selectedPick = availablePicks[0]
        }
      }
      
      // Add the selected pick
      if (selectedPick) {
        shareText += `${selectedPick.text}\n`
      }
      
      if (index < gamesWithNovigPicks.length - 1) shareText += '\n'
    })
    
    if (gamesWithNovigPicks.length === 0) {
      shareText += 'No Novig picks available today. Check back later!\n'
    }
    
    shareText += '\n🚀 Got Novig? Bet smarter at www.novig.us\n'
    shareText += '✨ These picks are only from Novig - where we beat the competition!'
    
    return shareText
  }

  const handleShowPicks = () => {
    console.info('show_novig_picks', { gameCount: gamesWithNovigPicks.length })
    setIsPopupOpen(true)
  }

  const handleCopyPicks = async () => {
    try {
      const shareText = generateShareableText()
      await navigator.clipboard.writeText(shareText)
      
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback for older browsers
      const shareText = generateShareableText()
      const textArea = document.createElement('textarea')
      textArea.value = shareText
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError)
      }
      document.body.removeChild(textArea)
    }
  }

  const closePopup = () => {
    setIsPopupOpen(false)
    setIsCopied(false)
  }

  if (games.length === 0 || gamesWithNovigPicks.length === 0) return null

  return (
    <>
      <div className={className}>
        <Button 
          onClick={handleShowPicks}
          variant="default"
          size="lg"
          className="gap-2 md:gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto shadow-lg w-full sm:w-auto"
        >
          <Share2 className="h-4 w-4 md:h-5 md:w-5" />
          View Our Value Picks
        </Button>
      </div>

      {/* Picks Popup */}
      {isPopupOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closePopup}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] md:max-h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Best Value Opportunities</h2>
                    <p className="text-emerald-100 text-sm">{format(new Date(), 'MMMM d, yyyy')}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={closePopup}
                  className="hover:bg-white/20 text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
              {gamesWithNovigPicks.map((game, index) => {
                // Collect all available Novig picks for this game (same logic as before)
                const availablePicks = []
                
                // Moneyline picks
                if (game.sportsbookLogos?.moneylineAway === NOVIG_LOGO_URL) {
                  availablePicks.push({
                    type: 'ML',
                    text: `${game.awayTeam.name} ML ${formatAmericanOdds(game.moneyline.away.novig)}`,
                    emoji: '💰'
                  })
                }
                if (game.sportsbookLogos?.moneylineHome === NOVIG_LOGO_URL) {
                  availablePicks.push({
                    type: 'ML',
                    text: `${game.homeTeam.name} ML ${formatAmericanOdds(game.moneyline.home.novig)}`,
                    emoji: '💰'
                  })
                }
                
                // Spread picks
                if (game.sportsbookLogos?.spreadAway === NOVIG_LOGO_URL) {
                  availablePicks.push({
                    type: 'SPREAD',
                    text: `${game.awayTeam.name} ${game.spread.away.line > 0 ? '+' : ''}${game.spread.away.line} ${formatAmericanOdds(game.spread.away.novig)}`,
                    emoji: '📊'
                  })
                }
                if (game.sportsbookLogos?.spreadHome === NOVIG_LOGO_URL) {
                  availablePicks.push({
                    type: 'SPREAD',
                    text: `${game.homeTeam.name} ${game.spread.home.line > 0 ? '+' : ''}${game.spread.home.line} ${formatAmericanOdds(game.spread.home.novig)}`,
                    emoji: '📊'
                  })
                }
                
                // Total picks
                if (game.sportsbookLogos?.totalOver === NOVIG_LOGO_URL) {
                  availablePicks.push({
                    type: 'TOTAL',
                    text: `Over ${game.total.line} ${formatAmericanOdds(game.total.over.novig)}`,
                    emoji: '🎯'
                  })
                }
                if (game.sportsbookLogos?.totalUnder === NOVIG_LOGO_URL) {
                  availablePicks.push({
                    type: 'TOTAL',
                    text: `Under ${game.total.line} ${formatAmericanOdds(game.total.under.novig)}`,
                    emoji: '🎯'
                  })
                }
                
                // Select pick using same rotation logic
                let selectedPick = null
                if (availablePicks.length > 0) {
                  const preferredTypes = ['ML', 'SPREAD', 'TOTAL']
                  const preferredType = preferredTypes[index % 3]
                  selectedPick = availablePicks.find(pick => pick.type === preferredType) || availablePicks[0]
                }

                if (!selectedPick) return null

                return (
                  <div 
                    key={game.id} 
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => window.open('https://www.novig.us/', '_blank')}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">⚾</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {game.awayTeam.name} @ {game.homeTeam.name}
                      </span>
                    </div>
                    
                    <div className="bg-black text-white rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src="https://d31zyv2gw1yfmz.cloudfront.net/brands/66ec6d77a735d9808f158314.png" 
                            alt="Novig" 
                            className="w-6 h-6 rounded"
                          />
                          <span className="font-semibold text-sm">
                            {selectedPick.text}
                          </span>
                        </div>
                        <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full font-medium">
                          Novig
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}

            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-4">
              <div className="text-center mb-4">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-1">Smart Betting Opportunities</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">These are the games with the most favorable odds available today.</p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleCopyPicks}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={isCopied}
                >
                  {isCopied ? (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to Share
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={closePopup}
                  className="px-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
