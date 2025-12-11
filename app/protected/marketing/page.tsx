'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketingPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to consolidated social media dashboard
    router.push('/social-media');
  }, [router]);
  
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="text-xl mb-2">Redirecting to Social Media Hub...</div>
        <div className="text-sm text-gray-600">Marketing controls have moved to /social-media</div>
      </div>
    </div>
  );
}
