// pages/api/auth/[...nextauth].js 
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/utils/db';
import { verifyPassword } from '@/utils/auth/password';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter both email and password');
          }

          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email }
          }).catch(error => {
            console.error('Database error:', error);
            throw new Error('Database connection failed');
          });

          if (!admin) {
            throw new Error('Invalid credentials');
          }

          const isValid = await verifyPassword(credentials.password, admin.password);

          if (!isValid) {
            throw new Error('Invalid credentials');
          }

          return {
            id: admin.id,
            email: admin.email,
            role: 'admin'
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id;
          token.role = user.role;
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        throw error;
      }
    },
    async session({ session, token }) {
      try {
        if (session?.user) {
          session.user.id = token.id;
          session.user.role = token.role;
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        throw error;
      }
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  }
};

// Ensure NEXTAUTH_URL is set
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

export default NextAuth(authOptions);