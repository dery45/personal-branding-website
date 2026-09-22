import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionWrapper } from '../layout/SectionWrapper';
import { SocialLinks } from '../ui/SocialLinks';
import { ContactForm } from './ContactForm';

/**
 * SECTION 08 — Contact.
 * Two columns on desktop (form left, "Find me on" right); stacked on
 * mobile/tablet with the form first. Submits via Netlify Forms.
 */
export function Contact() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  return (
    <SectionWrapper id="contact" labelledBy="contact-heading">
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: reduced ? 0.05 : 0.5 }}
        className="mb-10 text-center"
      >
        <p className="text-caption font-bold uppercase tracking-[0.35em] text-neon-blue">
          {t('contact.eyebrow')}
        </p>
        <h2 id="contact-heading" className="font-display mt-3 text-display-lg font-extrabold text-text-primary">
          {t('contact.title')}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-text-secondary">{t('contact.intro')}</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10">
        <ContactForm />

        <aside className="glass flex flex-col items-center justify-center rounded-3xl p-6 text-center sm:p-8">
          <p className="text-caption font-bold uppercase tracking-[0.3em] text-text-primary">
            {t('contact.socialTitle')}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <SocialLinks size="md" glow="blue" />
          </div>
        </aside>
      </div>
    </SectionWrapper>
  );
}
