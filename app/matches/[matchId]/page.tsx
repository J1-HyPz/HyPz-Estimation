import { cache } from 'react';
import type { Metadata } from 'next';
import {
  CalendarDays,
  CircleDot,
  Clock3,
  MapPin,
  Shirt,
  Sparkles,
  UsersRound,
} from 'lucide-react';

import { SubpageShell } from '@/components/gametrack/subpage-shell';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getApiFootballMatch } from '@/lib/football/api-football';
import { getMockGame } from '@/mock/sports';
import type { Game, TeamReference } from '@/types/sports';

const resolveMatch = cache(async (id: string) => {
  const demo = getMockGame(id);
  if (demo) return demo;
  const match = /^api-(\d+)$/.exec(id);
  return match ? getApiFootballMatch(Number(match[1])) : undefined;
});

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

function TeamMark({ team }: { team: TeamReference }) {
  return (
    <span
      className="grid size-16 place-items-center rounded-2xl border border-white/10 text-sm font-bold text-white shadow-[inset_0_1px_0_rgb(255_255_255/18%)] sm:size-20 sm:text-base"
      style={{ backgroundColor: team.colour }}
    >
      {team.abbreviation}
    </span>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ matchId: string }>;
}): Promise<Metadata> {
  const { matchId } = await params;
  const game = await resolveMatch(matchId);
  if (!game) return { title: 'Match unavailable · GameTrack' };
  const title = `${game.homeTeam.shortName} vs ${game.awayTeam.shortName} · GameTrack`;
  const description = `${game.league} match centre: score, events, statistics, lineups and player information.`;
  return {
    title,
    description,
    openGraph: { title, description, images: [] },
    twitter: { title, description, images: [] },
  };
}

function Scoreboard({ game }: { game: Game }) {
  const scheduled = game.status === 'scheduled';
  return (
    <Card className="overflow-hidden border border-white/[0.08] bg-card/70 p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-300">
            {game.league}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {game.competition}
          </p>
        </div>
        <Badge
          variant="outline"
          className={
            game.status === 'live'
              ? 'border-red-400/20 bg-red-400/10 text-red-300'
              : game.status === 'completed'
                ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                : 'border-blue-400/20 bg-blue-400/10 text-blue-300'
          }
        >
          {game.status === 'live' && (
            <span className="size-1.5 animate-pulse rounded-full bg-red-400" />
          )}
          {game.status === 'completed' ? 'Full time' : game.status}
        </Badge>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-8 sm:gap-8 sm:px-10">
        <div className="flex min-w-0 flex-col items-center text-center">
          <TeamMark team={game.homeTeam} />
          <p className="mt-3 max-w-full text-sm font-bold sm:text-base">
            {game.homeTeam.name}
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Home
          </p>
        </div>
        <div className="min-w-[84px] text-center sm:min-w-[150px]">
          {scheduled ? (
            <>
              <p className="font-mono text-2xl font-bold sm:text-4xl">
                {new Intl.DateTimeFormat('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(game.startTime))}
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Kick-off
              </p>
            </>
          ) : (
            <>
              <p className="font-mono text-4xl font-bold tracking-tight sm:text-6xl">
                {game.homeScore ?? '—'} <span className="text-white/20">:</span>{' '}
                {game.awayScore ?? '—'}
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {game.status === 'live'
                  ? `${game.period} · ${game.clock}`
                  : 'Final score'}
              </p>
            </>
          )}
        </div>
        <div className="flex min-w-0 flex-col items-center text-center">
          <TeamMark team={game.awayTeam} />
          <p className="mt-3 max-w-full text-sm font-bold sm:text-base">
            {game.awayTeam.name}
          </p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            Away
          </p>
        </div>
      </div>

      <div className="grid gap-px border-t border-white/[0.07] bg-white/[0.07] sm:grid-cols-2">
        <div className="flex items-start gap-3 bg-card px-5 py-4">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <p className="text-xs font-semibold">
              {formatDateTime(game.startTime)}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Displayed in your local timezone
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-card px-5 py-4">
          <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
          <div>
            <p className="text-xs font-semibold">{game.venue}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {game.location}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function EmptyCoverage({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/[0.1] bg-white/[0.018] px-4 py-8 text-center">
      <p className="text-xs font-semibold">{label} are not available yet</p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Coverage appears here when the competition and data provider supply it.
      </p>
    </div>
  );
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const game = await resolveMatch(matchId);

  if (!game) {
    return (
      <SubpageShell
        title="Match unavailable"
        description="This match could not be loaded from the current football data source."
        activePath=""
      >
        <EmptyCoverage label="Match information" />
      </SubpageShell>
    );
  }

  return (
    <SubpageShell
      title={`${game.homeTeam.shortName} vs ${game.awayTeam.shortName}`}
      description={`${game.league} · ${game.competition}. Review the match summary, live timeline, team statistics, lineups and player performance data available for this fixture.`}
      activePath=""
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className={
            game.dataSource === 'api-football'
              ? 'border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300'
              : 'border-amber-400/20 bg-amber-400/[0.06] text-amber-300'
          }
        >
          {game.dataSource === 'api-football'
            ? 'Live provider data'
            : 'Demo match data'}
        </Badge>
        <span className="text-[10px] text-muted-foreground">
          Updated{' '}
          {new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(game.lastUpdated))}
        </span>
      </div>

      <Scoreboard game={game} />

      <nav
        className="scrollbar-none mt-5 flex gap-2 overflow-x-auto"
        aria-label="Match sections"
      >
        {['Summary', 'Statistics', 'Timeline', 'Lineups', 'Players'].map(
          (section) => (
            <a
              key={section}
              href={`#${section.toLowerCase()}`}
              className="shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-primary/30 hover:text-foreground"
            >
              {section}
            </a>
          ),
        )}
      </nav>

      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div className="space-y-5">
          <Card
            id="summary"
            className="scroll-mt-24 border border-white/[0.08] bg-card/70 p-5"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              <h2 className="text-sm font-semibold">Match summary</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {game.summary ??
                `${game.homeTeam.name} face ${game.awayTeam.name} in ${game.league}. A verified match summary will appear when provider coverage is available.`}
            </p>
          </Card>

          <Card
            id="timeline"
            className="scroll-mt-24 border border-white/[0.08] bg-card/70 p-5"
          >
            <div className="flex items-center gap-2">
              <Clock3 className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Match timeline</h2>
            </div>
            {game.events && game.events.length > 0 ? (
              <div className="mt-4 space-y-1">
                {game.events.map((event) => (
                  <div
                    key={event.id}
                    className="grid grid-cols-[42px_18px_1fr] gap-2 py-2.5"
                  >
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      {event.minute}
                    </span>
                    <span
                      className={`mt-0.5 size-3 rounded-full border-2 ${
                        event.type === 'goal'
                          ? 'border-emerald-300 bg-emerald-400/30'
                          : event.type === 'card'
                            ? 'border-amber-300 bg-amber-400/30'
                            : 'border-blue-300 bg-blue-400/30'
                      }`}
                    />
                    <div>
                      <p className="text-xs font-semibold">
                        {event.player ?? event.detail}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
                        {event.assist ? `Assist: ${event.assist} · ` : ''}
                        {event.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyCoverage label="Timeline events" />
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card
            id="statistics"
            className="scroll-mt-24 border border-white/[0.08] bg-card/70 p-5"
          >
            <div className="flex items-center gap-2">
              <CircleDot className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Team statistics</h2>
            </div>
            {game.stats && game.stats.length > 0 ? (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-[1fr_auto_1fr] text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <span>{game.homeTeam.abbreviation}</span>
                  <span>Match</span>
                  <span className="text-right">
                    {game.awayTeam.abbreviation}
                  </span>
                </div>
                {game.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="grid grid-cols-[1fr_auto_1fr] items-center rounded-xl bg-white/[0.025] px-3 py-2.5 text-xs"
                  >
                    <span className="font-mono font-bold">{stat.home}</span>
                    <span className="px-3 text-[11px] text-muted-foreground">
                      {stat.label}
                    </span>
                    <span className="text-right font-mono font-bold">
                      {stat.away}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyCoverage label="Match statistics" />
              </div>
            )}
          </Card>

          <Card
            id="lineups"
            className="scroll-mt-24 border border-white/[0.08] bg-card/70 p-5"
          >
            <div className="flex items-center gap-2">
              <Shirt className="size-4 text-accent" />
              <h2 className="text-sm font-semibold">Starting lineups</h2>
            </div>
            {game.lineups && game.lineups.length > 0 ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {game.lineups.map((lineup) => (
                  <div
                    key={lineup.team.id}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                      <div>
                        <p className="text-xs font-bold">{lineup.team.name}</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          Coach: {lineup.coach ?? 'Not available'}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-white/[0.08] text-muted-foreground"
                      >
                        {lineup.formation ?? '—'}
                      </Badge>
                    </div>
                    <ol className="mt-3 space-y-2">
                      {lineup.starters.map((player) => (
                        <li
                          key={player.id}
                          className="flex items-center gap-2 text-xs"
                        >
                          <span className="w-6 font-mono text-muted-foreground">
                            {player.number ?? '—'}
                          </span>
                          <span className="flex-1 font-medium">
                            {player.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {player.position}
                          </span>
                        </li>
                      ))}
                    </ol>
                    {lineup.substitutes.length > 0 && (
                      <p className="mt-4 border-t border-white/[0.06] pt-3 text-[10px] text-muted-foreground">
                        Bench:{' '}
                        {lineup.substitutes.map((item) => item.name).join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4">
                <EmptyCoverage label="Lineups" />
              </div>
            )}
          </Card>

          <Card
            id="players"
            className="scroll-mt-24 gap-0 overflow-hidden border border-white/[0.08] bg-card/70 p-0"
          >
            <div className="flex items-center gap-2 border-b border-white/[0.07] px-5 py-4">
              <UsersRound className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Player performance</h2>
            </div>
            {game.players && game.players.length > 0 ? (
              <div className="overflow-x-auto p-2">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/[0.06] hover:bg-transparent">
                      <TableHead className="min-w-[170px] text-xs">
                        Player
                      </TableHead>
                      <TableHead className="text-center text-xs">
                        Rating
                      </TableHead>
                      <TableHead className="text-center text-xs">Min</TableHead>
                      <TableHead className="text-center text-xs">G</TableHead>
                      <TableHead className="text-center text-xs">A</TableHead>
                      <TableHead className="text-center text-xs">
                        Shots
                      </TableHead>
                      <TableHead className="text-right text-xs">
                        Passes
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {game.players.map((performance) => (
                      <TableRow
                        key={`${performance.teamId}-${performance.player.id}`}
                        className="border-white/[0.05]"
                      >
                        <TableCell>
                          <p className="text-xs font-semibold">
                            {performance.player.name}
                          </p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            {performance.player.position}
                          </p>
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs font-bold text-emerald-300">
                          {performance.rating ?? '—'}
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs">
                          {performance.minutes ?? '—'}
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs">
                          {performance.goals ?? '—'}
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs">
                          {performance.assists ?? '—'}
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs">
                          {performance.shots ?? '—'}
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs">
                          {performance.passes ?? '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-5">
                <EmptyCoverage label="Player performance data" />
              </div>
            )}
          </Card>
        </div>
      </div>
    </SubpageShell>
  );
}
