import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

/**
 * Parse the ALLOWED_ADMIN_EMAILS env var into a normalized Set.
 * Format: comma-separated email addresses, e.g. "a@x.com, b@y.com".
 * The value lives ONLY in the environment — never hardcode admins.
 */
export function getAllowedAdminEmails() {
  return new Set(
    (process.env.ALLOWED_ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAllowedAdminEmail(email) {
  if (!email) return false;
  return getAllowedAdminEmails().has(email.toLowerCase());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      // AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET are read automatically by Auth.js.
      authorization: {
        params: { prompt: 'select_account' },
      },
    }),
  ],
  // JWT sessions keep the middleware edge-compatible (no DB lookups).
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    // Persist whether this account is an authorized admin onto the token so
    // the middleware and server components can check it without re-parsing.
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
        token.isAdmin = isAllowedAdminEmail(user.email);
      } else if (token?.email && token.isAdmin === undefined) {
        token.isAdmin = isAllowedAdminEmail(token.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
  // Auth.js automatically uses secure, http-only cookies with the
  // `__Secure-`/`__Host-` prefix over HTTPS in production.
  trustHost: true,
});
