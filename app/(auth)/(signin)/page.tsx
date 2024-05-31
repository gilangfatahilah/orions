import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import UserAuthForm from '@/components/forms/user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { FlipWords } from '@/components/ui/flip-words';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Orion Stocks',
  description: 'Authentication forms built using the components.'
};

export default function AuthenticationPage() {
  const words = ["simple.", "accessible.", "reliable.", "accurate."];

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
        <div className="relative z-20 flex items-center gap-1 text-lg font-bold dark:text-neutral-200">
          <Image src={'/logo/logo-clear.svg'} alt={'Orion'} width={32} height={32} />
          Orion
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="text-5xl font-bold mx-auto text-neutral-200">
            Make it

            <FlipWords words={words} />

            <p className='text-base text-neutral-400 dark:text-muted-foreground font-normal mt-1'>
              Effortlessly Manage Inventory with Cutting-Edge Solutions.
            </p>

            <p className='text-xs font-normal mt-12'>
              This app was builded by
              <Link href={"https://gilangf.vercel.app"} className=" dark:text-neutral-200 hover:text-neutral-400" >
                {" "}Gilang Fatahilah
              </Link>
              .
            </p>
          </blockquote>
        </div>
      </div>

      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
