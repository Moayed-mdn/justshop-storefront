# Installation

## Purpose

This document covers a clean installation of the JustShop frontend from a fresh clone.

Code surfaces this file aligns with:

- `.env.example`
- `package.json`
- `nuxt.config.ts`
- `README.md`

## Clean Install Steps

1. Clone the repository.
2. Enter the project directory.
3. Use the Node version from `.nvmrc`.
4. Install dependencies with npm.
5. Copy `.env.example` to `.env`.
6. Fill in your local runtime values.

## Commands

```bash
git clone <repository-url>
cd justshop-frontend
nvm use
npm install
cp .env.example .env
```

## Configure `.env`

Set these values before trying to run the app:

| Variable | What to point it to |
|---|---|
| `NUXT_PUBLIC_API_BASE` | Backend API base URL used by the app and server proxy layer |
| `NUXT_PUBLIC_GRAPHQL_URL` | GraphQL endpoint used by the search integration |
| `NUXT_PUBLIC_SITE_URL` | Public site URL for local or shared environment use |

Use non-secret local or development values only.

## What `npm install` Does

The repo defines a `postinstall` script in `package.json`:

```bash
npm run postinstall
```

That script runs `nuxt prepare`, so generated Nuxt typing support is prepared automatically after install.

## First Successful Install Checklist

After installation, you should have:

- a populated `node_modules/`
- a `.env` file in the repo root
- no missing dependency errors from npm

Next, continue with `docs/getting-started/running-locally.md`.
