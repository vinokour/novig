# 🎯 Pikkit Data Scraper

This guide explains how to scrape real odds data from the Pikkit sports betting app and integrate it into your Novig Best Odds application.

## 🚀 Quick Start

### Option 1: Browser Console Scraper (Recommended)

1. **Open Pikkit App**: Go to [https://app.pikkit.com/](https://app.pikkit.com/)
2. **Open Developer Console**: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
3. **Copy & Paste**: Copy the entire contents of `pikkit-scraper.js`
4. **Paste & Run**: Paste into the console and press Enter
5. **Wait for Results**: The scraper will automatically extract data and display results

### Option 2: Manual Inspection

1. **Inspect Network Tab**: In Developer Tools, go to the Network tab
2. **Filter by XHR/Fetch**: Look for API calls to endpoints like `/api/odds`, `/api/games`, etc.
3. **Copy Response Data**: Right-click on API responses and copy the JSON data
4. **Parse Manually**: Use the data structure examples below

## 📊 Data Structure

The scraper extracts data in this format:

```json
{
  "id": "pikkit-game-0",
  "sport": "MLB",
  "league": "MLB",
  "gameTime": "2024-03-28T19:05:00Z",
  "awayTeam": {
    "name": "New York Yankees",
    "abbreviation": "NYY"
  },
  "homeTeam": {
    "name": "Houston Astros",
    "abbreviation": "HOU"
  },
  "spreadLine": -1.5,
  "totalLine": 8.5,
  "sportsbooks": [
    {
      "name": "DraftKings",
      "abbreviation": "DK",
      "odds": {
        "moneyline": -110,
        "spread": 140,
        "totalOver": -105,
        "totalUnder": -115
      }
    }
  ]
}
```

## 🔧 Integration Steps

### Step 1: Extract Data
Run the scraper and copy the extracted JSON data.

### Step 2: Convert to Game Format
Use the `convertPikkitToGame` function in `src/lib/scraper.ts`:

```typescript
import { convertPikkitToGame } from '@/lib/scraper'

const pikkitData = // ... your scraped data
const game = convertPikkitToGame(pikkitData)
```

### Step 3: Update Your Data
Replace the hardcoded data in `src/data/mlb.ts` with the scraped data.

## 🎯 Advanced Scraping

### Custom Selectors
If the default selectors don't work, you can customize them in `pikkit-scraper.js`:

```javascript
// Look for different CSS classes or data attributes
let gameElements = document.querySelectorAll('.your-custom-class, [data-testid="game"], .game-item');
```

### API Endpoints
Look for these common API patterns in the Network tab:
- `/api/odds/mlb`
- `/api/games`
- `/api/sports/mlb/odds`
- `/api/betting/odds`

### Authentication
Some APIs may require authentication. Look for:
- Authorization headers
- Bearer tokens
- Session cookies

## 🚨 Important Notes

1. **Rate Limiting**: Don't make too many requests too quickly
2. **Terms of Service**: Check Pikkit's terms regarding data scraping
3. **Data Accuracy**: Verify scraped data against the displayed values
4. **Updates**: Odds change frequently, consider real-time updates

## 🐛 Troubleshooting

### No Games Found
- Check if the page is fully loaded
- Inspect the DOM structure for different selectors
- Look for JavaScript errors in the console

### Missing Odds
- Some odds might be loaded dynamically
- Check for lazy loading or infinite scroll
- Look for different data attributes

### Authentication Issues
- Check if you need to log in
- Look for API key requirements
- Check for CORS restrictions

## 📱 Mobile Scraping

For mobile apps or responsive sites:
1. Use mobile user agent in browser dev tools
2. Check for different DOM structures on mobile
3. Look for mobile-specific API endpoints

## 🔄 Real-time Updates

To keep data current:
1. Set up a cron job or scheduled task
2. Use webhooks if available
3. Implement polling with reasonable intervals
4. Consider using Pikkit's official API if available

## 📚 Resources

- [Browser Developer Tools Guide](https://developer.chrome.com/docs/devtools/)
- [Network Tab Tutorial](https://developer.chrome.com/docs/devtools/network/)
- [JavaScript Console Guide](https://developer.mozilla.org/en-US/docs/Web/API/Console)

## 🤝 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify the DOM structure hasn't changed
3. Update selectors if the site structure changes
4. Check for updates to this scraper

---

**Remember**: Always respect the website's terms of service and implement reasonable rate limiting when scraping data.
