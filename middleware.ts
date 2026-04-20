import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Redirect the root URL directly to the lab dashboard 
  // since this demo does not have a public landing page.
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. For this hackathon demo, auth is pre-seeded in the Zustand store.
  // We allow all other routes to pass through normally.
  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};