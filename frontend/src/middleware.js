// frontend/middleware.js

import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    let admin_token_from_middleware = null; // Use a distinct variable name

    // 1. Attempt to get token from req.cookies
    const cookieToken = req.cookies.get('admin_token')?.value;
    if (cookieToken) {
      admin_token_from_middleware = cookieToken;
      console.log('Middleware DEBUG: admin_token found in req.cookies.');
    }

    // 2. If not found in cookies, attempt to get token from URL search params
    if (!admin_token_from_middleware) { // Only try search params if cookie was not found
      const paramToken = req.nextUrl.searchParams.get('token');
      if (paramToken) {
        admin_token_from_middleware = paramToken;
        console.log('Middleware DEBUG: admin_token found in URL search params (fallback).');
      }
    }

    // --- FINAL VERIFICATION LOG ---
    console.log('Middleware DEBUG: Final token to verify:', admin_token_from_middleware);

    // If no token is found from either source, redirect to login page.
    if (!admin_token_from_middleware) {
      console.log('Middleware DEBUG: No valid admin_token found. Redirecting to /admin-login.');
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }

    // If a token is found, attempt to verify it with the backend.
    try {
      const backendVerifyUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/admin/verify-token';
      console.log('Middleware DEBUG: Attempting to fetch backend verification endpoint:', backendVerifyUrl);

      const fetchHeaders = {
        // Use the distinct variable here
        'Cookie': `admin_token=${admin_token_from_middleware}`
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