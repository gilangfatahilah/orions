import React from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { getCategoryById } from '@/services/category.service';
import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import { CategoryForm } from '@/components/forms/category-form';

const EditCategoryPage = async ({ params }: { params: { id: string } }) => {
  const breadcrumbItems = [
    { title: 'Category', link: '/dashboard/category' },
    { title: 'Create', link: `/dashboard/category/${params.id}` }
  ];

  const session = await auth();
  const role =  session?.user.role

  if (role === 'Staff') {
    redirect('/not-found');
  }

  const initialData = await getCategoryById(params.id);

  const data = {
    id: initialData?.id ?? '',
    name: initialData?.name ?? 'unknown',
    code: initialData?.code ?? undefined,
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <CategoryForm initialData={data} user={session?.user.name as string}/>
    </div>
  )
}

export default EditCategoryPage;
