import React from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { UserForm } from '@/components/forms/user-form';
import { getUserById } from '@/services/user.service';
import { auth } from '@/auth'
import { redirect } from 'next/navigation';

interface Roles {
  role: "Admin" | "Manager" | "Staff"
}

const EditUserPage = async ({ params }: { params: { id: string } }) => {
  const breadcrumbItems = [
    { title: 'User', link: '/dashboard/user' },
    { title: 'Create', link: `/dashboard/user/${params.id}` }
  ];

  const session = await auth();
  const role =  session?.user.role
  const name =  session?.user.name

  if (role === 'Staff') {
    redirect('/not-found');
  }

  const initialData = await getUserById(params.id);

  const data = {
    id: initialData?.id ?? '',
    email: initialData?.email ?? 'unknown',
    name: initialData?.name ?? 'unknown',
    role: initialData?.role ?? 'Staff',
    image: initialData?.image ?? 'unknown',
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <UserForm initialData={data} role={role as Roles['role']} sessionUser={name as string}/>
    </div>
  )
}

export default EditUserPage;
