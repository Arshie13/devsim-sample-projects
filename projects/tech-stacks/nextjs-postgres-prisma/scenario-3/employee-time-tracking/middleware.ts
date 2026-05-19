import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

// The middleware uses only the edge-safe config (no Prisma/bcrypt), so it can
// verify the JWT session cookie in the Edge runtime and gate every page.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Run on all routes except Next.js internals, the auth API, and static files.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
