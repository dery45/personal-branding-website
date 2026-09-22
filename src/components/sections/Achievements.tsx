import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionWrapper } from '../layout/SectionWrapper';
import { AchievementCard, type AchievementCategory, type AchievementEntry } from './AchievementCard';

interface AchievementDatum {
  key: string;
  category: AchievementCategory;
}

// All 7 recognitions in reverse-chronological order, one unified grid.
// Category stays on each card via icon + label (single blue accent site-wide); DSLaunchpad remains
// participation, never a "win".
const ACHIEVEMENTS: AchievementDatum[] = [
  { key: 'healthkathon', category: 'placement' },
  { key: 'indigo', category: 'placement' },
  { key: 'hackdata', category: 'placement' },
  { key: 'jakbee', category: 'placement' },
  { key: 'nextdev', category: 'ranking' },
  { key: 'ikaIts', category: 'ranking' },
  { key: 'dslaunchpad', category: 'incubation' },
];

/**
 * SECTION 06 — Achievements.
 * Individual cards only — no summary stats, no category group headings.
 */
export function Achievements() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  const entries: (AchievementEntry & { key: string })[] = ACHIEVEMENTS.map((a) => ({
    key: a.key,
    category: a.category,
    title: t(`achievements.items.${a.key}.title`),
    organizer: t(`achievements.items.${a.key}.organizer`),
    year: t(`achievements.items.${a.key}.year`),
  }));

  return (
    <SectionWrapper id="achievements" labelledBy="achievements-heading">
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: reduced ? 0.05 : 0.5 }}
        className="mb-10 text-center"
      >
        <p className="text-caption font-bold uppercase tracking-[0.35em] text-neon-blue">
          {t('achievements.eyebrow')}
        </p>
        <h2 id="achievements-heading" className="font-display mt-3 text-display-lg font-extrabold text-text-primary">
          {t('achievements.title')}
        </h2>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => (
          <AchievementCard key={entry.key} entry={entry} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
