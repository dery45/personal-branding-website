import type { HTMLAttributes, ReactNode } from 'react';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** neon edge glow on hover/focus: blue | green | pink | none */
  glow?: 'blue' | 'green' | 'pink' | 'none';
  className?: string;
}

/**
 * GlassPanel — generic glass container (nav, modals, form containers, highlight chips).
 * Props: glow ('blue'|'green'|'pink'|'none', default 'none'), plus all div props.
 */
export function GlassPanel({ children, glow = 'none', className = '', ...rest }: GlassPanelProps) {
  const glowClass =
    glow === 'blue' ? 'glass-glow-blue' : glow === 'green' ? 'glass-glow-green' : glow === 'pink' ? 'glass-glow-pink' : '';
  return (
    <div className={`glass ${glowClass} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: 'blue' | 'green' | 'pink' | 'none';
  className?: string;
}

/**
 * GlassCard — card variant of GlassPanel; use for cards across all 10 sections.
 * Props: same as GlassPanel.
 */
export function GlassCard({ children, glow = 'none', className = '', ...rest }: GlassCardProps) {
  const glowClass =
    glow === 'blue' ? 'glass-glow-blue' : glow === 'green' ? 'glass-glow-green' : glow === 'pink' ? 'glass-glow-pink' : '';
  return (
    <div className={`glass ${glowClass} p-6 ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
