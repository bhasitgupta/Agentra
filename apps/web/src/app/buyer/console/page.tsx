'use client';

import React, { useState } from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { WalletAddress } from '@/components/web3/WalletAddress';
import { MOCK_AGENT_WALLETS, DEFAULT_SPEND_POLICY, MOCK_ACTIVITY_FEED } from '@/lib/mockData';
import { CATEGORIES } from '@/lib/constants';
import { formatUSDC, formatUSDCTotal, truncateTx, getSnowtraceUrl } from '@/lib/utils';
import {
  Wallet,
  ShieldAlert,
  Coins,
  History,
  CheckCircle2,
  Lock,
  Plus,
  Save,
  Check,
  ExternalLink,
} from 'lucide-react';

export default function BuyerConsolePage() {
  const [wallets, setWallets] = useState(MOCK_AGENT_WALLETS);
  const [policy, setPolicy] = useState(DEFAULT_SPEND_POLICY);
  const [isSaved, setIsSaved] = useState(false);

  const toggleWallet = (addr: string) => {
    setWallets((prev) =>
      prev.map((w) => (w.address === addr ? { ...w, active: !w.active } : w))
    );
  };

  const toggleCategory = (catId: string) => {
    setPolicy((prev) => {
      const exists = prev.categoryAllowlist.includes(catId);
      return {
        ...prev,
        categoryAllowlist: exists
          ? prev.categoryAllowlist.filter((c) => c !== catId)
          : [...prev.categoryAllowlist, catId],
      };
    });
  };

  const handleSavePolicy = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
            Buyer Agent Console
          </h1>
          <p className="text-sm text-[#D4D4D8] mt-1">
            Manage autonomous shopper wallets, enforce strict spending policies, and verify cryptographic receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Create Agent Wallet
          </Button>
        </div>
      </div>

      {/* Spend Summary StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Today's Spend"
          value="$1.45 USDC"
          subtitle="14 calls executed"
          icon={<Coins className="w-4 h-4 text-[#2DD4BF]" />}
        />
        <StatCard
          label="7-Day Cumulative Spend"
          value="$14.20 USDC"
          subtitle="142 calls executed"
          icon={<Wallet className="w-4 h-4 text-[#6D001A]" />}
        />
        <StatCard
          label="All-Time Verified Spend"
          value="$86.50 USDC"
          subtitle="870 calls settled"
          icon={<History className="w-4 h-4 text-[#22D3EE]" />}
        />
      </div>

      {/* Split Grid: Agent Wallets + Spend Policy Guardrails */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Agent Wallets */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#FFFFFF]">Connected Autonomous Agents</h3>
              <span className="text-xs text-[#D4D4D8] font-mono">
                {wallets.filter((w) => w.active).length} Active
              </span>
            </div>

            <div className="space-y-3">
              {wallets.map((wallet) => (
                <div
                  key={wallet.address}
                  className="p-4 rounded-xl bg-[#160B0F] border border-[rgba(255,255,255,0.10)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#FFFFFF]">{wallet.label}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          wallet.active
                            ? 'bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20'
                            : 'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20'
                        }`}
                      >
                        {wallet.active ? 'ACTIVE' : 'MUTED'}
                      </span>
                    </div>
                    <WalletAddress address={wallet.address} chars={4} />
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="text-right font-mono text-xs">
                      <span className="text-[#2DD4BF] font-bold block">
                        {wallet.balanceUSDC.toFixed(2)} USDC
                      </span>
                      <span className="text-[#8E8E93] text-[11px]">
                        Today: {wallet.todaySpendUSDC.toFixed(2)} USDC
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleWallet(wallet.address)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0C0608] hover:bg-[#1A1A30] text-[#D4D4D8] hover:text-[#FFFFFF] border border-[rgba(255,255,255,0.10)] transition-colors cursor-pointer"
                    >
                      {wallet.active ? 'Pause' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Agent Receipts Table */}
          <div className="p-6 rounded-2xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)]">
            <h3 className="text-base font-bold text-[#FFFFFF] mb-4">
              Recent On-Chain Settlement Receipts
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.10)] text-[#8E8E93]">
                    <th className="pb-3">Service</th>
                    <th className="pb-3">Agent</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Settled</th>
                    <th className="pb-3 text-right">Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.10)]">
                  {MOCK_ACTIVITY_FEED.slice(0, 4).map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#160B0F]/50">
                      <td className="py-3 font-sans font-semibold text-[#FFFFFF]">
                        {rec.serviceName}
                      </td>
                      <td className="py-3 text-[#D4D4D8]">{rec.buyerAddress}</td>
                      <td className="py-3">
                        {rec.type === 'CALL_FAILED' ? (
                          <span className="text-[#F87171]">Zero Fee</span>
                        ) : (
                          <span className="text-[#2DD4BF]">Settled</span>
                        )}
                      </td>
                      <td className="py-3 text-[#2DD4BF] font-bold">
                        {formatUSDC(rec.amountUSDC ?? 0.01)}
                      </td>
                      <td className="py-3 text-right">
                        <a
                          href={getSnowtraceUrl(rec.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#6D001A] hover:text-[#FFFFFF]"
                        >
                          <span>{truncateTx(rec.txHash, 3)}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Spend Policy Guardrails */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)] shadow-xl space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[rgba(255,255,255,0.10)]">
              <ShieldAlert className="w-5 h-5 text-[#6D001A]" />
              <div>
                <h3 className="text-base font-bold text-[#FFFFFF]">Spend Policy Guardrails</h3>
                <p className="text-xs text-[#D4D4D8]">
                  Enforced at the client SDK level before x402 signatures are generated.
                </p>
              </div>
            </div>

            {/* Per-Call Cap */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#D4D4D8] uppercase">Per-Call Cap</span>
                <span className="font-mono text-[#2DD4BF] font-bold">
                  {formatUSDC(policy.perCallCap)}
                </span>
              </div>
              <input
                type="range"
                min="0.010"
                max="0.200"
                step="0.005"
                value={policy.perCallCap}
                onChange={(e) => setPolicy({ ...policy, perCallCap: parseFloat(e.target.value) })}
                className="w-full accent-[#6D001A] cursor-pointer"
              />
              <p className="text-[11px] text-[#8E8E93]">
                Any call requesting more than this will be rejected before calling.
              </p>
            </div>

            {/* Daily Cap */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#D4D4D8] uppercase">Daily Budget Cap</span>
                <span className="font-mono text-[#2DD4BF] font-bold">
                  ${policy.dailyCap.toFixed(2)} USDC
                </span>
              </div>
              <input
                type="range"
                min="1.00"
                max="50.00"
                step="1.00"
                value={policy.dailyCap}
                onChange={(e) => setPolicy({ ...policy, dailyCap: parseFloat(e.target.value) })}
                className="w-full accent-[#6D001A] cursor-pointer"
              />
              <p className="text-[11px] text-[#8E8E93]">
                Daily spend across all agents is throttled once this limit is hit.
              </p>
            </div>

            {/* Min Trust Score */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#D4D4D8] uppercase">Min Trust Score</span>
                <span className="font-mono text-[#FFFFFF] font-bold">
                  {policy.minTrustScore} / 100
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                step="5"
                value={policy.minTrustScore}
                onChange={(e) => setPolicy({ ...policy, minTrustScore: parseInt(e.target.value) })}
                className="w-full accent-[#6D001A] cursor-pointer"
              />
              <p className="text-[11px] text-[#8E8E93]">
                Rejects calls to unverified or provisional providers below this score.
              </p>
            </div>

            {/* Category Allowlist */}
            <div className="space-y-3 pt-2 border-t border-[rgba(255,255,255,0.10)]">
              <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider block">
                Allowed Service Categories
              </span>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                  const checked = policy.categoryAllowlist.includes(cat.id);
                  return (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-[#160B0F] border border-[rgba(255,255,255,0.10)] text-xs text-[#D4D4D8] cursor-pointer hover:border-[rgba(255,255,255,0.10)]"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(cat.id)}
                        className="rounded accent-[#6D001A]"
                      />
                      <span className={checked ? 'text-[#FFFFFF] font-medium' : ''}>
                        {cat.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleSavePolicy}
              variant="primary"
              className="w-full justify-center"
              leftIcon={isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            >
              {isSaved ? 'Policy Saved Successfully' : 'Save Spending Guardrails'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


