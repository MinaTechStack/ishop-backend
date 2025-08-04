// frontend/middleware.js
import { NextResponse } from 'next/server';

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    // Allow access to login page and static assets
    if (path === '/admin-login' || path.startsWith('/_next/static') || path.startsWith('/_next/image')) {
        return NextResponse.next();
    }

    // Attempt to get the httpOnly cookie set by the backend
    const adminTokenCookie = request.cookies.get('admin_token');

    console.log("Middleware DEBUG: Path:", path);
    console.log("Middleware DEBUG: All cookies received by middleware:", request.cookies);
    console.log("Middleware DEBUG: 'admin_token' cookie value:", adminTokenCookie ? adminTokenCookie.value : 'undefined');

    if (!adminTokenCookie) {
        console.log("Middleware DEBUG: No 'admin_token' cookie found. Redirecting to /admin-login.");
        // Log response headers to see what Vercel sends back
        const response = NextResponse.redirect(new URL('/admin-login', request.url));
        response.headers.set('X-Middleware-Redirect', 'No token found');
        return response;
    }

    // If cookie is found, verify it with the backend
    try {
        console.log("Middleware DEBUG: Attempting to fetch backend verification endpoint.");
        const backendVerifyUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/verify-token`;

        const response = await fetch(backendVerifyUrl, {
            method: 'GET',
            headers: {
                'Cookie': `admin_token=${adminTokenCookie.value}` // Send the backend cookie
            },
        });

        if (response.ok) {
            const data = await response.json();
            if (data.valid) {
                console.log("Middleware: Token valid. Allowing access.");
                return NextResponse.next();
            }
        }

        console.log(`Middleware DEBUG: Backend token verification failed (Status: ${response.status}). Redirecting.`);
        const errorBody = await response.text();
        console.log("Middleware DEBUG: Backend error response body:", errorBody);
        // Log response headers for redirect
        const redirectResponse = NextResponse.redirect(new URL('/admin-login', request.url));
        redirectResponse.headers.set('X-Middleware-Redirect', `Verification failed: ${response.status}`);
        return redirectResponse;

    } catch (error) {
        console.error("Middleware verification error:", error);
        const redirectResponse = NextResponse.redirect(new URL('/admin-login', request.url));
        redirectResponse.headers.set('X-Middleware-Redirect', `Verification error: ${error.message}`);
        return redirectResponse;
    }
}

export const config = {
    matcher: '/admin/:path*',
};