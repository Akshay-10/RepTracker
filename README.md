# RepForge

RepForge is a premium, responsive gym tracker built around a six-day muscle-and-strength plan. It combines fast set logging, automatic rest timers, explainable exercise variations, progress analytics, body tracking, and an optional AI coach.

The demo works immediately with seeded data and browser storage. Supabase and OpenAI are optional integrations.

## What is included

- Marketing landing page, login, signup, and four-step onboarding
- Responsive dashboard with weekly plan, progress signals, readiness, and coach panel
- Full Monday–Saturday plan with warm-up rules and 18–24 working-set targets
- Set logging with weight/rep steppers, local persistence, and automatic rest timer
- Rule-based variation engine with stable anchor lifts and compatible accessory swaps
- Exercise library and detail views
- Strength, volume, consistency, body-weight, body-measurement, and record views
- Variation, AI usage, workout, unit, appearance, and privacy settings
- Token-efficient `POST /api/ai/coach` route with structured output and local fallback
- Supabase-ready PostgreSQL schema with indexes and row-level security
- Dark and light themes, responsive navigation, reduced-motion support, and mobile sticky controls

## Stack

- Next.js 16 App Router and TypeScript
- Tailwind CSS 4 pipeline plus a custom design-token system
- Motion for transitions and micro-interactions
- Recharts for analytics
- Lucide React for icons
- Supabase-ready PostgreSQL schema
- OpenAI Responses API integration without a required client SDK

## Folder structure

```text
app/
  (app)/                 Authenticated product routes
  (auth)/                Login, signup, onboarding
  api/ai/coach/          Optional live coach endpoint
  globals.css            Complete responsive visual system
components/
  app-shell.tsx          Desktop/mobile navigation
  dashboard-content.tsx  Dashboard experience
  workout-experience.tsx Set logging, timer, swaps, feedback
  charts.tsx             Reusable analytics
  ...                    Plan, library, body, settings, marketing
lib/
  data.ts                Exact seeded six-day program
  variation-engine.ts    Local adaptation and coaching rules
  types.ts               Shared TypeScript domain types
supabase/
  schema.sql             Tables, indexes, trigger, RLS policies
PROJECT_PLAN.md          Product, UI, database, and build plans
```

## Run locally

Requirements: Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Quality commands:

```bash
npm run typecheck
npm run lint
npm run build
```

## Environment variables

Copy `.env.example` to `.env.local`.

```dotenv
# Optional: real accounts and cloud persistence
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=

# Optional: live AI coaching
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.4-mini

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

No variables are required for the demo.

## Setup required from you

### Supabase — optional

Only needed for real authentication, cross-device sync, and production data persistence.

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](./supabase/schema.sql) in its SQL editor.
3. Add the project URL and publishable key to `.env.local`. Add a secret key only when a trusted server route requires elevated access.
4. The browser/server clients and session-refresh proxy are configured under `utils/supabase`. Connect the existing UI boundaries to Supabase Auth and table queries. The current demo intentionally uses local data first.
5. Enable Google in Supabase Auth if Google sign-in is desired; the button is marked as requiring setup.

### OpenAI — optional

Only needed for live coach language. Without a key, the same endpoint returns the local rule-based coach response.

1. Create an API key in the OpenAI platform.
2. Add `OPENAI_API_KEY` to `.env.local`.
3. Keep `OPENAI_MODEL=gpt-5.4-mini` for the cost-sensitive coaching path, or change it explicitly.

The route:

- sends compact profile and training summaries, not raw lifetime history;
- requests a strict JSON schema;
- does not call AI on page loads, set completion, timers, or simple calculations;
- caches identical responses in the running server process for seven days;
- falls back safely when the API is unavailable;
- includes non-diagnostic pain guidance in the coach instruction.

For production, use the supplied `ai_recommendations` and `ai_usage_logs` tables to make cache and usage accounting durable across serverless instances.

## Supabase data model

The SQL schema includes:

- `profiles`, `user_preferences`
- `exercise_categories`, `exercises`, `exercise_variants`
- `workout_days`, `planned_exercise_slots`, `workout_day_exercises`
- `selected_workout_variations`
- `workout_sessions`, `workout_sets`
- `body_metrics`, `personal_records`, `exercise_feedback`
- `training_summaries`, `ai_recommendations`, `ai_usage_logs`

All user-owned tables have row-level security. Global exercise catalog tables are read-only to authenticated users.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Add any optional environment variables under Project Settings → Environment Variables.
4. Deploy. Vercel will use `npm run build`.
5. If Supabase Auth is connected, add the Vercel URL to Supabase’s allowed redirect URLs.

## Current persistence behavior

- Active workout sets: browser `localStorage`
- Theme: browser `localStorage`
- Onboarding preferences: browser `localStorage`
- Seeded history and analytics: local mock data
- AI response cache: server memory, with durable Supabase tables ready for the production adapter

## Next improvements

- Connect Supabase Auth and replace seeded history with live queries
- Move AI caching and usage logging into Supabase
- Add offline-first PWA session logging and background sync
- Add session-history detail and edit flows
- Add optional recovery inputs such as sleep and soreness
- Add notification permissions for rest timers only after explicit user opt-in
- Add automated tests for variation invariants and workout persistence
