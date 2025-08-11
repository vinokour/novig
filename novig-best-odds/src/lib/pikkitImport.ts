import { type Game } from '@/data/mlb'

type PikkitPayload = Array<{
  id: string
  sport: string
  league: string
  gameTime: string
  awayTeam: { name: string; abbreviation: string }
  homeTeam: { name: string; abbreviation: string }
  spreadLine: number
  awaySpreadLine?: number  // Away team's actual spread line
  homeSpreadLine?: number  // Home team's actual spread line  
  totalLine: number
  sportsbooks: Array<{
    name: string
    abbreviation: string
    odds: {
      moneyline: number
      spread: number
      totalOver: number
      totalUnder: number
    }
  }>
  awayTeamOdds?: { moneyline: number; spread: number }
  homeTeamOdds?: { moneyline: number; spread: number }
  formattedSpreadLine?: string
  sportsbookLogos?: {
    moneyline: string | null
    moneylineAway?: string | null    // Away team moneyline logo
    moneylineHome?: string | null    // Home team moneyline logo
    spread: string | null
    spreadAway?: string | null       // Away team spread logo  
    spreadHome?: string | null       // Home team spread logo
    totalOver: string | null
    totalUnder: string | null
  }
}>

export function importPikkitJson(input: string): Game[] {
  const raw = JSON.parse(input) as PikkitPayload

  const seen = new Map<string, PikkitPayload[number]>()
  for (const item of raw) {
    seen.set(item.id, item)
  }

  const items = Array.from(seen.values())

  return items.map(convert)
}

function convert(item: PikkitPayload[number]): Game {
  const novig = getBook(item, 'Novig')
  const pikkit = getBook(item, 'Pikkit')

  const awayMoney = item.awayTeamOdds?.moneyline ?? novig?.odds.moneyline ?? pikkit?.odds.moneyline ?? 0
  const homeMoney = item.homeTeamOdds?.moneyline ?? novig?.odds.moneyline ?? pikkit?.odds.moneyline ?? 0

  const awaySpreadOdds = item.awayTeamOdds?.spread ?? novig?.odds.spread ?? pikkit?.odds.spread ?? 0
  const homeSpreadOdds = item.homeTeamOdds?.spread ?? novig?.odds.spread ?? pikkit?.odds.spread ?? 0

  const overOdds = novig?.odds.totalOver ?? pikkit?.odds.totalOver ?? 0
  const underOdds = novig?.odds.totalUnder ?? pikkit?.odds.totalUnder ?? 0

  const startsAt = item.gameTime && item.gameTime !== 'TBD' ? item.gameTime : ''

  return {
    id: item.id,
    league: 'MLB',
    startsAt,
    awayTeam: { name: item.awayTeam.name, abbr: item.awayTeam.abbreviation },
    homeTeam: { name: item.homeTeam.name, abbr: item.homeTeam.abbreviation },
    moneyline: {
      away: { novig: awayMoney, dk: 0, fd: 0, mgm: 0 },
      home: { novig: homeMoney, dk: 0, fd: 0, mgm: 0 }
    },
    spread: {
      away: { 
        line: item.awaySpreadLine ?? item.spreadLine, 
        novig: awaySpreadOdds, dk: 0, fd: 0, mgm: 0 
      },
      home: { 
        line: item.homeSpreadLine ?? -item.spreadLine, 
        novig: homeSpreadOdds, dk: 0, fd: 0, mgm: 0 
      }
    },
    total: {
      line: item.totalLine,
      over: { novig: overOdds, dk: 0, fd: 0, mgm: 0 },
      under: { novig: underOdds, dk: 0, fd: 0, mgm: 0 }
    },
    sportsbookLogos: item.sportsbookLogos
  }
}

function getBook(item: PikkitPayload[number], name: string) {
  return item.sportsbooks.find(b => b.name === name)
}


