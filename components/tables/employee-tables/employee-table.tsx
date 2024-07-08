'use client';
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/constants/data';
import { CellAction } from './cell-action';
import { AlertModal } from '@/components/modal/alert-modal';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { deleteSeveralUser } from '@/services/user.service';
import { useToast } from '@/components/ui/use-toast';
import TableDropdown from '../table-dropdown';
import { formatDate } from '@/lib/formatter';
import { exportToExcel, exportCSV, exportPDF } from '@/lib/fileExport';

interface DataTableProps {
  data: Employee[];
  pageSizeOptions?: number[];
  role: string;
  user: string;
  pageCount: number;
}

export function EmployeeTable({
  data,
  pageCount,
  role,
  user,
  pageSizeOptions = [10, 20, 30, 40, 50]
}: Readonly<DataTableProps>) {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Search params
  const page = searchParams?.get('page') ?? '1';
  const pageAsNumber = Number(page);
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const per_page = searchParams?.get('limit') ?? '10';
  const perPageAsNumber = Number(per_page);
  const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;
  const initialSearch = searchParams?.get('search') ?? '';

  const [globalFilter, setGlobalFilter] = React.useState<string>('');
  const [alertOpen, setAlertOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  /**
   * Table Columns
   */
  const columns: ColumnDef<Employee>[] = [
    {
      id: 'select',
      header: ({ table }) => {
        const allSelectableRows = table.getFilteredRowModel().rows.filter(
          row => {
            if (role === 'Manager') {
              return row.original.role !== 'Manager' && row.original.role !== 'Superadmin';
            }

            return row.original.role !== 'Superadmin';
          }
        );

        const allSelected = allSelectableRows.every(row => row.getIsSelected());

        return (
          <Checkbox
            checked={allSelected}
            onCheckedChange={(value) => {
              allSelectableRows.forEach(row => row.toggleSelected(!!value));
            }}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => {
        const rolesToDisable = role === 'Manager' ? ['Manager', 'Superadmin'] : ['Superadmin'];

        return (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={rolesToDisable.includes(row.original.role)}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        )
      },
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'image',
      header: 'PHOTO',
      cell: ({ row }) => {
        return (
          <Avatar>
            <AvatarImage src={row.original.image as string} alt={row.original.name as string} />
            <AvatarFallback> {row.original.name?.substring(0, 1).toUpperCase()} </AvatarFallback>
          </Avatar>
        )
      },
    },
    {
      accessorKey: 'name',
      header: 'NAME',
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: 'EMAIL'
    },
    {
      accessorKey: 'role',
      header: 'ROLE',
    },
    {
      accessorKey: 'createdAt',
      header: 'JOINED',
      cell: ({ row }) => {
        return formatDate(row.original.createdAt);
      }
    },
    {
      id: 'actions',
      header: '•••',
      cell: ({ row }) => {
        const isSuperadmin = row.original.role === 'Superadmin';
        const isManager = row.original.role === 'Manager';
        const isUserSuperadmin = role === 'Superadmin';
        const isUserManager = role === 'Manager';

        if ((isUserSuperadmin && isSuperadmin) || (isUserManager && (isManager || isSuperadmin))) {
          return null;
        }

        return <CellAction data={row.original} />;
      }
    }
  ];

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  React.useEffect(() => {
    setGlobalFilter(initialSearch);
  }, [initialSearch]);

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: fallbackPage - 1,
      pageSize: fallbackPerPage
    });


  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: { pageIndex, pageSize },
      globalFilter: true,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        limit: pageSize
      })}`,
      {
        scroll: false
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  const selectedData = table.getFilteredSelectedRowModel().rows;
  const dataToExport = selectedData.map((data) => ({
    name: data.original.name,
    role: data.original.role,
    email: data.original.email,
    joined: formatDate(data.original.createdAt),
  }));

  const onConfirmDelete = async () => {
    try {
      setLoading(true);
      const idToDelete = selectedData.map((data) => data.original.id);
      const response = await deleteSeveralUser(idToDelete, user);

      if (!response) {
        return toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.'
        });
      }

      // close and refresh
      setAlertOpen(false);
      router.refresh();

      return toast({
        title: `Success, ${idToDelete.length} users has successfully deleted.`,
      });

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AlertModal
        description='Do you want to delete all of the selected users ? This action can&apos;t be undone'
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
      />

      <div className='w-full flex items-center gap-4 justify-between mb-2'>
        <Input
          placeholder="Search everything..."
          value={globalFilter}
          onChange={(event) => {
            const search = event.target.value;
            const params = new URLSearchParams(searchParams as any);
            if (search) {
              params.set('search', search);
            } else {
              params.delete('search');
            }
            setGlobalFilter(search);
            router.push(`${pathname}?${params.toString()}`);
          }}
          className="w-full md:max-w-sm"
        />

        <div className={selectedData.length ? 'block' : 'hidden'}>
          <TableDropdown data={dataToExport} tableName='User' onDelete={() => setAlertOpen(true)} />
        </div>
      </div>

      <ScrollArea className="h-[calc(80vh-220px)] rounded-md border">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {
                    row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                    )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
        <div className="flex w-full items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <p className="whitespace-nowrap text-sm font-medium">
                Rows per page
              </p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Go to first page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to previous page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to next page"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to last page"
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
