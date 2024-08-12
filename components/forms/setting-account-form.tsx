'use client'

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from "@/components/ui/input";
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { Icons } from '../icons';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertModal } from '../modal/alert-modal';
import * as z from 'zod';
import { send } from '@/services/auth.service';
import FileUpload from '../file-upload';
import { updateUserNoHistory } from '@/services/user.service';
import LoadingButton from '../ui/loadingButton';
import { useSession } from 'next-auth/react';

interface SettingAccountProps {
  id: string;
  userName: string;
  email: string;
  password: string;
  role: string;
  image?: string;
}

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name must be at least 1 character.' }),
  image: z.string().nullable(),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type SettingAccountFormValues = z.infer<typeof formSchema>;

const SettingAccountForm = ({ id, userName, email, image, password, role }: SettingAccountProps) => {
  const { data: session, update } = useSession();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [modal, setModal] = React.useState<{
    confirm: () => Promise<void>,
    description: string,
    variant: 'primary' | 'danger'
  }>({
    confirm: async () => { },
    description: '',
    variant: 'primary',
  });

  const defaultValues = React.useMemo(() => ({
    name: userName,
    image: image,
    password: '',
  }), [userName, image, password]);

  const form = useForm<SettingAccountFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const watchedName = form.watch('name');
  const watchedImage = form.watch('image');
  const watchedPassword = form.watch('password');

  const onSubmit = async (data: SettingAccountFormValues) => {
    try {
      setLoading(true);

      const body = {
        name: data.name,
        image: data.image,
      }

      const response = await updateUserNoHistory(id, body);

      if (response) {
        await update({
          user: {
            ...session?.user,
            ...body,
          }
        });

        toast.success('Success, your account has been updated.');
      }

    } catch (error) {
      toast.error('Something went wrong', {
        description: 'There was a problem, please try again.',
      })
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async () => {
    try {
      setLoading(true);
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const url = `${BASE_URL}/reset-password/${id}`;
      const subject = 'Reset your password';

      const response = send(email, userName, subject, url);

      await toast.promise(response, {
        loading: 'Sending verification email...',
        success: `Verification email was sent to ${email}, kindly check your email.`,
        error: 'Failed to send verification email, there was a problem with your request.'
      });

      setOpen(false);
    } catch (error) {
      toast.error('Something went wrong', {
        description: 'There was a problem, please try again.',
      })
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    setModal({
      confirm: onChangePassword,
      description: 'Are you sure you want to change your password ? ',
      variant: 'primary',
    });

    setOpen(true);
  };

  return (
    <>
      <AlertModal isOpen={open}
        description={modal.description}
        onConfirm={modal.confirm}
        onClose={() => setOpen(false)}
        loading={loading}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account details and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className='grid gap-2'>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem className='md:col-span-1'>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <FileUpload
                            onChange={field.onChange}
                            value={field.value}
                            onRemove={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Icons.user className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="text"
                              placeholder="Enter your name"
                              disabled={loading}
                              className='pl-10'
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <p className="text-sm text-muted-foreground">
                    This is the name that will be displayed on your profile.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className='relative'>
                    <Icons.mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="email" type="email" className='pl-10' value={email} disabled />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    This is your default email, contact administrator if you want to update it.
                  </p>
                </div>
                <div className="grid gap-2">
                  {
                    role === 'Admin' ? (
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className='relative'>
                                <Icons.lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  type="password"
                                  placeholder="Enter your password"
                                  disabled={loading}
                                  className='pl-10'
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) :
                      (
                        <>
                          <Label htmlFor="password">Password</Label>
                          <Button id="password" className='md:w-1/6' onClick={handleChangePassword}>
                            Reset password
                          </Button>
                        </>
                      )
                  }
                  <p className="text-sm text-muted-foreground">
                    Change your password to improve the security of your account.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-end'>
              <LoadingButton
                label='Save'
                loading={loading}
                disabled={watchedName === userName && watchedImage === image && watchedPassword === ''}
                className='w-full md:w-1/12 mt-4'
              />
            </CardFooter>
          </Card>

        </form>
      </Form>
    </>
  )
}

export default SettingAccountForm