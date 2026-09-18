# Dery Andrian Pratama — Personal Branding Website

Single-page personal branding site for **Dery Andrian Pratama, IT Project Manager & Technical Product Designer** (Yogyakarta, Indonesia). Ten sections on one scrolling page — Hero, Motto, Experience, Projects, Education, Achievements, Portfolio, Contact, Thank-You, Footer — with dark/light themes, English/Indonesian language toggle, glassmorphism design system, and scroll-aware motion throughout. **Frontend-only**: no backend, no database, no server code.

## Tech stack

- React 18-compatible code + Vite + TypeScript (template currently resolves React 19 — see note in `NOTES.md`)
- Tailwind CSS 3 (design tokens mapped from CSS variables) + custom glass utilities
- Framer Motion (scroll reveals, micro-interactions) + lucide-react icons
- No router (in-page anchors), no backend; contact form is captured by Netlify Forms

## Commands

```bash
npm install     # install dependencies
npm run dev     # start dev server
npm run build   # typecheck + production build (outputs dist/)
npm run preview # serve the production build locally
```

## Folder structure

```
src/
  components/
    layout/   Navbar, SplashScreen, ScrollProgress, SectionWrapper, Footer, Thanks? (no — sections/)
    ui/       GlassPanel (GlassPanel/GlassCard), Button, ThemeToggle, LanguageToggle, SocialLinks
    sections/ Hero, PersonalMotto, Experience (+ExperienceCard), Projects (+ProjectStoryBlock),
              Education, Achievements (+AchievementCard), Portfolio (+PortfolioTile, Lightbox),
              Contact (+ContactForm), Thanks
  context/    ThemeContext, LanguageContext (useTranslation: t() + ta() for arrays)
  hooks/      useReducedMotion, useScrollProgress, useContactForm
  i18n/locales/ en.json, id.json (namespaced section.key)
  styles/     globals.css (tokens, .glass/.glass-flat/.on-photo, focus ring, grain)
public/images/ hero|experience|projects|education|achievements|portfolio|social/
```

Above-the-fold sections (Hero, Motto) load eagerly; all other sections plus the Lightbox are `React.lazy` code-split chunks.

## Adding real assets

Drop files at the documented paths (keep the same aspect ratios to avoid layout shift):

| Slot | Path | Size |
|---|---|---|
| Portrait | `public/images/hero/portrait-placeholder.jpg` | 600×800 (3:4) |
| Projects | `public/images/projects/<slug>-placeholder.jpg` | 800×500 (16:10), slugs: `jagad-agro`, `mylifeco`, `suge-pos`, `indochain` |
| Portfolio | `public/images/portfolio/<category>-placeholder.jpg` | 600×450 (4:3), categories: `websites`, `dashboards`, `uiux`, `mobile`, `dataviz`, `product` |

Each `.jpg` has an SVG sibling as automatic fallback (swapped in via `onError`), plus a dev-only "Add portrait here" outline on the hero slot. Also update `og:image` in `index.html` once a real cover exists.

## Configuring the contact form (Netlify Forms)

No env vars, no secrets. The visible React form (`ContactForm`) posts URL-encoded
to `/` with `form-name=contact`; Netlify detects the form at build time via the
hidden static mirror in `index.html` (field `name`s must stay in sync).
A honeypot (`bot-field`) handles spam. Steps:

1. Deploy the built site on Netlify (forms are only captured there).
2. In local dev, a successful fetch just exercises the idle → loading → success UI.
3. Check submissions in the Netlify dashboard under Forms.

## Theme / language

- Theme (`dark` default) and language (`en` default) persist in `localStorage` (`dery-theme`, `dery-lang`) with in-memory fallback when storage is blocked; theme is applied pre-paint via an inline script in `index.html` (no flash).
- Never hardcode UI strings — use `t('section.key')` (or `ta('section.key')` for string arrays). Add keys to **both** `en.json` and `id.json` (key parity is checked the same way Phase 3 did: every `en` key must exist in `id`). Footer nav labels intentionally reuse the `nav.*` keys as the single source of truth.

## Placeholder vs. real content

**Placeholder (must be replaced):** all project/portfolio images (`*-placeholder.*`), all five social links (`href="#"` + `data-placeholder="true"` in `src/components/ui/SocialLinks.tsx`, shared by Contact + Footer), `og:image`.
**Real:** hero portrait, all Experience/Projects/Education/Achievements facts, dates, titles, outcomes, and both GitHub source URLs — do not alter or invent beyond them.
