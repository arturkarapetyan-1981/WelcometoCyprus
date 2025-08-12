import React from 'react';
import CarRentalListClient from '@/app/services/carRentals/CarRentalListClient';

export default function CarRentalPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <React.Suspense fallback={<p>Loading cars...</p>}>
        <CarRentalListClient />
      </React.Suspense>
    </main>
  );
}



