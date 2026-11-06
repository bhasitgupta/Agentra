'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { ActivityFeed } from '@/components/ui/ActivityFeed';
import { REFERENCE_SERVICES, MOCK_ACTIVITY_FEED } from '@/lib/mockData';
import { fetchStats, fetchRecentActivity, StatsResponse } from '@/lib/api';
import { ActivityEvent } from '@/lib/types';
import {
  ShieldCheck,
  Star,
  Zap,
  ArrowRight,
  Sparkles,
  Layers,
  Lock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function LandingPage() {
  const featuredServices = REFERENCE_SERVICES.slice(0, 3);
  const [stats, setStats] = useState<StatsResponse>({
    totalVerifiedCalls: 813,
    totalVolumeUsdc: '11.05',
    activeServicesCount: 6,
    averageLatencyMs: 680,
    settlementGuarantee: '100% On Avalanche Fuji',
  });
  const [recentEvents, setRecentEvents] = useState<ActivityEvent[]>(MOCK_ACTIVITY_FEED.slice(0, 5));

  useEffect(() => {
    fetchStats().then(setStats);
    fetchRecentActivity().then((evts) => {
      if (evts && evts.length > 0) {
        setRecentEvents(evts.slice(0, 5));
      }
    });
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Provider Lists Service',
      desc: 'Set pricing in USDC per call, define input/output schemas, and connect your payout address on Avalanche.',
    },
    {
      num: '02',
      title: 'Agent Discovers & Calls',
      desc: 'Autonomous agent queries Agentra registry and receives an HTTP 402 Payment Required challenge.',
    },
    {
      num: '03',
      title: 'Receipt Cryptographically Signed',
      desc: 'Service executes. Both parties sign payload digest. Payment is unlocked only on valid 200 OK.',
    },
    {
      num: '04',
      title: 'Atomic Settlement & Score Update',
      desc: 'USDC settles in escrow on Avalanche Fuji. On-chain reputation oracle updates Trust Score in real time.',
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-24 md:pt-32 md:pb-36 hero-gradient-mesh overflow-hidden border-b border-[#1E1E3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14142A]/90 border border-[#2D2D52] text-xs font-mono text-[#A78BFA] mb-8 shadow-sm shadow-[#8B5CF6]/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Next-Gen Autonomous Agent Economy on Avalanche</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F1F0FF] max-w-4xl"
          >
            The Marketplace Where Agents{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#34D399]">
              Pay Only for Results
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-[#9B99C4] max-w-2xl font-normal leading-relaxed"
          >
            Discover AI services. Pay in USDC. Trust what you can verify with cryptographic proof-of-use on Avalanche.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/explore">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Services
              </Button>
            </Link>
            <Link href="/provider/new">
              <Button size="lg" variant="outline">
                List a Service
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="ghost" className="text-[#9B99C4] hover:text-[#F1F0FF]">
                View Demo
              </Button>
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 w-full max-w-3xl py-3 px-6 rounded-2xl bg-[#0E0E1A]/80 border border-[#1E1E3A] flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-[#9B99C4] shadow-lg shadow-black/40"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#34D399]" />
              <strong className="text-[#F1F0FF]">{stats.totalVerifiedCalls}</strong> Verified Calls
            </div>
            <span className="hidden sm:inline text-[#1E1E3A]">|</span>
            <div>
              <strong className="text-[#F1F0FF]">{stats.activeServicesCount}</strong> Reference Services
            </div>
            <span className="hidden sm:inline text-[#1E1E3A]">|</span>
            <div>
              <strong className="text-[#34D399]">${stats.totalVolumeUsdc} USDC</strong> settled
            </div>
            <span className="hidden sm:inline text-[#1E1E3A]">|</span>
            <div className="text-[#A78BFA]">
              <strong className="text-[#F1F0FF]">100%</strong> On Avalanche
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards: Glassmorphism */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[#8B5CF6]/50 shadow-xl shadow-black/30">
            <div className="w-10 h-10 rounded-xl bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center text-[#34D399] mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#F1F0FF]">Pay on Success</h3>
            <p className="mt-2 text-sm text-[#9B99C4] leading-relaxed">
              If an endpoint returns 500, times out, or fails cryptographic validation, zero USDC is debited. Funds never leave escrow on failure.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[#8B5CF6]/50 shadow-xl shadow-black/30">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#A78BFA] mb-4">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#F1F0FF]">Proof-of-use Reputation</h3>
            <p className="mt-2 text-sm text-[#9B99C4] leading-relaxed">
              Trust Scores (0–100) are computed mathematically from verified on-chain receipts, p95 latency samples, and real caller dispute history.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[#8B5CF6]/50 shadow-xl shadow-black/30">
            <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/15 border border-[#FBBF24]/30 flex items-center justify-center text-[#FBBF24] mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#F1F0FF]">Zero-code Monetisation</h3>
            <p className="mt-2 text-sm text-[#9B99C4] leading-relaxed">
              Turn any REST API into an on-chain paid service in minutes. Automatic 402 HTTP challenge handling and instantaneous settlement.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A78BFA] mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Verified Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F1F0FF] tracking-tight">
              Featured AI Agent Services
            </h2>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#A78BFA] hover:text-[#F1F0FF] transition-colors"
          >
            <span>Browse all services</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-[#0E0E1A]/40 border-y border-[#1E1E3A] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono text-[#8B5CF6] uppercase tracking-wider">
              Architecture & Lifecycle
            </span>
            <h2 className="text-3xl font-bold text-[#F1F0FF] mt-2 tracking-tight">
              How Agentra Works
            </h2>
            <p className="text-sm text-[#9B99C4] mt-2">
              A frictionless 4-step cryptographic agreement between buyer agents and service providers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((step, idx) => (
              <div
                key={step.num}
                className="relative flex flex-col p-6 rounded-xl bg-[#0E0E1A] border border-[#1E1E3A] transition-colors hover:border-[#2D2D52]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-[#A78BFA]/40">
                    {step.num}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                </div>
                <h4 className="text-base font-bold text-[#F1F0FF] mb-2">{step.title}</h4>
                <p className="text-xs text-[#9B99C4] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Activity Feed Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#34D399] mb-1">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              <span>Real-Time Stream</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F1F0FF] tracking-tight">
              Live Activity on Avalanche
            </h2>
          </div>
          <Link
            href="/live"
            className="inline-flex items-center gap-1 text-xs font-mono text-[#A78BFA] hover:text-[#F1F0FF]"
          >
            <span>Open live monitor</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ActivityFeed events={recentEvents} />
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
        <div className="relative rounded-2xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-[#14142A] via-[#0E0E1A] to-[#14142A] border border-[#2D2D52] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#F1F0FF]">
              Ready to monetize your AI models?
            </h3>
            <p className="text-sm text-[#9B99C4]">
              List your API in under 5 minutes. Receive USDC directly to your wallet on Avalanche Fuji with instant settlement.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/provider/new">
              <Button size="lg" variant="primary">
                List a Service Now
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                Watch Protocol Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
