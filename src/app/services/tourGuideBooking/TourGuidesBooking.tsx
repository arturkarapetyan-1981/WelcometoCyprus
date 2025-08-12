'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface Translation {
  name: string;
  shortDescription: string;
  description: string;
}

interface Guide {
  id: number;
  slug: string;
  image: string;
  city: string;
  sector?: string;
  translations?: {
    en?: Translation;
    gr?: Translation;
    ru?: Translation;
  };
}

const cityTranslations: Record<'en' | 'gr' | 'ru', string[]> = {
  en: ['All', 'Nicosia', 'Limassol', 'Larnaca', 'Paphos', 'Ayia Napa', 'Protaras'],
  gr: ['Όλα', 'Λευκωσία', 'Λεμεσός', 'Λάρνακα', 'Πάφος', 'Αγία Νάπα', 'Πρωταράς'],
  ru: ['Все', 'Никосия', 'Лимассол', 'Ларнака', 'Пафос', 'Айя-Напа', 'Протарас'],
};

const cityMap: Record<'gr' | 'ru', Record<string, string>> = {
  gr: {
    'Λευκωσία': 'Nicosia',
    'Λεμεσός': 'Limassol',
    'Λάρνακα': 'Larnaca',
    'Πάφος': 'Paphos',
    'Αγία Νάπα': 'Ayia Napa',
    'Πρωταράς': 'Protaras',
  },
  ru: {
    'Никосия': 'Nicosia',
    'Лимассол': 'Limassol',
    'Ларнака': 'Larnaca',
    'Пафос': 'Paphos',
    'Айя-Напа': 'Ayia Napa',
    'Протарас': 'Protaras',
  },
};

export default function TourGuidesBooking() {
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') as 'en' | 'gr' | 'ru') || 'en';

  const [guides, setGuides] = useState<Guide[]>([]);
  const [filteredCity, setFilteredCity] = useState<string>(cityTranslations[lang][0]);

  const cities = cityTranslations[lang];

  useEffect(() => {
    setFilteredCity(cityTranslations[lang][0]);
  }, [lang]);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/tour-guides.json');
        if (!res.ok) throw new Error('Failed to fetch guides data');
        const data: Guide[] = await res.json();
        setGuides(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchGuides();
  }, []);

  const getCityInEnglish = (cityLabel: string): string => {
    if (lang === 'en' || cityLabel === cities[0]) return cityLabel;
    return cityMap[lang]?.[cityLabel] || cityLabel;
  };

  const filteredGuides =
    filteredCity === cities[0]
      ? guides
      : guides.filter((g) => g.city === getCityInEnglish(filteredCity));

  return (
    <div className="relative min-h-screen w-full overflow-hidden select-none">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="https://arturkarapetyan-1981.github.io/my-video-api/videos/guides-bg.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 text-white min-h-screen px-4 py-20">
        <h1 className="text-3xl font-bold text-center mb-8">
          {lang === 'en' && 'Find and book a professional tour guide in Cyprus.'}
          {lang === 'gr' && 'Βρείτε και κλείστε έναν επαγγελματία ξεναγό στην Κύπρο.'}
          {lang === 'ru' && 'Найдите и забронируйте профессионального гида на Кипре.'}
        </h1>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setFilteredCity(city)}
              className={`px-4 py-2 rounded-full cursor-pointer ${
                filteredCity === city
                  ? 'bg-[var(--orange)] text-white'
                  : 'bg-gray-100 text-[var(--mid-teal)]'
              } hover:bg-[var(--orange-hover)] transition`}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredGuides.map((guide) => {
            const translation = guide.translations?.[lang] || guide.translations?.en;
            if (!translation) return null;

            return (
              <div
                key={guide.id}
                className="bg-white text-black shadow rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition"
              >
                <div className="overflow-hidden rounded-xl mb-4">
                  <Image
                    src={guide.image}
                    alt={translation.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2">{translation.name}</h2>
                <p className="text-gray-600 mb-2">{translation.shortDescription}</p>
                <p className="text-gray-500 text-sm mb-4">{translation.description}</p>
                <Link
                  href={`/services/tourGuideBooking/${guide.slug}?lang=${lang}`}
                  className="mt-auto bg-[var(--orange)] text-white text-center py-2 rounded-xl hover:bg-[var(--orange-hover)] transition"
                >
                  {lang === 'en' && 'Book Guide'}
                  {lang === 'gr' && 'Κλείστε Ξεναγό'}
                  {lang === 'ru' && 'Забронировать гида'}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
