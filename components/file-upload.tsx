'use client';
import { OurFileRouter } from '@/app/api/uploadthing/core';
import { UploadDropzone } from '@uploadthing/react';
import { Icons } from './icons';
import Image from 'next/image';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface ImageUploadProps {
  onChange?: any;
  onRemove: (value: string) => void;
  value: string | null | undefined;
}

export default function FileUpload({
  onChange,
  onRemove,
  value
}: Readonly<ImageUploadProps>) {
  const onDeleteFile = () => {
    onRemove('');
  };
  const onUpdateFile = (newFiles: string) => {
    onChange(newFiles);
  };
  return (
    <div className='w-full'>
      <div className="mb-4 flex items-center gap-4">
        {value &&
          (
            <div
              className="relative h-[200px] w-[200px] overflow-hidden rounded-md"
            >
              <div className="absolute right-2 top-2 z-10">
                <Button
                  type="button"
                  onClick={() => onDeleteFile()}
                  variant="destructive"
                  size="sm"
                >
                  <Icons.trash className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Image
                  fill
                  className="object-cover"
                  alt="Image"
                  src={value}
                />
              </div>
            </div>
          )}
      </div>
      <div>
        {!value && (
          <UploadDropzone<OurFileRouter>
            className="ut-label:text-sm ut-allowed-content:ut-uploading:text-red-300 py-2 dark:bg-zinc-800"
            endpoint="imageUploader"
            config={{ mode: 'auto' }}
            content={{
              allowedContent({ isUploading }) {
                if (isUploading)
                  return (
                    <p className="mt-2 animate-pulse text-sm text-slate-400">
                      Uploading...
                    </p>
                  );
              }
            }}
            onClientUploadComplete={(res) => {
              if (res) {
                const data: string = res[0]?.url;
                onUpdateFile(data);
              }
            }}
            onUploadError={(error: Error) => {
              toast.error(error.message);
            }}
            onUploadBegin={() => {
              // Do something once upload begins
            }}
          />
        )}
      </div>
    </div>
  );
}
