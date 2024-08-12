'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Switch } from './ui/switch';
import { useSession } from 'next-auth/react';
import { urlB64ToUint8Array } from '@/lib/utils';
import { deleteNotification, registerNotification } from '@/services/notification.service';

const NotificationSwitcher = () => {
  const { data: session } = useSession();
  const [notificationPermission, setNotificationPermission] = useState<"granted" | "denied" | "default">("default");

  const showNotification = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
        if (permission === "granted") {
          subscribeUser();
        } else {
          toast.info("Please go to settings and enable notifications.");
        }
      });
    } else {
      toast.info("This browser does not support notifications.");
    }
  };

  const subscribeUser = async () => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        const subscription = await registration?.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlB64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_KEY!),
        });

        console.log(process.env.NEXT_PUBLIC_VAPID_KEY!);

        await registerNotification(session?.user.id as string, JSON.stringify(subscription));
      
        toast.success("Success, enabled notification.")
      } catch (error) {
        toast.error("Error during subscription.");
      }
    } else {
      toast.error("Service workers are not supported in this browser");
    }
  };

  const removeNotification = async () => {
    try {      
      setNotificationPermission("denied");
      await deleteNotification(session?.user.id as string);

      toast.success("Success, disabled notification");
    } catch (error) {
      toast.error("Failed to remove Notification")
    }
  };

  useEffect(() => {
    setNotificationPermission(Notification.permission);
  }, [])

  if (!session) return null;

  return (
    <Switch
      id="email-notifications"
      checked={notificationPermission === "granted"}
      onCheckedChange={(checked) => {
        if (checked) {
          showNotification();
        } else {
          removeNotification();
        }
      }}
    />
  );
};

export default NotificationSwitcher;
