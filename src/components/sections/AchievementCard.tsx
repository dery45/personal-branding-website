import { motion } from 'framer-motion';
import { FlaskConical, Medal, Trophy } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { GlassCard } from '../ui/GlassPanel';

export type AchievementCategory = 'placement' | 'ranking' | 'incubation';

export interface AchievementEntry {
  title: string;
  organizer: string;
  year: string;
  category: AchievementCategory;
}

const CATEGORY_META: Record<
  AchievementCategory,
  { glow: 'blue' | 'green' | 'pink'; text: string; dot: string; Icon: typeof Trophy }
> = {
  placement: { glow: 'blue', text: 'text-neon-blue', dot: 'bg-neon-blue', Icon: Trophy },
  ranking: { glow: 'green', text: 'text-neon-green', dot: 'bg-neon-green', Icon: Medal },
  incubation: { glow: 'pink', text: 'text-neon-pink', dot: 'bg-neon-pink', Icon: FlaskConical },
};

interface AchievementCardProps {
  entry: AchievementEntry;
  index: number;
}

/**
 * AchievementCard — one trophy-wall card.
 * Props: entry { title, organizer, year, category }, index (stagger offset).
 * Accent color is fixed per category: blue = placement, green = ranking, pink = incubation.
 */
export function AchievementCard({ entry, index }: AchievementCardProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const meta = CATEGORY_META[entry.category];

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: reduced ? 0.05 : 0.45, delay: reduced ? 0 : (index % 4) * 0.08 }}
    >
      <GlassCard glow={meta.glow} className="h-full">
        <div className="flex items-start justify-between gap-3">
          <span aria-hidden="true" className={`glass-scrim rounded-xl p-2.5 ${meta.text}`}>
            <meta.Icon size={20} />
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] px-2.5 py-1 text-caption font-bold uppercase tracking-widest ${meta.text}`}
          >
            <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
            {t(`achievements.categories.${entry.category}`)}
          </span>
        </div>
        <h3 className="font-display mt-4 text-2xl font-extrabold text-text-primary">{entry.title}</h3>
        <p className="mt-1.5 text-body text-text-secondary">{entry.organizer}</p>
        <p className="mt-3 text-caption font-bold uppercase tracking-widest text-text-secondary">
          {entry.year}
        </p>
      </GlassCard>
    </motion.div>
  );
}
