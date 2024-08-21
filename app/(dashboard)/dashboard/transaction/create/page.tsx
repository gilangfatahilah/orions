import { auth } from "@/auth";
import BreadCrumb from "@/components/breadcrumb";
import TransactionForm from "@/components/forms/transaction-form";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [
  { title: 'Transaction', link: '/dashboard/transaction' },
  { title: 'Create', link: '/dashboard/transaction/create' },]

const CreateTransaction = async () => {
  const session = await auth();
  const userSession = {
    id: session?.user.id ?? '',
    name: session?.user.name ?? '',
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 p-8 space-y-4">
        <BreadCrumb items={breadcrumbItems} />
        <div className='flex items-center justify-between'>
          <Heading title='Create Transaction' description='Manage your transaction here.' />
        </div>

        <TransactionForm user={userSession} />
      </div>
    </ScrollArea>
  )
}

export default CreateTransaction