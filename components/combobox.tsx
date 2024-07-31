"use client"

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {  UseFormReturn } from "react-hook-form"

interface ComboboxProps {
  options: {
    label: string;
    value: string;
  }[],
  field: any;
  form: UseFormReturn<any>;
  name: string;
}

export function Combobox({ field, form, options, name }: Readonly<ComboboxProps>) {
  const handleSelect = (value: string) => {
    console.log('called');
    form.setValue(name, value);
    field.onChange(value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`w-full justify-between ${!field.value && "text-muted-foreground"}`}
        >
          {field.value
            ? options.find(option => option.value === field.value)?.label
            : `Select ${name}`}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search option..." className="h-9" />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  {option.label}
                  <CheckIcon
                    className={`ml-auto h-4 w-4 ${option.value === field.value ? "opacity-100" : "opacity-0"}`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
