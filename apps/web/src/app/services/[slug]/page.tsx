'use client';

import React, { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { REFERENCE_SERVICES, MOCK_ACTIVITY_FEED } from '@/lib/mockData';
import { executeGatewayCall, fetchServiceDetail, fetchServiceActivity } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { TrustScore } from '@/components/ui/TrustScore';
import { PriceTag } from '@/components/ui/PriceTag';
import { Button } from '@/components/ui/Button';
import { WalletAddress } from '@/components/web3/WalletAddress';
import { formatUSDC, truncateTx, getSnowtraceUrl } from '@/lib/utils';
import {
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Play,
  Terminal,
  FileCode,
  ArrowLeft,
  ExternalLink,
  Lock,
} from 'lucide-react';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const service = REFERENCE_SERVICES.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'activity' | 'reviews'>('overview');
  const [sdkLanguage, setSdkLanguage] = useState<'ts' | 'curl' | 'python'>('ts');
  const [codeCopied, setCodeCopied] = useState(false);

  // "Try it" execution simulation
  const [tryInput, setTryInput] = useState(
    JSON.stringify(
      service.inputSchema?.properties
        ? Object.fromEntries(
            Object.entries(service.inputSchema.properties).map(([k, v]: [string, any]) => [
              k,
              v.example || 'test',
            ])
          )
        : { query: 'Karnataka', limit: 10 },
      null,
      2
    )
  );
  const [isCalling, setIsCalling] = useState(false);
  const [executionReceipt, setExecutionReceipt] = useState<any | null>(null);

  const handleExecuteCall = async () => {
    setIsCalling(true);
    setExecutionReceipt(null);

    let parsedInput: any = {};
    try {
      parsedInput = JSON.parse(tryInput);
    } catch {
      parsedInput = { query: tryInput };
    }

    try {
      const isFlaky = service.slug === 'flaky-translate';
      const result = await executeGatewayCall(service.slug, parsedInput, undefined, isFlaky);
      setIsCalling(false);
      setExecutionReceipt({
        status: result.status,
        latencyMs: result.latencyMs,
        chargedUSDC: result.chargedUSDC,
        proofHash: result.receipt || result.txHash,
        protected: result.isFlakyZeroFee || result.status !== 200,
        error: result.error,
        timestamp: new Date().toISOString(),
        payload: result.data || (result.error ? { error: result.error } : null),
      });
    } catch (err: any) {
      setIsCalling(false);
      setExecutionReceipt({
        status: 500,
        error: err.message,
        chargedUSDC: 0.000,
        protected: true,
      });
    }
  };

  const getCodeSnippet = () => {
    if (sdkLanguage === 'ts') {
      return `import { AgentraClient } from '@agentra/sdk';

const agentra = new AgentraClient({
  privateKey: process.env.AGENT_WALLET_KEY,
  rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
});

// Call with automatic x402 escrow payment
const response = await agentra.callService('${service.slug}', ${tryInput});

console.log('Result:', response.data);
console.log('USDC Settled:', response.receipt.chargedUSDC);`;
    }
    if (sdkLanguage === 'curl') {
      return `curl -X POST https://api.agentra.io/v1/services/${service.slug}/call \\
  -H "Authorization: Bearer <AGENTRA_SESSION_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '${tryInput.replace(/\n/g, ' ')}'`;
    }
    return `from agentra import AgentraClient

client = AgentraClient(private_key=os.getenv("AGENT_WALLET_KEY"))

# Executes call and signs 402 payment proof
result = client.call("${service.slug}", ${tryInput.replace(/\n/g, '')})
print("Verified payload:", result.payload)`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(getCodeSnippet());
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Back button */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D4D4D8] hover:text-[#FFFFFF] mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to explore</span>
      </Link>

      {/* Hero Header Block */}
      <div className="rounded-2xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)] p-6 sm:p-8 mb-8">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="category">{service.category.toUpperCase()}</Badge>
              <Badge variant="trust" trustLabel={service.label} />
              {service.isReference && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6D001A] bg-[#6D001A]/15 border border-[#6D001A]/30 px-2.5 py-0.5 rounded-full">
                  <Zap className="w-3 h-3" />
                  Reference Provider
                </span>
              )}
            </div>

            <h1 className="text-3xl font-extrabold text-[#FFFFFF]">{service.name}</h1>
            <p className="text-sm text-[#D4D4D8] max-w-2xl leading-relaxed">
              {service.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#D4D4D8] pt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[#8E8E93]">Provider:</span>
                <WalletAddress address={service.providerAddress} chars={4} />
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[#8E8E93]">Agent ID:</span>
                <span className="text-[#FFFFFF]">#{service.agentId ?? 7}</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[#8E8E93]">Settlement:</span>
                <span className="text-[#2DD4BF]">Avalanche</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-6 p-4 rounded-xl bg-[#160B0F] border border-[rgba(255,255,255,0.10)] shrink-0 self-stretch sm:self-auto justify-around sm:justify-start">
            <TrustScore
              score={service.trustScore}
              label={service.label}
              callsCount={service.verifiedCalls}
              size="lg"
            />
            <div className="space-y-1.5 border-l border-[rgba(255,255,255,0.10)] pl-5 font-mono text-xs">
              <div>
                <span className="text-[#8E8E93] block text-[10px] uppercase">Per Call</span>
                <PriceTag amount={service.price} size="lg" />
              </div>
              <div>
                <span className="text-[#8E8E93] block text-[10px] uppercase">Latency</span>
                <span className="text-[#FFFFFF] font-semibold">{service.p95Ms}ms p95</span>
              </div>
              <div>
                <span className="text-[#8E8E93] block text-[10px] uppercase">Verified Calls</span>
                <span className="text-[#FFFFFF] font-semibold">{service.verifiedCalls}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Split Layout: Left Content (Tabs) + Right Try It / Code Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Tabs & Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tabs bar */}
          <div className="flex items-center gap-1 border-b border-[rgba(255,255,255,0.10)] pb-1">
            {(['overview', 'schema', 'activity', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#160B0F] text-[#6D001A] border border-[rgba(255,255,255,0.10)]'
                    : 'text-[#D4D4D8] hover:text-[#FFFFFF]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Trust breakdown card */}
              <div className="p-6 rounded-2xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-wider">
                    ERC-8004 Trust Breakdown
                  </h3>
                  <span className="text-xs font-mono text-[#2DD4BF]">
                    {service.trustScore}/100 Overall
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-[#D4D4D8] mb-1">
                      <span>Execution Success Rate (40%)</span>
                      <span className="text-[#FFFFFF] font-mono">{service.successRate ?? 99.2}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#160B0F] overflow-hidden">
                      <div
                        className="h-full bg-[#2DD4BF]"
                        style={{ width: `${service.successRate ?? 99.2}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-[#D4D4D8] mb-1">
                      <span>Latency Stability (25%)</span>
                      <span className="text-[#FFFFFF] font-mono">92% stability</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#160B0F] overflow-hidden">
                      <div className="h-full bg-[#6D001A]" style={{ width: '92%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-[#D4D4D8] mb-1">
                      <span>Verified Call Volume (20%)</span>
                      <span className="text-[#FFFFFF] font-mono">{service.verifiedCalls} calls</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#160B0F] overflow-hidden">
                      <div
                        className="h-full bg-[#2DD4BF]"
                        style={{ width: `${Math.min(service.verifiedCalls / 3, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-[#D4D4D8] mb-1">
                      <span>Dispute Absence (15%)</span>
                      <span className="text-[#FFFFFF] font-mono">100% clean</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#160B0F] overflow-hidden">
                      <div className="h-full bg-[#22D3EE]" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details & Tags */}
              <div className="p-6 rounded-2xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)] space-y-4">
                <h3 className="text-sm font-bold text-[#FFFFFF] uppercase tracking-wider">
                  Service Endpoint Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#160B0F] border border-[rgba(255,255,255,0.10)]">
                    <span className="text-[#8E8E93] block">Protocol</span>
                    <span className="text-[#FFFFFF] font-semibold">x402 HTTPS + Avalanche</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#160B0F] border border-[rgba(255,255,255,0.10)]">
                    <span className="text-[#8E8E93] block">Currency</span>
                    <span className="text-[#2DD4BF] font-semibold">USDC (Testnet)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#160B0F] border border-[rgba(255,255,255,0.10)]">
                    <span className="text-[#8E8E93] block">Payout Address</span>
                    <span className="text-[#FFFFFF] truncate block">
                      {service.providerAddress}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#160B0F] border border-[rgba(255,255,255,0.10)]">
                    <span className="text-[#8E8E93] block">Platform Fee</span>
                    <span className="text-[#6D001A] font-semibold">2.5% Escrow</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Schema */}
          {activeTab === 'schema' && (
            <div className="p-6 rounded-2xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)] space-y-4">
              <h3 className="text-sm font-bold text-[#FFFFFF]">JSON Input Schema</h3>
              <pre className="p-4 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.10)] text-xs font-mono text-[#6D001A] overflow-x-auto">
                {JSON.stringify(service.inputSchema || { type: 'object' }, null, 2)}
              </pre>

              <h3 className="text-sm font-bold text-[#FFFFFF] pt-4">Expected Output Schema</h3>
              <pre className="p-4 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.10)] text-xs font-mono text-[#2DD4BF] overflow-x-auto">
                {JSON.stringify(
                  service.outputSchema || {
                    type: 'object',
                    properties: { data: { type: 'any' }, proofHash: { type: 'string' } },
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}

          {/* Tab 3: Activity */}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#FFFFFF]">Recent Verified Calls</h3>
              <div className="space-y-2">
                {MOCK_ACTIVITY_FEED.filter(
                  (a) => a.serviceSlug === service.slug || a.type === 'CALL_SUCCEEDED'
                )
                  .slice(0, 4)
                  .map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3 rounded-xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2DD4BF]" />
                        <span className="text-[#FFFFFF] font-mono">
                          Caller: {evt.buyerAddress}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-[#2DD4BF]">{formatUSDC(evt.amountUSDC ?? service.price)}</span>
                        <span className="text-[#837F78] inline-flex items-center gap-1 text-xs">
                          #{truncateTx(evt.txHash, 3)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="p-6 rounded-2xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)] space-y-4">
              <h3 className="text-sm font-bold text-[#FFFFFF]">Proof-of-use Agent Attestations</h3>
              <p className="text-xs text-[#D4D4D8]">
                In Agentra, ratings are tied strictly to on-chain settled calls. No free reviews or Sybil reviews are permitted.
              </p>
              <div className="p-4 rounded-xl bg-[#160B0F] border border-[rgba(255,255,255,0.10)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#6D001A]">Agent: 0x71c...49a2</span>
                  <span className="text-xs text-[#2DD4BF] font-mono">5.0 / 5.0 ★</span>
                </div>
                <p className="text-xs text-[#FFFFFF]">
                  &ldquo;Deterministic output schema validated against our EV state tracking agent pipeline. Sub-600ms latency on 100 calls.&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): "Try it" & SDK Snippet */}
        <div className="lg:col-span-5 space-y-6">
          {/* Try It Live Playground */}
          <div className="rounded-2xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)] p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.10)]">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-[#6D001A]" />
                <h3 className="text-sm font-bold text-[#FFFFFF]">Interactive Playground</h3>
              </div>
              <Badge variant="success">Testnet Free Trial</Badge>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#D4D4D8] uppercase tracking-wider mb-1">
                  Request Payload (JSON)
                </label>
                <textarea
                  value={tryInput}
                  onChange={(e) => setTryInput(e.target.value)}
                  className="w-full h-28 p-3 rounded-lg bg-[#000000] border border-[rgba(255,255,255,0.10)] text-xs font-mono text-[#FFFFFF] focus:outline-none focus:border-[#6D001A]"
                />
              </div>

              <Button
                onClick={handleExecuteCall}
                isLoading={isCalling}
                variant="primary"
                className="w-full justify-center"
              >
                Call Service ({formatUSDC(service.price)})
              </Button>

              {/* Execution Receipt Display */}
              {executionReceipt && (
                <div className="mt-4 p-4 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.10)] space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8E8E93]">Status:</span>
                    <span
                      className={
                        executionReceipt.status === 200
                          ? 'text-[#2DD4BF] font-bold'
                          : 'text-[#F87171] font-bold'
                      }
                    >
                      {executionReceipt.status} {executionReceipt.status === 200 ? 'OK' : 'FAIL'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#8E8E93]">Charged:</span>
                    <span className="text-[#2DD4BF]">
                      {formatUSDC(executionReceipt.chargedUSDC)}
                    </span>
                  </div>

                  {executionReceipt.latencyMs && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#8E8E93]">Latency:</span>
                      <span className="text-[#FFFFFF]">{executionReceipt.latencyMs}ms</span>
                    </div>
                  )}

                  {executionReceipt.proofHash && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#8E8E93]">Proof Hash:</span>
                      <span className="text-[#6D001A] truncate max-w-[150px]">
                        {executionReceipt.proofHash}
                      </span>
                    </div>
                  )}

                  {executionReceipt.protected && (
                    <div className="p-2 rounded bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20 mt-2">
                      Zero-charge protection activated. Escrow refunded buyer.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* SDK Code Snippet Panel */}
          <div className="rounded-2xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)] p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.10)]">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#6D001A]" />
                <h3 className="text-sm font-bold text-[#FFFFFF]">Integration Snippet</h3>
              </div>

              {/* Language switcher */}
              <div className="flex items-center gap-1 bg-[#160B0F] p-1 rounded-lg border border-[rgba(255,255,255,0.10)] text-xs">
                {(['ts', 'curl', 'python'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSdkLanguage(lang)}
                    className={`px-2 py-0.5 rounded font-mono transition-colors ${
                      sdkLanguage === lang
                        ? 'bg-[#6D001A] text-white font-semibold'
                        : 'text-[#D4D4D8] hover:text-[#FFFFFF]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mt-3">
              <pre className="p-4 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.10)] text-xs font-mono text-[#FFFFFF] overflow-x-auto leading-relaxed max-h-72">
                {getCodeSnippet()}
              </pre>
              <button
                type="button"
                onClick={handleCopyCode}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#160B0F] hover:bg-[rgba(255,255,255,0.10)] text-[#D4D4D8] hover:text-white border border-[rgba(255,255,255,0.10)] transition-colors"
                title="Copy code"
              >
                {codeCopied ? (
                  <Check className="w-3.5 h-3.5 text-[#2DD4BF]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


