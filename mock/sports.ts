import type {
  FootballCompetitionId,
  Game,
  LeagueTable,
  PlayerReference,
  StandingRow,
  TeamLineup,
  TeamReference,
} from '@/types/sports';

const team = (
  id: string,
  name: string,
  shortName: string,
  abbreviation: string,
  colour: string,
): TeamReference => ({ id, name, shortName, abbreviation, colour });

const teams = {
  arsenal: team('ars', 'Arsenal', 'Arsenal', 'ARS', '#ef3d45'),
  chelsea: team('che', 'Chelsea', 'Chelsea', 'CHE', '#2563eb'),
  liverpool: team('liv', 'Liverpool', 'Liverpool', 'LIV', '#c81d35'),
  city: team('mci', 'Manchester City', 'Man City', 'MCI', '#6cabdd'),
  real: team('rma', 'Real Madrid', 'Real Madrid', 'RMA', '#7c8db5'),
  barcelona: team('bar', 'FC Barcelona', 'Barcelona', 'BAR', '#a91d3a'),
  atletico: team('atm', 'Atlético de Madrid', 'Atlético', 'ATM', '#d61f2c'),
  inter: team('int', 'Inter Milan', 'Inter', 'INT', '#1266c4'),
  juventus: team('juv', 'Juventus', 'Juventus', 'JUV', '#42464d'),
  milan: team('acm', 'AC Milan', 'AC Milan', 'ACM', '#c8262d'),
  bayern: team('bay', 'Bayern Munich', 'Bayern', 'BAY', '#dc1538'),
  dortmund: team('bvb', 'Borussia Dortmund', 'Dortmund', 'BVB', '#d9b600'),
  leverkusen: team('b04', 'Bayer Leverkusen', 'Leverkusen', 'B04', '#e32221'),
  psg: team('psg', 'Paris Saint-Germain', 'PSG', 'PSG', '#1b3f8b'),
  marseille: team('om', 'Olympique Marseille', 'Marseille', 'OM', '#149ed9'),
  monaco: team('asm', 'AS Monaco', 'Monaco', 'ASM', '#d92332'),
};

function atDay(dayOffset: number, hour: number, minute = 0) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString();
}

const player = (
  id: string,
  name: string,
  number: number,
  position: string,
): PlayerReference => ({ id, name, number, position });

const arsenalLineup: TeamLineup = {
  team: teams.arsenal,
  formation: '4-3-3',
  coach: 'Mikel Arteta',
  starters: [
    player('ars-1', 'David Raya', 22, 'Goalkeeper'),
    player('ars-2', 'Ben White', 4, 'Defender'),
    player('ars-3', 'William Saliba', 2, 'Defender'),
    player('ars-4', 'Gabriel Magalhães', 6, 'Defender'),
    player('ars-5', 'Jurrien Timber', 12, 'Defender'),
    player('ars-6', 'Martin Ødegaard', 8, 'Midfielder'),
    player('ars-7', 'Declan Rice', 41, 'Midfielder'),
    player('ars-8', 'Mikel Merino', 23, 'Midfielder'),
    player('ars-9', 'Bukayo Saka', 7, 'Forward'),
    player('ars-10', 'Kai Havertz', 29, 'Forward'),
    player('ars-11', 'Gabriel Martinelli', 11, 'Forward'),
  ],
  substitutes: [
    player('ars-12', 'Neto', 32, 'Goalkeeper'),
    player('ars-13', 'Riccardo Calafiori', 33, 'Defender'),
    player('ars-14', 'Leandro Trossard', 19, 'Forward'),
    player('ars-15', 'Ethan Nwaneri', 53, 'Midfielder'),
  ],
};

const chelseaLineup: TeamLineup = {
  team: teams.chelsea,
  formation: '4-2-3-1',
  coach: 'Enzo Maresca',
  starters: [
    player('che-1', 'Robert Sánchez', 1, 'Goalkeeper'),
    player('che-2', 'Malo Gusto', 27, 'Defender'),
    player('che-3', 'Wesley Fofana', 29, 'Defender'),
    player('che-4', 'Levi Colwill', 6, 'Defender'),
    player('che-5', 'Marc Cucurella', 3, 'Defender'),
    player('che-6', 'Moisés Caicedo', 25, 'Midfielder'),
    player('che-7', 'Enzo Fernández', 8, 'Midfielder'),
    player('che-8', 'Noni Madueke', 11, 'Midfielder'),
    player('che-9', 'Cole Palmer', 20, 'Midfielder'),
    player('che-10', 'Pedro Neto', 7, 'Midfielder'),
    player('che-11', 'Nicolas Jackson', 15, 'Forward'),
  ],
  substitutes: [
    player('che-12', 'Filip Jørgensen', 12, 'Goalkeeper'),
    player('che-13', 'Tosin Adarabioyo', 4, 'Defender'),
    player('che-14', 'Romeo Lavia', 45, 'Midfielder'),
    player('che-15', 'Christopher Nkunku', 18, 'Forward'),
  ],
};

const updatedAt = new Date().toISOString();

export const mockGames: Game[] = [
  {
    id: 'demo-arsenal-chelsea',
    sport: 'football',
    leagueId: 'premier-league',
    league: 'Premier League',
    competition: 'Matchweek 3',
    startTime: atDay(0, 16, 30),
    status: 'live',
    homeTeam: teams.arsenal,
    awayTeam: teams.chelsea,
    homeScore: 2,
    awayScore: 1,
    period: 'Second half',
    clock: "67'",
    venue: 'Emirates Stadium',
    location: 'London, England',
    summary:
      'Arsenal lead after turning sustained second-half pressure into a decisive goal. Chelsea remain dangerous when they break through midfield.',
    stats: [
      { label: 'Possession', home: '58%', away: '42%' },
      { label: 'Total shots', home: '13', away: '8' },
      { label: 'Shots on target', home: '6', away: '4' },
      { label: 'Corners', home: '7', away: '3' },
      { label: 'Fouls', home: '9', away: '11' },
      { label: 'Expected goals', home: '1.82', away: '0.91' },
    ],
    events: [
      {
        id: 'event-1',
        minute: "18'",
        type: 'goal',
        teamId: teams.arsenal.id,
        player: 'Bukayo Saka',
        assist: 'Martin Ødegaard',
        detail: 'Left-footed finish from the right side of the box',
      },
      {
        id: 'event-2',
        minute: "34'",
        type: 'card',
        teamId: teams.chelsea.id,
        player: 'Moisés Caicedo',
        detail: 'Yellow card',
      },
      {
        id: 'event-3',
        minute: "49'",
        type: 'goal',
        teamId: teams.chelsea.id,
        player: 'Cole Palmer',
        assist: 'Nicolas Jackson',
        detail: 'Low finish into the bottom corner',
      },
      {
        id: 'event-4',
        minute: "63'",
        type: 'goal',
        teamId: teams.arsenal.id,
        player: 'Kai Havertz',
        assist: 'Declan Rice',
        detail: 'Header from the centre of the penalty area',
      },
    ],
    lineups: [arsenalLineup, chelseaLineup],
    players: [
      {
        player: arsenalLineup.starters[8],
        teamId: teams.arsenal.id,
        rating: '8.2',
        minutes: 67,
        goals: 1,
        assists: 0,
        shots: 3,
        passes: 31,
        tackles: 2,
      },
      {
        player: arsenalLineup.starters[6],
        teamId: teams.arsenal.id,
        rating: '7.8',
        minutes: 67,
        goals: 0,
        assists: 1,
        shots: 1,
        passes: 48,
        tackles: 4,
      },
      {
        player: chelseaLineup.starters[8],
        teamId: teams.chelsea.id,
        rating: '7.7',
        minutes: 67,
        goals: 1,
        assists: 0,
        shots: 2,
        passes: 34,
        tackles: 1,
      },
    ],
    dataSource: 'demo',
    lastUpdated: updatedAt,
  },
  {
    id: 'demo-real-barcelona',
    sport: 'football',
    leagueId: 'la-liga',
    league: 'LaLiga',
    competition: 'Matchday 3',
    startTime: atDay(0, 20, 0),
    status: 'scheduled',
    homeTeam: teams.real,
    awayTeam: teams.barcelona,
    venue: 'Santiago Bernabéu',
    location: 'Madrid, Spain',
    summary:
      'Two title contenders meet in Madrid in the first Clásico of the league campaign.',
    stats: [],
    events: [],
    dataSource: 'demo',
    lastUpdated: updatedAt,
  },
  {
    id: 'demo-inter-juventus',
    sport: 'football',
    leagueId: 'serie-a',
    league: 'Serie A',
    competition: 'Giornata 3',
    startTime: atDay(1, 19, 45),
    status: 'scheduled',
    homeTeam: teams.inter,
    awayTeam: teams.juventus,
    venue: 'San Siro',
    location: 'Milan, Italy',
    summary: 'The Derby d’Italia returns to San Siro under the lights.',
    dataSource: 'demo',
    lastUpdated: updatedAt,
  },
  {
    id: 'demo-bayern-dortmund',
    sport: 'football',
    leagueId: 'bundesliga',
    league: 'Bundesliga',
    competition: 'Matchday 2',
    startTime: atDay(2, 17, 30),
    status: 'scheduled',
    homeTeam: teams.bayern,
    awayTeam: teams.dortmund,
    venue: 'Allianz Arena',
    location: 'Munich, Germany',
    summary: 'Der Klassiker headlines the Bundesliga schedule in Munich.',
    dataSource: 'demo',
    lastUpdated: updatedAt,
  },
  {
    id: 'demo-psg-marseille',
    sport: 'football',
    leagueId: 'ligue-1',
    league: 'Ligue 1',
    competition: 'Matchday 4',
    startTime: atDay(3, 19, 45),
    status: 'scheduled',
    homeTeam: teams.psg,
    awayTeam: teams.marseille,
    venue: 'Parc des Princes',
    location: 'Paris, France',
    summary:
      'Le Classique brings Marseille to the capital for a night fixture.',
    dataSource: 'demo',
    lastUpdated: updatedAt,
  },
  {
    id: 'demo-real-bayern',
    sport: 'football',
    leagueId: 'champions-league',
    league: 'UEFA Champions League',
    competition: 'League phase',
    startTime: atDay(4, 20, 0),
    status: 'scheduled',
    homeTeam: teams.real,
    awayTeam: teams.bayern,
    venue: 'Santiago Bernabéu',
    location: 'Madrid, Spain',
    summary:
      'Two European heavyweights meet in the Champions League league phase.',
    dataSource: 'demo',
    lastUpdated: updatedAt,
  },
  {
    id: 'demo-liverpool-city',
    sport: 'football',
    leagueId: 'premier-league',
    league: 'Premier League',
    competition: 'Matchweek 4',
    startTime: atDay(5, 16, 30),
    status: 'scheduled',
    homeTeam: teams.liverpool,
    awayTeam: teams.city,
    venue: 'Anfield',
    location: 'Liverpool, England',
    summary: 'A title-race fixture at Anfield anchors the weekend schedule.',
    dataSource: 'demo',
    lastUpdated: updatedAt,
  },
  {
    id: 'demo-milan-inter',
    sport: 'football',
    leagueId: 'serie-a',
    league: 'Serie A',
    competition: 'Giornata 4',
    startTime: atDay(6, 19, 45),
    status: 'scheduled',
    homeTeam: teams.milan,
    awayTeam: teams.inter,
    venue: 'San Siro',
    location: 'Milan, Italy',
    summary: 'The Derby della Madonnina closes the Serie A weekend.',
    dataSource: 'demo',
    lastUpdated: updatedAt,
  },
  {
    id: 'demo-monaco-psg',
    sport: 'football',
    leagueId: 'ligue-1',
    league: 'Ligue 1',
    competition: 'Matchday 5',
    startTime: atDay(7, 20, 0),
    status: 'scheduled',
    homeTeam: teams.monaco,
    awayTeam: teams.psg,
    venue: 'Stade Louis II',
    location: 'Monaco',
    summary:
      'Monaco welcome the champions for the final match in this eight-day view.',
    dataSource: 'demo',
    lastUpdated: updatedAt,
  },
];

function standing(
  position: number,
  club: TeamReference,
  points: number,
  difference: number,
  form: StandingRow['form'],
): StandingRow {
  return {
    position,
    team: club,
    played: 3,
    won: Math.floor(points / 3),
    drawn: points % 3,
    lost: Math.max(0, 3 - Math.floor(points / 3) - (points % 3)),
    difference,
    points,
    form,
  };
}

function table(
  leagueId: FootballCompetitionId,
  league: string,
  rows: StandingRow[],
): LeagueTable {
  return {
    id: `${leagueId}-demo`,
    sport: 'football',
    leagueId,
    league,
    season: '2026/27',
    updatedAt,
    dataSource: 'demo',
    rows,
  };
}

export const mockLeagueTables: Record<FootballCompetitionId, LeagueTable> = {
  'premier-league': table('premier-league', 'Premier League', [
    standing(1, teams.arsenal, 9, 7, ['W', 'W', 'W']),
    standing(2, teams.liverpool, 7, 5, ['W', 'W', 'D']),
    standing(3, teams.city, 6, 4, ['W', 'L', 'W']),
    standing(4, teams.chelsea, 4, 1, ['W', 'D', 'L']),
  ]),
  'la-liga': table('la-liga', 'LaLiga', [
    standing(1, teams.real, 9, 6, ['W', 'W', 'W']),
    standing(2, teams.barcelona, 7, 5, ['W', 'D', 'W']),
    standing(3, teams.atletico, 6, 3, ['W', 'W', 'L']),
  ]),
  'serie-a': table('serie-a', 'Serie A', [
    standing(1, teams.inter, 9, 7, ['W', 'W', 'W']),
    standing(2, teams.juventus, 7, 4, ['W', 'D', 'W']),
    standing(3, teams.milan, 6, 3, ['L', 'W', 'W']),
  ]),
  bundesliga: table('bundesliga', 'Bundesliga', [
    standing(1, teams.bayern, 9, 8, ['W', 'W', 'W']),
    standing(2, teams.leverkusen, 7, 4, ['W', 'D', 'W']),
    standing(3, teams.dortmund, 6, 3, ['W', 'L', 'W']),
  ]),
  'ligue-1': table('ligue-1', 'Ligue 1', [
    standing(1, teams.psg, 9, 9, ['W', 'W', 'W']),
    standing(2, teams.monaco, 7, 5, ['W', 'W', 'D']),
    standing(3, teams.marseille, 6, 3, ['L', 'W', 'W']),
  ]),
  'champions-league': table('champions-league', 'UEFA Champions League', [
    standing(1, teams.real, 6, 5, ['W', 'W']),
    standing(2, teams.bayern, 6, 4, ['W', 'W']),
    standing(3, teams.inter, 4, 2, ['W', 'D']),
    standing(4, teams.psg, 3, 1, ['W', 'L']),
  ]),
};

export const premierLeagueTable = mockLeagueTables['premier-league'];

export function getMockGame(id: string) {
  return mockGames.find((game) => game.id === id);
}
