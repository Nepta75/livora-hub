import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getRolesFromTokenEdge } from '@/utils/getRolesFromToken';

const COOKIE_NAME = 'hub_token';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = '/login';

  const tokenCookie = req.cookies.get(COOKIE_NAME);
  if (!tokenCookie?.value) {
    return NextResponse.redirect(url);
  }

  const roles = getRolesFromTokenEdge(tokenCookie.value);
  if (!roles?.hasHubAccess) {
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
