import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';

  // Check if it's localhost or dev server to avoid redirection locally
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || host.includes('.local');
  const hasWww = host.startsWith('www.');
  const isHttps = request.headers.get('x-forwarded-proto') === 'https';

  let redirectNeeded = false;
  let newHost = host;

  if (!isLocalhost) {
    // 1. Force www
    if (!hasWww) {
      newHost = 'www.' + host;
      redirectNeeded = true;
    }
  }

  if (redirectNeeded) {
    url.host = newHost;
    // Upgrade protocol to https in production environments
    if (!isLocalhost && !isHttps) {
      url.protocol = 'https:';
    }
    // Use 308 Permanent Redirect for SEO friendliness (preserves request method)
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo.png, hero.png, outphoto.jpeg, showroom.jpeg (static image assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|hero.png|outphoto.jpeg|showroom.jpeg).*)',
  ],
};
