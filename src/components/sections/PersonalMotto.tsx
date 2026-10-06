import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionWrapper } from '../layout/SectionWrapper';
import parallaxBg from '../../assets/images/parallax-background-1920.jpg';

/**
 * SECTION 02 — Personal Motto.
 * Full-bleed parallax photo (SectionWrapper background slot) with a slow
 * scroll drift; static when reduced motion. Text uses a fixed white/neon
 * treatment with drop shadows so it reads identically in both themes.
 */
export function PersonalMotto() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const text = t('motto.text');
  const words = text.split(' ');

  // Attached to the real outer <section>, so progress measures true viewport travel.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  const container = {
    hidden: {},
    // Keep the total cascade ~1.2s even for long paragraphs.
    show: {
      transition: {
        staggerChildren: reduced ? 0 : Math.min(0.09, 1.2 / Math.max(words.length, 1)),
        delayChildren: 0.1,
      },
    },
  };
  const word = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 18 },
    show: reduced
      ? { opacity: 1 }
      : { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
  };

  return (
    <SectionWrapper
      id="motto"
      ariaLabel={t('motto.eyebrow')}
      ref={sectionRef}
      background={
        <>
          {/* Clipping frame: keeps the scaled/translated photo from ever causing overflow */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <motion.div
              style={reduced ? undefined : { y: bgY }}
              className="absolute inset-0 will-change-transform [transform:translateZ(0)]"
            >
              <img
                src={parallaxBg}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full scale-[1.1] object-cover"
              />
            </motion.div>
          </div>
          {/* Theme edge fades + tinted middle band — identical mechanism both themes */}
          <div aria-hidden="true" className="motto-fade absolute inset-0" />
        </>
      }
    >
      <div className="flex min-h-[70vh] flex-col items-center justify-center py-14 text-center">
        <motion.p
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: reduced ? 0.05 : 0.5 }}
            className="text-caption font-bold uppercase tracking-[0.35em] text-neon-blue"
        >
          {t('motto.eyebrow')}
        </motion.p>

          <div aria-hidden="true" className="my-6 h-px w-24 bg-gradient-to-r from-transparent via-neon-blue to-transparent" />

        <motion.blockquote
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
            className="max-w-3xl text-lg leading-relaxed text-text-primary md:text-xl"
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
    </SectionWrapper>
  );
}
