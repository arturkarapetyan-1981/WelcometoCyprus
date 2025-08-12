'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import emailjs from '@emailjs/browser';

interface Table {
  id: string;
  location: string;
  position: string;
  seats: number;
  isAvailable: boolean;
}

interface Restaurant {
  id: number;
  slug: string;
  image: string;
  city: string;
  translations: {
    en?: {
      name: string;
      shortDescription: string;
      description: string;
    };
    gr?: {
      name: string;
      shortDescription: string;
      description: string;
    };
    ru?: {
      name: string;
      shortDescription: string;
      description: string;
    };
  };
  tables?: {
    indoor: boolean;
    outdoor: boolean;
    tableSettings: string;
    reservationsRequired: boolean;
    notes: {
      en: string;
      gr: string;
      ru: string;
    };
    availableTables: Table[];
  };
}

export default function RestaurantDetailPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') as 'en' | 'gr' | 'ru') || 'en';

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [locationFilter, setLocationFilter] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(
          'https://arturkarapetyan-1981.github.io/host_api/restaurants.json'
        );
        const data: Restaurant[] = await res.json();
        const found = data.find((r) => r.slug === slug);
        if (found) setRestaurant(found);
      } catch (error) {
        console.error('Failed to load restaurant data:', error);
      }
    };
    fetchRestaurant();
  }, [slug]);

  const translation = restaurant?.translations?.[lang] || restaurant?.translations?.en;

  const filteredTables = restaurant?.tables?.availableTables?.filter(
    (table) =>
      table.isAvailable &&
      table.seats >= quantity &&
      (!locationFilter || table.location.toLowerCase() === locationFilter.toLowerCase())
  );

  const handleReserve = () => {
    const selectedTable = filteredTables?.[0];

    const templateParams = {
      restaurant: translation?.name || 'N/A',
      city: restaurant?.city || 'N/A',
      people: quantity,
      table_id: selectedTable?.id || 'N/A',
      location: selectedTable?.location || 'N/A',
      position: selectedTable?.position || 'N/A',
      seats: selectedTable?.seats?.toString() || 'N/A',
    };

    emailjs
      .send(
        'service_zix50zr',
        'template_8bxsf3s',
        templateParams,
        '4KsEIeb09dFgPiOPi'
      )
      .then(() => {
        setSuccess(
          lang === 'en'
            ? 'Your reservation has been confirmed!'
            : lang === 'gr'
            ? 'Η κράτησή σας επιβεβαιώθηκε!'
            : 'Ваше бронирование подтверждено!'
        );
        setQuantity(1);
        setLocationFilter('');
        setTimeout(() => setSuccess(''), 4000);
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
        alert('Error sending reservation. Please try again.');
      });
  };

  return (
    <div className="relative min-h-screen">
      {/* Full-screen video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="https://arturkarapetyan-1981.github.io/my-video-api/videos/restaurants-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Page content */}
      <div className="min-h-screen px-4 py-8">
        {restaurant && translation && (
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
            <Image
              src={restaurant.image}
              alt={translation.name}
              width={800}
              height={400}
              className="w-full h-64 object-cover rounded-xl"
            />
            <h1 className="text-3xl font-bold">{translation.name}</h1>
            <p className="text-gray-600">{translation.description}</p>

            <div className="border-t pt-6">
              <h2 className="text-2xl font-semibold mb-4">
                {lang === 'en' && 'Table Reservation'}
                {lang === 'gr' && 'Κράτηση Τραπεζιού'}
                {lang === 'ru' && 'Бронирование столика'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  {lang === 'en' && 'Number of People'}
                  {lang === 'gr' && 'Αριθμός Ατόμων'}
                  {lang === 'ru' && 'Количество человек'}
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setQuantity(isNaN(val) ? 1 : val);
                    }}
                    className="mt-1 p-2 border rounded"
                  />
                </label>

                <label className="flex flex-col">
                  {lang === 'en' && 'Table Location'}
                  {lang === 'gr' && 'Τοποθεσία Τραπεζιού'}
                  {lang === 'ru' && 'Местоположение столика'}
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="mt-1 p-2 border rounded"
                  >
                    <option value="">
                      {lang === 'en'
                        ? 'Any'
                        : lang === 'gr'
                        ? 'Οποιοδήποτε'
                        : 'Любое'}
                    </option>
                    <option value="indoor">
                      {lang === 'en'
                        ? 'Indoor'
                        : lang === 'gr'
                        ? 'Εσωτερικά'
                        : 'В помещении'}
                    </option>
                    <option value="outdoor">
                      {lang === 'en'
                        ? 'Outdoor'
                        : lang === 'gr'
                        ? 'Εξωτερικά'
                        : 'На улице'}
                    </option>
                  </select>
                </label>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">
                  {lang === 'en' && 'Available Tables'}
                  {lang === 'gr' && 'Διαθέσιμα Τραπέζια'}
                  {lang === 'ru' && 'Доступные столики'}
                </h3>

                {filteredTables && filteredTables.length > 0 ? (
                  <ul className="space-y-2">
                    {filteredTables.map((table) => (
                      <li
                        key={table.id}
                        className="flex items-center gap-4 p-3 bg-gray-100 rounded-lg"
                      >
                        <Image
                          src={`/restaurants/table-${table.location}-${table.seats}.jpg`}
                          alt={`${table.location} table for ${table.seats}`}
                          width={50}
                          height={50}
                          className="rounded"
                        />
                        <div>
                          {lang === 'en' &&
                            `Table ${table.id} — ${table.location}, ${table.position}, Seats: ${table.seats}`}
                          {lang === 'gr' &&
                            `Τραπέζι ${table.id} — ${table.location}, ${table.position}, Θέσεις: ${table.seats}`}
                          {lang === 'ru' &&
                            `Стол ${table.id} — ${table.location}, ${table.position}, Мест: ${table.seats}`}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-red-500 mt-2">
                    {lang === 'en' &&
                      'No tables available for the selected options.'}
                    {lang === 'gr' &&
                      'Δεν υπάρχουν διαθέσιμα τραπέζια για την επιλογή σας.'}
                    {lang === 'ru' &&
                      'Нет доступных столиков для выбранных параметров.'}
                  </p>
                )}
              </div>

              <button
                onClick={handleReserve}
                className="mt-6 bg-[var(--orange)] text-white py-2 px-6 rounded-lg hover:bg-[var(--orange-hover)] transition cursor-pointer"
                disabled={!filteredTables || filteredTables.length === 0}
              >
                {lang === 'en' && 'Confirm Reservation'}
                {lang === 'gr' && 'Επιβεβαίωση Κράτησης'}
                {lang === 'ru' && 'Подтвердить бронирование'}
              </button>

              {success && <p className="text-green-600 mt-4">{success}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}








