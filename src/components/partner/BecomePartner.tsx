'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface Translation {
  title: string;
  text: string;
}

export default function BecomePartner() {
  const [data, setData] = useState<Translation | null>(null);
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';

  useEffect(() => {
    const fetchTranslation = async () => {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/partner.json');
        const json = await res.json();
        setData(json[lang] || json['en']);
      } catch (error) {
        console.error('Failed to load translation:', error);
      }
    };

    fetchTranslation();
  }, [lang]);

  if (!data) return null;

  return (
    <section className="flex flex-col md:flex-row items-center justify-between p-6 md:p-12 bg-white shadow-lg rounded-2xl max-w-6xl mx-auto my-12 select-none">
      {/* Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src="/partner-2.jpg"
          alt="Become a Partner"
          width={500}
          height={350}
          className="rounded-2xl object-cover"
          priority
        />
      </div>

      {/* Text */}
      <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {data.title}
        </h2>
        {data.text.split('\n\n').map((paragraph, i) => (
          <p key={i} className="text-gray-700 text-lg leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}


