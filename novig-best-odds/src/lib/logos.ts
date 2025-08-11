// Minimal helper to get MLB team logo URLs.
// Uses ESPN CDN which hosts square PNG team logos by abbreviation for MLB.
// Note: Some teams use uncommon abbreviations on various sites; this map
// normalizes our app's abbreviations to ESPN's expected codes.

const abbrToEspnCode: Record<string, string> = {
  ATL: 'atl',
  ARI: 'ari',
  BAL: 'bal',
  BOS: 'bos',
  CHC: 'chc',
  CWS: 'cws', // Chicago White Sox
  CIN: 'cin',
  CLE: 'cle',
  COL: 'col',
  DET: 'det',
  HOU: 'hou',
  KC: 'kc', // Kansas City Royals
  LAA: 'laa',
  LAD: 'lad',
  MIA: 'mia',
  MIL: 'mil',
  MIN: 'min',
  NYM: 'nym',
  NYY: 'nyy',
  OAK: 'oak',
  PHI: 'phi',
  PIT: 'pit',
  SD: 'sd',
  SEA: 'sea',
  SF: 'sf',
  STL: 'stl',
  TB: 'tb',
  TEX: 'tex',
  TOR: 'tor',
  WSH: 'wsh',
}

export function getMlbLogoUrl(abbr: string): string {
  const code = abbrToEspnCode[abbr.toUpperCase()]
  if (!code) return ''
  // 500px source, display scaled via CSS
  return `https://a.espncdn.com/i/teamlogos/mlb/500/${code}.png`
}


