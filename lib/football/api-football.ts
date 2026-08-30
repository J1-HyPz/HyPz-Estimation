import {
  getCompetition,
  getCompetitionByApiId,
} from '@/lib/football/competitions';
import { mockGames, mockLeagueTables } from '@/mock/sports';
import type {
  FootballCompetitionId,
  FootballDataResponse,
  Game,
  GameStatus,
  LeagueTable,
  MatchEvent,
  MatchStatistic,
  PlayerPerformance,
  PlayerReference,
  StandingRow,
  TeamLineup,
  TeamReference,
} from '@/types/sports';

const API_BASE_URL = 'https://v3.football.api-sports.io';
const FIXTURE_CACHE_MS = 5 * 60 * 1000;
const STANDINGS_CACHE_MS = 60 * 60 * 1000;

interface ApiTeam {
  id: number;
  name: string;
  logo?: string;
}

interface ApiFixture {
  fixture: {
    id: number;
    date: string;
    status: { short: string; long: string; elapsed?: number | null };
    venue?: { name?: string | null; city?: string | null };
  };
  league: { id: number; name: string; round?: string };
  teams: { home: ApiTeam; away: ApiTeam };
  goals: { home?: number | null; away?: number | null };
}

interface ApiEnvelope<T> {
  response: T;
  errors?: Record<string, string> | string[];
}

interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getApiKey() {
  return process.env.API_FOOTBALL_KEY ?? process.env.APISPORTS_FOOTBALL_KEY;
}

function seasonFor(date: Date) {
  return date.getUTCMonth() >= 6
    ? date.getUTCFullYear()
    : date.getUTCFullYear() - 1;
}

function teamColour(id: number) {
  const colours = ['#2563eb', '#7c3aed', '#dc2626', '#0891b2', '#16a34a'];
  return colours[Math.abs(id) % colours.length];
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

function mapTeam(value: ApiTeam): TeamReference {
  return {
    id: String(value.id),
    name: value.name,
    shortName: value.name,
    abbreviation: initials(value.name),
    colour: teamColour(value.id),
    logoUrl: value.logo,
  };
}

function mapStatus(short: string): GameStatus {
  if (['1H', 'HT', '2H', 'ET', 'BT', 'P', 'LIVE', 'INT'].includes(short)) {
    return 'live';
  }
  if (['FT', 'AET', 'PEN'].includes(short)) return 'completed';
  if (['PST', 'SUSP'].includes(short)) return 'postponed';
  if (['CANC', 'ABD', 'AWD', 'WO'].includes(short)) return 'cancelled';
  return 'scheduled';
}

function mapFixture(value: ApiFixture): Game | null {
  const competition = getCompetitionByApiId(value.league.id);
  if (!competition) return null;

  const status = mapStatus(value.fixture.status.short);
  return {
    id: `api-${value.fixture.id}`,
    providerId: value.fixture.id,
    sport: 'football',
    leagueId: competition.id,
    league: competition.name,
    competition: value.league.round ?? value.league.name,
    startTime: value.fixture.date,
    status,
    homeTeam: mapTeam(value.teams.home),
    awayTeam: mapTeam(value.teams.away),
    homeScore: value.goals.home ?? undefined,
    awayScore: value.goals.away ?? undefined,
    period: status === 'live' ? value.fixture.status.long : undefined,
    clock:
      status === 'live' && value.fixture.status.elapsed != null
        ? `${value.fixture.status.elapsed}'`
        : undefined,
    venue: value.fixture.venue?.name ?? 'Venue to be confirmed',
    location: value.fixture.venue?.city ?? competition.country,
    summary:
      status === 'scheduled'
        ? `${value.teams.home.name} host ${value.teams.away.name} in ${competition.name}.`
        : undefined,
    dataSource: 'api-football',
    lastUpdated: new Date().toISOString(),
  };
}

async function apiGet<T>(path: string): Promise<T> {
  const key = getApiKey();
  if (!key) throw new Error('API_FOOTBALL_KEY is not configured');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'x-apisports-key': key },
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`API-Football returned ${response.status}`);
  }

  const body = (await response.json()) as ApiEnvelope<T>;
  if (
    body.errors &&
    (Array.isArray(body.errors)
      ? body.errors.length > 0
      : Object.keys(body.errors).length > 0)
  ) {
    throw new Error('API-Football returned a provider error');
  }
  return body.response;
}

function getCached<T>(key: string) {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry || entry.expiresAt <= Date.now()) return undefined;
  return entry.value;
}

function setCached<T>(key: string, value: T, ttl: number) {
  cache.set(key, { expiresAt: Date.now() + ttl, value });
}

export async function getFootballFixtures({
  from,
  to,
  competitionIds,
}: {
  from: string;
  to: string;
  competitionIds: FootballCompetitionId[];
}): Promise<FootballDataResponse<Game[]>> {
  const updatedAt = new Date().toISOString();
  const selected = competitionIds
    .map((id) => getCompetition(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (!getApiKey()) {
    return {
      data: filterFallbackGames(from, to, competitionIds),
      source: 'demo',
      updatedAt,
      message: 'Add API_FOOTBALL_KEY to switch this schedule to live data.',
    };
  }

  const cacheKey = `fixtures:${from}:${to}:${competitionIds.join(',')}`;
  const cached = getCached<Game[]>(cacheKey);
  if (cached) {
    return { data: cached, source: 'api-football', updatedAt };
  }

  try {
    const season = seasonFor(new Date(`${from}T00:00:00Z`));
    const responses = await Promise.all(
      selected.map((competition) =>
        apiGet<ApiFixture[]>(
          `/fixtures?league=${competition.apiLeagueId}&season=${season}&from=${from}&to=${to}&timezone=UTC`,
        ),
      ),
    );
    const games = responses
      .flat()
      .map(mapFixture)
      .filter((game): game is Game => Boolean(game))
      .sort(
        (left, right) =>
          new Date(left.startTime).getTime() -
          new Date(right.startTime).getTime(),
      );
    setCached(cacheKey, games, FIXTURE_CACHE_MS);
    return { data: games, source: 'api-football', updatedAt };
  } catch {
    return {
      data: filterFallbackGames(from, to, competitionIds),
      source: 'demo',
      updatedAt,
      message:
        'The live provider was unavailable, so demo data is being shown.',
    };
  }
}

function filterFallbackGames(
  from: string,
  to: string,
  competitionIds: FootballCompetitionId[],
) {
  const start = new Date(`${from}T00:00:00`).getTime();
  const end = new Date(`${to}T23:59:59`).getTime();
  return mockGames.filter((game) => {
    const time = new Date(game.startTime).getTime();
    return (
      time >= start && time <= end && competitionIds.includes(game.leagueId)
    );
  });
}

interface ApiStanding {
  rank: number;
  team: ApiTeam;
  points: number;
  goalsDiff: number;
  form?: string | null;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
  };
}

interface ApiStandingsResponse {
  league: {
    id: number;
    name: string;
    season: number;
    standings: ApiStanding[][];
  };
}

export async function getFootballStandings(
  competitionId: FootballCompetitionId,
): Promise<FootballDataResponse<LeagueTable>> {
  const competition = getCompetition(competitionId);
  const fallback = mockLeagueTables[competitionId];
  const updatedAt = new Date().toISOString();

  if (!competition || !getApiKey()) {
    return {
      data: fallback,
      source: 'demo',
      updatedAt,
      message: 'Add API_FOOTBALL_KEY to load official current standings.',
    };
  }

  const season = seasonFor(new Date());
  const cacheKey = `standings:${competitionId}:${season}`;
  const cached = getCached<LeagueTable>(cacheKey);
  if (cached) {
    return { data: cached, source: 'api-football', updatedAt };
  }

  try {
    const response = await apiGet<ApiStandingsResponse[]>(
      `/standings?league=${competition.apiLeagueId}&season=${season}`,
    );
    const providerTable = response[0]?.league;
    const rows = providerTable?.standings[0] ?? [];
    const table: LeagueTable = {
      id: `${competitionId}-${season}`,
      sport: 'football',
      leagueId: competitionId,
      league: competition.name,
      season: `${season}/${String(season + 1).slice(-2)}`,
      updatedAt,
      dataSource: 'api-football',
      rows: rows.map(mapStanding),
    };
    setCached(cacheKey, table, STANDINGS_CACHE_MS);
    return { data: table, source: 'api-football', updatedAt };
  } catch {
    return {
      data: fallback,
      source: 'demo',
      updatedAt,
      message:
        'The live provider was unavailable, so demo standings are shown.',
    };
  }
}

function mapStanding(row: ApiStanding): StandingRow {
  const form = (row.form ?? '')
    .split('')
    .filter((result): result is 'W' | 'D' | 'L' =>
      ['W', 'D', 'L'].includes(result),
    )
    .slice(-5);
  return {
    position: row.rank,
    team: mapTeam(row.team),
    played: row.all.played,
    won: row.all.win,
    drawn: row.all.draw,
    lost: row.all.lose,
    difference: row.goalsDiff,
    points: row.points,
    form,
  };
}

interface ApiEvent {
  time: { elapsed?: number | null; extra?: number | null };
  team: ApiTeam;
  player?: { name?: string | null };
  assist?: { name?: string | null };
  type: string;
  detail: string;
}

interface ApiStatisticBlock {
  team: ApiTeam;
  statistics: Array<{ type: string; value: string | number | null }>;
}

interface ApiLineupBlock {
  team: ApiTeam;
  formation?: string;
  coach?: { name?: string };
  startXI: Array<{
    player: { id: number; name: string; number?: number; pos?: string };
  }>;
  substitutes: Array<{
    player: { id: number; name: string; number?: number; pos?: string };
  }>;
}

interface ApiPlayerBlock {
  team: ApiTeam;
  players: Array<{
    player: { id: number; name: string; photo?: string };
    statistics: Array<{
      games?: {
        minutes?: number | null;
        number?: number;
        position?: string;
        rating?: string | null;
      };
      goals?: { total?: number | null; assists?: number | null };
      shots?: { total?: number | null };
      passes?: { total?: number | null };
      tackles?: { total?: number | null };
    }>;
  }>;
}

export async function getApiFootballMatch(
  providerId: number,
): Promise<Game | undefined> {
  if (!getApiKey()) return undefined;

  try {
    const [fixtures, events, statistics, lineups, players] = await Promise.all([
      apiGet<ApiFixture[]>(`/fixtures?id=${providerId}`),
      apiGet<ApiEvent[]>(`/fixtures/events?fixture=${providerId}`),
      apiGet<ApiStatisticBlock[]>(`/fixtures/statistics?fixture=${providerId}`),
      apiGet<ApiLineupBlock[]>(`/fixtures/lineups?fixture=${providerId}`),
      apiGet<ApiPlayerBlock[]>(`/fixtures/players?fixture=${providerId}`),
    ]);
    const game = fixtures[0] ? mapFixture(fixtures[0]) : null;
    if (!game) return undefined;
    return {
      ...game,
      events: mapEvents(events),
      stats: mapStatistics(statistics, game),
      lineups: mapLineups(lineups),
      players: mapPlayers(players),
    };
  } catch {
    return undefined;
  }
}

function mapEvents(events: ApiEvent[]): MatchEvent[] {
  return events.map((event, index) => ({
    id: `api-event-${index}`,
    minute: `${event.time.elapsed ?? 0}${event.time.extra ? `+${event.time.extra}` : ''}'`,
    type:
      event.type === 'Goal'
        ? 'goal'
        : event.type === 'Card'
          ? 'card'
          : event.type === 'subst'
            ? 'substitution'
            : event.type === 'Var'
              ? 'var'
              : 'other',
    teamId: String(event.team.id),
    player: event.player?.name ?? undefined,
    assist: event.assist?.name ?? undefined,
    detail: event.detail,
  }));
}

function displayValue(value: string | number | null) {
  return value == null ? '—' : String(value);
}

function mapStatistics(
  blocks: ApiStatisticBlock[],
  game: Game,
): MatchStatistic[] {
  const wanted = [
    'Ball Possession',
    'Total Shots',
    'Shots on Goal',
    'Corner Kicks',
    'Fouls',
    'Yellow Cards',
    'Red Cards',
    'expected_goals',
  ];
  const home = blocks.find(
    (block) => String(block.team.id) === game.homeTeam.id,
  );
  const away = blocks.find(
    (block) => String(block.team.id) === game.awayTeam.id,
  );
  return wanted
    .map((label) => {
      const homeValue =
        home?.statistics.find((stat) => stat.type === label)?.value ?? null;
      const awayValue =
        away?.statistics.find((stat) => stat.type === label)?.value ?? null;
      if (homeValue == null && awayValue == null) return null;
      return {
        label: label === 'expected_goals' ? 'Expected goals' : label,
        home: displayValue(homeValue),
        away: displayValue(awayValue),
      };
    })
    .filter((stat): stat is MatchStatistic => Boolean(stat));
}

function mapPlayer(value: {
  id: number;
  name: string;
  number?: number;
  pos?: string;
}): PlayerReference {
  return {
    id: String(value.id),
    name: value.name,
    number: value.number,
    position: value.pos,
  };
}

function mapLineups(lineups: ApiLineupBlock[]): TeamLineup[] {
  return lineups.map((lineup) => ({
    team: mapTeam(lineup.team),
    formation: lineup.formation,
    coach: lineup.coach?.name,
    starters: lineup.startXI.map((item) => mapPlayer(item.player)),
    substitutes: lineup.substitutes.map((item) => mapPlayer(item.player)),
  }));
}

function mapPlayers(blocks: ApiPlayerBlock[]): PlayerPerformance[] {
  return blocks.flatMap((block) =>
    block.players
      .map((item) => {
        const stat = item.statistics[0];
        return {
          player: {
            id: String(item.player.id),
            name: item.player.name,
            number: stat?.games?.number,
            position: stat?.games?.position,
            photoUrl: item.player.photo,
          },
          teamId: String(block.team.id),
          rating: stat?.games?.rating ?? undefined,
          minutes: stat?.games?.minutes ?? undefined,
          goals: stat?.goals?.total ?? undefined,
          assists: stat?.goals?.assists ?? undefined,
          shots: stat?.shots?.total ?? undefined,
          passes: stat?.passes?.total ?? undefined,
          tackles: stat?.tackles?.total ?? undefined,
        } satisfies PlayerPerformance;
      })
      .filter((item) => item.minutes != null || item.rating != null),
  );
}
