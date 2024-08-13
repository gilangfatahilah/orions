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

  const data = await prisma.notification.findMany({
    where: {
      user: {
        role: {
          in: ["Admin", "Manager"]
        }
      }
    },

    select: {
      notificationJson: true,
    }
  });


  if (!data) {
    throw new Error('User doesn\'t not enabled notification');
  } else {
    await Promise.all(
      data.map(async (notification) => {
        try {
          await webpush.sendNotification(
            JSON.parse(notification.notificationJson),
            JSON.stringify({
              message: name,
              icon,
              body: message,
            })
          );

          return { success: true };
        } catch (error) {
          return { error: "Failed to send notification" };
        }
      })
    )
  }
}