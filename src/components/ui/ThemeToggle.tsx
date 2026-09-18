import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../context/LanguageContext';

/** Glass pill theme switch. Accessible via aria-pressed + visible focus ring. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={!isDark}
      aria-label={t('a11y.toggleTheme')}
      title={t('a11y.toggleTheme')}
      className="glass glass-glow-blue inline-flex h-9 w-9 items-center justify-center rounded-full text-text-primary transition-transform hover:scale-105"
    >
      {isDark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
}
