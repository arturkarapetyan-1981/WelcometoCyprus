'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Lang = 'en' | 'gr' | 'ru';

interface AboutSection {
  title: string;
  subtitle: string;
  paragraphs: string[];
  founded: string;
  mission: string;
}

type AboutData = Record<Lang, AboutSection>;

export default function AboutClient() {
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') as Lang) || 'en';
  const [aboutData, setAboutData] = useState<AboutData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/about.json');
        if (!res.ok) throw new Error('Failed to fetch about.json');
        const data: AboutData = await res.json();
        setAboutData(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  if (!aboutData) {
    return <p className="text-center text-white">Loading...</p>;
  }

  const section = aboutData[lang];

  return (
    <div className="relative w-full min-h-screen pt-[100px] pb-[50px]">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/cyprus.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-white text-center">
        <h1 className="text-4xl font-bold mb-2">{section.title}</h1>
        <h2 className="text-2xl mb-6">{section.subtitle}</h2>
        {section.paragraphs.map((p, idx) => (
          <p key={idx} className="mb-4 max-w-2xl text-lg leading-relaxed">
            {p}
          </p>
        ))}
        <p className="mt-6 font-semibold">{section.founded}</p>
        <p className="italic">{section.mission}</p>
      </div>
    </div>
  );
}






