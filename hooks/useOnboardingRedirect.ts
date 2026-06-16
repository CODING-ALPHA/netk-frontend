'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import api from '@/lib/api';

export function useOnboardingRedirect() {
  const router = useRouter();

  useEffect(() => {
    api
      .get('/users/me')
      .then(({ data }) => {
        if (!data.region) {
          router.push('/onboarding');
        } else if (!data.ikigaiProfile) {
          router.push('/assessment');
        }
        // otherwise stay on current page
      })
      .catch(() => {
        router.push('/sign-in');
      });
  }, [router]);
}
