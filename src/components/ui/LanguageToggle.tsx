import { useLanguage, useTranslation, type Lang } from '../../context/LanguageContext';

/** Glass pill language switch EN | ID. Uses role="switch"-like semantics via aria-pressed per option. */
export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();

  const opt = (code: Lang, label: string) => {
    const active = lang === code;
    return (
      <button
        type="button"
        key={code}
        onClick={() => setLang(code)}
        aria-pressed={active}
        aria-label={`${t('a11y.toggleLanguage')}: ${label}`}
        className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-widest transition-colors ${
          active ? 'bg-neon-blue text-[var(--on-neon)]' : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      role="group"
      aria-label={t('a11y.toggleLanguage')}
      className="glass inline-flex items-center gap-1 rounded-full p-1"
    >
      {opt('en', 'EN')}
      {opt('id', 'ID')}
    </div>
  );
}
