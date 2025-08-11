export type Moneyline = { novig: number; dk: number; fd: number; mgm: number };
export type Spread = { line: number; novig: number; dk: number; fd: number; mgm: number };
export type Total = { line: number; over: { novig: number; dk: number; fd: number; mgm: number }; under: { novig: number; dk: number; fd: number; mgm: number } };

// Best line information for each bet type
export type BestLine = {
  awayMoneyline: 'novig' | 'dk' | 'fd' | 'mgm';
  homeMoneyline: 'novig' | 'dk' | 'fd' | 'mgm';
  awaySpread: 'novig' | 'dk' | 'fd' | 'mgm';
  homeSpread: 'novig' | 'dk' | 'fd' | 'mgm';
  totalOver: 'novig' | 'dk' | 'fd' | 'mgm';
  totalUnder: 'novig' | 'novig' | 'dk' | 'fd' | 'mgm';
};

// Pikkit sportsbook logo information
export type PikkitSportsbookLogos = {
  moneyline: string | null;
  spread: string | null;
  totalOver: string | null;
  totalUnder: string | null;
  // Specific team/side logos
  moneylineAway?: string | null;
  moneylineHome?: string | null;
  spreadAway?: string | null;
  spreadHome?: string | null;
};

export type Game = {
  id: string;
  league: 'MLB';
  startsAt: string; // ISO
  awayTeam: { name: string; abbr: string };
  homeTeam: { name: string; abbr: string };
  moneyline: { away: Moneyline; home: Moneyline };
  spread: { away: Spread; home: Spread }; // home/away share
  total: Total;
  bestLines?: BestLine; // Optional best line information
  sportsbookLogos?: PikkitSportsbookLogos; // Optional Pikkit sportsbook logos
};

export const mlbGames: Game[] = [
  {
    id: "mlb-2024-001",
    league: "MLB",
    startsAt: "2024-03-28T19:05:00Z",
    awayTeam: { name: "New York Yankees", abbr: "NYY" },
    homeTeam: { name: "Houston Astros", abbr: "HOU" },
    moneyline: {
      away: { novig: -110, dk: -120, fd: -125, mgm: -118 },
      home: { novig: +100, dk: +110, fd: +105, mgm: +108 }
    },
    spread: {
      away: { line: -1.5, novig: +140, dk: +150, fd: +145, mgm: +148 },
      home: { line: 1.5, novig: -160, dk: -170, fd: -165, mgm: -168 }
    },
    total: {
      line: 8.5,
      over: { novig: -105, dk: -115, fd: -110, mgm: -112 },
      under: { novig: -115, dk: -105, fd: -110, mgm: -108 }
    },
    bestLines: {
      awayMoneyline: 'novig', // Novig has best away moneyline (-110 vs -120, -125, -118)
      homeMoneyline: 'dk',    // DraftKings has best home moneyline (+110 vs +100, +105, +108)
      awaySpread: 'novig',    // Novig has best away spread (+140 vs +150, +145, +148)
      homeSpread: 'novig',    // Novig has best home spread (-160 vs -170, -165, -168)
      totalOver: 'novig',     // Novig has best over (-105 vs -115, -110, -112)
      totalUnder: 'dk'        // DraftKings has best under (-105 vs -115, -110, -108)
    }
  },
  {
    id: "mlb-2024-002",
    league: "MLB",
    startsAt: "2024-03-28T20:10:00Z",
    awayTeam: { name: "Los Angeles Dodgers", abbr: "LAD" },
    homeTeam: { name: "San Diego Padres", abbr: "SD" },
    moneyline: {
      away: { novig: -140, dk: -150, fd: -155, mgm: -152 },
      home: { novig: +120, dk: +130, fd: +125, mgm: +128 }
    },
    spread: {
      away: { line: -1.5, novig: +110, dk: +120, fd: +115, mgm: +118 },
      home: { line: 1.5, novig: -130, dk: -140, fd: -135, mgm: -138 }
    },
    total: {
      line: 9.0,
      over: { novig: -110, dk: -120, fd: -115, mgm: -118 },
      under: { novig: -110, dk: -100, fd: -105, mgm: -102 }
    }
  },
  {
    id: "mlb-2024-003",
    league: "MLB",
    startsAt: "2024-03-28T21:40:00Z",
    awayTeam: { name: "Boston Red Sox", abbr: "BOS" },
    homeTeam: { name: "Seattle Mariners", abbr: "SEA" },
    moneyline: {
      away: { novig: +110, dk: +120, fd: +115, mgm: +118 },
      home: { novig: -130, dk: -140, fd: -135, mgm: -138 }
    },
    spread: {
      away: { line: 1.5, novig: -110, dk: -120, fd: -115, mgm: -118 },
      home: { line: -1.5, novig: -110, dk: -100, fd: -105, mgm: -102 }
    },
    total: {
      line: 8.0,
      over: { novig: -105, dk: -115, fd: -110, mgm: -112 },
      under: { novig: -115, dk: -105, fd: -110, mgm: -108 }
    }
  },
  {
    id: "mlb-2024-004",
    league: "MLB",
    startsAt: "2024-03-28T22:05:00Z",
    awayTeam: { name: "Chicago Cubs", abbr: "CHC" },
    homeTeam: { name: "Texas Rangers", abbr: "TEX" },
    moneyline: {
      away: { novig: +130, dk: +140, fd: +135, mgm: +138 },
      home: { novig: -150, dk: -160, fd: -155, mgm: -158 }
    },
    spread: {
      away: { line: 1.5, novig: -105, dk: -115, fd: -110, mgm: -112 },
      home: { line: -1.5, novig: -115, dk: -105, fd: -110, mgm: -108 }
    },
    total: {
      line: 9.5,
      over: { novig: -110, dk: -120, fd: -115, mgm: -118 },
      under: { novig: -110, dk: -100, fd: -105, mgm: -102 }
    }
  },
  {
    id: "mlb-2024-005",
    league: "MLB",
    startsAt: "2024-03-28T23:10:00Z",
    awayTeam: { name: "Atlanta Braves", abbr: "ATL" },
    homeTeam: { name: "Philadelphia Phillies", abbr: "PHI" },
    moneyline: {
      away: { novig: -120, dk: -130, fd: -125, mgm: -128 },
      home: { novig: +100, dk: +110, fd: +105, mgm: +108 }
    },
    spread: {
      away: { line: -1.5, novig: +130, dk: +140, fd: +135, mgm: +138 },
      home: { line: 1.5, novig: -150, dk: -160, fd: -155, mgm: -158 }
    },
    total: {
      line: 8.0,
      over: { novig: -105, dk: -115, fd: -110, mgm: -112 },
      under: { novig: -115, dk: -105, fd: -110, mgm: -108 }
    }
  }
];
