import BreadCrumb from '@/components/breadcrumb';
import { ItemTable } from '@/components/tables/item-tables/item-table';
import { columns } from '@/components/tables/item-tables/columns';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import prisma from '@/lib/db';
import Link from 'next/link';
import { auth } from '@/auth';

const breadcrumbItems = [{ title: 'Item', link: '/dashboard/item' }];

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

  const item = await prisma.item.findMany({
    skip: offset,
    take: pageLimit,
    where: {
      ...(
        search
          ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { category: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
          : {}
      ),
    },
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      category: {
        select: {
          name: true,
        }
      }
    }
  });

  const totalCount = await prisma.item.count();

  const pageCount = Math.ceil(totalCount / pageLimit);
  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title={`Items (${totalCount})`}
          description="List of all items."
        />

        {
          session?.user.role !== 'Staff' && (
            <Link
              href={'/dashboard/item/create'}
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              <Icons.add className="mr-2 h-4 w-4" /> Item
            </Link>
          )
        }
      </div>
      <Separator />

      <ItemTable
        columns={columns}
        data={item}
        pageCount={pageCount}
      />
    </div>
  );
}
