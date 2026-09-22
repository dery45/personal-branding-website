import { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionWrapper } from '../layout/SectionWrapper';
import { PortfolioTile, type PortfolioEntry } from './PortfolioTile';
import cuancraftCover from '../../assets/images/porfolio cover/cuancraft-UX Case study-Cover.png';
import jagoCover from '../../assets/images/porfolio cover/JAGO-COVER.png';
import pointCover from '../../assets/images/porfolio cover/Point-property Cover.png';
import mylifecoCover from '../../assets/images/porfolio cover/MyLifeCo-Cover.png';
import langkahmuCover from '../../assets/images/porfolio cover/Langkahmu-Cover.png';
import jaghutCover from '../../assets/images/porfolio cover/JagHut Cover.png';
import bkdCover from '../../assets/images/porfolio cover/BKD-Jakarta-Cover.png';
import bkdCilacapCover from '../../assets/images/porfolio cover/BKD-Cilacap Cover.png';
import uangkuCover from '../../assets/images/porfolio cover/Uangku-Cover.png';
import politisimeterCover from '../../assets/images/porfolio cover/politismeter-cover.png';
import procastinationCover from '../../assets/images/porfolio cover/Procas-cover.png';
import indomabsCover from '../../assets/images/porfolio cover/Indomabs-cover.png';
import sugiCover from '../../assets/images/porfolio cover/SUGI-Cover.png';
import analisaCafeCover from '../../assets/images/porfolio cover/Analisa-cafe-cover.png';
import tomCover from '../../assets/images/porfolio cover/Report-Tom-Cover.png';
import indochainCover from '../../assets/images/porfolio cover/indochain-cover.png';

// Case-study files are hosted on Google Drive (not bundled).
const CUANCRAFT_PDF_URL =
  'https://drive.google.com/file/d/1yZ96h5Q90Mb_jgFiiIFDMBj3H0dahX25/view?usp=sharing';
const JAGAD_DRIVE_URL =
  'https://drive.google.com/file/d/1-86mP4OLNjsMoTBSzOjhhdZZ3-mnV0yZ/view?usp=sharing';
const POINT_DRIVE_URL =
  'https://drive.google.com/file/d/1uUgzXAprqxZ-pQK4JOZj-UMj3Q392IRO/view?usp=sharing';
const MYLIFECO_DECK_URL =
  'https://drive.google.com/file/d/1NoIcelhL0M-9xhnBrk1Wf8XUZkUAe0Kk/view?usp=sharing';
const LANGKAHMU_BEHANCE_URL = 'https://www.behance.net/gallery/208940999/Langkahmu-Career-Planning-Education-Pathway-App';
const JAGHUT_DRIVE_URL =
  'https://drive.google.com/file/d/14pNDpcia8ewW9PR6st_5_WeldTkoENpS/view?usp=sharing';
const BKD_DRIVE_URL =
  'https://drive.google.com/file/d/1RGhx-AZaMBmJUJ5Kjy8v1mJbf07OsiDN/view?usp=sharing';
const UANGKU_DRIVE_URL =
  'https://drive.google.com/file/d/18XdIuSZBk37GtVs_xVjmwMl1Goc0jEG6/view?usp=sharing';
const POLITISIMETER_URL = 'https://politisimeter.netlify.app/';
const PROCASTINATION_URL = 'https://procastination.netlify.app/';
const INDOMABS_URL = 'https://indomaps.netlify.app/';
const SUGI_URL = 'https://sugiecosystem.cloud/';
const ANALISA_CAFE_DRIVE_URL =
  'https://drive.google.com/file/d/1EwFMfEx1iOazJFAqnlWrwmlIQk2Epdg0/view?usp=sharing';
const TOM_DRIVE_URL =
  'https://drive.google.com/file/d/1jndg5zwB1zd_wU4TJ6SpE1kglggpADJW/view?usp=sharing';
const INDOCHAIN_DRIVE_URL =
  'https://drive.google.com/file/d/1PmXBGaWpD8IC28y1bW7T5gLvyfZ5m3QF/view?usp=sharing';

// Lightbox is only needed after a tap — keep it out of the initial bundle.
const Lightbox = lazy(() => import('./Lightbox').then((m) => ({ default: m.Lightbox })));

const CATEGORIES = ['websites', 'dashboards', 'uiux', 'ai', 'dataviz', 'product'];

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

  // Gallery is sorted newest-first by project year; every tile is real work —
  // no placeholders remain. Each entry declares all filter categories it spans.
  const entries: PortfolioEntry[] = useMemo(() => {
    const item = (
      id: string,
      key: string,
      primary: string,
      categories: string[],
      image: string,
      pdf?: string,
      pdfLabel?: string,
    ): PortfolioEntry => ({
      id,
      title: t(`portfolio.items.${key}.title`),
      category: primary,
      categoryLabel: t(`portfolio.filters.${primary}`),
      categories,
      image,
      alt: t(`portfolio.items.${key}.alt`),
      ...(pdf ? { pdf, pdfLabel } : {}),
      details: {
        name: t(`portfolio.items.${key}.name`),
        year: t(`portfolio.items.${key}.year`),
        team: t(`portfolio.items.${key}.team`),
        description: ta(`portfolio.items.${key}.description`),
        highlights: ta(`portfolio.items.${key}.highlights`),
      },
    });
    return [
      { ...item('jaghut', 'jaghut', 'websites', ['websites', 'dashboards', 'ai', 'product'], jaghutCover, JAGHUT_DRIVE_URL, t('portfolio.viewPortfolio')) },
      { ...item('sugi', 'sugi', 'websites', ['websites', 'uiux', 'ai', 'product'], sugiCover, SUGI_URL, t('portfolio.viewWebsite')) },
      { ...item('uangku', 'uangku', 'uiux', ['uiux', 'product'], uangkuCover, UANGKU_DRIVE_URL, t('portfolio.viewPortfolio')) },
      { ...item('point-property', 'point', 'uiux', ['uiux'], pointCover, POINT_DRIVE_URL, t('portfolio.viewPortfolio')) },
      { ...item('bkd-cat', 'bkd', 'dashboards', ['dashboards', 'websites', 'uiux'], bkdCover, BKD_DRIVE_URL, t('portfolio.viewPortfolio')) },
      { ...item('bkd-cilacap', 'bkdcilacap', 'dashboards', ['dashboards', 'websites'], bkdCilacapCover) },
      { ...item('cuancraft', 'uiux', 'uiux', ['uiux'], cuancraftCover, CUANCRAFT_PDF_URL, t('portfolio.viewPdf')) },
      { ...item('mylifeco', 'mylifeco', 'uiux', ['uiux', 'product'], mylifecoCover, MYLIFECO_DECK_URL, t('portfolio.viewDeck')) },
      { ...item('jagad-agro', 'jagad', 'websites', ['websites', 'dashboards', 'uiux', 'product'], jagoCover, JAGAD_DRIVE_URL, t('portfolio.viewPortfolio')) },
      { ...item('langkahmu', 'langkahmu', 'uiux', ['uiux', 'product'], langkahmuCover, LANGKAHMU_BEHANCE_URL, t('portfolio.viewBehance')) },
      { ...item('tom', 'tom', 'dataviz', ['dataviz'], tomCover, TOM_DRIVE_URL, t('portfolio.viewPortfolio')) },
      { ...item('procastination', 'procastination', 'websites', ['websites'], procastinationCover, PROCASTINATION_URL, t('portfolio.viewWebsite')) },
      { ...item('indomabs', 'indomabs', 'websites', ['websites'], indomabsCover, INDOMABS_URL, t('portfolio.viewWebsite')) },
      { ...item('indochain', 'indochain', 'product', ['product'], indochainCover, INDOCHAIN_DRIVE_URL, t('portfolio.viewPortfolio')) },
      { ...item('politisimeter', 'politisimeter', 'websites', ['websites'], politisimeterCover, POLITISIMETER_URL, t('portfolio.viewWebsite')) },
      { ...item('analisacafe', 'analisacafe', 'dataviz', ['dataviz'], analisaCafeCover, ANALISA_CAFE_DRIVE_URL, t('portfolio.viewPortfolio')) },
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

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
