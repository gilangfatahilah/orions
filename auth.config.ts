import { NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import prisma from './lib/db';

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  
  pages: {
    signIn: '/'
  },

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 3
  },

  jwt: {
    maxAge: 60 * 60 * 24 * 3
  },

  providers: [
    CredentialsProvider({
      name: 'credentials',

      credentials: {
        email: {
          type: 'email',
          label: 'Email',
          placeholder: 'Enter your email',
        },
        password: {
          type: 'password',
          label: 'Password',
          placeholder: 'Enter your password',
        }
      },

      async authorize(credentials) {

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            }
          });

          if (!user) return null;

          const passwordMatch = await bcrypt.compare(credentials.password as string, user.password);

          if (passwordMatch) {
            return user
          }

          if (!passwordMatch) return null;
        
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
          }
      }
    })
  ],

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.image = token.image as string;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as string;
        token.image = user.image;
      }
      return token;
    }
  },
} satisfies NextAuthConfig;
