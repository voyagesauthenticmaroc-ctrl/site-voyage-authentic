'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle } from 'lucide-react';

interface ContactFormProps {
  whatsapp: string;
}

export function ContactForm({ whatsapp }: ContactFormProps) {
  const t = useTranslations('contactForm');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = t('whatsappGreeting', { name: form.name, email: form.email, message: form.message });
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle size={48} className="text-gold" />
        <p className="text-white text-lg font-display">{t('sentTitle')}</p>
        <p className="text-white/60 text-sm">{t('sentSubtitle')}</p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}
          className="btn btn-outline-white mt-2 text-xs"
        >
          {t('sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className="block text-sm font-medium text-white/70 mb-2">
            {t('nameLabel')}
          </label>
          <input
            id="cf-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t('namePlaceholder')}
            className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded text-white placeholder-white/50 focus:outline-none focus:border-gold focus:bg-white/12 text-sm transition-colors"
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="block text-sm font-medium text-white/70 mb-2">
            {t('emailLabel')}
          </label>
          <input
            id="cf-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder={t('emailPlaceholder')}
            className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded text-white placeholder-white/50 focus:outline-none focus:border-gold focus:bg-white/12 text-sm transition-colors"
          />
        </div>
      </div>
      <div>
        <label htmlFor="cf-message" className="block text-sm font-medium text-white/70 mb-2">
          {t('messageLabel')}
        </label>
        <textarea
          id="cf-message"
          rows={4}
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder={t('messagePlaceholder')}
          className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded text-white placeholder-white/50 focus:outline-none focus:border-gold focus:bg-white/12 text-sm transition-colors resize-none"
        />
      </div>
      <button type="submit" className="btn btn-primary w-full gap-2">
        <Send size={15} />
        {t('sendViaWhatsApp')}
      </button>
      <p className="text-white/55 text-xs text-center">
        {t('responseNote')}
      </p>
    </form>
  );
}
