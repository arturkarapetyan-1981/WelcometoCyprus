'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Translations {
  title: string;
  monthly: string;
  quarterly: string;
  annual: string;
  month: string;
  quarter: string;
  year: string;
  price: string;
  purchase: string;
}

export default function PackagePurchase() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';

  const [translations, setTranslations] = useState<Translations | null>(null);
  const [selected, setSelected] = useState<string>('monthly');

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch('https://arturkarapetyan-1981.github.io/host_api/purchase.json');
        const data = await response.json();
        setTranslations(data[lang] || data['en']);
      } catch (error) {
        console.error('Failed to load translations:', error);
        setTranslations(null);
      }
    };

    loadTranslations();
  }, [lang]);

  if (!translations) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const packages = [
    { id: 'monthly', name: translations.monthly, price: 100, duration: translations.month },
    { id: 'quarterly', name: translations.quarterly, price: 240, duration: translations.quarter },
    { id: 'annual', name: translations.annual, price: 600, duration: translations.year },
  ];

  const handlePurchase = () => {
    alert(`${translations.purchase}: ${selected}`);
    // Implement payment logic here
  };

  return (
    <section className="max-w-full mx-auto p-12 mb-12 bg-white select-none">
      <h2 className="text-3xl font-bold text-center mb-8">{translations.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => setSelected(pkg.id)}
            className={`border rounded-2xl p-6 shadow-sm cursor-pointer transition-all duration-300 ${
              selected === pkg.id
                ? 'border-orange-600 shadow-lg bg-orange-50'
                : 'hover:shadow-md'
            }`}
          >
            <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
            <p className="text-3xl font-bold text-orange-600 mb-2">
              {translations.price}
              {pkg.price}
            </p>
            <p className="text-sm text-gray-500">{pkg.duration}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handlePurchase}
          className="bg-[var(--orange)] text-white px-8 py-3 rounded-xl hover:bg-[var(--orange-hover)] cursor-pointer transition-colors"
        >
          {translations.purchase}
        </button>
      </div>
    </section>
  );
}

