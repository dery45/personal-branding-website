import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { Button } from '../ui/Button';
import type { PortfolioEntry } from './PortfolioTile';

interface LightboxProps {
  entry: PortfolioEntry | null;
  onClose: () => void;
}

/**
 * Lightbox — glass modal for a portfolio tile.
 * Closable via Escape, click-outside, close button; focus-trapped; returns focus to trigger.
 */
export function Lightbox({ entry, onClose }: LightboxProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!entry) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href]',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      triggerRef.current?.focus?.();
    };
  }, [entry, onClose]);

  // Portaled to document.body: no ancestor transform, filter, or stacking quirk
  // can ever hijack the fixed overlay or clip the panel — the modal always
  // covers exactly the viewport, wherever it is opened from.
  return createPortal(
    <AnimatePresence>
      {entry && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={entry.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.05 : 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
            transition={{ duration: reduced ? 0.05 : 0.25 }}
            className={`glass relative max-h-[90vh] w-full overflow-y-auto overscroll-contain rounded-3xl ${
              entry.details ? 'lightbox-case max-w-5xl' : 'max-w-3xl'
            }`}
          >
            {entry.details && (
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={t('portfolio.lightbox.close')}
                className="glass glass-glow-blue absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full text-text-primary"
              >
                <X size={18} aria-hidden="true" />
              </button>
            )}
            {entry.details ? (
              <div className="grid md:grid-cols-2">
                {/* Left: case details (no field labels — values only) */}
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <h3 className="font-display text-display-md font-extrabold text-text-primary">
                    {entry.details.name}
                  </h3>
                  <p className="mt-2 text-caption font-bold uppercase tracking-widest text-text-secondary">
                    {entry.details.year} <span aria-hidden="true">·</span> {entry.details.team}
                  </p>
                  <div className="mt-4 space-y-3">
                    {entry.details.description.map((paragraph, i) => (
                      <p key={i} className="text-body leading-relaxed text-text-secondary">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {entry.pdf && (
                    <div className="mt-6">
                      <Button
                        href={entry.pdf}
                        target="_blank"
                        rel="noreferrer noopener"
                        variant="solid-neon"
                      >
                        <ExternalLink size={16} aria-hidden="true" />
                        {entry.pdfLabel ?? t('portfolio.viewPdf')}
                      </Button>
                    </div>
                  )}
                </div>
                {/* Right: cover image (fully visible, never cropped) */}
                <div className="case-media relative flex min-h-[240px] items-center justify-center bg-black/30 p-4 md:min-h-[480px] md:p-6">
                  <img
                    src={entry.image}
                    alt={entry.alt}
                    width={1200}
                    height={675}
                    className="max-h-[52vh] w-auto max-w-full object-contain"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.dataset.fbk && entry.fallbackImage) {
                        img.dataset.fbk = '1';
                        img.src = entry.fallbackImage;
                      } else {
                        img.style.display = 'none';
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="font-display text-base font-bold text-text-primary">{entry.title}</p>
                    <p className="text-caption uppercase tracking-widest text-neon-blue">
                      {entry.categoryLabel}
                    </p>
                  </div>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    aria-label={t('portfolio.lightbox.close')}
                    className="glass glass-glow-blue inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-primary"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
                <div className="aspect-[16/10] w-full overflow-hidden rounded-b-3xl bg-bg-secondary">
                  <img
                    src={entry.image}
                    alt={entry.alt}
                    width={1200}
                    height={750}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (!img.dataset.fbk && entry.fallbackImage) {
                        img.dataset.fbk = '1';
                        img.src = entry.fallbackImage;
                      } else {
                        img.style.display = 'none';
                      }
                    }}
                  />
                </div>
                {entry.pdf && (
                  <div className="px-5 pb-5">
                    <Button
                      href={entry.pdf}
                      target="_blank"
                      rel="noreferrer noopener"
                      variant="solid-neon"
                      className="w-full sm:w-auto"
                    >
                      <ExternalLink size={16} aria-hidden="true" />
                      {entry.pdfLabel ?? t('portfolio.viewPdf')}
                    </Button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
