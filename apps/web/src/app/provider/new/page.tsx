'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { CATEGORIES } from '@/lib/constants';
import { formatUSDC } from '@/lib/utils';
import { createProviderService, verifyProviderEndpoint, confirmPublishService } from '@/lib/api';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function NewServiceWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'analytics',
    description: '',
    tags: 'AI, Analytics, Prediction',
    endpoint: 'https://api.example.com/v1/predict',
    method: 'POST',
    price: 0.015,
    payoutAddress: '0x32A478F59C72E6F22e4Bca3d9c7f6071B8B36F72',
  });

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(true);
    }, 1800);
  };

  const stepsHeader = [
    { num: 1, title: 'Basics' },
    { num: 2, title: 'Endpoint & Pricing' },
    { num: 3, title: 'Review & Publish' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Back button */}
      <Link
        href="/provider/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#E8EBE4] hover:text-[#FFFFFF] mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Provider Dashboard</span>
      </Link>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
          List a New AI Service
        </h1>
        <p className="text-sm text-[#E8EBE4] mt-1">
          Register your endpoint on the Agentra Avalanche registry with x402 pay-on-success protection.
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[rgba(77,82,75,0.40)]">
        {stepsHeader.map((s, idx) => {
          const isCurrent = step === s.num;
          const isCompleted = step > s.num;
          return (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#2DD4BF] text-[#000000]'
                      : isCurrent
                      ? 'bg-[#CE1A1E] text-white shadow-md shadow-[#CE1A1E]/30'
                      : 'bg-[#223330]/60 text-[#837F78] border border-[rgba(77,82,75,0.40)]'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                <span
                  className={`text-xs font-medium uppercase tracking-wider hidden sm:inline ${
                    isCurrent ? 'text-[#FFFFFF]' : 'text-[#837F78]'
                  }`}
                >
                  {s.title}
                </span>
              </div>
              {idx < stepsHeader.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-colors ${
                    step > idx + 1 ? 'bg-[#2DD4BF]' : 'bg-[rgba(77,82,75,0.40)]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Form Container */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#223330]/35 border border-[rgba(77,82,75,0.40)] relative">
        <AnimatePresence mode="wait">
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-lg font-bold text-[#FFFFFF]">Step 1: Service Basics</h2>
                <p className="text-xs text-[#E8EBE4]">
                  Describe what your agent service does so autonomous shoppers can discover it.
                </p>
              </div>

              <Input
                label="Service Name"
                placeholder="e.g. DeFi Liquidity Predictor"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({
                  value: c.id,
                  label: c.label,
                }))}
              />

              <Textarea
                label="Service Description"
                placeholder="Provide details on capabilities, inputs, reliability guarantees..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />

              <Input
                label="Tags (Comma separated)"
                placeholder="e.g. ARIMA, Liquidity, Tokens, Avalanche"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />

              <div className="pt-4 flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.name}
                  variant="primary"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue to Pricing
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: ENDPOINT & PRICING */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-lg font-bold text-[#FFFFFF]">Step 2: Endpoint & Pricing</h2>
                <p className="text-xs text-[#E8EBE4]">
                  Configure your HTTPS endpoint and set your per-call settlement rate in USDC.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <Select
                    label="Method"
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    options={[
                      { value: 'POST', label: 'POST' },
                      { value: 'GET', label: 'GET' },
                    ]}
                  />
                </div>
                <div className="sm:col-span-3">
                  <Input
                    label="Endpoint URL (HTTPS)"
                    placeholder="https://api.yourdomain.com/v1/call"
                    value={formData.endpoint}
                    onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  />
                </div>
              </div>

              {/* Price Slider */}
              <div className="space-y-2 p-4 rounded-xl bg-[#223330]/60 border border-[rgba(77,82,75,0.40)]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider">
                    Price Per Successful Call
                  </label>
                  <span className="font-mono text-base font-bold text-[#2DD4BF]">
                    {formatUSDC(formData.price)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.001"
                  max="0.200"
                  step="0.001"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full accent-[#CE1A1E] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#837F78] font-mono">
                  <span>0.001 USDC (Micropayment)</span>
                  <span>0.200 USDC</span>
                </div>
                <p className="text-[11px] text-[#E8EBE4] pt-1">
                  Agentra deducts a 2.5% protocol escrow fee upon successful settlement.
                </p>
              </div>

              <Input
                label="Avalanche Payout Address"
                value={formData.payoutAddress}
                onChange={(e) => setFormData({ ...formData, payoutAddress: e.target.value })}
                hint="USDC will be automatically routed here upon on-chain receipt validation."
              />

              <div className="pt-4 flex items-center justify-between">
                <Button onClick={() => setStep(1)} variant="outline">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!formData.endpoint}
                  variant="primary"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Review Summary
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: REVIEW & PUBLISH */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-bold text-[#FFFFFF]">Step 3: Review & Publish</h2>
                <p className="text-xs text-[#E8EBE4]">
                  Confirm listing parameters before submitting the on-chain registry transaction.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#081919] border border-[rgba(77,82,75,0.40)] space-y-3 font-mono text-xs">
                <div className="flex justify-between pb-2 border-b border-[rgba(77,82,75,0.40)]">
                  <span className="text-[#837F78]">Service:</span>
                  <span className="text-[#FFFFFF] font-sans font-bold">{formData.name || 'Untitled Service'}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[rgba(77,82,75,0.40)]">
                  <span className="text-[#837F78]">Category:</span>
                  <span className="text-[#CE1A1E] uppercase">{formData.category}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[rgba(77,82,75,0.40)]">
                  <span className="text-[#837F78]">Endpoint:</span>
                  <span className="text-[#FFFFFF] truncate max-w-[200px]">{formData.endpoint}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[rgba(77,82,75,0.40)]">
                  <span className="text-[#837F78]">Settlement Rate:</span>
                  <span className="text-[#2DD4BF] font-bold">{formatUSDC(formData.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#837F78]">Payout:</span>
                  <span className="text-[#FFFFFF] truncate max-w-[200px]">{formData.payoutAddress}</span>
                </div>
              </div>

              {publishSuccess ? (
                <div className="p-5 rounded-xl bg-[#2DD4BF]/10 border border-[#2DD4BF]/30 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-[#2DD4BF] mx-auto" />
                  <h3 className="text-base font-bold text-[#FFFFFF]">
                    Service Successfully Registered On-Chain!
                  </h3>
                  <p className="text-xs text-[#E8EBE4]">
                    Transaction confirmed on Avalanche. Your service is now discoverable in the Agentra marketplace.
                  </p>
                  <Button
                    onClick={() => router.push('/provider/dashboard')}
                    variant="primary"
                    size="sm"
                    className="mt-2"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <div className="pt-4 flex items-center justify-between">
                  <Button onClick={() => setStep(2)} variant="outline" disabled={isPublishing}>
                    Back
                  </Button>
                  <Button
                    onClick={handlePublish}
                    isLoading={isPublishing}
                    variant="primary"
                    rightIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Publish to Avalanche
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


