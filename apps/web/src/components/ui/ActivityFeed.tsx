'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivityEvent } from '@/lib/types';
import { truncateAddress, truncateTx, getSnowtraceUrl, formatTimeAgo, formatUSDC } from '@/lib/utils';
import { CheckCircle2, XCircle, DollarSign, Award, ExternalLink } from 'lucide-react';

interface ActivityFeedProps {
  events: ActivityEvent[];
  maxItems?: number;
  showFilters?: boolean;
}

export function ActivityFeed({
  events,
  maxItems,
}: ActivityFeedProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const displayedEvents = maxItems ? events.slice(0, maxItems) : events;

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'CALL_SUCCEEDED':
        return <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" />;
      case 'CALL_FAILED':
        return <XCircle className="w-4 h-4 text-[#F87171]" />;
      case 'PAYMENT_SETTLED':
        return <DollarSign className="w-4 h-4 text-[#6D001A]" />;
      case 'SCORE_CHANGED':
        return <Award className="w-4 h-4 text-[#FBBF24]" />;
    }
  };

  const getEventBadge = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'CALL_SUCCEEDED':
        return (
          <span className="text-[11px] font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 px-2 py-0.5 rounded">
            Succeeded
          </span>
        );
      case 'CALL_FAILED':
        return (
          <span className="text-[11px] font-mono text-[#F87171] bg-[#F87171]/10 border border-[#F87171]/20 px-2 py-0.5 rounded">
            Failed (0 fee)
          </span>
        );
      case 'PAYMENT_SETTLED':
        return (
          <span className="text-[11px] font-mono text-[#6D001A] bg-[#6D001A]/15 border border-[#6D001A]/30 px-2 py-0.5 rounded">
            Settled
          </span>
        );
      case 'SCORE_CHANGED':
        return (
          <span className="text-[11px] font-mono text-[#FBBF24] bg-[#FBBF24]/10 border border-[#FBBF24]/20 px-2 py-0.5 rounded">
            Reputation
          </span>
        );
    }
  };

  return (
    <div className="space-y-2.5">
      <AnimatePresence initial={false}>
        {displayedEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)] hover:border-[rgba(255,255,255,0.10)] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-[#160B0F] border border-[rgba(255,255,255,0.10)] shrink-0">
                {getEventIcon(event.type)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-[#FFFFFF] truncate">
                    {event.serviceName}
                  </span>
                  {getEventBadge(event.type)}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#D4D4D8] mt-0.5 font-mono">
                  <span>Buyer: {truncateAddress(event.buyerAddress)}</span>
                  {event.latencyMs && (
                    <>
                      <span>·</span>
                      <span>{event.latencyMs}ms</span>
                    </>
                  )}
                  {event.amountUSDC !== undefined && event.amountUSDC > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-[#2DD4BF] font-semibold">
                        {formatUSDC(event.amountUSDC)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[rgba(255,255,255,0.10)]">
              <span className="text-xs text-[#8E8E93] font-mono" suppressHydrationWarning>
                {mounted ? formatTimeAgo(event.timestamp) : 'recently'}
              </span>
              {event.txHash && event.txHash !== '0x0000000000000000000000000000000000000000000000000000000000000000' && (
                <a
                  href={getSnowtraceUrl(event.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#6D001A] hover:text-[#FFFFFF] font-mono bg-[#160B0F] border border-[rgba(255,255,255,0.10)] px-2 py-1 rounded transition-colors"
                  title="View on Snowtrace (Avalanche)"
                >
                  <span>{truncateTx(event.txHash, 4)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}


