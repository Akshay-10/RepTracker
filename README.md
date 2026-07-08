# RepForge

RepForge is a premium responsive gym tracker with authenticated cloud data, fast kg/lb set logging, explainable workout variations, live progress analytics, body tracking, personal records, and an optional OpenAI progress coach.

No user metric is supplied by a mock dataset. Dashboard values, charts, plan details, records, body measurements, settings, and AI context are derived from the signed-in user’s Supabase rows.

## Stack

- Next.js 16 App Router and TypeScript
- Supabase Auth, PostgreSQL, row-level security, and SSR sessions
- OpenAI Responses API with strict structured output
- Motion, Recharts, Lucide React, and a custom responsive design system

## Local setup

Requirements: Node.js 20.9 or newer.

```bash
npm install
```

Create a single `.env` file in the project root and provide the required Supabase/OpenAI values. The file is gitignored and should not be committed. Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Required Supabase setup

1. Open the Supabase SQL editor.
2. Run [`supabase/schema.sql`](./supabase/schema.sql).
3. Run [`supabase/bootstrap.sql`](./supabase/bootstrap.sql).
4. In Supabase Authentication → URL Configuration:
   - Set **Site URL** to your production URL, for example `https://rep-tracker-sable.vercel.app`.
   - Add redirect URLs:
     - `http://localhost:3000/**`
     - `https://rep-tracker-sable.vercel.app/**`
     - any Vercel preview domain pattern you plan to test from.
5. Add the Supabase project URL and publishable key to local and Vercel environment variables.

The schema creates authenticated profiles, preferences, plan rows, sessions, sets, metrics, records, feedback, AI cache/usage tables, row-level security, and the new-user profile trigger. The bootstrap seeds the exercise catalog and creates authenticated functions for plan generation and session completion.

Existing Auth users created before the schema was installed can sign in and complete onboarding; onboarding upserts the missing profile and preferences.

## OpenAI setup

`OPENAI_API_KEY` is required for generated coaching language. `OPENAI_MODEL` defaults to `gpt-5.4-mini`.

The coach route:

- verifies the signed-in user;
- reads its compact training context on the server from Supabase;
- requests strict JSON output;
- caches equivalent recommendations in Supabase;
- logs token usage and cache hits;
- falls back to a deterministic recommendation computed from live training data if no key is present or the API is unavailable.

Never expose `OPENAI_API_KEY` through a `NEXT_PUBLIC_` variable.

## Google sign-in

Email/password authentication works after the required Supabase setup. Google sign-in additionally requires:

1. Enable Google under Supabase Authentication → Providers.
2. Create Google OAuth credentials using the callback URL shown by Supabase.
3. Add the Google client ID and secret to the Supabase provider configuration.
4. Set `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true` in local/Vercel environment variables and redeploy.

Leave `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=false` until the provider is configured. The app hides the Google button in that state so production users do not hit an unfinished integration.

## Vercel deployment

Add these under Vercel Project Settings → Environment Variables for Production, Preview, and Development as needed:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=false
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DB_URL=your-postgres-connection-string
OPENAI_API_KEY=your-server-only-openai-key
OPENAI_MODEL=gpt-5.4-mini
NEXT_PUBLIC_APP_URL=https://rep-tracker-sable.vercel.app
```

Redeploy after changing environment variables. `NEXT_PUBLIC_APP_URL` is used for signup confirmation, password reset, and OAuth callback links. Do not leave it as `http://localhost:3000` in Vercel. The session proxy now degrades safely if deployment variables are missing, while protected routes still require valid authentication.

## Live behavior

- Authentication and logout: Supabase Auth cookies
- Profile, plan, settings, workouts, body metrics, records, feedback: Supabase PostgreSQL
- Active workout draft: local browser backup plus live Supabase writes; completed-set edits sync back to `workout_sets`
- Units: user preference displays kg or lb while storing normalized kg values in Supabase
- Theme: browser preference plus the saved Supabase preference
- Variation recommendations: local rules using live catalog, equipment, avoid list, and variation mode
- AI cache and usage: Supabase

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

Responsive QA should include at least 320 px and 390 px mobile widths for landing/auth routes and a signed-in workout check once Supabase test credentials are available.

## Important files

```text
app/(app)/                 Protected product routes
app/(auth)/                Login, signup, onboarding, password recovery
app/api/ai/coach/          Authenticated AI coach endpoint
components/                Product UI and interactive workflows
lib/auth.ts                Verified viewer lookup
lib/live-data.ts           Supabase queries and computed analytics
lib/variation-engine.ts    Deterministic compatible swaps
supabase/schema.sql        Tables, triggers, indexes, and RLS
supabase/bootstrap.sql     Catalog seed and authenticated RPCs
proxy.ts                   Next.js 16 Supabase session refresh
```
