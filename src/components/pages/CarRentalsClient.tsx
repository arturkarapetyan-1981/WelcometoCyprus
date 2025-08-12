'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CarRentalsContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'default';

  return (
    <div>
      <p>Selected Car Type: {type}</p>
      {/* Add your interactive booking UI here */}
    </div>
  );
}

export default function CarRentalsClient() {
  return (
    <Suspense fallback={<p>Loading car rentals...</p>}>
      <CarRentalsContent />
    </Suspense>
  );
}


