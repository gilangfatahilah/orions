'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { Icons } from '@/components/icons';
import React from 'react';
import DetailTransaction from "@/components/transaction-detail";
import { TransactionDetail } from "@/constants/data";
import { useReactToPrint } from 'react-to-print';

interface CellActionProps {
  data: TransactionDetail;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const detailRef = React.useRef(null);
  const { data: session } = useSession();
  const isStaff = session?.user.role === 'Staff';

  const handleDownload = useReactToPrint({
    documentTitle: 'Transaction Detail',
    content: () => detailRef.current,
  })

  return (
    !isStaff && (
      <Dialog>
        <DialogTrigger asChild>
          <Button size={'icon'} variant={'ghost'} info='Detail'>
            <Icons.info className='w-5 h-5' />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-8">
          <DialogHeader>
            <DialogTitle>Detail</DialogTitle>
          </DialogHeader>
              <DetailTransaction data={data} ref={detailRef} />
          <DialogFooter>
            <Button size="sm" onClick={handleDownload}>
              <Icons.download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  );
};
