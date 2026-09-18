import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionWrapper } from '../layout/SectionWrapper';
import { GlassCard } from '../ui/GlassPanel';

const SCHOOL_KEYS = ['ut', 'smk'];

/**
 * SECTION 05 — Education.
 * Compact and visually distinct from the Experience timeline:
 * two glass cards side-by-side (stacked on mobile), staggered scale-in.
 */
export function Education() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  const items = SCHOOL_KEYS.map((k) => ({
    institution: t(`education.items.${k}.institution`),
    program: t(`education.items.${k}.program`),
    dateRange: t(`education.items.${k}.dateRange`),
  }));

  return (
    <SectionWrapper id="education" labelledBy="education-heading">
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: reduced ? 0.05 : 0.5 }}
        className="mb-10 text-center"
      >
        <p className="text-caption font-bold uppercase tracking-[0.35em] text-neon-pink">
          {t('education.eyebrow')}
        </p>
        <h2 id="education-heading" className="font-display mt-3 text-display-lg font-extrabold text-text-primary">
          {t('education.title')}
        </h2>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2">
        {items.map((item, i) => (
          <motion.div
            key={SCHOOL_KEYS[i]}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: reduced ? 0.05 : 0.5, delay: reduced ? 0 : i * 0.12 }}
          >
            <GlassCard glow={i === 0 ? 'pink' : 'green'} className="h-full">
              <span aria-hidden="true" className="glass-scrim inline-block rounded-xl p-2.5 text-neon-pink">
                <GraduationCap size={20} />
              </span>
              <h3 className="font-display mt-4 text-xl font-bold text-text-primary">
                {item.institution}
              </h3>
              <p className="mt-1 text-body text-text-secondary">{item.program}</p>
              <p className="mt-3 text-caption font-bold uppercase tracking-widest text-neon-green">
                {item.dateRange}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
