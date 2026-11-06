'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { REFERENCE_SERVICES } from '@/lib/mockData';
import { fetchStats, StatsResponse } from '@/lib/api';
import { ShieldCheck, Zap, ArrowRight, Sparkles, Layers, Lock, TrendingUp, Terminal } from 'lucide-react';

const C = {
  bg:        '#081919',
  surface:   '#223330',
  elevated:  '#2a3a37',
  accent:    '#CE1A1E',
  accentDk:  '#65060E',
  muted:     '#837F78',
  text:      '#E8EBE4',
  textSec:   '#A8ADA6',
  success:   '#2DD4BF',
  border:    'rgba(131,127,120,0.28)',
};

export default function LandingPage() {
  const featured = REFERENCE_SERVICES.slice(0, 3);
  const [stats, setStats] = useState<StatsResponse>({
    totalVerifiedCalls: 861,
    totalVolumeUsdc: '11.29',
    activeServicesCount: 6,
    averageLatencyMs: 680,
    settlementGuarantee: '100%',
  });

  useEffect(() => {
    fetchStats().then((s) => s && setStats(s)).catch(() => {});
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Provider Lists Service',
      desc: 'Set pricing in USDC per call, define schemas, connect payout address on Avalanche.',
      icon: Layers,
    },
    {
      num: '02',
      title: 'Agent Discovers & Calls',
      desc: 'Autonomous agent queries the registry, receives HTTP 402 Payment Required challenge.',
      icon: Terminal,
    },
    {
      num: '03',
      title: 'Pay-on-Success Receipt',
      desc: 'Service executes. Both sign payload digest. USDC unlocked only on valid 200 response.',
      icon: ShieldCheck,
    },
    {
      num: '04',
      title: 'Atomic Settlement',
      desc: 'USDC settles on-chain. Reputation oracle updates Trust Score in real time.',
      icon: TrendingUp,
    },
  ];

  const statItems = [
    { label: 'Verified Calls', value: stats.totalVerifiedCalls.toLocaleString(), mono: true },
    { label: 'USDC Settled', value: `$${Number(stats.totalVolumeUsdc).toFixed(2)}`, mono: true },
    { label: 'Active Services', value: stats.activeServicesCount.toString(), mono: false },
    { label: 'Avg Latency', value: `${stats.averageLatencyMs}ms`, mono: true },
  ];

  return (
    <div className="flex flex-col w-full">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative w-full pt-20 pb-24 md:pt-32 md:pb-36 hero-gradient-mesh overflow-hidden border-b border-[rgba(131,127,120,0.18)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">

          {/* Hero Logo Emblem */}
          <div className="relative mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-[#CE1A1E]/50 shadow-2xl shadow-[#CE1A1E]/30 bg-[#081919] p-1">
              <img src="/logo.png" alt="Agentra" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="absolute -inset-2 rounded-2xl bg-[#CE1A1E]/20 blur-xl -z-10" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#223330] border border-[rgba(206,26,30,0.35)] text-xs font-mono text-[#CE1A1E] mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Autonomous Agent Economy · x402 Protocol</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#E8EBE4] leading-[1.1] mb-6 max-w-5xl">
            Agents can finally{' '}
            <span className="relative">
              <span className="text-[#CE1A1E]">shop.</span>
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#A8ADA6] max-w-2xl mb-10 leading-relaxed">
            Find an AI service, pay in USDC <strong className="text-[#E8EBE4]">only when it works</strong>, and rate it with cryptographic proof you paid. The only marketplace with zero-charge on failure.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <Link href="/demo">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Watch the Demo
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="secondary" size="lg">
                Browse Services
              </Button>
            </Link>
            <Link href="/provider/new">
              <Button variant="outline" size="lg">
                List a Service
              </Button>
            </Link>
          </div>

          {/* Live stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
            {statItems.map((s) => (
              <div key={s.label} className="p-4 rounded-xl bg-[#223330]/80 border border-[rgba(131,127,120,0.28)] text-center">
                <div className={`text-xl font-black text-[#E8EBE4] mb-0.5 ${s.mono ? 'font-mono' : ''}`}>
                  {s.value}
                </div>
                <div className="text-[11px] text-[#837F78] uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ───────────────────────────────────── */}
      <section className="py-20 border-b border-[rgba(131,127,120,0.18)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-[#CE1A1E] uppercase tracking-widest">Protocol</span>
            <h2 className="text-3xl font-black text-[#E8EBE4] mt-2">How x402 Pay-on-Success works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="p-6 rounded-2xl bg-[#223330] border border-[rgba(131,127,120,0.28)] card-hover-glow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-xs text-[#CE1A1E] font-bold">{step.num}</span>
                    <div className="w-8 h-8 rounded-lg bg-[#65060E]/30 border border-[#CE1A1E]/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#CE1A1E]" />
                    </div>
                  </div>
                  <h3 className="font-bold text-[#E8EBE4] text-sm mb-2">{step.title}</h3>
                  <p className="text-xs text-[#A8ADA6] leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pay-on-Success explainer ────────────────────────── */}
      <section className="py-20 border-b border-[rgba(131,127,120,0.18)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono text-[#CE1A1E] uppercase tracking-widest">Zero-Charge Guarantee</span>
              <h2 className="text-3xl font-black text-[#E8EBE4]">Failure costs nothing. Success settles instantly.</h2>
              <p className="text-[#A8ADA6] leading-relaxed">
                Every service call goes through a cryptographic escrow pipeline. The provider only receives USDC after delivering a valid result. If it fails, errors, or times out — your balance is untouched.
              </p>
              <div className="space-y-3">
                {[
                  { icon: ShieldCheck, label: 'On-chain receipt for every call', color: '#2DD4BF' },
                  { icon: Lock, label: 'EIP-3009 signed USDC authorization', color: '#CE1A1E' },
                  { icon: Zap, label: 'Sub-second settlement on Avalanche', color: '#F5B544' },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                      <f.icon className="w-3.5 h-3.5" style={{ color: f.color }} />
                    </div>
                    <span className="text-sm text-[#A8ADA6]">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Visual mini-timeline */}
            <div className="space-y-3">
              {[
                { label: 'Agent sends call', status: 'HTTP 402 Challenge', color: '#F5B544', note: '→ Payment required' },
                { label: 'Signs EIP-3009 voucher', status: 'Authorization signed', color: '#CE1A1E', note: '→ Cryptographic proof' },
                { label: 'Provider executes', status: '200 OK + Receipt', color: '#2DD4BF', note: '→ Delivery confirmed' },
                { label: 'USDC settles on-chain', status: 'Atomic settlement', color: '#2DD4BF', note: '→ Trust Score updated' },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#223330] border border-[rgba(131,127,120,0.22)]">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-mono text-[11px] font-bold" style={{ background: `${row.color}22`, color: row.color, border: `1px solid ${row.color}44` }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[#E8EBE4]">{row.label}</div>
                    <div className="text-[11px] text-[#837F78] font-mono">{row.note}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0" style={{ background: `${row.color}18`, color: row.color, border: `1px solid ${row.color}30` }}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Services ───────────────────────────────── */}
      <section className="py-20 border-b border-[rgba(131,127,120,0.18)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-mono text-[#CE1A1E] uppercase tracking-widest">Catalog</span>
              <h2 className="text-3xl font-black text-[#E8EBE4] mt-1">Featured Services</h2>
            </div>
            <Link href="/explore">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featured.map((svc) => (
              <ServiceCard key={svc.slug} service={svc} />
            ))}
          </div>
        </div>
      </section>

      {/* ── For Providers & Builders CTA ───────────────────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Provider CTA */}
            <div className="p-8 rounded-2xl bg-[#223330] border border-[rgba(131,127,120,0.28)] card-hover-glow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#65060E]/30 border border-[#CE1A1E]/20 flex items-center justify-center">
                <Layers className="w-5 h-5 text-[#CE1A1E]" />
              </div>
              <h3 className="text-xl font-black text-[#E8EBE4]">For Providers</h3>
              <p className="text-sm text-[#A8ADA6] leading-relaxed">
                List your API in under 5 minutes. Receive USDC directly to your wallet with instant settlement and on-chain reputation building.
              </p>
              <Link href="/provider/new">
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  List a Service
                </Button>
              </Link>
            </div>
            {/* Builder CTA */}
            <div className="p-8 rounded-2xl bg-[#223330] border border-[rgba(131,127,120,0.28)] card-hover-glow space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-[#2DD4BF]" />
              </div>
              <h3 className="text-xl font-black text-[#E8EBE4]">For Agent Builders</h3>
              <p className="text-sm text-[#A8ADA6] leading-relaxed">
                Integrate in minutes via REST or MCP JSON-RPC 2.0. The SDK handles x402 challenges, EIP-3009 signing, and receipt verification automatically.
              </p>
              <div className="bg-[#081919] rounded-xl p-4 font-mono text-xs text-[#2DD4BF] border border-[rgba(131,127,120,0.22)]">
                <div className="text-[#837F78]">// 3-line integration</div>
                <div className="text-[#E8EBE4]">{'const client = new AgentraClient({ signer });'}</div>
                <div className="text-[#E8EBE4]">{'const result = await client.call("ev-market-data", query);'}</div>
                <div className="text-[#2DD4BF]">{'// USDC deducted only on success ✓'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
