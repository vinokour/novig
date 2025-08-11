'use client'

import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Share2, ExternalLink } from 'lucide-react'
import { Game } from '@/data/mlb'
import { calculateDelta, formatAmericanOdds, formatCurrency, isNovigBetter } from '@/lib/utils'
import { useOddsStore } from '@/store/odds-store'
import { toPng } from 'html-to-image'
import { useRef } from 'react'
import { getMlbLogoUrl } from '@/lib/logos'

interface GameDetailsProps {
  game: Game
  isOpen: boolean
  onClose: () => void
  comparisonBook: string
}

export function GameDetails({ game, isOpen, onClose, comparisonBook }: GameDetailsProps) {
  const { getCompetitorOddsKey } = useOddsStore()
  const cardRef = useRef<HTMLDivElement>(null)
  const competitorKey = getCompetitorOddsKey()

  const handleBetClick = (market: string) => {
    console.info('click_cta', { gameId: game.id, market })
    const utmParams = `utm_source=best-odds&utm_medium=landing&utm_campaign=mvp&utm_content=${game.id}-${market}`
    window.open(`https://www.novig.us/?${utmParams}`, '_blank')
  }

  const handleShareImage = async () => {
    if (!cardRef.current) return

    try {
      console.info('share_image', { gameId: game.id })
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff'
      })
      
      const link = document.createElement('a')
      link.download = `novig-better-${game.id}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to generate image:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Game Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6" ref={cardRef}>
          {/* Game Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                {(() => {
                  const src = getMlbLogoUrl(game.awayTeam.abbr)
                  return src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={game.awayTeam.abbr} className="w-10 h-10 object-contain" />
                  ) : null
                })()}
              </div>
              <h3 className="text-xl font-semibold">
                {game.awayTeam.name} @ {game.homeTeam.name}
              </h3>
              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
                {(() => {
                  const src = getMlbLogoUrl(game.homeTeam.abbr)
                  return src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={game.homeTeam.abbr} className="w-10 h-10 object-contain" />
                  ) : null
                })()}
              </div>
            </div>
            <p className="text-muted-foreground">
              {(() => {
                const d = new Date(game.startsAt)
                return isNaN(d.getTime()) ? 'TBD' : format(d, 'EEEE, MMMM d, yyyy - h:mm a')
              })()}
            </p>
          </div>

          {/* Markets */}
          <div className="space-y-6">
            {/* Moneyline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Moneyline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">{game.awayTeam.abbr}</div>
                    <div className={`text-2xl font-bold ${isNovigBetter(game.moneyline.away.novig, game.moneyline.away[competitorKey as keyof typeof game.moneyline.away] as number) ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {formatAmericanOdds(game.moneyline.away.novig)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      vs {formatAmericanOdds(game.moneyline.away[competitorKey as keyof typeof game.moneyline.away] as number)}
                    </div>
                    {isNovigBetter(game.moneyline.away.novig, game.moneyline.away[competitorKey as keyof typeof game.moneyline.away] as number) && (
                      <Badge variant="success" className="mt-2">
                        +{formatCurrency(calculateDelta(game.moneyline.away.novig, game.moneyline.away[competitorKey as keyof typeof game.moneyline.away] as number))}
                      </Badge>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">{game.homeTeam.abbr}</div>
                    <div className={`text-2xl font-bold ${isNovigBetter(game.moneyline.home.novig, game.moneyline.home[competitorKey as keyof typeof game.moneyline.home] as number) ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {formatAmericanOdds(game.moneyline.home.novig)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      vs {formatAmericanOdds(game.moneyline.home[competitorKey as keyof typeof game.moneyline.home] as number)}
                    </div>
                    {isNovigBetter(game.moneyline.home.novig, game.moneyline.home[competitorKey as keyof typeof game.moneyline.home] as number) && (
                      <Badge variant="success" className="mt-2">
                        +{formatCurrency(calculateDelta(game.moneyline.home.novig, game.moneyline.home[competitorKey as keyof typeof game.moneyline.home] as number))}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spread */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Spread</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">{game.awayTeam.abbr} {game.spread.away.line > 0 ? `+${game.spread.away.line}` : game.spread.away.line}</div>
                    <div className={`text-2xl font-bold ${isNovigBetter(game.spread.away.novig, game.spread.away[competitorKey as keyof typeof game.spread.away] as number) ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {formatAmericanOdds(game.spread.away.novig)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      vs {formatAmericanOdds(game.spread.away[competitorKey as keyof typeof game.spread.away] as number)}
                    </div>
                    {isNovigBetter(game.spread.away.novig, game.spread.away[competitorKey as keyof typeof game.spread.away] as number) && (
                      <Badge variant="success" className="mt-2">
                        +{formatCurrency(calculateDelta(game.spread.away.novig, game.spread.away[competitorKey as keyof typeof game.spread.away] as number))}
                      </Badge>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">{game.homeTeam.abbr} {game.spread.home.line > 0 ? `+${game.spread.home.line}` : game.spread.home.line}</div>
                    <div className={`text-2xl font-bold ${isNovigBetter(game.spread.home.novig, game.spread.home[competitorKey as keyof typeof game.spread.home] as number) ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {formatAmericanOdds(game.spread.home.novig)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      vs {formatAmericanOdds(game.spread.home[competitorKey as keyof typeof game.spread.home] as number)}
                    </div>
                    {isNovigBetter(game.spread.home.novig, game.spread.home[competitorKey as keyof typeof game.spread.home] as number) && (
                      <Badge variant="success" className="mt-2">
                        +{formatCurrency(calculateDelta(game.spread.home.novig, game.spread.home[competitorKey as keyof typeof game.spread.home] as number))}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total: {game.total.line}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Over</div>
                    <div className={`text-2xl font-bold ${isNovigBetter(game.total.over.novig, game.total.over[competitorKey as keyof typeof game.total.over] as number) ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {formatAmericanOdds(game.total.over.novig)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      vs {formatAmericanOdds(game.total.over[competitorKey as keyof typeof game.total.over] as number)}
                    </div>
                    {isNovigBetter(game.total.over.novig, game.total.over[competitorKey as keyof typeof game.total.over] as number) && (
                      <Badge variant="success" className="mt-2">
                        +{formatCurrency(calculateDelta(game.total.over.novig, game.total.over[competitorKey as keyof typeof game.total.over] as number))}
                      </Badge>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Under</div>
                    <div className={`text-2xl font-bold ${isNovigBetter(game.total.under.novig, game.total.under[competitorKey as keyof typeof game.total.under] as number) ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {formatAmericanOdds(game.total.under.novig)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      vs {formatAmericanOdds(game.total.under[competitorKey as keyof typeof game.total.under] as number)}
                    </div>
                    {isNovigBetter(game.total.under.novig, game.total.under[competitorKey as keyof typeof game.total.under] as number) && (
                      <Badge variant="success" className="mt-2">
                        +{formatCurrency(calculateDelta(game.total.under.novig, game.total.under[competitorKey as keyof typeof game.total.under] as number))}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button 
              size="lg" 
              className="flex-1"
              onClick={() => handleBetClick('moneyline')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Bet on Novig
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleShareImage}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share proof
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            Sample data for demo. Odds change. Check Novig for live markets.
          </p>
        </div>
      </div>
    </div>
  )
}
