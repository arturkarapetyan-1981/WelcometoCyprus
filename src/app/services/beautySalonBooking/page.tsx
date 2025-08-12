import React from 'react';
import BeautySalons from '@/app/services/beautySalonBooking/BeautySalons';

export default function BeautySalonBookingPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* You can add any server-rendered SEO or headers here */}

      <React.Suspense fallback={<p>Loading restaurants...</p>}>
        <BeautySalons />
      </React.Suspense>
    </main>
  );
}






