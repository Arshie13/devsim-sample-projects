import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { authConfig } from '@/auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const employee = await prisma.employee.findUnique({ where: { email } });
        if (!employee || !employee.password) return null;

        // Managers only — non-manager employees cannot sign in.
        if (employee.role !== 'manager') return null;

        const valid = await bcrypt.compare(password, employee.password);
        if (!valid) return null;

        return {
          id: String(employee.id),
          email: employee.email,
          name: `${employee.first_name} ${employee.last_name}`,
          role: employee.role,
        };
      },
    }),
  ],
});
