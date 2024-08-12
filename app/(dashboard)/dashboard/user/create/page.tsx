import React from 'react'
import BreadCrumb from '@/components/breadcrumb';
import { UserForm } from '@/components/forms/user-form';
import { auth } from '@/auth'
import { redirect } from 'next/navigation';

interface Roles {
  role: 'Admin' | 'Manager' | 'Staff'
}

const AddUser = async () => {
  const breadcrumbItems = [
    { title: 'User', link: '/dashboard/user' },
    { title: 'Create', link: '/dashboard/user/new' }
  ];
  const session = await auth();
  const role = session?.user.role;
  const email = session?.user.email;
  const name = session?.user.name;

  if (role === 'Staff') {
    redirect('/not-found');
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <UserForm role={role as Roles['role']} sessionEmail={email as string} sessionUser={name as string} />
    </div>
  )
}

export default AddUser