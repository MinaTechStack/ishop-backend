// frontend/middleware.js

import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    let admin_token = null; // Initialize as null

    // Attempt to get token from req.cookies first
    const cookieToken = req.cookies.get('admin_token')?.value;
    if (cookieToken) {
      admin_token = cookieToken; // Assign if found in cookies
      console.log('Middleware: admin_token found in req.cookies.');
    }

    // If still null, attempt to get token from URL search params
    if (!admin_token) {
      const paramToken = req.nextUrl.searchParams.get('token');
      if (paramToken) {
        admin_token = paramToken; // Assign if found in URL params
        console.log('Middleware: admin_token found in URL search params (fallback).');
      }
    }

    // --- FINAL CHECK AND LOG ---
    // This log should NOW definitively show the token string if it was found
    console.log('Middleware final token to verify:', admin_token);

    // If no token (from either source) is found, redirect to login page.
    if (!admin_token) {
      console.log('Middleware: No valid admin_token found. Redirecting to /admin-login.');
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }

    // If a token is found, attempt to verify it with the backend.
    try {
      const backendVerifyUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/admin/verify-token';
      console.log('Middleware: Attempting to fetch backend verification endpoint:', backendVerifyUrl);

      const fetchHeaders = {
        'Cookie': `admin_token=${admin_token}` // Use the correctly assigned admin_token
      };
      console.log('Middleware: Fetching with headers:', fetchHeaders);

      const response = await fetch(backendVerifyUrl, {
        method: 'GET',
        headers: fetchHeaders,
      });

      console.log(`Middleware: Backend verification response status: ${response.status}`);

      if (response.ok) { // Backend responded with a 2xx status (e.g., 200 OK)
        console.log('Middleware: Token successfully verified by backend. Allowing access.');

        // If the token was passed via the URL, clean the URL
        if (req.nextUrl.searchParams.has('token')) {
          const cleanUrl = new URL(pathname, req.url);
          console.log('Middleware: Cleaning token from URL and redirecting to:', cleanUrl.toString());
          // IMPORTANT: Use NextRequest.nextUrl.pathname and not req.url for cleaner path handling
          return NextResponse.redirect(new URL(req.nextUrl.pathname, req.url));
        }

        return NextResponse.next(); // Allow the request to proceed
      } else {
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