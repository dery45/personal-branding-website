import { Briefcase, Camera, Code, Mail, Palette } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

// Placeholder social links — real URLs not yet supplied.
// TODO: replace each "#" with the real profile URL when available.
// data-placeholder="true" marks them as inert so a future pass can find them.
export const SOCIALS = [
  { name: 'Instagram', Icon: Camera, href: '#' },
  { name: 'LinkedIn', Icon: Briefcase, href: '#' },
  { name: 'Gmail', Icon: Mail, href: '#' },
  { name: 'Behance', Icon: Palette, href: '#' },
  { name: 'GitHub', Icon: Code, href: '#' },
] as const;

interface SocialLinksProps {
  size?: 'md' | 'sm';
  glow?: 'blue' | 'green' | 'pink';
}

/** Shared social icon-buttons (Contact section + Footer). All hrefs are placeholders. */
export function SocialLinks({ size = 'md', glow = 'blue' }: SocialLinksProps) {
  const { t } = useTranslation();
  const glowCls = glow === 'blue' ? 'glass-glow-blue' : glow === 'green' ? 'glass-glow-green' : 'glass-glow-pink';
  const box = size === 'md' ? 'h-12 w-12 rounded-2xl' : 'h-10 w-10 rounded-xl';
  return (
    <>
      {SOCIALS.map(({ name, Icon, href }) => (
        <a
          key={name}
          href={href}
          data-placeholder="true"
          aria-label={`${name} — ${t('contact.socialNote')}`}
          title={`${name} — ${t('contact.socialNote')}`}
          className={`glass ${glowCls} inline-flex ${box} items-center justify-center text-text-primary transition-transform hover:scale-105`}
        >
          <Icon size={size === 'md' ? 20 : 17} aria-hidden="true" />
        </a>
      ))}
    </>
  );
}
