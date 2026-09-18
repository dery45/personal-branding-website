import { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionWrapper } from '../layout/SectionWrapper';
import { PortfolioTile, type PortfolioEntry } from './PortfolioTile';

// Lightbox is only needed after a tap — keep it out of the initial bundle.
const Lightbox = lazy(() => import('./Lightbox').then((m) => ({ default: m.Lightbox })));

const CATEGORIES = ['websites', 'dashboards', 'uiux', 'mobile', 'dataviz', 'product'];

/**
 * SECTION 07 — Portfolio Showcase (visual-first browsing only; no repeated Section 04 copy).
 * Masonry gallery of glass-framed tiles with category filter chips + glass lightbox.
 * All artwork is placeholder until real pieces are supplied.
 */
export function Portfolio() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const entries: PortfolioEntry[] = useMemo(
    () =>
      CATEGORIES.map((c) => ({
        title: t(`portfolio.items.${c}.title`),
        category: c,
        categoryLabel: t(`portfolio.filters.${c}`),
        image: `/images/portfolio/${c}-placeholder.jpg`,
        fallbackImage: `/images/portfolio/${c}-placeholder.svg`,
        alt: t(`portfolio.items.${c}.alt`),
      })),
    [t],
  );

  const visible = useMemo(
    () => (filter === 'all' ? entries : entries.filter((e) => e.category === filter)),
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
        <p className="text-caption font-bold uppercase tracking-[0.35em] text-neon-green">
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
                  ? 'border-transparent bg-neon-green text-[var(--on-neon)]'
                  : 'border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-secondary hover:border-neon-green hover:text-text-primary'
              }`}
            >
              {t(`portfolio.filters.${c}`)}
            </button>
          );
        })}
      </div>

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {visible.map((entry) => (
          <PortfolioTile
            key={entry.category}
            entry={entry}
            index={CATEGORIES.indexOf(entry.category)}
            onOpen={openAt}
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
