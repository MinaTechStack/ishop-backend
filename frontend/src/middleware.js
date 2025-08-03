// frontend/middleware.js

import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin')) {
    const admin_token = req.cookies.get('admin_token')?.value;

    // --- CRUCIAL CHANGE FOR DEBUGGING ---
    // We are temporarily removing the immediate redirect here.
    // This allows the code to proceed to the 'try...catch' block
    // and attempt the fetch to the backend, even if admin_token is undefined
    // from req.cookies. This will give us valuable logs from the fetch.
    console.log('Middleware initial admin_token check (from req.cookies):', admin_token);
    // if (!admin_token) {
    //   console.log('Middleware: No admin_token found, redirecting to /admin-login.');
    //   return NextResponse.redirect(new URL('/admin-login', req.url));
    // }
    // --- END CRUCIAL CHANGE ---

    try {
      const backendVerifyUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/admin/verify-token';

      // --- ADDED LOGS FOR DEBUGGING THE FETCH ---
      console.log('Middleware: Attempting to fetch backend verification endpoint:', backendVerifyUrl);

      const fetchHeaders = {
        // IMPORTANT: Manually set the Cookie header.
        // Even if admin_token is undefined here, we send 'admin_token=' to the backend.
        // Your backend's 'authorize' middleware should then correctly handle this as a missing token.
        'Cookie': `admin_token=${admin_token || ''}` // Use empty string if undefined to prevent 'undefined' in header
      };
      console.log('Middleware: Fetching with headers:', fetchHeaders);
      // --- END ADDED LOGS ---

      const response = await fetch(backendVerifyUrl, {
        method: 'GET',
        headers: fetchHeaders
      });

      console.log(`Middleware: Backend verification response status: ${response.status}`);

      if (response.ok) { // Check if the response status is 2xx (e.g., 200 OK)
        console.log('Middleware: Token successfully verified by backend. Allowing access.');
        return NextResponse.next();
      } else {
        console.log('Middleware: Backend token verification failed or returned non-OK status. Redirecting to /admin-login.');
        try {
            const errorBody = await response.json();
            console.log('Middleware: Backend error response body:', errorBody);
        } catch (jsonError) {
            console.log('Middleware: Could not parse backend error response as JSON.');
        }

        const redirectResponse = NextResponse.redirect(new URL('/admin-login', req.url));
        redirectResponse.cookies.delete('admin_token');
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