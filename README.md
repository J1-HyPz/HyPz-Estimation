# GameTrack

GameTrack is a personal football match centre for following fixtures, scores, match details and league tables without account setup or social features.

The active product is football-first. NBA, NFL and MLB remain visible as disabled **Coming soon** options so they can be added in later releases without cluttering the current experience.

## Current product scope

- Today plus the next seven days
- Local-time fixture display
- Club and competition search
- Multi-select competition filters
- Premier League
- LaLiga
- Serie A
- Bundesliga
- Ligue 1
- UEFA Champions League
- League tables with form, goal difference and points
- Dedicated match pages with summary, timeline, statistics, lineups and player performance data when provider coverage is available
- Responsive desktop, tablet and mobile layouts
- No authentication, profiles, favourite teams or saved games

## Data accuracy

GameTrack includes an API-Football adapter for live fixtures, standings and match-detail coverage. The interface always identifies whether it is displaying live provider data or bundled demo data.

Live data requires an API key:

```bash
API_FOOTBALL_KEY=your_key_here
```

Copy `.env.example` to `.env.local` and add the key locally. Never commit the real key to GitHub.

The provider boundary is isolated under `lib/football/`, so another football data service can replace API-Football without rewriting the interface. Match events, lineups, player statistics and advanced figures such as expected goals are shown only when the selected competition and provider return them.

## Routes

- `/` — fixtures, competition filters and the eight-day schedule
- `/standings` — selectable football league tables
- `/matches/[matchId]` — detailed match centre
- `/api/football/fixtures` — normalized fixture feed
- `/api/football/standings` — normalized standings feed

## Technology

- React 19
- TypeScript
- Vinext / Vite
- Tailwind CSS
- shadcn interface primitives
- API-Football provider adapter

## Local development

```bash
pnpm install
pnpm dev
```

Validation:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Roadmap

1. Configure and verify the production API-Football key.
2. Tune refresh intervals for live, scheduled and completed matches.
3. Expand football coverage and match analytics based on provider availability.
4. Add NBA, NFL and MLB through separate normalized adapters in later updates.

The GitHub repository is the source of truth for the product. Secrets and provider credentials must remain outside source control.
