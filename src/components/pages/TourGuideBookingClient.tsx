'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function TourGuideBookingContent() {
  const searchParams = useSearchParams();
  const language = searchParams.get('language') || 'English';

  return (
    <div>
      <p>Preferred Language: {language}</p>
      {/* Add your tour guide booking UI here */}
    </div>
  );
}

export default function TourGuideBookingClient() {
  return (
    <Suspense fallback={<p>Loading tour guide booking...</p>}>
      <TourGuideBookingContent />
    </Suspense>
  );
}
