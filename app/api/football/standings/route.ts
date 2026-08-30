import { getFootballStandings } from '@/lib/football/api-football';
import { footballCompetitions } from '@/lib/football/competitions';
import type { FootballCompetitionId } from '@/types/sports';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requested = url.searchParams.get('competition');
  const competition = footballCompetitions.find(
    (item) => item.id === requested,
  );
  const competitionId: FootballCompetitionId =
    competition?.id ?? 'premier-league';
  const result = await getFootballStandings(competitionId);
  return Response.json(result, {
    headers: {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    },
  });
}
