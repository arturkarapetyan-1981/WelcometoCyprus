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

interface Tour {
  id: number;
  slug: string;
  image: string;
  city: string;
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

export default function TourReservations() {
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') as 'en' | 'gr' | 'ru') || 'en';

  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredCity, setFilteredCity] = useState<string>(cityTranslations[lang][0]);

  const cities = cityTranslations[lang];

  useEffect(() => {
    setFilteredCity(cityTranslations[lang][0]);
  }, [lang]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/tours.json');
        if (!res.ok) throw new Error('Failed to fetch tour data');
        const data: Tour[] = await res.json();
        setTours(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchTours();
  }, []);

  const filteredTours =
    filteredCity === cities[0]
      ? tours
      : tours.filter(
          (tour) => tour.city === cityTranslations['en'][cities.indexOf(filteredCity)]
        );

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-10"
      >
        <source src="https://arturkarapetyan-1981.github.io/my-video-api/videos/tours-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay Content */}
      <div className="relative z-10 bg-black/50 text-white min-h-screen px-4 py-20">
        <h1 className="text-3xl font-bold text-center mb-8">
          {lang === 'en' && 'Discover and book the best tours in Cyprus.'}
          {lang === 'gr' && 'Ανακαλύψτε και κλείστε τις καλύτερες περιηγήσεις στην Κύπρο.'}
          {lang === 'ru' && 'Откройте для себя лучшие туры на Кипре и бронируйте сейчас.'}
        </h1>

        {/* City Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setFilteredCity(city)}
              className={`px-4 py-2 rounded-full cursor-pointer backdrop-blur-sm ${
                filteredCity === city
                  ? 'bg-[var(--orange)] text-white'
                  : 'bg-gray-100/80 text-[var(--mid-teal)]'
              } hover:bg-[var(--orange-hover)] transition`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Tours Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredTours.map((tour) => {
            const translation = tour.translations?.[lang] || tour.translations?.en;
            if (!translation) return null;

            return (
              <div
                key={tour.id}
                className="overflow-hidden bg-white/80 backdrop-blur-sm text-black shadow rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition"
              >
                <div className="overflow-hidden rounded-xl mb-4">
                  <Image
                    src={tour.image}
                    alt={translation.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-xl transition-transform duration-300 ease-in-out hover:scale-105"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2">{translation.name}</h2>
                <p className="text-gray-600 mb-2">{translation.shortDescription}</p>
                <p className="text-gray-500 text-sm mb-4">{translation.description}</p>
                <Link
                  href={`/services/travelsTours/${tour.slug}?lang=${lang}`}
                  className="mt-auto bg-[var(--orange)] text-white text-center py-2 rounded-xl hover:bg-[var(--orange-hover)] transition"
                >
                  {lang === 'en' && 'Book Tour'}
                  {lang === 'gr' && 'Κλείστε Περιήγηση'}
                  {lang === 'ru' && 'Забронировать тур'}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


