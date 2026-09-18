import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ChevronDown } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { GlassCard } from '../ui/GlassPanel';

export interface ExperienceEntry {
  org: string;
  role: string;
  dateRange: string;
  summary: string;
  bullets: string[];
}

interface ExperienceCardProps {
  entry: ExperienceEntry;
  /** position in the row: drives the staggered reveal delay */
  index: number;
}

/**
 * ExperienceCard — one timeline card.
 * Props: entry { org, role, dateRange, summary, bullets[] }, index.
 * Collapsed to summary on mobile by default (expanded on desktop); toggle is keyboard operable.
 */
export function ExperienceCard({ entry, index }: ExperienceCardProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = useState<boolean>(() =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia !== 'undefined'
      ? window.matchMedia('(min-width: 768px)').matches
      : false,
  );
  const listId = useId();

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: reduced ? 0.05 : 0.55, delay: reduced ? 0 : (index % 3) * 0.1, ease: 'easeOut' }}
      className="h-full"
    >
      <GlassCard glow="blue" className="h-full transition-shadow">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="glass-scrim mt-0.5 rounded-lg p-2 text-neon-blue">
            <Briefcase size={17} />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold leading-snug text-text-primary">
              {entry.org}
            </h3>
            <p className="mt-0.5 text-sm font-bold text-neon-blue">{entry.role}</p>
            <p className="mt-1 text-caption uppercase tracking-widest text-text-secondary">
              {entry.dateRange}
            </p>
          </div>
        </div>

        <div id={listId}>
          {!expanded ? (
            <p className="mt-4 line-clamp-3 text-body text-text-secondary">{entry.summary}</p>
          ) : (
            <motion.ul
              initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
              transition={{ duration: reduced ? 0.05 : 0.35, ease: 'easeOut' }}
              className="mt-4 space-y-2.5 overflow-hidden"
            >
              {entry.bullets.map((b, i) => (
                <li key={i} className="flex gap-2.5 text-body text-text-secondary">
                  <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-neon-green" />
                  <span>{b}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={listId}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg text-caption font-bold uppercase tracking-widest text-text-primary transition-colors hover:text-neon-blue"
        >
          {expanded ? t('experience.showLess') : t('experience.showMore')}
          <ChevronDown
            size={15}
            aria-hidden="true"
            className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </GlassCard>
    </motion.div>
  );
}
