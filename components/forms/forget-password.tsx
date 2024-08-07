'use client';
import * as React from "react";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
  FormLabel,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "../icons";
import Link from "next/link";
import { send } from "@/services/auth.service";
import { getUserByEmail } from "@/services/user.service";
import { toast } from 'sonner';
import LoadingButton from "../ui/loadingButton";

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
});

type formData = z.infer<typeof formSchema>;

export const ForgetPassword = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>('');
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const form = useForm<formData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    }
  });

  const sendEmail = async (email: string) => {
    try {
      setLoading(true);
      const emailExist = await getUserByEmail(email);
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

      if (!emailExist) {
        toast.error('Something went wrong', { description: `email doesn't exist.` })
        return;
      }

      const name = emailExist.name ?? 'Unknown user';
      const subject = "Get Back To Your Account";
      const url = `${BASE_URL}/reset-password/${emailExist.id}`;

      const sendMailPromise = send(email, name, subject, url);

      await toast.promise(sendMailPromise, {
        loading: 'Sending verification email...',
        success: `Verification email was sent to ${email}`,
        error: 'Failed to send verification email. There was a problem with your request.',
      });

      const response = await sendMailPromise;

      if (response.accepted.length) setSubmitted(true);
    } catch (error) {
      toast.error('Something went wrong', { description: 'there was a with your request' })
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: formData) => {
    setEmail(data.email);
    await sendEmail(data.email);
  };

  const handleResend = async () => {
    await sendEmail(email);
  };

  return (
    <>
      {!submitted && (
        <Card className="w-[400px]">
          <CardHeader>
            <Icons.lock className="mx-auto w-14 h-14 mb-3" />
            <CardTitle className="text-center">Reset your password</CardTitle>
            <CardDescription className="text-center">Enter your email and we&apos;ll help you reset it in a snap. Security made simple.</CardDescription>
          </CardHeader>
          <CardContent className="!pb-0">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Icons.mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="email"
                            placeholder="Enter your email"
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

                <LoadingButton label="Send Verification Link" loading={loading} className="w-full" />

              </form>
            </Form>
          </CardContent>
          <CardFooter className="w-full mt-2">
            <Link className="w-full" href={'/'}>
              <Button disabled={loading} className="w-full" variant="outline"><Icons.arrowLeft className="text-xs mr-2" /> Back to home</Button>
            </Link>
          </CardFooter>
        </Card>
      )}

      {submitted && (
        <Card className="w-[400px]">
          <CardHeader>
            <Icons.mail className="mx-auto w-14 h-14 mb-3" />
            <CardTitle className="text-center">Check your email</CardTitle>
            <CardDescription className="text-center">We have sent password reset link to {email}.</CardDescription>
          </CardHeader>
          <CardContent className="!pb-0">
            <Link href={'mailto:'}>
              <Button disabled={loading} className="w-full">Open email app</Button>
            </Link>
          </CardContent>
          <CardFooter className="w-full flex flex-col gap-2 mt-4">
            <p className="px-8 mb-2 text-center text-sm text-muted-foreground">
              Didn&apos;t receive an email? {" "}
              <button
                disabled={loading}
                onClick={handleResend}
                className="underline underline-offset-4 hover:text-primary cursor-pointer"
              >
                Click to resend
              </button>
            </p>

            <Link className="w-full" href={'/'}>
              <Button disabled={loading} className="w-full" variant="outline"><Icons.arrowLeft className="text-xs mr-2" /> Back to home</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </>
  );
};
