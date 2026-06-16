import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { accessToken, refreshToken } = await req.json();

  const res = NextResponse.json({ ok: true });

  // accessToken: NOT httpOnly so the axios client interceptor can read it.
  // It is short-lived (15 min), making the XSS exposure window small.
  res.cookies.set('accessToken', accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 15, // 15 minutes
    path: '/',
  });

  // refreshToken: httpOnly — only ever read by the Next.js /api/auth/refresh
  // server route, never exposed to browser JS.
  res.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return res;
}
