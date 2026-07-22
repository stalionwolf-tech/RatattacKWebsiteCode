import { NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * Route protection for the admin surface.
 *
 * - Everything under /admin (except /admin/login and /admin/403) requires an
 *   authenticated session whose email is on the ALLOWED_ADMIN_EMAILS list.
 * - Unauthenticated visitors are redirected to /admin/login.
 * - Authenticated-but-not-allowed visitors are sent to the /admin/403 page.
 * - Everything under /api/admin returns JSON 401/403 instead of redirecting.
 */
export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const session = req.auth;
  const isLoggedIn = Boolean(session?.user);
  const isAllowed = isLoggedIn && Boolean(session.user.isAdmin);

  const isApiAdmin = path.startsWith('/api/admin');
  const isLoginPage = path === '/admin/login';
  const isForbiddenPage = path === '/admin/403';

  // --- API routes: respond with JSON status codes ---
  if (isApiAdmin) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAllowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.next();
  }

  // --- Public auth pages inside /admin ---
  if (isForbiddenPage) {
    return NextResponse.next();
  }
  if (isLoginPage) {
    // Already an authorized admin? Skip the login screen.
    if (isAllowed) {
      return NextResponse.redirect(new URL('/admin', nextUrl));
    }
    return NextResponse.next();
  }

  // --- Protected admin pages ---
  if (!isLoggedIn) {
    const loginUrl = new URL('/admin/login', nextUrl);
    loginUrl.searchParams.set('callbackUrl', path + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }
  if (!isAllowed) {
    return NextResponse.redirect(new URL('/admin/403', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
