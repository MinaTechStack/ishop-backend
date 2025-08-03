// frontend/middleware.js

import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    // 1. Attempt to get the admin_token from req.cookies (the ideal way)
    let admin_token = req.cookies.get('admin_token')?.value;

    // 2. If not found in req.cookies, check the URL's search parameters as a fallback.
    // This handles the initial redirect from login where the cookie might not be readable yet.
    if (!admin_token) {
      admin_token = req.nextUrl.searchParams.get('token');
      if (admin_token) {
        console.log('Middleware: admin_token found in URL search params (fallback).');
      }
    }

    // --- IMPORTANT LOG for debugging ---
    console.log('Middleware final admin_token (from cookies or URL):', admin_token);

    // If no admin_token is found from either cookies or URL, redirect to login page.
    if (!admin_token) {
      console.log('Middleware: No valid admin_token found. Redirecting to /admin-login.');
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }

    // If a token is found, attempt to verify it with the backend.
    try {
      const backendVerifyUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/admin/verify-token';

      console.log('Middleware: Attempting to fetch backend verification endpoint:', backendVerifyUrl);

      const fetchHeaders = {
        // IMPORTANT: Manually set the 'Cookie' header with the token we found.
        // This ensures the backend's `authorize` middleware can validate it.
        'Cookie': `admin_token=${admin_token}`
      };
      console.log('Middleware: Fetching with headers:', fetchHeaders);

      const response = await fetch(backendVerifyUrl, {
        method: 'GET',
        headers: fetchHeaders,
        // Optional: Include credentials for backend if it's expecting them,
        // though `Cookie` header should suffice for direct server-to-server fetch.
        // credentials: 'include',
      });

      console.log(`Middleware: Backend verification response status: ${response.status}`);

      if (response.ok) { // Backend responded with a 2xx status (e.g., 200 OK)
        console.log('Middleware: Token successfully verified by backend. Allowing access.');

        // If the token was passed via the URL, clean the URL by redirecting to the same path
        // but without the query parameter. This is important for security (no token in history).
        if (req.nextUrl.searchParams.has('token')) {
          const cleanUrl = new URL(pathname, req.url); // Reconstruct URL without search params
          console.log('Middleware: Cleaning token from URL and redirecting to:', cleanUrl.toString());
          return NextResponse.redirect(cleanUrl);
        }

        return NextResponse.next(); // Allow the request to proceed to the /admin route
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
        // Also, attempt to delete the 'admin_token' cookie from the client's browser
        // and any localStorage fallback token, as it's invalid.
        redirectResponse.cookies.delete('admin_token');
        // If you were also storing admin_token in localStorage on the client, you'd need to clear it.
        // Since middleware can't directly clear client localStorage, rely on the client-side login logic
        // to handle this or for the login page to clear.
        return redirectResponse;
      }
    } catch (error) {
      // Handle network errors during the fetch itself (e.g., backend is unreachable, DNS issues)
      console.error('Middleware: Error during backend token verification fetch:', error);
      // Redirect to login page on any error during verification, as access cannot be confirmed.
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }
  }
  // For all other paths that don't start with /admin, allow the request to proceed
  return NextResponse.next();
}

// Define the matcher to apply this middleware only to paths under /admin
export const config = {
  matcher: '/admin/:path*',
};