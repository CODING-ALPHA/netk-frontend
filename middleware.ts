import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = new Set([
  '/',
  '/sign-in',
  '/sign-up',
  '/forgot-password',
]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Static assets and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Next.js API routes (token management handled internally)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Exact public paths
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // Dynamic public paths
  if (
    pathname.startsWith('/reset-password/') ||
    pathname.startsWith('/portfolio/')
  ) {
    return NextResponse.next();
  }

  // Protected: require access token cookie
  const token = req.cookies.get('accessToken')?.value;
  if (!token) {
    console.log('[Middleware] No accessToken cookie found for path:', pathname, 'Redirecting to /sign-in');
    const url = req.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  console.log('[Middleware] Access allowed for path:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
