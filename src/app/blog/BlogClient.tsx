'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

type BlogItem = {
  name: string;
  location?: string;
  description: string;
  image: string;
};

type BlogData = Record<string, BlogItem[]>;

export default function BlogClient() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'en';

  const [blogData, setBlogData] = useState<BlogData>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState<number>(9);
  const [shuffledItems, setShuffledItems] = useState<(BlogItem & { category: string })[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('https://arturkarapetyan-1981.github.io/host_api/blog.json');
      const data = await res.json();
      setBlogData(data[lang] || {});
    }
    fetchData();
  }, [lang]);

  const categories = useMemo(() => Object.keys(blogData), [blogData]);

  const allItems = useMemo<(BlogItem & { category: string })[]>(() => {
    return categories.flatMap(cat =>
      (blogData[cat] || []).map(item => ({ ...item, category: cat }))
    );
  }, [categories, blogData]);

  useEffect(() => {
    const items = selectedCategory === 'All'
      ? allItems
      : allItems.filter(item => item.category === selectedCategory);

    setShuffledItems([...items].sort(() => Math.random() - 0.5));
    setVisibleCount(9);
  }, [selectedCategory, allItems]);

  const visibleItems = shuffledItems.slice(0, visibleCount);

  const toggleExpanded = (index: number) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const getMoreText = () => {
    if (lang === 'gr') return 'περισσότερα';
    if (lang === 'ru') return 'ещё';
    return 'more';
  };

  const getLessText = () => {
    if (lang === 'gr') return 'λιγότερα';
    if (lang === 'ru') return 'меньше';
    return 'less';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 select-none">
      <h1 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-md">
        {lang === 'en' && 'Blog'}
        {lang === 'gr' && 'Ιστολόγιο'}
        {lang === 'ru' && 'Блог'}
      </h1>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-full border-none transition cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-[var(--orange)] text-white'
              : 'bg-white text-gray-700 hover:bg-orange-50'
          }`}
        >
          {lang === 'en' ? 'All' : lang === 'gr' ? 'Όλα' : 'Все'}
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border-none cursor-pointer transition ${
              selectedCategory === cat
                ? 'bg-[var(--orange)] text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleItems.map((item, index) => {
          const isExpanded = !!expandedDescriptions[index];
          const wordCount = item.description.trim().split(/\s+/).length;
          const showToggle = wordCount > 20;

          return (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition duration-300"
            >
              <div className="relative w-full h-48">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                {item.location && (
                  <p className="text-sm text-gray-500 mb-2">{item.location}</p>
                )}

                <p className="text-gray-600 mb-3 text-justify">
                  {isExpanded
                    ? item.description
                    : truncateText(item.description, 20)}
                  {showToggle && (
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="ml-2 text-[var(--mid-teal)] hover:underline text-sm inline cursor-pointer"
                    >
                      {isExpanded ? getLessText() : getMoreText()}
                    </button>
                  )}
                </p>

                <span className="text-xs font-medium text-[var(--mid-teal)]">{item.category}</span>
              </div>
            </div>
          );
        })}
      </div>

      {visibleCount < shuffledItems.length && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisibleCount(prev => prev + 9)}
            className="px-6 py-3 bg-[var(--orange)] text-white rounded-full hover:bg-[var(--orange-hover)] transition cursor-pointer"
          >
            {lang === 'en'
              ? 'Load More'
              : lang === 'gr'
              ? 'Φόρτωση περισσότερων'
              : 'Показать еще'}
          </button>
        </div>
      )}
    </div>
  );
}





