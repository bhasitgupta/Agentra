'use client';

import React from 'react';
import { getTrustColor, getTrustLabel } from '@/lib/utils';
import { TrustLabel } from '@/lib/types';

interface TrustScoreProps {
  score: number;
  label?: TrustLabel;
  callsCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function TrustScore({
  score,
  label,
  callsCount = 100,
  size = 'md',
  showLabel = true,
}: TrustScoreProps) {
  const finalLabel = label || getTrustLabel(score, callsCount);
  const color = getTrustColor(score);

  const dimensions = {
    sm: { diameter: 38, strokeWidth: 3.5, fontSize: 'text-xs', labelSize: 'text-[9px]' },
    md: { diameter: 48, strokeWidth: 4, fontSize: 'text-sm', labelSize: 'text-[10px]' },
    lg: { diameter: 84, strokeWidth: 6, fontSize: 'text-2xl', labelSize: 'text-xs' },
  };

  const { diameter, strokeWidth, fontSize, labelSize } = dimensions[size];
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // If "New" and zero calls, dash array can be dashed
  const isNew = finalLabel === 'New';
  const progress = isNew ? 100 : Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div
        className="relative flex items-center justify-center"
        style={{ width: diameter, height: diameter }}
      >
        <svg
          className="transform -rotate-90"
          width={diameter}
          height={diameter}
        >
          {/* Background track circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="transparent"
            stroke="#1E1E3A"
            strokeWidth={strokeWidth}
          />
          {/* Animated score circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="transparent"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={isNew ? '4 3' : circumference}
            strokeDashoffset={isNew ? 0 : strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-mono font-bold ${fontSize} ${color.text}`}>
            {isNew ? '—' : score}
          </span>
        </div>
      </div>

      {showLabel && (
        <span
          className={`mt-1 font-medium tracking-wide uppercase ${labelSize} ${color.text}`}
        >
          {finalLabel}
        </span>
      )}
    </div>
  );
}
