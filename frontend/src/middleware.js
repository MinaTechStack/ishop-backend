import { NextResponse } from 'next/server';

export async function middleware(request) {
    const path = request.nextUrl.pathname;
    let token = request.cookies.get('admin_token')?.value;

    // Redirect a logged-in user away from the login page
    if (path === '/admin-login' && token) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    // Protect all admin routes
    if (path.startsWith('/admin')) {
        // If there's no token, redirect to the login page
        if (!token) {
            return NextResponse.redirect(new URL('/admin-login', request.url));
        }
        // If a token exists, let the request proceed
        return NextResponse.next();
    }

    // For all other routes, do nothing
    return NextResponse.next();
}

export const config = {
    // Match both admin routes and the login page
    matcher: ['/admin/:path*', '/admin-login'],
};