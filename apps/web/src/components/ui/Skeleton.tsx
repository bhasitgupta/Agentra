import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-[#14142A]/60 border border-[#1E1E3A]/40',
        className
      )}
      {...props}
    />
  );
}
