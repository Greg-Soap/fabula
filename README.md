# Fabula

A shared catalog of series and novels — discover, rate, and share what you love.

Built with **AdonisJS 6**, **Inertia.js**, **React**, and **TypeScript**.

## Features

- **Public catalog** – Browse series and novels; view details and covers
- **Dashboard** – Authenticated CRUD for series and novels
- **Auto-fill** – Fetch metadata from TMDB (series) and Open Library (novels); cover from URL or file upload
- **Cover storage** – Local filesystem or **Cloudflare R2** (private bucket, signed URLs)
- **Auth** – Email/password login; optional Google OAuth
- **Session-based** – CSRF protection, remember me, rate limiting

## Stack

| Layer      | Tech |
|-----------|------|
| Backend   | AdonisJS v6, Lucid ORM, VineJS |
| Database  | PostgreSQL only |
| Frontend  | React 19, Inertia.js, TypeScript, Vite 6 |
| Styling   | Tailwind CSS |
| Storage   | Local disk or Cloudflare R2 (covers) |

## Prerequisites

- **Node.js** 22+
- **npm** 10+
- **PostgreSQL** (local or hosted, e.g. Railway)

## Setup

1. **Clone and install**
   ```bash
   git clone <repo-url> fabula && cd fabula
   npm install
   ```

2. **Environment**
   ```bash
   cp .env.example .env
   node ace generate:key
   ```
   Edit `.env` and set at least:
   - `APP_KEY` (after generate:key)
   - `DATABASE_URL` – e.g. `postgresql://user:password@localhost:5432/fabula`

3. **Database**
   ```bash
   node ace migration:run
   ```
   Optional: seed a user
   ```bash
   node ace db:seed
   ```

4. **Run**
   ```bash
   npm run dev
   ```
   App: `http://localhost:3333`

### Optional env

- **R2 (covers)** – Set `DRIVE_DISK=r2` and add `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_ENDPOINT` (see `.env.example`).
- **TMDB** – For series auto-fill: get a key at [themoviedb.org](https://www.themoviedb.org/) and set `TMDB_API_KEY`.
- **Google OAuth** – Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` and configure redirect URI (e.g. `http://localhost:3333/google/callback`).

## Migrating from SQLite

If you have an existing SQLite database at `tmp/db.sqlite3`:

1. Ensure Postgres migrations are up to date: `node ace migration:run`
2. Copy data into Postgres:
   ```bash
   node ace migrate:from_sqlite
   ```
   To replace existing Postgres data and re-import:
   ```bash
   node ace migrate:from_sqlite --truncate
   ```

## Project structure (main)

```
app/
  controllers/     # auth, dashboard, series, novels
  models/          # User, Series, Novel
  validators/      # VineJS validators
  utils/           # e.g. downloadImageToBuffer
config/
  database.ts      # Postgres (DATABASE_URL)
  drive.ts         # fs or R2 disk
database/
  migrations/      # users, series, novels, auth, etc.
  seeders/
inertia/
  app/             # React app + SSR entry
  pages/           # home, login, dashboard, series, novels
  components/     # shared + dashboard components
commands/
  migrate_from_sqlite.ts   # SQLite → Postgres copy
start/
  routes.ts
  env.ts           # env validation
```

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server (HMR) |
| `npm run build` | Production build |
| `npm start` | Run production server |
| `npm test` | Run tests |
| `node ace migration:run` | Run migrations |
| `node ace migrate:from_sqlite [--truncate]` | Copy SQLite → Postgres |

## Deployment

1. Set `NODE_ENV=production`, `HOST=0.0.0.0`, and a production `DATABASE_URL`.
2. Run `npm run build` then `node ace migration:run`.
3. Start with `npm start` (or your process manager).

Ensure the app can create a `tmp` directory at runtime (e.g. for SQLite migration or temp files).

## Google OAuth2

1. In [Google Cloud Console](https://console.cloud.google.com/): create a project, **API & Services** → **Credentials** → **OAuth consent screen** (add scopes if needed).
2. Create **OAuth 2.0 Client ID** (e.g. Web application), copy Client ID and Secret to `.env`.
3. Set redirect URI to `http://localhost:3333/google/callback` (or your production URL).
4. In production, set production callback URL and credentials and publish the app in the audience tab.

## License

UNLICENSED
