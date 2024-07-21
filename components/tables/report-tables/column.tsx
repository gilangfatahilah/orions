'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Summary } from '@/constants/data';
import { formatCurrency, } from '@/lib/formatter';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Summary>[] = [
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
    accessorKey: 'itemName',
    header: 'ITEM',
  },
  {
    accessorKey: 'stockIn',
    header: 'STOCK IN',
  },
  {
    accessorKey: 'stockOut',
    header: 'STOCK Out',
  },
  {
    accessorKey: 'finalMonthUnit',
    header: 'FINAL STOCK'
  },
  {
    accessorKey: 'itemPrice',
    header: 'PRICE VALUE',
    cell: ({ row }) => {
      return formatCurrency(row.original.itemPrice);
    }
  },
  {
    id: 'totalPriceValue',
    header: 'TOTAL PRICE VALUE',
    cell: ({ row }) => {
      const totalPrice = row.original.itemPrice * row.original.finalMonthUnit
      return formatCurrency(totalPrice);
    }
  }
];