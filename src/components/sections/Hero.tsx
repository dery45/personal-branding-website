import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionWrapper } from '../layout/SectionWrapper';
import portraitSrc from '../../assets/images/Main-Images_Dery Andrian Pratama.png';

/**
 * SECTION 01 — Home / Hero.
 * Oversized two-line neon-blue display name with a circular portrait
 * overlapping the seam between the lines, a single tagline, and a scroll
 * chevron as the only interactive affordance. No buttons.
 */
export function Hero() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  const line = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 60 },
    animate: reduced ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0.05 : 0.7, delay: reduced ? 0 : delay, ease: 'easeOut' as const },
  });

  return (
    <SectionWrapper id="hero" labelledBy="hero-heading" className="!max-w-none">
      <div className="flex min-h-[85vh] flex-col items-center justify-center overflow-x-hidden pt-16 text-center">
        {/* Name block — shrink-to-fit wrapper so its center always matches the
            centered text; portrait sits exactly on the seam (50%/50%). */}
        <div className="relative mx-auto w-fit">
          <motion.h1
            id="hero-heading"
            aria-label={t('hero.fullName')}
            {...line(0.05)}
            className="font-tektur text-[clamp(3.5rem,15vw,13rem)] font-black uppercase leading-[0.88] tracking-tight text-neon-blue"
          >
            <span aria-hidden="true" className="block">
              {t('hero.line1')}
            </span>
            <span aria-hidden="true" className="block">
              {t('hero.line2')}
            </span>
          </motion.h1>

          <motion.div
            // NOTE: centering lives in x/y motion values (not Tailwind translate
            // classes) because Framer Motion's inline `transform` would override them.
            initial={
              reduced
                ? { opacity: 0, x: '-50%', y: '-50%' }
                : { opacity: 0, scale: 0.7, x: '-50%', y: '-50%' }
            }
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            transition={{ duration: reduced ? 0.05 : 0.7, delay: reduced ? 0 : 0.35, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 z-10"
          >
            <img
              src={portraitSrc}
              alt={t('hero.portraitAlt')}
              width={943}
              height={1286}
              loading="eager"
              fetchPriority="high"
              className="size-[clamp(110px,24vw,260px)] rounded-full border-2 border-neon-blue/70 object-cover shadow-[0_0_48px_var(--glow-blue)]"
            />
          </motion.div>
        </div>

        <motion.p
          {...line(0.45)}
          className="mt-7 text-lg font-normal tracking-wide text-text-secondary md:text-xl"
        >
          {t('hero.tagline')}
        </motion.p>

        {/* Scroll chevron — the only interactive affordance in Hero */}
        <motion.a
          href="#motto"
          aria-label={t('hero.scroll')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduced ? 0.05 : 0.6, delay: reduced ? 0 : 0.7 }}
          className="mt-14 inline-flex flex-col items-center gap-2 text-text-secondary transition-colors hover:text-neon-blue"
        >
          <span className="text-caption uppercase tracking-[0.3em]">{t('hero.scroll')}</span>
          {reduced ? (
            <span aria-hidden="true" className="block h-2.5 w-2.5 rotate-45 border-b-2 border-r-2 border-current" />
          ) : (
            <span aria-hidden="true" className="block h-2.5 w-2.5 animate-bounce rotate-45 border-b-2 border-r-2 border-current" />
          )}
        </motion.a>
      </div>
    </SectionWrapper>
  );
}
