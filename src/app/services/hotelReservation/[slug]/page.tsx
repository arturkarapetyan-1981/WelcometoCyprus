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

interface Hotel {
  id: number;
  slug: string;
  city: string;
  image: string;
  translations: {
    en: Translation;
    gr: Translation;
    ru: Translation;
  };
}

const translationsMap: Record<Language, Record<string, string>> = {
  en: {
    reserve: 'Reserve',
    cardTitle: 'Card Details',
    cardNumber: 'Card Number',
    expiry: 'Expiry (MM/YY)',
    cvv: 'CVV',
    nameOnCard: 'Name on Card',
    pay: 'Pay',
    checkIn: 'Check-in Date',
    checkOut: 'Check-out Date',
  },
  gr: {
    reserve: 'Κράτηση',
    cardTitle: 'Στοιχεία Κάρτας',
    cardNumber: 'Αριθμός Κάρτας',
    expiry: 'Λήξη (MM/YY)',
    cvv: 'CVV',
    nameOnCard: 'Όνομα στην Κάρτα',
    pay: 'Πληρωμή',
    checkIn: 'Ημερομηνία Άφιξης',
    checkOut: 'Ημερομηνία Αναχώρησης',
  },
  ru: {
    reserve: 'Забронировать',
    cardTitle: 'Данные карты',
    cardNumber: 'Номер карты',
    expiry: 'Срок (MM/ГГ)',
    cvv: 'CVV',
    nameOnCard: 'Имя на карте',
    pay: 'Оплатить',
    checkIn: 'Дата заезда',
    checkOut: 'Дата выезда',
  },
};

export default function HotelDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const slug = params?.slug as string;
  const langParam = searchParams?.get('lang') as Language;
  const lang: Language = ['en', 'gr', 'ru'].includes(langParam) ? langParam : 'en';
  const t = translationsMap[lang];

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHotel() {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/hotels.json');
        const hotels: Hotel[] = await res.json();
        const foundHotel = hotels.find((h) => h.slug === slug);
        setHotel(foundHotel || null);
      } catch (err) {
        console.error('Error fetching hotel:', err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchHotel();
  }, [slug]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (!hotel) return <p className="text-red-500">Hotel not found.</p>;

  const translation = hotel.translations[lang] || hotel.translations.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || checkOut < checkIn) {
      alert('Please select valid check-in and check-out dates.');
      return;
    }
    alert(`Reservation confirmed from ${checkIn} to ${checkOut}!`);
    setShowModal(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 relative">
      <h1 className="text-3xl font-bold mb-4 text-white">{translation.name}</h1>
      <Image
        src={hotel.image}
        width={800}
        height={400}
        alt={translation.name}
        className="w-full h-auto rounded-xl mb-4 shadow"
      />
      <p className="text-lg mb-2 text-white">{translation.shortDescription}</p>
      <p className="text-base text-white">{translation.description}</p>
      <p className="mt-6 text-sm text-white">City: {hotel.city}</p>

      <button
        className="mt-6 px-6 py-2 bg-[var(--orange)] text-white font-semibold rounded hover:bg-[var(--orange-hover)] cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        {t.reserve}
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
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.checkIn}</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.checkOut}</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
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
                {t.pay}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}











