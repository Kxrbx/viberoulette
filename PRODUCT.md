# PRODUCT.md — Vibe Roulette

## What it is
A one-button idea generator for vibe coders. Click once, receive a niche and a product type to build, assembled into a single buildable sentence. That is the entire product.

## Audience
Vibe coders: people who ship software with AI assistance, move fast, and stall on the question "what should I build next?" They enjoy specific, slightly absurd prompts over generic ones. They are allergic to signups, funnels, and fluff.

## Job to be done
Kill idea paralysis in one click. The result must be specific enough to start building tonight ("An AI voice agent for local plumbers"), not a category ("an app for businesses").

## Success looks like
- A first-time visitor understands the deal within seconds of landing.
- They spin immediately — no scrolling required to find the button.
- The result makes them smirk or nod, then spin again.

## Content engine
Combinatorial: ~104 niches × ~87 product types ≈ 9,000 unique ideas, plus ~35 optional twists layered on top. Draws come from a shuffle bag so repeats are rare until the pool is exhausted. Niches are real, varied audiences with money or passion; product types are concrete software shapes vibe coders can actually ship in a weekend.

## Brand commitments (pinned by user)
- Clean and modern, text-based, dark theme, mostly grayscale. Typography does the work; no color accents, no casino clichés, no neon glow, no illustrations.
- No login, no tracking, no friction. One page, one action. (Monetization amendment: a single outbound affiliate CTA appears after each reveal; it adds no tracking to this site — the tagged destination handles its own consent. Fonts are self-hosted; zero third-party requests on page load.)

## Monetization
Two revenue lines, both post-reveal or peripheral, never interstitial:
1. **Affiliate CTA** — Bolt.new referral (15% of referred revenue up to $50/referral, cash via Cello) as one filled pill after each reveal with the referee discount in the label and `(affiliate)` disclosure.
2. **Gravity ad strip** (trygravity.ai) — contextual text-ad pinned above the footer, matched to the current spin result server-side via a Vercel Edge Function (`/api/ad`, key stays server-side). Custom grayscale renderer, impression fired on visibility, no-fill hides the slot. Gravity pixel loads unconditionally (accepted EU trade-off); privacy disclosures live in the `#legal` overlay.

No display banners, no email capture. Legal pages (publisher/host/privacy/affiliate/disclaimer) live in the overlay opened from the footer `legal` link; operator is an individual based in France (LCEN mentions légales apply).

## Non-goals (v1)
No sharing/copy buttons, no history, no lock/reroll-per-field, no backend. Single static SPA.
