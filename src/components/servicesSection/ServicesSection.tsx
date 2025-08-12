'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Service, ServicesData } from '../../types/types';

export default function ServicesSection() {
  const [services, setServices] = useState<Service[] | null>(null);
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') as 'en' | 'gr' | 'ru') || 'en';

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/services.json');
        const data: ServicesData = await res.json();
        setServices(data[lang] || data['en']);
      } catch (error) {
        console.error('Failed to load services:', error);
      }
    };

    fetchServices();
  }, [lang]);

  if (!services) return null;

  const sectionTitle =
    lang === 'gr'
      ? 'Οι Υπηρεσίες μας'
      : lang === 'ru'
      ? 'Наши Услуги'
      : 'Our Services';

  const sectionDescription =
    lang === 'gr'
      ? 'Εξερευνήστε μια ευρεία γκάμα υπηρεσιών για τη δική σας άνεση.'
      : lang === 'ru'
      ? 'Изучите широкий спектр услуг для вашего удобства и комфорта.'
      : 'Explore a wide range of services tailored for your convenience and comfort.';

  return (
    <section className="w-full py-16 bg-[var(--gradient)] select-none">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white">{sectionTitle}</h2>
        <p className="text-md md:text-lg text-white">{sectionDescription}</p>
      </div>

      <div className="max-w-7xl mx-auto mt-10 px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Link
            key={index}
            href={service.href}
            className="flex flex-col items-center text-center bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg hover:bg-gray-100 transition"
          >
            <div className="mb-4 text-4xl">{service.icon || '🛎️'}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
            <p className="text-sm text-gray-600 text-justify">{service.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}










