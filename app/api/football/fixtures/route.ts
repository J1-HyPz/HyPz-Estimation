import { getFootballFixtures } from '@/lib/football/api-football';
import { footballCompetitions } from '@/lib/football/competitions';
import type { FootballCompetitionId } from '@/types/sports';

export const dynamic = 'force-dynamic';

function today(offset = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

function isDate(value: string | null): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const from = isDate(url.searchParams.get('from'))
    ? url.searchParams.get('from')!
    : today();
  const to = isDate(url.searchParams.get('to'))
    ? url.searchParams.get('to')!
    : today(7);
  const supported = new Set(footballCompetitions.map((item) => item.id));
  const requested = (url.searchParams.get('competitions') ?? '')
    .split(',')
    .filter((id): id is FootballCompetitionId =>
      supported.has(id as FootballCompetitionId),
    );
  const competitionIds =
    requested.length > 0
      ? requested
      : footballCompetitions.map((competition) => competition.id);

  const result = await getFootballFixtures({ from, to, competitionIds });
  return Response.json(result, {
    headers: {
      'Cache-Control': 'public, max-age=30, stale-while-revalidate=300',
    },
  });
}
