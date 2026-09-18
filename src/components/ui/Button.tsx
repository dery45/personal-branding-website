import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'glass' | 'solid-neon';

interface BaseProps {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Button — variants: 'glass' (glass bg + neon border on hover) | 'solid-neon'.
 * Renders <a> when href is provided, otherwise <button>. Real onClick/href only.
 */
export function Button(props: ButtonProps) {
  const { variant = 'glass', children, className = '', ...rest } = props;
  const styles =
    variant === 'solid-neon'
      ? 'bg-neon-green text-[var(--on-neon)] hover:brightness-110 border border-transparent font-bold'
      : 'glass glass-glow-blue text-text-primary hover:border-neon-blue';

  const cls = `inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold tracking-wide transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${styles} ${className}`.trim();

  if ('href' in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a href={href} className={cls} {...anchorRest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
