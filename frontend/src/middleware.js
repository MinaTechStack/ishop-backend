// frontend/middleware.js
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  let token = request.cookies.get('admin_token')?.value;

  if (path.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
    return NextResponse.next();
  }

  if (path === '/admin-login') {
    if (token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin-login'],
};