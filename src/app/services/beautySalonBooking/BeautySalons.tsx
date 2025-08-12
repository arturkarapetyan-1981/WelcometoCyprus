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

interface BeautySalon {
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
  en: ['All', 'Nicosia', 'Limassol', 'Larnaca', 'Paphos', 'Ayia Napa', 'Protaras', 'Paralimni'],
  gr: ['Όλα', 'Λευκωσία', 'Λεμεσός', 'Λάρνακα', 'Πάφος', 'Αγία Νάπα', 'Πρωταράς', 'Παραλίμνι'],
  ru: ['Все', 'Никосия', 'Лимассол', 'Ларнака', 'Пафос', 'Айя-Напа', 'Протарас', 'Паралимни'],
};

export default function BeautySalons() {
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') as 'en' | 'gr' | 'ru') || 'en';

  const [salons, setSalons] = useState<BeautySalon[]>([]);
  const [filteredCity, setFilteredCity] = useState<string>(cityTranslations[lang][0]);

  const cities = cityTranslations[lang];

  useEffect(() => {
    setFilteredCity(cityTranslations[lang][0]);
  }, [lang]);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/beauty.json');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data: BeautySalon[] = await res.json();
        setSalons(data);
      } catch (error) {
        console.error('Failed to fetch beauty salons:', error);
      }
    };
    fetchSalons();
  }, []);

  const filteredSalons =
    filteredCity === cities[0]
      ? salons
      : salons.filter(
          (salon) => salon.city === cityTranslations['en'][cities.indexOf(filteredCity)]
        );

  return (
    <div className="relative min-h-screen w-full overflow-hidden select-none">
      {/* Fullscreen Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="https://arturkarapetyan-1981.github.io/my-video-api/videos/salons-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content Overlay */}
      <div className="relative z-10 bg-black/60 text-white min-h-screen px-4 py-20">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-8">
          {lang === 'en' &&
            'Book your appointment at your preferred time and stylist, and indulge in a day of beauty and relaxation.'}
          {lang === 'gr' &&
            'Κλείστε το ραντεβού σας στην ώρα και τον κομμωτή που προτιμάτε και απολαύστε μια μέρα ομορφιάς και χαλάρωσης.'}
          {lang === 'ru' &&
            'Запишитесь на прием в удобное для вас время к своему стилисту и подарите себе день красоты и отдыха.'}
        </h1>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setFilteredCity(city)}
              className={`px-4 py-2 rounded-full border-none cursor-pointer ${
                filteredCity === city
                  ? 'bg-[var(--orange)] text-white'
                  : 'bg-gray-100 text-[var(--mid-teal)]'
              } hover:bg-[var(--orange-hover)] transition`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Salon Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredSalons.map((salon) => {
            const translation =
              salon.translations?.[lang] || salon.translations?.en;
            if (!translation) return null;

            return (
              <div
                key={salon.id}
                className="bg-white text-black shadow rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition"
              >
                <div className="overflow-hidden rounded-xl mb-4">
                  <Image
                    width={400}
                    height={300}
                    src={salon.image}
                    alt={translation.name}
                    loading="lazy"
                    className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2">{translation.name}</h2>
                <p className="text-gray-600 mb-2">{translation.shortDescription}</p>
                <p className="text-gray-500 text-sm mb-4">{translation.description}</p>
                <Link
                  href={`/services/beautySalonBooking/${salon.slug}?lang=${lang}`}
                  className="mt-auto bg-[var(--orange)] text-white text-center py-2 rounded-xl hover:bg-[var(--orange-hover)] transition"
                >
                  {lang === 'en' && 'Book Now'}
                  {lang === 'gr' && 'Κλείστε Ραντεβού'}
                  {lang === 'ru' && 'Записаться'}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}









