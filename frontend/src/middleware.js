import { NextResponse } from 'next/server';

// Middleware to protect admin routes
export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Protect routes starting with /admin
  if (pathname.startsWith('/admin')) {
    const admin_token = req.cookies.get('admin_token')?.value;

    // Redirect to login if admin_id is missing
    if (!admin_token) {
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }
  }
  return NextResponse.next();
}

// Apply middleware only to /admin routes
export const config = {
  matcher: '/admin/:path*',
};
