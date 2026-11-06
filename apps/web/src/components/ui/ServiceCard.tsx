'use client';

import React from 'react';
import Link from 'next/link';
import { Service } from '@/lib/types';
import { Badge } from './Badge';
import { TrustScore } from './TrustScore';
import { PriceTag } from './PriceTag';
import { Clock, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-xl bg-[#0E0E1A] border border-[#1E1E3A] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8B5CF6] hover:shadow-[0_0_0_1px_#8B5CF6,0_12px_28px_-6px_rgba(139,92,246,0.18)]">
      {/* Top row: Category Badge & TrustScore */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="category" size="sm">
            {service.category.replace('-', ' ').toUpperCase()}
          </Badge>
          {service.isReference && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#A78BFA] bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-2 py-0.5 rounded-full">
              <Zap className="w-2.5 h-2.5" />
              Reference
            </span>
          )}
        </div>
        <TrustScore
          score={service.trustScore}
          label={service.label}
          callsCount={service.verifiedCalls}
          size="sm"
          showLabel={false}
        />
      </div>

      {/* Title & Description */}
      <div className="mb-4">
        <Link href={`/services/${service.slug}`} className="block focus:outline-none">
          <h3 className="text-[18px] font-bold text-[#F1F0FF] group-hover:text-[#A78BFA] transition-colors line-clamp-1">
            {service.name}
          </h3>
        </Link>
        <p className="mt-1.5 text-[14px] text-[#9B99C4] leading-relaxed line-clamp-2">
          {service.description}
        </p>
      </div>

      {/* Tags */}
      {service.tags && service.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          {service.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono text-[#5C5A8A] bg-[#14142A] border border-[#1E1E3A] px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
          {service.tags.length > 3 && (
            <span className="text-[10px] text-[#5C5A8A] font-mono">
              +{service.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Metrics Row: Price & Latency */}
      <div className="pt-3 border-t border-[#1E1E3A] mb-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <PriceTag amount={service.price} size="md" showFeeHint />
          <div className="flex items-center gap-1 text-[#9B99C4] font-mono">
            <Clock className="w-3.5 h-3.5 text-[#5C5A8A]" />
            <span>p95: {service.p95Ms}ms</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#5C5A8A]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
          <span>{service.verifiedCalls} verified on-chain calls</span>
        </div>
      </div>

      {/* Action CTA */}
      <Link
        href={`/services/${service.slug}`}
        className="mt-1 flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg text-xs font-semibold text-[#F1F0FF] bg-[#14142A] hover:bg-[#8B5CF6] hover:text-white border border-[#1E1E3A] hover:border-[#8B5CF6] transition-colors"
      >
        <span>View Service</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
