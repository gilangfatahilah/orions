/* eslint-disable no-console */
"use server"
import { signOut, signIn } from '@/auth';
import prisma from '@/lib/db';
import { sendMail, compileWelcomeTemplate, compileInvitationEmail } from '@/lib/mail';
import { SentMessageInfo } from 'nodemailer';

export const signOutAuth = async () => {
  return await signOut({ redirectTo: '/' });
};

export const credentialsSignIn = async (email: string, password: string) => {
  return await signIn('credentials', {
    email,
    password,
    redirect: false,
  })

};

export const resetPassword = async (id: string, password: string) => {
  const currentStatus = await prisma.user.findUnique({
    where: { id },
    select: {
      joinedAt: true,
    }
  })

  return await prisma.user.update({
    where: { id },
    data: {
      password,
      joinedAt: (currentStatus?.joinedAt === null
        || currentStatus?.joinedAt === undefined)
        ? new Date() : currentStatus?.joinedAt,
    },
  })
}


export const send = async (
  email: string,
  name: string,
  subject: string,
  url: string
): Promise<SentMessageInfo | undefined> => {
  return await sendMail({
    to: email,
    name: name,
    subject: subject,
    body: compileWelcomeTemplate(name, url)
  })
};

// auth.service.ts
export const sendInvitationMail = async (
  email: string,
  name: string,
  subject: string,
  role: string,
  invitedByEmail: string,
  inviteLink: string,
  image?: string,
): Promise<SentMessageInfo | undefined> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

  let ip = '0.0.0.0';
  let location = 'Indonesia';

  try {
    const getInfo = await fetch('https://ipinfo.io/', { signal: controller.signal });
    clearTimeout(timeoutId);
    const userInfo = await getInfo.json();
    ip = userInfo.ip;
    location = `${userInfo.city}, ${userInfo.region}`;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Fetch request timed out');
    } else {
      console.error('Fetch request failed', error);
    }
  }

  return await sendMail({
    to: email,
    name: name,
    subject: subject,
    body: compileInvitationEmail(name, role, invitedByEmail, inviteLink, ip, location, image),
  });
};

