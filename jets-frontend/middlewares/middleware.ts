import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const matcher = ['/admin/:path*', '/atleta/:path*', '/funcionario/:path*', '/torcedor/:path*'];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const role = payload.tipo as string;          // 'ADMIN' | 'ATLETA' | ...

    const url  = req.nextUrl.clone();
    const path = url.pathname;

    const allowed =
      (role === 'ADMIN'       && path.startsWith('/dashboard/admin'))       ||
      (role === 'ATLETA'      && path.startsWith('/dashboard/atleta'))      ||
      (role === 'FUNCIONARIO' && path.startsWith('/dashboard/funcionario')) ||
      (role === 'TORCEDOR'    && path.startsWith('/dashboard/torcedor'));

    if (!allowed) {
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = { matcher };
