import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ExperienceCard, type ExperienceEntry } from './ExperienceCard';

const ROLE_KEYS = ['abadJaya', 'bitTech', 'kedata'];
const NODE_ACCENTS = ['bg-neon-blue', 'bg-neon-blue', 'bg-neon-blue'] as const;
const NODE_GLOWS = [
  'shadow-[0_0_16px_rgba(0,207,255,0.8)]',
  'shadow-[0_0_16px_rgba(0,207,255,0.8)]',
  'shadow-[0_0_16px_rgba(0,207,255,0.8)]',
] as const;

interface TrackMeasure {
  /** center x of each card in track coordinates */
  offsets: number[];
  widths: number[];
  vw: number;
  /** x travel that centers the first / last card */
  start: number;
  end: number;
}

/**
 * Dwell zones: the card travel completes between these progress points, so the
 * first card rests centered briefly after the pin engages and the last card
 * rests centered briefly before the pin releases (symmetric in reverse).
 * Output clamps outside the range, holding the end states.
 */
const TRAVEL_FROM = 0.1;
const TRAVEL_TO = 0.9;

interface JourneyCardProps {
  entry: ExperienceEntry;
  index: number;
  /** track x position in pixels (MotionValue — updates without re-rendering) */
  trackX: MotionValue<number>;
  /** card center in track coordinates */
  cx: number;
  /** card width in pixels */
  w: number;
  /** viewport width in pixels */
  vw: number;
}

/**
 * JourneyCard — one card in the pinned row. Focus fade/scale derive straight
 * from the track MotionValue, so scrolling never triggers a React re-render;
 * only the compositor updates. (Opacity/scale math matches the previous
 * state-driven version exactly.)
 */
function JourneyCard({ entry, index, trackX, cx, w, vw }: JourneyCardProps) {
  const distance = useTransform(trackX, (v) => {
    const center = -v + vw / 2;
    return Math.min(1, Math.abs(cx - center) / (w || 1));
  });
  // Reproduce max(0.25, 1 - d*0.85): full fade across [0, ~0.88], floor after.
  const opacity = useTransform(distance, [0, 0.88, 1], [1, 0.25, 0.25]);
  // Reproduce max(0.9, 1 - d*0.1) exactly.
  const scale = useTransform(distance, [0, 1], [1, 0.9]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="max-h-[82vh] w-[80vw] shrink-0 overflow-y-auto sm:w-[62vw] lg:w-[40vw]"
    >
      <ExperienceCard entry={entry} index={index} />
    </motion.div>
  );
}

/**
 * SECTION 03 — Professional Experience.
 * No nested scroll area: the card row is pinned (sticky) while vertical page
 * scroll drives it horizontally left → right; scrolling continues downward
 * once the row is exhausted. The neon line + node track mirrors progress and
 * each node jumps its card into view. Under reduced motion the pin is skipped
 * entirely in favor of a static vertical stack.
 */
export function Experience() {
  const { t, ta, lang } = useTranslation();
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<TrackMeasure>({ offsets: [], widths: [], vw: 0, start: 0, end: 0 });

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [span, setSpan] = useState({ start: 0, end: 0 });
  // Card geometry for the MotionValue fade (refreshed only on measure, not per frame).
  const [geom, setGeom] = useState<{ cx: number[]; w: number[]; vw: number }>({
    cx: [],
    w: [],
    vw: 0,
  });

  const entries: ExperienceEntry[] = ROLE_KEYS.map((k) => ({
    org: t(`experience.roles.${k}.org`),
    role: t(`experience.roles.${k}.role`),
    dateRange: t(`experience.roles.${k}.dateRange`),
    summary: t(`experience.roles.${k}.summary`),
    bullets: ta(`experience.roles.${k}.bullets`),
  }));

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [TRAVEL_FROM, TRAVEL_TO], [span.start, span.end]);

  // Node highlight only: updates state solely when the nearest card CHANGES,
  // so scrolling otherwise costs zero React renders.
  useMotionValueEvent(x, 'change', (trackX) => {
    if (reducedRef.current) return;
    const m = measureRef.current;
    if (m.offsets.length === 0) return;
    const center = -trackX + m.vw / 2;
    let best = 0;
    let bestDist = Infinity;
    m.offsets.forEach((cardCenter, i) => {
      const dist = Math.abs(cardCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    if (best !== activeRef.current) {
      activeRef.current = best;
      setActive(best);
    }
  });

  // Measure track geometry (offsets are layout values, unaffected by the x transform).
  // A ResizeObserver catches late changes (stylesheet parse, font swap, images);
  // window load + fonts.ready cover the first paint. Refreshes geometry STATE
  // (rare) — per-frame motion stays entirely inside MotionValues.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const track = trackRef.current;
        if (!track) return;
        const kids = Array.from(track.children) as HTMLElement[];
        if (kids.length === 0) return;
        const offsets = kids.map((el) => el.offsetLeft + el.offsetWidth / 2);
        const widths = kids.map((el) => el.offsetWidth);
        const vw = window.innerWidth;
        const start = vw / 2 - offsets[0];
        const end = vw / 2 - offsets[offsets.length - 1];
        measureRef.current = { offsets, widths, vw, start, end };
        setSpan({ start, end });
        setGeom({ cx: offsets, w: widths, vw });
      });
    };
    measure();
    const ro = trackRef.current ? new ResizeObserver(measure) : null;
    if (trackRef.current && ro) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, reduced]);

  // Node click → scroll the PAGE to the point where card i is centered.
  const jumpToCard = useCallback(
    (i: number) => {
      const outer = outerRef.current;
      const m = measureRef.current;
      const width = m.widths[i];
      if (!outer || !width) return;
      const targetX = m.vw / 2 - m.offsets[i];
      const travel = m.start - m.end;
      const frac = travel !== 0 ? Math.min(1, Math.max(0, (m.start - targetX) / travel)) : 0;
      const p = TRAVEL_FROM + (TRAVEL_TO - TRAVEL_FROM) * frac;
      const top = outer.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top + p * (outer.offsetHeight - window.innerHeight),
        behavior: reduced ? 'auto' : 'smooth',
      });
    },
    [reduced],
  );

  const header = (
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
  );

  const track = (
    <div className="flex items-center px-1" role="group" aria-label={t('experience.title')}>
      {entries.map((entry, i) => (
        <Fragment key={ROLE_KEYS[i]}>
          {i > 0 && (
            <span
              aria-hidden="true"
                className="h-[2px] min-w-6 flex-1 bg-neon-blue opacity-40"
            />
          )}
          <button
            type="button"
            onClick={() => jumpToCard(i)}
            aria-label={entry.org}
            aria-current={active === i}
            className={`h-4 w-4 shrink-0 rounded-full ring-4 ring-bg-primary transition-all duration-300 ${
              NODE_ACCENTS[i % NODE_ACCENTS.length]
            } ${active === i ? `scale-125 ${NODE_GLOWS[i % NODE_GLOWS.length]}` : 'opacity-50 hover:opacity-100'}`}
          />
        </Fragment>
      ))}
    </div>
  );

  return (
    <section id="experience" aria-labelledby="experience-heading" className="relative scroll-mt-24 pb-16 md:pb-24">
      <div className="mx-auto w-full max-w-6xl px-5 pt-16 sm:px-8 md:pt-24">{header}</div>

      {reduced ? (
        <div className="mx-auto w-full max-w-6xl space-y-6 px-5 sm:px-8">
          {entries.map((entry, i) => (
            <ExperienceCard key={ROLE_KEYS[i]} entry={entry} index={i} />
          ))}
        </div>
      ) : (
        <div ref={outerRef} className="relative" style={{ height: `${(entries.length + 1) * 100}vh` }}>
          <div className="sticky top-0 flex h-screen flex-col justify-center gap-8 overflow-hidden">
            <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{track}</div>
            <motion.div ref={trackRef} style={{ x }} className="relative flex items-stretch gap-5 px-[8vw]">
              {entries.map((entry, i) => (
                <JourneyCard
                  key={ROLE_KEYS[i]}
                  entry={entry}
                  index={i}
                  trackX={x}
                  cx={geom.cx[i] ?? 0}
                  w={geom.w[i] ?? 1}
                  vw={geom.vw}
                />
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </section>
  );
}
