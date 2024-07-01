import React from 'react'
import BreadCrumb from '@/components/breadcrumb';
import { UserForm } from '@/components/forms/user-form';
import { auth } from '@/auth'
import { redirect } from 'next/navigation';

const AddUser = async () => {
  const breadcrumbItems = [
    { title: 'User', link: '/dashboard/user' },
    { title: 'Create', link: '/dashboard/user/new' }
  ];
  const session = await auth();
  const role = session?.user.role;
  const email = session?.user.email;

  if (role === 'Staff') {
    redirect('/not-found');
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <UserForm role={role as string} sessionEmail={email as string} />
    </div>
  )
}

export default AddUser