# MIA English Companion

A premium AI English conversation companion that helps people speak naturally through warm, low-pressure conversations with Mia.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mia-companion/src/App.tsx` — routes, interaction state, and reusable shell components for the MIA prototype
- `artifacts/mia-companion/src/index.css` — MIA typography, palette, motion, grain texture, and shared utility styles
- `artifacts/mia-companion/package.json` — frontend package scripts and dependencies
- `artifacts/api-server` — shared API scaffold, currently unused by the frontend-first prototype

## Architecture decisions

- The first build is intentionally frontend-first with local prototype state; no AI, speech, auth, or persistence is faked behind the UI.
- Wouter provides route-level navigation for the landing page, private talk room, voice room, and progress view.
- Mia is rendered as an authored CSS illustration so the prototype does not depend on placeholder image services.
- Shared conversation and navigation patterns stay in the single artifact entry point until backend contracts are defined.

## Product

- Landing experience that positions Mia as a private English conversation companion.
- Talk room with seeded conversation, send/reply simulation, topic selection, prompt insertion, and listening state.
- Voice room with start, pause, resume, and animated listening treatment.
- Progress space with authored activity history, time spent, and dismissible personal insight.

## User preferences

The user wants a premium, warm, editorial companion experience rather than a generic chatbot, school app, or SaaS dashboard.

## Gotchas

- The MIA frontend workflow supplies `PORT` and `BASE_PATH`; use the managed artifact workflow rather than starting Vite manually.
- The app is currently a local prototype; connect real LLM, speech-to-text, text-to-speech, auth, and progress persistence only after defining their contracts.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
