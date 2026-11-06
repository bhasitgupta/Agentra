import React from 'react';
import Link from 'next/link';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import { WalletAddress } from '@/components/web3/WalletAddress';
import { ShieldCheck, Terminal, Layers } from 'lucide-react';

export function Footer() {
  const contracts = [
    { name: 'Escrow', address: CONTRACT_ADDRESSES.FUJI.ESCROW },
    { name: 'Registry', address: CONTRACT_ADDRESSES.FUJI.REGISTRY },
    { name: 'Splitter', address: CONTRACT_ADDRESSES.FUJI.SPLITTER },
    { name: 'USDC (Fuji)', address: CONTRACT_ADDRESSES.FUJI.USDC },
  ];

  return (
    <footer className="w-full border-t border-[#1E1E3A] bg-[#07070F] text-[#9B99C4] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-[#1E1E3A]">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#2E1065] flex items-center justify-center border border-[#A78BFA]/40">
                <span className="font-mono font-bold text-sm text-white">A</span>
              </div>
              <span className="font-bold text-lg text-[#F1F0FF]">
                Agentr<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6]">a</span>
              </span>
            </div>
            <p className="text-xs text-[#9B99C4] leading-relaxed">
              The marketplace where AI agents pay only for results. Trust what you can verify on Avalanche.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#14142A] border border-[#1E1E3A] text-[11px] font-mono text-[#F1F0FF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E84142]" />
              <span>Built on Avalanche Fuji</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#F1F0FF] uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explore" className="hover:text-[#F1F0FF] transition-colors">
                  Explore Services
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-[#F1F0FF] transition-colors">
                  Live Economy Feed
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-[#F1F0FF] transition-colors">
                  Interactive Demo
                </Link>
              </li>
              <li>
                <Link href="/provider/new" className="hover:text-[#F1F0FF] transition-colors">
                  List a Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers & Docs */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#F1F0FF] uppercase tracking-wider">
              Protocol Specs
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 hover:text-[#F1F0FF]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
                <span>x402 Pay-on-Success</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#F1F0FF]">
                <Layers className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>ERC-8004 Agent Trust</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#F1F0FF]">
                <Terminal className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>Agent TypeScript SDK</span>
              </li>
            </ul>
          </div>

          {/* On-Chain Verified Contracts */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#F1F0FF] uppercase tracking-wider">
              Avalanche Contracts
            </h4>
            <div className="space-y-2">
              {contracts.map((c) => (
                <div key={c.name} className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-[#5C5A8A]">{c.name}:</span>
                  <WalletAddress address={c.address} chars={4} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C5A8A]">
          <p>© 2026 Agentra. All rights reserved. Zero-charge guarantee on failed execution.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#9B99C4] cursor-pointer">Security Audit</span>
            <span className="hover:text-[#9B99C4] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#9B99C4] cursor-pointer">Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
