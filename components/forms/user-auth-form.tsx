'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '../ui/use-toast';
import { Icons } from '../icons';

const credentialSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  })
});

type credentialFormData = z.infer<typeof credentialSchema>;

export default function UserAuthForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const credentialForm = useForm<credentialFormData>({
    resolver: zodResolver(credentialSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Hmm… that google account doesn\'t look valid'
      });

      router.push('/');
    }
  }, [searchParams, toast, router]);

  const handleCredentialSubmit = async (data: credentialFormData) => {
    const { email, password } = data;

    try {
      setLoading(true);
      const response = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (response?.error === 'Configuration' || response?.error === 'Credentials') {
        return toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'Invalid email or password, please check your email or password and try again.'
        });
      }

      if (response?.status === 200 && response.ok) {
        toast({
          title: 'Sign in successful.'
        });

        router.push('/dashboard');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signIn('google', {callbackUrl: '/dashboard'});
      
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <Form {...credentialForm}>
        <form
          onSubmit={credentialForm.handleSubmit(handleCredentialSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={credentialForm.control}
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

          <FormField
            control={credentialForm.control}
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

          {loading ? (
            <Button disabled={true} className="ml-auto w-full mt-4" type="submit">
              <Icons.spinner className="mr-2 w-4 h-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button className="ml-auto w-full mt-4" type="submit">
              Continue
            </Button>
          )}

        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        className="w-full"
        variant="outline"
        type="button"
        disabled={loading}
        onClick={handleGoogleSignIn}
      >
        <Image src={'/logo/google.svg'} alt={'google-logo'} width={14} height={14} className="mr-2" />
        Continue with Google
      </Button>
    </>
  );
}
