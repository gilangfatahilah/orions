import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import prisma from '@/lib/db';
import { columns } from '@/components/tables/transaction-tables/column';
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import BreadCrumb from "@/components/breadcrumb";
import { GeneralSummary } from '@/components/tables/report-tables/general-table';
import { TransactionHistoryTable } from '@/components/tables/transaction-tables/history-table';
import { auth } from '@/auth';

const breadcrumbItems = [{ title: 'Report', link: '/dashboard/report' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const ReportPage = async ({ searchParams }: paramsProps) => {
  const session = await auth();
  const user = session?.user.name;

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

  const totalCount = await prisma.transaction.count();
  const pageCount = Math.ceil(totalCount / pageLimit);

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <div className='flex items-center justify-between'>
        <Heading title='Report' description='View and track report&apos;s summary here.' />
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full md:w-1/4 mb-2 grid-cols-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="history">Transaction</TabsTrigger>
        </TabsList>
        <Separator />

        <TabsContent value="general">
          <GeneralSummary searchKey='itemName' user={user as string} />
        </TabsContent>
        <TabsContent value="history">
          <TransactionHistoryTable data={transaction} columns={columns} pageCount={pageCount} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReportPage