'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@/components/web3/ConnectButton';
import { Button } from '@/components/ui/Button';
import { Menu, X, Cpu, Radio, Sparkles, LayoutDashboard, Terminal, Wallet } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Explore', href: '/explore', icon: Cpu },
    { name: 'Live Feed', href: '/live', icon: Radio },
    { name: 'Demo', href: '/demo', icon: Sparkles },
    { name: 'Provider', href: '/provider/dashboard', icon: LayoutDashboard },
    { name: 'Buyer Console', href: '/buyer/console', icon: Terminal },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E1E3A] bg-[#07070F]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Network */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group focus:outline-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#2E1065] flex items-center justify-center border border-[#A78BFA]/40 shadow-sm shadow-[#8B5CF6]/30 group-hover:scale-105 transition-transform">
              <span className="font-mono font-bold text-base text-white">A</span>
            </div>
            <div className="flex items-baseline">
              <span className="font-bold text-xl tracking-tight text-[#F1F0FF]">
                Agentr<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6]">a</span>
              </span>
            </div>
          </Link>

          {/* Network indicator badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#14142A] border border-[#1E1E3A] text-[11px] font-mono text-[#9B99C4]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E84142] animate-pulse" />
            <span>Avalanche Fuji</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[#14142A] text-[#F1F0FF] border border-[#2D2D52]'
                    : 'text-[#9B99C4] hover:text-[#F1F0FF] hover:bg-[#0E0E1A]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Wallet Connect */}
        <div className="flex items-center gap-3">
          <Link
            href="/choose-crypto-wallet-login"
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              pathname === '/choose-crypto-wallet-login'
                ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] text-[#A78BFA]'
                : 'bg-[#14142A] border-[#2D2D52] text-[#F1F0FF] hover:border-[#8B5CF6] hover:text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Wallets</span>
          </Link>
          <ConnectButton />

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#9B99C4] hover:text-[#F1F0FF] hover:bg-[#14142A] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1E1E3A] bg-[#0E0E1A] px-4 pt-2 pb-6 space-y-1 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-1.5 px-3 py-2 mb-2 rounded-md bg-[#14142A] border border-[#1E1E3A] text-xs font-mono text-[#9B99C4]">
            <span className="w-2 h-2 rounded-full bg-[#E84142]" />
            <span>Network: Avalanche Fuji Testnet (43113)</span>
          </div>
          <Link
            href="/choose-crypto-wallet-login"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/choose-crypto-wallet-login'
                ? 'bg-[#14142A] text-[#8B5CF6] border border-[#2D2D52]'
                : 'text-[#9B99C4] hover:text-[#F1F0FF] hover:bg-[#14142A]'
            }`}
          >
            <Wallet className="w-4 h-4 text-[#8B5CF6]" />
            <span>Choose Wallet</span>
          </Link>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#14142A] text-[#8B5CF6] border border-[#2D2D52]'
                    : 'text-[#9B99C4] hover:text-[#F1F0FF] hover:bg-[#14142A]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#5C5A8A]" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
