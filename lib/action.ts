"use server"
import { signOut, signIn } from '@/auth';
import prisma from './db';
import { User } from '@prisma/client';
import { sendMail, compileWelcomeTemplate } from './mail';
import { SentMessageInfo } from 'nodemailer';

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

export const send = async (email: string, name: string, subject: string, url: string): Promise<SentMessageInfo | undefined> => {
  return await sendMail({
    to: email,
    name: name,
    subject: subject,
    body: compileWelcomeTemplate(name, url)
  })
}; 

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { email: email },
  })
};

export const getUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id: id },
  })
};

export const createUser = async (data: {name?: string, email: string, role: string, image?: string}): Promise<User | null> =>{
  return await prisma.user.create({
    data: data
  });
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User | null> => {
  return await prisma.user.update({
    where: { id: id },
    data: data,
  })
};

export const deleteUser = async (id: string): Promise<User | null> => {
  return await prisma.user.delete({
    where: {
      id: id,
    }
  })
};