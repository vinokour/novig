'use client'


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { type Game } from '@/data/mlb'
import { useOddsStore } from '@/store/odds-store'
import { formatAmericanOdds } from '@/lib/utils'
import { useState } from 'react'
import { GameDetails } from '@/components/GameDetails'
import React from 'react'
import { getMlbLogoUrl } from '@/lib/logos'
import { SportsbookLogo, hasBestLine } from '@/lib/sportsbook-logos'
import { PikkitSportsbookLogo } from '@/lib/pikkit-sportsbook-logos'

export function OddsTable() {
  const { comparisonBook, games, isLoading } = useOddsStore()
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredGames = games

  const handleRowClick = (game: Game) => {
    // Route to Novig instead of showing details
    window.open('https://www.novig.us/', '_blank')
  }

  const closeDetails = () => {
    setIsDetailsOpen(false)
    setSelectedGame(null)
  }

  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <div className="mx-auto max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700">Loading games...</h3>
          <p className="text-sm text-gray-500 mt-2">
            Getting the latest odds data
          </p>
        </div>
      </div>
    )
  }

  if (filteredGames.length === 0) {
    return (
      <div className="container py-12 text-center">
        <div className="mx-auto max-w-md">
          <h3 className="text-lg font-semibold text-muted-foreground">No games found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            No games available
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container py-4 md:py-8 px-4">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 border-b border-gray-200">
                  <TableHead className="font-semibold text-gray-900 py-3 md:py-4 px-3 md:px-6 text-left">Matchup</TableHead>
                  <TableHead className="text-center font-semibold text-gray-900 py-3 md:py-4 px-2 md:px-4 min-w-[80px]">ML</TableHead>
                  <TableHead className="text-center font-semibold text-gray-900 py-3 md:py-4 px-2 md:px-4 min-w-[80px]">Spread</TableHead>
                  <TableHead className="text-center font-semibold text-gray-900 py-3 md:py-4 px-2 md:px-4 min-w-[80px]">Total</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
            {filteredGames.map((game) => (
              <React.Fragment key={game.id}>
                {/* Away Team Row */}
                <TableRow className="cursor-pointer hover:bg-green-50/50 border-b border-gray-100 transition-colors" onClick={() => handleRowClick(game)}>
                  <TableCell className="py-3 md:py-4 px-3 md:px-6">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm flex-shrink-0">
                        {(() => {
                          const src = getMlbLogoUrl(game.awayTeam.abbr)
                          return src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={src} alt={game.awayTeam.abbr} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                          ) : (
                            <Badge variant="outline" className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center p-0 text-xs font-medium">
                              {game.awayTeam.abbr}
                            </Badge>
                          )
                        })()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-gray-900 text-sm md:text-base truncate block">{game.awayTeam.name}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Moneyline */}
                  <TableCell className="px-2 md:px-4">
                    <div className="space-y-1">
                      <div className="text-center">
                        <div className="font-medium text-foreground text-xs md:text-sm">
                          {formatAmericanOdds(game.moneyline.away.novig)}
                        </div>
                      </div>
                      <div className="flex justify-center mt-1">
                        {game.sportsbookLogos?.moneylineAway && (
                          <PikkitSportsbookLogo 
                            logoUrl={game.sportsbookLogos.moneylineAway} 
                            size="w-4 h-4 md:w-5 md:h-5"
                          />
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Spread */}
                  <TableCell className="px-2 md:px-4">
                    <div className="space-y-1">
                      <div className="text-center">
                        <div className="font-medium text-foreground text-xs md:text-sm">
                          {game.spread.away.line > 0 ? `+${game.spread.away.line}` : game.spread.away.line}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatAmericanOdds(game.spread.away.novig)}
                        </div>
                      </div>
                      <div className="flex justify-center mt-1">
                        {game.sportsbookLogos?.spreadAway && (
                          <PikkitSportsbookLogo 
                            logoUrl={game.sportsbookLogos.spreadAway} 
                            size="w-4 h-4 md:w-5 md:h-5"
                          />
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Total */}
                  <TableCell className="px-2 md:px-4">
                    <div className="space-y-1">
                      <div className="text-center">
                        <div className="font-medium text-foreground text-xs md:text-sm">
                          o{game.total.line}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatAmericanOdds(game.total.over.novig)}
                        </div>
                      </div>
                      <div className="flex justify-center mt-1">
                        {game.sportsbookLogos?.totalOver && (
                          <PikkitSportsbookLogo 
                            logoUrl={game.sportsbookLogos.totalOver} 
                            size="w-4 h-4 md:w-5 md:h-5"
                          />
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Home Team Row */}
                <TableRow className="cursor-pointer hover:bg-green-50/50 border-b border-gray-100 transition-colors" onClick={() => handleRowClick(game)}>
                  <TableCell className="py-3 md:py-4 px-3 md:px-6">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm flex-shrink-0">
                        {(() => {
                          const src = getMlbLogoUrl(game.homeTeam.abbr)
                          return src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={src} alt={game.homeTeam.abbr} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                          ) : (
                            <Badge variant="outline" className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center p-0 text-xs font-medium">
                              {game.homeTeam.abbr}
                            </Badge>
                          )
                        })()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-semibold text-gray-900 text-sm md:text-base truncate block">{game.homeTeam.name}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Moneyline */}
                  <TableCell className="px-2 md:px-4">
                    <div className="space-y-1">
                      <div className="text-center">
                        <div className="font-medium text-foreground text-xs md:text-sm">
                          {formatAmericanOdds(game.moneyline.home.novig)}
                        </div>
                      </div>
                      <div className="flex justify-center mt-1">
                        {game.sportsbookLogos?.moneylineHome && (
                          <PikkitSportsbookLogo 
                            logoUrl={game.sportsbookLogos.moneylineHome} 
                            size="w-4 h-4 md:w-5 md:h-5"
                          />
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Spread */}
                  <TableCell className="px-2 md:px-4">
                    <div className="space-y-1">
                      <div className="text-center">
                        <div className="font-medium text-foreground text-xs md:text-sm">
                          {game.spread.home.line > 0 ? `+${game.spread.home.line}` : game.spread.home.line}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatAmericanOdds(game.spread.home.novig)}
                        </div>
                      </div>
                      <div className="flex justify-center mt-1">
                        {game.sportsbookLogos?.spreadHome && (
                          <PikkitSportsbookLogo 
                            logoUrl={game.sportsbookLogos.spreadHome} 
                            size="w-4 h-4 md:w-5 md:h-5"
                          />
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Total */}
                  <TableCell className="px-2 md:px-4">
                    <div className="space-y-1">
                      <div className="text-center">
                        <div className="font-medium text-foreground text-xs md:text-sm">
                          u{game.total.line}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatAmericanOdds(game.total.under.novig)}
                        </div>
                      </div>
                      <div className="flex justify-center mt-1">
                        {game.sportsbookLogos?.totalUnder && (
                          <PikkitSportsbookLogo 
                            logoUrl={game.sportsbookLogos.totalUnder} 
                            size="w-4 h-4 md:w-5 md:h-5"
                          />
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Game Info Row */}
                <TableRow className="bg-gray-50/30">
                  <TableCell colSpan={4} className="py-2 md:py-3 px-3 md:px-6">
                    <div className="flex items-center justify-end">
                      <a 
                        href="https://www.novig.us/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                      >
                        <span>More wagers</span>
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
            </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Game Details Drawer */}
      {selectedGame && (
        <GameDetails
          game={selectedGame}
          isOpen={isDetailsOpen}
          onClose={closeDetails}
          comparisonBook={comparisonBook}
        />
      )}
    </>
  )
}
