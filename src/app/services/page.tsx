import { Suspense } from "react";
import ServicesClient from './ServicesClient';

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-white">Loading...</div>}>
      <ServicesClient />
    </Suspense>
  );
}
