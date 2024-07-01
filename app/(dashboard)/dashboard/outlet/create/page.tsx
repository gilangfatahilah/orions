import React from 'react'
import BreadCrumb from '@/components/breadcrumb';
import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import { OutletForm } from '@/components/forms/outlet-form';

const AddCategoryPage = async () => {
  const breadcrumbItems = [
    { title: 'Outlet', link: '/dashboard/outlet' },
    { title: 'Create', link: '/dashboard/outlet/create' }
  ];
  const session = await auth();
  const role = session?.user.role;

  if (role === 'Staff') {
    redirect('/not-found');
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <OutletForm />
    </div>
  )
}

export default AddCategoryPage