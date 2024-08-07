import React from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input";
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { auth } from '@/auth';
import SettingAccountForm from '@/components/forms/setting-account-form';

const breadcrumbItems = [{ title: 'Setting', link: '/dashboard/setting' }]

const SettingPage = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <ScrollArea className='h-full' >
      <div className="flex-1 space-y-4 p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className='flex items-center justify-between'>
          <Heading title='Setting' description='Customize your preferences and settings for a personalized experience' />
        </div>

        <SettingAccountForm
          id={user?.id as string}
          userName={user?.name as string}
          email={user?.email as string}
          image={user?.image}
        />

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="flex items-center justify-between gap-4">
                <div className="grid gap-1.5">
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates.
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="grid gap-1.5">
                  <p className="font-medium">Desktop Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive desktop notifications for real-time updates.
                  </p>
                </div>
                <Switch id="desktop-notifications" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the visual appearance of the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="flex items-center justify-between gap-4">
                <div className="grid gap-1.5">
                  <p className="font-medium">Theme</p>
                  <p className="text-sm text-muted-foreground">Choose the color theme for the application.</p>
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="grid gap-1.5">
                  <p className="font-medium">Font Size</p>
                  <p className="text-sm text-muted-foreground">Adjust the font size for better readability.</p>
                </div>
                <Slider id="font-size" min={12} max={20} step={2} defaultValue={[16]} aria-label="Font Size" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}

export default SettingPage