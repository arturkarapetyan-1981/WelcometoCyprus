import React from 'react';
import HotelReservations from '@/app/services/hotelReservation/HotelReservations';

export default function HotelReservationPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <React.Suspense fallback={<p>Loading hotels...</p>}>
        <HotelReservations />
      </React.Suspense>
    </main>
  );
}
