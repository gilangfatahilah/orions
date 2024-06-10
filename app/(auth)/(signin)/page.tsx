import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import UserAuthForm from '@/components/forms/user-auth-form';
import { ProfileCard } from '@/components/hover-card';
import { buttonVariants } from '@/components/ui/button';
import { FlipWords } from '@/components/ui/flip-words';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Orion',
  description: 'Authentication forms built using the components.'
};

export default function AuthenticationPage() {
  const words = ["Track", "Manage", "Thrive",];

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Login
      </Link>

      <div className="relative hidden h-full flex-col bg-auth-page p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-black opacity-65 dark:opacity-50" />

        <div className="relative z-20 my-auto">
          <blockquote className="text-[6rem] font-bold mx-auto leading-none text-neutral-200 drop-shadow-xl">
            <FlipWords words={words} />
              <br />your stock seamlessly anywhere.

            <p className='text-base tracking-tight leading-tight ml-4 text-neutral-400 dark:text-neutral-200 font-normal mt-10 w-9/12 text-justify'>
              Orion is a fast, accurate, and reliable inventory management app. With an intuitive interface, Orion ensures
              your inventory data is always current, reducing errors and enhancing efficiency. Simplify inventory control with orion.
            </p>

          </blockquote>
        </div>

        <div className="relative z-20 mt-auto ml-4 flex items-center gap-[2px]">
          <p className='text-xs font-normal'>
            Built and developed by
          </p>

          <ProfileCard />

        </div>
      </div>

      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Image src={'/logo/logo-clear.svg'} alt={'Orion'} width={36} height={36} className='mx-auto' />

            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back !
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign In to check and track your items stock growth.
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Forget your password ?{' '}
            <Link
              href="/forget-password"
              className="underline underline-offset-4 hover:text-primary"
            >
              Click here
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
