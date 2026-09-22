import { useTranslation } from '../../context/LanguageContext';
import { useScrollProgress } from '../../hooks/useScrollProgress';

/** Thin neon scroll progress bar fixed to top. */
export function ScrollProgress() {
  const progress = useScrollProgress();
  const { t } = useTranslation();
  return (
    <div
      role="progressbar"
      aria-label={t('a11y.scrollProgress')}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent"
    >
      <div
        className="h-full bg-neon-blue"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
