'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function BookingContent() {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('id') || 'default';

  return (
    <div>
      <h2>Restaurant Booking</h2>
      <p>Selected restaurant: {restaurantId}</p>
    </div>
  );
}

export default function RestaurantBookingClient() {
  return (
    <Suspense fallback={<p>Loading booking info...</p>}>
      <BookingContent />
    </Suspense>
  );
}
