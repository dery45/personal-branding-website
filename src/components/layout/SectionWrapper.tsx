import { forwardRef, type ReactNode } from 'react';

interface SectionWrapperProps {
  id?: string;
  ariaLabel?: string;
  labelledBy?: string;
  /**
   * Full-bleed layer (e.g. a parallax photo) rendered as a direct child of the
   * outer <section> — a sibling of the constrained content column, so a plain
   * `absolute inset-0` reaches the true viewport edges. Content column below
   * stays at the normal max-width.
   */
  background?: ReactNode;
  /** Applied to the constrained inner content column (e.g. `!max-w-none`). */
  className?: string;
  children: ReactNode;
}

/**
 * SectionWrapper — generic section container.
 * Outer <section> is full-width (anchor target, vertical rhythm, min-height);
 * inner column carries the max-width + horizontal padding. `background` sits
 * behind the content column for full-bleed treatments.
 */
export const SectionWrapper = forwardRef<HTMLElement, SectionWrapperProps>(
  ({ id, ariaLabel, labelledBy, background, className = '', children }, ref) => (
    <section
      id={id}
      ref={ref}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : ariaLabel}
      className="relative scroll-mt-24 py-16 md:py-24"
      style={{ minHeight: 'min(100vh, max-content)' }}
    >
      {background}
      <div className={`relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`.trim()}>
        {children}
      </div>
    </section>
  ),
);
SectionWrapper.displayName = 'SectionWrapper';
