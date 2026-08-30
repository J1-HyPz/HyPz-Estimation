'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Trophy } from 'lucide-react';

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
import { footballCompetitions } from '@/lib/football/competitions';
import { mockLeagueTables } from '@/mock/sports';
import type {
  FootballCompetitionId,
  FootballDataResponse,
  LeagueTable,
  TeamReference,
} from '@/types/sports';

function TeamMark({ team }: { team: TeamReference }) {
  return (
    <span
      className="grid size-8 place-items-center rounded-xl border border-white/10 text-[9px] font-bold text-white"
      style={{ backgroundColor: team.colour }}
    >
      {team.abbreviation}
    </span>
  );
}

export default function StandingsPage() {
  const [competitionId, setCompetitionId] =
    useState<FootballCompetitionId>('premier-league');
  const [table, setTable] = useState<LeagueTable>(
    mockLeagueTables['premier-league'],
  );
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/football/standings?competition=${competitionId}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load standings');
        return response.json() as Promise<FootballDataResponse<LeagueTable>>;
      })
      .then((result) => {
        setTable(result.data);
        setMessage(result.message);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return;
        setTable(mockLeagueTables[competitionId]);
        setMessage('The live standings service could not be reached.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [competitionId]);

  return (
    <SubpageShell
      title="Football standings"
      description="Switch between the major domestic leagues and the Champions League. Official tables replace the labelled demo state as soon as the live provider key is configured."
      activePath="/standings"
    >
      <div
        className="mb-5 flex flex-wrap gap-2"
        aria-label="Select competition"
      >
        {footballCompetitions.map((competition) => {
          const active = competition.id === competitionId;
          return (
            <button
              key={competition.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                if (active) return;
                setLoading(true);
                setCompetitionId(competition.id);
              }}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                active
                  ? 'border-primary/40 bg-primary/12 text-blue-200'
                  : 'border-white/[0.08] bg-white/[0.025] text-muted-foreground hover:text-foreground'
              }`}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: competition.accent }}
              />
              {competition.shortName}
            </button>
          );
        })}
      </div>

      {message && (
        <p className="mb-4 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-3 py-2.5 text-xs text-amber-100/80">
          {message}
        </p>
      )}

      <Card className="gap-0 border border-white/[0.08] bg-card/70 py-0">
        <div className="flex flex-col justify-between gap-3 border-b border-white/[0.07] px-5 py-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-accent/12 text-accent">
              <Trophy className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold">{table.league}</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Season {table.season}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {loading && (
              <RefreshCw className="size-3.5 animate-spin text-muted-foreground" />
            )}
            <Badge
              variant="outline"
              className={
                table.dataSource === 'api-football'
                  ? 'border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300'
                  : 'border-amber-400/20 bg-amber-400/[0.06] text-amber-300'
              }
            >
              {table.dataSource === 'api-football'
                ? 'Official live table'
                : 'Demo standings'}
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto p-2 sm:p-4">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.07] hover:bg-transparent">
                <TableHead className="w-10 text-xs">#</TableHead>
                <TableHead className="min-w-[190px] text-xs">Club</TableHead>
                <TableHead className="text-center text-xs">P</TableHead>
                <TableHead className="text-center text-xs">W</TableHead>
                <TableHead className="text-center text-xs">D</TableHead>
                <TableHead className="text-center text-xs">L</TableHead>
                <TableHead className="text-center text-xs">GD</TableHead>
                <TableHead className="min-w-[118px] text-center text-xs">
                  Form
                </TableHead>
                <TableHead className="text-right text-xs">Pts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.map((row) => (
                <TableRow
                  key={row.team.id}
                  className="border-white/[0.06] hover:bg-white/[0.035]"
                >
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {row.position}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <TeamMark team={row.team} />
                      <span className="text-sm font-semibold">
                        {row.team.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm">
                    {row.played}
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm">
                    {row.won}
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm">
                    {row.drawn}
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm">
                    {row.lost}
                  </TableCell>
                  <TableCell className="text-center font-mono text-sm">
                    {row.difference > 0 ? `+${row.difference}` : row.difference}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      {row.form.map((result, index) => (
                        <span
                          key={`${row.team.id}-${index}`}
                          className={`grid size-5 place-items-center rounded-md text-[9px] font-bold ${
                            result === 'W'
                              ? 'bg-emerald-400/12 text-emerald-300'
                              : result === 'D'
                                ? 'bg-amber-400/12 text-amber-300'
                                : 'bg-red-400/12 text-red-300'
                          }`}
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-base font-bold">
                    {row.points}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </SubpageShell>
  );
}
