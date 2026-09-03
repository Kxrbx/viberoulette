# Vibe Roulette

One click decides what you build next.

**Live:** https://kxrbx.github.io/viberoulette/

A one-button idea generator for people who ship software fast and stall on the question
"what should I build next?" Click once, get a niche plus a product type, assembled into
a single sentence specific enough to start building tonight. No login, no tracking,
no ads, no backend.

![Vibe Roulette](public/og.png)

## Use it

- Click **Spin** (or press spacebar) and read the result.
- Toggle **twists** on/off to add or drop the third constraint line.
- Toggle **sound** on/off for the slot-machine ticks.
- Everything (spin count, toggles) stays in your browser's `localStorage`. Nothing
  leaves your device.

## Make it yours

The whole generator is three string arrays. Fork the repo and edit them:

- `src/data/niches.ts` — audiences (`'dog groomers'`, `'D&D dungeon masters'`, …)
- `src/data/products.ts` — software shapes (`'an AI voice agent'`, …)
- `src/data/twists.ts` — optional constraints, layered on top when twists are on

Draws come from a shuffle bag (`src/lib/shuffleBag.ts`), so repeats are rare until the
pool is exhausted. The sentence is assembled in `src/lib/sentence.ts`
(`"<Product> for <niche> — <twist>."`). Spin timings live in `src/hooks/useRoulette.ts`
(1.15s / 1.65s / 2.05s stagger). Colors and type live in `src/index.css` and
`DESIGN.md` — grayscale only, Space Grotesk + IBM Plex Mono, both self-hosted.

## Project structure

```
src/
  App.tsx                 page shell, header/footer, #legal routing
  components/             ResultBoard, SpinButton, LegalOverlay
  data/                   niches, products, twists, legal
  hooks/useRoulette.ts    spin state machine, timers, persistence
  lib/                    shuffleBag, sentence, audio, favicon
public/                   favicon, og image, self-hosted fonts
```

Zero runtime dependencies — just `react` and `react-dom`. Lint with `oxlint`,
types with `tsc`.

## Run it

```sh
pnpm install
pnpm dev      # local dev
pnpm build    # typecheck + static build into dist/
pnpm preview  # serve the production build
```

## Deploy

Any static host works — the build uses relative `base: './'`. This repo deploys to
GitHub Pages via `.github/workflows/pages.yml` on every push to `main`. For a custom
domain, add a `CNAME` file at the repo root and point the domain at
`<user>.github.io`.

## Docs

- `PRODUCT.md` — what it is, who it is for, non-goals
- `DESIGN.md` — visual system, motion, accessibility floor

Built by [@Kxrbx](https://github.com/Kxrbx). MIT — fork it, reskin it, feed it your
own niches.
