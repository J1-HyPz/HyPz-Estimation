'use client';

import { useEffect, useMemo, useState } from 'react';

import { mockGames } from '@/mock/sports';
import type {
  DataSource,
  FootballCompetitionId,
  FootballDataResponse,
  Game,
} from '@/types/sports';

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function useFootballFixtures(competitionIds: FootballCompetitionId[]) {
  const [games, setGames] = useState<Game[]>(mockGames);
  const [source, setSource] = useState<DataSource>('demo');
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState(true);

  const competitionKey = useMemo(
    () => [...competitionIds].sort().join(','),
    [competitionIds],
  );

  useEffect(() => {
    const controller = new AbortController();
    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + 7);
    const params = new URLSearchParams({
      from: formatDate(from),
      to: formatDate(to),
      competitions: competitionKey,
    });

    fetch(`/api/football/fixtures?${params}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load football fixtures');
        return response.json() as Promise<FootballDataResponse<Game[]>>;
      })
      .then((result) => {
        setGames(result.data);
        setSource(result.source);
        setMessage(result.message);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return;
        setGames(
          mockGames.filter((game) => competitionIds.includes(game.leagueId)),
        );
        setSource('demo');
        setMessage('The live data service could not be reached.');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [competitionIds, competitionKey]);

  return { games, source, message, loading };
}
