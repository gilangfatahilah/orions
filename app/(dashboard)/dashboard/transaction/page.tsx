import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import prisma from "@/lib/db";
import { columns } from "@/components/tables/transaction-tables/column";
import BreadCrumb from "@/components/breadcrumb";
import TransactionForm from "@/components/forms/transaction-form";
import { auth } from '@/auth';
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { TransactionHistoryTable } from "@/components/tables/transaction-tables/history-table";

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

const breadcrumbItems = [{ title: 'Transaction', link: '/dashboard/transaction' }]

const transactionPage = async ({ searchParams }: paramsProps) => {
  const session = await auth();
  const userSession = {
    id: session?.user.id ?? '',
    name: session?.user.name ?? '',
  }

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
              { supplier: {name: { contains: search, mode: 'insensitive' }} },
              { outlet: {name: { contains: search, mode: 'insensitive' }} },
            ],
          }
          : {}
      ),
    },
    select: {
      id: true,
      type: true,
      transactionDate: true,
      letterCode: true,
      totalPrice: true,
      supplier: {
        select: {
          id: true,
          name: true,
        }
      },
      outlet: {
        select: {
          id: true,
          name: true,
        }
      },
      user: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      transactionDate: 'desc',
    }
  });

  const totalCount = await prisma.item.count();
  const pageCount = Math.ceil(totalCount / pageLimit);

  return (
    <div className="flex-1 space-y-4 p-8">
      <BreadCrumb items={breadcrumbItems} />
      <div className='flex items-center justify-between'>
        <Heading title='Transaction' description='Manage your transaction here.' />
      </div>

      <Tabs defaultValue="transaction">
        <TabsList className="grid w-full md:w-1/4 mb-2 grid-cols-2">
          <TabsTrigger value="transaction">Transaction</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <Separator />

        <TabsContent value="transaction">
          <TransactionForm user={userSession} />
        </TabsContent>
        <TabsContent value="history">
          <TransactionHistoryTable data={transaction} columns={columns} user={session?.user.name as string} pageCount={pageCount} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default transactionPage;