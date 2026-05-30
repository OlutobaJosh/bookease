import { NextRequest, NextResponse } from 'next/server';
import { computeAdminToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: 'Admin credentials not configured.' }, { status: 500 });
  }

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const token = await computeAdminToken();

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}
