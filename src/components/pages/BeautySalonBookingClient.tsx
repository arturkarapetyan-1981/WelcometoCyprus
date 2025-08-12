'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function BookingContent() {
  const searchParams = useSearchParams();
  const salonId = searchParams.get('salon') || 'default';

  return (
    <div>
      <h2>Beauty Salon Booking</h2>
      <p>Selected salon: {salonId}</p>
    </div>
  );
}

export default function BeautySalonBookingClient() {
  return (
    <Suspense fallback={<p>Loading booking info...</p>}>
      <BookingContent />
    </Suspense>
  );
}
