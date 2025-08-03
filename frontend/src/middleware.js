// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const admin_token = req.cookies.get('admin_token')?.value;
    console.log('Middleware checking admin_token:', admin_token); // ADD THIS LOG

    if (!admin_token) {
      console.log('Middleware: Redirecting to /admin-login due to missing token'); // ADD THIS LOG
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};