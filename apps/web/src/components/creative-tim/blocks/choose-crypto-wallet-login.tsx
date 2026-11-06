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

  // 4 Core Wallet Options with Authentic Official Logos
  const WALLET_TILES: WalletOption[] = [
    {
      id: 'metaMask',
      name: 'MetaMask',
      tag: 'Browser & Mobile',
      description: 'Connect via MetaMask extension or mobile dApp browser with full EIP-712 support.',
      popular: true,
      icon: (
        <img
          src="/wallets/metamask.png"
          alt="MetaMask"
          className="w-9 h-9 object-contain"
        />
      ),
    },
    {
      id: 'phantom',
      name: 'Phantom',
      tag: 'Multi-Chain & Avalanche',
      description: 'Connect via Phantom browser extension or mobile app with seamless one-click signing.',
      icon: (
        <img
          src="/wallets/phantom.png"
          alt="Phantom"
          className="w-9 h-9 object-contain rounded-xl"
        />
      ),
    },
    {
      id: 'walletConnect',
      name: 'WalletConnect',
      tag: 'Any Mobile App',
      description: 'Scan QR code using Rainbow, Trust Wallet, Ledger, or 300+ mobile wallets.',
      icon: (
        <img
          src="/wallets/walletconnect.png"
          alt="WalletConnect"
          className="w-9 h-9 object-contain rounded-full"
        />
      ),
    },
    {
      id: 'core',
      name: 'Core Wallet',
      tag: 'Avalanche Native',
      description: 'Official Avalanche ecosystem wallet with zero-latency sub-second finality.',
      icon: (
        <img
          src="/wallets/core.png"
          alt="Core Wallet"
          className="w-9 h-9 object-contain rounded-xl"
        />
      ),
    },
  ];

  const handleWalletSelect = (walletId: string) => {
    // Match connector by ID or name
    const target =
      connectors.find((c) => c.id.toLowerCase().includes(walletId.toLowerCase())) ||
      connectors.find((c) => c.name.toLowerCase().includes(walletId.toLowerCase())) ||
      (walletId === 'phantom'
        ? connectors.find((c) => c.id.toLowerCase().includes('phantom') || c.id.toLowerCase().includes('injected'))
        : null) ||
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
        <Loader2 className="w-8 h-8 animate-spin text-[#CE1A1E]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8" suppressHydrationWarning>
      {/* Title & Introduction */}
      <div className="text-center space-y-3 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#CE1A1E]/50 shadow-lg shadow-[#CE1A1E]/20 bg-[#081919] p-0.5 mb-1">
          <img src="/logo.png" alt="Agentra" className="w-full h-full object-cover rounded-xl" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#223330]/60 border border-[#4D524B]/50 text-xs font-mono text-[#CE1A1E] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#CE1A1E]" />
          <span>Non-Custodial Avalanche Authentication</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F4F6F4] tracking-tight">
          Choose Your Wallet
        </h1>
        <p className="text-sm text-[#E8EBE4]/80 max-w-lg mx-auto">
          Authenticate your client to browse services, configure autonomous spend policies, or monetize your agent endpoints on Avalanche.
        </p>
      </div>

      {/* Connected State Banner */}
      {isConnected && address ? (
        <div className="p-6 rounded-2xl bg-[#223330]/35 border border-[#2DD4BF]/40 space-y-5 shadow-xl shadow-black/40">
          <div className="flex items-center justify-between pb-4 border-b border-[#4D524B]/30">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#2DD4BF] animate-pulse" />
              <div>
                <span className="text-xs font-mono text-[#837F78] uppercase tracking-wider block">
                  Active Wallet Session
                </span>
                <span className="text-sm font-bold text-[#F4F6F4]">
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
            <div className="p-3.5 rounded-xl bg-[#081919] border border-[#4D524B]/40 space-y-1">
              <span className="text-[11px] font-mono text-[#837F78] block uppercase">Address</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-[#F4F6F4] font-semibold">
                  {truncateAddress(address, 6)}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded hover:bg-[#223330] text-[#E8EBE4] hover:text-[#FFFFFF]"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#2DD4BF]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#081919] border border-[#4D524B]/40 space-y-1">
              <span className="text-[11px] font-mono text-[#837F78] block uppercase">Avalanche Balance</span>
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
      <div className="rounded-2xl bg-[#223330]/30 border border-[#4D524B]/40 p-6 sm:p-8 space-y-6 shadow-xl shadow-black/30">
        {/* Search Input Filter */}
        <div className="relative">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search through available wallet providers..."
            leftIcon={<Search className="w-4 h-4 text-[#CE1A1E]" />}
            className="h-11 bg-[#081919] border-[#4D524B]/40 text-sm pl-10"
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
              className="p-5 rounded-2xl bg-[#223330]/50 border border-[#4D524B]/40 hover:border-[#CE1A1E] hover:bg-[#223330]/90 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_16px_32px_-8px_rgba(206,26,30,0.35)] transition-all duration-300 ease-out text-left flex flex-col justify-between space-y-4 group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-start justify-between w-full">
                <div className="p-1.5 rounded-xl bg-[#081919] border border-[#4D524B]/40 group-hover:scale-105 transition-transform flex items-center justify-center w-12 h-12 overflow-hidden shrink-0">
                  {wallet.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  {wallet.popular && (
                    <span className="text-[10px] font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 px-2 py-0.5 rounded-full">
                      POPULAR
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-[#E8EBE4] bg-[#081919] border border-[#4D524B]/40 px-2 py-0.5 rounded-full">
                    {wallet.tag}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#F4F6F4] group-hover:text-[#CE1A1E] transition-colors flex items-center justify-between">
                  <span>{wallet.name}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#CE1A1E]" />
                </h3>
                <p className="text-xs text-[#837F78] mt-1 leading-relaxed">
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
            className="text-xs text-[#CE1A1E] hover:text-[#FFFFFF]"
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
        <div className="pt-4 border-t border-[#4D524B]/30 flex items-center justify-center gap-2 text-xs text-[#837F78] text-center font-mono">
          <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
          <span>Non-custodial. Agentra never has access to your private keys or seed phrase.</span>
        </div>
      </div>
    </div>
  );
}


