// Manual Pikkit Page Inspector - Run this to see what's actually on the page
// Copy and paste this into the browser console on https://app.pikkit.com/

(function() {
  'use strict';
  
  console.log('🔍 Manual Pikkit Page Inspector Starting...');
  
  // Function to inspect the page content
  function inspectPage() {
    console.log('=== PAGE INSPECTION RESULTS ===');
    console.log('Page Title:', document.title);
    console.log('Current URL:', window.location.href);
    console.log('Body Text Length:', document.body.innerText.length);
    console.log('Body HTML Length:', document.body.innerHTML.length);
    
    // Look for any text containing common patterns
    const allText = document.body.innerText;
    
    // Check for team abbreviations
    const teamAbbreviations = ['NYY', 'HOU', 'LAD', 'SD', 'BOS', 'SEA', 'CHC', 'TEX', 'ATL', 'PHI'];
    const foundTeams = teamAbbreviations.filter(team => allText.includes(team));
    console.log('Found Team Abbreviations:', foundTeams);
    
    // Check for @ symbols
    const atCount = (allText.match(/@/g) || []).length;
    console.log('@ symbols found:', atCount);
    
    // Check for time patterns
    const timePatterns = (allText.match(/\d{1,2}:\d{2}\s*(?:AM|PM)/g) || []);
    console.log('Time patterns found:', timePatterns);
    
    // Check for odds patterns
    const oddsPatterns = (allText.match(/[+-]\d+/g) || []);
    console.log('Odds patterns found:', oddsPatterns.slice(0, 20)); // Show first 20
    
    // Look for specific elements
    console.log('\n=== ELEMENT INSPECTION ===');
    
    // Check for common game-related classes
    const gameClasses = [
      '.game', '.odds', '.matchup', '.team', '.sportsbook',
      '[data-testid*="game"]', '[data-testid*="odds"]', '[data-testid*="team"]'
    ];
    
    gameClasses.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.log(`Found ${elements.length} elements with selector: ${selector}`);
          elements.slice(0, 3).forEach((el, i) => {
            console.log(`  ${selector} ${i}:`, el.textContent?.substring(0, 100));
          });
        }
      } catch (e) {
        // Ignore invalid selectors
      }
    });
    
    // Look for any elements with game-like text
    console.log('\n=== GAME-LIKE TEXT SEARCH ===');
    const allElements = document.querySelectorAll('*');
    const gameTextElements = Array.from(allElements).filter(el => {
      const text = el.textContent || '';
      return text.includes('@') || 
             text.includes('MLB') || 
             text.includes('Baseball') ||
             teamAbbreviations.some(team => text.includes(team));
    });
    
    console.log(`Found ${gameTextElements.length} elements with game-like text`);
    gameTextElements.slice(0, 10).forEach((el, i) => {
      const text = el.textContent?.trim() || '';
      if (text.length > 0 && text.length < 200) {
        console.log(`  Game text ${i}: "${text}"`);
      }
    });
    
    // Look for any elements with odds-like numbers
    console.log('\n=== ODDS-LIKE NUMBERS SEARCH ===');
    const oddsElements = Array.from(allElements).filter(el => {
      const text = el.textContent || '';
      return /[+-]\d+/.test(text) && text.length < 100;
    });
    
    console.log(`Found ${oddsElements.length} elements with odds-like numbers`);
    oddsElements.slice(0, 10).forEach((el, i) => {
      const text = el.textContent?.trim() || '';
      console.log(`  Odds element ${i}: "${text}"`);
    });
    
    // Check for React components or data attributes
    console.log('\n=== REACT/DATA INSPECTION ===');
    const dataElements = document.querySelectorAll('[data-*]');
    console.log(`Found ${dataElements.length} elements with data attributes`);
    dataElements.slice(0, 10).forEach((el, i) => {
      const attrs = Array.from(el.attributes).filter(attr => attr.name.startsWith('data-'));
      if (attrs.length > 0) {
        console.log(`  Data element ${i}:`, attrs.map(attr => `${attr.name}="${attr.value}"`).join(', '));
      }
    });
    
    // Look for any hidden or script content
    console.log('\n=== HIDDEN CONTENT SEARCH ===');
    const scripts = document.querySelectorAll('script');
    scripts.forEach((script, i) => {
      if (script.textContent && script.textContent.includes('MLB')) {
        console.log(`  Script ${i} contains MLB:`, script.textContent.substring(0, 200));
      }
    });
    
    // Check for any JSON-LD or structured data
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    console.log(`Found ${jsonLdScripts.length} JSON-LD scripts`);
    jsonLdScripts.forEach((script, i) => {
      try {
        const data = JSON.parse(script.textContent);
        console.log(`  JSON-LD ${i}:`, data);
      } catch (e) {
        // Ignore invalid JSON
      }
    });
    
    console.log('\n=== INSPECTION COMPLETE ===');
    console.log('Check the console above for detailed findings.');
  }
  
  // Run inspection after a short delay
  setTimeout(inspectPage, 1000);
  
  // Also provide a function to run manually
  window.inspectPikkitPage = inspectPage;
  
  console.log('📝 Manual inspector loaded. Run inspectPikkitPage() to inspect again.');
  
})();
