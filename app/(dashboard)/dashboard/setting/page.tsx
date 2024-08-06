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

const breadcrumbItems = [{ title: 'Setting', link: '/dashboard/setting' }]

const SettingPage = async() => {
  const session = await auth();
  const user = session?.user;

  return (
    <ScrollArea className='h-full' >
      <div className="flex-1 space-y-4 p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className='flex items-center justify-between'>
          <Heading title='Setting' description='Customize your preferences and settings for a personalized experience' />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account details and preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={user?.name ?? '-'} />
                <p className="text-sm text-muted-foreground">
                  This is the name that will be displayed on your profile.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user?.email ?? '-'} disabled />
                <p className="text-sm text-muted-foreground">
                  This is the email address associated with your account.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" defaultValue="********" />
                <p className="text-sm text-muted-foreground">
                  Change your password to improve the security of your account.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Manage your privacy settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="flex items-center justify-between gap-4">
                <div className="grid gap-1.5">
                  <p className="font-medium">Share Usage Data</p>
                  <p className="text-sm text-muted-foreground">
                    Help us improve the application by sharing anonymous usage data.
                  </p>
                </div>
                <Switch id="share-usage-data" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="grid gap-1.5">
                  <p className="font-medium">Personalized Recommendations</p>
                  <p className="text-sm text-muted-foreground">
                    Receive personalized recommendations based on your activity.
                  </p>
                </div>
                <Switch id="personalized-recommendations" defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}

export default SettingPage