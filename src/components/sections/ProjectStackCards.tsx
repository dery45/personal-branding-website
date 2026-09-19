import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ProjectStoryBlock, type ProjectEntry } from './ProjectStoryBlock';

// Diagonal journey amplitudes (viewport-relative so cards truly leave the frame)
const X_VW = 38;
const Y_VH = 32;
// Half-width of each card's visibility window in travel-time units. Card centers
// sit 1/(total-1) apart, so this yields a brief crossfade where the outgoing
// card (heading top-left) and incoming card (from bottom-right) are on
// opposite sides of center — never spatially overlapping.
const FADE_SPAN = 0.25;
// Travel completes early so the last card rests centered before release
// (mirrored in reverse for the first card); output clamps past the range.
const TRAVEL_FROM = 0.1;
const TRAVEL_TO = 0.9;

interface ProjectStackCardItemProps {
  entry: ProjectEntry;
  entryKey: string;
  index: number;
  total: number;
  travel: MotionValue<number>;
}

/**
 * ProjectStackCardItem — one card in the diagonal journey. Each card owns the
 * travel moment it is centered; distance from that moment drives a
 * bottom-right → center → top-left path with matching fade (and a gentle
 * scale). Opacity hits 0 well before neighbors arrive, so cards never overlap.
 */
function ProjectStackCardItem({ entry, index, total, travel }: ProjectStackCardItemProps) {
  const center = total > 1 ? index / (total - 1) : 0.5;
  const d = useTransform(travel, (v) => v - center);
  const x = useTransform(d, [-FADE_SPAN, 0, FADE_SPAN], [`${X_VW}vw`, '0vw', `${-X_VW}vw`]);
  const y = useTransform(d, [-FADE_SPAN, 0, FADE_SPAN], [`${Y_VH}vh`, '0vh', `${-Y_VH}vh`]);
  const opacity = useTransform(d, [-FADE_SPAN, 0, FADE_SPAN], [0, 1, 0]);
  const scale = useTransform(d, [-FADE_SPAN, 0, FADE_SPAN], [0.92, 1, 0.92]);

  return (
    <div
      className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-4 md:px-8"
      style={{ zIndex: index + 1 }}
    >
      <motion.div
        className="relative mx-auto max-h-[92svh] w-full max-w-6xl origin-center overflow-y-auto"
        style={{ x, y, opacity, scale }}
      >
        <ProjectStoryBlock entry={entry} index={index} animateOnView={false} />
      </motion.div>
    </div>
  );
}

interface ProjectStackCardsProps {
  entries: ProjectEntry[];
  entryKeys: string[];
}

/**
 * ProjectStackCards — scroll-linked diagonal deck for the 4 projects.
 * Vertical page scroll drives travel; each card emerges bottom-right, rests
 * centered, then exits top-left. Not a scrollable container itself, so it
 * never fights other scroll effects. Reduced motion renders a static list
 * instead (see Projects.tsx) — the deck never mounts there.
 */
export function ProjectStackCards({ entries, entryKeys }: ProjectStackCardsProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });
  const travel = useTransform(progress, [TRAVEL_FROM, TRAVEL_TO], [0, 1]);

  return (
    <div ref={targetRef} className="relative">
      {entries.map((entry, i) => (
        <ProjectStackCardItem
          key={entryKeys[i]}
          entry={entry}
          entryKey={entryKeys[i] ?? String(i)}
          index={i}
          total={entries.length}
          travel={travel}
        />
      ))}
    </div>
  );
}
