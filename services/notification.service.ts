"use server";

import prisma from "@/lib/db";
import webpush from "web-push";

export const registerNotification = async (userId: string, subscription: string) => {
  return await prisma.notification.create({
    data: {
      userId,
      notificationJson: subscription,
    },
  });
}

export const deleteNotification = async (userId: string) => {
  return await prisma.notification.delete({
    where: { userId }
  });
}

export const sendNotification = async (
  message: string,
  userId: string,
  icon: string,
  name: string
) => {
  const vapidKeys = {
    private: process.env.VAPID_PRIVATE_KEY!,
    public: process.env.NEXT_PUBLIC_VAPID_KEY!,
  }

  webpush.setVapidDetails(
    "mailto:orion.inve@gmail.com",
    vapidKeys.public,
    vapidKeys.private,
  );

  const data = await prisma.notification.findUnique({
    where: { userId }
  })

  if (!data) {
    throw new Error('User doesn\'t not enabled notification');
  }else {
    try {
      await webpush.sendNotification(
        JSON.parse(data.notificationJson),
        JSON.stringify({
          message: name,
          icon,
          body: message,
        })
      );

      return "{}"
    } catch (error) {
      return JSON.stringify({ error: "failed to send notification" })
    }
  }
}
