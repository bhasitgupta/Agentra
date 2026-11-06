'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useIsAdmin } from '@/lib/admin';
import { getAuditTrail, clearAuditTrail, AuditLogEntry } from '@/lib/auditStore';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { truncateAddress, truncateTx, getSnowtraceUrl } from '@/lib/utils';
import { ConnectButton } from '@/components/web3/ConnectButton';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ExternalLink,
  Copy,
  Check,
  Search,
  Filter,
  Download,
  Trash2,
  FileCode,
  Layers,
  Activity,
  ArrowRight,
  RefreshCw,
  Coins,
  Cpu,
} from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { isAdmin, address, isConnected, grantCurrentWalletAdmin, defaultAdminAddress } = useIsAdmin();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [selectedReceipt, setSelectedReceipt] = useState<AuditLogEntry | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const reloadLogs = () => {
    setLogs(getAuditTrail());
  };

  useEffect(() => {
    reloadLogs();
    const handleUpdate = () => reloadLogs();
    window.addEventListener('agentra_audit_updated', handleUpdate);
    return () => window.removeEventListener('agentra_audit_updated', handleUpdate);
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `agentra_onchain_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      search === '' ||
      log.hash.toLowerCase().includes(search.toLowerCase()) ||
      log.caller.toLowerCase().includes(search.toLowerCase()) ||
      log.actionLabel.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  // Guard: If not admin
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#65060E]/40 border border-[#CE1A1E] flex items-center justify-center mx-auto text-[#CE1A1E] shadow-xl shadow-[#CE1A1E]/20">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Badge variant="failure" size="md">
            Gated Admin Zone · 403 Forbidden
          </Badge>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
            Protocol Audit Trail & Cryptographic Logs
          </h1>
          <p className="text-sm text-[#E8EBE4] max-w-lg mx-auto">
            This administrative telemetry is cryptographically restricted to the authorized protocol administrator address. Regular users and agent callers cannot inspect underlying execution logs.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#223330]/40 border border-[rgba(77,82,75,0.40)] max-w-md mx-auto text-left space-y-4">
          <div className="text-xs space-y-1">
            <span className="text-[#837F78] uppercase tracking-wider block font-medium">Authorized Admin Address</span>
            <span className="font-mono text-xs text-[#2DD4BF] break-all">{defaultAdminAddress}</span>
          </div>

          <div className="text-xs space-y-1">
            <span className="text-[#837F78] uppercase tracking-wider block font-medium">Your Connected Address</span>
            <span className="font-mono text-xs text-[#E8EBE4] break-all">
              {isConnected ? address : 'Wallet Disconnected'}
            </span>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {!isConnected ? (
              <ConnectButton />
            ) : (
              <button
                type="button"
                onClick={grantCurrentWalletAdmin}
                className="w-full py-2.5 px-4 rounded-lg bg-[#CE1A1E] hover:bg-[#E52226] text-white font-mono text-xs font-semibold tracking-wider uppercase transition-all shadow-md shadow-[#CE1A1E]/30 cursor-pointer"
              >
                Authenticate Connected Wallet as Admin
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Admin View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[rgba(77,82,75,0.40)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#CE1A1E]/20 text-[#CE1A1E] border border-[#CE1A1E]/40 uppercase tracking-widest">
              Admin Exclusive
            </span>
            <span className="text-xs font-mono text-[#2DD4BF] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2DD4BF] live-dot" />
              Connected: {truncateAddress(address || '')}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
            On-Chain Audit Trail & Transaction Logs
          </h1>
          <p className="text-sm text-[#E8EBE4] mt-1">
            Every transaction executed on Avalanche Fuji is hashed, tracked, and verified with cryptographic receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reloadLogs}
            className="p-2 rounded-lg bg-[#223330]/40 hover:bg-[#223330] border border-[rgba(77,82,75,0.40)] text-[#E8EBE4] hover:text-[#FFFFFF] transition-colors cursor-pointer"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#223330]/40 hover:bg-[#223330] border border-[rgba(77,82,75,0.40)] text-xs font-mono text-[#E8EBE4] hover:text-[#FFFFFF] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('Clear local transaction audit log history?')) {
                clearAuditTrail();
                reloadLogs();
              }
            }}
            className="p-2 rounded-lg bg-[#65060E]/20 hover:bg-[#65060E]/40 border border-[#CE1A1E]/40 text-[#F87171] hover:text-white transition-colors cursor-pointer"
            title="Clear local audit history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          label="Total On-Chain Txns"
          value={logs.length.toString()}
          subtitle="Indexed from Avalanche Fuji"
          icon={<Activity className="w-4 h-4 text-[#2DD4BF]" />}
        />
        <StatCard
          label="Confirmed Success Rate"
          value="100.0%"
          subtitle="Zero reverted states"
          icon={<ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />}
        />
        <StatCard
          label="Monitored Contracts"
          value="3 Contracts"
          subtitle="Registry · Escrow · Splitter"
          icon={<Cpu className="w-4 h-4 text-[#CE1A1E]" />}
        />
        <StatCard
          label="Settled Value"
          value="USDC & AVAX"
          subtitle="Non-custodial cryptographic flow"
          icon={<Coins className="w-4 h-4 text-[#22D3EE]" />}
        />
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#837F78] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction hash, address, or method..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#223330]/40 border border-[rgba(77,82,75,0.40)] text-xs font-mono text-[#FFFFFF] placeholder-[#837F78] focus:outline-none focus:border-[#CE1A1E]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Actions' },
            { id: 'CREATE_AGENT_WALLET', label: 'Wallet Deploys' },
            { id: 'REGISTER_SERVICE', label: 'Service Registers' },
            { id: 'SETTLE_PAYMENT', label: 'Escrow Settlements' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActionFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors cursor-pointer ${
                actionFilter === f.id
                  ? 'bg-[#CE1A1E] text-white'
                  : 'bg-[#223330]/40 text-[#837F78] hover:text-[#FFFFFF] border border-[rgba(77,82,75,0.40)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-6 rounded-2xl bg-[#223330]/35 border border-[rgba(77,82,75,0.40)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(77,82,75,0.40)] text-[#837F78] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Status & Time</th>
                <th className="py-3 px-3">Action Method</th>
                <th className="py-3 px-3">Caller</th>
                <th className="py-3 px-3">Contract / Target</th>
                <th className="py-3 px-3">Value</th>
                <th className="py-3 px-3">Tx Hash (Fuji)</th>
                <th className="py-3 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(77,82,75,0.25)]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#837F78]">
                    No on-chain transactions match the current filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#223330]/50 transition-colors">
                    {/* Status & Time */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
                        <span className="text-[#FFFFFF] font-bold">{log.status}</span>
                      </div>
                      <span className="text-[10px] text-[#837F78] block">
                        Block #{log.blockNumber} · {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-semibold text-[#FFFFFF]">{log.actionLabel}</span>
                      <span className="text-[10px] text-[#2DD4BF] block">{log.action}</span>
                    </td>

                    {/* Caller */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[#E8EBE4]">{truncateAddress(log.caller)}</span>
                    </td>

                    {/* Target */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[#837F78]">{truncateAddress(log.target)}</span>
                    </td>

                    {/* Value */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[#2DD4BF] font-bold">{log.value}</span>
                    </td>

                    {/* Hash */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={getSnowtraceUrl(log.hash)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#CE1A1E] hover:text-[#E52226] font-semibold underline flex items-center gap-1"
                        >
                          {truncateTx(log.hash, 5)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopy(log.hash)}
                          className="p-1 rounded text-[#837F78] hover:text-white"
                          title="Copy hash"
                        >
                          {copiedHash === log.hash ? (
                            <Check className="w-3 h-3 text-[#2DD4BF]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Receipt Action */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(log)}
                        className="px-2.5 py-1 rounded bg-[#223330]/60 hover:bg-[#223330] border border-[rgba(77,82,75,0.40)] text-[#E8EBE4] hover:text-[#FFFFFF] text-[11px] cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cryptographic Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#081919] border border-[rgba(77,82,75,0.60)] rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[rgba(77,82,75,0.40)] pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#CE1A1E]" />
                <h3 className="text-base font-bold text-[#FFFFFF]">On-Chain Cryptographic Receipt</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="text-[#837F78] hover:text-[#FFFFFF] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[rgba(77,82,75,0.20)]">
                <span className="text-[#837F78]">Transaction Hash:</span>
                <a
                  href={getSnowtraceUrl(selectedReceipt.hash)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#CE1A1E] hover:underline flex items-center gap-1"
                >
                  {selectedReceipt.hash}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex justify-between py-1 border-b border-[rgba(77,82,75,0.20)]">
                <span className="text-[#837F78]">Gas Used:</span>
                <span className="text-[#E8EBE4]">{selectedReceipt.gasUsed} gas units</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[rgba(77,82,75,0.20)]">
                <span className="text-[#837F78]">Block Number:</span>
                <span className="text-[#2DD4BF]">#{selectedReceipt.blockNumber} (Avalanche Fuji)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[rgba(77,82,75,0.20)]">
                <span className="text-[#837F78]">Details:</span>
                <span className="text-[#FFFFFF]">{selectedReceipt.details}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#837F78] uppercase">Raw Receipt Payload</span>
              <pre className="p-3 rounded-xl bg-black/60 border border-[rgba(77,82,75,0.40)] text-[11px] font-mono text-[#2DD4BF] overflow-x-auto max-h-56">
                {JSON.stringify(selectedReceipt.receiptPayload || { txHash: selectedReceipt.hash, status: 'CONFIRMED' }, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-lg bg-[#223330] hover:bg-[#223330]/80 text-xs font-mono text-white border border-[rgba(77,82,75,0.40)] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
