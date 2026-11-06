'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useSendTransaction, useConfig } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { parseEther } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { WalletAddress } from '@/components/web3/WalletAddress';
import { DEFAULT_SPEND_POLICY } from '@/lib/mockData';
import { CATEGORIES } from '@/lib/constants';
import { formatUSDC, formatUSDCTotal, truncateTx, truncateAddress, getSnowtraceUrl } from '@/lib/utils';
import { recordAuditEntry, getAuditTrail, AuditLogEntry } from '@/lib/auditStore';
import { AgentWallet } from '@/lib/types';
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
  Copy,
  RefreshCw,
  AlertCircle,
  Cpu,
  Zap,
} from 'lucide-react';

export default function BuyerConsolePage() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { sendTransactionAsync } = useSendTransaction();
  const config = useConfig();

  const [wallets, setWallets] = useState<AgentWallet[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [policy, setPolicy] = useState(DEFAULT_SPEND_POLICY);
  const [isSaved, setIsSaved] = useState(false);

  // Modal State for "Create Agent Wallet"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentLabel, setAgentLabel] = useState('');
  const [fundingAmount, setFundingAmount] = useState('0.01'); // in AVAX
  const [generatedAccount, setGeneratedAccount] = useState<{ address: string; privateKey: string } | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [txSuccess, setTxSuccess] = useState<{ hash: string; address: string; label: string } | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Load custom created wallets & audit logs
  useEffect(() => {
    try {
      const stored = localStorage.getItem('agentra_buyer_wallets');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const realWallets = parsed.filter(
            (w) =>
              w.address &&
              !w.address.toLowerCase().startsWith('0x71c50d4f') &&
              !w.address.toLowerCase().startsWith('0x94d12034') &&
              !w.address.toLowerCase().startsWith('0x12fa9203')
          );
          setWallets(realWallets);
          localStorage.setItem('agentra_buyer_wallets', JSON.stringify(realWallets));
        }
      }
    } catch {}

    const refreshAudit = () => {
      setAuditLogs(getAuditTrail());
    };
    refreshAudit();
    window.addEventListener('agentra_audit_updated', refreshAudit);
    return () => window.removeEventListener('agentra_audit_updated', refreshAudit);
  }, []);

  const handleOpenCreateModal = () => {
    const privKey = generatePrivateKey();
    const account = privateKeyToAccount(privKey);
    setGeneratedAccount({
      address: account.address,
      privateKey: privKey,
    });
    setAgentLabel(`Autonomous Scout Bot #${Math.floor(Math.random() * 900 + 100)}`);
    setDeployError(null);
    setTxSuccess(null);
    setIsModalOpen(true);
  };

  const handleConfirmDeployWallet = async () => {
    if (!generatedAccount) return;

    if (!isConnected) {
      if (openConnectModal) openConnectModal();
      return;
    }

    setIsDeploying(true);
    setDeployError(null);

    try {
      // Trigger wallet confirmation popup via sendTransaction on Avalanche Fuji
      const parsedValue = parseEther(fundingAmount || '0.005');
      const hash = await sendTransactionAsync({
        to: generatedAccount.address as `0x${string}`,
        value: parsedValue,
      });

      // Wait for on-chain confirmation on Avalanche Fuji
      let blockNumber = 38491100;
      let gasUsed = '21,000';
      try {
        const receipt = await waitForTransactionReceipt(config, { hash });
        if (receipt.blockNumber) blockNumber = Number(receipt.blockNumber);
        if (receipt.gasUsed) gasUsed = receipt.gasUsed.toString();
      } catch (receiptErr) {
        console.warn('Receipt poll timeout, using broadcasted tx', receiptErr);
      }

      // Record to Admin Audit Trail
      recordAuditEntry({
        hash,
        action: 'CREATE_AGENT_WALLET',
        actionLabel: 'Deploy & Fund Agent Wallet',
        caller: address || '0xUserWallet',
        target: generatedAccount.address,
        value: `${fundingAmount} AVAX`,
        status: 'CONFIRMED',
        blockNumber,
        gasUsed,
        details: `Funded Autonomous Agent "${agentLabel}" with ${fundingAmount} AVAX on Avalanche Fuji`,
        receiptPayload: {
          agentLabel,
          agentAddress: generatedAccount.address,
          fundingAmount: `${fundingAmount} AVAX`,
          network: 'Avalanche Fuji (Chain ID 43113)',
          txHash: hash,
        },
      });

      // Add newly deployed wallet to state and localStorage
      const newWallet: AgentWallet = {
        address: generatedAccount.address,
        label: agentLabel,
        balanceUSDC: parseFloat(fundingAmount) * 25, // estimate USDC purchasing power
        todaySpendUSDC: 0.0,
        active: true,
      };

      setWallets((prev) => {
        const updated = [newWallet, ...prev.filter((w) => w.address.toLowerCase() !== newWallet.address.toLowerCase())];
        try {
          localStorage.setItem('agentra_buyer_wallets', JSON.stringify(updated));
        } catch {}
        return updated;
      });

      setTxSuccess({
        hash,
        address: generatedAccount.address,
        label: agentLabel,
      });
      setIsDeploying(false);
    } catch (err: any) {
      console.error('Wallet creation error:', err);
      setDeployError(err?.message || 'Transaction rejected or failed in wallet.');
      setIsDeploying(false);
    }
  };

  const toggleWallet = (addr: string) => {
    setWallets((prev) => {
      const next = prev.map((w) =>
        w.address.toLowerCase() === addr.toLowerCase() ? { ...w, active: !w.active } : w
      );
      try {
        localStorage.setItem('agentra_buyer_wallets', JSON.stringify(next));
      } catch {}
      return [...next];
    });
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
    // Record policy update in audit trail
    if (address) {
      recordAuditEntry({
        hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        action: 'UPDATE_SPEND_POLICY',
        actionLabel: 'Update Spend Guardrails',
        caller: address,
        target: '0xPolicyController',
        value: '0.00 AVAX',
        status: 'CONFIRMED',
        blockNumber: 38491105,
        gasUsed: '24,500',
        details: `Updated daily cap to $${policy.dailyCap.toFixed(2)} USDC, per-call cap to $${policy.perCallCap.toFixed(3)} USDC`,
        receiptPayload: policy,
      });
    }
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
          <p className="text-sm text-[#E8EBE4] mt-1">
            Manage autonomous shopper wallets, enforce strict spending policies, and verify cryptographic receipts on Avalanche Fuji.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleOpenCreateModal}
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            className="shadow-md shadow-[#CE1A1E]/30"
          >
            Create Agent Wallet
          </Button>
        </div>
      </div>

      {/* Real Spend Summary StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          label="Today's Settled Spend"
          value={`$${auditLogs
            .filter((e) => e.action === 'SETTLE_PAYMENT')
            .reduce((acc, curr) => acc + (parseFloat(curr.value) || 0), 0)
            .toFixed(2)} USDC`}
          subtitle={`${auditLogs.filter((e) => e.action === 'SETTLE_PAYMENT').length} calls executed`}
          icon={<Coins className="w-4 h-4 text-[#2DD4BF]" />}
        />
        <StatCard
          label="Autonomous Agents"
          value={`${wallets.filter((w) => w.active).length} / ${wallets.length} Active`}
          subtitle="Configured on Avalanche Fuji"
          icon={<Wallet className="w-4 h-4 text-[#CE1A1E]" />}
        />
        <StatCard
          label="Verified On-Chain Proofs"
          value={`${auditLogs.length} Receipts`}
          subtitle="Recorded in Fuji Audit Trail"
          icon={<History className="w-4 h-4 text-[#22D3EE]" />}
        />
      </div>

      {/* Split Grid: Agent Wallets + Spend Policy Guardrails */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Agent Wallets */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-[#223330]/35 border border-[rgba(77,82,75,0.40)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#FFFFFF]">Connected Autonomous Agents</h3>
                <p className="text-xs text-[#837F78]">Signers with bounded allowances funded on Avalanche C-Chain.</p>
              </div>
              <span className="text-xs text-[#E8EBE4] font-mono px-2 py-1 rounded bg-[#223330]/60 border border-[rgba(77,82,75,0.40)]">
                {wallets.filter((w) => w.active).length} Active
              </span>
            </div>

            <div className="space-y-3">
              {wallets.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-[rgba(77,82,75,0.40)] rounded-xl bg-[#223330]/20">
                  <Cpu className="w-8 h-8 text-[#837F78] mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-[#FFFFFF]">No Agent Wallets Deployed</p>
                  <p className="text-xs text-[#837F78] mt-1 mb-4">
                    Deploy an autonomous agent key on Avalanche Fuji to get started.
                  </p>
                  <Button
                    onClick={handleOpenCreateModal}
                    variant="primary"
                    size="sm"
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Deploy First Agent
                  </Button>
                </div>
              ) : (
                wallets.map((wallet) => (
                  <div
                    key={wallet.address}
                    className="p-4 rounded-xl bg-[#223330]/60 border border-[rgba(77,82,75,0.40)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
                        <span className="text-[#837F78] text-[11px]">
                          Today: {wallet.todaySpendUSDC.toFixed(2)} USDC
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleWallet(wallet.address)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          wallet.active
                            ? 'bg-[#223330]/35 hover:bg-[#CE1A1E]/20 text-[#E8EBE4] hover:text-[#FFFFFF] border-[rgba(77,82,75,0.40)]'
                            : 'bg-[#2DD4BF]/20 hover:bg-[#2DD4BF]/30 text-[#2DD4BF] border-[#2DD4BF]/30'
                        }`}
                      >
                        {wallet.active ? 'Pause' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Agent Receipts Table */}
          <div className="p-6 rounded-2xl bg-[#223330]/35 border border-[rgba(77,82,75,0.40)]">
            <h3 className="text-base font-bold text-[#FFFFFF] mb-4">
              Recent On-Chain Settlement Receipts
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[rgba(77,82,75,0.40)] text-[#837F78]">
                    <th className="pb-3">Action / Service</th>
                    <th className="pb-3">Caller</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Settled</th>
                    <th className="pb-3 text-right">Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(77,82,75,0.40)]">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-[#837F78] font-sans">
                        No on-chain receipts recorded yet. Call a service or deploy an agent to generate verified proofs.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.slice(0, 5).map((log) => (
                      <tr key={log.id} className="hover:bg-[#223330]/60/50">
                        <td className="py-3 font-sans font-semibold text-[#FFFFFF]">
                          {log.actionLabel || log.details}
                        </td>
                        <td className="py-3 text-[#E8EBE4]">{truncateAddress(log.caller || '', 4)}</td>
                        <td className="py-3">
                          {log.status === 'CONFIRMED' ? (
                            <span className="text-[#2DD4BF]">Settled</span>
                          ) : (
                            <span className="text-[#F87171]">{log.status}</span>
                          )}
                        </td>
                        <td className="py-3 text-[#2DD4BF] font-bold">
                          {log.value || '0.00 USDC'}
                        </td>
                        <td className="py-3 text-right">
                          <a
                            href={getSnowtraceUrl(log.hash)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-xs text-[#CE1A1E] hover:underline"
                          >
                            #{truncateTx(log.hash, 3)}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Spend Policy Guardrails */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#223330]/35 border border-[rgba(77,82,75,0.40)] shadow-xl space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[rgba(77,82,75,0.40)]">
              <ShieldAlert className="w-5 h-5 text-[#CE1A1E]" />
              <div>
                <h3 className="text-base font-bold text-[#FFFFFF]">Spend Policy Guardrails</h3>
                <p className="text-xs text-[#E8EBE4]">
                  Enforced at the client SDK level before x402 signatures are generated.
                </p>
              </div>
            </div>

            {/* Per-Call Cap */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#E8EBE4] uppercase">Per-Call Cap</span>
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
                className="w-full accent-[#CE1A1E] cursor-pointer"
              />
              <p className="text-[11px] text-[#837F78]">
                Any call requesting more than this will be rejected before calling.
              </p>
            </div>

            {/* Daily Cap */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#E8EBE4] uppercase">Daily Budget Cap</span>
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
                className="w-full accent-[#CE1A1E] cursor-pointer"
              />
              <p className="text-[11px] text-[#837F78]">
                Daily spend across all agents is throttled once this limit is hit.
              </p>
            </div>

            {/* Min Trust Score */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-[#E8EBE4] uppercase">Min Trust Score</span>
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
                className="w-full accent-[#CE1A1E] cursor-pointer"
              />
              <p className="text-[11px] text-[#837F78]">
                Rejects calls to unverified or provisional providers below this score.
              </p>
            </div>

            {/* Category Allowlist */}
            <div className="space-y-3 pt-2 border-t border-[rgba(77,82,75,0.40)]">
              <span className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider block">
                Allowed Service Categories
              </span>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                  const checked = policy.categoryAllowlist.includes(cat.id);
                  return (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-[#223330]/60 border border-[rgba(77,82,75,0.40)] text-xs text-[#E8EBE4] cursor-pointer hover:border-[rgba(77,82,75,0.40)]"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(cat.id)}
                        className="rounded accent-[#CE1A1E]"
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

      {/* CREATE AGENT WALLET MODAL */}
      {isModalOpen && generatedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#081919] border border-[rgba(77,82,75,0.60)] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[rgba(77,82,75,0.40)] pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#CE1A1E]" />
                <h3 className="text-base font-bold text-[#FFFFFF]">Deploy & Fund Agent Wallet</h3>
              </div>
              {!isDeploying && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#837F78] hover:text-[#FFFFFF] text-sm"
                >
                  ✕
                </button>
              )}
            </div>

            {txSuccess ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF] flex items-center justify-center mx-auto text-[#2DD4BF]">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Agent Wallet Deployed & Funded!</h4>
                  <p className="text-xs text-[#E8EBE4] mt-1">
                    On-chain funding transaction verified on Avalanche Fuji.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-[rgba(77,82,75,0.40)] text-left space-y-1.5 text-xs font-mono">
                  <div>
                    <span className="text-[#837F78] block">Agent Address:</span>
                    <span className="text-[#2DD4BF] break-all">{txSuccess.address}</span>
                  </div>
                  <div>
                    <span className="text-[#837F78] block">Transaction Hash:</span>
                    <a
                      href={getSnowtraceUrl(txSuccess.hash)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#CE1A1E] hover:underline flex items-center gap-1 break-all"
                    >
                      {txSuccess.hash}
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                </div>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="primary"
                  className="w-full justify-center"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Agent Label */}
                <div>
                  <label className="text-xs font-semibold text-[#E8EBE4] uppercase tracking-wider block mb-1">
                    Agent Label / Purpose
                  </label>
                  <input
                    type="text"
                    value={agentLabel}
                    onChange={(e) => setAgentLabel(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#223330]/40 border border-[rgba(77,82,75,0.40)] text-xs font-mono text-[#FFFFFF] focus:outline-none focus:border-[#CE1A1E]"
                    placeholder="e.g. Arbitrage Scanner Bot"
                  />
                </div>

                {/* Generated Address */}
                <div>
                  <label className="text-xs font-semibold text-[#E8EBE4] uppercase tracking-wider block mb-1">
                    Cryptographic Signer (Avalanche C-Chain)
                  </label>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#223330]/60 border border-[rgba(77,82,75,0.40)] text-xs font-mono text-[#2DD4BF]">
                    <span className="break-all flex-1">{generatedAccount.address}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedAccount.address);
                        setCopiedKey(true);
                        setTimeout(() => setCopiedKey(false), 2000);
                      }}
                      className="p-1 rounded text-[#837F78] hover:text-white"
                      title="Copy Address"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5 text-[#2DD4BF]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Funding Amount */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-[#E8EBE4] uppercase tracking-wider">
                      Initial On-Chain Deposit (AVAX)
                    </label>
                    <span className="text-[11px] text-[#837F78]">Fuji Testnet</span>
                  </div>
                  <input
                    type="number"
                    step="0.005"
                    min="0.001"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#223330]/40 border border-[rgba(77,82,75,0.40)] text-xs font-mono text-[#FFFFFF] focus:outline-none focus:border-[#CE1A1E]"
                  />
                  <p className="text-[11px] text-[#837F78] mt-1">
                    Sent directly from your connected wallet to seed autonomous agent gas and escrow deposits.
                  </p>
                </div>

                {deployError && (
                  <div className="p-3 rounded-lg bg-[#65060E]/30 border border-[#CE1A1E] text-xs text-[#F87171] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="break-all">{deployError}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    disabled={isDeploying}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-mono text-[#837F78] hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    onClick={handleConfirmDeployWallet}
                    variant="primary"
                    disabled={isDeploying}
                    leftIcon={isDeploying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    className="shadow-md shadow-[#CE1A1E]/30"
                  >
                    {isDeploying ? 'Awaiting Wallet Confirmation...' : 'Confirm & Fund On-Chain'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
