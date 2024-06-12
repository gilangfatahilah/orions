"use server"
import { signOut, signIn } from '@/auth';

// interface User {
//   id: string;
//   name: string | null;
//   email: string;
//   password: string;
//   role: string;
//   image: string;
//   createdAt: Date;
//   updatedAt: Date | null;
// }

export const signOutAuth = async () => {
  const response = await signOut({
    redirectTo: '/'
  });

  return response;
};

export const credentialsSignIn = async (email: string, password: string) => {
  await signIn('credentials', {
    email,
    password,
    redirect: false,
  })

};

export const googleSignIn = async () => {
  await signIn('google', {
    callbackUrl: '/dashboard'
  });
}