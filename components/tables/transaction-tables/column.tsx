'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { TransactionHistory } from '@/constants/data';
import { formatCurrency, formatDate } from '@/lib/formatter';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<TransactionHistory>[] = [
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
    accessorKey: 'transactionDate',
    header: 'DATE',
    cell: ({ row }) => {
      return formatDate(row.original.transactionDate);
    }
  },
  {
    accessorKey: 'id',
    header: 'TRANSACTION ID',
    cell: ({ row }) => {
      return row.original.id.toUpperCase().slice(0, 12);
    }
  },
  {
    accessorKey: 'type',
    header: 'TYPE'
  },
  {
    accessorKey: 'letterCode',
    header: 'LETTER CODE',
    cell: ({ row }) => {
      return row.original.letterCode.toUpperCase();
    }
  },
  {
    accessorKey: 'totalPrice',
    header: 'PRICE VALUE',
    cell: ({ row }) => {
      return formatCurrency(row.original.totalPrice)
    }
  },
  {
    accessorKey: 'supplier.name',
    header: 'SUPPLIER',
    cell: ({ row }) => {
      return row.original.supplier?.name ?? '-';
    }
  },
  {
    accessorKey: 'outlet.name',
    header: 'OUTLET',
    cell: ({ row }) => {
      return row.original.outlet?.name ?? '-';
    }
  },
  {
    id: 'actions',
    header: 'ACTION',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];