'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-[#9B99C4] uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full min-h-[90px] p-3 rounded-lg bg-[#0E0E1A] border border-[#1E1E3A] text-sm text-[#F1F0FF] placeholder-[#5C5A8A] transition-all duration-150',
            'focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]',
            'disabled:opacity-50 disabled:cursor-not-allowed resize-y',
            error && 'border-[#F87171] focus:border-[#F87171] focus:ring-[#F87171]',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-[#F87171]">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[#5C5A8A]">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
