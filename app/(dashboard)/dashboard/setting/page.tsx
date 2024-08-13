import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from '@/components/ui/scroll-area';
import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { auth } from '@/auth';
import SettingAccountForm from '@/components/forms/setting-account-form';
import { getUserById } from '@/services/user.service';
import NotificationSwitcher from '@/components/notificationSwitcher';
import ThemeOptions from '@/components/themeOptions';

const breadcrumbItems = [{ title: 'Setting', link: '/dashboard/setting' }]

const SettingPage = async () => {
  const session = await auth();
  const user = session?.user;

  const dataUser = await getUserById(user?.id as string);

  return (
    <ScrollArea className='h-full' >
      <div className="flex-1 space-y-4 p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className='flex items-center justify-between'>
          <Heading title='Setting' description='Customize your preferences and settings for a personalized experience' />
        </div>

        <SettingAccountForm
          id={user?.id as string}
          userName={dataUser?.name as string}
          email={dataUser?.email as string}
          password={dataUser?.password as string}
          role={dataUser?.role as string}
          image={user?.image}
        />

        <Card>
          <CardHeader>
            <CardTitle>Appearances</CardTitle>
            <CardDescription>Manage your appearance preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="flex items-center justify-between gap-4">
                <div className="grid gap-1.5">
                  <p className="font-medium">Transaction Notification</p>
                  <p className="text-sm text-muted-foreground">
                    Receive a notification when new transaction was added.
                  </p>
                </div>
                <NotificationSwitcher />
              </div>
              <ThemeOptions />
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}

export default SettingPage