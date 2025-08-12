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

interface TourismGuide {
  id: number;
  slug: string;
  image: string;
  city: string;
  phone?: string;
  email?: string;
  translations?: {
    en?: Translation;
    gr?: Translation;
    ru?: Translation;
  };
}

export default function TourismGuidePage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const searchParams = useSearchParams();
  const lang = (searchParams.get('lang') as 'en' | 'gr' | 'ru') || 'en';

  const [guide, setGuide] = useState<TourismGuide | null>(null);
  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState<string | false>(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    const fetchGuides = async () => {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/tour-guides.json');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data: TourismGuide[] = await res.json();
        const found = data.find((g) => g.slug === slug);
        setGuide(found || null);
      } catch (err) {
        console.error('Error fetching tourism guide:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [slug]);

  if (loading) {
    return <div className="text-center text-white p-10">Loading...</div>;
  }

  if (!guide) {
    return <div className="text-center text-white p-10">Guide not found.</div>;
  }

  const translation = guide.translations?.[lang] || guide.translations?.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!date || !time || !name || !email) {
      setError(
        lang === 'en'
          ? 'Please fill all required fields.'
          : lang === 'gr'
          ? 'Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία.'
          : 'Пожалуйста, заполните все обязательные поля.'
      );
      return;
    }

    const templateParams = {
      name,
      email,
      phone,
      date,
      time,
      message,
      guide: translation?.name || 'Unknown Guide',
    };

    emailjs
      .send(
        'service_zix50zr',      // Replace with your EmailJS service ID
        'template_g06joaj',     // Replace with your EmailJS template ID
        templateParams,
        '4KsEIeb09dFgPiOPi'       // Replace with your EmailJS public key
      )
      .then(
        () => {
          setSuccess(
            lang === 'en'
              ? 'Your reservation has been confirmed!'
              : lang === 'gr'
              ? 'Η κράτησή σας επιβεβαιώθηκε!'
              : 'Ваше бронирование подтверждено!'
          );
          setDate('');
          setTime('');
          setName('');
          setEmail('');
          setPhone('');
          setMessage('');
        },
        (err) => {
          console.error('EmailJS error:', err);
          setError(
            lang === 'en'
              ? 'Something went wrong. Please try again later.'
              : lang === 'gr'
              ? 'Κάτι πήγε στραβά. Παρακαλώ προσπαθήστε ξανά αργότερα.'
              : 'Что-то пошло не так. Пожалуйста, попробуйте позже.'
          );
        }
      );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source
          src="https://arturkarapetyan-1981.github.io/my-video-api/videos/guides-bg.mp4"
          type="video/mp4"
        />
      </video>

      <div className="relative z-10 text-white min-h-screen p-6 md:p-20">
        <div className="max-w-4xl mx-auto bg-white text-black rounded-2xl p-6 shadow-lg">
          <div className="overflow-hidden rounded-xl mb-4">
            <Image
              width={800}
              height={500}
              src={guide.image}
              alt={translation?.name || 'Tourism Guide'}
              className="w-full h-64 object-cover"
            />
          </div>

          <h1 className="text-3xl font-bold mb-4">{translation?.name}</h1>
          <p className="text-gray-700 mb-2">{translation?.shortDescription}</p>
          <p className="text-gray-600 mb-4">{translation?.description}</p>

          {guide.city && (
            <p className="text-sm text-gray-500 mb-1">
              <strong>City:</strong> {guide.city}
            </p>
          )}
          {guide.phone && (
            <p className="text-sm text-gray-500 mb-1">
              <strong>Phone:</strong> {guide.phone}
            </p>
          )}
          {guide.email && (
            <p className="text-sm text-gray-500 mb-4">
              <strong>Email:</strong> {guide.email}
            </p>
          )}

          <h2 className="text-2xl font-semibold mb-4">
            {lang === 'en'
              ? 'Reserve Your Visit'
              : lang === 'gr'
              ? 'Κλείστε την Επίσκεψή σας'
              : 'Забронируйте визит'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <div>
              <label className="block mb-1 font-medium" htmlFor="date">
                {lang === 'en'
                  ? 'Select Date*'
                  : lang === 'gr'
                  ? 'Επιλέξτε Ημερομηνία*'
                  : 'Выберите дату*'}
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="time">
                {lang === 'en'
                  ? 'Select Time*'
                  : lang === 'gr'
                  ? 'Επιλέξτε Ώρα*'
                  : 'Выберите время*'}
              </label>
              <input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="name">
                {lang === 'en'
                  ? 'Your Name*'
                  : lang === 'gr'
                  ? 'Το Όνομά σας*'
                  : 'Ваше имя*'}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="email">
                {lang === 'en'
                  ? 'Email*'
                  : lang === 'gr'
                  ? 'Ηλεκτρονικό Ταχυδρομείο*'
                  : 'Электронная почта*'}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="phone">
                {lang === 'en'
                  ? 'Phone (optional)'
                  : lang === 'gr'
                  ? 'Τηλέφωνο (προαιρετικό)'
                  : 'Телефон (необязательно)'}
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium" htmlFor="message">
                {lang === 'en'
                  ? 'Additional Message (optional)'
                  : lang === 'gr'
                  ? 'Πρόσθετο Μήνυμα (προαιρετικό)'
                  : 'Дополнительное сообщение (необязательно)'}
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>

            {error && <p className="text-red-600 font-semibold">{error}</p>}
            {success && <p className="text-green-600 font-semibold">{success}</p>}

            <button
              type="submit"
              className="bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white py-2 px-4 rounded w-full transition"
            >
              {lang === 'en'
                ? 'Confirm Reservation'
                : lang === 'gr'
                ? 'Επιβεβαίωση Κράτησης'
                : 'Подтвердить бронь'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


