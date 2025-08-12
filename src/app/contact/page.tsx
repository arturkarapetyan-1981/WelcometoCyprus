import { Suspense } from 'react';
import ContactClient from '@/app/contact/ContactClient';

export default function ContactPage() {
  return (
    <Suspense fallback={<p className="text-center p-4 text-white">Loading contact form...</p>}>
      <ContactClient />
    </Suspense>
  );
}






