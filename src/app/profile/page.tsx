import { Suspense } from 'react';
import BecomePartner from '@/components/partner/BecomePartner';
import PackagePurchase from '@/components/PackagePurchase';
import ExtendedRegistrationForm from '@/components/ExtendedRegistrationForm';

export default function Profile() {
  return (
    <Suspense fallback={<div className="text-white">Loading blog...</div>}>
      <BecomePartner />
      <PackagePurchase />
      <ExtendedRegistrationForm />
    </Suspense>
  );
}