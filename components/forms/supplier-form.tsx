'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertModal } from '../modal/alert-modal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Icons } from '../icons';
import { useToast } from '../ui/use-toast';
import { createSupplier, deleteSupplier, updateSupplier } from '@/services/supplier.service';
import Link from 'next/link';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Supplier name must have at least 1 character' }),
  address: z.string().min(1, { message: 'Supplier name must have at least 3 character' }),
  phone: z.string().min(10, 'Phone number must be at least 10 characters').max(16, 'Maximum phone number is 16 characters'),
  email: z.string().email({ message: 'Enter a valid email address' }).optional(),
});

type SupplierForms = z.infer<typeof formSchema>;

interface SupplierFormProps {
  initialData?: {
    id: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
  }
}

export const SupplierForm = (
  { initialData }: SupplierFormProps
) => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [stayForm, setStayForm] = useState<boolean>(true);
  const title = initialData ? 'Edit Supplier' : 'Create Supplier';
  const description = initialData ? 'This action will update the Supplier data, you can delete the Supplier also by click the trash button.' : 'This action will add a new Supplier.';
  const action = initialData ? 'Save changes' : 'Submit';

  const defaultValues = initialData
    ? {
      name: initialData.name ?? '',
      address: initialData.address ?? '-',
      phone: initialData.phone ?? '-',
      email: initialData.email ?? '-',
    }
    : {
      name: '',
      address: '',
      phone: '',
      email: '',
    };

  const form = useForm<SupplierForms>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: SupplierForms) => {
    try {
      setLoading(true);
      if (initialData) {
        const response = await updateSupplier(initialData.id,
          {
            name: data.name,
            address: data.address,
            phone: `+62${data.phone}`,
            email: data.email ?? undefined
          });

        if (!response) {
          return toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'Error when trying to update Supplier, please check your connection and try again.'
          })
        }

        router.push('/dashboard/supplier');
        return toast({
          title: 'Success!',
          description: 'Supplier has been updated successfully.'
        })
      }

      const response = await createSupplier(
        {
          name: data.name,
          address: data.address,
          phone: `+62${data.phone}`,
          email: data.email ?? undefined,
        });

      if (!response) {
        return toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'Error when trying to create Supplier, please check your connection and try again.'
        })
      }

      if (stayForm) router.push('/dashboard/supplier');

      return toast({
        title: 'Success!',
        description: 'Supplier has been created successfully.'
      })

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      const response = await deleteSupplier(initialData?.id as string);

      if (!response) {
        return toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.'
        });
      }

      router.push('/dashboard/supplier');
      return toast({
        title: "Success, supplier has been deleted."
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        description={`Are you sure you want to delete supplier ${initialData?.name}`}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Icons.trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col justify-between space-y-8"
        >
          <div className='w-full'>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Icons.pens className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter supplier name"
                        disabled={loading}
                        className='pl-10'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Icons.phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <p className="absolute left-10 top-1/2 text-sm transform -translate-y-1/2" >
                        +62
                      </p>

                      <Input
                        type="number"
                        placeholder="Enter supplier phone number"
                        disabled={loading}
                        className='pl-[4.5rem]'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel>Email <span className='text-[10px] ml-1 top-0 text-gray-400'>*optional</span></FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Icons.mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter supplier email"
                        disabled={loading}
                        className='pl-10'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Icons.mapPin className="absolute left-3 top-1/4 transform -translate-y-1/3 w-4 h-4 text-gray-400" />
                      <Textarea
                        placeholder="Enter supplier address"
                        disabled={loading}
                        className='pl-10'
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {
              !initialData && (<div className="flex justify-end items-center space-x-2 ml-1 mt-6">
                <Checkbox id="stayForm" className='w-4 h-4' onCheckedChange={() => setStayForm(!stayForm)} />
                <label
                  htmlFor="stayForm"
                  className="text-xs font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Stay on this form after submit.
                </label>
              </div>)
            }
          </div>

          <div className='flex justify-end space-x-4'>
            <Link href={'/dashboard/supplier'}>
              <Button disabled={loading} className="ml-auto" variant={'outline'} type="submit">
                Cancel
              </Button>
            </Link>

            {
              loading ? (
                <Button disabled={true} className="ml-auto" type="submit">
                  <Icons.spinner className="mr-2 w-4 h-4 animate-spin" /> Please wait
                </Button>
              ) : (
                <Button disabled={false} className="ml-auto" type="submit">
                  {action}
                </Button>
              )
            }
          </div>
        </form>
      </Form>
    </>
  );
};
