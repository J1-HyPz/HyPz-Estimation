import { Trophy } from 'lucide-react';

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
import { SubpageShell } from '@/components/gametrack/subpage-shell';
import { premierLeagueTable } from '@/mock/sports';

export default function StandingsPage() {
  return (
    <SubpageShell
      title="League standings"
      description="Track the current table, recent form and the margins shaping the season. Sport-specific standings for NBA, NFL and MLB will use their native conference and division formats."
      activePath="/standings"
    >
      <div className="mb-5 flex flex-wrap gap-2" aria-label="Select sport">
        {['Football', 'NBA', 'NFL', 'MLB'].map((sport, index) => (
          <button
            key={sport}
            type="button"
            aria-pressed={index === 0}
            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
              index === 0
                ? 'border-primary/40 bg-primary/12 text-blue-200'
                : 'border-white/[0.08] bg-white/[0.025] text-muted-foreground hover:text-foreground'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      <Card className="gap-0 border border-white/[0.08] bg-card/70 py-0 backdrop-blur-xl">
        <div className="flex flex-col justify-between gap-3 border-b border-white/[0.07] px-5 py-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-accent/12 text-accent">
              <Trophy className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold">Premier League</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Season {premierLeagueTable.season}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-white/[0.08] bg-white/[0.025] text-muted-foreground"
          >
            Updated just now
          </Badge>
        </div>

        <div className="p-2 sm:p-4">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.07] hover:bg-transparent">
                <TableHead className="w-10 text-xs text-muted-foreground">
                  #
                </TableHead>
                <TableHead className="min-w-[180px] text-xs text-muted-foreground">
                  Club
                </TableHead>
                <TableHead className="text-center text-xs text-muted-foreground">
                  P
                </TableHead>
                <TableHead className="text-center text-xs text-muted-foreground">
                  W
                </TableHead>
                <TableHead className="text-center text-xs text-muted-foreground">
                  D
                </TableHead>
                <TableHead className="text-center text-xs text-muted-foreground">
                  L
                </TableHead>
                <TableHead className="text-center text-xs text-muted-foreground">
                  GD
                </TableHead>
                <TableHead className="text-center text-xs text-muted-foreground">
                  Form
                </TableHead>
                <TableHead className="text-right text-xs text-muted-foreground">
                  Pts
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {premierLeagueTable.rows.map((row) => (
                <TableRow
                  key={row.team.id}
                  className="border-white/[0.06] hover:bg-white/[0.035]"
                >
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {row.position}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span
                        className="grid size-8 place-items-center rounded-xl border border-white/10 text-[9px] font-bold text-white"
                        style={{ backgroundColor: row.team.colour }}
                      >
                        {row.team.abbreviation}
                      </span>
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
