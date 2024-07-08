'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { History } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDate } from '@/lib/formatter';

export const columns: ColumnDef<History>[] = [
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
    accessorKey: 'field',
    header: 'FIELD'
  },
  {
    accessorKey: 'oldValue',
    header: 'FROM',
    cell: ({ row }) => {
      if (row.original.field === 'Price') {
        const formatCurrency = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        })
        const price = parseInt(row.original.oldValue)

        return formatCurrency.format(price);
      } else if (row.original.field === 'Image') {
        return (
          <Avatar>
            <AvatarImage src={row.original.oldValue} alt={row.original.field} />
            <AvatarFallback> {row.original.field?.substring(0, 1).toUpperCase()} </AvatarFallback>
          </Avatar>
        )
      }

      return row.original.oldValue;
    }
  },
  {
    accessorKey: 'newValue',
    header: 'TO',
    cell: ({ row }) => {
      if (row.original.field === 'Price') {
        const formatCurrency = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        })
        const price = parseInt(row.original.newValue)

        return formatCurrency.format(price);
      } else if (row.original.field === 'Image') {
        return (
          <Avatar>
            <AvatarImage src={row.original.newValue} alt={row.original.field} />
            <AvatarFallback> {row.original.field?.substring(0, 1).toUpperCase()} </AvatarFallback>
          </Avatar>
        )
      }

      return row.original.newValue;
    }
  },
  {
    accessorKey: 'modifiedBy',
    header: 'MODIFIED BY'
  },
  {
    accessorKey: 'createdAt',
    header: 'DATE',
    cell: ({ row }) => {
      return formatDate(row.original.createdAt);
    }
  },
  {
    id: 'actions',
    header: '•••',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];