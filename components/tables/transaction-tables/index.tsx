'use client';

import React from 'react';
import { AlertModal } from '@/components/modal/alert-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { DataTable } from '@/components/ui/data-table';
import { Transaction } from '@/constants/data';
import { formatCurrency } from '@/lib/formatter';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TransactionTableProps {
  data: Transaction[];
  onRemoveRow: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

interface CellActionProps {
  data: Transaction;
  onDeleteRow: (id: string) => void;
  onUpdateRow: (id: string, quantity: number) => void;
}

const CellAction = ({ data, onDeleteRow, onUpdateRow }: CellActionProps) => {
  const [openDelete, setOpenDelete] = React.useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [quantity, setQuantity] = React.useState<number>(data.quantity);

  const handleUpdate = () => {
    onUpdateRow(data.id, quantity);
    setOpenUpdate(false);
  };

  const handleDelete = () => {
    onDeleteRow(data.id);
    setOpenDelete(false);
  };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        description={`Are you sure you want to remove ${data.name}`}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        loading={loading}
      />

      <Dialog open={openUpdate} onOpenChange={() => setOpenUpdate(!openUpdate)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit quantity</DialogTitle>
          </DialogHeader>
          <div>
            <Input type="number" onChange={(e) => setQuantity(Number(e.target.value))} value={quantity} />
          </div>
          <DialogFooter>
            <Button onClick={handleUpdate}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <Icons.moreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
            <Icons.pens className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem className='text-red-600' onClick={() => setOpenDelete(true)}>
            <Icons.trash className="mr-2 h-4 w-4" /> Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};


export const TransactionTable: React.FC<TransactionTableProps> = ({ data, onUpdateQuantity, onRemoveRow }) => {

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'image',
      header: 'PHOTO',
      cell: ({ row }) => {
        return (
          <Avatar>
            <AvatarImage src={row.original.image as string} alt={row.original.name} />
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
      accessorKey: 'quantity',
      header: 'QUANTITY',
    },
    {
      accessorKey: 'pricePerItem',
      header: 'PRICE PER ITEM',
      cell: ({ row }) => {
        return formatCurrency(row.original.pricePerItem);
      }
    },
    {
      accessorKey: 'priceFinal',
      header: 'TOTAL PRICE',
      cell: ({ row }) => {
        return formatCurrency(row.original.priceFinal);
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => <CellAction data={row.original} onDeleteRow={onRemoveRow} onUpdateRow={onUpdateQuantity} />
    }
  ];

  return (
    <div className='w-full h-full mt-2'>
      <DataTable columns={columns} data={data} />
    </div>
  );
};
