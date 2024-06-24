import React from 'react'
import BreadCrumb from '@/components/breadcrumb';
import { UserForm } from '@/components/forms/user-form';

const AddUser = () => {
  const breadcrumbItems = [
    { title: 'User', link: '/dashboard/user' },
    { title: 'Create', link: '/dashboard/user/new' }
  ];

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
    <UserForm initialData={""} />
    </div>
  )
}

export default AddUser