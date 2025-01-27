import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../../src/utils/db';
import { verifyPassword } from '../../../../src/utils/auth/password';

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: false, // Critical for disabling encryption
  },
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email }
          });

          if (!admin) return null;
          
          const isValid = await verifyPassword(
            credentials.password,
            admin.password
          );

          return isValid ? { 
            id: admin.id.toString(), // Ensure ID is string
            email: admin.email,
            role: 'admin' 
          } : null;

        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  }
});