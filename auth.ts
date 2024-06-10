import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';

export const { auth, signOut, signIn, handlers } = NextAuth(authConfig);