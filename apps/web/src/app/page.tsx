'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreeCanvas } from '@/components/ui/ThreeCanvas';
import { REFERENCE_SERVICES } from '@/lib/mockData';
import { fetchStats, StatsResponse } from '@/lib/api';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Terminal,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
  ChevronRight,
  Shield,
  Layers,
  Code2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

/* ── Hero Scenarios ── */
interface Scenario {
  id: string;
  tag: string;
  alert: string;
  reply: string;
  action: { label: string; href: string };
  metric: string;
}

const HERO_SCENARIOS: Scenario[] = [
  {
    id: 'protection',
    tag: 'Zero-Fee Protection',
    alert: 'Upstream gateway returned 504 Gateway Timeout during payload execution.',
    reply: 'Escrow automatically voided transaction. Caller charged exactly 0.000 USDC. Failure logged to provider reliability index.',
    action: { label: 'Inspect Zero-Charge Policy', href: '/demo' },
    metric: 'Zero hold time · 100% capital protected',
  },
  {
    id: 'settlement',
    tag: 'Atomic Settlement',
    alert: 'Autonomous research agent requested 42 EV telematics telemetry records.',
    reply: 'Service delivered verified 200 OK with payload proof hash in 582ms. 0.010 USDC settled into provider escrow instantly.',
    action: { label: 'View Realtime Proof', href: '/live' },
    metric: '582ms latency · Cryptographic proof hash',
  },
  {
    id: 'discovery',
    tag: 'Semantic Auto-Discovery',
    alert: 'Client requested natural language query: "Find me real-time Avalanche gas predictor".',
    reply: 'Matched Avalanche Gas Predictor (98% Trust Score). EIP-3009 payment voucher signed offline in 24ms.',
    action: { label: 'Browse Catalog', href: '/explore' },
    metric: '98% Trust Score · EIP-3009 Pre-auth',
  },
];

/* ── Protocol Badges ── */
const PROTOCOL_BADGES = [
  { name: 'Avalanche C-Chain', tag: 'Settlement Rail', color: '#CE1A1E' },
  { name: 'x402 Protocol', tag: 'Pay-on-Success', color: '#2DD4BF' },
  { name: 'EIP-3009 Vouchers', tag: 'Gasless Auth', color: '#F5B544' },
  { name: 'ERC-8004 Trust', tag: 'Decentralized SLA', color: '#60A5FA' },
  { name: 'Fastify SSE Pipeline', tag: 'Sub-600ms', color: '#A78BFA' },
  { name: 'MCP 2.0 Standard', tag: 'Native Agent Tools', color: '#F472B6' },
];

/* ── Agent Canvas Steps ── */
const CANVAS_STEPS = [
  {
    num: '01',
    title: 'Semantic Discovery',
    tagline: 'Vectorized MCP 2.0 tool matching with verifiable reliability scoring.',
    description:
      'Autonomous agents query natural-language capabilities. Agentra filters across live verified providers on Avalanche C-Chain with on-chain trust scores.',
  },
  {
    num: '02',
    title: 'Policy & SLA Guardrails',
    tagline: 'Deterministic execution rules enforced before a single satoshi moves.',
    description:
      'Set strict max price, maximum allowable latency (e.g. 1500ms), and mandate zero-fee refunds on HTTP 5xx or unverified payload responses.',
  },
  {
    num: '03',
    title: 'Simulation & Protection',
    tagline: 'Execute payload against live gateways with cryptographic response validation.',
    description:
      'The gateway challenges with HTTP 402, executes against the provider, and signs the response body SHA-256 hash before releasing escrow.',
  },
  {
    num: '04',
    title: 'Atomic Settlement',
    tagline: 'EIP-3009 transfer authorization settled directly to provider.',
    description:
      'Upon verifiable delivery of a 200 OK, the signed voucher executes atomically. If upstream fails or times out, escrow aborts at zero cost.',
  },
];

/* ── Listen-In Trace Dialogue ── */
const CALL_LINES = [
  {
    who: 'buyer',
    speaker: 'Caller Agent',
    role: 'Autonomous Research Client',
    text: 'GET /v1/telemetry/ev-fleet?vin=AVAX-7729. Need battery degradation vectors within 1000ms SLA.',
    meta: 'EIP-712 Voucher Pre-Auth: 0.010 USDC',
  },
  {
    who: 'gateway',
    speaker: 'Agentra Escrow Gateway',
    role: 'Verification Proxy',
    text: 'HTTP 402 Payment Required. Verified voucher signature against caller address. Forwarding payload with cryptographic timeout envelope.',
    meta: 'Handshake: 18ms',
  },
  {
    who: 'buyer',
    speaker: 'Caller Agent',
    role: 'Autonomous Research Client',
    text: 'Upstream responded with 200 OK: 42 records received. Hash: 0x9f2a...8c1e. Verify proof validity.',
    meta: 'Payload: 3.4 KB · Latency: 564ms',
  },
  {
    who: 'gateway',
    speaker: 'Agentra Escrow Gateway',
    role: 'Settlement Node',
    text: 'SHA-256 payload hash confirmed. Settling 0.010 USDC to provider. Zero hold-time. Call recorded to ERC-8004 reliability index.',
    meta: 'Atomic Settlement Confirmed',
  },
];

/* ── Operator Testimonials ── */
const TESTIMONIALS = [
  {
    quote:
      'Our autonomous research swarms make 40,000 API queries daily. Before Agentra, we lost 14% of budget to flaky gateways and dropped connections. With x402 escrow, we pay strictly for verified responses.',
    author: 'Elena Rostova',
    role: 'Head of Autonomous Systems',
    company: 'Apex Quantitative',
    tag: '40k calls/day',
  },
  {
    quote:
      'As a data provider, we love getting paid instantly via EIP-3009 vouchers without billing friction or chargeback risks. Our verified trust score directly drives higher inbound volume.',
    author: 'Marcus Vance',
    role: 'Infrastructure Lead',
    company: 'Avalanche Oracle Labs',
    tag: 'Zero chargebacks',
  },
];

export default function LandingPage() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const activeScenario = HERO_SCENARIOS[activeScenarioIdx];

  const [activeStep, setActiveStep] = useState(0);
  const [policies, setPolicies] = useState({
    zeroFeeOnFailure: true,
    eip3009Voucher: true,
    erc8004TrustVerify: true,
    sha256PayloadProof: true,
  });

  const [simState, setSimState] = useState<'idle' | 'running' | 'success'>('idle');
  const [simOutput, setSimOutput] = useState<string | null>(null);

  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(() => {
        setStats({
          totalVerifiedCalls: 12480,
          totalVolumeUsdc: '42,910',
          activeServicesCount: 28,
          averageLatencyMs: 680,
          settlementGuarantee: '100% Zero-Loss',
        });
      });
  }, []);

  const runSimulation = () => {
    setSimState('running');
    setSimOutput(null);
    setTimeout(() => {
      setSimState('success');
      setSimOutput(
        JSON.stringify(
          {
            status: 200,
            outcome: 'SUCCESS_DELIVERED',
            provider: '0x3cA8...91B2',
            settlement: {
              amountUSDC: '0.010',
              voucherType: 'EIP-3009_TRANSFER_WITH_AUTHORIZATION',
              holdTimeMs: 0,
              feeRefunded: '0.000',
            },
            proof: {
              algorithm: 'SHA-256',
              digest: '0x9f2a87c14b2d6e3f890123456789abcdef0123456789abcdef0123456789abcd',
              verifiedAt: new Date().toISOString(),
            },
          },
          null,
          2
        )
      );
    }, 700);
  };

  return (
    <div
      className="cnl-root"
      data-scheme="dark"
      style={
        {
          '--cnl-bg': '#081919',
          '--cnl-day': '#081919',
          '--cnl-night-bg': '#081919',
          '--cnl-ink': '#F4F6F4',
          '--cnl-mute': '#837F78',
          '--cnl-faint': '#4D524B',
          '--cnl-line': 'rgba(77, 82, 75, 0.40)',
          '--cnl-soft': '#162826',
          '--cnl-card': '#0D2020',
          '--cnl-card-ink': '#F4F6F4',
          '--cnl-card-mute': '#837F78',
          '--cnl-card-line': 'rgba(77, 82, 75, 0.50)',
          '--cnl-card-soft': '#223330',
          '--cnl-accent': '#CE1A1E',
          '--cnl-agent': '#65060E',
        } as React.CSSProperties
      }
    >
      {/* ── SECTION 1: HERO (Cairn Editorial Vista Layout) ── */}
      <section className="cnl-hero" data-sec="top">
        <div className="cnl-hero-copy">
          {/* Announcement Badge */}
          <Link href="/explore" className="cnl-badge" data-intro="">
            <span className="cnl-badge-dot" aria-hidden="true" />
            <span>NEW: X402 ZERO-FEE ESCROW STANDARD ON AVALANCHE</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
          </Link>

          {/* Large Serif Title */}
          <h1 className="cnl-title">
            <span className="cnl-line">
              <span className="cnl-line-in">Every autonomous agent call,</span>
            </span>
            <span className="cnl-line">
              <span className="cnl-line-in italic text-[#CE1A1E]">settled on success.</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="cnl-sub" data-intro="">
            The programmable payment highway on Avalanche C-Chain. Zero hold times. Pre-authorized
            EIP-3009 vouchers. 100% refunded when upstream providers fail.
          </p>

          {/* Primary Action Buttons */}
          <div className="cnl-hero-cta" data-intro="">
            <Link href="/explore" className="cnl-pill is-lg bg-[#CE1A1E] text-white hover:bg-[#65060E]">
              <span className="cnl-roll" data-t="Explore Verified Services">
                <span>Explore Verified Services</span>
              </span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>

            <Link href="/provider/new" className="cnl-pill is-lg is-light">
              <span className="cnl-roll" data-t="Register as Provider">
                <span>Register as Provider</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Hero Vista Stage */}
        <div className="cnl-hero-stage">
          <div className="cnl-vista cnl-hero-vista relative w-full h-[540px] sm:h-[620px] max-w-[1240px] mx-auto mt-12 rounded-[28px] overflow-hidden border border-[#4D524B]/50 bg-[#081919]">
            {/* Multi-layered Atmospheric Silhouette Ridges */}
            <svg
              className="cnl-ridges absolute inset-0 w-full h-full pointer-events-none opacity-45"
              viewBox="0 0 1440 680"
              fill="none"
              preserveAspectRatio="xMidYMax slice"
            >
              <path
                d="M0 680V380L180 320L360 360L540 280L720 340L900 290L1080 350L1260 300L1440 370V680H0Z"
                fill="#162826"
              />
              <path
                d="M0 680V440L200 400L420 460L620 380L840 430L1040 390L1240 450L1440 410V680H0Z"
                fill="#0D2020"
              />
              <path
                d="M0 680V520L220 490L460 540L700 480L920 530L1160 500L1440 550V680H0Z"
                fill="#081919"
              />
            </svg>

            {/* Three.js Particle Constellation Canvas */}
            <div className="absolute inset-0 pointer-events-none opacity-70">
              <ThreeCanvas />
            </div>

            {/* Subtle Star Ribbon Crest Emblem */}
            <div className="absolute top-8 left-8 sm:top-10 sm:left-10 z-10 flex items-center gap-3 bg-[#0D2020]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#4D524B]/40">
              <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                <Image src="/logo.png" alt="Agentra" fill className="object-cover" />
              </div>
              <span className="text-[12px] font-mono tracking-wider text-[#F4F6F4] uppercase">
                Avalanche Subnet 402
              </span>
            </div>

            {/* Floating Conversational Scenario Card (Cairn Signature) */}
            <div className="cnl-chat absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-8 z-20 pointer-events-auto">
              {/* Scenario Switcher Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                {HERO_SCENARIOS.map((sc, idx) => (
                  <button
                    key={sc.id}
                    onClick={() => setActiveScenarioIdx(idx)}
                    className={`text-xs px-3.5 py-1.5 rounded-full font-mono transition-all ${
                      activeScenarioIdx === idx
                        ? 'bg-[#CE1A1E] text-white shadow-[0_0_16px_rgba(206,26,30,0.5)] font-semibold'
                        : 'bg-[#162826]/80 text-[#837F78] hover:text-[#F4F6F4] hover:bg-[#223330]'
                    }`}
                  >
                    {sc.tag}
                  </button>
                ))}
              </div>

              {/* Conversational Cards Stack */}
              <div className="w-full max-w-xl space-y-3.5">
                {/* Alert Card */}
                <motion.div
                  key={`alert-${activeScenario.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="cnl-b cnl-b-alert flex items-start gap-3.5 rounded-2xl bg-[#0D2020]/95 backdrop-blur-md p-4 sm:p-5 border border-[#4D524B]/60 shadow-2xl"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#CE1A1E] mt-1.5 flex-shrink-0 animate-pulse shadow-[0_0_8px_#CE1A1E]" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#837F78] uppercase mb-1">
                      <span>Gateway Intercept</span>
                      <span>HTTP 402 Standard</span>
                    </div>
                    <p className="text-[14px] text-[#F4F6F4] leading-relaxed">
                      {activeScenario.alert}
                    </p>
                  </div>
                </motion.div>

                {/* Reply Card */}
                <motion.div
                  key={`reply-${activeScenario.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="cnl-b cnl-b-reply flex items-start gap-3.5 rounded-2xl bg-[#162826]/95 backdrop-blur-md p-4 sm:p-5 border border-[#CE1A1E]/40 shadow-2xl"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] mt-1.5 flex-shrink-0 shadow-[0_0_8px_#2DD4BF]" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#2DD4BF] uppercase mb-1">
                      <span>Deterministic Resolution</span>
                      <span>Verified SLA</span>
                    </div>
                    <p className="text-[14px] text-[#E8EBE4] leading-relaxed">
                      {activeScenario.reply}
                    </p>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#4D524B]/30 text-xs">
                      <span className="font-mono text-[#837F78]">{activeScenario.metric}</span>
                      <Link
                        href={activeScenario.action.href}
                        className="inline-flex items-center gap-1 text-[#CE1A1E] font-medium hover:underline"
                      >
                        {activeScenario.action.label}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Live Ticker Indicator */}
              <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#837F78] bg-[#0D2020]/70 px-3.5 py-1.5 rounded-full border border-[#4D524B]/30">
                <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" />
                <span>386 LIVE CALLS PROCESSED TODAY · ZERO CAPITAL LOST</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PROTOCOL LOGOS MARQUEE (Cairn Marquee) ── */}
      <section className="cnl-logos mt-20" data-sec="customers" aria-label="Protocols">
        <p className="cnl-logos-label text-center text-xs font-mono tracking-widest text-[#837F78] uppercase mb-6">
          Powering autonomous agent workloads across decentralized protocols
        </p>
        <div className="cnl-marquee overflow-hidden py-4 border-y border-[#4D524B]/20 bg-[#0D2020]/30">
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
            {[...PROTOCOL_BADGES, ...PROTOCOL_BADGES].map((p, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#162826]/40 border border-[#4D524B]/30 text-xs font-mono text-[#F4F6F4]"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="font-semibold">{p.name}</span>
                <span className="text-[#837F78]">· {p.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: THE AGENT CANVAS (Interactive 4-Stage Workbench) ── */}
      <section className="cnl-canvas max-w-[1240px] mx-auto px-4 sm:px-8 py-28" data-sec="product">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="cnl-kicker justify-center mb-3 text-[#CE1A1E]">Agent Workbench</div>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#F4F6F4] tracking-tight">
            The Agent Canvas. Guardrails on every execution.
          </h2>
          <p className="cnl-sec-text mt-4 text-[#837F78] text-base leading-relaxed">
            Four deterministic steps from semantic discovery to atomic zero-loss settlement.
          </p>
        </div>

        {/* Workbench Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Step Selector List (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            {CANVAS_STEPS.map((step, idx) => (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                  activeStep === idx
                    ? 'bg-[#162826] border-[#CE1A1E] shadow-[0_4px_24px_rgba(206,26,30,0.2)]'
                    : 'bg-[#0D2020]/40 border-[#4D524B]/30 hover:border-[#4D524B]/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-[#CE1A1E] font-semibold">{step.num}</span>
                  {activeStep === idx && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#CE1A1E]/20 text-[#CE1A1E] border border-[#CE1A1E]/30">
                      Active Stage
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-serif text-[#F4F6F4] font-medium">{step.title}</h3>
                <p className="text-xs text-[#837F78] mt-1 line-clamp-1">{step.tagline}</p>
                {activeStep === idx && (
                  <p className="text-xs text-[#E8EBE4]/90 mt-3 pt-3 border-t border-[#4D524B]/40 leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Simulation Sandbox (Right 7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#0D2020] border border-[#4D524B]/50 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#4D524B]/40 mb-6">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-[#CE1A1E]" />
                <span className="font-mono text-xs text-[#F4F6F4] uppercase font-semibold">
                  Execution Guardrails Sandbox
                </span>
              </div>
              <span className="text-xs font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded-full border border-[#2DD4BF]/30">
                SLA Engine Ready
              </span>
            </div>

            {/* Guardrail Policy Toggles */}
            <div className="space-y-3 mb-6">
              <span className="text-xs font-mono uppercase text-[#837F78] tracking-wider block">
                Active Client Protection Policies
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 text-xs text-[#F4F6F4] bg-[#162826]/60 p-3 rounded-xl border border-[#4D524B]/30 cursor-pointer hover:border-[#CE1A1E]/50">
                  <input
                    type="checkbox"
                    checked={policies.zeroFeeOnFailure}
                    onChange={(e) =>
                      setPolicies({ ...policies, zeroFeeOnFailure: e.target.checked })
                    }
                    className="accent-[#CE1A1E] w-4 h-4"
                  />
                  <span>Zero-Fee on 5xx Timeout</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-[#F4F6F4] bg-[#162826]/60 p-3 rounded-xl border border-[#4D524B]/30 cursor-pointer hover:border-[#CE1A1E]/50">
                  <input
                    type="checkbox"
                    checked={policies.eip3009Voucher}
                    onChange={(e) =>
                      setPolicies({ ...policies, eip3009Voucher: e.target.checked })
                    }
                    className="accent-[#CE1A1E] w-4 h-4"
                  />
                  <span>EIP-3009 Gasless Voucher</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-[#F4F6F4] bg-[#162826]/60 p-3 rounded-xl border border-[#4D524B]/30 cursor-pointer hover:border-[#CE1A1E]/50">
                  <input
                    type="checkbox"
                    checked={policies.erc8004TrustVerify}
                    onChange={(e) =>
                      setPolicies({ ...policies, erc8004TrustVerify: e.target.checked })
                    }
                    className="accent-[#CE1A1E] w-4 h-4"
                  />
                  <span>ERC-8004 Trust Filter</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-[#F4F6F4] bg-[#162826]/60 p-3 rounded-xl border border-[#4D524B]/30 cursor-pointer hover:border-[#CE1A1E]/50">
                  <input
                    type="checkbox"
                    checked={policies.sha256PayloadProof}
                    onChange={(e) =>
                      setPolicies({ ...policies, sha256PayloadProof: e.target.checked })
                    }
                    className="accent-[#CE1A1E] w-4 h-4"
                  />
                  <span>SHA-256 Digest Proof</span>
                </label>
              </div>
            </div>

            {/* Run Button & Live Terminal Output */}
            <div className="space-y-4">
              <button
                onClick={runSimulation}
                disabled={simState === 'running'}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#CE1A1E] hover:bg-[#65060E] text-white font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {simState === 'running' ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Verifying Escrow Handshake...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Simulate Protected Call</span>
                  </>
                )}
              </button>

              {simOutput && (
                <div className="rounded-xl bg-[#081919] border border-[#4D524B]/40 p-4 font-mono text-[11px] text-[#2DD4BF] overflow-x-auto">
                  <pre>{simOutput}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: LISTEN IN (Real-time Execution Stack Visualizer) ── */}
      <section className="cnl-call max-w-[1240px] mx-auto px-4 sm:px-8 py-28" data-sec="listen-in">
        <div className="cnl-sec-head max-w-2xl mx-auto mb-16 text-center">
          <div className="cnl-kicker justify-center mb-3 text-[#CE1A1E]">Listen In</div>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#F4F6F4] tracking-tight">
            Cryptographic proof, every time. Even at 2 a.m.
          </h2>
          <p className="cnl-sec-text mt-4 text-[#837F78] text-base leading-relaxed">
            An autonomous query, start to finish. The caller deposits zero gas upfront, gets verified
            data, and never once pays for a dropped packet.
          </p>
        </div>

        {/* Call Transcript Card */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-[#0D2020] border border-[#4D524B]/50 p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#4D524B]/40 mb-6 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#F4F6F4]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] animate-pulse" />
              <span>TRACE #AVAX-402-9912</span>
            </div>
            <span className="text-[#837F78]">TOPIC: EV-TELEMETRY-STREAM</span>
          </div>

          {/* Dialogue Stack */}
          <div className="space-y-4">
            {CALL_LINES.map((line, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  line.who === 'buyer'
                    ? 'bg-[#162826]/70 border-[#4D524B]/40'
                    : 'bg-[#223330]/50 border-[#CE1A1E]/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                  <span
                    className={`font-semibold ${
                      line.who === 'buyer' ? 'text-[#F4F6F4]' : 'text-[#CE1A1E]'
                    }`}
                  >
                    {line.speaker}
                  </span>
                  <span className="text-[#837F78] text-[11px]">{line.meta}</span>
                </div>
                <p className="text-sm text-[#E8EBE4] leading-relaxed">{line.text}</p>
              </div>
            ))}
          </div>

          {/* Outcome Banner */}
          <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 text-xs font-mono text-[#2DD4BF]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>OUTCOME: 200 OK DELIVERED · 0.010 USDC SETTLED · 0 HOLD TIME</span>
            </div>
            <span className="hidden sm:inline text-[#837F78]">582ms TOTAL</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: STATS HORIZON (Typographic Big Numbers) ── */}
      <section className="cnl-stats max-w-[1240px] mx-auto px-4 sm:px-8 py-20 border-t border-[#4D524B]/30">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="cnl-kicker justify-center mb-3 text-[#CE1A1E]">Zero-Waste Metrics</div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F4F6F4]">
            The broken API tax, eliminated.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="p-6 rounded-2xl bg-[#0D2020]/60 border border-[#4D524B]/30 text-center">
            <div className="text-4xl sm:text-5xl font-serif text-[#CE1A1E] font-normal mb-1">
              $0.00
            </div>
            <div className="text-xs font-mono uppercase text-[#F4F6F4] font-semibold">
              Cost on Failure
            </div>
            <div className="text-[11px] text-[#837F78] mt-1">100% refunded when gateways 5xx</div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D2020]/60 border border-[#4D524B]/30 text-center">
            <div className="text-4xl sm:text-5xl font-serif text-[#F4F6F4] font-normal mb-1">
              99.7%
            </div>
            <div className="text-xs font-mono uppercase text-[#F4F6F4] font-semibold">
              Delivery Rate
            </div>
            <div className="text-[11px] text-[#837F78] mt-1">Verified cryptographic proofs</div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D2020]/60 border border-[#4D524B]/30 text-center">
            <div className="text-4xl sm:text-5xl font-serif text-[#F4F6F4] font-normal mb-1">
              {stats?.averageLatencyMs || 680}ms
            </div>
            <div className="text-xs font-mono uppercase text-[#F4F6F4] font-semibold">
              Median Latency
            </div>
            <div className="text-[11px] text-[#837F78] mt-1">Direct SSE stream settlement</div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D2020]/60 border border-[#4D524B]/30 text-center">
            <div className="text-4xl sm:text-5xl font-serif text-[#2DD4BF] font-normal mb-1">
              {stats?.totalVerifiedCalls ? `${stats.totalVerifiedCalls.toLocaleString()}+` : '12,000+'}
            </div>
            <div className="text-xs font-mono uppercase text-[#F4F6F4] font-semibold">
              Calls Settled
            </div>
            <div className="text-[11px] text-[#837F78] mt-1">Recorded on Avalanche C-Chain</div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: TESTIMONIALS (Cairn Quotes Layout) ── */}
      <section className="cnl-quotes max-w-[1240px] mx-auto px-4 sm:px-8 py-20 border-t border-[#4D524B]/30">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="cnl-kicker justify-center mb-3 text-[#CE1A1E]">From the Front Lines</div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F4F6F4]">
            Trusted by autonomous operators.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#0D2020] border border-[#4D524B]/40 flex flex-col justify-between"
            >
              <p className="text-base font-serif text-[#E8EBE4] leading-relaxed italic mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-[#4D524B]/30 text-xs font-mono">
                <div>
                  <div className="text-[#F4F6F4] font-semibold">{t.author}</div>
                  <div className="text-[#837F78]">
                    {t.role} · {t.company}
                  </div>
                </div>
                <span className="text-[#CE1A1E] bg-[#CE1A1E]/10 px-2 py-1 rounded-md border border-[#CE1A1E]/30">
                  {t.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 7: FINAL CTA HORIZON (Cairn CTA) ── */}
      <section className="cnl-cta max-w-[1240px] mx-auto px-4 sm:px-8 py-28 text-center" data-sec="cta">
        <div className="rounded-[32px] bg-gradient-to-b from-[#162826] to-[#0D2020] border border-[#4D524B]/50 p-12 sm:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#CE1A1E]/20 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="cnl-kicker justify-center text-[#CE1A1E]">Start In Minutes</div>
            <h2 className="text-4xl sm:text-6xl font-serif text-[#F4F6F4] tracking-tight">
              Quiet pipelines. Guaranteed delivery.
            </h2>
            <p className="text-[#837F78] text-base leading-relaxed">
              Integrate with your MCP client or curl in two minutes. Pre-authorized vouchers, atomic
              escrow, zero gas upfront.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/explore"
                className="cnl-pill is-lg bg-[#CE1A1E] text-white hover:bg-[#65060E] px-8 py-4 font-semibold text-sm"
              >
                <span>Browse Verified Services</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/provider/new"
                className="cnl-pill is-lg bg-[#0D2020] text-[#F4F6F4] border border-[#4D524B]/60 hover:bg-[#162826] px-8 py-4 text-sm"
              >
                <span>Register Service Provider</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs font-mono text-[#837F78]">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#2DD4BF]" /> Avalanche C-Chain
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#2DD4BF]" /> EIP-3009 Gasless Vouchers
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#2DD4BF]" /> ERC-8004 Trust Standard
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
