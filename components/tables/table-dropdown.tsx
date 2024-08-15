import React from 'react'
import dynamic from 'next/dynamic';
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
import { toast } from 'sonner';
import ReportDocument, { ReportItem } from '@/components/report/generalReport';
import { exportCSV, exportPDF, exportToExcel } from '@/lib/fileExport';
import { formatDate } from '@/lib/formatter';
import { useSession } from 'next-auth/react';

const PDFDownloadLink = dynamic(() => import('@/components/report/pdfDownloader'), { ssr: false });

interface TableDropdownProps {
  onDelete?: () => void;
  addToReport?: () => void;
  data: Record<string, string | number>[];
  tableName: string;
  period?: string;
  user?: string;
  date?: string;
  customPdf?: boolean;
  customPdfData?: ReportItem[];
}

const TableDropdown = ({ onDelete, addToReport, data, tableName, user, period, date, customPdf, customPdfData }: TableDropdownProps) => {
  const { data: session } = useSession();


  const onExportExcel = async () => {
    try {
      await exportToExcel(data, tableName, tableName);
    } catch (error) {
      toast.error('Something went wrong', {
        description: 'There was a problem exporting to Excel'
      });
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
        <Button size={'sm'}>Actions</Button>
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
              {
                customPdf ? (
                  <DropdownMenuItem>
                    <PDFDownloadLink
                      document={<ReportDocument
                        data={customPdfData!}
                        period={period!}
                        user={user!}
                        date={date!}
                      />}
                      fileName={tableName}
                      className='flex'
                    >
                      <Icons.spreadsheet className="mr-2 h-4 w-4" />
                      PDF
                    </PDFDownloadLink>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={onExportPDF}>
                    <Icons.spreadsheet className="mr-2 h-4 w-4" />
                    <span>PDF</span>
                  </DropdownMenuItem>
                )
              }
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        {
          session?.user.role !== 'Staff' && onDelete !== undefined && (
            <DropdownMenuItem className='text-red-600' onClick={() => onDelete()}>
              Delete
              <DropdownMenuShortcut>
                <Icons.trash className="mr-2 h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )
        }
        {
          addToReport && (
            <DropdownMenuItem onClick={() => addToReport()}>
              Add to report
              <DropdownMenuShortcut>
                <Icons.filePlus className="mr-2 h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          )
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default TableDropdown