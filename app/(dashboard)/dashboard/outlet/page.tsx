import BreadCrumb from '@/components/breadcrumb';
import { columns } from '@/components/tables/supplier-tables/columns';
import { SupplierTable } from '@/components/tables/supplier-tables/supplier-table';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import prisma from '@/lib/db';
import Link from 'next/link';
import { auth } from '@/auth';

const breadcrumbItems = [{ title: 'Category', link: '/dashboard/category' }];

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

  const supplier = await prisma.supplier.findMany({
    skip: offset,
    take: pageLimit,
    where: {
      ...(
        search
          ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
            ],
          }
          : {}
      ),
    },
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
      email: true,
    }
  });
  const totalCount = await prisma.supplier.count();

  const pageCount = Math.ceil(totalCount / pageLimit);
  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title={`Suppliers (${totalCount})`}
          description="List of all suppliers."
        />

        {
          session?.user.role !== 'Staff' && (
            <Link
              href={'/dashboard/supplier/create'}
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              <Icons.add className="mr-2 h-4 w-4" /> Add Supplier
            </Link>
          )
        }
      </div>
      <Separator />

      <SupplierTable
        columns={columns}
        data={supplier}
        role={session?.user.role as string}
        pageCount={pageCount}
      />
    </div>
  );
}
