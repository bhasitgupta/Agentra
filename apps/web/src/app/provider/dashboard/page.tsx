'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  MOCK_PROVIDER_CALLS,
  MOCK_EARNINGS_CHART,
  REFERENCE_SERVICES,
} from '@/lib/mockData';
import { formatUSDC, truncateAddress, truncateTx, getSnowtraceUrl } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  DollarSign,
  PhoneCall,
  ShieldCheck,
  Zap,
  Plus,
  ExternalLink,
  Pause,
  Play,
  Layers,
  Activity,
  Settings,
  Sliders,
} from 'lucide-react';

export default function ProviderDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'calls' | 'settings'>('overview');
  const [serviceStatus, setServiceStatus] = useState<Record<string, boolean>>({
    'ev-market-data': true,
  });

  const toggleService = (slug: string) => {
    setServiceStatus((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const myServices = REFERENCE_SERVICES.slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#F1F0FF] tracking-tight">
            Provider Dashboard
          </h1>
          <p className="text-sm text-[#9B99C4] mt-1">
            Manage your AI endpoints, monitor real-time earnings, and track escrow settlements on Avalanche.
          </p>
        </div>

        <Link href="/provider/new">
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Register New Service
          </Button>
        </Link>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E1E3A] pb-3 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'services', label: 'My Services', icon: Layers },
          { id: 'calls', label: 'Call History', icon: PhoneCall },
          { id: 'settings', label: 'Payout Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              type="button"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#14142A] text-[#8B5CF6] border border-[#2D2D52]'
                  : 'text-[#9B99C4] hover:text-[#F1F0FF]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 4 StatCards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              label="Earnings (Today)"
              value="$3.40 USDC"
              trend={{ value: '+14.2% vs yesterday', isPositive: true }}
              icon={<DollarSign className="w-4 h-4 text-[#34D399]" />}
            />
            <StatCard
              label="Verified Calls (Today)"
              value="340"
              trend={{ value: '+8.5% volume', isPositive: true }}
              icon={<PhoneCall className="w-4 h-4 text-[#8B5CF6]" />}
            />
            <StatCard
              label="Success Rate"
              value="99.4%"
              subtitle="0 disputes filed"
              icon={<ShieldCheck className="w-4 h-4 text-[#34D399]" />}
            />
            <StatCard
              label="Trust Score"
              value="91 / 100"
              subtitle="Established tier"
              icon={<Zap className="w-4 h-4 text-[#FBBF24]" />}
            />
          </div>

          {/* 7-day Earnings Chart */}
          <div className="p-6 rounded-2xl bg-[#0E0E1A] border border-[#1E1E3A]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-[#F1F0FF]">7-Day Revenue Velocity</h3>
                <p className="text-xs text-[#9B99C4]">USDC settled via Avalanche Escrow</p>
              </div>
              <span className="text-xs font-mono text-[#34D399] bg-[#34D399]/10 px-2.5 py-1 rounded-full border border-[#34D399]/20">
                Total: $19.00 USDC
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_EARNINGS_CHART}>
                  <defs>
                    <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    stroke="#5C5A8A"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#1E1E3A' }}
                  />
                  <YAxis
                    stroke="#5C5A8A"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: '#1E1E3A' }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0E0E1A',
                      borderColor: '#2D2D52',
                      borderRadius: '8px',
                      color: '#F1F0FF',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#earningsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Calls Table */}
          <div className="p-6 rounded-2xl bg-[#0E0E1A] border border-[#1E1E3A]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#F1F0FF]">Live Call Telemetry</h3>
              <span className="text-xs text-[#5C5A8A] font-mono">Auto-refreshed via SSE</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1E1E3A] text-[#5C5A8A]">
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Caller</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Latency</th>
                    <th className="pb-3 font-medium">Settled Amount</th>
                    <th className="pb-3 font-medium text-right">Proof Tx</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E3A]">
                  {MOCK_PROVIDER_CALLS.map((call) => (
                    <tr key={call.id} className="hover:bg-[#14142A]/50 transition-colors">
                      <td className="py-3 text-[#F1F0FF] font-sans font-semibold">
                        {call.serviceName}
                      </td>
                      <td className="py-3 text-[#9B99C4]">
                        {truncateAddress(call.buyerAddress, 4)}
                      </td>
                      <td className="py-3">
                        {call.status === 'SUCCEEDED' ? (
                          <span className="text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded text-[11px]">
                            200 OK
                          </span>
                        ) : (
                          <span className="text-[#F87171] bg-[#F87171]/10 px-2 py-0.5 rounded text-[11px]">
                            504 TIMEOUT
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-[#9B99C4]">{call.latencyMs}ms</td>
                      <td className="py-3 font-semibold text-[#34D399]">
                        {formatUSDC(call.amountUSDC)}
                      </td>
                      <td className="py-3 text-right">
                        {call.txHash && call.txHash !== '0x0000000000000000000000000000000000000000000000000000000000000000' ? (
                          <a
                            href={getSnowtraceUrl(call.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#A78BFA] hover:text-[#F1F0FF]"
                          >
                            <span>{truncateTx(call.txHash, 3)}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[#5C5A8A]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-[#0E0E1A] border border-[#1E1E3A]">
            <h3 className="text-base font-bold text-[#F1F0FF] mb-4">Active Listed Services</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1E1E3A] text-[#5C5A8A]">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Trust Score</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E3A]">
                  {myServices.map((s) => {
                    const isRunning = serviceStatus[s.slug] ?? true;
                    return (
                      <tr key={s.slug} className="hover:bg-[#14142A]/50">
                        <td className="py-3 font-sans font-semibold text-[#F1F0FF]">
                          <Link href={`/services/${s.slug}`} className="hover:text-[#8B5CF6]">
                            {s.name}
                          </Link>
                        </td>
                        <td className="py-3 text-[#9B99C4] uppercase">{s.category}</td>
                        <td className="py-3 text-[#34D399] font-semibold">{formatUSDC(s.price)}</td>
                        <td className="py-3 text-[#F1F0FF]">{s.trustScore}/100</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              isRunning
                                ? 'bg-[#34D399]/10 text-[#34D399]'
                                : 'bg-[#FBBF24]/10 text-[#FBBF24]'
                            }`}
                          >
                            {isRunning ? 'ACTIVE' : 'PAUSED'}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => toggleService(s.slug)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#14142A] hover:bg-[#1E1E3A] text-[#9B99C4] hover:text-[#F1F0FF] border border-[#1E1E3A] cursor-pointer"
                          >
                            {isRunning ? (
                              <>
                                <Pause className="w-3 h-3 text-[#FBBF24]" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 text-[#34D399]" />
                                <span>Resume</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calls' && (
        <div className="p-6 rounded-2xl bg-[#0E0E1A] border border-[#1E1E3A] space-y-4">
          <h3 className="text-base font-bold text-[#F1F0FF]">Historical Calls Log</h3>
          <p className="text-xs text-[#9B99C4]">All incoming x402 payment authorization records.</p>
          <div className="space-y-2">
            {MOCK_PROVIDER_CALLS.map((call) => (
              <div
                key={call.id}
                className="p-3 rounded-xl bg-[#14142A] border border-[#1E1E3A] flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <span className="text-[#F1F0FF] font-semibold">{call.serviceName}</span>
                  <span className="text-[#5C5A8A] block">From {call.buyerAddress}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#34D399] font-bold">{formatUSDC(call.amountUSDC)}</span>
                  <span className="text-[#5C5A8A] block">{call.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-[#0E0E1A] border border-[#1E1E3A] max-w-xl space-y-4">
          <h3 className="text-base font-bold text-[#F1F0FF]">Payout Configuration</h3>
          <p className="text-xs text-[#9B99C4]">
            USDC will automatically stream to this Avalanche C-Chain address when receipts settle.
          </p>
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-medium text-[#9B99C4] uppercase tracking-wider block mb-1">
                Payout Recipient Address
              </label>
              <input
                type="text"
                defaultValue="0x32A478F59C72E6F22e4Bca3d9c7f6071B8B36F72"
                className="w-full h-10 px-3 rounded-lg bg-[#07070F] border border-[#1E1E3A] text-xs font-mono text-[#F1F0FF] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
            <Button variant="primary" size="sm">
              Save Payout Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
