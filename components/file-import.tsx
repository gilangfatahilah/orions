import React from 'react';
import { Input } from './ui/input';
import { Icons } from './icons';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { AlertModal } from './modal/alert-modal';
import { importExcelData } from '@/lib/fileImport';

interface ImportExcelProps {
  onSubmit: (data: any[]) => Promise<void>;
}

const ImportExcel = ({onSubmit}: ImportExcelProps) => {
  const { toast } = useToast();

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
      toast({
        variant: 'destructive',
        title: 'Failed importing file, please try again.',
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
    }finally{
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

    </>
  );
};

export default ImportExcel;
