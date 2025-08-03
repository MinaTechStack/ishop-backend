// frontend/middleware.js

import { NextResponse } from 'next/server'; // Import NextResponse

export async function middleware(req) { // Make the function async
  const { pathname } = req.nextUrl; // Get the pathname from the request URL

  // Protect routes starting with /admin
  if (pathname.startsWith('/admin')) {
    // Get the admin_token cookie value from the incoming request
    const admin_token = req.cookies.get('admin_token')?.value;

    // Log for debugging: Check what the middleware sees
    console.log('Middleware checking admin_token:', admin_token);

    // If no token is found, redirect immediately to the login page
    if (!admin_token) {
      console.log('Middleware: No admin_token found, redirecting to /admin-login.');
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }

    // If a token is present, attempt to verify it with the backend
    try {
      // Construct the full backend verification URL using NEXT_PUBLIC_API_BASE_URL
      // This is Option B: matching the env variable name from your .env file
      const backendVerifyUrl = process.env.NEXT_PUBLIC_API_BASE_URL + '/admin/verify-token';

      // Make an internal server-to-server fetch request to your backend.
      // Crucially, forward the admin_token in the 'Cookie' header,
      // as the backend's `authorize` middleware expects it there.
      const response = await fetch(backendVerifyUrl, {
        method: 'GET', // Or 'POST' if your backend verify endpoint expects POST
        headers: {
          // Send the cookie received by the middleware to the backend
          'Cookie': `admin_token=${admin_token}`
        }
      });

      // Log the backend verification response status for debugging
      console.log(`Middleware: Backend verification response status: ${response.status}`);

      if (response.ok) { // Check if the response status is 2xx (e.g., 200 OK)
        // If the backend responds with a success status, the token is valid.
        console.log('Middleware: Token successfully verified by backend. Allowing access.');
        return NextResponse.next(); // Allow the request to proceed to the /admin route
      } else {
        // If the backend indicates the token is invalid (e.g., 401, 403 status)
        console.log('Middleware: Backend token verification failed. Redirecting to /admin-login.');
        const redirectResponse = NextResponse.redirect(new URL('/admin-login', req.url));
        // Optional: If the token was invalid, explicitly tell the browser to delete it.
        // This sets a Set-Cookie header with an expired date to remove the cookie.
        redirectResponse.cookies.delete('admin_token');
        return redirectResponse; // Redirect to login page
      }
    } catch (error) {
      // Handle network errors (e.g., backend is unreachable, DNS issues)
      console.error('Middleware: Error during backend token verification:', error);
      // Redirect to login page on any error during verification
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