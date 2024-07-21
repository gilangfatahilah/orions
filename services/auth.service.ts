"use server"
import { signOut, signIn } from '@/auth';
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

export const sendInvitationMail = async (
  email: string,
  name: string,
  subject: string,
  role: string,
  invitedByEmail: string,
  inviteLink: string,
  image?: string,
): Promise<SentMessageInfo | undefined> => {
  const getInfo = await fetch('https://geolocation-db.com/json/');
  const userInfo = await getInfo.json();
  const { IPv4, country_name, city } = userInfo;
  const location = `${city}, ${country_name}`;

  return await sendMail({
    to: email,
    name: name,
    subject: subject,
    body: compileInvitationEmail(name, role, invitedByEmail, inviteLink, IPv4, location, image)
  })
}