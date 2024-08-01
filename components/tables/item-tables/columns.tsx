'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Item } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Item>[] = [
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
    accessorKey: 'image',
    header: 'PHOTO',
    cell: ({ row }) => {
      return (
        <Avatar>
          <AvatarImage src={row.original.image as string} alt={row.original.name as string} />
          <AvatarFallback> {row.original.name?.substring(0, 1).toUpperCase()} </AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'NAME'
  },
  {
    accessorKey: 'category.name',
    header: 'CATEGORY',
    cell: ({row}) => {
      return (
        <Badge>
          {row.original.category?.name}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'price',
    header: 'PRICE',
    cell:({row}) => {
      const formatCurrency = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      })

      return formatCurrency.format(row.original.price)
    }
  },
  {
    id: 'actions',
    header: 'ACTION',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];