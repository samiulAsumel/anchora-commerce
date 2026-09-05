import { NextResponse, type NextRequest } from 'next/server';
import { verifyAccessTokenEdge } from '@/lib/jwt-edge';
import { ACCESS_TOKEN_COOKIE } from '@/lib/auth-constants';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL(`/login?next=${pathname}`, req.url));
    }

    try {
      const payload = await verifyAccessTokenEdge(token, process.env.JWT_SECRET ?? '');
      if (payload.role !== 'ADMIN' && payload.role !== 'OWNER') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    } catch {
      return NextResponse.redirect(new URL(`/login?next=${pathname}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
