// middleware.ts
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;
  const { pathname } = req.nextUrl;

  // If user needs type selection, redirect to check-type page
  if (
    isAuthenticated &&
    token?.needsTypeSelection &&
    !pathname.startsWith('/auth/check-type')
  ) {
    return NextResponse.redirect(new URL('/auth/check-type', req.url));
  }

  // Protect user dashboard
  if (pathname.startsWith('/user') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Protect creator dashboard
  if (
    pathname.startsWith('/dashboard') &&
    (!isAuthenticated || token?.type !== 'creator')
  ) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  // Allow public access to auth pages
  if (pathname.startsWith('/auth/')) {
    if (isAuthenticated && !token?.needsTypeSelection) {
      // If already authenticated and doesn't need type selection, redirect to appropriate dashboard
      return NextResponse.redirect(
        new URL(token?.type === 'creator' ? '/dashboard' : '/user', req.url)
      );
    }
    return NextResponse.next();
  }

  // Handle root route - redirect to landing for everyone
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/landing', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/landing',
    '/auth/:path*',
    '/dashboard/:path*',
    '/user/:path*',
    '/trips/:path*',
    '/gotos/:path*',
  ],
};
