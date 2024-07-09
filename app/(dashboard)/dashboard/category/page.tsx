import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import BreadCrumb from '@/components/breadcrumb';
import { HistoryTable } from "@/components/tables/history-tables/history-table";
import { columns as historyColumns } from '@/components/tables/history-tables/columns';
import { columns } from '@/components/tables/category-tables/columns';
import { CategoryTable } from '@/components/tables/category-tables/category-table';
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
  const startDate = searchParams.startDate ? String(searchParams.startDate) : '';
  const endDate = searchParams.endDate ? String(searchParams.endDate) : '';


  const category = await prisma.category.findMany({
    skip: offset,
    take: pageLimit,
    where: {
      ...(
        search
          ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { code: { contains: search, mode: 'insensitive' } },
            ],
          }
          : {}
      ),
    },
    select: {
      id: true,
      name: true,
      code: true,
    }
  });

  // If no code show -
  category.map((c) => {
    if (!c.code) c.code = '-'
  })

  const totalCount = await prisma.category.count();
  const pageCount = Math.ceil(totalCount / pageLimit);

  // History

  const history = await prisma.history.findMany({
    skip: offset,
    take: pageLimit,
    where: {
      ...(
        search
          ? {
            OR: [
              { field: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
              { oldValue: { contains: search, mode: 'insensitive' } },
              { newValue: { contains: search, mode: 'insensitive' } },
              { modifiedBy: { contains: search, mode: 'insensitive' } },
            ],
          }
          : {}
      ),
      ...(
        startDate && endDate ? {
          OR: [
            {
              createdAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              }
            }
          ]
        } : {}
      ),
      table: 'Category',
    },
    select: {
      id: true,
      field: true,
      name: true,
      oldValue: true,
      newValue: true,
      modifiedBy: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  const historyTotalCount = await prisma.history.count({ where: { table: 'Category', } });
  const historyPageCount = Math.ceil(historyTotalCount / pageLimit);

  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title={`Categories (${totalCount})`}
          description="List of all categories."
        />

        {
          session?.user.role !== 'Staff' && (
            <Link
              href={'/dashboard/category/create'}
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              <Icons.add className="mr-2 h-4 w-4" /> Category
            </Link>
          )
        }
      </div>
      <Separator />

      <Tabs defaultValue="list">
        <TabsList className="grid w-full md:w-1/4 mb-2 grid-cols-2">
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <Separator />

        <TabsContent value="list">

          <CategoryTable
            columns={columns}
            data={category}
            pageCount={pageCount}
            user={session?.user.name as string}
          />
        </TabsContent>
        <TabsContent value="history">

          <HistoryTable
            columns={historyColumns}
            data={history}
            pageCount={historyPageCount}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
