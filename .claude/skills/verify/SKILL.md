---
name: verify
description: Build, run, and drive the Habacus marketing site to verify changes end-to-end.
---

# Verifying habacus-website

Static Next.js 16 marketing site; no test suite. Verification = build, serve, drive in a browser.

## Build & serve

```bash
npm run build            # Turbopack + TypeScript; must pass clean
PORT=3457 npm run start  # production server (background it)
npm run lint             # plain eslint (next lint was removed in Next 16)
```

## Drive

No Playwright in the repo. Use the npx cache install (has Chromium downloaded):

```js
import { chromium } from "file:///Users/hardivhk/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
```

If that path is gone, `npx playwright --version` re-resolves a cache entry under `~/.npm/_npx/*/node_modules/playwright`.

## Flows worth driving

- Hero: warm background `rgb(12, 10, 8)`, WebGL abacus canvas, waitlist count microcopy.
- Waitlist modal (nav "Early access", hero "Join early access", "Request early access"): empty submit → 3 inline errors; valid submit → success + referral link; Esc/backdrop close; focus returns to trigger; state persists on reopen.
- Accent switcher (top-right marble): pick a gem → `--gold` var changes, hero beads recolor.
- "Share your abacus" button → headless has no `navigator.share`, so expect a `download` event (`habacus-<gem>.png`); save and eyeball the card.
- FAQ accordion: `aria-expanded` toggling, keyboard Enter works.
- Scroll reveals: `.reveal` elements gain `.is-revealed`; with `javaScriptEnabled: false` content must still be visible (hidden state is gated on `html[data-accent]` set by the accent bootstrap script).
- Contexts to try: `reducedMotion: "reduce"`, 390×844 mobile.

## Gotchas

- JSX copy uses straight apostrophes (`&apos;`); string-literal copy (FAQ/steps data) uses typographic `’` — match when writing text locators, or use regexes.
- `getByRole("button", { name: "Early access" })` matches three CTAs; use `exact: true`.
- The first `<canvas>` in the DOM is the nav accent-switcher marble, not the hero abacus.
- Full-page screenshots paint the sticky nav mid-page; artifact, not a bug.
