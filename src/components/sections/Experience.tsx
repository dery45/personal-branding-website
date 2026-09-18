import { Fragment, useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionWrapper } from '../layout/SectionWrapper';
import { ExperienceCard, type ExperienceEntry } from './ExperienceCard';

const ROLE_KEYS = ['abadJaya', 'bitTech', 'kedata'];
const NODE_ACCENTS = ['bg-neon-blue', 'bg-neon-green', 'bg-neon-pink'] as const;
const NODE_GLOWS = [
  'shadow-[0_0_16px_rgba(0,207,255,0.8)]',
  'shadow-[0_0_16px_rgba(182,255,0,0.8)]',
  'shadow-[0_0_16px_rgba(255,60,172,0.8)]',
] as const;

/**
 * SECTION 03 — Professional Experience.
 * Horizontal snap-scroll row of cards. The neon line + circular nodes form the
 * scroll track: the node nearest the row's center highlights (and each node is
 * a button that scrolls its card into view), so no separate scrollbar UI needed.
 * Native overflow scrolling keeps trackpad, touch, and keyboard working, and
 * vertical page scroll is never trapped.
 */
export function Experience() {
  const { t, ta } = useTranslation();
  const reduced = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const entries: ExperienceEntry[] = ROLE_KEYS.map((k) => ({
    org: t(`experience.roles.${k}.org`),
    role: t(`experience.roles.${k}.role`),
    dateRange: t(`experience.roles.${k}.dateRange`),
    summary: t(`experience.roles.${k}.summary`),
    bullets: ta(`experience.roles.${k}.bullets`),
  }));

  const updateActive = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const center = row.scrollLeft + row.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(row.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  const scrollToCard = useCallback(
    (i: number) => {
      const row = rowRef.current;
      const child = row?.children[i] as HTMLElement | undefined;
      child?.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    },
    [reduced],
  );

  return (
    <SectionWrapper id="experience" labelledBy="experience-heading">
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: reduced ? 0.05 : 0.5 }}
        className="mb-10 text-center"
      >
        <p className="text-caption font-bold uppercase tracking-[0.35em] text-neon-blue">
          {t('experience.eyebrow')}
        </p>
        <h2 id="experience-heading" className="font-display mt-3 text-display-lg font-extrabold text-text-primary">
          {t('experience.title')}
        </h2>
      </motion.div>

      {/* Scroll track: neon line + per-card node buttons */}
      <div className="mb-6 flex items-center px-1" role="group" aria-label={t('experience.title')}>
        {entries.map((entry, i) => (
          <Fragment key={ROLE_KEYS[i]}>
            {i > 0 && (
              <span
                aria-hidden="true"
                className="h-[2px] min-w-6 flex-1 bg-gradient-to-r from-neon-blue via-neon-green to-neon-pink opacity-40"
              />
            )}
            <button
              type="button"
              onClick={() => scrollToCard(i)}
              aria-label={entry.org}
              aria-current={active === i}
              className={`h-4 w-4 shrink-0 rounded-full ring-4 ring-bg-primary transition-all duration-300 ${
                NODE_ACCENTS[i % NODE_ACCENTS.length]
              } ${active === i ? `scale-125 ${NODE_GLOWS[i % NODE_GLOWS.length]}` : 'opacity-50 hover:opacity-100'}`}
            />
          </Fragment>
        ))}
      </div>

      {/* Horizontally scrolling card row (native scroll: touch, wheel-shift, arrows, tab) */}
      <div
        ref={rowRef}
        onScroll={updateActive}
        tabIndex={0}
        role="region"
        aria-label={t('experience.title')}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3"
      >
        {entries.map((entry, i) => (
          <div
            key={ROLE_KEYS[i]}
            className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[44%]"
          >
            <ExperienceCard entry={entry} index={i} />
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
