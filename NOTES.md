# NOTES — Phase 1 Foundation (assumed by Phase 2)

## Run / build
- `npm run dev` — start Vite dev server
- `npm run build` — `tsc -b && vite build`
- Stack: React 18 (note: package currently resolves React 19 — see below), Vite, TypeScript, Tailwind CSS 3, Framer Motion, lucide-react. No router, no backend.

> React version note: `npm install` pulled React 19 (Vite template default). Code uses no React-19-only APIs and is compatible with React 18; if strict React 18 is required, run `npm i react@18 react-dom@18 @types/react@18 @types/react-dom@18`.

## Component props

### `<GlassPanel glow className ...divProps>` — `src/components/ui/GlassPanel.tsx`
- `glow?: 'blue' | 'green' | 'pink' | 'none'` (default `'none'`) — neon-edge hover/focus ring.
- Generic glass container: nav, modals, form containers, highlight chips. Max 2 stacked layers.

### `<GlassCard glow className ...divProps>` — same file
- Same props as GlassPanel + default `p-6`. Use for all cards across the 10 sections.

### `<Button variant href onClick ...>` — `src/components/ui/Button.tsx`
- `variant?: 'glass' | 'solid-neon'` (default `'glass'`).
- Renders `<a>` when `href` is set, else `<button>`. No dead buttons — always pass a real `href`/`onClick`.

### `<SectionWrapper id ariaLabel className>` — `src/components/layout/SectionWrapper.tsx`
- Centered `max-w-6xl`, `px-5 sm:px-8`, `py-16 md:py-24`, `scroll-mt-24`.
- `min-height: min(100vh, max-content)` — grows with content, never cramps.

### Other layout components
- `Navbar` (`components/layout/Navbar.tsx`) — fixed glass nav, anchor links, mobile menu (focus trap + Escape), includes `ThemeToggle` + `LanguageToggle`.
- `ScrollProgress` — fixed top neon `role="progressbar"`.
- `SplashScreen` — once-per-session brand reveal (~1.2s; 300ms fade under reduced motion), keyed on `sessionStorage 'dery-splash-shown'`.
- `Footer` — minimal glass footer (placeholder until Phase 4).

## Translation key convention — `src/i18n/locales/{en,id}.json`
- Namespaced `section.key`, e.g. `nav.home`, `hero.cta`, `motto.eyebrow`, `splash.tagline`, `a11y.skipToContent`.
- Never hardcode UI strings — use `useTranslation()` → `t('hero.cta')` (`src/context/LanguageContext.tsx`).
- Missing-ID keys fall back to English, then to the key itself. Persisted in `localStorage 'dery-lang'` (default `'en'`), graceful in-memory fallback.
- Theme persisted in `localStorage 'dery-theme'` (default dark), applied via `<html data-theme>` set synchronously in `index.html` (no flash).

## Where Phase 2 adds new section files
- New files go in `src/components/sections/`, one per section: `Experience.tsx`, `Projects.tsx`, (Phase 3: `Education.tsx`, `Achievements.tsx`, `Portfolio.tsx`; Phase 4: `Contact.tsx`, `Thanks.tsx`).
- `src/App.tsx` already contains empty stub `<section id="...">` anchors with `TODO: Phase N` comments — replace each stub's self-closing tag with the real component, keeping the same `id`.
- Reuse `SectionWrapper`, `GlassCard`, `Button`, `t('...')` keys (extend `en.json`/`id.json` with `experience.*`, `projects.*`, …), and `useReducedMotion` for all animation. Keep ≤4–5 simultaneous `backdrop-filter` elements per viewport.
- Design tokens: `src/styles/globals.css` (`--bg-*`, `--neon-*`, `--text-*`, `--glass-*`, `.glass`, `.glass-glow-*`); Tailwind maps them (`tailwind.config.js`: `colors.bg/neon/text/glass`, `fontFamily.display/body`, `fontSize.display-xl/lg/md/body/caption`).
- Hero portrait: real photo in place — `src/assets/images/Main-Images_Dery Andrian Pratama.png` (943×1286), imported + bundled by Vite (`Hero.tsx`), `fetchPriority="high"`, real alt text. Unused placeholder SVGs remain in `public/images/hero/`.

## Phase 2 additions (Sections 03–05)

- `Experience.tsx` + `ExperienceCard.tsx` (`components/sections/`) — vertical timeline, neon spine (left edge mobile, center desktop), alternating `<GlassCard>` nodes sliding in from alternating sides. `<ExperienceCard entry index>` takes `{ org, role, dateRange, summary, bullets[] }`; collapsed to summary on mobile, expanded by default on desktop (`matchMedia('(min-width: 768px)')`), toggle button with `aria-expanded`/`aria-controls`.
- `Projects.tsx` + `ProjectStoryBlock.tsx` — editorial alternating image/text story blocks (rise+scale reveal). `<ProjectStoryBlock entry index>` takes `{ name, role, duration, description, features[], tech[], image, fallbackImage, imageAlt, sourceUrl? }`. "View source" `<Button>` renders **only** when `sourceUrl` exists. Image paths use spec-named `/images/projects/<slug>-placeholder.jpg` with SVG fallback siblings (`*-placeholder.svg`); drop real photos at the `.jpg` paths (800×500, 16:10).
- `Education.tsx` — two side-by-side `<GlassCard>`s (stacked mobile), staggered scale-in, distinct from the timeline.
- i18n arrays: `useTranslation()` now also returns `ta(key): string[]` (see `getNestedArray` in `src/i18n/index.ts`, wired in `LanguageContext.tsx`). New keys: `experience.*` (eyebrow/title/showMore/showLess/roles.{abadJaya,bitTech,kedata}.*), `projects.*` (eyebrow/title/viewSource/items.{jagadAgro,mylifeco,suge,indochain}.*), `education.*`. Tech tags stay untranslated in component data (proper nouns).
- Phase 3 inserts at the remaining stubs in `App.tsx`: `#achievements`, `#portfolio` (then Phase 4: `#contact`, `#thanks`).
- Note: lucide brand icons (e.g. `Github`) are unavailable in the installed lucide-react version — use neutral icons (`ExternalLink`, etc.).

## Phase 3 additions (Sections 06–08)

- `Achievements.tsx` + `AchievementCard.tsx` — "trophy wall": animated stat counters (2 / 4 / 7) + three labeled groups. `<AchievementCard entry index>` takes `{ title, organizer, year, category: 'placement' | 'ranking' | 'incubation' }` with fixed accents (blue/green/pink). DSLaunchpad is categorized `incubation`, never a win. Entrance: staggered pop-in (scale), distinct from Phase 1/2 patterns.
- `Portfolio.tsx` + `PortfolioTile.tsx` + `Lightbox.tsx` — masonry (CSS columns) visual-only gallery, glass filter chips (`aria-pressed`), `.glass` tiles with hover/focus caption + always-visible caption on touch sizes. `<Lightbox entry onClose>` — Escape, click-outside, close button, focus trap, focus return, body scroll lock. Driven by `{ title, category, image, fallbackImage, alt }`; images lazy with reserved 4:3 boxes. Placeholders at `public/images/portfolio/<category>-placeholder.{jpg,svg}` (SVG is the real file; `.jpg` path is the future drop-in slot).
- `Contact.tsx` + `ContactForm.tsx` + `hooks/useContactForm.ts` — social icon-buttons are `href="#"` placeholders with `TODO` comments + `data-placeholder="true"`, no invented URLs (neutral lucide icons: Camera/Briefcase/Mail/Palette/Code). Form posts to **Formspree** via `VITE_FORMSPREE_FORM_ID` (see `.env.example` + setup comment in `ContactForm.tsx`). Unconfigured → labeled "not configured" notice, never fake success. States idle → loading (spinner, `aria-busy`, disabled submit) → success (confirmation + reset + send-another) / error (human-readable, retryable, raw errors only in console). Inline `role="alert"` errors linked via `aria-describedby`; submit disabled while invalid or loading.
- New i18n keys: `achievements.*` (item titles/organizers/years identical in both locales — facts), `portfolio.*`, `contact.*` (incl. `form.errors.*`, `sendAnother`). Key parity en↔id verified (157 keys, 0 missing).
- Phase 4 inserts at the last stub in `App.tsx`: `#thanks` (plus final perf/SEO/README pass).

## Phase 4 additions (Sections 09–10 + hardening)

- `Thanks.tsx` — closing statement (`thanks.*` keys), skewed stamp-style headline reveal, single `#contact` CTA, gradient fade into footer (no seam).
- `Footer.tsx` (rewritten, flat treatment) — brand mark, compact anchor nav (reuses `nav.*` keys), shared socials, dynamic-year copyright, back-to-top → `#hero` (`footer.backToTop` key).
- `SocialLinks.tsx` (`components/ui/`) — single shared placeholder set (`data-placeholder="true"`, TODO in file) used by Contact + Footer. Neutral lucide icons (brand icons don't exist in this lucide version).
- Hero anchor renamed `#home` → `#hero` (Navbar Home/brand + Footer all target `#hero`).
- `SectionWrapper` gained `labelledBy` (aria-labelledby); every titled section's `h2` (and hero `h1`) carries `<section>-heading` id. Motto keeps `aria-label`.
- Perf: below-fold sections + Lightbox are `React.lazy` chunks (7 + 1, verified in build output); fonts `display=swap` + stylesheet preload; all sub-fold images `loading="lazy"` with reserved ratios; contexts memoized (theme toggle doesn't re-render content tree; lang toggle re-renders strings only). Blur budget: photo/solid-bg frames use new `.glass-flat` (no `backdrop-filter`), on-photo overlays use `.on-photo` (dark scrim + light text in both themes) — simultaneous blurred elements stay ≤4–5 per viewport.
- SEO: title/description/author/OG/Twitter tags in `index.html`, single `h1`, `nav`/`main`/`footer` landmarks, favicon present.
- Verified: `npm run build` clean, `npm run preview` serves 200, en↔id key parity, no dead buttons (all `<button>` have handlers; social `href="#"` placeholders per spec), no `.env` present so the "not configured" form state is live at handover. No browser available in this environment, so Lighthouse + device-lab testing could not be run — see delivery summary.

## Fix round (post-Phase-4)

- Themed `::selection` (neon-blue on bg-primary, both themes) + `--on-neon` token (near-black in dark, white in light for AA on filled neons) applied to solid-neon Button, active LanguageToggle pill, active portfolio chip, skip link; new `--glow-green` token for the hero portrait ring. Audit result: only remaining hardcoded hex is the per-theme `theme-color` meta (correct by design); tile hover glow now uses themed `.glass-glow-blue`.
- Hero: two-line neon-green Tektur name (DERY/ANDRIAN, `hero.line1/line2`, sr-only `hero.fullName`), circular portrait overlapping the line seam, one-line `hero.tagline`, chevron anchor to `#motto` as the sole affordance. Removed `hero.eyebrow/badge/intro/cta/ctaSecondary/role*` keys.
- Motto: full-bleed parallax photo via the new SectionWrapper `background` slot (sibling of the content column, plain `absolute inset-0` — no viewport hacks), `useScroll` target attached to the real outer `<section>` via forwarded ref; photo fully visible with a universal (both-themes) gradient band + fixed white/neon text with drop shadows; static when reduced motion; quote reveal unchanged. Later: `.motto-fade` theme edge fades (solid `--bg-primary` top/bottom, 60% tint middle) + quote in theme neon-green (eyebrow stays neon-pink). Also removed Thanks' now-obsolete `!pb-8` override (padding lives on the section again).
- Experience: horizontal snap-scroll row (`overflow-x-auto`, `snap-mandatory`, keyboard-focusable region) + neon track with clickable per-card nodes; active node = nearest row center, highlighted with glow. `<ExperienceCard>` API unchanged (dot removed, reveal is now y-rise with index stagger).
- Projects: `ProjectStackCards`/`ProjectStackCardItem` — sticky-per-screen deck driven by vertical scroll (`useScroll` target `start start→end end`), cards slide in from the right (`x: 60%→-(index*4)%`) with scale-down + slight top fan; static vertical stack under reduced motion.
- Achievements: stats + group headings removed; 7 cards in one reverse-chron grid; `achievements.stats.*` keys removed (`categories.*` kept — still shown per card).
- Contact: `lg:grid-cols-[1.25fr_0.75fr]` (form left, social aside right; stacked mobile, form first). Netlify Forms: `form-name=contact` + honeypot via URL-encoded POST to `/`, hidden static mirror in `index.html`; Formspree code + `.env.example` deleted; `contact.form.notConfigured*` keys removed.
- Thanks: CTA button removed (statement only); `thanks.cta` keys removed.
