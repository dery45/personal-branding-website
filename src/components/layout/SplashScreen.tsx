import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const SHOWN_KEY = 'dery-splash-shown';

/** Minimal splash: brand reveal, ~1.2s max, once per session, quick fade if reduced motion. */
export function SplashScreen() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem(SHOWN_KEY) !== '1';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!visible) return;
    const ms = reduced ? 300 : 1200;
    const id = window.setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(SHOWN_KEY, '1');
      } catch {
        // ignore
      }
    }, ms);
    return () => window.clearTimeout(id);
  }, [visible, reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label="Loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.2 : 0.45 }}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-3 bg-bg-primary"
        >
          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, letterSpacing: '0.6em' }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, letterSpacing: '0.35em' }}
            transition={{ duration: reduced ? 0.15 : 0.7, ease: 'easeOut' }}
            className="font-display text-display-md font-extrabold text-text-primary"
          >
            DERY<span className="text-neon-blue">.</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0.15 : 0.5, delay: reduced ? 0 : 0.25 }}
            className="text-caption uppercase tracking-widest text-text-secondary"
          >
            {t('splash.tagline')}
          </motion.p>
          {!reduced && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              className="mt-2 h-[2px] w-40 origin-left bg-neon-blue"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
