'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { addDays, format } from 'date-fns';
import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { formatISO } from '@/lib/formatter'
import { DateRange } from 'react-day-picker';
import { Icons } from './icons';

interface CalendarProps {
  onSelectDate: ({ from, to }: { from: string, to: string }) => void;
}

export function CalendarDateRangePicker({ onSelectDate }: Readonly<CalendarProps>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [date, setDate] = React.useState<DateRange | undefined>();

  if (date?.from && date?.to) {
    onSelectDate({
      from: formatISO(date.from),
      to: formatISO(date.to)
    })
  }

  const resetValue = () => {
    setDate(undefined);

    const params = new URLSearchParams(searchParams);
    params.delete('startDate');
    params.delete('endDate');

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className='flex gap-2 flex-wrap'>

      {
        date?.to !== undefined && (
          <Button onClick={resetValue} variant={'ghost'} className='px-1'>
            <Icons.refresh className='w-6 h-6' />
          </Button>
        )
      }

      <div className={'grid gap-2'}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-auto flex-col space-y-2 p-2" align="end">
            <Select
              onValueChange={(value) =>
                setDate({
                  from: addDays(new Date(), parseInt(value)),
                  to: new Date(),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="-1">Tomorrow</SelectItem>
                <SelectItem value="-3">In 3 days</SelectItem>
                <SelectItem value="-7">In a week</SelectItem>
                <SelectItem value="-14">In 2 weeks</SelectItem>
                <SelectItem value="-30">In a month</SelectItem>
                <SelectItem value="-90">In 3 months</SelectItem>
              </SelectContent>
            </Select>

            <Calendar
              initialFocus
              mode="range"
              defaultMonth={addDays(new Date(), -30)}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
            />
          </PopoverContent>
        </Popover>
      </div>

    </div>
  );
}
