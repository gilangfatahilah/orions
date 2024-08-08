'use client'
import * as React from "react"
import * as z from 'zod';
import * as bcrypt from 'bcryptjs';
import Link from "next/link"
import { useRouter } from "next/navigation";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from "@/components/ui/input"
import { Icons } from "../icons"
import {toast} from 'sonner';
import { resetPassword } from "@/services/auth.service";
import LoadingButton from "../ui/loadingButton";

const formSchema = z.object({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  confirmationPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  })
}).refine(data => data.password === data.confirmationPassword, {
  message: "Passwords doesn't match",
  path: ['confirmationPassword'],
});

type formData = z.infer<typeof formSchema>;

export const ResetPassword = ({ id }: { id: string }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);


  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmationPassword: '',
    }
  });

  const handleSubmit = async (data: formData) => {
    try {
      setLoading(true);

      const hashedPassword = await bcrypt.hash(data.password, 10)
      const response = await resetPassword(id, hashedPassword);

      if (response) {
        router.push('/')

        return toast.success('Success, your password has been updated successfully.')
      }

      if (!response) {
        return toast.error('Something went wrong', {
          description: 'There was a problem updating your password.'
        })
      }
    } catch (error) {
      toast.error('something went wrong', {
        description: 'There was a problem with your request'
      });
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <Icons.key className="mx-auto w-14 h-14 mb-3" />
        <CardTitle className="text-center">Set New Password</CardTitle>
        <CardDescription className="text-center">Enter your new password below to secure and get back to your account.</CardDescription>
      </CardHeader>
      <CardContent className="!pb-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full space-y-2"
          >
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
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Enter your password"
                        disabled={loading}
                        className="pl-10"
                        {...field}
                      />

                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                        {passwordVisible ? (
                          <Icons.eyeOff className="w-4 h-4" />
                        ) : (
                          <Icons.eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmationPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Icons.lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Confirm password"
                        disabled={loading}
                        className="pl-10"
                        {...field}
                      />

                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                        {passwordVisible ? (
                          <Icons.eyeOff className="w-4 h-4" />
                        ) : (
                          <Icons.eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton label='Set New Password' loading={loading} className="w-full mt-2" />

          </form>
        </Form>
      </CardContent>
      <CardFooter className="w-full mt-4">
        <p className="px-8 text-center text-sm text-muted-foreground">
          don&apos;t want to set password ?{' '}
          <Link
            href="/"
            className="underline underline-offset-4 hover:text-primary"
          >
            Click here
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  )
}
