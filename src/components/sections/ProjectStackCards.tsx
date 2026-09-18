import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ProjectStoryBlock, type ProjectEntry } from './ProjectStoryBlock';

interface ProjectStackCardItemProps {
  entry: ProjectEntry;
  entryKey: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

/**
 * ProjectStackCardItem — one pinned card in the horizontal fan stack.
 * Driven by vertical page scroll: slides in from the right (x) and settles
 * slightly scaled down as later cards cover it. `top` fans each card down
 * a touch for depth.
 */
function ProjectStackCardItem({ entry, index, total, progress }: ProjectStackCardItemProps) {
  const range: [number, number] = [index * (1 / total), 1];
  const x = useTransform(progress, range, ['60%', `${-(index * 4)}%`]);
  const scale = useTransform(progress, range, [1, 1 - (total - index) * 0.03]);
  const topOffset = `${5 + index * 2}%`;

  return (
    <div className="sticky top-0 flex h-screen items-center overflow-hidden">
      <motion.div className="relative w-full origin-left" style={{ top: topOffset, x, scale }}>
        <ProjectStoryBlock entry={entry} index={index} />
      </motion.div>
    </div>
  );
}

interface ProjectStackCardsProps {
  entries: ProjectEntry[];
  entryKeys: string[];
}

/**
 * ProjectStackCards — scroll-linked horizontal stacking deck for the 4 projects.
 * Vertical page scroll drives progress; cards slide in from the right and fan
 * into an overlapping stack. Not a scrollable container itself, so it never
 * fights the horizontal Experience row above it.
 */
export function ProjectStackCards({ entries, entryKeys }: ProjectStackCardsProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={targetRef} className="relative">
      {entries.map((entry, i) => (
        <ProjectStackCardItem
          key={entryKeys[i]}
          entry={entry}
          entryKey={entryKeys[i] ?? String(i)}
          index={i}
          total={entries.length}
          progress={progress}
        />
      ))}
    </div>
  );
}
