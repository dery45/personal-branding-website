import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionWrapper } from '../layout/SectionWrapper';
import parallaxBg from '../../assets/images/parallax-background-1920.jpg';

/**
 * SECTION 02 — Personal Motto.
 * Staggered word reveal over a full-bleed, slow parallax photo backdrop
 * (static when reduced motion). The photo renders at full visibility; a
 * dark-mode-only gradient band behind the text keeps the quote readable
 * without hiding the image (light-mode contrast already passes unassisted).
 */
export function PersonalMotto() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const text = t('motto.text');
  const words = text.split(' ');

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  // Background drifts ~40% of the foreground's apparent travel (classic parallax).
  const bgY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.09, delayChildren: 0.1 } },
  };
  const word = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 18, rotateX: -35 },
    show: reduced
      ? { opacity: 1 }
      : { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
  };

  return (
    <SectionWrapper id="motto" ariaLabel={t('motto.eyebrow')}>
      <div ref={sectionRef} className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden text-center">
        {/* Full-bleed parallax backdrop — escapes the section's normal max-width */}
        <motion.div
          aria-hidden="true"
          style={reduced ? undefined : { y: bgY }}
          className="absolute inset-y-0 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen"
        >
          <img
            src={parallaxBg}
            alt=""
            loading="lazy"
            className="h-full w-full scale-[1.15] object-cover"
          />
        </motion.div>
        {/* Targeted legibility aid, dark theme only: a soft band behind the text.
            Edges of the photo stay fully visible; light mode needs no aid. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-b from-transparent via-black/40 to-transparent dark:block"
        />

        {/* Content stays at the normal constrained width, unchanged */}
        <div className="relative z-10 flex flex-col items-center px-4 py-14">
          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: reduced ? 0.05 : 0.5 }}
            className="text-caption font-bold uppercase tracking-[0.35em] text-neon-pink"
          >
            {t('motto.eyebrow')}
          </motion.p>

          <div aria-hidden="true" className="my-6 h-px w-24 bg-gradient-to-r from-transparent via-neon-pink to-transparent" />

          <motion.blockquote
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="font-display max-w-4xl text-display-lg font-extrabold leading-tight text-text-primary"
          >
            <span className="sr-only">{text}</span>
            {words.map((w, i) => (
              <motion.span key={`${w}-${i}`} variants={word} className="inline-block whitespace-pre">
                {w}
                {i < words.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </motion.blockquote>
        </div>
      </div>
    </SectionWrapper>
  );
}
