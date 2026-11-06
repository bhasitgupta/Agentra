'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { avalancheFuji } from 'viem/chains';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { truncateAddress, getSnowtraceAddressUrl } from '@/lib/utils';
import {
  Wallet,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Search,
  ArrowRight,
  LogOut,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface WalletOption {
  id: string;
  name: string;
  tag: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
}

export default function ChooseCryptoWalletLogin() {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { data: balanceData } = useBalance({
    address,
    chainId: avalancheFuji.id,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 4 Core Wallet Options matching Agentra Architecture
  const WALLET_TILES: WalletOption[] = [
    {
      id: 'metaMask',
      name: 'MetaMask',
      tag: 'Browser & Mobile',
      description: 'Connect via extension or mobile browser. Full EIP-712 / EIP-3009 voucher signing.',
      popular: true,
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <path d="M28.08 4L18.44 11.24L20.2 6.84L28.08 4Z" fill="#E2761B" stroke="#E2761B" strokeWidth="0.5"/>
          <path d="M3.92 4L11.72 6.88L13.52 11.24L3.92 4Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
          <path d="M23.96 20.88L21.44 24.84L27.24 26.44L28.92 20.96L23.96 20.88Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
          <path d="M3.08 20.96L4.76 26.44L10.56 24.84L8.04 20.88L3.08 20.96Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
          <path d="M10.28 14.16L8.44 16.92L14.2 17.28L13.96 11.72L10.28 14.16Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
          <path d="M21.72 14.16L18 11.68L17.8 17.28L23.56 16.92L21.72 14.16Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
          <path d="M10.56 24.84L13.88 23.24L11.16 20.8L10.56 24.84Z" fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.5"/>
          <path d="M18.12 23.24L21.44 24.84L20.84 20.8L18.12 23.24Z" fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.5"/>
          <path d="M14.2 17.28L8.44 16.92L11.16 20.8L13.88 23.24L14.2 17.28Z" fill="#233447" stroke="#233447" strokeWidth="0.5"/>
          <path d="M17.8 17.28L18.12 23.24L20.84 20.8L23.56 16.92L17.8 17.28Z" fill="#233447" stroke="#233447" strokeWidth="0.5"/>
          <path d="M18.12 23.24L17.8 17.28H14.2L13.88 23.24L16 27.84L18.12 23.24Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.5"/>
        </svg>
      ),
    },
    {
      id: 'coinbaseWallet',
      name: 'Coinbase Wallet',
      tag: 'Smart Wallet',
      description: 'Sign authorizations with Coinbase Smart Wallet passkeys or browser extension.',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="#0052FF" />
          <path d="M16 9C12.134 9 9 12.134 9 16C9 19.866 12.134 23 16 23C19.866 23 23 19.866 23 16C23 12.134 19.866 9 16 9ZM14 18H18V14H14V18Z" fill="white" />
        </svg>
      ),
    },
    {
      id: 'walletConnect',
      name: 'WalletConnect',
      tag: 'Any Mobile App',
      description: 'Scan QR code using Rainbow, Trust Wallet, Ledger, or 300+ mobile wallets.',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="16" fill="#3B99FC" />
          <path d="M9.5 12.5C13.0899 8.91015 18.9101 8.91015 22.5 12.5L23 13L21.5 14.5L21 14C18.2386 11.2386 13.7614 11.2386 11 14L10.5 14.5L9 13L9.5 12.5ZM25.5 15.5L27 17L21.5 22.5L18.5 19.5L19.5 18.5L21.5 20.5L25.5 15.5ZM6.5 15.5L10.5 20.5L12.5 18.5L13.5 19.5L10.5 22.5L5 17L6.5 15.5Z" fill="white" />
        </svg>
      ),
    },
    {
      id: 'core',
      name: 'Core Wallet',
      tag: 'Avalanche Native',
      description: 'Official Avalanche ecosystem wallet with zero-latency sub-second finality.',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="#E84142" />
          <path d="M16 7L24 21H19.5L16 14.5L12.5 21H8L16 7Z" fill="white" />
        </svg>
      ),
    },
  ];

  const handleWalletSelect = (walletId: string) => {
    // Match connector by ID
    const target =
      connectors.find((c) => c.id.toLowerCase().includes(walletId.toLowerCase())) ||
      connectors.find((c) => c.name.toLowerCase().includes(walletId.toLowerCase())) ||
      connectors[0];

    if (target) {
      connect({ connector: target, chainId: avalancheFuji.id });
    } else if (openConnectModal) {
      openConnectModal();
    }
  };

  const filteredWallets = WALLET_TILES.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#6D001A]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8" suppressHydrationWarning>
      {/* Title & Introduction */}
      <div className="text-center space-y-3 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#6D001A]/50 shadow-lg shadow-[#6D001A]/20 bg-[#000000] p-0.5 mb-1">
          <img src="/logo.png" alt="Agentra" className="w-full h-full object-cover rounded-xl" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#160B0F] border border-[rgba(255,255,255,0.10)] text-xs font-mono text-[#6D001A] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#6D001A]" />
          <span>Non-Custodial Avalanche Authentication</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
          Choose Your Wallet
        </h1>
        <p className="text-sm text-[#D4D4D8] max-w-lg mx-auto">
          Authenticate your client to browse services, configure autonomous spend policies, or monetize your agent endpoints on Avalanche.
        </p>
      </div>

      {/* Connected State Banner */}
      {isConnected && address ? (
        <div className="p-6 rounded-2xl bg-[#0C0608] border border-[#2DD4BF]/40 space-y-5 shadow-xl shadow-black/40">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.10)]">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#2DD4BF] animate-pulse" />
              <div>
                <span className="text-xs font-mono text-[#8E8E93] uppercase tracking-wider block">
                  Active Wallet Session
                </span>
                <span className="text-sm font-bold text-[#FFFFFF]">
                  {activeConnector?.name || 'Injected Wallet'} (Avalanche)
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => disconnect()}
              className="text-[#F87171] hover:text-[#F87171] hover:bg-[#F87171]/10 text-xs"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Disconnect
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.10)] space-y-1">
              <span className="text-[11px] font-mono text-[#8E8E93] block uppercase">Address</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-[#FFFFFF] font-semibold">
                  {truncateAddress(address, 6)}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded hover:bg-[rgba(255,255,255,0.10)] text-[#D4D4D8] hover:text-[#FFFFFF]"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#2DD4BF]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={getSnowtraceAddressUrl(address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded hover:bg-[rgba(255,255,255,0.10)] text-[#D4D4D8] hover:text-[#FFFFFF]"
                    title="View on Snowtrace"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#000000] border border-[rgba(255,255,255,0.10)] space-y-1">
              <span className="text-[11px] font-mono text-[#8E8E93] block uppercase">Testnet Balance</span>
              <span className="font-mono text-sm text-[#2DD4BF] font-bold block">
                {balanceData ? `${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : '0.000 AVAX'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/explore" className="flex-1">
              <Button variant="primary" className="w-full justify-center">
                Explore Agent Services
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/buyer/console" className="flex-1">
              <Button variant="secondary" className="w-full justify-center">
                Manage Spend Policy
              </Button>
            </Link>
          </div>
        </div>
      ) : null}

      {/* Wallet Selector Box */}
      <div className="rounded-2xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)] p-6 sm:p-8 space-y-6 shadow-xl shadow-black/30">
        {/* Search Input Filter */}
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search through available wallet providers..."
            leftIcon={<Search className="w-4 h-4 text-[#6D001A]" />}
            className="h-11 bg-[#000000] border-[rgba(255,255,255,0.10)] text-sm pl-10"
          />
        </div>

        {/* 4 Wallet Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredWallets.map((wallet) => (
            <button
              key={wallet.id}
              type="button"
              onClick={() => handleWalletSelect(wallet.id)}
              disabled={isPending}
              className="p-5 rounded-xl bg-[#160B0F] border border-[rgba(255,255,255,0.10)] hover:border-[#6D001A] hover:bg-[#1A1A30] transition-all text-left flex flex-col justify-between space-y-4 group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-start justify-between w-full">
                <div className="p-2 rounded-xl bg-[#0C0608] border border-[rgba(255,255,255,0.10)] group-hover:scale-105 transition-transform">
                  {wallet.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  {wallet.popular && (
                    <span className="text-[10px] font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 px-2 py-0.5 rounded-full">
                      POPULAR
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-[#D4D4D8] bg-[#000000] border border-[rgba(255,255,255,0.10)] px-2 py-0.5 rounded-full">
                    {wallet.tag}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#FFFFFF] group-hover:text-[#6D001A] transition-colors flex items-center justify-between">
                  <span>{wallet.name}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#6D001A]" />
                </h3>
                <p className="text-xs text-[#D4D4D8] mt-1 leading-relaxed">
                  {wallet.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Open Rainbow Modal Fallback */}
        <div className="pt-2 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={openConnectModal}
            className="text-xs text-[#6D001A] hover:text-[#FFFFFF]"
          >
            Don't see your wallet? Click here to view 300+ additional wallets
          </Button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-[#F87171]/10 border border-[#F87171]/30 flex items-center gap-2.5 text-xs text-[#F87171]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error.message || 'Connection failed. Please unlock your wallet and try again.'}</span>
          </div>
        )}

        {/* Trust & Non-Custodial Footer */}
        <div className="pt-4 border-t border-[rgba(255,255,255,0.10)] flex items-center justify-center gap-2 text-xs text-[#8E8E93] text-center">
          <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
          <span>Non-custodial. Agentra never has access to your private keys or seed phrase.</span>
        </div>
      </div>
    </div>
  );
}


