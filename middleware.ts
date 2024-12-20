// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;

  const { pathname } = req.nextUrl;

  // Redirect to '/dashboard' if authenticated and accessing '/'
  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Redirect to '/landing' if unauthenticated and accessing '/'
  if (pathname === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/landing', req.url));
  }

  // Redirect to '/dashboard' if authenticated and accessing '/landing'
  if (pathname === '/landing' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Redirect to '/landing' if unauthenticated and accessing '/dashboard' routes
  if (pathname.startsWith('/dashboard') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/landing', req.url));
  }

  // Allow the request to proceed if none of the above conditions are met
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/landing', '/dashboard/:path*'],
};
