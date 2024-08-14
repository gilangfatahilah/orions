'use client';

import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { toast } from 'sonner';
import { updateUserNoHistory } from '@/services/user.service';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ThemeOptions = () => {
  const { data: session, update } = useSession();
  const route = useRouter();

  const onSelectTheme = async (scheme: string) => {
    try {
      const body = {
        colorScheme: scheme,
      }

      const response = await updateUserNoHistory(session?.user.id!, body);

      if (response) {
        await update({
          user: {

            ...session?.user,
            ...body,
          }
        });

        route.refresh();
        toast.success('Success, New theme color was applied');
      }
    } catch (error) {
      toast.error("Failed to update user theme")
    }
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="grid gap-1.5">
        <p className="font-medium">Theme</p>
        <p className="text-sm text-muted-foreground">Choose the color theme for the application.</p>
      </div>
      <Select defaultValue={session?.user.colorScheme} onValueChange={(value) => onSelectTheme(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="theme-neutral">
            <div className='flex items-center gap-2'>
              <span className='w-4 h-4 bg-[#525252] border rounded-full' />
              <p>Neutral</p>
            </div>
          </SelectItem>
          <SelectItem value="theme-gray">
          <div className='flex items-center gap-2'>
              <span className='w-4 h-4 bg-[#4B5563] border rounded-full' />
              <p>Gray</p>
            </div>
          </SelectItem>
          <SelectItem value="theme-slate">
          <div className='flex items-center gap-2'>
              <span className='w-4 h-4 bg-[#475569] border rounded-full' />
              <p>Slate</p>
            </div>
          </SelectItem>
          <SelectItem value="theme-blue">
          <div className='flex items-center gap-2'>
              <span className='w-4 h-4 bg-[#3B82F6] border rounded-full' />
              <p>Blue</p>
            </div>
          </SelectItem>
          <SelectItem value="theme-red">
          <div className='flex items-center gap-2'>
              <span className='w-4 h-4 bg-[#DC2626] border rounded-full' />
              <p>Red</p>
            </div>
          </SelectItem>
          <SelectItem value="theme-orange">
          <div className='flex items-center gap-2'>
              <span className='w-4 h-4 bg-[#EA580C] border rounded-full' />
              <p>Orange</p>
            </div>
          </SelectItem>
          <SelectItem value="theme-green">
          <div className='flex items-center gap-2'>
              <span className='w-4 h-4 bg-[#22C55E] border rounded-full' />
              <p>Green</p>
            </div>
          </SelectItem>
          <SelectItem value="theme-yellow">
          <div className='flex items-center gap-2'>
              <span className='w-4 h-4 bg-[#FACC15] border rounded-full' />
              <p>Yellow</p>
            </div>
          </SelectItem>
          <SelectItem value="theme-violet">
          <div className='flex items-center gap-2'>
              <span className='w-4 h-4 bg-[#6D28D9] border rounded-full' />
              <p>Violet</p>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default ThemeOptions