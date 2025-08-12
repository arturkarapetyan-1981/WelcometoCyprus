import React from 'react';
import RestaurantListClient from '@/app/services/restaurantBooking/RestaurantListClient';

export default function RestaurantBookingPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* You can add any server-rendered SEO or headers here */}

      <React.Suspense fallback={<p>Loading restaurants...</p>}>
        <RestaurantListClient />
      </React.Suspense>
    </main>
  );
}

