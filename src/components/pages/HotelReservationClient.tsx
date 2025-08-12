'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function HotelReservationContent() {
  const searchParams = useSearchParams();
  const city = searchParams.get('city') || 'default';

  return (
    <div>
      <p>Selected City: {city}</p>
      {/* Add your hotel booking logic here */}
    </div>
  );
}

export default function HotelReservationClient() {
  return (
    <Suspense fallback={<p>Loading hotel reservation...</p>}>
      <HotelReservationContent />
    </Suspense>
  );
}
