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

interface TableDropdownProps {
  onDelete?: () => void;
  onDownloadExcel: () => void;
  onDownloadCsv: () => void;
}

const TableDropdown = ({ onDelete, onDownloadExcel, onDownloadCsv }: TableDropdownProps) => {
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
              <DropdownMenuItem onClick={() => onDownloadExcel()}>
                <Icons.spreadsheet className="mr-2 h-4 w-4" />
                <span>XLSX</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownloadCsv()}>
                <Icons.spreadsheet className="mr-2 h-4 w-4" />
                <span>CSV</span>
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