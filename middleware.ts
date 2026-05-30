import { NextRequest, NextResponse } from 'next/server';
import { computeAdminToken, COOKIE_NAME } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin/dashboard') || pathname.startsWith('/api/admin/bookings')) {
    const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
    if (!sessionCookie) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    const expectedToken = await computeAdminToken();
    if (sessionCookie !== expectedToken) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const response = NextResponse.redirect(new URL('/admin/login', req.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/api/admin/bookings/:path*'],
};
