import { motion } from 'framer-motion';
import { Check, ExternalLink } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Button } from '../ui/Button';
import { GlassPanel } from '../ui/GlassPanel';

export interface ProjectEntry {
  name: string;
  role: string;
  duration: string;
  description: string;
  features: string[];
  tech: string[];
  /** Spec-named jpg path; falls back to bundled SVG placeholder if missing. */
  image: string;
  fallbackImage: string;
  imageAlt: string;
  sourceUrl?: string;
}

interface ProjectStoryBlockProps {
  entry: ProjectEntry;
  /** drives left/right alternation */
  index: number;
}

/**
 * ProjectStoryBlock — editorial story block, image-vs-text alternating per project.
 * Props: entry { name, role, duration, description, features[], tech[], image, fallbackImage, imageAlt, sourceUrl? }.
 * "View source" renders ONLY when sourceUrl exists — otherwise omitted entirely.
 */
export function ProjectStoryBlock({ entry, index }: ProjectStoryBlockProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const imageFirst = index % 2 === 1;

  const rise = {
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 36, scale: 0.98 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: reduced ? 0.05 : 0.6, ease: 'easeOut' as const },
  };

  return (
    <motion.article {...rise} className="grid items-stretch gap-6 md:grid-cols-2 md:gap-10">
      {/* Image panel with glass info overlay */}
      <div className={`relative ${imageFirst ? 'md:order-2' : ''}`}>
        <div className="relative h-full min-h-[280px] overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] shadow-[0_8px_32px_var(--glass-shadow)]">
          <div className="aspect-[16/10] h-full w-full bg-bg-secondary md:aspect-auto md:min-h-[340px]">
            <img
              src={entry.image}
              alt={entry.imageAlt}
              width={800}
              height={500}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (!img.dataset.fbk) {
                  img.dataset.fbk = '1';
                  img.src = entry.fallbackImage;
                } else {
                  img.style.display = 'none';
                }
              }}
            />
          </div>
          {/* Glass info overlay: role, duration, tech tags */}
          <GlassPanel className="on-photo absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-2 rounded-2xl px-4 py-3">
            <span className="text-caption font-bold uppercase tracking-widest text-text-primary">
              {entry.role}
            </span>
            <span aria-hidden="true" className="text-text-secondary">
              ·
            </span>
            <span className="text-caption font-bold uppercase tracking-widest text-neon-green">
              {entry.duration}
            </span>
            <span className="flex w-full flex-wrap gap-1.5 pt-1">
              {entry.tech.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-caption font-bold tracking-wider text-text-primary"
                >
                  {tag}
                </span>
              ))}
            </span>
          </GlassPanel>
        </div>
      </div>

      {/* Story copy */}
      <div className={`flex flex-col justify-center ${imageFirst ? 'md:order-1' : ''}`}>
        <h3 className="font-display text-display-md font-extrabold leading-tight text-text-primary">
          {entry.name}
        </h3>
        <p className="mt-4 text-body leading-relaxed text-text-secondary">{entry.description}</p>
        <ul className="mt-5 space-y-2.5">
          {entry.features.map((f, i) => (
            <li key={i} className="flex gap-2.5 text-body text-text-secondary">
              <Check size={17} aria-hidden="true" className="mt-1 shrink-0 text-neon-blue" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        {entry.sourceUrl && (
          <div className="mt-6">
            <Button
              href={entry.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              variant="glass"
            >
              <ExternalLink size={16} aria-hidden="true" />
              {t('projects.viewSource')}
            </Button>
          </div>
        )}
      </div>
    </motion.article>
  );
}
