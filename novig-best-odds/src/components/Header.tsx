import { BarChart3, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Header() {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-16 md:h-20 items-center justify-between px-4">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-green-600 shadow-lg">
            <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              OddsEdge
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-medium hidden sm:block">Smart Betting Analytics</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-6">
          <div className="hidden sm:flex items-center space-x-1 text-xs md:text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="hidden md:inline">Accurate data according to Pikkit. Updated as of 9:20 on August 12th</span>
            <span className="md:hidden">{currentTime}</span>
          </div>
          <a 
            href="https://www.novig.us/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          >
            <span className="hidden sm:inline">Bet Smarter</span>
            <span className="sm:hidden">Bet</span>
            <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
          </a>
        </div>
      </div>
    </header>
  )
}
