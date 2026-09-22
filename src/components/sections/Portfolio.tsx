import { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionWrapper } from '../layout/SectionWrapper';
import { PortfolioTile, type PortfolioEntry } from './PortfolioTile';
import cuancraftCover from '../../assets/images/porfolio cover/cuancraft-UX Case study-Cover.png';
import jagoCover from '../../assets/images/porfolio cover/JAGO-COVER.png';
import pointCover from '../../assets/images/porfolio cover/Point-property Cover.png';

// Case-study files are hosted on Google Drive (not bundled).
const CUANCRAFT_PDF_URL =
  'https://drive.google.com/file/d/1yZ96h5Q90Mb_jgFiiIFDMBj3H0dahX25/view?usp=sharing';
const JAGAD_DRIVE_URL =
  'https://drive.google.com/file/d/1-86mP4OLNjsMoTBSzOjhhdZZ3-mnV0yZ/view?usp=sharing';
const POINT_DRIVE_URL =
  'https://drive.google.com/file/d/1uUgzXAprqxZ-pQK4JOZj-UMj3Q392IRO/view?usp=sharing';

// Lightbox is only needed after a tap — keep it out of the initial bundle.
const Lightbox = lazy(() => import('./Lightbox').then((m) => ({ default: m.Lightbox })));

const CATEGORIES = ['websites', 'dashboards', 'uiux', 'mobile', 'dataviz', 'product'];

/**
 * SECTION 07 — Portfolio Showcase (visual-first browsing only; no repeated Section 04 copy).
 * Masonry gallery of glass-framed tiles with category filter chips + glass lightbox.
 * All artwork is placeholder until real pieces are supplied.
 */
export function Portfolio() {
  const { t, ta } = useTranslation();
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const entries: PortfolioEntry[] = useMemo(() => {
    const placeholder = (c: string): PortfolioEntry => ({
      id: `placeholder-${c}`,
      title: t(`portfolio.items.${c}.title`),
      category: c,
      categoryLabel: t(`portfolio.filters.${c}`),
      categories: [c],
      image: `/images/portfolio/${c}-placeholder.jpg`,
      fallbackImage: `/images/portfolio/${c}-placeholder.svg`,
      alt: t(`portfolio.items.${c}.alt`),
    });
    return [
      placeholder('websites'),
      placeholder('dashboards'),
      {
        // Real portfolio item: CuanCraft UX case study (cover + details + Drive PDF).
        id: 'cuancraft',
        title: t('portfolio.items.uiux.title'),
        category: 'uiux',
        categoryLabel: t('portfolio.filters.uiux'),
        categories: ['uiux'],
        image: cuancraftCover,
        alt: t('portfolio.items.uiux.alt'),
        pdf: CUANCRAFT_PDF_URL,
        details: {
          name: t('portfolio.items.uiux.name'),
          year: t('portfolio.items.uiux.year'),
          team: t('portfolio.items.uiux.team'),
          description: ta('portfolio.items.uiux.description'),
        },
      },
      {
        // Real portfolio item: Jagad Agro Wonoboyo — spans website, dashboard,
        // UI/UX and product design (PM + UI/UX + full-stack role).
        id: 'jagad-agro',
        title: t('portfolio.items.jagad.title'),
        category: 'websites',
        categoryLabel: t('portfolio.filters.websites'),
        categories: ['websites', 'dashboards', 'uiux', 'product'],
        image: jagoCover,
        alt: t('portfolio.items.jagad.alt'),
        pdf: JAGAD_DRIVE_URL,
        pdfLabel: t('portfolio.viewPortfolio'),
        details: {
          name: t('portfolio.items.jagad.name'),
          year: t('portfolio.items.jagad.year'),
          team: t('portfolio.items.jagad.team'),
          description: ta('portfolio.items.jagad.description'),
        },
      },
      placeholder('mobile'),
      placeholder('dataviz'),
      {
        // Real portfolio item: Point Property Solo (UI/UX redesign) + Drive file.
        id: 'point-property',
        title: t('portfolio.items.point.title'),
        category: 'uiux',
        categoryLabel: t('portfolio.filters.uiux'),
        categories: ['uiux'],
        image: pointCover,
        alt: t('portfolio.items.point.alt'),
        pdf: POINT_DRIVE_URL,
        pdfLabel: t('portfolio.viewPortfolio'),
        details: {
          name: t('portfolio.items.point.name'),
          year: t('portfolio.items.point.year'),
          team: t('portfolio.items.point.team'),
          description: ta('portfolio.items.point.description'),
        },
      },
      placeholder('product'),
    ];
  }, [t, ta]);

  const visible = useMemo(
    () => (filter === 'all' ? entries : entries.filter((e) => e.categories.includes(filter))),
    [entries, filter],
  );

  const openAt = useCallback(
    (i: number) => {
      const entry = visible[i];
      if (entry) setOpenIndex(entries.indexOf(entry));
    },
    [visible, entries],
  );

  return (
    <SectionWrapper id="portfolio" labelledBy="portfolio-heading">
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: reduced ? 0.05 : 0.5 }}
        className="mb-8 text-center"
      >
        <p className="text-caption font-bold uppercase tracking-[0.35em] text-neon-blue">
          {t('portfolio.eyebrow')}
        </p>
        <h2 id="portfolio-heading" className="font-display mt-3 text-display-lg font-extrabold text-text-primary">
          {t('portfolio.title')}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-text-secondary">{t('portfolio.note')}</p>
      </motion.div>

      {/* Filter chips */}
      <div role="group" aria-label={t('portfolio.title')} className="mb-8 flex flex-wrap justify-center gap-2">
        {['all', ...CATEGORIES].map((c) => {
          const active = filter === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-2 text-caption font-bold uppercase tracking-widest transition-all ${
                active
                  ? 'border-transparent bg-neon-blue text-[var(--on-neon)]'
                  : 'border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-secondary hover:border-neon-blue hover:text-text-primary'
              }`}
            >
              {t(`portfolio.filters.${c}`)}
            </button>
          );
        })}
      </div>

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {visible.map((entry, i) => (
          <PortfolioTile
            key={entry.id}
            entry={entry}
            index={CATEGORIES.indexOf(entry.category)}
            onOpen={() => openAt(i)}
          />
        ))}
      </div>

      <Suspense fallback={null}>
        <Lightbox
          entry={openIndex !== null ? entries[openIndex] ?? null : null}
          onClose={() => setOpenIndex(null)}
        />
      </Suspense>
    </SectionWrapper>
  );
}
