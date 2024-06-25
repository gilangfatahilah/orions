'use client';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { User } from '@/constants/data';
import { Checkbox } from '@/components/ui/checkbox';
import { auth } from '@/auth';

export const columns = async(): Promise<ColumnDef<User>[]> => {
  const session = await auth();
  const isStaff = session?.user.role === 'Staff';

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'name',
      header: 'NAME'
    },
    {
      accessorKey: 'company',
      header: 'COMPANY'
    },
    {
      accessorKey: 'role',
      header: 'ROLE'
    },
    {
      accessorKey: 'status',
      header: 'STATUS'
    },
    {
      id: 'actions',
      cell: ({ row }) => {isStaff ? '' : <CellAction data={row.original} />}
    }
  ];
} 
