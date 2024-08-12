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
import Link from 'next/link';
import { Employee } from '@/constants/data';
import { Edit, MoreHorizontal, Trash, Mails } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteUser } from '@/services/user.service';
import { useSession } from 'next-auth/react';

interface CellActionProps {
  data: Employee;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { data: session } = useSession();

  const router = useRouter();
  const isStaff = session?.user.role === 'Staff';
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await deleteUser(data.id, session?.user.name as string);

      toast.success("Success, user has been deleted.")

      setOpen(false)
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong', {
        description: 'there was a problem with your request.',
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

              <Link href={`/dashboard/user/${data.id}`}>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" /> Update
                </DropdownMenuItem>
              </Link>

              {
                data.joinedAt === null && (
                  <DropdownMenuItem>
                    <Mails className="mr-2 h-4 w-4" /> Resend Email
                  </DropdownMenuItem>
                )
              }

              <DropdownMenuItem className='text-red-600' onClick={() => setOpen(true)}>
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    </>
  );
};
