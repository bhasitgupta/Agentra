'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatUSDC, truncateTx } from '@/lib/utils';
import { executeGatewayCall } from '@/lib/api';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface DemoStep {
  stepNumber: number;
  title: string;
  log: string;
  resultTitle: string;
  resultContent: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
}

export default function GuidedDemoPage() {
  const [activeScenario, setActiveScenario] = useState<'happy-path' | 'failure-path'>('happy-path');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const happySteps: DemoStep[] = [
    {
      stepNumber: 1,
      title: 'Agent Discovers EV Market Service',
      log: 'GET /v1/registry/search?task=india-ev-registrations → Found: ev-market-data (0.010 USDC, Trust: 91)',
      resultTitle: 'Discovery Match',
      resultContent: 'Agent selects India EV Market Data (0x32A4...6F72). Latency p95: 620ms.',
      status: 'idle',
    },
    {
      stepNumber: 2,
      title: 'Gateway Issues 402 Payment Challenge',
      log: 'POST /v1/services/ev-market-data/call → HTTP 402 Payment Required: x402-nonce=0x88f2, amount=0.010 USDC',
      resultTitle: 'x402 Protocol Gate',
      resultContent: 'Challenge requires EIP-712 payment voucher for 0.010 USDC to Avalanche Escrow.',
      status: 'idle',
    },
    {
      stepNumber: 3,
      title: 'Agent SDK Signs EIP-712 Voucher',
      log: 'wallet.signTypedData({ escrow: 0x5FbDB...aa3, amount: "10000", nonce: 42 }) → sig=0x99a...71c',
      resultTitle: 'Cryptographic Voucher',
      resultContent: 'EIP-712 authorization signed in 4ms without on-chain gas expenditure.',
      status: 'idle',
    },
    {
      stepNumber: 4,
      title: 'Provider Executes & Delivers Data',
      log: 'HTTP 200 OK: 42 RTO records returned. digest_hash=0x4e29b198c62b08fa1',
      resultTitle: 'Payload Verification',
      resultContent: 'Payload digest verified against response schema. Execution latency: 582ms.',
      status: 'idle',
    },
    {
      stepNumber: 5,
      title: 'USDC Settles on Avalanche Fuji C-Chain',
      log: 'Escrow.settle(receipt, sig) → Tx: 0x7b1c3e4a9d821045b4ef081829e1203498acbd12048591820491029481920abc',
      resultTitle: 'Atomic Settlement',
      resultContent: '0.00975 USDC routed to provider, 0.00025 USDC (2.5%) protocol fee deposited.',
      status: 'idle',
    },
    {
      stepNumber: 6,
      title: 'Reputation Oracle Recalibrates',
      log: 'Reputation.recordSuccess(provider, 582ms) → Score: 91 Established (+0.2 delta)',
      resultTitle: 'Proof-of-use Reputation Updated',
      resultContent: 'Verified call incremented to 341. Trust score updated with cryptographic proof.',
      status: 'idle',
    },
  ];

  const failureSteps: DemoStep[] = [
    {
      stepNumber: 1,
      title: 'Agent Calls Flaky Service',
      log: 'POST /v1/services/flaky-translate/call with EIP-712 Voucher (0.005 USDC held in escrow)',
      resultTitle: 'Invocation Begun',
      resultContent: 'Agent attempts translation query on experimental service.',
      status: 'idle',
    },
    {
      stepNumber: 2,
      title: 'Provider Times Out / Returns 504',
      log: 'HTTP 504 Gateway Timeout: Upstream service did not produce verified output within 2500ms deadline',
      resultTitle: 'Execution Failure Detected',
      resultContent: 'Provider failed to return a signed payload digest before timeout.',
      status: 'idle',
    },
    {
      stepNumber: 3,
      title: 'Zero-Charge Guarantee Activated',
      log: 'Escrow.refundAuthorization(nonce=91) → 0.000 USDC debited. Buyer wallet balance untouched.',
      resultTitle: 'Zero Fee Enforced',
      resultContent: 'Buyer is NOT charged a single cent. Escrow authorization expires automatically.',
      status: 'idle',
    },
    {
      stepNumber: 4,
      title: 'Trust Score Penalized On-Chain',
      log: 'Reputation.recordFailure(provider, TIMEOUT) → Score drops from 33 to 31 (Provisional tier)',
      resultTitle: 'Reputation Penalty',
      resultContent: 'Failure recorded on Avalanche reputation oracle to warn future agent shoppers.',
      status: 'idle',
    },
  ];

  const currentSteps = activeScenario === 'happy-path' ? happySteps : failureSteps;

  const startDemo = async () => {
    setIsRunning(true);
    setCurrentStepIndex(0);

    // Trigger real background gateway call to generate real telemetry
    if (activeScenario === 'happy-path') {
      executeGatewayCall('ev-market-data', { state: 'Karnataka', months: 6 }).catch(() => {});
    } else {
      executeGatewayCall('flaky-translate', { text: 'Testing pay on success' }, undefined, true).catch(() => {});
    }

    const runNext = (index: number) => {
      if (index >= currentSteps.length - 1) {
        setIsRunning(false);
        return;
      }
      setTimeout(() => {
        setCurrentStepIndex(index + 1);
        runNext(index + 1);
      }, 1400);
    };

    runNext(0);
  };

  const resetDemo = () => {
    setCurrentStepIndex(-1);
    setIsRunning(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#8B5CF6] uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Protocol Simulation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F1F0FF] tracking-tight">
          Guided Protocol Demo
        </h1>
        <p className="text-sm text-[#9B99C4] mt-1 max-w-2xl">
          Observe how autonomous agents discover endpoints, verify 402 HTTP challenges, sign EIP-712 vouchers, and settle on Avalanche with zero-charge guarantees.
        </p>
      </div>

      {/* Scenario Selector & Action Bar */}
      <div className="p-4 rounded-2xl bg-[#0E0E1A] border border-[#1E1E3A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveScenario('happy-path');
              resetDemo();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeScenario === 'happy-path'
                ? 'bg-[#8B5CF6] text-white shadow-sm'
                : 'bg-[#14142A] text-[#9B99C4] hover:text-[#F1F0FF]'
            }`}
          >
            Scenario A: Successful Call & Settlement
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveScenario('failure-path');
              resetDemo();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeScenario === 'failure-path'
                ? 'bg-[#F87171] text-white shadow-sm'
                : 'bg-[#14142A] text-[#9B99C4] hover:text-[#F1F0FF]'
            }`}
          >
            Scenario B: Flaky Failure (Zero Charge)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={startDemo}
            disabled={isRunning || currentStepIndex >= currentSteps.length - 1}
            variant="primary"
            size="sm"
            leftIcon={<Play className="w-3.5 h-3.5" />}
          >
            {isRunning ? 'Running Demo...' : 'Start Demo'}
          </Button>
          <Button
            onClick={resetDemo}
            disabled={isRunning || currentStepIndex === -1}
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Sequence Timeline */}
      <div className="space-y-4">
        {currentSteps.map((step, idx) => {
          const isReached = currentStepIndex >= idx;
          const isCurrent = currentStepIndex === idx;

          return (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0.4 }}
              animate={{
                opacity: isReached ? 1 : 0.35,
                scale: isCurrent ? 1.01 : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`p-5 rounded-xl border transition-all ${
                isReached
                  ? isCurrent
                    ? 'bg-[#14142A] border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/15'
                    : 'bg-[#0E0E1A] border-[#2D2D52]'
                  : 'bg-[#07070F] border-[#1E1E3A]'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                      isReached
                        ? activeScenario === 'failure-path' && idx >= 1
                          ? 'bg-[#F87171] text-white'
                          : 'bg-[#34D399] text-[#07070F]'
                        : 'bg-[#14142A] text-[#5C5A8A] border border-[#1E1E3A]'
                    }`}
                  >
                    {isReached ? <CheckCircle2 className="w-4 h-4" /> : step.stepNumber}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#F1F0FF]">{step.title}</h3>
                    <span className="text-xs text-[#9B99C4]">{step.resultContent}</span>
                  </div>
                </div>

                {isReached && (
                  <Badge variant={activeScenario === 'failure-path' && idx >= 1 ? 'failure' : 'success'}>
                    {activeScenario === 'failure-path' && idx >= 1 ? 'Zero Charge' : 'Verified'}
                  </Badge>
                )}
              </div>

              {/* Terminal code snippet for step */}
              {isReached && (
                <div className="mt-3 p-3 rounded-lg bg-[#07070F] border border-[#1E1E3A] font-mono text-xs text-[#A78BFA] flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#5C5A8A] shrink-0" />
                  <span className="truncate">{step.log}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {currentStepIndex === currentSteps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl border text-center space-y-3 ${
            activeScenario === 'happy-path'
              ? 'bg-[#34D399]/10 border-[#34D399]/30'
              : 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30'
          }`}
        >
          <div className="inline-flex p-3 rounded-full bg-[#14142A] border border-[#1E1E3A] mb-1">
            {activeScenario === 'happy-path' ? (
              <ShieldCheck className="w-6 h-6 text-[#34D399]" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-[#F87171]" />
            )}
          </div>
          <h3 className="text-lg font-bold text-[#F1F0FF]">
            {activeScenario === 'happy-path'
              ? 'Protocol Lifecycle Successfully Simulated'
              : 'Zero-Charge Guarantee Proven'}
          </h3>
          <p className="text-xs text-[#9B99C4] max-w-lg mx-auto leading-relaxed">
            {activeScenario === 'happy-path'
              ? 'Payment was settled in escrow, verified cryptographic receipts were emitted, and the reputation score updated in real time on Avalanche Fuji.'
              : 'The upstream service failed, but zero USDC was debited from the caller wallet. Proof of failure was logged to prevent future wasted calls.'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
