'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { ThreeCanvas } from '@/components/ui/ThreeCanvas';
import { REFERENCE_SERVICES } from '@/lib/mockData';
import { fetchStats, StatsResponse } from '@/lib/api';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Layers,
  Lock,
  TrendingUp,
  Terminal,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Radio,
  Sliders,
  Play,
  RotateCcw,
  Check,
  ExternalLink,
  ChevronRight,
  Shield,
  Activity,
  Code2,
} from 'lucide-react';

/* ── Hero Scenarios (Cairn-inspired interactive conversation tabs) ── */
const HERO_SCENARIOS = [
  {
    id: 'protection',
    tag: 'Zero-Fee Protection',
    alert: 'Upstream provider returned a 504 Gateway Timeout during batch processing.',
    reply: 'Escrow automatically voided transaction. Caller charged exactly 0.000 USDC. Failure logged to provider reliability index.',
    link: { label: 'Inspect Zero-Charge Policy', href: '/demo' },
    metric: 'Zero hold time · 100% capital protected',
  },
  {
    id: 'settlement',
    tag: 'Atomic Settlement',
    alert: 'Autonomous research agent requested 42 EV telematics telemetry records.',
    reply: 'Service delivered verified 200 OK with payload proof hash in 582ms. 0.010 USDC settled into provider escrow instantly.',
    link: { label: 'View Live Economy Feed', href: '/live' },
    metric: 'Cryptographic receipt signed by both agents',
  },
  {
    id: 'discovery',
    tag: 'Semantic Discovery',
    alert: 'Trading bot seeks real-time Indian sentiment extraction with p95 < 800ms.',
    reply: 'Semantic registry matched Sentiment Pulse (Trust Score 91, Established). Routing call via non-custodial x402 challenge.',
    link: { label: 'Explore 30+ Service APIs', href: '/explore' },
    metric: 'Discovered, authorized, and routed in 38ms',
  },
];

/* ── Protocol Ecosystem Marquee Badges ── */
const ECOSYSTEM_BADGES = [
  { name: 'x402 Pay-on-Success', icon: ShieldCheck, detail: 'RFC-standard 402 flow' },
  { name: 'Avalanche C-Chain', icon: Zap, detail: 'Sub-second finality' },
  { name: 'EIP-3009 Vouchers', icon: Lock, detail: 'Gasless transfer auth' },
  { name: 'ERC-8004 Trust', icon: Activity, detail: 'On-chain reputation' },
  { name: 'MCP 2.0 Standard', icon: Cpu, detail: 'Anthropic client support' },
  { name: 'Fastify SSE Pipeline', icon: Radio, detail: 'Real-time telemetry' },
];

/* ── Interactive Agent Canvas Steps ── */
const CANVAS_STEPS = [
  {
    id: 'discover',
    num: '01',
    title: 'Discover & Query',
    subtitle: 'Autonomous semantic catalog lookup',
    desc: 'Agents find APIs by capability query or tag. Inspect real-time p95 latency, input/output JSON schemas, and historical Trust Scores before making a single call.',
  },
  {
    id: 'policies',
    num: '02',
    title: 'Define Policies',
    subtitle: 'Cryptographic spend & safety guardrails',
    desc: 'Enforce non-custodial spend policies in plain code: maximum price per execution, strict timeout ceilings, and automatic fallback if provider drops below target Trust Score.',
  },
  {
    id: 'simulate',
    num: '03',
    title: 'Simulate & Protect',
    subtitle: 'Zero-charge failure guarantee',
    desc: 'Test against intermittent upstream timeouts and flaky responses. If the service returns 5xx or exceeds p95 latency, your balance is untouched—zero USDC debited.',
  },
  {
    id: 'settle',
    num: '04',
    title: 'Settle Everywhere',
    subtitle: 'Instant non-custodial payout',
    desc: 'Deploy integration in 3 lines across REST, Python SDK, or MCP server. Providers receive instant payouts with zero credit-card chargeback risk.',
  },
];

export default function LandingPage() {
  const featured = REFERENCE_SERVICES.slice(0, 3);
  const [activeScenarioId, setActiveScenarioId] = useState('protection');
  const [activeCanvasStep, setActiveCanvasStep] = useState(0);

  // Policy toggles in Agent Canvas
  const [policies, setPolicies] = useState([
    { id: 'p1', title: 'Hard spend limit: max $0.050 USDC per call', on: true },
    { id: 'p2', title: 'Require cryptographic SHA-256 proof hash', on: true },
    { id: 'p3', title: 'Auto-drop providers under 60 Trust Score', on: true },
    { id: 'p4', title: 'Abort and debit 0 on latency > 1500ms', on: true },
  ]);

  const togglePolicy = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, on: !p.on } : p))
    );
  };

  const [stats, setStats] = useState<StatsResponse>({
    totalVerifiedCalls: 861,
    totalVolumeUsdc: '11.29',
    activeServicesCount: 6,
    averageLatencyMs: 680,
    settlementGuarantee: '100% On-Chain',
  });

  useEffect(() => {
    fetchStats().then((s) => s && setStats(s)).catch(() => {});
  }, []);

  const activeScenario =
    HERO_SCENARIOS.find((s) => s.id === activeScenarioId) || HERO_SCENARIOS[0];

  return (
    <div className="flex flex-col w-full bg-[#081919] text-[#F4F6F4] overflow-hidden">

      {/* ── SECTION 1: HERO (Dawn Horizon + Three.js + Cairn Floating Alerts) ── */}
      <section className="relative w-full pt-16 pb-20 md:pt-28 md:pb-32 hero-gradient-mesh overflow-hidden border-b border-[#4D524B]/35">
        {/* Three.js interactive cryptographic constellation background */}
        <ThreeCanvas className="z-0 opacity-60" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">

          {/* Hero Emblem & Star Aura */}
          <div className="relative mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-[#CE1A1E]/50 shadow-2xl shadow-[#CE1A1E]/30 bg-[#081919] p-1.5 backdrop-blur-md">
              <img src="/logo.png" alt="Agentra" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="absolute -inset-3 rounded-3xl bg-[#CE1A1E]/25 blur-2xl -z-10" />
          </div>

          {/* Kicker Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#223330]/70 border border-[#4D524B]/60 text-xs font-mono text-[#F4F6F4] mb-8 shadow-sm shadow-[#CE1A1E]/15 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#CE1A1E]" />
            <span>Autonomous Agent Economy · x402 Protocol</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#F4F6F4] leading-[1.08] mb-6 max-w-4xl">
            Agents can finally{' '}
            <span className="text-[#CE1A1E] relative inline-block">
              shop.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#E8EBE4]/85 max-w-2xl mb-10 leading-relaxed font-sans">
            Find verified AI services, pay micro-cents in USDC <strong className="text-[#FFFFFF]">strictly when execution succeeds</strong>, and rate them with cryptographic proof. Zero charge on errors or timeouts.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-14 w-full sm:w-auto justify-center">
            <Link href="/demo">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Interactive Demo
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="secondary" size="lg">
                Browse Services
              </Button>
            </Link>
            <Link href="/provider/new">
              <Button variant="outline" size="lg">
                List an API
              </Button>
            </Link>
          </div>

          {/* ── Cairn Scenario Selector Tabs ── */}
          <div className="w-full max-w-3xl space-y-4">
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
              {HERO_SCENARIOS.map((scenario) => {
                const isActive = activeScenarioId === scenario.id;
                return (
                  <button
                    key={scenario.id}
                    type="button"
                    onClick={() => setActiveScenarioId(scenario.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#223330] text-[#FFFFFF] border border-[#CE1A1E]/60 shadow-md shadow-[#CE1A1E]/20'
                        : 'bg-[#223330]/40 text-[#837F78] hover:text-[#FFFFFF] border border-[#4D524B]/40'
                    }`}
                  >
                    {scenario.tag}
                  </button>
                );
              })}
            </div>

            {/* Floating Conversation / Challenge Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeScenario.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="p-6 rounded-2xl bg-[#0D2020]/90 border border-[#4D524B]/50 shadow-2xl backdrop-blur-xl text-left space-y-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#223330] border border-[#4D524B]/60 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-[#FBBF24]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-[#837F78] uppercase tracking-wider block">
                      Autonomous Trigger Scenario
                    </span>
                    <p className="text-sm font-medium text-[#F4F6F4]">
                      {activeScenario.alert}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#081919] border border-[#4D524B]/40">
                  <div className="w-8 h-8 rounded-lg bg-[#65060E]/40 border border-[#CE1A1E]/50 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-[#CE1A1E]" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <span className="text-[11px] font-mono text-[#2DD4BF] uppercase tracking-wider block">
                      Agentra Protocol Enforcement
                    </span>
                    <p className="text-xs sm:text-sm text-[#E8EBE4]/90 leading-relaxed font-mono">
                      "{activeScenario.reply}"
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#4D524B]/30 text-xs">
                      <span className="font-mono text-[11px] text-[#837F78]">
                        {activeScenario.metric}
                      </span>
                      <Link
                        href={activeScenario.link.href}
                        className="inline-flex items-center gap-1 text-[#CE1A1E] hover:text-[#FFFFFF] font-mono transition-colors"
                      >
                        <span>{activeScenario.link.label}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: ECOSYSTEM PROTOCOL MARQUEE ── */}
      <section className="py-8 bg-[#081919] border-b border-[#4D524B]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {ECOSYSTEM_BADGES.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.name}
                  className="p-3 rounded-xl bg-[#223330]/25 border border-[#4D524B]/35 flex items-center gap-2.5 transition-colors hover:border-[#CE1A1E]/40"
                >
                  <div className="p-1.5 rounded-lg bg-[#081919] border border-[#4D524B]/50 shrink-0">
                    <Icon className="w-3.5 h-3.5 text-[#CE1A1E]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#F4F6F4] truncate">
                      {badge.name}
                    </div>
                    <div className="text-[10px] text-[#837F78] truncate font-mono">
                      {badge.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: AGENT CANVAS (Cairn-inspired Low-Code Interactive Flow) ── */}
      <section className="py-20 md:py-28 border-b border-[#4D524B]/30 bg-[#081919]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-mono text-[#CE1A1E] uppercase tracking-widest font-bold">
              The Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F4F6F4] tracking-tight">
              Agent Canvas: Low-code verification pipeline
            </h2>
            <p className="text-sm sm:text-base text-[#E8EBE4]/80 max-w-2xl mx-auto">
              How autonomous agents browse, challenge, sign, and settle with zero manual intervention.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Step Selection Accordion / Left Column */}
            <div className="lg:col-span-5 space-y-3">
              {CANVAS_STEPS.map((step, idx) => {
                const isActive = activeCanvasStep === idx;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveCanvasStep(idx)}
                    className={`w-full text-left p-5 rounded-2xl transition-all duration-200 border cursor-pointer ${
                      isActive
                        ? 'bg-[#223330]/60 border-[#CE1A1E] shadow-lg shadow-[#CE1A1E]/15'
                        : 'bg-[#223330]/25 border-[#4D524B]/40 hover:border-[#4D524B]/70'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-mono text-xs font-bold text-[#CE1A1E]">
                        {step.num}
                      </span>
                      <h3 className="text-base font-bold text-[#F4F6F4]">
                        {step.title}
                      </h3>
                    </div>
                    <div className="text-xs text-[#837F78] font-mono mb-2">
                      {step.subtitle}
                    </div>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs text-[#E8EBE4]/85 leading-relaxed pt-1"
                      >
                        {step.desc}
                      </motion.p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Interactive Preview Panel / Right Column */}
            <div className="lg:col-span-7 bg-[#0D2020] border border-[#4D524B]/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
              {activeCanvasStep === 0 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-[#4D524B]/30">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#CE1A1E]" />
                      <span className="text-sm font-bold text-[#F4F6F4]">
                        Autonomous Query & Schema Validation
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded">
                      Live Registry
                    </span>
                  </div>

                  <div className="bg-[#081919] rounded-xl p-4 border border-[#4D524B]/40 font-mono text-xs space-y-2">
                    <div className="text-[#837F78]">// Query payload</div>
                    <div className="text-[#F4F6F4]">
                      {'{ "service": "ev-market-data", "state": "Karnataka", "timeframe": "monthly" }'}
                    </div>
                    <div className="text-[#CE1A1E] pt-2">// Protocol challenge emitted</div>
                    <div className="text-[#E8EBE4]">
                      {'HTTP/1.1 402 Payment Required · x402-amount: 0.010 USDC'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-[#223330]/40 border border-[#4D524B]/40">
                      <span className="text-[#837F78] block">Provider Trust</span>
                      <span className="text-[#2DD4BF] font-bold mt-1 block">91 / 100 (Established)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[#223330]/40 border border-[#4D524B]/40">
                      <span className="text-[#837F78] block">p95 Latency</span>
                      <span className="text-[#F4F6F4] font-bold mt-1 block">582ms (Verified)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeCanvasStep === 1 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-[#4D524B]/30">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-[#CE1A1E]" />
                      <span className="text-sm font-bold text-[#F4F6F4]">
                        Spend Policy Rule Engine
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#837F78]">Interactive Toggles</span>
                  </div>

                  <div className="space-y-2.5">
                    {policies.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => togglePolicy(p.id)}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                          p.on
                            ? 'bg-[#223330]/50 border-[#CE1A1E]/50'
                            : 'bg-[#081919] border-[#4D524B]/30 opacity-60'
                        }`}
                      >
                        <span className="text-xs font-medium text-[#F4F6F4]">
                          {p.title}
                        </span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                            p.on ? 'bg-[#CE1A1E] text-white' : 'border border-[#4D524B]'
                          }`}
                        >
                          {p.on && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#837F78] font-mono">
                    Policies are cryptographically evaluated prior to EIP-3009 voucher authorization.
                  </p>
                </div>
              )}

              {activeCanvasStep === 2 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-[#4D524B]/30">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#CE1A1E]" />
                      <span className="text-sm font-bold text-[#F4F6F4]">
                        Stress-Test Failure Simulation
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#2DD4BF]">Zero-Charge Proof</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#081919] border border-[#4D524B]/40 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-[#F87171]">
                      <span>[SIMULATION] Upstream HTTP 504 Timeout</span>
                      <span>Latency: 2840ms</span>
                    </div>
                    <div className="text-[#837F78]">
                      Gateway detects unfulfilled SLA digest hash. Triggering circuit breaker...
                    </div>
                    <div className="p-3 rounded-lg bg-[#223330]/30 border border-[#2DD4BF]/40 text-[#2DD4BF] font-semibold">
                      ✓ Buyer balance: $0.000 USDC debited (Escrow authorization canceled)
                    </div>
                  </div>

                  <div className="text-xs text-[#837F78]">
                    No chargeback disputes. Failure handling is built directly into the cryptographic envelope.
                  </div>
                </div>
              )}

              {activeCanvasStep === 3 && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-[#4D524B]/30">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#CE1A1E]" />
                      <span className="text-sm font-bold text-[#F4F6F4]">
                        Multi-Environment SDK Integration
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#837F78]">TypeScript / MCP / REST</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#081919] border border-[#4D524B]/40 font-mono text-xs text-[#2DD4BF] space-y-1.5">
                    <div className="text-[#837F78]">// 3-line autonomous integration</div>
                    <div className="text-[#F4F6F4]">{'import { AgentraClient } from "@agentra/sdk";'}</div>
                    <div className="text-[#F4F6F4]">{'const client = new AgentraClient({ signer: agentWallet });'}</div>
                    <div className="text-[#F4F6F4]">{'const data = await client.call("ev-market-data", query);'}</div>
                    <div className="text-[#2DD4BF] pt-1">{'// Pay-on-success verified ✓'}</div>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <Link href="/demo" className="flex-1">
                      <Button variant="primary" size="sm" className="w-full justify-center">
                        Test in Interactive Demo
                      </Button>
                    </Link>
                    <Link href="/buyer/console" className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full justify-center">
                        Configure Spend Keys
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: REAL-TIME EXECUTION INSPECTOR ("Listen In") ── */}
      <section className="py-20 md:py-28 border-b border-[#4D524B]/30 bg-[#081919]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono text-[#CE1A1E] uppercase tracking-widest font-bold">
                Real-Time Verification
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#F4F6F4] tracking-tight">
                Inspect every call from handshake to receipt.
              </h2>
              <p className="text-sm sm:text-base text-[#E8EBE4]/85 leading-relaxed font-sans">
                Every request carries an cryptographic receipt verifying that computation was delivered as promised before USDC ever moves.
              </p>

              <div className="space-y-3 pt-2 font-mono text-xs">
                {[
                  { label: 'EIP-712 challenge signature verified', color: '#2DD4BF' },
                  { label: 'Payload digest verified against output schema', color: '#CE1A1E' },
                  { label: 'Instant atomic escrow settlement', color: '#F5B544' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#E8EBE4]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual execution trace stack */}
            <div className="lg:col-span-7 bg-[#0D2020] border border-[#4D524B]/50 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#4D524B]/30 font-mono text-xs">
                <span className="text-[#F4F6F4] font-semibold">Call #861 Execution Shape</span>
                <span className="text-[#2DD4BF]">Resolved in 582ms</span>
              </div>

              {[
                { who: 'Buyer Agent', role: 'Caller', msg: 'Initiate telemetry request: /v1/providers/ev-data/telemetry', status: '402 Gated' },
                { who: 'Gateway', role: 'x402 Protocol', msg: 'Challenge generated: nonce=0x4a91 · price=0.010 USDC · digest=0x9f3e...', status: 'Signed' },
                { who: 'Provider Agent', role: 'Execution', msg: 'Processed 42 RTO telemetry rows · Proof SHA-256 generated', status: '200 OK' },
                { who: 'Escrow Protocol', role: 'Settlement', msg: 'Atomic transfer unlocked: 0.00975 USDC to provider, 0.00025 to network', status: 'Settled' },
              ].map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#081919] border border-[#4D524B]/40 flex items-start justify-between gap-3 font-mono text-xs">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#F4F6F4]">{step.who}</span>
                      <span className="text-[10px] text-[#837F78]">({step.role})</span>
                    </div>
                    <div className="text-[#E8EBE4]/80 text-[11px] truncate">
                      {step.msg}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#223330] text-[#2DD4BF] border border-[#4D524B]/50 shrink-0">
                    {step.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: STATS GRID ("The Queue, Retired") ── */}
      <section className="py-20 md:py-24 border-b border-[#4D524B]/30 bg-[#081919]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-2">
            <span className="text-xs font-mono text-[#CE1A1E] uppercase tracking-widest font-bold">
              Guaranteed Performance
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F4F6F4]">
              Zero waste. Sub-second delivery.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { value: '$0.00', label: 'Wasted fees on failure', note: '100% zero-charge guarantee', color: '#F87171' },
              { value: '99.7%', label: 'Delivered without manual retry', note: 'Automatic failover routing', color: '#2DD4BF' },
              { value: `${stats.averageLatencyMs}ms`, label: 'Average verified latency', note: 'Sub-second response SLA', color: '#F4F6F4' },
              { value: `${stats.totalVerifiedCalls.toLocaleString()}`, label: 'Verified calls settled today', note: '100% cryptographic receipts', color: '#CE1A1E' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#223330]/35 border border-[#4D524B]/40 card-hover-glow space-y-2"
              >
                <div className="text-3xl sm:text-4xl font-black font-mono" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-[#F4F6F4]">
                  {stat.label}
                </div>
                <div className="text-[11px] text-[#837F78] font-mono">
                  {stat.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FEATURED SERVICES CATALOG ── */}
      <section className="py-20 border-b border-[#4D524B]/30 bg-[#081919]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-mono text-[#CE1A1E] uppercase tracking-widest font-bold">
                Marketplace Catalog
              </span>
              <h2 className="text-3xl font-black text-[#F4F6F4] mt-1">
                Featured Verified Services
              </h2>
            </div>
            <Link href="/explore">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All Services
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((svc) => (
              <ServiceCard key={svc.slug} service={svc} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: CALL TO ACTION (The Final Horizon) ── */}
      <section className="py-24 bg-[#081919] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#CE1A1E]/50 shadow-xl shadow-[#CE1A1E]/25 bg-[#081919] p-1 mx-auto">
            <img src="/logo.png" alt="Agentra" className="w-full h-full object-cover rounded-xl" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F4F6F4] tracking-tight max-w-2xl mx-auto">
            Ready to integrate the agent economy?
          </h2>

          <p className="text-sm sm:text-base text-[#E8EBE4]/80 max-w-lg mx-auto">
            Start calling verified AI services with automatic zero-charge guarantees. Pay only for valid execution.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/explore">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Browse Marketplace
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="secondary" size="lg">
                Watch Protocol Tour
              </Button>
            </Link>
            <Link href="/provider/new">
              <Button variant="outline" size="lg">
                List Your API
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
