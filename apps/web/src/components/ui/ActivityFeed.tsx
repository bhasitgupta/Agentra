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
        return <CheckCircle2 className="w-4 h-4 text-[#34D399]" />;
      case 'CALL_FAILED':
        return <XCircle className="w-4 h-4 text-[#F87171]" />;
      case 'PAYMENT_SETTLED':
        return <DollarSign className="w-4 h-4 text-[#8B5CF6]" />;
      case 'SCORE_CHANGED':
        return <Award className="w-4 h-4 text-[#FBBF24]" />;
    }
  };

  const getEventBadge = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'CALL_SUCCEEDED':
        return (
          <span className="text-[11px] font-mono text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/20 px-2 py-0.5 rounded">
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
          <span className="text-[11px] font-mono text-[#A78BFA] bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 px-2 py-0.5 rounded">
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
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0E0E1A] border border-[#1E1E3A] hover:border-[#2D2D52] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-[#14142A] border border-[#1E1E3A] shrink-0">
                {getEventIcon(event.type)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-[#F1F0FF] truncate">
                    {event.serviceName}
                  </span>
                  {getEventBadge(event.type)}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#9B99C4] mt-0.5 font-mono">
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
                      <span className="text-[#34D399] font-semibold">
                        {formatUSDC(event.amountUSDC)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1E1E3A]">
              <span className="text-xs text-[#5C5A8A] font-mono" suppressHydrationWarning>
                {mounted ? formatTimeAgo(event.timestamp) : 'recently'}
              </span>
              {event.txHash && event.txHash !== '0x0000000000000000000000000000000000000000000000000000000000000000' && (
                <a
                  href={getSnowtraceUrl(event.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#A78BFA] hover:text-[#F1F0FF] font-mono bg-[#14142A] border border-[#1E1E3A] px-2 py-1 rounded transition-colors"
                  title="View on Snowtrace (Avalanche Fuji)"
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
