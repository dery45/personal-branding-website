import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface PortfolioEntry {
  title: string;
  category: string;
  categoryLabel: string;
  image: string;
  fallbackImage: string;
  alt: string;
}

interface PortfolioTileProps {
  entry: PortfolioEntry;
  index: number;
  onOpen: (index: number) => void;
}

/**
 * PortfolioTile — one glass-framed gallery tile (button).
 * Hover/focus reveals a short glass caption. Reserved 4:3 box, lazy image.
 */
export function PortfolioTile({ entry, index, onOpen }: PortfolioTileProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: reduced ? 0.05 : 0.45, delay: reduced ? 0 : (index % 3) * 0.08 }}
      className="mb-5 break-inside-avoid"
    >
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-haspopup="dialog"
        className="glass-glow-blue group relative block w-full overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] text-left shadow-[0_8px_32px_var(--glass-shadow)] transition-all"
      >
        <span className="block aspect-[4/3] w-full bg-bg-secondary">
          <img
            src={entry.image}
            alt={entry.alt}
            width={600}
            height={450}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
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
        </span>
        <span className="on-photo absolute inset-x-2 bottom-2 rounded-xl border px-3 py-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="block font-display text-sm font-bold text-text-primary">{entry.title}</span>
          <span className="block text-caption uppercase tracking-widest text-neon-blue">
            {entry.categoryLabel}
          </span>
        </span>
        {/* Always-visible caption for touch / reduced-motion users */}
        <span className="block px-4 py-3 sm:hidden">
          <span className="block font-display text-sm font-bold text-text-primary">{entry.title}</span>
          <span className="block text-caption uppercase tracking-widest text-text-secondary">
            {entry.categoryLabel}
          </span>
        </span>
      </button>
    </motion.div>
  );
}
