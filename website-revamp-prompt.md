# Habacus website revamp — coding agent brief

You are working in the `habacus-website` repo (Next.js, TypeScript, Tailwind v4). Your job is to evolve the existing landing page into a higher-converting site while protecting its "quiet luxury, but approachable and modern" brand. The current site is well-built — do not throw it away. Extend it.

## Read first (non-negotiable)

- Read `AGENTS.md` / `CLAUDE.md`. This is a modified Next.js — **read the relevant guide in `node_modules/next/dist/docs/` before writing any Next-specific code.** Heed deprecation notices.
- Read the existing components in `components/` and the design tokens in `app/globals.css` and `lib/accents.ts`. Reuse the existing token system, Tailwind classes, font variables (`font-display`, `font-serif`, `font-eyebrow`, `font-mono`), and the accent/gemstone system. Do not introduce new fonts (keep the current five).
- Do not break the WebGL hero abacus (`components/Hero3DAbacus.tsx`), the accent switcher, or the accent bootstrap script.

## Brand & copy rules (apply to ALL copy you write)

1. **Sell what it has, never what it lacks.** No negative framing. Ban phrases like "not a tracker", "no streaks", "no guilt", "don't". If you're tempted to contrast against competitors, rewrite as a positive statement about Habacus.
2. **Kill the AI smell.** Minimise em-dashes (max one per section, ideally zero). Avoid abstract filler ("a ritual companion for consistency"). Be concrete and specific. Vary sentence rhythm.
3. **Break the template.** Every section currently uses the same skeleton (tiny uppercase eyebrow → big serif headline → one serif sentence). Give each section a **distinct layout**. Do not repeat the same structure three times in a row.
4. **"Private beta" appears at most once** on the whole page (in the Early Access section).
5. Voice: quiet, confident, tactile, a little mysterious. Approachable and modern, not stuffy. Slang is used sparingly and natively (e.g. "lock in") — never forced, never emoji-spam.
6. Keep the company as **Ascension Labs** only. No founder name, no face, no story. Keep it slightly mysterious.

## Palette: warm it up

Shift the neutral tokens in `app/globals.css` from cool near-black toward a **warm off-black** with more character, keeping the gemstone accents and overall matte, calm feel. Nudge `--background`, `--background-raised`, `--background-panel`, and the muted/faint foregrounds a few points toward warm (add red/yellow, reduce blue). Keep contrast accessible (WCAG AA for body text). Consider a very subtle warm ambient glow near the top of the page. Keep it tasteful and quiet — this is a nudge, not a redesign. Verify the gemstone accents still read well against the new base.

## Motion: make it feel tactile

Add smooth scroll-reveal animations so sections and grid items ease into view as you scroll (fade + slight upward translate, subtle stagger on grids like the steps and FAQ). Use a lightweight approach (CSS + `IntersectionObserver`); **do not** add a heavy animation dependency unless one is already installed. Respect `prefers-reduced-motion` (already handled globally — extend the pattern, don't fight it). Keep it 60fps, no layout shift (CLS), no jank on mobile. The goal is that the whole page feels as tactile as the abacus.

## Page structure (top to bottom)

Each section gets a **different layout**. Proposed copy below is the approved copy — implement it as written unless a small tweak is needed for fit.

### 1. Nav (existing — minor change)
Keep as-is, but the **"Early access" CTA opens the waitlist modal** (see §Waitlist) instead of only scrolling.

### 2. Hero (leads with the ritual / the object)
Centered, keep the WebGL abacus + accent switcher.
- Headline: **Make your habits count.**
- Subhead: **An abacus for your habits. Tap once a day, feel the bead slide home, and watch your week take shape.**
- Primary CTA: **Join early access** → opens waitlist modal.
- Secondary CTA: **See how it works** → scrolls to How it works.
- Replace the "Currently in private beta on iOS" microcopy with a subtle line that carries the **live waitlist count** and drops "private beta": e.g. **On iOS · 2,847 already sliding** (count comes from the waitlist module, §Waitlist).

### 3. Philosophy (expand — left-aligned, asymmetric)
Keep the eyebrow "Philosophy" and headline **Ritualise your lock-in** (keep — it's on-brand). Replace the single thin sentence with two short, concrete paragraphs:
- "Every habit becomes a rod on your abacus. Each day you show up, a bead slides across the wire and settles into place. Small, physical, quietly satisfying."
- "It turns consistency into something you can feel, hold, and watch grow."

### 4. Who it's for (NEW — identity hook, compact band, distinct treatment)
- Eyebrow: **Who it's for**
- Headline: **For people building something.**
- Body: "You're a student, a founder, an early-something with big plans and a to-do list that never sleeps. Habacus keeps the habits that keep you — training, reading, sleep, deep work — in one place you actually want to open."
(One em-dash max; if you can lose it, do.)

### 5. How it works (keep 4 steps — redesign the layout + animate reveals)
Redesign away from the plain 4-column grid (e.g. an alternating or vertical-timeline treatment) and stagger the reveal. Eyebrow "How it works", headline **Four small moments a day.** Steps:
- **01 — Add your habits:** "Give each one a name and an icon. Every habit becomes a rod on your abacus."
- **02 — Tap today's bead:** "One tap and the glowing bead slides across the wire into place, with a gentle haptic. Another day, balanced."
- **03 — Watch your week take shape:** "Each rod holds your last seven days. Completed days gather to one side of the separator, so you feel your whole week at a glance." (Remove the old "No streaks to break" line entirely — negative framing.)
- **04 — Check in with your people:** "A quiet, tailored feed of the friends you actually want in your corner. React, or send a nudge."

### 6. Social feature (NEW — half-and-half: text left, iPhone mockup right)
The unique Gen-Z hook. Text on the left, an **iPhone device frame on the right containing a labelled placeholder screen** (build the device frame properly; make the screen trivially swappable for a real screenshot later — e.g. a single `<Image>`/slot). Stacks vertically on mobile.
- Eyebrow: **With your people**
- Headline: **Let your circle see you show up.**
- Body: "Share your progress with a handful of friends in a feed that's calm by design. You choose exactly which habits each person sees, so the gym crew get your training and the rest stays yours. Accountability, on your terms."

### 7. Share your abacus (NEW — shareability play #1: the card)
Invite the story-share using the existing shader.
- Eyebrow: **Show it off**
- Headline: **An abacus worth showing off.**
- Body: "Pick your gemstone, watch your week fill in, and drop it straight to your story."
- Action: a **"Share your abacus"** button that exports an image of the current web abacus (with the selected gemstone) and offers native share on mobile (`navigator.share`) plus a PNG download fallback. Implementation note: the hero canvas may need `preserveDrawingBuffer: true`, or render the abacus to an offscreen canvas / compose a captioned card canvas for export. Keep the export good-looking (padding, wordmark, caption). Don't regress hero performance — if `preserveDrawingBuffer` hurts, render a separate export canvas on demand.

### 8. Early access (waitlist — the one place "private beta" may appear)
Centered. Keep the approved warm CTA copy.
- Eyebrow: **Early access**
- Headline: **Come in early.**
- Line: "We're opening Habacus to a small group before the wider iOS launch." (this is the single allowed "private beta"-adjacent mention)
- Body: "Say hello and we'll be in contact when a seat's available."
- CTA: **Request early access** → opens waitlist modal.
- Keep the footnote: "Built by Ascension Labs, a small studio working on quieter, calmer software."

### 9. FAQ (NEW — accordion, staggered reveal)
Eyebrow "Questions", short headline. Accessible accordion (keyboard + aria). Content:
- **What does Habacus cost?** — "Habacus is free to start. We'll share more on pricing closer to launch."
- **When can I get in?** — "We let people in a group at a time. Join the list and we'll be in contact when a seat's available."
- **Can I choose what my friends see?** — "Yes. You set the visibility on every habit, friend by friend. Share your training and keep the rest to yourself."
- **Is my data private?** — "Your habits are yours. You decide what's shared and with whom, and the default is private."
- **Is there an Android version?** — "Habacus starts on iOS. Android is on the map."
- **What if I miss a day?** — "Your week keeps its shape and the bead waits for you. Streaks are there if you want them, tucked away if you don't." (Note: the app has an *optional* streak — keep it light, positive, never the headline.)

### 10. Footer (existing — fix the tagline)
Replace "A ritual companion for consistency — not a tracker. Every bead you place is a day you showed up." (AI-smell + negative) with: **"Make your habits count. Every bead you place is a day you showed up."** Keep the rest.

## Waitlist (modal + mock backend + referral)

- Build a **modal** triggered by every "Join / Request early access" CTA (nav, hero, early-access section). Fields: **first name, last name, email**. Validate, show inline errors, disabled state while submitting.
- On success: show a confirmation state using the approved voice ("You're on the list. We'll be in contact when a seat's available.") and reveal **shareability play #2 — referral / skip-the-queue**: a generated personal link (e.g. `https://habacus.app/?ref=<id>`), a copy-link button, and native share, with copy like "Jump the queue — every friend who joins moves you up." (Rewrite that one positively if needed; the mechanic is: sharing bumps you up.)
- **Mock the backend.** Put all of it in a single swappable module, `lib/waitlist.ts`, exporting e.g. `getWaitlistCount()` and `submitWaitlist(data)`. Seed a believable count (~2,800) and simulate a successful submit + returned ref id. Add a clear `// TODO: wire to real backend` marker. Nothing is actually persisted or sent. The hero count and any count display read from this module.
- Accessibility: focus trap, `Esc` closes, restores focus to trigger, `aria-modal`, labelled inputs, keyboard operable. Respect reduced motion for the open/close transition.

## Metadata

Update `app/layout.tsx` `metadata` (title/description/OG) to reflect the new positive positioning and remove "not a habit tracker / no streaks, no guilt". Suggested description: "Habacus is an abacus for your habits. Tap a bead each day, watch your week take shape, and let your friends cheer you on. On iOS."

## Quality bar / acceptance criteria

- `npm run build` and lint pass clean. TypeScript strict, no `any` regressions.
- Fully responsive, mobile-first. The half-and-half section stacks; the modal is usable on small screens.
- No CLS from the scroll animations; `prefers-reduced-motion` fully respected everywhere.
- Accent switcher and hero shader still work across all gemstones; new sections pick up the accent via existing CSS vars.
- No new heavy dependencies without justification. Match existing code style and token usage.
- All copy obeys the brand & copy rules above (re-read them before final pass): sell the positives, minimal em-dashes, one "private beta" mention, distinct layout per section.
- Keep the iPhone mockup a clearly-labelled placeholder that a real screenshot can replace with a one-line change.

## Out of scope

Real waitlist backend, real referral tracking, real app screenshots, testimonials, human/founder story. Leave clean seams for all of these.
