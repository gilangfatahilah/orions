'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { History } from '@/constants/data';
import { MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { deleteHistory } from '@/services/history.service';
import { useSession } from 'next-auth/react';

interface CellActionProps {
  data: History;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { data: session } = useSession();

  const router = useRouter();
  const { toast } = useToast();
  const isStaff = session?.user.role === 'Staff';
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await deleteHistory(data.id);

      toast({
        title: "Success, History has been deleted."
      })

      setOpen(false)
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Uh oh! Something went wrong.",
        description: "Sorry, failed to delete user please check your connection and try again.",
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      {
        !isStaff && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setOpen(true)}>
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    </>
  );
};
