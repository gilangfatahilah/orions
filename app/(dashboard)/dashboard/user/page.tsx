import BreadCrumb from '@/components/breadcrumb';
import { EmployeeTable } from '@/components/tables/employee-tables/employee-table';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import prisma from '@/lib/db';
import Link from 'next/link';
import { auth } from '@/auth';

const breadcrumbItems = [{ title: 'User', link: '/dashboard/user' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  const session = await auth();
  
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;
  const search = searchParams.search ? String(searchParams.search) : '';

  const user = await prisma.user.findMany({
    skip: offset,
    take: pageLimit,
    where: {
      ...(
        search
          ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { role: { contains: search, mode: 'insensitive' } },
            ],
          }
          : {}
      ),
      id: { not: session?.user.id },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
    }
  });


  const totalCount = await prisma.user.count();

  const pageCount = Math.ceil(totalCount / pageLimit);
  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title={`Users (${totalCount})`}
          description="All user list excluded your self, you can update your user information on profile menu."
        />

        {
          session?.user.role !== 'Staff' && (
            <Link
              href={'/dashboard/user/create'}
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              <Icons.add className="mr-2 h-4 w-4" /> User
            </Link>
          )
        }
      </div>
      <Separator />

      <EmployeeTable
        pageNo={page}
        totalUsers={totalCount}
        data={user}
        role={session?.user.role as string}
        pageCount={pageCount}
      />
    </div>
  );
}
