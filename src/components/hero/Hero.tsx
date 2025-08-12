'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Slider from '@/components/slider/Slider';
import Link from 'next/link';
import { PageData } from '../../types/types';

export default function HomePage() {
  const [translations, setTranslations] = useState<PageData | null>(null);
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') as 'en' | 'gr' | 'ru') || 'en';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/hero.json');
        const data = await res.json();
        setTranslations(data[lang] || data['en']);
      } catch (error) {
        console.error('Failed to load page translations:', error);
      }
    };
    fetchData();
  }, [lang]);

  if (!translations) return null;

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/header-bg.png')` }}
    >

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-12 py-12 gap-8 select-none">
        <div className="text-white max-w-xl text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight drop-shadow-md">
            {translations.title.dream} <span className="text-teal-400">|</span>{' '}
            {translations.title.explore} <span className="text-teal-400">|</span>{' '}
            {translations.title.discover}
          </h1>
          <p className="text-base sm:text-lg mb-6">{translations.slogan}</p>
          <button className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 rounded-full font-semibold">
            <Link href="/services" > {translations.explore} </Link>
          </button>
        </div>

        <Slider />
      </div>
    </div>
  );
}
