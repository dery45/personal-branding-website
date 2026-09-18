import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import en from '../i18n/locales/en.json';
import id from '../i18n/locales/id.json';
import { getNested, getNestedArray, type LocaleDict } from '../i18n';

export type Lang = 'en' | 'id';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  /** Translate a string-array key (bullets, features); falls back to English, then []. */
  ta: (key: string) => string[];
  dict: LocaleDict;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const STORAGE_KEY = 'dery-lang';
const DICTS: Record<Lang, LocaleDict> = { en: en as LocaleDict, id: id as LocaleDict };

function readStoredLang(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'en' || v === 'id') return v;
  } catch {
    // storage blocked — fall back gracefully
  }
  const htmlLang = document.documentElement.getAttribute('lang');
  if (htmlLang === 'id' || htmlLang === 'en') return htmlLang;
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    typeof document !== 'undefined' ? readStoredLang() : 'en',
  );

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // in-memory fallback
    }
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const t = useCallback(
    (key: string) => {
      const hit = getNested(DICTS[lang], key);
      if (hit !== undefined) return hit;
      const fallback = getNested(DICTS.en, key);
      return fallback ?? key;
    },
    [lang],
  );

  const ta = useCallback(
    (key: string) => {
      const hit = getNestedArray(DICTS[lang], key);
      if (hit !== undefined) return hit;
      return getNestedArray(DICTS.en, key) ?? [];
    },
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, t, ta, dict: DICTS[lang] }),
    [lang, setLang, t, ta],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

// Alias: useTranslation() hook with t('hero.tagline') / ta('experience.roles.x.bullets')
export function useTranslation() {
  const { t, ta, lang, setLang } = useLanguage();
  return { t, ta, lang, setLang };
}
