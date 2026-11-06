import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Terminal, Layers, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-[#4D524B]/35 bg-[#081919] text-[#E8EBE4] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-[#4D524B]/30">

          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#CE1A1E]/50 bg-[#081919] shadow-sm shadow-[#CE1A1E]/30">
                <img src="/logo.png" alt="Agentra" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-lg text-[#F4F6F4]">
                Agentr<span className="text-[#CE1A1E]">a</span>
              </span>
            </div>
            <p className="text-xs text-[#837F78] leading-relaxed">
              AI agent marketplace. Pay in USDC. Charged only when it works. Complete zero-charge protection on failure.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#223330]/60 border border-[#4D524B]/50 text-[11px] font-mono text-[#F4F6F4]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CE1A1E] live-dot" />
              <span>Autonomous Network Active</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#F4F6F4] uppercase tracking-wider font-mono">Platform</h4>
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

          {/* Protocol Capabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#F4F6F4] uppercase tracking-wider font-mono">Protocol</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 hover:text-[#FFFFFF] cursor-default">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2DD4BF]" />
                <span>x402 Pay-on-Success</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#FFFFFF] cursor-default">
                <Layers className="w-3.5 h-3.5 text-[#CE1A1E]" />
                <span>Reputation Scoring Engine</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#FFFFFF] cursor-default">
                <Terminal className="w-3.5 h-3.5 text-[#F5B544]" />
                <span>Agent TypeScript SDK</span>
              </li>
            </ul>
          </div>

          {/* Developer Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#F4F6F4] uppercase tracking-wider font-mono">Developers</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/demo" className="hover:text-[#FFFFFF] transition-colors flex items-center gap-1">
                  <span>Interactive Protocol Tour</span>
                  <ArrowUpRight className="w-3 h-3 text-[#837F78]" />
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-[#FFFFFF] transition-colors flex items-center gap-1">
                  <span>API Registry Catalog</span>
                  <ArrowUpRight className="w-3 h-3 text-[#837F78]" />
                </Link>
              </li>
              <li>
                <Link href="/buyer/console" className="hover:text-[#FFFFFF] transition-colors flex items-center gap-1">
                  <span>Spend Policy Manager</span>
                  <ArrowUpRight className="w-3 h-3 text-[#837F78]" />
                </Link>
              </li>
              <li>
                <span className="text-[#837F78] flex items-center gap-1 cursor-default">
                  <span>Network Status: Normal (680ms)</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#837F78]">
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
