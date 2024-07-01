'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '../ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { signOutAuth } from '@/services/auth.service';

import { LogOut, User2Icon, Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { AlertModal } from '../modal/alert-modal';

export function UserNav() {
  const { data: session } = useSession();
  const {toast} = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignOutClick = () => {
    setOpenDialog(true);
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);

      const response = await signOutAuth();

      if (response === undefined) {
        toast({
          title: 'Sign out success.',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    }finally {
      setLoading(false);
    }
  }

  if (!session) { return null };

  return (
    <>
  <AlertModal isOpen={openDialog} onClose={() => setOpenDialog(false)} onConfirm={handleSignOut} loading={loading} description='This action can not be undone, you will redirected to sign in page.' />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session.user?.image ?? ''}
                alt={session.user?.name ?? ''}
              />
              <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.role}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href={'/dashboard/profile'}>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut><User2Icon className='w-4 h-4' /></DropdownMenuShortcut>
            </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut><Settings className='w-4 h-4' /></DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOutClick}>
            Sign Out
            <DropdownMenuShortcut>
              <LogOut className='w-4 h-4' />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
