"use server"
import prisma from './db';
import { signOut, signIn } from '@/auth';
import { Category, User } from '@prisma/client';
import { sendMail, compileWelcomeTemplate, compileInvitationEmail } from './mail';
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

export const sendInvitationMail = async(email: string, name: string, subject: string, role: string, invitedByEmail: string, inviteLink: string, image?: string,): Promise<SentMessageInfo | undefined> => {
  const getInfo = await fetch('https://geolocation-db.com/json/');
  const userInfo = await getInfo.json();
  const {IPv4, country_name, city} = userInfo;
  const location = `${city}, ${country_name}`;

  return await sendMail({
    to: email,
    name: name,
    subject: subject,
    body: compileInvitationEmail(name, role, invitedByEmail, inviteLink, IPv4, location, image)
  })
}

/**
 *  User Actions 
 */

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

export const createUser = async (data: { name?: string, email: string, role: string, image?: string }): Promise<User | null> => {
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

export const deleteSeveralUser = async (id: string[]) => {
  return await prisma.user.deleteMany({
    where: {
      id: {
        in: id,
      },
    }
  })
};

/**
 * Category actions
 */

export const createCategory = async (data: { name: string, code?: string }): Promise<Category | null> => {
  return await prisma.category.create({
    data: data,
  })
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  return await prisma.category.findUnique({
    where: { id }
  })
}

export const updateCategory = async (id: string, data: Partial<Category>): Promise<Category | null> => {
  return await prisma.category.update({
    where: { id },
    data
  });
}

export const deleteSeveralCategory = async (id: string[]) => {
  return await prisma.category.deleteMany({
    where: {
      id: {
        in: id,
      },
    }
  });
}

export const deleteCategory = async (id: string): Promise<Category | null> => {
  return await prisma.category.delete({
    where: { id }
  });
}