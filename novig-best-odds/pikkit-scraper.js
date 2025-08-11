// Pikkit Data Scraper - Run this in the browser console on https://app.pikkit.com/
// Copy and paste this entire script into your browser's developer console

(function() {
  'use strict';
  
  console.log('🚀 Pikkit Data Scraper Starting...');
  
  // Wait for the page to fully load
  setTimeout(() => {
    const games = extractPikkitData();
    console.log('✅ Extraction complete!');
    console.log('📊 Games found:', games.length);
    console.log('🎯 Extracted data:', games);
    
    // Copy to clipboard
    copyToClipboard(JSON.stringify(games, null, 2));
    
    // Display results in a nice format
    displayResults(games);
    
    // Show debugging info
    showDebugInfo();
  }, 3000);
  
  function extractPikkitData() {
    const games = [];
    
    try {
      console.log('🔍 Starting data extraction...');
      
      // Method 1: Look for elements with the specific pattern we found
      // Pattern: "Team Name+odds+spread+total+Team Name+odds+spread+total+time+More wagers →"
      const allElements = document.querySelectorAll('*');
      const gameElements = Array.from(allElements).filter(el => {
        const text = el.textContent || '';
        // Look for elements containing team names, odds, and "More wagers →"
        return text.includes('More wagers →') && 
               text.includes('PM') && 
               /[+-]\d+/.test(text) &&
               text.length > 50;
      });
      
      console.log(`🔍 Method 1: Found ${gameElements.length} elements with game pattern`);
      
      // Show what elements we found to help debug duplicates
      gameElements.slice(0, 3).forEach((el, i) => {
        console.log(`🔍 Element ${i} preview: "${(el.textContent || '').substring(0, 150)}..."`);
      });
      
      // Process found elements and extract individual games
      let gameIndex = 0;
      
      gameElements.forEach((element, index) => {
        try {
          // Extract multiple games from each element
          const elementGames = extractGamesFromElement(element, gameIndex);
          if (elementGames && elementGames.length > 0) {
            games.push(...elementGames);
            gameIndex += elementGames.length;
            console.log(`✅ Extracted ${elementGames.length} games from element ${index}`);
          }
        } catch (error) {
          console.warn(`⚠️ Failed to extract games from element ${index}:`, error);
        }
      });
      
      // If no games found with the main method, try alternative approaches
      if (games.length === 0) {
        console.log('🔍 No games found with main method, trying alternatives...');
        
        // Method 2: Look for elements with team names and odds
        const teamOddsElements = Array.from(allElements).filter(el => {
          const text = el.textContent || '';
          return text.includes('Philadelphia Phillies') || 
                 text.includes('Cincinnati Reds') ||
                 text.includes('New York Yankees') ||
                 text.includes('Houston Astros');
        });
        
        console.log(`🔍 Method 2: Found ${teamOddsElements.length} elements with team names`);
        
        teamOddsElements.forEach((element, index) => {
          try {
            const gameData = extractGameFromElement(element, index);
            if (gameData) {
              games.push(gameData);
              console.log(`✅ Extracted game ${index}: ${gameData.awayTeam.name} @ ${gameData.homeTeam.name}`);
            }
          } catch (error) {
            console.warn(`⚠️ Failed to extract game ${index}:`, error);
          }
        });
      }
      
    } catch (error) {
      console.error('❌ Error during extraction:', error);
    }
    
    // Analyze and remove duplicate games before returning
    console.log(`🔍 Analyzing ${games.length} extracted games for duplicates...`);
    const uniqueGames = removeDuplicateGames(games);
    console.log(`🎯 Final result: ${uniqueGames.length} unique games extracted`);
    
    return uniqueGames;
  }
  
    function extractGamesFromElement(element, startIndex) {
    const games = [];
    const text = element.textContent || '';
    console.log(`🔍 Analyzing element for multiple games: "${text.substring(0, 200)}..."`);
    
    // COMPREHENSIVE TIME EXTRACTION - try multiple approaches
    console.log(`🕐 COMPREHENSIVE TIME EXTRACTION STARTING...`);
    
    // Method 1: Extract from current element text
    const elementTimeMatches = text.match(/(\d{1,2}):(\d{2})\s*[AP]M/gi) || [];
    console.log(`🕐 Method 1 - Element text: Found ${elementTimeMatches.length} times:`, elementTimeMatches);
    
    // Method 2: Look in parent elements for time information
    let parentTimeMatches = [];
    let currentParent = element.parentElement;
    let parentLevel = 0;
    while (currentParent && parentLevel < 5) {
      const parentText = currentParent.textContent || '';
      const parentTimes = parentText.match(/(\d{1,2}):(\d{2})\s*[AP]M/gi) || [];
      if (parentTimes.length > parentTimeMatches.length) {
        parentTimeMatches = parentTimes;
        console.log(`🕐 Method 2 - Parent level ${parentLevel}: Found ${parentTimes.length} times:`, parentTimes);
      }
      currentParent = currentParent.parentElement;
      parentLevel++;
    }
    
    // Method 3: Look for time elements in the entire document that might be related
    const allTimeElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const elText = el.textContent || '';
      return /(\d{1,2}):(\d{2})\s*[AP]M/i.test(elText) && elText.length < 50; // Short elements likely contain just time
    });
    console.log(`🕐 Method 3 - Document time elements: Found ${allTimeElements.length} elements with times`);
    
    // Method 4: Look for time patterns in sibling elements
    const siblingTimeMatches = [];
    if (element.parentElement) {
      const siblings = Array.from(element.parentElement.children);
      siblings.forEach((sibling, i) => {
        const siblingText = sibling.textContent || '';
        const siblingTimes = siblingText.match(/(\d{1,2}):(\d{2})\s*[AP]M/gi) || [];
        if (siblingTimes.length > 0) {
          console.log(`🕐 Method 4 - Sibling ${i}: Found ${siblingTimes.length} times:`, siblingTimes);
          siblingTimeMatches.push(...siblingTimes);
        }
      });
    }
    
    // Combine all time sources and deduplicate
    const allTimeMatches = [...new Set([
      ...elementTimeMatches,
      ...parentTimeMatches,
      ...siblingTimeMatches
    ])];
    
    console.log(`🕐 FINAL TIME COLLECTION: ${allTimeMatches.length} unique times:`, allTimeMatches);
    
    // Split the text into individual games using "More wagers →" as separator
    const gameSections = text.split('More wagers →').filter(section => section.trim().length > 0);
    console.log(`🔍 Found ${gameSections.length} game sections`);
    
    // Debug: Check if any sections contain time information
    let sectionsWithTime = 0;
    gameSections.forEach((section, i) => {
      const hasTime = /(\d{1,2}):(\d{2})\s*[AP]M/i.test(section);
      if (hasTime) sectionsWithTime++;
      console.log(`   Section ${i} has time: ${hasTime ? 'YES' : 'NO'} - "${section.substring(0, 80)}..."`);
    });
    
    console.log(`📊 Summary: ${allTimeMatches.length} times collected, ${sectionsWithTime} sections with time, ${gameSections.length} total sections`);
    
    // If we still don't have enough times, try to extract from the broader DOM
    if (allTimeMatches.length < gameSections.length) {
      console.log(`⚠️ INSUFFICIENT TIMES: Need ${gameSections.length}, have ${allTimeMatches.length}. Trying broader search...`);
      
      // Look for any time patterns in the entire page
      const bodyText = document.body.textContent || '';
      const bodyTimes = bodyText.match(/(\d{1,2}):(\d{2})\s*[AP]M/gi) || [];
      console.log(`🕐 Broader search found ${bodyTimes.length} times in document body`);
      
      // Add unique times from body search
      bodyTimes.forEach(time => {
        if (!allTimeMatches.includes(time)) {
          allTimeMatches.push(time);
        }
      });
      
      console.log(`🕐 After broader search: ${allTimeMatches.length} total times available`);
    }
    
    gameSections.forEach((section, sectionIndex) => {
      try {
        if (section.trim().length < 20) return; // Skip very short sections
        
        console.log(`🔍 Processing game section ${sectionIndex}: "${section.substring(0, 100)}..."`);
        
        // Extract time from this specific game section with improved patterns
        console.log(`🔍 Looking for time in section ${sectionIndex}: "${section.substring(0, 200)}..."`);
        
        // Try multiple time patterns in the current section
        let timeMatch = section.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (!timeMatch) {
          // Try without space between time and AM/PM
          timeMatch = section.match(/(\d{1,2}):(\d{2})(AM|PM)/i);
        }
        if (!timeMatch) {
          // Try with more flexible spacing
          timeMatch = section.match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
        }
        
        // If no time in section, try to use the corresponding time from the original text
        if (!timeMatch && allTimeMatches.length > sectionIndex) {
          console.log(`🔍 No time in section, using time ${sectionIndex} from original: ${allTimeMatches[sectionIndex]}`);
          const timeString = allTimeMatches[sectionIndex];
          timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
        }
        
        // Last resort: try looking in the original element text
        if (!timeMatch) {
          const originalText = element.textContent || '';
          const allOriginalTimes = originalText.match(/(\d{1,2}):(\d{2})\s*[AP]M/gi) || [];
          if (allOriginalTimes.length > sectionIndex) {
            console.log(`🔍 Using fallback time ${sectionIndex}: ${allOriginalTimes[sectionIndex]}`);
            timeMatch = allOriginalTimes[sectionIndex].match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
          }
        }
        
        let gameTime = 'TBD';
        
        if (timeMatch) {
          const hour = parseInt(timeMatch[1]);
          const minute = timeMatch[2];
          const period = timeMatch[3].toUpperCase();
          
          console.log(`⏰ Raw time match found: ${hour}:${minute} ${period}`);
          
          if (hour >= 1 && hour <= 12) {
            console.log(`⏰ Valid time extracted: ${hour}:${minute} ${period}`);
            
            const now = new Date();
            const gameDateTime = new Date(now);
            
            let gameHour = hour;
            if (period === 'PM' && hour !== 12) {
              gameHour = hour + 12;
            } else if (period === 'AM' && hour === 12) {
              gameHour = 0;
            }
            
            gameDateTime.setHours(gameHour, parseInt(minute), 0, 0);
            
            // If the time has already passed today, assume it's tomorrow
            if (gameDateTime <= now) {
              gameDateTime.setDate(gameDateTime.getDate() + 1);
            }
            
            gameTime = gameDateTime.toISOString();
            console.log(`✅ Final game time: ${gameTime} (${gameDateTime.toLocaleString()})`);
          } else {
            console.log(`⚠️ Invalid hour: ${hour}, skipping time extraction`);
          }
        } else {
          console.log(`⚠️ No time pattern found in section: "${section.substring(0, 100)}..."`);
          // Also log what we're looking for
          console.log(`🔍 Expected patterns: "6:10 PM", "6:10PM", "6:10 pm", etc.`);
        }
        
        // Clean this specific game section
        const cleanSection = cleanGameText(section);
        
        // Extract team names from this section
        const teamNames = extractTeamNames(cleanSection);
        if (!teamNames.away || !teamNames.home) {
          console.log(`⚠️ Could not extract team names from section ${sectionIndex}`);
          return;
        }
        
        // Extract sportsbooks with their associated betting lines first
        const sportsbooksWithOdds = extractSportsbookLogosWithOdds(element, teamNames);
        console.log(`🔍 DEBUG: sportsbooksWithOdds length: ${sportsbooksWithOdds.length}`);
        
        // Extract odds from this section, now with sportsbook data available
        const odds = extractOddsFromText(cleanSection, sportsbooksWithOdds);
        
        // Create sportsbooks array with logos mapped to their betting lines
        const gameSportsbooks = sportsbooksWithOdds.length > 0 
          ? sportsbooksWithOdds.map((sb, index) => ({
              name: `Sportsbook ${index + 1}`,
              abbreviation: `SB${index + 1}`,
              iconSrc: sb.logoUrl,
              iconAlt: '',
              betType: sb.betType,
              position: sb.position,        // Preserve position for sorting
              teamPosition: sb.teamPosition, // Preserve teamPosition for totals
              associatedOdds: sb.odds,
              rawText: sb.rawText,
              odds: {
                moneyline: odds.awayMoneyline || 0,
                spread: odds.awaySpread || 0,
                totalOver: odds.totalOver || 0,
                totalUnder: odds.totalUnder || 0
              }
            }))
          : [{
              name: 'Pikkit',
              abbreviation: 'PK',
              iconSrc: '',
              iconAlt: '',
              betType: 'unknown',
              associatedOdds: [],
              rawText: '',
              odds: {
                moneyline: odds.awayMoneyline || 0,
                spread: odds.awaySpread || 0,
                totalOver: odds.totalOver || 0,
                totalUnder: odds.totalUnder || 0
              }
            }];
        
        console.log(`🔍 DEBUG: gameSportsbooks created with ${gameSportsbooks.length} items`);
        if (gameSportsbooks.length > 0) {
          gameSportsbooks.forEach((sb, i) => {
            console.log(`   GameSB ${i}: ${sb.betType} (${sb.teamPosition}) - ${sb.iconSrc ? sb.iconSrc.split('/').pop() : 'NULL'}`);
          });
        }
        
        const game = {
          id: `pikkit-game-${startIndex + sectionIndex}`,
          sport: 'MLB',
          league: 'MLB',
          gameTime: gameTime,
          awayTeam: {
            name: teamNames.away,
            abbreviation: getTeamAbbreviation(teamNames.away)
          },
          homeTeam: {
            name: teamNames.home,
            abbreviation: getTeamAbbreviation(teamNames.home)
          },
          spreadLine: odds.spreadLine || 0,
          totalLine: odds.totalLine || 0,
          rawSpreadLine: odds.rawSpreadLine || '',
          sportsbooks: gameSportsbooks,
          rawText: cleanSection.trim(),
          extractionMethod: 'odds-pattern',
          parsedTime: gameTime,
          awayMoneyline: odds.awayMoneyline || 0,
          homeMoneyline: odds.homeMoneyline || 0,
          awaySpread: odds.awaySpread || 0,
          homeSpread: odds.homeSpread || 0,
          awaySpreadLine: odds.awaySpreadLine || 0,
          homeSpreadLine: odds.homeSpreadLine || 0
        };
        
        games.push(game);
        console.log(`✅ Extracted game: ${teamNames.away} @ ${teamNames.home} at ${gameTime}`);
        
      } catch (error) {
        console.warn(`⚠️ Failed to extract game from section ${sectionIndex}:`, error);
      }
    });
    
    return games;
  }
  
  function cleanGameText(text) {
    // Remove common UI elements and focus on the game data
    // IMPORTANT: Be careful not to remove time patterns like "6:10 PM"
    let cleaned = text
      .replace(/PikkitYou need to enable JavaScript to run this app\.!\(function\(\)\{try\{var a=function\(c\)\{var v="\(prefers-color-scheme: dark\)",h=window\.matchMedia\(v\)\.matches\?"dark":"light",r=c==="system"\?h:c,o=document\.documentElement,s=document\.body,l="chakra-ui-light",d="chakra-ui-dark",i=r==="dark";return s\.classList\.add\(i\?d:l\),s\.classList\.remove\(i\?l:d\),o\.style\.colorScheme=r,o\.dataset\.theme=r,r\},n=a,m="light",e="chakra-ui-color-mode",t=localStorage\.getItem\(e\);t\?a\(t\):localStorage\.setItem\(e,a\(m\)\)\}catch\(a\)\{\}\)\(\);/g, '')
      .replace(/HomeSearchHistory\$0\.00CalendarYour BetsTagsClosing LineScenariosEventsSettingsContact SupportJoin DiscordEventsEdit ProfileLog Out/g, '')
      .replace(/Aug \d+Aug \d+Aug \d+TodayAug \d+Aug \d+Aug \d+/g, '')
      .replace(/MLBNFLTENNISWNBANCAAFBUFCEPLGOLFNASCARNBANHLNCAAMLALIGASERIEABUNDESLIGALIGUE1MLSUCLUELNCAAWNCAA BaseballF1SearchFilterMLBFutures/g, '')
      .replace(/Load More0Place BetsAdd something to your betslip!/g, '')
      .replace(/🎯 Pikkit Data ExtractedFound \d+ gamesNo games found\. Check console for debugging info\.Close/g, '')
      .replace(/\s+/g, ' ') // Normalize whitespace but preserve single spaces
      .trim();
    
    console.log(`🧹 Text cleaning: "${text.substring(0, 100)}..." → "${cleaned.substring(0, 100)}..."`);
    
    // Check if we accidentally removed time information
    const originalTimeMatch = text.match(/(\d{1,2}):(\d{2})\s*[AP]M/i);
    const cleanedTimeMatch = cleaned.match(/(\d{1,2}):(\d{2})\s*[AP]M/i);
    
    if (originalTimeMatch && !cleanedTimeMatch) {
      console.log(`⚠️ WARNING: Time information may have been lost during cleaning!`);
      console.log(`   Original had: ${originalTimeMatch[0]}`);
      console.log(`   Cleaned version missing time pattern`);
    }
    
    return cleaned;
  }
  
  function extractSportsbookLogosWithOdds(element, teamNames) {
    const sportsbooksWithOdds = [];
    
    console.log(`🔍 Looking for logos with associated odds in game: ${teamNames.away} vs ${teamNames.home}`);
    console.log(`🔍 DEBUG: Starting extraction, element:`, element ? 'FOUND' : 'NULL');
    
    // Find elements that contain both team names (likely the game row)
    const potentialGameRows = element.querySelectorAll('*');
    let gameRow = null;
    
    for (let el of potentialGameRows) {
      const elText = (el.textContent || '').toLowerCase();
      if (elText.includes(teamNames.away.toLowerCase()) && 
          elText.includes(teamNames.home.toLowerCase()) &&
          elText.length < 500) { // Not too large (avoid parent containers)
        // Check if this element has sportsbook logos
        const logos = el.querySelectorAll('img[src*="d31zyv2gw1yfmz.cloudfront.net"]');
        if (logos.length > 0) {
          gameRow = el;
          console.log(`🎯 Found game row with ${logos.length} images`);
          break;
        }
      }
    }
    
    if (gameRow) {
            // Strategy: Find all 6 logos systematically
      // Look for all brand logos in the game row first
      const allLogos = gameRow.querySelectorAll('img[src*="/brands/"]');
      console.log(`🔍 Found ${allLogos.length} brand logos in game row`);
      
      allLogos.forEach((logo, logoIndex) => {
        const logoSrc = logo.src || logo.getAttribute('src') || '';
        
        // Get the betting context around this logo
        let container = logo.parentElement;
        let betType = 'unknown';
        let associatedOdds = [];
        let contextText = '';
        
        // Walk up the DOM to find betting context
        for (let i = 0; i < 5 && container; i++) {
          const containerText = container.textContent || '';
          const oddsInContainer = containerText.match(/([+-]\d{2,})/g);
          
          if (oddsInContainer && oddsInContainer.length > 0) {
            associatedOdds = oddsInContainer;
            contextText = containerText;
            
            // DISABLE CONTEXT-BASED DETECTION - it's causing confusion
            // Just use position-based detection for reliability
            betType = 'unknown'; // Force fallback to position-based
            
            break; // Found betting context, stop searching
          }
          
          container = container.parentElement;
        }
        
        // Use position-based detection (more reliable than context parsing)
        let teamPosition;
        if (betType === 'unknown') {
          // ACTUAL Pikkit layout based on observed pattern: ML-Away, Spread-Home, Total-Over, ML-Home, Spread-Away, Total-Under
          if (logoIndex === 0) {
            betType = 'moneyline';  // ML Away
            teamPosition = 'away/over';
          } else if (logoIndex === 1) {
            betType = 'spread';     // Spread Home
            teamPosition = 'home/under';
          } else if (logoIndex === 2) {
            betType = 'total';      // Total Over
            teamPosition = 'away/over';
          } else if (logoIndex === 3) {
            betType = 'moneyline';  // ML Home
            teamPosition = 'home/under';
          } else if (logoIndex === 4) {
            betType = 'spread';     // Spread Away
            teamPosition = 'away/over';
          } else if (logoIndex === 5) {
            betType = 'total';      // Total Under
            teamPosition = 'home/under';
          } else {
            // If more than 6 logos, cycle through the pattern
            const cyclePosition = logoIndex % 6;
            if (cyclePosition === 0) { betType = 'moneyline'; teamPosition = 'away/over'; }
            else if (cyclePosition === 1) { betType = 'spread'; teamPosition = 'home/under'; }
            else if (cyclePosition === 2) { betType = 'total'; teamPosition = 'away/over'; }
            else if (cyclePosition === 3) { betType = 'moneyline'; teamPosition = 'home/under'; }
            else if (cyclePosition === 4) { betType = 'spread'; teamPosition = 'away/over'; }
            else if (cyclePosition === 5) { betType = 'total'; teamPosition = 'home/under'; }
          }
          console.log(`🔄 Using position-based mapping for logo ${logoIndex}: ${betType} (${teamPosition})`);
        }
        
        // teamPosition fallback if not set above
        if (!teamPosition) {
          teamPosition = logoIndex % 2 === 0 ? 'away/over' : 'home/under';
        }
        
        console.log(`🏢 Logo ${logoIndex}: ${betType} (${teamPosition}) - ${logoSrc.split('/').pop()} - Odds: [${associatedOdds.join(', ')}] - Context: "${contextText.trim().substring(0, 60)}"`);
        
        sportsbooksWithOdds.push({
          logoUrl: logoSrc,
          betType: betType,
          odds: associatedOdds,
          rawText: contextText.trim().substring(0, 80),
          position: logoIndex,
          teamPosition: teamPosition
        });
      });
    } else {
      console.log(`⚠️ Could not find specific game row for ${teamNames.away} vs ${teamNames.home}`);
    }
    
    // Don't remove duplicates - we need all 6 logos (2 per bet type)
    // Just return all found sportsbooks with their betting line associations
    console.log(`🏢 Found ${sportsbooksWithOdds.length} sportsbook betting lines total`);
    console.log(`🔍 DEBUG: Returning sportsbooksWithOdds array with ${sportsbooksWithOdds.length} items`);
    
    if (sportsbooksWithOdds.length > 0) {
      console.log(`🔍 DEBUG: First sportsbook:`, sportsbooksWithOdds[0]);
    }
    
    return sportsbooksWithOdds;
  }
  
  function identifySportsbook(src, alt, className, title = '') {
    const srcLower = src.toLowerCase();
    const altLower = alt.toLowerCase();
    const classLower = className.toLowerCase();
    const titleLower = title.toLowerCase();
    
    // Common sportsbook identifiers - expanded with more variations
    const sportsbookMap = {
      // DraftKings variations
      'draftkings': { name: 'DraftKings', abbreviation: 'DK' },
      'dk': { name: 'DraftKings', abbreviation: 'DK' },
      'draft-kings': { name: 'DraftKings', abbreviation: 'DK' },
      
      // FanDuel variations
      'fanduel': { name: 'FanDuel', abbreviation: 'FD' },
      'fd': { name: 'FanDuel', abbreviation: 'FD' },
      'fan-duel': { name: 'FanDuel', abbreviation: 'FD' },
      
      // BetMGM variations
      'betmgm': { name: 'BetMGM', abbreviation: 'MGM' },
      'mgm': { name: 'BetMGM', abbreviation: 'MGM' },
      'bet-mgm': { name: 'BetMGM', abbreviation: 'MGM' },
      
      // Caesars variations
      'caesars': { name: 'Caesars', abbreviation: 'CZR' },
      'czr': { name: 'Caesars', abbreviation: 'CZR' },
      'caesar': { name: 'Caesars', abbreviation: 'CZR' },
      
      // Other sportsbooks
      'pointsbet': { name: 'PointsBet', abbreviation: 'PB' },
      'points-bet': { name: 'PointsBet', abbreviation: 'PB' },
      'barstool': { name: 'Barstool', abbreviation: 'BS' },
      'unibet': { name: 'Unibet', abbreviation: 'UB' },
      'betrivers': { name: 'BetRivers', abbreviation: 'BR' },
      'bet-rivers': { name: 'BetRivers', abbreviation: 'BR' },
      'wynn': { name: 'WynnBET', abbreviation: 'WB' },
      'wynnbet': { name: 'WynnBET', abbreviation: 'WB' },
      'twinspires': { name: 'TwinSpires', abbreviation: 'TS' },
      'twin-spires': { name: 'TwinSpires', abbreviation: 'TS' },
      'foxbet': { name: 'FOX Bet', abbreviation: 'FOX' },
      'fox-bet': { name: 'FOX Bet', abbreviation: 'FOX' },
      'betway': { name: 'Betway', abbreviation: 'BW' },
      'superbook': { name: 'SuperBook', abbreviation: 'SB' },
      'super-book': { name: 'SuperBook', abbreviation: 'SB' },
      'williamhill': { name: 'William Hill', abbreviation: 'WH' },
      'william-hill': { name: 'William Hill', abbreviation: 'WH' },
      'bet365': { name: 'bet365', abbreviation: '365' },
      'pinnacle': { name: 'Pinnacle', abbreviation: 'PIN' },
      'bovada': { name: 'Bovada', abbreviation: 'BOV' },
      'mybookie': { name: 'MyBookie', abbreviation: 'MB' },
      'my-bookie': { name: 'MyBookie', abbreviation: 'MB' },
      'betonline': { name: 'BetOnline', abbreviation: 'BOL' },
      'bet-online': { name: 'BetOnline', abbreviation: 'BOL' },
      'novig': { name: 'Novig', abbreviation: 'N' },
      'pikkit': { name: 'Pikkit', abbreviation: 'PK' },
      
      // Additional sportsbooks that might appear
      'betfred': { name: 'Betfred', abbreviation: 'BF' },
      'tipico': { name: 'Tipico', abbreviation: 'TIP' },
      'resorts': { name: 'Resorts', abbreviation: 'RES' },
      'hardrockbet': { name: 'Hard Rock Bet', abbreviation: 'HRB' },
      'hard-rock': { name: 'Hard Rock Bet', abbreviation: 'HRB' },
      'si': { name: 'SI Sportsbook', abbreviation: 'SI' },
      'sportsillustrated': { name: 'SI Sportsbook', abbreviation: 'SI' }
    };
    
    // Check src, alt, className, and title for sportsbook indicators
    const searchText = `${srcLower} ${altLower} ${classLower} ${titleLower}`;
    
    for (const [key, info] of Object.entries(sportsbookMap)) {
      if (searchText.includes(key)) {
        return info;
      }
    }
    
    return null;
  }
  
  function extractSportsbooksFromText(text) {
    const sportsbooks = [];
    const textLower = text.toLowerCase();
    
    // Common sportsbook abbreviations that might appear in text
    const abbrevMap = {
      'dk': { name: 'DraftKings', abbreviation: 'DK' },
      'fd': { name: 'FanDuel', abbreviation: 'FD' },
      'mgm': { name: 'BetMGM', abbreviation: 'MGM' },
      'czr': { name: 'Caesars', abbreviation: 'CZR' },
      'pb': { name: 'PointsBet', abbreviation: 'PB' },
      'br': { name: 'BetRivers', abbreviation: 'BR' },
      'wb': { name: 'WynnBET', abbreviation: 'WB' },
      'bs': { name: 'Barstool', abbreviation: 'BS' },
      'ub': { name: 'Unibet', abbreviation: 'UB' },
      'bw': { name: 'Betway', abbreviation: 'BW' },
      'sb': { name: 'SuperBook', abbreviation: 'SB' },
      'wh': { name: 'William Hill', abbreviation: 'WH' },
      '365': { name: 'bet365', abbreviation: '365' },
      'pin': { name: 'Pinnacle', abbreviation: 'PIN' },
      'bov': { name: 'Bovada', abbreviation: 'BOV' },
      'n': { name: 'Novig', abbreviation: 'N' },
      'pk': { name: 'Pikkit', abbreviation: 'PK' }
    };
    
    // Look for abbreviations in the text
    for (const [abbrev, info] of Object.entries(abbrevMap)) {
      // Look for the abbreviation as a standalone word
      const regex = new RegExp(`\\b${abbrev}\\b`, 'gi');
      if (regex.test(textLower)) {
        sportsbooks.push({
          name: info.name,
          abbreviation: info.abbreviation,
          iconSrc: '',
          iconAlt: abbrev,
          element: null
        });
        console.log(`🏢 ✅ Found sportsbook by text: ${info.name} (${abbrev})`);
      }
    }
    
    return sportsbooks;
  }

  function extractTeamNames(text) {
    // Common MLB team names to look for
    const teamNames = [
      'Philadelphia Phillies', 'Cincinnati Reds', 'New York Yankees', 'Houston Astros',
      'Los Angeles Dodgers', 'San Diego Padres', 'Boston Red Sox', 'Seattle Mariners',
      'Chicago Cubs', 'Texas Rangers', 'Atlanta Braves', 'Toronto Blue Jays',
      'Baltimore Orioles', 'Tampa Bay Rays', 'Minnesota Twins', 'Cleveland Guardians',
      'Detroit Tigers', 'Chicago White Sox', 'Kansas City Royals', 'Oakland Athletics',
      'Los Angeles Angels', 'Arizona Diamondbacks', 'Colorado Rockies', 'San Francisco Giants',
      'Miami Marlins', 'Washington Nationals', 'New York Mets', 'Milwaukee Brewers',
      'Pittsburgh Pirates', 'St. Louis Cardinals'
    ];
    
    const foundTeams = teamNames.filter(team => text.includes(team));
    
    if (foundTeams.length >= 2) {
      // Find the order - first team mentioned is usually away team
      const firstIndex = text.indexOf(foundTeams[0]);
      const secondIndex = text.indexOf(foundTeams[1]);
      
      if (firstIndex < secondIndex) {
        return { away: foundTeams[0], home: foundTeams[1] };
      } else {
        return { away: foundTeams[1], home: foundTeams[0] };
      }
    }
    
    return { away: null, home: null };
  }
  
  function extractOddsFromText(text, gameSportsbooks = []) {
    const odds = {
      awayMoneyline: 0,
      homeMoneyline: 0,
      awaySpread: 0,
      homeSpread: 0,
      awaySpreadLine: 0,   // Away team's actual spread line
      homeSpreadLine: 0,   // Home team's actual spread line
      totalOver: 0,
      totalUnder: 0,
      spreadLine: 0,       // For backward compatibility (away team's line)
      totalLine: 0,
      rawSpreadLine: ''    // Added for raw spread line
    };
    
    try {
      console.log(`🔍 Parsing odds from: "${text}"`);
      
      // STEP 1: Extract moneyline odds for BOTH teams
      // Pattern: Team1+ML+Spread+SpreadOdds+Total+TotalOdds+Team2+ML+Spread+SpreadOdds+Total+TotalOdds
      // We need to find the moneyline odds that come right after team names
      
      // First, extract team names from the text to determine away/home
      const teamInfo = extractTeamNames(text);
      
      // Find moneylines for each specific team
      let awayMoneyline = 0;
      let homeMoneyline = 0;
      
      if (teamInfo.away && teamInfo.home) {
        // Look for away team moneyline with improved pattern matching
        const awayIndex = text.indexOf(teamInfo.away);
        if (awayIndex !== -1) {
          const afterAwayTeam = text.substring(awayIndex + teamInfo.away.length);
          // Look for moneyline pattern - should be +100 or higher for positive, or negative
          const awayMoneylineMatch = afterAwayTeam.match(/([+-]\d{3,})/);
          if (awayMoneylineMatch) {
            awayMoneyline = parseInt(awayMoneylineMatch[1]);
            console.log(`💰 Found away moneyline: ${awayMoneyline} for ${teamInfo.away}`);
          } else {
            // Fallback to any +/- number if the strict pattern fails
            const fallbackMatch = afterAwayTeam.match(/([+-]\d+)/);
            if (fallbackMatch) {
              const value = parseInt(fallbackMatch[1]);
              // Validate that it's a reasonable moneyline value
              if (Math.abs(value) >= 100 && Math.abs(value) <= 1000) {
                awayMoneyline = value;
                console.log(`💰 Found away moneyline (fallback): ${awayMoneyline} for ${teamInfo.away}`);
              } else {
                console.log(`⚠️  Rejected invalid away moneyline: ${value} for ${teamInfo.away}`);
              }
            }
          }
        }
        
        // Look for home team moneyline with improved pattern matching
        const homeIndex = text.indexOf(teamInfo.home);
        if (homeIndex !== -1) {
          const afterHomeTeam = text.substring(homeIndex + teamInfo.home.length);
          // Look for moneyline pattern - should be +100 or higher for positive, or negative
          const homeMoneylineMatch = afterHomeTeam.match(/([+-]\d{3,})/);
          if (homeMoneylineMatch) {
            homeMoneyline = parseInt(homeMoneylineMatch[1]);
            console.log(`💰 Found home moneyline: ${homeMoneyline} for ${teamInfo.home}`);
          } else {
            // Fallback to any +/- number if the strict pattern fails
            const fallbackMatch = afterHomeTeam.match(/([+-]\d+)/);
            if (fallbackMatch) {
              const value = parseInt(fallbackMatch[1]);
              // Validate that it's a reasonable moneyline value
              if (Math.abs(value) >= 100 && Math.abs(value) <= 1000) {
                homeMoneyline = value;
                console.log(`💰 Found home moneyline (fallback): ${homeMoneyline} for ${teamInfo.home}`);
              } else {
                console.log(`⚠️  Rejected invalid home moneyline: ${value} for ${teamInfo.home}`);
              }
            }
          }
        }
      } else {
        // Fallback to old method if team extraction fails
        const teamNames = ['Philadelphia Phillies', 'Cincinnati Reds', 'Minnesota Twins', 'New York Yankees', 
                           'Washington Nationals', 'Kansas City Royals', 'Detroit Tigers', 'Chicago White Sox',
                           'Pittsburgh Pirates', 'Milwaukee Brewers', 'Colorado Rockies', 'St. Louis Cardinals',
                           'Arizona Diamondbacks', 'Texas Rangers', 'Boston Red Sox', 'Houston Astros',
                           'Los Angeles Dodgers', 'Los Angeles Angels', 'San Diego Padres', 'San Francisco Giants',
                           'Tampa Bay Rays', 'Athletics'];
        
        // Find the first team name and extract the moneyline that follows
        for (let i = 0; i < teamNames.length; i++) {
          const teamIndex = text.indexOf(teamNames[i]);
          if (teamIndex !== -1) {
            // Look for moneyline pattern after this team name
            const afterTeam = text.substring(teamIndex + teamNames[i].length);
            const moneylineMatch = afterTeam.match(/^([+-]\d+)/);
            if (moneylineMatch) {
              if (awayMoneyline === 0) {
                awayMoneyline = parseInt(moneylineMatch[1]);
                console.log(`💰 Found away moneyline: ${awayMoneyline} for ${teamNames[i]}`);
              } else if (homeMoneyline === 0) {
                homeMoneyline = parseInt(moneylineMatch[1]);
                console.log(`💰 Found home moneyline: ${homeMoneyline} for ${teamNames[i]}`);
                break; // We found both, no need to continue
              }
            }
          }
        }
      }
      
      // Validate moneyline odds before assigning
      if (awayMoneyline !== 0 && homeMoneyline !== 0) {
        // Check if the odds make sense (one should be positive, one negative, or both negative)
        if ((awayMoneyline > 0 && homeMoneyline < 0) || (awayMoneyline < 0 && homeMoneyline > 0) || (awayMoneyline < 0 && homeMoneyline < 0)) {
          console.log(`✅ Moneyline odds validation passed: Away ${awayMoneyline}, Home ${homeMoneyline}`);
        } else if (awayMoneyline > 0 && homeMoneyline > 0) {
          console.log(`⚠️  Both moneylines positive - this is unusual but possible: Away ${awayMoneyline}, Home ${homeMoneyline}`);
        }
      } else if (awayMoneyline === 0 || homeMoneyline === 0) {
        console.log(`⚠️  Missing moneyline data: Away ${awayMoneyline}, Home ${homeMoneyline}`);
      }
      
      odds.awayMoneyline = awayMoneyline;
      odds.homeMoneyline = homeMoneyline;
      console.log(`💰 Final moneylines: Away ${odds.awayMoneyline}, Home ${odds.homeMoneyline}`);
      
      // STEP 2: Extract total lines and odds (o9.5-104, u9.5-102)
      console.log(`🎯 Looking for total patterns (o9.5-104, u9.5-102)...`);
      
      // Look for over pattern first
      const overMatch = text.match(/o(\d+\.?\d*)([+-]\d+)/);
      if (overMatch) {
        odds.totalLine = parseFloat(overMatch[1]);
        odds.totalOver = parseInt(overMatch[2]);
        console.log(`📊 Total over: ${odds.totalLine} @ ${odds.totalOver}`);
      }
      
      // Look for under pattern
      const underMatch = text.match(/u(\d+\.?\d*)([+-]\d+)/);
      if (underMatch) {
        odds.totalUnder = parseInt(underMatch[2]);
        console.log(`📊 Total under: ${odds.totalLine} @ ${odds.totalUnder}`);
      }
      
      // STEP 3: Extract spread lines and odds using sportsbook logo positions
      // This uses the same logic that correctly extracts sportsbook icons
      console.log(`📏 Extracting spread data from sportsbook positions...`);
      console.log(`🔍 Total gameSportsbooks available:`, gameSportsbooks.length);
      console.log(`🔍 All sportsbook betTypes:`, gameSportsbooks.map(sb => `${sb.position}:${sb.betType}:${sb.teamPosition}`));
      
      // Find spread sportsbooks (positions 2 and 3 typically)
      const spreadSportsbooks = gameSportsbooks.filter(sb => sb.betType === 'spread');
      console.log(`🔍 Found ${spreadSportsbooks.length} spread sportsbooks:`, spreadSportsbooks.map(sb => `${sb.position}:${sb.teamPosition}`));
      
      if (spreadSportsbooks.length >= 2) {
        // Sort by position to ensure consistent away/home assignment
        spreadSportsbooks.sort((a, b) => (a.position || 0) - (b.position || 0));
        
        const awaySportsbook = spreadSportsbooks.find(sb => sb.teamPosition === 'away/over') || spreadSportsbooks[0];
        const homeSportsbook = spreadSportsbooks.find(sb => sb.teamPosition === 'home/under') || spreadSportsbooks[1];
        
        if (awaySportsbook && awaySportsbook.odds.length > 0) {
          // Extract away team spread data
          const awayOddsText = awaySportsbook.rawText;
          const awaySpreadMatch = awayOddsText.match(/([+-]?\d+\.?\d*)([+-]\d+)/);
          if (awaySpreadMatch) {
            odds.awaySpreadLine = parseFloat(awaySpreadMatch[1]);
            odds.awaySpread = parseInt(awaySpreadMatch[2]);
            console.log(`✅ Away spread: ${odds.awaySpreadLine} @ ${odds.awaySpread}`);
          }
        }
        
        if (homeSportsbook && homeSportsbook.odds.length > 0) {
          // Extract home team spread data  
          const homeOddsText = homeSportsbook.rawText;
          const homeSpreadMatch = homeOddsText.match(/([+-]?\d+\.?\d*)([+-]\d+)/);
          if (homeSpreadMatch) {
            odds.homeSpreadLine = parseFloat(homeSpreadMatch[1]);
            odds.homeSpread = parseInt(homeSpreadMatch[2]);
            console.log(`✅ Home spread: ${odds.homeSpreadLine} @ ${odds.homeSpread}`);
          }
        }
        
        // Set the main spreadLine for backward compatibility (use away team's line)
        odds.spreadLine = odds.awaySpreadLine || 0;
        
        console.log(`✅ Final spread extraction: Away ${odds.awaySpreadLine} @ ${odds.awaySpread}, Home ${odds.homeSpreadLine} @ ${odds.homeSpread}`);
      } else {
        console.log(`⚠️ Insufficient spread sportsbooks found (${spreadSportsbooks.length}), falling back to text parsing...`);
        
        // Fallback to the old regex method if sportsbook method fails
        const spreadPattern = /([+-]?\d+\.?\d*)([+-]\d+)/g;
        const matches = [];
        let match;
        
        while ((match = spreadPattern.exec(text)) !== null) {
          const line = parseFloat(match[1]);
          const oddsValue = parseInt(match[2]);
          
          if (isValidSpreadLine(Math.abs(line)) && Math.abs(oddsValue) >= 100 && Math.abs(oddsValue) <= 500) {
            matches.push({ line, odds: oddsValue });
          }
        }
        
        if (matches.length >= 2) {
          odds.awaySpreadLine = matches[0].line;
          odds.awaySpread = matches[0].odds;
          odds.homeSpreadLine = matches[1].line;
          odds.homeSpread = matches[1].odds;
          odds.spreadLine = matches[0].line;
          console.log(`✅ Fallback spread extraction: Away ${odds.awaySpreadLine} @ ${odds.awaySpread}, Home ${odds.homeSpreadLine} @ ${odds.homeSpread}`);
        }
      }
      
      // STEP 4: If we still don't have spread data, try alternative approach
      if (odds.spreadLine === 0) {
        console.log(`🔍 No spreads found, trying alternative detection...`);
        
        // Look for any number that could be a spread line
        const allNumbers = text.match(/[+-]?\d+\.?\d*/g);
        if (allNumbers) {
          console.log(`🔢 All numbers found:`, allNumbers);
          
          // Look for spread lines (1.5, -1.5, 2.5, -2.5, etc.)
          for (let i = 0; i < allNumbers.length - 1; i++) {
            const potentialLine = parseFloat(allNumbers[i]);
            const potentialOdds = parseInt(allNumbers[i + 1]);
            
            if (isValidSpreadLine(potentialLine) && 
                Math.abs(potentialOdds) >= 100 && Math.abs(potentialOdds) <= 500 &&
                Math.abs(potentialLine - odds.totalLine) > 0.5) {
              
              console.log(`✅ Alternative spread detection: ${potentialLine} @ ${potentialOdds}`);
              odds.spreadLine = potentialLine;
              odds.awaySpread = potentialOdds;
              
              // Look for the second occurrence of this spread line
              for (let j = i + 2; j < allNumbers.length - 1; j++) {
                const secondLine = parseFloat(allNumbers[j]);
                const secondOdds = parseInt(allNumbers[j + 1]);
                
                if (Math.abs(secondLine - potentialLine) < 0.1 && 
                    Math.abs(secondOdds) >= 100 && Math.abs(secondOdds) <= 500) {
                  odds.homeSpread = secondOdds;
                  console.log(`✅ Found second spread: ${secondLine} @ ${secondOdds}`);
                  break;
                }
              }
              break;
            }
          }
        }
      }
      
      // STEP 5: Clean and validate the odds
      const cleanedOdds = validateAndCleanOdds(odds);
      Object.assign(odds, cleanedOdds);
      
      console.log(`📊 Final extracted odds:`, {
        moneyline: [odds.awayMoneyline, odds.homeMoneyline],
        spread: [odds.spreadLine, odds.awaySpread, odds.homeSpread],
        total: [odds.totalLine, odds.totalOver, odds.totalUnder]
      });
      
    } catch (error) {
      console.warn('⚠️ Failed to extract odds from text:', error);
    }
    
    return odds;
  }
  
  function isValidSpreadLine(line) {
    // Spread lines are typically: 1.5, -1.5, 2.5, -2.5, etc.
    // They are NOT: 7, 8, 9, 10 (those are total lines)
    const validSpreadLines = [
      0.5, -0.5, 1.0, -1.0, 1.5, -1.5, 2.0, -2.0, 2.5, -2.5,
      3.0, -3.0, 3.5, -3.5, 4.0, -4.0, 4.5, -4.5, 5.0, -5.0,
      5.5, -5.5, 6.0, -6.0, 6.5, -6.5, 7.0, -7.0, 7.5, -7.5,
      8.0, -8.0, 8.5, -8.5, 9.0, -9.0, 9.5, -9.5, 10.0, -10.0,
      10.5, -10.5, 11.0, -11.0, 11.5, -11.5, 12.0, -12.0, 12.5, -12.5
    ];
    
    return validSpreadLines.includes(line);
  }
  
  function getTeamAbbreviation(teamName) {
    const abbreviations = {
      'Philadelphia Phillies': 'PHI',
      'Cincinnati Reds': 'CIN',
      'New York Yankees': 'NYY',
      'Houston Astros': 'HOU',
      'Los Angeles Dodgers': 'LAD',
      'San Diego Padres': 'SD',
      'Boston Red Sox': 'BOS',
      'Seattle Mariners': 'SEA',
      'Chicago Cubs': 'CHC',
      'Texas Rangers': 'TEX',
      'Atlanta Braves': 'ATL',
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
      'Pittsburgh Pirates': 'PIT',
      'St. Louis Cardinals': 'STL'
    };
    
    return abbreviations[teamName] || teamName.split(' ').map(word => word[0]).join('').toUpperCase();
  }
  
  function extractSpreadDirection(game) {
    // Determine which team is the underdog based on moneyline odds
    // Positive moneyline = underdog, negative = favorite
    // If away team has positive moneyline, they're the underdog and get points (+spread)
    // If home team has positive moneyline, they're the underdog and get points (+spread)
    
    const awayMoneyline = game.awayMoneyline || 0;
    const homeMoneyline = game.homeMoneyline || 0;
    
    let awayIsUnderdog = false;
    
    if (awayMoneyline > 0 && homeMoneyline < 0) {
      // Away team is underdog (positive odds), home team is favorite (negative odds)
      awayIsUnderdog = true;
    } else if (awayMoneyline < 0 && homeMoneyline > 0) {
      // Away team is favorite (negative odds), home team is underdog (positive odds)
      awayIsUnderdog = false;
    } else {
      // Both positive or both negative - use the larger absolute value as favorite
      if (Math.abs(awayMoneyline) > Math.abs(homeMoneyline)) {
        awayIsUnderdog = true; // Away has higher odds = underdog
      } else {
        awayIsUnderdog = false; // Home has higher odds = underdog
      }
    }
    
    return { awayIsUnderdog };
  }
  
  function copyToClipboard(text) {
    try {
      navigator.clipboard.writeText(text).then(() => {
        console.log('📋 Data copied to clipboard!');
      }).catch(() => {
        console.log('📋 Data (copy manually):', text);
      });
    } catch (error) {
      console.log('📋 Data (copy manually):', text);
    }
  }
  
  function displayResults(games) {
    // Create a results display
    const resultsDiv = document.createElement('div');
    resultsDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 700px;
      max-height: 80vh;
      background: white;
      border: 2px solid #0066FF;
      border-radius: 8px;
      padding: 20px;
      z-index: 10000;
      overflow-y: auto;
      font-family: Arial, sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;
    
    // Calculate summary stats
    const validGames = games.filter(g => g.spreadLine !== 0 || g.totalLine !== 0);
    const gamesWithSpread = games.filter(g => g.spreadLine !== 0).length;
    const gamesWithTotal = games.filter(g => g.totalLine !== 0).length;
    
    resultsDiv.innerHTML = `
      <h3 style="margin: 0 0 15px 0; color: #0066FF;">🎯 Pikkit Data Extracted</h3>
      <div style="background: #f8f9fa; padding: 10px; border-radius: 4px; margin-bottom: 15px;">
        <p style="margin: 0; font-size: 14px;"><strong>Summary:</strong></p>
        <p style="margin: 5px 0; font-size: 12px;">Total games: ${games.length}</p>
        <p style="margin: 5px 0; font-size: 12px;">Games with spread: ${gamesWithSpread}</p>
        <p style="margin: 5px 0; font-size: 12px;">Games with total: ${gamesWithTotal}</p>
        <p style="margin: 5px 0; font-size: 12px;">Valid games: ${validGames.length}</p>
      </div>
      <div style="max-height: 300px; overflow-y: auto;">
        ${games.length > 0 ? games.map(game => {
          // Format spread line with +/- sign
          const spreadDisplay = game.spreadLine !== 0 ? 
            (game.spreadLine > 0 ? `+${game.spreadLine}` : `${game.spreadLine}`) : 'N/A';
          
          return `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
              <strong>${game.awayTeam.abbreviation} @ ${game.homeTeam.abbreviation}</strong><br>
              <small style="color: #666;">${game.awayTeam.name} @ ${game.homeTeam.name}</small><br>
              <small style="color: #999;">Time: ${game.parsedTime || 'TBD'}</small><br>
              <div style="margin: 5px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                <strong style="color: #0066FF;">Away Team (${game.awayTeam.abbreviation}):</strong><br>
                <small style="color: #999;">ML: ${game.awayMoneyline > 0 ? '+' : ''}${game.awayMoneyline}</small><br>
                <small style="color: #999;">Spread: ${spreadDisplay} @ ${game.awaySpread > 0 ? '+' : ''}${game.awaySpread}</small>
              </div>
              <div style="margin: 5px 0; padding: 8px; background: #f8f9fa; border-radius: 4px;">
                <strong style="color: #28a745;">Home Team (${game.homeTeam.abbreviation}):</strong><br>
                <small style="color: #999;">ML: ${game.homeMoneyline > 0 ? '+' : ''}${game.homeMoneyline}</small><br>
                <small style="color: #999;">Spread: ${spreadDisplay} @ ${game.homeSpread > 0 ? '+' : ''}${game.homeSpread}</small>
              </div>
              <div style="margin: 5px 0; padding: 8px; background: #e8f4fd; border-radius: 4px;">
                <strong style="color: #0066FF;">Sportsbook Lines (${game.sportsbooks.length}):</strong><br>
                ${game.sportsbooks.map((sb, index) => `
                  <div style="margin: 5px 0; padding: 5px; background: #f0f8ff; border-radius: 3px; border-left: 3px solid #0066FF;">
                    <div style="display: flex; align-items: center; margin-bottom: 3px;">
                      ${sb.iconSrc ? `<img src="${sb.iconSrc}" alt="" style="max-width: 20px; max-height: 20px; margin-right: 8px; border: 1px solid #ddd;">` : ''}
                      <strong style="color: #333; font-size: 12px;">Sportsbook ${index + 1}</strong>
                    </div>
                    <small style="color: #666;"><strong>Bet Type:</strong> ${sb.betType}</small><br>
                    <small style="color: #666;"><strong>Associated Odds:</strong> ${sb.associatedOdds ? sb.associatedOdds.join(', ') : 'N/A'}</small><br>
                    <small style="color: #999;"><strong>Raw Text:</strong> "${sb.rawText}"</small><br>
                    <small style="color: #888; font-family: monospace; font-size: 10px; word-break: break-all;">${sb.iconSrc}</small>
                  </div>
                `).join('')}
              </div>
              <small style="color: #999;">Total: ${game.totalLine} (O: ${(game.sportsbooks[0] && game.sportsbooks[0].odds && game.sportsbooks[0].odds.totalOver) || 'N/A'}, U: ${(game.sportsbooks[0] && game.sportsbooks[0].odds && game.sportsbooks[0].odds.totalUnder) || 'N/A'})</small><br>
              <small style="color: #999;">Method: ${game.extractionMethod || 'unknown'}</small>
            </div>
          `;
        }).join('') : '<p style="color: #999; font-style: italic;">No games found. Check console for debugging info.</p>'}
      </div>
      <div style="margin-top: 15px;">
        <button onclick="copyAppFormat()" style="
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 10px;
        ">Copy App Format</button>
        <button onclick="showExtractionSummary()" style="
          background: #17a2b8;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 10px;
        ">Show Summary</button>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: #0066FF;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        ">Close</button>
      </div>
    `;
    
    document.body.appendChild(resultsDiv);
    
    // Add the copy function to window scope
    window.copyAppFormat = function() {
      const appFormat = convertToAppFormat(games);
      copyToClipboard(JSON.stringify(appFormat, null, 2));
      console.log('📋 App format data copied to clipboard!');
      alert('App format data copied to clipboard!');
    };
    
    // Add the summary function to window scope
    window.showExtractionSummary = function() {
      showExtractionSummary(games);
    };
  }
  
  function showExtractionSummary(games) {
    console.log('📊 EXTRACTION SUMMARY:');
    console.log(`Total games found: ${games.length}`);
    
    const gamesWithSpread = games.filter(g => g.spreadLine !== 0);
    const gamesWithTotal = games.filter(g => g.totalLine !== 0);
    const gamesWithTime = games.filter(g => g.parsedTime !== 'TBD');
    
    console.log(`Games with spread data: ${gamesWithSpread.length}`);
    console.log(`Games with total data: ${gamesWithTotal.length}`);
    console.log(`Games with time data: ${gamesWithTime.length}`);
    
    console.log('\n📏 Spread lines found:', gamesWithSpread.map(g => g.spreadLine));
    console.log('📊 Total lines found:', gamesWithTotal.map(g => g.totalLine));
    console.log('⏰ Times found:', gamesWithTime.map(g => g.parsedTime));
    
    console.log('\n🎯 Sample game data:');
    if (games.length > 0) {
      const sample = games[0];
      console.log('Sample game:', {
        teams: `${sample.awayTeam.name} @ ${sample.homeTeam.name}`,
        time: sample.parsedTime,
        spread: sample.spreadLine,
        total: sample.totalLine,
        odds: (sample.sportsbooks[0] && sample.sportsbooks[0].odds) || {}
      });
      
      // Show raw text analysis
      if (sample.rawText) {
        console.log('\n🔍 Raw text analysis:');
        const moneylineMatches = sample.rawText.match(/[+-]\d+/g);
        console.log('Moneyline matches:', moneylineMatches);
        
        if (sample.spreadLine !== 0) {
          const spreadPattern = new RegExp(`[+-]${sample.spreadLine.toString().replace(/\./g, '\\.')}([+-]\\d+)`, 'g');
          const spreadMatches = sample.rawText.match(spreadPattern);
          console.log('Spread matches:', spreadMatches);
        }
        
        const totalMatches = sample.rawText.match(/([ou])(\d+\.?\d*)([+-]\d+)/g);
        console.log('Total matches:', totalMatches);
      }
    }
  }
  
  function debugExtraction(game) {
    console.log(`\n🔍 DEBUGGING EXTRACTION FOR: ${game.awayTeam.name} @ ${game.homeTeam.name}`);
    console.log('Raw text:', game.rawText);
    
    // Extract all numbers
    const allNumbers = game.rawText.match(/[+-]?\d+\.?\d*/g);
    console.log('All numbers:', allNumbers);
    
    // Extract all +/- numbers
    const plusMinusNumbers = game.rawText.match(/[+-]\d+/g);
    console.log('Plus/minus numbers:', plusMinusNumbers);
    
    // Extract total patterns
    const totalPatterns = game.rawText.match(/([ou])(\d+\.?\d*)([+-]\d+)/g);
    console.log('Total patterns:', totalPatterns);
    
    // Extract spread patterns
    if (game.spreadLine !== 0) {
      const spreadPattern = new RegExp(`[+-]${game.spreadLine.toString().replace(/\./g, '\\.')}([+-]\\d+)`, 'g');
      const spreadMatches = game.rawText.match(spreadPattern);
      console.log('Spread patterns:', spreadMatches);
    }
    
    console.log('Current extracted data:', {
      awayMoneyline: game.awayMoneyline,
      homeMoneyline: game.homeMoneyline,
      spreadLine: game.spreadLine,
      totalLine: game.totalLine,
      odds: (game.sportsbooks[0] && game.sportsbooks[0].odds) || {}
    });
  }
  
  function convertToAppFormat(pikkitGames) {
    console.log(`🔄 convertToAppFormat: Processing ${pikkitGames.length} raw games`);
    pikkitGames.forEach((game, i) => {
      console.log(`  ${i}: ${game.awayTeam?.name || 'Unknown'} vs ${game.homeTeam?.name || 'Unknown'}`);
    });
    
    // Clean and validate the data first (function doesn't exist, using raw data)
    const cleanedGames = pikkitGames;
    console.log(`🔄 Using raw games: ${cleanedGames.length} games`);
    
    return cleanedGames.map(game => {
      // Use the already extracted home moneyline and spread from the game object
      let homeMoneyline = game.homeMoneyline || 0;
      let homeSpread = game.homeSpread || 0;
      
      console.log(`✅ Using stored home moneyline: ${homeMoneyline} for ${game.homeTeam.name}`);
      console.log(`✅ Using stored home spread: ${homeSpread} for ${game.homeTeam.name}`);
      
      // Format the spread line for display (this is the away team's spread line)
      let formattedSpreadLine = '';
      
      if (game.spreadLine !== 0) {
        // The spread line already has the correct +/- sign from the scraper
        formattedSpreadLine = game.spreadLine > 0 ? `+${game.spreadLine}` : `${game.spreadLine}`;
      }
      
      // Create the PikkitPayload format that the frontend expects
      const pikkitGame = {
        id: game.id,
        sport: game.sport,
        league: game.league,
        gameTime: game.gameTime,
        awayTeam: { 
          name: game.awayTeam.name, 
          abbreviation: game.awayTeam.abbreviation 
        },
        homeTeam: { 
          name: game.homeTeam.name, 
          abbreviation: game.homeTeam.abbreviation 
        },
        spreadLine: game.spreadLine || 0,
        awaySpreadLine: game.awaySpreadLine || 0,  // Away team's actual spread line
        homeSpreadLine: game.homeSpreadLine || 0, // Home team's actual spread line
        totalLine: game.totalLine || 0,
        formattedSpreadLine: formattedSpreadLine, // This represents the away team's spread line
        sportsbooks: [
          {
            name: 'Novig',
            abbreviation: 'N',
            odds: {
              moneyline: game.awayMoneyline || 0,
              spread: game.awaySpread || 0,
              totalOver: (game.sportsbooks[0] && game.sportsbooks[0].odds && game.sportsbooks[0].odds.totalOver) || 0,
              totalUnder: (game.sportsbooks[0] && game.sportsbooks[0].odds && game.sportsbooks[0].odds.totalUnder) || 0
            }
          },
          {
            name: 'Pikkit',
            abbreviation: 'PK',
            odds: {
              moneyline: homeMoneyline || 0,
              spread: homeSpread || 0,
              totalOver: (game.sportsbooks[0] && game.sportsbooks[0].odds && game.sportsbooks[0].odds.totalOver) || 0,
              totalUnder: (game.sportsbooks[0] && game.sportsbooks[0].odds && game.sportsbooks[0].odds.totalUnder) || 0
            }
          }
        ],
        awayTeamOdds: {
          moneyline: game.awayMoneyline || 0,
          spread: game.awaySpread || 0
        },
        homeTeamOdds: {
          moneyline: homeMoneyline || 0,
          spread: homeSpread || 0
        },
        // CORRECT PATTERN: ML Home, Spread Home, Over, ML Away, Spread Away, Under
        sportsbookLogos: (() => {
          console.log(`✅ Using CORRECT popup pattern for ${game.awayTeam.name} vs ${game.homeTeam.name}`);
          console.log(`   Total sportsbooks: ${game.sportsbooks?.length || 0}`);
          
          // ACTUAL extracted order based on console logs:
          // 0: ML Away, 1: Spread Home, 2: Total Over, 3: ML Home, 4: Spread Away, 5: Total Under
          const sb0 = game.sportsbooks?.[0] || null; // ML Away
          const sb1 = game.sportsbooks?.[1] || null; // Spread Home  
          const sb2 = game.sportsbooks?.[2] || null; // Total Over
          const sb3 = game.sportsbooks?.[3] || null; // ML Home
          const sb4 = game.sportsbooks?.[4] || null; // Spread Away
          const sb5 = game.sportsbooks?.[5] || null; // Total Under
          
          console.log(`   SB0 (ML Away): ${sb0?.iconSrc ? sb0.iconSrc.split('/').pop() : 'NULL'}`);
          console.log(`   SB1 (Spread Home): ${sb1?.iconSrc ? sb1.iconSrc.split('/').pop() : 'NULL'}`);
          console.log(`   SB2 (Total Over): ${sb2?.iconSrc ? sb2.iconSrc.split('/').pop() : 'NULL'}`);
          console.log(`   SB3 (ML Home): ${sb3?.iconSrc ? sb3.iconSrc.split('/').pop() : 'NULL'}`);
          console.log(`   SB4 (Spread Away): ${sb4?.iconSrc ? sb4.iconSrc.split('/').pop() : 'NULL'}`);
          console.log(`   SB5 (Total Under): ${sb5?.iconSrc ? sb5.iconSrc.split('/').pop() : 'NULL'}`);
          
          return {
            // Backward compatibility - use first found logos
            moneyline: sb0?.iconSrc || sb3?.iconSrc || null,
            spread: sb1?.iconSrc || sb4?.iconSrc || null,
            totalOver: sb2?.iconSrc || null,
            totalUnder: sb5?.iconSrc || null,
            
            // Specific team/side logos using the ACTUAL extracted pattern
            moneylineAway: sb0?.iconSrc || null,  // Position 0: ML Away
            moneylineHome: sb3?.iconSrc || null,  // Position 3: ML Home
            spreadHome: sb1?.iconSrc || null,     // Position 1: Spread Home
            spreadAway: sb4?.iconSrc || null      // Position 4: Spread Away
          };
        })()
      };
      
      return pikkitGame;
    });
  }
  
  function removeDuplicateGames(games) {
    const seen = new Map(); // Use Map to store the best version of each game
    const uniqueGames = [];
    
    games.forEach(game => {
      // Create a unique key based on team names and game time
      const gameKey = `${game.awayTeam.name}|${game.homeTeam.name}|${game.gameTime}`;
      
      if (!seen.has(gameKey)) {
        // First time seeing this game, keep it
        seen.set(gameKey, game);
        uniqueGames.push(game);
        console.log(`✅ Keeping unique game: ${game.awayTeam.name} @ ${game.homeTeam.name}`);
      } else {
        // We've seen this game before, check if this version is better
        const existingGame = seen.get(gameKey);
        const currentGame = game;
        
        // Keep the version with more complete data (more non-zero odds)
        const existingOdds = (existingGame.sportsbooks[0] && existingGame.sportsbooks[0].odds) || {};
        const currentOdds = (currentGame.sportsbooks[0] && currentGame.sportsbooks[0].odds) || {};
        
        const existingScore = Object.values(existingOdds).filter(v => v !== 0 && v !== null && v !== undefined).length;
        const currentScore = Object.values(currentOdds).filter(v => v !== 0 && v !== null && v !== undefined).length;
        
        if (currentScore > existingScore) {
          // Replace with better version
          const index = uniqueGames.findIndex(g => g === existingGame);
          if (index !== -1) {
            uniqueGames[index] = currentGame;
            seen.set(gameKey, currentGame);
            console.log(`🔄 Replaced game with better data: ${game.awayTeam.name} @ ${game.homeTeam.name}`);
          }
        } else {
          console.log(`⚠️ Skipping duplicate game: ${game.awayTeam.name} @ ${game.homeTeam.name}`);
        }
      }
    });
    
    console.log(`🔄 Deduplication: ${games.length} → ${uniqueGames.length} games`);
    return uniqueGames;
  }

  function cleanGameData(games) {
    return games.filter(game => {
      // Filter out games with obviously wrong data
      const odds = (game.sportsbooks[0] && game.sportsbooks[0].odds) || {};
      
      // Check if moneyline odds are reasonable
      if (odds.moneyline && (Math.abs(odds.moneyline) > 1000 || odds.moneyline === 0)) {
        console.log(`⚠️ Filtering out game with invalid moneyline: ${odds.moneyline}`);
        return false;
      }
      
      // Check if spread odds are reasonable
      if (odds.spread && Math.abs(odds.spread) > 500) {
        console.log(`⚠️ Filtering out game with invalid spread odds: ${odds.spread}`);
        return false;
      }
      
      // Check if total odds are reasonable
      if ((odds.totalOver && Math.abs(odds.totalOver) > 200) || 
          (odds.totalUnder && Math.abs(odds.totalUnder) > 200)) {
        console.log(`⚠️ Filtering out game with invalid total odds: ${odds.totalOver}/${odds.totalUnder}`);
        return false;
      }
      
      // Check if spread line is reasonable
      if (game.spreadLine && (Math.abs(game.spreadLine) > 15 || game.spreadLine === 0)) {
        console.log(`⚠️ Filtering out game with invalid spread line: ${game.spreadLine}`);
        return false;
      }
      
      // Check if total line is reasonable
      if (game.totalLine && (game.totalLine < 3 || game.totalLine > 25)) {
        console.log(`⚠️ Filtering out game with invalid total line: ${game.totalLine}`);
        return false;
      }
      
      return true;
    });
  }
  
  function validateAndCleanOdds(odds) {
    // Clean up any obviously wrong odds values
    const cleaned = { ...odds };
    
    // Fix unrealistic total under odds (like -1026, -1067, -1207)
    if (cleaned.totalUnder && Math.abs(cleaned.totalUnder) > 200) {
      console.log(`⚠️ Cleaning unrealistic total under odds: ${cleaned.totalUnder}`);
      // Try to extract the correct value by looking at the pattern
      // Often these are concatenated numbers that should be separate
      const totalUnderStr = cleaned.totalUnder.toString();
      if (totalUnderStr.length > 3) {
        // Take the first 3 digits (e.g., -1026 -> -102)
        cleaned.totalUnder = parseInt(totalUnderStr.substring(0, 4));
        console.log(`✅ Cleaned total under odds to: ${cleaned.totalUnder}`);
      } else {
        cleaned.totalUnder = 0;
      }
    }
    
    // Fix unrealistic total over odds
    if (cleaned.totalOver && Math.abs(cleaned.totalOver) > 200) {
      console.log(`⚠️ Cleaning unrealistic total over odds: ${cleaned.totalOver}`);
      const totalOverStr = cleaned.totalOver.toString();
      if (totalOverStr.length > 3) {
        cleaned.totalOver = parseInt(totalOverStr.substring(0, 4));
        console.log(`✅ Cleaned total over odds to: ${cleaned.totalOver}`);
      } else {
        cleaned.totalOver = 0;
      }
    }
    
    return cleaned;
  }
  
  function showDebugInfo() {
    console.log('🔍 DEBUGGING INFO:');
    console.log('Page title:', document.title);
    console.log('URL:', window.location.href);
    console.log('Body text length:', document.body.innerText.length);
    console.log('Body HTML length:', document.body.innerHTML.length);
    
    // Look for any elements with game-related text
    const gameTextElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const text = el.textContent || '';
      return text.includes('More wagers →') && text.includes('PM');
    });
    
    console.log('Elements with "More wagers →" and time:', gameTextElements.length);
    gameTextElements.slice(0, 5).forEach((el, i) => {
      console.log(`Game element ${i}:`, (el.textContent || '').substring(0, 200));
    });
    
    // Show sample of what we're looking for
    console.log('🔍 Looking for patterns like:');
    console.log('  "Philadelphia Phillies+113+1.5-180o9.5-102Cincinnati Reds-115+1.5-190u9.5-1086:10 PMMore wagers →"');
    console.log('  - Team names');
    console.log('  - Moneyline odds (+113, -115)');
    console.log('  - Spread lines (+1.5, -1.5)');
    console.log('  - Total lines (o9.5, u9.5)');
    console.log('  - Game times (6:10 PM)');
    console.log('  - "More wagers →" text');
    
    // Analyze the first game element in detail
    if (gameTextElements.length > 0) {
      console.log('\n🔍 DETAILED ANALYSIS OF FIRST GAME:');
      const firstGame = gameTextElements[0];
      const text = firstGame.textContent || '';
      
      console.log('Raw text:', text);
      console.log('Text length:', text.length);
      
      // Find all numbers
      const allNumbers = text.match(/[+-]?\d+\.?\d*/g);
      console.log('All numbers found:', allNumbers);
      
      // Find all +/- numbers
      const plusMinusNumbers = text.match(/[+-]\d+/g);
      console.log('Plus/minus numbers:', plusMinusNumbers);
      
      // Find total patterns
      const totalPatterns = text.match(/([ou])(\d+\.?\d*)([+-]\d+)/g);
      console.log('Total patterns (o7.5-120):', totalPatterns);
      
      // Find potential spread patterns
      const spreadPatterns = text.match(/([+-]?\d+\.?\d*)([+-]\d+)/g);
      console.log('Potential spread patterns:', spreadPatterns);
      
      // Find time patterns
      const timePatterns = text.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/g);
      console.log('Time patterns:', timePatterns);
      
      // Find team names
      const teamNames = ['Philadelphia Phillies', 'Cincinnati Reds', 'New York Yankees', 'Houston Astros'];
      teamNames.forEach(team => {
        if (text.includes(team)) {
          console.log(`Found team: ${team} at position ${text.indexOf(team)}`);
        }
      });
    }
  }
  
  console.log('📝 Enhanced Pikkit scraper loaded. Waiting for page to load...');
  
})();
