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
import { createCategory, deleteCategory, updateCategory } from '@/services/category.service';
import Link from 'next/link';
import { Checkbox } from '../ui/checkbox';

export const IMG_MAX_LIMIT = 1;
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Category name must have at least 1 character' }),
  code: z.string().optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData?: {
    id: string;
    name: string;
    code?: string;
  }
  user: string
}

export const CategoryForm = (
  { initialData, user }: CategoryFormProps
) => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [stayForm, setStayForm] = useState<boolean>(true);
  const title = initialData ? 'Edit Category' : 'Create Category';
  const description = initialData ? 'This action will update the Category data, you can delete the Category also by click the trash button.' : 'This action will add a new Category.';
  const action = initialData ? 'Save changes' : 'Submit';

  const defaultValues = initialData
    ? {
      name: initialData.name ?? '',
      code: initialData.code ?? '-',
    }
    : {
      name: '',
      code: ''
    };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        const response = await updateCategory(initialData.id, { name: data.name, code: data.code ?? undefined }, user);

        if (!response) {
          return toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'Error when trying to create category, please check your connection and try again.'
          })
        }

        router.push('/dashboard/category');
        return toast({
          title: 'Success!',
          description: 'Category has been updated successfully.'
        })
      }

      const response = await createCategory({ name: data.name, code: data.code ?? undefined }, user);

      if (!response) {
        return toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'Error when trying to create category, please check your connection and try again.'
        })
      }

      if(stayForm) router.push('/dashboard/category');

      return toast({
        title: 'Success!',
        description: 'Category has been created successfully.'
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

      const response = await deleteCategory(initialData?.id as string, user);

      if (!response) {
        return toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.'
        });
      }

      router.push('/dashboard/category');
      return toast({
        title: "Success, category has been deleted."
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
        description={`Are you sure you want to delete category ${initialData?.name}`}
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
                        placeholder="Enter category name"
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
              name="code"
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel>Code <span className='text-[10px] ml-1 top-0 text-gray-400'>*optional</span></FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Icons.asterisk className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter category code"
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
                <Checkbox id="stayForm" className='w-4 h-4' onCheckedChange={() =>  setStayForm(!stayForm)} />
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
            <Link href={'/dashboard/category'}>
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
