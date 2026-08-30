'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Bookmark,
  CalendarDays,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  MapPin,
  Menu,
  RadioTower,
  Search,
  Settings,
  SlidersHorizontal,
  Star,
  Trophy,
  UserRound,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockGames, premierLeagueTable } from '@/mock/sports';
import { useSavedGames } from '@/hooks/use-saved-games';
import type { Game, GameStatus, Sport, TeamReference } from '@/types/sports';

const sports: Array<{ id: Sport; label: string }> = [
  { id: 'football', label: 'Football' },
  { id: 'nba', label: 'NBA' },
  { id: 'nfl', label: 'NFL' },
  { id: 'mlb', label: 'MLB' },
];

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true, href: '/' },
  { label: 'Schedule', icon: CalendarDays, href: '/' },
  { label: 'Live scores', icon: RadioTower, href: '/' },
  { label: 'Standings', icon: Trophy, href: '/standings' },
  { label: 'Saved games', icon: Bookmark, href: '/saved' },
];

const statusStyles: Record<GameStatus, string> = {
  live: 'border-red-400/20 bg-red-400/10 text-red-300',
  completed: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
  scheduled: 'border-blue-400/20 bg-blue-400/10 text-blue-300',
  postponed: 'border-orange-400/20 bg-orange-400/10 text-orange-300',
  cancelled: 'border-zinc-400/20 bg-zinc-400/10 text-zinc-300',
};

const sportLabels: Record<Sport, string> = {
  football: 'Football',
  nba: 'NBA',
  nfl: 'NFL',
  mlb: 'MLB',
};

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function dayOffset(iso: string) {
  return Math.round(
    (startOfDay(new Date(iso)).getTime() - startOfDay(new Date()).getTime()) /
      86_400_000,
  );
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));
}

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function TeamMark({
  team,
  size = 'md',
}: {
  team: TeamReference;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = {
    sm: 'size-7 text-[9px]',
    md: 'size-9 text-[10px]',
    lg: 'size-12 text-xs',
  };

  return (
    <span
      aria-hidden="true"
      className={`${sizes[size]} inline-flex shrink-0 items-center justify-center rounded-xl border border-white/10 font-bold tracking-tight text-white shadow-[inset_0_1px_0_rgb(255_255_255/16%)]`}
      style={{ backgroundColor: team.colour }}
    >
      {team.abbreviation}
    </span>
  );
}

function StatusBadge({ game }: { game: Game }) {
  const label =
    game.status === 'scheduled'
      ? formatTime(game.startTime)
      : game.status === 'completed'
        ? 'Final'
        : game.status;

  return (
    <Badge
      variant="outline"
      className={`h-6 border px-2 text-[10px] font-bold uppercase tracking-[0.1em] ${statusStyles[game.status]}`}
    >
      {game.status === 'live' && (
        <span className="size-1.5 animate-pulse rounded-full bg-red-400" />
      )}
      {label}
    </Badge>
  );
}

function GameCard({
  game,
  selected,
  onSelect,
}: {
  game: Game;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`group w-full rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        selected
          ? 'border-primary/50 bg-primary/[0.08] shadow-[0_18px_50px_rgb(18_83_255/8%)]'
          : 'border-white/[0.07] bg-white/[0.025] hover:border-white/[0.14] hover:bg-white/[0.045]'
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <span className="text-foreground/85">{sportLabels[game.sport]}</span>
          <span className="text-white/20">/</span>
          <span className="truncate">{game.league}</span>
        </div>
        <StatusBadge game={game} />
      </div>

      <div className="space-y-3">
        {[game.awayTeam, game.homeTeam].map((team, index) => {
          const score = index === 0 ? game.awayScore : game.homeScore;
          return (
            <div key={team.id} className="flex items-center gap-3">
              <TeamMark team={team} />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                {team.shortName}
              </span>
              <span className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">
                {score ?? '—'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1.5 truncate">
          <MapPin className="size-3.5" />
          <span className="truncate">{game.venue}</span>
        </span>
        <span className="ml-3 flex shrink-0 items-center gap-1.5 font-medium text-foreground/70">
          {game.status === 'live'
            ? `${game.period} · ${game.clock}`
            : game.competition}
          <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}

function GameDetail({
  game,
  saved,
  onToggleSaved,
}: {
  game: Game;
  saved: boolean;
  onToggleSaved: () => void;
}) {
  return (
    <Card className="gap-0 border border-white/[0.08] bg-card/70 py-0 shadow-[0_24px_80px_rgb(0_0_0/20%)] backdrop-blur-xl">
      <div className="border-b border-white/[0.07] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Selected game
            </p>
            <p className="mt-1 text-sm font-semibold">{game.league}</p>
          </div>
          <StatusBadge game={game} />
        </div>
      </div>

      <div className="px-5 py-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex min-w-0 flex-col items-center text-center">
            <TeamMark team={game.homeTeam} size="lg" />
            <p className="mt-2 max-w-full truncate text-sm font-semibold">
              {game.homeTeam.shortName}
            </p>
          </div>
          <div className="text-center">
            <div className="font-mono text-3xl font-semibold tracking-tight">
              {game.homeScore ?? '—'}{' '}
              <span className="text-muted-foreground">:</span>{' '}
              {game.awayScore ?? '—'}
            </div>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {game.status === 'live'
                ? `${game.period} · ${game.clock}`
                : formatTime(game.startTime)}
            </p>
          </div>
          <div className="flex min-w-0 flex-col items-center text-center">
            <TeamMark team={game.awayTeam} size="lg" />
            <p className="mt-2 max-w-full truncate text-sm font-semibold">
              {game.awayTeam.shortName}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            <MapPin className="mb-2 size-4 text-primary" />
            <p className="font-medium text-foreground">{game.venue}</p>
            <p className="mt-0.5 text-muted-foreground">{game.location}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
            <Clock3 className="mb-2 size-4 text-accent" />
            <p className="font-medium text-foreground">
              {formatTime(game.startTime)}
            </p>
            <p className="mt-0.5 text-muted-foreground">Local time</p>
          </div>
        </div>

        {game.stats && (
          <div className="mt-5 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Match stats
            </p>
            {game.stats.map((stat) => (
              <div
                key={stat.label}
                className="grid grid-cols-[1fr_auto_1fr] items-center text-xs"
              >
                <span className="font-mono font-semibold tabular-nums">
                  {stat.home}
                </span>
                <span className="px-3 text-[11px] text-muted-foreground">
                  {stat.label}
                </span>
                <span className="text-right font-mono font-semibold tabular-nums">
                  {stat.away}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="mt-5 border-t border-white/[0.06] pt-4 text-sm leading-6 text-muted-foreground">
          {game.summary}
        </p>
        <Button
          variant={saved ? 'secondary' : 'outline'}
          className="mt-5 w-full border-white/[0.08]"
          onClick={onToggleSaved}
        >
          <Bookmark
            data-icon="inline-start"
            className={saved ? 'fill-current text-primary' : ''}
          />
          {saved ? 'Saved to your games' : 'Save this game'}
        </Button>
      </div>
    </Card>
  );
}

function StandingsCard() {
  return (
    <Card className="gap-0 border border-white/[0.08] bg-card/65 py-0 backdrop-blur-xl">
      <div className="flex items-start justify-between border-b border-white/[0.07] px-4 py-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-accent" />
            <h2 className="text-sm font-semibold">Premier League</h2>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            2026/27 standings
          </p>
        </div>
        <Link
          href="/standings"
          className="inline-flex h-6 items-center gap-1 rounded-lg px-2 text-xs font-medium text-primary hover:bg-muted"
        >
          View all
          <ChevronRight className="size-3" />
        </Link>
      </div>

      <div className="px-2 py-2">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="h-8 w-8 px-2 text-[9px] uppercase tracking-wider text-muted-foreground">
                #
              </TableHead>
              <TableHead className="h-8 px-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                Club
              </TableHead>
              <TableHead className="h-8 px-1 text-center text-[9px] uppercase tracking-wider text-muted-foreground">
                P
              </TableHead>
              <TableHead className="h-8 px-2 text-right text-[9px] uppercase tracking-wider text-muted-foreground">
                Pts
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {premierLeagueTable.rows.map((row) => (
              <TableRow
                key={row.team.id}
                className="border-white/[0.05] hover:bg-white/[0.035]"
              >
                <TableCell className="w-8 px-2 py-2.5 font-mono text-xs text-muted-foreground">
                  {row.position}
                </TableCell>
                <TableCell className="px-1 py-2.5">
                  <div className="flex items-center gap-2">
                    <TeamMark team={row.team} size="sm" />
                    <span className="max-w-[112px] truncate text-xs font-semibold">
                      {row.team.shortName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-1 py-2.5 text-center font-mono text-xs text-muted-foreground">
                  {row.played}
                </TableCell>
                <TableCell className="px-2 py-2.5 text-right font-mono text-xs font-bold">
                  {row.points}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [activeSports, setActiveSports] = useState<Sport[]>(
    sports.map((sport) => sport.id),
  );
  const [selectedGameId, setSelectedGameId] = useState(mockGames[0].id);
  const [query, setQuery] = useState('');
  const { isSaved, toggleSavedGame } = useSavedGames();

  const dates = useMemo(
    () =>
      Array.from({ length: 8 }, (_, offset) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + offset);
        return date;
      }),
    [],
  );

  const visibleGames = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return mockGames.filter((game) => {
      const matchesDay = dayOffset(game.startTime) === selectedDay;
      const matchesSport = activeSports.includes(game.sport);
      const matchesQuery =
        !normalizedQuery ||
        game.homeTeam.name.toLowerCase().includes(normalizedQuery) ||
        game.awayTeam.name.toLowerCase().includes(normalizedQuery) ||
        game.league.toLowerCase().includes(normalizedQuery);
      return matchesDay && matchesSport && matchesQuery;
    });
  }, [activeSports, query, selectedDay]);

  const selectedGame =
    visibleGames.find((game) => game.id === selectedGameId) ??
    visibleGames[0] ??
    mockGames[0];

  const toggleSport = (sport: Sport) => {
    setActiveSports((current) => {
      if (current.includes(sport)) {
        const next = current.filter((item) => item !== sport);
        return next.length > 0 ? next : current;
      }
      return [...current, sport];
    });
  };

  const todayGames = mockGames.filter(
    (game) => dayOffset(game.startTime) === 0,
  );
  const liveCount = mockGames.filter((game) => game.status === 'live').length;
  const upcomingCount = mockGames.filter(
    (game) => game.status === 'scheduled',
  ).length;

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[220px] flex-col border-r border-sidebar-border bg-sidebar/92 px-4 py-5 backdrop-blur-xl lg:flex">
        <div className="flex items-center gap-3 px-2">
          <span className="grid size-9 place-items-center rounded-xl bg-primary shadow-[0_8px_30px_rgb(37_99_235/28%)]">
            <Zap className="size-5 fill-white text-white" />
          </span>
          <div>
            <p className="text-[17px] font-bold tracking-tight">GameTrack</p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Every game. One view.
            </p>
          </div>
        </div>

        <nav aria-label="Primary" className="mt-9 space-y-1">
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70">
            Workspace
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-primary/13 text-blue-200 ring-1 ring-primary/15'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              >
                <Icon
                  className={`size-[17px] ${item.active ? 'text-primary' : ''}`}
                />
                {item.label}
                {item.label === 'Live scores' && (
                  <span className="ml-auto size-1.5 animate-pulse rounded-full bg-red-400" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2">
          <Link
            href="/settings"
            className="flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <Settings className="size-[17px]" />
            Settings
          </Link>
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-xs font-bold">
              JH
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">J1 HyPz</p>
              <p className="truncate text-[10px] text-muted-foreground">
                Local time · BST
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[220px]">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.06] bg-background/85 px-4 backdrop-blur-xl sm:px-6 xl:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
          >
            <Menu />
          </Button>
          <div className="relative hidden w-full max-w-md md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search teams, games, leagues..."
              className="h-9 border-white/[0.07] bg-white/[0.035] pl-9 text-sm focus-visible:bg-white/[0.05]"
              aria-label="Search games"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge
              variant="outline"
              className="hidden h-7 border-white/[0.08] bg-white/[0.025] px-2.5 text-[10px] font-medium text-muted-foreground sm:flex"
            >
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Times in your timezone
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="relative"
            >
              <Bell />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-red-400 ring-2 ring-background" />
            </Button>
            <Button variant="secondary" size="icon" aria-label="Open profile">
              <UserRound />
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1640px] px-4 pb-24 pt-6 sm:px-6 xl:px-8 lg:pb-8">
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-300">
                <span className="size-1.5 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
                {new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(
                  new Date(),
                )}{' '}
                match centre
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
                Your games, at a glance.
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Live scores, today’s schedule and the week ahead.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:flex">
              {[
                { label: 'Live now', value: liveCount, colour: 'text-red-300' },
                {
                  label: 'Today',
                  value: todayGames.length,
                  colour: 'text-foreground',
                },
                {
                  label: 'Upcoming',
                  value: upcomingCount,
                  colour: 'text-blue-300',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="min-w-[88px] rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5"
                >
                  <p className={`font-mono text-lg font-bold ${item.colour}`}>
                    {String(item.value).padStart(2, '0')}
                  </p>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-label="Date selector"
            className="scrollbar-none mt-6 flex gap-2 overflow-x-auto pb-2"
          >
            {dates.map((date, offset) => {
              const active = offset === selectedDay;
              const count = mockGames.filter(
                (game) => dayOffset(game.startTime) === offset,
              ).length;
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => setSelectedDay(offset)}
                  aria-pressed={active}
                  className={`relative flex min-w-[78px] flex-1 flex-col items-center rounded-xl border px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    active
                      ? 'border-primary/45 bg-primary/12 text-foreground'
                      : 'border-white/[0.07] bg-white/[0.02] text-muted-foreground hover:bg-white/[0.045] hover:text-foreground'
                  }`}
                >
                  <span className="text-[9px] font-semibold uppercase tracking-[0.13em]">
                    {offset === 0
                      ? 'Today'
                      : new Intl.DateTimeFormat(undefined, {
                          weekday: 'short',
                        }).format(date)}
                  </span>
                  <span className="mt-1 font-mono text-lg font-bold">
                    {date.getDate()}
                  </span>
                  {count > 0 && (
                    <span
                      className={`absolute bottom-1 size-1 rounded-full ${active ? 'bg-primary' : 'bg-white/30'}`}
                    />
                  )}
                </button>
              );
            })}
          </section>

          <section
            className="mt-4 flex flex-wrap items-center gap-2"
            aria-label="Sport filters"
          >
            <div className="mr-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <SlidersHorizontal className="size-3.5" />
              Sports
            </div>
            <Button
              variant={
                activeSports.length === sports.length ? 'default' : 'outline'
              }
              size="sm"
              onClick={() => setActiveSports(sports.map((sport) => sport.id))}
              className={
                activeSports.length === sports.length
                  ? 'shadow-[0_6px_20px_rgb(37_99_235/18%)]'
                  : 'border-white/[0.08] bg-white/[0.02]'
              }
            >
              All
            </Button>
            {sports.map((sport) => {
              const active = activeSports.includes(sport.id);
              return (
                <Button
                  key={sport.id}
                  variant={active ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => toggleSport(sport.id)}
                  aria-pressed={active}
                  className={
                    active
                      ? 'bg-white/[0.09]'
                      : 'border-white/[0.08] bg-white/[0.02] text-muted-foreground'
                  }
                >
                  {sport.label}
                </Button>
              );
            })}
          </section>

          <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1.06fr)_minmax(300px,0.78fr)_minmax(280px,0.7fr)]">
            <section aria-labelledby="schedule-title" className="min-w-0">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <h2 id="schedule-title" className="text-sm font-semibold">
                    {formatFullDate(dates[selectedDay])}
                  </h2>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {visibleGames.length}{' '}
                    {visibleGames.length === 1 ? 'game' : 'games'} in your
                    schedule
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-muted-foreground"
                >
                  Chronological
                  <ChevronRight data-icon="inline-end" />
                </Button>
              </div>

              {visibleGames.length > 0 ? (
                <div className="space-y-3">
                  {visibleGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      selected={selectedGame.id === game.id}
                      onSelect={() => setSelectedGameId(game.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-5 py-14 text-center">
                  <CalendarDays className="mx-auto size-6 text-muted-foreground" />
                  <p className="mt-3 text-sm font-semibold">
                    No games match these filters
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try another day or enable more sports.
                  </p>
                </div>
              )}
            </section>

            <section
              aria-label="Selected game details"
              className="min-w-0 xl:sticky xl:top-20"
            >
              <GameDetail
                game={selectedGame}
                saved={isSaved(selectedGame.id)}
                onToggleSaved={() => toggleSavedGame(selectedGame.id)}
              />
            </section>

            <aside className="min-w-0 xl:sticky xl:top-20">
              <StandingsCard />
              <div className="mt-4 rounded-2xl border border-white/[0.07] bg-gradient-to-br from-primary/12 to-transparent p-4">
                <div className="flex items-center gap-2 text-blue-200">
                  <Star className="size-4" />
                  <p className="text-xs font-semibold">
                    Save the games that matter
                  </p>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Build a personal watchlist without needing to follow entire
                  teams.
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 rounded-2xl border border-white/[0.1] bg-sidebar/95 p-1.5 shadow-[0_18px_60px_rgb(0_0_0/50%)] backdrop-blur-xl lg:hidden"
      >
        {[
          { label: 'Home', icon: LayoutDashboard, active: true, href: '/' },
          { label: 'Schedule', icon: CalendarDays, href: '/' },
          { label: 'Live', icon: RadioTower, href: '/' },
          { label: 'Table', icon: Trophy, href: '/standings' },
          { label: 'Saved', icon: Bookmark, href: '/saved' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              href={item.href}
              key={item.label}
              className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[9px] font-medium ${item.active ? 'bg-primary/12 text-blue-200' : 'text-muted-foreground'}`}
            >
              <Icon className={`size-4 ${item.active ? 'text-primary' : ''}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
