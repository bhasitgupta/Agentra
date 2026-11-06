'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, children, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-[#9B99C4] uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            className={cn(
              'w-full h-10 pl-3.5 pr-10 rounded-lg bg-[#0E0E1A] border border-[#1E1E3A] text-sm text-[#F1F0FF] appearance-none cursor-pointer transition-all duration-150',
              'focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error && 'border-[#F87171] focus:border-[#F87171] focus:ring-[#F87171]',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0E0E1A] text-[#F1F0FF]">
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3 text-[#5C5A8A] pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-[#F87171]">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[#5C5A8A]">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
