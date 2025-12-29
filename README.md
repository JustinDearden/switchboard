## Switchboard

Visual workflow automation with real-time execution. Build flows with triggers (Manual, HTTP, Google Forms, Stripe) and actions (OpenAI, Anthropic, Gemini, HTTP, Slack, Discord), then watch them run live via Inngest Realtime.

- **Stack**: Next.js 15, React 19, Prisma (PostgreSQL), tRPC, Inngest, Better Auth, Polar (billing), Sentry
- **Highlights**: Visual editor, encrypted credentials, typed backend, real-time node status, webhooks, subscriptions

## Quick start

1. Install dependencies

```bash
npm install
```

2. Configure environment

Copy the example env file and fill it out:

```bash
cp .env.example .env.local
```

Then update values (see full list below):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nodebase?schema=public"
ENCRYPTION_KEY="replace-with-a-long-random-string"

# Your app base URL (use your public URL if testing external webhooks)
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Optional: OAuth (for social login)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Optional: Polar (billing)
POLAR_ACCESS_TOKEN=""
POLAR_ENV="sandbox" # or "production"
POLAR_PRODUCT_ID=""
POLAR_SUCCESS_URL="http://localhost:3000"
```

3. Setup database

```bash
npx prisma migrate dev
```

4. Run the app

- App only:

```bash
npm run dev
```

- Everything (Next.js + Inngest dev + ngrok):

```bash
npm run dev:all
```

Open `http://localhost:3000`.

## Environment variables

Copy `env.example` to `.env.local` and edit.

| Name                   | Required | Example                                                        | Notes                                                            |
| ---------------------- | -------- | -------------------------------------------------------------- | ---------------------------------------------------------------- |
| `DATABASE_URL`         | Yes      | `postgresql://user:pass@localhost:5432/nodebase?schema=public` | PostgreSQL connection string for Prisma                          |
| `ENCRYPTION_KEY`       | Yes      | long random string                                             | Used to encrypt/decrypt stored credentials in DB                 |
| `NEXT_PUBLIC_API_URL`  | Yes      | `http://localhost:3000`                                        | Public base URL; use ngrok URL when testing external webhooks    |
| `VERCEL_URL`           | No       | `your-app.vercel.app`                                          | Auto-set on Vercel; used by server-to-server tRPC URL resolution |
| `GITHUB_CLIENT_ID`     | Optional |                                                                | Social login via GitHub                                          |
| `GITHUB_CLIENT_SECRET` | Optional |                                                                | Social login via GitHub                                          |
| `GOOGLE_CLIENT_ID`     | Optional |                                                                | Social login via Google                                          |
| `GOOGLE_CLIENT_SECRET` | Optional |                                                                | Social login via Google                                          |
| `POLAR_ACCESS_TOKEN`   | Optional |                                                                | Enables Polar billing APIs                                       |
| `POLAR_ENV`            | Optional | `sandbox`                                                      | `sandbox` or `production`                                        |
| `POLAR_PRODUCT_ID`     | Optional |                                                                | Required if using checkout plugin                                |
| `POLAR_SUCCESS_URL`    | Optional | `http://localhost:3000`                                        | Redirect after successful checkout                               |

Notes:

- LLM API keys (OpenAI, Anthropic, Gemini) are added in-app under Dashboard → Credentials and stored encrypted; do NOT add these to `.env`.
- Sentry is preconfigured via `@sentry/nextjs` config files.
- For external triggers (Stripe/Google Forms), your `NEXT_PUBLIC_API_URL` must be publicly reachable (e.g., ngrok URL).

## Creating flows

1. Sign up / sign in

2. Go to Dashboard → Workflows

3. Create a new workflow

4. Add nodes

- **Triggers**: Manual, HTTP Request, Google Form, Stripe
- **Actions**: OpenAI, Anthropic, Gemini, HTTP Request, Slack, Discord

5. Connect nodes

- Drag from outputs to inputs to define execution order

6. Add credentials (if needed)

- Go to Dashboard → Credentials
- Save provider API keys (encrypted in DB)

7. Configure webhooks (for external triggers)

- Open the node dialog (Google Form/Stripe) to copy the webhook URL
- Ensure `NEXT_PUBLIC_API_URL` is set to a public URL (ngrok) when testing

8. Run and observe

- Use Manual Trigger to execute immediately, or send a webhook
- Watch real-time node status and view results in Executions

## Scripts

- `npm run dev`: Next.js dev server
- `npm run build` / `npm run start`: Production build/start
- `npm run inngest:dev`: Inngest local dev server
- `npm run ngrok:dev`: Expose `http://localhost:3000` for webhooks
- `npm run dev:all`: Run Next + Inngest + ngrok together (via `mprocs`)
- `npx prisma migrate dev`: Apply database migrations

## Features

- **Visual workflow editor** built with React Flow and type-safe nodes
- **Real-time execution** using Inngest channels with live status updates
- **Secure credential vault** with at-rest encryption via `ENCRYPTION_KEY`
- **Full-stack types** across Prisma, tRPC, and React
- **Webhook integrations** (Google Forms, Stripe) with easy copy-paste dialogs
- **Subscriptions/paywall** powered by Polar
- **Instrumentation** with Sentry, including Vercel AI integration

## Deploy

1. Provision PostgreSQL (e.g., Neon, Supabase) and set `DATABASE_URL`
2. Set required env vars (see table above)
3. Run Prisma migrations (`npx prisma migrate deploy`)
4. Deploy the Next.js app (e.g., Vercel). On Vercel, `VERCEL_URL` is automatic.

–––

Built with ❤️
