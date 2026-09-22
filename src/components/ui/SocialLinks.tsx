import { Briefcase, Camera, Code, Mail, Palette } from 'lucide-react';

export const SOCIALS = [
  { name: 'Instagram', Icon: Camera, href: 'https://www.instagram.com/dery_ap/' },
  { name: 'LinkedIn', Icon: Briefcase, href: 'https://www.linkedin.com/in/dery-andrian-pratama-9b35111b4/' },
  { name: 'Gmail', Icon: Mail, href: 'mailto:deryap.dap@gmail.com' },
  { name: 'Behance', Icon: Palette, href: 'https://www.behance.net/deryandrian' },
  { name: 'GitHub', Icon: Code, href: 'https://github.com/dery45' },
] as const;

interface SocialLinksProps {
  size?: 'md' | 'sm';
  glow?: 'blue' | 'green' | 'pink';
}

/** Shared social icon-buttons (Contact section + Footer). External profiles open in a new tab. */
export function SocialLinks({ size = 'md', glow = 'blue' }: SocialLinksProps) {
  const glowCls = glow === 'blue' ? 'glass-glow-blue' : glow === 'green' ? 'glass-glow-green' : 'glass-glow-pink';
  const box = size === 'md' ? 'h-12 w-12 rounded-2xl' : 'h-10 w-10 rounded-xl';
  return (
    <>
      {SOCIALS.map(({ name, Icon, href }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={name}
          title={name}
          className={`glass ${glowCls} inline-flex ${box} items-center justify-center text-text-primary transition-transform hover:scale-105`}
        >
          <Icon size={size === 'md' ? 20 : 17} aria-hidden="true" />
        </a>
      ))}
    </>
  );
}
