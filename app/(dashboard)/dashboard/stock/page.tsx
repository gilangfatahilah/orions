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

      <StockTable
        columns={columns}
        data={stock}
        pageCount={pageCount}
      />
    </div>
  );
}
