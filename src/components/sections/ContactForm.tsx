import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, LoaderCircle, Send } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useContactForm, type ContactFields } from '../../hooks/useContactForm';
import { Button } from '../ui/Button';

const inputCls =
  'w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-4 py-3 text-body text-text-primary placeholder:text-text-secondary/70 focus:border-neon-blue focus:outline-none disabled:opacity-60';

/**
 * ContactForm — frontend-only form captured by Netlify Forms (no backend code,
 * no env vars, no secrets).
 *
 * How it works: the visible form posts URL-encoded to "/" with
 * `form-name=contact`. Netlify detects the form at build time via the hidden
 * static <form name="contact"> mirror in index.html — the field `name`
 * attributes must stay in sync between the two. Real delivery only happens on
 * a Netlify deployment; in local dev a successful fetch just exercises the UI.
 */
export function ContactForm() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const { fields, setField, touch, errors, isValid, status, submit, resetStatus } =
    useContactForm();

  if (status === 'success') {
    return (
      <div
        role="status"
        className="glass rounded-2xl p-8 text-center"
      >
        <CheckCircle2 size={40} aria-hidden="true" className="mx-auto text-neon-green" />
        <p className="font-display mt-4 text-display-md font-extrabold text-text-primary">
          {t('contact.form.successTitle')}
        </p>
        <p className="mx-auto mt-2 max-w-md text-body text-text-secondary">
          {t('contact.form.successBody')}
        </p>
        <div className="mt-6">
          <Button variant="glass" onClick={resetStatus}>
            {t('contact.form.sendAnother')}
          </Button>
        </div>
      </div>
    );
  }

  const field = (
    key: keyof ContactFields,
    label: string,
    placeholder: string,
    multiline = false,
  ) => {
    const errId = `contact-${key}-error`;
    const hasError = Boolean(errors[key]);
    const common = {
      id: `contact-${key}`,
      name: key,
      placeholder,
      value: fields[key],
      disabled: status === 'loading',
      'aria-invalid': hasError,
      'aria-describedby': hasError ? errId : undefined,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => setField(key, e.target.value),
      onBlur: () => touch(key),
      className: inputCls,
    };
    return (
      <div>
        <label htmlFor={`contact-${key}`} className="mb-1.5 block text-caption font-bold uppercase tracking-widest text-text-primary">
          {label}
        </label>
        {multiline ? (
          <textarea {...common} rows={5} />
        ) : (
          <input
            {...common}
            type={key === 'email' ? 'email' : 'text'}
            autoComplete={key === 'email' ? 'email' : key === 'name' ? 'name' : undefined}
          />
        )}
        {hasError && (
          <p id={errId} role="alert" className="mt-1.5 text-caption font-bold text-neon-pink">
            {errors[key]}
          </p>
        )}
      </div>
    );
  };

  return (
    <motion.form
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduced ? 0.05 : 0.55 }}
      className="glass rounded-3xl p-6 sm:p-8"
      noValidate
      name="contact"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      aria-busy={status === 'loading'}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        void submit(String(data.get('bot-field') ?? ''));
      }}
    >
      {/* Netlify wiring: form-name must match index.html; honeypot stays empty */}
      <input type="hidden" name="form-name" value="contact" />
      <p className="hidden">
        <label>
          Don’t fill this out if you’re human:{' '}
          <input name="bot-field" tabIndex={-1} aria-hidden="true" autoComplete="off" />
        </label>
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">{field('name', t('contact.form.name'), t('contact.form.namePlaceholder'))}</div>
        <div className="sm:col-span-1">{field('email', t('contact.form.email'), t('contact.form.emailPlaceholder'))}</div>
        <div className="sm:col-span-2">{field('subject', t('contact.form.subject'), t('contact.form.subjectPlaceholder'))}</div>
        <div className="sm:col-span-2">{field('message', t('contact.form.message'), t('contact.form.messagePlaceholder'), true)}</div>
      </div>

      <div aria-live="polite">
        {status === 'error' && (
          <p role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-neon-pink/40 bg-neon-pink/10 px-4 py-3 text-body text-text-primary">
            <AlertCircle size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-neon-pink" />
            <span>{t('contact.form.errorBody')}</span>
          </p>
        )}
      </div>

      <div className="mt-6">
        <Button
          type="submit"
          variant="solid-neon"
          disabled={!isValid || status === 'loading'}
          className="w-full disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto"
        >
          {status === 'loading' ? (
            <>
              <LoaderCircle size={16} aria-hidden="true" className="animate-spin" />
              {t('contact.form.sending')}
            </>
          ) : (
            <>
              <Send size={16} aria-hidden="true" />
              {status === 'error' ? t('contact.form.retry') : t('contact.form.submit')}
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
}
