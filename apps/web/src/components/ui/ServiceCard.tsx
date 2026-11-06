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
    <div className="group relative flex flex-col justify-between rounded-xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#6D001A] hover:shadow-[0_0_0_1px_#6D001A,0_12px_28px_-6px_rgba(139,92,246,0.18)]">
      {/* Top row: Category Badge & TrustScore */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="category" size="sm">
            {service.category.replace('-', ' ').toUpperCase()}
          </Badge>
          {service.isReference && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6D001A] bg-[#6D001A]/15 border border-[#6D001A]/30 px-2 py-0.5 rounded-full">
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
          <h3 className="text-[18px] font-bold text-[#FFFFFF] group-hover:text-[#6D001A] transition-colors line-clamp-1">
            {service.name}
          </h3>
        </Link>
        <p className="mt-1.5 text-[14px] text-[#D4D4D8] leading-relaxed line-clamp-2">
          {service.description}
        </p>
      </div>

      {/* Tags */}
      {service.tags && service.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          {service.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono text-[#8E8E93] bg-[#160B0F] border border-[rgba(255,255,255,0.10)] px-2 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
          {service.tags.length > 3 && (
            <span className="text-[10px] text-[#8E8E93] font-mono">
              +{service.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Metrics Row: Price & Latency */}
      <div className="pt-3 border-t border-[rgba(255,255,255,0.10)] mb-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <PriceTag amount={service.price} size="md" showFeeHint />
          <div className="flex items-center gap-1 text-[#D4D4D8] font-mono">
            <Clock className="w-3.5 h-3.5 text-[#8E8E93]" />
            <span>p95: {service.p95Ms}ms</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#8E8E93]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
          <span>{service.verifiedCalls} verified on-chain calls</span>
        </div>
      </div>

      {/* Action CTA */}
      <Link
        href={`/services/${service.slug}`}
        className="mt-1 flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg text-xs font-semibold text-[#FFFFFF] bg-[#160B0F] hover:bg-[#6D001A] hover:text-white border border-[rgba(255,255,255,0.10)] hover:border-[#6D001A] transition-colors"
      >
        <span>View Service</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}


