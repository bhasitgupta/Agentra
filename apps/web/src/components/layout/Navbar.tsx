'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@/components/web3/ConnectButton';
import { Menu, X, Cpu, Radio, Sparkles, LayoutDashboard, Terminal } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(131,127,120,0.22)] bg-[#081919]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#CE1A1E]/40 shadow-sm shadow-[#CE1A1E]/30 group-hover:scale-105 transition-transform bg-[#081919]">
            <img src="/logo.png" alt="Agentra" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#E8EBE4]">
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
                  ? 'bg-[#223330] text-[#E8EBE4] border border-[rgba(131,127,120,0.32)]'
                  : 'text-[#A8ADA6] hover:text-[#E8EBE4] hover:bg-[#223330]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ConnectButton />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-[#A8ADA6] hover:text-[#E8EBE4] hover:bg-[#223330] transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-b border-[rgba(131,127,120,0.22)] bg-[#0d2220] px-4 pt-2 pb-5 space-y-1">
          {NAV.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active(link.href)
                    ? 'bg-[#223330] text-[#CE1A1E] border border-[rgba(131,127,120,0.28)]'
                    : 'text-[#A8ADA6] hover:text-[#E8EBE4] hover:bg-[#223330]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <ConnectButton />
          </div>
        </div>
      )}
    </header>
  );
}
