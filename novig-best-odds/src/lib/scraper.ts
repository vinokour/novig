import { Game } from '@/data/mlb'

// Pikkit API endpoints (these would need to be discovered by inspecting network requests)
const PIKKIT_API_BASE = 'https://app.pikkit.com/api'

export interface PikkitOdds {
  id: string
  sport: string
  league: string
  gameTime: string
  awayTeam: {
    name: string
    abbreviation: string
    odds: {
      moneyline: number
      spread: number
      totalOver: number
    }
  }
  homeTeam: {
    name: string
    abbreviation: string
    odds: {
      moneyline: number
      spread: number
      totalUnder: number
    }
  }
  spreadLine: number
  totalLine: number
}

export async function scrapePikkitOdds(sport: string = 'MLB'): Promise<PikkitOdds[]> {
  try {
    // This is a placeholder - we'd need to discover the actual API endpoints
    const response = await fetch(`${PIKKIT_API_BASE}/odds/${sport.toLowerCase()}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch odds: ${response.status}`)
    }
    
    const data = await response.json()
    return data.games || []
  } catch (error) {
    console.error('Error scraping Pikkit odds:', error)
    
    // Return sample data for now
    return getSamplePikkitData()
  }
}

// Sample data structure based on what we'd expect from Pikkit
function getSamplePikkitData(): PikkitOdds[] {
  return [
    {
      id: 'pikkit-mlb-001',
      sport: 'MLB',
      league: 'MLB',
      gameTime: '2024-03-28T19:05:00Z',
      awayTeam: {
        name: 'New York Yankees',
        abbreviation: 'NYY',
        odds: {
          moneyline: -110,
          spread: +140,
          totalOver: -105
        }
      },
      homeTeam: {
        name: 'Houston Astros',
        abbreviation: 'HOU',
        odds: {
          moneyline: +100,
          spread: -160,
          totalUnder: -115
        }
      },
      spreadLine: -1.5,
      totalLine: 8.5
    },
    {
      id: 'pikkit-mlb-002',
      sport: 'MLB',
      league: 'MLB',
      gameTime: '2024-03-28T20:10:00Z',
      awayTeam: {
        name: 'Los Angeles Dodgers',
        abbreviation: 'LAD',
        odds: {
          moneyline: -140,
          spread: +110,
          totalOver: -110
        }
      },
      homeTeam: {
        name: 'San Diego Padres',
        abbreviation: 'SD',
        odds: {
          moneyline: +120,
          spread: -130,
          totalUnder: -110
        }
      },
      spreadLine: -1.5,
      totalLine: 9.0
    }
  ]
}

// Convert Pikkit data to our Game format
export function convertPikkitToGame(pikkitOdds: PikkitOdds): Game {
  return {
    id: pikkitOdds.id,
    league: 'MLB' as const,
    startsAt: pikkitOdds.gameTime,
    awayTeam: {
      name: pikkitOdds.awayTeam.name,
      abbr: pikkitOdds.awayTeam.abbreviation
    },
    homeTeam: {
      name: pikkitOdds.homeTeam.name,
      abbr: pikkitOdds.homeTeam.abbreviation
    },
    moneyline: {
      away: { novig: pikkitOdds.awayTeam.odds.moneyline, dk: 0, fd: 0, mgm: 0 },
      home: { novig: pikkitOdds.homeTeam.odds.moneyline, dk: 0, fd: 0, mgm: 0 }
    },
    spread: {
      away: { line: pikkitOdds.spreadLine, novig: pikkitOdds.awayTeam.odds.spread, dk: 0, fd: 0, mgm: 0 },
      home: { line: -pikkitOdds.spreadLine, novig: pikkitOdds.homeTeam.odds.spread, dk: 0, fd: 0, mgm: 0 }
    },
    total: {
      line: pikkitOdds.totalLine,
      over: { novig: pikkitOdds.awayTeam.odds.totalOver, dk: 0, fd: 0, mgm: 0 },
      under: { novig: pikkitOdds.homeTeam.odds.totalUnder, dk: 0, fd: 0, mgm: 0 }
    }
  }
}
