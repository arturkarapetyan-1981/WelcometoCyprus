'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { Partner } from '../../types/types';

const sliderSettings = {
  dots: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 2000,
  speed: 800,
  centerMode: true,
  centerPadding: '0px',
  slidesToShow: 7,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 3 } },
    { breakpoint: 768, settings: { slidesToShow: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } },
  ],
};

const translations: Record<string, { title: string; loading: string }> = {
  en: {
    title: 'Our Partners',
    loading: 'Loading partners...',
  },
  ru: {
    title: 'Наши партнёры',
    loading: 'Загрузка партнёров...',
  },
  gr: {
    title: 'Οι Συνεργάτες μας',
    loading: 'Φόρτωση συνεργατών...',
  },
};

const OurPartners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const searchParams = useSearchParams();

  const langParam = searchParams.get('lang')?.toLowerCase();
  const lang = ['en', 'ru', 'gr'].includes(langParam || '') ? langParam! : 'en';

  const { title, loading } = translations[lang];

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/logos.json');
        const data = await res.json();
        setPartners(data);
      } catch (error) {
        console.error('Failed to fetch partners:', error);
      }
    };

    fetchLogos();
  }, []);

  return (
    <div className="w-full bg-gray-100 py-16 px-4 overflow-hidden select-none">
      <h2 className="text-center text-2xl md:text-4xl font-semibold mb-12">
        {title}
      </h2>

      {partners.length > 0 ? (
        <Slider {...sliderSettings}>
          {partners.map((partner, index) => (
            <div key={index} className="flex justify-center items-center">
              <Image
                src={partner.src}
                alt={partner.alt}
                width={200}
                height={100}
                className="w-full max-w-[180px] h-auto object-contain"
              />
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center text-gray-500">{loading}</p>
      )}
    </div>
  );
};

export default OurPartners;



