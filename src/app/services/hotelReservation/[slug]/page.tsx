"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import emailjs from "@emailjs/browser";

type Language = "en" | "gr" | "ru";

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
    reserve: "Reserve",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone Number",
    email: "Email Address",
    checkIn: "Check-in Date",
    checkOut: "Check-out Date",
    submit: "Submit Reservation",
  },
  gr: {
    reserve: "Κράτηση",
    firstName: "Όνομα",
    lastName: "Επώνυμο",
    phone: "Αριθμός Τηλεφώνου",
    email: "Διεύθυνση Email",
    checkIn: "Ημερομηνία Άφιξης",
    checkOut: "Ημερομηνία Αναχώρησης",
    submit: "Υποβολή Κράτησης",
  },
  ru: {
    reserve: "Забронировать",
    firstName: "Имя",
    lastName: "Фамилия",
    phone: "Номер телефона",
    email: "Электронная почта",
    checkIn: "Дата заезда",
    checkOut: "Дата выезда",
    submit: "Отправить бронь",
  },
};

export default function HotelDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const slug = params?.slug as string;
  const langParam = searchParams?.get("lang") as Language;
  const lang: Language = ["en", "gr", "ru"].includes(langParam) ? langParam : "en";
  const t = translationsMap[lang];

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    async function fetchHotel() {
      try {
        const res = await fetch("https://arturkarapetyan-1981.github.io/host_api/hotels.json");
        const hotels: Hotel[] = await res.json();
        setHotel(hotels.find((h) => h.slug === slug) || null);
      } catch (err) {
        console.error("Error fetching hotel:", err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchHotel();
  }, [slug]);

  if (loading) return <p className="text-center text-gray-200">Loading...</p>;
  if (!hotel) return <p className="text-center text-red-500">Hotel not found.</p>;

  const translation = hotel.translations[lang] || hotel.translations.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !phone || !email || !checkIn || !checkOut) {
      alert("Please fill in all fields.");
      return;
    }

    if (checkOut < checkIn) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    emailjs
      .send(
        "service_66xrene",
        "template_gkjtr6f",
        {
          firstName,
          lastName,
          phone,
          email,
          checkIn,
          checkOut,
          hotelName: translation.name,
          hotelCity: hotel.city,
        },
        "tyS58iswcQ4t7HxJr"
      )
      .then(() => {
        alert("Reservation sent successfully!");
        setShowModal(false);
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setCheckIn("");
        setCheckOut("");
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        alert("Failed to send reservation.");
      });
  };

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">{translation.name}</h1>

      <div className="rounded-xl overflow-hidden shadow-lg mb-6">
        <Image
          src={hotel.image}
          width={1200}
          height={600}
          alt={translation.name}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      <p className="mb-3 text-gray-200 text-lg">{translation.shortDescription}</p>
      <p className="mb-6 text-gray-300 leading-relaxed">{translation.description}</p>
      <p className="mb-6 text-sm text-gray-400">{hotel.city}</p>

      <button
        onClick={() => setShowModal(true)}
        className="bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white px-6 py-3 rounded-lg font-medium transition-transform transform hover:scale-105 shadow-lg"
      >
        {t.reserve}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">{t.reserve}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[{
                value: firstName, setter: setFirstName, placeholder: t.firstName, type: "text"
              }, {
                value: lastName, setter: setLastName, placeholder: t.lastName, type: "text"
              }, {
                value: phone, setter: setPhone, placeholder: t.phone, type: "tel"
              }, {
                value: email, setter: setEmail, placeholder: t.email, type: "email"
              }].map((field, idx) => (
                <input
                  key={idx}
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
                />
              ))}

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">{t.checkIn}</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">{t.checkOut}</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white px-5 py-2 rounded-lg shadow-md font-medium"
                >
                  {t.submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}














