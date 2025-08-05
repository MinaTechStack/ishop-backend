// frontend/middleware.js
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Allow access to login page and static assets
  if (path === '/admin-login' || path.startsWith('/_next/static') || path.startsWith('/_next/image')) {
    return NextResponse.next();
  }

  // ✅ This is the important change from your first example.
  // It now properly protects your admin routes.
  let token = request.cookies.get('admin_token')?.value;

  // If the path starts with /admin and there is no token, redirect to login.
  if (path.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }
  // This line from your original code is not needed and doesn't work as intended.
  // It has been removed.
  // if (token) {
  //  request.token = token;
  //  return NextResponse.next();
  // }
  
  // If a token exists and the path is not /admin, or if it's an admin path with a token, proceed.
  return NextResponse.next();
}

export const config = {
  // ✅ The matcher is updated to include the login page for full functionality.
  matcher: ['/admin/:path*', '/admin-login'],
};