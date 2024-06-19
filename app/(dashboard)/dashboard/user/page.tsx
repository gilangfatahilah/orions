import BreadCrumb from '@/components/breadcrumb';
import { columns } from '@/components/tables/employee-tables/columns';
import { EmployeeTable } from '@/components/tables/employee-tables/employee-table';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Employee } from '@/constants/data';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import prisma from '@/lib/db';
import Link from 'next/link';

const breadcrumbItems = [{ title: 'Employee', link: '/dashboard/employee' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  // const country = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const user = await prisma.user.findMany({
    skip: 0,
    take: 10,
    select: {
      name: true,
      email: true,
      role: true, 
      image: true
    }
  });

  // const res = await fetch(
  //   `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${pageLimit}` +
  //     (country ? `&search=${country}` : '')
  // );
  // const employeeRes = await res.json();
  // const totalUsers = employeeRes.length; //1000
  // const pageCount = Math.ceil(totalUsers / pageLimit);
  // const employee: Employee[] = employeeRes;
  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title={`Employee (${user.length})`}
          description="Manage employees (Server side table functionalities.)"
        />

        {
          user.map((u, index) => {return (
            <p key={index}>
              {u.name}
            </p>
          )})
        }

        <Link
          href={'/dashboard/employee/new'}
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      <Separator />

      {/* <EmployeeTable
        searchKey="country"
        pageNo={page}
        columns={columns}
        totalUsers={totalUsers}
        data={employee}
        pageCount={pageCount}
      /> */}
    </div>
  );
}
