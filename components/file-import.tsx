import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from './ui/input';
import { Icons } from './icons';
import { Label } from './ui/label';
import {toast} from 'sonner';
import { AlertModal } from './modal/alert-modal';
import { importExcelData } from '@/lib/fileImport';

interface ImportExcelProps {
  onSubmit: (data: any[]) => Promise<void>;
}

const ImportExcel = ({ onSubmit }: ImportExcelProps) => {

  const [fileName, setFileName] = React.useState<string>('');
  const [file, setFile] = React.useState<File>();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file)
      setFileName(file.name);
      setOpenModal(true);
    } else {
      toast.error('Something went wrong', {
        description: 'Failed to upload file, please try again.'
      })
    }
  };

  const handleFileSubmit = async () => {
    try {
      setLoading(true);
      const data = await importExcelData(file as File);
      await onSubmit(data);
    } catch (error) {
      // 
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  }

  return (
    <>
      <AlertModal
        description={`Are you sure you want to import data from "${fileName}" to this table ?`}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleFileSubmit}
        loading={loading}
      />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center">
              <Label
                htmlFor="file-upload"
                className="h-8 flex items-center my-auto rounded-md px-3 text-xs border border-dashed border-input cursor-pointer bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                <div className='flex items-center'>
                  <Icons.import className="w-3 h-3 mr-2" />
                  <span>Import</span>
                </div>
                <Input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept='.xlsx, .xls'
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </Label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add your xlsx data to this table.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

    </>
  );
};

export default ImportExcel;
