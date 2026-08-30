'use client';

import { Bookmark, CalendarDays, Clock3, MapPin, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { SubpageShell } from '@/components/gametrack/subpage-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSavedGames } from '@/hooks/use-saved-games';
import { mockGames } from '@/mock/sports';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));
}

export default function SavedGamesPage() {
  const { savedGameIds, toggleSavedGame } = useSavedGames();
  const savedGames = mockGames.filter((game) => savedGameIds.includes(game.id));

  return (
    <SubpageShell
      title="Saved games"
      description="A focused watchlist for individual fixtures—without following or favouriting entire teams. Saved games stay on this device for the MVP."
      activePath="/saved"
    >
      {savedGames.length === 0 ? (
        <Card className="items-center border border-dashed border-white/[0.1] bg-white/[0.02] px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary/12 text-primary">
            <Bookmark className="size-6" />
          </span>
          <h2 className="mt-2 text-base font-semibold">No saved games yet</h2>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Open a game on the dashboard and select “Save this game” to add it
            to your watchlist.
          </p>
          <Link
            href="/"
            className="mt-2 inline-flex h-8 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
          >
            <CalendarDays className="size-4" />
            Browse schedule
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {savedGames.map((game) => (
            <Card
              key={game.id}
              className="gap-0 border border-white/[0.08] bg-card/70 py-0"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/10 text-blue-300"
                  >
                    {game.league}
                  </Badge>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {game.status}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${game.homeTeam.name} versus ${game.awayTeam.name}`}
                  onClick={() => toggleSavedGame(game.id)}
                >
                  <Trash2 className="text-muted-foreground" />
                </Button>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      {game.homeTeam.name}
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      {game.awayTeam.name}
                    </p>
                  </div>
                  <div className="font-mono text-2xl font-bold">
                    <p>{game.homeScore ?? '—'}</p>
                    <p className="mt-1">{game.awayScore ?? '—'}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-2 border-t border-white/[0.06] pt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Clock3 className="size-3.5 text-primary" />
                    {formatDate(game.startTime)}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-primary" />
                    {game.venue}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </SubpageShell>
  );
}
