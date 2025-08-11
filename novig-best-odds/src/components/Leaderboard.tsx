'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HelpCircle } from 'lucide-react'
import { useState } from 'react'

const leaderboardData = [
  {
    id: 1,
    username: '@sharp_27',
    matchup: 'NYY @ HOU',
    market: 'Moneyline',
    saved: 12.50,
    book: 'DraftKings'
  },
  {
    id: 2,
    username: '@betting_pro',
    matchup: 'LAD @ SD',
    market: 'Spread',
    saved: 8.75,
    book: 'FanDuel'
  },
  {
    id: 3,
    username: '@odds_hunter',
    matchup: 'BOS @ SEA',
    market: 'Total Over',
    saved: 15.20,
    book: 'BetMGM'
  },
  {
    id: 4,
    username: '@sports_shark',
    matchup: 'CHC @ TEX',
    market: 'Moneyline',
    saved: 6.80,
    book: 'DraftKings'
  },
  {
    id: 5,
    username: '@line_mover',
    matchup: 'ATL @ PHI',
    market: 'Spread',
    saved: 11.30,
    book: 'FanDuel'
  }
]

export function Leaderboard() {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Biggest Novig wins today (demo)</CardTitle>
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
              {showTooltip && (
                <div className="absolute bottom-full right-0 mb-2 p-3 bg-popover border rounded-md shadow-lg text-sm max-w-xs z-10">
                  <p className="text-muted-foreground">
                    Based on $100 stakes. We calculate the difference in expected payout between Novig odds and competitor odds, 
                    showing how much more you'd win betting with Novig.
                  </p>
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover"></div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboardData.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="w-8 h-8 flex items-center justify-center p-0 text-xs">
                    {entry.id}
                  </Badge>
                  <div>
                    <div className="font-medium">{entry.username}</div>
                    <div className="text-sm text-muted-foreground">{entry.matchup} • {entry.market}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">Saved ${entry.saved.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">vs {entry.book}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
