'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function TravelsToursContent() {
  const searchParams = useSearchParams();
  const destination = searchParams.get('destination') || 'default';

  return (
    <div>
      <p>Selected Destination: {destination}</p>
      {/* Add your travel & tours booking logic here */}
    </div>
  );
}

export default function TravelsToursClient() {
  return (
    <Suspense fallback={<p>Loading travels & tours...</p>}>
      <TravelsToursContent />
    </Suspense>
  );
}
