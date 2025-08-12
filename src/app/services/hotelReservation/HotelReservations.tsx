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

interface Hotel {
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

export default function HotelReservations() {
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') as 'en' | 'gr' | 'ru') || 'en';

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredCity, setFilteredCity] = useState<string>(cityTranslations[lang][0]);

  const cities = cityTranslations[lang];

  useEffect(() => {
    setFilteredCity(cityTranslations[lang][0]);
  }, [lang]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/hotels.json');
        if (!res.ok) throw new Error('Failed to fetch hotel data');
        const data: Hotel[] = await res.json();
        setHotels(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchHotels();
  }, []);

  const filteredHotels =
    filteredCity === cities[0]
      ? hotels
      : hotels.filter(
          (hotel) => hotel.city === cityTranslations['en'][cities.indexOf(filteredCity)]
        );

  return (
    <div className="relative min-h-screen w-full overflow-hidden select-none">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="https://arturkarapetyan-1981.github.io/my-video-api/videos/hotels-bg.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 bg-black/60 text-white min-h-screen px-4 py-20">
        <h1 className="text-3xl font-bold text-center mb-8">
          {lang === 'en' && 'Find and book your ideal hotel in Cyprus.'}
          {lang === 'gr' && 'Βρείτε και κλείστε το ιδανικό ξενοδοχείο σας στην Κύπρο.'}
          {lang === 'ru' && 'Найдите и забронируйте идеальный отель на Кипре.'}
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
          {filteredHotels.map((hotel) => {
            const translation = hotel.translations?.[lang] || hotel.translations?.en;
            if (!translation) return null;

            return (
              <div
                key={hotel.id}
                className="bg-white text-black shadow rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition"
              >
                <div className="overflow-hidden rounded-xl mb-4">
                  <Image
                    src={hotel.image}
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
                  href={`/services/hotelReservation/${hotel.slug}?lang=${lang}`}
                  className="mt-auto bg-[var(--orange)] text-white text-center py-2 rounded-xl hover:bg-[var(--orange-hover)] transition"
                >
                  {lang === 'en' && 'Book Now'}
                  {lang === 'gr' && 'Κλείστε Τώρα'}
                  {lang === 'ru' && 'Забронировать'}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
