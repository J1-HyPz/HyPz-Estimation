export type Sport = 'nba' | 'nfl' | 'mlb' | 'football';

export type GameStatus =
  | 'scheduled'
  | 'live'
  | 'completed'
  | 'postponed'
  | 'cancelled';

export interface TeamReference {
  id: string;
  name: string;
  shortName: string;
  abbreviation: string;
  colour: string;
}

export interface Game {
  id: string;
  sport: Sport;
  league: string;
  competition: string;
  startTime: string;
  status: GameStatus;
  homeTeam: TeamReference;
  awayTeam: TeamReference;
  homeScore?: number;
  awayScore?: number;
  period?: string;
  clock?: string;
  venue: string;
  location: string;
  summary?: string;
  stats?: Array<{
    label: string;
    home: string;
    away: string;
  }>;
}

export interface StandingRow {
  position: number;
  team: TeamReference;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  difference: number;
  points: number;
  form: Array<'W' | 'D' | 'L'>;
}

export interface LeagueTable {
  id: string;
  sport: Sport;
  league: string;
  season: string;
  updatedAt: string;
  rows: StandingRow[];
}
