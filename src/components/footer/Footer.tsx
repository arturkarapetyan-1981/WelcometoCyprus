'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface FooterTranslation {
  title: string;
  description: string;
  quickLinks: string;
  home: string;
  services: string;
  about: string;
  blog: string;
  contact: string;
  email: string;
  phone: string;
  followUs: string;
  copyright: string;
}

type TranslationsMap = Record<string, FooterTranslation>;

const Footer = () => {
  const searchParams = useSearchParams();
  const langParam = searchParams.get("lang");
  const lang = langParam === "gr" || langParam === "ru" ? langParam : "en";

  const [translations, setTranslations] = useState<FooterTranslation | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const res = await fetch("https://arturkarapetyan-1981.github.io/host_api/footer.json");
        const data: TranslationsMap = await res.json();
        setTranslations(data[lang] || data["en"]);
      } catch (error) {
        console.error("Failed to load translations:", error);
      }
    };

    fetchTranslations();
  }, [lang]);

  if (!translations) return null;
  const t = translations;

  return (
    <footer className="bg-[var(--gradient)] text-white py-10 mt-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold mb-4">{t.title}</h2>
          <p className="text-sm text-white">{t.description}</p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t.quickLinks}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href={`/?lang=${lang}`} className="hover:underline text-gray-300">{t.home}</Link></li>
            <li><Link href={`/services?lang=${lang}`} className="hover:underline text-gray-300">{t.services}</Link></li>
            <li><Link href={`/blog?lang=${lang}`} className="hover:underline text-gray-300">{t.blog}</Link></li>
            <li><Link href={`/contact?lang=${lang}`} className="hover:underline text-gray-300">{t.contact}</Link></li>
            <li><Link href={`/about?lang=${lang}`} className="hover:underline text-gray-300">{t.about}</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t.contact}</h3>
          <p className="text-sm text-white">{t.email}: <a href="mailto:info@cyprus.com" className="hover:underline">info@cyprus.com</a></p>
          <p className="text-sm text-white mt-2">{t.phone}: <a href="tel:+35712345678" className="hover:underline">+357 12 345678</a></p>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t.followUs}</h3>
          <div className="flex items-center gap-4 text-blue-900 text-2xl">
            {/* Facebook */}
            <Link href="https://www.facebook.com/" aria-label="Facebook" target="_blank">
              <svg width="20" height="20" viewBox="0 0 224 432" className="text-white hover:text-blue-400 transition-colors">
                <path fill="currentColor" d="M145 429H66V235H0v-76h66v-56q0-48 27-74t72-26q36 0 59 3v67l-41 1q-22 0-30 9t-8 27v49h76l-10 76h-66v194z"/>
              </svg>
            </Link>

            {/* YouTube */}
            <Link href="https://www.youtube.com" aria-label="YouTube" target="_blank">
              <svg width="20" height="20" viewBox="0 0 576 512" className="text-white hover:text-red-600 transition-colors">
                <path fill="currentColor" d="M549.7 124.1c-6.3-24-25-42.7-49-49.1C458.2 64 288 64 288 64S117.8 64 75.3 75c-24 6.4-42.7 25.1-49 49.1C16 168.4 16 256 16 256s0 87.6 10.3 131.9c6.3 24 25 42.7 49 49.1C117.8 448 288 448 288 448s170.2 0 212.7-11c24-6.4 42.7-25.1 49-49.1C560 343.6 560 256 560 256s0-87.6-10.3-131.9zM232 336V176l142 80-142 80z"/>
              </svg>
            </Link>

            {/* Instagram */}
            <Link href="https://www.instagram.com" aria-label="Instagram" target="_blank">
              <svg width="20" height="20" viewBox="0 0 1536 1536" className="text-white hover:text-pink-500 transition-colors">
                <path fill="currentColor" d="M1024 768q0-106-75-181t-181-75t-181 75t-75 181t75 181t181 75t181-75t75-181zm138 0q0 164-115 279t-279 115t-279-115t-115-279t115-279t279-115t279 115t115 279zm108-410q0 38-27 65t-65 27t-65-27t-27-65t27-65t65-27t65 27t27 65zM768 138q-7 0-76.5-.5t-105.5 0t-96.5 3t-103 10T315 169q-50 20-88 58t-58 88q-11 29-18.5 71.5t-10 103t-3 96.5t0 105.5t.5 76.5t-.5 76.5t0 105.5t3 96.5t10 103T169 1221q20 50 58 88t88 58q29 11 71.5 18.5t103 10t96.5 3t105.5 0t76.5-.5t76.5.5t105.5 0t96.5-3t103-10t71.5-18.5q50-20 88-58t58-88q11-29 18.5-71.5t10-103t3-96.5t0-105.5t-.5-76.5t.5-76.5t0-105.5t-3-96.5t-10-103T1367 315q-20-50-58-88t-88-58q-29-11-71.5-18.5t-103-10t-96.5-3t-105.5 0t-76.5.5zm768 630q0 229-5 317q-10 208-124 322t-322 124q-88 5-317 5t-317-5q-208-10-322-124T5 1085q-5-88-5-317t5-317q10-208 124-322T451 5q88-5 317-5t317 5q208 10 322 124t124 322q5 88 5 317z"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-white">
        &copy; {new Date().getFullYear()} Welcome to Cyprus. {t.copyright}
      </div>
    </footer>
  );
};

export default Footer;










