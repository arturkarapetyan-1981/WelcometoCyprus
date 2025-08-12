'use client';

import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 flex items-center justify-center rounded-full shadow-lg border border-transparent transition-all duration-300 cursor-pointer
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        hover:bg-red-600
      `}
      style={{
        width: '40px',
        height: '40px',
        backgroundColor: '#ff6c10',
        color: '#ffffff',
        zIndex: '9999'
      }}
    >
      <FaArrowUp size={15} />
    </button>
  );
}




