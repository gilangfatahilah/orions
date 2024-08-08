import React from 'react';
import { Button } from './button';
import { Icons } from '../icons';

interface ButtonProps {
  label: string;
  loading: boolean;
  className?: string;
  disabled?: boolean;
}

const LoadingButton = ({ loading, label, className, disabled = false }: ButtonProps) => {
  return (
    <>
      {
        loading ? (
          <Button disabled={true} className={`ml-auto ${className ?? ''}`} type="submit">
            <Icons.spinner className="mr-2 w-4 h-4 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button disabled={disabled} className={`ml-auto ${className ?? ''}`} type="submit">
            {label}
          </Button>
        )
      }
    </>
  )
}

export default LoadingButton