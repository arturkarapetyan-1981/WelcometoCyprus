'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface ServiceContent {
  title: { en: string; el: string; ru: string };
  description: { en: string; el: string; ru: string };
  image: string;
  link: string; // ✅ added this
}

interface PrincipleContent {
  en: string;
  el: string;
  ru: string;
}

interface ServicesContent {
  heading: { en: string; el: string; ru: string };
  intro: { en: string; el: string; ru: string };
  services: ServiceContent[];
  principlesTitle: { en: string; el: string; ru: string };
  principles: PrincipleContent[];
  outro: { en: string; el: string; ru: string };
}

const ServicesClient: React.FC = () => {
  const [content, setContent] = useState<ServicesContent | null>(null);
  const [lang, setLang] = useState<'en' | 'el' | 'ru'>('en');
  const searchParams = useSearchParams();

  useEffect(() => {
    const langParam = searchParams.get('lang');
    const detectedLang =
      langParam === 'gr' ? 'el' : langParam === 'ru' ? 'ru' : 'en';
    setLang(detectedLang);

    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://arturkarapetyan-1981.github.io/host_api/service.json'
        );
        const data: ServicesContent = await res.json();
        setContent(data);
      } catch (error) {
        console.error('Failed to load services data:', error);
      }
    };

    fetchData();
  }, [searchParams]);

  if (!content) {
    return <div className="text-center py-20 text-white">Loading...</div>;
  }

  const bookingLabels = {
    en: 'Booking',
    el: 'Κράτηση',
    ru: 'Бронирование',
  };

  return (
    <main className="relative overflow-hidden text-white min-h-screen select-none">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-2]"
      >
        <source
          src="https://arturkarapetyan-1981.github.io/my-video-api/videos/about-bg.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="absolute top-0 left-0 w-full h-full z-[-1]" />

      <div className="relative py-16 px-6 md:px-20 flex justify-center">
        <div className="bg-white text-gray-800 rounded-2xl shadow-lg p-10 w-full max-w-6xl">
          <h1 className="text-4xl font-bold mb-8 text-center text-[var(--mid-teal)]">
            {content.heading[lang]}
          </h1>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {content.services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col"
              >
                <Image
                  width={400}
                  height={300}
                  src={service.image}
                  alt={service.title[lang]}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-[var(--mid-teal)] mb-2">
                    {service.title[lang]}
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    {service.description[lang]}
                  </p>
                  <Link
                    href={`${service.link}?lang=${lang === 'el' ? 'gr' : lang}`}
                    className="mt-auto inline-block text-center px-4 py-2 bg-[var(--mid-teal)] text-white rounded hover:bg-teal-700 transition"
                  >
                    {bookingLabels[lang]}
                  </Link>
                </div>
              </div>
            ))}
          </section>

          <section className="bg-gray-100 p-8 rounded-2xl shadow mb-12">
            <h2 className="text-2xl font-semibold text-[var(--mid-teal)] text-center mb-4">
              {content.principlesTitle[lang]}
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              {content.principles.map((principle, i) => (
                <li key={i}>{principle[lang]}</li>
              ))}
            </ul>
          </section>

          <section className="text-center">
            <p className="text-lg text-gray-800 max-w-3xl mx-auto">
              {content.outro[lang]}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ServicesClient;


