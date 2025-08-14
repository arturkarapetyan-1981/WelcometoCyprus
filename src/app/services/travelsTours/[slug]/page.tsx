"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import emailjs from "@emailjs/browser";
import Image from "next/image";

type Tour = {
  slug: string;
  city: string;
  price: number;
  image: string;
  availableDates: string[];
  translations: {
    en: { name: string; description: string };
    gr: { name: string; description: string };
    ru: { name: string; description: string };
  };
};

export default function TourPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const lang = searchParams.get("lang");

  const [language, setLanguage] = useState<"en" | "gr" | "ru">("en");
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [departureDate, setDepartureDate] = useState("");

  useEffect(() => {
    if (lang && ["en", "gr", "ru"].includes(lang)) {
      setLanguage(lang as "en" | "gr" | "ru");
    } else {
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === "el") setLanguage("gr");
      else if (browserLang === "ru") setLanguage("ru");
      else setLanguage("en");
    }
  }, [lang]);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(
          "https://arturkarapetyan-1981.github.io/host_api/tours.json"
        );
        const data: Tour[] = await res.json();
        setTour(slug ? data.find((t) => t.slug === slug) || null : data[0]);
      } catch (err) {
        console.error("Error fetching tour:", err);
        setTour(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [slug]);

  if (loading) return <p className="text-center text-gray-200">Loading...</p>;
  if (!tour) return <p className="text-center text-red-500">Tour not found.</p>;

  const translation = tour.translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!departureDate) {
      alert("Please select a tour date & time.");
      return;
    }

    emailjs
      .send(
        "service_66xrene",
        "template_xz9j9pl",
        {
          firstName,
          lastName,
          phone,
          email,
          tourDateTime: departureDate,
          tourName: translation.name,
          tourCity: tour.city,
          tourPrice: tour.price,
        },
        "tyS58iswcQ4t7HxJr"
      )
      .then(() => {
        alert("Your booking has been sent!");
        setShowModal(false);
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setDepartureDate("");
      })
      .catch((err) => {
        console.error("Email error:", err);
        alert("Something went wrong. Please try again.");
      });
  };

  return (
    <div className="px-4 py-8 flex flex-col items-center max-w-4xl mx-auto text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
        {translation.name}
      </h1>

      <div className="w-full max-w-3xl rounded-lg overflow-hidden shadow-lg mb-6">
        <Image
          width={1200}
          height={600}
          src={tour.image}
          alt={translation.name}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      <p className="mb-4 text-gray-200 leading-relaxed max-w-2xl">
        {translation.description}
      </p>

      <p className="font-semibold mb-6 text-lg text-white">
        {language === "en" && `Price: €${tour.price}`}
        {language === "gr" && `Τιμή: €${tour.price}`}
        {language === "ru" && `Цена: €${tour.price}`}
      </p>

      <button
        onClick={() => setShowModal(true)}
        className="bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white px-6 py-3 rounded-lg font-medium transition-transform transform hover:scale-105 shadow-lg"
      >
        {language === "en" && "Book Now"}
        {language === "gr" && "Κλείστε τώρα"}
        {language === "ru" && "Забронировать"}
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
            <h2 className="text-2xl font-bold mb-4 text-center">
              {language === "en" && "Tour Booking"}
              {language === "gr" && "Κράτηση Εκδρομής"}
              {language === "ru" && "Бронирование тура"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[{
                value: firstName, setter: setFirstName,
                placeholder: language === "en" ? "First Name" : language === "gr" ? "Όνομα" : "Имя",
                type: "text"
              }, {
                value: lastName, setter: setLastName,
                placeholder: language === "en" ? "Last Name" : language === "gr" ? "Επώνυμο" : "Фамилия",
                type: "text"
              }, {
                value: phone, setter: setPhone,
                placeholder: language === "en" ? "Phone" : language === "gr" ? "Τηλέφωνο" : "Телефон",
                type: "tel"
              }, {
                value: email, setter: setEmail,
                placeholder: "Email",
                type: "email"
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

              <select
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
              >
                <option value="">
                  {language === "en"
                    ? "Select Date & Time"
                    : language === "gr"
                    ? "Επιλέξτε Ημερομηνία & Ώρα"
                    : "Выберите дату и время"}
                </option>
                {tour.availableDates.map((dateTime, index) => (
                  <option key={index} value={dateTime}>
                    {dateTime}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  {language === "en" && "Cancel"}
                  {language === "gr" && "Ακύρωση"}
                  {language === "ru" && "Отмена"}
                </button>
                <button
                  type="submit"
                  className="bg-[var(--orange)] hover:bg-[var(--orange-hover)] text-white px-5 py-2 rounded-lg shadow-md font-medium"
                >
                  {language === "en" && "Submit Booking"}
                  {language === "gr" && "Υποβολή Κράτησης"}
                  {language === "ru" && "Отправить бронирование"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


