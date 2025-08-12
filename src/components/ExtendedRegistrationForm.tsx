'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import emailjs from '@emailjs/browser';

interface TranslationData {
  title: string;
  organization: string;
  field: string;
  phone: string;
  email: string;
  telegram: string;
  message: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
}

export default function ExtendedRegistrationForm() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang');
  const lang = ['en', 'gr', 'ru'].includes(langParam ?? '') ? langParam! : 'en';

  const [translations, setTranslations] = useState<TranslationData | null>(null);
  const [formData, setFormData] = useState({
    organization: '',
    field: '',
    phone: '',
    email: '',
    telegram: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('https://arturkarapetyan-1981.github.io/host_api/form.json')
      .then((res) => res.json())
      .then((data) => setTranslations(data[lang]))
      .catch((err) => {
        console.error('Failed to load translation:', err);
      });
  }, [lang]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await emailjs.send(
        'service_7pnjl3t',
        'template_rryyysb',
        {
          organization: formData.organization,
          field: formData.field,
          phone: formData.phone,
          email: formData.email,
          telegram: formData.telegram,
          message: formData.message,
        },
        'VF5jwngF6BJwnNMlD'
      );

      setStatus('success');
      setFormData({
        organization: '',
        field: '',
        phone: '',
        email: '',
        telegram: '',
        message: '',
      });
    } catch (error) {
      console.error('Email send failed:', error);
      setStatus('error');
    }
  };

  if (!translations) {
    return <p className="text-white text-center py-4"></p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow space-y-6 mb-16 select-none"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        {translations.title}
      </h2>

      {status === 'success' && (
        <p className="text-[var(--mid-teal)]">✅ {translations.success}</p>
      )}
      {status === 'error' && (
        <p className="text-red-600">❌ {translations.error}</p>
      )}
      {status === 'sending' && (
        <p className="text-blue-600">⏳ {translations.sending}</p>
      )}

      <input
        type="text"
        name="organization"
        value={formData.organization}
        onChange={handleChange}
        required
        placeholder={translations.organization}
        className="w-full rounded-md border p-2"
      />
      <input
        type="text"
        name="field"
        value={formData.field}
        onChange={handleChange}
        required
        placeholder={translations.field}
        className="w-full rounded-md border p-2"
      />
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        placeholder={translations.phone}
        className="w-full rounded-md border p-2"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder={translations.email}
        className="w-full rounded-md border p-2"
      />
      <input
        type="text"
        name="telegram"
        value={formData.telegram}
        onChange={handleChange}
        required
        placeholder={translations.telegram}
        className="w-full rounded-md border p-2"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder={translations.message}
        className="w-full rounded-md border p-2"
        rows={4}
      />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-[var(--orange)] text-white py-2 px-4 rounded-md hover:bg-[var(--orange-hover)] cursor-pointer transition"
      >
        {status === 'sending' ? translations.sending : translations.submit}
      </button>
    </form>
  );
}



