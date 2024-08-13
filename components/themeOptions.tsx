'use client';

import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { useTheme } from 'next-themes';

const ThemeOptions = () => {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="grid gap-1.5">
        <p className="font-medium">Theme</p>
        <p className="text-sm text-muted-foreground">Choose the color theme for the application.</p>
      </div>
      <Select onValueChange={(value) => setTheme(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default ThemeOptions