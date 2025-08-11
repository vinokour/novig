# Novig Best Odds

A production-ready Next.js 14 application that compares sports betting odds between Novig and major competitors (DraftKings, FanDuel, BetMGM). Built with TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Real-time Odds Comparison**: Compare Novig odds against DraftKings, FanDuel, and BetMGM
- **Smart Filtering**: Show only games where Novig has better odds
- **Interactive Controls**: Sport tabs, book selection, search, and filters
- **Detailed Game View**: Click any game row to see detailed odds comparison
- **Share Functionality**: Export game details as PNG images
- **UTM Tracking**: Automatic UTM parameter generation for Novig referrals
- **Responsive Design**: Mobile-first design with modern UI components

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Image Export**: html-to-image
- **URL Utilities**: query-string

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd novig-best-odds
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── Header.tsx         # App header with logo
│   ├── Controls.tsx       # Filters and controls
│   ├── OddsTable.tsx      # Main odds comparison table
│   ├── GameDetails.tsx    # Game details modal
│   └── Leaderboard.tsx    # Demo leaderboard
├── data/                   # Data models and sample data
│   └── mlb.ts            # MLB games data
├── lib/                    # Utility functions
│   └── utils.ts           # Odds calculations and formatting
└── store/                  # State management
    └── odds-store.ts      # Zustand store
```

## Key Components

### Controls
- Sport tabs (MLB active, NFL/NBA disabled)
- Book selection dropdown
- "Show only when Novig is better" toggle
- Team search input

### Odds Table
- Clickable rows showing matchup, moneyline, spread, and total
- Visual indicators for when Novig has better odds
- Delta calculations showing potential winnings
- Responsive design with hover effects

### Game Details
- Modal/drawer showing detailed odds comparison
- "Bet on Novig" CTA with UTM tracking
- "Share proof" functionality for PNG export
- Disclaimer about demo data

## Data Model

The app uses a TypeScript interface for games:

```typescript
export type Game = {
  id: string;
  league: 'MLB';
  startsAt: string; // ISO date
  awayTeam: { name: string; abbr: string };
  homeTeam: { name: string; abbr: string };
  moneyline: { away: Moneyline; home: Moneyline };
  spread: { away: Spread; home: Spread };
  total: Total;
};
```

## Odds Calculations

- **American Odds**: Standard +/- format
- **Delta Calculation**: Based on $100 stake assumption
- **Better Odds Logic**: Handles both positive and negative odds correctly
- **Payout Difference**: Shows expected winnings difference

## UTM Tracking

All CTA clicks to Novig include UTM parameters:
- `utm_source=best-odds`
- `utm_medium=landing`
- `utm_campaign=mvp`
- `utm_content={gameId}-{market}`

## Analytics Events

The app logs events to console.info:
- `view_home`: Page view
- `click_cta`: CTA button clicks
- `share_image`: Image sharing
- `toggle_onlyNovigBetter`: Filter toggle
- `change_compBook`: Book selection change
- `search_team`: Team search

## Customization

### Adding New Sports
1. Update the sport tabs in `Controls.tsx`
2. Add new data files in `src/data/`
3. Update the store to handle new sports

### Adding New Books
1. Update the `ComparisonBook` type in the store
2. Add new odds data to the game objects
3. Update the `getCompetitorOddsKey` function

### Styling
- Uses Tailwind CSS with custom CSS variables
- shadcn/ui components are fully customizable
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`

## Browser Support

- Modern browsers with ES6+ support
- Mobile responsive design
- Touch-friendly interactions

## Performance

- Client-side filtering and calculations
- Lazy loading of game details
- Optimized image export
- Minimal bundle size with tree shaking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software for Novig.

## Support

For questions or issues, please contact the development team.
