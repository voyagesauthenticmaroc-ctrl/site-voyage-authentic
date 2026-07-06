'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ContactFormFullProps {
  whatsapp: string;
}

interface FormState {
  nom: string;
  email: string;
  telephone: string;
  dates: string;
  personnes: string;
  typeVoyage: string;
  message: string;
}

type FieldErrors = Partial<Record<'nom' | 'email' | 'message', string>>;

const EMPTY: FormState = {
  nom: '',
  email: '',
  telephone: '',
  dates: '',
  personnes: '',
  typeVoyage: '',
  message: '',
};

const TRIP_TYPE_KEYS = ['cultural', 'desert', 'beach', 'grand', 'custom', 'transfer', 'other'] as const;

function validate(form: FormState): FieldErrors {
  const e: FieldErrors = {};
  if (!form.nom.trim()) e.nom = 'errName';
  if (!form.email.trim()) e.email = 'errEmail';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'errEmailFormat';
  if (!form.message.trim()) e.message = 'errMessage';
  return e;
}

export function ContactFormFull({ whatsapp }: ContactFormFullProps) {
  const t = useTranslations('quoteForm');
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  const set = useCallback(
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const val = e.target.value;
        setForm((f) => {
          const next = { ...f, [field]: val };
          if (touched[field]) setErrors(validate(next));
          return next;
        });
      },
    [touched],
  );

  const blur = useCallback(
    (field: keyof FormState) => () => {
      setTouched((t) => ({ ...t, [field]: true }));
      setErrors((prev) => ({ ...prev, ...validate(form) }));
    },
    [form],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ nom: true, email: true, message: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? t('errServer'));
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setServerError(t('errNetwork'));
      setStatus('error');
    }
  };

  const ic = (field?: 'nom' | 'email' | 'message') =>
    `w-full border rounded-md px-4 py-3 bg-surface focus:outline-none focus:ring-2 focus:ring-gold transition-colors ${
      field && errors[field] ? 'border-red-400 focus:ring-red-300' : 'border-border'
    }`;

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-5 py-14 text-center">
        <CheckCircle size={56} className="text-gold" />
        <h2 className="text-display-md">{t('successTitle')}</h2>
        <p className="text-text-muted max-w-sm leading-relaxed">{t('successText')}</p>
        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(t('whatsappFollowUp'))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary mt-2"
        >
          {t('alsoWhatsApp')}
        </a>
        <button
          onClick={() => {
            setStatus('idle');
            setForm(EMPTY);
            setTouched({});
            setErrors({});
          }}
          className="text-sm text-text-muted underline underline-offset-2"
        >
          {t('sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
      aria-label={t('ariaLabel')}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium mb-1">
            {t('fullNameLabel')} <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            required
            autoComplete="name"
            value={form.nom}
            onChange={set('nom')}
            onBlur={blur('nom')}
            placeholder={t('fullNamePlaceholder')}
            className={ic('nom')}
            aria-invalid={!!errors.nom}
            aria-describedby={errors.nom ? 'err-nom' : undefined}
          />
          {errors.nom && (
            <p id="err-nom" role="alert" className="text-xs text-red-500 mt-1">
              {t(errors.nom as 'errName')}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {t('emailLabel')} <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
            onBlur={blur('email')}
            placeholder={t('emailPlaceholder')}
            className={ic('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'err-email' : undefined}
          />
          {errors.email && (
            <p id="err-email" role="alert" className="text-xs text-red-500 mt-1">
              {t(errors.email as 'errEmail')}
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="telephone" className="block text-sm font-medium mb-1">
            {t('phoneLabel')}{' '}
            <span className="text-text-muted text-xs font-normal">{t('optional')}</span>
          </label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            autoComplete="tel"
            value={form.telephone}
            onChange={set('telephone')}
            placeholder={t('phonePlaceholder')}
            className={ic()}
          />
        </div>
        <div>
          <label htmlFor="personnes" className="block text-sm font-medium mb-1">
            {t('travellersLabel')}
          </label>
          <input
            type="number"
            id="personnes"
            name="personnes"
            min="1"
            max="50"
            value={form.personnes}
            onChange={set('personnes')}
            placeholder="2"
            className={ic()}
          />
        </div>
      </div>

      <div>
        <label htmlFor="dates" className="block text-sm font-medium mb-1">
          {t('datesLabel')}
        </label>
        <input
          type="text"
          id="dates"
          name="dates"
          value={form.dates}
          onChange={set('dates')}
          placeholder={t('datesPlaceholder')}
          className={ic()}
        />
      </div>

      <div>
        <label htmlFor="typeVoyage" className="block text-sm font-medium mb-1">
          {t('tripTypeLabel')}
        </label>
        <select
          id="typeVoyage"
          name="typeVoyage"
          value={form.typeVoyage}
          onChange={set('typeVoyage')}
          className={ic()}
        >
          <option value="">{t('tripTypePlaceholder')}</option>
          {TRIP_TYPE_KEYS.map((key) => (
            <option key={key} value={t(`tripTypes.${key}`)}>
              {t(`tripTypes.${key}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          {t('messageLabel')} <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={set('message')}
          onBlur={blur('message')}
          placeholder={t('messagePlaceholder')}
          className={`${ic('message')} resize-none`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'err-message' : undefined}
        />
        {errors.message && (
          <p id="err-message" role="alert" className="text-xs text-red-500 mt-1">
            {t(errors.message as 'errMessage')}
          </p>
        )}
      </div>

      {status === 'error' && (
        <div
          role="alert"
          className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700"
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn btn-primary w-full sm:w-auto gap-2 disabled:opacity-70"
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            {t('sending')}
          </>
        ) : (
          <>
            <Send size={15} />
            {t('submit')}
          </>
        )}
      </button>

      <p className="text-xs text-text-muted text-center">
        {t('consentNote')}
      </p>
    </form>
  );
}
