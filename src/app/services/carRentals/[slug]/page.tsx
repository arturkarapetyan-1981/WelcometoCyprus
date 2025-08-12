'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import emailjs from '@emailjs/browser';

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
  price: number;
  translations: {
    en: Translation;
    gr: Translation;
    ru: Translation;
  };
}

type Language = 'en' | 'gr' | 'ru';

const translationsMap: Record<Language, Record<string, string>> = {
  en: {
    rent: 'Rent this Car',
    formTitle: 'Reservation Form',
    name: 'Full Name',
    phone: 'Phone Number',
    email: 'Email Address',
    start: 'Pick-Up Date',
    end: 'Return Date',
    send: 'Send Reservation',
    price: 'Price per day',
    success: 'Your reservation request has been sent!',
  },
  gr: {
    rent: 'Ενοικίαση Αυτοκινήτου',
    formTitle: 'Φόρμα Κράτησης',
    name: 'Ονοματεπώνυμο',
    phone: 'Αριθμός Τηλεφώνου',
    email: 'Διεύθυνση Email',
    start: 'Ημερομηνία Παραλαβής',
    end: 'Ημερομηνία Επιστροφής',
    send: 'Αποστολή Κράτησης',
    price: 'Τιμή ανά ημέρα',
    success: 'Το αίτημα κράτησης στάλθηκε με επιτυχία!',
  },
  ru: {
    rent: 'Арендовать авто',
    formTitle: 'Форма бронирования',
    name: 'Полное имя',
    phone: 'Номер телефона',
    email: 'Электронная почта',
    start: 'Дата получения',
    end: 'Дата возврата',
    send: 'Отправить заявку',
    price: 'Цена за день',
    success: 'Заявка на бронирование отправлена!',
  },
};

export default function CarDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const slug = params?.slug as string;
  const langParam = searchParams?.get('lang') as Language;
  const lang: Language = ['en', 'gr', 'ru'].includes(langParam) ? langParam : 'en';
  const t = translationsMap[lang];

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    async function fetchCar() {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/cars.json');
        const cars: Car[] = await res.json();
        const found = cars.find((c) => c.slug === slug);
        setCar(found || null);
      } catch (err) {
        console.error('Error fetching car:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchCar();
  }, [slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    emailjs
      .sendForm(
        'service_bylvtx3',
        'template_7s02dzm',
        formRef.current,
        'HB0HOrb8Vb7dpCBhq'
      )
      .then(
        () => {
          setSuccess(true);
          formRef.current?.reset();
        },
        (error) => {
          console.error('FAILED...', error);
        }
      );
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (!car) return <p className="text-red-500">Car not found.</p>;

  const translation = car.translations[lang] || car.translations.en;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-6">
      {/* 🔹 Fullscreen video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
      >
        <source src="https://arturkarapetyan-1981.github.io/my-video-api/videos/cars-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="bg-white bg-opacity-95 rounded-xl shadow-lg max-w-2xl w-full p-6">
        <Image
          src={car.image}
          width={600}
          height={300}
          alt={translation.name}
          className="rounded-xl mb-4 w-full h-auto"
        />

        <h1 className="text-2xl font-bold mb-2">{translation.name}</h1>
        <p className="mb-2">{translation.shortDescription}</p>
        <p className="mb-4 text-sm text-gray-700">{translation.description}</p>
        <p className="mb-1 font-semibold">{t.price}: €{car.price}</p>
        <p className="mb-4 text-sm">Brand: {car.brand}</p>

        <h2 className="text-xl font-semibold mb-3">{t.formTitle}</h2>
        {success && <p className="text-green-600 font-medium mb-4">{t.success}</p>}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
          <input type="hidden" name="car_name" value={translation.name} />
          <input
            type="text"
            name="name"
            placeholder={t.name}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="email"
            name="email"
            placeholder={t.email}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="tel"
            name="phone"
            placeholder={t.phone}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          <div>
            <label className="block text-sm text-gray-700">{t.start}</label>
            <input
              type="date"
              name="start_date"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">{t.end}</label>
            <input
              type="date"
              name="end_date"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white font-semibold py-2 rounded"
          >
            {t.send}
          </button>
        </form>
      </div>
    </div>
  );
}
