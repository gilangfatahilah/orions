import nodemailer from "nodemailer";
import {render} from '@react-email/render';
import EmailTemplate from "@/components/emails";
import InvitationMail from "@/components/emails/invitation";

export async function sendMail({
  to,
  name,
  subject,
  body,
}: {
  to: string;
  name: string;
  subject: string;
  body: string;
}) {
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });
  try {
    const testResult = await transport.verify();
    console.log(testResult);
  } catch (error) {
    console.error({ error });
    return;
  }

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
    return sendResult
  } catch (error) {
    console.log(error);
  }
}

export function compileWelcomeTemplate(name: string, url: string) {
  const template = render(EmailTemplate({name, url}));
  return template;
}

export function compileInvitationEmail(username: string, userRole: string, invitedByEmail: string, inviteLink: string, IPv4: string, location: string,  userImage?: string) {
  const template = render(InvitationMail({username, userImage, userRole, invitedByEmail, inviteLink, ipAddress: IPv4, location}));
  return template;
}