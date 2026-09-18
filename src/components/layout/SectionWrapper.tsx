import type { ReactNode } from 'react';

interface SectionWrapperProps {
  id?: string;
  children: ReactNode;
  className?: string;
  /** fallback accessible name when the section has no labelled heading */
  ariaLabel?: string;
  /** id of the section's heading — preferred over ariaLabel (aria-labelledby) */
  labelledBy?: string;
}

/**
 * SectionWrapper — generic section container.
 * Applies ~100vh min-height only when content allows (min-h with auto growth,
 * no fixed height), consistent horizontal padding, and scroll-margin for anchors.
 */
export function SectionWrapper({ id, children, className = '', ariaLabel, labelledBy }: SectionWrapperProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : ariaLabel}
      className={`relative mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 md:py-24 ${className}`.trim()}
      style={{ minHeight: 'min(100vh, max-content)' }}
    >
      {children}
    </section>
  );
}
