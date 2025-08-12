'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface Translation {
  name: string;
  shortDescription: string;
  description: string;
}

interface Car {
  id: number;
  slug: string;
  image: string;
  brand: string;
  translations?: {
    en?: Translation;
    gr?: Translation;
    ru?: Translation;
  };
}

const brandTranslations: Record<'en' | 'gr' | 'ru', string[][]> = {
  en: [['All'], ['Nissan'], ['Toyota'], ['BMW'], ['Kia'], ['Audi'], ['Mercedes-Benz'], ['Hyundai'], ['Peugeot'], ['Volkswagen'], ['Honda'], ['Škoda'], ['Ford'], ['Mazda'], ['Renault'], ['Jeep'], ['Volvo']],
  gr: [['Όλα'], ['Nissan'], ['Toyota'], ['BMW'], ['Kia'], ['Audi'], ['Mercedes-Benz'], ['Hyundai'], ['Peugeot'], ['Volkswagen'], ['Honda'], ['Škoda'], ['Ford'], ['Mazda'], ['Renault'], ['Jeep'], ['Volvo']],
  ru: [['Все'], ['Nissan'], ['Toyota'], ['BMW'], ['Kia'], ['Audi'], ['Mercedes-Benz'], ['Hyundai'], ['Peugeot'], ['Volkswagen'], ['Honda'], ['Škoda'], ['Ford'], ['Mazda'], ['Renault'], ['Jeep'], ['Volvo']],
};

export default function CarRentalListClient() {
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') as 'en' | 'gr' | 'ru') || 'en';

  const [cars, setCars] = useState<Car[]>([]);
  const [filteredBrand, setFilteredBrand] = useState<string>(brandTranslations[lang][0][0]);
  const brands = brandTranslations[lang].flat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredBrand(brandTranslations[lang][0][0]);
  }, [lang]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/cars.json');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data: Car[] = await res.json();
        setCars(data);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      }
    };
    fetchCars();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = 150;
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredCars =
    filteredBrand === brands[0]
      ? cars
      : cars.filter((car) => car.brand === filteredBrand);

  return (
    <div className="relative min-h-screen w-full overflow-hidden select-none">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-10"
      >
        <source src="https://arturkarapetyan-1981.github.io/my-video-api/videos/cars-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="relative z-10 bg-black/60 text-white min-h-screen py-20 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          {lang === 'en' && 'Find and rent the perfect car for your trip across Cyprus.'}
          {lang === 'gr' && 'Βρείτε και ενοικιάστε το ιδανικό αυτοκίνητο για το ταξίδι σας στην Κύπρο.'}
          {lang === 'ru' && 'Найдите и арендуйте идеальный автомобиль для поездки по Кипру.'}
        </h1>

        {/* Filter Slider */}
        <div className="relative flex items-center justify-center mb-10 bg-gray-100 py-4 rounded-xl">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 z-10 bg-[var(--orange)] text-white p-2 rounded-full shadow hover:bg-[var(--orange-hover)] cursor-pointer"
          >
            &#8592;
          </button>

          {/* Brands */}
          <div
            ref={scrollRef}
            className="mx-14 flex gap-2 overflow-x-hidden whitespace-nowrap"
          >
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setFilteredBrand(brand)}
                className={`px-4 py-2 rounded-full shrink-0 cursor-pointer ${
                  filteredBrand === brand
                    ? 'bg-[var(--orange)] text-white'
                    : 'bg-gray-100 text-[var(--mid-teal)]'
                } hover:bg-[var(--orange-hover)] transition whitespace-nowrap`}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 z-10 bg-[var(--orange)] text-white p-2 rounded-full shadow hover:bg-[var(--orange-hover)] cursor-pointer"
          >
            &#8594;
          </button>
        </div>

        {/* Car Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredCars.map((car) => {
            const translation =
              car.translations?.[lang] || car.translations?.en;
            if (!translation) return null;

            return (
              <div
                key={car.id}
                className="bg-white text-black shadow rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition"
              >
                <div className="overflow-hidden rounded-xl mb-4">
                  <Image
                    width={400}
                    height={300}
                    src={car.image}
                    alt={translation.name}
                    loading="lazy"
                    className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2">{translation.name}</h2>
                <p className="text-gray-600 mb-2">{translation.shortDescription}</p>
                <p className="text-gray-500 text-sm mb-4">{translation.description}</p>
                <Link
                  href={`/services/carRentals/${car.slug}?lang=${lang}`}
                  className="mt-auto bg-[var(--orange)] text-white text-center py-2 rounded-xl hover:bg-[var(--orange-hover)] transition"
                >
                  {lang === 'en' && 'Rent this Car'}
                  {lang === 'gr' && 'Ενοικίαση Αυτοκινήτου'}
                  {lang === 'ru' && 'Арендовать авто'}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}




