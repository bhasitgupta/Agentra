'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@/components/web3/ConnectButton';
import { Menu, X, Cpu, Radio, Sparkles, LayoutDashboard, Terminal, Wallet } from 'lucide-react';

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

  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(109,0,26,0.35)] bg-[#000000]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#6D001A]/60 shadow-sm shadow-[#6D001A]/40 group-hover:scale-105 transition-transform bg-[#000000]">
            <img src="/logo.png" alt="Agentra" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#FFFFFF]">
            Agentr<span className="text-[#6D001A]">a</span>
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
                  ? 'bg-[#160B0F] text-[#FFFFFF] border border-[#6D001A]/60 shadow-xs'
                  : 'text-[#D4D4D8] hover:text-[#FFFFFF] hover:bg-[#0C0608]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/choose-crypto-wallet-login"
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              pathname === '/choose-crypto-wallet-login'
                ? 'bg-[#6D001A]/20 border-[#6D001A] text-[#FFFFFF]'
                : 'bg-[#0C0608] border-[rgba(255,255,255,0.12)] text-[#D4D4D8] hover:border-[#6D001A] hover:text-[#FFFFFF]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-[#9E0D2A]" />
            <span>Wallets</span>
          </Link>
          <ConnectButton />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-[#D4D4D8] hover:text-[#FFFFFF] hover:bg-[#0C0608] transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-b border-[rgba(109,0,26,0.35)] bg-[#0C0608] px-4 pt-2 pb-5 space-y-1">
          {NAV.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active(link.href)
                    ? 'bg-[#160B0F] text-[#FFFFFF] border border-[#6D001A]/60'
                    : 'text-[#D4D4D8] hover:text-[#FFFFFF] hover:bg-[#160B0F]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/choose-crypto-wallet-login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#D4D4D8] bg-[#160B0F] border border-[rgba(255,255,255,0.12)]"
            >
              <Wallet className="w-4 h-4 text-[#9E0D2A]" />
              <span>Choose Wallet</span>
            </Link>
            <ConnectButton />
          </div>
        </div>
      )}
    </header>
  );
}
