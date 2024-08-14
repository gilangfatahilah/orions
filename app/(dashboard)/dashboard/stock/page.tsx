import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { HistoryTable } from "@/components/tables/history-tables/history-table";
import BreadCrumb from '@/components/breadcrumb';
import { columns } from '@/components/tables/stock-tables/columns';
import { StockTable } from '@/components/tables/stock-tables/stock-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import prisma from '@/lib/db';

const breadcrumbItems = [{ title: 'Stock', link: '/dashboard/stock' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {

  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;
  const search = searchParams.search ? String(searchParams.search) : '';
  const startDate = searchParams.startDate ? String(searchParams.startDate) : '';
  const endDate = searchParams.endDate ? String(searchParams.endDate) : '';


  const stock = await prisma.stock.findMany({
    skip: offset,
    take: pageLimit,
    where: {
      ...(
        search
          ? {
            OR: [
              { item: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
          : {}
      ),
    },
    select: {
      id: true,
      quantity: true,
      prevQuantity: true,
      item: {
        select: {
          image: true,
          name: true,
        }
      }
    }
  });

  const totalCount = await prisma.stock.count();
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
      table: 'Stock',
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

  const historyTotalCount = await prisma.history.count({ where: { table: 'Stock', } });
  const historyPageCount = Math.ceil(historyTotalCount / pageLimit);
  return (
    <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title="Stocks"
          description="List of all item stocks."
        />
      </div>
      <Separator />

      <Tabs defaultValue="list">
        <TabsList className="grid w-full md:w-1/4 mb-2 grid-cols-2">
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <Separator />

        <TabsContent value="list">

          <StockTable
            columns={columns}
            data={stock}
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
