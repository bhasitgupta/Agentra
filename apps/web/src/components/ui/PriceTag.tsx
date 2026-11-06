import React from 'react';
import { formatUSDC } from '@/lib/utils';
import { Coins } from 'lucide-react';

interface PriceTagProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showFeeHint?: boolean;
}

export function PriceTag({
  amount,
  size = 'md',
  showIcon = false,
  showFeeHint = false,
}: PriceTagProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm font-semibold',
    lg: 'text-lg font-bold',
  };

  return (
    <div className="inline-flex items-center gap-1.5 font-mono text-[#34D399]" title={showFeeHint ? 'Includes 2.5% platform escrow fee' : undefined}>
      {showIcon && <Coins className="w-3.5 h-3.5 text-[#34D399]/70" />}
      <span className={sizeClasses[size]}>{formatUSDC(amount)}</span>
    </div>
  );
}
