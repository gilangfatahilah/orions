import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import BreadCrumb from "@/components/breadcrumb";
import TransactionForm from "@/components/forms/transaction-form";
import { auth } from '@/auth';
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

const transactionPage = async () => {
  const session = await auth();
  const breadcrumbItems = [{ title: 'Transaction', link: '/dashboard/transaction' }]
  const userSession = {
    id: session?.user.id ?? '',
    name: session?.user.name ?? '',
  }

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
      </Tabs>
    </div>
  )
}

export default transactionPage;