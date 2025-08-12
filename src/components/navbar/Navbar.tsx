'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiGlobe } from 'react-icons/fi';
import { NavbarData } from '../../types/types';

function NavbarContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [translations, setTranslations] = useState<NavbarData | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const lang = (searchParams.get('lang') as 'en' | 'gr' | 'ru') || 'en';

  const isServicesPath = pathname.startsWith('/services');

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/hero.json');
        const data = await res.json();
        const selected = data[lang] || data['en'];
        setTranslations({
          home: selected.home,
          services: selected.services,
          travelsTours: selected.travelsTours,
          hotelReservation: selected.hotelReservation,
          carRentals: selected.carRentals,
          beautySalonBooking: selected.beautySalonBooking,
          tourGuideBooking: selected.tourGuideBooking,
          restaurantBooking: selected.restaurantBooking,
          blog: selected.blog,
          contact: selected.contact,
          about: selected.about,
          becomePartner: selected.becomePartner,
        });
      } catch (error) {
        console.error('Failed to load navbar translations:', error);
      }
    };
    fetchTranslations();
  }, [lang]);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const buildHref = (path: string) => `${path}?lang=${lang}`;

  if (!translations) return null;

  return (
    <>
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-12 py-2 relative z-99 bg-white shadow-md select-none">
        <Link href={buildHref('/')}>
          <Image src="/logo2.png" width={80} height={80} alt="Logo" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6 text-black font-medium relative z-99">
          <Link href={buildHref('/')} className="hover:text-teal-500">
            {translations.home}
          </Link>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDesktopDropdownOpen(true)}
            onMouseLeave={() => setDesktopDropdownOpen(false)}
          >
            <Link
              href={buildHref('/services')}
              className={`cursor-pointer z-99 ${
                isServicesPath
                  ? 'text-teal-500 font-semibold'
                  : 'hover:text-teal-500'
              }`}
            >
              {translations.services}
            </Link>
            <div
              className={`absolute left-0 mt-0 w-56 bg-[var(--mid-teal)] text-white py-3 px-4 rounded shadow-xl z-30 ${
                desktopDropdownOpen
                  ? 'opacity-100 visible'
                  : 'opacity-0 invisible pointer-events-none'
              }`}
            >
              <Link href={buildHref('/services/travelsTours')} className="block px-2 py-1 rounded hover:bg-teal-700 focus:text-[var(--orange)]">
                {translations.travelsTours}
              </Link>
              <Link href={buildHref('/services/hotelReservation')} className="block px-2 py-1 rounded hover:bg-teal-700 focus:text-[var(--orange)]">
                {translations.hotelReservation}
              </Link>
              <Link href={buildHref('/services/carRentals')} className="block px-2 py-1 rounded hover:bg-teal-700 focus:text-[var(--orange)]">
                {translations.carRentals}
              </Link>
              <Link href={buildHref('/services/beautySalonBooking')} className="block px-2 py-1 rounded hover:bg-teal-700 focus:text-[var(--orange)]">
                {translations.beautySalonBooking}
              </Link>
              <Link href={buildHref('/services/tourGuideBooking')} className="block px-2 py-1 rounded hover:bg-teal-700 focus:text-[var(--orange)]">
                {translations.tourGuideBooking}
              </Link>
              <Link href={buildHref('/services/restaurantBooking')} className="block px-2 py-1 rounded hover:bg-teal-700 focus:text-[var(--orange)]">
                {translations.restaurantBooking}
              </Link>
            </div>
          </div>

          <Link href={buildHref('/blog')} className="hover:text-teal-500">
            {translations.blog}
          </Link>
          <Link href={buildHref('/contact')} className="hover:text-teal-500">
            {translations.contact}
          </Link>
          <Link href={buildHref('/about')} className="hover:text-teal-500">
            {translations.about}
          </Link>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1 hover:text-teal-500"
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            >
              <FiGlobe size={20} />
            </button>
            <div
              className={`absolute right-0 mt-2 bg-white border rounded shadow-lg z-30 w-36 ${
                languageDropdownOpen
                  ? 'opacity-100 visible'
                  : 'opacity-0 invisible pointer-events-none'
              }`}
            >
              <div className="flex flex-col p-2">
                {['en', 'gr', 'ru'].map((code) => (
                  <Link
                    key={code}
                    href={`${pathname}?lang=${code}`}
                    onClick={() => setLanguageDropdownOpen(false)}
                    className={`flex items-center px-2 py-1 rounded-md text-sm ${
                      lang === code
                        ? 'bg-teal-100 font-semibold text-teal-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Image
                      src={`/flags/${code}.svg`}
                      alt={code}
                      width={20}
                      height={14}
                      className="mr-2 rounded-sm border border-gray-300"
                    />
                    {code === 'en'
                      ? 'English'
                      : code === 'gr'
                      ? 'Greek'
                      : 'Russian'}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href={buildHref('/profile')}
            className="hover:text-teal-500"
            onClick={handleLinkClick}
          >
            {translations.becomePartner}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center space-x-4 text-teal-800 text-xl lg:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-teal-800 text-white flex flex-col items-center space-y-4 py-6 z-10">
          <Link href={buildHref('/')} onClick={handleLinkClick}>
            {translations.home}
          </Link>

          <Link
            href={buildHref('/services')}
            onClick={handleLinkClick}
            className={`block w-full py-2 text-center ${
              isServicesPath
                ? 'text-green-300 font-semibold'
                : 'hover:text-teal-300'
            }`}
          >
            {translations.services}
          </Link>

          <Link href={buildHref('/blog')} onClick={handleLinkClick}>
            {translations.blog}
          </Link>
          <Link href={buildHref('/contact')} onClick={handleLinkClick}>
            {translations.contact}
          </Link>
          <Link href={buildHref('/about')} onClick={handleLinkClick}>
            {translations.about}
          </Link>

          <Link href={buildHref('/profile')} onClick={handleLinkClick}>
            {translations.becomePartner}
          </Link>

          <div className="flex space-x-3 mt-4 items-center">
            {['en', 'gr', 'ru'].map((code) => (
              <Link
                key={code}
                href={`${pathname}?lang=${code}`}
                className={`rounded-sm border p-[2px] ${
                  lang === code
                    ? 'border-white bg-white shadow-sm'
                    : 'border-transparent hover:opacity-75'
                }`}
              >
                <Image
                  src={`/flags/${code}.svg`}
                  alt={code}
                  width={24}
                  height={16}
                  title={code === 'en' ? 'English' : code === 'gr' ? 'Greek' : 'Russian'}
                  className="rounded-sm"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="p-4 text-gray-600">Loading Navbar...</div>}>
      <NavbarContent />
    </Suspense>
  );
}




