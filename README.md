# Net-K Frontend

Next.js 14 app with Tailwind CSS. Connects to the Net-K backend API.

## Prerequisites

- Node.js 18+
- Net-K backend running (see [netk-backend](https://github.com/CODING-ALPHA/netk-backend))

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the backend API (default `http://localhost:3001`) |

### 3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start with hot reload |
| `npm run build` | Create production build |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
app/
├── (auth)/        # Login, signup, forgot/reset password
├── (dashboard)/   # Authenticated user dashboard, paths, submissions, portfolio
├── (company)/     # Company dashboard, roles, shortlist, talent search
├── assessment/    # Ikigai career assessment flow
├── onboarding/    # Post-signup onboarding
├── portfolio/     # Public portfolio pages ([slug])
└── api/auth/      # Next.js route handlers for token management
hooks/             # Shared React hooks
lib/               # API client (axios)
```

## Auth Flow

Tokens are stored in HTTP-only cookies via the `/api/auth` route handlers. The middleware in `middleware.ts` protects routes and handles token refresh automatically.
