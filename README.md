# HyPz Estimations Sim

GameTrack is a responsive sports schedule and live-score web application for tracking games across:

* 🏀 NBA
* 🏈 NFL
* ⚾ MLB
* ⚽ Football / Soccer

The application focuses on a rolling **15-day schedule window**:

* Previous 7 days
* Today
* Next 7 days

GameTrack should provide one unified interface for viewing past results, live games, upcoming fixtures, game details, statistics, favourite teams, and alerts.

---

# Project Goals

The main goal is to create a modern sports dashboard that combines multiple sports into one consistent experience.

The application should:

* Display games from multiple sports in one schedule
* Show completed, live, and upcoming games
* Update live scores automatically
* Allow users to filter games by sport and status
* Provide detailed information for individual games
* Allow users to favourite teams and games
* Display all times in the user's local timezone
* Work well on desktop, tablet, and mobile
* Use a shared internal data format across all supported sports

---

# Tech Stack

Preferred stack:

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Backend

* Next.js Server Actions / Route Handlers
* TypeScript

## Database

* PostgreSQL
* Prisma ORM

## Authentication

Use a suitable modern authentication solution compatible with Next.js.

## Data

Game information should initially use mock data.

The architecture must make it easy to replace mock data with real sports APIs later.

Potential future integrations may include separate providers for:

* NBA
* NFL
* MLB
* Football

Do not tightly couple the UI to any particular external sports API.

---

# Development Strategy

Build the application in stages.

## Phase 1: UI and Mock Data

Create the complete interface using mock sports data.

The entire application should work before integrating external sports APIs.

This includes:

* Navigation
* Schedule
* Filters
* Game cards
* Game details
* Favourite teams
* Responsive layouts

## Phase 2: Sports Data Layer

Create adapters that convert external sports API responses into GameTrack's internal data models.

## Phase 3: Accounts and Persistence

Add:

* Authentication
* User preferences
* Favourite teams
* Favourite games
* Notification settings

## Phase 4: Live Features

Add:

* Live score updates
* Play-by-play
* Alerts
* Game status updates

---

# Application Layout

The desktop interface should use a three-column dashboard layout.

## Left Sidebar

Include:

* GameTrack logo
* Dashboard
* Schedule
* Scores
* Favorites
* Alerts
* Settings

Also include a **My Teams** section containing the user's favourite teams.

Example:

* New York Knicks
* Baltimore Ravens
* New York Yankees
* Arsenal

The sidebar should collapse appropriately on smaller displays.

---

# Top Navigation

Include:

* Global search
* Notification button
* User profile menu

Search should eventually support:

* Teams
* Players
* Games
* Leagues

---

# Main Dashboard

The dashboard is the primary screen.

It should contain:

1. Sport filters
2. Date selector
3. Daily schedule
4. Game status grouping
5. Selected game details
6. Filter controls
7. Quick overview widgets

---

# Sport Filters

Provide quick filter buttons for:

* All
* NBA
* NFL
* MLB
* Football

Users must be able to enable multiple sports simultaneously.

---

# Date Navigation

The application should always limit its main schedule to:

```text
Today - 7 days
      ↓
    Today
      ↓
Today + 7 days
```

Display this as a horizontal date selector.

Example:

```text
PAST 7 DAYS           TODAY           NEXT 7 DAYS

Thu   Fri   Sat   Sun   Mon   Tue   Wed
 8     9    10    11    12    13    14
```

The selected day should be visually highlighted.

Users can select any day within the 15-day window.

---

# Schedule

Games should be grouped by date.

Example:

```text
Monday, May 12
6 Games
```

Within each day, games may be grouped by status.

## Completed

Example:

```text
NBA
Celtics       112
Knicks        105

FINAL
TD Garden
Boston, MA
```

## Live

Example:

```text
NFL

Chiefs        17
Ravens        14

LIVE
Q3 08:42

M&T Bank Stadium
Baltimore, MD
```

## Upcoming

Example:

```text
Football

Arsenal
Chelsea

8:00 PM

Emirates Stadium
London
```

---

# Game Statuses

Support the following states:

```typescript
type GameStatus =
  | "scheduled"
  | "live"
  | "completed"
  | "postponed"
  | "cancelled";
```

The UI should visually distinguish each state.

Suggested status colours:

* Completed: green
* Live: red
* Upcoming: blue
* Postponed: orange
* Cancelled: grey/red

---

# Game Cards

Each game card should support displaying:

* Sport
* League
* Competition
* Home team
* Away team
* Team badge
* Start time
* Game status
* Home score
* Away score
* Current period
* Game clock
* Venue
* Location

Not every field will apply to every sport.

The component must gracefully handle missing information.

---

# Game Detail Panel

Selecting a game should open a detailed view.

On desktop this can appear alongside the schedule.

On mobile it should open as a dedicated page or full-screen panel.

Display:

* Sport
* Competition
* Date
* Start time
* Status
* Teams
* Score
* Venue
* Location

Include tabs:

* Summary
* Stats
* Lineups
* Play-by-Play

---

# Summary Tab

Completed games can display a short match summary.

Example:

```text
The Celtics held off a late Knicks rally to secure a
112-105 victory at TD Garden.

Jayson Tatum led Boston with 28 points and 9 rebounds.
```

Initially use mock summaries.

Do not make AI-generated summaries a requirement for the MVP.

---

# Statistics

Statistics should adapt to each sport.

Do not create one universal stat list.

---

## NBA Statistics

Possible statistics:

* Points
* FG
* FG%
* 3PT
* 3PT%
* Free throws
* Assists
* Rebounds
* Blocks
* Steals
* Turnovers

---

## NFL Statistics

Possible statistics:

* Passing yards
* Rushing yards
* Total yards
* First downs
* Turnovers
* Sacks
* Penalties
* Possession

---

## MLB Statistics

Possible statistics:

* Runs
* Hits
* Errors
* Strikeouts
* Walks
* Home runs

---

## Football Statistics

Possible statistics:

* Possession
* Shots
* Shots on target
* Corners
* Fouls
* Yellow cards
* Red cards
* xG when available

---

# Play-by-Play

Game events should use a common structure.

Example:

```typescript
interface GameEvent {
  id: string;
  gameId: string;
  timestamp?: string;
  period?: string;
  clock?: string;
  teamId?: string;
  playerId?: string;
  eventType: string;
  description: string;
  homeScore?: number;
  awayScore?: number;
}
```

Examples include:

### NBA

* Basket
* Free throw
* Foul
* Timeout

### NFL

* Touchdown
* Field goal
* Interception
* Sack
* Punt

### MLB

* Run
* Home run
* Strikeout
* Walk

### Football

* Goal
* Yellow card
* Red card
* Substitution
* Penalty

---

# Lineups

Support starting lineups where the data is available.

Possible future implementations:

### NBA

* Starting five
* Bench

### NFL

* Offensive starters
* Defensive starters

### MLB

* Batting order
* Pitcher

### Football

* Starting XI
* Bench
* Formation

---

# Top Performers

The game detail screen may include a Top Performers section.

Example:

```text
Jayson Tatum

28 PTS
9 REB
6 AST
```

Performance statistics should adapt to the selected sport.

---

# Quick Overview

The dashboard should show summary widgets.

Example:

```text
LIVE NOW
2 Games

UPCOMING
12 Games

COMPLETED
14 Games
```

Values should reflect the currently selected date/filter range.

---

# Filtering

Provide a dedicated filtering system.

Users should be able to filter by:

## Sport

* NBA
* NFL
* MLB
* Football

## Status

* Completed
* Live
* Upcoming

## Other Options

* Timezone
* Competition
* Favourite teams
* Sort order
* Grouping

---

# Sorting

Initially support:

```text
Chronological
```

Architecture should allow additional options later:

* Sport
* League
* Favourite teams
* Live first
* Upcoming first

---

# Grouping

Allow schedule results to be grouped by:

* Date
* Sport
* League
* Status

The default should be:

```text
Date
```

---

# Search

Provide global search.

Initial search targets:

* Teams
* Games

Future search targets:

* Players
* Competitions
* Leagues
* Stadiums

---

# Favourite Teams

Users should be able to favourite teams.

Favourite teams should appear in the sidebar.

Example data structure:

```typescript
interface FavoriteTeam {
  id: string;
  userId: string;
  teamId: string;
  createdAt: Date;
}
```

Favourite teams can later affect:

* Dashboard ordering
* Notifications
* Suggested games
* Search results

---

# Favourite Games

Users should also be able to save individual games.

A star icon should appear in the game detail interface.

---

# Favourite Team Next Game

The dashboard should include a small widget showing the next fixture involving one of the user's favourite teams.

Example:

```text
New York Knicks

vs Pacers

Tuesday, May 13
7:00 PM
```

---

# Notifications

Notifications are not required for the first MVP but the architecture should support them.

Future notifications may include:

* Game starts soon
* Game started
* Score changed
* Half-time
* End of game
* Favourite team playing
* Game postponed
* Game cancelled

---

# Local Timezone

Store game times internally in UTC.

Convert them to the user's local timezone for display.

Never permanently store converted local times as the authoritative game time.

Example:

```typescript
interface Game {
  startTime: Date;
}
```

---

# Responsive Design

The application must support:

* Desktop
* Laptop
* Tablet
* Mobile

## Desktop

Use:

* Sidebar
* Schedule column
* Game details column
* Filter/sidebar column

## Tablet

Reduce secondary panels and allow them to open as drawers.

## Mobile

Use bottom navigation.

Suggested mobile tabs:

* Schedule
* Scores
* Favorites
* Alerts
* Profile

Game details should open as their own view.

---

# Visual Style

Use a modern dark sports dashboard aesthetic.

## Colours

Primary background:

```text
Very dark navy / near-black
```

Primary accent:

```text
Bright blue
```

Status accents:

```text
Blue   = navigation / upcoming
Green  = completed / positive
Red    = live
Orange = secondary sports/stat accent
```

Avoid excessive gradients.

Use subtle borders and shadows.

---

# UI Style

Use:

* Rounded cards
* Consistent spacing
* Clear information hierarchy
* Compact data presentation
* Large readable scores
* Small secondary metadata
* Responsive grids

Avoid:

* Excessive animations
* Glassmorphism everywhere
* Oversized cards
* Excessive colour
* Dense walls of text

The interface should prioritize information readability.

---

# Shared Data Model

A major architectural requirement is that the frontend should not care which API supplies a game.

Every sport should be converted into a shared GameTrack format.

Example:

```typescript
export type Sport =
  | "nba"
  | "nfl"
  | "mlb"
  | "football";

export interface TeamReference {
  id: string;
  name: string;
  shortName?: string;
  abbreviation?: string;
  logoUrl?: string;
}

export interface Game {
  id: string;

  sport: Sport;

  league: {
    id: string;
    name: string;
  };

  competition?: {
    id: string;
    name: string;
  };

  startTime: string;

  status:
    | "scheduled"
    | "live"
    | "completed"
    | "postponed"
    | "cancelled";

  homeTeam: TeamReference;
  awayTeam: TeamReference;

  homeScore?: number;
  awayScore?: number;

  period?: string;
  clock?: string;

  venue?: {
    name?: string;
    city?: string;
    country?: string;
  };
}
```

---

# Sports Provider Architecture

External API code must remain isolated.

Recommended structure:

```text
src/
  sports/
    core/
      types.ts
      service.ts

    nba/
      provider.ts
      adapter.ts

    nfl/
      provider.ts
      adapter.ts

    mlb/
      provider.ts
      adapter.ts

    football/
      provider.ts
      adapter.ts
```

Each provider should convert its API response into the shared GameTrack models.

Example:

```typescript
interface SportsProvider {
  getGames(
    startDate: Date,
    endDate: Date
  ): Promise<Game[]>;

  getGame(
    gameId: string
  ): Promise<Game | null>;
}
```

---

# Mock Data

Development should begin with mock data.

Create realistic test cases for:

* NBA
* NFL
* MLB
* Football

Include:

* Completed games
* Live games
* Upcoming games
* Postponed games

Mock data should include enough examples to test all major layouts.

---

# Data Fetching

The frontend should not directly call external sports APIs.

Use the following flow:

```text
External Sports API
        ↓
Sports Provider
        ↓
Adapter
        ↓
GameTrack Server
        ↓
Cache / Database
        ↓
Frontend
```

This allows providers to be changed without rebuilding the application.

---

# Caching

Sports APIs may have:

* Rate limits
* Request costs
* Slow response times

Implement server-side caching.

Suggested behaviour:

### Upcoming games

Cache longer.

Example:

```text
5-30 minutes
```

### Live games

Refresh frequently.

Example:

```text
15-60 seconds
```

### Completed games

Cache aggressively.

Completed historical data rarely changes.

---

# Database Models

Suggested initial database entities:

```text
User
Team
League
Game
FavoriteTeam
FavoriteGame
UserPreference
NotificationPreference
```

Do not store every API response directly in the database.

Store normalized data only when persistence provides an actual benefit.

---

# Suggested Application Structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── schedule/
│   ├── scores/
│   ├── favorites/
│   ├── alerts/
│   ├── settings/
│   └── games/
│       └── [gameId]/
│
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── schedule/
│   ├── games/
│   ├── filters/
│   ├── teams/
│   └── ui/
│
├── sports/
│   ├── core/
│   ├── nba/
│   ├── nfl/
│   ├── mlb/
│   └── football/
│
├── lib/
│   ├── db/
│   ├── auth/
│   ├── dates/
│   └── cache/
│
├── hooks/
│
├── types/
│
└── mock/
```

This structure can change if there is a clear architectural reason.

Avoid creating unnecessary abstraction layers.

---

# Pages

Initial application routes should include:

```text
/
```

Dashboard.

```text
/schedule
```

Expanded schedule.

```text
/scores
```

Live and completed games.

```text
/favorites
```

Favourite teams and games.

```text
/alerts
```

Notification preferences.

```text
/settings
```

User settings.

```text
/games/[gameId]
```

Dedicated game page.

---

# MVP

The first working release should contain:

* [ ] Responsive app shell
* [ ] Desktop sidebar
* [ ] Mobile navigation
* [ ] NBA support
* [ ] NFL support
* [ ] MLB support
* [ ] Football support
* [ ] Mock sports data
* [ ] Past 7 days
* [ ] Today
* [ ] Next 7 days
* [ ] Date selector
* [ ] Game cards
* [ ] Live status
* [ ] Completed status
* [ ] Upcoming status
* [ ] Scores
* [ ] Start times
* [ ] Venue information
* [ ] Sport filters
* [ ] Status filters
* [ ] Sorting
* [ ] Game details
* [ ] Basic statistics
* [ ] Search
* [ ] Favourite teams
* [ ] Favourite games
* [ ] Local timezone conversion
* [ ] Responsive desktop layout
* [ ] Responsive mobile layout

---

# Version 2

After the MVP:

* [ ] Authentication
* [ ] Persistent user favourites
* [ ] Real sports API integration
* [ ] Live score polling
* [ ] Team pages
* [ ] Player pages
* [ ] League pages
* [ ] Standings
* [ ] Play-by-play
* [ ] Lineups
* [ ] Notifications
* [ ] Advanced filters
* [ ] Dashboard customisation

---

# Future Features

Possible long-term features:

* Advanced statistics
* Historical game search
* Player tracking
* Personalised sports feed
* Predictions
* Team form
* Head-to-head history
* Fantasy integrations
* Streaming information
* Calendar export
* Browser notifications
* Mobile push notifications
* Premium subscription

These are not MVP requirements.

---

# Codex Development Instructions

When working on GameTrack, follow these rules.

## 1. Read Before Changing

Before making major changes:

1. Inspect the existing project structure.
2. Read relevant components.
3. Understand existing patterns.
4. Reuse existing systems where appropriate.

Do not rebuild working functionality unnecessarily.

---

## 2. Make Incremental Changes

Do not attempt to implement the entire application in one change.

Prefer:

```text
Feature
↓
Components
↓
Logic
↓
Tests
↓
Verification
↓
Next feature
```

---

## 3. Keep the Project Running

After meaningful changes:

* Run TypeScript checks
* Run linting
* Run tests where available
* Run the application build

Resolve errors before considering the task complete.

---

## 4. Maintain Strong Type Safety

Avoid:

```typescript
any
```

unless genuinely unavoidable.

Prefer explicit interfaces and discriminated unions.

---

## 5. Reuse Components

Shared UI should use reusable components.

Examples:

```text
GameCard
TeamBadge
ScoreDisplay
StatusBadge
DateSelector
SportFilter
GameStats
FilterPanel
```

Do not duplicate large amounts of markup.

---

## 6. Keep Sports-Specific Logic Out of Generic Components

Avoid:

```typescript
if (sport === "nba") {
  // hundreds of lines
}
```

Generic UI should consume normalized data.

Place sport-specific transformations inside the appropriate sports adapter.

---

## 7. Preserve Responsive Behaviour

Every major UI feature must be checked at:

* Desktop
* Tablet
* Mobile

Do not implement desktop-only components without a mobile behaviour.

---

## 8. Accessibility

Use:

* Semantic HTML
* Keyboard navigation
* Accessible forms
* Proper labels
* Appropriate contrast
* ARIA attributes when necessary

Do not rely solely on colour to communicate game state.

---

## 9. Avoid Premature Complexity

Do not implement:

* Microservices
* Event buses
* Distributed queues
* Complex state frameworks
* Multiple databases

unless the project genuinely requires them.

Prefer simple solutions first.

---

# Recommended First Implementation Tasks

Codex should initially work through these tasks in order.

## Task 1

Create the application shell.

Include:

* Next.js
* TypeScript
* Tailwind
* Desktop sidebar
* Header
* Main content layout

## Task 2

Create shared sports types.

Implement:

```text
Sport
Team
League
Game
GameStatus
GameEvent
```

## Task 3

Create realistic mock data.

Include games from:

* NBA
* NFL
* MLB
* Football

## Task 4

Create the Date Selector.

Support:

```text
Today - 7
through
Today + 7
```

## Task 5

Create GameCard.

Support:

* Completed
* Live
* Upcoming

## Task 6

Build the main Schedule Dashboard.

## Task 7

Implement sports and status filtering.

## Task 8

Create the Game Detail panel.

## Task 9

Add responsive mobile layouts.

## Task 10

Add favourites.

Do not begin external sports API integration until the core interface works properly using mock data.

---

# Definition of Done

A feature is complete when:

1. It works.
2. TypeScript reports no relevant errors.
3. The project builds successfully.
4. It behaves correctly on desktop and mobile.
5. Loading, empty, and error states have been considered.
6. Existing functionality still works.
7. The implementation follows existing project conventions.

---

# Product Principle

GameTrack should make checking multiple sports feel simpler than visiting several different league websites or score applications.

The priority is:

```text
Fast
Clear
Unified
Reliable
```

Every feature should support those four goals.
