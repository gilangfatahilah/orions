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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import FileUpload from '../file-upload';
import { toast } from 'sonner'
import { createUser, updateUser, deleteUser } from '@/services/user.service';
import { sendInvitationMail } from '@/services/auth.service';
import Link from 'next/link';
import LoadingButton from '../ui/loadingButton';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  name: z
    .string()
    .min(5, { message: 'Product Name must be at least 5 characters' }),
  image: z.string().nullable(),
  role: z.enum(["Admin", "Manager", "Staff"])
});

type ProductFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  initialData?: {
    id: string;
    name: string | null;
    email: string;
    role: "Admin" | "Manager" | "Staff";
    image: string | null;
  }
  role: "Admin" | "Manager" | "Staff";
  sessionEmail?: string;
  sessionUser: string;
}

export const UserForm = (
  { initialData, role, sessionEmail, sessionUser }: UserFormProps
) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Edit User' : 'Create User';
  const description = initialData ? 'This action will update the user data, you can delete the user also by click the trash button.' : 'This action will add a new user, the new user will be invited via email that included in this form.';
  const action = initialData ? 'Save changes' : 'Create user';

  const defaultValues = initialData
  ? {
      name: initialData.name ?? '',
      email: initialData.email,
      image: initialData.image === 'unknown' ? null : initialData.image,
      role: initialData.role,
    }
  : {
      name: '',
      email: '',
      image: null,
      role: 'Staff' as "Admin" | "Manager" | "Staff",
    };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
      const image = data.image ?? null;

      const actionPromise = initialData
        ? await updateUser(initialData.id, {
          email: data.email,
          name: data.name,
          role: data.role,
          image: data.image ?? null,
        }, sessionUser)
        : await createUser({
          email: data.email,
          name: data.name,
          role: data.role,
          image: image as string,
        }, sessionUser);

      if (actionPromise) {
        toast.success(`Success, user has been ${initialData ? 'updated' : 'created'} successfully`)
      }

      if (!initialData) {
        const email = data.email;
        const name = data.name;
        const subject = 'Invitation user on Orion';
        const role = data.role;
        const userImage = data.image ?? undefined;
        const url = `${BASE_URL}/reset-password/${actionPromise?.id}`;

        const sendMailPromise = sendInvitationMail(email, name, subject, role, sessionEmail as string, url, userImage);

        await toast.promise(sendMailPromise, {
          loading: 'Sending invitation email...',
          success: `Invitation email was sent to ${data.email}`,
          error: 'Failed to send invitation email. There was a problem with your request.',
        });

        const sendMailResponse = await sendMailPromise;

        if (sendMailResponse.accepted.length) {
          router.push('/dashboard/user');
        } else {
          throw new Error('Email not accepted');
        }
      } else {
        router.push('/dashboard/user');
      }
    } catch (error: any) {
      toast.error('Something went wrong!', {
        description: 'There was a problem, Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      const response = await deleteUser(initialData?.id as string, sessionUser);

      if (!response) {
        return toast.error('Something went wrong', {
          description: 'There was a problem, Please try again.',
        })
      }

      router.push('/dashboard/user');
      return toast.success('Success !', {
        description: 'User has been deleted.'
      })
    } catch (error) {
      toast.error('Something went wrong!', {
        description: 'There was a problem, please try again.',
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
        onConfirm={onDelete as () => Promise<void>}
        loading={loading}
        description={`Are you sure you want to delete user ${initialData?.name}`}
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Icons.mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Enter user email"
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Icons.user className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Enter user name"
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {field.value}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <>
                          {
                            role === 'Manager' && (
                              <SelectGroup className='px-2'>
                                <SelectLabel className='ml-2 mb-1 pb-1 text-base border-muted border-b-[1px] text-muted-foreground'>Role</SelectLabel>
                                <SelectItem value='Staff'>
                                  Staff
                                </SelectItem>
                              </SelectGroup>
                            )
                          }
                          {
                            role === 'Admin' && (
                              <SelectGroup className='px-2'>
                                <SelectLabel className='ml-2 mb-1 pb-1 text-base border-muted border-b-[1px] text-muted-foreground'>Role</SelectLabel>
                                <SelectItem value='Admin'>
                                  Admin
                                </SelectItem>
                                <SelectItem value='Manager'>
                                  Manager
                                </SelectItem>
                                <SelectItem value='Staff'>
                                  Staff
                                </SelectItem>
                              </SelectGroup>
                            )
                          }
                        </>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

          </div>

          <div className='flex justify-end space-x-4'>
            <Link href={'/dashboard/user'}>
              <Button disabled={loading} className="ml-auto" variant={'outline'} type="submit">
                Cancel
              </Button>
            </Link>

            <LoadingButton label={action} loading={loading} />

          </div>
        </form>
      </Form>
    </>
  );
};
