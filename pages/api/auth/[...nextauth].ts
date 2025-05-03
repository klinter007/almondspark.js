import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from "next-auth/providers/google";

// Define allowed admin email(s)
const ALLOWED_ADMIN_EMAILS = process.env.ALLOWED_ADMIN_EMAILS 
  ? process.env.ALLOWED_ADMIN_EMAILS.split(',') 
  : ['hanzoom@gmail.com']; // Admin email set to hanzoom@gmail.com

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-here', // Replace with a secure random string in production
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async signIn({ user }) {
      // Only allow sign-in for specific email(s)
      return ALLOWED_ADMIN_EMAILS.includes(user.email || '');
    },
    async session({ session, token }) {
      // Add isAdmin flag to session based on email
      if (session.user) {
        session.user.isAdmin = ALLOWED_ADMIN_EMAILS.includes(session.user.email || '');
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin', // Customize sign-in page
    error: '/admin', // Error page for auth errors
  },
};

export default NextAuth(authOptions);