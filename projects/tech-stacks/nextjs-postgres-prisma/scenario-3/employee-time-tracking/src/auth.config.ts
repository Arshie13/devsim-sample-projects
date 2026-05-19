import type { NextAuthConfig } from 'next-auth';

// Edge-safe base config. It contains no providers (and therefore no Prisma /
// bcrypt imports) so it can run in the Next.js middleware Edge runtime.
// The full config in `auth.ts` spreads this and adds the Credentials provider.
export const authConfig = {
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  providers: [],
  callbacks: {
    // Runs in middleware on every matched request. Returning false (when not
    // on the login page) redirects the visitor to `pages.signIn`.
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = request.nextUrl.pathname.startsWith('/login');
      if (isOnLogin) return true;
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
