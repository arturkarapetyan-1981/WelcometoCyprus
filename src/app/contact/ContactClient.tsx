'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import emailjs from '@emailjs/browser';

interface TranslationData {
  title: string;
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  error: string;
}

export default function ContactClient() {
  const searchParams = useSearchParams();
  const langParam = searchParams.get('lang');
  const lang = ['en', 'gr', 'ru'].includes(langParam ?? '') ? langParam! : 'en';

  const [translations, setTranslations] = useState<TranslationData | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('https://arturkarapetyan-1981.github.io/host_api/contact.json')
      .then((res) => res.json())
      .then((data) => {
        setTranslations(data[lang]);
      })
      .catch((err) => {
        console.error('Failed to load translation:', err);
      });
  }, [lang]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const result = await emailjs.send(
        'service_denris1',
        'template_tdyhtwd',
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        'DgXamo5EQXLrWFE84'
      );

      console.log(result.text);
      setForm({ name: '', email: '', message: '' });
      setStatus('success');
    } catch (error) {
      console.error('Email send failed:', error);
      setStatus('error');
    }
  };

  if (!translations) {
    return <p className="text-center p-4 text-white">Loading...</p>;
  }

  return (
    <main className="relative w-full min-h-screen overflow-hidden select-none">
      {/* Background video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="https://arturkarapetyan-1981.github.io/my-video-api/videos/contact-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better contrast */}
      <div className="absolute inset-0  z-1" />

      {/* Form content */}
      <div className="relative z-1 p-6 md:p-12">
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center text-[var(--mid-teal)] drop-shadow-md">
            {translations.title}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">{translations.name}</label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">{translations.email}</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">{translations.message}</label>
              <textarea
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white font-bold py-2 rounded-lg transition duration-200 cursor-pointer"
            >
              {status === 'loading' ? translations.sending : translations.send}
            </button>
            {status === 'success' && (
              <p className="text-green-600 font-medium text-center mt-2">{translations.success}</p>
            )}
            {status === 'error' && (
              <p className="text-red-600 font-medium text-center mt-2">{translations.error}</p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}

