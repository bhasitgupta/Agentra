import React from 'react';
import Link from 'next/link';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import { WalletAddress } from '@/components/web3/WalletAddress';
import { ShieldCheck, Terminal, Layers } from 'lucide-react';

export function Footer() {
  const contracts = [
    { name: 'Escrow',    address: CONTRACT_ADDRESSES.FUJI.ESCROW },
    { name: 'Registry',  address: CONTRACT_ADDRESSES.FUJI.REGISTRY },
    { name: 'Splitter',  address: CONTRACT_ADDRESSES.FUJI.SPLITTER },
    { name: 'USDC',      address: CONTRACT_ADDRESSES.FUJI.USDC },
  ];

  return (
    <footer className="w-full border-t border-[rgba(109,0,26,0.30)] bg-[#000000] text-[#D4D4D8] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-[rgba(109,0,26,0.20)]">

          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#6D001A]/60 bg-[#000000] shadow-sm shadow-[#6D001A]/30">
                <img src="/logo.png" alt="Agentra" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-lg text-[#FFFFFF]">
                Agentr<span className="text-[#6D001A]">a</span>
              </span>
            </div>
            <p className="text-xs text-[#8E8E93] leading-relaxed">
              AI agent marketplace. Pay in USDC. Charged only when it works. Trust what you can verify on-chain.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0C0608] border border-[#6D001A]/40 text-[11px] font-mono text-[#FFFFFF]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6D001A] live-dot" />
              <span>Built on Avalanche</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Explore Services', href: '/explore' },
                { label: 'Live Economy Feed', href: '/live' },
                { label: 'Interactive Demo', href: '/demo' },
                { label: 'List a Service', href: '/provider/new' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-[#FFFFFF] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Protocol */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider">Protocol</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 hover:text-[#FFFFFF] cursor-default">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span>x402 Pay-on-Success</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#FFFFFF] cursor-default">
                <Layers className="w-3.5 h-3.5 text-[#6D001A]" />
                <span>ERC-8004 Agent Trust</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#FFFFFF] cursor-default">
                <Terminal className="w-3.5 h-3.5 text-[#F5B544]" />
                <span>Agent TypeScript SDK</span>
              </li>
            </ul>
          </div>

          {/* Contracts */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider">Contracts</h4>
            <div className="space-y-2">
              {contracts.map((c) => (
                <div key={c.name} className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-[#8E8E93]">{c.name}:</span>
                  <WalletAddress address={c.address} chars={4} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8E93]">
          <p>© 2026 Agentra. Zero-charge guarantee on failed execution.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#FFFFFF] cursor-pointer">Security</span>
            <span className="hover:text-[#FFFFFF] cursor-pointer">Terms</span>
            <span className="hover:text-[#FFFFFF] cursor-pointer">Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
