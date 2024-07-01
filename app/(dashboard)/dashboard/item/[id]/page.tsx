import React from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { getItemById } from '@/services/item.service';
import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import { ItemForm } from '@/components/forms/item-form';

const EditSupplierPage = async ({ params }: { params: { id: string } }) => {
  const breadcrumbItems = [
    { title: 'Item', link: '/dashboard/item' },
    { title: 'Update', link: `/dashboard/item/${params.id}` }
  ];

  const session = await auth();
  const role =  session?.user.role

  if (role === 'Staff') {
    redirect('/not-found');
  }

  const initialData = await getItemById(params.id);

  const data = {
    id: initialData?.id ?? '',
    name: initialData?.name ?? '',
    price: initialData?.price ?? 0,
    image: initialData?.image ?? undefined,
    categoryId: initialData?.categoryId ?? '',
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <ItemForm initialData={data}/>
    </div>
  )
}

export default EditSupplierPage;
