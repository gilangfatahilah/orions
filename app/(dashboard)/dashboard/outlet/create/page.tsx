import React from 'react'
import BreadCrumb from '@/components/breadcrumb';
import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import { SupplierForm } from '@/components/forms/supplier-form';

const AddCategoryPage = async () => {
  const breadcrumbItems = [
    { title: 'User', link: '/dashboard/category' },
    { title: 'Create', link: '/dashboard/category/create' }
  ];
  const session = await auth();
  const role = session?.user.role;

  if (role === 'Staff') {
    redirect('/not-found');
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <SupplierForm />
    </div>
  )
}

export default AddCategoryPage