// frontend/middleware.js

import { NextResponse } from 'next/server';

export async function middleware(req) {
  // This middleware is completely simplified and does NOT handle authentication.
  // Authentication is handled by client-side components directly calling the backend.
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*', // Still apply to admin paths, but it just passes through
};