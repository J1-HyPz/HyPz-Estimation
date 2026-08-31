'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Construction,
  MapPin,
  RadioTower,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trophy,
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
import { useFootballFixtures } from '@/hooks/use-football-fixtures';
import {
  footballCompetitions,
  futureSports,
  getCompetition,
} from '@/lib/football/competitions';
import { premierLeagueTable } from '@/mock/sports';
import type {
  FootballCompetitionId,
  Game,
  GameStatus,
  TeamReference,
} from '@/types/sports';

const statusStyles: Record<GameStatus, string> = {
  live: 'border-red-400/20 bg-red-400/10 text-red-300',
  completed: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
  scheduled: 'border-blue-400/20 bg-blue-400/10 text-blue-300',
  postponed: 'border-orange-400/20 bg-orange-400/10 text-orange-300',
  cancelled: 'border-zinc-400/20 bg-zinc-400/10 text-zinc-300',
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
    md: 'size-10 text-[10px]',
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

function GameCard({ game }: { game: Game }) {
  const competition = getCompetition(game.leagueId);
  return (
    <Link
      href={`/matches/${game.id}`}
      className="group block rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition-all hover:border-primary/35 hover:bg-primary/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: competition?.accent }}
          />
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {game.league}
          </span>
          <span className="hidden text-[10px] text-white/25 sm:inline">/</span>
          <span className="hidden truncate text-[10px] text-muted-foreground sm:inline">
            {game.competition}
          </span>
        </div>
        <StatusBadge game={game} />
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="flex min-w-0 items-center gap-3 sm:flex-row-reverse sm:text-right">
          <TeamMark team={game.homeTeam} />
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
            {game.homeTeam.shortName}
          </span>
        </div>
        <div className="hidden min-w-20 text-center sm:block">
          {game.status === 'scheduled' ? (
            <>
              <p className="font-mono text-xl font-bold">
                {formatTime(game.startTime)}
              </p>
              <p className="mt-0.5 text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                Local time
              </p>
            </>
          ) : (
            <>
              <p className="font-mono text-2xl font-bold">
                {game.homeScore ?? '—'} <span className="text-white/25">:</span>{' '}
                {game.awayScore ?? '—'}
              </p>
              <p className="mt-0.5 text-[9px] uppercase tracking-[0.13em] text-muted-foreground">
                {game.status === 'live'
                  ? `${game.period} · ${game.clock}`
                  : 'Full time'}
              </p>
            </>
          )}
        </div>
        <div className="flex min-w-0 items-center gap-3">
          <TeamMark team={game.awayTeam} />
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
            {game.awayTeam.shortName}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1.5 truncate">
          <MapPin className="size-3.5" />
          <span className="truncate">{game.venue}</span>
        </span>
        <span className="ml-3 inline-flex shrink-0 items-center gap-1.5 font-semibold text-blue-300">
          Match centre
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function StandingsPreview() {
  return (
    <Card className="gap-0 border border-white/[0.08] bg-card/65 py-0">
      <div className="flex items-start justify-between border-b border-white/[0.07] px-4 py-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="size-4 text-accent" />
            <h2 className="text-sm font-semibold">Premier League</h2>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Table preview · demo
          </p>
        </div>
        <Link
          href="/standings"
          className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-xs font-medium text-primary hover:bg-muted"
        >
          All leagues
          <ChevronRight className="size-3" />
        </Link>
      </div>

      <div className="px-2 py-2">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="h-8 w-8 px-2 text-[9px] uppercase tracking-wider">
                #
              </TableHead>
              <TableHead className="h-8 px-1 text-[9px] uppercase tracking-wider">
                Club
              </TableHead>
              <TableHead className="h-8 px-1 text-center text-[9px] uppercase tracking-wider">
                P
              </TableHead>
              <TableHead className="h-8 px-2 text-right text-[9px] uppercase tracking-wider">
                Pts
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {premierLeagueTable.rows.map((row) => (
              <TableRow key={row.team.id} className="border-white/[0.05]">
                <TableCell className="w-8 px-2 py-2.5 font-mono text-xs text-muted-foreground">
                  {row.position}
                </TableCell>
                <TableCell className="px-1 py-2.5">
                  <div className="flex items-center gap-2">
                    <TeamMark team={row.team} size="sm" />
                    <span className="max-w-[130px] truncate text-xs font-semibold">
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
  const [activeCompetitions, setActiveCompetitions] = useState<
    FootballCompetitionId[]
  >(footballCompetitions.map((competition) => competition.id));
  const [query, setQuery] = useState('');
  const { games, source, message, loading } =
    useFootballFixtures(activeCompetitions);

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
    return games.filter((game) => {
      const matchesDay = dayOffset(game.startTime) === selectedDay;
      const matchesCompetition = activeCompetitions.includes(game.leagueId);
      const matchesQuery =
        !normalizedQuery ||
        game.homeTeam.name.toLowerCase().includes(normalizedQuery) ||
        game.awayTeam.name.toLowerCase().includes(normalizedQuery) ||
        game.league.toLowerCase().includes(normalizedQuery);
      return matchesDay && matchesCompetition && matchesQuery;
    });
  }, [activeCompetitions, games, query, selectedDay]);

  const toggleCompetition = (competitionId: FootballCompetitionId) => {
    setActiveCompetitions((current) => {
      if (current.includes(competitionId)) {
        const next = current.filter((item) => item !== competitionId);
        return next.length > 0 ? next : current;
      }
      return [...current, competitionId];
    });
  };

  const liveCount = games.filter((game) => game.status === 'live').length;
  const todayCount = games.filter(
    (game) => dayOffset(game.startTime) === 0,
  ).length;
  const weekCount = games.filter((game) => game.status === 'scheduled').length;

  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-4 px-4 sm:px-6 xl:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-primary shadow-[0_8px_30px_rgb(37_99_235/28%)]">
              <Zap className="size-5 fill-white text-white" />
            </span>
            <div className="hidden sm:block">
              <p className="text-base font-bold tracking-tight">GameTrack</p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Football match centre
              </p>
            </div>
          </Link>

          <nav
            className="ml-2 hidden items-center gap-1 md:flex"
            aria-label="Primary"
          >
            <Link
              href="/"
              className="rounded-lg bg-primary/12 px-3 py-2 text-xs font-semibold text-blue-200"
            >
              Fixtures
            </Link>
            <Link
              href="/standings"
              className="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
            >
              Standings
            </Link>
          </nav>

          <div className="relative ml-auto w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search clubs or competitions"
              className="h-9 border-white/[0.07] bg-white/[0.035] pl-9 text-sm"
              aria-label="Search football matches"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-12 pt-7 sm:px-6 xl:px-8">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={
                  source === 'api-football'
                    ? 'border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300'
                    : 'border-amber-400/20 bg-amber-400/[0.07] text-amber-300'
                }
              >
                <span className="size-1.5 rounded-full bg-current" />
                {source === 'api-football' ? 'Live provider' : 'Demo data'}
              </Badge>
              {loading && (
                <span className="text-[11px] text-muted-foreground">
                  Refreshing…
                </span>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-[-0.035em] sm:text-3xl">
              Football, without the noise.
            </h1>
            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
              Today’s fixtures and the next seven days across Europe’s leading
              competitions.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Live', value: liveCount, colour: 'text-red-300' },
              { label: 'Today', value: todayCount, colour: 'text-foreground' },
              { label: 'Ahead', value: weekCount, colour: 'text-blue-300' },
            ].map((item) => (
              <div
                key={item.label}
                className="min-w-[82px] rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5"
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

        {message && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-3 py-2.5 text-xs text-amber-100/80">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-amber-300" />
            <span>{message}</span>
          </div>
        )}

        <section
          aria-label="Date selector"
          className="scrollbar-none mt-6 flex gap-2 overflow-x-auto pb-2"
        >
          {dates.map((date, offset) => {
            const active = offset === selectedDay;
            const count = games.filter(
              (game) => dayOffset(game.startTime) === offset,
            ).length;
            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => setSelectedDay(offset)}
                aria-pressed={active}
                className={`relative flex min-w-[76px] flex-1 flex-col items-center rounded-xl border px-3 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
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
                <span className="mt-0.5 text-[9px] text-muted-foreground">
                  {count} matches
                </span>
              </button>
            );
          })}
        </section>

        <section
          className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.018] p-4"
          aria-labelledby="competition-filter-title"
        >
          <div className="flex flex-wrap items-center gap-2">
            <div
              id="competition-filter-title"
              className="mr-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
            >
              <SlidersHorizontal className="size-3.5" />
              Competitions
            </div>
            <Button
              variant={
                activeCompetitions.length === footballCompetitions.length
                  ? 'default'
                  : 'outline'
              }
              size="sm"
              onClick={() =>
                setActiveCompetitions(
                  footballCompetitions.map((competition) => competition.id),
                )
              }
              className="border-white/[0.08]"
            >
              All football
            </Button>
            {footballCompetitions.map((competition) => {
              const active = activeCompetitions.includes(competition.id);
              return (
                <Button
                  key={competition.id}
                  variant={active ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => toggleCompetition(competition.id)}
                  aria-pressed={active}
                  className={
                    active
                      ? 'bg-white/[0.09]'
                      : 'border-white/[0.08] bg-transparent text-muted-foreground'
                  }
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: competition.accent }}
                  />
                  {active && <Check className="size-3" />}
                  {competition.shortName}
                </Button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
            <div className="mr-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
              <Construction className="size-3.5" />
              Coming soon
            </div>
            {futureSports.map((sport) => (
              <button
                key={sport.id}
                type="button"
                disabled
                title={`${sport.description} support is planned for a future update`}
                className="cursor-not-allowed rounded-lg border border-white/[0.05] bg-white/[0.015] px-3 py-2 text-xs font-semibold text-muted-foreground/45 grayscale"
              >
                {sport.name}
              </button>
            ))}
            <span className="text-[10px] text-muted-foreground/55">
              Inactive until a future update
            </span>
          </div>
        </section>

        <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.62fr)]">
          <section aria-labelledby="schedule-title" className="min-w-0">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <h2 id="schedule-title" className="text-sm font-semibold">
                  {formatFullDate(dates[selectedDay])}
                </h2>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {visibleGames.length}{' '}
                  {visibleGames.length === 1 ? 'match' : 'matches'} across
                  selected competitions
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <Clock3 className="size-3.5" />
                Chronological
              </div>
            </div>

            {visibleGames.length > 0 ? (
              <div className="space-y-3">
                {visibleGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-5 py-14 text-center">
                <CalendarDays className="mx-auto size-6 text-muted-foreground" />
                <p className="mt-3 text-sm font-semibold">
                  No matches for this view
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try another date, competition, or search term.
                </p>
              </div>
            )}
          </section>

          <aside className="min-w-0 xl:sticky xl:top-20">
            <StandingsPreview />
            <div className="mt-4 rounded-2xl border border-blue-400/15 bg-blue-400/[0.055] p-4">
              <div className="flex items-center gap-2 text-blue-200">
                <RadioTower className="size-4" />
                <p className="text-xs font-semibold">
                  Match details are one click away
                </p>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Open any fixture for the score, timeline, statistics, lineups
                and player performance data available from its competition.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
