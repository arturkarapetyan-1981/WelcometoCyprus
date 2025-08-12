'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';

type Language = 'en' | 'gr' | 'ru';

interface Translation {
  name: string;
  shortDescription: string;
  description: string;
}

interface Tour {
  id: number;
  slug: string;
  city: string;
  image: string;
  price: number;
  availableDates?: string[];
  translations: {
    en: Translation;
    gr: Translation;
    ru: Translation;
  };
}

const translationsMap: Record<Language, Record<string, string>> = {
  en: {
    buy: 'Buy',
    cardTitle: 'Card Details',
    cardNumber: 'Card Number',
    expiry: 'Expiry (MM/YY)',
    cvv: 'CVV',
    nameOnCard: 'Name on Card',
    pay: 'Pay',
    priceLabel: 'Price',
    date: 'Date',
  },
  gr: {
    buy: 'Αγορά',
    cardTitle: 'Στοιχεία Κάρτας',
    cardNumber: 'Αριθμός Κάρτας',
    expiry: 'Λήξη (MM/YY)',
    cvv: 'CVV',
    nameOnCard: 'Όνομα στην Κάρτα',
    pay: 'Πληρωμή',
    priceLabel: 'Τιμή',
    date: 'Ημερομηνία',
  },
  ru: {
    buy: 'Купить',
    cardTitle: 'Данные карты',
    cardNumber: 'Номер карты',
    expiry: 'Срок (MM/ГГ)',
    cvv: 'CVV',
    nameOnCard: 'Имя на карте',
    pay: 'Оплатить',
    priceLabel: 'Цена',
    date: 'Дата',
  },
};

export default function TourPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const slug = params?.slug as string;
  const langParam = searchParams?.get('lang') as Language;
  const lang: Language = ['en', 'gr', 'ru'].includes(langParam) ? langParam : 'en';
  const t = translationsMap[lang];

  const [tour, setTour] = useState<Tour | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [departureDate, setDepartureDate] = useState('');

  useEffect(() => {
    async function fetchTour() {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/tours.json');
        const tours: Tour[] = await res.json();
        const foundTour = tours.find((t) => t.slug === slug);
        setTour(foundTour || null);
      } catch (err) {
        console.error('Error fetching tour:', err);
      }
    }

    if (slug) fetchTour();
  }, [slug]);

  if (!tour) return <p className="text-white">Loading...</p>;

  const translation: Translation = tour.translations[lang];
  const availableDates = tour.availableDates || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!availableDates.includes(departureDate)) {
      alert('Please select a valid available date.');
      return;
    }
    alert(`Tour booked for ${departureDate}!`);
    setShowModal(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 relative">
      <h1 className="text-3xl font-bold mb-4 text-white">{translation.name}</h1>
      <Image
        src={tour.image}
        width={800}
        height={400}
        alt={translation.name}
        className="w-full h-auto rounded-xl mb-4 shadow"
      />
      <p className="text-lg mb-2 text-white">{translation.shortDescription}</p>
      <p className="text-base text-white">{translation.description}</p>
      <p className="mt-6 text-sm text-white">City: {tour.city}</p>
      <p className="mt-2 text-lg text-yellow-300 font-semibold">
        {t.priceLabel}: €{tour.price}
      </p>

      <button
        className="mt-4 px-6 py-2 bg-[var(--orange)] text-white font-semibold rounded hover:bg-[var(--orange-hover)] cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        {t.buy}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-black text-lg"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">{t.cardTitle}</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Date Picker */}
              <label className="block text-sm font-medium text-gray-700">{t.date}</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                min={availableDates[0]}
                max={availableDates[availableDates.length - 1]}
                required
                list="availableDates"
              />
              <datalist id="availableDates">
                {availableDates.map((date) => (
                  <option key={date} value={date} />
                ))}
              </datalist>

              {/* Card Fields */}
              <input
                type="text"
                placeholder={t.cardNumber}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder={t.expiry}
                  className="w-1/2 border px-3 py-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder={t.cvv}
                  className="w-1/2 border px-3 py-2 rounded"
                  required
                />
              </div>
              <input
                type="text"
                placeholder={t.nameOnCard}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-[var(--orange)] text-white py-2 rounded hover:bg-[var(--orange-hover)] cursor-pointer"
              >
                {t.pay} €{tour.price}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



















