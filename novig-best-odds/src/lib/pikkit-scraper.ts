// Advanced Pikkit scraper that can extract real odds data
// This would need to be run in a browser environment or with a headless browser

export interface PikkitGameData {
  id: string
  sport: string
  league: string
  gameTime: string
  awayTeam: PikkitTeam
  homeTeam: PikkitTeam
  spreadLine: number
  totalLine: number
  sportsbooks: PikkitSportsbook[]
}

export interface PikkitTeam {
  name: string
  abbreviation: string
  logo?: string
}

export interface PikkitSportsbook {
  name: string
  abbreviation: string
  odds: {
    moneyline: number
    spread: number
    totalOver: number
    totalUnder: number
  }
}

// Function to extract data from the Pikkit app DOM
export function extractPikkitDataFromDOM(): PikkitGameData[] {
  const games: PikkitGameData[] = []
  
  try {
    // Look for game containers in the DOM
    const gameElements = document.querySelectorAll('[data-testid*="game"], .game-container, .odds-row')
    
    gameElements.forEach((gameEl, index) => {
      try {
        const gameData = extractGameFromElement(gameEl as HTMLElement, index)
        if (gameData) {
          games.push(gameData)
        }
      } catch (error) {
        console.warn(`Failed to extract game ${index}:`, error)
      }
    })
    
    // If no games found with selectors, try alternative approach
    if (games.length === 0) {
      return extractGamesFromAlternativeSelectors()
    }
    
  } catch (error) {
    console.error('Error extracting Pikkit data:', error)
  }
  
  return games
}

function extractGameFromElement(gameEl: HTMLElement, index: number): PikkitGameData | null {
  try {
    // Extract team names
    const teamElements = gameEl.querySelectorAll('.team-name, [data-testid*="team"], .team')
    if (teamElements.length < 2) return null
    
    const awayTeam = extractTeamFromElement(teamElements[0] as HTMLElement)
    const homeTeam = extractTeamFromElement(teamElements[1] as HTMLElement)
    
    // Extract odds
    const oddsElements = gameEl.querySelectorAll('.odds, [data-testid*="odds"], .betting-odds')
    const sportsbooks = extractSportsbooksFromElements(oddsElements)
    
    // Extract game time
    const timeElement = gameEl.querySelector('.game-time, [data-testid*="time"], .start-time')
    const gameTime = timeElement?.textContent || new Date().toISOString()
    
    // Extract spread and total lines
    const spreadElement = gameEl.querySelector('.spread-line, [data-testid*="spread"]')
    const totalElement = gameEl.querySelector('.total-line, [data-testid*="total"]')
    
    const spreadLine = parseFloat(spreadElement?.textContent?.replace(/[^\d.-]/g, '') || '0')
    const totalLine = parseFloat(totalElement?.textContent?.replace(/[^\d.-]/g, '') || '0')
    
    return {
      id: `pikkit-game-${index}`,
      sport: 'MLB',
      league: 'MLB',
      gameTime,
      awayTeam,
      homeTeam,
      spreadLine,
      totalLine,
      sportsbooks
    }
  } catch (error) {
    console.warn(`Failed to extract game data from element:`, error)
    return null
  }
}

function extractTeamFromElement(teamEl: HTMLElement): PikkitTeam {
  const name = teamEl.textContent?.trim() || 'Unknown Team'
  const abbreviation = extractAbbreviation(name)
  
  return {
    name,
    abbreviation
  }
}

function extractAbbreviation(teamName: string): string {
  // Common MLB team abbreviations
  const abbreviations: Record<string, string> = {
    'New York Yankees': 'NYY',
    'Houston Astros': 'HOU',
    'Los Angeles Dodgers': 'LAD',
    'San Diego Padres': 'SD',
    'Boston Red Sox': 'BOS',
    'Seattle Mariners': 'SEA',
    'Chicago Cubs': 'CHC',
    'Texas Rangers': 'TEX',
    'Atlanta Braves': 'ATL',
    'Philadelphia Phillies': 'PHI',
    'Toronto Blue Jays': 'TOR',
    'Baltimore Orioles': 'BAL',
    'Tampa Bay Rays': 'TB',
    'Minnesota Twins': 'MIN',
    'Cleveland Guardians': 'CLE',
    'Detroit Tigers': 'DET',
    'Chicago White Sox': 'CWS',
    'Kansas City Royals': 'KC',
    'Oakland Athletics': 'OAK',
    'Los Angeles Angels': 'LAA',
    'Arizona Diamondbacks': 'ARI',
    'Colorado Rockies': 'COL',
    'San Francisco Giants': 'SF',
    'Miami Marlins': 'MIA',
    'Washington Nationals': 'WSH',
    'New York Mets': 'NYM',
    'Milwaukee Brewers': 'MIL',
    'Cincinnati Reds': 'CIN',
    'Pittsburgh Pirates': 'PIT',
    'St. Louis Cardinals': 'STL'
  }
  
  return abbreviations[teamName] || teamName.split(' ').map(word => word[0]).join('').toUpperCase()
}

function extractSportsbooksFromElements(oddsElements: NodeListOf<Element>): PikkitSportsbook[] {
  const sportsbooks: PikkitSportsbook[] = []
  
  oddsElements.forEach((oddsEl, index) => {
    try {
      const sportsbookName = extractSportsbookName(oddsEl as HTMLElement)
      const odds = extractOddsFromElement(oddsEl as HTMLElement)
      
      if (sportsbookName && odds) {
        sportsbooks.push({
          name: sportsbookName,
          abbreviation: sportsbookName.split(' ').map(word => word[0]).join(''),
          odds
        })
      }
    } catch (error) {
      console.warn(`Failed to extract sportsbook ${index}:`, error)
    }
  })
  
  return sportsbooks
}

function extractSportsbookName(oddsEl: HTMLElement): string | null {
  // Look for sportsbook name in various locations
  const nameElement = oddsEl.querySelector('.sportsbook-name, [data-testid*="sportsbook"], .book-name')
  return nameElement?.textContent?.trim() || null
}

function extractOddsFromElement(oddsEl: HTMLElement): any {
  try {
    // Look for odds values in various formats
    const moneylineEl = oddsEl.querySelector('.moneyline, [data-testid*="moneyline"], .ml-odds')
    const spreadEl = oddsEl.querySelector('.spread, [data-testid*="spread"], .spread-odds')
    const totalOverEl = oddsEl.querySelector('.total-over, [data-testid*="over"], .over-odds')
    const totalUnderEl = oddsEl.querySelector('.total-under, [data-testid*="under"], .under-odds')
    
    return {
      moneyline: parseFloat(moneylineEl?.textContent?.replace(/[^\d.-]/g, '') || '0'),
      spread: parseFloat(spreadEl?.textContent?.replace(/[^\d.-]/g, '') || '0'),
      totalOver: parseFloat(totalOverEl?.textContent?.replace(/[^\d.-]/g, '') || '0'),
      totalUnder: parseFloat(totalUnderEl?.textContent?.replace(/[^\d.-]/g, '') || '0')
    }
  } catch (error) {
    console.warn('Failed to extract odds:', error)
    return null
  }
}

function extractGamesFromAlternativeSelectors(): PikkitGameData[] {
  // Alternative approach: look for common patterns in the DOM
  const games: PikkitGameData[] = []
  
  try {
    // Look for any elements that might contain game data
    const allElements = document.querySelectorAll('*')
    
    allElements.forEach((el, index) => {
      if (el.textContent && el.textContent.includes('@') && el.textContent.includes('PM')) {
        // This might be a game row
        try {
          const gameData = extractGameFromText(el.textContent, index)
          if (gameData) {
            games.push(gameData)
          }
        } catch (error) {
          // Ignore errors for individual elements
        }
      }
    })
    
  } catch (error) {
    console.error('Error in alternative extraction:', error)
  }
  
  return games
}

function extractGameFromText(text: string, index: number): PikkitGameData | null {
  try {
    // Parse text like "NYY @ HOU 6:10 PM"
    const parts = text.split('@').map(part => part.trim())
    if (parts.length !== 2) return null
    
    const awayTeam = extractTeamFromText(parts[0])
    const homeTeam = extractTeamFromText(parts[1])
    
    if (!awayTeam || !homeTeam) return null
    
    return {
      id: `pikkit-text-game-${index}`,
      sport: 'MLB',
      league: 'MLB',
      gameTime: new Date().toISOString(), // Placeholder
      awayTeam,
      homeTeam,
      spreadLine: 0,
      totalLine: 0,
      sportsbooks: []
    }
  } catch (error) {
    return null
  }
}

function extractTeamFromText(text: string): PikkitTeam | null {
  // Extract team name from text like "NYY 6:10 PM" or "HOU"
  const teamMatch = text.match(/^([A-Z]{2,4})/)
  if (!teamMatch) return null
  
  const abbreviation = teamMatch[1]
  const name = getTeamNameFromAbbreviation(abbreviation)
  
  return {
    name,
    abbreviation
  }
}

function getTeamNameFromAbbreviation(abbr: string): string {
  const teamNames: Record<string, string> = {
    'NYY': 'New York Yankees',
    'HOU': 'Houston Astros',
    'LAD': 'Los Angeles Dodgers',
    'SD': 'San Diego Padres',
    'BOS': 'Boston Red Sox',
    'SEA': 'Seattle Mariners',
    'CHC': 'Chicago Cubs',
    'TEX': 'Texas Rangers',
    'ATL': 'Atlanta Braves',
    'PHI': 'Philadelphia Phillies'
  }
  
  return teamNames[abbr] || abbr
}

// Function to be called from the browser console
export function scrapePikkitFromConsole(): void {
  console.log('Starting Pikkit data extraction...')
  
  const games = extractPikkitDataFromDOM()
  
  console.log('Extracted games:', games)
  console.log('Total games found:', games.length)
  
  // Copy to clipboard for easy access
  const jsonData = JSON.stringify(games, null, 2)
  navigator.clipboard.writeText(jsonData).then(() => {
    console.log('Data copied to clipboard!')
  }).catch(() => {
    console.log('Data (copy manually):', jsonData)
  })
  
  return games
}
