'use client';
import * as z from 'zod';
import Link from 'next/link';
import FileUpload from '../file-upload';
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
import {
  Select,
  SelectLabel,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icons } from '../icons';
import { AlertModal } from '../modal/alert-modal';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';
import { createItem, updateItem, deleteItem } from '@/services/item.service';
import { getCategory } from '@/services/category.service';
import { NumericFormat } from 'react-number-format';

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Item Name must be at least 1 characters' }),
  price: z.coerce.number().gte(100),
  category: z.string({ message: 'You must select item category' }),
  image: z.string().nullable().optional(),
});

type ItemFormValues = z.infer<typeof formSchema>;

interface ItemFormProps {
  initialData?: {
    id: string;
    name: string;
    price: number;
    image?: string;
    categoryId: string;
  }
  user: string;
}

export const ItemForm = (
  { initialData, user }: ItemFormProps
) => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryOption, setCategoryOption] = useState<{ label: string, value: string }[]>();
  const title = initialData ? 'Edit Item' : 'Create Item';
  const description = initialData ? 'This action will update the item data, you can delete the item also by click the trash button.' : 'This action will add a new item, the new item will be invited via email that included in this form.';
  const action = initialData ? 'Save changes' : 'Create item';

  const renderPlaceholderWithIcon = (value?: string) => {
    const data = categoryOption?.find((option) => option.value === value);

    return (
      <div className="flex items-center gap-4">
        <Icons.category className="w-4 h-4 text-gray-400" />
        {
          value ? (
            <span>{data?.label}</span>
          ) : (
            <span className='text-gray-400'>Select a category</span>
          )
        }
      </div>
    )
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategory();
      setCategoryOption(categories?.map((category: any) => ({ label: category.name, value: category.id })));
    };

    fetchCategories();
  }, []);

  const defaultValues = initialData
    ? {
      name: initialData.name ?? "",
      price: initialData.price ?? 0,
      image: initialData.image ?? undefined,
      category: initialData.categoryId ?? undefined,
    }
    : {
      name: '',
      price: undefined,
      image: null,
      category: undefined,
    };

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ItemFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        const response = await updateItem(initialData.id, {
          name: data.name,
          price: Number(data.price),
          image: data.image ?? null,
          categoryId: data.category,
        }, user )

        if (response) {
          router.push('/dashboard/item');

          return toast({
            title: 'Success, item successfully updated.',
            description: `item successfully updated with new data.`,
          })
        }

        if (!response) {
          return toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'Something went wrong with your request, please check your connection and try again.',
          })
        }
      } else {
        const response = await createItem({
          name: data.name,
          price: Number(data.price),
          image: data.image ?? undefined,
          categoryId: data.category,
        }, user);

        if (!response) {
          return toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'Something went wrong with your request, please check your connection and try again.',
          })
        }

        router.push('/dashboard/item')
        return toast({
          title: 'Success, New item was added.',
          description: 'Create new item was done successfully.'
        });
      }
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

      const response = await deleteItem(initialData?.id as string, user);

      if (!response) {
        return toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.'
        });
      }

      router.push('/dashboard/item');
      return toast({
        title: "Success, item has been deleted."
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

  const formatNumber = (value: string) => {
    return value.replace(/,/g, '');
  };

  const handleChange = (event: string) => {
      const value = event.replace(/,/g, '');
    
      const formattedNumber =  formatNumber(value);
      return Number(formattedNumber)
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        description={`Are you sure you want to delete item ${initialData?.name}`}
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
          <div className='w-full grid md:grid-cols-4 gap-8'>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className='md:col-span-1'>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <FileUpload
                      onChange={field.onChange}
                      value={field.value}
                      onRemove={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-3 flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Icons.item className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Enter item name"
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Icons.dollar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <p className="absolute left-10 top-1/2 text-sm transform -translate-y-1/2" >
                          Rp
                        </p>

                        <NumericFormat
                          {...field}
                          thousandSeparator
                          value={field.value}
                          placeholder="Enter item price"
                          disabled={loading}
                          className='pl-[3.75rem]'
                          customInput={Input}
                          onChange={(e) => {
                            const value = handleChange(e.target.value);

                            field.onChange(value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value === '' ? undefined : field.value}
                      defaultValue={field.value === '' ? undefined : field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {field.value === '' ? renderPlaceholderWithIcon() : renderPlaceholderWithIcon(field.value)}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup className='px-2'>
                          <SelectLabel className='ml-2 mb-1 pb-1 text-base border-muted border-b-[1px] text-muted-foreground'>
                            Category
                          </SelectLabel>
                          {categoryOption?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

          </div>

          <div className='flex justify-end space-x-4'>
            <Link href={'/dashboard/item'}>
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
