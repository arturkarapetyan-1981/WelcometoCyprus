'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { SliderImage } from '../../types/types';

export default function Slider() {
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/slider.json');
        if (!res.ok) throw new Error('Failed to load JSON');
        const data = await res.json();
        setSliderImages(data.images);
      } catch (error) {
        console.error('Error fetching slider images:', error);
      }
    };
    fetchImages();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
  }, [sliderImages.length]);

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length
    );
  };

  useEffect(() => {
    if (sliderImages.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderImages, nextSlide]);

  return (
    <>
      <div className="relative w-full max-w-6xl h-[400px] sm:h-[500px] md:h-[600px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur">
        {sliderImages.length > 0 && (
          <Image
            src={sliderImages[currentIndex].image}
            alt={sliderImages[currentIndex].alt}
            fill
            className="object-cover"
          />
        )}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 z-10 text-xl"
        >
          &#8592;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/70 z-10 text-xl"
        >
          &#8594;
        </button>
      </div>
    </>
  );
}

