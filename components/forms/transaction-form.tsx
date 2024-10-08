'use client'

import React from 'react';
import { Input } from '../ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectLabel,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { zodResolver } from '@hookform/resolvers/zod';
import { Icons } from '../icons';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { sendNotification } from '@/services/notification.service';
import { createTransaction, TransactionParams } from '@/services/transaction.service';
import * as z from 'zod';
import { getItemById, getItems } from '@/services/item.service';
import { cn } from '@/utils/cn';
import { Calendar } from '../ui/calendar';
import { formatDate } from '@/lib/formatter';
import { getSuppliers } from '@/services/supplier.service';
import { getOutlets } from '@/services/outlet.service';
import { Transaction } from '@/constants/data';
import { TransactionTable } from '../tables/transaction-tables/form-table';
import { Combobox } from '../combobox';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Checkbox } from '../ui/checkbox';

interface TransactionFormProps {
  user: {
    id: string;
    name: string;
  }
}

interface ItemStock {
  id: string;
  stock: number;
}

interface Option {
  label: string;
  value: string;
}

const formSchema = z.object({
  type: z.enum(["ISSUING", "RECEIVING"]),
  supplier: z.string().optional(),
  outlet: z.string().optional(),
  letter: z.string().min(6, 'Transaction letter code must have at least 6 characters'),
  quantity: z.number().optional().or(z.nan()).transform((val) => val || 0), transactionDate: z.date(),
  item: z.string().optional().refine(value => value !== undefined, {
    message: 'Item is required'
  }),
}).superRefine((data, ctx) => {
  if (data.type === 'RECEIVING' && !data.supplier) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['supplier'],
      message: "Supplier is required when type is RECEIVING",
    });
  }
  if (data.type === 'ISSUING' && !data.outlet) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['outlet'],
      message: "Outlet is required when type is ISSUING",
    });
  }
});

type TransactionFormValues = z.infer<typeof formSchema>

const TransactionForm = ({ user }: TransactionFormProps) => {
  const { data: session } = useSession();

  const defaultValues: TransactionFormValues = {
    type: 'RECEIVING',
    supplier: '',
    item: '',
    letter: '',
    outlet: '',
    quantity: 0,
    transactionDate: new Date(),
  };

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const router = useRouter();
  const watchedItem = form.watch('item');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [items, setItems] = React.useState<Option[]>([]);
  const [suppliers, setSuppliers] = React.useState<Option[]>([]);
  const [outlets, setOutlets] = React.useState<Option[]>([]);
  const [itemList, setItemList] = React.useState<Transaction[]>([]);
  const [itemStock, setItemStock] = React.useState<ItemStock[]>([]);
  const [stayForm, setStayForm] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);

      const itemData = await getItems();
      const supplierData = await getSuppliers();
      const outletData = await getOutlets();

      if (itemData?.length && supplierData?.length && outletData?.length) {
        const itemsToAssign = itemData?.map((item: Record<string, any>) => ({
          label: item.name,
          value: item.id,
        }));

        const stockToAssign = itemData.map((item: Record<string, any>) => ({
          id: item.id,
          stock: item.stock?.quantity ?? 0,
        }));

        const suppliersToAssign = supplierData.map((supplier) => ({
          label: supplier.name,
          value: supplier.id,
        }));

        const outletsToAssign = outletData.map((outlet) => ({
          label: outlet.name,
          value: outlet.id,
        }));

        setItems(itemsToAssign);
        setItemStock(stockToAssign);
        setSuppliers(suppliersToAssign);
        setOutlets(outletsToAssign);

        setLoading(false);
      }
    }

    fetchOptions();
  }, []);


  const renderPlaceholderWithIcon = (input: 'type' | 'item' | 'supplier' | 'outlet', value?: string) => {
    let valueToRender;

    if (input === 'item') {
      valueToRender = items?.find((item) => item.value === value)?.label
    } else if (input === 'supplier') {
      valueToRender = suppliers.find((supplier) => supplier.value === value)?.label
    } else {
      valueToRender = outlets.find((outlet) => outlet.value === value)?.label
    }

    return (
      <div className='flex items-center gap-4'>
        {input === 'type' ? (
          <>
            <Icons.transaction className='w-4 h-4' />
            <span>{value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : ''}</span>
          </>
        ) : input === 'item' ? (
          <>
            <Icons.item className='w-4 h-4' />
            <span>{valueToRender ?? 'Select item'}</span>
          </>
        ) : input === 'supplier' ? (
          <>
            <Icons.supplier className='w-4 h-4' />
            <span>{valueToRender ?? 'Select supplier'}</span>
          </>
        ) : (
          <>
            <Icons.outlet className='w-4 h-4' />
            <span>{valueToRender ?? 'Select outlet'}</span>
          </>
        )}
      </div>
    );
  }

  const onAddItem = async () => {
    try {
      const itemId = form.watch('item');
      const itemQuantity = form.watch('quantity');
      const transactionType = form.watch('type');

      const selectedItem = await getItemById(itemId as string);
      const stockData = itemStock.find(stock => stock.id === itemId);

      const errorToast = () => {
        return toast.error('Failed to add item', {
          description: 'The quantity exceeds the available stock',
        });
      }

      if (itemQuantity === 0) {
        errorToast();
        return;
      }

      if (transactionType === 'ISSUING' && stockData && itemQuantity > stockData.stock) {
        errorToast();
        return;
      }

      if (selectedItem) {
        const itemEqual = itemList.find((item) => item.id === selectedItem.id);

        if (itemEqual) {
          const updatedItemList = itemList.map((item) =>
            item.id === itemEqual.id
              ? {
                ...item,
                quantity: Number(item.quantity) + Number(itemQuantity),
                priceFinal: (item.quantity + Number(itemQuantity)) * item.pricePerItem,
              }
              : item
          );

          setItemList(updatedItemList);
        } else {
          setItemList([
            ...itemList,
            {
              id: selectedItem.id,
              name: selectedItem.name,
              quantity: Number(itemQuantity),
              image: selectedItem.image as string,
              pricePerItem: selectedItem.price,
              priceFinal: Number(itemQuantity) * selectedItem.price,
            }
          ]);
        }
      }
    } catch (error) {
      toast.error('Something went wrong', {
        description: 'there was a problem with your request.',
      })
    }
  };

  const onUpdateQuantity = (id: string, value: number): void => {
    const itemTarget = itemList.find(item => item.id === id);

    if (itemTarget) {
      const updatedItemList = itemList.map((item) =>
        item.id === itemTarget.id
          ? {
            ...item,
            quantity: Number(value),
            priceFinal: Number(value) * item.pricePerItem,
          }
          : item
      );

      setItemList(updatedItemList);
    }

  }

  const onRemoveItem = (id: string) => {
    const itemTarget = itemList.find(item => item.id === id);

    if (itemTarget) {
      const updatedItemList = itemList.filter((item) =>
        item.id !== id
      )
      setItemList(updatedItemList);
    }
  }

  const handleSubmit = async (data: TransactionFormValues) => {
    try {
      setLoading(true);

      const totalPriceItem = itemList.map((item) => item.priceFinal);
      const totalPrices = totalPriceItem.reduce((acc, cur) => acc + cur, 0)

      const dataToAssign: TransactionParams = {
        type: data.type,
        supplierId: data.type === 'RECEIVING' ? data.supplier : undefined,
        outletId: data.type === 'ISSUING' ? data.outlet : undefined,
        letterCode: data.letter,
        userId: user.id,
        user: user.name,
        total: totalPrices,
        date: data.transactionDate,
        items: itemList.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        }))
      }

      const createPromise = createTransaction(dataToAssign);

      await toast.promise(createPromise, {
        loading: "Create transaction...",
        success: "Success, Transaction created successfully.",
        error: "Error creating transaction",
      });

      const response = await createPromise;

      if (response) {
        
        await sendNotification(
          "Just added new transaction",
          session?.user.image ?? 'https://utfs.io/f/5de801e3-2397-4b3a-9be3-08a53e3ddbb9-lwrhgx.png',
          session?.user.name as string,
        );

        if (!stayForm) return router.push('/dashboard/transaction'); 
      }

    } catch (error) {
      // @ts-ignore
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full flex flex-col justify-between space-y-8'>

        <div className='w-full md:grid md:grid-cols-4 gap-8'>
          <div className='col-span-2 flex flex-col gap-4'>
            <FormField
              control={form.control}
              name="transactionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Date</FormLabel>
                  <Popover>
                    <PopoverTrigger disabled={loading} asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <Icons.calendar className="mr-2 h-4 w-4" />
                        {field.value ? formatDate(field.value) : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {renderPlaceholderWithIcon('type', field.value)}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup className='px-2'>
                        <SelectLabel className='ml-2 mb-1 pb-1 text-base border-muted border-b-[1px] text-muted-foreground'>
                          Select transaction type
                        </SelectLabel>
                        <SelectItem value='RECEIVING'>
                          Receiving
                        </SelectItem>
                        <SelectItem value='ISSUING'>
                          Issuing
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {
              form.watch('type') === 'RECEIVING' && (
                <FormField
                  control={form.control}
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <Combobox
                        options={suppliers}
                        field={field}
                        form={form}
                        name="supplier"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            }

            {
              form.watch('type') === 'ISSUING' && (
                <FormField
                  control={form.control}
                  name="outlet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Outlet</FormLabel>
                      <Combobox
                        options={outlets}
                        field={field}
                        form={form}
                        name="outlet"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            }

            <FormField
              control={form.control}
              name="letter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Letter Code</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Icons.pens className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Enter transaction letter code"
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
              name='item'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item</FormLabel>
                  <Combobox
                    options={items}
                    field={field}
                    form={form}
                    name="item"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Icons.numberUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                      <Input
                        type="number"
                        placeholder="Enter item quantity"
                        disabled={loading || form.watch('item') === ''}
                        className='pl-10'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            {
              watchedItem && watchedItem.length > 0 && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    onAddItem();
                  }}
                  disabled={loading}
                  variant={'outline'}
                >
                  Add item
                </Button>
              )
            }
          </div>

          <div className='w-full grid grid-rows-3 col-span-2'>
            <div className='row-span-2'>
              <div className='w-full flex justify-between items-center'>

              <FormLabel>List item</FormLabel>

              <Button size='icon' onClick={() => form.reset()}>
                <Icons.refresh className='w-4 h-4' />
              </Button>
              </div>

              <TransactionTable data={itemList} onUpdateQuantity={onUpdateQuantity} onRemoveRow={onRemoveItem} />
            </div>

            <div className="flex justify-end items-center space-x-2 ml-1 mt-6 self-end">
              <Checkbox id="stayForm" className='w-4 h-4' onCheckedChange={() => setStayForm(!stayForm)} />
              <label
                htmlFor="stayForm"
                className="text-xs font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Stay on this form after submit.
              </label>
            </div>

            <div className='row-span-1 flex gap-2 justify-end items-end mt-4'>
              <Button className='w-full md:w-1/5' variant={'outline'} onClick={() => router.back()}>
                Cancel
              </Button>

              <Button className='w-full md:w-1/5' type='submit'>
                Submit
              </Button>
            </div>
          </div>
        </div>

      </form>
    </Form>
  )
}

export default TransactionForm