// frontend/middleware.js
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Allow access to login page and static assets
  if (path === '/admin-login' || path.startsWith('/_next/static') || path.startsWith('/_next/image')) {
    return NextResponse.next();
  }

  // 1. Attempt to get the httpOnly cookie set by the backend directly
  let token = request.cookies.get('admin_token')?.value;
  if (token) {
    request.token = token; // Attach token to request for further processing
    return NextResponse.next();
  }

}

export const config = {
  matcher: '/admin/:path*',
};