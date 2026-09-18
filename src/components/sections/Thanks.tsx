import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionWrapper } from '../layout/SectionWrapper';

/**
 * SECTION 09 — Thank You.
 * Closing statement only — no buttons, no links. Soft gradient fade
 * straight into the footer (no hard seam).
 */
export function Thanks() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  return (
    <SectionWrapper id="thanks" labelledBy="thanks-heading" className="!pb-8 md:!pb-10">
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <motion.p
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reduced ? 0.05 : 0.5 }}
          className="text-caption font-bold uppercase tracking-[0.35em] text-neon-green"
        >
          {t('thanks.eyebrow')}
        </motion.p>

        <motion.h2
          id="thanks-heading"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 32, skewX: -4 }}
          whileInView={{ opacity: 1, y: 0, skewX: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reduced ? 0.05 : 0.65, ease: 'easeOut' }}
          className="font-display mt-5 max-w-4xl text-display-xl font-black uppercase leading-[0.95] text-text-primary"
        >
          {t('thanks.line1')}
          <br />
          <span className="text-neon-blue">{t('thanks.line2')}</span>
        </motion.h2>

        <motion.p
          initial={reduced ? { opacity: 0 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reduced ? 0.05 : 0.6, delay: reduced ? 0 : 0.2 }}
          className="mt-5 max-w-xl text-body text-text-secondary"
        >
          {t('thanks.body')}
        </motion.p>

        {/* Soft fade into the footer — decorative */}
        <div
          aria-hidden="true"
          className="mt-16 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-neon-blue/60 to-transparent"
        />
      </div>
    </SectionWrapper>
  );
}
