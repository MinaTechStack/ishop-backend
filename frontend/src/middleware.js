// frontend/middleware.js

import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    let tokenToVerify = null; // Initialize a variable to hold the token we'll use

    // 1. Attempt to get the admin_token from req.cookies (the ideal way)
    const cookieToken = req.cookies.get('admin_token')?.value;
    if (cookieToken) {
      tokenToVerify = cookieToken;
      console.log('Middleware: admin_token found in req.cookies.');
    }

    // 2. If not found in cookies, check the URL's search parameters as a fallback.
    // ONLY assign if tokenToVerify is still null (i.e., not found in cookies)
    if (!tokenToVerify) {
      const paramToken = req.nextUrl.searchParams.get('token');
      if (paramToken) {
        tokenToVerify = paramToken;
        console.log('Middleware: admin_token found in URL search params (fallback).');
      }
    }

    // --- FINAL CHECK AND LOG ---
    // Now, tokenToVerify should definitively hold the token or be null
    console.log('Middleware final token to verify:', tokenToVerify);

    // If no token is found from either source, redirect to login page.
    if (!tokenToVerify) {
      console.log('Middleware: No valid admin_token found. Redirecting to /admin-login.');
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }

    // If a token is found, attempt to verify it with the backend.
    try {
      const backendVerifyUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/admin/verify-token';

      console.log('Middleware: Attempting to fetch backend verification endpoint:', backendVerifyUrl);

      const fetchHeaders = {
        'Cookie': `admin_token=${tokenToVerify}` // Use the correctly assigned tokenToVerify
      };
      console.log('Middleware: Fetching with headers:', fetchHeaders);

      const response = await fetch(backendVerifyUrl, {
        method: 'GET',
        headers: fetchHeaders,
      });

      console.log(`Middleware: Backend verification response status: ${response.status}`);

      if (response.ok) { // Backend responded with a 2xx status (e.g., 200 OK)
        console.log('Middleware: Token successfully verified by backend. Allowing access.');

        // If the token was passed via the URL, clean the URL by redirecting to the same path
        // but without the query parameter.
        if (req.nextUrl.searchParams.has('token')) {
          const cleanUrl = new URL(pathname, req.url); // Reconstruct URL without search params
          console.log('Middleware: Cleaning token from URL and redirecting to:', cleanUrl.toString());
          return NextResponse.redirect(cleanUrl);
        }

        return NextResponse.next(); // Allow the request to proceed
      } else {
        // Backend verification failed (e.g., 401 Unauthorized, 403 Forbidden)
        console.log('Middleware: Backend token verification failed or returned non-OK status. Redirecting to /admin-login.');
        try {
            const errorBody = await response.json();
            console.log('Middleware: Backend error response body:', errorBody);
        } catch (jsonError) {
            console.log('Middleware: Could not parse backend error response as JSON or response was empty.');
        }

        const redirectResponse = NextResponse.redirect(new URL('/admin-login', req.url));
        redirectResponse.cookies.delete('admin_token'); // Clear the cookie in the browser
        return redirectResponse;
      }
    } catch (error) {
      console.error('Middleware: Error during backend token verification fetch:', error);
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};