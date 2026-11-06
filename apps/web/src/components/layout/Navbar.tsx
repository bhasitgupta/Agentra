'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@/components/web3/ConnectButton';
import { useIsAdmin } from '@/lib/admin';
import { Menu, X, Cpu, Radio, Sparkles, LayoutDashboard, Terminal, Wallet, Shield } from 'lucide-react';

const NAV = [
  { name: 'Explore',  href: '/explore',            icon: Cpu },
  { name: 'Live',     href: '/live',               icon: Radio },
  { name: 'Demo',     href: '/demo',               icon: Sparkles },
  { name: 'Provider', href: '/provider/dashboard', icon: LayoutDashboard },
  { name: 'Console',  href: '/buyer/console',      icon: Terminal },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isAdmin } = useIsAdmin();

  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#4D524B]/35 bg-[#081919]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#CE1A1E]/50 shadow-sm shadow-[#CE1A1E]/30 group-hover:scale-105 transition-transform bg-[#081919]">
            <img src="/logo.png" alt="Agentra" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#F4F6F4]">
            Agentr<span className="text-[#CE1A1E]">a</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                active(link.href)
                  ? 'bg-[#223330] text-[#FFFFFF] border border-[#CE1A1E]/50 shadow-xs'
                  : 'text-[#837F78] hover:text-[#FFFFFF] hover:bg-[#223330]/50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin/audit-logs"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                active('/admin/audit-logs')
                  ? 'bg-[#65060E]/60 text-white border border-[#CE1A1E] shadow-sm shadow-[#CE1A1E]/30'
                  : 'text-[#CE1A1E] hover:text-white hover:bg-[#65060E]/40 border border-[#CE1A1E]/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#CE1A1E]" />
              <span>Audit Logs</span>
            </Link>
          )}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/choose-crypto-wallet-login"
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              pathname === '/choose-crypto-wallet-login'
                ? 'bg-[#65060E]/40 border-[#CE1A1E] text-[#FFFFFF]'
                : 'bg-[#223330]/40 border-[#4D524B]/50 text-[#E8EBE4] hover:border-[#CE1A1E]/60 hover:text-[#FFFFFF]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-[#CE1A1E]" />
            <span>Wallets</span>
          </Link>
          <ConnectButton />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-[#837F78] hover:text-[#FFFFFF] hover:bg-[#223330]/50 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-b border-[#4D524B]/35 bg-[#081919] px-4 pt-2 pb-5 space-y-1">
          {NAV.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active(link.href)
                    ? 'bg-[#223330] text-[#FFFFFF] border border-[#CE1A1E]/50'
                    : 'text-[#837F78] hover:text-[#FFFFFF] hover:bg-[#223330]/40'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin/audit-logs"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium bg-[#65060E]/40 text-[#CE1A1E] border border-[#CE1A1E]/50"
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Admin Audit Logs</span>
            </Link>
          )}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/choose-crypto-wallet-login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#E8EBE4] bg-[#223330]/50 border border-[#4D524B]/50"
            >
              <Wallet className="w-4 h-4 text-[#CE1A1E]" />
              <span>Choose Wallet</span>
            </Link>
            <ConnectButton />
          </div>
        </div>
      )}
    </header>
  );
}
