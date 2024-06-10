import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import prisma from './db';

interface User {
  id: string;
  name: string | null;
  email: string;
  password: string;
  role: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export const findUserByEmail = async(email: string): Promise<User | null | undefined> => {
  try {
    const response =await prisma.user.findUnique({
      where: {
        email: email,
      }
    })

    console.log(response);

    return response;
  }  catch (error) {
    console.log(error);
  }
}