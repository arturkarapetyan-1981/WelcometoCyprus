import React from 'react';
import TourReservations from '@/app/services/travelsTours/TourReservations';

export default function Tours() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <React.Suspense fallback={<p>Loading tours...</p>}>
        <TourReservations />
      </React.Suspense>
    </main>
  );
}
