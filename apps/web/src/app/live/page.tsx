'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_ACTIVITY_FEED } from '@/lib/mockData';
import { ActivityEvent, FeedEventType } from '@/lib/types';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { Button } from '@/components/ui/Button';
import { fetchRecentActivity, API_BASE_URL } from '@/lib/api';
import { Radio, Pause, Play, Sparkles, Filter, RefreshCw } from 'lucide-react';

export default function LiveFeedPage() {
  const [events, setEvents] = useState<ActivityEvent[]>(MOCK_ACTIVITY_FEED);
  const [filter, setFilter] = useState<string>('ALL');
  const [isStreaming, setIsStreaming] = useState(true);
  const [connectedSSE, setConnectedSSE] = useState(false);

  // Load initial events from backend
  useEffect(() => {
    fetchRecentActivity().then((initial) => {
      if (initial && initial.length > 0) {
        setEvents(initial);
      }
    });
  }, []);

  // Connect to SSE stream
  useEffect(() => {
    if (!isStreaming) return;

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`${API_BASE_URL}/v1/feed`);

      eventSource.onopen = () => {
        setConnectedSSE(true);
      };

      eventSource.addEventListener('marketplace_event', (e: MessageEvent) => {
        try {
          const parsed = JSON.parse(e.data);
          const mappedEvent: ActivityEvent = {
            id: parsed.id || `evt-${Date.now()}`,
            type: parsed.type,
            serviceSlug: parsed.serviceSlug,
            serviceName: parsed.serviceName,
            buyerAddress: parsed.buyerAddress || '0x32A4...6F72',
            amountUSDC: parsed.amountUsdc || 0,
            latencyMs: parsed.latencyMs || 500,
            txHash: parsed.txHash || '0x0000000000000000000000000000000000000000',
            timestamp: parsed.timestamp || new Date().toISOString(),
            details: parsed.details || `${parsed.type} on Avalanche`,
          };
          setEvents((prev) => [mappedEvent, ...prev.slice(0, 39)]);
        } catch {}
      });

      eventSource.onerror = () => {
        setConnectedSSE(false);
        eventSource?.close();
      };
    } catch {
      setConnectedSSE(false);
    }

    return () => {
      eventSource?.close();
    };
  }, [isStreaming]);

  // Fallback simulated generator if SSE is not active
  useEffect(() => {
    if (!isStreaming || connectedSSE) return;

    const interval = setInterval(() => {
      const sampleTypes: FeedEventType[] = [
        'CALL_SUCCEEDED',
        'CALL_SUCCEEDED',
        'PAYMENT_SETTLED',
        'CALL_FAILED',
        'SCORE_CHANGED',
      ];
      const randomType = sampleTypes[Math.floor(Math.random() * sampleTypes.length)];

      const services = [
        { name: 'India EV Market Data', slug: 'ev-market-data', price: 0.010 },
        { name: 'Sentiment Pulse', slug: 'sentiment-pulse', price: 0.005 },
        { name: 'Competitor Intel', slug: 'competitor-intel', price: 0.020 },
        { name: 'Code Review Lite', slug: 'code-review-lite', price: 0.030 },
        { name: 'Flaky Translate', slug: 'flaky-translate', price: 0.005 },
      ];
      const s = services[Math.floor(Math.random() * services.length)];

      const newEvent: ActivityEvent = {
        id: `evt-${Date.now()}`,
        type: randomType,
        serviceSlug: s.slug,
        serviceName: s.name,
        buyerAddress: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
        amountUSDC: randomType === 'CALL_FAILED' ? 0.000 : s.price,
        latencyMs: randomType === 'CALL_FAILED' ? 2600 : Math.floor(400 + Math.random() * 600),
        txHash:
          randomType === 'CALL_FAILED'
            ? '0x0000000000000000000000000000000000000000000000000000000000000000'
            : `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        timestamp: new Date().toISOString(),
        details:
          randomType === 'CALL_FAILED'
            ? '504 Upstream timeout · Buyer protected (0 USDC debited)'
            : '200 OK · Payment settled in Avalanche Escrow',
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 39)]);
    }, 8000);

    return () => clearInterval(interval);
  }, [isStreaming, connectedSSE]);

  const filteredEvents = events.filter((e) => {
    if (filter === 'ALL') return true;
    return e.type === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[rgba(255,255,255,0.10)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${connectedSSE ? 'bg-[#2DD4BF]' : 'bg-[#6D001A]'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${connectedSSE ? 'bg-[#2DD4BF]' : 'bg-[#6D001A]'}`} />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-[#2DD4BF] font-semibold">
              {connectedSSE ? 'Live SSE Stream (Fastify)' : 'Streaming'}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF]">
            Marketplace Live Economy Feed
          </h1>
          <p className="text-sm text-[#D4D4D8] mt-1">
            Real-time feed of service executions, x402 payment settlements, and on-chain Trust Score shifts.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsStreaming(!isStreaming)}
            className="border-[rgba(255,255,255,0.10)]"
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5 mr-1.5 text-[#FBBF24]" />
                Pause Stream
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1.5 text-[#2DD4BF]" />
                Resume Stream
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Aggregate Ticker Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)]">
          <span className="text-xs font-mono text-[#8E8E93] block uppercase">Today's Verified Calls</span>
          <span className="text-xl font-bold font-mono text-[#FFFFFF] mt-1 block">813</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)]">
          <span className="text-xs font-mono text-[#8E8E93] block uppercase">Volume Settled</span>
          <span className="text-xl font-bold font-mono text-[#2DD4BF] mt-1 block">$11.05 USDC</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)]">
          <span className="text-xs font-mono text-[#8E8E93] block uppercase">Avg Latency</span>
          <span className="text-xl font-bold font-mono text-[#6D001A] mt-1 block">680ms</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)]">
          <span className="text-xs font-mono text-[#8E8E93] block uppercase">Pay-On-Success Saved</span>
          <span className="text-xl font-bold font-mono text-[#F87171] mt-1 block">$0.24 USDC</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[rgba(255,255,255,0.10)]">
        {[
          { id: 'ALL', label: 'All Events' },
          { id: 'CALL_SUCCEEDED', label: 'Delivered (200)' },
          { id: 'PAYMENT_SETTLED', label: 'Settled' },
          { id: 'CALL_FAILED', label: 'Zero-Fee Protected' },
          { id: 'SCORE_CHANGED', label: 'Reputation Updates' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-[#160B0F] text-[#FFFFFF] border border-[rgba(255,255,255,0.10)] shadow-xs'
                : 'text-[#D4D4D8] hover:text-[#FFFFFF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stream List */}
      <div className="bg-[#0C0608] border border-[rgba(255,255,255,0.10)] rounded-2xl p-6">
        <ActivityFeed events={filteredEvents} maxItems={40} />
      </div>
    </div>
  );
}


