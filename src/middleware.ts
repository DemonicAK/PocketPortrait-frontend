import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // const token = req.cookies.get('isLoggedIn')?.value;
    // console.log('🍪 Auth token:', token); // Debugging line to check the token
    const isLoggedIn = req.cookies.get('isLoggedIn')?.value === 'true';
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/auth');
  const isLanding = pathname === '/';

  // 🚫 If logged in and trying to access /auth or landing page → redirect to dashboard
if (isLoggedIn && (isAuthPage || isLanding)) {
  return NextResponse.redirect(new URL('/dashboard', req.url));
}

  // ✅ If not logged in and trying to access protected routes (like /dashboard)
  if (!isLoggedIn && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/', '/auth', '/dashboard/:path*'],
};