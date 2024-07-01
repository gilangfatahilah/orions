import React from 'react'
import BreadCrumb from '@/components/breadcrumb';
import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import { ItemForm } from '@/components/forms/item-form';

const AddCategoryPage = async () => {
  const breadcrumbItems = [
    { title: 'Item', link: '/dashboard/item' },
    { title: 'Create', link: '/dashboard/item/create' }
  ];
  const session = await auth();
  const role = session?.user.role;

  if (role === 'Staff') {
    redirect('/not-found');
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <ItemForm />
    </div>
  )
}

export default AddCategoryPage