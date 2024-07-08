import React from 'react'
import { Button } from "@/components/ui/button"
import { Icons } from '../icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportCSV, exportPDF, exportToExcel } from '@/lib/fileExport';
import { useToast } from '../ui/use-toast';
import { formatDate } from '@/lib/formatter';

interface TableDropdownProps {
  onDelete?: () => void;
  data: Record<string, string | number>[];
  tableName: string;
}

const TableDropdown = ({ onDelete, data, tableName }: TableDropdownProps) => {
  const { toast } = useToast();

  const onExportExcel = async () => {
    try {
      await exportToExcel(data, tableName, tableName);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error failed to export data table.',
        description: 'Error when exporting data table to xlsx, please check your connection and try again.'
      })
    }
  };

  const onExportCSV = () => {
    exportCSV(data, tableName);
  };

  const onExportPDF = () => {
    exportPDF(data, `Data ${tableName}, ${formatDate(new Date())}`, tableName);

  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Export
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={onExportExcel}>
                <Icons.spreadsheet className="mr-2 h-4 w-4" />
                <span>XLSX</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportCSV}>
                <Icons.spreadsheet className="mr-2 h-4 w-4" />
                <span>CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportPDF}>
                <Icons.spreadsheet className="mr-2 h-4 w-4" />
                <span>PDF</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        {
          onDelete !== undefined && (
            <DropdownMenuItem className='text-red-600' onClick={() => onDelete()}>
              Delete
              <DropdownMenuShortcut>
                <Icons.trash className="mr-2 h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TableDropdown