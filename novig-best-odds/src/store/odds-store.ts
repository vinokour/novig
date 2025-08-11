import { create } from 'zustand'
import { type Game } from '@/data/mlb'
import { importPikkitJson } from '@/lib/pikkitImport'

export type ComparisonBook = 'DraftKings' | 'FanDuel' | 'BetMGM'

interface OddsStore {
  // Filters
  selectedSport: string
  comparisonBook: ComparisonBook
  
  // Data
  games: Game[]
  isLoading: boolean
  
  // Actions
  setSelectedSport: (sport: string) => void
  setComparisonBook: (book: ComparisonBook) => void
  setGames: (games: Game[]) => void
  loadPikkitData: () => Promise<void>
  
  // Computed values
  getCompetitorOddsKey: () => 'dk' | 'fd' | 'mgm'
}

export const useOddsStore = create<OddsStore>((set, get) => ({
  // Initial state
  selectedSport: 'MLB',
  comparisonBook: 'DraftKings',
  games: [],
  isLoading: false,
  
  // Actions
  setSelectedSport: (sport) => set({ selectedSport: sport }),
  setComparisonBook: (book) => set({ comparisonBook: book }),
  setGames: (games) => set({ games }),
  
  loadPikkitData: async () => {
    set({ isLoading: true })
    try {
      const response = await fetch('/pikkit-data.json')
      if (!response.ok) {
        throw new Error('Failed to load Pikkit data')
      }
      const jsonText = await response.text()
      const games = importPikkitJson(jsonText)
      
      // Add 1 second delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      set({ games, isLoading: false })
      console.info('loaded_pikkit_games_automatically', { count: games.length })
    } catch (error) {
      console.error('Failed to load Pikkit data automatically:', error)
      set({ isLoading: false })
    }
  },
  
  // Computed values
  getCompetitorOddsKey: () => {
    const { comparisonBook } = get()
    switch (comparisonBook) {
      case 'DraftKings': return 'dk'
      case 'FanDuel': return 'fd'
      case 'BetMGM': return 'mgm'
      default: return 'dk'
    }
  }
}))
