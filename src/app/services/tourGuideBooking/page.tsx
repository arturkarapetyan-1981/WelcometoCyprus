import React from 'react';
import TourGuidesBooking from '@/app/services/tourGuideBooking/TourGuidesBooking';

export default function GuidesPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <React.Suspense fallback={<p>Loading tour guides...</p>}>
        <TourGuidesBooking />
      </React.Suspense>
    </main>
  );
}
