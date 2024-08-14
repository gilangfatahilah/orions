import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { HistoryTable } from "@/components/tables/history-tables/history-table"; import BreadCrumb from '@/components/breadcrumb';
import { columns } from '@/components/tables/outlet-tables/columns';
import { OutletTable } from '@/components/tables/outlet-tables/outlet-table';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import prisma from '@/lib/db';
import Link from 'next/link';
import { auth } from '@/auth';
import { Outlet } from "@/constants/data";

const breadcrumbItems = [{ title: 'Outlet', link: '/dashboard/outlet' }];

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

  const outlet = await prisma.outlet.findMany({
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

  outlet.map((o: Outlet) => {
    if (!o.email) o.email = "-"
  })

  const totalCount = await prisma.outlet.count();
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
      table: 'Outlet',
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

  const historyTotalCount = await prisma.history.count({ where: { table: 'Outlet', } });
  const historyPageCount = Math.ceil(historyTotalCount / pageLimit);
  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title={`Outlets (${totalCount})`}
          description="List of all outlet."
        />

        {
          session?.user.role !== 'Staff' && (
            <Link
              href={'/dashboard/outlet/create'}
              className={cn(buttonVariants({ variant: 'default' }))}
            >
              <Icons.add className="mr-2 h-4 w-4" /> Outlet
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

          <OutletTable
            columns={columns}
            data={outlet}
            role={session?.user.role as string}
            user={session?.user.name as string}
            pageCount={pageCount}
          />
        </TabsContent>
        <TabsContent value="history">

          <HistoryTable
            data={history}
            pageCount={historyPageCount}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
