// GeneralSummary.tsx

'use client';

import React, { useState, useEffect } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Summary } from '@/constants/data';
import { formatCurrency } from '@/lib/formatter';
import { getStockSummary } from '@/services/report.service';
import TableDropdown from '../table-dropdown';

interface DataTableProps<TData extends Summary, TValue> {
  searchKey?: string;
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function GeneralSummary<TData extends Summary, TValue>({
  searchKey
}: Readonly<DataTableProps<TData, TValue>>) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [data, setData] = useState<Summary[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const month = monthNames[selectedMonth];
      const fetchedData = await getStockSummary(month, selectedYear);
      setData(fetchedData);
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

  const columns: ColumnDef<Summary>[] = [
    {
      accessorKey: 'itemName',
      header: 'NAME'
    },
    {
      accessorKey: 'firstMonthUnit',
      header: 'START MONTH STOCK',
    },
    {
      accessorKey: 'stockIn',
      header: 'STOCK IN',
    },
    {
      accessorKey: 'stockOut',
      header: 'STOCK OUT',
    },
    {
      accessorKey: 'finalMonthUnit',
      header: 'END MONTH STOCK',
    },
    {
      accessorKey: 'itemPrice',
      header: 'PRICE VALUE',
      cell: ({ row }) => {
        return formatCurrency(row.original.itemPrice);
      }
    },
    {
      accessorKey: 'itemPriceTotal',
      header: 'TOTAL PRICE VALUE',
      cell: ({ row }) => {
        return formatCurrency(row.original.itemPriceTotal);
      }
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  const dataToExport = data.map((d) => ({
    'name': d.itemName,
    'Start Month Stock': d.firstMonthUnit,
    'Stock In': d.stockIn,
    'Stock Out': d.stockOut,
    'End Month Stock': d.finalMonthUnit,
    'Price Value': d.itemPrice,
    'Final Price Value': d.itemPriceTotal,
  }))

  return (
    <>
      {
        searchKey && (

          <div className="flex justify-between items-center space-x-4 mb-2">
            <Input
              placeholder='Search Item'
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
              onChange={(event: any) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="w-1/3 md:max-w-sm"
            />

            <div className='w-1/3 flex gap-2'>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 25 }, (_, i) => now.getFullYear() - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <TableDropdown data={dataToExport} tableName={`General Report ${selectedMonth} - ${selectedYear}`} />
            </div>
          </div>
        )
      }
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
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
