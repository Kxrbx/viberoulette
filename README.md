# Vibe Roulette

One click decides what you build next.

A one-button idea generator for vibe coders. Click once, get a niche and a product type to build, assembled into a single buildable sentence. No login, no tracking, no friction.

![Vibe Roulette](public/og.png)

## Why

Idea paralysis kills more side projects than bad code. Vibe Roulette gives you something specific enough to start building tonight ("An AI voice agent for local plumbers"), not a category ("an app for businesses").

## How it works

- Combinatorial engine: ~104 niches × ~87 product types ≈ 9,000 unique ideas, plus ~35 optional twists
- Shuffle-bag draws, so repeats are rare until the pool is exhausted
- Slot-machine settle: niche lands ~1.15s, product ~1.65s, twist ~2.05s
- Spacebar to spin, `prefers-reduced-motion` respected (instant reveal)
- Twists and sound toggles persisted in `localStorage`, everything stays on-device

## Stack

- React 19 + TypeScript + Vite 8
- Zero runtime dependencies (no UI framework, no analytics)
- Self-hosted fonts (Space Grotesk + IBM Plex Mono), grayscale editorial-terminal design
- Static SPA — no backend in this version

## Run it

```sh
pnpm install
pnpm dev
pnpm build
pnpm preview
```

## Deploy (GitHub Pages + custom domain)

The build uses relative `base: './'` so it works on `username.github.io/viberoulette` and on a custom domain.

```sh
pnpm build # outputs dist/
```

Push to `main` — the `.github/workflows/pages.yml` workflow builds and deploys to GitHub Pages automatically. To use a custom domain (e.g. `xxx.runs-on.dev`):

1. Add a `CNAME` file at repo root with your domain
2. Point the domain: `records: { "CNAME": "USERNAME.github.io" }`
3. Settings → Pages → custom domain → Enforce HTTPS

## Project docs

- `PRODUCT.md` — what it is, audience, monetization notes (disabled in this build)
- `DESIGN.md` — visual system, motion, accessibility

## Status

Launch build: monetization (affiliate CTA, ad strip, tracking pixel) is disabled. See `src/data/offers.ts`, `src/components/AdStrip.tsx`, `src/lib/gravity.ts`, `src/lib/pixel.ts` — kept in tree for a later iteration.

Built by [@Kxrbx](https://github.com/Kxrbx). MIT.
