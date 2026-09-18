import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
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

  return (
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
            className="glass w-full max-w-3xl overflow-hidden rounded-3xl"
          >
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
                className="glass glass-glow-pink inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-primary"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="aspect-[16/10] w-full bg-bg-secondary">
              <img
                src={entry.fallbackImage}
                alt={entry.alt}
                width={900}
                height={562}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
