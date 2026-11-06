'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  MOCK_PROVIDER_CALLS,
  MOCK_EARNINGS_CHART,
} from '@/lib/mockData';
import { getRegisteredServices } from '@/lib/servicesStore';
import { Service } from '@/lib/types';
import { fetchProviderSummary, toggleProviderServicePause } from '@/lib/api';
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
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'calls' | 'settings'>('overview');
  const [serviceStatus, setServiceStatus] = useState<Record<string, boolean>>({});
  const [summaryData, setSummaryData] = useState<any>(null);
  const [myServices, setMyServices] = useState<Service[]>([]);

  useEffect(() => {
    const loadServices = () => {
      const registered = getRegisteredServices();
      if (address) {
        const owned = registered.filter(
          (s) => s.providerAddress?.toLowerCase() === address.toLowerCase()
        );
        setMyServices(owned.length > 0 ? owned : registered);
      } else {
        setMyServices(registered);
      }
    };

    loadServices();
    window.addEventListener('agentra_services_updated', loadServices);

    fetchProviderSummary().then((res) => {
      if (res) setSummaryData(res);
    });

    return () => window.removeEventListener('agentra_services_updated', loadServices);
  }, [address]);

  const toggleService = async (slug: string) => {
    const nextState = !serviceStatus[slug];
    setServiceStatus((prev) => ({
      ...prev,
      [slug]: nextState,
    }));
    try {
      await toggleProviderServicePause(slug, !nextState);
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
            Provider Dashboard
          </h1>
          <p className="text-sm text-[#E8EBE4] mt-1">
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
      <div className="flex items-center gap-2 border-b border-[rgba(77,82,75,0.40)] pb-3 mb-8">
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
                  ? 'bg-[#223330]/60 text-[#CE1A1E] border border-[rgba(77,82,75,0.40)]'
                  : 'text-[#E8EBE4] hover:text-[#FFFFFF]'
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
              icon={<DollarSign className="w-4 h-4 text-[#2DD4BF]" />}
            />
            <StatCard
              label="Verified Calls (Today)"
              value="340"
              trend={{ value: '+8.5% volume', isPositive: true }}
              icon={<PhoneCall className="w-4 h-4 text-[#CE1A1E]" />}
            />
            <StatCard
              label="Success Rate"
              value="99.4%"
              subtitle="0 disputes filed"
              icon={<ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />}
            />
            <StatCard
              label="Trust Score"
              value="91 / 100"
              subtitle="Established tier"
              icon={<Zap className="w-4 h-4 text-[#FBBF24]" />}
            />
          </div>

          {/* 7-day Earnings Chart */}
          <div className="p-6 rounded-2xl bg-[#223330]/35 border border-[rgba(77,82,75,0.40)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-[#FFFFFF]">7-Day Revenue Velocity</h3>
                <p className="text-xs text-[#E8EBE4]">USDC settled via Avalanche Escrow</p>
              </div>
              <span className="text-xs font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 px-2.5 py-1 rounded-full border border-[#2DD4BF]/20">
                Total: $19.00 USDC
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_EARNINGS_CHART}>
                  <defs>
                    <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#CE1A1E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#CE1A1E" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    stroke="#837F78"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(77,82,75,0.40)' }}
                  />
                  <YAxis
                    stroke="#837F78"
                    fontSize={12}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(77,82,75,0.40)' }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#223330]/35',
                      borderColor: 'rgba(77,82,75,0.40)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#CE1A1E"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#earningsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Calls Table */}
          <div className="p-6 rounded-2xl bg-[#223330]/35 border border-[rgba(77,82,75,0.40)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#FFFFFF]">Live Call Telemetry</h3>
              <span className="text-xs text-[#837F78] font-mono">Auto-refreshed via SSE</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[rgba(77,82,75,0.40)] text-[#837F78]">
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Caller</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Latency</th>
                    <th className="pb-3 font-medium">Settled Amount</th>
                    <th className="pb-3 font-medium text-right">Proof Tx</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(77,82,75,0.40)]">
                  {MOCK_PROVIDER_CALLS.map((call) => (
                    <tr key={call.id} className="hover:bg-[#223330]/60/50 transition-colors">
                      <td className="py-3 text-[#FFFFFF] font-sans font-semibold">
                        {call.serviceName}
                      </td>
                      <td className="py-3 text-[#E8EBE4]">
                        {truncateAddress(call.buyerAddress, 4)}
                      </td>
                      <td className="py-3">
                        {call.status === 'SUCCEEDED' ? (
                          <span className="text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded text-[11px]">
                            200 OK
                          </span>
                        ) : (
                          <span className="text-[#F87171] bg-[#F87171]/10 px-2 py-0.5 rounded text-[11px]">
                            504 TIMEOUT
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-[#E8EBE4]">{call.latencyMs}ms</td>
                      <td className="py-3 font-semibold text-[#2DD4BF]">
                        {formatUSDC(call.amountUSDC)}
                      </td>
                      <td className="py-3 text-right">
                        {call.txHash && call.txHash !== '0x0000000000000000000000000000000000000000000000000000000000000000' ? (
                          <span className="inline-flex items-center gap-1 font-mono text-xs text-[#837F78]">
                            #{truncateTx(call.txHash, 3)}
                          </span>
                        ) : (
                          <span className="text-[#837F78]">—</span>
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
          <div className="p-6 rounded-2xl bg-[#223330]/35 border border-[rgba(77,82,75,0.40)]">
            <h3 className="text-base font-bold text-[#FFFFFF] mb-4">Active Listed Services</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[rgba(77,82,75,0.40)] text-[#837F78]">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Trust Score</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(77,82,75,0.40)]">
                  {myServices.map((s) => {
                    const isRunning = serviceStatus[s.slug] ?? true;
                    return (
                      <tr key={s.slug} className="hover:bg-[#223330]/60/50">
                        <td className="py-3 font-sans font-semibold text-[#FFFFFF]">
                          <Link href={`/services/${s.slug}`} className="hover:text-[#CE1A1E]">
                            {s.name}
                          </Link>
                        </td>
                        <td className="py-3 text-[#E8EBE4] uppercase">{s.category}</td>
                        <td className="py-3 text-[#2DD4BF] font-semibold">{formatUSDC(s.price)}</td>
                        <td className="py-3 text-[#FFFFFF]">{s.trustScore}/100</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              isRunning
                                ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]'
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
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#223330]/60 hover:bg-[rgba(77,82,75,0.40)] text-[#E8EBE4] hover:text-[#FFFFFF] border border-[rgba(77,82,75,0.40)] cursor-pointer"
                          >
                            {isRunning ? (
                              <>
                                <Pause className="w-3 h-3 text-[#FBBF24]" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 text-[#2DD4BF]" />
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
        <div className="p-6 rounded-2xl bg-[#223330]/35 border border-[rgba(77,82,75,0.40)] space-y-4">
          <h3 className="text-base font-bold text-[#FFFFFF]">Historical Calls Log</h3>
          <p className="text-xs text-[#E8EBE4]">All incoming x402 payment authorization records.</p>
          <div className="space-y-2">
            {MOCK_PROVIDER_CALLS.map((call) => (
              <div
                key={call.id}
                className="p-3 rounded-xl bg-[#223330]/60 border border-[rgba(77,82,75,0.40)] flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <span className="text-[#FFFFFF] font-semibold">{call.serviceName}</span>
                  <span className="text-[#837F78] block">From {call.buyerAddress}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#2DD4BF] font-bold">{formatUSDC(call.amountUSDC)}</span>
                  <span className="text-[#837F78] block">{call.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-[#223330]/35 border border-[rgba(77,82,75,0.40)] max-w-xl space-y-4">
          <h3 className="text-base font-bold text-[#FFFFFF]">Payout Configuration</h3>
          <p className="text-xs text-[#E8EBE4]">
            USDC will automatically stream to this Avalanche C-Chain address when receipts settle.
          </p>
          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-medium text-[#E8EBE4] uppercase tracking-wider block mb-1">
                Payout Recipient Address
              </label>
              <input
                type="text"
                defaultValue="0x32A478F59C72E6F22e4Bca3d9c7f6071B8B36F72"
                className="w-full h-10 px-3 rounded-lg bg-[#081919] border border-[rgba(77,82,75,0.40)] text-xs font-mono text-[#FFFFFF] focus:outline-none focus:border-[#CE1A1E]"
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


