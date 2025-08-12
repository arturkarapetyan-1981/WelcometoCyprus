import { Suspense } from 'react';
import BlogClient from '@/app/blog/BlogClient';

export default function BlogPage() {
  return (
    <Suspense fallback={<div>Loading blog...</div>}>
      <BlogClient />
    </Suspense>
  );
}








