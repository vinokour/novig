'use client'

import { useEffect } from 'react'
import { Header } from '@/components/Header'
import { BestPicksHero } from '@/components/BestPicksHero'
import { Controls } from '@/components/Controls'
import { OddsTable } from '@/components/OddsTable'
import { useOddsStore } from '@/store/odds-store'

export default function Home() {
  const loadPikkitData = useOddsStore(state => state.loadPikkitData)
  
  useEffect(() => {
    console.info('view_home')
    // Auto-load Pikkit data on app startup
    loadPikkitData()
  }, [loadPikkitData])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BestPicksHero />
      <Controls />
      <main className="bg-gray-50">
        <OddsTable />
      </main>
    </div>
  )
}
