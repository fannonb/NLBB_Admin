# NLBB Web (PWA)

This folder contains the React PWA migration target for NLBB.

## Source of Truth
Migration scope, progress, and next steps are tracked in:
- `../PWA_MIGRATION_PLAN.md`

## Commands
- `npm run dev`
- `npm run build`
- `npm run preview`

## Environment
- Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` if needed.

## Browser sessions

Sessions use HttpOnly API cookies. The API must allow the exact web origin in `ALLOWED_ORIGINS`; deploy the API session changes with this web build. Existing users sign in again when upgrading from localStorage sessions.

Use HTTPS and preferably an API host on the same site as the web app, or a same-origin `/api` reverse proxy, to avoid third-party cookie restrictions. Production builds use `VITE_API_BASE_URL`, or the current origin's `/api` when unset; localhost fallbacks are development-only. See `../backend/docs/SECURITY_REGRESSION_TESTS.md` for verification and deployment details.
