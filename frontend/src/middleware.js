// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(request) {
    const path = request.nextUrl.pathname;
    let token = request.cookies.get('admin_token')?.value;

    // ✅ NEW: Redirect logged-in users from the login page
    if (path === '/admin-login' && token) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Protect all admin routes
    if (path.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/admin-login', request.url));
        }
        return NextResponse.next();
    }
    
    return NextResponse.next();
}

export const config = {
    // ✅ Keep this matcher
    matcher: ['/admin/:path*', '/admin-login'],
};