# Beeooking Product Strategy

This repository contains the Beeooking layered product strategy and implementation planning artifacts.

## Current App Surfaces

- `/dashboard` or `/`: Layer 1 clickable operations prototype and planning dashboard.
- `/login`: Dedicated login page with email sign-in and demo role shortcuts.
- `/app`: Real Layer 1 app foundation for demo auth, club setup, members/families, waiver signing, and waiver-gated booking checks.
- `/api/layers`: Layered product strategy artifact list.
- `/api/app/session`: Current demo session and app state.

## Layer 1 Foundation Status

The app foundation now has:

- Cloudflare Worker app structure.
- Demo cookie authentication with role switching.
- Email login that creates a session cookie.
- Dedicated `/login` page that sends signed-in users to `/app`.
- Club setup flow.
- Organization-domain invite validation for Club Admin, Staff, and Coach roles.
- Members and families API.
- Add dependent/spousal member flow with date-of-birth validation.
- Save emergency contacts per family member.
- Family membership review action.
- Clickable Admin Review queue for pending/draft family records.
- Family waiver signing.
- Booking gate check that blocks when waiver is missing.
- D1-ready migration in `migrations/0001_layer1_foundation.sql`.

When a Cloudflare D1 database is bound as `DB`, the app reads and writes the real foundation tables for clubs, activities, users, families, family members, emergency contacts, waivers, and waiver signatures. Without the binding, it falls back to in-memory state so the preview still works.

## Connect Cloudflare D1

1. Create a D1 database in Cloudflare named `beeooking`.
2. Add the D1 binding to `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "beeooking"
database_id = "YOUR_DATABASE_ID"
migrations_dir = "migrations"
```

3. Apply the migration:

```sh
npx wrangler d1 migrations apply beeooking
```

4. Deploy:

```sh
npx wrangler deploy
```

After this, `/app` saves Layer 1 foundation data into D1 instead of the in-memory fallback.
