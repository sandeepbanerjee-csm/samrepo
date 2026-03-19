# Customer Success Command Center

Production-ready Customer Success CRM for IT Services Strategic Account Management.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL, Auth, Realtime, Storage-ready)
- TanStack React Query
- Zustand
- Vercel-ready

## Features

- Secure login with Supabase Auth
- Executive dashboard (ARR, health, risks, action items, pipeline)
- Account portfolio list with search and tier filtering
- Full account workspace:
  - Contacts
  - Interactions
  - Action items
  - Risks
  - Opportunities
  - Health scores
- Action items board across all accounts
- Server API routes for dashboard and account read/write flows

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure env:

```bash
cp .env.example .env.local
```

Set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Run Supabase SQL migration in your Supabase SQL editor:

- [`supabase/migrations/001_init.sql`](./supabase/migrations/001_init.sql)

4. Start dev server:

```bash
npm run dev
```

## Build

```bash
npm run typecheck
npm run build
npm run start
```

## Deploy to Vercel

1. Push repo to GitHub/GitLab/Bitbucket.
2. Import project in Vercel.
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.

## App Routes

- `/login`
- `/dashboard`
- `/accounts`
- `/accounts/new`
- `/accounts/[id]`
- `/tasks`

## API Routes

- `GET /api/dashboard`
- `GET /api/accounts`
- `POST /api/accounts`
- `GET /api/accounts/:id`
- `PATCH /api/accounts/:id`
- `DELETE /api/accounts/:id`
- `GET /api/tasks`
# samrepo
