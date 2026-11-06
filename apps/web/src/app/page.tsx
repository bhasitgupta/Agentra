'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REFERENCE_SERVICES } from '@/lib/mockData';
import { fetchStats, StatsResponse } from '@/lib/api';
import {
  ChevronRight,
  ArrowRight,
  Terminal,
  Play,
  RotateCcw,
  Check,
  CheckCircle2,
} from 'lucide-react';

/* ── Deterministic Ridge Path Generator (from template) ── */
function pseudoRandom(seed: number) {
  let t = (seed | 0);
  return function () {
    t = (t + 1831565813) | 0;
    let l = Math.imul(t ^ (t >>> 15), 1 | t);
    l = (l + Math.imul(l ^ (l >>> 7), 61 | l)) ^ l;
    return ((l ^ (l >>> 14)) >>> 0) / 4294967296;
  };
}

function generateRidge(seed: number, baseY: number, amplitude: number, width = 1600, height = 900) {
  const rng = pseudoRandom(seed);
  const shift = rng() * 6.283;
  const segments = 42;
  let d = `M0 ${height}`;
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width;
    const y =
      baseY -
      amplitude *
        (0.55 * Math.sin(i * 0.33 + shift) +
          0.3 * Math.sin(i * 0.91 + shift * 2) +
          0.15 * (rng() * 2 - 1));
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + ` L${width} ${height} Z`;
}

/* ── Dusk Ember Ridge Color Layers (Template Palette) ── */
const EMBER_RIDGES = [
  '#2a100b', // Sky top
  '#4a1910', // Sky horizon
  '#682116', // Distant ridge
  '#8e2b1c', // Mid ridge
  '#b83522', // Near ridge
  '#e0402b', // Valley rim
];

/* ── Interactive Scenarios for Conversational Card ── */
const SCENARIOS = [
  {
    label: 'Zero-Fee Protection',
    alert: 'Upstream provider returned HTTP 504 Gateway Timeout during payload execution.',
    reply:
      'Escrow automatically voided transaction. Caller charged exactly 0.000 USDC. Failure logged to provider reliability index.',
    replyLink: { label: 'See how it works', href: '/demo' },
    voice: 'Why did the transaction cancel? You paid $0.00.',
  },
  {
    label: 'Atomic Settlement',
    alert: 'Autonomous research agent requested 42 EV telematics telemetry records.',
    reply:
      'Service delivered verified 200 OK with payload proof hash in 582ms. 0.010 USDC settled into provider escrow instantly.',
    replyLink: { label: 'Inspect live proof', href: '/live' },
    voice: 'Proof hash verified in 582ms.',
  },
  {
    label: 'Semantic Discovery',
    alert: 'Client requested natural language query: "Find me real-time Avalanche gas predictor".',
    reply:
      'Matched Avalanche Gas Predictor (98% Trust Score). EIP-3009 payment voucher signed offline in 24ms.',
    replyLink: { label: 'Explore catalog', href: '/explore' },
    voice: 'Gasless voucher pre-authorized.',
  },
];

/* ── Logos Marquee ── */
const PROTOCOL_BADGES = [
  { name: 'Avalanche C-Chain', tag: 'Settlement Rail', color: '#CE1A1E' },
  { name: 'x402 Protocol', tag: 'Pay-on-Success', color: '#2DD4BF' },
  { name: 'EIP-3009 Vouchers', tag: 'Gasless Auth', color: '#F5B544' },
  { name: 'ERC-8004 Trust', tag: 'Decentralized SLA', color: '#60A5FA' },
  { name: 'Fastify SSE Pipeline', tag: 'Sub-600ms Stream', color: '#A78BFA' },
  { name: 'MCP 2.0 Standard', tag: 'Native Agent Tools', color: '#F472B6' },
];

/* ── 4-Stage Agent Canvas ── */
const CANVAS_STEPS = [
  {
    num: '01',
    title: 'Semantic Discovery',
    subtitle: 'Vectorized natural-language tool matching with on-chain trust scores.',
    detail:
      'Autonomous agents query natural-language capabilities. Agentra filters across live verified providers on Avalanche C-Chain with cryptographic trust scores.',
  },
  {
    num: '02',
    title: 'Policy & SLA Guardrails',
    subtitle: 'Deterministic execution rules enforced before a single satoshi moves.',
    detail:
      'Set strict max price, maximum allowable latency (e.g. 1500ms), and mandate zero-fee refunds on HTTP 5xx or unverified payload responses.',
  },
  {
    num: '03',
    title: 'Simulation & Protection',
    subtitle: 'Execute payload against live gateways with cryptographic response validation.',
    detail:
      'The gateway challenges with HTTP 402, executes against the provider, and signs the response body SHA-256 hash before releasing escrow.',
  },
  {
    num: '04',
    title: 'Atomic Settlement',
    subtitle: 'EIP-3009 transfer authorization settled directly to provider.',
    detail:
      'Upon verifiable delivery of a 200 OK, the signed voucher executes atomically. If upstream fails or times out, escrow aborts at zero cost.',
  },
];

/* ── Listen-In Call Dialogue Lines ── */
const CALL_DATA = {
  kicker: 'Listen in',
  title: 'Cryptographic proof, every time.\nEven at 2 a.m.',
  text: 'A live agent query, start to finish. The caller signs an offline voucher, receives verified payload proofs, and never pays for dropped packets.',
  topic: 'EV-Telemetry-Stream · inbound',
  meta: ['EIP-712 Voucher Validated', 'Pre-auth Limit: 1.00 USDC'],
  outcome: 'Settled in 582ms · 0.010 USDC transferred · 0 hold time · 200 OK verified',
  lines: [
    {
      who: 'caller',
      text: 'GET /v1/telemetry/ev-fleet?vin=AVAX-7729. Need battery degradation metrics within 1000ms.',
      meta: 'Caller: Autonomous Fleet Agent',
    },
    {
      who: 'agent',
      text: 'HTTP 402 Payment Required. EIP-3009 voucher verified. Forwarding payload through protected escrow pipeline.',
      meta: 'Gateway: Handshake in 18ms',
    },
    {
      who: 'caller',
      text: 'Upstream responded with 200 OK: 42 records received. Hash: 0x9f2a...8c1e. Verify proof validity.',
      meta: 'Caller: 3.4 KB received in 564ms',
    },
    {
      who: 'agent',
      text: 'SHA-256 payload digest confirmed. Settled 0.010 USDC to provider. Zero hold-time. Recorded to ERC-8004 reliability index.',
      meta: 'Gateway: Escrow Released Atomically',
    },
  ],
};

/* ── Testimonials ── */
const QUOTES = [
  {
    quote:
      'Our autonomous research swarms make 40,000 API queries daily. Before Agentra, we lost 14% of budget to flaky gateways and dropped connections. With x402 escrow, we pay strictly for verified responses.',
    name: 'Elena Rostova',
    role: 'Head of Autonomous Systems',
    company: 'Apex Quantitative',
  },
  {
    quote:
      'As a data provider, we love getting paid instantly via EIP-3009 vouchers without billing friction or chargeback risks. Our verified trust score directly drives higher inbound volume.',
    name: 'Marcus Vance',
    role: 'Infrastructure Lead',
    company: 'Avalanche Oracle Labs',
  },
];

export default function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroVistaRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);

  const [activeScenario, setActiveScenario] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const [policies, setPolicies] = useState({
    zeroFee: true,
    eip3009: true,
    erc8004: true,
    sha256Proof: true,
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

  /* ── GSAP ScrollTrigger & Parallax Engine ── */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // 1. Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('[data-line]', {
        yPercent: 115,
        rotate: 2.5,
        duration: 1.3,
        stagger: 0.1,
      })
        .from(
          '.cnl-hero-copy [data-intro]',
          {
            y: 18,
            autoAlpha: 0,
            duration: 1.1,
            stagger: 0.08,
          },
          0.3
        )
        .from(
          '[data-hero-stage]',
          {
            y: 90,
            autoAlpha: 0,
            scale: 0.95,
            duration: 1.5,
          },
          0.35
        );

      // 2. Hero Vista expanding clip on scroll
      const heroVista = heroVistaRef.current;
      if (heroVista) {
        gsap.to(heroVista, {
          '--cnl-in': '0px',
          '--cnl-r': '0px',
          ease: 'none',
          scrollTrigger: {
            start: 0,
            end: () => Math.max(220, heroVista.offsetTop - window.innerHeight * 0.08),
            scrub: 0.6,
          },
        });

        // Chat card parallax drift
        gsap.to('[data-chat]', {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: heroVista,
            start: 'top 40%',
            end: 'bottom top',
            scrub: true,
          },
        });

        // Mouse pointer 3D tilt
        const drift = driftRef.current;
        if (drift) {
          const quickX = gsap.quickTo(drift, 'x', { duration: 1.2, ease: 'power3.out' });
          const quickY = gsap.quickTo(drift, 'y', { duration: 1.2, ease: 'power3.out' });
          const depthElements = Array.from(heroVista.querySelectorAll<HTMLElement>('[data-depth]'));

          const onPointer = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return;
            const rect = heroVista.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;
            quickX(relX * -26);
            quickY(relY * -16);

            depthElements.forEach((el) => {
              const d = Number(el.dataset.depth || 1);
              gsap.to(el, {
                xPercent: relX * d * 3,
                yPercent: relY * d * 4,
                duration: 1,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            });
          };

          heroVista.addEventListener('pointermove', onPointer);
        }
      }

      // 3. Section Vistas Expanding on Scroll
      const vistas = Array.from(root.querySelectorAll<HTMLElement>('.cnl-vista')).filter(
        (v) => !v.classList.contains('cnl-hero-vista')
      );
      vistas.forEach((v) => {
        const isCta = v.classList.contains('cnl-cta-vista');
        gsap.fromTo(
          v,
          {
            clipPath: isCta
              ? 'inset(10% 8% 10% 8% round 36px)'
              : 'inset(6% 4% 6% 4% round 24px)',
          },
          {
            clipPath: 'inset(0% 0% 0% 0% round 14px)',
            ease: 'none',
            scrollTrigger: {
              trigger: v,
              start: 'top 96%',
              end: isCta ? 'top 25%' : 'top 45%',
              scrub: 0.5,
            },
          }
        );
      });

      // 4. Batch element reveals on scroll
      const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
      if (reveals.length > 0) {
        gsap.set(reveals, { autoAlpha: 0, y: 24 });
        ScrollTrigger.batch(reveals, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 1.1,
              ease: 'expo.out',
              stagger: 0.08,
              overwrite: true,
            }),
        });
      }

      // 5. Text word scrub
      const scrubs = Array.from(root.querySelectorAll<HTMLElement>('[data-scrub]'));
      scrubs.forEach((s) => {
        const words = s.querySelectorAll('[data-word]');
        if (words.length > 0) {
          gsap.fromTo(
            words,
            { opacity: 0.15 },
            {
              opacity: 1,
              stagger: 0.1,
              ease: 'none',
              scrollTrigger: {
                trigger: s,
                start: 'top 85%',
                end: 'top 40%',
                scrub: true,
              },
            }
          );
        }
      });
    }, root);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
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
    }, 600);
  };

  const sc = SCENARIOS[activeScenario];

  return (
    <div
      ref={rootRef}
      className="cnl-root"
      data-scheme="dark"
      style={
        {
          '--cnl-bg': '#0c0d0d',
          '--cnl-day': '#0c0d0d',
          '--cnl-night-bg': '#0c0d0d',
          '--cnl-ink': '#f0efeb',
          '--cnl-mute': '#a3a5a0',
          '--cnl-faint': '#5c5f5b',
          '--cnl-line': 'rgba(255, 255, 255, 0.08)',
          '--cnl-soft': '#1b1d1c',
          '--cnl-card': '#151716',
          '--cnl-card-ink': '#f0efeb',
          '--cnl-card-mute': '#a3a5a0',
          '--cnl-card-line': 'rgba(255, 255, 255, 0.08)',
          '--cnl-card-soft': '#202221',
          '--cnl-accent': '#CE1A1E',
          '--cnl-agent': '#D9480F',
          '--cnl-serif': '"Instrument Serif", Georgia, serif',
          '--cnl-sans': '"Inter", ui-sans-serif, system-ui, sans-serif',
          '--cnl-mono': '"JetBrains Mono", Consolas, monospace',
        } as React.CSSProperties
      }
    >
      {/* ── SECTION 1: HERO (Authentic Cairn Editorial Vista) ── */}
      <section className="cnl-hero" data-sec="top">
        <div className="cnl-hero-copy">
          {/* Badge */}
          <Link href="/explore" className="cnl-badge" data-intro="">
            <span className="cnl-badge-dot" aria-hidden="true" />
            <span>NEW: X402 ZERO-FEE ESCROW STANDARD</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          </Link>

          {/* Heading with White & Red emphasis */}
          <h1 className="cnl-title">
            <span className="cnl-line">
              <span className="cnl-line-in text-[#ffffff]">Every autonomous agent call,</span>
            </span>
            <span className="cnl-line">
              <span className="cnl-line-in font-serif italic text-[#CE1A1E]">
                settled on success.
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="cnl-sub text-[#a3a5a0]" data-intro="">
            The programmable payment rail on Avalanche C-Chain. Zero hold times. Pre-authorized
            EIP-3009 vouchers. 100% refunded when upstream providers fail.
          </p>

          {/* Buttons */}
          <div className="cnl-hero-cta" data-intro="">
            <Link
              href="/explore"
              className="cnl-pill is-lg bg-[#CE1A1E] text-white hover:bg-[#a11417]"
              data-magnetic=""
            >
              <span className="cnl-roll" data-t="Explore Verified Services">
                <span>Explore Verified Services</span>
              </span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>

            <Link
              href="/provider/new"
              className="cnl-pill is-lg is-light bg-white text-black"
              data-magnetic=""
            >
              <span className="cnl-roll" data-t="Register as Provider">
                <span>Register as Provider</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Hero Vista Stage */}
        <div className="cnl-hero-stage" data-hero-stage="">
          <div
            ref={heroVistaRef}
            className="cnl-vista cnl-hero-vista relative w-full h-[540px] sm:h-[620px] max-w-[1240px] mx-auto mt-12 overflow-hidden bg-[#100d0b]"
            style={{ '--cnl-in': '24px', '--cnl-r': '14px' } as React.CSSProperties}
          >
            {/* Parallax Mountain Vista (Atmospheric Dusk Ember Layers) */}
            <div className="cnl-vista-media">
              <div ref={driftRef} className="cnl-vista-drift">
                <svg
                  className="cnl-ridges"
                  viewBox="0 0 1600 900"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="emberSky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={EMBER_RIDGES[0]} />
                      <stop offset="70%" stopColor={EMBER_RIDGES[1]} />
                    </linearGradient>
                  </defs>
                  {/* Sky backdrop */}
                  <rect width="1600" height="900" fill="url(#emberSky)" />
                  {/* Algorithmic mountain ridges generated via template seed function */}
                  <path d={generateRidge(3, 470, 70)} fill={EMBER_RIDGES[2]} opacity="0.75" />
                  <path d={generateRidge(11, 560, 80)} fill={EMBER_RIDGES[3]} opacity="0.85" />
                  <path d={generateRidge(23, 660, 70)} fill={EMBER_RIDGES[4]} />
                  <path d={generateRidge(41, 780, 60)} fill={EMBER_RIDGES[5]} />
                </svg>
              </div>
            </div>

            <div className="cnl-vista-shade" aria-hidden="true" />

            {/* Crest Badge */}
            <div className="absolute top-8 left-8 sm:top-10 sm:left-10 z-10 flex items-center gap-3 bg-[#151716]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                <Image src="/logo.png" alt="Agentra" fill className="object-cover" />
              </div>
              <span className="text-[11px] font-mono tracking-wider text-[#f0efeb] uppercase">
                Avalanche Subnet 402
              </span>
            </div>

            {/* Conversational Floating Card (.cnl-chat) */}
            <div className="cnl-chat" data-chat="">
              {/* Scenario Toggles */}
              <div className="cnl-scenes flex flex-wrap gap-2 mb-4" role="group">
                {SCENARIOS.map((s, idx) => (
                  <button
                    key={s.label}
                    type="button"
                    className="cnl-scene"
                    aria-pressed={idx === activeScenario}
                    onClick={() => setActiveScenario(idx)}
                  >
                    <span>{s.label}</span>
                    <i aria-hidden="true" />
                  </button>
                ))}
              </div>

              {/* Alert Message Bubble */}
              <div className="cnl-b cnl-b-alert" data-depth="1.4">
                <span className="cnl-b-dot" aria-hidden="true" />
                <p className="text-[13.5px] leading-relaxed">{sc.alert}</p>
              </div>

              {/* Verified Agent Bubble with Typing indicator and link */}
              <div className="cnl-b cnl-b-agent" data-depth="0.8">
                <div className="cnl-b-in">
                  <span className="cnl-b-dot" aria-hidden="true" />
                  <div>
                    <p className="cnl-b-text text-[13.5px] leading-relaxed text-[#151515]">
                      {sc.reply}
                    </p>
                    <Link href={sc.replyLink.href} className="cnl-b-link text-xs font-semibold">
                      <span>{sc.replyLink.label}</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Live Ticker Indicator */}
              <div className="mt-4 flex items-center gap-2 text-xs font-mono text-[#a3a5a0] bg-[#151716]/80 px-4 py-1.5 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-ping" />
                <span>386 LIVE CALLS PROCESSED TODAY · ZERO CAPITAL LOST</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PROTOCOL LOGOS MARQUEE (Borderless Floating Marquee) ── */}
      <section className="cnl-logos my-12" data-sec="customers" aria-label="Protocols">
        <p className="cnl-logos-label text-center text-xs font-mono tracking-widest text-[#a3a5a0] uppercase mb-6" data-reveal="">
          Powering autonomous agent workloads across decentralized protocols
        </p>
        <div className="cnl-marquee" data-reveal="">
          <ul className="cnl-track flex items-center gap-6">
            {[...PROTOCOL_BADGES, ...PROTOCOL_BADGES, ...PROTOCOL_BADGES, ...PROTOCOL_BADGES].map((p, idx) => (
              <li
                key={idx}
                className="cnl-logo inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1b1d1c]/80 backdrop-blur-md border border-white/5 shadow-md shadow-black/20 text-xs font-mono text-[#f0efeb]"
              >
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: p.color }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}` }}
                  />
                </span>
                <span className="font-semibold text-[#FFFFFF] tracking-wide">{p.name}</span>
                <span className="text-[#837F78] text-[11px]">· {p.tag}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── SECTION 3: THE AGENT CANVAS (Interactive 4-Step Workbench) ── */}
      <section className="cnl-canvas max-w-[1240px] mx-auto px-4 sm:px-8 py-28" data-sec="product">
        <div className="text-center max-w-2xl mx-auto mb-16" data-reveal="">
          <div className="cnl-kicker justify-center mb-3 text-[#CE1A1E]">Agent Workbench</div>
          <h2
            className="text-4xl sm:text-5xl font-serif text-[#ffffff] tracking-tight"
            data-scrub=""
          >
            <span data-word="">The</span> <span data-word="">Agent</span>{' '}
            <span data-word="">Canvas.</span> <span data-word="">Guardrails</span>{' '}
            <span data-word="">on</span> <span data-word="">every</span>{' '}
            <span data-word="">execution.</span>
          </h2>
          <p className="cnl-sec-text mt-4 text-[#a3a5a0] text-base leading-relaxed">
            Four deterministic steps from semantic discovery to atomic zero-loss settlement.
          </p>
        </div>

        {/* Workbench Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Step Selector List (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-3" data-reveal="">
            {CANVAS_STEPS.map((step, idx) => (
              <div
                key={step.num}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.01] ${
                  activeStep === idx
                    ? 'bg-[#1b1d1c] border-[#CE1A1E] shadow-[0_12px_32px_rgba(206,26,30,0.3)]'
                    : 'bg-[#151716]/60 border-white/10 hover:border-white/25 hover:shadow-[0_10px_25px_rgba(0,0,0,0.4)]'
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
                <h3 className="text-lg font-serif text-[#f0efeb] font-medium">{step.title}</h3>
                <p className="text-xs text-[#a3a5a0] mt-1 line-clamp-1">{step.subtitle}</p>
                {activeStep === idx && (
                  <p className="text-xs text-[#e8ebe4] mt-3 pt-3 border-t border-white/10 leading-relaxed">
                    {step.detail}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Simulation Sandbox (Right 7 Cols) */}
          <div
            className="lg:col-span-7 rounded-2xl bg-[#151716] border border-white/10 p-6 sm:p-8 relative overflow-hidden shadow-2xl"
            data-reveal=""
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-[#CE1A1E]" />
                <span className="font-mono text-xs text-[#f0efeb] uppercase font-semibold">
                  Execution Guardrails Sandbox
                </span>
              </div>
              <span className="text-xs font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 px-2.5 py-0.5 rounded-full border border-[#2DD4BF]/30">
                SLA Engine Ready
              </span>
            </div>

            {/* Policy Switches */}
            <div className="space-y-3 mb-6">
              <span className="text-xs font-mono uppercase text-[#a3a5a0] tracking-wider block">
                Active Client Protection Policies
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 text-xs text-[#f0efeb] bg-[#1b1d1c] p-3 rounded-xl border border-white/10 cursor-pointer hover:border-[#CE1A1E]/50">
                  <input
                    type="checkbox"
                    checked={policies.zeroFee}
                    onChange={(e) => setPolicies({ ...policies, zeroFee: e.target.checked })}
                    className="accent-[#CE1A1E] w-4 h-4"
                  />
                  <span>Zero-Fee on 5xx Timeout</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-[#f0efeb] bg-[#1b1d1c] p-3 rounded-xl border border-white/10 cursor-pointer hover:border-[#CE1A1E]/50">
                  <input
                    type="checkbox"
                    checked={policies.eip3009}
                    onChange={(e) => setPolicies({ ...policies, eip3009: e.target.checked })}
                    className="accent-[#CE1A1E] w-4 h-4"
                  />
                  <span>EIP-3009 Gasless Voucher</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-[#f0efeb] bg-[#1b1d1c] p-3 rounded-xl border border-white/10 cursor-pointer hover:border-[#CE1A1E]/50">
                  <input
                    type="checkbox"
                    checked={policies.erc8004}
                    onChange={(e) => setPolicies({ ...policies, erc8004: e.target.checked })}
                    className="accent-[#CE1A1E] w-4 h-4"
                  />
                  <span>ERC-8004 Trust Filter</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-[#f0efeb] bg-[#1b1d1c] p-3 rounded-xl border border-white/10 cursor-pointer hover:border-[#CE1A1E]/50">
                  <input
                    type="checkbox"
                    checked={policies.sha256Proof}
                    onChange={(e) => setPolicies({ ...policies, sha256Proof: e.target.checked })}
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
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#CE1A1E] hover:bg-[#a11417] text-white font-mono text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
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
                <div className="rounded-xl bg-[#0c0d0d] border border-white/10 p-4 font-mono text-[11px] text-[#2DD4BF] overflow-x-auto">
                  <pre>{simOutput}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: LISTEN IN (Cairn Expanding Vista with Trace) ── */}
      <section className="cnl-call max-w-[1240px] mx-auto px-4 sm:px-8 py-28" data-sec="listen-in">
        <div className="cnl-sec-head max-w-2xl mx-auto mb-16 text-center" data-reveal="">
          <div className="cnl-kicker justify-center mb-3 text-[#CE1A1E]">{CALL_DATA.kicker}</div>
          <h2
            className="text-4xl sm:text-5xl font-serif text-[#ffffff] tracking-tight whitespace-pre-line"
            data-scrub=""
          >
            {CALL_DATA.title.split(' ').map((w, i) => (
              <span key={i} data-word="">
                {w}{' '}
              </span>
            ))}
          </h2>
          <p className="cnl-sec-text mt-4 text-[#a3a5a0] text-base leading-relaxed">
            {CALL_DATA.text}
          </p>
        </div>

        {/* Expanding Vista Window (.cnl-vista) with Trace Card */}
        <div className="cnl-vista cnl-call-vista relative max-w-3xl mx-auto rounded-2xl bg-[#151716] border border-white/10 p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#f0efeb]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] animate-pulse" />
              <span>TRACE #AVAX-402-9912</span>
            </div>
            <span className="text-[#a3a5a0]">{CALL_DATA.topic}</span>
          </div>

          {/* Dialogue Stack */}
          <div className="space-y-4">
            {CALL_DATA.lines.map((line, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  line.who === 'caller'
                    ? 'bg-[#1b1d1c] border-white/10'
                    : 'bg-[#202221] border-[#CE1A1E]/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
                  <span
                    className={`font-semibold ${
                      line.who === 'caller' ? 'text-[#f0efeb]' : 'text-[#CE1A1E]'
                    }`}
                  >
                    {line.who === 'caller' ? 'Caller Agent' : 'Agentra Gateway'}
                  </span>
                  <span className="text-[#a3a5a0] text-[11px]">{line.meta}</span>
                </div>
                <p className="text-sm text-[#f0efeb] leading-relaxed">{line.text}</p>
              </div>
            ))}
          </div>

          {/* Outcome Banner */}
          <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 text-xs font-mono text-[#2DD4BF]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{CALL_DATA.outcome}</span>
            </div>
            <span className="hidden sm:inline text-[#a3a5a0]">582ms TOTAL</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: STATS (Typographic Big Numbers) ── */}
      <section className="cnl-stats max-w-[1240px] mx-auto px-4 sm:px-8 py-20 border-t border-white/10">
        <div className="text-center max-w-xl mx-auto mb-12" data-reveal="">
          <div className="cnl-kicker justify-center mb-3 text-[#CE1A1E]">Zero-Waste Metrics</div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#ffffff]">
            The broken API tax, eliminated.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8" data-reveal="">
          <div className="p-6 rounded-2xl bg-[#151716] border border-white/10 text-center transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:border-[#CE1A1E]/50 hover:shadow-[0_16px_36px_-10px_rgba(206,26,30,0.3)] cursor-default">
            <div className="text-4xl sm:text-5xl font-serif text-[#CE1A1E] font-normal mb-1">
              $0.00
            </div>
            <div className="text-xs font-mono uppercase text-[#f0efeb] font-semibold">
              Cost on Failure
            </div>
            <div className="text-[11px] text-[#a3a5a0] mt-1">100% refunded when gateways 5xx</div>
          </div>

          <div className="p-6 rounded-2xl bg-[#151716] border border-white/10 text-center transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:border-[#CE1A1E]/50 hover:shadow-[0_16px_36px_-10px_rgba(206,26,30,0.3)] cursor-default">
            <div className="text-4xl sm:text-5xl font-serif text-[#ffffff] font-normal mb-1">
              99.7%
            </div>
            <div className="text-xs font-mono uppercase text-[#f0efeb] font-semibold">
              Delivery Rate
            </div>
            <div className="text-[11px] text-[#a3a5a0] mt-1">Verified cryptographic proofs</div>
          </div>

          <div className="p-6 rounded-2xl bg-[#151716] border border-white/10 text-center transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:border-[#CE1A1E]/50 hover:shadow-[0_16px_36px_-10px_rgba(206,26,30,0.3)] cursor-default">
            <div className="text-4xl sm:text-5xl font-serif text-[#ffffff] font-normal mb-1">
              {stats?.averageLatencyMs || 680}ms
            </div>
            <div className="text-xs font-mono uppercase text-[#f0efeb] font-semibold">
              Median Latency
            </div>
            <div className="text-[11px] text-[#a3a5a0] mt-1">Direct SSE stream settlement</div>
          </div>

          <div className="p-6 rounded-2xl bg-[#151716] border border-white/10 text-center transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:border-[#CE1A1E]/50 hover:shadow-[0_16px_36px_-10px_rgba(206,26,30,0.3)] cursor-default">
            <div className="text-4xl sm:text-5xl font-serif text-[#2DD4BF] font-normal mb-1">
              {stats?.totalVerifiedCalls ? `${stats.totalVerifiedCalls.toLocaleString()}+` : '12,000+'}
            </div>
            <div className="text-xs font-mono uppercase text-[#f0efeb] font-semibold">
              Calls Settled
            </div>
            <div className="text-[11px] text-[#a3a5a0] mt-1">Recorded on Avalanche C-Chain</div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: TESTIMONIALS (Cairn Quotes Layout) ── */}
      <section className="cnl-quotes max-w-[1240px] mx-auto px-4 sm:px-8 py-20 border-t border-white/10">
        <div className="text-center max-w-xl mx-auto mb-12" data-reveal="">
          <div className="cnl-kicker justify-center mb-3 text-[#CE1A1E]">From the Front Lines</div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#ffffff]">
            Trusted by autonomous operators.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-reveal="">
          {QUOTES.map((q, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#151716] border border-white/10 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-[#CE1A1E]/50 hover:shadow-[0_20px_40px_-12px_rgba(206,26,30,0.35)] cursor-default"
            >
              <p className="text-base font-serif text-[#f0efeb] leading-relaxed italic mb-6">
                &ldquo;{q.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono">
                <div>
                  <div className="text-[#ffffff] font-semibold">{q.name}</div>
                  <div className="text-[#a3a5a0]">
                    {q.role} · {q.company}
                  </div>
                </div>
                <span className="text-[#CE1A1E] bg-[#CE1A1E]/10 px-2 py-1 rounded-md border border-[#CE1A1E]/30">
                  Verified Operator
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 7: FINAL CTA (Cairn CTA with Expanding Vista) ── */}
      <section className="cnl-cta max-w-[1240px] mx-auto px-4 sm:px-8 py-28 text-center" data-sec="cta">
        <div className="cnl-vista cnl-cta-vista rounded-[32px] bg-gradient-to-b from-[#1b1d1c] to-[#151716] border border-white/10 p-12 sm:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#CE1A1E]/20 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6" data-reveal="">
            <div className="cnl-kicker justify-center text-[#CE1A1E]">Start In Minutes</div>
            <h2 className="text-4xl sm:text-6xl font-serif text-[#ffffff] tracking-tight">
              Quiet pipelines. Guaranteed delivery.
            </h2>
            <p className="text-[#a3a5a0] text-base leading-relaxed">
              Integrate with your MCP client or curl in two minutes. Pre-authorized vouchers, atomic
              escrow, zero gas upfront.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/explore"
                className="cnl-pill is-lg bg-[#CE1A1E] text-white hover:bg-[#a11417] px-8 py-4 font-semibold text-sm"
                data-magnetic=""
              >
                <span>Browse Verified Services</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/provider/new"
                className="cnl-pill is-lg bg-[#202221] text-[#f0efeb] border border-white/20 hover:bg-[#1b1d1c] px-8 py-4 text-sm"
                data-magnetic=""
              >
                <span>Register Service Provider</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs font-mono text-[#a3a5a0]">
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
