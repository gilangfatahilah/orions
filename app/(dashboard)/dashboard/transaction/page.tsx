import prisma from "@/lib/db";
import { columns } from "@/components/tables/transaction-tables/column";
import BreadCrumb from "@/components/breadcrumb";
import { auth } from '@/auth';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from "@/components/ui/heading";
import { TransactionHistoryTable } from "@/components/tables/transaction-tables/history-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { cn } from '@/lib/utils';
import { Icons } from "@/components/icons";

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const breadcrumbItems = [{ title: 'Transaction', link: '/dashboard/transaction' }]

const transactionPage = async ({ searchParams }: paramsProps) => {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;
  const search = searchParams.search ? String(searchParams.search) : '';
  const startDate = searchParams.startDate ? String(searchParams.startDate) : '';
  const endDate = searchParams.endDate ? String(searchParams.endDate) : '';

  const transaction = await prisma.transaction.findMany({
    skip: offset,
    take: pageLimit,
    where: {
      ...(
        search
          ? {
            OR: [
              { letterCode: { contains: search, mode: 'insensitive' } },
              { user: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
          : {}
      ), ...(
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
    },
    select: {
      id: true,
      type: true,
      totalPrice: true,
      letterCode: true,
      transactionDate: true,
      userName: true,
      supplierDetail: true,
      outletDetail: true,
      detail: {
        select: { id: true, quantity: true, itemDetail: true, }
      }
    },
    orderBy: {
      transactionDate: 'desc',
    }
  });

  const totalCount = await prisma.item.count();
  const pageCount = Math.ceil(totalCount / pageLimit);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className='flex items-center justify-between'>
          <Heading title='Transaction' description='Manage your transaction here.' />

          <Link href={'/dashboard/transaction/create'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Icons.add className="mr-2 h-4 w-4" /> Transaction
          </Link>
        </div>

        <TransactionHistoryTable
          data={transaction}
          columns={columns}
          pageCount={pageCount} />
      </div>
    </ScrollArea>
  )
}

export default transactionPage;