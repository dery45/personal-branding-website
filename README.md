# Dery Andrian Pratama — Personal Branding Website

Single-page personal branding site for **Dery Andrian Pratama, IT Project Manager & Technical Product Designer** (Yogyakarta, Indonesia). Ten sections on one scrolling page — Hero, Motto ("I stand by what I say, because that's my way of life."), Experience, Projects, Education, Achievements, Portfolio, Contact, Thank-You, Footer — with dark/light themes, English/Indonesian language toggle, glassmorphism design system, and scroll-aware motion throughout. **Frontend-only**: no backend, no database, no server code.

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
    layout/   Navbar, SplashScreen, ScrollProgress, SectionWrapper, Footer
    ui/       GlassPanel (GlassPanel/GlassCard), Button, ThemeToggle, LanguageToggle, SocialLinks
    sections/ Hero, PersonalMotto, Experience (+ExperienceCard), Projects (+ProjectStoryBlock,
              ProjectStackCards), Education, Achievements (+AchievementCard),
              Portfolio (+PortfolioTile, Lightbox), Contact (+ContactForm), Thanks
  context/    ThemeContext, LanguageContext (useTranslation: t() + ta() for arrays)
  hooks/      useReducedMotion, useScrollProgress, useContactForm
  i18n/locales/ en.json, id.json (namespaced section.key)
  styles/     globals.css (tokens, .glass/.glass-flat/.on-photo/.motto-fade, focus ring, grain)
public/images/ hero|projects/education/achievements/social/ (legacy placeholder SVGs)
src/assets/images/ hero portrait, parallax background, porfolio cover/ (real artwork, Vite-bundled)
```

Above-the-fold sections (Hero, Motto) load eagerly; all other sections plus the Lightbox are `React.lazy` code-split chunks.

## Design system (quick reference)

- Type: Playfair Display for titles/headings/quotes, Source Sans Pro for body/nav/buttons. Tektur appears in exactly two places — the navbar brand mark and the hero name.
- Color: blue accent only (`--neon-blue`; green/pink tokens remain defined but unused). Motto quote uses `--motto-ink`.
- Glass: `.glass` for static nav/cards/modals, `.glass-flat` for surfaces that animate every scroll frame (translating blurred layers forces a repaint per frame), `.on-photo` for text over imagery.

## Adding real assets

All artwork is real and bundled via Vite imports — no placeholders remain in the gallery:

| Slot | Path | Notes |
|---|---|---|
| Portrait | `src/assets/images/Main-Images_Dery Andrian Pratama.png` | 943×1286, `fetchPriority="high"` in Hero |
| Motto backdrop | `src/assets/images/parallax-background-1920.jpg` | web-sized copy of the 4K original |
| Portfolio covers | `src/assets/images/porfolio cover/<Name>-Cover.png` (~1440px+ wide) | one tile per item, `categories[]` drives filter matching, `details` + file link power the case modal |
| Project stories | reuse the portfolio covers (single source of truth; Suge POS stays `hidden: true`) | `Projects.tsx` |

Also update `og:image` in `index.html` once a real social cover exists (still a placeholder).

## Configuring the contact form (Netlify Forms)

No env vars, no secrets. The visible React form (`ContactForm`) posts URL-encoded
to `/` with `form-name=contact`; Netlify detects the form at build time via the
hidden static mirror in `index.html` (field `name`s must stay in sync).
A honeypot (`bot-field`) handles spam. Steps:

1. Deploy the built site on Netlify (forms are only captured there).
2. Submit the form once so Netlify registers it.
3. To receive submissions at **deryap.dap@gmail.com**: Site Settings → Forms →
   Form notifications → Add notification → Email notification → enter the
   address → save. Check submissions in the Netlify dashboard under Forms.
4. In local dev, a successful fetch just exercises the idle → loading → success UI.

## Theme / language

- Theme (`dark` default) and language (`en` default) persist in `localStorage` (`dery-theme`, `dery-lang`) with in-memory fallback when storage is blocked; theme is applied pre-paint via an inline script in `index.html` (no flash).
- Never hardcode UI strings — use `t('section.key')` (or `ta('section.key')` for string arrays). Add keys to **both** `en.json` and `id.json` (key parity is checked the same way Phase 3 did: every `en` key must exist in `id`). Footer nav labels intentionally reuse the `nav.*` keys as the single source of truth.

## Placeholder vs. real content

**Live:** all 16 portfolio items with real covers, hero portrait, real social URLs (Instagram/LinkedIn/Gmail/Behance/GitHub), project story images (shared with portfolio), contact form (Netlify).
**Still placeholder:** `og:image` social cover, Suge POS story (hidden via flag, data kept).
**Real (do not alter or invent beyond):** all Experience/Projects/Education/Achievements facts, dates, titles, outcomes, and GitHub source URLs.
