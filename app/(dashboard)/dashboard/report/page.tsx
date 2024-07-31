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
import { TransactionReportTable } from '@/components/tables/report-tables/transaction-table';
import { TransactionDetail } from '@/constants/data';

const breadcrumbItems = [{ title: 'Report', link: '/dashboard/report' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const ReportPage = async ({ searchParams }: paramsProps) => {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const offset = (page - 1) * pageLimit;
  const search = searchParams.search ? String(searchParams.search) : '';
  const startDate = searchParams.startDate ? String(searchParams.startDate) : '';
  const endDate = searchParams.endDate ? String(searchParams.endDate) : '';

  const transactionReport = await prisma.transactionReport.findMany({
    skip: offset,
    take: pageLimit,
    where: {
      ...(
        search
          ? {
            OR: [
              { letterCode: { contains: search, mode: 'insensitive' } },
              { user: { contains: search, mode: 'insensitive' } },
            ],
          }
          : {}
      ),
    },
    orderBy: {
      transactionDate: 'desc',
    }
  })

  const parsedTransactionReport: TransactionDetail[]  = transactionReport.map((tr) => ({
    id: tr.id,
    type: tr.type,
    transactionDate: tr.transactionDate,
    letterCode: tr.letterCode,
    totalPrice: tr.totalPrice,
    supplier: tr.supplier ? JSON.parse(tr.supplier) : null,
    outlet: tr.outlet ? JSON.parse(tr.outlet) : null,
    user: {id: tr.id, name: tr.user},
    detail: JSON.parse(tr.detail),
  }))

  const totalCount = await prisma.transactionReport.count();
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
          <GeneralSummary searchKey='itemName' />
        </TabsContent>
        <TabsContent value="history">
          <TransactionReportTable data={parsedTransactionReport} columns={columns} pageCount={pageCount} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReportPage