# RepForge Product Plan

## Product

- Build a dark-first, mobile-first gym companion for a six-day muscle-and-strength split.
- Make the daily loop fast: open today’s plan, log a set in seconds, rest, and finish.
- Preserve 60–70% of each workout while rotating 30–40% of accessories with explainable local rules.
- Surface progress, fatigue, personal records, and concise coaching without requiring AI.
- Ship the UI with realistic local data first; keep persistence, auth, and AI behind clean integration boundaries.

## UI layout

- **Public:** premium landing page plus glass-panel login and signup.
- **Onboarding:** short profile, goals, schedule, equipment, and warm-up preference flow.
- **Desktop app:** fixed rail, contextual top bar, asymmetric dashboard grid, charts, weekly rhythm, and coach panel.
- **Mobile app:** compact header, bottom navigation, thumb-friendly controls, sticky workout action, and floating rest timer.
- **Workout:** session header and progress, warm-up, expandable exercise cards, quick weight/rep steppers, variation reasons, feedback, and finish state.
- **Supporting pages:** weekly plan, exercise library/details, analytics, body tracking, records, and settings.

## Database

- **Identity/profile:** `profiles`, `user_preferences`, `user_equipment`.
- **Programming:** `workout_days`, `exercises`, `exercise_categories`, `exercise_variants`, `planned_exercise_slots`, `workout_day_exercises`.
- **Tracking:** `workout_sessions`, `workout_sets`, `body_metrics`, `personal_records`, `exercise_feedback`.
- **Variation history:** `selected_workout_variations` with week, source, and human-readable reason.
- **AI efficiency:** `training_summaries`, `ai_recommendations` keyed by input hash, and `ai_usage_logs`.
- Use Supabase Auth user IDs, row-level security, indexed history queries, JSONB only for compact summaries/AI output, and normal relational rows for workouts and sets.

## Implementation checklist

- [ ] Scaffold Next.js App Router, TypeScript, responsive design tokens, and reusable shell.
- [ ] Add exact six-day plan, exercise metadata, progress samples, and local variation rules.
- [ ] Build landing, auth, onboarding, dashboard, workout, plan, library, progress, body, records, and settings routes.
- [ ] Implement set logging, quick steppers, automatic rest timer, variation swap/keep/avoid feedback, and local persistence.
- [ ] Add animated charts, progress rings, weekly calendar, PR states, loading/empty states, and dark/light themes.
- [ ] Add token-efficient `/api/ai/coach` with structured output, local fallback, cache boundary, and medical-safety wording.
- [ ] Provide Supabase SQL, environment example, local setup, and deployment notes.
- [ ] Run lint/type/build checks and visually verify desktop and mobile layouts.

## Integration boundary

- The application must run without external services using seeded mock data and browser storage.
- Supabase is required only for real accounts, cross-device persistence, and production history.
- An OpenAI API key is required only for live AI coaching; local rule-based variations and fallback coaching remain available without it.
