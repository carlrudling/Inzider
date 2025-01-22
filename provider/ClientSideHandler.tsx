'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ClientSessionHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'authenticated') {
      // If authenticated, ensure we're on a correct route:
      // For example, if you're currently on '/' or '/landing' or '/signup', redirect to '/dashboard'.
      if (
        pathname === '/' ||
        pathname === '/landing' ||
        pathname === '/signup' ||
        pathname === '/signin'
      ) {
        router.replace('/dashboard');
      }
    } else if (status === 'unauthenticated') {
      // If unauthenticated, ensure not on a protected route:
      if (pathname.startsWith('/dashboard')) {
        router.replace('/landing');
      }
    }
  }, [status, router, pathname]);

  return <>{children}</>;
}
