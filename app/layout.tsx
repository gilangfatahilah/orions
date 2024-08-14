import Pwa from '@/components/pwa';
import Providers from '@/components/layout/providers';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';
import { auth } from '@/auth';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import '@uploadthing/react/styles.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Orion',
  description: 'An inventory web application to simplify tracking your stock.',
  keywords: ["orion", "next js", "inventory", "web app"],
  generator: 'Next.js',
  manifest: '/manifest.json',
  authors: [
    {
      name: "Gilang Fatahilah",
      url: "https://gilanqf.vercel.app",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "/logo/orion-192.png" },
    { rel: "icon", url: "/logo/orion-192.png" },
  ],
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden ${session?.user.colorScheme ?? 'theme-neutral'}`}>
        <NextTopLoader color='#2761D9' showSpinner={false} />
        <Providers session={session}>
          {children}
          <Toaster expand={true} richColors />
        </Providers>
        <Pwa />
      </body>
    </html>
  );
}
