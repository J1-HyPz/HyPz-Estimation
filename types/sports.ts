export type Sport = 'football' | 'nba' | 'nfl' | 'mlb';

export type FootballCompetitionId =
  | 'premier-league'
  | 'la-liga'
  | 'serie-a'
  | 'bundesliga'
  | 'ligue-1'
  | 'champions-league';

export type GameStatus =
  | 'scheduled'
  | 'live'
  | 'completed'
  | 'postponed'
  | 'cancelled';

export type DataSource = 'demo' | 'api-football';

export interface TeamReference {
  id: string;
  name: string;
  shortName: string;
  abbreviation: string;
  colour: string;
  logoUrl?: string;
}

export interface MatchStatistic {
  label: string;
  home: string;
  away: string;
}

export interface PlayerReference {
  id: string;
  name: string;
  number?: number;
  position?: string;
  photoUrl?: string;
}

export interface MatchEvent {
  id: string;
  minute: string;
  type: 'goal' | 'card' | 'substitution' | 'var' | 'other';
  teamId?: string;
  player?: string;
  assist?: string;
  detail: string;
}

export interface TeamLineup {
  team: TeamReference;
  formation?: string;
  coach?: string;
  starters: PlayerReference[];
  substitutes: PlayerReference[];
}

export interface PlayerPerformance {
  player: PlayerReference;
  teamId: string;
  rating?: string;
  minutes?: number;
  goals?: number;
  assists?: number;
  shots?: number;
  passes?: number;
  tackles?: number;
}

export interface Game {
  id: string;
  providerId?: number;
  sport: Sport;
  leagueId: FootballCompetitionId;
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
  stats?: MatchStatistic[];
  events?: MatchEvent[];
  lineups?: TeamLineup[];
  players?: PlayerPerformance[];
  dataSource: DataSource;
  lastUpdated: string;
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
  leagueId: FootballCompetitionId;
  league: string;
  season: string;
  updatedAt: string;
  dataSource: DataSource;
  rows: StandingRow[];
}

export interface FootballDataResponse<T> {
  data: T;
  source: DataSource;
  updatedAt: string;
  message?: string;
}
