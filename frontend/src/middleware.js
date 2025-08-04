// frontend/middleware.js
import { NextResponse } from 'next/server';

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    // Allow access to login page and static assets
    if (path === '/admin-login' || path.startsWith('/_next/static') || path.startsWith('/_next/image')) {
        return NextResponse.next();
    }

    // 1. Attempt to get the httpOnly cookie set by the backend directly
    let tokenToVerify = request.cookies.get('admin_token')?.value;

    // 2. If the httpOnly cookie isn't found, try a fallback cookie that client-side JS can set
    if (!tokenToVerify) {
        tokenToVerify = request.cookies.get('admin_token_fallback_for_middleware')?.value; // <--- ADDED THIS LINE
    }

    console.log("Middleware DEBUG: Path:", path);
    console.log("Middleware DEBUG: All cookies received by middleware:", request.cookies);
    console.log("Middleware DEBUG: Token to verify (from cookie or fallback):", tokenToVerify || 'undefined'); // <--- MODIFIED LOG

    if (!tokenToVerify) {
        console.log("Middleware DEBUG: No valid token found (neither HttpOnly nor fallback). Redirecting to /admin-login."); // <--- MODIFIED LOG
        const response = NextResponse.redirect(new URL('/admin-login', request.url));
        response.headers.set('X-Middleware-Redirect', 'No token found');
        return response;
    }

    // If a token is found (from either source), verify it with the backend
    try {
        console.log("Middleware DEBUG: Attempting to fetch backend verification endpoint.");
        const backendVerifyUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/verify-token`;

        const response = await fetch(backendVerifyUrl, {
            method: 'GET',
            headers: {
                // Send the token in the Authorization header to the backend for verification
                // This allows your backend 'authorize' middleware to find it.
                'Authorization': `Bearer ${tokenToVerify}` // <--- MODIFIED HEADER
            },
            // Do NOT use withCredentials here; it's a server-to-server fetch, not browser-to-server.
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