'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import emailjs from '@emailjs/browser';

interface Translation {
  name: string;
  shortDescription: string;
  description: string;
}

interface BeautySalon {
  id: number;
  slug: string;
  image: string;
  city: string;
  translations: {
    en?: Translation;
    gr?: Translation;
    ru?: Translation;
  };
}

export default function BeautySalonBookingPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') as 'en' | 'gr' | 'ru') || 'en';

  const [salon, setSalon] = useState<BeautySalon | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/beauty.json');
        const data: BeautySalon[] = await res.json();
        const matched = data.find((item) => item.slug === slug);
        setSalon(matched || null);
      } catch (err) {
        console.error('Failed to load salon', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !name || !email || !phone || !salon) return;

    const translation = salon.translations?.[lang] || salon.translations?.en;

    const templateParams = {
      name,
      email,
      phone,
      salon_name: translation?.name || '',
      city: salon.city,
      date: selectedDate,
      time: selectedTime,
    };

    try {
      await emailjs.send(
        'service_7pnjl3t',     // Your Service ID
        'template_kg1w123',    // Your Template ID
        templateParams,
        'VF5jwngF6BJwnNMlD'    // Your Public Key
      );
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setSelectedDate('');
      setSelectedTime('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-xl">Loading...</div>;
  }

  if (!salon) {
    return <div className="text-center py-20 text-xl">Beauty salon not found.</div>;
  }

  const translation = salon.translations?.[lang] || salon.translations?.en;

  return (
    <div className="relative min-h-screen w-full overflow-hidden select-none">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src="https://arturkarapetyan-1981.github.io/my-video-api/videos/salons-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="relative z-10 text-white min-h-screen p-4 flex flex-col items-center">
        <div className="max-w-2xl w-full bg-white text-black rounded-2xl p-6 mt-20 shadow-xl">
          <Image
            src={salon.image}
            width={800}
            height={400}
            alt={translation?.name || 'Salon'}
            className="rounded-xl mb-4 w-full object-cover h-60"
          />

          <h1 className="text-2xl font-bold mb-2">{translation?.name}</h1>
          <p className="text-gray-700 mb-2">{translation?.shortDescription}</p>
          <p className="text-gray-500 mb-4">{translation?.description}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block mb-1 font-medium">
                {lang === 'en' && 'Your Name'}
                {lang === 'gr' && 'Το όνομά σας'}
                {lang === 'ru' && 'Ваше имя'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-medium">
                {lang === 'en' && 'Email'}
                {lang === 'gr' && 'Ηλεκτρονική διεύθυνση'}
                {lang === 'ru' && 'Электронная почта'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-1 font-medium">
                {lang === 'en' && 'Phone Number'}
                {lang === 'gr' && 'Τηλέφωνο'}
                {lang === 'ru' && 'Телефон'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block mb-1 font-medium">
                {lang === 'en' && 'Select Date'}
                {lang === 'gr' && 'Επιλέξτε ημερομηνία'}
                {lang === 'ru' && 'Выберите дату'}
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            {/* Time */}
            <div>
              <label className="block mb-1 font-medium">
                {lang === 'en' && 'Select Time'}
                {lang === 'gr' && 'Επιλέξτε ώρα'}
                {lang === 'ru' && 'Выберите время'}
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white w-full py-2 rounded-xl font-semibold transition"
            >
              {lang === 'en' && 'Confirm Appointment'}
              {lang === 'gr' && 'Επιβεβαίωση Ραντεβού'}
              {lang === 'ru' && 'Подтвердить запись'}
            </button>
          </form>

          {/* Success Message */}
          {submitted && (
            <div className="mt-4 text-green-600 font-medium">
              {lang === 'en' && 'Your appointment has been confirmed!'}
              {lang === 'gr' && 'Το ραντεβού σας επιβεβαιώθηκε!'}
              {lang === 'ru' && 'Ваша запись подтверждена!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}






