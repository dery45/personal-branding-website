import { ArrowUp } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { SocialLinks } from '../ui/SocialLinks';

const FOOTER_LINKS = [
  { key: 'nav.home', href: '#hero' },
  { key: 'nav.experience', href: '#experience' },
  { key: 'nav.projects', href: '#projects' },
  { key: 'nav.education', href: '#education' },
  { key: 'nav.achievements', href: '#achievements' },
  { key: 'nav.portfolio', href: '#portfolio' },
  { key: 'nav.contact', href: '#contact' },
];

/**
 * SECTION 10 — Footer.
 * Flat, conclusive treatment (no heavy glass): brand mark, compact anchor nav
 * (labels reused from nav.* — single source of truth), shared social
 * placeholders, dynamic-year copyright, keyboard-accessible back-to-top (#hero).
 */
export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--glass-border)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-5 py-10 sm:px-8">
        <a
          href="#hero"
          className="font-display text-xl font-extrabold tracking-widest text-text-primary"
          aria-label={`${t('nav.home')} — Dery`}
        >
          DERY<span className="text-neon-blue">.</span>
        </a>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-caption font-bold uppercase tracking-widest text-text-secondary transition-colors hover:text-neon-blue"
                >
                  {t(l.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-wrap justify-center gap-2.5">
          <SocialLinks size="sm" glow="blue" />
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-3 border-t border-[var(--glass-border)] pt-5 sm:flex-row">
          <p className="text-caption text-text-secondary">© {year} Dery Andrian Pratama</p>
          <a
            href="#hero"
            aria-label={t('footer.backToTop')}
            title={t('footer.backToTop')}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-caption font-bold uppercase tracking-widest text-text-secondary transition-colors hover:text-neon-blue"
          >
            {t('footer.backToTop')}
            <ArrowUp size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
