import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert American odds to decimal odds
export function americanToDecimal(americanOdds: number): number {
  if (americanOdds > 0) {
    return (americanOdds / 100) + 1
  } else {
    return (100 / Math.abs(americanOdds)) + 1
  }
}

// Calculate expected payout for $100 stake
export function calculatePayout(americanOdds: number, stake: number = 100): number {
  if (americanOdds > 0) {
    return stake + (stake * americanOdds / 100)
  } else {
    return stake + (stake * 100 / Math.abs(americanOdds))
  }
}

// Calculate the difference in expected payout between two odds
export function calculateDelta(novigOdds: number, competitorOdds: number, stake: number = 100): number {
  const novigPayout = calculatePayout(novigOdds, stake)
  const competitorPayout = calculatePayout(competitorOdds, stake)
  return novigPayout - competitorPayout
}

// Check if Novig odds are better than competitor odds
export function isNovigBetter(novigOdds: number, competitorOdds: number): boolean {
  if (novigOdds > 0 && competitorOdds > 0) {
    return novigOdds < competitorOdds
  } else if (novigOdds < 0 && competitorOdds < 0) {
    return novigOdds > competitorOdds
  } else {
    // One positive, one negative - positive is always better
    return novigOdds > competitorOdds
  }
}

// Format American odds with + or - sign
export function formatAmericanOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : odds.toString()
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}
