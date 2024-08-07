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
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Icons } from '../icons';
import LoadingButton from '../ui/loadingButton';

const credentialSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  })
});

type credentialFormData = z.infer<typeof credentialSchema>;

export default function UserAuthForm() {
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
      toast.error('Invalid account !', {
        description: 'The account does not exist or has been removed.'
      })

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

      console.log(response);

      if (response?.error === 'Configuration' || response?.error === 'CredentialsSignin') {
        return toast.error('Invalid email or password !', {
          description: 'Please check your credentials and try again.'
        });
      }

      if (response?.status === 200 && response.error === null) {
        toast.success('Sign in success, welcome back!');
        router.push('/dashboard');

        return;
      }
    } catch (error) {
      toast.error('Something went wrong, There was a problem with your request.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signIn('google', { callbackUrl: '/dashboard' });

    } catch (error) {
      toast.error('Something went wrong !', {
        description: 'There was a problem with your request, please try again.'
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
          method='POST'
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

          <LoadingButton label="Continue" loading={loading} className='w-full' />

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
