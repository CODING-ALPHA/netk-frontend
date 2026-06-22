import { NextRequest, NextResponse } from 'next/server';

function clearCookiesAndReturn401() {
  const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  res.cookies.delete('accessToken');
  res.cookies.delete('refreshToken');
  return res;
}

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refreshToken')?.value;
  if (!refreshToken) return clearCookiesAndReturn401();

  try {
    let baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `https://${baseUrl}`;
    }

    const backendRes = await fetch(
      `${baseUrl}/auth/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      },
    );

    if (!backendRes.ok) return clearCookiesAndReturn401();

    const { accessToken } = await backendRes.json();

    const res = NextResponse.json({ ok: true });
    res.cookies.set('accessToken', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 15,
      path: '/',
    });
    return res;
  } catch {
    return clearCookiesAndReturn401();
  }
}
