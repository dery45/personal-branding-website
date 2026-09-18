import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from '../context/LanguageContext';

export interface ContactFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactStatus = 'idle' | 'loading' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY: ContactFields = { name: '', email: '', subject: '', message: '' };

/**
 * useContactForm — validation + Netlify Forms submission state for <ContactForm>.
 * No env vars or client secrets needed: the form posts URL-encoded to "/"
 * with `form-name=contact`, and Netlify captures it on deploy (a matching
 * hidden static form lives in index.html for build-time form detection).
 * NOTE: real delivery only happens on a Netlify deployment — in local dev a
 * successful fetch just exercises the UI state machine.
 */
export function useContactForm() {
  const { t } = useTranslation();
  const [fields, setFields] = useState<ContactFields>(EMPTY);
  const [touched, setTouched] = useState<Record<keyof ContactFields, boolean>>({
    name: false,
    email: false,
    subject: false,
    message: false,
  });
  const [status, setStatus] = useState<ContactStatus>('idle');

  const validate = useCallback(
    (f: ContactFields): Partial<Record<keyof ContactFields, string>> => {
      const errs: Partial<Record<keyof ContactFields, string>> = {};
      if (!f.name.trim()) errs.name = t('contact.form.errors.required');
      if (!f.email.trim()) errs.email = t('contact.form.errors.required');
      else if (!EMAIL_RE.test(f.email.trim())) errs.email = t('contact.form.errors.email');
      if (!f.subject.trim()) errs.subject = t('contact.form.errors.required');
      if (!f.message.trim()) errs.message = t('contact.form.errors.required');
      return errs;
    },
    [t],
  );

  const errors = useMemo(() => {
    const all = validate(fields);
    // Show only touched fields' errors inline; submit enables all.
    const shown: Partial<Record<keyof ContactFields, string>> = {};
    (Object.keys(all) as (keyof ContactFields)[]).forEach((k) => {
      if (touched[k]) shown[k] = all[k];
    });
    return shown;
  }, [fields, touched, validate]);

  const isValid = useMemo(() => Object.keys(validate(fields)).length === 0, [fields, validate]);

  const setField = useCallback((key: keyof ContactFields, value: string) => {
    setFields((p) => ({ ...p, [key]: value }));
  }, []);

  const touch = useCallback((key: keyof ContactFields) => {
    setTouched((p) => ({ ...p, [key]: true }));
  }, []);

  const submit = useCallback(
    async (botField: string) => {
      if (status === 'loading') return;
      setTouched({ name: true, email: true, subject: true, message: true });
      if (Object.keys(validate(fields)).length > 0) return;
      setStatus('loading');
      try {
        const body = new URLSearchParams({
          'form-name': 'contact',
          name: fields.name.trim(),
          email: fields.email.trim(),
          subject: fields.subject.trim(),
          message: fields.message.trim(),
          'bot-field': botField,
        }).toString();
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body,
        });
        if (!res.ok) throw new Error(`Netlify form responded with ${res.status}`);
        setFields(EMPTY);
        setTouched({ name: false, email: false, subject: false, message: false });
        setStatus('success');
      } catch (err) {
        // Log for debugging; users only see the human-readable message.
        console.error('Contact form submission failed:', err);
        setStatus('error');
      }
    },
    [status, fields, validate],
  );

  const resetStatus = useCallback(() => setStatus('idle'), []);

  return { fields, setField, touch, errors, isValid, status, submit, resetStatus };
}
