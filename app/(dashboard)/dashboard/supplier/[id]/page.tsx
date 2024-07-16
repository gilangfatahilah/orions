import React from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { getSupplierById } from '@/services/supplier.service';
import { auth } from '@/auth'
import { redirect } from 'next/navigation';
import { SupplierForm } from '@/components/forms/supplier-form';

const EditSupplierPage = async ({ params }: { params: { id: string } }) => {
  const breadcrumbItems = [
    { title: 'Supplier', link: '/dashboard/supplier' },
    { title: 'Update', link: `/dashboard/supplier/${params.id}` }
  ];

  const session = await auth();
  const role =  session?.user.role

  if (role === 'Staff') {
    redirect('/not-found');
  }

  const initialData = await getSupplierById(params.id);

  const data = {
    id: initialData?.id ?? '',
    name: initialData?.name ?? 'unknown',
    address: initialData?.address ?? 'unknown',
    phone: initialData?.phone ?? 'unknown',
    email: initialData?.email ?? 'unknown',
  }

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <SupplierForm initialData={data} user={session?.user.name as string} />
    </div>
  )
}

export default EditSupplierPage;
