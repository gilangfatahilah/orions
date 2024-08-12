import { NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from 'next-auth/providers/google';
import * as bcrypt from "bcryptjs";
import prisma from './lib/db';

export const authConfig = {
  adapter: PrismaAdapter(prisma),

  pages: {
    signIn: '/',
    error: '/'
  },

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24
  },

  jwt: {
    maxAge: 60 * 60 * 24
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
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

        const passwordMatch = await bcrypt.compare(credentials.password as string, user.password as string);
        console.log(passwordMatch);
        
        if (!passwordMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        }
      }
    }),
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

    async jwt({ token, user, account, profile, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
      }
      
      if (account?.provider === 'google' && profile?.picture) {
        token.image = profile.picture;
      }

      if (trigger === "update" && session) {
        token.id = session.user.id;
        token.role = session.user.role;
        token.image = session.user.image;
        token.name = session.user.name;
      };
      
      return token;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email as string,
          }
        });

        if (existingUser) {
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              }
            },
            update: {
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state as string,
            },
            create: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state as string,
            },
          });

          return true;
        } else {
          return false;
        }
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
