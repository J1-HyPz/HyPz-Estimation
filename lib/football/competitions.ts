import type { FootballCompetitionId, Sport } from '@/types/sports';

export interface FootballCompetition {
  id: FootballCompetitionId;
  name: string;
  shortName: string;
  country: string;
  apiLeagueId: number;
  accent: string;
}

export const footballCompetitions: FootballCompetition[] = [
  {
    id: 'premier-league',
    name: 'Premier League',
    shortName: 'Premier League',
    country: 'England',
    apiLeagueId: 39,
    accent: '#8b5cf6',
  },
  {
    id: 'la-liga',
    name: 'LaLiga',
    shortName: 'LaLiga',
    country: 'Spain',
    apiLeagueId: 140,
    accent: '#f97316',
  },
  {
    id: 'serie-a',
    name: 'Serie A',
    shortName: 'Serie A',
    country: 'Italy',
    apiLeagueId: 135,
    accent: '#38bdf8',
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    shortName: 'Bundesliga',
    country: 'Germany',
    apiLeagueId: 78,
    accent: '#ef4444',
  },
  {
    id: 'ligue-1',
    name: 'Ligue 1',
    shortName: 'Ligue 1',
    country: 'France',
    apiLeagueId: 61,
    accent: '#22c55e',
  },
  {
    id: 'champions-league',
    name: 'UEFA Champions League',
    shortName: 'Champions League',
    country: 'Europe',
    apiLeagueId: 2,
    accent: '#3b82f6',
  },
];

export const futureSports: Array<{
  id: Exclude<Sport, 'football'>;
  name: string;
  description: string;
}> = [
  { id: 'nba', name: 'NBA', description: 'Basketball' },
  { id: 'nfl', name: 'NFL', description: 'American football' },
  { id: 'mlb', name: 'MLB', description: 'Baseball' },
];

export function getCompetition(id: string) {
  return footballCompetitions.find((competition) => competition.id === id);
}

export function getCompetitionByApiId(apiLeagueId: number) {
  return footballCompetitions.find(
    (competition) => competition.apiLeagueId === apiLeagueId,
  );
}
