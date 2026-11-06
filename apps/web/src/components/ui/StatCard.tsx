import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  label,
  value,
  subtitle,
  trend,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between p-5 rounded-xl bg-[#0E0E1A] border border-[#1E1E3A]',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-medium text-[#9B99C4] uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="p-2 rounded-lg bg-[#14142A] text-[#A78BFA] border border-[#1E1E3A]">
            {icon}
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl lg:text-3xl font-bold font-mono text-[#F1F0FF] tracking-tight">
          {value}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          {trend ? (
            <div
              className={cn(
                'inline-flex items-center gap-1 text-xs font-medium',
                trend.isPositive ? 'text-[#34D399]' : 'text-[#F87171]'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{trend.value}</span>
            </div>
          ) : null}

          {subtitle && (
            <span className="text-xs text-[#5C5A8A] font-mono">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
}
