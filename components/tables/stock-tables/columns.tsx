'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Stock } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Stock>[] = [
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
          <AvatarImage src={row.original.item.image as string} alt={row.original.item.name} />
          <AvatarFallback> {row.original.item.name?.substring(0, 1).toUpperCase()} </AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    accessorKey: 'item.name',
    header: 'ITEM'
  },
  {
    accessorKey: 'prevQuantity',
    header: 'PREVIOUS'
  },
  {
    accessorKey: 'quantity',
    header: 'CURRENT'
  },
  {
    id: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      if (row.original.quantity <= 5 && row.original.quantity >= 1) { return (<Badge variant={'destructive'}>Low Stock</Badge>) }
      else if (row.original.quantity === 0) { return (<Badge variant={'destructive'}>Low Stock</Badge>) }
      else { return (<Badge>Available Stock</Badge>) }
    }
  }
];