# DESIGN.md — Vibe Roulette visual system

## World
Monochrome editorial-terminal. A near-black page where typography is the only material. The aesthetic sits between a Swiss poster and a code editor: huge grotesque display type for results, tiny tracked mono labels for everything structural. Grayscale only — hierarchy comes from size, weight, and four gray steps, never color. The category default (neon casino glow) is explicitly refused.

## Color strategy
Restrained, grayscale-only. Dark is committed (`color-scheme: dark` on `:root` + meta). Tokens:
- `--bg: #0a0a0a` (page), `--bg-raised: #131313` (hover surfaces)
- `--text: #ededed`, `--text-dim: #9a9a9a`, `--text-faint: #7a7a7a` (~4.6:1 — informative microcopy only)
- `--text-ghost: #4a4a4a` (decorative only: placeholder dashes, flavor text)
- `--line: #242424`, `--line-strong: #3d3d3d`
Inversion (white ground / black text) is the strongest state in the system: the spin button's hover, text selection, and the offer button's resting fill.

## Type
- Display/results/headings: **Space Grotesk** (400/500/700). Results set large via clamp; tight leading.
- Labels, meta, footer, button sublabels: **IBM Plex Mono** (400/500), uppercase, letter-spaced ~0.14em, small sizes.
- No third family. Body copy is rare; when present it is mono at readable size.

## Layout
Single centered column, max-width ~44rem. Header row (wordmark left, stat right) and footer row (mono, muted) pin the composition top and bottom; the middle owns the action. Generous vertical rhythm; hairline rules (`--line`) separate zones. Mobile: same column, fluid type via clamp.

## Components
- **SpinButton**: pill, 1px `--line-strong` border, transparent ground, display font, uppercase. Hover/focus inverts to white/black. Active scales to 0.98. Focus-visible ring in `--text-dim`. Reads `Spinning…` with `aria-busy` while a spin runs.
- **Toggles**: mono microcopy buttons (`twists:`, `sound:`) grouped in one row under the spin hint; `aria-pressed`, persisted; min-height 40px tap targets. On-state is brighter than off; switching twists on plays a one-shot soft glow pulse (~900ms) that settles back to flat — no steady luminescence.
- **Offer CTA**: after reveal, a filled white pill (`BUILD IT TONIGHT — 20% OFF ↗`) with the referee discount in the label and an `(on Bolt · affiliate link)` mono note beneath. The only filled element at rest, making it the primary post-reveal action; `rel="sponsored noopener noreferrer"`.
- **AdStrip**: contextual Gravity text-ad pinned above the footer — hairline top rule, `SPONSORED` micro-label, then favicon · brand · adText · CTA in one mono row. Custom renderer in site grammar (no network component styles); impression pixel fired once on visibility; slot collapses silently on no-fill.
- **LegalOverlay**: full-screen `#legal` hash-routed dialog in the same grayscale mono grammar — hairline-ruled sections (Publisher / Hosting / Privacy / Affiliate / Disclaimer), Esc + `close ×` to exit. Opened from a footer `legal` link styled like the toggles.
- **ResultBoard**: two label/value rows (`NICHE`, `PRODUCT`) + optional third row (`TWIST`) + assembled sentence in `--text-dim`. Twist row is set smaller and dimmer than the main two (lower visual priority) and is controlled by the twists toggle. Ghost state before first spin shows dimmed em-dash placeholders so layout never jumps.
- **Header/Footer**: mono microcopy only.

## Fonts
Self-hosted woff2 in `/public/fonts` (Space Grotesk 400/500/700, IBM Plex Mono 400/500, latin subsets) declared via `@font-face` with `font-display: swap`. No font CDN requests. The Gravity ad stack (pixel + ad fetch) is the site's only third-party surface; everything else loads from origin.

## Sound & favicon
Optional tick sounds (quiet 30ms blips per cycle step, soft low thock on each landing) behind a persisted `sound: on/off` toggle, default on; WebAudio context is created lazily on first spin. While spinning, the tab favicon swaps through 8 rotated wheel frames (~120ms) and restores on reveal; skipped under reduced motion.

## Motion
One idea: the slot-machine settle. During a spin, values cycle with slight blur + reduced opacity; each field decelerates and lands with a short blur-to-sharp rise (~240ms). Fields land staggered: niche (~1.15s), product (~1.65s), twist (~2.05s, only when enabled). Spacebar triggers spin. `prefers-reduced-motion`: no cycling, instant reveal. Nothing else on the page moves except opacity/border transitions ≤160ms.

## Accessibility floor
Result announced via visually-hidden `aria-live="polite"` region. Button disabled during spin. Contrast: body text ≥ 4.5:1 against `--bg`; `--text-faint` reserved for decorative microcopy.
