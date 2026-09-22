import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { ProjectStoryBlock, type ProjectEntry } from './ProjectStoryBlock';
import { ProjectStackCards } from './ProjectStackCards';

interface ProjectDatum {
  key: string;
  tech: string[];
  image: string;
  fallbackImage: string;
  sourceUrl?: string;
}

const PROJECTS: ProjectDatum[] = [
  {
    key: 'jagadAgro',
    tech: ['MERN', 'Figma', 'PRD', 'Team Leadership'],
    image: '/images/projects/jagad-agro-placeholder.jpg',
    fallbackImage: '/images/projects/jagad-agro-placeholder.svg',
    sourceUrl: 'https://github.com/marcellitovt/jagat-agro-wonoboyo',
  },
  {
    key: 'mylifeco',
    tech: ['Figma', 'UI/UX', 'Pitch Deck', 'Flutter Handoff'],
    image: '/images/projects/mylifeco-placeholder.jpg',
    fallbackImage: '/images/projects/mylifeco-placeholder.svg',
  },
  {
    key: 'suge',
    tech: ['PHP', 'Laravel', 'MySQL'],
    image: '/images/projects/suge-pos-placeholder.jpg',
    fallbackImage: '/images/projects/suge-pos-placeholder.svg',
    sourceUrl: 'https://github.com/dery45/POS-Laravel',
  },
  {
    key: 'indochain',
    tech: ['Blockchain', 'System Design', 'UX Flows'],
    image: '/images/projects/indochain-placeholder.jpg',
    fallbackImage: '/images/projects/indochain-placeholder.svg',
  },
];

/**
 * SECTION 04 — Selected Projects.
 * Heading through SectionWrapper; the stacking deck renders full-bleed right
 * after it. Reduced motion falls back to a static vertical stack.
 */
export function Projects() {
  const { t, ta } = useTranslation();
  const reduced = useReducedMotion();

  const entries: ProjectEntry[] = PROJECTS.map((p) => ({
    name: t(`projects.items.${p.key}.name`),
    role: t(`projects.items.${p.key}.role`),
    duration: t(`projects.items.${p.key}.duration`),
    description: t(`projects.items.${p.key}.description`),
    features: ta(`projects.items.${p.key}.features`),
    imageAlt: t(`projects.items.${p.key}.imageAlt`),
    tech: p.tech,
    image: p.image,
    fallbackImage: p.fallbackImage,
    sourceUrl: p.sourceUrl,
  }));

  return (
    <>
      {/* Custom section shell (not SectionWrapper): this section must NOT have
          the standard min-height — it would inject a full viewport of dead
          space between the heading and the pinned deck. */}
      <section id="projects" aria-labelledby="projects-heading" className="relative scroll-mt-24 pt-16 md:pt-24">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: reduced ? 0.05 : 0.5 }}
            className="mb-8 text-center md:mb-10"
          >
            <p className="text-caption font-bold uppercase tracking-[0.35em] text-neon-blue">
              {t('projects.eyebrow')}
            </p>
            <h2 id="projects-heading" className="font-display mt-3 text-display-lg font-extrabold text-text-primary">
              {t('projects.title')}
            </h2>
          </motion.div>
        </div>

        {reduced && (
          <div className="mx-auto w-full max-w-6xl space-y-16 px-5 pb-16 sm:px-8 md:space-y-24 md:pb-24">
            {entries.map((entry, i) => (
              <ProjectStoryBlock key={PROJECTS[i].key} entry={entry} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Full-bleed stacking deck — outside the constrained column so cards
          can use the true viewport width; not nested, so it can't be clipped
          against a narrower content column.
          NOTE: overflow-x-clip (NOT hidden) — `hidden` creates a scroll
          container that would break the sticky pin; `clip` clips without one. */}
      {!reduced && (
        <div className="relative w-full overflow-x-clip">
          <ProjectStackCards entries={entries} entryKeys={PROJECTS.map((p) => p.key)} />
        </div>
      )}
    </>
  );
}
