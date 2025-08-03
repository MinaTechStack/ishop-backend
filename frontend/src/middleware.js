// frontend/middleware.js

import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    let finalToken = null; // Use a distinct, clear variable name

    // Attempt to get token from req.cookies first
    const cookieToken = req.cookies.get('admin_token')?.value;
    console.log('Middleware DEBUG: Cookie token found:', cookieToken); // LOG THIS
    if (cookieToken) {
      finalToken = cookieToken;
    }

    // If no token from cookie, attempt to get token from URL search params
    if (!finalToken) {
      const paramToken = req.nextUrl.searchParams.get('token');
      console.log('Middleware DEBUG: URL param token found:', paramToken); // LOG THIS
      if (paramToken) {
        finalToken = paramToken;
      }
    }

    // --- FINAL VERIFICATION LOG ---
    console.log('Middleware DEBUG: Final token to verify:', finalToken);

    // If no token (from either source) is found, redirect to login page.
    if (!finalToken) {
      console.log('Middleware DEBUG: No valid admin_token found. Redirecting to /admin-login.');
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }

    // If a token is found, attempt to verify it with the backend.
    try {
      const backendVerifyUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/admin/verify-token';
      console.log('Middleware DEBUG: Attempting to fetch backend verification endpoint:', backendVerifyUrl);

      const fetchHeaders = {
        'Cookie': `admin_token=${finalToken}` // Use the distinct variable here
      };
      console.log('Middleware DEBUG: Fetching with headers:', fetchHeaders);

      const response = await fetch(backendVerifyUrl, {
        method: 'GET',
        headers: fetchHeaders,
      });

      console.log(`Middleware DEBUG: Backend verification response status: ${response.status}`);

      if (response.ok) { // Backend responded with a 2xx status
        console.log('Middleware DEBUG: Token successfully verified by backend. Allowing access.');

        // If token was from URL, clean the URL by redirecting to the same path
        if (req.nextUrl.searchParams.has('token')) {
          console.log('Middleware DEBUG: Cleaning token from URL and redirecting to:', req.nextUrl.pathname);
          return NextResponse.redirect(new URL(req.nextUrl.pathname, req.url));
        }

        return NextResponse.next(); // Allow request to proceed
      } else {
        // Backend verification failed (e.g., 401, 403)
        console.log('Middleware DEBUG: Backend token verification failed or returned non-OK status. Redirecting to /admin-login.');
        try {
            const errorBody = await response.json();
            console.log('Middleware DEBUG: Backend error response body:', errorBody);
        } catch (jsonError) {
            console.log('Middleware DEBUG: Could not parse backend error response as JSON or response was empty.');
        }

        const redirectResponse = NextResponse.redirect(new URL('/admin-login', req.url));
        redirectResponse.cookies.delete('admin_token'); // Clear the cookie
        return redirectResponse;
      }
    } catch (error) {
      console.error('Middleware DEBUG: Error during backend token verification fetch:', error);
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};