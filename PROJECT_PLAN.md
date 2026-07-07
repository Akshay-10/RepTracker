# RepForge Product Plan

## Product

- Build a mobile-first gym companion for a structured muscle-and-strength plan.
- Make the daily loop fast: open the live plan, log sets, rest, finish, and review progress.
- Preserve anchor lifts while rotating compatible accessories with explainable local rules.
- Generate concise AI coaching from compact, server-authoritative training summaries.
- Keep every account isolated with Supabase Auth and row-level security.

## UI layout

- **Public:** premium animated landing page and real authentication flows.
- **Onboarding:** profile, goals, kg/lb unit preference, schedule, equipment, and warm-up preferences saved to Supabase.
- **Desktop:** fixed rail, contextual top bar, asymmetric live dashboard, charts, and coach panel.
- **Mobile:** compact header, bottom navigation, slide-out account controls, thumb-friendly workout logging, and no horizontal page overflow.
- **Supporting routes:** plan, exercise catalog/details, progress, body tracking, records, settings, password recovery, and data export.

## Database

- **Identity:** `profiles`, `user_preferences`.
- **Programming:** `workout_days`, `exercises`, `exercise_variants`, `planned_exercise_slots`, `workout_day_exercises`.
- **Tracking:** `workout_sessions`, `workout_sets`, `body_metrics`, `personal_records`, `exercise_feedback`.
- **Variation history:** `selected_workout_variations`.
- **AI efficiency:** `ai_recommendations`, `ai_usage_logs`, and `training_summaries`.
- Supabase Auth IDs own every user row; RLS protects all reads and writes.

## Implementation checklist

- [x] Scaffold Next.js App Router, TypeScript, responsive tokens, and the animated app shell.
- [x] Integrate Supabase SSR authentication, protected routes, OAuth callback, password recovery, and logout.
- [x] Replace mock dashboard, chart, plan, body, record, and settings values with live queries.
- [x] Persist onboarding, workout sessions/sets, completed-set edits, feedback, variations, body measurements, and preferences.
- [x] Support kg/lb display across workout logging, dashboard, progress, body tracking, records, onboarding, and settings while storing kg in the database.
- [x] Add a deterministic variation engine backed by live catalog data and user preferences.
- [x] Add authenticated OpenAI coaching with structured output, durable cache, usage logs, and live fallback.
- [x] Add exercise seed data, default-plan generation, session completion, PR detection, and RLS policies.
- [x] Remove or wire decorative controls, add CSV export, and make plan reset explicit and safe.
- [ ] Run the two SQL files in the linked Supabase project.
- [ ] Add the server-only OpenAI key and optional Google OAuth credentials.
- [ ] Redeploy the latest local changes to Vercel.
- [ ] Verify authenticated production flows after the deployment is configured and redeployed.

## Integration boundary

- Supabase is required for accounts and all user-visible training data.
- OpenAI is optional; a server-side live-data fallback remains available without it.
- Browser storage is only a resilience layer for active workout drafts and theme preference, never the source of dashboard analytics.
