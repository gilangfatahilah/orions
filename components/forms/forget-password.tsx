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
import { useToast } from "../ui/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
});

type formData = z.infer<typeof formSchema>;

export const ForgetPassword = () => {
  const { toast } = useToast();
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
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong',
          description: 'Hmmm... that email doesn\'t look valid, please check your email and try again.'
        });
        return;
      }

      const name = emailExist.name ?? 'Unknown user';
      const subject = "Get Back To Your Account";
      const url = `${BASE_URL}/reset-password/${emailExist.id}`;

      const response = await send(email, name, subject, url);

      if (response.accepted.length) {
        setSubmitted(true);
        toast({
          title: 'Success, verification email sent successfully.',
          description: 'Please click the verification link we sent you via email and don\'t forget to check your spam folder.'
        });
        return;
      }

      if (!response) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request, please check your connection and try again.'
        });
        return;
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request, please check your connection and try again.'
      });
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

                {loading ? (
                  <Button disabled className="ml-auto w-full" type="submit">
                    <Icons.spinner className="mr-2 w-4 h-4 animate-spin" /> Please wait
                  </Button>
                ) : (
                  <Button className="ml-auto w-full" type="submit">
                    Send Verification Link
                  </Button>
                )}
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
